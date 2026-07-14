<?php

/** Thin wrapper around the Africa's Talking SMS API for parent notifications. */
class Sms
{
    public static function send(array $config, string $phone, string $message): bool
    {
        if (!$config['sms']['enabled'] || $config['sms']['username'] === '' || $config['sms']['api_key'] === '') {
            return false; // SMS disabled or not configured — notification stays 'pending' in the DB.
        }

        $ch = curl_init('https://api.africastalking.com/version1/messaging');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'apiKey: ' . $config['sms']['api_key'],
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
            ],
            CURLOPT_POSTFIELDS => http_build_query([
                'username' => $config['sms']['username'],
                'to' => $phone,
                'message' => $message,
            ]),
        ]);

        $response = curl_exec($ch);
        $ok = $response !== false && curl_getinfo($ch, CURLINFO_HTTP_CODE) < 300;
        curl_close($ch);

        return $ok;
    }
}
