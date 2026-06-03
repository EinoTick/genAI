import { tool } from 'ai';
import { z } from 'zod';
import { addTodo, listPendingTodos, completeTodo } from './db.js';
import { getCurrentWeather } from './weather.js';

export const tools = {
  add_todo: tool({
    description: 'Add a new task to the todo list',
    parameters: z.object({
      task: z.string().describe('The task description to add'),
    }),
    execute: async ({ task }) => {
      const todo = addTodo(task);
      return {
        success: true,
        message: `Added task #${todo.id}: "${todo.task}"`,
        todo,
      };
    },
  }),

  list_todos: tool({
    description: 'List all pending (incomplete) todos',
    parameters: z.object({}),
    execute: async () => {
      const todos = listPendingTodos();
      if (todos.length === 0) {
        return { todos: [], message: 'No pending tasks.' };
      }
      return {
        todos,
        message: `Found ${todos.length} pending task(s).`,
      };
    },
  }),

  complete_todo: tool({
    description: 'Mark a todo as completed by its ID',
    parameters: z.object({
      id: z.number().int().positive().describe('The ID of the todo to mark as complete'),
    }),
    execute: async ({ id }) => {
      const success = completeTodo(id);
      return {
        success,
        message: success
          ? `Task #${id} marked as completed. Well done!`
          : `Task #${id} not found or already completed.`,
      };
    },
  }),

  get_weather: tool({
    description: 'Get the current weather in Helsinki',
    parameters: z.object({}),
    execute: async () => {
      const weather = await getCurrentWeather();
      return {
        ...weather,
        message: `Currently ${weather.description} with ${weather.temperature}°C and wind at ${weather.windspeed} km/h. Feels ${weather.feels}.`,
      };
    },
  }),
};
