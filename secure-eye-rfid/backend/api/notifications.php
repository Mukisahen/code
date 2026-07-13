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

function listForParent(PDO $db, array $user): void
{
    $stmt = $db->prepare(
        'SELECT n.id, n.channel, n.message, n.status, n.sent_at, n.read_at, n.created_at
         FROM notifications n JOIN parents p ON p.id = n.parent_id
         WHERE p.user_id = ? ORDER BY n.created_at DESC LIMIT 100'
    );
    $stmt->execute([$user['sub']]);
    Response::json($stmt->fetchAll());
}

function markRead(PDO $db, array $user, int $notificationId): void
{
    $stmt = $db->prepare(
        'UPDATE notifications n JOIN parents p ON p.id = n.parent_id
         SET n.read_at = NOW() WHERE n.id = ? AND p.user_id = ?'
    );
    $stmt->execute([$notificationId, $user['sub']]);

    $stmt->rowCount() > 0
        ? Response::json(['status' => 'read'])
        : Response::error('Notification not found', 404);
}
