/* Нахлыст. Снасти — PWA. Данные шифруются ключом из PIN (PBKDF2-SHA256 600k + AES-GCM), хранятся в IndexedDB
   и (по ключу GitHub) в закрытом репозитории makc178/flyfish-data. Код открыт, данных в нём нет. */
'use strict';
const T = {"app": {"name": "Нахлыст. Снасти", "slogan": "Подбери шнур раньше, чем рыба подберёт отговорку"}, "pin": {"title": "Введите PIN", "subtitle": "Снасти любят тишину и посторонних не пускают", "error": "Не тот PIN. Как муха не того размера — вроде похоже, но не клюёт", "button": "Открыть"}, "home": {"title": "Ваш арсенал", "sections": {"rods": "Удилища", "reels": "Катушки", "lines": "Шнуры и головы"}, "hint": "Выберите раздел. Рыба подождёт, она терпеливая"}, "tabs": {"single": "Одноручные", "double": "Двуручные", "both": "Подходит на оба"}, "list": {"search": "Найти снасть", "add": "Добавить", "count": "{n} шт. в строю", "more": "Подробнее", "matching_reels": "Катушки", "line_recommendation": "Рекомендация по шнурам", "collapse": "Свернуть"}, "rod_card": {"length": "Длина", "class": "Класс", "type": "Тип", "scandi": "Scandi, рекомендованный вес", "skagit": "Skagit, рекомендованный вес", "matches_title": "Подходящие шнуры", "matches_hint": "Подобрано по рабочему весу. Никакой магии, только граммы", "fallback": "Запасной: по классу", "fallback_hint": "Граммовки нет, поэтому подобрали по классу. Доверяйте, но проверяйте на воде", "edit": "Редактировать", "delete": "Удалить", "fallback_weight": "Запасной: близко по весу", "fallback_weight_hint": "Чуть вне рекомендованного окна. Работать будет, но проверьте на воде", "on_edge": "На границе", "approx_window": "Примерно", "approx_window_hint": "Производитель указал примерный вес, без диапазона. Проверьте на воде", "approx_by_head_hint": "Вес подобран по голове производителя, а не по удилищу. Проверьте на воде", "approx_by_model_hint": "Вес взят у близкой модели того же производителя. Проверьте на воде"}, "reel_card": {"class_range": "Классы", "fits": "Подходит для", "fits_single": "одноручных", "fits_double": "двуручных", "fits_both": "и тех, и других. Универсал, как хороший гид", "edit": "Редактировать", "delete": "Удалить"}, "line_card": {"type": "Тип", "weight": "Вес", "length": "Длина", "floating": "Плавучесть", "tips_title": "Сменные концы", "tips_yes": "Есть сменные концы", "tips_no": "Без сменных концов", "working_weight": "Рабочий вес", "fits_rods": "Подходит к удилищам", "edit": "Редактировать", "delete": "Удалить"}, "line_types": {"full": "Полный шнур", "scandi": "Scandi", "skagit": "Skagit", "integrated": "Интегрированный", "running": "Раннинг"}, "forms": {"rod": {"title": "Новое удилище", "type": "Тип: одноручка, двуручка или свитч", "length": "Длина, футы", "class": "Класс, например #9", "scandi_from": "Scandi от, гр/грейны", "scandi_to": "Scandi до, гр/грейны", "skagit_from": "Skagit от, гр/грейны", "skagit_to": "Skagit до, гр/грейны", "hint": "Укажите диапазоны веса, и подбор шнуров заработает сам"}, "reel": {"title": "Новая катушка", "model": "Модель", "class_range": "Диапазон классов", "fits": "Для каких удилищ", "hint": "Отметьте «оба», если катушка не страдает снобизмом"}, "line": {"title": "Новый шнур или голова", "type": "Тип", "weight": "Вес, гр/грейны", "length": "Длина, м", "floating": "Плавучесть", "has_tips": "Есть сменные концы", "hint": "Вес обязателен: без него подбор гадает на кофейной гуще"}, "tip": {"title": "Новый сменный конец", "weight": "Вес, гр/грейны", "length": "Длина, м", "sink": "Погружение, дюймы/сек", "hint": "Каждый конец со своим характером, запишите его"}, "save": "Сохранить", "cancel": "Отмена", "required": "Это поле обязательно. Даже рыба знает свой вес", "saved": "Сохранено. Снасть в строю", "deleted": "Удалено. Пусть ей будет хорошо на пенсии", "confirm_delete": "Точно удалить? Вернуть можно только покупкой"}, "empty": {"rods": "Удилищ пока нет. Добавьте первое", "reels": "Катушек пока нет. Добавьте первую", "lines": "Шнуров пока нет. Добавьте первый", "tips": "Сменных концов пока нет", "no_match": "Подходящих шнуров не нашлось. Проверьте вес в карточке удилища", "button": "Добавить"}, "tabbar": {"arsenal": "Арсенал", "match": "Подбор", "profile": "Профиль"}};
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
  <div class="keys">${['1','2','3','4','5','6','7','8','9','r','0','b'].map(k => k === 'r' ? (pinMode === 'new' ? `<button data-k="r" style="font-size:13px;background:none">Восстановить<br>из копии</button>` : '<span></span>') : `<button data-k="${k}">${k === 'b' ? '⌫' : k}</button>`).join('')}</div></div>`;
  app().querySelectorAll('.keys button').forEach(b => b.onclick = () => pinKey(b.dataset.k));
}
async function pinKey(k) { if (pinBusy) return;
  if (k === 'r') return restoreForm();
  if (k === 'b') { pinBuf = pinBuf.slice(0, -1); return renderPin(); }
  if (pinBuf.length >= 4) return; pinBuf += k; renderPin(); if (pinBuf.length < 4) return;
  const pin = pinBuf; pinBuf = ''; pinBusy = true; if (pinMode !== 'new') { const m = app().querySelector('.pin .mut'); if (m) m.textContent = 'Открываю…'; }
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
      const body = l.body && !c.tip, soft = false;
      const kind = f.near ? 'near' : soft ? 'fb' : f.edge ? 'edge' : 'ok';
      const m = {lvl: kind === 'ok' || kind === 'edge' ? 'ok' : 'fb', kind, w: c.w, tip: c.tip, rg, dev: f.dev, devTxt: f.devTxt,
        why: kind === 'near' ? T.rod_card.fallback_weight : body ? 'вес тела без сменного конца' : c.noTip ? 'без учёта сменного конца' : ''};
      if (!best || RANK[m.kind] < RANK[best.kind]) best = m; }
    return best; }
  const lc = l.cls || clsOf(l.class); if (r.cls && lc && lc[0] <= r.cls[1] && lc[1] >= r.cls[0]) return {lvl: 'fb', kind: 'cls', w: lineG(l), why: T.rod_card.fallback}; return null; }
function clsOf(s) { const n = (String(s || '').match(/\d+/g) || []).map(Number); return n.length ? [Math.min(...n), Math.max(...n)] : null; }
const rodLines = r => S.lines.map(l => ({l, m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind] || a.m.w - b.m.w);
function rodReels(r) { return S.reels.filter(x => !x.hand || x.hand === 'both' || x.hand === hand(r)).map(x => { const c = x.cls; if (c && r.cls) return c[0] <= r.cls[1] && (c[1] == null || c[1] >= r.cls[0]) ? {x, lvl: 'ok'} : null; return {x, lvl: 'fb', why: 'класс катушки не указан'}; }).filter(Boolean); }
const lineRods = l => S.rods.map(r => ({r, m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]);
/* ---------- вид (v7 «Телеметрия») ---------- */
let VIEW = {t: 'home'}, OPEN = null; const HIST = [];
const go = v => { HIST.push(VIEW); VIEW = v; OPEN = null; render(); scrollTo(0, 0); };
const back = () => { VIEW = HIST.pop() || {t: 'home'}; render(); };
function start() { VIEW = {t: 'home'}; render(); if (S.sync.token) syncNow(); }
const ART = {rods: 'art/rod.svg', reels: 'art/reel.svg', lines: 'art/line.svg'};
const SEC = {rods: T.home.sections.rods, reels: T.home.sections.reels, lines: T.home.sections.lines};
const TL = t => T.line_types[t] || (t === 'tip' ? 'Сменный конец' : t);
const RT = {single: 'одноручное', double: 'двуручное', switch: 'свитч'};
const inTab = (k, x, tab) => k === 'rods' ? hand(x) === tab : (!x.hand || x.hand === 'both' || x.hand === tab);
const rng = (g, gr) => g ? `${g.approx && g.lo === g.hi ? '≈' : ''}${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''} г${gr ? ` · ${gr.approx && gr.lo === gr.hi ? '≈' : ''}${Math.round(gr.lo)}${gr.hi !== gr.lo ? '–' + Math.round(gr.hi) : ''} gr` : ''}` : '—';
const name = x => `${x.brand ? x.brand + ' ' : ''}${x.model}`;
const clsTxt = c => c[1] == null ? `#${c[0]}+` : c[0] === c[1] ? `#${c[0]}` : `#${c[0]}–#${c[1]}`;
const byId = (k, id) => S[k].find(x => x.id === id) || {};
const artBox = (k, st = '') => `<div class="artb" style="background-image:url(${ART[k]});background-size:${k === 'rods' ? '92%' : '74%'};${st}"></div>`;
const APX = {single: T.rod_card.approx_window_hint, by_model: T.rod_card.approx_by_model_hint, head_based: T.rod_card.approx_by_head_hint || 'Вес подобран по голове производителя, а не по удилищу. Проверьте на воде'};
const apxOf = g => g && APX[g.kind] ? g.kind : null;
const ICO = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>'};
/* статусы: ok — Подходит, edge — На границе, fb — Запасной, apx — ≈ Примерно */
const SC = {ok: '#3DDC97', edge: '#FFD166', fb: '#FF6B4A', apx: '#9AA4B2'};
const stOf = m => m.kind === 'edge' ? 'edge' : m.lvl === 'ok' ? 'ok' : 'fb';
const stLbl = m => m.kind === 'edge' ? T.rod_card.on_edge : m.lvl === 'ok' ? 'Подходит' : m.kind === 'near' ? 'Запасной ' + m.devTxt : m.kind === 'cls' ? T.rod_card.fallback : 'Запасной';
const chip = (s, t) => `<span class="st s-${s}">${esc(t)}</span>`;
const apxBtn = (k, short) => `<button class="st s-apx" data-hint="${esc(APX[k])}" aria-label="${esc(T.rod_card.approx_window)}: подсказка">≈ ${esc(T.rod_card.approx_window)}${short ? '' : ' <i>i</i>'}</button>`;
const mNote = m => m.kind === 'near' ? T.rod_card.fallback_weight_hint : m.kind === 'cls' ? T.rod_card.fallback_hint : m.lvl === 'fb' && m.why ? m.why : m.why || '';
const tb = () => { const r = VIEW.root || VIEW.t; return `<nav class="tb" aria-label="Навигация">${[['home', T.tabbar.arsenal], ['pick', T.tabbar.match]].map(([k, t]) => `<button data-tab="${k}" class="${r === k ? 'on' : ''}">${t}</button>`).join('')}<button data-tab="search" class="ic ${r === 'search' ? 'on' : ''}" aria-label="Поиск">${ICO.search}</button></nav>`; };
function render() { const v = VIEW;
  let h = v.t === 'home' ? home() : v.t === 'list' ? list(v.k) : v.t === 'rod' ? rodCard(byId('rods', v.id)) : v.t === 'reel' ? reelCard(byId('reels', v.id)) : v.t === 'line' ? lineCard(byId('lines', v.id)) : v.t === 'form' ? form(v) : v.t === 'add' ? addStep() : v.t === 'pick' ? pick() : v.t === 'search' ? search() : profile();
  app().innerHTML = h + (v.t === 'form' || v.t === 'add' ? '' : tb()); bind(); }
/* полукольцевой индикатор окна: rg — окно, dots — [{w, s}] */
function gauge(rg, label, col, mn, mx, dots) { const W = 170, r = 70, th = 13, cx = W / 2, cy = r + 14, H = cy + 30;
  const cl = g => Math.min(mx, Math.max(mn, g)), ang = g => Math.PI * (1 - (cl(g) - mn) / (mx - mn)), P = (g, rr = r) => [cx + rr * Math.cos(ang(g)), cy - rr * Math.sin(ang(g))];
  const arc = (a, b, c, w, ex = '') => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" ${ex}/>`; };
  const ap = rg && apxOf(rg); let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} ${esc(rng(rg))}">` + arc(mn, mx, '#232830', th);
  if (rg) s += ap ? arc(rg.lo - (rg.lo === rg.hi ? 1.5 : 0), rg.hi + (rg.lo === rg.hi ? 1.5 : 0), SC.apx, th, 'stroke-dasharray="3 5" opacity=".9"') : arc(rg.lo, rg.hi + (rg.hi === rg.lo ? .01 : 0), col, th);
  const step = (mx - mn) > 24 ? 4 : 2;
  for (let g = Math.ceil(mn / step) * step; g <= mx; g += step) { const [a, b] = [P(g, r - th / 2 - 4), P(g, r - th / 2 - (g % (step * 2) ? 7 : 10))]; s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#5B6470" stroke-width="1"/>`; }
  for (const d of dots) { const [x, y] = P(d.w); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${SC[d.s]}" stroke="#0C0F12" stroke-width="3"/>`; }
  const c = rg ? (ap && rg.lo === rg.hi ? '≈' + fg(rg.lo) : `${fg(rg.lo)}${rg.hi !== rg.lo ? '–' + fg(rg.hi) : ''}`) : '—';
  s += `<text x="${cx}" y="${cy - 14}" text-anchor="middle" class="gv" font-size="${c.length > 8 ? 20 : 26}">${esc(c)}</text><text x="${cx}" y="${cy + 4}" text-anchor="middle" class="gl">${esc(label.toUpperCase())}, г</text>`;
  const [a] = P(mn), [b] = P(mx); s += `<text x="${a.toFixed(1)}" y="${cy + 22}" text-anchor="middle" class="ga">${fg(mn)}</text><text x="${b.toFixed(1)}" y="${cy + 22}" text-anchor="middle" class="ga">${fg(mx)} г</text></svg>`;
  const marks = rg && ap ? [rg.lo, ...(rg.hi !== rg.lo ? [rg.hi] : [])].map(v => { const [x, y] = P(v, r + 14); return `<button class="apm" data-hint="${esc(APX[ap])}" aria-label="${esc(T.rod_card.approx_window)}" style="left:${(x / W * 100).toFixed(1)}%;top:${(y / H * 100).toFixed(1)}%">≈</button>`; }).join('') : '';
  return `<div class="gauge">${s}${marks}</div>`; }
function gaugesFor(r, ls) { const ws = []; for (const t of ['scandi', 'skagit']) { const g = r[t + '_g']; if (g) ws.push(g.lo, g.hi); }
  const pts = ls.filter(x => x.m.rg).map(x => x.m.w); const all = [...ws, ...pts]; if (!all.length) return '';
  const mn = Math.floor(Math.min(...all) - 3), mx = Math.ceil(Math.max(...all) + 3);
  const d = t => ls.filter(x => x.m.rg && x.m.rg === r[t + '_g']).map(x => ({w: x.m.w, s: stOf(x.m)}));
  return `<div class="gg">${gauge(r.scandi_g, 'Scandi', '#E9EEF2', mn, mx, d('scandi'))}${gauge(r.skagit_g, 'Skagit', '#7F95A8', mn, mx, d('skagit'))}</div>`; }
const win = (r, t, full) => { const g = r[t + '_g'], k = apxOf(g), txt = full ? rng(g, r[t + '_gr']) : g ? rng(g).split(' · ')[0] : '—';
  return k ? `<button class="apx" data-hint="${esc(APX[k])}" aria-label="${esc(T.rod_card.approx_window)}">${txt.startsWith('≈') ? '' : '≈'}${txt} <i>i</i></button>` : txt; };
const winShort = g => g ? `${apxOf(g) && g.lo === g.hi ? '~' : ''}${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''}` : '—';
function head(title, right = '') { const st = S.sync.token ? (SYNC_ST || (S.sync.last ? 'синхр. ' + new Date(S.sync.last).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}) : 'синхр.')) : 'копия выкл.';
  return `<div class="w top"><div class="row"><button class="av" data-tab="profile" aria-label="Профиль">${ICO.user}</button><span class="mono mut sm">⟳ ${esc(st)} · PIN</span><button class="cb" data-add aria-label="Добавить снасть">${ICO.plus}</button></div>${title ? `<div class="row" style="margin-top:14px;align-items:flex-end"><h1 class="h1">${esc(title)}</h1>${right}</div>` : ''}</div>`; }
const okN = ls => ls.filter(y => y.m.lvl === 'ok').length;
function home() { const c = k => S[k].length, ab = (k, t) => S[k].filter(x => inTab(k, x, t)).length;
  const pk = S.rods.map(r => ({r, ls: rodLines(r)})).filter(x => x.ls.length).sort((a, b) => okN(b.ls) - okN(a.ls))[0];
  let h = head(T.tabbar.arsenal) + `<div class="w"><button class="srch" data-tab="search">${ICO.search}<span>${esc(T.list.search)}</span></button></div>`;
  if (pk) { const best = pk.ls[0], rl = rodReels(pk.r).find(x => x.lvl === 'ok');
    h += `<div class="w"><div class="hero"><button class="blk" data-open="rod:${pk.r.id}"><div class="row"><span class="cap">Лучший подбор</span>${chip('ok', `Подходит ${okN(pk.ls)}`)}</div>
    <div class="hn" style="margin-top:6px">${esc(name(pk.r))}</div><div class="mut sm2">${esc(best.l.model)} ${fg(best.m.w)} г${rl ? ' · ' + esc(rl.x.model) : ''}</div></button>${gaugesFor(pk.r, pk.ls)}</div></div>`; }
  else if (!S.rods.length) h += `<div class="w">${emptyBox('rods')}</div>`;
  h += `<div class="w tiles">${[['rods', 'Удилища', '#E9EEF2'], ['lines', 'Шнуры', '#7F95A8'], ['reels', 'Катушки', '#C9D1DA']].map(([k, t, col]) => `<button class="tile" data-go="${k}"><b class="mono" style="color:${col}">${c(k)}</b><span>${t}</span></button>`).join('')}</div>`;
  if (S.rods.length) h += `<div class="w"><div class="row" style="margin-top:20px"><h2 class="h2">${esc(SEC.rods)}</h2><button class="lnk" data-go="rods">${esc(T.tabs.single)} ${ab('rods', 'single')} · ${esc(T.tabs.double)} ${ab('rods', 'double')} ›</button></div>
  ${S.rods.map(r => { const ap = apxOf(r.scandi_g) || apxOf(r.skagit_g); return `<button class="lr" data-open="rod:${r.id}"><div style="min-width:0"><div class="t">${esc(name(r))}</div><div class="mono mut sm">${esc(r.length || '—')} · ${esc(r.class || '—')}</div></div><div style="text-align:right;flex:none"><div class="mono sm3">S ${winShort(r.scandi_g)} · K ${winShort(r.skagit_g)}</div>${ap ? chip('apx', '≈ ' + T.rod_card.approx_window) : ''}</div></button>`; }).join('')}</div>`;
  if (!S.sync.token) h += `<div class="w"><div class="card mut" style="margin-top:14px">Чтобы загрузить реестр и включить резервную копию, добавьте ключ GitHub в профиле: кнопка слева вверху.</div></div>`;
  return h + `<div class="w mut sm2" style="margin-top:14px">${esc(T.home.hint)}</div>`; }
function scale(rg, w, m = {}) { if (!rg || w == null) return ''; const mn = Math.min(rg.lo, w) - 4, mx = Math.max(rg.hi, w) + 4, p = x => (x - mn) / (mx - mn) * 100, s = m.kind ? stOf(m) : 'ok', ap = apxOf(rg);
  return `<div class="scale"><div class="t"></div><div class="a" style="left:${p(rg.lo)}%;width:${Math.max(p(rg.hi) - p(rg.lo), 1.5)}%;${ap ? 'background:#9AA4B2' : ''}"></div><div class="k" style="left:${p(w)}%;background:${SC[s]}"></div><span class="n" style="left:${p(rg.lo)}%">${fg(rg.lo)}</span>${rg.hi !== rg.lo ? `<span class="n" style="left:${p(rg.hi)}%">${fg(rg.hi)}</span>` : ''}</div>`; }
const mBadge = (m, small) => `<div class="bdgs">${chip(stOf(m), stLbl(m))}${m.rg && apxOf(m.rg) ? apxBtn(apxOf(m.rg), 1) : ''}</div>${!small && mNote(m) ? `<div class="mut sm2" style="margin-top:4px">${esc(mNote(m))}</div>` : ''}`;
function lineRow(l, m, full) { const s = stOf(m);
  return `<button class="lr" data-open="line:${l.id}"><span class="dot" style="background:${SC[s]}"></span><div style="flex:1;min-width:0"><div class="t">${esc(name(l))}</div><div class="mono mut sm">${esc(TL(l.type))} · ${Math.round(m.w * GR)} gr · ${fg(m.w)} г${m.tip ? ' · + ' + esc(m.tip.name || 'конец') : ''}</div>${full && mNote(m) ? `<div class="mut sm2" style="margin-top:2px">${esc(mNote(m))}</div>` : ''}</div><div class="bdgs r">${chip(s, stLbl(m))}${m.rg && apxOf(m.rg) ? chip('apx', '≈') : ''}</div></button>`; }
function reelRow(x) { return `<button class="card row rr" data-open="reel:${x.x.id}"><div class="row" style="gap:12px;min-width:0"><div class="thumb">${artBox('reels')}</div><div style="min-width:0"><div class="t">${esc(name(x.x))}</div><div class="mut sm2">Катушка${x.x.cls ? ' · ' + clsTxt(x.x.cls) : ''}${x.lvl === 'ok' ? '' : ' · ' + esc(x.why)}</div></div></div>${chip(x.lvl === 'ok' ? 'ok' : 'fb', x.lvl === 'ok' ? 'Подходит' : 'Запасной')}</button>`; }
function rodExp(r) { const ls = rodLines(r), rs = rodReels(r);
  return `<div class="exp">${gaugesFor(r, ls)}<div class="cap" style="margin:8px 0 2px">${esc(T.rod_card.matches_title)}</div>${ls.length ? ls.map(x => lineRow(x.l, x.m)).join('') : `<div class="mut">${esc(T.empty.no_match)}</div>`}
  <div class="cap" style="margin:12px 0 6px">${esc(T.list.matching_reels)}</div>${rs.length ? rs.map(reelRow).join('') : '<div class="mut">—</div>'}<button class="more" data-open="rod:${r.id}">${esc(T.list.more)} ›</button></div>`; }
function recBlock(r) { return `<div class="card" style="margin-top:12px"><div class="cap">${esc(T.list.line_recommendation)}</div><div class="rec"><b>Scandi</b><span>${win(r, 'scandi', 1)}</span><b>Skagit</b><span>${win(r, 'skagit', 1)}</span>${r.rio ? `<b>RIO</b><span>${esc([r.rio.scandi && 'Scandi ' + r.rio.scandi, r.rio.skagit && 'Skagit ' + r.rio.skagit].filter(Boolean).join('; '))}</span>` : ''}</div>${r.line_note ? `<div class="mut sm2" style="margin-top:8px">${esc(r.line_note)}</div>` : ''}</div>`; }
function itemHead(k, x) { const sub = k === 'rods' ? `${esc(x.length || '—')} · ${esc(x.class || '—')}` : k === 'reels' ? `${esc(x.size || '')}${x.cls ? (x.size ? ' · ' : '') + clsTxt(x.cls) : ''}` : `${esc(TL(x.type))}`;
  const line2 = k === 'rods' ? `S ${winShort(x.scandi_g)} · K ${winShort(x.skagit_g)}` : k === 'reels' ? (x.hand === 'both' ? T.tabs.both : x.hand === 'single' ? T.tabs.single : x.hand === 'double' ? T.tabs.double : 'назначение не указано') : `${lineG(x) != null ? fg(lineG(x)) + ' г · ' + Math.round(x.w_gr || lineG(x) * GR) + ' gr' : esc(x.w_raw || '')}${x.float ? ' · ' + esc(x.float) : ''}${x.has_tips ? ' · сменные концы' : ''}`;
  return `<div class="hd" data-tog="${x.id}" role="button" tabindex="0" aria-expanded="${OPEN === x.id}"><div class="thumb">${artBox(k)}</div><div style="flex:1;min-width:0"><div class="t">${esc(name(x))}</div><div class="mono mut sm">${sub}</div><div class="mono sm3" style="margin-top:2px">${line2}</div></div><span class="tg ${OPEN === x.id ? 'on' : ''}" aria-hidden="true">${OPEN === x.id ? '−' : '+'}</span></div>`; }
function reelExp(x) { const rods = S.rods.filter(r => rodReels(r).some(y => y.x.id === x.id && y.lvl === 'ok'));
  return `<div class="exp"><div class="cap" style="margin-bottom:4px">Подходящие удилища</div>${rods.length ? rods.map(r => `<button class="lr" data-open="rod:${r.id}"><span class="dot" style="background:${SC.ok}"></span><div style="flex:1"><div class="t">${esc(name(r))}</div><div class="mono mut sm">${esc(r.class || '')}</div></div>${chip('ok', 'Подходит')}</button>`).join('') : `<div class="mut">${x.cls ? '—' : 'Укажите классы катушки, и подбор заработает'}</div>`}
  <div class="g2" style="margin-top:10px"><div class="stat"><small>${T.reel_card.class_range}</small><b>${x.cls ? clsTxt(x.cls) : (esc(x.size) || '—')}</b></div><div class="stat"><small>Тормоз</small><b>${esc(x.drag || '—')}</b></div></div><button class="more" data-open="reel:${x.id}">${esc(T.list.more)} ›</button></div>`; }
function tipsRow(l) { return (l.tips || []).length ? `<div class="hs">${l.tips.map(t => `<div class="tipc"><b>${esc(t.name || 'Конец')}</b><span class="mono">${t.w_g != null ? fg(num(t.w_g)) + ' г' : '—'} · ${t.len ? esc(t.len) + ' м' : '—'}</span>${t.sink ? `<span>${esc(t.sink)} д/с</span>` : ''}</div>`).join('')}</div>` : `<div class="mut">${esc(T.empty.tips)}</div>`; }
function lineExp(l) { const rs = lineRods(l);
  return `<div class="exp"><div class="cap" style="margin-bottom:4px">${esc(T.line_card.fits_rods)}</div>${rs.length ? rs.map(x => `<button class="card blk" style="margin-top:8px" data-open="rod:${x.r.id}"><div class="row"><span class="t">${esc(name(x.r))}</span><b class="mono sm3">${fg(x.m.w)} г</b></div>${x.m.rg ? scale(x.m.rg, x.m.w, x.m) : ''}${mBadge(x.m)}</button>`).join('') : `<div class="mut">—</div>`}
  ${l.type !== 'tip' ? `<div class="cap" style="margin:14px 0 6px">${esc(T.line_card.tips_title)}</div>${tipsRow(l)}` : ''}<button class="more" data-open="line:${l.id}">${esc(T.list.more)} ›</button></div>`; }
function list(k) { const tab = VIEW.tab || 'double', all = S[k], xs = all.filter(x => inTab(k, x, tab)), q = (VIEW.q || '').toLowerCase(), fx = q ? xs.filter(x => name(x).toLowerCase().includes(q)) : xs;
  return `<div class="w top"><div class="row"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><button class="pill ac" data-new="${k}">${ICO.plus}${esc(T.list.add)}</button></div>
  <div class="row" style="margin-top:14px;align-items:flex-end"><h1 class="h1">${esc(SEC[k])}</h1><span class="mut sm2" style="white-space:nowrap">${esc(T.list.count.replace('{n}', all.length))}</span></div>
  <div class="seg" style="margin-top:14px">${['single', 'double'].map(t => `<button data-tab2="${t}" class="${tab === t ? 'on' : ''}">${T.tabs[t]} · ${all.filter(x => inTab(k, x, t)).length}</button>`).join('')}</div>
  ${xs.length > 5 ? `<label class="f" style="margin-top:10px"><input id="q" placeholder="${esc(T.list.search)}" value="${esc(VIEW.q || '')}" aria-label="${esc(T.list.search)}"></label>` : ''}</div>
  <div class="w" style="margin-top:14px">${fx.length ? fx.map(x => `<div class="it">${itemHead(k, x)}${OPEN === x.id ? (k === 'rods' ? rodExp(x) : k === 'reels' ? reelExp(x) : lineExp(x)) : ''}</div>`).join('') : emptyBox(k)}</div>`; }
function emptyBox(k) { return `<div class="empty"><div class="eph">${artBox(k)}</div><div class="h2" style="line-height:1.3">${esc(T.empty[k])}</div><button class="btn" style="margin-top:20px" data-new="${k}">+ ${esc(T.empty.button)}</button></div>`; }
function cardTop(k, x) { return `<div class="chero"><div class="glow"></div>${artBox(k, `inset:${k === 'rods' ? '40px -24px 30px -24px' : '60px 20% 20px'};background-size:contain;transform:${k === 'rods' ? 'rotate(-14deg)' : 'none'}`)}<div class="w row top" style="position:relative"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><button class="pill" data-edit="${k}:${x.id}">${esc(T.rod_card.edit)}</button></div></div>`; }
const stats = a => `<div class="mono specs">${a.filter(([, v]) => v && v !== '—').map(([s, v]) => `<span title="${esc(s)}">${v}</span>`).join('')}</div>`;
const buyBlock = x => x.buy && Object.keys(x.buy).length ? `<div class="card" style="margin-top:12px"><div class="cap">Покупка</div><div class="mut sm2" style="margin-top:4px">${[x.buy.date, x.buy.shop, x.buy.price_eur != null ? String(x.buy.price_eur).replace('.', ',') + ' € без НДС' : ''].filter(Boolean).map(esc).join(' · ')}</div></div>` : '';
const noteBlock = x => x.note ? `<div class="mut" style="margin-top:12px">${esc(x.note)}</div>` : '';
const delBtn = (k, x) => `<button class="btn r" style="margin-top:22px" data-del="${k}:${x.id}">${esc(T.rod_card.delete)}</button>`;
const titleBlock = (cap, x) => `<div class="cap">${cap}</div><h1 class="h1 big2">${esc(x.model || '')}</h1>`;
function rodCard(r) { const ls = rodLines(r), rs = rodReels(r);
  return cardTop('rods', r) + `<div class="w ctxt">${titleBlock(`${esc(r.brand || '')} · ${RT[r.type] || ''}`, r)}${stats([['Длина', esc(r.length || '—')], ['Класс', esc(r.class || '—')]])}
  <div class="card gcard">${gaugesFor(r, ls) || `<div class="mut">Окна Scandi и Skagit не указаны</div>`}</div>
  <div class="row" style="margin-top:20px"><h2 class="h2">${esc(T.rod_card.matches_title)}</h2><span class="mut mono">${ls.length}</span></div><div class="mut sm2" style="margin:2px 0 4px">${esc(T.rod_card.matches_hint)}</div>
  ${ls.length ? ls.map(x => lineRow(x.l, x.m, 1)).join('') : `<div class="mut">${esc(T.empty.no_match)}</div>`}
  <div class="cap" style="margin:18px 0 6px">${esc(T.list.matching_reels)}</div>${rs.map(reelRow).join('') || '<div class="mut">—</div>'}
  ${recBlock(r)}${r.rio?.note ? `<div class="mut sm2" style="margin-top:6px">${esc(r.rio.note)}</div>` : ''}${r.source ? `<div class="mut sm2" style="margin-top:8px;word-break:break-all">Источник: ${esc(r.source)}</div>` : ''}${noteBlock(r)}${buyBlock(r)}${delBtn('rods', r)}</div>`; }
function reelCard(x) { const fit = x.hand === 'both' ? T.reel_card.fits_both : x.hand === 'single' ? T.reel_card.fits_single : x.hand === 'double' ? T.reel_card.fits_double : 'не указано';
  return cardTop('reels', x) + `<div class="w ctxt">${titleBlock(`${esc(x.brand || '')} · катушка`, x)}${stats([['Классы', x.cls ? clsTxt(x.cls) : esc(x.size || '—')], ['Размер', esc(x.size || '')]])}<div class="card" style="margin-top:14px"><b>${esc(T.reel_card.fits)}:</b> ${esc(fit)}</div>${reelExp(x).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(x)}${buyBlock(x)}${delBtn('reels', x)}</div>`; }
function lineCard(l) { const g = lineG(l);
  return cardTop('lines', l) + `<div class="w ctxt">${titleBlock(`${esc(TL(l.type))} · ${esc(l.brand || '')}`, l)}
  <div class="g2" style="margin-top:14px">${[[T.line_card.weight, g != null ? fg(g) + ' г' : esc(l.w_raw || '—')], ['Грейны', g != null ? Math.round(l.w_gr || g * GR) + ' gr' : '—'], [T.line_card.length, esc(l.length || '—')], [T.line_card.floating, esc(l.float || '—')]].map(([s, v]) => `<div class="stat"><small>${esc(s)}</small><b>${v}</b></div>`).join('')}</div>
  <div class="card" style="margin-top:12px">${l.has_tips ? T.line_card.tips_yes : T.line_card.tips_no}${l.body ? ' · тело головы, вес без конца' : ''}${l.reel ? ' · на катушке: ' + esc(l.reel) : ''}</div>${lineExp(l).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(l)}${buyBlock(l)}${delBtn('lines', l)}</div>`; }
/* общий точечный график: оба окна на одной оси граммов, точки — шнуры */
function dotChart(r, ls) { const W = 340, H = 200, ay = 154, L = 14, R = 14; const ws = [], pts = ls.filter(x => x.m.rg);
  for (const t of ['scandi', 'skagit']) { const g = r[t + '_g']; if (g) ws.push(g.lo, g.hi); } const all = [...ws, ...pts.map(x => x.m.w)]; if (!all.length) return '';
  const mn = Math.floor(Math.min(...all) - 2), mx = Math.ceil(Math.max(...all) + 2), x = g => L + (g - mn) / (mx - mn) * (W - L - R);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Шнуры на оси веса, граммы">`; const step = mx - mn > 24 ? 4 : 2;
  for (let g = mn; g <= mx; g++) { s += `<line x1="${x(g).toFixed(1)}" x2="${x(g).toFixed(1)}" y1="${ay + 4}" y2="${ay + (g % step ? 9 : 14)}" stroke="#5B6470"/>`; if (g % step === 0) s += `<text x="${x(g).toFixed(1)}" y="${ay + 30}" text-anchor="middle" class="ga">${g}</text>`; }
  [['scandi', '#E9EEF2'], ['skagit', '#7F95A8']].forEach(([t, c], i) => { const g = r[t + '_g']; if (!g) return; const ap = apxOf(g), lo = ap && g.lo === g.hi ? g.lo - 1.5 : g.lo, hi = ap && g.lo === g.hi ? g.hi + 1.5 : g.hi, col = ap ? SC.apx : c, w = Math.max(x(hi) - x(lo), 3);
    s += `<rect x="${x(lo).toFixed(1)}" y="38" width="${w.toFixed(1)}" height="${ay - 38}" fill="${col}" opacity=".12"/><rect x="${x(lo).toFixed(1)}" y="${ay - 6}" width="${w.toFixed(1)}" height="6" fill="${col}" ${ap ? 'opacity=".7"' : ''}/>`;
    s += `<text x="${Math.min(W - 70, Math.max(70, (x(lo) + x(hi)) / 2)).toFixed(1)}" y="${13 + i * 17}" text-anchor="middle" class="gw" fill="${col}">${t.toUpperCase()} ${esc(winShort(g).replace('~', '≈'))}</text>`; });
  const ys = [52, 74, 96, 118, 63, 85, 107, 129]; pts.forEach((p, i) => { const cx = x(p.m.w), y = ys[i % ys.length], c = SC[stOf(p.m)], rt = cx > W - 80;
    s += `<line x1="${cx.toFixed(1)}" x2="${cx.toFixed(1)}" y1="${y}" y2="${ay - 7}" stroke="${c}" stroke-dasharray="2 3"/><circle cx="${cx.toFixed(1)}" cy="${y}" r="7" fill="${c}" stroke="#0C0F12" stroke-width="2.5"/><text x="${(cx + (rt ? -11 : 11)).toFixed(1)}" y="${y + 4}" text-anchor="${rt ? 'end' : 'start'}" class="gd">${Math.round(p.m.w * GR)} gr</text>`; });
  return s + '</svg>'; }
function pick() { if (!S.rods.length) return head('Подбор') + `<div class="w">${emptyBox('rods')}</div>`;
  const best = S.rods.map(r => ({r, n: okN(rodLines(r))})).sort((a, b) => b.n - a.n)[0].r; const r = S.rods.find(x => x.id === VIEW.sel) || best, ls = rodLines(r);
  const cnt = {ok: 0, edge: 0, fb: 0, apx: 0}; ls.forEach(x => { cnt[stOf(x.m)]++; if (x.m.rg && apxOf(x.m.rg)) cnt.apx++; });
  const aw = ['scandi', 'skagit'].filter(t => apxOf(r[t + '_g']));
  return head('Подбор') + `<div class="hs rods" role="tablist" aria-label="Удилище">${S.rods.map(x => `<button class="rchip ${x.id === r.id ? 'on' : ''}" data-sel="${x.id}" role="tab" aria-selected="${x.id === r.id}"><div class="thumb s">${artBox('rods')}</div><div style="text-align:left;min-width:0"><div class="t">${esc(x.model)}</div><div class="mono mut sm">${esc(x.class || '—')} · ${esc(x.length || '—')}</div></div></button>`).join('')}</div>
  <div class="w"><div class="card chart">${dotChart(r, ls) || `<div class="mut">Окна Scandi и Skagit не указаны, подбор по классу</div>`}</div>
  <div class="legend">${[['ok', 'Подходит'], ['edge', T.rod_card.on_edge], ['fb', 'Запасной'], ['apx', T.rod_card.approx_window]].map(([k, t]) => `<span><i style="background:${SC[k]}"></i>${t} <b class="mono">${cnt[k]}</b></span>`).join('')}</div>
  ${ls.length ? ls.map(x => `<div class="pr">${lineRow(x.l, x.m, 1)}</div>`).join('') : `<div class="mut" style="margin-top:10px">${esc(T.empty.no_match)}</div>`}
  ${aw.map(t => `<div class="card dash row" style="margin-top:8px">${apxBtn(apxOf(r[t + '_g']))}<span class="mono mut sm">${t === 'scandi' ? 'Scandi' : 'Skagit'} · ${esc(winShort(r[t + '_g']))} ±1,5 г</span></div>`).join('')}
  <button class="more" data-open="rod:${r.id}">Карточка удилища ›</button></div>`; }
function search() { const q = (VIEW.q || '').trim(), ql = q.toLowerCase(), w = /^\d+([.,]\d+)?\s*(г|g)?$/i.test(q) ? num(q.replace(/[^\d.,]/g, '')) : null;
  let h = `<div class="w top"><div class="row" style="gap:10px"><label class="srch in" style="flex:1;margin:0">${ICO.search}<input id="sq" type="search" enterkeyhint="search" placeholder="Модель или вес, например 35" value="${esc(q)}" aria-label="Поиск" autocomplete="off"></label>${q ? `<button class="lnk ac" data-clr>Сброс</button>` : ''}</div>`;
  if (!q) return h + `<div class="mut" style="margin-top:16px">Ищите по названию снасти или введите вес в граммах: покажу головы этого веса и удилища, которым он подходит.</div></div>`;
  if (w != null) { const ls = S.lines.filter(l => lineG(l) != null && Math.abs(lineG(l) - w) <= 2).sort((a, b) => Math.abs(lineG(a) - w) - Math.abs(lineG(b) - w));
    h += `<div class="cap" style="margin-top:18px">Головы весом ${fg(w - 2)}–${fg(w + 2)} г</div>` + (ls.length ? ls.map(l => { const rr = lineRods(l)[0]; return `<button class="lr" data-open="line:${l.id}"><div style="flex:1;min-width:0"><div class="t">${esc(name(l))}</div><div class="mut sm2">${esc(TL(l.type))} · ${fg(lineG(l))} г${rr ? ' · к ' + esc(rr.r.model) : ''}</div></div>${rr ? chip(stOf(rr.m), stLbl(rr.m)) : ''}</button>`; }).join('') : '<div class="mut" style="padding:8px 0">—</div>');
    const rods = S.rods.map(r => { let b = null; for (const t of ['scandi', 'skagit']) { const g = r[t + '_g']; if (!g) continue; const f = fit({w, gr: w * GR}, g, null, t); if (f && f.in && (!b || !b.f.in)) b = {t, f, g}; else if (f && !b) b = {t, f, g}; } return b && {r, b}; }).filter(Boolean);
    h += `<div class="cap" style="margin-top:18px">Удилища под ${fg(w)} г</div>` + (rods.length ? rods.map(({r, b}) => `<button class="lr" data-open="rod:${r.id}"><div style="flex:1;min-width:0"><div class="t">${esc(name(r))}</div><div class="mono mut sm">${b.t === 'scandi' ? 'Scandi' : 'Skagit'} ${esc(winShort(b.g))}</div></div>${chip(b.f.in ? (b.f.edge ? 'edge' : 'ok') : 'fb', b.f.in ? (b.f.edge ? T.rod_card.on_edge : 'Подходит') : 'Запасной ' + b.f.devTxt)}${apxOf(b.g) ? chip('apx', '≈') : ''}</button>`).join('') : '<div class="mut" style="padding:8px 0">—</div>'); }
  for (const k of ['rods', 'lines', 'reels']) { const xs = S[k].filter(x => name(x).toLowerCase().includes(ql) || TL(x.type || '').toLowerCase().includes(ql)); if (!xs.length) continue;
    h += `<div class="cap" style="margin-top:18px">${esc(SEC[k])} · ${xs.length}</div>` + xs.map(x => `<button class="lr" data-open="${k.slice(0, -1)}:${x.id}"><div class="thumb s">${artBox(k)}</div><div style="flex:1;min-width:0"><div class="t">${esc(name(x))}</div><div class="mono mut sm">${k === 'rods' ? `S ${winShort(x.scandi_g)} · K ${winShort(x.skagit_g)}` : k === 'lines' ? `${esc(TL(x.type))}${lineG(x) != null ? ' · ' + fg(lineG(x)) + ' г' : ''}` : (x.cls ? clsTxt(x.cls) : esc(x.size || ''))}</div></div><span class="mut" aria-hidden="true">›</span></button>`).join(''); }
  return h + '</div>'; }
function profile() { const n = S.rods.length + S.reels.length + S.lines.length;
  return `<div class="w top"><div class="row"><button class="cb" data-tab="home" aria-label="Назад">${ICO.back}</button><span></span></div><div style="text-align:center;margin-top:10px"><div class="av big">${ICO.user}</div><h1 class="h1" style="margin-top:10px">Профиль</h1><div class="mut">${n} снастей · удилищ ${S.rods.length} · катушек ${S.reels.length} · шнуров ${S.lines.length}</div></div>
  <div class="card" style="margin-top:18px;padding:4px 16px">
   <div class="pl"><span>PIN-код</span><span class="mut">4 цифры · шифрует данные</span></div>
   <div class="pl"><span>Синхронизация</span><span class="mut">${S.sync.token ? esc(SYNC_ST || (S.sync.last ? new Date(S.sync.last).toLocaleString('ru-RU', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'}) : 'включена')) : 'выключена'}</span></div>
   <div class="pl"><span>Импорт из таблицы</span><span class="mut">${S.sync.token ? 'при каждой синхронизации' : 'нужен ключ'}</span></div>
   <div class="pl" style="border:0"><span>Единицы</span><span class="mut mono">г / gr</span></div></div>
  <div class="card" style="margin-top:14px"><div class="cap">Резервная копия и реестр</div><div class="mut sm2" style="margin:6px 0 12px">Данные шифруются PIN-кодом на телефоне и хранятся в закрытом репозитории ${DATA_REPO}. Нужен ключ GitHub (Fine-grained, только репозиторий flyfish-data, Contents: Read and write). Никому его не пересылайте.</div>
  ${S.sync.token ? `<button class="btn" id="syn">Синхронизировать</button><button class="btn l" style="margin-top:8px" id="toff">Убрать ключ</button>`
   : `<label class="f"><small>Ключ GitHub</small><input id="tok" type="password" autocomplete="off"></label><button class="btn" style="margin-top:10px" id="ton">Подключить</button>`}</div>
  <div class="card" style="margin-top:14px"><div class="cap">${esc(T.pin.title)}</div><div class="dots sm" aria-hidden="true"><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i></div><div class="mut sm2">${esc(T.pin.subtitle)}</div><button class="btn l" style="margin-top:12px" id="lock">Заблокировать</button></div></div>`; }
/* ---------- добавление по шагам ---------- */
function addStep() { return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(T.forms.cancel)}">✕</button><span class="mono mut sm">шаг 1 из 2</span><span style="width:44px"></span></div><div class="prog"><i style="width:50%"></i></div>
  <h1 class="h1" style="margin-top:16px">Что добавляем?</h1><div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">${[['rods', T.forms.rod.title, T.forms.rod.hint], ['lines', T.forms.line.title, T.forms.line.hint], ['reels', T.forms.reel.title, T.forms.reel.hint]].map(([k, t, s]) => `<button class="card row kind" data-new="${k}"><div class="thumb">${artBox(k)}</div><div style="flex:1;text-align:left"><div class="t">${esc(t)}</div><div class="mut sm2">${esc(s)}</div></div><span class="mut" aria-hidden="true">›</span></button>`).join('')}</div></div>`; }
const FL = (lbl, n, v, t = 'text', extra = '') => `<label class="f"><small>${esc(lbl)}</small><input name="${n}" value="${esc(v ?? '')}" type="text" ${t === 'text' ? 'autocomplete="off"' : 'inputmode="decimal" enterkeyhint="next" class="mono"'} ${extra}></label>`;
const segF = (n, opts, v) => `<div class="seg wrap" data-seg="${n}">${opts.map(([k, t]) => `<button type="button" data-v="${k}" class="${v === k ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>`;
let DRAFT = null;
function form(v) { const k = v.k, x = DRAFT, F = T.forms; const ttl = v.id ? T.rod_card.edit : F[k === 'rods' ? 'rod' : k === 'reels' ? 'reel' : 'line'].title;
  let b = '';
  if (k === 'rods') b = `${segF('type', [['single', 'Одноручка'], ['double', 'Двуручка'], ['switch', 'Свитч']], x.type)}${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}<div class="g2">${FL('Длина, например 13\'2"', 'length', x.length)}${FL(F.rod.class, 'class', x.class)}</div>
    <div class="g2">${FL('Scandi от, г', 'sc_lo', x.scandi_g?.lo, 'number')}${FL('Scandi до, г', 'sc_hi', x.scandi_g?.hi, 'number')}${FL('Skagit от, г', 'sk_lo', x.skagit_g?.lo, 'number')}${FL('Skagit до, г', 'sk_hi', x.skagit_g?.hi, 'number')}</div><div class="mut sm2">${esc(F.rod.hint)}. Граммы → грейны: × 15,43</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'reels') b = `${FL('Производитель', 'brand', x.brand)}${FL(F.reel.model, 'model', x.model)}<div class="g2">${FL('Класс от, #', 'c_lo', x.cls?.[0], 'number')}${FL('Класс до, #', 'c_hi', x.cls?.[1], 'number')}</div>${FL('Размер / модель', 'size', x.size)}${FL('Тормоз', 'drag', x.drag)}<div class="cap">${esc(F.reel.fits)}</div>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand)}<div class="mut sm2">${esc(F.reel.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'lines') b = `<div class="cap">${esc(F.line.type)}</div>${segF('type', [['full', TL('full')], ['scandi', 'Scandi'], ['skagit', 'Skagit'], ['integrated', TL('integrated')], ['running', TL('running')], ['tip', 'Сменный конец']], x.type)}
    <div class="cap">Для каких удилищ</div>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand || 'double')}${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}
    <div class="g2">${FL('Вес, г', 'w_g', x.w_g, 'number')}${FL('Вес, грейны', 'w_gr', x.w_gr, 'number')}${FL(F.line.length, 'length', x.length)}${FL('Класс (для полного шнура)', 'class', x.class)}</div>${FL(F.line.floating, 'float', x.float)}
    <div class="row" style="padding:6px 2px"><b>${esc(F.line.has_tips)}</b><button type="button" class="sw ${x.has_tips ? 'on' : ''}" id="htips" role="switch" aria-checked="${!!x.has_tips}" aria-label="${esc(F.line.has_tips)}"></button></div>
    ${x.has_tips ? `<div class="hs">${(x.tips || []).map((t, i) => `<div class="tipc" style="width:160px"><input data-tip="${i}" data-f="name" placeholder="Название" value="${esc(t.name || '')}" style="font-weight:700"><input data-tip="${i}" data-f="w_g" placeholder="Вес, г" inputmode="decimal" aria-label="Вес конца, г" value="${esc(t.w_g ?? '')}"><input data-tip="${i}" data-f="len" placeholder="Длина, м" inputmode="decimal" value="${esc(t.len ?? '')}"><input data-tip="${i}" data-f="sink" placeholder="Погружение, д/с" value="${esc(t.sink ?? '')}"><button type="button" data-rmtip="${i}" class="mut lnk">убрать</button></div>`).join('')}<button type="button" class="tipc" id="addtip" style="text-align:center">+ ${esc(F.tip.title)}</button></div><div class="mut sm2">${esc(F.tip.hint)}</div>` : ''}<div class="mut sm2">${esc(F.line.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(F.cancel)}">✕</button><span class="mono mut sm">${v.id ? 'правка' : 'шаг 2 из 2'}</span><button class="lnk ac" data-save>${esc(F.save)}</button></div><div class="prog"><i style="width:100%"></i></div><h1 class="h1" style="margin-top:16px">${esc(ttl)}</h1>
  ${k !== 'reels' ? `<div class="card" style="margin-top:14px" id="pv">${preview()}</div>` : ''}
  <form id="fm" style="display:flex;flex-direction:column;gap:10px;margin-top:14px" onsubmit="return false">${b}<button class="btn" type="button" data-save style="margin-top:10px">${esc(F.save)}</button></form></div>`; }
/* превью подбора по черновику — те же правила matchLine */
function preview() { const d = DRAFT, k = VIEW.k; let rows = [];
  if (k === 'lines') { const wg = num(d.w_g) ?? (num(d.w_gr) != null ? num(d.w_gr) / GR : null); if (wg == null && !d.class) return `<div class="cap">Превью подбора</div><div class="mut sm2" style="margin-top:6px">Введите вес, и здесь появятся удилища</div>`;
    const l = {type: d.type || 'scandi', hand: d.hand || 'double', w_g: num(d.w_g) ?? (wg != null ? r1(wg) : null), w_gr: num(d.w_gr) ?? (wg != null ? Math.round(wg * GR) : null), cls: clsOf(d.class), has_tips: !!d.has_tips, tips: d.has_tips ? (d.tips || []) : []};
    rows = S.rods.map(r => ({n: name(r), m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]); }
  if (k === 'rods') { const R = (a, b) => num(a) != null ? {lo: num(a), hi: num(b) ?? num(a), approx: false} : null, sg = R(d.sc_lo ?? d.scandi_g?.lo, d.sc_hi ?? d.scandi_g?.hi), kg = R(d.sk_lo ?? d.skagit_g?.lo, d.sk_hi ?? d.skagit_g?.hi);
    const r = {type: d.type || 'double', cls: clsOf(d.class), scandi_g: sg, skagit_g: kg, scandi_gr: sg && {lo: sg.lo * GR, hi: sg.hi * GR}, skagit_gr: kg && {lo: kg.lo * GR, hi: kg.hi * GR}};
    if (!sg && !kg && !r.cls) return `<div class="cap">Превью подбора</div><div class="mut sm2" style="margin-top:6px">Введите окна Scandi и Skagit, и здесь появятся шнуры</div>`;
    rows = S.lines.map(l => ({n: name(l), m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]); }
  return `<div class="cap">Превью подбора · ${rows.length}</div>${rows.slice(0, 6).map(x => `<div class="row" style="margin-top:8px;gap:8px"><span class="sm3" style="min-width:0">${esc(x.n)}</span>${chip(stOf(x.m), stLbl(x.m))}</div>`).join('') || '<div class="mut sm2" style="margin-top:6px">Пока ничего не подходит</div>'}${rows.length > 6 ? `<div class="mut sm2" style="margin-top:6px">и ещё ${rows.length - 6}</div>` : ''}`; }
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
  save(); toast(T.forms.saved); DRAFT = null; back(); if (VIEW.t === "add") back(); }
/* ---------- события ---------- */
function bind() {
  app().onclick = async e => { const t = e.target.closest('[data-hint],button,[data-tog]'); if (!t) return; const d = t.dataset;
    if (d.tab) { HIST.length = 0; VIEW = {t: d.tab, q: d.tab === 'search' ? '' : undefined}; render(); scrollTo(0, 0); if (d.tab === 'search') { const i = $('#sq'); i && i.focus(); } return; }
    if (d.go) return go({t: 'list', k: d.go, root: 'home', tab: 'double'});
    if (d.hint) return toast(d.hint, 4000);
    if (d.back != null) return back();
    if (d.add != null) return go({t: 'add', root: VIEW.root || VIEW.t});
    if (d.sel) { VIEW.sel = d.sel; render(); const c = document.querySelector('.rchip.on'); c && c.scrollIntoView({block: 'nearest', inline: 'nearest'}); return; }
    if (d.clr != null) { VIEW.q = ''; render(); $('#sq').focus(); return; }
    if (d.tab2) { VIEW.tab = d.tab2; OPEN = null; return render(); }
    if (d.tog) { OPEN = OPEN === d.tog ? null : d.tog; return render(); }
    if (d.open) { const [k, ...id] = d.open.split(':'); return go({t: k, id: id.join(':'), root: VIEW.root || VIEW.t}); }
    if (d.new) { DRAFT = {tips: [], type: d.new === 'lines' ? 'scandi' : d.new === 'rods' ? (VIEW.tab || 'double') : undefined, hand: d.new === 'reels' ? null : undefined}; return go({t: 'form', k: d.new, root: VIEW.root || 'home'}); }
    if (d.edit) { const [k, ...id] = d.edit.split(':'); const x = byId(k, id.join(':')); DRAFT = JSON.parse(JSON.stringify(x)); DRAFT.tips = DRAFT.tips || []; return go({t: 'form', k, id: x.id, root: VIEW.root || 'home'}); }
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
  const sq = $('#sq'); if (sq) sq.oninput = () => { VIEW.q = sq.value; const p = sq.selectionStart; render(); const n = $('#sq'); n.focus(); n.setSelectionRange(p, p); };
  const fm = $('#fm'), pv = $('#pv'); if (fm && pv) fm.oninput = () => { readForm(); pv.innerHTML = preview(); };
}
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); } });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S?.sync?.token) syncNow(); });
window.__ff = {matchLine, mergeSeed, rodLines: r => rodLines(r), rodReels: r => rodReels(r), get S() { return S; }};
boot();
