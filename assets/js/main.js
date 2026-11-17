/* Вебтех — Техподдержка 1С-Bitrix: интерактивность страницы */
(function () {
  'use strict';

  /* ---------- Header: состояние скролла ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    header.setAttribute('data-header', window.scrollY > 10 ? 'scrolled' : 'default');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  var toggle = document.querySelector('.header_toggle');
  var mobile = document.querySelector('.header_mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('open');
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });
    var overlay = mobile.querySelector('.header_overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    mobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Попап «Получить консультацию» ---------- */
  var popup = document.getElementById('popup');
  function openPopup() {
    if (!popup) return;
    popup.setAttribute('data-opened', 'yes');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    if (!popup) return;
    popup.setAttribute('data-opened', 'no');
    document.body.style.overflow = '';
  }
  function bindPopupButtons(scope) {
    (scope || document).querySelectorAll('[data-popup-open]').forEach(function (btn) {
      if (btn.__popupBound) return;
      btn.__popupBound = true;
      btn.addEventListener('click', openPopup);
    });
  }
  bindPopupButtons(document);
  document.querySelectorAll('[data-popup-close]').forEach(function (el) {
    el.addEventListener('click', closePopup);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  /* ---------- Отправка форм (демо) ---------- */
  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = 'Отправлено';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
        closePopup();
      }, 1600);
    });
  });

  /* ---------- Аккордеон (FAQ) ---------- */
  document.querySelectorAll('#faq .rowb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.classList.toggle('open', !expanded);
    });
  });

  /* ---------- Мобильные аккордеоны кейсов ---------- */
  document.querySelectorAll('#case-list .case-acc').forEach(function (acc) {
    var rowb = acc.parentElement.querySelector('.rowb');
    if (rowb) {
      rowb.addEventListener('click', function () {
        if (window.innerWidth > 900) return;
        var open = acc.classList.contains('open');
        document.querySelectorAll('#case-list .case-acc.open').forEach(function (a) { a.classList.remove('open'); });
        if (!open) acc.classList.add('open');
      });
    }
  });

  /* ---------- Кейсы: переключение деталей (desktop) ---------- */
  var caseRows = document.querySelectorAll('#case-list .rowb');
  var caseDetail = document.getElementById('case-detail');
  var caseAccs = document.querySelectorAll('#case-list .case-acc');

  function selectCase(index) {
    caseRows.forEach(function (row, i) {
      row.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    var source = caseAccs[index] && caseAccs[index].querySelector('.cdet');
    if (caseDetail && source) {
      caseDetail.innerHTML = source.innerHTML;
      caseDetail.classList.remove('fade');
      void caseDetail.offsetWidth;
      caseDetail.classList.add('fade');
    }
  }
  caseRows.forEach(function (row, i) {
    row.addEventListener('click', function () {
      if (window.innerWidth <= 900) return;
      selectCase(i);
    });
  });

  /* ---------- Кейсы: табы (фильтр списка) ---------- */
  var caseTabs = document.querySelectorAll('#case-tabs button');
  /* Первые два кейса — интернет-магазины, третий — недвижимость */
  var caseGroups = { shop: [0, 1], estate: [2] };
  caseTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      caseTabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      tab.setAttribute('aria-selected', 'true');
      var k = tab.getAttribute('data-k');
      var items = document.querySelectorAll('#case-list > li');
      var firstVisible = -1;
      items.forEach(function (li, i) {
        var show = (caseGroups[k] || []).indexOf(i) !== -1;
        li.style.display = show ? '' : 'none';
        if (show && firstVisible === -1) firstVisible = i;
      });
      if (window.innerWidth > 900 && firstVisible !== -1) selectCase(firstVisible);
    });
  });

  /* ---------- Тарифы: список + детальная карточка ---------- */
  var ARROW_GO = '<span class="go" aria-hidden="true"><svg width="20" height="26" viewBox="0 0 42 52" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l30 23L8 49"></path></svg></span>';
  var tariffs = [
    {
      name: 'Приветственный',
      sub: 'Знакомство с&nbsp;поддержкой без&nbsp;обязательств',
      price: '2&nbsp;700',
      unit: '₽/час',
      tag: '30 мин&nbsp;— минимум',
      desc: 'Удобный старт, чтобы оценить нашу команду. Первые задачи&nbsp;— по&nbsp;фиксированной низкой ставке, без&nbsp;длинного договора.',
      kv: [['30 мин', 'Минимальный объем']]
    },
    {
      name: 'Постоплата',
      sub: 'Оплата по&nbsp;факту потраченных часов',
      price: '3&nbsp;200',
      unit: '₽/час',
      tag: 'Ежемесячный отчёт',
      desc: 'Берём задачи в&nbsp;работу сразу, оплата&nbsp;— по&nbsp;итогам месяца по&nbsp;фактически потраченному времени. По&nbsp;каждому часу присылаем понятный отчёт.',
      kv: [['Ежемесячно', 'Отчёт по&nbsp;часам']]
    },
    {
      name: 'Пакет часов',
      sub: 'Запас часов по&nbsp;выгодной ставке',
      price: '3&nbsp;000',
      unit: '₽/час',
      tag: '20, 40 или 80 часов',
      desc: 'Покупаете пакет 20, 40 или 80 часов и&nbsp;тратите их&nbsp;на&nbsp;любые задачи. Неиспользованные часы переносим на&nbsp;следующий период.',
      kv: [['20 часов', 'Срок действия — 3&nbsp;месяца']]
    },
    {
      name: 'Абонемент',
      sub: 'Постоянное сопровождение проекта',
      price: 'от&nbsp;30&nbsp;000',
      unit: '₽/мес',
      tag: 'SLA 15 мин',
      desc: 'Закрепляем часы и&nbsp;команду под&nbsp;ваш проект: мониторинг 24/7, обновления, приоритетная реакция и&nbsp;консультации без&nbsp;лимита.',
      kv: [['SLA 15 мин', 'Приоритетная реакция'], ['24/7', 'Мониторинг и&nbsp;обновления']]
    }
  ];

  function tariffCard(t) {
    var kv = t.kv.map(function (k) {
      return '<div>' + k[0] + '<small>' + k[1] + '</small></div>';
    }).join('');
    return '<div class="who"><div><b>' + t.name + '</b><span>' + t.sub + '</span></div><span class="tagp">' + t.tag + '</span></div>' +
      '<div class="pr">' + t.price + '<small>' + t.unit + '</small></div>' +
      '<p class="dsc">' + t.desc + '</p>' +
      '<div class="kv">' + kv + '</div>' +
      '<div class="more"><button type="button" class="btn line" data-popup-open>Выбрать тариф</button></div>';
  }

  var tarList = document.getElementById('tar-list');
  var tarDetail = document.getElementById('tar-detail');
  if (tarList && tarDetail) {
    tarList.innerHTML = tariffs.map(function (t, i) {
      return '<li>' +
        '<button type="button" class="rowb" aria-selected="' + (i === 0) + '" data-tar="' + i + '">' +
          '<span class="t">' + t.name + '</span>' +
          '<span class="s">' + t.price + ' ' + t.unit + '</span>' +
          ARROW_GO +
        '</button>' +
        '<div class="acc tar-acc"><div><div class="detail tdet">' + tariffCard(t) + '</div></div></div>' +
      '</li>';
    }).join('');

    var tarRows = tarList.querySelectorAll('.rowb');
    var tarAccs = tarList.querySelectorAll('.tar-acc');

    function selectTariff(index) {
      tarRows.forEach(function (row, i) {
        row.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      tarDetail.innerHTML = tariffCard(tariffs[index]);
      tarDetail.classList.remove('fade');
      void tarDetail.offsetWidth;
      tarDetail.classList.add('fade');
      bindPopupButtons(tarDetail);
    }

    tarRows.forEach(function (row, i) {
      row.addEventListener('click', function () {
        if (window.innerWidth <= 900) {
          var open = tarAccs[i].classList.contains('open');
          tarAccs.forEach(function (a) { a.classList.remove('open'); });
          tarRows.forEach(function (r) { r.setAttribute('aria-expanded', 'false'); });
          if (!open) {
            tarAccs[i].classList.add('open');
            row.setAttribute('aria-expanded', 'true');
          }
          return;
        }
        selectTariff(i);
      });
    });

    selectTariff(0);
  }

  /* ---------- Cookie ---------- */
  var cookie = document.getElementById('cookie');
  var cookieOk = document.getElementById('cookie-ok');
  try {
    if (cookie && !localStorage.getItem('wt_cookie_ok')) cookie.hidden = false;
  } catch (e) {
    if (cookie) cookie.hidden = false;
  }
  if (cookieOk && cookie) {
    cookieOk.addEventListener('click', function () {
      try { localStorage.setItem('wt_cookie_ok', '1'); } catch (e) {}
      cookie.hidden = true;
    });
  }

  /* ---------- Плавный скролл к тарифам ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
