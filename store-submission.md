# Заявка на публикацию мода

Готовый текст для заявок. Ничего придумывать на месте не нужно — скопируйте
в поле формы.

## 1. Sine Store — маркетплейс модов (главный)

Адрес: <https://github.com/sineorg/store/issues/new?template=add-theme.yml>

- **Title:** `[add-theme]: Essentials Folders`
- **Theme Homepage:** `https://github.com/danonchek51/zen-essentials-folders`

Больше ничего заполнять не нужно — в шаблоне одно поле.

Если модераторы попросят пояснение, вот готовый текст:

> **Essentials Folders** — плитки-папки для сетки «Важных» (Essentials) в Zen Browser.
>
> Что умеет:
> - вложенные папки любой глубины, перетаскивание вкладок и плиток мышью;
> - поиск по папкам, пинка папки вверх, кнопка «+» для новой папки;
> - свой диалог настроек: 21 параметр в четырёх группах (вид плиток, сетка
>   иконок, индикаторы, поведение) — применяется сразу;
> - индикатор активной папки: та папка, где лежит текущая вкладка, помечается
>   и мягко пульсирует (свечение рамки, точка, уголок или звёздочка);
> - переносится ровно одна вкладка, а не весь сайт.
>
> Мод ничего не переносит и не удаляет: вкладки остаются обычными вкладками Zen.
> Исходники открытые, MIT.
>
> **Установка:** из маркетплейса Sine (Настройки → Sine Mods → Marketplace)
> или «Установить из репозитория» со ссылкой
> `https://github.com/danonchek51/zen-essentials-folders`.

## 2. Официальный реестр Zen — не подаём

<https://zen-browser.app/mods/> заполняется автоматически: бот из
`zen-browser/theme-store` сам собирает `theme.json` из полей формы, и в нём
есть только `style` (CSS), `readme`, `image` и `preferences`. Поля `scripts`
там нет, а установщик Zen скачивает только `chrome.css`, `readme.md` и
`preferences.json`.

Наш мод без скрипта не работает: плитки рисует JavaScript. Поэтому в этот
реестр заявку не подаём — правильная площадка для модов со скриптами это
Sine Store (раздел 1).

Если формат реестра расширят и в `theme.json` появится `scripts`, заявка
оформляется по шаблону `create-theme`
(<https://github.com/zen-browser/theme-store/issues/new>):

- **Name:** `Essentials Folders` (18 символов, лимит 25) ✔
- **Description:** `Folder tiles for Zen Essentials: nesting, drag & drop, search and settings.` (75 символов, лимит 100) ✔
- **Homepage:** `https://github.com/danonchek51/zen-essentials-folders`
- **Image:** PNG 600×400 по HTTPS (живой снимок мода в Zen)
- **Theme Styles:** содержимое `chrome.css` (без обёртки `@-moz-document url-prefix('chrome://')`)
- **Readme:** содержимое `README.md`
- **Preferences:** содержимое `preferences.json`

Скриншот 600×400 снимается из живого Zen после перезапуска с установленной
версией мода.
