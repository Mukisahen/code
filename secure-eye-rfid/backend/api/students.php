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

function getList(PDO $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT s.id, s.rfid_card_uid, s.full_name, s.class, s.route_id, s.parent_id, s.is_active
         FROM students s WHERE s.school_id = ? ORDER BY s.full_name'
    );
    $stmt->execute([$user['school_id']]);
    Response::json($stmt->fetchAll());
}

function getOne(PDO $db, array $user, int $id): void
{
    $stmt = $db->prepare('SELECT * FROM students WHERE id = ? AND school_id = ?');
    $stmt->execute([$id, $user['school_id']]);
    $student = $stmt->fetch();
    $student ? Response::json($student) : Response::error('Student not found', 404);
}

function create(PDO $db, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $rfidCardUid = trim($input['rfid_card_uid'] ?? '');
    $fullName = trim($input['full_name'] ?? '');
    $class = trim($input['class'] ?? '');
    $routeId = $input['route_id'] ?? null;
    $parentId = $input['parent_id'] ?? null;

    if ($rfidCardUid === '' || $fullName === '' || $class === '') {
        Response::error('rfid_card_uid, full_name and class are required', 422);
    }

    // FR03: assigning a card already in use is rejected with a clear conflict
    // rather than a raw DB constraint error (duplicate-card detection).
    $dupe = $db->prepare('SELECT id FROM students WHERE rfid_card_uid = ? AND school_id = ?');
    $dupe->execute([$rfidCardUid, $user['school_id']]);
    if ($dupe->fetch()) {
        Response::error('This RFID card is already assigned to another student', 409);
    }

    $stmt = $db->prepare(
        'INSERT INTO students (school_id, rfid_card_uid, full_name, class, route_id, parent_id)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$user['school_id'], $rfidCardUid, $fullName, $class, $routeId, $parentId]);
    $id = (int) $db->lastInsertId();

    Audit::log($db, $user['sub'], 'student_created', "id=$id");
    Response::json(['id' => $id], 201);
}

function update(PDO $db, array $user, int $id): void
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
    $stmt->execute([$fullName, $class, $routeId, $parentId, $isActive, $id, $user['school_id']]);

    Audit::log($db, $user['sub'], 'student_updated', "id=$id");
    Response::json(['status' => 'updated']);
}

function remove(PDO $db, array $user, int $id): void
{
    $stmt = $db->prepare('DELETE FROM students WHERE id = ? AND school_id = ?');
    $stmt->execute([$id, $user['school_id']]);

    Audit::log($db, $user['sub'], 'student_deleted', "id=$id");
    Response::json(['status' => 'deleted']);
}
