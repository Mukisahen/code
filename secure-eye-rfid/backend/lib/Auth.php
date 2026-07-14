<?php

require_once __DIR__ . '/Jwt.php';
require_once __DIR__ . '/Response.php';

class Auth
{
    /** Reads the Bearer token, verifies it, and returns its payload — or sends a 401 and exits. */
    public static function requireUser(): array
    {
        $config = require __DIR__ . '/../config/config.php';
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!preg_match('/^Bearer\s+(.+)$/', $header, $matches)) {
            Response::error('Missing bearer token', 401);
        }

        $payload = Jwt::decode($matches[1], $config['jwt']['secret']);
        if ($payload === null) {
            Response::error('Invalid or expired token', 401);
        }

        return $payload;
    }

    /** Requires the authenticated user to hold one of the given roles. */
    public static function requireRole(array $allowedRoles): array
    {
        $user = self::requireUser();
        if (!in_array($user['role'], $allowedRoles, true)) {
            Response::error('Forbidden — insufficient role', 403);
        }
        return $user;
    }
}
