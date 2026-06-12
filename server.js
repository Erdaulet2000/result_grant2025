const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));

const DB_FILE = path.join(__dirname, "db.json");

// ─── Admin password (измените на свой!) ──────────────────
const ADMIN_PASSWORD = "school2025";

function loadDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ─── Middleware: проверка пароля для изменений ────────────
function requireAdmin(req, res, next) {
    const pwd = req.headers["x-admin-password"];
    if (pwd !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Нет доступа. Неверный пароль." });
    }
    next();
}

// ─── GET all data — открыто для всех ─────────────────────
app.get("/api/data", (req, res) => res.json(loadDB()));

// ─── POST add class — только admin ───────────────────────
app.post("/api/class", requireAdmin, (req, res) => {
    const db = loadDB();
    const { name } = req.body;
    if (db.classes.find(c => c.name === name)) return res.status(400).json({ error: "Группа уже существует" });
    db.classes.push({ name });
    saveDB(db);
    res.json({ ok: true });
});

// ─── DELETE class — только admin ─────────────────────────
app.delete("/api/class/:name", requireAdmin, (req, res) => {
    const db = loadDB();
    db.classes = db.classes.filter(c => c.name !== req.params.name);
    db.students = db.students.filter(s => s.cls !== req.params.name);
    saveDB(db);
    res.json({ ok: true });
});

// ─── POST add student — только admin ─────────────────────
app.post("/api/student", requireAdmin, (req, res) => {
    const db = loadDB();
    const student = {
        id: Date.now().toString(),
        name: req.body.name,
        cls: req.body.cls,
        ent1: null,
        ent2: null
    };
    db.students.push(student);
    saveDB(db);
    res.json({ ok: true, id: student.id });
});

// ─── DELETE student — только admin ───────────────────────
app.delete("/api/student/:id", requireAdmin, (req, res) => {
    const db = loadDB();
    db.students = db.students.filter(s => s.id !== req.params.id);
    saveDB(db);
    res.json({ ok: true });
});

// ─── PUT update student ENT — только admin ───────────────
app.put("/api/student/:id/ent/:attempt", requireAdmin, (req, res) => {
    const db = loadDB();
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: "Ученик не найден" });
    const attempt = req.params.attempt;
    if (attempt !== "1" && attempt !== "2") return res.status(400).json({ error: "Попытка должна быть 1 или 2" });
    student[`ent${attempt}`] = {
        score: req.body.score,
        photo: req.body.photo
    };
    saveDB(db);
    res.json({ ok: true });
});

// ─── DELETE ENT result — только admin ────────────────────
app.delete("/api/student/:id/ent/:attempt", requireAdmin, (req, res) => {
    const db = loadDB();
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: "Ученик не найден" });
    student[`ent${req.params.attempt}`] = null;
    saveDB(db);
    res.json({ ok: true });
});

// ─── DELETE reset all — только admin ─────────────────────
app.delete("/api/reset", requireAdmin, (req, res) => {
    saveDB({ classes: [], students: [] });
    res.json({ ok: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
