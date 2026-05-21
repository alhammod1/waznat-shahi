// ── State ──────────────────────────────────────────
const state = {
    mode: 'water',
    sugarPerLiter: 75,
    teaPerLiter: 12,
    isBlend: false,
    blendType: 'medium',
    waterMl: 0,
    sugarGrams: 0,
    teaGrams: 0
};

const BLEND = { rabea: 9, abuJabal: 1, alWazah: 1, khather: 1, total: 12 };
const CUP_ML = 73;
const SUGAR_CUP = 84;  // max grams shown in glass
const TEA_CUP = 21;    // max grams shown in glass

// ── Elements ───────────────────────────────────────
const mainInput   = document.getElementById('mainInput');
const waterSlider = document.getElementById('waterSlider');
const inputLabel  = document.getElementById('inputLabel');
const inputUnit   = document.getElementById('inputUnit');
const sliderWrap  = document.getElementById('sliderWrap');
const resultCard  = document.getElementById('resultCard');
const blendDetail = document.getElementById('blendDetail');

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadHistory();
    waterSlider.addEventListener('input', onSlider);
    mainInput.addEventListener('input', onInputChange);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    updateSliderGradient();
});

// ── Mode ───────────────────────────────────────────
const MODE_LABELS = { water: 'أدخل كمية الماء', sugar: 'أدخل كمية السكر', tea: 'أدخل كمية الشاي' };
const MODE_UNITS  = { water: 'مل', sugar: 'جم', tea: 'جم' };

function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    inputLabel.textContent = MODE_LABELS[mode];
    inputUnit.textContent  = MODE_UNITS[mode];
    sliderWrap.style.display = mode === 'water' ? 'flex' : 'none';
    mainInput.value = '';
    clearDisplay();
}

// ── Sugar / Tea buttons ────────────────────────────
function selectSugar(btn, isBlend) {
    // Remove active from all sugar/blend buttons
    document.querySelectorAll('#sugarGroup button, #blendGroup button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.sugarPerLiter = parseFloat(btn.dataset.value);
    state.isBlend = isBlend;
    if (isBlend) {
        state.blendType = btn.dataset.blendType;
    } else {
        state.blendType = btn.dataset.value === '57' ? 'light' : btn.dataset.value === '75' ? 'medium' : 'heavy';
    }
    calculate();
}

function selectTea(btn) {
    document.querySelectorAll('#teaGroup button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.teaPerLiter = parseFloat(btn.dataset.value);
    calculate();
}

// ── Input handlers ─────────────────────────────────
function onInputChange() {
    const raw = mainInput.value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    if (raw.trim() === '0812') {
        openEasterEgg();
        mainInput.value = '';
        clearDisplay();
        return;
    }
    const v = parseFloat(normalizeInput(mainInput.value));
    if (!isNaN(v) && state.mode === 'water') {
        waterSlider.value = Math.min(v, 10000);
        updateSliderGradient();
    }
    calculate();
}

function onSlider() {
    mainInput.value = waterSlider.value;
    updateSliderGradient();
    calculate();
}

function updateSliderGradient() {
    const pct = (waterSlider.value / waterSlider.max) * 100;
    waterSlider.style.setProperty('--fill', pct + '%');
}

function clearInput() {
    mainInput.value = '';
    if (state.mode === 'water') { waterSlider.value = 0; updateSliderGradient(); }
    clearDisplay();
}

function normalizeInput(str) {
    return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d.]/g, '');
}

// ── Core Calculate ─────────────────────────────────
function calculate() {
    const raw = parseFloat(normalizeInput(mainInput.value));
    if (isNaN(raw) || raw <= 0) { clearDisplay(); return; }

    let teaMult = state.isBlend
        ? (state.blendType === 'heavy' ? BLEND.total + 1 : BLEND.total)
        : state.teaPerLiter;

    let w, s, t;
    if (state.mode === 'water') {
        w = raw;
        s = (state.sugarPerLiter * w) / 1000;
        t = (teaMult * w) / 1000;
    } else if (state.mode === 'sugar') {
        s = raw;
        w = (s * 1000) / state.sugarPerLiter;
        t = (teaMult * w) / 1000;
    } else {
        t = raw;
        w = (t * 1000) / teaMult;
        s = (state.sugarPerLiter * w) / 1000;
    }

    state.waterMl   = Math.max(0, w);
    state.sugarGrams = Math.max(0, s);
    state.teaGrams  = Math.max(0, t);

    updateDisplay();
}

// ── Update Display ─────────────────────────────────
function fmt(n) {
    if (typeof n !== 'number') return '0';
    const s = n.toFixed(2).replace(/\.0+$/, '').replace(/(\.\d)0$/, '$1');
    return s;
}

function updateDisplay() {
    const { waterMl, sugarGrams, teaGrams } = state;

    // Result card
    document.getElementById('resWater').textContent = fmt(waterMl);
    document.getElementById('resSugar').textContent = fmt(sugarGrams);
    document.getElementById('resTea').textContent   = fmt(teaGrams);
    resultCard.classList.add('visible');

    // Blend detail
    if (state.isBlend && teaGrams > 0) {
        const blendTotal = state.blendType === 'heavy' ? BLEND.total + 1 : BLEND.total;
        const ratio = teaGrams / blendTotal;
        document.getElementById('rabeaGrams').textContent   = fmt(BLEND.rabea   * ratio);
        document.getElementById('abuJabalGrams').textContent = fmt(BLEND.abuJabal * ratio);
        document.getElementById('alWazahGrams').textContent  = fmt(BLEND.alWazah  * ratio);
        document.getElementById('khatherGrams').textContent  = fmt(BLEND.khather  * ratio);
        blendDetail.classList.add('visible');
    } else {
        blendDetail.classList.remove('visible');
    }

    // Cup notes
    const sugarFullCups     = Math.floor(sugarGrams / SUGAR_CUP);
    const sugarRemainder    = sugarGrams % SUGAR_CUP;
    const teaFullCups       = Math.floor(teaGrams / TEA_CUP);
    const teaRemainder      = teaGrams % TEA_CUP;

    const sugarNote = document.getElementById('sugarNote');
    const teaNote   = document.getElementById('teaNote');
    document.getElementById('sugarCups').textContent     = fmt(sugarFullCups);
    document.getElementById('sugarRemainder').textContent = fmt(sugarRemainder);
    document.getElementById('teaCups').textContent       = fmt(teaFullCups);
    document.getElementById('teaRemainder').textContent   = fmt(teaRemainder);
    sugarNote.classList.add('visible');
    teaNote.classList.add('visible');

    // Cup fill animation
    setPointer('sugarPointer', (sugarRemainder <= 0.005 && sugarFullCups > 0) ? 100 : (sugarRemainder / SUGAR_CUP) * 100);
    setPointer('teaPointer',   (teaRemainder <= 0.005 && teaFullCups > 0) ? 100 : (teaRemainder / TEA_CUP) * 100);
}

function setPointer(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    const track = { top: 28.9, bottom: 71.3 };
    const safePct = Math.max(0, Math.min(100, pct));
    const pos = track.bottom - ((track.bottom - track.top) * (safePct / 100));
    el.style.top = Math.max(track.top, Math.min(track.bottom, pos)) + "%";
}

function fillCup(id, grams, fullCups, remainder, maxPerCup) {
    const el = document.getElementById(id);
    if (!el) return;
    const cupHeight = 190; // usable fill height in SVG units

    let pct;
    if (grams <= 0) {
        pct = 0;
    } else if (grams < maxPerCup || fullCups === 0) {
        pct = grams / maxPerCup;
    } else {
        pct = remainder < 0.005 ? 1 : remainder / maxPerCup;
    }
    pct = Math.max(0, Math.min(1, pct));
    const fillH = pct * cupHeight;
    el.setAttribute('y', 200 - fillH);
    el.setAttribute('height', fillH + 10);
}

function clearDisplay() {
    resultCard.classList.remove('visible');
    blendDetail.classList.remove('visible');
    document.getElementById('sugarNote').classList.remove('visible');
    document.getElementById('teaNote').classList.remove('visible');
    setPointer('sugarPointer', 0);
    setPointer('teaPointer', 0);
}

// ── Copy Result ────────────────────────────────────
function copyResult() {
    const { waterMl, sugarGrams, teaGrams } = state;
    if (!waterMl && !sugarGrams && !teaGrams) return;
    const text = `وزنة شاهي ربيع:\n💧 الماء: ${fmt(waterMl)} مل\n🍬 السكر: ${fmt(sugarGrams)} جم\n🫖 الشاي: ${fmt(teaGrams)} جم`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('تم نسخ النتيجة ✓'));
    } else {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('تم نسخ النتيجة ✓');
    }
}

function shareWhatsApp() {
    const { waterMl, sugarGrams, teaGrams } = state;
    if (!waterMl && !sugarGrams && !teaGrams) return;
    const text = `وزنة شاهي ربيع 🍵\n💧 الماء: ${fmt(waterMl)} مل\n🍬 السكر: ${fmt(sugarGrams)} جم\n🫖 الشاي: ${fmt(teaGrams)} جم`;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ── History ────────────────────────────────────────
let history = [];

function saveToHistory() {
    const { waterMl, sugarGrams, teaGrams } = state;
    if (!waterMl && !sugarGrams && !teaGrams) return;

    const item = {
        water: fmt(waterMl),
        sugar: fmt(sugarGrams),
        tea:   fmt(teaGrams),
        time:  new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        date:  new Date().toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
        mode:  state.mode,
        waterRaw: waterMl,
        sugarRaw: sugarGrams,
        teaRaw:   teaGrams
    };

    history.unshift(item);
    if (history.length > 8) history.pop();

    try { localStorage.setItem('shahi_history', JSON.stringify(history)); } catch(e) {}
    renderHistory();
    showToast('تم الحفظ 📌');
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('shahi_history');
        history = saved ? JSON.parse(saved) : [];
    } catch(e) { history = []; }
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!history.length) {
        list.innerHTML = '<div class="history-empty">لا يوجد حسابات محفوظة بعد</div>';
        return;
    }
    list.innerHTML = history.map((item, i) => `
        <div class="history-item" onclick="loadHistoryItem(${i})" title="اضغط لتحميل">
            <div class="hist-main">💧 ${item.water} مل &nbsp;|&nbsp; 🍬 ${item.sugar} جم &nbsp;|&nbsp; 🫖 ${item.tea} جم</div>
            <div class="hist-meta">${item.date} ${item.time}</div>
        </div>
    `).join('');
}

function loadHistoryItem(i) {
    const item = history[i];
    if (!item) return;
    setMode('water');
    mainInput.value = item.waterRaw;
    waterSlider.value = Math.min(item.waterRaw, 10000);
    updateSliderGradient();
    calculate();
    showToast('تم تحميل الحساب ✓');
}

function clearHistory() {
    history = [];
    try { localStorage.removeItem('shahi_history'); } catch(e) {}
    renderHistory();
    showToast('تم مسح السجل');
}

// ── Converter ──────────────────────────────────────
function setConvSugar(gPerLiter, btn) {
    document.querySelectorAll('.conv-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = (gPerLiter * CUP_ML) / 1000;
    document.getElementById('convValue').textContent = val.toFixed(2);
    document.getElementById('convResult').classList.add('visible');
}

// ── Theme ──────────────────────────────────────────
function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('themeToggle').textContent = isLight ? '🌙' : '☀️';
}

function loadTheme() {
    // Dark is default — no class needed
    document.getElementById('themeToggle').textContent = '☀️';
}

// ── Toast ──────────────────────────────────────────
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── شاهي أبو جبل Calculator ──────────────────────
const AJ_SUGAR = 90;   // جم/لتر
let   AJ_TEA   = 12.25; // جم/لتر — يتغير حسب زر القوة

const ajState = { mode: 'water', waterMl: 0, sugarGrams: 0, teaGrams: 0 };

const ajInput     = document.getElementById('ajInput');
const ajSlider    = document.getElementById('ajSlider');
const ajSliderWrap = document.getElementById('ajSliderWrap');
const ajResult    = document.getElementById('ajResult');
const ajInputLabel = document.getElementById('ajInputLabel');
const ajInputUnit  = document.getElementById('ajInputUnit');

const AJ_MODE_LABELS = { water: 'أدخل كمية الماء', sugar: 'أدخل كمية السكر', tea: 'أدخل كمية الشاي' };
const AJ_MODE_UNITS  = { water: 'مل', sugar: 'جم', tea: 'جم' };

ajSlider.addEventListener('input', () => {
    ajInput.value = ajSlider.value;
    ajUpdateSlider();
    ajCalculate();
});
ajInput.addEventListener('input', () => {
    const raw = ajInput.value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    if (raw.trim() === '0812') {
        openEasterEgg();
        ajInput.value = '';
        return;
    }
    const v = parseFloat(normalizeInput(ajInput.value));
    if (!isNaN(v) && ajState.mode === 'water') {
        ajSlider.value = Math.min(v, 10000);
        ajUpdateSlider();
    }
    ajCalculate();
});

function ajUpdateSlider() {
    const pct = (ajSlider.value / ajSlider.max) * 100;
    ajSlider.style.setProperty('--fill', pct + '%');
}

function ajSetStrength(level, btn) {
    const map = { light: 12.00, normal: 12.25, heavy: 12.75 };
    const cls = { light: 'active-light', normal: 'active-normal', heavy: 'active-heavy' };
    AJ_TEA = map[level];
    document.querySelectorAll('.aj-strength-btn').forEach(b =>
        b.classList.remove('active-light', 'active-normal', 'active-heavy'));
    btn.classList.add(cls[level]);
    ajCalculate();
}

function ajSetMode(mode) {
    ajState.mode = mode;
    document.querySelectorAll('.abujabal-tab').forEach(t => t.classList.toggle('active', t.dataset.ajmode === mode));
    ajInputLabel.textContent = AJ_MODE_LABELS[mode];
    ajInputUnit.textContent  = AJ_MODE_UNITS[mode];
    ajSliderWrap.style.display = mode === 'water' ? 'flex' : 'none';
    ajInput.value = '';
    ajResult.classList.remove('visible');
    document.getElementById('ajSugarNote').classList.remove('visible');
    document.getElementById('ajTeaNote').classList.remove('visible');
    ajSetPointer('ajSugarPointer', 0);
    ajSetPointer('ajTeaPointer', 0);
}

function ajClearInput() {
    ajInput.value = '';
    ajSlider.value = 0;
    ajUpdateSlider();
    ajResult.classList.remove('visible');
    document.getElementById('ajSugarNote').classList.remove('visible');
    document.getElementById('ajTeaNote').classList.remove('visible');
    ajSetPointer('ajSugarPointer', 0);
    ajSetPointer('ajTeaPointer', 0);
}

function ajCalculate() {
    const raw = parseFloat(normalizeInput(ajInput.value));
    if (isNaN(raw) || raw <= 0) { ajResult.classList.remove('visible'); return; }

    let w, s, t;
    if (ajState.mode === 'water') {
        w = raw;
        s = (AJ_SUGAR * w) / 1000;
        t = (AJ_TEA   * w) / 1000;
    } else if (ajState.mode === 'sugar') {
        s = raw;
        w = (s * 1000) / AJ_SUGAR;
        t = (AJ_TEA * w) / 1000;
    } else {
        t = raw;
        w = (t * 1000) / AJ_TEA;
        s = (AJ_SUGAR * w) / 1000;
    }

    const ajW = Math.max(0, w);
    const ajS = Math.max(0, s);
    const ajT = Math.max(0, t);

    document.getElementById('ajResWater').textContent = fmt(ajW);
    document.getElementById('ajResSugar').textContent = fmt(ajS);
    document.getElementById('ajResTea').textContent   = fmt(ajT);
    ajResult.classList.add('visible');

    // Cup notes
    const ajSugarFullCups  = Math.floor(ajS / SUGAR_CUP);
    const ajSugarRemainder = ajS % SUGAR_CUP;
    const ajTeaFullCups    = Math.floor(ajT / TEA_CUP);
    const ajTeaRemainder   = ajT % TEA_CUP;

    document.getElementById('ajSugarCups').textContent      = fmt(ajSugarFullCups);
    document.getElementById('ajSugarRemainder').textContent  = fmt(ajSugarRemainder);
    document.getElementById('ajTeaCups').textContent        = fmt(ajTeaFullCups);
    document.getElementById('ajTeaRemainder').textContent    = fmt(ajTeaRemainder);
    document.getElementById('ajSugarNote').classList.add('visible');
    document.getElementById('ajTeaNote').classList.add('visible');

    // Real image pointers
    ajSetPointer('ajSugarPointer', (ajSugarRemainder <= 0.005 && ajSugarFullCups > 0) ? 100 : (ajSugarRemainder / SUGAR_CUP) * 100);
    ajSetPointer('ajTeaPointer',   (ajTeaRemainder <= 0.005 && ajTeaFullCups > 0) ? 100 : (ajTeaRemainder / TEA_CUP) * 100);
}


function ajSetPointer(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    const track = { top: 28.9, bottom: 71.3 };
    const safePct = Math.max(0, Math.min(100, pct));
    const pos = track.bottom - ((track.bottom - track.top) * (safePct / 100));
    el.style.top = Math.max(track.top, Math.min(track.bottom, pos)) + '%';
}

function ajCopyResult() {
    const w = document.getElementById('ajResWater').textContent;
    const s = document.getElementById('ajResSugar').textContent;
    const t = document.getElementById('ajResTea').textContent;
    if (w === '—') return;
    const text = `شاهي أبو جبل:\n💧 الماء: ${w} مل\n🍬 السكر: ${s} جم\n🫖 الشاي: ${t} جم`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('تم نسخ النتيجة ✓'));
    } else {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('تم نسخ النتيجة ✓');
    }
}

function ajShareWhatsApp() {
    const w = document.getElementById('ajResWater').textContent;
    const s = document.getElementById('ajResSugar').textContent;
    const t = document.getElementById('ajResTea').textContent;
    if (w === '—') return;
    const text = `شاهي أبو جبل 🍵\n💧 الماء: ${w} مل\n🍬 السكر: ${s} جم\n🫖 الشاي: ${t} جم`;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ── Easter Egg Modal ───────────────────────────────
function openEasterEgg() {
    document.getElementById('eggOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeEasterEgg() {
    document.getElementById('eggOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

// ── Cup Zoom Modal ─────────────────────────────────
function openCupZoom(imgSrc, topPct, isTea) {
    document.getElementById('cupZoomImg').src = imgSrc;
    const ptr = document.getElementById('cupZoomPointer');
    ptr.style.top = topPct + '%';
    ptr.classList.toggle('tea', isTea);
    document.getElementById('cupZoomOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCupZoom() {
    document.getElementById('cupZoomOverlay').classList.remove('open');
    document.body.style.overflow = '';
}
// Attach click to all cup photos
document.addEventListener('DOMContentLoaded', () => {
    [
        { wrap: 'sugarPointer', img: 'sugar.jpg', tea: false },
        { wrap: 'teaPointer',   img: 'tea.jpg',   tea: true  },
        { wrap: 'ajSugarPointer', img: 'sugar.jpg', tea: false },
        { wrap: 'ajTeaPointer',   img: 'tea.jpg',   tea: true  }
    ].forEach(({ wrap, img, tea }) => {
        const ptr = document.getElementById(wrap);
        if (!ptr) return;
        const photoWrap = ptr.closest('.photo-wrap, .aj-photo-wrap');
        if (!photoWrap) return;
        photoWrap.style.cursor = 'zoom-in';
        photoWrap.addEventListener('click', () => {
            const topPct = parseFloat(ptr.style.top) || 50;
            openCupZoom(img, topPct, tea);
        });
    });
});
