<?php

$caFile = "F:/Webdevelopment/Full apps/task_manager/storage/app/ca/isrgrootx1.pem";
$caFileBackslash = str_replace('/', '\\', $caFile);

echo "Testing with Forward Slashes: $caFile\n";
echo "File Exists: " . (file_exists($caFile) ? 'YES' : 'NO') . "\n";
echo "Is Readable: " . (is_readable($caFile) ? 'YES' : 'NO') . "\n\n";

echo "Testing with Backslashes: $caFileBackslash\n";
echo "File Exists: " . (file_exists($caFileBackslash) ? 'YES' : 'NO') . "\n";
echo "Is Readable: " . (is_readable($caFileBackslash) ? 'YES' : 'NO') . "\n\n";

$dsn = "mysql:host=gateway01.ap-southeast-1.prod.aws.tidbcloud.com;port=4000;dbname=teamtask;charset=utf8mb4";
$username = "2FRFX7KxP42KpW9.root";
$password = "yn5PpZVqrfOOYwKx";

echo "Attempting connection with Forward Slashes...\n";
try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::MYSQL_ATTR_SSL_CA => $caFile,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "SUCCESS!\n";
} catch (Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}

echo "\nAttempting connection with Backslashes...\n";
try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::MYSQL_ATTR_SSL_CA => $caFileBackslash,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "SUCCESS!\n";
} catch (Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
