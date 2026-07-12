<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Jwt.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Audit.php';

$config = require __DIR__ . '/../config/config.php';
$db = db();
$action = $GLOBALS['routeSegments'][0] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $action === 'login') {
    login($db, $config);
} elseif ($method === 'POST' && $action === 'refresh') {
    refresh($db, $config);
} elseif ($method === 'POST' && $action === 'logout') {
    logout($db);
} else {
    Response::error('Not found', 404);
}

function login(mysqli $db, array $config): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = trim($input['email'] ?? '');
    $password = (string) ($input['password'] ?? '');

    if ($email === '' || $password === '') {
        Response::error('Email and password are required', 422);
    }

    $stmt = $db->prepare(
        'SELECT id, school_id, name, email, password_hash, role, is_active FROM users WHERE email = ?'
    );
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user || !$user['is_active'] || !password_verify($password, $user['password_hash'])) {
        Audit::log($db, $user['id'] ?? null, 'login_failed', "email=$email");
        Response::error('Invalid credentials', 401);
    }

    $accessToken = Jwt::encode(
        ['sub' => $user['id'], 'role' => $user['role'], 'school_id' => $user['school_id']],
        $config['jwt']['secret'],
        $config['jwt']['access_ttl_seconds']
    );

    $refreshToken = bin2hex(random_bytes(32));
    $refreshHash = hash('sha256', $refreshToken);
    $expiresAt = date('Y-m-d H:i:s', time() + $config['jwt']['refresh_ttl_days'] * 86400);

    $stmt = $db->prepare(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
    );
    $stmt->bind_param('iss', $user['id'], $refreshHash, $expiresAt);
    $stmt->execute();

    Audit::log($db, $user['id'], 'login_success');

    Response::json([
        'access_token' => $accessToken,
        'refresh_token' => $refreshToken,
        'expires_in' => $config['jwt']['access_ttl_seconds'],
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
}

function refresh(mysqli $db, array $config): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $refreshToken = (string) ($input['refresh_token'] ?? '');

    if ($refreshToken === '') {
        Response::error('refresh_token is required', 422);
    }

    $tokenHash = hash('sha256', $refreshToken);
    $stmt = $db->prepare(
        'SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked, u.role, u.school_id, u.is_active
         FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
         WHERE rt.token_hash = ?'
    );
    $stmt->bind_param('s', $tokenHash);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row || $row['revoked'] || !$row['is_active'] || strtotime($row['expires_at']) < time()) {
        Response::error('Invalid or expired refresh token', 401);
    }

    $accessToken = Jwt::encode(
        ['sub' => $row['user_id'], 'role' => $row['role'], 'school_id' => $row['school_id']],
        $config['jwt']['secret'],
        $config['jwt']['access_ttl_seconds']
    );

    Response::json(['access_token' => $accessToken, 'expires_in' => $config['jwt']['access_ttl_seconds']]);
}

function logout(mysqli $db): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $refreshToken = (string) ($input['refresh_token'] ?? '');

    if ($refreshToken !== '') {
        $tokenHash = hash('sha256', $refreshToken);
        $stmt = $db->prepare('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?');
        $stmt->bind_param('s', $tokenHash);
        $stmt->execute();
    }

    Response::json(['status' => 'logged_out']);
}
