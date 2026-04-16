<?php
$caFile = "F:/Webdevelopment/Full apps/task_manager/storage/app/ca/isrgrootx1.pem";
echo "Testing: $caFile\n";
echo "Exists: " . (file_exists($caFile) ? 'YES' : 'NO') . "\n";
echo "Readable: " . (is_readable($caFile) ? 'YES' : 'NO') . "\n";
