// ─── State ───────────────────────────────────────────────
let db = { classes: [], students: [] };
let currentView = 'dashboard';
let currentClassDetail = null;
let currentStudent = null;
let uploadAttempt = null;
let uploadPhotoBase64 = null;

// ─── Admin Auth ───────────────────────────────────────────
let isAdmin = false;

function initAdmin() {
    const saved = sessionStorage.getItem('adminPwd');
    if (saved) {
        isAdmin = true;
        updateAdminUI();
    }
}

function getAdminHeaders() {
    if (!isAdmin) return { 'Content-Type': 'application/json' };
    return {
        'Content-Type': 'application/json',
        'x-admin-password': sessionStorage.getItem('adminPwd') || ''
    };
}

function openAdminLogin() {
    document.getElementById('admin-pwd-input').value = '';
    document.getElementById('admin-login-error').textContent = '';
    document.getElementById('modal-admin-login').classList.add('open');
    setTimeout(() => document.getElementById('admin-pwd-input').focus(), 100);
}

function closeAdminLogin() {
    document.getElementById('modal-admin-login').classList.remove('open');
}

async function submitAdminLogin() {
    const pwd = document.getElementById('admin-pwd-input').value;
    if (!pwd) return;
    const res = await fetch('/api/class/__test_auth__', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pwd }
    });
    if (res.status === 403) {
        document.getElementById('admin-login-error').textContent = t('wrongPassword');
        return;
    }
    isAdmin = true;
    sessionStorage.setItem('adminPwd', pwd);
    closeAdminLogin();
    updateAdminUI();
    renderAll();
}

function adminLogout() {
    isAdmin = false;
    sessionStorage.removeItem('adminPwd');
    updateAdminUI();
    renderAll();
}

function updateAdminUI() {
    const btn = document.getElementById('admin-login-btn');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const badge = document.getElementById('admin-badge');
    if (isAdmin) {
        btn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        badge.style.display = 'flex';
    } else {
        btn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        badge.style.display = 'none';
    }
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
    });
}

// ─── Theme ────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
}

function toggleTheme() {
    const current = document.body.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
}

function applyTheme(theme) {
    const track = document.getElementById('toggle-track');
    const label = document.getElementById('theme-label');
    if (theme === 'light') {
        document.body.classList.add('light');
        track?.classList.add('on');
        if (label) label.textContent = t('lightTheme');
    } else {
        document.body.classList.remove('light');
        track?.classList.remove('on');
        if (label) label.textContent = t('darkTheme');
    }
}

async function load() {
    const res = await fetch('/api/data');
    db = await res.json();
    renderAll();
}

function renderAll() {
    renderDashboard();
    renderClassList();
    renderStudentsView();
    if (currentClassDetail) renderClassDetail(currentClassDetail);
    updateAdminUI();
}

// ─── Navigation ──────────────────────────────────────────
function setView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('view-' + name)?.classList.add('active');
    const navMap = { dashboard: 0, classes: 1, students: 2 };
    const btns = document.querySelectorAll('.nav-btn');
    if (navMap[name] !== undefined) btns[navMap[name]]?.classList.add('active');
    currentView = name;
}

function openClassDetail(className) {
    currentClassDetail = className;
    renderClassDetail(className);
    setView('class-detail');
}

// ─── Dashboard ───────────────────────────────────────────
function renderDashboard() {
    document.getElementById('dash-classes').textContent = db.classes.length;
    document.getElementById('dash-students').textContent = db.students.length;
    document.getElementById('dash-ent1').textContent = db.students.filter(s => s.ent1).length;
    document.getElementById('dash-ent2').textContent = db.students.filter(s => s.ent2).length;

    const container = document.getElementById('dash-class-list');
    if (!db.classes.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">🏫</div><div class="empty-text">${t('noGroups')}</div><div class="empty-sub">${t('noGroupsSub')}</div></div>`;
        return;
    }
    container.innerHTML = db.classes.map(c => {
        const students = db.students.filter(s => s.cls === c.name);
        const ent1Done = students.filter(s => s.ent1).length;
        const ent2Done = students.filter(s => s.ent2).length;
        return `
        <div class="class-card" onclick="openClassDetail('${escHtml(c.name)}')">
            <div class="class-name">🏫 ${escHtml(c.name)}</div>
            <div class="class-meta">${students.length}${t('students')}</div>
            <div style="display:flex;gap:8px;margin-top:12px">
                <span class="badge badge-green">${t('colEnt1')}: ${ent1Done}/${students.length}</span>
                <span class="badge badge-yellow">${t('colEnt2')}: ${ent2Done}/${students.length}</span>
            </div>
        </div>`;
    }).join('');
}

// ─── Classes ─────────────────────────────────────────────
function renderClassList() {
    const container = document.getElementById('classList');
    if (!db.classes.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">🏫</div><div class="empty-text">${t('noGroupsYet')}</div></div>`;
        return;
    }
    container.innerHTML = db.classes.map(c => {
        const count = db.students.filter(s => s.cls === c.name).length;
        return `
        <div class="class-card" onclick="openClassDetail('${escHtml(c.name)}')">
            <div class="class-name">🏫 ${escHtml(c.name)}</div>
            <div class="class-meta">${count}${t('clickToView')}</div>
            <div class="class-actions admin-only" style="display:${isAdmin?'':'none'}">
                <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteClass('${escHtml(c.name)}')">${t('deleteBtn')}</button>
            </div>
        </div>`;
    }).join('');
}

async function addClass() {
    if (!isAdmin) return;
    const input = document.getElementById('className');
    const name = input.value.trim();
    if (!name) return;
    const res = await fetch('/api/class', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ name })
    });
    const json = await res.json();
    if (!json.ok) { alert(json.error); return; }
    input.value = '';
    await load();
}

async function deleteClass(name) {
    if (!isAdmin) return;
    if (!confirm(t('deleteClassConfirm', { name }))) return;
    await fetch('/api/class/' + encodeURIComponent(name), {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    await load();
}

// ─── Class Detail ────────────────────────────────────────
function renderClassDetail(className) {
    document.getElementById('detail-class-name').textContent = className;
    document.getElementById('detail-class-title').textContent = className;
    const students = db.students.filter(s => s.cls === className);
    document.getElementById('detail-class-sub').textContent = `${students.length}${t('students')}`;

    // Breadcrumb
    const breadA = document.querySelector('#view-class-detail .breadcrumb a');
    if (breadA) breadA.textContent = t('groups');

    // Detail header buttons
    const detailBtns = document.querySelectorAll('#view-class-detail .page-header .btn');
    detailBtns.forEach(btn => {
        if (btn.classList.contains('detail-admin-btn') && btn.onclick?.toString().includes('import')) {
            btn.textContent = t('importExcel');
        } else if (btn.classList.contains('btn-ghost')) {
            btn.textContent = t('exportExcel');
        } else if (btn.classList.contains('detail-admin-btn')) {
            btn.textContent = t('addStudent');
        }
    });

    document.querySelectorAll('.detail-admin-btn').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
    });

    const container = document.getElementById('detail-student-table');
    if (!students.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">👨‍🎓</div><div class="empty-text">${t('noStudentsInGroup')}</div><div class="empty-sub">${isAdmin ? t('noStudentsAdmin') : t('noStudentsGuest')}</div></div>`;
        return;
    }
    container.innerHTML = `
    <div class="student-table">
    <table>
    <thead><tr>
        <th>${t('colNum')}</th><th>${t('colName')}</th>
        <th>${t('colEnt1')}</th><th>${t('colEnt2')}</th>
        <th>${t('colBest')}</th>${isAdmin ? '<th></th>' : ''}
    </tr></thead>
    <tbody>
    ${students.map((s, i) => studentRow(s, i + 1)).join('')}
    </tbody>
    </table>
    </div>`;
}

function studentRow(s, num) {
    const e1 = s.ent1 ? `<span class="badge badge-green">${s.ent1.score}</span>` : `<span class="badge badge-gray">—</span>`;
    const e2 = s.ent2 ? `<span class="badge badge-yellow">${s.ent2.score}</span>` : `<span class="badge badge-gray">—</span>`;
    const best = Math.max(s.ent1?.score ?? 0, s.ent2?.score ?? 0);
    const bestBadge = best > 0 ? `<span class="badge badge-green">${best}</span>` : `<span class="badge badge-gray">—</span>`;
    const deleteBtn = isAdmin ? `<td><button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteStudent('${s.id}')">✕</button></td>` : '';
    return `
    <tr onclick="openStudentModal('${s.id}')">
        <td style="color:var(--text2)">${num}</td>
        <td style="font-weight:500">${escHtml(s.name)}</td>
        <td>${e1}</td>
        <td>${e2}</td>
        <td>${bestBadge}</td>
        ${deleteBtn}
    </tr>`;
}

// ─── All Students View ───────────────────────────────────
function renderStudentsView() {
    const q = document.getElementById('studentSearch')?.value.toLowerCase() || '';
    const filtered = db.students.filter(s =>
        s.name.toLowerCase().includes(q) || s.cls.toLowerCase().includes(q)
    );
    const container = document.getElementById('allStudentTable');
    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">👨‍🎓</div><div class="empty-text">${q ? t('nothingFound') : t('noStudentsYet')}</div></div>`;
        return;
    }
    container.innerHTML = `
    <div class="student-table">
    <table>
    <thead><tr>
        <th>${t('colNum')}</th><th>${t('colName')}</th><th>${t('colGroup')}</th>
        <th>${t('colEnt1')}</th><th>${t('colEnt2')}</th><th>${t('colBestScore')}</th>
    </tr></thead>
    <tbody>
    ${filtered.map((s, i) => `
    <tr onclick="openStudentModal('${s.id}')">
        <td style="color:var(--text2)">${i+1}</td>
        <td style="font-weight:500">${escHtml(s.name)}</td>
        <td><span class="badge badge-gray">${escHtml(s.cls)}</span></td>
        <td>${s.ent1 ? `<span class="badge badge-green">${s.ent1.score}</span>` : '<span class="badge badge-gray">—</span>'}</td>
        <td>${s.ent2 ? `<span class="badge badge-yellow">${s.ent2.score}</span>` : '<span class="badge badge-gray">—</span>'}</td>
        <td>${Math.max(s.ent1?.score??0, s.ent2?.score??0) > 0 ? `<span class="badge badge-green">${Math.max(s.ent1?.score??0, s.ent2?.score??0)}</span>` : '<span class="badge badge-gray">—</span>'}</td>
    </tr>`).join('')}
    </tbody>
    </table>
    </div>`;
}

// ─── Student Modal ────────────────────────────────────────
function openStudentModal(id) {
    currentStudent = db.students.find(s => s.id === id);
    if (!currentStudent) return;
    document.getElementById('modal-student-name').textContent = currentStudent.name;
    document.getElementById('modal-student-cls').textContent = t('groupLabel') + currentStudent.cls;
    renderENTCards();
    const delBtn = document.getElementById('delete-student-btn');
    if (delBtn) {
        delBtn.style.display = isAdmin ? '' : 'none';
        delBtn.textContent = t('deleteStudentBtn');
    }
    document.getElementById('modal-student').classList.add('open');
}

function renderENTCards() {
    [1, 2].forEach(n => {
        const ent = currentStudent[`ent${n}`];
        const container = document.getElementById(`ent${n}-content`);
        const titleEl = document.getElementById(`ent${n}-title`);
        if (titleEl) titleEl.textContent = t(`entAttempt${n}`);
        if (ent) {
            container.innerHTML = `
            <div class="ent-score">${ent.score} <span>/ 140</span></div>
            ${ent.photo ? `<img class="ent-photo" src="${ent.photo}" alt="ENT${n}" onclick="openLightbox('${ent.photo}')">` : `<div class="ent-empty">${t('noPhotoUploaded')}</div>`}
            ${isAdmin ? `<button class="btn btn-danger btn-sm" style="width:100%;margin-top:8px" onclick="deleteENT(${n})">${t('deleteResult')}</button>` : ''}`;
        } else {
            container.innerHTML = `<div class="ent-empty">${t('noResultUploaded')}</div>`;
        }
        const uploadBtn = document.getElementById(`upload-btn-${n}`);
        if (uploadBtn) {
            uploadBtn.style.display = isAdmin ? '' : 'none';
            uploadBtn.textContent = t('uploadBtn');
        }
    });
}

function closeStudentModal() {
    document.getElementById('modal-student').classList.remove('open');
    currentStudent = null;
}

async function deleteCurrentStudent() {
    if (!isAdmin || !currentStudent) return;
    if (!confirm(t('confirmDeleteStudent', { name: currentStudent.name }))) return;
    await fetch('/api/student/' + currentStudent.id, {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    closeStudentModal();
    await load();
}

async function deleteStudent(id) {
    if (!isAdmin) return;
    const s = db.students.find(s => s.id === id);
    if (!confirm(t('confirmDeleteStudent', { name: s?.name }))) return;
    await fetch('/api/student/' + id, {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    await load();
}

// ─── Upload ENT ──────────────────────────────────────────
function openUploadModal(attempt) {
    if (!isAdmin) return;
    uploadAttempt = attempt;
    uploadPhotoBase64 = null;
    document.getElementById('upload-title').textContent = t('uploadAttempt') + attempt;
    document.getElementById('upload-score').value = '';
    document.getElementById('upload-preview-wrap').innerHTML = `<div>${t('clickToSelectPhoto')}</div><div style="font-size:11px;color:var(--text3);margin-top:4px">${t('photoFormats')}</div>`;
    document.getElementById('modal-upload').classList.add('open');
    // Включаем слушатель вставки Ctrl+V
    document.addEventListener('paste', handlePastePhoto);
}

function closeUploadModal() {
    document.getElementById('modal-upload').classList.remove('open');
    uploadAttempt = null;
    // Убираем слушатель вставки при закрытии
    document.removeEventListener('paste', handlePastePhoto);
}

function handlePastePhoto(event) {
    const modal = document.getElementById('modal-upload');
    if (!modal.classList.contains('open')) return;
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = e => {
                uploadPhotoBase64 = e.target.result;
                document.getElementById('upload-preview-wrap').innerHTML =
                    `<img src="${uploadPhotoBase64}" style="width:100%;border-radius:6px;max-height:180px;object-fit:contain">`;
            };
            reader.readAsDataURL(file);
            break;
        }
    }
}

function previewUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        uploadPhotoBase64 = e.target.result;
        document.getElementById('upload-preview-wrap').innerHTML = `<img src="${uploadPhotoBase64}" style="width:100%;border-radius:6px;max-height:180px;object-fit:contain">`;
    };
    reader.readAsDataURL(file);
}

async function saveENT() {
    if (!isAdmin) return;
    const score = parseInt(document.getElementById('upload-score').value);
    if (isNaN(score) || score < 0 || score > 140) { alert(t('invalidScore')); return; }
    if (!uploadPhotoBase64) { alert(t('noPhotoAlert')); return; }
    await fetch(`/api/student/${currentStudent.id}/ent/${uploadAttempt}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ score, photo: uploadPhotoBase64 })
    });
    closeUploadModal();
    await load();
    currentStudent = db.students.find(s => s.id === currentStudent.id);
    renderENTCards();
}

async function deleteENT(attempt) {
    if (!isAdmin) return;
    if (!confirm(t('confirmDeleteResult', { n: attempt }))) return;
    await fetch(`/api/student/${currentStudent.id}/ent/${attempt}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    await load();
    currentStudent = db.students.find(s => s.id === currentStudent.id);
    renderENTCards();
}

// ─── Add Student Modal ────────────────────────────────────
function openAddStudentModal() {
    if (!isAdmin) return;
    const sel = document.getElementById('newStudentCls');
    sel.innerHTML = db.classes.map(c => `<option value="${escHtml(c.name)}">${escHtml(c.name)}</option>`).join('');
    if (currentClassDetail) sel.value = currentClassDetail;
    document.getElementById('newStudentName').value = '';
    document.getElementById('modal-add-student').classList.add('open');
}
function closeAddStudentModal() {
    document.getElementById('modal-add-student').classList.remove('open');
}
async function saveNewStudent() {
    if (!isAdmin) return;
    const name = document.getElementById('newStudentName').value.trim();
    const cls = document.getElementById('newStudentCls').value;
    if (!name) { alert(t('fioRequired')); return; }
    if (!cls) { alert(t('groupRequired')); return; }
    await fetch('/api/student', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ name, cls })
    });
    closeAddStudentModal();
    await load();
    if (currentClassDetail) renderClassDetail(currentClassDetail);
}

// ─── Lightbox ─────────────────────────────────────────────
function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

// ─── Excel Export ─────────────────────────────────────────
function exportGroupExcel() {
    if (!currentClassDetail) return;
    const students = db.students.filter(s => s.cls === currentClassDetail);
    if (!students.length) { alert(t('noStudentsExport')); return; }
    const wb = XLSX.utils.book_new();
    const rows = [['№', t('colName'), t('colGroup')]];
    students.forEach((s, i) => rows.push([i + 1, s.name, s.cls]));
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, currentClassDetail.slice(0, 31));
    XLSX.writeFile(wb, `${currentClassDetail}.xlsx`);
}

function exportAllExcel() {
    if (!db.students.length) { alert(t('noStudentsAllExport')); return; }
    const wb = XLSX.utils.book_new();
    const allRows = [['№', t('colName'), t('colGroup')]];
    db.students.forEach((s, i) => allRows.push([i + 1, s.name, s.cls]));
    const wsSummary = XLSX.utils.aoa_to_sheet(allRows);
    wsSummary['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, t('allStudentsTitle'));

    const usedNames = new Set([t('allStudentsTitle')]);
    const classNames = db.classes.length
        ? db.classes.map(c => c.name)
        : [...new Set(db.students.map(s => s.cls))];

    classNames.forEach(clsName => {
        const students = db.students.filter(s => s.cls === clsName);
        if (!students.length) return;
        let sheetName = clsName.slice(0, 31);
        let counter = 1;
        while (usedNames.has(sheetName)) {
            const suffix = `(${++counter})`;
            sheetName = clsName.slice(0, 31 - suffix.length) + suffix;
        }
        usedNames.add(sheetName);
        const rows = [['№', t('colName'), t('colGroup')]];
        students.forEach((s, i) => rows.push([i + 1, s.name, s.cls]));
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'students_all.xlsx');
}

// ─── Import Excel ─────────────────────────────────────────
let importRows = [];

function importExcel(event) {
    if (!isAdmin) return;
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const wb = XLSX.read(e.target.result, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            if (raw.length < 2) { alert(t('importFileEmpty')); return; }

            const header = raw[0].map(h => String(h).trim().toLowerCase());
            let nameCol = -1, clsCol = -1;
            header.forEach((h, i) => {
                if (/фио|аты|имя|name|ф\.и\.о|full/i.test(h)) nameCol = i;
                if (/груп|топ|класс|class|group/i.test(h)) clsCol = i;
            });
            if (nameCol === -1) nameCol = 0;
            if (clsCol === -1) clsCol = 1;

            const existingNames = new Set(db.students.map(s => s.name.trim().toLowerCase()));
            importRows = [];
            raw.slice(1).forEach(row => {
                const name = String(row[nameCol] || '').trim();
                const cls  = String(row[clsCol]  || '').trim();
                if (!name) return;
                const duplicate = existingNames.has(name.toLowerCase());
                importRows.push({ name, cls, duplicate });
            });
            showImportPreview();
        } catch(err) {
            alert(t('importReadError') + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
    document.getElementById('modal-import').classList.add('open');
}

function showImportPreview() {
    const preview = document.getElementById('import-preview');
    const empty = document.getElementById('import-empty');
    const body = document.getElementById('import-preview-body');
    const countEl = document.getElementById('import-count');
    const warnEl = document.getElementById('import-warn');
    const btn = document.getElementById('import-confirm-btn');

    if (!importRows.length) {
        preview.style.display = 'none';
        empty.style.display = 'block';
        empty.textContent = t('importEmpty');
        btn.style.display = 'none';
        return;
    }
    const dups = importRows.filter(r => r.duplicate).length;
    const newOnes = importRows.filter(r => !r.duplicate).length;

    preview.style.display = 'block';
    empty.style.display = 'none';
    countEl.textContent = t('importFound', { total: importRows.length, new: newOnes });
    warnEl.textContent = dups > 0 ? t('importDuplicates', { n: dups }) : '';
    btn.style.display = newOnes > 0 ? 'inline-flex' : 'none';
    btn.textContent = t('importConfirmBtn', { n: newOnes });

    // Update table headers
    const ths = document.querySelectorAll('#modal-import thead th');
    if (ths[0]) ths[0].textContent = t('importColFio');
    if (ths[1]) ths[1].textContent = t('importColGroup');
    if (ths[2]) ths[2].textContent = t('statusCol');

    body.innerHTML = importRows.map(r => `
        <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:9px 14px;font-size:13px">${escHtml(r.name)}</td>
            <td style="padding:9px 14px;font-size:13px">
                ${r.cls ? `<span class="badge badge-gray">${escHtml(r.cls)}</span>` : '<span style="color:var(--text3)">—</span>'}
            </td>
            <td style="padding:9px 14px;font-size:12px">
                ${r.duplicate
                    ? `<span class="badge badge-red">${t('alreadyExists')}</span>`
                    : `<span class="badge badge-green">${t('isNew')}</span>`}
            </td>
        </tr>`).join('');
}

async function confirmImport() {
    if (!isAdmin) return;
    const toAdd = importRows.filter(r => !r.duplicate);
    if (!toAdd.length) return;

    const existingClasses = new Set(db.classes.map(c => c.name));
    const newClasses = [...new Set(toAdd.map(r => r.cls).filter(c => c && !existingClasses.has(c)))];
    for (const cls of newClasses) {
        await fetch('/api/class', {
            method: 'POST',
            headers: getAdminHeaders(),
            body: JSON.stringify({ name: cls })
        });
    }
    for (const row of toAdd) {
        await fetch('/api/student', {
            method: 'POST',
            headers: getAdminHeaders(),
            body: JSON.stringify({ name: row.name, cls: row.cls })
        });
    }

    closeImportModal();
    await load();
    const classesMsg = newClasses.length ? t('importNewClasses', { n: newClasses.length }) : '';
    alert(t('importSuccess', { students: toAdd.length, classes: classesMsg }));
}

function closeImportModal() {
    document.getElementById('modal-import').classList.remove('open');
    importRows = [];
    document.getElementById('import-preview').style.display = 'none';
    const empty = document.getElementById('import-empty');
    empty.style.display = 'block';
    empty.textContent = t('importSelectFile');
    document.getElementById('import-confirm-btn').style.display = 'none';
}

async function confirmReset() {
    if (!isAdmin) return;
    if (!confirm(t('resetConfirm'))) return;
    await fetch('/api/reset', {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    await load();
    setView('dashboard');
}

// ─── Utils ────────────────────────────────────────────────
function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
