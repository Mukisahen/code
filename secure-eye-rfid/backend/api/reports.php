<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';

$db = db();
$method = $_SERVER['REQUEST_METHOD'];
$report = $GLOBALS['routeSegments'][0] ?? null;

if ($method !== 'GET') {
    Response::error('Method not allowed', 405);
}

$user = Auth::requireRole(['admin', 'coordinator']);

if ($report === 'attendance') {
    attendance($db, $user);
} elseif ($report === 'fleet-utilisation') {
    fleetUtilisation($db, $user);
} else {
    Response::error('Use /reports/attendance or /reports/fleet-utilisation', 404);
}

/** Daily boarding count per route for the last 7 days. */
function attendance(PDO $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT DATE(te.event_time) AS day, r.name AS route_name, COUNT(*) AS boardings
         FROM tracking_events te
         JOIN students s ON s.id = te.student_id
         LEFT JOIN routes r ON r.id = s.route_id
         WHERE s.school_id = ? AND te.event_type = "board" AND te.event_time >= NOW() - INTERVAL 7 DAY
         GROUP BY day, r.name
         ORDER BY day DESC'
    );
    $stmt->execute([$user['school_id']]);
    Response::json($stmt->fetchAll());
}

/** Trips and distinct students carried per vehicle over the last 30 days. */
function fleetUtilisation(PDO $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT v.plate_number, COUNT(*) AS scan_count, COUNT(DISTINCT te.student_id) AS unique_students
         FROM tracking_events te
         JOIN vehicles v ON v.id = te.vehicle_id
         WHERE v.school_id = ? AND te.event_time >= NOW() - INTERVAL 30 DAY
         GROUP BY v.plate_number
         ORDER BY scan_count DESC'
    );
    $stmt->execute([$user['school_id']]);
    Response::json($stmt->fetchAll());
}
