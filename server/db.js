import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'cointrack.db');

let db;

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database file if it exists
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      category TEXT PRIMARY KEY,
      amount REAL NOT NULL DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      frequency TEXT NOT NULL CHECK(frequency IN ('weekly', 'monthly', 'yearly')),
      next_date TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL NOT NULL DEFAULT 0,
      deadline TEXT,
      color TEXT NOT NULL DEFAULT '#7C3AED',
      icon TEXT NOT NULL DEFAULT 'Target'
    );
  `);

  // Seed if empty
  const result = db.exec('SELECT COUNT(*) as count FROM transactions');
  const count = result[0]?.values[0]?.[0] ?? 0;

  if (count === 0) {
    console.log('🌱 Seeding database with initial data...');

    const categories = [
      { name: 'Salary', color: '#10b981', type: 'income' },
      { name: 'Freelance', color: '#34d399', type: 'income' },
      { name: 'Groceries', color: '#f59e0b', type: 'expense' },
      { name: 'Rent', color: '#ef4444', type: 'expense' },
      { name: 'Utilities', color: '#f97316', type: 'expense' },
      { name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
      { name: 'Transport', color: '#3b82f6', type: 'expense' },
      { name: 'Dining', color: '#ec4899', type: 'expense' },
      { name: 'Health', color: '#14b8a6', type: 'expense' },
      { name: 'Investment', color: '#6366f1', type: 'expense' },
    ];

    for (const cat of categories) {
      db.run('INSERT OR IGNORE INTO categories (name, color, type) VALUES (?, ?, ?)', [cat.name, cat.color, cat.type]);
    }

    const transactions = [
      { id: '1', title: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary', date: '2023-10-01' },
      { id: '2', title: 'Whole Foods Market', amount: 145.20, type: 'expense', category: 'Groceries', date: '2023-10-02' },
      { id: '3', title: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'Entertainment', date: '2023-10-03' },
      { id: '4', title: 'Freelance Project: Web Design', amount: 1200, type: 'income', category: 'Freelance', date: '2023-10-05' },
      { id: '5', title: 'City Electric Bill', amount: 85.50, type: 'expense', category: 'Utilities', date: '2023-10-06' },
      { id: '6', title: 'Uber Rides', amount: 42.00, type: 'expense', category: 'Transport', date: '2023-10-07' },
      { id: '7', title: 'Sushi Dinner', amount: 68.00, type: 'expense', category: 'Dining', date: '2023-10-08' },
      { id: '8', title: 'Gym Membership', amount: 50.00, type: 'expense', category: 'Health', date: '2023-10-09' },
      { id: '9', title: 'Apartment Rent', amount: 1800, type: 'expense', category: 'Rent', date: '2023-10-01' },
      { id: '10', title: 'Stock Dividend', amount: 32.40, type: 'income', category: 'Investment', date: '2023-10-10' },
    ];

    for (const tx of transactions) {
      db.run('INSERT INTO transactions (id, title, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
        [tx.id, tx.title, tx.amount, tx.type, tx.category, tx.date]);
    }

    // Seed recurring transactions
    const recurring = [
      { id: 'r1', title: 'Netflix', amount: 15.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: '2026-04-03' },
      { id: 'r2', title: 'Apartment Rent', amount: 1800, type: 'expense', category: 'Rent', frequency: 'monthly', next_date: '2026-04-01' },
      { id: 'r3', title: 'Gym Membership', amount: 50, type: 'expense', category: 'Health', frequency: 'monthly', next_date: '2026-04-09' },
      { id: 'r4', title: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary', frequency: 'monthly', next_date: '2026-04-01' },
      { id: 'r5', title: 'Electric Bill', amount: 85.50, type: 'expense', category: 'Utilities', frequency: 'monthly', next_date: '2026-04-06' },
      { id: 'r6', title: 'Spotify', amount: 9.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: '2026-04-15' },
    ];

    for (const r of recurring) {
      db.run('INSERT INTO recurring_transactions (id, title, amount, type, category, frequency, next_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [r.id, r.title, r.amount, r.type, r.category, r.frequency, r.next_date]);
    }

    // Seed goals
    const goals = [
      { id: 'g1', name: 'Emergency Fund', target_amount: 10000, current_amount: 3200, deadline: '2026-12-31', color: '#00D68F', icon: 'ShieldCheck' },
      { id: 'g2', name: 'New MacBook Pro', target_amount: 2500, current_amount: 800, deadline: '2026-06-01', color: '#A855F7', icon: 'Laptop' },
      { id: 'g3', name: 'Vacation Fund', target_amount: 5000, current_amount: 1250, deadline: '2026-08-15', color: '#3B82F6', icon: 'Airplane' },
    ];

    for (const g of goals) {
      db.run('INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [g.id, g.name, g.target_amount, g.current_amount, g.deadline, g.color, g.icon]);
    }

    saveDb();
    console.log('✅ Database seeded successfully.');
  }

  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}
