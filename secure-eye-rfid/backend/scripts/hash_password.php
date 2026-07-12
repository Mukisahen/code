<?php
// CLI helper: php hash_password.php "SomePlaintextPassword"
// Prints a bcrypt (cost 12) hash suitable for the users.password_hash column.

if ($argc < 2) {
    fwrite(STDERR, "Usage: php hash_password.php <plaintext-password>\n");
    exit(1);
}

echo password_hash($argv[1], PASSWORD_BCRYPT, ['cost' => 12]) . "\n";
