<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Audit.php';
require_once __DIR__ . '/../lib/Sms.php';

$config = require __DIR__ . '/../config/config.php';
$db = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    Response::error('Method not allowed', 405);
}

// The RFID kiosk logs in as role=scanner (see deck: scanner@berecah.sc.ug).
$user = Auth::requireRole(['scanner', 'driver']);
handleScan($db, $config, $user);

/**
 * Card-tap -> student lookup -> tracking_events insert -> parent notification.
 * Target: under 3 seconds end-to-end, per the project's stated goal.
 */
function handleScan(mysqli $db, array $config, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $rfidUid = trim($input['rfid_uid'] ?? '');
    $vehicleId = (int) ($input['vehicle_id'] ?? 0);
    $eventType = $input['event_type'] ?? 'board';
    $lat = $input['lat'] ?? null;
    $lng = $input['lng'] ?? null;

    if ($rfidUid === '' || $vehicleId === 0 || !in_array($eventType, ['board', 'alight'], true)) {
        Response::error('rfid_uid, vehicle_id and a valid event_type are required', 422);
    }

    $stmt = $db->prepare(
        'SELECT s.id, s.full_name, s.class, p.id AS parent_id, u.name AS parent_name,
                u.phone AS parent_phone, p.notify_sms, p.notify_push
         FROM students s
         LEFT JOIN parents p ON p.id = s.parent_id
         LEFT JOIN users u ON u.id = p.user_id
         WHERE s.rfid_uid = ? AND s.school_id = ? AND s.is_active = 1'
    );
    $stmt->bind_param('si', $rfidUid, $user['school_id']);
    $stmt->execute();
    $student = $stmt->get_result()->fetch_assoc();

    if (!$student) {
        Response::error('Unrecognised RFID card', 404);
    }

    $insert = $db->prepare(
        'INSERT INTO tracking_events (student_id, vehicle_id, scanned_by, event_type, lat, lng)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $insert->bind_param('iiisdd', $student['id'], $vehicleId, $user['sub'], $eventType, $lat, $lng);
    $insert->execute();
    $eventId = $insert->insert_id;

    $notification = null;
    if ($student['parent_id']) {
        $verb = $eventType === 'board' ? 'boarded' : 'alighted from';
        $message = "Secure Eye: {$student['full_name']} has {$verb} the school bus.";

        $sent = false;
        if ($student['notify_sms'] && $student['parent_phone']) {
            $sent = Sms::send($config, $student['parent_phone'], $message);
        }

        $status = $sent ? 'sent' : 'pending';
        $sentAt = $sent ? date('Y-m-d H:i:s') : null;

        $notifStmt = $db->prepare(
            'INSERT INTO notifications (parent_id, tracking_event_id, channel, message, status, sent_at)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $channel = 'sms';
        $notifStmt->bind_param('iissss', $student['parent_id'], $eventId, $channel, $message, $status, $sentAt);
        $notifStmt->execute();

        $notification = ['status' => $status, 'message' => $message];
    }

    Audit::log($db, $user['sub'], 'rfid_scan', "student_id={$student['id']} event=$eventType vehicle=$vehicleId");

    Response::json([
        'event_id' => $eventId,
        'student' => ['id' => $student['id'], 'full_name' => $student['full_name'], 'class' => $student['class']],
        'event_type' => $eventType,
        'notification' => $notification,
    ], 201);
}
