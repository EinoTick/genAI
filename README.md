# 🎩 Jeeves — Your AI Butler

A Node.js CLI application powered by Google Gemini that acts as a personal AI butler. It manages your todos, checks the weather, and greets you each morning with a helpful briefing.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

```bash
cp .env.example .env
```

Open `.env` and paste your Google AI Studio key:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com).

### 3. Run the butler

```bash
npx tsx src/index.ts
```

## What it can do

- **Morning briefing** — on startup, Jeeves checks the weather and lists your pending todos
- **Weather** — fetches live conditions from Open-Meteo (no API key required)
- **Todo management** — add, list, and complete tasks stored in a local SQLite database

## Example session

```
You: Add a task to buy groceries
Jeeves: Very good. I've added "buy groceries" as task #1 to your list.

You: What should I wear today?
Jeeves: It's currently 12°C with light rain in Helsinki. I'd recommend a waterproof jacket
        and sturdy shoes, if I may suggest, sir.

You: Complete task 1
Jeeves: Task #1 has been marked complete. Splendid work!
```

Type `exit` or `quit` to close the session.

## Tech stack

| Tool | Why |
|---|---|
| **Vercel AI SDK** (`ai`) | Provides a clean, model-agnostic abstraction for LLM calls, tool use, and multi-step reasoning via `generateText` + `maxSteps`. Handles the agentic loop so no manual tool-dispatch code is needed. |
| **@ai-sdk/google** | First-class Google Gemini provider for the Vercel AI SDK. Gemini 2.5 Flash has a large context window, fast inference, and free-tier access via AI Studio. |
| **better-sqlite3** | Synchronous SQLite for Node.js — zero-config, no server, ideal for a local CLI app. The sync API keeps tool callbacks simple. |
| **zod** | Runtime schema validation and TypeScript type inference in one. The AI SDK uses Zod schemas directly to generate the JSON Schema passed to the model for tool calls. |
| **tsx** | Run TypeScript directly without a build step. Enables a tight edit→run loop during development. |
| **dotenv** | Standard `.env` file loading — keeps the API key out of source code. |
| **Open-Meteo** | Free, no-auth weather API. No signup required, accurate global forecast data. |

## Project structure

```
src/
  index.ts    — entry point: morning briefing + chat loop
  tools.ts    — Vercel AI SDK tool definitions (add/list/complete todo, weather)
  db.ts       — SQLite setup and CRUD helpers
  weather.ts  — Open-Meteo API integration
todos.db      — auto-created on first run
```
