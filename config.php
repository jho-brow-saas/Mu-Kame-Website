<?php

$configLocal = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.local.php';

if (!file_exists($configLocal)) {
    header('HTTP/1.1 500 Internal Server Error');
    die('Configuracao local nao encontrada.');
}

require_once($configLocal);