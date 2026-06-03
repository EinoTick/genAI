import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'todos.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  created_at: string;
}

export function addTodo(task: string): Todo {
  const stmt = db.prepare('INSERT INTO todos (task) VALUES (?) RETURNING *');
  return stmt.get(task) as Todo;
}

export function listPendingTodos(): Todo[] {
  const stmt = db.prepare('SELECT * FROM todos WHERE completed = 0 ORDER BY created_at ASC');
  return stmt.all() as Todo[];
}

export function listAllTodos(): Todo[] {
  const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at ASC');
  return stmt.all() as Todo[];
}

export function completeTodo(id: number): boolean {
  const stmt = db.prepare('UPDATE todos SET completed = 1 WHERE id = ? AND completed = 0');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function deleteTodo(id: number): boolean {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export default db;
