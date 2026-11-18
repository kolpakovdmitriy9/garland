/* ============================================================
   Вебтех — компонент «Гирлянда» (assets/js/garland.js)
   Разметка: <div class="garland" data-pin="top|bottom" data-colors="multi|two|one"
                  data-mode="on|wave|twinkle|chase|off"></div>
   Клик по гирлянде — следующий режим мигания.
   API на элементе: el.garland.setMode(m), .setColors(sheme,a,b), .next(), .getState()
   ============================================================ */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MODES = ['on', 'wave', 'twinkle', 'chase', 'off'];
  var PALETTE = ['#FF3B30', '#FFB340', '#34C759', '#0A84FF']; // multi: красный/жёлтый/зелёный/голубой

  var instance = 0;

  function rnd(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function sizes(width) {
    // шаг лампочек и амплитуда волны — ступенчато по брейкпоинтам гайда
    if (width >= 1440) return { step: 90, amp: 22, leadMin: 12, leadMax: 30 };
    if (width >= 768) return { step: 78, amp: 18, leadMin: 10, leadMax: 26 };
    return { step: 66, amp: 14, leadMin: 8, leadMax: 22 };
  }

  function paint(root, scheme, a, b) {
    if (a) root.style.setProperty('--glow-a', a);
    if (b) root.style.setProperty('--glow-b', b);
    var bulbs = root.querySelectorAll('.g-bulb');
    var shift = 0;
    if (scheme === 'multi') shift = Math.floor(Math.random() * PALETTE.length);
    for (var i = 0; i < bulbs.length; i++) {
      var color;
      if (scheme === 'two') color = i % 2 ? 'var(--glow-b)' : 'var(--glow-a)';
      else if (scheme === 'one') color = 'var(--glow-a)';
      else color = PALETTE[(i + shift) % PALETTE.length];
      bulbs[i].style.setProperty('--bulb', color);
    }
  }

  function build(root) {
    var seedBase = (instance + 1) * 1000 + Math.round(root.clientWidth / 50);
    var rand = rnd(seedBase);
    var W = Math.max(root.clientWidth, 320);
    var S = sizes(W);
    // вертикальный масштаб: провод всегда на всю ширину, лампочки и провисание — масштабируются
    var k = parseFloat(root.dataset.hscale);
    if (!(k > 0)) k = 1;
    var amp = S.amp * k, leadMin = S.leadMin * k, leadMax = S.leadMax * k;
    var n = Math.max(5, Math.round(W / S.step));
    var gap = W / n;
    var midY = amp + 14;
    var H = midY + amp + leadMax + 34 * k;
    var phase = rand() * Math.PI * 2;
    var freq = (Math.PI * 2 * (1.5 + rand())) / W;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', focusable: 'false' });

    // провод — плавная волна, точки каждые ~16px
    var d = '';
    for (var x = 0; x <= W; x += 16) {
      var y = midY + amp * Math.sin(freq * x + phase);
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1) + ' ';
    }
    svg.appendChild(el('path', { d: d.trim(), 'class': 'g-wire' }));

    // лампочки на проводе
    for (var i = 0; i < n; i++) {
      var bx = Math.round(gap * (i + 0.5));
      var wy = midY + amp * Math.sin(freq * bx + phase);
      var lead = Math.round(leadMin + rand() * (leadMax - leadMin));
      var tilt = Math.round((rand() - 0.5) * 10);
      var by = wy + lead + 10 * k;

      var g = el('g', { 'class': 'g-bulb' });
      g.style.setProperty('--i', i);
      g.style.setProperty('--t', (1.6 + rand() * 1.8).toFixed(2) + 's');
      g.style.setProperty('--d', (-rand() * 3).toFixed(2) + 's');
      g.setAttribute('transform', 'translate(' + bx + ' ' + by + ') rotate(' + tilt + ')');

      var leadLine = el('line', { x1: 0, y1: -lead - 10 * k, x2: 0, y2: -10 * k, 'class': 'g-lead' });
      var glow = el('ellipse', { cx: 0, cy: 8 * k, rx: 17 * k, ry: 21 * k, 'class': 'g-glow' });
      var body = el('ellipse', { cx: 0, cy: 8 * k, rx: 8 * k, ry: 11 * k, 'class': 'g-body' });
      var cap = el('ellipse', { cx: 0, cy: -6 * k, rx: 4.5 * k, ry: 3.5 * k, 'class': 'g-cap' });
      var shine = el('ellipse', { cx: -2.5 * k, cy: 4 * k, rx: 2.2 * k, ry: 3.5 * k, 'class': 'g-shine' });

      g.appendChild(glow); g.appendChild(body); g.appendChild(cap); g.appendChild(leadLine); g.appendChild(shine);
      svg.appendChild(g);
    }

    var old = root.querySelector('svg');
    if (old) root.removeChild(old);
    root.appendChild(svg);

    paint(root, root.dataset.colors || 'multi');
  }

  function setMode(root, mode) {
    MODES.forEach(function (m) { root.classList.remove('gmode-' + m); });
    root.classList.add('gmode-' + mode);
    root.dataset.mode = mode;
    root.dispatchEvent(new CustomEvent('garland:mode', { bubbles: true, detail: { mode: mode } }));
  }

  function initGarland(root) {
    if (root.garland) return root.garland;
    instance++;

    root.setAttribute('role', 'button');
    root.setAttribute('tabindex', '0');
    root.setAttribute('aria-label', 'Гирлянда: нажмите, чтобы сменить режим мигания');

    build(root);

    var api = {
      next: function () {
        var cur = MODES.indexOf(root.dataset.mode || 'twinkle');
        setMode(root, MODES[(cur + 1) % MODES.length]);
      },
      setMode: function (m) { if (MODES.indexOf(m) > -1) setMode(root, m); },
      setColors: function (scheme, a, b) {
        if (['multi', 'two', 'one'].indexOf(scheme) === -1) return;
        root.dataset.colors = scheme;
        paint(root, scheme, a, b);
      },
      getState: function () {
        return { mode: root.dataset.mode, colors: root.dataset.colors };
      },
      rebuild: function () {
        build(root);
        setMode(root, root.dataset.mode);
      }
    };
    root.garland = api;

    root.addEventListener('click', api.next);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.next(); }
    });

    setMode(root, MODES.indexOf(root.dataset.mode) > -1 ? root.dataset.mode : 'twinkle');

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        build(root);
        setMode(root, root.dataset.mode);
      }, 150);
    });

    return api;
  }

  document.querySelectorAll('.garland').forEach(initGarland);
})();
