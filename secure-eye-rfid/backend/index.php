<?php
// Front controller. Routes /api/{resource}[/{id}[/{action}]] to the matching
// handler in api/. Apache rewrites all /api/* requests here — see .htaccess.

declare(strict_types=1);

require_once __DIR__ . '/middleware/cors.php';

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = explode('/', $path);

// Strip a leading "api" segment if the rewrite passed it through.
if (($segments[0] ?? '') === 'api') {
    array_shift($segments);
}

$resource = $segments[0] ?? '';
$routes = [
    'auth' => __DIR__ . '/api/auth.php',
    'students' => __DIR__ . '/api/students.php',
    'vehicles' => __DIR__ . '/api/vehicles.php',
    'routes' => __DIR__ . '/api/routes.php',
    'scan' => __DIR__ . '/api/scan.php',
    'tracking' => __DIR__ . '/api/tracking.php',
    'notifications' => __DIR__ . '/api/notifications.php',
    'reports' => __DIR__ . '/api/reports.php',
];

if (!isset($routes[$resource])) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => "Unknown resource '$resource'"]);
    exit;
}

// Remaining path segments (e.g. an id or sub-action) are exposed to handlers.
$GLOBALS['routeSegments'] = array_slice($segments, 1);

require $routes[$resource];
