// Zen Essentials Folders
// Группировка «Важных» (Essentials) Zen по плиткам-папкам.
//
// Мод ничего не переносит и не удаляет: он только рисует плитки-папки рядом с
// иконками, прячет содержимое свёрнутой папки и меняет порядок отображения.
// Вкладки остаются настоящими вкладками Zen, поэтому работают Ctrl+W
// (выгрузка), перетаскивание и клик-загрузка.
//
// Папки можно вкладывать друг в друга (любая глубина), переставлять
// перетаскиванием, а плитки сайтов — перетаскивать между папками и менять
// местами внутри папки.
//
// Перетаскивание переносит ровно ту вкладку, которую тянули: для адресов
// с путём («github.com/owner/repo») в папке появляется точечное правило,
// а общее правило домена в прежней папке остаётся — остальные вкладки
// домена остаются на своих местах.
//
// Данные папок лежат в prefs и переживают перезапуск:
//   zen.essentialsfolders.folders   — JSON: [{id,name,color,icon,parentId,sites:[]}]
//   zen.essentialsfolders.collapsed — JSON: [id, ...]

(() => {
  "use strict";

  // Мод могут загрузить дважды: Zen/Sine подставляет скрипты и при старте,
  // и при перезагрузке модов. Второй экземпляр должен убрать первый,
  // иначе в панели появятся две строки поиска и два набора плиток.
  const INSTANCE_KEY = "__zenEssentialsFolders";
  try {
    window[INSTANCE_KEY]?.uninstall?.();
  } catch (e) {}
  window[INSTANCE_KEY] = null;

  /* ------------------------------------------------------------------ *
   * Настройки
   * ------------------------------------------------------------------ */

  const PREF_FOLDERS = "zen.essentialsfolders.folders";
  const PREF_COLLAPSED = "zen.essentialsfolders.collapsed";
  const PREF_ORDER = "zen.essentialsfolders.order";
  const PREF_SHOW_NAMES = "zen.essentialsfolders.show-names";
  const PREF_SHOW_COUNT = "zen.essentialsfolders.show-count";
  const PREF_SHOW_SEARCH = "zen.essentialsfolders.show-search";
  const PREF_ICON_SIZE = "zen.essentialsfolders.icon-size";
  const PREF_TAB_ICON_SIZE = "zen.essentialsfolders.tab-icon-size";

  const DEFAULT_ICON_SIZE = "26px";
  const DEFAULT_TAB_ICON_SIZE = "18px";

  /* ------------------------------------------------------------------ *
   * Настройки мода
   *
   * Старые настройки живут отдельными префами — их страница в Zen жива,
   * и пользователь может менять их там. Новые настройки хранятся в одном
   * префе с JSON: так в about:config не появляется двадцать строк.
   *
   * legacy — имя старого префа, если настройка была и раньше.
   * ------------------------------------------------------------------ */

  const PREF_SETTINGS = "zen.essentialsfolders.settings";


  /* ------------------------------------------------------------------ *
   * Язык интерфейса
   *
   * Английский — по умолчанию: мод публичный, и английский читает весь мир.
   * Русский включается настройкой «Interface language» и переключается без
   * перезапуска Zen.
   * ------------------------------------------------------------------ */

  const STRINGS = {
    "group.language": { en: "Language", ru: "Язык" },
    "group.tiles": { en: "Folder tiles", ru: "Плитки папок" },
    "group.grid": { en: "Icon grid", ru: "Сетка иконок" },
    "group.indicators": { en: "Indicators", ru: "Индикаторы" },
    "group.behaviour": { en: "Behaviour", ru: "Поведение" },

    "set.lang": { en: "Interface language", ru: "Язык интерфейса" },
    "lang.en": { en: "English", ru: "English" },
    "lang.ru": { en: "Русский", ru: "Русский" },

    "set.tileHeight": { en: "Tile height", ru: "Высота плитки" },
    "set.tileMinWidth": { en: "Minimum tile width", ru: "Минимальная ширина плитки" },
    "set.folderIconSize": { en: "Folder icon size", ru: "Размер иконки папки" },
    "set.showNames": { en: "Show folder names", ru: "Показывать названия папок" },
    "set.showCount": { en: "Show tab counters", ru: "Показывать количество вкладок" },
    "set.countStyle": { en: "Counter on the tile", ru: "Счётчик на плитке" },
    "set.tilesRow": { en: "Folder tiles in the panel", ru: "Плитки папок в панели" },
    "set.showPlus": { en: "Show the \u201c+\u201d button", ru: "Показывать кнопку \u00ab+\u00bb" },
    "set.nestedMarker": { en: "Nested folder marker", ru: "Значок вложенной папки" },

    "set.iconStep": { en: "Icon step inside a folder", ru: "Шаг иконок в папке" },
    "set.iconSize": { en: "Logo size in Essentials", ru: "Размер логотипа в \u00abВажных\u00bb" },
    "set.tabIconSize": { en: "Tab icon size in the sidebar", ru: "Размер иконки вкладки сбоку" },
    "set.planeAir": { en: "Space below the plane", ru: "Воздух под плоскостью" },
    "set.blockGap": { en: "Gap between folders", ru: "Зазор между папками" },

    "set.activeStyle": { en: "Active folder indicator", ru: "Индикатор активной папки" },
    "set.pulse": { en: "Indicator pulse", ru: "Пульсация индикатора" },
    "set.pulseSpeed": { en: "Pulse speed", ru: "Скорость пульсации" },
    "set.unloadStyle": { en: "Unloaded tab marker", ru: "Метка выгруженной вкладки" },

    "set.showSearch": { en: "Show the search bar", ru: "Показывать строку поиска" },
    "set.hints": { en: "Hints on a failed drop", ru: "Подсказки при неудачном броске" },
    "set.freshOnTop": { en: "Newest folder on top", ru: "Свежая папка сверху" },

    "opt.badge": { en: "Badge (as now)", ru: "Бейдж (как сейчас)" },
    "opt.dot": { en: "Dot", ru: "Точка" },
    "opt.hidden": { en: "Hidden", ru: "Не показывать" },
    "opt.strip": { en: "Separate strip", ru: "Отдельной полосой" },
    "opt.grid": { en: "In the shared grid", ru: "В общей сетке" },
    "opt.chevron": { en: "Chevron \u201c\u203a\u201d", ru: "Шеврон \u00ab\u203a\u00bb" },
    "opt.noMarker": { en: "No marker", ru: "Без значка" },
    "opt.glow": { en: "Soft glow", ru: "Мягкое свечение" },
    "opt.corner": { en: "Corner", ru: "Уголок" },
    "opt.zenBadge": { en: "Zen badge", ru: "Значок Zen" },
    "opt.off": { en: "Off", ru: "Выключить" },
    "opt.frame": { en: "Frame", ru: "Рамка" },
    "opt.dashed": { en: "Dashed", ru: "Пунктир" },
    "opt.line": { en: "Line", ru: "Линия" },
    "opt.dimmed": { en: "Dimmed", ru: "Приглушение" },

    "unit.ms": { en: "ms", ru: "мс" },

    "search.placeholder": { en: "Search folders\u2026", ru: "Поиск по папкам\u2026" },
    "search.clear": { en: "Clear search", ru: "Очистить поиск" },
    "search.empty": { en: "Nothing found: \u00ab{query}\u00bb", ru: "Ничего не найдено: \u00ab{query}\u00bb" },
    "settings.title": { en: "Mod settings", ru: "Настройки мода" },
    "settings.reset": { en: "Reset", ru: "Сбросить" },
    "settings.close": { en: "Close", ru: "Закрыть" },

    "folder.unnamed": { en: "Unnamed", ru: "Без названия" },
    "folder.new": { en: "New folder", ru: "Новая папка" },
    "folder.plural": { en: "Folder", ru: "Папка" },
    "folder.rename": { en: "Rename\u2026", ru: "Переименовать\u2026" },
    "folder.icon": { en: "Change icon\u2026", ru: "Сменить иконку\u2026" },
    "folder.color": { en: "Change colour\u2026", ru: "Сменить цвет\u2026" },
    "folder.nest": { en: "Nest inside a folder\u2026", ru: "Вложить в папку\u2026" },
    "folder.topLevel": { en: "Move to the top level", ru: "Вынести на верхний уровень" },
    "folder.sites": { en: "Folder sites\u2026", ru: "Сайты папки\u2026" },
    "folder.delete": { en: "Delete folder", ru: "Удалить папку" },
    "folder.expand": { en: "Expand", ru: "Развернуть" },
    "folder.collapse": { en: "Collapse", ru: "Свернуть" },
    "folder.openAll": { en: "Open all tabs in this folder", ru: "Открыть все вкладки папки" },
    "folder.pin": { en: "Pin to the top", ru: "Закрепить вверху" },
    "folder.unpin": { en: "Unpin from the top row", ru: "Открепить от верхнего ряда" },
    "folder.expandAll": { en: "Expand all folders", ru: "Развернуть все папки" },
    "folder.collapseAll": { en: "Collapse all folders", ru: "Свернуть все папки" },
    "folder.nameLabel": { en: "Folder name", ru: "Название папки" },
    "folder.namePlaceholder": { en: "Folder name\u2026", ru: "Название папки\u2026" },
    "folder.renameHint": { en: "Double-click to rename", ru: "Двойной клик — переименовать" },
    "folder.iconButton": { en: "Change icon", ru: "Сменить иконку" },
    "folder.sitesLabel": { en: "Sites in this folder", ru: "Сайты в папке" },
    "folder.rulePlaceholder": { en: "add a domain and press Enter", ru: "добавить домен и Enter" },
    "folder.exclusion": { en: "exclusion {rule}", ru: "исключение {rule}" },
    "folder.dragType": { en: "folder", ru: "папка" },
    "folder.save": { en: "Save", ru: "Сохранить" },
    "folder.cancel": { en: "Cancel", ru: "Отмена" },
    "folder.remove": { en: "Remove", ru: "Удалить" },
    "folder.random": { en: "Random", ru: "Случайный" },
    "folder.randomTitle": { en: "Random shade", ru: "Случайный оттенок" },
    "folder.hexTitle": { en: "Exact colour code", ru: "Точный код цвета" },
    "folder.saveFailed":
      {
        en: "Could not save: the folder list no longer fits in the Zen preferences. "
          + "The colour is applied now, but the previous one comes back after a restart.",
        ru: "Не удалось сохранить: список папок не помещается в настройки Zen. "
          + "Цвет применён сейчас, но после перезапуска вернётся прежний.",
      },

    "menu.intoFolder": { en: "Into a folder", ru: "В папку" },
    "menu.newFolder": { en: "New folder\u2026", ru: "Новая папка\u2026" },
    "menu.modSettings": { en: "Mod settings\u2026", ru: "Настройки мода\u2026" },

    "pinned.withCount":
      {
        en: "Pinned tabs ({count}). Drag here to take a tab out of its folder.",
        ru: "Закреплённые вкладки ({count}). Перетащите сюда, чтобы убрать вкладку из папки.",
      },
    "pinned.plain":
      {
        en: "Pinned tabs. Drag here to take a tab out of its folder.",
        ru: "Закреплённые вкладки. Перетащите сюда, чтобы убрать вкладку из папки.",
      },

    "hint.dragFailed": { en: "Could not tell which tab was dragged", ru: "Не понял, какую вкладку перетащили" },
    "hint.alreadyIn": { en: "This tab is already in \u00ab{name}\u00bb", ru: "Вкладка уже в папке \u00ab{name}\u00bb" },
    "hint.moveFailed": { en: "Could not move the tab", ru: "Не получилось перенести вкладку" },
  };

  /** Текущий язык интерфейса: английский по умолчанию, русский — по выбору. */
  let uiLang = "en";

  /** Строка интерфейса по ключу. {placeholders} подставляются из vars. */
  function t(key, vars) {
    const entry = STRINGS[key];
    if (!entry) {
      return key;
    }
    let text = entry[uiLang] || entry.en || key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.split("{" + name + "}").join(String(value));
      }
    }
    return text;
  }

  const SETTINGS = [
    {
      groupKey: "group.language",
      items: [
        {
          id: "lang",
          labelKey: "set.lang",
          type: "select",
          def: "en",
          options: [
            { value: "en", labelKey: "lang.en" },
            { value: "ru", labelKey: "lang.ru" },
          ],
        },
      ],
    },
    {
      groupKey: "group.tiles",
      items: [
        { id: "tileHeight", labelKey: "set.tileHeight", type: "number", def: 46, min: 36, max: 64, unit: "px" },
        { id: "tileMinWidth", labelKey: "set.tileMinWidth", type: "number", def: 23, min: 12, max: 50, unit: "%" },
        { id: "folderIconSize", labelKey: "set.folderIconSize", type: "number", def: 22, min: 14, max: 34, unit: "px" },
        { id: "showNames", labelKey: "set.showNames", type: "bool", def: true, legacy: PREF_SHOW_NAMES },
        { id: "showCount", labelKey: "set.showCount", type: "bool", def: true, legacy: PREF_SHOW_COUNT },
        {
          id: "countStyle",
          labelKey: "set.countStyle",
          type: "select",
          def: "badge",
          options: [
            { value: "badge", labelKey: "opt.badge" },
            { value: "dot", labelKey: "opt.dot" },
            { value: "none", labelKey: "opt.hidden" },
          ],
        },
        {
          id: "tilesRow",
          labelKey: "set.tilesRow",
          type: "select",
          def: "strip",
          options: [
            { value: "strip", labelKey: "opt.strip" },
            { value: "grid", labelKey: "opt.grid" },
          ],
        },
        { id: "showPlus", labelKey: "set.showPlus", type: "bool", def: true },
        {
          id: "nestedMarker",
          labelKey: "set.nestedMarker",
          type: "select",
          def: "chevron",
          options: [
            { value: "chevron", labelKey: "opt.chevron" },
            { value: "none", labelKey: "opt.noMarker" },
          ],
        },
      ],
    },
    {
      groupKey: "group.grid",
      items: [
        { id: "iconStep", labelKey: "set.iconStep", type: "number", def: 12, min: 6, max: 30, unit: "%" },
        { id: "iconSize", labelKey: "set.iconSize", type: "string", def: "26px", legacy: PREF_ICON_SIZE },
        { id: "tabIconSize", labelKey: "set.tabIconSize", type: "string", def: "18px", legacy: PREF_TAB_ICON_SIZE },
        { id: "planeAir", labelKey: "set.planeAir", type: "number", def: 12, min: 0, max: 40, unit: "px" },
        { id: "blockGap", labelKey: "set.blockGap", type: "number", def: 4, min: 0, max: 24, unit: "px" },
      ],
    },
    {
      groupKey: "group.indicators",
      items: [
        {
          id: "activeStyle",
          labelKey: "set.activeStyle",
          type: "select",
          def: "glow",
          options: [
            { value: "glow", labelKey: "opt.glow" },
            { value: "dot", labelKey: "opt.dot" },
            { value: "corner", labelKey: "opt.corner" },
            { value: "badge", labelKey: "opt.zenBadge" },
            { value: "off", labelKey: "opt.off" },
          ],
        },
        { id: "pulse", labelKey: "set.pulse", type: "bool", def: true },
        { id: "pulseSpeed", labelKey: "set.pulseSpeed", type: "number", def: 1600, min: 600, max: 4000, unitKey: "unit.ms" },
        {
          id: "unloadStyle",
          labelKey: "set.unloadStyle",
          type: "select",
          def: "off",
          options: [
            { value: "frame", labelKey: "opt.frame" },
            { value: "dash", labelKey: "opt.dashed" },
            { value: "dot", labelKey: "opt.dot" },
            { value: "line", labelKey: "opt.line" },
            { value: "dim", labelKey: "opt.dimmed" },
            { value: "off", labelKey: "opt.off" },
          ],
        },
      ],
    },
    {
      groupKey: "group.behaviour",
      items: [
        { id: "showSearch", labelKey: "set.showSearch", type: "bool", def: true, legacy: PREF_SHOW_SEARCH },
        { id: "hints", labelKey: "set.hints", type: "bool", def: true },
        { id: "freshOnTop", labelKey: "set.freshOnTop", type: "bool", def: true },
      ],
    },
  ];

  /** Все настройки со значениями по умолчанию. */
  function defaultSettings() {
    const values = {};
    for (const group of SETTINGS) {
      for (const item of group.items) {
        values[item.id] = item.def;
      }
    }
    return values;
  }

  const DEFAULT_ICON = "chrome://browser/skin/zen-icons/selectable/folder.svg";
  const DEFAULT_COLOR = "#8b5cf6";

  const PALETTE = [
    "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e",
    "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#3b82f6", "#64748b",
  ];

  /* ------------------------------------------------------------------ *
   * Состояние
   * ------------------------------------------------------------------ */

  let folders = [];
  let collapsed = new Set();
  let lastSignature = null;
  let syncTimer = null;
  // Отложенные проверки иконок: favicon часто приезжает уже после того,
  // как панель перестроилась, — тогда на секунду вместо логотипа
  // показывалась буква, и иконка «пропадала».
  let iconRecheckTimer = 0;
  let iconRecheckTimer2 = 0;
  // Короткая подсказка: объясняет, почему бросок не сработал.
  let hintEl = null;
  let hintTimer = 0;
  let observer = null;
  let observedRoot = null;
  let tilePopup = null;
  let dialogPanel = null;
  let settingsPanel = null;
  // Текущие настройки (читаются один раз и обновляются applySettings).
  let settings = defaultSettings();
  // Папка, в которой лежит текущая вкладка — её плитка получает индикатор.
  let activeFolder = null;
  let uninstall = null;
  // Таблица, которую прямо сейчас тянут мышью.
  let draggedTab = null;
  // Была ли перетаскиваемая вкладка «Важной» в момент начала перетаскивания.
  // Zen во время драга может менять атрибуты вкладки — запомним сразу.
  let draggedTabIsEssential = false;
  // Идёт ли сейчас перетаскивание. Пока оно идёт, вёрстку панели трогать нельзя:
  // плитки пересоздаются прямо под курсором, и бросок не срабатывает.
  let dragInProgress = false;
  // Просьба обновить панель, отложенная до конца перетаскивания.
  let pendingSync = false;
  // Папка, которую прямо сейчас тянут мышью.
  let draggedFolderId = null;
  // Раскладка плиток на момент начала перетаскивания. Пока тащат, Zen
  // вставляет в сетку «Важных» пустое место под вкладку, и плитки съезжают —
  // бросок попадает в это место вместо нужной папки. По снимку мы понимаем,
  // куда целился пользователь на самом деле.
  let dragLayout = null;
  // Момент окончания последнего перетаскивания: сразу после броски
  // браузер может прислать «click» — его надо игнорировать, иначе
  // папка лишний раз свернётся.
  let lastDragEnd = 0;
  // Что произошло с последним броском: что тянули, что было под курсором
  // и куда попало. Читается из консоли Zen — с этим разбор «перетаскивание
  // не сработало» не гадание.
  let lastDrop = null;
  // Домен, выбранный в меню «Новая папка…» — попадёт в новую папку сразу.
  let pendingSite = null;
  // Текст поиска по папкам. Пустая строка — поиск выключен.
  let filterText = "";
  // Строка поиска в панели «Важных» и её поле ввода.
  let searchRow = null;
  let searchInput = null;
  // Подсказка «ничего не найдено».
  let emptyHint = null;
  // Цвета, которые не удалось записать в преф (преф переполнен).
  // Пока запись не пройдёт, держим их в памяти — иначе следующая
  // перерисовка вернула бы папке старый цвет.
  const pendingColors = new Map();
  // Наблюдатели за настройками размеров.
  const sizeObservers = [];
  // Слушатели окна — их нужно снять, если мод перезагрузили.
  const windowListeners = [];
  // Правка названия прямо на плитке: папка, поле ввода и прежнее имя.
  let inlineEdit = null;
  // Задержка перед открытием папки кликом по названию: за это время
  // понятно, не будет ли второго клика (двойной клик — это правка).
  const DOUBLE_CLICK_DELAY = 250;

  /** Вешаем слушатель окна и запоминаем его, чтобы потом снять. */
  function onWindow(type, handler, capture = false) {
    window.addEventListener(type, handler, capture);
    windowListeners.push([type, handler, capture]);
  }

  /* ------------------------------------------------------------------ *
   * Префы
   * ------------------------------------------------------------------ */

  function readJSONPref(name, fallback) {
    try {
      const raw = Services.prefs.getStringPref(name, "");
      if (!raw) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (e) {
      return fallback;
    }
  }

  /** Пишет преф. Возвращает false, если запись не прошла
   *  (например, значение не помещается в преф Zen). */
  function writeJSONPref(name, value) {
    try {
      Services.prefs.setStringPref(name, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("[ZEF] cannot write pref", name, e);
      return false;
    }
  }

  function readBoolPref(name, fallback) {
    try {
      return Services.prefs.getBoolPref(name, fallback);
    } catch (e) {
      return fallback;
    }
  }

  function readStringPref(name, fallback) {
    try {
      const value = Services.prefs.getStringPref(name, "");
      return value.trim() || fallback;
    } catch (e) {
      return fallback;
    }
  }

  /** Размеры иконок из настроек мода — в CSS-переменные на :root.
   *  Zen отдаёт такие настройки и сам, но мод применяет их и сам:
   *  так размер работает и без поддержки со стороны Zen. */
  function applySizes() {
    applySettings();
  }

  /* ------------------------------------------------------------------ *
   * Хранилище настроек
   *
   * Старые настройки читаются и пишутся в свои префы (их страница в Zen
   * жива). Остальные — в одном префе с JSON.
   * ------------------------------------------------------------------ */

  /** Текущие значения всех настроек. */
  function readSettings() {
    const stored = readJSONPref(PREF_SETTINGS, {});
    const values = {};
    for (const group of SETTINGS) {
      for (const item of group.items) {
        if (item.legacy) {
          values[item.id] =
            item.type === "bool"
              ? readBoolPref(item.legacy, item.def)
              : readStringPref(item.legacy, item.def);
          continue;
        }
        const value = stored?.[item.id];
        values[item.id] = value === undefined || value === null ? item.def : value;
      }
    }
    return values;
  }

  /** Сохраняет настройки и применяет их. */
  function saveSettings(values) {
    const stored = {};
    for (const group of SETTINGS) {
      for (const item of group.items) {
        const value = values[item.id];
        if (item.legacy) {
          try {
            if (item.type === "bool") {
              Services.prefs.setBoolPref(item.legacy, Boolean(value));
            } else {
              Services.prefs.setStringPref(item.legacy, String(value));
            }
          } catch (e) {}
          continue;
        }
        stored[item.id] = value;
      }
    }
    writeJSONPref(PREF_SETTINGS, stored);
    const previousLang = uiLang;
    applySettings();
    if (uiLang !== previousLang) {
      refreshLanguage();
    }
  }

  /** Применяет настройки: числа — в CSS-переменные, варианты — в классы. */
  function applySettings() {
    const values = readSettings();
    const root = document.documentElement;
    if (!root) {
      return values;
    }
    settings = values;
    uiLang = values.lang === "ru" ? "ru" : "en";
    root.style.setProperty("--zef-tile-height", `${values.tileHeight}px`);
    root.style.setProperty("--zef-tile-min-pct", `${values.tileMinWidth}%`);
    root.style.setProperty("--zef-folder-icon-size", `${values.folderIconSize}px`);
    root.style.setProperty("--zef-icon-step", `${values.iconStep}%`);
    root.style.setProperty("--zef-plane-air", `${values.planeAir}px`);
    root.style.setProperty("--zef-block-gap", `${values.blockGap}px`);
    root.style.setProperty("--zef-pulse-speed", `${values.pulseSpeed}ms`);
    root.style.setProperty("--zef-icon-size", String(values.iconSize));
    root.style.setProperty("--zef-tab-icon-size", String(values.tabIconSize));

    // Стили приходят классами на корне: так их легко переключать целиком.
    root.classList.toggle("zef-active-glow", values.activeStyle === "glow");
    root.classList.toggle("zef-active-dot", values.activeStyle === "dot");
    root.classList.toggle("zef-active-corner", values.activeStyle === "corner");
    root.classList.toggle("zef-active-badge", values.activeStyle === "badge");
    root.classList.toggle("zef-no-pulse", !values.pulse);
    root.classList.toggle("zef-count-dot", values.countStyle === "dot");
    root.classList.toggle("zef-count-none", values.countStyle === "none");
    root.classList.toggle("zef-nested-none", values.nestedMarker === "none");
    root.classList.toggle("zef-unload-dash", values.unloadStyle === "dash");
    root.classList.toggle("zef-unload-dot", values.unloadStyle === "dot");
    root.classList.toggle("zef-unload-line", values.unloadStyle === "line");
    root.classList.toggle("zef-unload-dim", values.unloadStyle === "dim");
    root.classList.toggle("zef-unload-off", values.unloadStyle === "off");
    return values;
  }

  /** Читаем папки из prefs, но сохраняем прежние объекты —
   *  иначе плитки держали бы устаревшие ссылки и правки терялись бы. */
  function readFolders() {
    const stored = readJSONPref(PREF_FOLDERS, []);
    if (!Array.isArray(stored)) {
      return [];
    }
    const previous = new Map(folders.map(folder => [folder.id, folder]));
    const known = new Set(stored.map(raw => raw.id).filter(Boolean));
    return stored.map(raw => {
      const parentId =
        raw.parentId && known.has(raw.parentId) && raw.parentId !== raw.id
          ? raw.parentId
          : null;
      const folder = previous.get(raw.id);
      if (!folder) {
        return {
          id: raw.id,
          name: raw.name || "",
          color: pendingColors.get(raw.id) || raw.color || DEFAULT_COLOR,
          icon: raw.icon || DEFAULT_ICON,
          parentId,
          pinned: Boolean(raw.pinned),
          sites: uniqueRules(raw.sites),
        };
      }
      folder.name = raw.name || "";
      folder.color = pendingColors.get(raw.id) || raw.color || DEFAULT_COLOR;
      folder.icon = raw.icon || DEFAULT_ICON;
      folder.parentId = parentId;
      folder.pinned = Boolean(raw.pinned);
      folder.sites = uniqueRules(raw.sites);
      return folder;
    });
  }

  /** Убрать одинаковые правила: после прежних бросков в папках копились
   *  повторы одного и того же адреса. Совпадение — без учёта регистра,
   *  как и при сопоставлении правила с адресом. */
  function uniqueRules(list) {
    const seen = new Set();
    const out = [];
    for (const item of list || []) {
      const key = isExclusionRule(item)
        ? "!" + normalizeSite(ruleBody(item))
        : normalizeSite(item);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      out.push(item);
    }
    return out;
  }

  /** Папка по id из текущего состояния — плитки хранят ссылки, но вдруг. */
  function folderById(id) {
    return folders.find(folder => folder.id === id) || null;
  }

  /* ------------------------------------------------------------------ *
   * Дерево папок
   * ------------------------------------------------------------------ */

  /** Папки верхнего уровня (без родителя). */
  function rootFolders() {
    return folders.filter(folder => !folder.parentId);
  }

  /** Вложенные папки — их порядок задаёт порядок в общем массиве. */
  function childrenOf(parentId) {
    return folders.filter(folder => folder.parentId === parentId);
  }

  /** Все потомки папки — на любой глубине. */
  function descendantIds(id) {
    const result = [];
    const queue = [id];
    while (queue.length) {
      const current = queue.shift();
      for (const child of childrenOf(current)) {
        result.push(child.id);
        queue.push(child.id);
      }
    }
    return result;
  }

  /** Родитель папки (null — верхний уровень). */
  function parentIdOf(id) {
    const folder = folders.find(item => item.id === id);
    return folder ? folder.parentId || null : null;
  }

  /** Папка не видна: закрыта сама или любой её предок.
   *
   *  Если закрыт родитель, вложенная папка не должна оставаться открытой:
   *  иначе её вкладки выпадают в сетку «Важных» как обычные плитки.
   */
  function isHiddenByCollapse(id) {
    if (collapsed.has(id)) {
      return true;
    }
    let parentId = parentIdOf(id);
    while (parentId) {
      if (collapsed.has(parentId)) {
        return true;
      }
      parentId = parentIdOf(parentId);
    }
    return false;
  }

  /** Глубина папки в дереве. */
  function depthOf(folder) {
    let depth = 0;
    const seen = new Set([folder?.id]);
    let current = folder;
    while (current?.parentId && !seen.has(current.parentId)) {
      seen.add(current.parentId);
      current = folderById(current.parentId);
      depth++;
      if (depth > 32) {
        break;
      }
    }
    return depth;
  }

  /** Является ли candidate самим folder или его потомком. */
  function isSelfOrDescendant(folder, candidate) {
    if (!folder || !candidate) {
      return false;
    }
    if (folder.id === candidate.id) {
      return true;
    }
    const seen = new Set([candidate.id]);
    let current = candidate;
    while (current?.parentId && !seen.has(current.parentId)) {
      if (current.parentId === folder.id) {
        return true;
      }
      seen.add(current.parentId);
      current = folderById(current.parentId);
    }
    return false;
  }

  /** Приводит дерево в порядок: убирает «призрачных» родителей и циклы,
   *  затем пересобирает общий массив обходом дерева. Порядок массива —
   *  это порядок соседей внутри одного уровня. */
  function normalizeTree() {
    const ids = new Set(folders.map(folder => folder.id));
    for (const folder of folders) {
      if (folder.parentId === folder.id || (folder.parentId && !ids.has(folder.parentId))) {
        folder.parentId = null;
      }
    }
    // Циклы: если поднялись в себя — рвём связь.
    for (const folder of folders) {
      const seen = new Set([folder.id]);
      let parent = folder.parentId ? folderById(folder.parentId) : null;
      while (parent) {
        if (seen.has(parent.id)) {
          folder.parentId = null;
          break;
        }
        seen.add(parent.id);
        parent = parent.parentId ? folderById(parent.parentId) : null;
      }
    }
    // Пересобираем массив обходом дерева: родитель → его дети → их дети.
    const children = new Map();
    for (const folder of folders) {
      const key = folder.parentId || "";
      if (!children.has(key)) {
        children.set(key, []);
      }
      children.get(key).push(folder);
    }
    const ordered = [];
    const walk = key => {
      for (const child of children.get(key) || []) {
        ordered.push(child);
        walk(child.id);
      }
    };
    walk("");
    folders = ordered;
  }

  /** Полный путь папки — «Родитель / Папка» — для подсказок. */
  function folderPath(folder) {
    const parts = [];
    const seen = new Set();
    let current = folder;
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      parts.unshift(current.name || t("folder.unnamed"));
      current = current.parentId ? folderById(current.parentId) : null;
    }
    return parts.join(" / ");
  }

  /** Порядок раскрытых папок: сверху — та, что открыли последней. */
  function rememberOpen(id) {
    if (!settings.freshOnTop) {
      return;
    }
    const list = readJSONPref(PREF_ORDER, []).filter(item => item !== id);
    list.unshift(id);
    writeJSONPref(PREF_ORDER, list);
  }

  /** Раскрытые папки верхнего уровня, свежие — сверху. */
  function expandedFolders() {
    const expanded = rootFolders().filter(folder => !collapsed.has(folder.id));
    if (!settings.freshOnTop) {
      // Порядок пользователя: папки стоят так, как он их расставил.
      return expanded;
    }
    const order = readJSONPref(PREF_ORDER, []).filter(id =>
      expanded.some(folder => folder.id === id)
    );
    const rank = new Map(order.map((id, index) => [id, index]));
    return expanded
      .map(folder => ({
        folder,
        rank: rank.has(folder.id) ? rank.get(folder.id) : order.length,
      }))
      .sort((a, b) => a.rank - b.rank)
      .map(item => item.folder);
  }

  /** Ставит папку в новое место: новый родитель + позиция среди соседей.
   *  targetFolder — сосед, рядом с которым встать; before — встать левее. */  function placeFolder(folder, parentId, targetFolder, before) {
    folder.parentId = parentId || null;
    const others = folders.filter(item => item !== folder);
    let index;
    if (targetFolder) {
      index = others.findIndex(item => item.id === targetFolder.id);
      if (index < 0) {
        index = others.length;
      } else if (!before) {
        index += 1;
      }
    } else {
      index = others.length;
    }
    others.splice(Math.max(0, Math.min(others.length, index)), 0, folder);
    folders = others;
    normalizeTree();
  }

  /** Вложить папку внутрь другой (в конец её детей). */
  function nestFolder(source, target) {
    if (!source || !target || source.id === target.id) {
      return false;
    }
    // Нельзя положить папку внутрь самой себя или её потомка.
    if (isSelfOrDescendant(source, target)) {
      return false;
    }
    placeFolder(source, target.id, null, false);
    persist();
    return true;
  }

  /* ------------------------------------------------------------------ *
   * Работа с доменами
   * ------------------------------------------------------------------ */

  function normalizeSite(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^www\./, "");
  }

  /** Правило-исключение: «!example.com/path» — такой адрес в папку не попадает.
   *  Нужно, чтобы одну вкладку можно было вынуть из папки, оставив домен. */
  function isExclusionRule(rule) {
    return String(rule || "").trim().startsWith("!");
  }

  /** Правило без ведущего «!». */
  function ruleBody(rule) {
    const text = String(rule || "").trim();
    return isExclusionRule(text) ? text.slice(1).trim() : text;
  }

  /** Домен правила: «github.com/dano-/zef» → «github.com». */
  function ruleHost(rule) {
    return normalizeSite(ruleBody(rule)).split("/")[0];
  }

  /** Путь адреса без ведущих и завершающих слешей: «/dano-/zef/» → «dano-/zef». */
  function pathOf(url) {
    try {
      const parsed = new URL(url);
      return String(parsed.pathname || "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    } catch (e) {
      return "";
    }
  }

  function hostOf(url) {
    try {
      const parsed = new URL(url);
      const isDefaultPort =
        parsed.port === "" ||
        (parsed.protocol === "https:" && parsed.port === "443") ||
        (parsed.protocol === "http:" && parsed.port === "80");
      return normalizeSite(
        parsed.hostname + (isDefaultPort ? "" : ":" + parsed.port)
      );
    } catch (e) {
      return null;
    }
  }

  /** Правило вида "example.com" — точное совпадение хоста,
   *  правило вида "example.com/path" — совпадение по началу пути.
   *  Правило с пустым путём «example.com/» — только главная страница сайта.
   *  Граница обязательна: «dano-/zef» ловит «dano-/zef/issues»,
   *  но не «dano-/zef2» — иначе одна папка забирала бы чужие сайты. */
  function ruleMatches(rule, url) {
    const normalized = normalizeSite(ruleBody(rule));
    if (!normalized || !url) {
      return false;
    }
    const slash = normalized.indexOf("/");
    if (slash < 0) {
      return hostOf(url) === normalized;
    }
    const ruleHost = normalized.slice(0, slash);
    const rulePath = normalized.slice(slash + 1);
    if (hostOf(url) !== ruleHost) {
      return false;
    }
    // Путь сравниваем без учёта регистра: правило приводится к нижнему
    // регистру, а адрес остаётся как есть — иначе «.../apiKey» и
    // «.../apikey» не совпали бы, и вкладка не попадала бы в папку.
    const urlPath = pathOf(url).toLowerCase();
    if (!rulePath) {
      // «example.com/» — только главная страница, без пути.
      return urlPath === "";
    }
    if (urlPath === rulePath) {
      return true;
    }
    if (!urlPath.startsWith(rulePath)) {
      return false;
    }
    return urlPath[rulePath.length] === "/";
  }

  /** URL вкладки. У выгруженных вкладок currentURI всё равно хранит адрес. */
  function tabUrl(tab) {
    if (!tab) {
      return "";
    }
    const candidates = [];
    try {
      candidates.push(tab.linkedBrowser?.currentURI?.spec);
    } catch (e) {}
    try {
      candidates.push(tab.linkedBrowser?.originalURI?.spec);
    } catch (e) {}
    candidates.push(tab.getAttribute("uri"));
    candidates.push(tab.getAttribute("data-zef-url"));
    for (const candidate of candidates) {
      if (candidate && candidate !== "about:blank") {
        return candidate;
      }
    }
    return "";
  }

  /** Самое «точное» правило папки, которое ловит адрес, и его номер.
   *  Исключения («!…») имеют приоритет: если адрес исключён — папка его
   *  не содержит, даже если правило домена совпадает. */
  function bestRuleMatch(folder, url) {
    let ruleIndex = -1;
    let length = -1;
    const sites = folder?.sites || [];
    for (let i = 0; i < sites.length; i++) {
      const rule = sites[i];
      if (isExclusionRule(rule)) {
        continue;
      }
      if (!ruleMatches(rule, url)) {
        continue;
      }
      const size = normalizeSite(rule).length;
      if (size > length) {
        length = size;
        ruleIndex = i;
      }
    }
    if (ruleIndex < 0) {
      return null;
    }
    for (const rule of sites) {
      if (isExclusionRule(rule) && ruleMatches(rule, url)) {
        return null;
      }
    }
    return { ruleIndex, length };
  }

  /** Папка, которой принадлежит адрес. При равенстве правил побеждает
   *  более глубокая папка — так вложенность работает предсказуемо. */
  function matchFolderForUrl(url) {
    if (!url) {
      return null;
    }
    let best = null;
    let bestLength = -1;
    let bestDepth = -1;
    let bestRuleIndex = -1;
    for (const folder of folders) {
      const match = bestRuleMatch(folder, url);
      if (!match) {
        continue;
      }
      const depth = depthOf(folder);
      if (
        match.length > bestLength ||
        (match.length === bestLength && depth > bestDepth)
      ) {
        best = folder;
        bestLength = match.length;
        bestDepth = depth;
        bestRuleIndex = match.ruleIndex;
      }
    }
    return best ? { folder: best, ruleIndex: bestRuleIndex } : null;
  }

  function folderForUrl(url) {
    return matchFolderForUrl(url)?.folder || null;
  }

  /* ------------------------------------------------------------------ *
   * Точечные правила и исключения
   * ------------------------------------------------------------------ */

  /** Точечное правило для конкретной вкладки: домен + куски пути.
   *  «github.com/dano-/zef» ловит именно этот репозиторий, а не весь
   *  GitHub — сразу после переноса в папку попадает одна вкладка.
   *  У главной страницы сайта пути нет — для неё правило «github.com/». */
  function specificRuleFor(url) {
    const host = hostOf(url);
    if (!host) {
      return null;
    }
    const path = pathOf(url);
    if (!path) {
      return host + "/";
    }
    const parts = path.split("/").filter(Boolean).slice(0, 3);
    if (!parts.length) {
      return host + "/";
    }
    const rule = host + "/" + parts.join("/");
    return rule.length > 120 ? host + "/" + parts[0] : rule;
  }

  /** Есть ли у папки правило на этот домен. */
  function hasHostRule(list, host) {
    for (const item of list) {
      if (!isExclusionRule(item) && ruleHost(item) === host) {
        return true;
      }
    }
    return false;
  }

  /** Остались ли в папке другие вкладки этого домена. Если да — домен
   *  остаётся в папке, а уходит только та вкладка, которую унесли. */
  function hasOtherTabsForHost(folder, host, url) {
    const container = getContainer();
    if (!container) {
      return false;
    }
    for (const tab of essentialTabs(container)) {
      const other = tabUrl(tab);
      if (!other || other === url) {
        continue;
      }
      if (hostOf(other) !== host) {
        continue;
      }
      const match = matchFolderForUrl(other);
      if (match && match.folder.id === folder.id) {
        return true;
      }
    }
    return false;
  }

  /** Добавить исключение: «!example.com/path» — такой адрес в папку не попадёт. */
  function addExclusion(folder, rule) {
    const body = normalizeSite(ruleBody(rule));
    if (!body) {
      return;
    }
    folder.sites = folder.sites || [];
    const marker = "!" + body;
    if (!folder.sites.some(item => normalizeSite(item) === marker)) {
      folder.sites.push(marker);
    }
  }

  /** Убрать исключения, которые мешают адресу попасть в папку. */
  function removeExclusionsFor(folder, url) {
    const sites = folder.sites || [];
    const before = sites.length;
    folder.sites = sites.filter(item => {
      if (!isExclusionRule(item)) {
        return true;
      }
      return !ruleMatches(item, url);
    });
    return folder.sites.length !== before;
  }

  /** Убрать правило домена из папки (точечные правила домена остаются). */
  function removeHostRule(folder, host) {
    const sites = folder.sites || [];
    const before = sites.length;
    folder.sites = sites.filter(item => {
      if (isExclusionRule(item)) {
        return true;
      }
      return normalizeSite(ruleBody(item)) !== host;
    });
    return folder.sites.length !== before;
  }

  /* ------------------------------------------------------------------ *
   * DOM Zen
   * ------------------------------------------------------------------ */

  function getContainer() {
    let container = null;
    try {
      container = gZenWorkspaces?.getCurrentEssentialsContainer() || null;
    } catch (e) {}
    if (!container) {
      container =
        document.querySelector('.zen-essentials-container:not([hidden="true"])') ||
        document.querySelector(".zen-essentials-container");
    }
    if (container) {
      // Помечаем контейнер, в котором реально живут плитки: по этой
      // метке CSS понимает, где ограничивать высоту панели, чтобы
      // она не закрывала список вкладок снизу.
      container.classList.add("zef-host");
    }
    return container;
  }

  /** Сколько пикселей прокрутки в этом событии колеса. */
  function wheelDelta(event, container) {
    let delta = event.deltaY;
    if (event.deltaMode === 1) {
      // Строки — переводим в пиксели (шаг строки в Firefox ~ 16 px).
      delta = delta * 16;
    } else if (event.deltaMode === 2) {
      // Страницы — прокручиваем на целый экран.
      delta = delta * (container?.clientHeight || 400);
    }
    return delta;
  }

  /** Крутит ближайшего прокручиваемого предка (список вкладок),
   *  если он ещё может прокрутиться. Возвращает true, если
   *  что-то прокрутилось. */
  function scrollAncestor(from, delta) {
    let el = from?.parentElement || null;
    while (el) {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 1) {
        // Контейнеры с обрезанным содержимым (overflow:hidden) трогать
        // нельзя: прокрутка такого бокса сдвинет картинку, а не список
        // вкладок.
        const overflow = getComputedStyle(el).overflowY;
        if (overflow !== "hidden" && overflow !== "clip") {
          const before = el.scrollTop;
          el.scrollTop = Math.min(max, Math.max(0, before + delta));
          if (Math.abs(el.scrollTop - before) > 0.5) {
            return true;
          }
        }
      }
      el = el.parentElement;
    }
    return false;
  }

  /** Колесо мыши над панелью папок прокручивает саму панель.
   *
   *  Zen перехватывает прокрутку в сайдбаре, поэтому обычное колесо
   *  над плитками никуда не ведёт. Ставим свой обработчик на окно
   *  (capture — он срабатывает раньше Zen): пока панель ещё может
   *  прокручиваться, гасим событие и крутим панель сами. Дошли до
   *  края — отдаём колесо списку вкладок. */
  function onPanelWheel(event) {
    if (event.ctrlKey) {
      return; // Ctrl+колесо — зум страницы
    }
    const container = getContainer();
    if (!container || !event.target || !container.contains(event.target)) {
      return;
    }
    const delta = wheelDelta(event, container);
    if (!delta) {
      return;
    }
    const max = container.scrollHeight - container.clientHeight;
    if (max > 1) {
      const next = Math.min(max, Math.max(0, container.scrollTop + delta));
      if (Math.abs(next - container.scrollTop) > 0.5) {
        event.preventDefault();
        event.stopPropagation();
        container.scrollTop = next;
        return;
      }
    }
    // Панель уперлась в край — списком вкладок прокрутим сами,
    // иначе колесо потеряется (Zen его перехватывает).
    if (scrollAncestor(container, delta)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function essentialTabs(container) {
    if (!container) {
      return [];
    }
    // Иконки раскрытой вложенной папки лежат в полосе .zef-icon-strip —
    // ищем их по всему контейнеру, а не только среди прямых детей.
    return Array.from(
      container.querySelectorAll(".tabbrowser-tab[zen-essential]")
    );
  }

  /** Стабильный цвет для сайта: одинаковый домен — всегда один цвет. */
  function hostHue(host) {
    let hash = 0;
    const text = host || "?";
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) % 360;
    }
    return hash;
  }

  /** Плитка сайта без иконки: у сайта просто нет favicon — показываем
   *  первую букву адреса на цветном круге, чтобы плитку было видно
   *  и можно было узнать. */
  function updateIconFallbacks(container, tabs, reschedule = true) {
    for (const tab of tabs || essentialTabs(container)) {
      const img = tab.querySelector(".tab-icon-image");
      const host = hostOf(tabUrl(tab)) || "";
      const broken =
        !img ||
        !img.getAttribute("src") ||
        (img.complete && img.naturalWidth === 0);
      if (broken) {
        tab.classList.add("zef-no-icon");
        tab.classList.remove("zef-sharp");
        tab.style.setProperty(
          "--zef-fallback-letter",
          `"${(host || "?").charAt(0).toUpperCase()}"`
        );
        tab.style.setProperty(
          "--zef-fallback-color",
          `hsl(${hostHue(host)} 62% 48%)`
        );
      } else {
        tab.classList.remove("zef-no-icon");
        tab.style.removeProperty("--zef-fallback-letter");
        tab.style.removeProperty("--zef-fallback-color");
        // Размер у всех иконок один — ячейка задаётся в CSS.
      }
      // Иконка может приехать позже — перепроверим, когда она загрузится
      // или когда у неё не получится загрузиться. Слушатели постоянные:
      // одноразовый слушатель успевал «протухнуть», и значок навсегда
      // оставался сломанным — иконка пропадала.
      if (img && !img.dataset.zefWatch) {
        img.dataset.zefWatch = "1";
        const recheck = () => updateIconFallbacks(container, essentialTabs(container));
        img.addEventListener("load", recheck);
        img.addEventListener("error", recheck);
      }
    }
    scheduleIconRecheck(container, reschedule);
  }

  /** Повторная проверка иконок: favicon успевает приехать уже после того,
   *  как панель перестроилась.
   *
   *  Проверки одноразовые: без reschedule таймер не перезапускает сам себя,
   *  иначе панель опрашивала бы иконки каждые 400 мс до самого закрытия
   *  браузера. Следить за иконками и дальше помогают постоянные слушатели
   *  «load»/«error» ниже. */
  function scheduleIconRecheck(container, reschedule = true) {
    if (!reschedule) {
      return;
    }
    if (iconRecheckTimer) {
      return;
    }
    iconRecheckTimer = setTimeout(() => {
      iconRecheckTimer = 0;
      try {
        updateIconFallbacks(container, essentialTabs(container), false);
      } catch (e) {}
    }, 400);
    if (iconRecheckTimer2) {
      clearTimeout(iconRecheckTimer2);
    }
    iconRecheckTimer2 = setTimeout(() => {
      iconRecheckTimer2 = 0;
      try {
        updateIconFallbacks(container, essentialTabs(container), false);
      } catch (e) {}
    }, 1500);
  }

  /** Вкладки, которые мы уже видели загруженными. По ним можно отличить
   *  «выгрузили из памяти» от «ещё ни разу не открывали». */
  const seenLoaded = new WeakSet();

  /** Выгружена ли вкладка из памяти.
   *
   *  Firefox помечает принудительно выгруженную вкладку атрибутом discarded,
   *  но Zen этот атрибут сразу снимает. Надёжный признак — исчезновение
   *  панели браузера (linkedPanel): у выгруженной вкладки страницы в памяти
   *  больше нет. А вот «ещё не загружена» вкладка панели тоже не имеет, поэтому
   *  дополнительно проверяем, что вкладку мы уже видели загруженной. */
  function isTabUnloaded(tab) {
    if (!tab) {
      return false;
    }
    if (tab.hasAttribute("discarded") || tab.hasAttribute("zen-unloaded")) {
      return true;
    }
    return !tab.linkedPanel && seenLoaded.has(tab);
  }

  /** Помечает выгруженные вкладки — вид метки выбирается настройкой unloadStyle. */
  function updateUnloadedMarks(tabs) {
    for (const tab of tabs || []) {
      if (tab.linkedPanel) {
        seenLoaded.add(tab);
      }
      tab.classList.toggle("zef-unloaded", isTabUnloaded(tab));
    }
  }

  /* ------------------------------------------------------------------ *
   * Поиск по папкам
   * ------------------------------------------------------------------ */

  /** Строка поиска над плитками. Живёт рядом с сеткой «Важных», а не внутри
   *  неё: внутри сетки Zen перехватывает клики и клавиши, и в поле нельзя
   *  нормально печатать. */
  function ensureSearchRow(container) {
    if (!container) {
      return null;
    }
    const parent = container.parentElement;
    if (!parent) {
      return null;
    }
    if (!readBoolPref(PREF_SHOW_SEARCH, true)) {
      searchRow?.remove();
      return null;
    }
    if (!searchRow) {
      searchRow = document.createElement("div");
      searchRow.className = "zef-search";

      searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.className = "zef-search-input";
      searchInput.placeholder = t("search.placeholder");
      searchInput.value = filterText;
      searchInput.addEventListener("mousedown", event => {
        event.stopPropagation();
        // Zen может забрать фокус себе — возвращаем его полю.
        setTimeout(() => searchInput.focus(), 0);
      });
      searchInput.addEventListener("input", () => {
        filterText = searchInput.value;
        applyFilter();
      });
      searchInput.addEventListener("keydown", event => {
        // Zen перехватывает буквы в списке вкладок — отдаём их полю ввода.
        event.stopPropagation();
        if (event.key === "Escape") {
          filterText = "";
          searchInput.value = "";
          applyFilter();
        }
      });
      searchRow.appendChild(searchInput);

      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "zef-search-clear";
      clear.title = t("search.clear");
      clear.textContent = "×";
      clear.addEventListener("mousedown", event => event.stopPropagation());
      clear.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        filterText = "";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        applyFilter();
      });
      searchRow.appendChild(clear);

      // Шестерёнка: настройки мода. Живёт рядом с поиском, чтобы не искать
      // их в меню папки.
      const settingsButton = document.createElement("button");
      settingsButton.type = "button";
      settingsButton.className = "zef-search-settings";
      settingsButton.title = t("settings.title");
      settingsButton.textContent = "⚙";
      settingsButton.addEventListener("mousedown", event => event.stopPropagation());
      settingsButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openSettingsDialog(settingsButton);
      });
      searchRow.appendChild(settingsButton);
    }
    if (searchRow.parentElement !== parent) {
      parent.insertBefore(searchRow, container);
    }
    return searchRow;
  }

  /** Подходит ли папка под строку поиска: по названию или по домену. */
  function folderMatchesFilter(folder) {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return true;
    }
    if (!folder) {
      return false;
    }
    if ((folder.name || "").toLowerCase().includes(query)) {
      return true;
    }
    return (folder.sites || []).some(site =>
      String(site).toLowerCase().includes(query)
    );
  }

  /** Фильтр поиска: прячет лишние плитки, не перерисовывая панель.
   *  Если перерисовывать, поле ввода теряет фокус и печатать невозможно. */
  function applyFilter() {
    const container = getContainer();
    if (!container) {
      return;
    }
    const query = filterText.trim().toLowerCase();
    const byId = new Map(folders.map(folder => [folder.id, folder]));

    for (const el of container.querySelectorAll(
      ".zef-tile, .zef-head, .zef-plane"
    )) {
      const folder = byId.get(el.getAttribute("data-zef-folder"));
      const show = folderMatchesFilter(folder);
      el.style.display = show ? "" : "none";
    }

    for (const tab of essentialTabs(container)) {
      const folder = byId.get(tab.getAttribute("data-zef-folder"));
      let show = true;
      if (folder) {
        show = folderMatchesFilter(folder);
      } else if (query) {
        // Закреплённая вкладка вне папок: ищем по адресу.
        show = (hostOf(tabUrl(tab)) || "").toLowerCase().includes(query);
      }
      if (show) {
        tab.style.removeProperty("display");
      } else {
        tab.style.display = "none";
      }
    }

    // Ряд вложенных папок скрываем целиком, если не видно ни одной плитки:
    // иначе под поиском осталась бы пустая полоса.
    for (const row of container.querySelectorAll(".zef-nested-row")) {
      const tiles = Array.from(row.querySelectorAll(".zef-tile"));
      const visible = tiles.some(tile => tile.style.display !== "none");
      row.style.display = visible ? "" : "none";
    }

    // Плитка «+» и разделитель во время поиска лишние.
    const newTile = container.querySelector(".zef-tile.zef-new");
    if (newTile) {
      newTile.style.display = query ? "none" : "";
    }
    const divider = container.querySelector(".zef-divider");
    if (divider) {
      divider.style.display = query ? "none" : "";
    }

    // Подсказка, если совпадений нет.
    const shown = Array.from(
      container.querySelectorAll(".zef-tile:not(.zef-new), .zef-head")
    ).some(el => el.style.display !== "none");
    if (query && !shown) {
      if (!emptyHint) {
        emptyHint = document.createElement("div");
        emptyHint.className = "zef-empty";
      }
      emptyHint.textContent = t("search.empty", { query: filterText.trim() });
      emptyHint.style.display = "";
      if (emptyHint.parentElement !== container) {
        container.appendChild(emptyHint);
      }
    } else {
      emptyHint?.remove();
    }

    layoutPlanes();
    // Панель перестроилась — активная папка могла смениться (и её плитка
    // появилась в другом месте).
    updateActiveFolder();
  }

  /* ------------------------------------------------------------------ *
   * Синхронизация
   * ------------------------------------------------------------------ */

  function scheduleSync(delay = 150) {
    // Пока идёт перетаскивание, панель не перерисовываем: заново созданные
    // плитки уезжают из-под курсора, и бросок попадает мимо цели.
    if (dragInProgress) {
      pendingSync = true;
      return;
    }
    if (syncTimer) {
      clearTimeout(syncTimer);
    }
    syncTimer = setTimeout(() => {
      syncTimer = null;
      sync();
    }, delay);
  }

  function sync(force = false) {
    const container = getContainer();
    if (!container) {
      return;
    }
    // Бросок, который не попал ни в одну нашу зону (например, в пустое
    // место, которое Zen вставил под вкладку), ищем по снимку раскладки.
    if (!container.hasAttribute("zef-drop-ready")) {
      container.setAttribute("zef-drop-ready", "true");
      container.addEventListener("drop", event => {
        // Бросить можно и вкладку, и папку: папка тоже должна попасть
        // в открытую папку, а не потеряться.
        if (!draggedTab && !draggedFolderId) {
          return;
        }
        if (dropBySnapshot(event)) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
    // Наблюдение должно следовать за текущим контейнером.
    installObserver();
    // Строка поиска всегда первая в сетке «Важных».
    ensureSearchRow(container);
    folders = readFolders();
    collapsed = new Set(readJSONPref(PREF_COLLAPSED, []));
    normalizeTree();

    const tabs = essentialTabs(container);
    const matches = tabs.map(tab => matchFolderForUrl(tabUrl(tab)));
    updateIconFallbacks(container, tabs);
    updateUnloadedMarks(tabs);
    const signature = JSON.stringify([
      folders.map(folder => [
        folder.id,
        folder.name,
        folder.color,
        folder.icon,
        folder.parentId,
        folder.pinned ? 1 : 0,
        folder.sites,
      ]),
      [...collapsed],
      matches.map(match => (match ? match.folder.id : "")),
      filterText.trim().toLowerCase(),
    ]);

    if (
      !force &&
      signature === lastSignature &&
      container.querySelector(".zef-tile")
    ) {
      return;
    }
    lastSignature = signature;

    // Убираем плитки прошлого прохода (только наши — по классу).
    for (const child of Array.from(container.children)) {
      if (
        child.classList?.contains("zef-tile") ||
        child.classList?.contains("zef-head") ||
        child.classList?.contains("zef-plane") ||
        child.classList?.contains("zef-divider") ||
        // Разрыв ряда — тоже наш элемент. Если его не убрать, старые разрывы
        // останутся в панели навсегда и оставят дыры между иконками.
        // Ряд плиток папок — тоже наш: без очистки они накапливались бы.
        child.classList?.contains("zef-tiles-row") ||
        // Полоса иконок вложенной папки — наш элемент.
        child.classList?.contains("zef-icon-strip")
      ) {
        // Иконки лежат внутри полосы: сначала вернём их в контейнер,
        // иначе они исчезнут вместе с полосой.
        if (child.classList?.contains("zef-icon-strip")) {
          for (const tab of Array.from(child.children)) {
            container.appendChild(tab);
          }
        }
        child.remove();
      }
    }

    // Раскладываем вкладки по папкам. Порядок плиток внутри папки задают
    // правила папки (sites), а не случайный порядок в DOM.
    const groups = new Map();
    const free = [];
    tabs.forEach((tab, index) => {
      tab.removeAttribute("data-zef-folder");
      tab.removeAttribute("data-zef-open");
      tab.removeAttribute("data-zef-hidden");
      tab.style.removeProperty("--zef-color");

      const match = matches[index];
      if (!match) {
        free.push(tab);
        attachSiteDropHandlers(tab);
        return;
      }
      const folder = match.folder;
      tab.setAttribute("data-zef-folder", folder.id);
      tab.style.setProperty("--zef-color", folder.color || DEFAULT_COLOR);
      if (isHiddenByCollapse(folder.id)) {
        tab.setAttribute("data-zef-hidden", "true");
      } else {
        tab.setAttribute("data-zef-open", "true");
      }
      if (!groups.has(folder.id)) {
        groups.set(folder.id, []);
      }
      groups.get(folder.id).push({ tab, ruleIndex: match.ruleIndex, index });
      attachSiteDropHandlers(tab);
    });

    for (const list of groups.values()) {
      list.sort((a, b) => a.ruleIndex - b.ruleIndex || a.index - b.index);
    }

    const countOf = id => (groups.get(id) || []).length;

    // Порядок в сетке «Важных»:
    //   1) ряд плиток папок верхнего уровня;
    //   2) ниже — содержимое раскрытых папок: шапка, зона приёма,
    //      вложенные папки и иконки сайтов;
    //   3) в самом конце — «свободные» иконки (вне папок).
    let order = 0;
    const nextOrder = () => order++;

    // --- верхний ряд: плитки свёрнутых папок ---
    // Раскрытая папка целиком уезжает в свою цветную плоскость, поэтому
    // в ряду остаются только свёрнутые: папка не показывается дважды.
    // Вложенные папки в ряду нет — она живёт внутри плоскости родителя.
    // Закреплённые папки (пинка) идут первыми.
    //
    // Плитки лежат отдельной полосой на всю ширину панели: внутри неё
    // они делят ширину поровну и растут вместе с сайдбаром. Если держать
    // их прямо в сетке Zen, ширина плитки не зависит от ширины панели:
    // расширишь сайдбар — добавится ещё одна плитка в ряд, а сами
    // плитки останутся прежними.
    // Плитки папок могут лежать двумя способами: отдельной полосой (по
    // умолчанию — плитки делят ширину панели поровну) или прямо в общей
    // сетке Zen (тогда ширина плитки от ширины панели не зависит).
    const inGrid = settings.tilesRow === "grid";
    let tilesRow = null;
    if (!inGrid) {
      tilesRow = document.createElement("div");
      tilesRow.className = "zef-tiles-row";
      tilesRow.style.order = String(nextOrder());
      container.appendChild(tilesRow);
    }
    const tileHost = inGrid ? container : tilesRow;

    const topRow = folders
      .filter(folder => !folder.parentId && collapsed.has(folder.id))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    for (const folder of topRow) {
      const tile = buildTile(folder, countOf(folder.id), false);
      tile.style.order = String(nextOrder());
      tileHost.appendChild(tile);
    }

    // Плитка «+» — создать новую папку прямо из панели.
    if (settings.showPlus) {
      const add = document.createElement("div");
      add.className = "zef-tile zef-new";
      add.setAttribute("title", t("folder.new"));
      add.style.order = String(nextOrder());
      const plus = document.createElement("div");
      plus.className = "zef-tile-icon zef-plus";
      plus.textContent = "+";
      add.appendChild(plus);
      add.addEventListener("mousedown", event => event.stopPropagation());
      add.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        pendingSite = null;
        // Папка появляется сразу: без диалога, название правится на месте.
        createFolderInline();
      });
      tileHost.appendChild(add);
    }

    // --- плоскости раскрытых папок ---
    // Каждая раскрытая папка — большая плоскость её цвета: шапка с
    // названием и плитки сайтов внутри. Свежая открытая папка — сверху.
    const layoutFolder = (folder, depth = 0) => {
      const nested = depth > 0;

      // Свою шапку и свою цветную плоскость имеет только папка верхнего
      // уровня. Вложенная папка — это плитка в ряду: своими блоками она
      // занимала столько же места, сколько главная, и взгляд терялся.
      if (!nested) {
        container.appendChild(buildPlane(folder));

        const head = buildHead(folder, countOf(folder.id));
        head.style.order = String(nextOrder());
        // Самая верхняя шапка не отступает сверху: сверху и так есть ряд
        // плиток (или край панели), лишний отступ там не нужен. Отступ нужен
        // только между блоками — там он отделяет плоскости друг от друга.
        if (!container.querySelector(".zef-head")) {
          head.classList.add("zef-head-first");
        }
        container.appendChild(head);
      }

      // Вложенные папки — плитками в своём ряду: и раскрытые, и свёрнутые.
      // Раскрытая вложенная папка остаётся плиткой, а её иконки собираются
      // плотной полосой под рядом — внутри цветной области родителя.
      //
      // Плитки вложенных папок лежат отдельным рядом, а не прямо в общей
      // сетке Zen. В общей сетке такая плитка вставала в свободную ячейку
      // чужого ряда — и папка выглядела лежащей в другой папке. Вдобавок её
      // высота больше высоты ряда Zen, и плитки наезжали друг на друга.
      const children = childrenOf(folder.id);
      if (children.length) {
        const nestedRow = document.createElement("div");
        nestedRow.className = "zef-tiles-row zef-nested-row";
        nestedRow.style.order = String(nextOrder());
        nestedRow.setAttribute("data-zef-owner", folder.id);
        container.appendChild(nestedRow);
        for (const child of children) {
          const tile = buildTile(child, countOf(child.id), true);
          tile.setAttribute("data-zef-parent", folder.id);
          tile.style.order = String(nestedRow.children.length);
          // Раскрытую вложенную папку помечаем: её иконки лежат рядом.
          if (!isHiddenByCollapse(child.id)) {
            tile.classList.add("zef-open");
          }
          nestedRow.appendChild(tile);
        }
        // Раскрытые вложенные папки: их иконки — плотной полосой под рядом.
        for (const child of children) {
          if (isHiddenByCollapse(child.id)) {
            continue;
          }
          const strip = buildIconStrip(child, groups.get(child.id) || []);
          strip.style.order = String(nextOrder());
          container.appendChild(strip);
          layoutFolder(child, depth + 1);
        }
      }

      // Плитки сайтов папки.
      if (!nested) {
        for (const item of groups.get(folder.id) || []) {
          item.tab.style.order = String(nextOrder());
        }
      }
    };

    for (const folder of expandedFolders()) {
      layoutFolder(folder);
    }

    // Разделитель между папками и «свободными» (закреплёнными, но не вошедшими
    // ни в одну папку) вкладками. Это же — зона, куда можно перетащить вкладку,
    // чтобы убрать её из папки, а папку — вынести на верхний уровень.
    const divider = document.createElement("div");
    divider.className = "zef-divider";
    divider.setAttribute(
      "title",
      free.length > 0
        ? t("pinned.withCount", { count: free.length })
        : t("pinned.plain")
    );
    divider.style.order = String(nextOrder());
    divider.addEventListener("dragover", event => {
      if (!dragKind(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      divider.classList.add("zef-drop-over");
    });
    divider.addEventListener("dragleave", () =>
      divider.classList.remove("zef-drop-over")
    );
    divider.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      divider.classList.remove("zef-drop-over");
      handleDropOnDivider(event);
    });
    container.appendChild(divider);

    for (const tab of free) {
      tab.style.order = String(nextOrder());
    }

    // Во время поиска показываем подсказку, если совпадений нет.
    applyFilter();

    // Плоскости раскрытых папок должны обкрыть их плитки — считаем
    // размеры после того, как браузер разложил сетку.
    layoutPlanes();

    // Правка названия должна пережить перерисовку: панель перестраивается
    // целиком, а поле правки — часть плитки.
    reattachInlineEdit();
  }

  /* ------------------------------------------------------------------ *
   * Плитка папки
   * ------------------------------------------------------------------ */

  function buildTile(folder, count, nested) {
    // HTML-элементы: в XUL-контейнере они верстаются предсказуемо
    // (обрезка текста, flex-раскладка), а иконку грузим inline — так
    // user-sheet не мешает доступу к chrome://-ресурсам Zen.
    const tile = document.createElement("div");
    tile.className = nested ? "zef-tile zef-nested" : "zef-tile";
    tile.setAttribute("data-zef-folder", folder.id);
    tile.setAttribute(
      "title",
      `${folderPath(folder)} — ${count}`.trim()
    );
    tile.style.setProperty("--zef-color", folder.color || DEFAULT_COLOR);
    if (folder.pinned) {
      tile.classList.add("zef-pinned");
    }

    const icon = document.createElement("div");
    icon.className = "zef-tile-icon";
    icon.style.backgroundImage = `url("${folder.icon || DEFAULT_ICON}")`;
    tile.appendChild(icon);

    const name = document.createElement("div");
    name.className = "zef-tile-name";
    name.textContent = folder.name || "";
    name.title = t("folder.renameHint");
    if (!readBoolPref(PREF_SHOW_NAMES, true)) {
      name.hidden = true;
    }
    tile.appendChild(name);

    // Название — зона правки: двойной клик открывает поле ввода.
    attachNameEditing(name, folder, () => toggleFolder(folder.id));

    const badge = document.createElement("div");
    badge.className = "zef-tile-count";
    badge.textContent = String(count);
    if (!readBoolPref(PREF_SHOW_COUNT, true)) {
      badge.hidden = true;
    }
    tile.appendChild(badge);

    // Метка активной папки: сам значок рисует CSS (стиль выбирается
    // настройкой мода). Пока папка не активна, метка не видна.
    const mark = document.createElement("div");
    mark.className = "zef-active-mark";
    tile.appendChild(mark);

    tile.addEventListener("mousedown", event => event.stopPropagation());
    tile.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      if (isClickAfterDrag()) {
        return;
      }
      toggleFolder(folder.id);
    });

    // Плитку папки можно таскать мышью.
    tile.addEventListener("dragstart", event => {
      event.stopPropagation();
      draggedFolderId = folder.id;
      try {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-zef-folder", folder.id);
        event.dataTransfer.setData("text/plain", folder.name || t("folder.dragType"));
      } catch (e) {}
      tile.classList.add("zef-dragging");
      document.documentElement.classList.add("zef-drag-active");
    });
    tile.addEventListener("dragend", () => {
      draggedFolderId = null;
      tile.classList.remove("zef-dragging");
      document.documentElement.classList.remove("zef-drag-active");
      clearDropMarks();
    });
    tile.addEventListener("dragover", event => {
      const kind = dragKind(event);
      if (!kind) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      // Вкладку кладём в папку целиком: края плитки заняты перестановкой
      // папок, и вкладке незачем папку переставлять.
      const zone = kind === "site" ? 1 : dropZoneOf(event, tile, 0.3);
      tile.classList.remove("zef-drop-before", "zef-drop-into", "zef-drop-after");
      tile.classList.add(
        zone === 0 ? "zef-drop-before" : zone === 2 ? "zef-drop-after" : "zef-drop-into"
      );
    });
    tile.addEventListener("dragleave", event => {
      if (event.relatedTarget && tile.contains(event.relatedTarget)) {
        return;
      }
      tile.classList.remove("zef-drop-before", "zef-drop-into", "zef-drop-after");
    });
    tile.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      const kind = dragKind(event);
      const zone = kind === "site" ? 1 : dropZoneOf(event, tile, 0.3);
      clearDropMarks();
      const current = folderById(folder.id) || folder;
      if (kind === "folder") {
        handleFolderDropOnTile(event, current, zone);
      } else if (kind === "site") {
        handleSiteDropOnTile(event, current);
      }
    });

    return tile;
  }

  /** Полоса иконок раскрытой вложенной папки: плотный ряд под плитками,
   *  внутри цветной области родителя. Отдельной шапки у вложенной папки
   *  нет — иначе она занимала бы столько же места, сколько главная. */
  function buildIconStrip(folder, items) {
    const strip = document.createElement("div");
    strip.className = "zef-icon-strip";
    strip.setAttribute("data-zef-owner", folder.id);
    strip.style.setProperty("--zef-color", folder.color || DEFAULT_COLOR);
    let index = 0;
    for (const item of items || []) {
      const tab = item.tab;
      tab.style.order = String(index++);
      strip.appendChild(tab);
    }
    // Сама полоса — зона приёма: плитка сайта попадёт в папку,
    // папка — внутрь неё.
    strip.addEventListener("dragover", event => {
      if (!dragKind(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      strip.classList.add("zef-drop-over");
    });
    strip.addEventListener("dragleave", event => {
      if (event.relatedTarget && strip.contains(event.relatedTarget)) {
        return;
      }
      strip.classList.remove("zef-drop-over");
    });
    strip.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      strip.classList.remove("zef-drop-over");
      const current = folderById(folder.id) || folder;
      handleDropIntoFolder(event, current);
    });
    return strip;
  }

  /** Вложена ли папка в другую (на любом уровне). */
  function isDescendantFolder(childId, ancestorId) {
    let current = folderById(childId);
    const seen = new Set();
    while (current && current.parentId && !seen.has(current.id)) {
      seen.add(current.id);
      if (current.parentId === ancestorId) {
        return true;
      }
      current = folderById(current.parentId);
    }
    return false;
  }

  /** Большая плоскость цвета раскрытой папки. Живёт под плитками —
   *  она и есть «область открытой папки», куда всё можно перетащить. */
  function buildPlane(folder) {
    const plane = document.createElement("div");
    plane.className = "zef-plane";
    plane.setAttribute("data-zef-folder", folder.id);
    plane.style.setProperty("--zef-color", folder.color || DEFAULT_COLOR);

    // Сама плоскость — зона приёма: плитка сайта попадёт в папку,
    // папка — внутрь неё.
    plane.addEventListener("dragover", event => {
      if (!dragKind(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      plane.classList.add("zef-drop-over");
    });
    plane.addEventListener("dragleave", event => {
      if (event.relatedTarget && plane.contains(event.relatedTarget)) {
        return;
      }
      plane.classList.remove("zef-drop-over");
    });
    plane.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      plane.classList.remove("zef-drop-over");
      const current = folderById(folder.id) || folder;
      handleDropIntoFolder(event, current);
    });

    return plane;
  }

  /** Шапка раскрытой папки: название и счётчик на её плоскости.
   *  Клик по ней сворачивает папку. */
  function buildHead(folder, count) {
    const head = document.createElement("div");
    head.className = "zef-head";
    head.setAttribute("data-zef-folder", folder.id);
    head.setAttribute("title", `${folderPath(folder)} — ${count}`.trim());
    head.style.setProperty("--zef-color", folder.color || DEFAULT_COLOR);
    // Закреплённая папка помечается точкой и в развёрнутом виде.
    if (folder.pinned) {
      head.classList.add("zef-pinned");
    }

    const icon = document.createElement("div");
    icon.className = "zef-tile-icon";
    icon.style.backgroundImage = `url("${folder.icon || DEFAULT_ICON}")`;
    head.appendChild(icon);

    const name = document.createElement("div");
    name.className = "zef-head-name";
    name.textContent = folder.name || "";
    name.title = t("folder.renameHint");
    head.appendChild(name);

    // Название шапки — та же зона правки, что и у плитки.
    attachNameEditing(name, folder, () => toggleFolder(folder.id));

    const badge = document.createElement("div");
    badge.className = "zef-head-count";
    badge.textContent = String(count);
    head.appendChild(badge);

    // Метка активной папки — как и на плитке.
    const mark = document.createElement("div");
    mark.className = "zef-active-mark";
    head.appendChild(mark);

    head.addEventListener("mousedown", event => event.stopPropagation());
    head.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      if (isClickAfterDrag()) {
        return;
      }
      toggleFolder(folder.id);
    });
    // На шапку тоже можно перетащить вкладку или папку — она попадёт в папку.
    head.addEventListener("dragstart", event => {
      event.stopPropagation();
      draggedFolderId = folder.id;
      try {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-zef-folder", folder.id);
        event.dataTransfer.setData("text/plain", folder.name || t("folder.dragType"));
      } catch (e) {}
      head.classList.add("zef-dragging");
      document.documentElement.classList.add("zef-drag-active");
    });
    head.addEventListener("dragend", () => {
      draggedFolderId = null;
      head.classList.remove("zef-dragging");
      document.documentElement.classList.remove("zef-drag-active");
      clearDropMarks();
    });
    head.addEventListener("dragover", event => {
      if (!dragKind(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      head.classList.add("zef-drag-over");
    });
    head.addEventListener("dragleave", () => head.classList.remove("zef-drag-over"));
    head.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      head.classList.remove("zef-drag-over");
      const current = folderById(folder.id) || folder;
      handleDropIntoFolder(event, current);
    });

    return head;
  }

  /* ------------------------------------------------------------------ *
   * Мгновенное создание папки и правка названия на месте
   *
   * Папка появляется сразу: без диалога и без лишних шагов. Название
   * правится прямо на плитке, цвет выбирается полоской свотчей рядом с
   * ней. Сложные случаи (иконка, точный код цвета, правила сайтов)
   * остались в старом диалоге — он по-прежнему доступен из меню плитки.
   * ------------------------------------------------------------------ */

  /** Плитка или шапка папки — то, где живёт её название. */
  function folderElement(id) {
    const container = getContainer();
    if (!container || !id) {
      return null;
    }
    const selector =
      `.zef-tile[data-zef-folder="${CSS.escape(id)}"], ` +
      `.zef-head[data-zef-folder="${CSS.escape(id)}"]`;
    return container.querySelector(selector);
  }

  /** Создаёт папку сразу, без диалога: новая плитка появляется в панели
   *  уже с включённой правкой названия. */
  function createFolderInline() {
    const folder = {
      id: newFolderId(),
      name: "",
      color: DEFAULT_COLOR,
      icon: DEFAULT_ICON,
      parentId: null,
      sites: pendingSite ? [pendingSite] : [],
    };
    pendingSite = null;
    // Новая папка — первая: так её сразу видно в ряду.
    folders.unshift(folder);
    // Показываем её плиткой (свёрнутой): развёрнутая папка — это плоскость
    // с шапкой, а править название удобнее на плитке.
    const set = new Set(readJSONPref(PREF_COLLAPSED, []));
    set.add(folder.id);
    writeJSONPref(PREF_COLLAPSED, [...set]);
    collapsed = set;
    persist();
    // Панель уже перестроена — ищем плитку и включаем правку названия.
    startInlineEdit(folder, folderElement(folder.id), true);
  }

  /** Включает правку названия прямо на плитке: вместо подписи появляется
   *  поле ввода. */
  function startInlineEdit(folder, host, isNew) {
    if (!folder || !host) {
      return;
    }
    const nameEl = host.querySelector(".zef-tile-name, .zef-head-name");
    if (!nameEl) {
      return;
    }
    const previous = folder.name || "";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "zef-inline-input";
    input.placeholder = t("folder.namePlaceholder");
    input.value = previous;
    input.spellcheck = false;
    input.draggable = false;
    input.setAttribute("data-zef-inline", "name");

    // Клавиши не должны уезжать в панель: иначе пробел и стрелки
    // управляли бы навигацией Zen вместо правки названия.
    input.addEventListener("keydown", event => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        commitInlineEdit();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelInlineEdit();
      }
    });
    input.addEventListener("keyup", event => event.stopPropagation());
    input.addEventListener("mousedown", event => event.stopPropagation());
    input.addEventListener("click", event => event.stopPropagation());
    // Выделять текст нельзя: это отменяет перетаскивание плитки.
    input.addEventListener("dragstart", event => event.stopPropagation());
    input.addEventListener("blur", () => {
      // Поле вырезали из DOM при перерисовке панели — это не уход фокуса.
      if (!input.isConnected || document.activeElement === input) {
        return;
      }
      commitInlineEdit();
    });

    nameEl.replaceWith(input);
    inlineEdit = {
      folderId: folder.id,
      isNew: Boolean(isNew),
      previous,
      input,
      done: false,
    };
    focusInlineInput(input);
  }

  /** Ставит курсор в поле правки. */
  function focusInlineInput(input) {
    try {
      input.focus({ preventScroll: true });
    } catch (e) {
      try {
        input.focus();
      } catch (e2) {}
    }
    try {
      input.select();
    } catch (e) {}
  }

  /** Фиксирует правку: Enter или уход фокуса. Пустое имя — отмена. */
  function commitInlineEdit() {
    const state = inlineEdit;
    if (!state || state.done) {
      return;
    }
    state.done = true;
    inlineEdit = null;
    const value = state.input.value.trim();
    state.input.remove();
    const folder = folderById(state.folderId);
    if (!folder) {
      sync(true);
      return;
    }
    if (!value) {
      // Имя не введено: новую папку удаляем, старой возвращаем прежнее.
      if (state.isNew) {
        deleteFolder(folder);
      } else {
        folder.name = state.previous;
        persist();
      }
      return;
    }
    folder.name = value;
    persist();
  }

  /** Отменяет правку: Esc. */
  function cancelInlineEdit() {
    const state = inlineEdit;
    if (!state || state.done) {
      return;
    }
    state.done = true;
    inlineEdit = null;
    state.input.remove();
    const folder = folderById(state.folderId);
    if (!folder) {
      sync(true);
      return;
    }
    // Новую папку отменяем целиком — она была создана «на лету».
    if (state.isNew) {
      deleteFolder(folder);
      return;
    }
    folder.name = state.previous;
    persist();
  }

  /** Возвращает поле правки на место: панель могла перестроиться (например,
   *  открылась вкладка) — тогда поле вырезали, а правка должна продолжиться. */
  function reattachInlineEdit() {
    const state = inlineEdit;
    if (!state) {
      return;
    }
    const host = folderElement(state.folderId);
    const nameEl = host?.querySelector(".zef-tile-name, .zef-head-name");
    if (!host || !nameEl) {
      // Папки больше нет — правку отменяем.
      cancelInlineEdit();
      return;
    }
    const value = state.input.value;
    nameEl.replaceWith(state.input);
    state.input.value = value;
    focusInlineInput(state.input);
  }

  /** Название папки: двойной клик — правка на месте, одиночный клик —
   *  открытие или закрытие папки. Клик по названию ждёт, не будет ли
   *  второго: иначе папка открылась бы, плитка переехала на другое место
   *  и двойной клик до названия бы не дошёл. */
  function attachNameEditing(nameEl, folder, onToggle) {
    let timer = 0;
    const cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };
    nameEl.addEventListener("click", event => {
      event.stopPropagation();
      cancel();
      timer = setTimeout(() => {
        timer = 0;
        if (isClickAfterDrag()) {
          return;
        }
        onToggle();
      }, DOUBLE_CLICK_DELAY);
    });
    nameEl.addEventListener("dblclick", event => {
      event.preventDefault();
      event.stopPropagation();
      cancel();
      startInlineEdit(folder, nameEl.closest(".zef-tile, .zef-head"), false);
    });
    // Перетаскивание не должно превращаться в открытие папки.
    nameEl.addEventListener("dragstart", cancel);
  }

  /** Воздух под иконками папки (--zef-plane-air). Разрыв ряда после
   *  вложенной раскрытой папки занимает столько же — иначе верхний край
   *  иконок родителя залезет в цвет плоскости вложенной папки. */
  function planeAir(container) {
    try {
      const raw = getComputedStyle(container).getPropertyValue("--zef-plane-air");
      const value = parseFloat(raw);
      return Number.isFinite(value) ? value : 12;
    } catch (e) {
      return 12;
    }
  }

  /** Расставляет плоскости по плиткам: плоскость должна обкрывать
   *  шапку папки и все её плитки. Размеры считаем после вёрстки. */
  function layoutPlanes() {
    const container = getContainer();
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    // Плоскости позиционируются внутри прокручиваемой панели, поэтому
    // координаты считаем от её содержимого, а не от видимой части:
    // иначе при прокрутке плоскость уезжает от своей папки.
    const scrollTop = container.scrollTop || 0;
    const scrollLeft = container.scrollLeft || 0;
    for (const plane of container.querySelectorAll(".zef-plane")) {
      const folderId = plane.getAttribute("data-zef-folder");
      const head = container.querySelector(`.zef-head[data-zef-folder="${folderId}"]`);
      if (!head) {
        plane.style.display = "none";
        continue;
      }
      // Иконки папки: они могут лежать в полосах вложенных папок, поэтому
      // ищем по всему контейнеру, а не среди прямых детей.
      const icons = container.querySelectorAll(
        `.tabbrowser-tab[data-zef-folder="${folderId}"][data-zef-open="true"]`
      );
      // Плитки вложенных папок тоже лежат внутри плоскости родителя.
      // Ищём по всему контейнеру: вложенные плитки лежат в своём ряду.
      const nested = container.querySelectorAll(
        `.zef-tile[data-zef-parent="${folderId}"]`
      );
      // И полосы иконок вложенных папок — тоже внутри плоскости родителя.
      const strips = container.querySelectorAll(".zef-icon-strip");
      plane.style.display = "block";
      const headRect = head.getBoundingClientRect();
      // Плитки папки могут не поместиться в одну строку и перенестись
      // на вторую. Плоскость должна накрывать их все, поэтому берём
      // самый нижний край, а не последнюю плитку в DOM: визуальный
      // порядок задан свойством order и с порядком в DOM не совпадает.
      let bottom = headRect.bottom;
      for (const icon of icons) {
        bottom = Math.max(bottom, icon.getBoundingClientRect().bottom);
      }
      for (const tile of nested) {
        bottom = Math.max(bottom, tile.getBoundingClientRect().bottom);
      }
      for (const strip of strips) {
        const owner = strip.getAttribute("data-zef-owner");
        if (owner !== folderId && !isDescendantFolder(owner, folderId)) {
          continue;
        }
        bottom = Math.max(bottom, strip.getBoundingClientRect().bottom);
      }
      plane.style.left = headRect.left - containerRect.left + scrollLeft + "px";
      plane.style.width = headRect.width + "px";
      plane.style.top = headRect.top - containerRect.top + scrollTop + "px";
      // Воздух под иконками есть только там, где он свободен. В узкой
      // панели следующий блок начинается сразу под иконками, и без этого
      // ограничения край плоскости проходил прямо по его плиткам.
      let limit = Infinity;
      for (const el of container.children) {
        if (el === plane || el === head) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          continue;
        }
        // Берём только то, что начинается ниже содержимого папки.
        if (rect.top >= bottom - 1) {
          limit = Math.min(limit, rect.top);
        }
      }
      let planeBottom = bottom + planeAir(container);
      if (Number.isFinite(limit)) {
        planeBottom = Math.min(planeBottom, Math.max(bottom, limit - 2));
      }
      plane.style.height = Math.max(0, planeBottom - headRect.top) + "px";
    }
  }

  /* ------------------------------------------------------------------ *
   * Действия с папками
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ *
 * Действия с папками
 * ------------------------------------------------------------------ */

  /** Все открытые вкладки браузера, которые попадают в папку. */
  function tabsOfFolder(folder) {
    const result = [];
    for (const tab of gBrowser?.tabs || []) {
      const url = tabUrl(tab);
      if (url && bestRuleMatch(folder, url)) {
        result.push(tab);
      }
    }
    return result;
  }

  /** Выделить все вкладки папки — они откроются рядом, как группа. */
  function openFolderTabs(folder) {
    const tabs = tabsOfFolder(folder);
    if (!tabs.length) {
      return;
    }
    try {
      gBrowser.selectedTabs = tabs;
    } catch (e) {
      try {
        gBrowser.selectedTab = tabs[0];
      } catch (e2) {}
    }
  }

  /** Развернуть или свернуть сразу все папки. */
  function setAllCollapsed(collapsedState) {
    const ids = folders.map(folder => folder.id);
    writeJSONPref(PREF_COLLAPSED, collapsedState ? ids : []);
    collapsed = new Set(collapsedState ? ids : []);
    lastSignature = null;
    sync(true);
  }

  /** Сохраняет папки в преф. Возвращает false, если запись не прошла. */
  function persist() {
    const saved = writeJSONPref(PREF_FOLDERS, folders);
    if (saved) {
      // Всё записалось — несохранённые цвета больше не нужны.
      pendingColors.clear();
    }
    lastSignature = null;
    // Во время перетаскивания перерисовку откладываем — обновимся сразу
    // после того, как броска закончится.
    if (dragInProgress) {
      pendingSync = true;
      return saved;
    }
    sync(true);
    return saved;
  }

  /** Красит папку сразу, не дожидаясь перерисовки сетки: плитка,
   *  шапка, плоскость и вкладки внутри папки. Так цвет меняется в том
   *  же кадре, в котором нажали «Сохранить». */
  function paintFolderColor(id, color) {
    if (!id || !color) {
      return;
    }
    const container = getContainer();
    if (!container) {
      return;
    }
    const selector = `[data-zef-folder="${CSS.escape(id)}"]`;
    for (const element of container.querySelectorAll(selector)) {
      element.style.setProperty("--zef-color", color);
    }
  }

  function toggleFolder(id) {
    const set = new Set(readJSONPref(PREF_COLLAPSED, []));
    if (set.has(id)) {
      set.delete(id);
      // Папку открыли — она самая свежая, поэтому встаёт сверху.
      rememberOpen(id);
    } else {
      set.add(id);
      // Закрыли родителя — вложенные папки закрываем вместе с ним.
      // Иначе открытая вложенная папка остаётся открытой, и её вкладки
      // выпадают в сетку «Важных» как обычные плитки.
      for (const childId of descendantIds(id)) {
        set.add(childId);
      }
    }
    writeJSONPref(PREF_COLLAPSED, [...set]);
    collapsed = set;
    lastSignature = null;
    sync(true);
  }

  function deleteFolder(folder) {
    const parentId = folder.parentId || null;
    folders = folders.filter(item => item.id !== folder.id);
    // Вложенные папки не исчезают — поднимаются на уровень выше.
    for (const item of folders) {
      if (item.parentId === folder.id) {
        item.parentId = parentId;
      }
    }
    const set = new Set(readJSONPref(PREF_COLLAPSED, []));
    set.delete(folder.id);
    writeJSONPref(PREF_COLLAPSED, [...set]);
    persist();
  }

  /** Добавить сайт в папку целиком — так это делает пункт меню «В папку»:
   *  в папку попадают все вкладки домена. */
  function addSiteToFolder(folder, url) {
    const host = hostOf(url);
    if (!host) {
      return false;
    }
    // Сайт принадлежит ровно одной папке: из остальных домен убираем.
    for (const other of folders) {
      if (other.id !== folder.id) {
        removeHostRule(other, host);
      }
    }
    removeExclusionsFor(folder, url);
    folder.sites = folder.sites || [];
    if (
      !folder.sites.some(
        item => !isExclusionRule(item) && normalizeSite(item) === host
      )
    ) {
      folder.sites.push(host);
    }
    return true;
  }

  function addTabToFolder(tab, folder) {
    const url = tabUrl(tab);
    if (!addSiteToFolder(folder, url)) {
      return;
    }
    persist();
  }

  /* ------------------------------------------------------------------ *
   * Перетаскивание
   * ------------------------------------------------------------------ */

  /** Клик, случившийся сразу после перетаскивания, — игнорируем. */
  function isClickAfterDrag() {
    return Date.now() - lastDragEnd < 400;
  }

  /** Снимок раскладки плиток: с этого момента сетка может поехать, а цель
   *  броска запомнить надо именно сейчас. */
  function snapshotDragLayout() {
    const container = getContainer();
    if (!container) {
      dragLayout = null;
      return;
    }
    const items = [];
    // Шапки и цветные области открытых папок — тоже цели броска: в шапку
    // или в цвет открытой папки можно перенести плитку. Без них бросок
    // уходил в «ближайшую плитку» и папка менялась на глазах.
    const targets = container.querySelectorAll(
      ".zef-tile, .zef-head, .zef-plane, .zef-icon-strip, " +
      ".tabbrowser-tab[zen-essential='true']"
    );
    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        continue;
      }
      const isTile = el.classList.contains("zef-tile");
      const isHead = el.classList.contains("zef-head");
      const isPlane = el.classList.contains("zef-plane");
      const isStrip = el.classList.contains("zef-icon-strip");
      items.push({
        el,
        kind: isTile
          ? "folder"
          : isHead
            ? "head"
            : isPlane || isStrip
              ? "plane"
              : "site",
        folderId:
          el.getAttribute("data-zef-folder") ||
          // У полосы иконок папка лежит в data-zef-owner — своя папка,
          // в которую полоса и вложена.
          el.getAttribute("data-zef-owner") ||
          null,
        area: rect.width * rect.height,
        rect,
      });
    }
    // Самая маленькая цель — самая точная: вложенная шапка и вложенная
    // плоскость лежат внутри плоскости родителя, и в снимке видно их раньше.
    items.sort((a, b) => a.area - b.area);
    dragLayout = items;
  }

  /** Цели броска, перемеренные прямо сейчас.
   *
   *  Зачем: пока вкладку тащат, Zen вставляет в сетку «Важных» пустое место
   *  и сдвигает плитки. Снимок раскладки, снятый в начале броска, к моменту
   *  отпускания мыши уже не совпадает с тем, что видно на экране: плитка, в
   *  которую целятся, успевает уехать из-под курсора. */
  function measureDragTargets() {
    const container = getContainer();
    if (!container) {
      return [];
    }
    const items = [];
    // Шапки и цветные области открытых папок — тоже цели броска: в шапку
    // или в цвет открытой папки можно перенести плитку.
    const targets = container.querySelectorAll(
      ".zef-tile, .zef-head, .zef-plane, .zef-icon-strip, " +
      ".tabbrowser-tab[zen-essential='true']"
    );
    for (const el of targets) {
      // Тащут вкладку — она едет под курсором, целью быть не может.
      if (el === draggedTab || el.contains(draggedTab)) {
        continue;
      }
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        continue;
      }
      const isTile = el.classList.contains("zef-tile");
      const isHead = el.classList.contains("zef-head");
      const isPlane = el.classList.contains("zef-plane");
      const isStrip = el.classList.contains("zef-icon-strip");
      items.push({
        el,
        kind: isTile
          ? "folder"
          : isHead
            ? "head"
            : isPlane || isStrip
              ? "plane"
              : "site",
        folderId:
          el.getAttribute("data-zef-folder") ||
          // У полосы иконок папка лежит в data-zef-owner — своя папка,
          // в которую полоса и вложена.
          el.getAttribute("data-zef-owner") ||
          null,
        area: rect.width * rect.height,
        rect,
      });
    }
    // Самая маленькая цель — самая точная: вложенная шапка и вложенная
    // плоскость лежат внутри плоскости родителя, и её видно раньше.
    items.sort((a, b) => a.area - b.area);
    return items;
  }

  /** Куда целился пользователь.
   *
   *  Сначала ищем по свежим замерам целей (см. measureDragTargets): сетку
   *  «Важных» во время перетаскивания двигает сам Zen, и снимок раскладки
   *  устаревает. Снимок оставлен запасным вариантом — на случай, если панель
   *  сейчас не на месте.
   *
   *  Если рядом плитки нет — значит, целился в пустое место, и мы не мешаем
   *  Zen. */
  function resolveDropTarget(event) {
    const x = event.clientX;
    const y = event.clientY;

    // Ближайшая цель и точное попадание среди указанных.
    const nearestIn = (items) => {
      let nearest = null;
      for (const item of items) {
        if (item.el === draggedTab) {
          continue;
        }
        const r = item.rect;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return { item: item, dist: 0 };
        }
        const dist = Math.hypot(
          x - (r.left + r.right) / 2,
          y - (r.top + r.bottom) / 2
        );
        if (!nearest || dist < nearest.dist) {
          nearest = { item: item, dist: dist };
        }
      }
      return nearest;
    };

    const live = nearestIn(measureDragTargets());
    if (live && live.dist === 0) {
      return live.item;
    }
    const old = nearestIn(dragLayout || []);
    if (old && old.dist === 0) {
      return old.item;
    }
    const nearest = live && (!old || live.dist <= old.dist) ? live : old;
    if (nearest && nearest.dist <= 10) {
      // Совсем рядом с плиткой — считаем промахом по краю и берём её.
      // Но только внутри панели: бросок в пустое место (или вовсе мимо
      // панели) — это не наша зона, там разбирается Zen.
      const cRect = getContainer()?.getBoundingClientRect();
      if (
        cRect &&
        x >= cRect.left &&
        x <= cRect.right &&
        y >= cRect.top &&
        y <= cRect.bottom
      ) {
        return nearest.item;
      }
    }
    return null;
  }

  /** Запомнить, что произошло с последним броском. Читается из консоли:
   *  window.__zenEssentialsFolders.lastDrop */
  function recordDrop(info) {
    lastDrop = Object.assign({ at: Date.now() }, info || {});
    try {
      if (window[INSTANCE_KEY]) {
        window[INSTANCE_KEY].lastDrop = lastDrop;
      }
    } catch (e) {}
  }

  /** Подсветить цель броска. Тот же вид, что и раньше, но цель берётся
   *  из снимка раскладки, а не из того элемента, под которым оказался
   *  курсор: в Zen под курсором едет его собственная копия вкладки. */
  function markDropTarget(target, event) {
    clearDropMarks();
    if (!target) {
      return;
    }
    if (target.kind === "site") {
      const zone = dropZoneOf(event, target.el, 0.5);
      target.el.classList.add(zone === 0 ? "zef-drop-before" : "zef-drop-after");
      return;
    }
    if (target.kind === "head" || target.kind === "plane") {
      target.el.classList.add("zef-drop-over");
      return;
    }
    const kind = dragKind(event);
    const zone = kind === "site" ? 1 : dropZoneOf(event, target.el, 0.3);
    target.el.classList.add(
      zone === 0 ? "zef-drop-before" : zone === 2 ? "zef-drop-after" : "zef-drop-into"
    );
  }

  /** Выполнить бросок по найденной цели: плитка сайта — внутрь папки,
   *  плитка папки — в неё же или рядом, иконка — перестановка внутри. */
  function applyDropToTarget(event, target) {
    if (!target) {
      return false;
    }
    const kind = dragKind(event);
    if (target.kind === "site") {
      const info = handleDropOnSite(event, target.el) || {};
      recordDrop(Object.assign({ result: "reordered", target: "site" }, info));
      return true;
    }
    const folder = folderById(target.folderId);
    if (!folder) {
      recordDrop({ result: "no-folder", target: target.kind });
      return false;
    }
    // Шапка или цветная область открытой папки — бросаем внутрь неё.
    if (target.kind === "head" || target.kind === "plane") {
      handleDropIntoFolder(event, folder);
      recordDrop({ result: "into-folder", target: target.kind, folder: folder.id });
      return true;
    }
    if (kind === "folder") {
      const zone = dropZoneOf(event, target.el, 0.3);
      handleFolderDropOnTile(event, folder, zone);
      recordDrop({ result: "folder-drop", target: "tile", folder: folder.id, zone: zone });
      return true;
    }
    handleSiteDropOnTile(event, folder);
    recordDrop({ result: "site-into-folder", target: "tile", folder: folder.id });
    return true;
  }

  /** Бросок по снимку: плитка папки — внутрь, плитка сайта — рядом. */
  function dropBySnapshot(event) {
    const target = resolveDropTarget(event);
    if (!target) {
      return false;
    }
    return applyDropToTarget(event, target);
  }

  /** Вкладка, которую сейчас тянут мышью. */
  function draggedTabFrom(event) {
    const types = ["application/x-moz-tab", "Tabs", "text/x-moz-tab"];
    for (const type of types) {
      try {
        const tab = event.dataTransfer.mozGetDataAt(type, 0);
        if (tab && typeof tab.hasAttribute === "function") {
          return tab;
        }
      } catch (e) {}
    }
    return null;
  }

  /** Что именно тянут: папку или плитку сайта. */
  function dragKind(event) {
    if (draggedFolderId) {
      return "folder";
    }
    if (draggedTab) {
      return "site";
    }
    // Вкладку могли начать тянуть в сайдбаре — там наш обработчик
    // dragstart её иногда не видит. Тогда бросок выглядит как «сюда
    // нельзя», хотя папка вполне могла бы принять вкладку. Достаём
    // вкладку прямо из буфера перетаскивания.
    const tab = draggedTabFrom(event);
    if (tab) {
      draggedTab = tab;
      draggedTabIsEssential = Boolean(tab?.hasAttribute?.("zen-essential"));
      return "site";
    }
    try {
      const types = event.dataTransfer?.types;
      if (types) {
        for (const type of types) {
          const name = String(type);
          if (name.includes("x-zef-folder")) {
            return "folder";
          }
          // Firefox так помечает перетаскивание вкладки.
          if (
            name === "application/x-moz-tab" ||
            name === "text/x-moz-tab" ||
            name === "Tabs"
          ) {
            return "site";
          }
        }
      }
      if (event.dataTransfer?.getData?.("application/x-zef-folder")) {
        return "folder";
      }
    } catch (e) {}
    return null;
  }

  /** Куда попали курсором: 0 — перед, 1 — внутрь, 2 — после. */
  function dropZoneOf(event, element, edge) {
    const rect = element.getBoundingClientRect();
    if (!rect.width) {
      return 1;
    }
    const ratio = (event.clientX - rect.left) / rect.width;
    if (ratio < edge) {
      return 0;
    }
    if (ratio > 1 - edge) {
      return 2;
    }
    return 1;
  }

  /** Убрать все подсветки зон приёма. */
  function clearDropMarks() {
    const container = getContainer();
    if (!container) {
      return;
    }
    for (const element of container.querySelectorAll(
      ".zef-drop-before, .zef-drop-after, .zef-drop-into, .zef-drop-over, .zef-drop-site"
    )) {
      element.classList.remove(
        "zef-drop-before",
        "zef-drop-after",
        "zef-drop-into",
        "zef-drop-over",
        "zef-drop-site"
      );
    }
  }

  /** Убрать вкладку из папки — не выбрасывая из неё остальные вкладки
   *  того же домена. Если домен в папке остаётся нужным, адрес просто
   *  исключается точным правилом. */
  function removeSiteFromFolder(folder, url) {
    if (!folder) {
      return false;
    }
    const host = hostOf(url);
    const match = bestRuleMatch(folder, url);
    if (!match) {
      return false;
    }
    const sites = folder.sites || (folder.sites = []);
    const rule = sites[match.ruleIndex];
    const isHostRule = !normalizeSite(ruleBody(rule)).includes("/");
    if (isHostRule) {
      // Домен целиком. Если в папке остаются другие вкладки домена —
      // домен остаётся, а уходит только эта вкладка.
      if (hasOtherTabsForHost(folder, host, url)) {
        const exclude = specificRuleFor(url);
        if (exclude) {
          addExclusion(folder, exclude);
          return true;
        }
      }
      // Других вкладок нет — домен покидает папку целиком.
      folder.sites = sites.filter(item => {
        if (isExclusionRule(item)) {
          return ruleHost(item) !== host;
        }
        return normalizeSite(ruleBody(item)) !== host;
      });
      return true;
    }
    // Точечное правило переезжает вместе с вкладкой.
    folder.sites = sites.filter(item => item !== rule);
    return true;
  }

  /** Сделать обычную вкладку «Важной», чтобы она появилась в панели. */
  function pinTabAsEssential(tab) {
    if (!tab || tab.hasAttribute?.("zen-essential")) {
      return false;
    }
    try {
      const manager = window.gZenPinnedTabManager;
      if (manager?.addToEssentials) {
        manager.addToEssentials(tab);
        return true;
      }
    } catch (e) {
      console.warn("[ZEF] could not pin the tab", e);
    }
    return false;
  }

  /** Переставить правило папки на другое место — порядок плиток внутри папки. */
  function reorderInFolder(folder, url, targetRuleIndex, before) {
    const sites = folder.sites || (folder.sites = []);
    const existing = bestRuleMatch(folder, url);
    if (!existing) {
      return false;
    }
    if (targetRuleIndex < 0 || targetRuleIndex === existing.ruleIndex) {
      return true;
    }
    const moved = sites.splice(existing.ruleIndex, 1)[0];
    let to = targetRuleIndex;
    if (existing.ruleIndex < targetRuleIndex) {
      to -= 1;
    }
    if (!before) {
      to += 1;
    }
    sites.splice(Math.max(0, Math.min(sites.length, to)), 0, moved);
    return true;
  }

  /** Вставить правило на место указанного правила папки. */
  function insertRule(sites, rule, targetRuleIndex, before) {
    // Такое правило уже есть — второй раз не добавляем. Раньше повторный
    // бросок копил копии одного и того же правила, и настройки папок
    // разрастались с каждым броском.
    const same = normalizeSite(rule);
    if (
      sites.some(
        item => !isExclusionRule(item) && normalizeSite(item) === same
      )
    ) {
      return;
    }
    let at = sites.length;
    if (targetRuleIndex >= 0 && targetRuleIndex < sites.length) {
      at = before ? targetRuleIndex : targetRuleIndex + 1;
    }
    sites.splice(Math.max(0, Math.min(sites.length, at)), 0, rule);
  }

  /** Перенести весь домен в папку — когда у адреса нет пути, точнее
   *  домена сделать нельзя. */
  function moveWholeDomain(url, folder) {
    const host = hostOf(url);
    if (!host) {
      return false;
    }
    for (const other of folders) {
      if (other.id !== folder.id) {
        removeHostRule(other, host);
      }
    }
    removeExclusionsFor(folder, url);
    const sites = folder.sites || (folder.sites = []);
    if (
      !sites.some(
        item => !isExclusionRule(item) && normalizeSite(item) === host
      )
    ) {
      sites.push(host);
    }
    return true;
  }

  /** Перенести вкладку в папку.
   *
   *  Переезжает ровно та вкладка, которую тянули:
   *   • если у адреса есть путь — в папку добавляется точечное правило
   *     «домен/путь», а общее правило домена в прежней папке остаётся,
   *     поэтому остальные вкладки домена остаются на своих местах;
   *   • если пути нет — переносится весь домен (точнее не сделать).
   */
  function moveSiteToFolder(url, folder, targetRuleIndex = -1, before = true) {
    const host = hostOf(url);
    if (!host || !folder) {
      return false;
    }
    const source = folderForUrl(url);
    if (source && source.id === folder.id) {
      // Та же папка — просто переставляем плитку внутри неё.
      return reorderInFolder(folder, url, targetRuleIndex, before);
    }
    const specific = specificRuleFor(url);
    if (!specific) {
      return moveWholeDomain(url, folder);
    }
    // Прежняя папка отпускает адрес: точечное правило уходит, общее правило
    // домена остаётся, а сам адрес исключается.
    if (source) {
      removeSiteFromFolder(source, url);
    }
    // Другие папки с правилом на этот домен не должны забрать адрес
    // обратно — гасим их точечным исключением.
    for (const other of folders) {
      if (other.id === folder.id) {
        continue;
      }
      if (bestRuleMatch(other, url)) {
        addExclusion(other, specific);
      }
    }
    // Целевая папка: снимаем старое исключение и добавляем точечное правило.
    removeExclusionsFor(folder, url);
    const sites = folder.sites || (folder.sites = []);
    if (!bestRuleMatch(folder, url)) {
      insertRule(sites, specific, targetRuleIndex, before);
    } else {
      reorderInFolder(folder, url, targetRuleIndex, before);
    }
    return true;
  }

  /** Бросили плитку сайта на плитку папки — сайт переезжает в папку. */
  function handleSiteDropOnTile(event, folder) {
    const tab = draggedTabFrom(event) || draggedTab;
    const url = tab ? tabUrl(tab) : urlFromData(event);
    if (!url) {
      showHint(t("hint.dragFailed"));
      return;
    }
    const source = folderForUrl(url);
    if (source && source.id === folder.id) {
      showHint(t("hint.alreadyIn", { name: folder.name || "…" }));
      return;
    }
    if (moveSiteToFolder(url, folder, -1, true)) {
      persist();
    } else {
      showHint(t("hint.moveFailed"));
    }
    // Обычная вкладка сразу становится «Важной» — и попадает в папку.
    if (tab) {
      pinTabAsEssential(tab);
    }
  }

  /** Бросили папку на плитку папки: в середину — вложить, с краю — поменять
   *  местами среди соседей. */
  function handleFolderDropOnTile(event, target, zone) {
    const source = folderById(draggedFolderId);
    draggedFolderId = null;
    if (!source || !target || source.id === target.id) {
      return;
    }
    if (zone === 1) {
      nestFolder(source, target);
      return;
    }
    // Перестановка: новая папка становится соседом той, на которую бросили.
    if (isSelfOrDescendant(source, target)) {
      return;
    }
    placeFolder(source, target.parentId || null, target, zone === 0);
    persist();
  }

  /** Бросили в открытую папку (шапка или зона приёма): сайт — внутрь,
   *  папка — вложенной. */
  function handleDropIntoFolder(event, folder) {
    const kind = dragKind(event);
    if (kind === "folder") {
      const source = folderById(draggedFolderId);
      draggedFolderId = null;
      nestFolder(source, folder);
      return;
    }
    const tab = draggedTabFrom(event) || draggedTab;
    const url = tab ? tabUrl(tab) : urlFromData(event);
    if (!url) {
      return;
    }
    if (moveSiteToFolder(url, folder, -1, true)) {
      persist();
    }
    if (tab) {
      pinTabAsEssential(tab);
    }
  }

  /** Бросили плитку сайта на другую плитку сайта:
   *  та, что в папке, — меняет место внутри своей папки,
   *  та, что свободна, — выходит из папки. */
  function handleDropOnSite(event, targetTab) {
    const tab = draggedTabFrom(event) || draggedTab;
    if (!tab || tab === targetTab) {
      return { error: "нечего перетаскивать" };
    }
    const url = tabUrl(tab);
    if (!url) {
      return { error: "нет адреса вкладки" };
    }
    const targetUrl = tabUrl(targetTab);
    const targetFolder = folderForUrl(targetUrl);
    const source = folderForUrl(url);
    if (!targetFolder) {
      // Цель — свободная плитка: перетаскиваемый выходит из своей папки.
      const current = source;
      if (current && removeSiteFromFolder(current, url)) {
        persist();
      }
      return { url: url, targetUrl: targetUrl, source: current?.id || null,
               result: "out-of-folder" };
    }
    const targetRuleIndex = bestRuleMatch(targetFolder, targetUrl)?.ruleIndex ?? -1;
    const before = dropZoneOf(event, targetTab, 0.5) === 0;
    const moved = moveSiteToFolder(url, targetFolder, targetRuleIndex, before);
    if (moved) {
      persist();
    }
    pinTabAsEssential(tab);
    return { url: url, targetUrl: targetUrl, source: source?.id || null,
             targetFolder: targetFolder.id, ruleIndex: targetRuleIndex,
             before: before, moved: moved };
  }

  /** Бросили на разделитель: вкладка остаётся «Важной», но уходит из папки,
   *  а папка — выходит на верхний уровень. */
  function handleDropOnDivider(event) {
    const kind = dragKind(event);
    if (kind === "folder") {
      const source = folderById(draggedFolderId);
      draggedFolderId = null;
      if (!source) {
        return;
      }
      placeFolder(source, null, null, false);
      persist();
      return;
    }
    const tab = draggedTabFrom(event) || draggedTab;
    if (!tab) {
      return;
    }
    const url = tabUrl(tab);
    const folder = folderForUrl(url);
    if (folder && removeSiteFromFolder(folder, url)) {
      persist();
    }
    pinTabAsEssential(tab);
  }

  /** Адрес из буфера обмена — если вкладку тянуть неоткуда. */
  function urlFromData(event) {
    try {
      return (
        event.dataTransfer?.getData("text/uri-list") ||
        event.dataTransfer?.getData("text/plain") ||
        ""
      );
    } catch (e) {
      return "";
    }
  }

  /* ------------------------------------------------------------------ *
   * Короткая подсказка
   *
   * Если бросок не сработал, мод раньше молчал: непонятно было, сломалось
   * перетаскивание или вкладка уже лежит в этой папке. Теперь объясняем.
   * ------------------------------------------------------------------ */

  function showHint(text) {
    if (!settings.hints) {
      return;
    }
    if (!hintEl) {
      hintEl = document.createElement("div");
      hintEl.className = "zef-hint";
      document.documentElement.appendChild(hintEl);
    }
    hintEl.textContent = text;
    hintEl.classList.add("zef-hint-show");
    if (hintTimer) {
      clearTimeout(hintTimer);
    }
    hintTimer = setTimeout(() => {
      hintEl?.classList.remove("zef-hint-show");
    }, 2600);
  }

  /* ------------------------------------------------------------------ *
   * Плитки сайтов — приём перетаскивания
   * ------------------------------------------------------------------ */

  /** Настоящая вкладка Zen умеет принимать перетаскивание: с её помощью
   *  переставляют плитки сайтов внутри папки и переносят их между папками. */
  function attachSiteDropHandlers(tab) {
    if (!tab || tab.hasAttribute("zef-drop-ready")) {
      return;
    }
    tab.setAttribute("zef-drop-ready", "true");
    tab.addEventListener("dragover", event => {
      if (dragKind(event) !== "site") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      const zone = dropZoneOf(event, tab, 0.5);
      tab.classList.remove("zef-drop-before", "zef-drop-after");
      tab.classList.add(zone === 0 ? "zef-drop-before" : "zef-drop-after");
    });
    tab.addEventListener("dragleave", event => {
      if (event.relatedTarget && tab.contains(event.relatedTarget)) {
        return;
      }
      tab.classList.remove("zef-drop-before", "zef-drop-after");
    });
    tab.addEventListener("drop", event => {
      if (dragKind(event) !== "site") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      tab.classList.remove("zef-drop-before", "zef-drop-after");
      if (tab === draggedTab) {
        // Бросок попал в «пустое место», которое Zen вставил в сетку под
        // перетаскиваемую вкладку. Значит, цель была другой — ищем её
        // по снимку раскладки, сделанному в начале перетаскивания.
        dropBySnapshot(event);
        return;
      }
      handleDropOnSite(event, tab);
    });
  }

  /* ------------------------------------------------------------------ *
   * Меню плитки
   * ------------------------------------------------------------------ */

  function ensureTilePanel() {
    if (tilePopup) {
      return;
    }
    // Отдельный menupopup (не panel с меню внутри) — так меню рисуется
    // нативно, с клавиатурой и закрытием по клику вне.
    tilePopup = document.createXULElement("menupopup");
    tilePopup.className = "zef-tile-menu";
    tilePopup.setAttribute("position", "after_start");
    document.documentElement.appendChild(tilePopup);
  }

  function openTileMenu(folder, anchor) {
    ensureTilePanel();
    tilePopup.replaceChildren();

    const addItem = (label, action, icon) => {
      const item = document.createXULElement("menuitem");
      item.setAttribute("label", label);
      if (icon) {
        item.setAttribute("image", icon);
      }
      item.addEventListener("command", () => setTimeout(action, 0));
      tilePopup.appendChild(item);
      return item;
    };
    const addSeparator = () =>
      tilePopup.appendChild(document.createXULElement("menuseparator"));

    const isOpen = !collapsed.has(folder.id);
    addItem(isOpen ? t("folder.collapse") : t("folder.expand"), () => toggleFolder(folder.id));
    addItem(t("folder.openAll"), () => openFolderTabs(folder));
    addSeparator();
    addItem(
      folder.pinned ? t("folder.unpin") : t("folder.pin"),
      () => {
        folder.pinned = !folder.pinned;
        persist();
      }
    );
    addItem(t("folder.rename"), () => openFolderDialog(folder, "name"));
    addItem(t("folder.icon"), () => pickIcon(folder));
    addItem(t("folder.color"), () => openFolderDialog(folder, "color"));
    addSeparator();

    // Вложение папки в другую — тем же способом, что и перетаскивание.
    const candidates = folders.filter(
      item => item.id !== folder.id && !isSelfOrDescendant(folder, item)
    );
    if (candidates.length) {
      const sub = document.createXULElement("menu");
      sub.setAttribute("label", t("folder.nest"));
      const subPopup = document.createXULElement("menupopup");
      sub.appendChild(subPopup);
      for (const candidate of candidates) {
        const entry = document.createXULElement("menuitem");
        entry.setAttribute("label", candidate.name || t("folder.unnamed"));
        entry.setAttribute("image", candidate.icon || DEFAULT_ICON);
        entry.addEventListener("command", () => {
          nestFolder(folder, candidate);
        });
        subPopup.appendChild(entry);
      }
      tilePopup.appendChild(sub);
    }
    if (folder.parentId) {
      addItem(t("folder.topLevel"), () => {
        placeFolder(folder, null, null, false);
        persist();
      });
    }

    addSeparator();
    addItem(t("folder.sites"), () => openFolderDialog(folder, "sites"));
    addItem(t("folder.delete"), () => deleteFolder(folder));
    addSeparator();
    addItem(t("folder.expandAll"), () => setAllCollapsed(false));
    addItem(t("folder.collapseAll"), () => setAllCollapsed(true));
    addSeparator();
    addItem(t("menu.modSettings"), () => openSettingsDialog(null, true));

    // XUL-меню не умеет надёжно позиционироваться по HTML-якорю,
    // поэтому считаем координаты экрана сами и открываем меню рядом с плиткой.
    try {
      const rect = anchor.getBoundingClientRect();
      const x = (window.mozInnerScreenX ?? window.screenX ?? 0) + rect.left;
      const y = (window.mozInnerScreenY ?? window.screenY ?? 0) + rect.bottom;
      tilePopup.openPopupAtScreen(x, y, false, null);
    } catch (e) {
      // Запасной путь: якорь по элементу (меню может «отъехать» вверх).
      try {
        tilePopup.openPopup(anchor, "after_start", 0, 0, false, false);
      } catch (e2) {}
    }
  }

  /** Правый клик по плитке. Ловим на уровне окна в фазе захвата —
   *  так событие не перехватят другие обработчики Zen. */
  function onWindowContextMenu(event) {
    const target = event.target;
    // Правый клик работает и по плитке, и по шапке развёрнутой папки —
    // иначе закреплённую (развёрнутую) папку невозможно открепить.
    const tile = target?.closest?.(".zef-tile, .zef-head");
    if (!tile) {
      return;
    }
    const folderId = tile.getAttribute("data-zef-folder");
    const folder = folders.find(item => item.id === folderId);
    if (!folder) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    openTileMenu(folder, tile);
  }

  /** Выбор иконки — переиспользуем штатный пикер Zen. */
  function pickIcon(folder) {
    const anchor =
      document.querySelector(`.zef-tile[data-zef-folder="${folder.id}"]`) ||
      getContainer();
    try {
      if (window.gZenEmojiPicker?.open) {
        gZenEmojiPicker.open(anchor, {
          onlySvgIcons: true,
          emojiAsSVG: false,
          allowNone: false,
          closeOnSelect: true,
          onSelect: icon => {
            if (icon) {
              folder.icon = icon;
              persist();
            }
          },
        });
        return;
      }
    } catch (e) {
      console.warn("[ZEF] Zen icon picker unavailable", e);
    }
    // Запасной вариант: простой перебор нескольких иконок Zen.
    const fallback = [
      "folder.svg",
      "grid-2x2.svg",
      "rocket.svg",
      "star.svg",
      "bookmark.svg",
      "code.svg",
      "mail.svg",
      "layers.svg",
    ];
    const current = String(folder.icon || "");
    const index = fallback.findIndex(name => current.endsWith(name));
    const next = fallback[(index + 1) % fallback.length];
    folder.icon = `chrome://browser/skin/zen-icons/selectable/${next}`;
    persist();
  }

  /* ------------------------------------------------------------------ *
   * Диалог папки
   * ------------------------------------------------------------------ */

  function newFolderId() {
    return (
      "f" +
      Date.now().toString(36) +
      Math.floor(Math.random() * 1e6).toString(36)
    );
  }

  /** Все домены, которые сейчас висят в «Важных». */
  function currentSites() {
    const container = getContainer();
    const map = new Map();
    if (!container) {
      return [];
    }
    for (const tab of essentialTabs(container)) {
      const url = tabUrl(tab);
      const host = hostOf(url);
      if (!host || map.has(host)) {
        continue;
      }
      map.set(host, {
        host,
        url,
        image: tab.getAttribute("image") || "",
        title: tab.getAttribute("title") || host,
      });
    }
    return [...map.values()].sort((a, b) => a.host.localeCompare(b.host));
  }

  function ensureDialogPanel() {
    if (dialogPanel) {
      return dialogPanel;
    }
    dialogPanel = document.createXULElement("panel");
    dialogPanel.className = "zef-dialog-panel";
    document.documentElement.appendChild(dialogPanel);
    return dialogPanel;
  }

  /** Приводит цвет к виду #rrggbb. Понимает #rgb, #rrggbb и голый код
   *  без решётки. Если код неправильный — возвращает null. */
  function normalizeHex(value) {
    let hex = String(value ?? "")
      .trim()
      .replace(/^#/, "")
      .toLowerCase();
    if (/^[0-9a-f]{3}$/.test(hex)) {
      hex = hex
        .split("")
        .map(c => c + c)
        .join("");
    }
    if (!/^[0-9a-f]{6}$/.test(hex)) {
      return null;
    }
    return `#${hex}`;
  }

  /** HSL → #rrggbb. Нужен для кнопки «случайный цвет». */
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = v =>
      Math.round(255 * v)
        .toString(16)
        .padStart(2, "0");
    return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
  }

  /** #rrggbb → {h, s, l}: оттенок в градусах, насыщенность и светлота
   *  в процентах. Нужно, чтобы показать выбранный цвет в пипетке. */
  function hexToHsl(value) {
    const hex = normalizeHex(value);
    if (!hex) {
      return { h: 0, s: 0, l: 0 };
    }
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    let h = 0;
    let s = 0;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      } else if (max === g) {
        h = ((b - r) / d + 2) * 60;
      } else {
        h = ((r - g) / d + 4) * 60;
      }
    }
    return { h, s: s * 100, l: l * 100 };
  }

  function openFolderDialog(folder, focus = "name", anchor = null) {
    const isNew = !folder;
    const model = isNew
      ? {
          id: newFolderId(),
          name: "",
          color: DEFAULT_COLOR,
          icon: DEFAULT_ICON,
          parentId: null,
          sites: pendingSite ? [pendingSite] : [],
        }
      : {
          id: folder.id,
          name: folder.name || "",
          color: folder.color || DEFAULT_COLOR,
          icon: folder.icon || DEFAULT_ICON,
          parentId: folder.parentId || null,
          sites: [...(folder.sites || [])],
        };
    if (isNew) {
      pendingSite = null;
    }

    const panel = ensureDialogPanel();
    panel.replaceChildren();

    const box = document.createElement("div");
    box.className = "zef-dialog";

    const title = document.createElement("div");
    title.className = "zef-dialog-title";
    title.textContent = isNew ? t("folder.new") : t("folder.plural");
    box.appendChild(title);

    // Место для ошибки: если настройки не записались, скажем об этом.
    const errorBox = document.createElement("div");
    errorBox.className = "zef-dialog-error";
    errorBox.hidden = true;
    box.appendChild(errorBox);

    // --- строка: иконка + имя ---
    const head = document.createElement("div");
    head.className = "zef-row";

    const iconButton = document.createElement("button");
    iconButton.className = "zef-icon-button";
    iconButton.type = "button";
    iconButton.title = t("folder.iconButton");
    iconButton.style.backgroundImage = `url("${model.icon}")`;
    iconButton.addEventListener("click", () => {
      try {
        if (window.gZenEmojiPicker?.open) {
          gZenEmojiPicker.open(iconButton, {
            onlySvgIcons: true,
            emojiAsSVG: false,
            allowNone: false,
            closeOnSelect: true,
            onSelect: icon => {
              if (icon) {
                model.icon = icon;
                iconButton.style.backgroundImage = `url("${icon}")`;
              }
            },
          });
          return;
        }
      } catch (e) {}
      const fallback = ["folder.svg", "grid-2x2.svg", "rocket.svg", "star.svg"];
      const index = fallback.findIndex(name => model.icon.endsWith(name));
      const next = fallback[(index + 1) % fallback.length];
      model.icon = `chrome://browser/skin/zen-icons/selectable/${next}`;
      iconButton.style.setProperty("--zef-icon", `url("${model.icon}")`);
    });
    head.appendChild(iconButton);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "zef-input zef-name-input";
    nameInput.placeholder = t("folder.nameLabel");
    nameInput.value = model.name;
    nameInput.addEventListener("input", () => {
      model.name = nameInput.value;
    });
    head.appendChild(nameInput);
    box.appendChild(head);

    // --- цвета ---
    const colors = document.createElement("div");
    colors.className = "zef-swatches";

    // Свой цвет: квадрат оттенка, полоса цвета и поле для точного кода.
    const picker = document.createElement("div");
    picker.className = "zef-picker";

    const svBox = document.createElement("div");
    svBox.className = "zef-picker-sv";
    const svDot = document.createElement("div");
    svDot.className = "zef-picker-dot";
    svBox.appendChild(svDot);

    const hueBox = document.createElement("div");
    hueBox.className = "zef-picker-hue";
    const hueDot = document.createElement("div");
    hueDot.className = "zef-picker-dot";
    hueBox.appendChild(hueDot);

    picker.appendChild(svBox);
    picker.appendChild(hueBox);

    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.className = "zef-input zef-hex-input";
    hexInput.placeholder = "#8b5cf6";
    hexInput.spellcheck = false;
    hexInput.title = t("folder.hexTitle");
    hexInput.value = normalizeHex(model.color) || DEFAULT_COLOR;

    // Текущий выбор: оттенок (градусы), насыщенность и светлота (0..1).
    const startHsl = hexToHsl(model.color);
    let hue = Math.round(startHsl.h) % 360;
    let sat = startHsl.s / 100;
    let light = startHsl.l / 100;

    // Показывает, где выбран цвет: точку на квадрате и на полосе.
    const updatePicker = () => {
      svBox.style.background =
        "linear-gradient(to top, #000, transparent), " +
        `linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`;
      svDot.style.left = `${sat * 100}%`;
      svDot.style.top = `${(1 - light) * 100}%`;
      hueDot.style.left = `${(hue / 360) * 100}%`;
    };

    // Применяет цвет к папке: отмечает совпавший свотч, обновляет
    // предпросмотр, поле кода и точку в пипетке. keepHex — не трогать
    // текст в поле (пользователь ещё печатает код).
    const applyColor = (color, keepHex = false) => {
      model.color = color;
      for (const swatch of colors.querySelectorAll(".zef-swatch")) {
        swatch.classList.toggle(
          "zef-selected",
          swatch.title.toLowerCase() === color.toLowerCase()
        );
      }
      box.style.setProperty("--zef-color", color);
      const hsl = hexToHsl(color);
      hue = Math.round(hsl.h) % 360;
      sat = hsl.s / 100;
      light = hsl.l / 100;
      updatePicker();
      if (!keepHex) {
        hexInput.value = color;
      }
    };

    for (const color of PALETTE) {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "zef-swatch";
      swatch.style.backgroundColor = color;
      swatch.title = color;
      if (color.toLowerCase() === String(model.color).toLowerCase()) {
        swatch.classList.add("zef-selected");
      }
      swatch.addEventListener("click", () => applyColor(color));
      colors.appendChild(swatch);
    }
    box.appendChild(colors);

    // --- свой цвет ---
    const custom = document.createElement("div");
    custom.className = "zef-color-custom";

    const side = document.createElement("div");
    side.className = "zef-color-side";

    hexInput.addEventListener("input", () => {
      const hex = normalizeHex(hexInput.value);
      if (hex) {
        applyColor(hex, true);
      }
    });
    hexInput.addEventListener("change", () => {
      const hex = normalizeHex(hexInput.value);
      if (hex) {
        applyColor(hex);
      } else {
        // Код неправильный — возвращаем прежний цвет.
        hexInput.value = model.color;
      }
    });

    const random = document.createElement("button");
    random.type = "button";
    random.className = "zef-btn zef-color-random";
    random.textContent = t("folder.random");
    random.title = t("folder.randomTitle");
    random.addEventListener("click", () => {
      applyColor(hslToHex(Math.floor(Math.random() * 360), 62, 55));
    });

    side.appendChild(hexInput);
    side.appendChild(random);
    custom.appendChild(picker);
    custom.appendChild(side);
    box.appendChild(custom);

    // Ловим цвет мышью: по квадрату — насыщенность и светлота,
    // по полосе — оттенок.
    const pickFrom = (element, event, kind) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const x = Math.min(
        1,
        Math.max(0, (event.clientX - rect.left) / rect.width)
      );
      const y = Math.min(
        1,
        Math.max(0, (event.clientY - rect.top) / rect.height)
      );
      if (kind === "hue") {
        hue = Math.round(x * 360) % 360;
      } else {
        sat = x;
        light = 1 - y;
      }
      applyColor(hslToHex(hue, sat * 100, light * 100));
    };

    const bindPicker = (element, kind) => {
      element.addEventListener("pointerdown", event => {
        event.preventDefault();
        try {
          element.setPointerCapture(event.pointerId);
        } catch (e) {}
        pickFrom(element, event, kind);
      });
      element.addEventListener("pointermove", event => {
        if (element.hasPointerCapture?.(event.pointerId)) {
          pickFrom(element, event, kind);
        }
      });
    };
    bindPicker(svBox, "sv");
    bindPicker(hueBox, "hue");

    updatePicker();

    // --- сайты ---
    const sitesLabel = document.createElement("div");
    sitesLabel.className = "zef-section-label";
    sitesLabel.textContent = t("folder.sitesLabel");
    box.appendChild(sitesLabel);

    const sitesList = document.createElement("div");
    sitesList.className = "zef-sites";
    const manual = new Set(model.sites);
    // Трогал ли пользователь список сайтов. Если нет — сохраняем папку
    // без изменений в списке: смена цвета или имени не должна его
    // переписывать.
    let sitesTouched = false;

    // Точечные правила («домен/путь») и исключения («!домен/путь») — это
    // отдельные адреса внутри папки. Показываем их своими строками, чтобы
    // было видно и можно было снять галочкой.
    const extraRules = [...manual].filter(
      item =>
        isExclusionRule(item) ||
        normalizeSite(ruleBody(item)).includes("/")
    );

    const addRuleRow = (value, title, image) => {
      const row = document.createElement("label");
      row.className = "zef-site-row zef-site-row-manual";

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = manual.has(value);
      check.addEventListener("change", () => {
        sitesTouched = true;
        if (check.checked) {
          manual.add(value);
        } else {
          manual.delete(value);
        }
      });
      row.appendChild(check);

      if (image) {
        const img = document.createElement("img");
        img.className = "zef-site-icon";
        img.src = image;
        row.appendChild(img);
      }

      const label = document.createElement("span");
      label.className = "zef-site-name";
      label.textContent = title || value;
      row.appendChild(label);

      sitesList.appendChild(row);
    };

    for (const site of currentSites()) {
      const row = document.createElement("label");
      row.className = "zef-site-row";

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = hasHostRule(manual, site.host);
      check.addEventListener("change", () => {
        sitesTouched = true;
        if (check.checked) {
          manual.add(site.host);
        } else {
          // Домен уходит из папки целиком — вместе с точечными правилами.
          for (const item of [...manual]) {
            if (ruleHost(item) === site.host) {
              manual.delete(item);
            }
          }
        }
      });
      row.appendChild(check);

      if (site.image) {
        const img = document.createElement("img");
        img.className = "zef-site-icon";
        img.src = site.image;
        row.appendChild(img);
      }

      const label = document.createElement("span");
      label.className = "zef-site-name";
      label.textContent = site.host;
      row.appendChild(label);

      sitesList.appendChild(row);
    }

    for (const rule of extraRules) {
      addRuleRow(rule, isExclusionRule(rule) ? t("folder.exclusion", { rule }) : rule);
    }
    box.appendChild(sitesList);

    const siteInput = document.createElement("input");
    siteInput.type = "text";
    siteInput.className = "zef-input zef-site-input";
    siteInput.placeholder = t("folder.rulePlaceholder");
    siteInput.addEventListener("keydown", event => {
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      const value = normalizeSite(siteInput.value);
      if (!value) {
        return;
      }
      manual.add(value);
      sitesTouched = true;
      siteInput.value = "";
      const row = document.createElement("label");
      row.className = "zef-site-row zef-site-row-manual";
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = true;
      check.addEventListener("change", () => {
        sitesTouched = true;
        if (check.checked) {
          manual.add(value);
        } else {
          manual.delete(value);
        }
      });
      row.appendChild(check);
      const label = document.createElement("span");
      label.className = "zef-site-name";
      label.textContent = value;
      row.appendChild(label);
      sitesList.appendChild(row);
    });
    box.appendChild(siteInput);

    // --- кнопки ---
    const actions = document.createElement("div");
    actions.className = "zef-actions";

    const save = document.createElement("button");
    save.type = "button";
    save.className = "zef-btn zef-btn-primary";
    save.textContent = t("folder.save");
    const applyChanges = () => {
      // Список сайтов меняем только если пользователь его трогал.
      // Иначе сохранение цвета или имени тихо переписало бы его.
      if (sitesTouched) {
        model.sites = [...manual];
      }
      if (isNew) {
        folders.push(model);
      } else {
        // Обновляем папку на месте: плитки держат ссылку на объект,
        // замена объекта в массиве ломала бы их обработчики.
        const folder = folderById(model.id);
        if (folder) {
          folder.name = model.name;
          folder.color = model.color;
          folder.icon = model.icon;
          if (sitesTouched) {
            folder.sites = model.sites;
          }
        } else {
          folders.push(model);
        }
      }
      // Цвет запоминаем сразу: если преф не запишется, следующая
      // перерисовка не вернёт папке старый цвет.
      pendingColors.set(model.id, model.color);
      const saved = persist();
      // Красим на месте — цвет виден в том же кадре, без ожидания
      // перерисовки сетки.
      paintFolderColor(model.id, model.color);
      if (!saved) {
        // Настройки не записались (список папок не помещается в преф).
        // Говорим об этом и не закрываем диалог.
        showDialogError(
          errorBox,
          t("folder.saveFailed")
        );
        return;
      }
      panel.hidePopup();
    };
    save.addEventListener("click", applyChanges);

    // Ctrl+Enter — сохранить, не тянувшись до кнопки внизу диалога.
    box.addEventListener("keydown", event => {
      if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) {
        return;
      }
      // Enter на кнопке нажал бы её — поэтому отменяем умолчание.
      event.preventDefault();
      event.stopPropagation();
      applyChanges();
    });
    actions.appendChild(save);

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "zef-btn";
    cancel.textContent = t("folder.cancel");
    cancel.addEventListener("click", () => panel.hidePopup());
    actions.appendChild(cancel);

    if (!isNew) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "zef-btn zef-btn-danger";
      remove.textContent = t("folder.remove");
      remove.addEventListener("click", () => {
        deleteFolder(folder);
        panel.hidePopup();
      });
      actions.appendChild(remove);
    }

    box.appendChild(actions);
    panel.appendChild(box);

    const target =
      anchor ||
      document.querySelector(`.zef-tile[data-zef-folder="${model.id}"]`) ||
      getContainer();
    panel.openPopup(target, "after_start", 0, 0, false, false);

    setTimeout(() => {
      nameInput.focus();
      if (focus === "color") {
        colors.querySelector(".zef-swatch")?.focus();
      }
    }, 50);
  }

  /** Показывает ошибку в диалоге папки. */
  function showDialogError(box, text) {
    if (!box) {
      return;
    }
    box.textContent = text;
    box.hidden = false;
  }

  /* ------------------------------------------------------------------ *
   * Пункт в меню вкладки
   * ------------------------------------------------------------------ */

  function installTabContextMenu() {
    const menu = document.getElementById("tabContextMenu");
    if (!menu) {
      setTimeout(installTabContextMenu, 800);
      return;
    }
    if (menu.querySelector("#context_zef-folders")) {
      return;
    }

    const fragment = window.MozXULElement.parseXULToFragment(`
      <menu id="context_zef-folders" hidden="true">
        <menupopup id="context_zef-folders-popup"></menupopup>
      </menu>
    `);

    // Ставим пункт ближе к началу меню, рядом с «Добавить в важное»,
    // иначе он уезжает в конец длинного списка и его не видно.
    const anchor = document.getElementById("context_zen-add-essential");
    if (anchor?.parentNode) {
      anchor.before(fragment);
    } else {
      menu.appendChild(fragment);
    }

    const item = document.getElementById("context_zef-folders");
    item.setAttribute("label", t("menu.intoFolder"));
    const popup = document.getElementById("context_zef-folders-popup");

    // Список пунктов и видимость обновляем, когда открывается всё меню,
    // а не наш подменю — иначе пункт остаётся скрытым.
    const update = () => {
      const tab = window.TabContextMenu?.contextTab;
      const isEssential = Boolean(tab?.hasAttribute("zen-essential"));
      item.hidden = !isEssential;
      popup.replaceChildren();
      if (!isEssential) {
        return;
      }
      for (const folder of folders) {
        const entry = document.createXULElement("menuitem");
        entry.setAttribute("label", folderPath(folder));
        entry.setAttribute("image", folder.icon || DEFAULT_ICON);
        entry.addEventListener("command", () => addTabToFolder(tab, folder));
        popup.appendChild(entry);
      }
      popup.appendChild(document.createXULElement("menuseparator"));
      const create = document.createXULElement("menuitem");
      create.setAttribute("label", t("menu.newFolder"));
      create.addEventListener("command", () => {
        const url = tabUrl(tab);
        pendingSite = hostOf(url);
        setTimeout(() => openFolderDialog(null, "name", null), 0);
      });
      popup.appendChild(create);
    };

    menu.addEventListener("popupshowing", update);
    item.addEventListener("popupshowing", update);
  }

  /* ------------------------------------------------------------------ *
   * Диалог настроек мода
   *
   * Живёт в XUL-панели рядом с диалогом папки. Всё применяется сразу —
   * кнопки «Сохранить» нет: настройка видна на панели в тот же момент.
   * ------------------------------------------------------------------ */

  function ensureSettingsPanel() {
    if (settingsPanel) {
      return settingsPanel;
    }
    settingsPanel = document.createXULElement("panel");
    settingsPanel.className = "zef-dialog-panel zef-settings-panel";
    document.documentElement.appendChild(settingsPanel);
    return settingsPanel;
  }

  /** Строка одной настройки: подпись, поле и единица измерения. */
  function buildSettingRow(item, values) {
    const row = document.createElement("div");
    row.className = "zef-row zef-set-row";

    const label = document.createElement("label");
    label.className = "zef-set-label";
    label.textContent = t(item.labelKey);
    row.appendChild(label);

    const inputId = `zef-set-${item.id}`;
    let input;

    if (item.type === "bool") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.className = "zef-set-check";
      input.checked = Boolean(values[item.id]);
      input.addEventListener("change", () => {
        values[item.id] = input.checked;
        saveSettings(values);
      });
    } else if (item.type === "select") {
      input = document.createElement("select");
      input.className = "zef-set-select";
      for (const option of item.options) {
        const el = document.createElement("option");
        el.setAttribute("value", option.value);
        el.textContent = t(option.labelKey);
        input.appendChild(el);
      }
      input.value = values[item.id];
      input.addEventListener("change", () => {
        values[item.id] = input.value;
        saveSettings(values);
      });
    } else if (item.type === "number") {
      input = document.createElement("input");
      input.type = "number";
      input.className = "zef-set-number";
      input.min = String(item.min);
      input.max = String(item.max);
      input.step = "1";
      input.value = String(values[item.id]);
      input.addEventListener("change", () => {
        let value = Number(input.value);
        if (!Number.isFinite(value)) {
          value = item.def;
        }
        value = Math.min(item.max, Math.max(item.min, Math.round(value)));
        input.value = String(value);
        values[item.id] = value;
        saveSettings(values);
      });
    } else {
      input = document.createElement("input");
      input.type = "text";
      input.className = "zef-input zef-set-text";
      input.value = String(values[item.id]);
      input.addEventListener("change", () => {
        values[item.id] = input.value.trim() || item.def;
        saveSettings(values);
      });
    }

    input.setAttribute("id", inputId);
    label.setAttribute("for", inputId);
    row.appendChild(input);

    if (item.unit) {
      const unit = document.createElement("span");
      unit.className = "zef-set-unit";
      unit.textContent = item.unitKey ? t(item.unitKey) : item.unit;
      row.appendChild(unit);
    }
    return row;
  }

  /** Наполняет панель настроек. */
  function fillSettingsPanel(panel) {
    panel.replaceChildren();

    const box = document.createElement("div");
    box.className = "zef-dialog zef-settings";

    const title = document.createElement("div");
    title.className = "zef-dialog-title";
    title.textContent = t("settings.title");
    box.appendChild(title);

    const values = readSettings();

    for (const group of SETTINGS) {
      const groupBox = document.createElement("div");
      groupBox.className = "zef-settings-group";

      const groupTitle = document.createElement("div");
      groupTitle.className = "zef-settings-group-title";
      groupTitle.textContent = t(group.groupKey);
      groupBox.appendChild(groupTitle);

      for (const item of group.items) {
        groupBox.appendChild(buildSettingRow(item, values));
      }
      box.appendChild(groupBox);
    }

    const buttons = document.createElement("div");
    buttons.className = "zef-dialog-buttons";

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "zef-btn";
    reset.textContent = t("settings.reset");
    reset.addEventListener("click", () => {
      saveSettings(defaultSettings());
      fillSettingsPanel(panel);
    });
    buttons.appendChild(reset);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "zef-btn zef-btn-primary";
    close.textContent = t("settings.close");
    close.addEventListener("click", () => panel.hidePopup());
    buttons.appendChild(close);

    box.appendChild(buttons);
    panel.appendChild(box);
  }

  function openSettingsDialog(anchor = null, fromMenu = false) {
    const panel = ensureSettingsPanel();
    fillSettingsPanel(panel);
    // Якорь: кнопка, которой открыли, — иначе шестерёнка, — иначе панель.
    const target =
      anchor ||
      document.querySelector(".zef-search-settings") ||
      getContainer();
    const show = () => {
      try {
        // У XUL-панели нет showPopup(): открывать её надо через openPopup.
        panel.openPopup(target, "after_start", 0, 0, false, false);
      } catch (e) {
        try {
          panel.openPopup(null, null, Math.round((window.innerWidth || 800) / 2),
                          Math.round((window.innerHeight || 600) / 2));
        } catch (e2) {
          try {
            panel.showPopup();
          } catch (e3) {}
        }
      }
    };
    if (fromMenu) {
      // Из меню: сначала даём меню закрыться, иначе панель спрячется вместе
      // с ним.
      setTimeout(show, 60);
    } else {
      show();
    }
  }


  /** Перерисовывает интерфейс после смены языка. */
  function refreshLanguage() {
    const container = getContainer();
    if (container) {
      ensureSearchRow(container);
      if (searchInput) {
        searchInput.placeholder = t("search.placeholder");
      }
      if (searchRow) {
        const clear = searchRow.querySelector(".zef-search-clear");
        if (clear) {
          clear.title = t("search.clear");
        }
        const gear = searchRow.querySelector(".zef-search-settings");
        if (gear) {
          gear.title = t("settings.title");
        }
      }
      sync(true);
    }
    const menu = document.getElementById("context_zef-folders");
    if (menu) {
      menu.setAttribute("label", t("menu.intoFolder"));
    }
    // Поле правки названия — тоже с новым языком.
    if (inlineEdit?.input) {
      inlineEdit.input.placeholder = t("folder.namePlaceholder");
    }
    if (settingsPanel) {
      fillSettingsPanel(settingsPanel);
    }
  }

  /* ------------------------------------------------------------------ *
   * Активная папка
   *
   * Активной считается папка, в которой лежит текущая вкладка. Её плитка
   * (или шапка открытой папки) получает класс zef-active — по нему CSS
   * рисует индикатор.
   * ------------------------------------------------------------------ */

  /** Папка, которой принадлежит текущая вкладка. */
  function activeFolderId() {
    const tab = gBrowser?.selectedTab;
    if (!tab) {
      return null;
    }
    const attr = tab.getAttribute?.("data-zef-folder");
    if (attr) {
      return attr;
    }
    const url = tabUrl(tab);
    return url ? matchFolderForUrl(url) : null;
  }

  /** Помечает плитку активной папки. */
  function updateActiveFolder() {
    const id = activeFolderId();
    if (id === activeFolder && id && document.querySelector(".zef-active")) {
      // Панель не перестраивалась — обновлять нечего.
      return;
    }
    activeFolder = id;
    for (const el of document.querySelectorAll(".zef-active")) {
      el.classList.remove("zef-active");
    }
    if (!id) {
      return;
    }
    for (const el of document.querySelectorAll(
      ".zef-tile[data-zef-folder], .zef-head[data-zef-folder]"
    )) {
      if (el.getAttribute("data-zef-folder") === id) {
        el.classList.add("zef-active");
      }
    }
  }

  /* ------------------------------------------------------------------ *
   * Наблюдение за DOM
   * ------------------------------------------------------------------ */

  function installObserver() {
    // Наблюдаем за текущим контейнером «Важных». При смене пространства
    // контейнер меняется — переподключаем наблюдение.
    const root = getContainer();
    if (!root) {
      setTimeout(installObserver, 500);
      return;
    }
    if (observedRoot === root) {
      return;
    }
    observer?.disconnect();
    observer = null;
    observedRoot = root;
    observer = new MutationObserver(() => scheduleSync());
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      // zen-essential — вкладка стала «Важной»;
      // discarded и pending — вкладку выгрузили из памяти или вернули;
      // linkedpanel — у выгруженной вкладки панель браузера исчезает:
      // рамка вокруг выгруженной иконки должна появляться сразу.
      attributeFilter: ["zen-essential", "discarded", "pending", "linkedpanel"],
    });
  }

  function onTabOpen() {
    scheduleSync();
  }

  function onTabClose() {
    scheduleSync();
  }

  function onResize() {
    layoutPlanes();
  }

  function onTabSelect() {
    // Индикатор активной папки: она меняется вместе с текущей вкладкой.
    updateActiveFolder();
    const tab = gBrowser?.selectedTab;
    const folderId = tab?.getAttribute("data-zef-folder");
    if (!folderId || !tab.hasAttribute("data-zef-hidden")) {
      return;
    }
    // Выбранная вкладка не должна быть спрятана — раскрываем её папку
    // и всех её родителей, иначе вложенная папка останется под крышкой.
    const set = new Set(readJSONPref(PREF_COLLAPSED, []));
    let changed = false;
    const seen = new Set();
    let current = folderById(folderId);
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      if (set.delete(current.id)) {
        changed = true;
      }
      rememberOpen(current.id);
      current = current.parentId ? folderById(current.parentId) : null;
    }
    if (!changed) {
      return;
    }
    writeJSONPref(PREF_COLLAPSED, [...set]);
    collapsed = set;
    lastSignature = null;
    sync(true);
  }

  /* ------------------------------------------------------------------ *
   * Запуск и очистка
   * ------------------------------------------------------------------ */

  function boot() {
    // Мод могли загрузить дважды. Если прежний экземпляр уже работает —
    // убираем его целиком, иначе в панели будут две строки поиска
    // и два набора плиток.
    try {
      window[INSTANCE_KEY]?.uninstall?.();
    } catch (e) {}
    window[INSTANCE_KEY] = null;

    installObserver();
    installTabContextMenu();
    onWindow("contextmenu", onWindowContextMenu, true);

    // Настройки мода: размеры, индикаторы, раскладка плиток.
    applySettings();
    for (const name of [PREF_ICON_SIZE, PREF_TAB_ICON_SIZE, PREF_SETTINGS]) {
      const onChange = () => {
        applySettings();
        lastSignature = null;
        sync(true);
      };
      Services.prefs.addObserver(name, onChange);
      sizeObservers.push([name, onChange]);
    }
    // Поиск меняем на лету — без перезапуска Zen.
    for (const name of [PREF_SHOW_SEARCH]) {
      const onChange = () => {
        lastSignature = null;
        sync(true);
      };
      Services.prefs.addObserver(name, onChange);
      sizeObservers.push([name, onChange]);
    }

    // Плоскости раскрытых папок — абсолютные элементы. Как только сетка
    // «Важных» перестраивается (Zen открывает место для броска, панель
    // прокрутили, изменилась ширина) — плоскости «отстают» от своих
    // плиток и наезжают на соседние папки. Держим их вровень с содержимым.
    let planeFrame = 0;
    const followPlanes = () => {
      if (planeFrame) {
        return;
      }
      planeFrame = requestAnimationFrame(() => {
        planeFrame = 0;
        layoutPlanes();
        if (dragInProgress) {
          followPlanes();
        }
      });
    };

    // Запоминаем вкладку, которую тянут мышью: из dataTransfer Zen
    // отдаёт только свои внутренние данные, домен проще взять из вкладки.
    onWindow(
      "dragstart",
      event => {
        const tab = event.target?.closest?.(".tabbrowser-tab");
        draggedTab = tab || null;
        draggedTabIsEssential = Boolean(tab?.hasAttribute?.("zen-essential"));
        dragInProgress = true;
        if (draggedTabIsEssential) {
          document.documentElement.classList.add("zef-drag-active");
        }
        // Запоминаем раскладку плиток: во время перетаскивания Zen вставит
        // в сетку пустое место, плитки съедут, и бросок попадёт мимо цели.
        snapshotDragLayout();
        // Пока тащим, Zen перестраивает сетку «Важных» (открывает место
        // для броска) — плоскости должны ехать вместе со своими плитками.
        followPlanes();
      },
      true
    );
    onWindow(
      "dragend",
      () => {
        draggedTab = null;
        draggedTabIsEssential = false;
        draggedFolderId = null;
        dragInProgress = false;
        dragLayout = null;
        lastDragEnd = Date.now();
        document.documentElement.classList.remove("zef-drag-active");
        clearDropMarks();
        // Панель обновим после того, как перетаскивание закончилось.
        if (pendingSync) {
          pendingSync = false;
          scheduleSync(60);
        }
      },
      true
    );

    // --- Перехват броска на окне, в фазе захвата ---
    //
    // Zen перехватывает бросок в панели «Важных»: он подменяет вкладку
    // своей копией (landing element) и едет с ней под курсором. Поэтому
    // событие броска приходит не нашей плитке, а копией Zen — и обработчики
    // на плитках не срабатывают вообще. Окно в фазе захвата — первое, что
    // видит событие, поэтому ловим его здесь, а цель ищем по снимку
    // раскладки, а не по event.target.
    onWindow(
      "dragover",
      event => {
        if (!dragInProgress && !draggedFolderId) {
          return;
        }
        const target = resolveDropTarget(event);
        if (!target) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        try {
          event.dataTransfer.dropEffect = "move";
        } catch (e) {}
        markDropTarget(target, event);
      },
      true
    );
    onWindow(
      "drop",
      event => {
        if (!dragInProgress && !draggedTab && !draggedFolderId) {
          return;
        }
        const target = resolveDropTarget(event);
        if (!target) {
          // Бросок не в нашу зону. Если он вообще был в панели — запомним,
          // чтобы было видно: мод не сработал или это был не наш бросок.
          const container = getContainer();
          const rect = container?.getBoundingClientRect();
          const inPanel =
            rect &&
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          recordDrop({
            result: inPanel ? "no-target" : "outside-panel",
            at: { x: Math.round(event.clientX), y: Math.round(event.clientY) },
            dragged: draggedTab ? "site" : draggedFolderId ? "folder" : "none",
          });
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        clearDropMarks();
        applyDropToTarget(event, target);
      },
      true
    );

    // Бросок иногда «догоняет» кликом: браузер шлёт click сразу после
    // drop. Помечаем момент броски, чтобы папка не свернулась сама.
    onWindow(
      "drop",
      () => {
        lastDragEnd = Date.now();
      },
      true
    );

    gBrowser?.tabContainer?.addEventListener("TabOpen", onTabOpen);
    gBrowser?.tabContainer?.addEventListener("TabClose", onTabClose);
    gBrowser?.addEventListener("TabSelect", onTabSelect);

    // Ширина панели или прокрутка изменились — плоскости папок надо пересчитать.
    onWindow("resize", onResize, true);
    onWindow("scroll", onResize, true);
    // Колесо над панелью папок. Слушатель на окне с capture — он срабатывает
    // раньше Zen. passive:false обязателен: иначе браузер не даст вызвать
    // preventDefault, и прокрутка не перехватится.
    window.addEventListener("wheel", onPanelWheel, {
      capture: true,
      passive: false,
    });
    windowListeners.push(["wheel", onPanelWheel, true]);
    // Пока идёт перетаскивание, следим за сеткой покадрово.
    onWindow(
      "dragover",
      () => {
        if (dragInProgress) {
          followPlanes();
        }
      },
      true
    );

    let attempts = 0;
    const attempt = () => {
      sync(true);
      const container = getContainer();
      if ((!container || !essentialTabs(container).length) && attempts++ < 40) {
        setTimeout(attempt, 500);
      }
    };
    setTimeout(attempt, 800);

    uninstall = () => {
      observer?.disconnect();
      observer = null;
      observedRoot = null;
      for (const [name, onChange] of sizeObservers) {
        Services.prefs.removeObserver(name, onChange);
      }
      sizeObservers.length = 0;
      for (const [type, handler, capture] of windowListeners) {
        window.removeEventListener(type, handler, capture);
      }
      windowListeners.length = 0;
      gBrowser?.tabContainer?.removeEventListener("TabOpen", onTabOpen);
      gBrowser?.tabContainer?.removeEventListener("TabClose", onTabClose);
      gBrowser?.removeEventListener("TabSelect", onTabSelect);
      document.documentElement?.style.removeProperty("--zef-icon-size");
      document.documentElement?.style.removeProperty("--zef-tab-icon-size");
      document.documentElement?.classList.remove("zef-drag-active");
      const container = getContainer();
      for (const child of Array.from(container?.children || [])) {
        if (
          child.classList?.contains("zef-tile") ||
          child.classList?.contains("zef-head") ||
          child.classList?.contains("zef-plane") ||
          child.classList?.contains("zef-divider") ||
          child.classList?.contains("zef-tiles-row") ||
          child.classList?.contains("zef-icon-strip")
        ) {
          // Иконки лежат внутри полосы: сначала вернём их в контейнер,
          // иначе они исчезнут из панели вместе с полосой.
          if (child.classList?.contains("zef-icon-strip")) {
            for (const tab of Array.from(child.children)) {
              container.appendChild(tab);
            }
          }
          child.remove();
        }
      }
      for (const tab of essentialTabs(container)) {
        tab.removeAttribute("data-zef-folder");
        tab.removeAttribute("data-zef-open");
        tab.removeAttribute("data-zef-hidden");
        tab.removeAttribute("zef-drop-ready");
        tab.style.removeProperty("--zef-color");
        tab.style.removeProperty("order");
      }
      tilePopup?.remove();
      dialogPanel?.remove();
      inlineEdit = null;
      searchRow?.remove();
      searchRow = null;
      searchInput = null;
      emptyHint?.remove();
      emptyHint = null;
      document.getElementById("context_zef-folders")?.remove();
    };

    // Регистрируем экземпляр: если мод загрузится ещё раз, новый экземпляр
    // позовёт эту функцию и уберёт всё, что нарисовал текущий.
    // Заодно оставляем наружу несколько функций — ими удобно проверять
    // мод снаружи (например, в макете) и чинить его, не перезагружая Zen.
    window[INSTANCE_KEY] = {
      uninstall,
      updateActiveFolder,
      openSettingsDialog,
      readSettings,
      saveSettings,
      applySettings,
      // Что произошло с последним броском — для разбора, когда
      // перетаскивание не сработало.
      lastDrop,
    };

    try {
      window.addUnloadListener?.(() => uninstall?.());
    } catch (e) {}
  }

  if (document.readyState === "complete") {
    boot();
  } else {
    window.addEventListener("load", boot, { once: true });
  }
})();
