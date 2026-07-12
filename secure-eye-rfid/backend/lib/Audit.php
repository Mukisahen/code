<?php

class Audit
{
    public static function log(mysqli $db, ?int $userId, string $action, string $details = ''): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'cli';
        $stmt = $db->prepare(
            'INSERT INTO audit_logs (user_id, action, ip_address, details) VALUES (?, ?, ?, ?)'
        );
        $stmt->bind_param('isss', $userId, $action, $ip, $details);
        $stmt->execute();
    }
}
