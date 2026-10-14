/* Нахлыст. Снасти — PWA. Данные шифруются ключом из PIN (PBKDF2-SHA256 600k + AES-GCM), хранятся в IndexedDB
   и (по ключу GitHub) в закрытом репозитории makc178/flyfish-data. Код открыт, данных в нём нет. */
'use strict';
const T = {"app": {"name": "Нахлыст. Снасти", "slogan": "Подбери шнур раньше, чем рыба подберёт отговорку"}, "pin": {"title": "Введите PIN", "subtitle": "Снасти любят тишину и посторонних не пускают", "error": "Не тот PIN. Как муха не того размера — вроде похоже, но не клюёт", "button": "Открыть"}, "home": {"title": "Ваш арсенал", "sections": {"rods": "Удилища", "reels": "Катушки", "lines": "Шнуры и головы"}, "hint": ""}, "tabs": {"single": "Одноручные", "double": "Двуручные", "both": "Подходит на оба"}, "list": {"add": "Добавить", "count": "{n} шт.", "more": "Подробнее", "line_recommendation": "Рекомендация по шнурам", "collapse": "Свернуть", "matches_count": {"one": "шнур", "few": "шнура", "many": "шнуров"}, "titles": {"_comment": "Заголовок экрана списка; нет ключа — название раздела с главной", "lines": "Шнуры"}, "crest": {"_comment": "Герб в шапке списков (вариант A): размер, анимация (дыхание, блик)", "w": 64, "h": 54, "breath_s": 4, "glint_s": 6}}, "rod_card": {"length": "Длина", "class": "Класс", "type": "Тип", "scandi": "Scandi, рекомендованный вес", "skagit": "Skagit, рекомендованный вес", "matches_title": "Подходящие шнуры", "matches_hint": "Подобрано по весу", "fallback": "Запасной: по классу", "fallback_hint": "Нет граммовки, подбор по классу", "edit": "Редактировать", "delete": "Удалить", "fallback_weight": "Запасной: близко по весу", "fallback_weight_hint": "Чуть вне окна, проверьте на воде", "on_edge": "На границе", "approx_window": "Примерно", "approx_window_hint": "Производитель указал примерный вес, без диапазона. Проверьте на воде", "approx_by_head_hint": "Вес подобран по голове производителя, а не по удилищу. Проверьте на воде", "approx_by_model_hint": "Вес взят у близкой модели того же производителя. Проверьте на воде", "scale_scandi": "Scandi, г", "scale_skagit": "Skagit, gr", "status_ok": "подходит", "status_edge": "на границе", "status_fallback": "запасной", "tips_count": "{n} конц.", "source_maker": "{maker}", "source_model": "по близкой модели", "source_approx": "", "combo": "{body} + {tip} = {total} г", "source_owner": "по опыту владельца"}, "reel_card": {"class_range": "Классы", "fits": "Подходит для", "fits_single": "одноручных", "fits_double": "двуручных", "fits_both": "и тех, и других. Универсал, как хороший гид", "edit": "Редактировать", "delete": "Удалить", "rod_type": "Для удилищ", "rod_type_values": {"single": "Одноручные", "double": "Двуручные", "both": "Оба"}, "line_kind": "Тип шнура", "line_kind_values": {"running": "Раннинг", "line": "Шнур"}, "not_set": "Не указан", "saved": "Сохранено"}, "line_card": {"type": "Тип", "weight": "Вес", "length": "Длина", "floating": "Плавучесть", "tips_title": "Сменные концы", "tips_yes": "Есть сменные концы", "tips_no": "Без сменных концов", "working_weight": "Рабочий вес", "fits_rods": "Подходит к удилищам", "edit": "Редактировать", "delete": "Удалить", "tip_model": "Модель", "tip_length": "Длина, фт", "tip_weight": "Вес, г", "tip_floating": "Плавучесть", "head_length": "{n} фт"}, "line_types": {"full": "Полный шнур", "scandi": "Scandi", "skagit": "Skagit", "integrated": "Интегрированный", "running": "Раннинг"}, "forms": {"rod": {"title": "Новое удилище", "type": "Тип: одноручка, двуручка или свитч", "length": "Длина, футы", "class": "Класс, например #9", "scandi_from": "Scandi от, г", "scandi_to": "Scandi до, г", "skagit_from": "Skagit от, gr", "skagit_to": "Skagit до, gr", "hint": "Укажите диапазоны веса, и подбор шнуров заработает сам"}, "reel": {"title": "Новая катушка", "model": "Модель", "class_range": "Диапазон классов", "fits": "Для каких удилищ", "hint": "Отметьте «оба», если катушка не страдает снобизмом"}, "line": {"title": "Новый шнур или голова", "type": "Тип", "weight": "Вес (Scandi в г, Skagit в gr)", "length": "Длина, м", "floating": "Плавучесть", "has_tips": "Есть сменные концы", "hint": "Вес обязателен: без него подбор гадает на кофейной гуще"}, "tip": {"title": "Новый сменный конец", "weight": "Вес, г", "length": "Длина, фт", "sink": "Плавучесть / погружение", "hint": "Каждый конец со своим характером, запишите его"}, "save": "Сохранить", "cancel": "Отмена", "required": "Это поле обязательно. Даже рыба знает свой вес", "saved": "Сохранено. Снасть в строю", "deleted": "Удалено. Пусть ей будет хорошо на пенсии", "confirm_delete": "Точно удалить? Вернуть можно только покупкой"}, "empty": {"rods": "Удилищ пока нет. Добавьте первое", "reels": "Катушек пока нет. Добавьте первую", "lines": "Шнуров пока нет. Добавьте первый", "tips": "Сменных концов пока нет", "no_match": "Подходящих шнуров не нашлось. Проверьте вес в карточке удилища", "button": "Добавить", "single": "Одноручников пока нет", "single_button": "Добавить"}, "tabbar": {"rods": "Удилища", "reels": "Катушки", "lines": "Шнуры", "trips": "Поездки"}, "filters": {"class": "Класс", "length": "Длина", "maker": "Бренд", "weight": "Вес", "floating": "Степень плавучести", "all": "Все", "reset": "Сбросить", "no_data": "Нет данных", "nothing_found": "Ничего не найдено", "floating_values": {"F": "Плавающий", "I": "Промежуточный", "S": "Тонущий"}, "button": "Фильтры", "button_active": "Фильтры · {n}", "apply": "Показать"}, "line_groups": {"scandi": "Scandi", "skagit": "Skagit", "tips": "Концы"}, "units": {"gram": "г", "grain": "gr"}, "brands": {"_comment": "Справочник производителей. Иконка: /workspace/flyfish_icons/brands/<slug>.svg (Дизайнер), копируется в site/art/brands/. Нет файла — generic.svg, нет и его — прежняя иконка шнура.", "fallback": "generic", "list": [{"slug": "rio", "name": "RIO", "full": "RIO Products", "abbr": "RIO", "aliases": ["rio", "rio products"], "icon": "rio.webp", "tint": "#0A4B5A"}, {"slug": "sa", "name": "Scientific Anglers", "full": "Scientific Anglers", "abbr": "SA", "aliases": ["scientific anglers", "sa", "3m scientific anglers"], "icon": "sa.webp", "tint": "#E6282D"}, {"slug": "guideline", "name": "Guideline", "full": "Guideline", "abbr": "GL", "aliases": ["guideline", "guide line"], "icon": "guideline.webp", "tint": "#D1580F"}, {"slug": "salmonlogic", "name": "Salmologic", "full": "Salmologic", "abbr": "SL", "aliases": ["salmon logic", "salmonlogic", "salmologic", "salmo logic"], "icon": "salmologic.webp", "tint": "#286E78"}, {"slug": "lts", "name": "LTS", "full": "LTS", "abbr": "LTS", "aliases": ["lts"], "icon": "lts.webp", "tint": "#E61E28"}, {"slug": "loop", "name": "Loop", "full": "Loop", "abbr": "LOOP", "aliases": ["loop", "loop tackle"], "icon": "loop.webp"}, {"slug": "airflo", "name": "Airflo", "full": "Airflo", "abbr": "AIR", "aliases": ["airflo", "air flo"]}, {"slug": "nam", "name": "Nam", "full": "Nam", "abbr": "NAM", "aliases": ["nam", "nam fly rods"], "icon": "nam.svg", "tint": "#CDA028"}], "enabled": true, "display_names": true, "icon_size": 44, "_icon_size": "размер буквенного знака внутри круга 44px (буквы ≈45% круга)", "_icon": "icon — файл знака в /workspace/flyfish_icons/logos (webp) или brands (svg); нет icon — прежняя svg-иконка Дизайнера; нет ничего — без иконки. tint — лёгкий оттенок кольца. Бренд ищется без учёта регистра по slug/name/full/aliases."}, "sort": {"button": "Порядок", "by_class": "По классу", "by_weight": "По весу", "by_brand": "По бренду", "asc": "По возрастанию", "desc": "По убыванию", "class_asc": "Класс ↑", "class_desc": "Класс ↓", "weight_asc": "Вес ↑", "weight_desc": "Вес ↓", "brand_asc": "Бренд А–Я", "brand_desc": "Бренд Я–А"}, "sort_rules": {"_comment": "Правила сортировки (Рыболовный гид). Ключи: cls_lo, cls_hi, length, weight, brand.", "rods": {"field": "class", "class": ["cls_lo", "cls_hi", "length"]}, "reels": {"field": "class", "class": ["cls_lo", "cls_hi"]}, "lines": {"field": "weight", "class": ["weight"], "group_by_type": true}, "brand_tie": {"rods": ["cls_lo", "length"], "reels": ["cls_lo"], "lines": ["weight"]}}, "rod_art": {"_comment": "Картинка удилища рисуется из характеристик модели (длина, колена, тип рукояти). Цвета: default → brands → поле art у самого удилища (закрытые данные, import_sheet.py ROD_ART).", "default": {"blank": "#2E4A55", "wrap": "#BFE6F2", "cork": "#C9A877", "seat": "#9FB3BD"}, "brands": {"Loop": {"blank": "#1F2B2E", "wrap": "#C8D2D6", "seat": "#3A4A52"}, "LTS": {"blank": "#20262B", "wrap": "#7FD3E6", "seat": "#55636B"}, "Nam": {"blank": "#3B4A3A", "wrap": "#D6C38A", "seat": "#7A6A48"}, "Hardy": {"blank": "#2B3A2A", "wrap": "#C9A44C", "seat": "#8C7A4A"}}, "images": [{"_comment": "Готовая картинка: бренд + фрагмент названия модели (без полных названий из реестра).", "brand": "Loop", "model_contains": "GASS Signature", "src": "art/rod_gass.webp?v=4"}, {"brand": "Loop", "model_contains": "Cross ST", "src": "art/rod_cross.webp?v=2"}, {"brand": "Loop", "model_contains": "ZT ", "src": "art/rod_zt.webp?v=2"}, {"brand": "LTS", "model_contains": ["CG ", "Complete Graph"], "src": "art/rod_cg.webp?v=2"}]}, "reel_art": {"_comment": "Официальные фото катушек: бренд + все фрагменты названия (model_all), первая подходящая запись. Без записи — общая картинка art/reel.webp.", "images": [{"brand": "Loop", "model_all": ["Speedrunner", "Mist"], "src": "art/reels/opti-speedrunner-mist-silver.webp?v=4"}, {"brand": "Loop", "model_all": ["Speedrunner", "Storm"], "src": "art/reels/opti-speedrunner-storm-blue.webp?v=4"}, {"brand": "Loop", "model_all": ["Runner", "Mist"], "src": "art/reels/opti-runner-mist-silver.webp?v=4"}, {"brand": "Loop", "model_all": ["Runner", "Storm"], "src": "art/reels/opti-runner-storm-blue.webp?v=4"}, {"brand": "Loop", "model_all": ["OPTI", "Creek"], "src": "art/reels/opti-creek.webp?v=4"}, {"brand": "Loop", "model_all": ["OPTI", "Dry Fly"], "src": "art/reels/opti-dry-fly.webp?v=4"}, {"brand": "Loop", "model_all": ["Megaloop"], "src": "art/reels/opti-megaloop.webp?v=4"}, {"brand": "Loop", "model_all": ["Classic", "Fall Orange"], "src": "art/reels/classic-fall-orange.webp?v=4"}, {"brand": "Loop", "model_all": ["Classic", "5/8"], "src": "art/reels/classic-5-8.webp?v=4"}, {"brand": "Loop", "model_all": ["Classic", "4/6"], "src": "art/reels/classic-4-6.webp?v=4"}]}, "photo_add": {"button": "По фото упаковки", "hint": "Снимите этикетку целиком, чтобы читались модель и вес", "sent": "Фото принято. Шнур появится в списке после распознавания", "failed": "Не разобрали этикетку. Переснимите ближе и без бликов", "retry": "Переснять"}, "trips": {"title": "Поездки", "add": "Новая поездка", "dates": "Даты", "date_from": "Заезд", "date_to": "Выезд", "river": "Река", "region": "Регион", "camp": "Лагерь", "status": "Статус", "status_values": {"plan": "План", "booked": "Забронировано", "done": "Прошла"}, "gear": "Снасти с собой", "gear_add": "Собрать комплект", "notes": "Заметки", "notes_hint": "Уровень воды, улов, что сработало", "days": {"one": "день", "few": "дня", "many": "дней"}, "empty": "Поездок пока нет. Река сама не позовёт", "save": "Сохранить", "delete": "Удалить поездку", "delete_confirm": "Удалить поездку? Рыба не обидится, а вы можете", "kit": {"title": "Комплект", "step_rod": "Удилище", "step_reel": "Катушка", "step_line": "Шнур", "choose": "Выбрать", "change": "Заменить", "add_rod": "Добавить удилище", "suited_first": "Подходящие сверху", "incomplete": "Не хватает: {what}", "missing_reel": "катушки", "missing_line": "шнура", "complete": "Комплект собран", "remove": "Убрать из комплекта", "add_kit": "+ Комплект", "kit_n": "Комплект {n}", "lines_n": {"one": "{n} шнур", "few": "{n} шнура", "many": "{n} шнуров"}, "delete_kit": "Удалить комплект", "delete_kit_confirm": "Удалить «{name}»? Снасти останутся в списке", "pick_rods": "Отметьте удилища", "pick_rods_hint": "Каждое станет отдельным комплектом", "create_kits": {"one": "Создать {n} комплект", "few": "Создать {n} комплекта", "many": "Создать {n} комплектов"}}, "regions": ["Кольский", "Тиман", "Карелия", "Камчатка"], "region_other": "Другой"}, "add_line": {"title": "Добавить шнур", "manual": "Вручную", "manual_hint": "Введите параметры сами", "photo": "По фото", "photo_hint": "Сфотографируйте этикетку, остальное заполним", "weight_auto": "Пересчёт: {value}", "bought": "Дата покупки", "note": "Примечание", "tip_for_body": "С каким концом", "save": "Добавить в список", "types": {"scandi": "Scandi", "skagit": "Skagit", "body": "Тело", "tip": "Конец", "running": "Раннинг"}, "floats": ["F", "I", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"], "float_names": {"F": "Плавающий", "I": "Интермедиа"}, "brand": "Производитель", "model": "Модель", "type": "Тип", "weight_g": "Вес, г", "weight_gr": "Вес, грейны", "head_ft": "Длина головы, фт", "floating": "Степень плавучести", "hand": "Для удилищ", "tip_len": "Длина конца, фт", "tip_w": "Вес конца, г", "no_tips": "Концов в списке пока нет", "density": {"_comment": "Степень плавучести шнура: шкала по порядку от лёгкой к тяжёлой; части пишутся сзади→вперёд, строка 'F/I/S1'", "scale": ["F", "H", "I", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"], "max_parts": 3, "order": "strictly_heavier_forward", "colors": {"F": "#F2D14B", "H": "#A8D86E", "I": "#2EC4B6", "S1": "#D9DEE3", "S2": "#C2C9D0", "S3": "#AAB3BC", "S4": "#929DA8", "S5": "#7B8794", "S6": "#647180", "S7": "#4E5B6B", "S8": "#3A4656"}, "stroke": "rgba(255,255,255,.3)", "sink_filter_from": "S2", "legacy": {"плав": "F", "float": "F", "ховер": "H", "hover": "H", "интерм": "I", "промеж": "I", "int": "I"}, "sheet_column": "Степень плавучести", "sheet_aliases": ["Плотность", "Плавучесть/погружение"]}}, "buoyancy": {"title": "Степень плавучести", "single": "Одна", "dual": "Двойная", "triple": "Тройная", "rear": "Сзади", "middle": "Середина", "front": "Спереди", "scale": {"F": "F · плав", "H": "H · ховер", "I": "I · интермедиат", "S": "S{n} · тонущий"}, "err_order": "Спереди шнур не может плавать лучше, чем сзади. Перевернуть?", "flip": "Перевернуть", "err_repeat": "Одинаковые степени подряд объединили", "filter_sink": "Тонущие от S2"}, "tips_table": {"title": "Сменные концы", "kit": "{brand} {length}'", "col_brand": "Бренд", "col_length": "Длина, фт", "col_buoyancy": "Плавучесть", "col_weight": "Вес, г", "suited_title": "Подходящие концы", "total": "Итого {total} г", "foreign": "Другой бренд", "empty": "Концов пока нет", "link": "Сменные концы · {n}"}};
const DATA_REPO = 'makc178/flyfish-data', BRANCH = 'main', ITER = 600000;
const $ = s => document.querySelector(s), app = () => $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : null; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const r1 = x => Math.round(x * 10) / 10, GR = 15.4324;
const fg = x => x == null ? '—' : String(Math.round(+x));
/* единицы и группы шнуров — настройка, не жёсткий код: Scandi/интегрированные в граммах, Skagit в грейнах; тип берётся из таблицы (колонка «Тип») */
const CFG = {unit: {scandi: 'g', integrated: 'g', skagit: 'gr'}, group: {scandi: 'scandi', integrated: 'scandi', skagit: 'skagit', tip: 'tips'}, groups: ['scandi', 'skagit'], nested: {tips: 'skagit'},  srcLbl: {by_model: 'по близкой модели', approx: '≈', owner: 'по опыту владельца'}, grTol: 25 /* gr: допуск «запасной» для Skagit */, gTol: [2, 1] /* г: допуск «запасной» Scandi ниже/выше окна */,
  /* шкала плавучести концов: от светлого (F) к тёмному (S5+) — [шаблон, фон, текст] */
  sink: [[/^\s*(f|float|плав)/i, '#EEF8FC', '#13232B'], [/^\s*(i|int|h|hover|промеж|интерм)/i, '#C3E2EE', '#13232B'], [/s\s*[1-3]\b|^\s*s[1-3]/i, '#86B8CC', '#0C1A20'], [/s\s*[4-5]\b|^\s*s[4-5]/i, '#4F849B', '#FFFFFF'], [/s\s*([6-9]|\d\d)|^\s*s|тон|sink|^t\d/i, '#2D5B70', '#FFFFFF']]};
const UT = Object.assign({gram: 'г', grain: 'gr'}, T.units || {}), isGr = t => CFG.unit[t] === 'gr', uTxt = t => isGr(t) ? UT.grain : UT.gram;
const RW = new WeakMap();
/* окно удилища в единицах типа: Skagit — грейны (колонка N), Scandi — граммы (колонка K) */
function rw(r, t) { const g = r && r[t + '_g']; if (!g) return null; if (!isGr(t)) return g; let m = RW.get(g);
  if (!m) { const gr = r[t + '_gr']; m = {...g, lo: Math.round(gr ? gr.lo : g.lo * 15.4324), hi: Math.round(gr ? gr.hi : g.hi * 15.4324)}; RW.set(g, m); } return m; }
const rngU = (g, t) => g ? `${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''} ${uTxt(t)}` : '—';
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
/* автообновление: сверяем сборку с version.json (без кэша); новая версия — перезагрузка, кроме открытой формы */
const BUILD = 'af7528ed3a', BUILT = '2026-10-14T12:54Z';
async function checkUpdate() { try { const j = await (await fetch('version.json?t=' + Date.now(), {cache: 'no-store'})).json();
  if (j.v && j.v !== BUILD && String(j.built || '') > BUILT && VIEW.t !== 'form' && sessionStorage.getItem('ff-upd') !== j.v) { sessionStorage.setItem('ff-upd', j.v); const r = await navigator.serviceWorker?.getRegistration(); await r?.update(); location.replace(location.pathname + '?v=' + j.v); } } catch (e) {} }
async function boot() {
  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js', {updateViaCache: 'none'}).then(r => r.update()).catch(() => {});
    let rl = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (!rl && VIEW.t !== 'form') { rl = true; location.reload(); } }); }
  checkUpdate(); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkUpdate(); });
  try { META = await Promise.race([idb.get('meta'), new Promise((_, r) => setTimeout(() => r(), 3000))]); } catch (e) { META = null; }
  pinMode = META ? 'unlock' : 'new'; renderPin();
}
let crestSeen = false;
const pinFx = c => { const p = document.querySelector('.pin'); if (!p) return; p.classList.remove('ok', 'bad'); void p.offsetWidth; p.classList.add(c); return new Promise(r => setTimeout(r, c === 'ok' ? 250 : 0)); };
function renderPin(msg = '') { setTimeout(() => { crestSeen = true; }, 420);
  const t = {unlock: T.pin.title, new: 'Придумайте PIN из 4 цифр', confirm: 'Повторите PIN', restore: 'PIN от резервной копии'}[pinMode];
  app().innerHTML = `<div class="pin"><div class="ey">${esc(T.app.name)}</div><div class="big" style="margin-top:10px">${esc(t)}</div>
  <div class="mut" style="margin-top:8px;max-width:290px">${esc(msg || (pinMode === 'unlock' ? T.pin.subtitle : pinMode === 'new' ? 'PIN шифрует ваши снасти. Без него данные не прочитать никому, и восстановить его нельзя' : ''))}</div>
  <div class="crest${crestSeen ? ' seen' : ''}" aria-hidden="true"></div><div class="dots">${[0,1,2,3].map(i => `<i class="${i < pinBuf.length ? 'f' : ''}"></i>`).join('')}</div>
  <div class="keys">${['1','2','3','4','5','6','7','8','9','r','0','b'].map(k => k === 'r' ? '<span></span>' : `<button data-k="${k}">${k === 'b' ? '⌫' : k}</button>`).join('')}</div>${pinMode === 'new' ? `<button class="lnk ac" data-k="r" style="margin-top:18px">Восстановить из копии</button>` : ''}</div>`;
  app().querySelectorAll('.pin [data-k]').forEach(b => b.onclick = () => pinKey(b.dataset.k));
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
    try { S = JSON.parse(dec.decode(await open_(key, st))); } catch (e) { renderPin(T.pin.error); return pinFx('bad'); }
    KEY = key; await pinFx('ok'); start();
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
    const n = await importSeed(tok); await flushReelq(); await flushLineq();
    await save(true); await ghPut(tok, 'state.enc.json', await idb.get('state'), 'state ' + new Date().toISOString().slice(0, 16));
    S.sync.last = Date.now(); await save(true); SYNC_ST = 'сохранено ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    if (n) toast(`Из реестра: ${n} позиций`); else if (manual) toast('Резервная копия обновлена');
    if (n || VIEW.t === 'profile') render();
  } catch (e) { SYNC_ST = 'ошибка: ' + e.message; if (manual) toast('Синхронизация: ' + e.message); if (VIEW.t === 'profile') render(); } }
/* импорт реестра: inbox/seed.json (кладёт import_sheet.py) → позиции с id sheet:* обновляются, ручные и удалённые не трогаются */
function noApx(o) { if (o && typeof o === 'object') { if ('approx' in o) o.approx = false; Object.values(o).forEach(noApx); } return o; }
function mergeSeed(j) { let n = 0; noApx(j);
  for (const k of ['rods', 'reels', 'lines']) for (const x of j[k] || []) { if (!x.id || S.deleted.includes(x.id)) continue;
    const i = S[k].findIndex(y => y.id === x.id); if (i < 0) S[k].push(x); else if (!S[k][i].edited) S[k][i] = x; else continue; n++; }
  return n; }
async function importSeed(tok) { const f = await ghGetJson(tok, 'inbox/seed.json'); if (!f || f.json.kind !== 'flyfish-seed') return 0; const n = mergeSeed(f.json); await save(true); await ghDel(tok, 'inbox/seed.json', f.sha); return n; }
/* ---------- подбор ---------- */
const hand = r => r.type === 'single' ? 'single' : 'double';
const rodRange = (r, t) => t === 'skagit' ? rw(r, 'skagit') : (t === 'scandi' || t === 'integrated') ? rw(r, 'scandi') : null;
const lineV = l => isGr(l.type) ? lineGr(l) : lineG(l);
const lineG = l => l.w_g != null ? l.w_g : l.w_gr != null ? l.w_gr / GR : null;
const lineGr = l => l.w_gr != null ? l.w_gr : l.w_g != null ? l.w_g * GR : null;
function combos(l) { const b = lineG(l), bg = lineGr(l); if (b == null) return [];
  const tipped = l.type === 'skagit' || (l.type === 'scandi' && l.has_tips);
  const tips = (l.tips || []).filter(t => num(t.w_g) != null);
  if (tipped && tips.length) return tips.map(t => ({w: b + num(t.w_g), gr: bg + num(t.w_g) * GR, tip: t}));
  return [{w: b, gr: bg, noTip: tipped && l.type === 'skagit'}]; }
/* границы включительно; сравнение и в граммах (±0,05 г на округление), и в грейнах (±1 gr), если они есть у обоих */
function fit(c, g, gr, t) { if (isGr(t)) { const v = c.gr, tl = g.approx ? CFG.grTol : 0; if (v == null) return null; /* сравнение в грейнах */
    if (v >= g.lo - tl - 1 && v <= g.hi + tl + 1) return {in: true, edge: !tl && (Math.abs(v - g.lo) <= 3 || Math.abs(v - g.hi) <= 3)};
    const gd = v < g.lo - tl ? v - (g.lo - tl) : v - (g.hi + tl); return Math.abs(gd) <= CFG.grTol ? {in: false, near: true, dev: gd / GR, devTxt: `${gd > 0 ? '+' : '−'}${Math.round(Math.abs(gd))} gr`} : null; }
  const tol = g.approx ? 1.5 : 0;
  const inG = c.w >= g.lo - tol - 0.05 && c.w <= g.hi + tol + 0.05, inGr = gr && c.gr != null && !g.approx && c.gr >= gr.lo - 1 && c.gr <= gr.hi + 1;
  if (inG || inGr) { const edge = !g.approx && (Math.abs(c.w - g.lo) <= 0.3 || Math.abs(c.w - g.hi) <= 0.3 || (gr && c.gr != null && (Math.abs(c.gr - gr.lo) <= 3 || Math.abs(c.gr - gr.hi) <= 3))); return {in: true, edge}; }
  const dev = c.w < g.lo - tol ? c.w - (g.lo - tol) : c.w - (g.hi + tol);
  if (t === 'skagit') { const gd = gr && c.gr != null ? (c.gr < gr.lo ? c.gr - gr.lo : c.gr - gr.hi) : dev * GR; return Math.abs(gd) <= CFG.grTol ? {in: false, near: true, dev, devTxt: `${gd > 0 ? '+' : '−'}${Math.round(Math.abs(gd))} gr`} : null; }
  return dev >= -CFG.gTol[0] - 1e-9 && dev <= CFG.gTol[1] + 1e-9 ? {in: false, near: true, dev, devTxt: `${dev > 0 ? '+' : '−'}${fg(Math.abs(dev))} г`} : null; }
const RANK = {ok: 0, edge: 1, near: 2, fb: 3, cls: 4};
function matchLine(r, l) { /* → null | {lvl:'ok'|'fb', kind, w, tip, rg, why, dev} */
  if (l.hand && l.hand !== 'both' && l.hand !== hand(r)) return null;
  const rg = rodRange(r, l.type), rgr = l.type === 'skagit' ? r.skagit_gr : (l.type === 'scandi' || l.type === 'integrated') ? r.scandi_gr : null;
  if (rg) { let best = null;
    for (const c of combos(l)) { const f = fit(c, rg, rgr, l.type); if (!f) continue;
      const body = l.body && !c.tip, soft = false;
      const kind = f.near ? 'near' : soft ? 'fb' : f.edge ? 'edge' : 'ok';
      const m = {lvl: kind === 'ok' || kind === 'edge' ? 'ok' : 'fb', kind, w: c.w, v: isGr(l.type) ? c.gr : c.w, u: uTxt(l.type), tip: c.tip, rg, dev: f.dev, devTxt: f.devTxt,
        why: kind === 'near' ? T.rod_card.fallback_weight : body ? 'вес тела без сменного конца' : c.noTip ? 'без учёта сменного конца' : ''};
      if (!best || RANK[m.kind] < RANK[best.kind]) best = m; }
    return best; }
  const lc = l.cls || clsOf(l.class); if (!(r.cls && lc && lc[0] <= r.cls[1] && lc[1] >= r.cls[0])) return null;
  /* одноручные: основной подбор по классу AFTM (#4 ↔ WF4); у двуручных класс — только запасной вариант */
  if (hand(r) === 'single') return {lvl: 'ok', kind: 'ok', w: lineG(l), v: lineV(l), u: uTxt(l.type), why: ''};
  return {lvl: 'fb', kind: 'cls', w: lineG(l), v: lineV(l), u: uTxt(l.type), why: T.rod_card.fallback}; }
function clsOf(s) { const n = (String(s || '').match(/\d+/g) || []).map(Number); return n.length ? [Math.min(...n), Math.max(...n)] : null; }
/* тело головы (versitip/belly, флаг body из таблицы): только связки «тело + конец» по суммарному весу; без подходящих связок тело в подборе не показывается */
const isBody = l => !!l.body && !isGr(l.type);
function lineMatches(r, l) { if (!isBody(l)) { const m = matchLine(r, l); return m ? [{l, m}] : []; }
  if (l.hand && l.hand !== 'both' && l.hand !== hand(r)) return []; const rg = rodRange(r, l.type); if (!rg) return [];
  const ts = (l.tips || []).filter(t => num(t.w_g) != null);
  if (!ts.length) return []; /* тело без концов в подбор не попадает */
  return ts.map(t => { const m = matchLine(r, {...l, has_tips: true, tips: [t]}); return m ? {l, m: {...m, combo: true, base: lineG(l)}} : null; }).filter(Boolean); }
const comboTxt = (l, m) => { if (!(m.combo && m.tip)) return sname(l); const t = m.tip, tip = `${t.name || 'конец'}${t.len_ft != null ? ' ' + String(t.len_ft).replace('.', ',') + ' фт' : ''}${t.sink ? ' ' + t.sink : ''}`;
  return (T.rod_card.combo || '{body} + {tip} = {total} г').replace('{body}', sname(l)).replace('{tip}', tip).replace('{total}', fg(m.base + num(t.w_g))); };
const rodLines = r => S.lines.flatMap(l => lineMatches(r, l)).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind] || (a.m.w ?? 0) - (b.m.w ?? 0));
function rodReels(r) { return S.reels.filter(x => !x.rods || x.rods.includes(r.id)).filter(x => x.rods || !x.hand || x.hand === 'both' || x.hand === hand(r)).map(x => { const c = x.cls; if (x.rods) return {x, lvl: 'ok'}; if (c && r.cls) return c[0] <= r.cls[1] && (c[1] == null || c[1] >= r.cls[0]) ? {x, lvl: 'ok'} : null; return {x, lvl: 'fb', why: 'класс катушки не указан'}; }).filter(Boolean); }
const lineRods = l => S.rods.flatMap(r => lineMatches(r, l).map(x => ({r, m: x.m}))).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]);
/* ---------- вид (v7 «Телеметрия») ---------- */
let VIEW = {t: 'list', k: 'rods', root: 'rods', tab: 'double'}, OPEN = null; const HIST = [];
const go = v => { HIST.push(VIEW); VIEW = v; OPEN = null; render(); scrollTo(0, 0); };
const tabView = k => ({t: 'list', k, root: k, tab: 'double'});
const back = () => { VIEW = HIST.pop() || tabView('rods'); render(); };
function start() { S.trips = S.trips || []; noApx(S); VIEW = tabView('rods'); render(); if (S.sync.token) syncNow(); }
const ART = {rods: 'art/rod.webp', reels: 'art/reel.webp', lines: 'art/line.svg'};
const SEC = {rods: T.home.sections.rods, reels: T.home.sections.reels, lines: T.home.sections.lines};
const TL = t => T.line_types[t] || (t === 'tip' ? 'Сменный конец' : t);
const RT = {single: 'одноручное', double: 'двуручное', switch: 'свитч'};
const inTab = (k, x, tab) => k === 'rods' ? hand(x) === tab : (!x.hand || x.hand === 'both' || x.hand === tab);
const rng = (g, gr) => g ? `${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''} г${gr ? ` · ${Math.round(gr.lo)}${gr.hi !== gr.lo ? '–' + Math.round(gr.hi) : ''} gr` : ''}` : '—';
const name = x => sname(x);
/* короткое имя для списков, графика и карусели; полное — только в карточке */
const STOPW = new Set(['signature', 'shooting', 'head', 'integrated', 'double', 'handed', 'fly', 'rod', 'colors', 'of', 'the', 'wild']);
const FLT = f => /^плав|^float/i.test(f || '') ? 'F' : /^тон|^sink/i.test(f || '') ? 'S' : /^(инт|int)/i.test(f || '') ? 'I' : '';
/* полное имя «Производитель Модель» как в таблице, без сокращений; бренд не дублируется, если модель уже с него начинается */
function sname(x) { const be = (T.brands || {}).display_names && typeof brandOf === 'function' ? brandOf(x) : null, b = be ? be.name : String(x.brand || '').trim(), m = String(x.model || '').trim(); return b && !m.toLowerCase().startsWith(b.toLowerCase()) ? `${b} ${m}` : (m || b); }
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const GC = {trips: '#E9EEF2', rods: '#E9EEF2', lines: '#7F95A8', reels: '#C9D1DA'};
const GL = {rods: '<path d="M4 20 19.5 4.5"/><path d="M6.5 17.5l-1.6-1.6M17 7l1.8 1.8"/><circle cx="7.2" cy="16.8" r="1.4"/>',
  lines: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2.4"/><path d="M20.5 12c1.5 3.5-.8 7.5-4.5 8.5"/>',
  trips: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h4"/>',
  reels: '<circle cx="11" cy="12" r="8"/><circle cx="11" cy="12" r="2.6"/><path d="M11 4v2.4M11 17.6V20M3 12h2.4M16.6 12H19"/><path d="M19 12h2.5v3"/>'};
/* иконки интерфейса: файлы Дизайнера (/workspace/flyfish_icons) встраивает build.py; для остальных — временные по его спецификации */
const ICN = {single: '<path d="M6 19 18 5"/><circle cx="7.5" cy="17.2" r="1.6"/>',
  double: '<path d="M5 19 19 5"/><circle cx="7" cy="17" r="1.6"/><circle cx="10.5" cy="13.5" r="1.6"/>',
  class: '<path d="M9 4 7 20M17 4l-2 16M4.5 9h15M4 15h15"/>', length: '<path d="M3 12h18M3 9v6M21 9v6M7 12v-2M11 12v-3M15 12v-2"/>',
  maker: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>', weight: '<path d="M6 9h12l2 11H4L6 9Z"/><circle cx="12" cy="6" r="2"/>',
  floating: '<path d="M3 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M12 4v8M9 9l3 3 3-3"/>'};
const ICF = {"filters": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h3M11 6h9M4 12h9M17 12h3M4 18h1M9 18h11\"/><circle cx=\"9\" cy=\"6\" r=\"2\"/><circle cx=\"15\" cy=\"12\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/></svg>", "lines": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 12.5a1.5 1.5 0 1 1 1.5 -1.5 3.5 3.5 0 0 1 -3.5 3.5 5 5 0 0 1 -5 -5 6.5 6.5 0 0 1 6.5 -6.5 8 8 0 0 1 8 8c0 2.5-1 4.5-3 6\"/><path d=\"M17.5 19.5c1.5-.5 3.5.2 3.3 1.6-.2 1.3-2.3 1-3.3-1.6z\"/></svg>", "reels": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"12\" r=\"8\"/><circle cx=\"11\" cy=\"12\" r=\"4.5\"/><circle cx=\"11\" cy=\"12\" r=\"1\"/><path d=\"M14.2 15.2l2.3 2.3\"/><circle cx=\"18\" cy=\"19\" r=\"1.6\"/></svg>", "rods": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8.5 15.5L21 3\"/><path d=\"M3.2 19.4l3.4-3.4 1.4 1.4-3.4 3.4a1 1 0 0 1-1.4 0 1 1 0 0 1 0-1.4z\"/><path d=\"M12 12l1.4 1.4M15.5 8.5l1.1 1.1M18.6 5.4l.9.9\"/></svg>", "tips": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9.5 9.5L20 20\"/><path d=\"M14 14l6 6\" stroke-width=\"3\"/><path d=\"M9.5 9.5C8 8 4 7.5 3.8 5.2 3.6 3.2 6.2 3.2 7 4.5c.9 1.4 1.3 3.5 2.5 5\"/></svg>"};
const ic = (k, sz = 24) => ICF[k] ? ICF[k].replace(/<svg\b[^>]*?(width="\d+"\s*height="\d+")?/, m => m.replace(/width="\d+"/, `width="${sz}"`).replace(/height="\d+"/, `height="${sz}"`) + ' class="ic" aria-hidden="true"') : ICN[k] ? `<svg class="ic" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICN[k]}</svg>` : '';
const glyph = (k, sz = 24) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${GC[k]}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GL[k]}</svg>`;
const icoBox = (k, cls = '') => `<span class="thumb ico ${cls}">${glyph(k, cls.includes('s') ? 22 : 26)}</span>`;
const clsTxt = c => c[1] == null ? `#${c[0]}+` : c[0] === c[1] ? `#${c[0]}` : `#${c[0]}–#${c[1]}`;
const byId = (k, id) => S[k].find(x => x.id === id) || {};
function reelImg(x) { const lc = v => String(v || '').trim().toLowerCase(), A = (T.reel_art || {}).images || [], im = x && A.find(e => e && e.src && (!e.brand || lc(e.brand) === lc(x.brand)) && [].concat(e.model_all || []).every(f => lc(x.model).includes(lc(f)))); return im ? im.src : ART.reels; }
const artBox = (k, st = '', u) => `<div class="artb" style="background-image:url(${u || ART[k]});background-size:${k === 'rods' ? '92%' : '74%'};${st}"></div>`;
const APX = {single: T.rod_card.approx_window_hint, by_model: T.rod_card.approx_by_model_hint, head_based: T.rod_card.approx_by_head_hint || 'Вес подобран по голове производителя, а не по удилищу. Проверьте на воде'};
const apxOf = g => null; /* 14.10.2026: пометки «≈ / примерно» убраны по просьбе владельца */
const ICO = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>'};
/* статусы: ok — Подходит, edge — На границе, fb — Запасной, apx — ≈ Примерно */
const SC = {ok: '#3DDC97', edge: '#FFD166', fb: '#FF6B4A', apx: '#9AA4B2'};
const stOf = m => m.kind === 'edge' ? 'edge' : m.lvl === 'ok' ? 'ok' : 'fb';
const stLbl = m => m.kind === 'edge' ? T.rod_card.on_edge : m.lvl === 'ok' ? 'Подходит' : m.kind === 'near' ? 'Запасной ' + m.devTxt : m.kind === 'cls' ? T.rod_card.fallback : 'Запасной';
const BIC = {"rio": "art/brands/i_rio.webp", "sa": "art/brands/i_sa.webp", "guideline": "art/brands/i_guideline.webp", "salmonlogic": "art/brands/i_salmologic.webp", "lts": "art/brands/i_lts.webp", "loop": "art/brands/i_loop.webp", "nam": "art/brands/i_nam.svg"}, BRI = ["airflo", "generic", "guideline", "loop", "lts", "nam", "rio", "sa", "salmonlogic"], BRT = (T.brands || {}).list || [];
const brandOf = x => { const b = String((x && x.brand) || '').trim().toLowerCase(); return b ? BRT.find(e => [e.slug, e.name, e.full, ...(e.aliases || [])].some(a => String(a).toLowerCase() === b)) || null : null; };
const brandMark = x => { const e = brandOf(x), fb = (T.brands || {}).fallback, f = e && BRI.includes(e.slug) ? e.slug : BRI.includes(fb) ? fb : null, z = (T.brands || {}).icon_size || 24, u = e && BIC[e.slug];
  if (u) return `<span class="bci lg" role="img" aria-label="${esc(e.name)}" title="${esc(e.name)}"${e.tint ? ` style="--bt:${esc(e.tint)}"` : ''}><span class="bmk" style="width:26px;height:26px;-webkit-mask-image:url(${u});mask-image:url(${u})"></span></span>`;
  return f ? `<span class="bci" role="img" aria-label="${esc(e ? e.name : 'Другие')}" title="${esc(e ? e.name : 'Другие')}"><span class="bmk" style="width:${z}px;height:${z}px;-webkit-mask-image:url(art/brands/${f}.svg);mask-image:url(art/brands/${f}.svg)"></span></span>` : ''; };
const brandIco = (x, cls = '') => { const e = brandOf(x), fb = (T.brands || {}).fallback, f = e && BRI.includes(e.slug) ? e.slug : BRI.includes(fb) ? fb : null, z = cls.includes('s') ? 32 : 36, u = e && BIC[e.slug];
  if (u) return `<span class="thumb ico brd lg ${cls}" role="img" aria-label="${esc(e.name)}"${e.tint ? ` style="--bt:${esc(e.tint)}"` : ''}><span class="bmk" style="width:${Math.round(z*.6)}px;height:${Math.round(z*.6)}px;-webkit-mask-image:url(${u});mask-image:url(${u})"></span></span>`;
  return f ? `<span class="thumb ico brd ${cls}"><img src="art/brands/${f}.svg" alt="${esc(e ? e.name : '')}" width="${z}" height="${z}"></span>` : icoBox('lines', cls); };
const coil = (s, x) => x ? brandIco(x, 's') : icoBox('lines', 's');
const chip = (s, t) => `<span class="st s-${s}">${esc(t)}</span>`;
const apxBtn = (k, short) => `<button class="st s-apx" data-hint="${esc(APX[k])}" aria-label="${esc(T.rod_card.approx_window)}: подсказка">≈ ${esc(T.rod_card.approx_window)}${short ? '' : ' <i>i</i>'}</button>`;
const mNote = m => m.kind === 'near' ? T.rod_card.fallback_weight_hint : m.kind === 'cls' ? T.rod_card.fallback_hint : m.lvl === 'fb' && m.why ? m.why : m.why || '';
const TABS = ['rods', 'reels', 'lines', 'trips'];
const tb = () => { const r = VIEW.root || VIEW.k; return `<nav class="tb" aria-label="Навигация">${TABS.map(k => `<button data-tab="${k}" class="${r === k ? 'on' : ''}"><span class="tp">${ic(k)}</span><span class="tl">${esc(T.tabbar[k])}</span></button>`).join('')}</nav>`; };
function render() { const v = VIEW;
  let h = v.t === 'list' && v.k === 'trips' ? tripsView() : v.t === 'trip' ? tripCard(byId('trips', v.id)) : v.t === 'tform' ? tform(v) : v.t === 'list' ? list(v.k) : v.t === 'rod' ? rodCard(byId('rods', v.id)) : v.t === 'reel' ? reelCard(byId('reels', v.id)) : v.t === 'line' ? lineCard(byId('lines', v.id)) : v.t === 'form' ? form(v) : v.t === 'add' ? addStep() : v.t === 'lform' ? lform() : v.t === 'pick' ? pick() : profile();
  app().innerHTML = (h + lpSheet() + alSheet() + kitSheet() + (v.t === 'form' || v.t === 'add' || v.t === 'lform' || v.t === 'tform' ? '' : tb())).replace(/(\d) (г|gr|м|колен|€)(?=[\s<·,.;)]|$)/g, '$1\u00a0$2'); bind();
  const c = document.querySelector('.hs.rods'), on = c && c.querySelector('.rchip.on'); if (on) { const l = on.offsetLeft - c.offsetLeft, rr = l + on.offsetWidth; if (l < c.scrollLeft + 18 || rr > c.scrollLeft + c.clientWidth - 18) c.scrollLeft = Math.max(0, l - (c.clientWidth - on.offsetWidth) / 2); } }
/* полукольцевой индикатор окна: rg — окно, dots — [{w, s}] */
function gauge(rg, label, col, mn, mx, dots, u = UT.gram) { const W = 170, r = 70, th = 13, cx = W / 2, cy = r + 14, H = cy + 30;
  const cl = g => Math.min(mx, Math.max(mn, g)), ang = g => Math.PI * (1 - (cl(g) - mn) / (mx - mn)), P = (g, rr = r) => [cx + rr * Math.cos(ang(g)), cy - rr * Math.sin(ang(g))];
  const arc = (a, b, c, w, ex = '') => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" ${ex}/>`; };
  const ap = rg && apxOf(rg); let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} ${rg ? esc(fg(rg.lo) + '–' + fg(rg.hi) + ' ' + u) : '—'}">` + arc(mn, mx, '#232830', th);
  if (rg) s += ap ? arc(rg.lo - (rg.lo === rg.hi ? (u === UT.grain ? 25 : 1.5) : 0), rg.hi + (rg.lo === rg.hi ? (u === UT.grain ? 25 : 1.5) : 0), SC.apx, th, 'stroke-dasharray="3 5" opacity=".9"') : arc(rg.lo, rg.hi + (rg.hi === rg.lo ? .01 : 0), col, th);
  const step = u === UT.grain ? ((mx - mn) > 240 ? 50 : 20) : (mx - mn) > 24 ? 4 : 2;
  for (let g = Math.ceil(mn / step) * step; g <= mx; g += step) { const [a, b] = [P(g, r - th / 2 - 4), P(g, r - th / 2 - (g % (step * 2) ? 7 : 10))]; s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#5B6470" stroke-width="1"/>`; }
  for (const d of dots) { const [x, y] = P(d.w); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${SC[d.s]}" stroke="#0C0F12" stroke-width="3"/>${ap ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="none" stroke="${SC.apx}" stroke-width="1.5" stroke-dasharray="2 2"/>` : ''}`; }
  const c = rg ? (ap && rg.lo === rg.hi ? '≈' + Math.round(rg.lo) : `${Math.round(rg.lo)}${rg.hi !== rg.lo ? '–' + Math.round(rg.hi) : ''}`) : '—';
  s += `<text x="${cx}" y="${cy - 14}" text-anchor="middle" class="gv" font-size="${c.length > 8 ? 20 : 26}">${esc(c)}</text><text x="${cx}" y="${cy + 4}" text-anchor="middle" class="gl">${esc(label.toUpperCase())}, ${esc(u)}</text>`;
  const [a] = P(mn), [b] = P(mx); s += `<text x="${a.toFixed(1)}" y="${cy + 22}" text-anchor="middle" class="ga">${fg(mn)}</text><text x="${b.toFixed(1)}" y="${cy + 22}" text-anchor="middle" class="ga">${fg(mx)} ${esc(u)}</text></svg>`;
  const marks = rg && ap ? [rg.lo, ...(rg.hi !== rg.lo ? [rg.hi] : [])].map(v => { const [x, y] = P(v, r + 14); return `<button class="apm" data-hint="${esc(APX[ap])}" aria-label="${esc(T.rod_card.approx_window)}" style="left:${(x / W * 100).toFixed(1)}%;top:${(y / H * 100).toFixed(1)}%">≈</button>`; }).join('') : '';
  return `<div class="gauge">${s}${marks}</div>`; }
const WC = {scandi: '#BFE6F2', skagit: '#F0D3A0'}, DC = {ok: '#8EF0B6', edge: '#FFE08A', fb: '#FFB08F'};
function miniBar(r) { const W = 92, h = 5, mn = 22, mx = 44, x = g => Math.max(0, Math.min(W, (g - mn) / (mx - mn) * W)); let o = `<svg class="mb" width="${W}" height="${2 * h + 4}" viewBox="0 0 ${W} ${2 * h + 4}" aria-hidden="true">`;
  ['scandi', 'skagit'].forEach((t, i) => { const g = r[t + '_g'], y = i * (h + 4); o += `<rect x="0" y="${y}" width="${W}" height="${h}" rx="${h / 2}" fill="rgba(255,255,255,.18)"/>`;
    if (g) { let lo = g.lo, hi = g.hi; if (lo === hi) { lo -= 1; hi += 1; } o += `<rect x="${x(lo).toFixed(1)}" y="${y}" width="${Math.max(4, x(hi) - x(lo)).toFixed(1)}" height="${h}" rx="${h / 2}" fill="${WC[t]}"${g.approx ? ' opacity=".55"' : ''}/>`; } });
  return o + '</svg>'; }
function ruler(r, ls) { const wins = ['scandi', 'skagit'].filter(t => r[t + '_g']); if (!wins.length) return '';
  const pts = ls.filter(x => x.m.rg).map(x => ({w: x.m.v, s: stOf(x.m), t: x.m.rg === rw(r, 'scandi') ? 'scandi' : 'skagit'}));
  const W = 320, bh = 12, CW = 6.4; let o = '', Y = 0;
  wins.forEach(t => { const g = rw(r, t), ps = pts.filter(p => p.t === t).sort((a, b) => a.w - b.w), pad = isGr(t) ? 40 : 3, vs = [g.lo, g.hi, ...ps.map(p => p.w)], mn = Math.floor(Math.min(...vs) - pad), mx = Math.ceil(Math.max(...vs) + pad), x = v => 6 + (v - mn) / (mx - mn) * (W - 12);
    /* подписи точек над шкалой: при сближении уходят на следующий ряд */
    const rows = []; const lab = ps.map(p => { const tx = `${fg(p.w)}`, w = tx.length * CW + 6, cx = Math.max(w / 2, Math.min(W - w / 2, x(p.w))); let k = 0; while ((rows[k] || []).some(e => Math.abs(e - cx) < w)) k++; (rows[k] = rows[k] || []).push(cx); return {p, tx, cx, k}; });
    const nr = Math.max(1, rows.length), top = Y + 18, by = top + nr * 14 + 6;
    o += `<text x="0" y="${top - 4}" font-size="11" font-weight="700" fill="#fff" letter-spacing=".6">${t.toUpperCase()}<tspan fill-opacity=".6" font-weight="400"> · ${esc(uTxt(t))}</tspan></text>`;
    o += `<rect x="0" y="${by}" width="${W}" height="${bh}" rx="${bh / 2}" fill="rgba(255,255,255,.10)"/>`;
    const bx = x(g.lo), bw = Math.max(10, x(g.hi) - x(g.lo)); o += `<rect class="wband" x="${(g.lo === g.hi ? bx - 5 : bx).toFixed(1)}" y="${by}" width="${bw.toFixed(1)}" height="${bh}" rx="${bh / 2}" fill="var(--ac)" fill-opacity=".35" stroke="var(--ac)" stroke-opacity=".7"/>`;
    lab.forEach(({p, tx, cx, k}) => { const ly = by - 8 - (nr - 1 - k) * 14; o += `<line x1="${x(p.w).toFixed(1)}" x2="${x(p.w).toFixed(1)}" y1="${ly + 3}" y2="${by + bh / 2}" stroke="${DC[p.s] || '#fff'}" stroke-opacity=".5"/><text class="dl" x="${cx.toFixed(1)}" y="${ly}" font-size="11" fill="${DC[p.s] || '#fff'}" font-family="Geist Mono" text-anchor="middle">${esc(tx)}</text>`; });
    ps.forEach(p => { o += `<circle cx="${x(p.w).toFixed(1)}" cy="${by + bh / 2}" r="5.5" fill="${DC[p.s] || '#fff'}" stroke="rgba(20,40,50,.8)" stroke-width="2"/>`; });
    const wl = rngU(g, t), lw = wl.length * CW, lc = Math.max(lw / 2, Math.min(W - lw / 2, (x(g.lo) + x(g.hi)) / 2));
    o += `<text class="wl" x="${lc.toFixed(1)}" y="${by + bh + 15}" font-size="11" fill="#fff" fill-opacity=".75" font-family="Geist Mono" text-anchor="middle">${esc(wl)}</text>`;
    Y = by + bh + 28; });
  return `<div class="cap" style="margin:2px 6px 12px">Окно веса головы</div><svg viewBox="0 0 ${W} ${Y}" width="100%" style="display:block;overflow:visible" role="img" aria-label="Окно веса головы">${o}</svg>`; }
function gaugesFor(r, ls) { if (!r.scandi_g && !r.skagit_g && !ls.some(x => x.m.rg)) return '';
  const one = (t, label, col) => { const g = rw(r, t), d = ls.filter(x => x.m.rg && x.m.rg === g).map(x => ({w: x.m.v, s: stOf(x.m)})), gr = isGr(t), pad = gr ? 40 : 3;
    const all = [...(g ? [g.lo, g.hi] : []), ...d.map(x => x.w)]; if (!all.length) all.push(gr ? 400 : 26);
    const q = gr ? 10 : 1, mn = Math.floor((Math.min(...all) - pad) / q) * q, mx = Math.ceil((Math.max(...all) + pad) / q) * q; return gauge(g, label, col, mn, mx, d, uTxt(t)); };
  return `<div class="gg">${one('scandi', 'Scandi', '#E9EEF2')}${one('skagit', 'Skagit', '#7F95A8')}</div>`; }
const win = (r, t, full) => { const g = rw(r, t), k = apxOf(g), txt = rngU(g, t);
  return k ? `<button class="apx" data-hint="${esc(APX[k])}" aria-label="${esc(T.rod_card.approx_window)}">${txt.startsWith('≈') ? '' : '≈'}${txt} <i>i</i></button>` : txt; };
const winShort = g => g ? `${apxOf(g) && g.lo === g.hi ? '~' : ''}${fg(g.lo)}${g.hi !== g.lo ? '–' + fg(g.hi) : ''}` : '—';
const syncTxt = () => '⟳ ' + (S.sync.token ? (SYNC_ST || (S.sync.last ? 'синхр. ' + new Date(S.sync.last).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}) : 'синхр.')) : 'копия выкл.');
function head(title, right = '') { const st = syncTxt().slice(2);
  return `<div class="w top"><div class="row"><button class="av" data-tab="profile" aria-label="Профиль">${ICO.user}</button><span class="mono sm" style="color:var(--fb)">${/^ошибка/.test(SYNC_ST) ? '⟳ ' + esc(SYNC_ST) : ''}</span><button class="cb" data-add aria-label="Добавить снасть">${ICO.plus}</button></div>${title ? `<div class="row" style="margin-top:14px;align-items:flex-end"><h1 class="h1">${esc(title)}</h1>${right}</div>` : ''}</div>`; }
const okN = ls => ls.filter(y => y.m.lvl === 'ok' && !(y.m.rg && apxOf(y.m.rg))).length;
const exactRod = r => ['scandi', 'skagit'].some(t => r[t + '_g'] && !apxOf(r[t + '_g']));
function scale(rg, w, m = {}) { if (!rg || w == null) return ''; const pd = m.u === UT.grain ? 60 : 4, mn = Math.min(rg.lo, w) - pd, mx = Math.max(rg.hi, w) + pd, p = x => (x - mn) / (mx - mn) * 100, s = m.kind ? stOf(m) : 'ok', ap = apxOf(rg);
  return `<div class="scale"><div class="t"></div><div class="a" style="left:${p(rg.lo)}%;width:${Math.max(p(rg.hi) - p(rg.lo), 1.5)}%;${ap ? 'background:#9AA4B2' : ''}"></div><div class="k" style="left:${p(w)}%;background:${SC[s]}"></div><span class="n" style="left:${p(rg.lo)}%">${fg(rg.lo)}</span>${rg.hi !== rg.lo ? `<span class="n" style="left:${p(rg.hi)}%">${fg(rg.hi)}</span>` : ''}</div>`; }
const stChip = (m, rg = m.rg) => { const k = rg && apxOf(rg), s = stOf(m); return k ? `<span class="st s-${s}" data-hint="${esc(APX[k])}" title="${esc(APX[k])}">≈ ${esc(stLbl(m))}</span>` : chip(s, stLbl(m)); };
const mBadge = (m, small) => `<div class="bdgs">${stChip(m)}</div>${!small && mNote(m) ? `<div class="mut sm2" style="margin-top:4px">${esc(mNote(m))}</div>` : ''}`;
function lineRow(l, m, full, ic) { const s = stOf(m); full = 0;
  return `<button class="lr" data-open="line:${l.id}">${ic ? coil(s, l) : `<span class="dot" style="background:${SC[s]}"></span>`}<div style="flex:1;min-width:0"><div class="t">${esc(comboTxt(l, m))}</div><div class="mono mut sm">${esc(TL(l.type))}  ${m.v != null ? ` · ${fg(m.v)} ${m.u}` : (l.cls ? ' · ' + clsTxt(l.cls) : '')}${m.tip && !m.combo ? ' · + ' + esc(m.tip.name || 'конец') : ''}</div>${full && mNote(m) ? `<div class="mut sm2" style="margin-top:2px">${esc(mNote(m))}</div>` : ''}</div><div class="bdgs r">${stChip(m)}</div></button>`; }
function reelRow(x) { return `<button class="card row rr" data-open="reel:${x.x.id}"><div class="row" style="gap:12px;min-width:0;flex:1;justify-content:flex-start">${icoBox('reels', 's')}<div class="one"><b>${esc(sname(x.x))}</b> <span class="mut mono sm">${x.x.cls ? clsTxt(x.x.cls) : esc(x.why || '')}</span></div></div>${chip(x.lvl === 'ok' ? 'ok' : 'fb', x.lvl === 'ok' ? 'Подходит' : 'Запасной')}</button>`; }
/* одинаковые «Подходит» сворачиваются в одну строку */
function reelsBlock(rs) { if (!rs.length) return '<div class="mut">—</div>'; const ok = rs.filter(x => x.lvl === 'ok'), other = rs.filter(x => x.lvl !== 'ok');
  if (ok.length < 2 || VIEW.reels) return rs.map(reelRow).join('') + (ok.length > 1 ? `<button class="more" data-reels="0">${esc(T.list.collapse)} ‹</button>` : '');
  return `<button class="card row rr" data-reels="1">${icoBox('reels', 's')}<div class="one" style="flex:1;color:var(--ok)"><b>Катушки · ${ok.length} ${plural(ok.length, 'подходит', 'подходят', 'подходят')}</b></div><span class="chev" aria-hidden="true">›</span></button>${other.map(reelRow).join('')}`; }
/* развёрнутая строка удилища: две тонкие шкалы (Scandi, г / Skagit, gr), окно производителя, точки шнуров; ниже — короткий список */
function srcTag(r, g) { if (!g) return ''; const k = g.kind, C = T.rod_card, mk = (C.source_maker || '{maker}').replace('{maker}', r.brand || ''), t = k === 'owner' ? (C.source_owner || CFG.srcLbl.owner) : k === 'by_model' ? (C.source_model || CFG.srcLbl.by_model) : (k === 'single' || k === 'head_based' || g.approx) ? (C.source_approx || CFG.srcLbl.approx) : mk;
  return t ? `<span class="stag"${APX[k] ? ` data-hint="${esc(APX[k])}"` : ''}>${esc(t)}</span>` : ''; }
function hScale(r, t, ls) { const g = rw(r, t), gr = isGr(t), d = ls.filter(x => x.m.rg && x.m.rg === g); if (!g) return '';
  const pad = gr ? 40 : 3, vs = [g.lo, g.hi, ...d.map(x => x.m.v)], mn = Math.floor(Math.min(...vs) - pad), mx = Math.ceil(Math.max(...vs) + pad), P = v => +((v - mn) / (mx - mn) * 100).toFixed(1);
  const lo = g.lo === g.hi ? g.lo - pad / 3 : g.lo, hi = g.lo === g.hi ? g.hi + pad / 3 : g.hi;
  return `<div class="hsc"><div class="hsh"><span class="hsl">${esc(T.rod_card['scale_' + t] || (t === 'scandi' ? 'Scandi' : 'Skagit') + ', ' + uTxt(t))}</span><b class="mono">${esc(rngU(g, t).replace(' ' + uTxt(t), ''))}</b>${srcTag(r, g)}</div>
  <div class="hst"><i class="hsw${apxOf(g) ? ' ap' : ''}" style="left:${P(lo)}%;width:${Math.max(P(hi) - P(lo), 1.5)}%"></i>${d.map(x => `<i class="hsd" style="left:${P(x.m.v)}%;background:${SC[stOf(x.m)]}" title="${esc(sname(x.l))} ${fg(x.m.v)} ${x.m.u}"></i>`).join('')}</div><div class="hsn mono"><span>${mn}</span><span>${mx}</span></div></div>`; }
function rodExp(r) { const ls = rodLines(r), sc = hScale(r, 'scandi', ls) + hScale(r, 'skagit', ls);
  const C = T.rod_card, SL = {ok: C.status_ok || 'подходит', edge: C.status_edge || 'на границе', fb: C.status_fallback || 'запасной'};
  return `<div class="exp">${sc}${ls.length ? `<div class="rls">${ls.map(x => { const s = stOf(x.m), nt = (x.l.tips || []).length; return `<button class="rl" data-open="line:${x.l.id}"><span class="dot" style="background:${SC[s]}"></span><span class="rn1">${esc(comboTxt(x.l, x.m))}${nt && !isGr(x.l.type) && !x.m.combo ? ` <small class="mut">· ${esc((C.tips_count || '{n} конц.').replace('{n}', nt))}</small>` : ''}</span><span class="mono rw">${x.m.v != null ? fg(x.m.v) + ' ' + x.m.u : ''}</span><span class="rst s-${s}">${esc(SL[s])}</span></button>`; }).join('')}</div>` : `<div class="mut sm2" style="margin-top:8px">${esc(T.empty.no_match)}</div>`}<button class="more" data-open="rod:${r.id}">${esc(T.list.more)} ›</button></div>`; }
function recBlock(r) { return `<div class="card" style="margin-top:12px"><div class="cap">${esc(T.list.line_recommendation)}</div><div class="rec"><b>Scandi</b><span>${win(r, 'scandi', 1)}</span><b>Skagit</b><span>${win(r, 'skagit', 1)}</span>${r.rio ? `<b>RIO</b><span>${esc([r.rio.scandi && 'Scandi ' + r.rio.scandi, r.rio.skagit && 'Skagit ' + r.rio.skagit].filter(Boolean).join('; '))}</span>` : ''}</div>${r.line_note ? `<div class="mut sm2" style="margin-top:8px">${esc(r.line_note)}</div>` : ''}</div>`; }
function itemHead(k, x) { const sub = k === 'rods' ? `${esc(x.length || '—')} · ${esc(x.class || '—')}` : k === 'reels' ? `${esc(x.size || '')}${x.cls ? (x.size ? ' · ' : '') + clsTxt(x.cls) : ''}` : `${esc(TL(x.type))}`;
  const line2 = k === 'rods' ? (hand(x) === 'single' && !x.scandi_g && !x.skagit_g ? `подбор по классу ${x.cls ? clsTxt(x.cls) : '—'}` : `<span class="wl">Scandi ${rngU(rw(x, 'scandi'), 'scandi')}</span><span class="wl">Skagit ${rngU(rw(x, 'skagit'), 'skagit')}</span>`) : k === 'reels' ? (x.weight_g != null ? fg(x.weight_g) + ' г · ' : '') + (x.hand === 'both' ? T.tabs.both : x.hand === 'single' ? T.tabs.single : x.hand === 'double' ? T.tabs.double : 'назначение не указано') : `${withHead(lineV(x) != null ? fg(lineV(x)) + ' ' + uTxt(x.type) : esc(x.w_raw || ''), x)}${x.float ? (b => b.length ? ` · <span class="bv">${bStrip(b)}<span class="mono">${esc(b.join('/'))}</span>${bOrdered(b) ? '' : ` <button class="lnk bfl" data-bflip="${esc(x.id)}" title="${esc(BT.err_order || '')}">${esc((BT.flip || '').toLowerCase())}?</button>`}</span>` : ' · ' + esc(fltTxt(x.float)))(bParse(x.float)) : ''}${x.has_tips ? ' · сменные концы' : ''}`;
  return `<div class="hd" data-tog="${x.id}" role="button" tabindex="0" aria-expanded="${OPEN === x.id}">${k === 'reels' ? icoBox(k) : brandMark(x)}<div style="flex:1;min-width:0"><div class="tr"><div class="t">${esc(sname(x))}</div></div><div class="mono mut sm">${sub}</div><div class="mono sm3" style="margin-top:2px">${line2}</div></div>${k === 'rods' ? `<div class="rk"><div class="rmb">${miniBar(x)}</div><div class="rn mono">${(n => `${n}<small class="rnc">${esc(plural(n, ...['one', 'few', 'many'].map(k => (T.list.matches_count || {})[k] || {one: 'шнур', few: 'шнура', many: 'шнуров'}[k])))}</small>`)(rodLines(x).length)}</div></div>` : ''}<span class="tg ${k === 'rods' ? 'hid ' : ''}${OPEN === x.id ? 'on' : ''}" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></div>`; }
function reelExp(x) { const rods = S.rods.filter(r => rodReels(r).some(y => y.x.id === x.id && y.lvl === 'ok'));
  return `<div class="exp"><div class="cap" style="margin-bottom:4px">Подходящие удилища</div>${rods.length ? rods.map(r => `<button class="lr" data-open="rod:${r.id}"><span class="dot" style="background:${SC.ok}"></span><div style="flex:1"><div class="t">${esc(sname(r))}</div><div class="mono mut sm">${esc(r.class || '')}</div></div>${chip('ok', 'Подходит')}</button>`).join('') : `<div class="mut">${x.cls ? '—' : 'Укажите классы катушки, и подбор заработает'}</div>`}
  <div class="g2" style="margin-top:10px"><div class="stat"><small>${T.reel_card.class_range}</small><b>${x.cls ? clsTxt(x.cls) : (esc(x.size) || '—')}</b></div><div class="stat"><small>Тормоз</small><b>${esc(x.drag || '—')}</b></div></div><button class="more" data-open="reel:${x.id}">${esc(T.list.more)} ›</button></div>`; }
/* сменные концы головы: свёрнутая строка «Сменные концы · N», внутри таблица; пусто — блока нет */
function sinkChip(v) { if (!v) return '—'; const c = (CFG.sink.find(([re]) => re.test(String(v))) || [null, '#9AA4B2', '#0C0F12']); return `<span class="sk" style="background:${c[1]};color:${c[2] || '#0C0F12'}">${esc(v)}</span>`; }
function tipsRow(l) { const ts = (l.tips || []).filter(t => t && (t.name || t.w_g != null)); if (!ts.length || l.type === 'tip') return ''; const C = T.line_card;
  return `<details class="tps"><summary><span class="row" style="gap:8px">${ic('tips', 20)}<span>${esc(C.tips_title)} · ${ts.length}</span></span></summary><table class="tpt"><thead><tr><th>${esc(C.tip_model || 'Модель')}</th><th>${esc(C.tip_length || 'Длина, фт')}</th><th>${esc(C.tip_weight || 'Вес, г')}</th><th>${esc(C.tip_floating || 'Плавучесть')}</th></tr></thead><tbody>${ts.map(t => `<tr><td>${esc(t.name || '—')}</td><td class="mono">${t.len_ft != null ? esc(String(t.len_ft).replace('.', ',')) : t.len ? esc(t.len) + ' м' : '—'}</td><td class="mono">${t.w_g != null && num(t.w_g) != null ? fg(num(t.w_g)) : '—'}</td><td>${sinkChip(t.sink)}</td></tr>`).join('')}</tbody></table></details>`; }
function lineExp(l) { const rs = lineRods(l);
  return `<div class="exp"><div class="cap" style="margin-bottom:4px">${esc(T.line_card.fits_rods)}</div>${rs.length ? rs.map(x => `<button class="card blk" style="margin-top:8px" data-open="rod:${x.r.id}"><div class="row"><span class="t">${esc(sname(x.r))}</span><b class="mono sm3">${x.m.v != null ? fg(x.m.v) + ' ' + x.m.u : ''}</b></div>${x.m.rg ? scale(x.m.rg, x.m.v, x.m) : ''}${mBadge(x.m)}</button>`).join('') : `<div class="mut">—</div>`}
  ${tipsRow(l)}<button class="more" data-open="line:${l.id}">${esc(T.list.more)} ›</button></div>`; }
/* ---------- фильтры: значения берутся из данных ---------- */
const FT = T.filters;
const ftOf = x => x.length_ft ?? (m => m ? +m[1] + (+(m[2] || 0)) / 12 : null)(String(x.length || '').match(/(\d+)\s*'\s*(\d+)?/));
/* плавучесть: составная запись (F/I/S3/S5, «Плавающий», «Тонущий») раскладывается на все компоненты */
const fltTxt = f => { const V = (T.filters || {}).floating_values || {}; return String(f || '').replace(/(^|[\s\/,;+(])(плав[а-яё]*|тон[а-яё]*|промеж[а-яё]*)/gi, (m, p, w) => { const c = /^плав/i.test(w) ? 'F' : /^тон/i.test(w) ? 'S' : 'I'; return p + (V[c] ? (w[0] === w[0].toUpperCase() ? V[c] : V[c].toLowerCase()) : w); }); };
const fltCodes = f => { const o = new Set(); for (const t of String(f || '').split(/[\/,;+\s]+|\s-\s/).filter(Boolean)) { const u = t.toLowerCase();
  if (/^f$|^float|^плав/.test(u)) o.add('F'); else if (/^i$|^int|^промеж|^интерм/.test(u)) o.add('I'); else if (/^s\d*$|^sink|^тон|^погруж/.test(u)) o.add('S'); else if (/^h$|^hover/.test(u)) o.add('I'); } return [...o]; };
/* степень плавучести: шкала и цвета — texts.json → add_line.density, подписи — buoyancy */
const BD = Object.assign({scale: ['F', 'H', 'I', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'], max_parts: 3, colors: {}, stroke: 'rgba(255,255,255,.3)', sink_filter_from: 'S2', legacy: {}}, (T.add_line || {}).density || {}), BT = T.buoyancy || {};
const bIdx = c => BD.scale.indexOf(c);
const bParse = f => { const out = []; for (const t of String(f || '').split(/[\/,;+]+|\s+-\s+|\s+/).filter(Boolean)) { const u = t.trim().toLowerCase(); let c = BD.scale.find(z => z.toLowerCase() === u);
  if (!c) { const m = u.match(/^(?:s|тон[а-яё]*)\s*(\d)$/); if (m) c = 'S' + m[1]; } if (!c) { const k = Object.keys(BD.legacy).find(k => u.startsWith(k)); if (k) c = BD.legacy[k]; } if (c && bIdx(c) >= 0) out.push(c); } return out; };
const bMerge = a => a.filter((c, i) => c !== a[i - 1]);
const bOrdered = a => a.every((c, i) => !i || bIdx(c) > bIdx(a[i - 1]));
const bLbl = c => { const S = BT.scale || {}; return S[c] || (/^S\d$/.test(c) && S.S ? S.S.replace('{n}', c.slice(1)) : c); };
const bStrip = a => a.length ? `<span class="bst" aria-hidden="true">${a.map(c => `<i style="background:${BD.colors[c] || '#9AA4B2'};border-color:${BD.stroke}"></i>`).join('')}</span>` : '';
const bFront = a => a.length ? a[a.length - 1] : null;
const clsInts = (xs, c) => { if (!c) return []; const top = Math.max(c[0], ...xs.map(y => y.cls && y.cls[1]).filter(v => v != null)); const a = []; for (let n = c[0]; n <= (c[1] ?? top); n++) a.push(n); return a; };
/* корзины веса: шаг подбирается по разбросу, границы — из данных */
function wBuckets(vals, u = 'г') { const v = vals.filter(x => x != null); if (!v.length) return null; const mn = Math.min(...v), mx = Math.max(...v), span = mx - mn;
  const st = span <= 0 ? 1 : [1, 2, 5, 10, 20, 25, 50, 100].find(s => span / s <= 5) || 100; return w => { const lo = Math.floor(w / st) * st; return st === 1 ? `${lo} ${u}` : `${lo}–${lo + st} ${u}`; }; }
function filterDefs(k, all) { const D = [], maker = {key: 'maker', label: FT.maker, val: x => [x.brand || FT.no_data]};
  if (k === 'rods') { D.push({key: 'class', label: FT.class, val: x => clsInts(all, x.cls).map(n => '#' + n), num: 1}, {key: 'length', label: FT.length, val: x => { const f = ftOf(x); return [f == null ? FT.no_data : Math.floor(f + 1e-9) + '′']; }, num: 1}, maker); }
  if (k === 'reels') { const b = wBuckets(all.map(x => x.weight_g)); D.push({key: 'weight', label: FT.weight, val: x => [x.weight_g == null || !b ? FT.no_data : b(x.weight_g)], num: 1}, {key: 'class', label: FT.class, val: x => clsInts(all, x.cls).map(n => '#' + n), num: 1}, maker); }
  if (k === 'lines') { const bk = {g: wBuckets(all.filter(x => !isGr(x.type)).map(lineV), UT.gram), gr: wBuckets(all.filter(x => isGr(x.type)).map(lineV), UT.grain)}, bf = x => bk[isGr(x.type) ? 'gr' : 'g'];
    D.push(maker, {key: 'weight', label: FT.weight, val: x => [lineV(x) == null || !bf(x) ? FT.no_data : bf(x)(lineV(x))], num: 1}, {key: 'floating', label: FT.floating, val: x => { const c = fltCodes(x.float); return c.length ? c.map(z => FT.floating_values[z]) : [FT.no_data]; }, order: Object.values(FT.floating_values)}, {key: 'sink', label: BT.filter_sink || 'S2+', val: x => { const f = bFront(bParse(x.float)); return f && bIdx(f) >= bIdx(BD.sink_filter_from) ? [BT.filter_sink] : []; }}); }
  for (const d of D) { const set = new Set(); all.forEach(x => d.val(x).forEach(v => set.add(v))); let o = [...set];
    const key = v => v === FT.no_data ? Infinity : d.order ? d.order.indexOf(v) : d.num ? parseFloat(String(v).replace(/[^\d.]/g, '')) : 0;
    o.sort((a, b) => key(a) - key(b) || String(a).localeCompare(String(b), 'ru')); d.opts = o; }
  return D.filter(d => d.opts.length > 1 || (VIEW.f || {})[d.key]); }
/* сортировка: правила в texts.json → sort_rules, выбор хранится в localStorage */
const ST_ = () => T.sort || {}, SR = k => (T.sort_rules || {})[k] || {};
let SORT = (() => { try { return JSON.parse(localStorage.getItem('ff_sort') || '{}'); } catch (e) { return {}; } })();
const sKey = {cls_lo: x => x.cls ? x.cls[0] : null, cls_hi: x => x.cls ? (x.cls[1] ?? x.cls[0]) : null, length: x => ftOf(x), weight: x => lineV(x), brand: x => String(x.brand || '').trim().toLowerCase() || null};
const cmpBy = (keys, d) => (a, b) => { for (const n of keys) { const f = sKey[n]; if (!f) continue; const x = f(a), y = f(b); if (x == null && y == null) continue; if (x == null) return 1; if (y == null) return -1;
  const c = typeof x === 'string' ? x.localeCompare(y, 'ru') : x - y; if (c) return c * d; } return 0; };
function sortXs(k, xs) { const o = SORT[k]; if (!o) return xs; const r = SR(k), d = o.d === 'desc' ? -1 : 1;
  const keys = o.f === 'brand' ? ['brand', ...((r.brand_tie || (T.sort_rules || {}).brand_tie || {})[k] || r.class || [])] : (r.class || ['cls_lo']);
  return xs.slice().sort(cmpBy(keys, d)); }
function sortLbl(k) { const o = SORT[k], t = ST_(); if (!o) return t.button || ''; const f = o.f === 'brand' ? 'brand' : (SR(k).field || 'class'); return t[`${f}_${o.d || 'asc'}`] || ''; }
function sortSheet(k) { const t = ST_(), o = SORT[k] || {}, fld = SR(k).field || 'class', b = (a, v, l) => `<button class="fo ${a === v ? 'on' : ''}" data-srt="${v}">${esc(l)}</button>`, cur = o.f ? 'f:' + o.f : null, dir = o.f ? 'd:' + (o.d || 'asc') : null;
  return `<div class="fsh-bg" data-fclose></div><div class="fsh" role="dialog" aria-label="${esc(t.button)}"><div class="row"><b>${esc(t.button)}</b><button class="lnk" data-fclose aria-label="Закрыть">✕</button></div><div class="fvals">${b(cur, 'f:class', t['by_' + fld])}${b(cur, 'f:brand', t.by_brand)}</div><div class="fvals" style="margin-top:8px">${b(dir, 'd:asc', t.asc)}${b(dir, 'd:desc', t.desc)}</div></div>`; }
const passF = (defs, x) => defs.every(d => { const v = (VIEW.f || {})[d.key]; return !v || d.val(x).includes(v); });
function filtersBar(defs, k) { const f = VIEW.f || {}, on = Object.values(f).some(Boolean);
  const open = defs.find(d => d.key === VIEW.fo);
  return `<div class="hs fbar">${on ? `<button class="fc rs" data-freset>${esc(FT.reset)}</button>` : ''}${defs.map(d => `<button class="fc ${f[d.key] ? 'on' : ''}" data-fopen="${d.key}" aria-haspopup="dialog"><span>${esc(f[d.key] || d.label)}</span><i class="cv">▾</i></button>`).join('')}${k ? `<button class="fc srt ${SORT[k] ? 'on' : ''}" data-fopen="__sort" aria-haspopup="dialog"><span>${esc(sortLbl(k))}</span></button>` : ''}</div>` + (VIEW.fo === '__sort' && k ? sortSheet(k) : '')
   + (open ? `<div class="fsh-bg" data-fclose></div><div class="fsh" role="dialog" aria-label="${esc(open.label)}"><div class="row"><b>${esc(open.label)}</b><button class="lnk" data-fclose aria-label="Закрыть">✕</button></div><div class="fvals">${[null, ...open.opts].map(v => `<button class="fo ${(f[open.key] || null) === v ? 'on' : ''}" data-fk="${open.key}" data-fv="${esc(v ?? '')}">${esc(v ?? FT.all)}</button>`).join('')}</div></div>` : ''); }
/* длина головы рядом с весом: head_ft/head_m из импорта, иначе разбор поля «Длина» (ключевые слова — T.line_head.keys) */
const LH = Object.assign({fmt: T.line_card.head_length || '{n} фт', sep: ' · ', keys: ['голова', 'head']}, T.line_head || {});
function headLen(l) { let ft = l.head_ft, m = l.head_m; if (ft == null && l.length) { const s = String(l.length), lo = s.toLowerCase(), k = LH.keys.map(w => lo.indexOf(w)).filter(i => i >= 0).sort((a, b) => a - b)[0];
    if (k != null) { const r = s.slice(k).match(/(\d+(?:[.,]\d+)?)\s*['′](?:\s*\((\d+(?:[.,]\d+)?)\s*м\))?/); if (r) { ft = num(r[1]); m = r[2] ? num(r[2]) : null; } } }
  if (ft == null) return ''; if (m == null) m = Math.round(ft * 0.3048 * 10) / 10;
  return LH.fmt.replace('{n}', String(ft).replace('.', ',')).replace('{ft}', String(ft).replace('.', ',')).replace('{m}', String(m).replace('.', ',')); }
const withHead = (w, l) => { const h = headLen(l); return h ? w + esc(LH.sep) + esc(h) : w; };
/* добавить шнур по фото упаковки: фото (≤1600 px, JPEG) → закрытый flyfish-data/requests/lines/<id>.jpg + <id>.json, ключ GitHub только из зашифрованного PIN-ом состояния */
const LP = Object.assign({button: 'По фото упаковки', title: 'Шнур по фото упаковки', hint: 'Сфотографируйте упаковку так, чтобы были видны модель и вес.', pick: 'Сфотографировать или выбрать фото', send: 'Отправить', sending: 'Отправляю…', done_title: 'Фото отправлено', done: 'Рыболовный гид распознает упаковку и добавит шнур в реестр. Ориентировочно {wait}.', wait: 'в течение 1–2 часов', need_key: 'Чтобы отправить фото, включите синхронизацию в Профиле (ключ GitHub).', note: 'Комментарий (необязательно)', max_px: 1600, quality: 0.82}, T.line_photo || {}, (({button, hint, sent, failed, retry}) => Object.fromEntries(Object.entries({button, hint, done: sent && sent + '. Ориентировочно {wait}.', done_title: sent && 'Готово', failed, retry}).filter(e => e[1])))(T.photo_add || {}));
let LPH = null;
const ghPutRaw = async (tok, path, b64s, msg) => { const r = await fetch(ghUrl(path), {method: 'PUT', headers: ghH(tok), body: JSON.stringify({message: msg, branch: BRANCH, content: b64s})}); if (!r.ok) throw new Error('GitHub ' + r.status); };
function lpShrink(file) { return new Promise((ok, no) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { const s = Math.min(1, LP.max_px / Math.max(im.width, im.height)), c = document.createElement('canvas');
  c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', LP.quality)); }; im.onerror = () => no(new Error(LP.failed || 'не удалось открыть фото')); im.src = u; }); }
function lpSheet() { if (!LPH) return ''; const tok = S?.sync?.token, x = LPH;
  const body = x.done ? `<div class="mut sm2" style="margin-top:8px">${esc(LP.done.replace('{wait}', LP.wait))}</div><button class="btn" style="margin-top:14px" data-lpclose>OK</button>`
    : !tok ? `<div class="mut sm2" style="margin-top:8px">${esc(LP.need_key)}</div><button class="btn" style="margin-top:14px" data-tab="profile" data-lpclose>Профиль</button>`
    : `<div class="mut sm2" style="margin-top:6px">${esc(LP.hint)}</div>${x.img ? `<img src="${x.img}" alt="" style="display:block;width:100%;max-height:38vh;object-fit:contain;border-radius:12px;margin-top:12px;background:#0003">` : ''}
      <label class="btn l" style="margin-top:12px;display:block;text-align:center;cursor:pointer">${esc(x.img ? (LP.retry || LP.pick) : LP.pick)}<input type="file" accept="image/*" capture="environment" id="lpf" hidden></label>
      <input id="lpn" placeholder="${esc(LP.note)}" value="${esc(x.note || '')}" style="margin-top:10px;width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font:inherit">
      <button class="btn" style="margin-top:12px" id="lps" ${x.img && !x.busy ? '' : 'disabled'}>${esc(x.busy ? LP.sending : LP.send)}</button>`;
  return `<div class="fsh-bg" data-lpclose></div><div class="fsh" role="dialog" aria-label="${esc(LP.title)}"><div class="row"><b>${esc(x.done ? LP.done_title : LP.title)}</b><button class="lnk" data-lpclose aria-label="Закрыть">✕</button></div>${body}</div>`; }
async function lpSend() { const tok = S.sync.token, x = LPH; x.note = ($('#lpn') || {}).value || x.note || ''; x.busy = true; render();
  try { const id = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + '-' + b64(crypto.getRandomValues(new Uint8Array(3))).replace(/[^a-z0-9]/gi, 'x'), p = 'requests/lines/' + id;
    await ghPutRaw(tok, p + '.jpg', x.img.split(',')[1], 'line photo ' + id);
    await ghPut(tok, p + '.json', {kind: 'flyfish-line-photo', id, at: new Date().toISOString(), photo: p + '.jpg', note: x.note, status: 'new'}, 'line request ' + id);
    LPH = {done: true}; } catch (e) { x.busy = false; toast('Не отправлено: ' + e.message); }
  render(); }
function list(k) { const tab = VIEW.tab || 'double', all = S[k], xs = all.filter(x => inTab(k, x, tab)), defs = filterDefs(k, xs), fx = sortXs(k, xs.filter(x => passF(defs, x)));
  return `<div class="w lw"><div class="ltop"><div class="lhd hdr2"><div class="hrow"><button class="av" data-tab="profile" aria-label="Профиль" title="${esc(syncTxt())}">${ICO.user}</button><span class="hcw" aria-hidden="true" style="--cw:${(T.list.crest || {}).w || 64}px;--ch:${(T.list.crest || {}).h || 54}px;--br:${(T.list.crest || {}).breath_s || 4}s;--gl:${(T.list.crest || {}).glint_s || 6}s"><span class="hcr"><img src="art/crest.svg" alt=""></span></span>${k === 'lines' ? '<span style="width:44px"></span>' : `<button class="pill ac plus" data-new="${k}" aria-label="${esc(T.list.add)}">${ICO.plus}</button>`}</div><h1 class="lt">${esc((T.list.titles || {})[k] || SEC[k])}${/^ошибка/.test(SYNC_ST) ? ` <span class="err" title="${esc(SYNC_ST)}">⟳</span>` : ''}</h1></div>
  ${k === 'lines' ? '<div class="segp">' : ''}<div class="seg full">${['single', 'double'].map(t => `<button data-tab2="${t}" class="${tab === t ? 'on' : ''}"><span>${T.tabs[t]} · ${all.filter(x => inTab(k, x, t)).length}</span></button>`).join('')}</div>${k === 'lines' ? `<button class="rplus" data-addline aria-label="${esc(AL.title)}">${ICO.plus}</button></div>` : ''}${filtersBar(defs, k)}</div>
  </div>
  <div class="w" style="margin-top:8px">${fx.length && k === 'reels' ? `<div class="rgrid">${fx.map(x => `<button class="rcard" data-open="reel:${x.id}"><span class="rph"><img src="${esc(reelImg(x))}" alt=""></span><span class="t">${esc(sname(x))}</span><span class="sm mut">${esc([x.cls ? clsTxt(x.cls) : '', x.weight_g != null ? fg(x.weight_g) + ' г' : ''].filter(Boolean).join(' · '))}</span></button>`).join('')}</div>` : fx.length && k === 'lines' ? lineGroups(fx) : fx.length ? fx.map(x => `<div class="it">${itemHead(k, x)}${OPEN === x.id ? (k === 'rods' ? rodExp(x) : k === 'reels' ? reelExp(x) : lineExp(x)) : ''}</div>`).join('') : xs.length ? `<div class="mut" style="padding:20px 4px;text-align:center">${esc(FT.nothing_found)}</div>` : all.length && tab === 'single' ? emptyTab(k) : emptyBox(k)}</div>`; }
/* шнуры: секции по типу из таблицы (CFG.group), Scandi · г, затем Skagit · gr с вложенной группой «Концы» */
function lineGroups(fx) { const LG = Object.assign({scandi: 'Scandi', skagit: 'Skagit', tips: 'Концы'}, T.line_groups || {}), gOf = x => CFG.group[x.type] || 'other', it = x => `<div class="it">${itemHead('lines', x)}${OPEN === x.id ? lineExp(x) : ''}</div>`;
  const by = {}; fx.forEach(x => (by[gOf(x)] = by[gOf(x)] || []).push(x)); if (!SORT.lines) Object.values(by).forEach(a => a.sort((p, q) => (lineV(p) ?? 1e9) - (lineV(q) ?? 1e9)));
  const unitOf = g => { const t = Object.keys(CFG.group).find(k => CFG.group[k] === g); return t ? uTxt(t) : ''; };
  const sub = g => Object.keys(CFG.nested).filter(n => CFG.nested[n] === g && by[n]).map(n => `<div class="lgh sub">${esc(LG[n] || n)}</div>${by[n].map(it).join('')}`).join('');
  const main = [...CFG.groups, ...Object.keys(by).filter(g => !CFG.groups.includes(g) && !CFG.nested[g])];
  return main.map(g => { const s = sub(g); if (!by[g] && !s) return ''; const u = CFG.groups.includes(g) ? unitOf(g) : '';
    return `<div class="lgh">${esc(LG[g] || g)}${u ? ' · ' + esc(u) : ''}</div>${(by[g] || []).map(it).join('')}${s}`; }).join('')
   + Object.keys(CFG.nested).filter(n => by[n] && !by[CFG.nested[n]] && !CFG.groups.includes(CFG.nested[n])).map(n => `<div class="lgh">${esc(LG[n] || n)}</div>${by[n].map(it).join('')}`).join(''); }
function emptyTab(k) { return `<div class="empty"><div class="eimg"><img src="${ART[k]}" alt=""></div><div class="h2" style="line-height:1.3">${esc(T.empty.single)}</div><button class="btn" style="margin-top:20px" data-new="${k}">+ ${esc(T.empty.single_button)}</button></div>`; }
function emptyBox(k) { return `<div class="empty"><div class="eph">${artBox(k)}</div><div class="h2" style="line-height:1.3">${esc(T.empty[k])}</div><button class="btn" style="margin-top:20px" data-new="${k}">+ ${esc(T.empty.button)}</button></div>`; }
/* картинка удилища: рисуется из характеристик конкретной модели (texts.json → rod_art), рамка 16:9 под кнопками */
function rodArt(r) { const A = T.rod_art || {}, key = `${r.brand || ''} ${r.model || ''}`.trim(), d = Object.assign({}, A.default || {}, (A.brands || {})[r.brand] || {}, r.art || {});
  const lc = v => String(v || '').trim().toLowerCase(), im = (Array.isArray(A.images) ? A.images : []).find(e => e && e.src && (!e.brand || lc(e.brand) === lc(r.brand)) && e.model_contains && [].concat(e.model_contains).some(f => lc(r.model + ' ').includes(lc(f)))); if (im) return `<img class="rart rimg" src="${esc(im.src)}" alt="${esc(sname(r))}" style="width:100%;height:100%;object-fit:contain">`;
  const W = 640, H = 360, I = 24 * 2, ang = Math.atan2(H - 2 * I, W - 2 * I), L = Math.hypot(W - 2 * I, H - 2 * I), len = r.length_ft || 13, k = Math.min(1, .62 + (len - 9) / 15 * .38), Lr = L * k;
  const pcs = Math.max(1, parseInt(r.pieces) || d.pieces || 4), dbl = r.type !== 'single', hnd = dbl ? (r.type === 'switch' ? .2 : .25) : .12, blank = d.blank || '#2E4A55', wrap = d.wrap || '#BFE6F2', cork = d.cork || '#C9A877', seat = d.seat || '#9FB3BD';
  const sx = I + (L - Lr) / 2 * Math.cos(ang), sy = H - I - (L - Lr) / 2 * Math.sin(ang); let g = '';
  const seg = (a, b, w0, w1, fill, extra = '') => `<path d="M${a},${-w0 / 2}L${b},${-w1 / 2}L${b},${w1 / 2}L${a},${w0 / 2}Z" fill="${fill}" ${extra}/>`;
  const wAt = t => 11 - 8.6 * t; // конус бланка
  const h0 = Lr * hnd, bl = Lr - h0; g += seg(h0, Lr, wAt(0) * 1.3, 1.6, blank);
  for (let i = 1; i < pcs; i++) { const x = h0 + bl * i / pcs, w = wAt(i / pcs) * 1.3 + 2; g += `<rect x="${x - 6}" y="${-w / 2}" width="12" height="${w}" rx="2" fill="${wrap}"/>`; }
  for (let i = 0; i < 8; i++) { const x = h0 + bl * (.08 + i * .115); g += `<circle cx="${x}" cy="${-(wAt((x - h0) / bl) * .65 + 4)}" r="${2.6 - i * .2}" fill="none" stroke="${wrap}" stroke-width="1.2"/>`; }
  const fg_ = dbl ? Lr * .07 : 0, st = dbl ? Lr * .1 : Lr * .02, se = st + Lr * .045;
  if (dbl) g += seg(0, fg_, 13, 12, cork, `rx="3"`);
  g += seg(st, se, 12, 12, seat) + seg(se, h0, 13, 10.5, cork); if (dbl) g += seg(fg_, st, 11, 11, d.butt || '#1E2A30');
  g += `<path d="M${Lr - 2},0L${Lr + 3},0" stroke="${wrap}" stroke-width="2"/>`;
  return `<svg class="rart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sname(r))}"><g transform="translate(${sx.toFixed(1)},${sy.toFixed(1)}) rotate(${(-ang * 180 / Math.PI).toFixed(2)})" filter="url(#rsh${esc(String(r.id).replace(/\W/g, ''))})">${g}</g><defs><filter id="rsh${esc(String(r.id).replace(/\W/g, ''))}" x="-10%" y="-50%" width="120%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity=".45"/></filter></defs></svg>`; }
function rodTop(r) { return `<div class="w row top" style="position:relative"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><button class="pill" data-edit="rods:${r.id}">${esc(T.rod_card.edit)}</button></div><div class="rframe">${rodArt(r)}</div>`; }
function cardTop(k, x) { return `<div class="chero ${k}"><div class="glow"></div>${artBox(k, k === 'rods' ? 'inset:40px -30px 50px -20px;background-size:contain' : 'inset:70px 25% 40px;background-size:contain', k === 'reels' ? reelImg(x) : '')}<div class="w row top" style="position:relative"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><button class="pill" data-edit="${k}:${x.id}">${esc(T.rod_card.edit)}</button></div></div>`; }
const stats = a => `<div class="mono specs">${a.filter(([, v]) => v && v !== '—').map(([s, v]) => `<span title="${esc(s)}">${v}</span>`).join('<span aria-hidden="true">·</span>')}</div>`;
const buyBlock = x => x.buy && Object.keys(x.buy).length ? `<div class="card" style="margin-top:12px"><div class="cap">Покупка</div><div class="mut sm2" style="margin-top:4px">${[x.buy.date, x.buy.shop, x.buy.price_eur != null ? String(x.buy.price_eur).replace('.', ',') + ' € без НДС' : ''].filter(Boolean).map(esc).join(' · ')}</div></div>` : '';
const srcLinks = src => { const us = [...new Set((String(src || '').match(/https?:\/\/[^\s;,]+/g) || []))], seen = new Set();
  const a = us.map(u => { let h; try { h = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } if (seen.has(h)) return ''; seen.add(h); return `<a class="src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(h)} ›</a>`; }).filter(Boolean);
  return a.length ? `<div class="mut sm2" style="margin-top:10px">Источник: ${a.join(' ')}</div>` : ''; };
const noteBlock = x => x.note ? `<div class="mut" style="margin-top:12px">${esc(x.note)}</div>` : '';
const delBtn = (k, x) => `<button class="btn r" style="margin-top:22px" data-del="${k}:${x.id}">${esc(T.rod_card.delete)}</button>`;
const titleBlock = (cap, x) => `<div class="cap mono">${cap}</div><h1 class="h1 big2" title="${esc(name(x))}">${esc(sname(x))}</h1>`;
const rodTitle = r => { const b = String(r.brand || '').trim(), m = String(r.model || '').trim(), mm = b && m.toLowerCase().startsWith(b.toLowerCase()) ? m.slice(b.length).trim() : m;
  return `<div class="cap mono">${esc((RT[r.type] || '').toUpperCase())}</div><h1 class="h1 big2 rtt" title="${esc(sname(r))}">${b ? `<span class="rb">${esc(b)}</span> ` : ''}<b class="rm">${esc(mm)}</b></h1>`; };
function rodCard(r) { const ls = rodLines(r);
  return rodTop(r) + `<div class="w ctxt rc">${rodTitle(r)}${stats([['Длина', esc(r.length || '—')], ['Класс', esc(r.class || '—')], ['Колен', r.pieces ? esc(r.pieces) + ' колен' : ''], ['Вес', r.weight_g ? fg(r.weight_g) + ' г' : '']])}
  <div class="card gcard">${ruler(r, ls) || `<div class="mut">Окна Scandi и Skagit не указаны</div>`}</div>
  <div class="row" style="margin-top:20px"><h2 class="h2">${esc(T.rod_card.matches_title)}</h2><span class="mut mono">${ls.length}</span></div>
  ${ls.length ? ls.map(x => lineRow(x.l, x.m)).join('') : `<div class="mut">${esc(T.empty.no_match)}</div>`}
  <button class="more" data-pick="${r.id}">График подбора ›</button><div class="mut sm2" style="margin-top:6px">${esc(T.rod_card.matches_hint)}</div>${recBlock(r)}${r.rio?.note ? `<div class="mut sm2" style="margin-top:6px">${esc(r.rio.note)}</div>` : ''}${srcLinks(r.source)}${noteBlock(r)}${buyBlock(r)}${delBtn('rods', r)}</div>`; }
const RC = T.reel_card || {};
function reelSegs(x) { const row = (lbl, key, vals, v) => `<div class="rseg" style="margin-top:12px"><div class="row" style="justify-content:space-between"><small class="mut">${esc(lbl)}</small><small class="mut sm">${v ? '' : esc(RC.not_set || 'Не указан')}</small></div><div class="seg full" style="margin-top:6px;grid-template-columns:repeat(${Object.keys(vals).length},1fr)">${Object.entries(vals).map(([k, t]) => `<button type="button" data-rset="${key}:${k}" class="${v === k ? 'on' : ''}" aria-pressed="${v === k}"><span>${esc(t)}</span></button>`).join('')}</div></div>`;
  return row(RC.rod_type || 'Для удилищ', 'hand', RC.rod_type_values || {single: 'Одноручные', double: 'Двуручные', both: 'Оба'}, x.hand) + row(RC.line_kind || 'Тип шнура', 'line_kind', RC.line_kind_values || {running: 'Раннинг', line: 'Шнур'}, x.line_kind); }
/* ручная правка катушки: в зашифрованное состояние + открытая заявка requests/reel_edits/<id>.json в закрытом репозитории → reel_edits.py → таблица (колонки M/O) */
async function reelSet(id, key, v) { const x = byId('reels', id); if (!x) return; x[key] = x[key] === v ? null : v; if (key === 'hand') x.rods = null; x.edited = true;
  S.reelq = S.reelq || {}; S.reelq[id] = {hand: x.hand || null, line_kind: x.line_kind || null, at: new Date().toISOString()}; await save(); toast(RC.saved || 'Сохранено'); render(); flushReelq(); }
async function flushReelq() { const tok = S?.sync?.token, q = S?.reelq; if (!tok || !q) return;
  for (const [id, e] of Object.entries(q)) { if (!id.startsWith('sheet:reel:')) { delete q[id]; continue; } const x = byId('reels', id) || {}, f = 'requests/reel_edits/' + id.replace(/[^a-z0-9]+/gi, '_') + '.json';
    try { await ghPut(tok, f, {kind: 'flyfish-reel-edit', id, row: id.split(':').pop(), brand: x.brand || '', model: x.model || '', hand: e.hand, line_kind: e.line_kind, at: e.at, status: 'new'}, 'reel edit ' + id); delete q[id]; } catch (err) { return; } }
  await save(true); }
function reelCard(x) { const fit = x.hand === 'both' ? T.reel_card.fits_both : x.hand === 'single' ? T.reel_card.fits_single : x.hand === 'double' ? T.reel_card.fits_double : 'не указано';
  return cardTop('reels', x) + `<div class="w ctxt">${titleBlock(`${esc(x.brand || '')} · катушка`, x)}${stats([['Классы', x.cls ? clsTxt(x.cls) : esc(x.size || '—')], ['Вес', x.weight_g != null ? fg(x.weight_g) + ' г' : esc(FT.no_data)], ['Размер', esc(x.size || '')]])}${reelSegs(x)}<div class="card" style="margin-top:14px"><b>${esc(T.reel_card.fits)}:</b> ${esc(fit)}</div>${reelExp(x).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(x)}${buyBlock(x)}${delBtn('reels', x)}</div>`; }
function lineCard(l) { const g = lineV(l);
  return cardTop('lines', l) + `<div class="w ctxt">${titleBlock(`${esc(TL(l.type))} · ${esc(l.brand || '')}`, l)}
  <div class="g2" style="margin-top:14px">${[[T.line_card.weight, withHead(g != null ? fg(g) + ' ' + uTxt(l.type) : esc(l.w_raw || '—'), l)], [T.line_card.length, esc(l.length || '—')], [T.line_card.floating, esc(fltTxt(l.float) || '—')]].map(([s, v]) => `<div class="stat"><small>${esc(s)}</small><b>${v}</b></div>`).join('')}</div>
  <div class="card" style="margin-top:12px">${l.has_tips ? T.line_card.tips_yes : T.line_card.tips_no}${l.body ? ' · тело головы, вес без конца' : ''}${l.reel ? ' · на катушке: ' + esc(l.reel) : ''}</div>${lineExp(l).replace(/<button class="more"[^]*?<\/button>/, '')}${noteBlock(l)}${buyBlock(l)}${delBtn('lines', l)}</div>`; }
/* общий точечный график: оба окна на одной оси граммов, точки — шнуры */
function dotChart(r, ls) { const W = 340, H = 200, ay = 154, L = 14, R = 14; const ws = [], pts = ls.filter(x => x.m.rg);
  for (const t of ['scandi', 'skagit']) { const g = r[t + '_g']; if (g) ws.push(g.lo, g.hi); } const all = [...ws, ...pts.map(x => x.m.w)]; if (!all.length) return '';
  const mn = Math.floor(Math.min(...all) - 2), mx = Math.ceil(Math.max(...all) + 2), x = g => L + (g - mn) / (mx - mn) * (W - L - R);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Шнуры на оси веса, граммы"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#7F95A8" stroke-width="1.4" opacity=".35"/></pattern></defs>`; const step = mx - mn > 24 ? 4 : 2;
  for (let g = mn; g <= mx; g++) { s += `<line x1="${x(g).toFixed(1)}" x2="${x(g).toFixed(1)}" y1="${ay + 4}" y2="${ay + (g % step ? 9 : 14)}" stroke="#5B6470"/>`; if (g % step === 0) s += `<text x="${x(g).toFixed(1)}" y="${ay + 30}" text-anchor="middle" class="ga">${g}</text>`; }
  const sg = r.scandi_g, kg = r.skagit_g, ov = sg && kg && Math.abs((x(kg.lo) + x(kg.hi)) / 2 - (x(sg.lo) + x(sg.hi)) / 2) < 78; [['scandi', '#E9EEF2'], ['skagit', '#7F95A8']].forEach(([t, c], i) => { const g = r[t + '_g']; if (!g) return; const ap = apxOf(g), lo = ap && g.lo === g.hi ? g.lo - 1.5 : g.lo, hi = ap && g.lo === g.hi ? g.hi + 1.5 : g.hi, col = ap ? SC.apx : c, w = Math.max(x(hi) - x(lo), 3);
    const y0 = ov ? 38 : 22, sk = t === 'skagit';
    s += sk ? `<rect x="${x(lo).toFixed(1)}" y="${y0}" width="${w.toFixed(1)}" height="${ay - y0}" fill="url(#hatch)" stroke="${col}" stroke-width="1.2" stroke-dasharray="4 3"/>` : `<rect x="${x(lo).toFixed(1)}" y="${y0}" width="${w.toFixed(1)}" height="${ay - y0}" fill="${col}" opacity=".12"/>`;
    s += `<rect x="${x(lo).toFixed(1)}" y="${ay - 6}" width="${w.toFixed(1)}" height="6" fill="${col}" ${ap ? 'opacity=".7"' : ''}/>`;
    const cxl = (x(lo) + x(hi)) / 2, lbl = `${t.toUpperCase()} ${rngU(rw(r, t), t)}`, hw = lbl.length * 3.3, anc = cxl - hw < 2 ? 'start' : cxl + hw > W - 2 ? 'end' : 'middle', tx = anc === 'start' ? x(lo) : anc === 'end' ? x(hi) : cxl;
    s += `<line x1="${cxl.toFixed(1)}" x2="${cxl.toFixed(1)}" y1="${(17 + (ov ? i * 17 : 0))}" y2="${y0}" stroke="${col}" opacity=".5"/><text x="${tx.toFixed(1)}" y="${13 + (ov ? i * 17 : 0)}" text-anchor="${anc}" class="gw" fill="${col}">${esc(lbl)}</text>`; });
  const ys = ov ? [52, 74, 96, 118, 63, 85, 107, 129] : [44, 76, 58, 92, 110, 66, 100, 50]; pts.forEach((p, i) => { const cx = x(p.m.w), y = ys[i % ys.length], c = SC[stOf(p.m)], rt = cx > W - 80;
    s += `<line x1="${cx.toFixed(1)}" x2="${cx.toFixed(1)}" y1="${y}" y2="${ay - 7}" stroke="${c}" stroke-dasharray="2 3"/><circle cx="${cx.toFixed(1)}" cy="${y}" r="7" fill="${c}" stroke="#0C0F12" stroke-width="2.5"/>${apxOf(p.m.rg) ? `<circle cx="${cx.toFixed(1)}" cy="${y}" r="10.5" fill="none" stroke="${SC.apx}" stroke-width="1.5" stroke-dasharray="2 2"/>` : ''}<text x="${(cx + (rt ? -11 : 11)).toFixed(1)}" y="${y + 4}" text-anchor="${rt ? 'end' : 'start'}" class="gd">${fg(p.m.v)} ${p.m.u}</text>`; });
  return s + '</svg>'; }
function pick() { if (!S.rods.length) return head('Подбор') + `<div class="w">${emptyBox('rods')}</div>`;
  const best = S.rods.map(r => ({r, n: okN(rodLines(r))})).sort((a, b) => b.n - a.n)[0].r; const r = S.rods.find(x => x.id === VIEW.sel) || best, ls = rodLines(r);
  const cnt = {ok: 0, edge: 0, fb: 0, apx: 0}; ls.forEach(x => { cnt[stOf(x.m)]++; if (x.m.rg && apxOf(x.m.rg)) cnt.apx++; });
  const aw = ['scandi', 'skagit'].filter(t => apxOf(r[t + '_g']));
  return `<div class="w top"><div class="row"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><span></span></div><h1 class="h1" style="margin-top:14px">Подбор</h1></div><div class="hs rods" role="tablist" aria-label="Удилище">${S.rods.map(x => `<button class="rchip ${x.id === r.id ? 'on' : ''}" data-sel="${x.id}" role="tab" aria-selected="${x.id === r.id}">${icoBox('rods', 's')}<div style="text-align:left;min-width:0"><div class="t one">${esc(sname(x))}</div><div class="mono mut sm">${esc(x.class || '—')} · ${esc(x.length || '—')}</div></div></button>`).join('')}</div>
  <div class="w"><div class="card chart">${dotChart(r, ls) || `<div class="mut">Окна Scandi и Skagit не указаны, подбор по классу</div>`}</div>
  <div class="legend">${[['ok', 'Подходит'], ['edge', T.rod_card.on_edge], ['fb', 'Запасной'], ].map(([k, t]) => `<span><i style="${k === 'apx' ? `background:none;border:1.5px dashed ${SC.apx};width:13px;height:13px;border-radius:7px` : 'background:' + SC[k]}"></i>${k === 'apx' ? '≈ ' : ''}${t} <b class="mono">${cnt[k]}</b></span>`).join('')}</div>
  ${ls.length ? ls.map(x => `<div class="pr">${lineRow(x.l, x.m, 0, 1)}</div>`).join('') : `<div class="mut" style="margin-top:10px">${esc(T.empty.no_match)}</div>`}
  ${aw.map(t => `<div class="card dash row" style="margin-top:8px">${apxBtn(apxOf(r[t + '_g']), 1)}<span class="mono mut sm" style="text-align:right">${esc(sname(r))} · ${t === 'scandi' ? 'Scandi' : 'Skagit'} ${esc(rngU(rw(r, t), t))} ${isGr(t) ? '±25 ' + esc(UT.grain) : '±1,5 ' + esc(UT.gram)}</span></div>`).join('')}
  <button class="more" data-open="rod:${r.id}">Карточка удилища ›</button></div>`; }
function profile() { const n = S.rods.length + S.reels.length + S.lines.length;
  return `<div class="w top"><div class="row"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><span></span></div><div style="text-align:center;margin-top:10px"><div class="av big">${ICO.user}</div><h1 class="h1" style="margin-top:10px">Профиль</h1><div class="mut">${n} ${plural(n, 'снасть', 'снасти', 'снастей')}</div><div class="mut sm mono one" style="margin-top:2px">${S.rods.length} ${plural(S.rods.length, 'удилище', 'удилища', 'удилищ')} · ${S.reels.length} ${plural(S.reels.length, 'катушка', 'катушки', 'катушек')} · ${S.lines.length} ${plural(S.lines.length, 'шнур', 'шнура', 'шнуров')}</div></div>
  <div class="card" style="margin-top:18px;padding:4px 16px">
   <div class="pl"><span>PIN-код</span><span class="mut">4 цифры · шифрует данные</span></div>
   <div class="pl"><span>Синхронизация</span><span class="mut">${S.sync.token ? esc(SYNC_ST || (S.sync.last ? new Date(S.sync.last).toLocaleString('ru-RU', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'}) : 'включена')) : 'выключена'}</span></div>
   <div class="pl"><span>Импорт из таблицы</span><span class="mut">${S.sync.token ? 'при каждой синхронизации' : 'нужен ключ'}</span></div>
   <div class="pl" style="border:0"><span>Единицы</span><span class="mut mono">г / gr</span></div></div>
  <div class="card" style="margin-top:14px"><div class="cap">Резервная копия и реестр</div><div class="mut sm2" style="margin:6px 0 12px">Данные шифруются PIN-кодом на телефоне и хранятся в закрытом репозитории ${DATA_REPO}. Нужен ключ GitHub (Fine-grained, только репозиторий flyfish-data, Contents: Read and write). Никому его не пересылайте.</div>
  ${S.sync.token ? `<button class="btn" id="syn">Синхронизировать</button><button class="btn l" style="margin-top:8px" id="toff">Убрать ключ</button>`
   : `<label class="f"><small>Ключ GitHub</small><input id="tok" type="password" autocomplete="off"></label><button class="btn" style="margin-top:10px" id="ton">Подключить</button>`}</div>
  <div class="card" style="margin-top:14px"><div class="cap">${esc(T.pin.title)}</div><div class="dots sm" aria-hidden="true"><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i></div><div class="mut sm2">${esc(T.pin.subtitle)}</div><button class="btn l" style="margin-top:12px" id="lock">Заблокировать</button></div></div>`; }
/* ---------- «+» в «Шнурах»: лист «Добавить шнур» (вручную / по фото) и ручная форма ---------- */
const AL = Object.assign({title: 'Добавить шнур', manual: 'Вручную', manual_hint: '', photo: 'По фото', photo_hint: '', weight_auto: 'Пересчёт: {value}', bought: 'Дата покупки', note: 'Примечание', tip_for_body: 'С каким концом', save: 'Добавить в список',
  brand: 'Производитель', model: 'Модель', type: 'Тип', weight_g: 'Вес, г', weight_gr: 'Вес, грейны', head_ft: 'Длина головы, фт', floating: 'Плавучесть', hand: 'Для удилищ', tip_len: 'Длина конца, фт', tip_w: 'Вес конца, г', no_tips: 'Концов в списке пока нет',
  types: {scandi: 'Scandi', skagit: 'Skagit', body: 'Тело', tip: 'Конец', running: 'Раннинг'}, floats: ['F', 'I', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'], float_names: {F: 'Плавающий', I: 'Интермедиа'},
  sheet_types: {scandi: 'Скандинавская голова', skagit: 'Skagit', body: 'Скандинавская голова (тело)', tip: 'Сменный конец', running: 'Раннинг'}}, T.add_line || {});
let ALH = null;
const ICP = {pencil: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>',
  camera: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-2.5h6L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.6"/></svg>'};
function alSheet() { if (!ALH) return ''; const o = (k, ic, t, h) => `<button class="card row kind alo" data-alo="${k}"><span class="alic">${ICP[ic]}</span><div style="flex:1;text-align:left"><div class="t">${esc(t)}</div><div class="mut sm2">${esc(h)}</div></div><span class="chev" aria-hidden="true">›</span></button>`;
  return `<div class="fsh-bg" data-alclose></div><div class="fsh" role="dialog" aria-label="${esc(AL.title)}"><div class="row"><b>${esc(AL.title)}</b><button class="lnk" data-alclose aria-label="Закрыть">✕</button></div><div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">${o('manual', 'pencil', AL.manual, AL.manual_hint)}${o('photo', 'camera', AL.photo, AL.photo_hint)}</div></div>`; }
const GRM = 15.432;
const alGr = d => d.ltype === 'skagit';
function alAuto(d) { const w = num(d.w); if (w == null || d.ltype === 'running') return ''; return AL.weight_auto.replace('{value}', alGr(d) ? Math.round(w / GRM) + ' г' : Math.round(w * GRM) + ' gr'); }
function bForm(d, chips) { const n = +d.bn || 1, z = (d.bz || []).slice(0, n), L = [BT.rear, BT.middle, BT.front], pos = n === 1 ? [L[0]] : n === 2 ? [L[0], L[2]] : L;
  const sel = i => { const prev = i ? z[i - 1] : null, opts = BD.scale.filter(c => !prev || bIdx(c) > bIdx(prev)); return `<label class="f"><small>${esc(pos[i])}</small><select data-bz="${i}"><option value="">—</option>${opts.map(c => `<option value="${c}"${z[i] === c ? ' selected' : ''}>${esc(bLbl(c))}</option>`).join('')}</select></label>`; };
  return `<div class="cap">${esc(BT.title)}</div>${chips('bn', [['1', BT.single], ['2', BT.dual], ['3', BT.triple]].slice(0, BD.max_parts))}<div class="bprev">${bStrip(z.filter(Boolean)) || '<span class="mut sm2">—</span>'}<span class="mono">${esc(z.filter(Boolean).join('/'))}</span></div>${[...Array(n)].map((_, i) => sel(i)).join('')}`; }
function lform() { const d = DRAFT, t = d.ltype, chips = (n, opts, multi) => `<div class="seg wrap" data-alseg="${n}"${multi ? ' data-multi="1"' : ''}>${opts.map(([k, l]) => `<button type="button" data-v="${esc(k)}" class="${(multi ? (d[n] || []).includes(k) : d[n] === k) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  const tips = S.lines.filter(l => l.type === 'tip'), wl = t === 'skagit' ? AL.weight_gr : AL.weight_g;
  const b = `${FL(AL.brand, 'brand', d.brand)}${FL(AL.model, 'model', d.model)}<div class="cap">${esc(AL.type)}</div>${chips('ltype', Object.entries(AL.types))}
  ${t !== 'tip' ? `<label class="f"><small>${esc(wl)}</small><input name="w" value="${esc(d.w ?? '')}" inputmode="numeric" class="mono" autocomplete="off"></label><div class="mut sm2" id="alauto">${esc(alAuto(d))}</div>` : ''}
  ${['scandi', 'skagit', 'body'].includes(t) ? FL(AL.head_ft, 'head_ft', d.head_ft, 'number') : ''}
  ${t === 'tip' ? `<div class="g2">${FL(AL.tip_len, 'tip_len', d.tip_len, 'number')}${FL(AL.tip_w, 'tip_w', d.tip_w, 'number')}</div>` : ''}
  ${t === 'body' ? `<div class="cap">${esc(AL.tip_for_body)}</div>${tips.length ? chips('tip_id', tips.map(x => [x.id, sname(x)])) : `<div class="mut sm2">${esc(AL.no_tips)}</div>`}` : ''}
  ${bForm(d, chips)}
  <div class="cap">${esc(AL.hand)}</div>${chips('hand', [['single', T.tabs.single], ['double', T.tabs.double]])}
  <label class="f"><small>${esc(AL.bought)}</small><input name="bought" type="date" value="${esc(d.bought || '')}"></label>${FL(AL.note, 'note', d.note)}`;
  return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(T.forms.cancel)}">✕</button><span></span><button class="lnk ac" data-alsave>${esc(T.forms.save)}</button></div><h1 class="h1" style="margin-top:16px">${esc(AL.title)}</h1>
  <form id="lfm" style="display:flex;flex-direction:column;gap:10px;margin-top:14px" onsubmit="return false">${b}<button class="btn" type="button" data-alsave style="margin-top:10px">${esc(AL.save)}</button></form></div>`; }
function alRead() { document.querySelectorAll('#lfm input[name]').forEach(i => DRAFT[i.name] = i.value.trim()); }
async function alSave() { alRead(); const d = DRAFT, t = d.ltype; if (!d.model) return toast(T.forms.required); const w = num(d.w);
  if (t !== 'tip' && t !== 'running' && w == null) return toast(T.forms.required);
  const wg = w == null ? null : alGr(d) ? Math.round(w / GRM * 10) / 10 : Math.round(w), wgr = w == null ? null : alGr(d) ? Math.round(w) : Math.round(w * GRM), hf = num(d.head_ft), fl = bMerge((d.bz || []).slice(0, +d.bn || 1).filter(Boolean)).join('/');
  const tip = t === 'body' && d.tip_id ? byId('lines', d.tip_id) : null;
  const l = {id: 'u:' + uid(), src: 'user', brand: d.brand || '', model: d.model, type: t === 'body' ? 'scandi' : t, body: t === 'body', hand: t === 'running' ? null : (d.hand || 'double'),
    w_g: t === 'tip' ? num(d.tip_w) : wg, w_gr: t === 'tip' ? (num(d.tip_w) != null ? Math.round(num(d.tip_w) * GRM) : null) : wgr, cls: null, float: fl || null,
    length: t === 'tip' ? (num(d.tip_len) != null ? num(d.tip_len) + "'" : null) : hf != null ? `Голова ${hf}' (${(hf * 0.3048).toFixed(1).replace('.', ',')} м)` : null, ...(hf != null ? {head_ft: hf, head_m: Math.round(hf * 0.3048 * 10) / 10} : {}),
    has_tips: !!tip, tips: tip ? [{name: sname(tip), w_g: tip.w_g, len_ft: num(String(tip.length || '').replace(/[^\d.,]/g, '').replace(',', '.')), sink: tip.float || null, src: 'user', ref: tip.id}] : [], note: d.note || null,
    buy: d.bought ? {date: d.bought.split('-').reverse().join('.')} : {}};
  S.lines.push(l);
  const row = {'Производитель': l.brand, 'Модель': l.model, 'Тип (скандинавская голова/Skagit/полный шнур/раннинг)': AL.sheet_types[t] || t, 'Класс/вес (грейн)': l.w_gr != null ? `${l.w_gr} (${String(l.w_g).replace('.', ',')} г)` : '',
    [BD.sheet_column || 'Степень плавучести']: fl, 'Длина': l.length || '', 'Примечание': [d.note, tip ? 'Конец: ' + sname(tip) : '', l.hand ? 'Для: ' + (T.tabs[l.hand] || l.hand).toLowerCase() : ''].filter(Boolean).join('; '), 'Дата покупки': l.buy.date || ''};
  S.lineq = S.lineq || {}; S.lineq[l.id] = {row, at: new Date().toISOString()};
  await save(); toast(T.forms.saved); DRAFT = null; VIEW = {...tabView('lines'), tab: l.hand === 'single' ? 'single' : 'double'}; HIST.length = 0; render(); flushLineq(); }
/* ручные шнуры → открытая заявка requests/line_edits/<id>.json в закрытом репозитории → line_edits.py → вкладка «Шнуры» */
async function flushLineq() { const tok = S?.sync?.token, q = S?.lineq; if (!tok || !q) return;
  for (const [id, e] of Object.entries(q)) { const f = 'requests/line_edits/' + id.replace(/[^a-z0-9]+/gi, '_') + '.json';
    try { await ghPut(tok, f, {kind: 'flyfish-line-add', id, row: e.row, at: e.at, status: 'new'}, 'line add ' + id); delete q[id]; } catch (err) { return; } }
  await save(true); }
/* ---------- «Поездки»: только в зашифрованном состоянии (S.trips), в код и таблицу не попадают ---------- */
const TR = Object.assign({title: 'Поездки', regions: ['Кольский', 'Тиман', 'Карелия'], region_other: 'Другой', status_values: {plan: 'План', booked: 'Забронировано', done: 'Прошла'}, days: {one: 'день', few: 'дня', many: 'дней'}, months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'], wd: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']}, T.trips || {});
const KT = Object.assign({}, TR.kit || {});
const pad = n => String(n).padStart(2, '0'), ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, pd = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const tDays = t => t.from && t.to ? Math.round((pd(t.to) - pd(t.from)) / 864e5) + 1 : null, fmtD = s => s ? s.split('-').reverse().slice(0, 2).join('.') : '—';
const tDates = t => { const n = tDays(t); return `${fmtD(t.from)} – ${fmtD(t.to)}${n ? ` · ${n} ${plural(n, TR.days.one, TR.days.few, TR.days.many)}` : ''}`; };
const rAbbr = r => String(r || '—').trim().slice(0, 3);
const kitMiss = k => k.rod ? [!k.reel && KT.missing_reel, !(k.lines || []).length && KT.missing_line].filter(Boolean) : [];
function tripsView() { const now = new Date(), m = VIEW.m || ymd(now).slice(0, 7), [Y, M] = m.split('-').map(Number), first = new Date(Y, M - 1, 1), last = new Date(Y, M, 0), off = (first.getDay() + 6) % 7;
  const start = new Date(Y, M - 1, 1 - off), weeks = Math.ceil((off + last.getDate()) / 7), ts = S.trips.slice().sort((a, b) => String(a.from).localeCompare(String(b.from)));
  let cal = '';
  for (let w = 0; w < weeks; w++) { const ws = new Date(start); ws.setDate(start.getDate() + w * 7); const we = new Date(ws); we.setDate(ws.getDate() + 6);
    const days = [...Array(7)].map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return `<span class="cd${d.getMonth() !== M - 1 ? ' out' : ''}${ymd(d) === ymd(now) ? ' now' : ''}">${d.getDate()}</span>`; }).join('');
    const bars = ts.filter(t => t.from && t.to && pd(t.from) <= we && pd(t.to) >= ws).map(t => { const a = Math.max(0, Math.round((pd(t.from) - ws) / 864e5)), b = Math.min(6, Math.round((pd(t.to) - ws) / 864e5));
      return `<button class="cbar s-${t.status || 'plan'}${pd(t.from) < ws ? ' cl' : ''}${pd(t.to) > we ? ' cr' : ''}" style="grid-column:${a + 1}/${b + 2}" data-open="trip:${t.id}">${esc(t.river || '')}</button>`; }).join('');
    cal += `<div class="cwk"><div class="cdays">${days}</div>${bars ? `<div class="cbars">${bars}</div>` : ''}</div>`; }
  const ms = ymd(first), me = ymd(last), inM = ts.filter(t => t.from && t.to ? t.from <= me && t.to >= ms : false);
  const card = t => `<button class="card row tcard" data-open="trip:${t.id}"><span class="rbdg">${esc(rAbbr(t.region))}</span><div style="flex:1;min-width:0;text-align:left"><div class="t">${esc(t.river || '—')}</div><div class="mut sm">${esc(tDates(t))}${t.camp ? ' · ' + esc(t.camp) : ''}</div><div style="margin-top:6px"><span class="tst s-${t.status || 'plan'}">${esc(TR.status_values[t.status || 'plan'])}</span>${(t.kits || []).some(k => kitMiss(k).length) ? ' <i class="adot" aria-hidden="true"></i>' : ''}</div></div><span class="chev" aria-hidden="true">›</span></button>`;
  const mv = d => { const x = new Date(Y, M - 1 + d, 1); return ymd(x).slice(0, 7); };
  return `<div class="w lw"><div class="ltop"><div class="lhd"><div class="ltb"><h1 class="lt">${esc(TR.title)}</h1><div class="cnt">${esc(T.list.count.replace('{n}', S.trips.length))}</div></div><div class="rt"><button class="av" data-tab="profile" aria-label="Профиль">${ICO.user}</button><button class="pill ac plus" data-tnew aria-label="${esc(TR.add)}">${ICO.plus}</button></div></div></div></div>
  <div class="w"><div class="card cal"><div class="row cmh"><button class="cb" data-tm="${mv(-1)}" aria-label="Предыдущий месяц">‹</button><b>${esc(TR.months[M - 1])} ${Y}</b><button class="cb" data-tm="${mv(1)}" aria-label="Следующий месяц">›</button></div><div class="cdays cwd">${TR.wd.map(d => `<span>${d}</span>`).join('')}</div>${cal}</div>
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">${inM.length ? inM.map(card).join('') : `<div class="mut" style="padding:20px 4px;text-align:center">${esc(TR.empty)}</div>`}</div></div>`; }
/* слот комплекта: картинка снасти, пустой — пунктир с «+», янтарная точка если комплект неполный */
function slot(ti, ki, step, k) { const miss = k.rod && ((step === 'reel' && !k.reel) || (step === 'line' && !(k.lines || []).length)), lbl = KT['step_' + step];
  let inner = '';
  if (step === 'rod' && k.rod) { const r = byId('rods', k.rod); inner = `${icoBox('rods')}<span class="sn">${esc(sname(r))}</span>`; }
  if (step === 'reel' && k.reel) { const r = byId('reels', k.reel); inner = `<span class="thumb ph"><img src="${esc(reelImg(r))}" alt=""></span><span class="sn">${esc(sname(r))}</span>`; }
  if (step === 'line' && (k.lines || []).length) { const n = k.lines.length; inner = `<span class="fan">${k.lines.slice(0, 3).map((_, i) => `<span class="fi" style="--i:${i}">${glyph('lines', 18)}</span>`).join('')}${n > 1 ? `<b class="fcnt">${n}</b>` : ''}</span><span class="sn">${esc(n > 1 ? KT.lines_n[plural(n, 'one', 'few', 'many')].replace('{n}', n) : sname(byId('lines', k.lines[0].id)))}</span>`; }
  return `<button class="kslot${inner ? '' : ' emp'}" data-kslot="${ki}:${step}" aria-label="${esc(lbl)}">${miss ? '<i class="adot" aria-hidden="true"></i>' : ''}<small class="mut">${esc(lbl)}</small>${inner || '<span class="kplus">+</span>'}</button>`; }
function tripCard(t) { if (!t.id) return tripsView(); const ks = t.kits || [];
  const kits = ks.map((k, i) => { const ms = kitMiss(k), kn = KT.kit_n.replace('{n}', i + 1); return `<div class="card kit"><div class="row"><b>${esc(kn)}</b><button class="lnk" data-krm="${i}">${esc(KT.delete_kit)}</button></div><div class="kslots">${slot(t.id, i, 'rod', k)}${slot(t.id, i, 'reel', k)}${slot(t.id, i, 'line', k)}</div><div class="sm2 ${ms.length ? 'kwarn' : 'mut'}" style="margin-top:8px">${k.rod ? esc(ms.length ? KT.incomplete.replace('{what}', ms.join(', ')) : KT.complete) : ''}</div></div>`; }).join('');
  return `<div class="w top"><div class="row"><button class="cb" data-back aria-label="Назад">${ICO.back}</button><button class="pill" data-tedit="${t.id}">${esc(T.reel_card.edit)}</button></div>
  <div class="ey" style="margin-top:14px">${esc(t.region || '')}${t.camp ? ' · ' + esc(t.camp) : ''}</div><h1 class="h1" style="margin-top:6px">${esc(t.river || '—')}</h1><div class="mono mut sm" style="margin-top:6px">${esc(tDates(t))}</div><div style="margin-top:10px"><span class="tst s-${t.status || 'plan'}">${esc(TR.status_values[t.status || 'plan'])}</span></div>
  ${t.notes ? `<div class="card" style="margin-top:14px"><div class="cap">${esc(TR.notes)}</div><div class="sm2" style="margin-top:6px;white-space:pre-wrap">${esc(t.notes)}</div></div>` : ''}
  <div class="cap" style="margin-top:18px">${esc(TR.gear)}</div><div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">${kits}<button class="btn l" data-kadd>${esc(KT.add_kit)}</button></div>
  <button class="lnk" style="margin-top:18px;color:var(--fb)" data-tdel="${t.id}">${esc(TR.delete)}</button></div>`; }
let KP = null;
function kitMulti() { const t = byId('trips', VIEW.id), used = {}; (t.kits || []).forEach((k, i) => { if (k.rod) used[k.rod] = KT.kit_n.replace('{n}', i + 1); }); const n = KP.sel.length, P = KT.create_kits || {};
  const rows = S.rods.map(r => { const u = used[r.id], on = KP.sel.includes(r.id); return `<button class="card row kpr${on ? ' on' : ''}${u ? ' dis' : ''}" ${u ? 'disabled aria-disabled="true"' : `data-kms="${esc(r.id)}"`} role="checkbox" aria-checked="${!!(on || u)}"><span class="kcb${on || u ? ' on' : ''}" aria-hidden="true">${on || u ? '✓' : ''}</span><div style="flex:1;min-width:0;text-align:left"><div class="t sm3">${esc(sname(r))}</div><div class="mut sm">${esc(u || `${r.length || ''} · ${r.class || ''}`)}</div></div></button>`; }).join('');
  return `<div class="fsh-bg" data-kpclose></div><div class="fsh" role="dialog" aria-label="${esc(KT.pick_rods)}"><div class="row"><b>${esc(KT.pick_rods)}</b><button class="lnk" data-kpclose aria-label="Закрыть">✕</button></div><div class="mut sm" style="margin-top:4px">${esc(KT.pick_rods_hint)}</div><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">${rows || '<div class="mut">—</div>'}</div><button class="btn l" style="margin-top:14px;width:100%" data-kmk ${n ? '' : 'disabled'}>${esc(plural(n, P.one, P.few, P.many).replace('{n}', n))}</button></div>`; }
function kitSheet() { if (!KP) return ''; if (KP.multi) return kitMulti(); const t = byId('trips', VIEW.id), k = (t.kits || [])[KP.ki] || {}, rod = k.rod ? byId('rods', k.rod) : null; let rows = '';
  const row = (val, name, st, on, sub = '') => `<button class="card row kpr${on ? ' on' : ''}" data-kpick="${esc(val)}"><div style="flex:1;min-width:0;text-align:left"><div class="t sm3">${esc(name)}</div>${sub ? `<div class="mut sm">${esc(sub)}</div>` : ''}</div>${st ? `<span class="kc kc-${st[0]}">${esc(st[1])}</span>` : ''}${on ? '<b aria-hidden="true">✓</b>' : ''}</button>`;
  if (KP.step === 'rod') rows = S.rods.map(r => row(r.id, sname(r), null, k.rod === r.id, `${r.length || ''} · ${r.class || ''}`)).join('');
  if (KP.step === 'reel') { const ok = rod ? S.reels.filter(x => !x.hand || x.hand === 'both' || x.hand === hand(rod)) : S.reels, rr = rod ? rodReels(rod) : [], lv = x => (rr.find(y => y.x.id === x.id) || {}).lvl;
    rows = ok.slice().sort((a, b) => (lv(a) === 'ok' ? 0 : 1) - (lv(b) === 'ok' ? 0 : 1)).map(x => row(x.id, sname(x), lv(x) === 'ok' ? ['ok', T.rod_card.status_ok || 'подходит'] : null, k.reel === x.id, x.cls ? clsTxt(x.cls) : (x.size || ''))).join(''); }
  if (KP.step === 'line') { const sel = (k.lines || []).map(x => x.key), m = rod ? rodLines(rod) : [], seen = new Set(), C = T.rod_card, SL = {ok: C.status_ok || 'подходит', edge: C.status_edge || 'на границе', fb: C.status_fallback || 'запасной'};
    rows = m.map(x => { const key = x.l.id + (x.m.tip ? '|' + (x.m.tip.name || '') : ''); seen.add(x.l.id); const s = stOf(x.m); return row(key, comboTxt(x.l, x.m), [s, SL[s]], sel.includes(key), x.m.v != null ? fg(x.m.v) + ' ' + (x.m.u || '') : ''); }).join('')
      + S.lines.filter(l => !seen.has(l.id) && !isBody(l)).map(l => row(l.id, sname(l), null, sel.includes(l.id), TL(l.type))).join(''); }
  return `<div class="fsh-bg" data-kpclose></div><div class="fsh" role="dialog" aria-label="${esc(KT['step_' + KP.step])}"><div class="row"><b>${esc(KT['step_' + KP.step])}</b><button class="lnk" data-kpclose aria-label="Закрыть">${KP.step === 'line' ? '✓' : '✕'}</button></div>${KP.step !== 'rod' && rod ? `<div class="mut sm" style="margin-top:4px">${esc(KT.suited_first)} · ${esc(sname(rod))}</div>` : ''}<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">${rows || '<div class="mut">—</div>'}</div>${(KP.step === 'rod' && k.rod) || (KP.step === 'reel' && k.reel) || (KP.step === 'line' && (k.lines || []).length) ? `<button class="lnk" style="margin-top:14px;color:var(--fb)" data-kclear>${esc(KT.remove)}</button>` : ''}</div>`; }
function kitPick(v) { const t = byId('trips', VIEW.id), k = t.kits[KP.ki];
  if (KP.step === 'rod') { if (k.rod !== v) { k.rod = v; const r = byId('rods', v); if (k.reel) { const x = byId('reels', k.reel); if (x.hand && x.hand !== 'both' && x.hand !== hand(r)) k.reel = null; } } KP = null; }
  else if (KP.step === 'reel') { k.reel = k.reel === v ? null : v; KP = null; }
  else { k.lines = k.lines || []; const i = k.lines.findIndex(x => x.key === v); if (i >= 0) k.lines.splice(i, 1); else k.lines.push({key: v, id: v.split('|')[0], tip: v.split('|')[1] || null}); }
  save(); render(); }
let TD = null;
function tform(v) { const d = TD, F = T.forms, reg = TR.regions.includes(d.region) || !d.region ? d.region : '__other';
  return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(F.cancel)}">✕</button><span></span><button class="lnk ac" data-tsave>${esc(TR.save)}</button></div><h1 class="h1" style="margin-top:16px">${esc(v.id ? T.reel_card.edit : TR.add)}</h1>
  <form id="tfm" style="display:flex;flex-direction:column;gap:10px;margin-top:14px" onsubmit="return false"><div class="g2"><label class="f"><small>${esc(TR.date_from)}</small><input name="from" type="date" value="${esc(d.from || '')}"></label><label class="f"><small>${esc(TR.date_to)}</small><input name="to" type="date" value="${esc(d.to || '')}"></label></div>
  ${FL(TR.river, 'river', d.river)}<div class="cap">${esc(TR.region)}</div><div class="seg wrap" data-tseg="region">${TR.regions.map(r => `<button type="button" data-v="${esc(r)}" class="${reg === r ? 'on' : ''}">${esc(r)}</button>`).join('')}<button type="button" data-v="__other" class="${reg === '__other' ? 'on' : ''}">${esc(TR.region_other)}</button></div>${reg === '__other' ? FL(TR.region, 'region_txt', TR.regions.includes(d.region) ? '' : d.region === '__other' ? '' : d.region) : ''}
  ${FL(TR.camp, 'camp', d.camp)}<div class="cap">${esc(TR.status)}</div><div class="seg full" data-tseg="status" style="grid-template-columns:repeat(3,1fr)">${Object.entries(TR.status_values).map(([k, l]) => `<button type="button" data-v="${k}" class="${(d.status || 'plan') === k ? 'on' : ''}"><span>${esc(l)}</span></button>`).join('')}</div>
  <label class="f"><small>${esc(TR.notes)}</small><textarea name="notes" rows="4" placeholder="${esc(TR.notes_hint)}">${esc(d.notes || '')}</textarea></label><button class="btn" type="button" data-tsave style="margin-top:10px">${esc(TR.save)}</button></form></div>`; }
function tRead() { document.querySelectorAll('#tfm [name]').forEach(i => TD[i.name] = i.value.trim()); if (TD.region === '__other' && TD.region_txt != null) TD.region_x = TD.region_txt; }
function tSave() { tRead(); const d = TD; if (!d.from || !d.river) return toast(T.forms.required); if (!d.to || d.to < d.from) d.to = d.from;
  const o = {from: d.from, to: d.to, river: d.river, region: d.region === '__other' ? (d.region_txt || '') : (d.region || ''), camp: d.camp || '', status: d.status || 'plan', notes: d.notes || ''};
  const i = S.trips.findIndex(x => x.id === d.id); let id = d.id; if (i >= 0) S.trips[i] = {...S.trips[i], ...o}; else { id = 'trip:' + uid(); S.trips.push({id, kits: [], ...o}); }
  save(); toast(T.forms.saved); TD = null; VIEW = {t: 'trip', id, root: 'trips'}; HIST.length = 0; HIST.push({...tabView('trips'), m: o.from.slice(0, 7)}); render(); }
/* ---------- добавление по шагам ---------- */
function addStep() { return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(T.forms.cancel)}">✕</button><span class="mono mut sm">шаг 1 из 2</span><span style="width:44px"></span></div><div class="prog"><i style="width:50%"></i></div>
  <h1 class="h1" style="margin-top:16px">Что добавляем?</h1><div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">${[['rods', T.forms.rod.title, T.forms.rod.hint], ['lines', T.forms.line.title, T.forms.line.hint], ['lphoto', LP.button, LP.hint], ['reels', T.forms.reel.title, T.forms.reel.hint]].map(([k, t, s]) => `<button class="card row kind" ${k === 'lphoto' ? 'data-lphoto' : `data-new="${k}"`}>${icoBox(k)}<div style="flex:1;text-align:left"><div class="t">${esc(t)}</div><div class="mut sm2">${esc(s)}</div></div><span class="chev" aria-hidden="true">›</span></button>`).join('')}</div></div>`; }
const FL = (lbl, n, v, t = 'text', extra = '') => `<label class="f"><small>${esc(lbl)}</small><input name="${n}" value="${esc(v ?? '')}" type="text" ${t === 'text' ? 'autocomplete="off"' : 'inputmode="decimal" enterkeyhint="next" class="mono"'} ${extra}></label>`;
const segF = (n, opts, v) => `<div class="seg wrap" data-seg="${n}">${opts.map(([k, t]) => `<button type="button" data-v="${k}" class="${v === k ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>`;
let DRAFT = null;
function form(v) { const k = v.k, x = DRAFT, F = T.forms; const ttl = v.id ? T.rod_card.edit : F[k === 'rods' ? 'rod' : k === 'reels' ? 'reel' : 'line'].title;
  let b = '';
  if (k === 'rods') b = `${segF('type', [['single', 'Одноручка'], ['double', 'Двуручка'], ['switch', 'Свитч']], x.type)}${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}<div class="g2">${FL('Длина, например 13\'2"', 'length', x.length)}${FL(F.rod.class, 'class', x.class)}</div>
    <div class="g2">${FL(F.rod.scandi_from || 'Scandi от, г', 'sc_lo', x.scandi_g?.lo, 'number')}${FL(F.rod.scandi_to || 'Scandi до, г', 'sc_hi', x.scandi_g?.hi, 'number')}${FL(F.rod.skagit_from || 'Skagit от, gr', 'sk_lo', rw(x, 'skagit')?.lo, 'number')}${FL(F.rod.skagit_to || 'Skagit до, gr', 'sk_hi', rw(x, 'skagit')?.hi, 'number')}</div><div class="mut sm2">${esc(F.rod.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'reels') b = `${FL('Производитель', 'brand', x.brand)}${FL(F.reel.model, 'model', x.model)}<div class="g2">${FL('Класс от, #', 'c_lo', x.cls?.[0], 'number')}${FL('Класс до, #', 'c_hi', x.cls?.[1], 'number')}</div>${FL('Размер / модель', 'size', x.size)}${FL('Тормоз', 'drag', x.drag)}<div class="cap">${esc(F.reel.fits)}</div>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand)}<div class="mut sm2">${esc(F.reel.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  if (k === 'lines') b = `<div class="cap">${esc(F.line.type)}</div>${segF('type', [['full', TL('full')], ['scandi', 'Scandi'], ['skagit', 'Skagit'], ['integrated', TL('integrated')], ['running', TL('running')], ['tip', 'Сменный конец']], x.type)}
    <div class="cap">Для каких удилищ</div>${segF('hand', [['single', T.tabs.single], ['double', T.tabs.double], ['both', T.tabs.both]], x.hand || 'double')}${FL('Производитель', 'brand', x.brand)}${FL('Модель', 'model', x.model)}
    <div class="cap">${esc(F.line.weight || '')}</div><div class="g2">${FL('Вес, г', 'w_g', x.w_g, 'number')}${FL('Вес, грейны', 'w_gr', x.w_gr, 'number')}${FL(F.line.length, 'length', x.length)}${FL('Класс (для полного шнура)', 'class', x.class)}</div>${FL(F.line.floating, 'float', x.float)}
    <div class="row" style="padding:6px 2px"><b>${esc(F.line.has_tips)}</b><button type="button" class="sw ${x.has_tips ? 'on' : ''}" id="htips" role="switch" aria-checked="${!!x.has_tips}" aria-label="${esc(F.line.has_tips)}"></button></div>
    ${x.has_tips ? `<div class="hs">${(x.tips || []).map((t, i) => `<div class="tipc" style="width:160px"><input data-tip="${i}" data-f="name" placeholder="Название" value="${esc(t.name || '')}" style="font-weight:700"><input data-tip="${i}" data-f="w_g" placeholder="${esc(F.tip.weight)}" inputmode="decimal" aria-label="${esc(F.tip.weight)}" value="${esc(t.w_g ?? '')}"><input data-tip="${i}" data-f="len_ft" placeholder="${esc(F.tip.length)}" inputmode="decimal" value="${esc(t.len_ft ?? '')}"><input data-tip="${i}" data-f="sink" placeholder="${esc(F.tip.sink)}" value="${esc(t.sink ?? '')}"><button type="button" data-rmtip="${i}" class="mut lnk">убрать</button></div>`).join('')}<button type="button" class="tipc" id="addtip" style="text-align:center">+ ${esc(F.tip.title)}</button></div><div class="mut sm2">${esc(F.tip.hint)}</div>` : ''}<div class="mut sm2">${esc(F.line.hint)}</div>${FL('Примечание', 'note', x.note)}`;
  return `<div class="w top"><div class="row"><button class="cb" data-cancel aria-label="${esc(F.cancel)}">✕</button><span class="mono mut sm">${v.id ? 'правка' : 'шаг 2 из 2'}</span><button class="lnk ac" data-save>${esc(F.save)}</button></div><div class="prog"><i style="width:100%"></i></div><h1 class="h1" style="margin-top:16px">${esc(ttl)}</h1>
  ${k !== 'reels' ? `<div class="card" style="margin-top:14px" id="pv">${preview()}</div>` : ''}
  <form id="fm" style="display:flex;flex-direction:column;gap:10px;margin-top:14px" onsubmit="return false">${b}<button class="btn" type="button" data-save style="margin-top:10px">${esc(F.save)}</button></form></div>`; }
/* превью подбора по черновику — те же правила matchLine */
function preview() { const d = DRAFT, k = VIEW.k; let rows = [];
  if (k === 'lines') { const wg = num(d.w_g) ?? (num(d.w_gr) != null ? num(d.w_gr) / GR : null); if (wg == null && !d.class) return `<div class="cap">Превью подбора</div><div class="mut sm2" style="margin-top:6px">Введите вес, и здесь появятся удилища</div>`;
    const l = {type: d.type || 'scandi', hand: d.hand || 'double', w_g: num(d.w_g) ?? (wg != null ? r1(wg) : null), w_gr: num(d.w_gr) ?? (wg != null ? Math.round(wg * GR) : null), cls: clsOf(d.class), has_tips: !!d.has_tips, tips: d.has_tips ? (d.tips || []) : []};
    rows = S.rods.map(r => ({n: sname(r), m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]); }
  if (k === 'rods') { const R = (a, b) => num(a) != null ? {lo: num(a), hi: num(b) ?? num(a), approx: false} : null, sg = R(d.sc_lo ?? d.scandi_g?.lo, d.sc_hi ?? d.scandi_g?.hi), kr = R(d.sk_lo ?? rw(d, 'skagit')?.lo, d.sk_hi ?? rw(d, 'skagit')?.hi), kg = kr && {lo: kr.lo / GR, hi: kr.hi / GR, approx: false};
    const r = {type: d.type || 'double', cls: clsOf(d.class), scandi_g: sg, skagit_g: kg, scandi_gr: sg && {lo: sg.lo * GR, hi: sg.hi * GR}, skagit_gr: kr};
    if (!sg && !kg && !r.cls) return `<div class="cap">Превью подбора</div><div class="mut sm2" style="margin-top:6px">Введите окна Scandi и Skagit, и здесь появятся шнуры</div>`;
    rows = S.lines.map(l => ({n: sname(l), m: matchLine(r, l)})).filter(x => x.m).sort((a, b) => RANK[a.m.kind] - RANK[b.m.kind]); }
  return `<div class="cap">Превью подбора · ${rows.length}</div>${rows.slice(0, 6).map(x => `<div class="row" style="margin-top:8px;gap:8px"><span class="sm3" style="min-width:0">${esc(x.n)}</span>${chip(stOf(x.m), stLbl(x.m))}</div>`).join('') || '<div class="mut sm2" style="margin-top:6px">Пока ничего не подходит</div>'}${rows.length > 6 ? `<div class="mut sm2" style="margin-top:6px">и ещё ${rows.length - 6}</div>` : ''}`; }
function readForm() { document.querySelectorAll('#fm input[name]').forEach(i => DRAFT[i.name] = i.value.trim()); document.querySelectorAll('#fm [data-tip]').forEach(i => DRAFT.tips[+i.dataset.tip][i.dataset.f] = i.value.trim()); }
function commit() { readForm(); const k = VIEW.k, d = DRAFT; if (!d.model) return toast(T.forms.required);
  const R = (a, b) => num(a) != null ? {lo: num(a), hi: num(b) ?? num(a), approx: false} : null; let o;
  if (k === 'rods') o = {type: d.type || 'double', brand: d.brand, model: d.model, length: d.length, class: d.class, cls: clsOf(d.class), scandi_g: R(d.sc_lo, d.sc_hi), skagit_gr: R(d.sk_lo, d.sk_hi), note: d.note || null}; if (k === 'rods') o.skagit_g = o.skagit_gr && {lo: r1(o.skagit_gr.lo / GR), hi: r1(o.skagit_gr.hi / GR), approx: false};
  if (k === 'rods') { const old = byId('rods', VIEW.id); if (old) { const a = old.scandi_g, b = o.scandi_g; if (a && b && a.lo === b.lo && a.hi === b.hi) { o.scandi_g = a; o.scandi_gr = old.scandi_gr; } else o.scandi_gr = b ? {lo: b.lo * GR, hi: b.hi * GR} : null;
    const ka = rw(old, 'skagit'), kb = o.skagit_gr; if (ka && kb && ka.lo === kb.lo && ka.hi === kb.hi) { o.skagit_g = old.skagit_g; o.skagit_gr = old.skagit_gr; } } else o.scandi_gr = o.scandi_g ? {lo: o.scandi_g.lo * GR, hi: o.scandi_g.hi * GR} : null; }
  if (k === 'reels') { const lo = num(d.c_lo), hi = num(d.c_hi) ?? lo; o = {brand: d.brand, model: d.model, size: d.size, cls: lo != null ? [lo, hi] : null, drag: d.drag, hand: d.hand || null, note: d.note || null}; }
  if (k === 'lines') { if (d.type !== 'tip' && num(d.w_g) == null && num(d.w_gr) == null) return toast(T.forms.required);
    o = {type: d.type || 'scandi', hand: d.hand || 'double', brand: d.brand, model: d.model, w_g: num(d.w_g) ?? (num(d.w_gr) != null ? r1(num(d.w_gr) / GR) : null), w_gr: num(d.w_gr) ?? (num(d.w_g) != null ? Math.round(num(d.w_g) * GR) : null), length: d.length, class: d.class, cls: clsOf(d.class), float: d.float, has_tips: !!d.has_tips, tips: d.has_tips ? d.tips.filter(t => t.name || t.w_g) : [], note: d.note || null}; }
  const arr = S[k], i = arr.findIndex(y => y.id === VIEW.id);
  if (i >= 0) arr[i] = {...arr[i], ...o, edited: true}; else arr.push({id: 'u:' + uid(), src: 'user', ...o});
  save(); toast(T.forms.saved); DRAFT = null; back(); if (VIEW.t === "add") back(); }
/* ---------- события ---------- */
function bind() {
  app().onclick = async e => { const t = e.target.closest('[data-hint],button,[data-tog]'); if (!t) return; const d = t.dataset;
    if (d.tab === 'profile') return go({t: 'profile', root: VIEW.root});
    if (d.tab) { HIST.length = 0; VIEW = tabView(d.tab); OPEN = null; render(); scrollTo(0, 0); return; }
    if (d.pick) return go({t: 'pick', sel: d.pick, root: 'rods'});
    if (d.go) return go(tabView(d.go));
    if (d.hint) return toast(d.hint, 4000);
    if (d.back != null) return back();
    if (d.add != null) return go({t: 'add', root: VIEW.root || VIEW.t});
    if (d.sel) { VIEW.sel = d.sel; return render(); }
    if (d.reels != null) { VIEW.reels = d.reels === '1'; return render(); }
    if (d.tab2) { VIEW.tab = d.tab2; VIEW.f = {}; VIEW.fo = null; OPEN = null; return render(); }
    if (d.fopen) { VIEW.fo = VIEW.fo === d.fopen ? null : d.fopen; return render(); }
    if (d.fclose != null && !t.closest('.fsh .fvals')) { VIEW.fo = null; return render(); }
    if (d.srt) { const [m, v] = d.srt.split(':'), k = VIEW.k, o = {...(SORT[k] || {d: 'asc', f: 'class'})}; o[m] = v; SORT = {...SORT, [k]: o}; try { localStorage.setItem('ff_sort', JSON.stringify(SORT)); } catch (e) {} VIEW.fo = null; OPEN = null; return render(); }
    if (d.fk) { VIEW.f = {...(VIEW.f || {}), [d.fk]: d.fv || null}; VIEW.fo = null; OPEN = null; return render(); }
    if (d.freset != null) { VIEW.f = {}; VIEW.fo = null; return render(); }
    if (d.rset) { const [k, v] = d.rset.split(':'); return reelSet(VIEW.id, k, v); }
    if (d.tog) { OPEN = OPEN === d.tog ? null : d.tog; return render(); }
    if (d.open) { const [k, ...id] = d.open.split(':'); if (k === 'trip') { KP = null; return go({t: 'trip', id: id.join(':'), root: 'trips'}); } return go({t: k, id: id.join(':'), root: VIEW.root || VIEW.t}); }
    if (d.new) { const tab = VIEW.tab || 'double'; DRAFT = {tips: [], type: d.new === 'lines' ? 'scandi' : d.new === 'rods' ? tab : undefined, hand: d.new === 'reels' ? null : d.new === 'lines' ? tab : undefined}; return go({t: 'form', k: d.new, root: VIEW.root || 'rods'}); }
    if (d.edit) { const [k, ...id] = d.edit.split(':'); const x = byId(k, id.join(':')); DRAFT = JSON.parse(JSON.stringify(x)); DRAFT.tips = DRAFT.tips || []; return go({t: 'form', k, id: x.id, root: VIEW.root || 'rods'}); }
    if (d.del) { if (!confirm(T.forms.confirm_delete)) return; const [k, ...id] = d.del.split(':'); const i = id.join(':'); S[k] = S[k].filter(x => x.id !== i); if (i.startsWith('sheet:')) S.deleted.push(i); save(); toast(T.forms.deleted); return back(); }
    if (d.cancel != null) { DRAFT = null; return back(); }
    if (d.save != null) return commit();
    if (d.v && t.parentElement.dataset.seg) { readForm(); DRAFT[t.parentElement.dataset.seg] = d.v; return render(); }
    if (t.id === 'htips') { readForm(); DRAFT.has_tips = !DRAFT.has_tips; return render(); }
    if (t.id === 'addtip') { readForm(); DRAFT.tips.push({}); return render(); }
    if (d.rmtip) { readForm(); DRAFT.tips.splice(+d.rmtip, 1); return render(); }
    if (t.id === 'ton') { const tok = $('#tok').value.trim(); if (!tok) return; try { const r = await fetch(`https://api.github.com/repos/${DATA_REPO}`, {headers: ghH(tok)}); if (!r.ok) throw new Error(r.status === 404 ? 'нет доступа к репозиторию' : 'GitHub ' + r.status); S.sync = {token: tok, last: 0}; await save(true); render(); syncNow(true); } catch (err) { toast('Не удалось: ' + err.message); } return; }
    if (d.tm) { VIEW.m = d.tm; return render(); }
    if (d.tnew != null) { TD = {status: 'plan'}; return go({t: 'tform', root: 'trips'}); }
    if (d.tedit) { TD = JSON.parse(JSON.stringify(byId('trips', d.tedit))); return go({t: 'tform', id: d.tedit, root: 'trips'}); }
    if (d.tsave != null) return tSave();
    if (d.tdel) { if (!confirm(TR.delete_confirm)) return; S.trips = S.trips.filter(x => x.id !== d.tdel); save(); toast(T.forms.deleted); return back(); }
    if (d.v && t.parentElement.dataset.tseg) { tRead(); TD[t.parentElement.dataset.tseg] = d.v; return render(); }
    if (d.bflip) { const l = byId('lines', d.bflip); if (l) { const b = bParse(l.float).reverse(), m = bMerge(b); l.float = m.join('/'); if (m.length < b.length) toast(BT.err_repeat); save(); } return render(); }
    if (d.kadd != null) { KP = {multi: true, sel: []}; return render(); }
    if (d.kms) { const i = KP.sel.indexOf(d.kms); i >= 0 ? KP.sel.splice(i, 1) : KP.sel.push(d.kms); return render(); }
    if (d.kmk != null) { const x = byId('trips', VIEW.id); x.kits = x.kits || []; KP.sel.forEach(r => x.kits.push({rod: r, reel: null, lines: []})); KP = null; save(); return render(); }
    if (d.krm) { const x = byId('trips', VIEW.id), i = +d.krm, kn = KT.kit_n.replace('{n}', i + 1); if (!confirm((KT.delete_kit_confirm || '').replace('{name}', kn))) return; x.kits.splice(i, 1); save(); toast(T.forms.deleted); return render(); }
    if (d.kslot) { const [ki, step] = d.kslot.split(':'); KP = {ki: +ki, step}; return render(); }
    if (d.kpick) return kitPick(d.kpick);
    if (d.kclear != null) { const x = byId('trips', VIEW.id), k = x.kits[KP.ki]; if (KP.step === 'rod') k.rod = null; else if (KP.step === 'reel') k.reel = null; else k.lines = []; KP = null; save(); return render(); }
    if (d.kpclose != null) { KP = null; return render(); }
    if (d.addline != null) { ALH = {}; return render(); }
    if (d.alclose != null) { ALH = null; return render(); }
    if (d.alo) { ALH = null; if (d.alo === 'photo') { LPH = {}; return render(); } DRAFT = {ltype: 'scandi', hand: VIEW.tab || 'double', bn: '1', bz: []}; return go({t: 'lform', root: 'lines'}); }
    if (d.alsave != null) return alSave();
    if (d.v && t.parentElement.dataset.alseg) { alRead(); const n = t.parentElement.dataset.alseg; if (t.parentElement.dataset.multi) { const a = DRAFT[n] || []; DRAFT[n] = a.includes(d.v) ? a.filter(x => x !== d.v) : [...a, d.v]; } else DRAFT[n] = d.v; return render(); }
    if (d.lphoto != null) { LPH = {}; return render(); }
    if (d.lpclose != null) { LPH = null; if (d.tab) return go(tabView(d.tab)); return render(); }
    if (t.id === 'lps') return lpSend();
    if (t.id === 'syn') return syncNow(true);
    if (t.id === 'toff') { S.sync = {token: '', last: 0}; await save(true); return render(); }
    if (t.id === 'lock') { KEY = S = null; pinMode = 'unlock'; return renderPin(); }
  };
  document.querySelectorAll('select[data-bz]').forEach(e => e.onchange = () => { alRead(); const i = +e.dataset.bz, z = (DRAFT.bz || []).slice(); z[i] = e.value || undefined; for (let j = i + 1; j < z.length; j++) if (!z[j] || !z[j - 1] || bIdx(z[j]) <= bIdx(z[j - 1])) z[j] = undefined; DRAFT.bz = z; render(); });
  const lpf = $('#lpf'); if (lpf) lpf.onchange = async () => { const f = lpf.files[0]; if (!f) return; try { LPH.note = ($('#lpn') || {}).value || ''; LPH.img = await lpShrink(f); render(); } catch (e) { toast(e.message); } };
  const lfm = $('#lfm'); if (lfm) lfm.oninput = () => { alRead(); const e = $('#alauto'); if (e) e.textContent = alAuto(DRAFT); };
  const fm = $('#fm'), pv = $('#pv'); if (fm && pv) fm.oninput = () => { readForm(); pv.innerHTML = preview(); };
}
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); } });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S?.sync?.token) syncNow(); });
window.__ff = {tSaveTest: o => { const id = 'trip:' + uid(); S.trips.push({id, kits: [], ...o}); return id; }, matchLine, mergeSeed, rodLines: r => rodLines(r), rodReels: r => rodReels(r), get S() { return S; }};
boot();

;(()=>{let on=false;const u=()=>{const v=scrollY>24;if(v!==on){on=v;document.body.classList.toggle('scd',v)}};addEventListener('scroll',u,{passive:true});u()})();
