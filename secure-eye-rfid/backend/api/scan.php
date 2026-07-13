<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Audit.php';
require_once __DIR__ . '/../lib/Sms.php';

const DUPLICATE_SCAN_WINDOW_SECONDS = 120; // FR06: duplicate scan prevention within a 2-minute window

$config = require __DIR__ . '/../config/config.php';
$db = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    Response::error('Method not allowed', 405);
}

// The RFID kiosk logs in as role=scanner (see report Appendix B: kiosk@berecah.sc.ug).
$user = Auth::requireRole(['scanner', 'driver']);
handleScan($db, $config, $user);

/**
 * Card-tap -> student lookup -> tracking_events insert -> parent notification.
 * Target: under 3 seconds end-to-end (NFR01) — the report's own UAT measured 1.8s.
 */
function handleScan(PDO $db, array $config, array $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    // USB HID readers sometimes append \r\n after the UID — strip stray whitespace.
    $rfidCardUid = preg_replace('/\s+/', '', trim($input['rfid_card_uid'] ?? ''));
    $vehicleId = (int) ($input['vehicle_id'] ?? 0);
    $eventType = $input['event_type'] ?? 'board';
    $lat = $input['lat'] ?? null;
    $lng = $input['lng'] ?? null;

    if ($rfidCardUid === '' || $vehicleId === 0 || !in_array($eventType, ['board', 'alight'], true)) {
        Response::error('rfid_card_uid, vehicle_id and a valid event_type are required', 422);
    }

    $stmt = $db->prepare(
        'SELECT s.id, s.full_name, s.class, p.id AS parent_id, u.name AS parent_name,
                u.phone AS parent_phone, p.notify_sms, p.notify_push
         FROM students s
         LEFT JOIN parents p ON p.id = s.parent_id
         LEFT JOIN users u ON u.id = p.user_id
         WHERE s.rfid_card_uid = ? AND s.school_id = ? AND s.is_active = 1'
    );
    $stmt->execute([$rfidCardUid, $user['school_id']]);
    $student = $stmt->fetch();

    if (!$student) {
        Response::error('Unrecognised RFID card', 404);
    }

    // FR06: reject a repeat scan of the same student/event within 2 minutes.
    $dupe = $db->prepare(
        'SELECT id FROM tracking_events
         WHERE student_id = ? AND event_type = ? AND event_time >= NOW() - INTERVAL ' . DUPLICATE_SCAN_WINDOW_SECONDS . ' SECOND
         ORDER BY event_time DESC LIMIT 1'
    );
    $dupe->execute([$student['id'], $eventType]);
    if ($dupe->fetch()) {
        Response::json([
            'duplicate' => true,
            'student' => ['id' => $student['id'], 'full_name' => $student['full_name'], 'class' => $student['class']],
            'event_type' => $eventType,
            'message' => 'Duplicate scan ignored — this student was already scanned in the last 2 minutes.',
        ], 200);
    }

    $insert = $db->prepare(
        'INSERT INTO tracking_events (student_id, vehicle_id, scanned_by, event_type, lat, lng)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $insert->execute([$student['id'], $vehicleId, $user['sub'], $eventType, $lat, $lng]);
    $eventId = (int) $db->lastInsertId();

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
        $notifStmt->execute([$student['parent_id'], $eventId, 'sms', $message, $status, $sentAt]);

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
