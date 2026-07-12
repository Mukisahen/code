<?php
// Secure Eye backend configuration.
// All secrets are read from environment variables (set them in your Apache
// vhost, a .env loaded by your shell, or WampServer's php.ini) — never commit
// real credentials to this file.

return [
    'db' => [
        'host' => getenv('SECUREEYE_DB_HOST') ?: '127.0.0.1',
        'name' => getenv('SECUREEYE_DB_NAME') ?: 'secure_eye',
        'user' => getenv('SECUREEYE_DB_USER') ?: 'root',
        'pass' => getenv('SECUREEYE_DB_PASS') ?: '',
        'port' => (int) (getenv('SECUREEYE_DB_PORT') ?: 3306),
    ],
    'jwt' => [
        'secret' => getenv('SECUREEYE_JWT_SECRET') ?: 'CHANGE_ME_IN_ENV_SECUREEYE_JWT_SECRET',
        'access_ttl_seconds' => 900,        // 15 minutes
        'refresh_ttl_days' => 7,
    ],
    'cors' => [
        'allowed_origins' => explode(',', getenv('SECUREEYE_CORS_ORIGINS') ?: '*'),
    ],
    'sms' => [
        // Africa's Talking — used for SMS fallback notifications to parents.
        'username' => getenv('SECUREEYE_AT_USERNAME') ?: '',
        'api_key' => getenv('SECUREEYE_AT_API_KEY') ?: '',
        'enabled' => filter_var(getenv('SECUREEYE_SMS_ENABLED') ?: 'false', FILTER_VALIDATE_BOOLEAN),
    ],
];
