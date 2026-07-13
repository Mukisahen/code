<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';

$db = db();
$method = $_SERVER['REQUEST_METHOD'];
$segments = $GLOBALS['routeSegments'];
$scope = $segments[0] ?? null;   // "vehicle" | "student"
$id = $segments[1] ?? null;

if ($method !== 'GET') {
    Response::error('Method not allowed', 405);
}

$user = Auth::requireUser();

if ($scope === 'vehicle' && $id !== null) {
    vehicleLocation($db, $user, (int) $id);
} elseif ($scope === 'student' && $id !== null) {
    studentHistory($db, $user, (int) $id);
} else {
    Response::error('Use /tracking/vehicle/{id} or /tracking/student/{id}', 404);
}

function vehicleLocation(PDO $db, array $user, int $vehicleId): void
{
    $stmt = $db->prepare(
        'SELECT id, plate_number, last_lat, last_lng, last_ping_at FROM vehicles WHERE id = ? AND school_id = ?'
    );
    $stmt->execute([$vehicleId, $user['school_id']]);
    $vehicle = $stmt->fetch();
    $vehicle ? Response::json($vehicle) : Response::error('Vehicle not found', 404);
}

function studentHistory(PDO $db, array $user, int $studentId): void
{
    // Parents may only view their own child's history.
    if ($user['role'] === 'parent') {
        $check = $db->prepare(
            'SELECT s.id FROM students s JOIN parents p ON p.id = s.parent_id
             WHERE s.id = ? AND p.user_id = ?'
        );
        $check->execute([$studentId, $user['sub']]);
        if (!$check->fetch()) {
            Response::error('Forbidden', 403);
        }
    }

    $stmt = $db->prepare(
        'SELECT te.id, te.event_type, te.lat, te.lng, te.event_time,
                v.id AS vehicle_id, v.plate_number, v.last_lat, v.last_lng, v.last_ping_at
         FROM tracking_events te JOIN vehicles v ON v.id = te.vehicle_id
         WHERE te.student_id = ? ORDER BY te.event_time DESC LIMIT 100'
    );
    $stmt->execute([$studentId]);
    Response::json($stmt->fetchAll());
}
