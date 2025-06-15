<?php

namespace App\Http\Controllers;


use App\Models\Note;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class NoteController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {        
        return inertia('Dashboard', [
            'notes' => Auth::user()->notes()->latest()->get()
        ]);
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);
        $note->delete();

        $notes = auth()->user()->notes()->latest()->get();

        return Inertia::render('Dashboard', [
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        Auth::user()->notes()->create($validated);
        return redirect()->route('dashboard');
    }

    public function edit(Note $note)
    {
        $this->authorize('update', $note); 

        return inertia('NoteEditor', [
            'note' => $note,
        ]);
    }

    public function update(Request $request, Note $note)
    {
        $this-> authorize('update', $note);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note->update($validated);
        return inertia('NoteEditor', [
            'note' => $note,
        ]);
    }

    public function summarize(Request $request, Note $note)
    {
        $apiKey = config('services.openai.api_key');

        if (!$apiKey) {
            return response()->json(['error' => 'API key not configured'], 500);
        }    

        return response()->stream(function () use ($note, $apiKey) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->withOptions(['stream' => true])
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4.1-nano-2025-04-14',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Summarize the following note concisely:'],
                        ['role' => 'user', 'content' => $note->content],
                    ],
                    'stream' => true,
                    'temperature' => 0.7,
                    'max_tokens' => 2048,
                ]);

                $stream = $response->getBody()->detach();
                while (!feof($stream)) {
                $line = fgets($stream);
                $line = trim($line);

                if ($line === '' || !str_starts_with($line, 'data: ')) {
                    continue;
                }

                $data = substr($line, 6);

                if ($data === '[DONE]') {
                    echo "data: [DONE]\n\n";
                    flush();
                    break;
                }

                $json = json_decode($data, true);

                if (isset($json['choices'][0]['delta']['content'])) {
                    $content = $json['choices'][0]['delta']['content'];
                    echo "data: $content\n\n";
                    flush();
                }
            }

            fclose($stream);            
            } catch (\Throwable $e) {
                Log::error('Streaming error', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                echo "data: " . json_encode("Error: " . $e->getMessage()) . "\n\n";
                echo "data: [DONE]\n\n";
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', 
        ]);
    }


    public function generateTags(Note $note)
    {
        require_once app_path('Raw/TagGenerator.php');

        $generator = new \TagGeneratorRaw();
        $tags = $generator->generateTags($note);

        $note->tags = $tags;
        $note->save();
        $notes = auth()->user()->notes()->latest()->get();
        return Inertia::render('Dashboard', [
            'notes' => $notes,
        ]);
    }
}
