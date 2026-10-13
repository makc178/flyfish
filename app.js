/* Нахлыст. Снасти — PWA. Данные шифруются ключом из PIN (PBKDF2-SHA256 600k + AES-GCM), хранятся в IndexedDB
   и (по ключу GitHub) в закрытом репозитории makc178/flyfish-data. Код открыт, данных в нём нет. */
'use strict';
const T = {"app": {"name": "Нахлыст. Снасти", "slogan": "Подбери шнур раньше, чем рыба подберёт отговорку"}, "pin": {"title": "Введите PIN", "subtitle": "Снасти любят тишину и посторонних не пускают", "error": "Не тот PIN. Как муха не того размера — вроде похоже, но не клюёт", "button": "Открыть"}, "home": {"title": "Ваш арсенал", "sections": {"rods": "Удилища", "reels": "Катушки", "lines": "Шнуры и головы"}, "hint": "Выберите раздел. Рыба подождёт, она терпеливая"}, "tabs": {"single": "Одноручные", "double": "Двуручные", "both": "Подходит на оба"}, "list": {"search": "Найти снасть", "add": "Добавить", "count": "{n} шт. в строю", "more": "Подробнее", "matching_reels": "Подходящие катушки", "line_recommendation": "Рекомендация по шнурам", "collapse": "Свернуть"}, "rod_card": {"length": "Длина", "class": "Класс", "type": "Тип", "scandi": "Scandi, рекомендованный вес", "skagit": "Skagit, рекомендованный вес", "matches_title": "Подходящие шнуры", "matches_hint": "Подобрано по рабочему весу. Никакой магии, только граммы", "fallback": "Запасной вариант: совпадение по классу", "fallback_hint": "Граммовки нет, поэтому подобрали по классу. Доверяйте, но проверяйте на воде", "edit": "Редактировать", "delete": "Удалить", "fallback_weight": "Запасной вариант: близко по весу", "fallback_weight_hint": "Чуть вне рекомендованного окна. Работать будет, но проверьте на воде", "on_edge": "На границе диапазона"}, "reel_card": {"class_range": "Классы", "fits": "Подходит для", "fits_single": "одноручных", "fits_double": "двуручных", "fits_both": "и тех, и других. Универсал, как хороший гид", "edit": "Редактировать", "delete": "Удалить"}, "line_card": {"type": "Тип", "weight": "Вес", "length": "Длина", "floating": "Плавучесть", "tips_title": "Сменные концы", "tips_yes": "Есть сменные концы", "tips_no": "Без сменных концов", "working_weight": "Рабочий вес", "fits_rods": "Подходит к удилищам", "edit": "Редактировать", "delete": "Удалить"}, "line_types": {"full": "Полный шнур", "scandi": "Scandi", "skagit": "Skagit", "integrated": "Интегрированный", "running": "Раннинг"}, "forms": {"rod": {"title": "Новое удилище", "type": "Тип: одноручка, двуручка или свитч", "length": "Длина, футы", "class": "Класс, например #9", "scandi_from": "Scandi от, гр/грейны", "scandi_to": "Scandi до, гр/грейны", "skagit_from": "Skagit от, гр/грейны", "skagit_to": "Skagit до, гр/грейны", "hint": "Укажите диапазоны веса, и подбор шнуров заработает сам"}, "reel": {"title": "Новая катушка", "model": "Модель", "class_range": "Диапазон классов", "fits": "Для каких удилищ", "hint": "Отметьте «оба», если катушка не страдает снобизмом"}, "line": {"title": "Новый шнур или голова", "type": "Тип", "weight": "Вес, гр/грейны", "length": "Длина, м", "floating": "Плавучесть", "has_tips": "Есть сменные концы", "hint": "Вес обязателен: без него подбор гадает на кофейной гуще"}, "tip": {"title": "Новый сменный конец", "weight": "Вес, гр/грейны", "length": "Длина, м", "sink": "Погружение, дюймы/сек", "hint": "Каждый конец со своим характером, запишите его"}, "save": "Сохранить", "cancel": "Отмена", "required": "Это поле обязательно. Даже рыба знает свой вес", "saved": "Сохранено. Снасть в строю", "deleted": "Удалено. Пусть ей будет хорошо на пенсии", "confirm_delete": "Точно удалить? Вернуть можно только покупкой"}, "empty": {"rods": "Удилищ пока нет. Добавьте первое", "reels": "Катушек пока нет. Добавьте первую", "lines": "Шнуров пока нет. Добавьте первый", "tips": "Сменных концов пока нет", "no_match": "Подходящих шнуров не нашлось. Проверьте вес в карточке удилища", "button": "Добавить"}};
const DATA_REPO = 'makc178/flyfish-data', BRANCH = 'main', ITER = 600000;
const $ = s => document.querySelector(s), app = () => $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : null; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const r1 = x => Math.round(x * 10) / 10, GR = 15.4324;
const fg = x => x == null ? '—' : String(r1(x)).replace('.', ',');
function toast(t, ms = 2400) { const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), ms); }
/* ---------- хранилище и шифрование ---------- */
const idb = (() => { let p; const open = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open('flyfish', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (m, f) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('kv', m), q = f(t.objectStore('kv')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  return { get: k => tx('readonly', s => s.get(k)), set: (k, v) => tx('readwrite', s => s.put(v, k)) }; })();
const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = u => { let s = ''; const a = new Uint8Array(u); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
const ub64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function deriveKey(pin, salt, iter = ITER) { const k0 = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter}, k0, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']); }
async function seal(key, bytes) { const iv = crypto.getRandomValues(new Uint8Array(12)); return {iv: b64(iv), ct: b64(await crypto.subtle.encrypt({name: 'AES-GCM', iv}, key, bytes))}; }
async function open_(key, box) { return new Uint8Array(await crypto.subtle.decrypt({name: 'AES-GCM', iv: ub64(box.iv)}, key, ub64(box.ct))); }
let KEY = null, META = null, S = null;
const blank = () => ({v: 1, updated: 0, rods: [], reels: [], lines: [], deleted: [], sync: {token: '', last: 0}});
async function save(local) { S.updated = Date.now(); await idb.set('state', {salt: META.salt, iter: META.iter, ...(await seal(KEY, enc.encode(JSON.stringify(S)))), updated: S.updated}); if (!local) schedSync(); }
/* ---------- PIN ---------- */
let pinBuf = '', pinMode = 'unlock', pinFirst = '', pinBusy = false, RESTORE = null;
async function boot() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  try { META = await Promise.race([idb.get('meta'), new Promise((_, r) => setTimeout(() => r(), 3000))]); } catch (e) { META = null; }
  pinMode = META ? 'unlock' : 'new'; renderPin();
}
function renderPin(msg = '') {
  const t = {unlock: T.pin.title, new: 'Придумайте PIN из 4 цифр', confirm: 'Повторите PIN', restore: 'PIN от резервной копии'}[pinMode];
  app().innerHTML = `<div class="pin"><div class="ey">${esc(T.app.name)}</div><div class="big" style="margin-top:10px">${esc(t)}</div>
  <div class="mut" style="margin-top:8px;max-width:290px">${esc(msg || (pinMode === 'unlock' ? T.pin.subtitle : pinMode === 'new' ? 'PIN шифрует ваши снасти. Без него данные не прочитать никому, и восстановить его нельзя' : ''))}</div>
  <div class="dots">${[0,1,2,3].map(i => `<i class="${i < pinBuf.length ? 'f' : ''}"></i>`).join('')}</div>
  <div class="keys">${['1','2','3','4','5','6','7','8','9','r','0','b'].map(k => k === 'r' ? (pinMode === 'new' ? `<button data-k="r" style="font-size:11px;background:none">Восстановить<br>из копии</button>` : '<span></span>') : `<button data-k="${k}">${k === 'b' ? '⌫' : k}</button>`).join('')}</div></div>`;
  app().querySelectorAll('.keys button').forEach(b => b.onclick = () => pinKey(b.dataset.k));
}
async function pinKey(k) { if (pinBusy) return;
  if (k === 'r') return restoreForm();
  if (k === 'b') { pinBuf = pinBuf.slice(0, -1); return renderPin(); }
  if (pinBuf.length >= 4) return; pinBuf += k; renderPin(); if (pinBuf.length < 4) return;
  const pin = pinBuf; pinBuf = ''; pinBusy = true;
  try {
    if (pinMode === 'new') { pinFirst = pin; pinMode = 'confirm'; return renderPin(); }
    if (pinMode === 'confirm') { if (pin !== pinFirst) { pinMode = 'new'; return renderPin('PIN не совпал, попробуйте ещё раз'); }
      const salt = crypto.getRandomValues(new Uint8Array(16)); META = {salt: b64(salt), iter: ITER}; KEY = await deriveKey(pin, salt); S = blank(); await idb.set('meta', META); await save(true); return start(); }
    if (pinMode === 'restore') return doRestore(pin);
    const st = await idb.get('state'); const key = await deriveKey(pin, ub64(META.salt), META.iter);
    try { S = JSON.parse(dec.decode(await open_(key, st))); } catch (e) { return renderPin(T.pin.error); }
    KEY = key; start();
  } finally { pinBusy = false; } }
function restoreForm() { app().innerHTML = `<div class="pin"><div class="big">Восстановить</div><div class="mut" style="margin:10px 0 18px;max-width:300px">Вставьте ключ GitHub с доступом к закрытому репозиторию flyfish-data, затем введите PIN копии</div>
  <label class="f" style="width:100%;text-align:left"><small>Ключ GitHub</small><input id="rt" type="password" autocomplete="off"></label><button class="btn" style="margin-top:14px" id="rgo">Дальше</button><button class="btn l" style="margin-top:8px" id="rno">${esc(T.forms.cancel)}</button></div>`;
  $('#rno').onclick = () => { pinMode = 'new'; renderPin(); };
  $('#rgo').onclick = async () => { const tok = $('#rt').value.trim(); try { const r = await ghGetJson(tok, 'state.enc.json'); if (!r) throw new Error('копии нет'); RESTORE = {tok, st: r.json}; pinMode = 'restore'; renderPin(); } catch (e) { toast('Не удалось: ' + e.message); } }; }
async function doRestore(pin) { const st = RESTORE.st; const key = await deriveKey(pin, ub64(st.salt), st.iter);
  try { S = JSON.parse(dec.decode(await open_(key, st))); } catch (e) { return renderPin('PIN не подходит к копии'); }
  S.sync = {token: RESTORE.tok, last: 0}; META = {salt: st.salt, iter: st.iter}; KEY = key; await idb.set('meta', META); await save(true); RESTORE = null; start(); toast('Данные восстановлены'); }
/* ---------- закрытый репозиторий ---------- */
const ghH = tok => ({Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json'});
const ghUrl = p => `https://api.github.com/repos/${DATA_REPO}/contents/${p}`;
async function ghGetJson(tok, path) { const r = await fetch(`${ghUrl(path)}?ref=${BRANCH}&_=${Date.now()}`, {headers: ghH(tok), cache: 'no-store'});
  if (r.status === 404) return null; if (!r.ok) throw new Error(r.status === 401 ? 'ключ не подходит' : 'GitHub ' + r.status); const j = await r.json();
  let txt = j.content ? dec.decode(ub64(j.content.replace(/\n/g, ''))) : null;
  if (txt == null) { const r2 = await fetch(j.git_url, {headers: ghH(tok)}); txt = dec.decode(ub64((await r2.json()).content.replace(/\n/g, ''))); }
  return {sha: j.sha, json: JSON.parse(txt)}; }
async function ghPut(tok, path, obj, msg) { for (let i = 0; i < 3; i++) { let sha; try { const g = await fetch(`${ghUrl(path)}?ref=${BRANCH}&_=${Date.now()}`, {headers: ghH(tok), cache: 'no-store'}); if (g.ok) sha = (await g.json()).sha; } catch (e) {}
  const r = await fetch(ghUrl(path), {method: 'PUT', headers: ghH(tok), body: JSON.stringify({message: msg, branch: BRANCH, sha, content: b64(enc.encode(JSON.stringify(obj)))})});
  if (r.ok) return; if (r.status !== 409 && r.status !== 422) throw new Error('GitHub ' + r.status); } throw new Error('конфликт версий'); }
async function ghDel(tok, path, sha) { await fetch(ghUrl(path), {method: 'DELETE', headers: ghH(tok), body: JSON.stringify({message: 'imported ' + path, sha, branch: BRANCH})}); }
let syncT = null, SYNC_ST = '';
function schedSync() { if (!S?.sync?.token) return; clearTimeout(syncT); syncT = setTimeout(syncNow, 3000); }
async function syncNow(manual) { const tok = S?.sync?.token; if (!tok) return;
  try { SYNC_ST = 'синхронизация…';
    const remote = await ghGetJson(tok, 'state.enc.json');
    if (remote && remote.json.updated > S.updated && remote.json.salt === META.salt) { try { const R = JSON.parse(dec.decode(await open_(KEY, remote.json))); R.sync = S.sync; S = R; } catch (e) {} }
    const n = await importSeed(tok);
    await save(true); await ghPut(tok, 'state.enc.json', await idb.get('state'), 'state ' + new Date().toISOString().slice(0, 16));
    S.sync.last = Date.now(); await save(true); SYNC_ST = 'сохранено ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    if (n) toast(`Из реестра: ${n} позиций`); else if (manual) toast('Резервная копия обновлена');
    if (n || VIEW.t === 'profile') render();
  } catch (e) { SYNC_ST = 'ошибка: ' + e.message; if (manual) toast('Синхронизация: ' + e.message); if (VIEW.t === 'profile') render(); } }
/* импорт реестра: inbox/seed.json (кладёт import_sheet.py) → позиции с id sheet:* обновляются, ручные и удалённые не трогаются */
function mergeSeed(j) { let n = 0;
  for (const k of ['rods', 'reels', 'lines']) for (const x of j[k] || []) { if (!x.id || S.deleted.includes(x.id)) continue;
    const i = S[k].findIndex(y => y.id === x.id); if (i < 0) S[k].push(x); else if (!S[k][i].edited) S[k][i] = x; else continue; n++; }
  return n; }
async function importSeed(tok) { const f = await ghGetJson(tok, 'inbox/seed.json'); if (!f || f.json.kind !== 'flyfish-seed') return 0; const n = mergeSeed(f.json); await save(true); await ghDel(tok, 'inbox/seed.json', f.sha); return n; }
/* ---------- подбор ---------- */
const hand = r => r.type === 'single' ? 'single' : 'double';
const rodRange = (r, t) => t === 'skagit' ? r.skagit_g : (t === 'scandi' || t === 'integrated') ? r.scandi_g : null;
const lineG = l => l.w_g != null ? l.w_g : l.w_gr != null ? l.w_gr / GR : null;
const lineGr = l => l.w_gr != null ? l.w_gr : l.w_g != null ? l.w_g * GR : null;
function combos(l) { const b = lineG(l), bg = lineGr(l); if (b == null) return [];
  const tipped = l.type === 'skagit' || (l.type === 'scandi' && l.has_tips);
  const tips = (l.tips || []).filter(t => num(t.w_g) != null);
  if (tipped && tips.length) return tips.map(t => ({w: b + num(t.w_g), gr: bg + num(t.w_g) * GR, tip: t}));
  return [{w: b, gr: bg, noTip: tipped && l.type === 'skagit'}]; }
/* границы включительно; сравнение и в граммах (±0,05 г на округление), и в грейнах (±1 gr), если они есть у обоих */
function fit(c, g, gr, t) { const tol = g.approx ? 1.5 : 0;
  const inG = c.w >= g.lo - tol - 0.05 && c.w <= g.hi + tol + 0.05, inGr = gr && c.gr != null && !g.approx && c.gr >= gr.lo - 1 && c.gr <= gr.hi + 1;
  if (inG || inGr) { const edge = !g.approx && (Math.abs(c.w - g.lo) <= 0.3 || Math.abs(c.w - g.hi) <= 0.3 || (gr && c.gr != null && (Math.abs(c.gr - gr.lo) <= 3 || Math.abs(c.gr - gr.hi) <= 3))); return {in: true, edge}; }
  const dev = c.w < g.lo - tol ? c.w - (g.lo - tol) : c.w - (g.hi + tol);
  if (t === 'skagit') { const gd = gr && c.gr != null ? (c.gr < gr.lo ? c.gr - gr.lo : c.gr - gr.hi) : dev * GR; return Math.abs(gd) <= 25 ? {in: false, near: true, dev, devTxt: `${gd > 0 ? '+' : '−'}${Math.round(Math.abs(gd))} gr`} : null; }
  return dev >= -2 - 1e-9 && dev <= 1 + 1e-9 ? {in: false, near: true, dev, devTxt: `${dev > 0 ? '+' : '−'}${fg(Math.abs(dev))} г`} : null; }
const RANK = {ok: 0, edge: 1, near: 2, fb: 3, cls: 4};
function matchLine(r, l) { /* → null | {lvl:'ok'|'fb', kind, w, tip, rg, why, dev} */
  if (l.hand && l.hand !== 'both' && l.hand !== hand(r)) return null;
  const rg = rodRange(r, l.type), rgr = l.type === 'skagit' ? r.skagit_gr : (l.type === 'scandi' || l.type === 'integrated') ? r.scandi_gr : null;
  if (rg) { let best = null;
    for (const c of combos(l)) { const f = fit(c, rg, rgr, l.type); if (!f) continue;
      const body = l.body && !c.tip, soft = rg.analog || rg.approx || body;
      const kind = f.near ? 'near' : soft ? 'fb' : f.edge ? 'edge' : 'ok';
      const m = {lvl: kind === 'ok' || kind === 'edge' ? 'ok' : 'fb', kind, w: c.w, tip: c.tip, rg, dev: f.dev, devTxt: f.devTxt,
        why: kind === 'near' ? T.rod_card.fallback_weight : body ? 'вес тела без сменного конца' : rg.analog ? 'граммовка по аналогу' : rg.approx ? 'граммовка ориентировочная' : c.noTip ? 'без учёта сменного конца' : ''};
      if (!best || RANK[m.kind] < RANK[best.kind]) best = m; }
    return best; }
  const lc = l.cls || clsOf(l.class); if (r.cls && lc && lc[0] <= r.cls[1] && lc[1] >= r.cls[0]) return {lvl: 'fb', kind: 'cls', w: lineG(l), why: T.rod_card.fallback}; return null; }
function clsOf(s) { const n = (String(s || '').match(/\d+/g) || []).map(Number); return n.length ? [Math.min(...n), Math.max(...n)] : null; }
const rodLines = r => S.lines.map(l => ({l, m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind] || a.m.w - b.m.w);
function rodReels(r) { return S.reels.filter(x => !x.hand || x.hand === 'both' || x.hand === hand(r)).map(x => { const c = x.cls; if (c && r.cls) return c[0] <= r.cls[1] && (c[1] == null || c[1] >= r.cls[0]) ? {x, lvl: 'ok'} : null; return {x, lvl: 'fb', why: 'класс катушки не указан'}; }).filter(Boolean); }
const lineRods = l => S.rods.map(r => ({r, m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]);
/* ---------- вид ---------- */
let VIEW = {t: 'home'}, OPEN = null; const HIST = [];
const go = v => { HIST.push(VIEW); VIEW = v; OPEN = null; render(); scrollTo(0, 0); };
const back = () => { VIEW = HIST.pop() || {t: 'home'}; render(); };
function start() { VIEW = {t: 'home'}; render(); if (S.sync.token) syncNow(); }
const ART = {rods: 'art/rod.svg', reels: 'art/reel.svg', lines: 'art/line.svg'};
const SEC = {rods: T.home.sections.rods, reels: T.home.sections.reels, lines: T.home.sections.lines};
const TL = t => T.line_types[t] || (t === 'tip' ? 'Сменный конец' : t);
const RT = {single: 'одноручка', double: 'двуручка', switch: 'свитч'};
const inTab = (k, x, tab) => k === 'rods' ? hand(x) === tab : (!x.hand || x.hand === 'both' || x.hand === tab);
const rng = (g, gr) => g ? `${g.approx && g.lo === g.hi ? '≈' : ''}${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''} г${gr ? ` · ${gr.approx && gr.lo === gr.hi ? '≈' : ''}${Math.round(gr.lo)}${gr.hi !== gr.lo ? '–' + Math.round(gr.hi) : ''} gr` : ''}${g.analog ? ' · аналог' : ''}` : '—';
const name = x => `${x.brand ? x.brand + ' ' : ''}${x.model}`;
const tb = () => `<nav class="tb">${[['home', 'Арсенал'], ['pick', 'Подбор'], ['profile', 'Профиль']].map(([k, t]) => `<button data-tab="${k}" class="${(VIEW.root || VIEW.t) === k ? 'on' : ''}">${t}${(VIEW.root || VIEW.t) === k ? '<i></i>' : ''}</button>`).join('')}</nav>`;
function render() { const v = VIEW;
  let h = v.t === 'home' ? home() : v.t === 'list' ? list(v.k) : v.t === 'rod' ? rodCard(byId('rods', v.id)) : v.t === 'reel' ? reelCard(byId('reels', v.id)) : v.t === 'line' ? lineCard(byId('lines', v.id)) : v.t === 'form' ? form(v) : v.t === 'pick' ? pick() : profile();
  app().innerHTML = h + (v.t === 'form' ? '' : tb()); bind(); }
const clsTxt = c => c[1] == null ? `#${c[0]}+` : c[0] === c[1] ? `#${c[0]}` : `#${c[0]}–#${c[1]}`;
const byId = (k, id) => S[k].find(x => x.id === id) || {};
function home() { const c = k => S[k].length, ab = (k, t) => S[k].filter(x => inTab(k, x, t)).length;
  const both = S.reels.filter(x => x.hand === 'both').length;
  return `<div class="w top"><div class="ey">${esc(T.app.name)}</div><div class="big" style="margin-top:6px;font-size:44px">${esc(T.home.title)}</div><div class="mut" style="margin-top:6px">${esc(T.app.slogan)}</div></div>
  <div class="w" style="margin-top:18px"><button style="width:100%;text-align:left" data-go="rods"><div class="ph" style="height:200px;background-image:url(${ART.rods});background-size:92%;position:relative"><span class="chip" style="position:absolute;left:16px;top:14px">${c('rods')} шт.</span></div>
  <div class="row" style="margin-top:8px"><span class="ser" style="font-size:28px;font-weight:600">${esc(SEC.rods)}</span><span class="mut">${T.tabs.single} ${ab('rods', 'single')} · ${T.tabs.double} ${ab('rods', 'double')}</span></div></button></div>
  <div class="w g2" style="margin-top:12px">${['reels', 'lines'].map(k => `<button style="text-align:left" data-go="${k}"><div class="ph" style="height:150px;background-image:url(${ART[k]});background-size:84%;position:relative"><span class="chip" style="position:absolute;right:12px;top:12px">${c(k)} шт.</span>${k === 'reels' && both ? `<span class="chip g" style="position:absolute;left:10px;bottom:10px">${T.tabs.both} · ${both}</span>` : ''}</div>
  <div class="ser" style="font-size:23px;font-weight:600;margin-top:8px">${esc(SEC[k])}</div><div class="mut" style="font-size:11.5px">${T.tabs.single} ${ab(k, 'single')} · ${T.tabs.double} ${ab(k, 'double')}</div></button>`).join('')}</div>
  <div class="w mut" style="margin-top:14px;font-style:italic;font-size:12px">${esc(T.home.hint)}</div>${!S.sync.token ? `<div class="w" style="margin-top:14px"><div class="exp mut">Чтобы загрузить реестр и включить резервную копию, добавьте ключ GitHub в «Профиле».</div></div>` : ''}`; }
function scale(rg, w, m = {}) { if (!rg || w == null) return ''; const mn = Math.min(rg.lo, w) - 4, mx = Math.max(rg.hi, w) + 4, p = x => (x - mn) / (mx - mn) * 100;
  const ks = m.kind === 'edge' ? 'border-color:#AF9664;box-shadow:0 0 0 3px rgba(175,150,100,.25)' : m.kind === 'near' ? 'border-color:#686868;background:#f2f2f2' : '';
  return `<div class="scale"><div class="t"></div><div class="a" style="left:${p(rg.lo)}%;width:${Math.max(p(rg.hi) - p(rg.lo), 1.5)}%"></div><div class="k" style="left:${p(w)}%;${ks}"></div><span class="n" style="left:${p(rg.lo)}%">${fg(rg.lo)}</span>${rg.hi !== rg.lo ? `<span class="n" style="left:${p(rg.hi)}%">${fg(rg.hi)}</span>` : ''}${m.kind === 'near' ? `<span class="n" style="left:${p(w)}%;top:-13px;color:#686868;font-weight:700">${m.devTxt}</span>` : ''}</div>`; }
const mBadge = m => m.kind === 'edge' ? `<div style="margin-top:4px"><span class="bdg">${esc(T.rod_card.on_edge)}</span></div>` : m.kind === 'near' ? `<div style="margin-top:4px"><span class="chip o">${esc(T.rod_card.fallback_weight)} · ${m.devTxt}</span><div class="mut" style="font-size:10.5px;margin-top:3px">${esc(T.rod_card.fallback_weight_hint)}</div></div>` : m.lvl === 'fb' ? `<div style="margin-top:4px"><span class="chip o">${m.kind === 'cls' ? esc(T.rod_card.fallback) : 'Запасной вариант' + (m.why ? ': ' + esc(m.why) : '')}</span>${m.kind === 'cls' ? `<div class="mut" style="font-size:10.5px;margin-top:3px">${esc(T.rod_card.fallback_hint)}</div>` : ''}</div>` : m.why ? `<div class="mut" style="font-size:11px">${esc(m.why)}</div>` : '';
function lineRow(l, m) { return `<button class="card" style="width:100%;text-align:left;display:block" data-open="line:${l.id}"><div class="row"><span style="font-size:13px;font-weight:700;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span class="ey" style="font-size:9.5px;color:var(--green)">${esc(TL(l.type))}</span> ${esc(name(l))}</span><span style="font-size:12.5px;white-space:nowrap"><b>${fg(m.w)} г</b> <span class="mut" style="font-size:11px">${Math.round(m.w * GR)} gr</span></span></div>
  ${m.tip ? `<div class="mut" style="font-size:11px">голова + конец ${esc(m.tip.name || '')}</div>` : ''}${m.rg ? scale(m.rg, m.w, m) : ''}${mBadge(m)}</button>`; }
function rodExp(r) { const ls = rodLines(r), rs = rodReels(r);
  return `<div class="exp"><div class="sub">${esc(T.rod_card.matches_title)}</div>${ls.length ? ls.map(x => lineRow(x.l, x.m)).join('') : `<div class="mut" style="padding:4px 2px 8px">${esc(T.empty.no_match)}</div>`}
  <div class="sub">${esc(T.list.matching_reels)}</div>${rs.length ? `<div class="hs">${rs.map(x => `<button class="card" style="flex:none;text-align:left;margin:0" data-open="reel:${x.x.id}"><b style="font-size:12.5px">${esc(x.x.model)}</b><div class="mut" style="font-size:10.5px">${x.lvl === 'ok' ? 'класс в диапазоне' : 'запасной вариант: ' + esc(x.why)}</div></button>`).join('')}</div>` : '<div class="mut">—</div>'}
  ${recBlock(r)}<button class="more" data-open="rod:${r.id}">${esc(T.list.more)} ›</button></div>`; }
function recBlock(r) { return `<div class="card" style="margin-top:10px"><b style="font-size:13px">${esc(T.list.line_recommendation)}</b><div class="rec" style="margin-top:8px"><b>Scandi</b><span>${rng(r.scandi_g, r.scandi_gr)}</span><b>Skagit</b><span>${rng(r.skagit_g, r.skagit_gr)}</span>${r.rio ? `<b>RIO</b><span>${esc([r.rio.scandi && 'Scandi ' + r.rio.scandi, r.rio.skagit && 'Skagit ' + r.rio.skagit].filter(Boolean).join('; '))}</span>` : ''}</div>${r.line_note ? `<div class="mut" style="font-size:11px;margin-top:8px;line-height:1.45">${esc(r.line_note)}</div>` : ''}</div>`; }
function itemHead(k, x) { const sub = k === 'rods' ? `${esc(x.brand || '')} · ${esc(x.length || '')} · ${esc(x.class || '')}` : k === 'reels' ? `${esc(x.brand || '')}${x.size ? ' · ' + esc(x.size) : ''}${x.cls ? ' · #' + x.cls.join('–#') : ''}` : `${esc(TL(x.type))} · ${esc(x.brand || '')}`;
  const line2 = k === 'rods' ? `Scandi ${rng(x.scandi_g)} · Skagit ${rng(x.skagit_g)}` : k === 'reels' ? (x.hand === 'both' ? T.tabs.both : x.hand === 'single' ? T.tabs.single : x.hand === 'double' ? T.tabs.double : 'назначение не указано') : `${lineG(x) != null ? fg(lineG(x)) + ' г · ' + Math.round(x.w_gr || lineG(x) * GR) + ' gr' : esc(x.w_raw || '')}${x.float ? ' · ' + esc(x.float) : ''}${x.has_tips ? ' · есть сменные концы' : ''}`;
  return `<div class="hd" data-tog="${x.id}"><div class="thumb" style="background-image:url(${ART[k]})"></div><div style="flex:1;min-width:0"><div class="ey" style="font-size:10px">${sub}</div><div class="nm">${esc(x.model)}</div><div class="mut" style="font-size:11.5px;margin-top:3px">${line2}</div></div><span class="mut" style="font-size:18px">${OPEN === x.id ? '˄' : '˅'}</span></div>`; }
function reelExp(x) { const rods = S.rods.filter(r => rodReels(r).some(y => y.x.id === x.id && y.lvl === 'ok'));
  return `<div class="exp"><div class="sub">Подходящие удилища</div>${rods.length ? rods.map(r => `<button class="card" style="width:100%;text-align:left" data-open="rod:${r.id}"><b style="font-size:12.5px">${esc(name(r))}</b> <span class="mut">${esc(r.class)}</span></button>`).join('') : `<div class="mut" style="padding:2px">${x.cls ? '—' : 'Укажите классы катушки, и подбор заработает'}</div>`}
  <div class="g2" style="margin-top:8px"><div class="stat"><small>${T.reel_card.class_range}</small><b>${x.cls ? clsTxt(x.cls) : (esc(x.size) || '—')}</b></div><div class="stat"><small>Тормоз</small><b>${esc(x.drag || '—')}</b></div></div><button class="more" data-open="reel:${x.id}">${esc(T.list.more)} ›</button></div>`; }
function tipsRow(l) { return (l.tips || []).length ? `<div class="hs">${l.tips.map(t => `<div class="tipc"><b>${esc(t.name || 'Конец')}</b>${t.w_g != null ? fg(num(t.w_g)) + ' г' : '—'} · ${t.len ? esc(t.len) + ' м' : '—'}<br>${t.sink ? esc(t.sink) + ' д/с' : ''}</div>`).join('')}</div>` : `<div class="mut">${esc(T.empty.tips)}</div>`; }
function lineExp(l) { const rs = lineRods(l);
  return `<div class="exp"><div class="sub">${esc(T.line_card.fits_rods)}</div>${rs.length ? rs.map(x => `<button class="card" style="width:100%;text-align:left;display:block" data-open="rod:${x.r.id}"><div class="row"><b style="font-size:12.5px">${esc(name(x.r))}</b><b style="font-size:12.5px">${fg(x.m.w)} г</b></div>${x.m.rg ? scale(x.m.rg, x.m.w, x.m) : ''}${mBadge(x.m)}</button>`).join('') : `<div class="mut">—</div>`}
  ${l.type !== 'tip' ? `<div class="sub">${esc(T.line_card.tips_title)}</div>${tipsRow(l)}` : ''}<button class="more" data-open="line:${l.id}">${esc(T.list.more)} ›</button></div>`; }
function list(k) { const tab = VIEW.tab || 'double', all = S[k], xs = all.filter(x => inTab(k, x, tab)), q = (VIEW.q || '').toLowerCase(), fx = q ? xs.filter(x => name(x).toLowerCase().includes(q)) : xs;
  return `<div class="w top"><div class="row"><button class="back" data-back>‹ ${esc(T.home.title)}</button><button class="plus" data-new="${k}">+</button></div>
  <div class="big" style="margin-top:10px">${esc(SEC[k])}</div><div class="mut" style="margin-top:4px">${esc(T.list.count.replace('{n}', all.length))}</div>
  <div class="seg" style="margin-top:14px">${['single', 'double'].map(t => `<button data-tab2="${t}" class="${tab === t ? 'on' : ''}">${T.tabs[t]} · ${all.filter(x => inTab(k, x, t)).length}</button>`).join('')}</div>
  ${xs.length > 5 ? `<label class="f" style="margin-top:10px"><input id="q" placeholder="${esc(T.list.search)}" value="${esc(VIEW.q || '')}"></label>` : ''}</div>
  <div class="w" style="margin-top:6px">${fx.length ? fx.map(x => `<div class="it">${itemHead(k, x)}${OPEN === x.id ? (k === 'rods' ? rodExp(x) : k === 'reels' ? reelExp(x) : lineExp(x)) : ''}</div>`).join('') : emptyBox(k)}</div>`; }
function emptyBox(k) { return `<div class="empty"><div class="ph" style="background-image:url(${ART[k]})"></div><div class="ser" style="font-size:28px;font-weight:600;line-height:1.1">${esc(T.empty[k])}</div><button class="btn" style="margin-top:22px" data-new="${k}">+ ${esc(T.empty.button)}</button></div>`; }
function cardTop(k, x) { return `<div class="hero" style="background-image:url(${ART[k]})"><div class="w row top"><button class="chip" style="font-size:13px;padding:7px 12px" data-back>‹ ${esc(SEC[k])}</button><button class="chip" style="font-size:13px;padding:7px 12px" data-edit="${k}:${x.id}">${esc(T.rod_card.edit)}</button></div></div>`; }
const stats = a => `<div style="display:grid;grid-template-columns:repeat(${Math.min(a.length, 4)},1fr);gap:8px;margin-top:14px">${a.map(([s, v]) => `<div class="stat"><small>${esc(s)}</small><b>${v}</b></div>`).join('')}</div>`;
const buyBlock = x => x.buy && Object.keys(x.buy).length ? `<div class="card" style="margin-top:12px;font-size:12.5px"><b>Покупка</b><div class="mut" style="margin-top:4px">${[x.buy.date, x.buy.shop, x.buy.price_eur != null ? String(x.buy.price_eur).replace('.', ',') + ' € без НДС' : ''].filter(Boolean).map(esc).join(' · ')}</div></div>` : '';
const noteBlock = x => x.note ? `<div class="mut" style="margin-top:10px">${esc(x.note)}</div>` : '';
const delBtn = (k, x) => `<button class="btn r" style="margin-top:18px" data-del="${k}:${x.id}">${esc(T.rod_card.delete)}</button>`;
function rodCard(r) { const ls = rodLines(r), rs = rodReels(r);
  return cardTop('rods', r) + `<div class="w" style="margin-top:14px"><div class="ey">${esc(r.brand || '')} · ${RT[r.type] || ''}</div><div class="big" style="font-size:34px;margin-top:2px">${esc(r.model)}</div>
  ${stats([[T.rod_card.length, esc(r.length || '—')], [T.rod_card.class, esc(r.class || '—')], ['Scandi', r.scandi_g ? rng(r.scandi_g).split(' · ')[0] : '—'], ['Skagit', r.skagit_g ? rng(r.skagit_g).split(' · ')[0] : '—']])}
  <div class="row" style="margin-top:22px"><span class="ser" style="font-size:26px;font-weight:600">${esc(T.rod_card.matches_title)}</span><span class="mut">${ls.length} шт.</span></div><div class="mut" style="font-size:11.5px;margin-bottom:8px">${esc(T.rod_card.matches_hint)}</div>
  ${ls.length ? ls.map(x => lineRow(x.l, x.m)).join('') : `<div class="mut">${esc(T.empty.no_match)}</div>`}
  <div class="sub" style="margin-top:16px">${esc(T.list.matching_reels)}</div>${rs.map(x => `<button class="card" style="width:100%;text-align:left" data-open="reel:${x.x.id}"><b style="font-size:13px">${esc(name(x.x))}</b><div class="mut" style="font-size:11px">${x.lvl === 'ok' ? '✓ класс в диапазоне' : 'Запасной вариант: ' + esc(x.why)}</div></button>`).join('') || '<div class="mut">—</div>'}
  ${recBlock(r)}${r.rio?.note ? `<div class="mut" style="font-size:11px;margin-top:6px">${esc(r.rio.note)}</div>` : ''}${r.source ? `<div class="mut" style="font-size:10.5px;margin-top:8px;word-break:break-all">Источник: ${esc(r.source)}</div>` : ''}${noteBlock(r)}${buyBlock(r)}${delBtn('rods', r)}</div>`; }
function reelCard(x) { const fit = x.hand === 'both' ? T.reel_card.fits_both : x.hand === 'single' ? T.reel_card.fits_single : x.hand === 'double' ? T.reel_card.fits_double : 'не указано';
  return cardTop('reels', x) + `<div class="w" style="margin-top:14px"><div class="ey">${esc(x.brand || '')}</div><div class="big" style="font-size:34px;margin-top:2px">${esc(x.model)}</div>
  ${stats([[T.reel_card.class_range, x.cls ? clsTxt(x.cls) : esc(x.size || '—')], ['Тормоз', esc(x.drag || '—')]])}<div class="card" style="margin-top:12px;font-size:13px"><b>${esc(T.reel_card.fits)}:</b> ${esc(fit)}</div>${reelExp(x).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(x)}${buyBlock(x)}${delBtn('reels', x)}</div>`; }
function lineCard(l) { const g = lineG(l);
  return cardTop('lines', l) + `<div class="w" style="margin-top:14px"><div class="ey">${esc(TL(l.type))} · ${esc(l.brand || '')}</div><div class="big" style="font-size:34px;margin-top:2px">${esc(l.model)}</div>
  ${stats([[T.line_card.weight, g != null ? fg(g) + ' г' : esc(l.w_raw || '—')], ['Грейны', g != null ? Math.round(l.w_gr || g * GR) : '—'], [T.line_card.length, esc(l.length || '—')], [T.line_card.floating, esc(l.float || '—')]])}
  <div class="card" style="margin-top:12px;font-size:13px">${l.has_tips ? T.line_card.tips_yes : T.line_card.tips_no}${l.body ? ' · тело головы, вес без конца' : ''}${l.reel ? ' · на катушке: ' + esc(l.reel) : ''}</div>${lineExp(l).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(l)}${buyBlock(l)}${delBtn('lines', l)}</div>`; }
function pick() { return `<div class="w top"><div class="ey">${esc(T.app.name)}</div><div class="big" style="margin-top:6px">Подбор</div><div class="mut" style="margin-top:6px">${esc(T.rod_card.matches_hint)}</div></div><div class="w" style="margin-top:10px">${S.rods.length ? S.rods.map(r => { const ls = rodLines(r), ok = ls.filter(x => x.m.lvl === 'ok').length;
  return `<button class="card" style="width:100%;text-align:left" data-open="rod:${r.id}"><div class="row"><div><div class="ey" style="font-size:10px">${esc(r.brand)} · ${esc(r.length || '')} · ${esc(r.class || '')}</div><div class="nm">${esc(r.model)}</div></div><div style="text-align:right;font-size:12px"><b>${ok}</b> <span class="mut">подходят</span><br><span class="mut">${ls.length - ok} запасных</span></div></div></button>`; }).join('') : emptyBox('rods')}</div>`; }
function profile() { return `<div class="w top"><div class="ey">${esc(T.app.name)}</div><div class="big" style="margin-top:6px">Профиль</div>
  <div class="card" style="margin-top:16px"><b>Резервная копия и реестр</b><div class="mut" style="margin:6px 0 10px;line-height:1.45">Данные шифруются PIN-кодом на телефоне и хранятся в закрытом репозитории ${DATA_REPO}. Нужен ключ GitHub (Fine-grained, только репозиторий flyfish-data, Contents: Read and write). Никому его не пересылайте.</div>
  ${S.sync.token ? `<div class="mut">Ключ сохранён · ${esc(SYNC_ST || (S.sync.last ? 'последняя копия ' + new Date(S.sync.last).toLocaleString('ru-RU') : ''))}</div><button class="btn" style="margin-top:10px" id="syn">Синхронизировать</button><button class="btn l" style="margin-top:8px" id="toff">Убрать ключ</button>`
   : `<label class="f"><small>Ключ GitHub</small><input id="tok" type="password" autocomplete="off"></label><button class="btn" style="margin-top:10px" id="ton">Подключить</button>`}</div>
  <div class="card mut" style="margin-top:10px">Удилищ ${S.rods.length} · катушек ${S.reels.length} · шнуров ${S.lines.length}</div><button class="btn l" style="margin-top:10px" id="lock">Заблокировать</button></div>`; }
/* ---------- формы ---------- */
const FL = (lbl, n, v, t = 'text', extra = '') => `<label class="f"><small>${esc(lbl)}</small><input name="${n}" value="${esc(v ?? '')}" type="${t}" ${t === 'text' ? '' : 'inputmode="decimal"'} ${extra}></label>`;
const segF = (n, opts, v) => `<div class="seg wrap" data-seg="${n}">${opts.map(([k, t]) => `<button type="button" data-v="${k}" class="${v === k ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>`;
let DRAFT = null;
function form(v) { const k = v.k, x = DRAFT, F = T.forms; const ttl = v.id ? T.rod_card.edit : F[k === 'rods' ? 'rod' : k === 'reels' ? 'reel' : 'line'].title;
  let b = '';
  if (k === 'rods') b = `${segF('type', [['single', 'Одноручка'], ['double', 'Двуручка'], ['switch', 'Свитч']], x.type)}<div style="height:10px"></div>${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}<div class="g2">${FL('Длина, например 13\'2"', 'length', x.length)}${FL(F.rod.class, 'class', x.class)}</div>
    <div class="g2">${FL('Scandi от, г', 'sc_lo', x.scandi_g?.lo, 'number')}${FL('Scandi до, г', 'sc_hi', x.scandi_g?.hi, 'number')}${FL('Skagit от, г', 'sk_lo', x.skagit_g?.lo, 'number')}${FL('Skagit до, г', 'sk_hi', x.skagit_g?.hi, 'number')}</div><div class="mut">${esc(F.rod.hint)}. Граммы → грейны: × 15,43</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'reels') b = `${FL('Производитель', 'brand', x.brand)}${FL(F.reel.model, 'model', x.model)}<div class="g2">${FL('Класс от, #', 'c_lo', x.cls?.[0], 'number')}${FL('Класс до, #', 'c_hi', x.cls?.[1], 'number')}</div>${FL('Размер / модель', 'size', x.size)}${FL('Тормоз', 'drag', x.drag)}<small class="mut">${esc(F.reel.fits)}</small>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand)}<div class="mut">${esc(F.reel.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'lines') b = `<small class="mut">${esc(F.line.type)}</small>${segF('type', [['full', TL('full')], ['scandi', 'Scandi'], ['skagit', 'Skagit'], ['integrated', TL('integrated')], ['running', TL('running')], ['tip', 'Сменный конец']], x.type)}
    <small class="mut">Для каких удилищ</small>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand || 'double')}<div style="height:6px"></div>${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}
    <div class="g2">${FL('Вес, г', 'w_g', x.w_g, 'number')}${FL('Вес, грейны', 'w_gr', x.w_gr, 'number')}${FL(F.line.length, 'length', x.length)}${FL('Класс (для полного шнура)', 'class', x.class)}</div>${FL(F.line.floating, 'float', x.float)}
    <div class="row" style="padding:6px 2px"><b>${esc(F.line.has_tips)}</b><button type="button" class="sw ${x.has_tips ? 'on' : ''}" id="htips"></button></div>
    ${x.has_tips ? `<div class="hs">${(x.tips || []).map((t, i) => `<div class="tipc" style="width:150px"><input data-tip="${i}" data-f="name" placeholder="Название" value="${esc(t.name || '')}" style="width:100%;border:0;font-weight:700"><input data-tip="${i}" data-f="w_g" placeholder="Вес, г" inputmode="decimal" value="${esc(t.w_g ?? '')}" style="width:100%;border:0"><input data-tip="${i}" data-f="len" placeholder="Длина, м" inputmode="decimal" value="${esc(t.len ?? '')}" style="width:100%;border:0"><input data-tip="${i}" data-f="sink" placeholder="Погружение, д/с" value="${esc(t.sink ?? '')}" style="width:100%;border:0"><button type="button" data-rmtip="${i}" class="mut" style="font-size:11px">убрать</button></div>`).join('')}<button type="button" class="tipc" id="addtip" style="text-align:center">+ ${esc(F.tip.title)}</button></div><div class="mut">${esc(F.tip.hint)}</div>` : ''}<div class="mut">${esc(F.line.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  return `<div class="w top"><div class="row"><button class="back" data-cancel>${esc(F.cancel)}</button><button class="back" style="color:var(--green)" data-save>${esc(F.save)}</button></div><div class="big" style="margin-top:10px;font-size:34px">${esc(ttl)}</div>
  <form id="fm" style="display:flex;flex-direction:column;gap:10px;margin-top:16px" onsubmit="return false">${b}<button class="btn" type="button" data-save style="margin-top:10px">${esc(F.save)}</button></form></div>`; }
function readForm() { document.querySelectorAll('#fm input[name]').forEach(i => DRAFT[i.name] = i.value.trim()); document.querySelectorAll('#fm [data-tip]').forEach(i => DRAFT.tips[+i.dataset.tip][i.dataset.f] = i.value.trim()); }
function commit() { readForm(); const k = VIEW.k, d = DRAFT; if (!d.model) return toast(T.forms.required);
  const R = (a, b) => num(a) != null ? {lo: num(a), hi: num(b) ?? num(a), approx: false} : null; let o;
  if (k === 'rods') o = {type: d.type || 'double', brand: d.brand, model: d.model, length: d.length, class: d.class, cls: clsOf(d.class), scandi_g: R(d.sc_lo, d.sc_hi), skagit_g: R(d.sk_lo, d.sk_hi), note: d.note || null};
  if (k === 'rods') { const old = byId('rods', VIEW.id); for (const t of ['scandi', 'skagit']) { const a = old[t + '_g'], b = o[t + '_g']; if (a && b && a.lo === b.lo && a.hi === b.hi) { o[t + '_g'] = a; o[t + '_gr'] = old[t + '_gr']; } else o[t + '_gr'] = b ? {lo: b.lo * GR, hi: b.hi * GR} : null; } }
  if (k === 'reels') { const lo = num(d.c_lo), hi = num(d.c_hi) ?? lo; o = {brand: d.brand, model: d.model, size: d.size, cls: lo != null ? [lo, hi] : null, drag: d.drag, hand: d.hand || null, note: d.note || null}; }
  if (k === 'lines') { if (d.type !== 'tip' && num(d.w_g) == null && num(d.w_gr) == null) return toast(T.forms.required);
    o = {type: d.type || 'scandi', hand: d.hand || 'double', brand: d.brand, model: d.model, w_g: num(d.w_g) ?? (num(d.w_gr) != null ? r1(num(d.w_gr) / GR) : null), w_gr: num(d.w_gr) ?? (num(d.w_g) != null ? Math.round(num(d.w_g) * GR) : null), length: d.length, class: d.class, cls: clsOf(d.class), float: d.float, has_tips: !!d.has_tips, tips: d.has_tips ? d.tips.filter(t => t.name || t.w_g) : [], note: d.note || null}; }
  const arr = S[k], i = arr.findIndex(y => y.id === VIEW.id);
  if (i >= 0) arr[i] = {...arr[i], ...o, edited: true}; else arr.push({id: 'u:' + uid(), src: 'user', ...o});
  save(); toast(T.forms.saved); DRAFT = null; back(); }
/* ---------- события ---------- */
function bind() {
  app().onclick = async e => { const t = e.target.closest('button,[data-tog]'); if (!t) return; const d = t.dataset;
    if (d.tab) { HIST.length = 0; VIEW = {t: d.tab}; return render(); }
    if (d.go) return go({t: 'list', k: d.go, root: 'home', tab: 'double'});
    if (d.back != null) return back();
    if (d.tab2) { VIEW.tab = d.tab2; OPEN = null; return render(); }
    if (d.tog) { OPEN = OPEN === d.tog ? null : d.tog; return render(); }
    if (d.open) { const [k, ...id] = d.open.split(':'); return go({t: k, id: id.join(':'), root: VIEW.root || VIEW.t}); }
    if (d.new) { DRAFT = {tips: [], type: d.new === 'lines' ? 'scandi' : d.new === 'rods' ? (VIEW.tab || 'double') : undefined, hand: d.new === 'reels' ? null : undefined}; return go({t: 'form', k: d.new, root: 'home'}); }
    if (d.edit) { const [k, ...id] = d.edit.split(':'); const x = byId(k, id.join(':')); DRAFT = JSON.parse(JSON.stringify(x)); DRAFT.tips = DRAFT.tips || []; return go({t: 'form', k, id: x.id, root: 'home'}); }
    if (d.del) { if (!confirm(T.forms.confirm_delete)) return; const [k, ...id] = d.del.split(':'); const i = id.join(':'); S[k] = S[k].filter(x => x.id !== i); if (i.startsWith('sheet:')) S.deleted.push(i); save(); toast(T.forms.deleted); return back(); }
    if (d.cancel != null) { DRAFT = null; return back(); }
    if (d.save != null) return commit();
    if (d.v && t.parentElement.dataset.seg) { readForm(); DRAFT[t.parentElement.dataset.seg] = d.v; return render(); }
    if (t.id === 'htips') { readForm(); DRAFT.has_tips = !DRAFT.has_tips; return render(); }
    if (t.id === 'addtip') { readForm(); DRAFT.tips.push({}); return render(); }
    if (d.rmtip) { readForm(); DRAFT.tips.splice(+d.rmtip, 1); return render(); }
    if (t.id === 'ton') { const tok = $('#tok').value.trim(); if (!tok) return; try { const r = await fetch(`https://api.github.com/repos/${DATA_REPO}`, {headers: ghH(tok)}); if (!r.ok) throw new Error(r.status === 404 ? 'нет доступа к репозиторию' : 'GitHub ' + r.status); S.sync = {token: tok, last: 0}; await save(true); render(); syncNow(true); } catch (err) { toast('Не удалось: ' + err.message); } return; }
    if (t.id === 'syn') return syncNow(true);
    if (t.id === 'toff') { S.sync = {token: '', last: 0}; await save(true); return render(); }
    if (t.id === 'lock') { KEY = S = null; pinMode = 'unlock'; return renderPin(); }
  };
  const q = $('#q'); if (q) q.oninput = () => { VIEW.q = q.value; const p = q.selectionStart; render(); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); };
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S?.sync?.token) syncNow(); });
window.__ff = {matchLine, mergeSeed, get S() { return S; }};
boot();
