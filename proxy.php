<?php
// proxy.php — simple server-side proxy for Google Generative Language API
// Place this file in your XAMPP htdocs alongside the other project files.

header('Content-Type: application/json');

// load server-side key from a local file that is not committed
// create google_key.php with: <?php $GOOGLE_API_KEY = 'your_key_here';
if (!file_exists(__DIR__ . '/google_key.php')) {
  http_response_code(500);
  echo json_encode(['error' => 'Server configuration missing google_key.php']);
  exit;
}
require __DIR__ . '/google_key.php';
if (empty($GOOGLE_API_KEY)) {
  http_response_code(500);
  echo json_encode(['error' => 'Missing GOOGLE_API_KEY']);
  exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (!isset($data['prompt']) || !isset($data['pdfText'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing prompt or pdfText']);
  exit;
}

$prompt = $data['prompt'];
$pdfText = $data['pdfText'];

$model = 'models/text-bison-001'; // change if you have another model

$post = json_encode([
  'prompt' => ['text' => "PDF CONTENT:\n" . $pdfText . "\n\nUSER PROMPT:\n" . $prompt],
  'temperature' => 0.2,
  'maxOutputTokens' => 800
]);

$url = "https://generativelanguage.googleapis.com/v1beta2/{$model}:generate?key={$GOOGLE_API_KEY}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
$resp = curl_exec($ch);
$err = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
  http_response_code(500);
  echo json_encode(['error' => 'Curl error: ' . $err]);
  exit;
}

if ($code < 200 || $code >= 300) {
  http_response_code($code);
  echo $resp;
  exit;
}

$json = json_decode($resp, true);

// try to extract text from a few likely shapes
$aiText = '';
if (!empty($json['candidates'][0]['output'])) $aiText = $json['candidates'][0]['output'];
if (!$aiText && !empty($json['output']) && is_array($json['output'])) {
  foreach ($json['output'] as $block) {
    if (!empty($block['content']) && is_array($block['content'])) {
      foreach ($block['content'] as $c) {
        if (!empty($c['text'])) $aiText .= $c['text'];
      }
    } elseif (!empty($block['text'])) {
      $aiText .= $block['text'];
    }
  }
}
if (!$aiText && !empty($json['candidates'])) {
  $first = $json['candidates'][0];
  if (!empty($first['content']) && is_array($first['content'])) {
    foreach ($first['content'] as $c) if (!empty($c['text'])) $aiText .= $c['text'];
  }
}

echo json_encode(['response' => $aiText]);

