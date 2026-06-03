import 'dotenv/config';
import * as readline from 'readline';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { tools } from './tools.js';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google('gemini-2.5-flash');

const SYSTEM_PROMPT = `You are Jeeves, a sophisticated and helpful AI butler. You assist your employer with their daily tasks, weather updates, and todo management.

Your personality:
- Polite, formal, and impeccably helpful
- Proactive — you anticipate needs before they arise
- Concise but warm — never terse, never rambling
- You occasionally use light British butler humour

You have access to these tools:
- get_weather: Check the current weather in Helsinki
- add_todo: Add a new task to the todo list
- list_todos: List all pending tasks
- complete_todo: Mark a task as done by ID

Always use the tools when relevant rather than guessing. When listing todos, format them clearly with their IDs.`;

const MORNING_PROMPT = `Please give me a morning briefing.
1. Check the current weather and tell me what to wear today based on conditions.
2. List any pending todos for the day.
Keep it brief, warm, and butler-like. Begin with a good morning greeting.`;

type Message = { role: 'user' | 'assistant'; content: string };

const conversationHistory: Message[] = [];

async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({ role: 'user', content: userMessage });

  const result = await generateText({
    model,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
    tools,
    maxSteps: 5,
  });

  const assistantMessage = result.text;
  conversationHistory.push({ role: 'assistant', content: assistantMessage });

  return assistantMessage;
}

async function morningBriefing(): Promise<void> {
  process.stdout.write('\n🎩 Jeeves is preparing your morning briefing...\n\n');

  const briefing = await chat(MORNING_PROMPT);
  console.log(briefing);
  console.log('\n' + '─'.repeat(60) + '\n');
}

async function main(): Promise<void> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('Error: GOOGLE_GENERATIVE_AI_API_KEY is not set in your .env file.');
    console.error('Please copy .env.example to .env and add your API key.');
    process.exit(1);
  }

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           🎩  Jeeves — Your AI Butler  🎩               ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await morningBriefing();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: ',
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('\nJeeves: Very good, sir/madam. Until we meet again. Good day!\n');
      rl.close();
      process.exit(0);
    }

    try {
      process.stdout.write('\nJeeves: ');
      const response = await chat(input);
      console.log(response);
      console.log();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`\nJeeves: I do apologise — I encountered a spot of trouble: ${msg}\n`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
