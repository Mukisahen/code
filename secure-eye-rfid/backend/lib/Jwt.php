<?php
// Minimal dependency-free HS256 JWT encoder/decoder.
// Access tokens are short-lived; refresh tokens are opaque random strings
// stored (hashed) in the refresh_tokens table, not JWTs — see api/auth.php.

class Jwt
{
    public static function encode(array $payload, string $secret, int $ttlSeconds): string
    {
        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttlSeconds;
        $body = self::base64UrlEncode(json_encode($payload));
        $signature = self::sign("$header.$body", $secret);

        return "$header.$body.$signature";
    }

    /** Returns the decoded payload array, or null if invalid/expired/tampered. */
    public static function decode(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        [$header, $body, $signature] = $parts;

        $expected = self::sign("$header.$body", $secret);
        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($body), true);
        if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private static function sign(string $data, string $secret): string
    {
        return self::base64UrlEncode(hash_hmac('sha256', $data, $secret, true));
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
