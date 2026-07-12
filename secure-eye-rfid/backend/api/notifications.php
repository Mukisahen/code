<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Auth.php';
require_once __DIR__ . '/../lib/Response.php';

$db = db();
$method = $_SERVER['REQUEST_METHOD'];
$segments = $GLOBALS['routeSegments'];
$id = $segments[0] ?? null;
$action = $segments[1] ?? null;

if ($method === 'GET' && $id === null) {
    $user = Auth::requireRole(['parent']);
    listForParent($db, $user);
} elseif ($method === 'POST' && $action === 'read') {
    $user = Auth::requireRole(['parent']);
    markRead($db, $user, (int) $id);
} else {
    Response::error('Not found', 404);
}

function listForParent(mysqli $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT n.id, n.channel, n.message, n.status, n.sent_at, n.read_at, n.created_at
         FROM notifications n JOIN parents p ON p.id = n.parent_id
         WHERE p.user_id = ? ORDER BY n.created_at DESC LIMIT 100'
    );
    $stmt->bind_param('i', $user['sub']);
    $stmt->execute();
    Response::json($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
}

function markRead(mysqli $db, array $user, int $notificationId): void
{
    $stmt = $db->prepare(
        'UPDATE notifications n JOIN parents p ON p.id = n.parent_id
         SET n.read_at = NOW() WHERE n.id = ? AND p.user_id = ?'
    );
    $stmt->bind_param('ii', $notificationId, $user['sub']);
    $stmt->execute();

    $stmt->affected_rows > 0
        ? Response::json(['status' => 'read'])
        : Response::error('Notification not found', 404);
}
