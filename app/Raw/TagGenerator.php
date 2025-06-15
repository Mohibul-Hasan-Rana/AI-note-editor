<?php
// app/Raw/TagGenerator.php

use GuzzleHttp\Client;
use App\Models\Note;

class TagGeneratorRaw
{
    public function generateTags(Note $note): array
    {
        $apiKey = config('services.openai.api_key');

        $client = new Client();

        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-4.1-nano-2025-04-14',
                'messages' => [
                    ['role' => 'system', 'content' => 'Extract 3 to 5 relevant tags from the note. Return as comma-separated.'],
                    ['role' => 'user', 'content' => $note->content],
                ],
                'max_tokens'  => 60,
                'temperature' => 0.2,
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        $raw = $data['choices'][0]['message']['content'] ?? '';

        // Clean and convert to array
        $raw = preg_replace('/^Tags?:/i', '', $raw);
        return array_filter(array_map('trim', explode(',', $raw)));
    }
}
