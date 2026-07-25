# Known Issues

## Gemini API access blocked (Lesson 10, resolved by switching providers)

Originally attempted with Gemini's `gemini-embedding-001` model, but blocked
by a Google-side account/project restriction (POST requests to
generation/embedding endpoints returned 403, while GET requests worked fine).
Confirmed as a known, actively reported issue on Google's AI developer forum,
unrelated to this codebase.

**Resolution:** switched to Ollama (`nomic-embed-text`, local, 768 dimensions)
for embeddings. See `EmbeddingsService` in `src/embeddings/`. Gemini may be
revisited later for chat generation (Part 4) if account access clears, or
Ollama's chat models (e.g. `llama3`) may be used instead — decision pending
at that lesson.
