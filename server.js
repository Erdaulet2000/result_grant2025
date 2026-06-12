const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── PostgreSQL подключение ───────────────────────────────
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("railway.internal")
        ? false
        : { rejectUnauthorized: false }
});

// ─── Создание таблиц при запуске ──────────────────────────
async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS classes (
            name TEXT PRIMARY KEY
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            cls TEXT NOT NULL,
            ent1_score INTEGER,
            ent1_photo TEXT,
            ent2_score INTEGER,
            ent2_photo TEXT
        );
    `);
    console.log("Database initialized");
}

// ─── Admin password ───────────────────────────────────────
const ADMIN_PASSWORD = "school2025";

function requireAdmin(req, res, next) {
    const pwd = req.headers["x-admin-password"];
    if (pwd !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Нет доступа. Неверный пароль." });
    }
    next();
}

// ─── GET all data ─────────────────────────────────────────
app.get("/api/data", async (req, res) => {
    try {
        const classesRes = await pool.query("SELECT name FROM classes ORDER BY name");
        const studentsRes = await pool.query("SELECT * FROM students ORDER BY name");

        const students = studentsRes.rows.map(s => ({
            id: s.id,
            name: s.name,
            cls: s.cls,
            ent1: s.ent1_score !== null ? { score: s.ent1_score, photo: s.ent1_photo } : null,
            ent2: s.ent2_score !== null ? { score: s.ent2_score, photo: s.ent2_photo } : null,
        }));

        res.json({
            classes: classesRes.rows,
            students
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка БД" });
    }
});

// ─── POST add class ───────────────────────────────────────
app.post("/api/class", requireAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query("INSERT INTO classes (name) VALUES ($1) ON CONFLICT DO NOTHING", [name]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE class ─────────────────────────────────────────
app.delete("/api/class/:name", requireAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM students WHERE cls = $1", [req.params.name]);
        await pool.query("DELETE FROM classes WHERE name = $1", [req.params.name]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST add student ─────────────────────────────────────
app.post("/api/student", requireAdmin, async (req, res) => {
    try {
        const id = Date.now().toString();
        await pool.query(
            "INSERT INTO students (id, name, cls) VALUES ($1, $2, $3)",
            [id, req.body.name, req.body.cls]
        );
        res.json({ ok: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE student ───────────────────────────────────────
app.delete("/api/student/:id", requireAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM students WHERE id = $1", [req.params.id]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT update student ENT ───────────────────────────────
app.put("/api/student/:id/ent/:attempt", requireAdmin, async (req, res) => {
    try {
        const { score, photo } = req.body;
        const attempt = req.params.attempt;
        if (attempt !== "1" && attempt !== "2") {
            return res.status(400).json({ error: "Попытка должна быть 1 или 2" });
        }
        await pool.query(
            `UPDATE students SET ent${attempt}_score = $1, ent${attempt}_photo = $2 WHERE id = $3`,
            [score, photo, req.params.id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE ENT result ────────────────────────────────────
app.delete("/api/student/:id/ent/:attempt", requireAdmin, async (req, res) => {
    try {
        const attempt = req.params.attempt;
        await pool.query(
            `UPDATE students SET ent${attempt}_score = NULL, ent${attempt}_photo = NULL WHERE id = $1`,
            [req.params.id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE reset all ─────────────────────────────────────
app.delete("/api/reset", requireAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM students");
        await pool.query("DELETE FROM classes");
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Bulk import students ─────────────────────────────────
app.post("/api/students/bulk", requireAdmin, async (req, res) => {
    try {
        const { students } = req.body;
        for (const s of students) {
            const id = Date.now().toString() + Math.random().toString(36).slice(2);
            await pool.query(
                "INSERT INTO students (id, name, cls) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                [id, s.name, s.cls]
            );
        }
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

initDB().then(() => {
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});
