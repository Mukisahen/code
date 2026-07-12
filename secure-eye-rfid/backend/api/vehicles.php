<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Audit.php';

$db = db();
$method = $_SERVER['REQUEST_METHOD'];
$segments = $GLOBALS['routeSegments'];
$id = $segments[0] ?? null;
$action = $segments[1] ?? null;

switch (true) {
    case $method === 'GET' && $id === null:
        $user = Auth::requireUser();
        getList($db, $user);
        break;
    case $method === 'GET' && $id !== null:
        $user = Auth::requireUser();
        getOne($db, $user, (int) $id);
        break;
    case $method === 'POST' && $id === null:
        $user = Auth::requireRole(['admin', 'coordinator']);
        create($db, $user);
        break;
    case $method === 'POST' && $action === 'ping':
        $user = Auth::requireRole(['driver']);
        ping($db, $user, (int) $id);
        break;
    case $method === 'PUT' && $id !== null:
        $user = Auth::requireRole(['admin', 'coordinator']);
        update($db, $user, (int) $id);
        break;
    case $method === 'DELETE' && $id !== null:
        $user = Auth::requireRole(['admin']);
        remove($db, $user, (int) $id);
        break;
    default:
        Response::error('Not found', 404);
}

function getList(mysqli $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT id, plate_number, capacity, driver_id, gps_device_id, last_lat, last_lng, last_ping_at
         FROM vehicles WHERE school_id = ? ORDER BY plate_number'
    );
    $stmt->bind_param('i', $user['school_id']);
    $stmt->execute();
    Response::json($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
}

function getOne(mysqli $db, array $user, int $id): void
{
    $stmt = $db->prepare('SELECT * FROM vehicles WHERE id = ? AND school_id = ?');
    $stmt->bind_param('ii', $id, $user['school_id']);
    $stmt->execute();
    $vehicle = $stmt->get_result()->fetch_assoc();
    $vehicle ? Response::json($vehicle) : Response::error('Vehicle not found', 404);
}

function create(mysqli $db, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $plateNumber = trim($input['plate_number'] ?? '');
    $capacity = (int) ($input['capacity'] ?? 30);
    $driverId = $input['driver_id'] ?? null;
    $gpsDeviceId = trim($input['gps_device_id'] ?? '');

    if ($plateNumber === '') {
        Response::error('plate_number is required', 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO vehicles (school_id, plate_number, capacity, driver_id, gps_device_id) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('isiis', $user['school_id'], $plateNumber, $capacity, $driverId, $gpsDeviceId);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'vehicle_created', "id={$stmt->insert_id}");
    Response::json(['id' => $stmt->insert_id], 201);
}

function update(mysqli $db, array $user, int $id): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $plateNumber = trim($input['plate_number'] ?? '');
    $capacity = (int) ($input['capacity'] ?? 30);
    $driverId = $input['driver_id'] ?? null;

    if ($plateNumber === '') {
        Response::error('plate_number is required', 422);
    }

    $stmt = $db->prepare(
        'UPDATE vehicles SET plate_number = ?, capacity = ?, driver_id = ? WHERE id = ? AND school_id = ?'
    );
    $stmt->bind_param('siiii', $plateNumber, $capacity, $driverId, $id, $user['school_id']);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'vehicle_updated', "id=$id");
    Response::json(['status' => 'updated']);
}

function remove(mysqli $db, array $user, int $id): void
{
    $stmt = $db->prepare('DELETE FROM vehicles WHERE id = ? AND school_id = ?');
    $stmt->bind_param('ii', $id, $user['school_id']);
    $stmt->execute();

    Audit::log($db, $user['sub'], 'vehicle_deleted', "id=$id");
    Response::json(['status' => 'deleted']);
}

/** Vehicle GPS broadcast — driver's device pings this every ~30 seconds. */
function ping(mysqli $db, array $user, int $id): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $lat = $input['lat'] ?? null;
    $lng = $input['lng'] ?? null;

    if ($lat === null || $lng === null) {
        Response::error('lat and lng are required', 422);
    }

    $stmt = $db->prepare(
        'UPDATE vehicles v JOIN drivers d ON d.id = v.driver_id
         SET v.last_lat = ?, v.last_lng = ?, v.last_ping_at = NOW()
         WHERE v.id = ? AND d.user_id = ?'
    );
    $stmt->bind_param('ddii', $lat, $lng, $id, $user['sub']);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        Response::error('Vehicle not found or not assigned to this driver', 403);
    }

    Response::json(['status' => 'ok']);
}
