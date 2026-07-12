<?php
// Returns a shared mysqli connection. All callers use prepared statements —
// no query in this codebase concatenates user input into SQL.

function db(): mysqli
{
    static $conn = null;

    if ($conn !== null) {
        return $conn;
    }

    $config = require __DIR__ . '/config.php';
    $db = $config['db'];

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $conn = new mysqli($db['host'], $db['user'], $db['pass'], $db['name'], $db['port']);
    $conn->set_charset('utf8mb4');

    return $conn;
}
