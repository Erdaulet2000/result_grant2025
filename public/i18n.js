// ─── i18n / Locale ────────────────────────────────────────
const TRANSLATIONS = {
  ru: {
    // Sidebar
    schoolAdmin: 'School Admin',
    entJournal: 'ЕНТ Журнал',
    dashboard: 'Dashboard',
    groups: 'Группы',
    allStudents: 'Все ученики',
    adminMode: '🔐 Режим Admin',
    lightTheme: '☀️ Светлая тема',
    darkTheme: '🌙 Тёмная тема',
    loginAsAdmin: '🔑 Войти как Admin',
    logoutAdmin: '🚪 Выйти из Admin',
    resetAll: '🗑 Сбросить всё',
    // Dashboard
    dashboardTitle: 'Dashboard',
    dashboardSub: 'Общая статистика школы',
    statGroups: 'Групп',
    statStudents: 'Учеников',
    statEnt1: 'Сдали ЕНТ 1',
    statEnt2: 'Сдали ЕНТ 2',
    noGroups: 'Нет групп',
    noGroupsSub: 'Добавьте первую группу во вкладке «Группы»',
    // Groups
    groupsTitle: 'Группы',
    groupsSub: 'Управление классами и группами',
    groupNameLabel: 'Название группы',
    groupNamePlaceholder: 'Напр. 11А или Группа-3',
    addGroup: '+ Добавить группу',
    noGroupsYet: 'Групп пока нет',
    clickToView: ' учеников · нажмите для просмотра',
    deleteBtn: 'Удалить',
    // Class Detail
    importExcel: '📤 Импорт Excel',
    exportExcel: '📥 Excel',
    addStudent: '+ Ученик',
    noStudentsInGroup: 'В этой группе нет учеников',
    noStudentsAdmin: 'Нажмите «+ Ученик» чтобы добавить',
    noStudentsGuest: 'Учеников пока нет',
    colNum: '#',
    colName: 'ФИО',
    colEnt1: 'ЕНТ 1',
    colEnt2: 'ЕНТ 2',
    colBest: 'Итог',
    students: ' учеников',
    // All Students
    allStudentsTitle: 'Все ученики',
    allStudentsSub: 'Список всех учеников школы',
    importExcelBtn: '📤 Импорт Excel',
    exportAllExcel: '📥 Экспорт Excel',
    searchPlaceholder: 'Поиск по имени или группе...',
    colGroup: 'Группа',
    colBestScore: 'Лучший балл',
    nothingFound: 'Ничего не найдено',
    noStudentsYet: 'Учеников пока нет',
    // Admin Login Modal
    adminLoginTitle: '🔑 Вход для администратора',
    adminLoginDesc: 'Введите пароль, чтобы получить доступ к редактированию данных.',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    wrongPassword: '❌ Неверный пароль',
    cancelBtn: 'Отмена',
    loginBtn: 'Войти',
    // Student Modal
    groupLabel: 'Группа: ',
    entAttempt1: 'ЕНТ — Попытка 1',
    entAttempt2: 'ЕНТ — Попытка 2',
    uploadBtn: '📤 Загрузить',
    noResultUploaded: 'Результат не загружен',
    noPhotoUploaded: 'Фото не загружено',
    deleteResult: 'Удалить результат',
    deleteStudentBtn: '🗑 Удалить ученика',
    confirmDeleteStudent: 'Удалить ученика «{name}»?',
    confirmDeleteResult: 'Удалить результат ЕНТ {n}?',
    // Upload Modal
    uploadTitle: 'Загрузить результат ЕНТ',
    uploadAttempt: 'ЕНТ — Попытка ',
    scoreLabel: 'Балл (0–140)',
    scorePlaceholder: 'Введите балл',
    photoLabel: 'Фото результата',
    clickToSelectPhoto: '📷 Нажмите для выбора фото',
    photoFormats: 'JPG, PNG, WEBP',
    saveBtn: 'Сохранить',
    invalidScore: 'Введите корректный балл (0–140)',
    noPhotoAlert: 'Пожалуйста, загрузите фото результата',
    // Add Student Modal
    addStudentTitle: 'Добавить ученика',
    studentFioLabel: 'ФИО ученика',
    studentFioPlaceholder: 'Иванов Иван Иванович',
    groupSelectLabel: 'Группа',
    addBtn: 'Добавить',
    fioRequired: 'Введите ФИО',
    groupRequired: 'Выберите группу',
    // Import Modal
    importTitle: '📤 Импорт учеников из Excel',
    importSubtitle: 'Колонки: ФИО и Группа (в любом порядке)',
    importFormatTitle: '📋 Формат файла:',
    importFormatLine1: '• Первая строка — заголовки (ФИО, Группа)',
    importFormatLine2: '• Со второй строки — ученики',
    importFormatExample: 'Пример:',
    importColFio: 'ФИО',
    importColGroup: 'Группа',
    importExample1: 'Иванов Иван Иванович',
    importExample2: 'Петрова Анна',
    importExampleGroup1: '11А',
    importExampleGroup2: '11Б',
    importSelectFile: 'Выберите файл Excel для предпросмотра',
    importFound: 'Найдено: {total} учеников (новых: {new})',
    importDuplicates: '⚠️ {n} уже существуют — будут пропущены',
    importConfirmBtn: '✅ Загрузить {n} учеников',
    alreadyExists: 'Уже есть',
    isNew: 'Новый',
    statusCol: 'Статус',
    importEmpty: 'Не найдено ни одного ученика в файле',
    importReadError: 'Ошибка чтения файла: ',
    importFileEmpty: 'Файл пустой или нет данных',
    importSuccess: '✅ Загружено {students} учеников{classes}',
    importNewClasses: ' и создано {n} новых групп',
    // Classes
    deleteClassConfirm: 'Удалить группу «{name}» и всех её учеников?',
    noStudentsExport: 'В этой группе нет учеников',
    noStudentsAllExport: 'Нет учеников для экспорта',
    resetConfirm: 'Сбросить ВСЕ данные? Это действие нельзя отменить.',
    // Page title
    pageTitle: 'ЕНТ — Школьный журнал',
  },
  kk: {
    // Sidebar
    schoolAdmin: 'School Admin',
    entJournal: 'ҰБТ Журналы',
    dashboard: 'Басқару тақтасы',
    groups: 'Топтар',
    allStudents: 'Барлық оқушылар',
    adminMode: '🔐 Admin режимі',
    lightTheme: '☀️ Жарық тақырып',
    darkTheme: '🌙 Қараңғы тақырып',
    loginAsAdmin: '🔑 Admin ретінде кіру',
    logoutAdmin: '🚪 Adminнен шығу',
    resetAll: '🗑 Барлығын тазалау',
    // Dashboard
    dashboardTitle: 'Басқару тақтасы',
    dashboardSub: 'Мектептің жалпы статистикасы',
    statGroups: 'Топтар',
    statStudents: 'Оқушылар',
    statEnt1: 'ҰБТ 1 тапсырды',
    statEnt2: 'ҰБТ 2 тапсырды',
    noGroups: 'Топтар жоқ',
    noGroupsSub: '«Топтар» бөлімінде бірінші топты қосыңыз',
    // Groups
    groupsTitle: 'Топтар',
    groupsSub: 'Сыныптар мен топтарды басқару',
    groupNameLabel: 'Топ атауы',
    groupNamePlaceholder: 'Мыс. 11А немесе Топ-3',
    addGroup: '+ Топ қосу',
    noGroupsYet: 'Топтар әлі жоқ',
    clickToView: ' оқушы · қарау үшін басыңыз',
    deleteBtn: 'Жою',
    // Class Detail
    importExcel: '📤 Excel импорты',
    exportExcel: '📥 Excel',
    addStudent: '+ Оқушы',
    noStudentsInGroup: 'Бұл топта оқушылар жоқ',
    noStudentsAdmin: '«+ Оқушы» батырмасын басып қосыңыз',
    noStudentsGuest: 'Оқушылар әлі жоқ',
    colNum: '#',
    colName: 'Аты-жөні',
    colEnt1: 'ҰБТ 1',
    colEnt2: 'ҰБТ 2',
    colBest: 'Нәтиже',
    students: ' оқушы',
    // All Students
    allStudentsTitle: 'Барлық оқушылар',
    allStudentsSub: 'Мектептің барлық оқушылар тізімі',
    importExcelBtn: '📤 Excel импорты',
    exportAllExcel: '📥 Excel экспорты',
    searchPlaceholder: 'Аты немесе топ бойынша іздеу...',
    colGroup: 'Топ',
    colBestScore: 'Үздік балл',
    nothingFound: 'Ештеңе табылмады',
    noStudentsYet: 'Оқушылар әлі жоқ',
    // Admin Login Modal
    adminLoginTitle: '🔑 Администратор кіруі',
    adminLoginDesc: 'Деректерді өңдеуге қол жеткізу үшін құпиясөзді енгізіңіз.',
    passwordLabel: 'Құпиясөз',
    passwordPlaceholder: 'Құпиясөзді енгізіңіз',
    wrongPassword: '❌ Қате құпиясөз',
    cancelBtn: 'Болдырмау',
    loginBtn: 'Кіру',
    // Student Modal
    groupLabel: 'Топ: ',
    entAttempt1: 'ҰБТ — 1-ші әрекет',
    entAttempt2: 'ҰБТ — 2-ші әрекет',
    uploadBtn: '📤 Жүктеу',
    noResultUploaded: 'Нәтиже жүктелмеген',
    noPhotoUploaded: 'Фото жүктелмеген',
    deleteResult: 'Нәтижені жою',
    deleteStudentBtn: '🗑 Оқушыны жою',
    confirmDeleteStudent: '«{name}» оқушысын жою керек пе?',
    confirmDeleteResult: 'ҰБТ {n} нәтижесін жою керек пе?',
    // Upload Modal
    uploadTitle: 'ҰБТ нәтижесін жүктеу',
    uploadAttempt: 'ҰБТ — ',
    scoreLabel: 'Балл (0–140)',
    scorePlaceholder: 'Баллды енгізіңіз',
    photoLabel: 'Нәтиже фотосы',
    clickToSelectPhoto: '📷 Фото таңдау үшін басыңыз',
    photoFormats: 'JPG, PNG, WEBP',
    saveBtn: 'Сақтау',
    invalidScore: 'Дұрыс балл енгізіңіз (0–140)',
    noPhotoAlert: 'Нәтиже фотосын жүктеңіз',
    // Add Student Modal
    addStudentTitle: 'Оқушы қосу',
    studentFioLabel: 'Оқушының аты-жөні',
    studentFioPlaceholder: 'Иванов Иван Иванович',
    groupSelectLabel: 'Топ',
    addBtn: 'Қосу',
    fioRequired: 'Аты-жөнін енгізіңіз',
    groupRequired: 'Топты таңдаңыз',
    // Import Modal
    importTitle: '📤 Excel-ден оқушыларды импорттау',
    importSubtitle: 'Бағандар: Аты-жөні және Топ (кез келген ретпен)',
    importFormatTitle: '📋 Файл форматы:',
    importFormatLine1: '• Бірінші жол — тақырыптар (Аты-жөні, Топ)',
    importFormatLine2: '• Екінші жолдан бастап — оқушылар',
    importFormatExample: 'Мысал:',
    importColFio: 'Аты-жөні',
    importColGroup: 'Топ',
    importExample1: 'Иванов Иван Иванович',
    importExample2: 'Петрова Анна',
    importExampleGroup1: '11А',
    importExampleGroup2: '11Б',
    importSelectFile: 'Алдын ала қарау үшін Excel файлын таңдаңыз',
    importFound: 'Табылды: {total} оқушы (жаңа: {new})',
    importDuplicates: '⚠️ {n} оқушы бар — өткізіп жіберіледі',
    importConfirmBtn: '✅ {n} оқушы жүктеу',
    alreadyExists: 'Бар',
    isNew: 'Жаңа',
    statusCol: 'Күй',
    importEmpty: 'Файлда оқушылар табылмады',
    importReadError: 'Файлды оқу қатесі: ',
    importFileEmpty: 'Файл бос немесе деректер жоқ',
    importSuccess: '✅ {students} оқушы жүктелді{classes}',
    importNewClasses: ' және {n} жаңа топ жасалды',
    // Classes
    deleteClassConfirm: '«{name}» тобын және барлық оқушыларын жою керек пе?',
    noStudentsExport: 'Бұл топта оқушылар жоқ',
    noStudentsAllExport: 'Экспорт үшін оқушылар жоқ',
    resetConfirm: 'БАРЛЫҚ деректерді тазалау керек пе? Бұл әрекетті болдырмау мүмкін емес.',
    // Page title
    pageTitle: 'ҰБТ — Мектеп журналы',
  }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function t(key, vars) {
  const str = (TRANSLATIONS[currentLang] || TRANSLATIONS.ru)[key] || key;
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : `{${k}}`);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyLangUI();
  renderAll();
}

function applyLangUI() {
  // Update lang toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  // Update static labels
  document.querySelector('.logo-sub').textContent = t('entJournal');
  document.getElementById('theme-label').textContent =
    document.body.classList.contains('light') ? t('lightTheme') : t('darkTheme');

  // Nav buttons
  const navBtns = document.querySelectorAll('.nav-btn');
  if (navBtns[0]) navBtns[0].innerHTML = `<span class="icon">📊</span> ${t('dashboard')}`;
  if (navBtns[1]) navBtns[1].innerHTML = `<span class="icon">🏫</span> ${t('groups')}`;
  if (navBtns[2]) navBtns[2].innerHTML = `<span class="icon">👨‍🎓</span> ${t('allStudents')}`;

  // Admin badge
  const badge = document.getElementById('admin-badge');
  if (badge) badge.querySelector('span').textContent = t('adminMode');

  // Admin buttons
  const loginBtn = document.getElementById('admin-login-btn');
  if (loginBtn) loginBtn.textContent = t('loginAsAdmin');
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) logoutBtn.innerHTML = t('logoutAdmin');
  const resetBtn = document.querySelector('.sidebar-reset');
  if (resetBtn) resetBtn.textContent = t('resetAll');

  // Page title
  document.title = t('pageTitle');

  // Dashboard
  const dashTitle = document.querySelector('#view-dashboard .page-title');
  if (dashTitle) dashTitle.textContent = t('dashboardTitle');
  const dashSub = document.querySelector('#view-dashboard .page-sub');
  if (dashSub) dashSub.textContent = t('dashboardSub');
  const statLabels = document.querySelectorAll('#view-dashboard .stat-label');
  const labelKeys = ['statGroups','statStudents','statEnt1','statEnt2'];
  statLabels.forEach((el, i) => { if (labelKeys[i]) el.textContent = t(labelKeys[i]); });

  // Groups view
  const grpTitle = document.querySelector('#view-classes .page-title');
  if (grpTitle) grpTitle.textContent = t('groupsTitle');
  const grpSub = document.querySelector('#view-classes .page-sub');
  if (grpSub) grpSub.textContent = t('groupsSub');
  const grpLabel = document.querySelector('#view-classes .form-group label');
  if (grpLabel) grpLabel.textContent = t('groupNameLabel');
  const grpInput = document.getElementById('className');
  if (grpInput) grpInput.placeholder = t('groupNamePlaceholder');
  const addGrpBtn = document.querySelector('#view-classes .btn-primary');
  if (addGrpBtn) addGrpBtn.textContent = t('addGroup');

  // All students view
  const allTitle = document.querySelector('#view-students .page-title');
  if (allTitle) allTitle.textContent = t('allStudentsTitle');
  const allSub = document.querySelector('#view-students .page-sub');
  if (allSub) allSub.textContent = t('allStudentsSub');
  const searchInput = document.getElementById('studentSearch');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
  const importBtn2 = document.querySelector('#view-students .btn-primary');
  if (importBtn2) importBtn2.textContent = t('importExcelBtn');
  const exportAllBtn = document.querySelector('#view-students .btn-ghost');
  if (exportAllBtn) exportAllBtn.textContent = t('exportAllExcel');

  // Admin login modal
  document.querySelector('#modal-admin-login .modal-title').textContent = t('adminLoginTitle');
  const loginDesc = document.querySelector('#modal-admin-login [style*="color:var(--text2)"]');
  if (loginDesc) loginDesc.textContent = t('adminLoginDesc');
  const pwdLabel = document.querySelector('#modal-admin-login label');
  if (pwdLabel) pwdLabel.textContent = t('passwordLabel');
  const pwdInput = document.getElementById('admin-pwd-input');
  if (pwdInput) pwdInput.placeholder = t('passwordPlaceholder');
  const loginModalBtns = document.querySelectorAll('#modal-admin-login .btn');
  if (loginModalBtns[0]) loginModalBtns[0].textContent = t('cancelBtn');
  if (loginModalBtns[1]) loginModalBtns[1].textContent = t('loginBtn');

  // Upload modal static parts
  const scoreLabel = document.querySelector('#modal-upload label:first-of-type');
  if (scoreLabel) scoreLabel.textContent = t('scoreLabel');
  const scoreInput = document.getElementById('upload-score');
  if (scoreInput) scoreInput.placeholder = t('scorePlaceholder');
  const uploadModalBtns = document.querySelectorAll('#modal-upload .btn');
  if (uploadModalBtns[0]) uploadModalBtns[0].textContent = t('cancelBtn');
  if (uploadModalBtns[1]) uploadModalBtns[1].textContent = t('saveBtn');

  // Add student modal
  document.querySelector('#modal-add-student .modal-title').textContent = t('addStudentTitle');
  const fioLabel = document.querySelector('#modal-add-student label');
  if (fioLabel) fioLabel.textContent = t('studentFioLabel');
  const fioInput = document.getElementById('newStudentName');
  if (fioInput) fioInput.placeholder = t('studentFioPlaceholder');
  const grpSelectLabel = document.querySelectorAll('#modal-add-student label')[1];
  if (grpSelectLabel) grpSelectLabel.textContent = t('groupSelectLabel');
  const addStudentBtns = document.querySelectorAll('#modal-add-student .btn');
  if (addStudentBtns[0]) addStudentBtns[0].textContent = t('cancelBtn');
  if (addStudentBtns[1]) addStudentBtns[1].textContent = t('addBtn');

  // Import modal
  document.querySelector('#modal-import .modal-title').textContent = t('importTitle');
}
