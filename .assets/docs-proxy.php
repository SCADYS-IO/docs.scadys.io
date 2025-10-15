<?php
/**
 * docs-proxy.php — Protects MkDocs static documentation with WordPress login + role
 * Place this file in: /home/gmcostbr/scadys.io/
 * MkDocs output should live in: /home/gmcostbr/docs.scadys.io/
 */

define('SHORTINIT', false);
require __DIR__ . '/wp-load.php'; // Boot WordPress

// ---- Access Policy ----
$required_cap = 'read_docs'; // Custom capability or change to e.g. 'read' if you want all logged-in users

// Force login if not authenticated
if ( ! is_user_logged_in() ) {
    wp_safe_redirect( wp_login_url( $_SERVER['REQUEST_URI'] ) );
    exit;
}

// Check user capability
if ( ! current_user_can( $required_cap ) ) {
    status_header(403);
    echo 'Forbidden: you do not have permission to view these documents.';
    exit;
}

// ---- Path mapping ----
$base = '/home/gmcostbr/docs.scadys.io';  // ✅ MkDocs build directory
$req  = $_GET['path'] ?? '';

// Sanitize request path
$req = strtok($req, '?');
$req = ltrim($req, '/');
if (strpos($req, '..') !== false) {
    status_header(400);
    echo 'Bad request';
    exit;
}

// Determine target file
$fs = rtrim($base, '/') . '/' . $req;
if ($req === '' || substr($req, -1) === '/') {
    $fs = rtrim($fs, '/') . '/index.html';
} elseif (!file_exists($fs) && is_dir(rtrim($fs, '/'))) {
    $fs = rtrim($fs, '/') . '/index.html';
}

// Allow only safe file extensions
$allowed = '/\.(html?|css|js|json|png|jpe?g|gif|svg|webp|avif|ico|pdf|woff2?|ttf|eot|map)$/i';

if (!preg_match($allowed, $fs)) {
    status_header(403);
    echo 'Forbidden';
    exit;
}

// Serve file
if (!is_file($fs)) {
    status_header(404);
    echo 'Not found';
    exit;
}

$mime = function_exists('finfo_open')
    ? finfo_file(finfo_open(FILEINFO_MIME_TYPE), $fs)
    : mime_content_type($fs);

header('Content-Type: ' . ($mime ?: 'application/octet-stream'));
header('Content-Length: ' . filesize($fs));
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');

readfile($fs);
exit;
