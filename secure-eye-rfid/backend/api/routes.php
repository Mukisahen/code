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
        $id ? update($db, $user, (int) $id) : Response::error('Route id required', 422);
        break;
    case 'DELETE':
        $user = Auth::requireRole(['admin']);
        $id ? remove($db, $user, (int) $id) : Response::error('Route id required', 422);
        break;
    default:
        Response::error('Method not allowed', 405);
}

function getList(PDO $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT id, name, schedule_time, vehicle_id FROM routes WHERE school_id = ? ORDER BY name'
    );
    $stmt->execute([$user['school_id']]);
    Response::json($stmt->fetchAll());
}

function getOne(PDO $db, array $user, int $id): void
{
    $stmt = $db->prepare('SELECT * FROM routes WHERE id = ? AND school_id = ?');
    $stmt->execute([$id, $user['school_id']]);
    $route = $stmt->fetch();
    if (!$route) {
        Response::error('Route not found', 404);
    }

    $stopsStmt = $db->prepare(
        'SELECT stop_name, sequence_no, lat, lng FROM route_stops WHERE route_id = ? ORDER BY sequence_no'
    );
    $stopsStmt->execute([$id]);
    $route['stops'] = $stopsStmt->fetchAll();

    Response::json($route);
}

function create(PDO $db, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($input['name'] ?? '');
    $scheduleTime = $input['schedule_time'] ?? null;
    $vehicleId = $input['vehicle_id'] ?? null;

    if ($name === '') {
        Response::error('name is required', 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO routes (school_id, name, schedule_time, vehicle_id) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$user['school_id'], $name, $scheduleTime, $vehicleId]);
    $id = (int) $db->lastInsertId();

    Audit::log($db, $user['sub'], 'route_created', "id=$id");
    Response::json(['id' => $id], 201);
}

function update(PDO $db, array $user, int $id): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($input['name'] ?? '');
    $scheduleTime = $input['schedule_time'] ?? null;
    $vehicleId = $input['vehicle_id'] ?? null;

    if ($name === '') {
        Response::error('name is required', 422);
    }

    $stmt = $db->prepare(
        'UPDATE routes SET name = ?, schedule_time = ?, vehicle_id = ? WHERE id = ? AND school_id = ?'
    );
    $stmt->execute([$name, $scheduleTime, $vehicleId, $id, $user['school_id']]);

    Audit::log($db, $user['sub'], 'route_updated', "id=$id");
    Response::json(['status' => 'updated']);
}

function remove(PDO $db, array $user, int $id): void
{
    $stmt = $db->prepare('DELETE FROM routes WHERE id = ? AND school_id = ?');
    $stmt->execute([$id, $user['school_id']]);

    Audit::log($db, $user['sub'], 'route_deleted', "id=$id");
    Response::json(['status' => 'deleted']);
}
