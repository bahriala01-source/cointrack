import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { getDb, saveDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins for the portfolio deployment
app.use(express.json());

let db;

// ─── Transactions ────────────────────────────────────────────

app.get('/api/transactions', (req, res) => {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY date DESC, rowid DESC');
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(rows);
});

app.post('/api/transactions', (req, res) => {
    const { title, amount, type, category, date } = req.body;
    if (!title || amount == null || !type || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = crypto.randomUUID();
    db.run(
        'INSERT INTO transactions (id, title, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title, amount, type, category, date]
    );
    saveDb();
    res.status(201).json({ id, title, amount, type, category, date });
});

app.delete('/api/transactions/:id', (req, res) => {
    db.run('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ success: true });
});

// ─── Categories ──────────────────────────────────────────────

app.get('/api/categories', (req, res) => {
    const stmt = db.prepare('SELECT name, color, type FROM categories ORDER BY id');
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(rows);
});

app.post('/api/categories', (req, res) => {
    const { name, color, type } = req.body;
    if (!name || !color || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        db.run('INSERT INTO categories (name, color, type) VALUES (?, ?, ?)', [name, color, type]);
        saveDb();
        res.status(201).json({ name, color, type });
    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Category already exists' });
        }
        throw err;
    }
});

// ─── Budgets ─────────────────────────────────────────────────

app.get('/api/budgets', (req, res) => {
    const stmt = db.prepare('SELECT category, amount FROM budgets');
    const budgetMap = {};
    while (stmt.step()) {
        const row = stmt.getAsObject();
        budgetMap[row.category] = row.amount;
    }
    stmt.free();
    res.json(budgetMap);
});

app.put('/api/budgets/:category', (req, res) => {
    const { category } = req.params;
    const { amount } = req.body;
    if (amount == null) {
        return res.status(400).json({ error: 'Missing amount' });
    }
    db.run(
        'INSERT INTO budgets (category, amount) VALUES (?, ?) ON CONFLICT(category) DO UPDATE SET amount = excluded.amount',
        [category, amount]
    );
    saveDb();
    res.json({ category, amount });
});

// ─── Recurring Transactions ──────────────────────────────────

app.get('/api/recurring', (req, res) => {
    const stmt = db.prepare('SELECT * FROM recurring_transactions ORDER BY next_date ASC');
    const rows = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push({
            id: row.id,
            title: row.title,
            amount: row.amount,
            type: row.type,
            category: row.category,
            frequency: row.frequency,
            nextDate: row.next_date,
            isActive: row.is_active === 1,
        });
    }
    stmt.free();
    res.json(rows);
});

app.post('/api/recurring', (req, res) => {
    const { title, amount, type, category, frequency, nextDate } = req.body;
    if (!title || amount == null || !type || !category || !frequency || !nextDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = crypto.randomUUID();
    db.run(
        'INSERT INTO recurring_transactions (id, title, amount, type, category, frequency, next_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, title, amount, type, category, frequency, nextDate]
    );
    saveDb();
    res.status(201).json({ id, title, amount, type, category, frequency, nextDate, isActive: true });
});

app.delete('/api/recurring/:id', (req, res) => {
    db.run('DELETE FROM recurring_transactions WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ success: true });
});

app.patch('/api/recurring/:id/toggle', (req, res) => {
    db.run('UPDATE recurring_transactions SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ success: true });
});

// ─── Goals ───────────────────────────────────────────────────

app.get('/api/goals', (req, res) => {
    const stmt = db.prepare('SELECT * FROM goals ORDER BY deadline ASC');
    const rows = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push({
            id: row.id,
            name: row.name,
            targetAmount: row.target_amount,
            currentAmount: row.current_amount,
            deadline: row.deadline,
            color: row.color,
            icon: row.icon,
        });
    }
    stmt.free();
    res.json(rows);
});

app.post('/api/goals', (req, res) => {
    const { name, targetAmount, deadline, color, icon } = req.body;
    if (!name || targetAmount == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = crypto.randomUUID();
    db.run(
        'INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon) VALUES (?, ?, ?, 0, ?, ?, ?)',
        [id, name, targetAmount, deadline || null, color || '#7C3AED', icon || 'Target']
    );
    saveDb();
    res.status(201).json({ id, name, targetAmount, currentAmount: 0, deadline, color: color || '#7C3AED', icon: icon || 'Target' });
});

app.patch('/api/goals/:id/contribute', (req, res) => {
    const { amount } = req.body;
    if (amount == null) return res.status(400).json({ error: 'Missing amount' });
    db.run('UPDATE goals SET current_amount = current_amount + ? WHERE id = ?', [amount, req.params.id]);
    saveDb();
    res.json({ success: true });
});

app.delete('/api/goals/:id', (req, res) => {
    db.run('DELETE FROM goals WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ success: true });
});

// ─── Start ───────────────────────────────────────────────────

async function start() {
    db = await getDb();
    app.listen(PORT, () => {
        console.log(`🚀 CoinTrack API server running on http://localhost:${PORT}`);
    });
}

start();
