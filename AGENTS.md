# Проект «Сайт WEBTEX»

Промо-страницы студии «Вебтех»: статические HTML-страницы (`index.html`, `stomatologii.html`, `zhk.html`),
общие стили `assets/css/style.css`, общий скрипт `assets/js/main.js`, страничные стили/скрипты
рядом (например, `zhk.css`, `zhk.js`). Референсы-выгрузки: `webtex-support.html`, `kadema-dental.html`.

## Обязательно к прочтению перед вёрсткой

**`STYLEGUIDE.md`** — канонический стилевой гайд: токены цветов, типографика и отступы
в целых пикселях на брейкпоинтах 390 / 768 / 1440, паттерны блоков (список+карточка,
аккордеоны, иконки `.ib`, иллюстрации `.care`), правила JS. Каждая новая страница
переопределяет токены из гайда в своём CSS (образец — `assets/css/zhk.css`).

## Компонент «Гирлянда»

Переиспользуемый компонент: `assets/css/garland.css` + `assets/js/garland.js`.
Разметка — `<div class="garland" data-pin="top|bottom" data-colors="multi|two|one"
data-mode="on|wave|twinkle|chase|off"></div>`; SVG генерирует скрипт. Клик по гирлянде
переключает режимы мигания по кругу, JS API на элементе: `el.garland.setMode/setColors/next/getState`.
Демо-страница с панелью-конструктором — `garland.html`.
