/* Вебтех — Сайты для стоматологий: плавные появления, счётчики, интерактив */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Появление блоков при скролле ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Счётчики в хиро ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = String(target); return; }
    var dur = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Этапы: нумерованный аккордеон ---------- */
  document.querySelectorAll('.phead').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var acc = btn.parentElement.querySelector('.pacc');
      if (!acc) return;
      var open = acc.classList.contains('open');
      acc.classList.toggle('open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---------- Попап для динамически созданных кнопок ---------- */
  function openPopup() {
    var popup = document.getElementById('popup');
    if (!popup) return;
    popup.setAttribute('data-opened', 'yes');
    document.body.style.overflow = 'hidden';
  }
  function bindPopupButtons(scope) {
    (scope || document).querySelectorAll('[data-popup-open]').forEach(function (btn) {
      if (btn.__popupBound) return;
      btn.__popupBound = true;
      btn.addEventListener('click', openPopup);
    });
  }

  /* ---------- Цены: список + детальная карточка ---------- */
  var ARROW_GO = '<span class="go" aria-hidden="true"><svg width="20" height="26" viewBox="0 0 42 52" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l30 23L8 49"></path></svg></span>';
  var plans = [
    {
      name: 'Шаблон лендинга',
      price: '89&nbsp;000',
      unit: '₽ разово',
      per: 'или 6&nbsp;241&nbsp;₽/мес',
      tag: 'Запуск за&nbsp;несколько дней',
      credit: 'Рассрочка: 39&nbsp;900&nbsp;₽&nbsp;×&nbsp;3&nbsp;мес (13&nbsp;300&nbsp;₽/мес)&nbsp;· 54&nbsp;900&nbsp;₽&nbsp;×&nbsp;6&nbsp;мес (9&nbsp;150&nbsp;₽/мес)&nbsp;· 74&nbsp;900&nbsp;₽&nbsp;×&nbsp;12&nbsp;мес (6&nbsp;241&nbsp;₽/мес)',
      feats: [
        'Готов к&nbsp;запуску за&nbsp;несколько дней',
        'Современный дизайн для&nbsp;стоматологии',
        'Всё необходимое для&nbsp;старта уже включено',
        'Соответствует требованиям 152-ФЗ «О&nbsp;персональных данных»'
      ]
    },
    {
      name: 'Многостраничный шаблон',
      price: '179&nbsp;000',
      unit: '₽ разово',
      per: 'или 10&nbsp;800&nbsp;₽/мес',
      tag: 'Готовая структура клиники',
      credit: 'Рассрочка: 39&nbsp;900&nbsp;₽&nbsp;×&nbsp;3&nbsp;мес (13&nbsp;300&nbsp;₽/мес)&nbsp;· 71&nbsp;400&nbsp;₽&nbsp;×&nbsp;6&nbsp;мес (11&nbsp;900&nbsp;₽/мес)&nbsp;· 129&nbsp;600&nbsp;₽&nbsp;×&nbsp;12&nbsp;мес (10&nbsp;800&nbsp;₽/мес)',
      feats: [
        'Готовая структура для&nbsp;услуг, врачей, цен, акций и&nbsp;контактов',
        'Быстрый запуск за&nbsp;счёт проверенного шаблона',
        'Адаптация цветов, шрифтов и&nbsp;контента под&nbsp;стиль клиники',
        'Подходит для&nbsp;SEO-продвижения',
        'Соответствует требованиям законодательства для&nbsp;медицинских организаций, включая 152-ФЗ'
      ]
    },
    {
      name: 'Индивидуальный лендинг',
      price: 'от&nbsp;180&nbsp;000',
      unit: '₽',
      per: '',
      tag: 'Максимальная конверсия',
      credit: '',
      feats: [
        'Индивидуальный дизайн',
        'Максимальная конверсия рекламного трафика',
        'Акцент на&nbsp;преимуществах, врачах и&nbsp;услугах',
        'Идеален для&nbsp;запуска рекламных кампаний',
        'Соответствует требованиям законодательства для&nbsp;медицинских организаций, включая 152-ФЗ'
      ]
    },
    {
      name: 'Корпоративный сайт',
      price: 'от&nbsp;350&nbsp;000',
      unit: '₽',
      per: '',
      tag: 'Развитие клиники',
      credit: '',
      feats: [
        'Полноценный сайт для&nbsp;развития клиники',
        'Современная дизайн-система сокращает сроки и&nbsp;стоимость',
        'Легко масштабируется при&nbsp;появлении новых услуг и&nbsp;врачей',
        'Подходит для&nbsp;SEO-продвижения',
        'Соответствует требованиям законодательства для&nbsp;медицинских организаций, включая 152-ФЗ'
      ]
    },
    {
      name: 'Индивидуальный корпоративный сайт',
      price: 'от&nbsp;650&nbsp;000',
      unit: '₽',
      per: '',
      tag: 'Авторская разработка',
      credit: '',
      feats: [
        'Уникальная концепция и&nbsp;авторский дизайн',
        'Продуманный пользовательский опыт',
        'Реализация любого функционала и&nbsp;интеграций',
        'Подчёркивает уровень клиники и&nbsp;выделяет её&nbsp;среди конкурентов',
        'Подходит для&nbsp;SEO-продвижения',
        'Соответствует требованиям законодательства для&nbsp;медицинских организаций, включая 152-ФЗ'
      ]
    }
  ];

  function priceCard(p) {
    var feats = p.feats.map(function (f) { return '<li>' + f + '</li>'; }).join('');
    return '<div class="who"><div><b>' + p.name + '</b><span>' + (p.per || 'под ключ') + '</span></div><span class="tagp">' + p.tag + '</span></div>' +
      '<div class="pr">' + p.price + '<small>' + p.unit + '</small></div>' +
      (p.credit ? '<span class="credit">' + p.credit + '</span>' : '') +
      '<ul class="feats">' + feats + '</ul>' +
      '<div class="more"><button type="button" class="btn line" data-popup-open>Заказать</button></div>';
  }

  var priceList = document.getElementById('price-list');
  var priceDetail = document.getElementById('price-detail');
  if (priceList && priceDetail) {
    priceList.innerHTML = plans.map(function (p, i) {
      return '<li>' +
        '<button type="button" class="rowb" aria-selected="' + (i === 0) + '" data-plan="' + i + '">' +
          '<span class="t">' + p.name + '</span>' +
          '<span class="s">' + p.price + ' ' + p.unit + '</span>' +
          ARROW_GO +
        '</button>' +
        '<div class="acc price-acc"><div><div class="detail tdet">' + priceCard(p) + '</div></div></div>' +
      '</li>';
    }).join('');

    var priceRows = priceList.querySelectorAll('.rowb');
    var priceAccs = priceList.querySelectorAll('.price-acc');

    function selectPlan(index) {
      priceRows.forEach(function (row, i) {
        row.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      priceDetail.innerHTML = priceCard(plans[index]);
      priceDetail.classList.remove('fade');
      void priceDetail.offsetWidth;
      priceDetail.classList.add('fade');
      bindPopupButtons(priceDetail);
    }

    priceRows.forEach(function (row, i) {
      row.addEventListener('click', function () {
        if (window.innerWidth <= 900) {
          var open = priceAccs[i].classList.contains('open');
          priceAccs.forEach(function (a) { a.classList.remove('open'); });
          priceRows.forEach(function (r) { r.setAttribute('aria-expanded', 'false'); });
          if (!open) {
            priceAccs[i].classList.add('open');
            row.setAttribute('aria-expanded', 'true');
          }
          return;
        }
        selectPlan(i);
      });
    });

    selectPlan(0);
  }
})();
