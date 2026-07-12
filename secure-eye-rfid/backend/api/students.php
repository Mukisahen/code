<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Audit.php';

$db = db();
$method = $_SERVER['REQUEST_METHOD'];
$id = $GLOBALS['routeSegments'][0] ?? null;

switch ($method) {
    case 'GET':
        $user = Auth::requireUser();
        $id ? getOne($db, $user, (int) $id) : getList($db, $user);
        break;
    case 'POST':
        $user = Auth::requireRole(['admin', 'coordinator']);
        create($db, $user);
        break;
    case 'PUT':
        $user = Auth::requireRole(['admin', 'coordinator']);
        $id ? update($db, $user, (int) $id) : Response::error('Student id required', 422);
        break;
    case 'DELETE':
        $user = Auth::requireRole(['admin']);
        $id ? remove($db, $user, (int) $id) : Response::error('Student id required', 422);
        break;
    default:
        Response::error('Method not allowed', 405);
}

function getList(mysqli $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT s.id, s.rfid_uid, s.full_name, s.class, s.route_id, s.parent_id, s.is_active
         FROM students s WHERE s.school_id = ? ORDER BY s.full_name'
    );
    $stmt->bind_param('i', $user['school_id']);
    $stmt->execute();
    Response::json($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
}

function getOne(mysqli $db, array $user, int $id): void
{
    $stmt = $db->prepare('SELECT * FROM students WHERE id = ? AND school_id = ?');
    $stmt->bind_param('ii', $id, $user['school_id']);
    $stmt->execute();
    $student = $stmt->get_result()->fetch_assoc();
    $student ? Response::json($student) : Response::error('Student not found', 404);
}

function create(mysqli $db, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $rfidUid = trim($input['rfid_uid'] ?? '');
    $fullName = trim($input['full_name'] ?? '');
    $class = trim($input['class'] ?? '');
    $routeId = $input['route_id'] ?? null;
    $parentId = $input['parent_id'] ?? null;

    if ($rfidUid === '' || $fullName === '' || $class === '') {
        Response::error('rfid_uid, full_name and class are required', 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO students (school_id, rfid_uid, full_name, class, route_id, parent_id)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('isssii', $user['school_id'], $rfidUid, $fullName, $class, $routeId, $parentId);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'student_created', "id={$stmt->insert_id}");
    Response::json(['id' => $stmt->insert_id], 201);
}

function update(mysqli $db, array $user, int $id): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $fullName = trim($input['full_name'] ?? '');
    $class = trim($input['class'] ?? '');
    $routeId = $input['route_id'] ?? null;
    $parentId = $input['parent_id'] ?? null;
    $isActive = isset($input['is_active']) ? (int) (bool) $input['is_active'] : 1;

    if ($fullName === '' || $class === '') {
        Response::error('full_name and class are required', 422);
    }

    $stmt = $db->prepare(
        'UPDATE students SET full_name = ?, class = ?, route_id = ?, parent_id = ?, is_active = ?
         WHERE id = ? AND school_id = ?'
    );
    $stmt->bind_param('ssiiiii', $fullName, $class, $routeId, $parentId, $isActive, $id, $user['school_id']);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'student_updated', "id=$id");
    Response::json(['status' => 'updated']);
}

function remove(mysqli $db, array $user, int $id): void
{
    $stmt = $db->prepare('DELETE FROM students WHERE id = ? AND school_id = ?');
    $stmt->bind_param('ii', $id, $user['school_id']);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'student_deleted', "id=$id");
    Response::json(['status' => 'deleted']);
}
