(function () {
    'use strict';

    var colors = window.TRADITIONAL_COLORS || [];
    var current = null;
    var filtered = colors;

    function hexToRgb(hex) {
        var m = hex.replace(/^#/, '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (!m) return { r: 0, g: 0, b: 0 };
        return {
            r: parseInt(m[1], 16),
            g: parseInt(m[2], 16),
            b: parseInt(m[3], 16)
        };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(function (x) {
            var hex = Math.max(0, Math.min(255, x)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }

    function rgbToCmyk(r, g, b) {
        var rr = r / 255, gg = g / 255, bb = b / 255;
        var k = 1 - Math.max(rr, gg, bb);
        if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
        var c = (1 - rr - k) / (1 - k);
        var m = (1 - gg - k) / (1 - k);
        var y = (1 - bb - k) / (1 - k);
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    function isLight(r, g, b) {
        var y = 0.299 * r + 0.587 * g + 0.114 * b;
        return y >= 180;
    }

    function getVariations(hex) {
        var rgb = hexToRgb(hex);
        var res = [];
        // Tints and Shades
        var factors = [-0.4, -0.2, 0, 0.2, 0.4];
        factors.forEach(function (f) {
            var r = rgb.r, g = rgb.g, b = rgb.b;
            if (f < 0) { // Shade (darker)
                r = Math.round(r * (1 + f));
                g = Math.round(g * (1 + f));
                b = Math.round(b * (1 + f));
            } else if (f > 0) { // Tint (lighter)
                r = Math.round(r + (255 - r) * f);
                g = Math.round(g + (255 - g) * f);
                b = Math.round(b + (255 - b) * f);
            }
            res.push(rgbToHex(r, g, b));
        });
        return res;
    }

    function renderColor(c) {
        if (!c) return;
        current = c;
        var hex = c.hex;
        var rgb = hexToRgb(hex);
        var cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        // UI Updates
        var bg = document.getElementById('bg');
        bg.style.backgroundColor = hex;

        var nameEl = document.getElementById('color-name');
        nameEl.textContent = c.nameTW;

        var jaEl = document.getElementById('color-name-ja');
        jaEl.textContent = c.nameJA ? c.nameJA + ' · ' + c.name : '';

        document.getElementById('c').textContent = cmyk.c;
        document.getElementById('m').textContent = cmyk.m;
        document.getElementById('y').textContent = cmyk.y;
        document.getElementById('k').textContent = cmyk.k;
        document.getElementById('r').textContent = rgb.r;
        document.getElementById('g').textContent = rgb.g;
        document.getElementById('b').textContent = rgb.b;

        var hexEl = document.getElementById('hex');
        if (hexEl) {
            hexEl.textContent = hex.slice(1).toUpperCase();
            hexEl.setAttribute('aria-label', '複製 Hex 色碼 ' + hex.slice(1).toUpperCase());
        }

        document.body.classList.toggle('light-bg', isLight(rgb.r, rgb.g, rgb.b));

        // Variations
        var varContainer = document.getElementById('variations');
        if (varContainer) {
            varContainer.innerHTML = '';
            getVariations(hex).forEach(function (vHex) {
                var div = document.createElement('div');
                div.className = 'variation-item';
                div.style.backgroundColor = vHex;
                div.setAttribute('data-hex', vHex);
                div.addEventListener('click', function () {
                    navigator.clipboard.writeText(vHex);
                    // Simple feedback on variation click
                    div.style.transform = 'scale(0.9)';
                    setTimeout(function () { div.style.transform = ''; }, 150);
                });
                varContainer.appendChild(div);
            });
        }

        // Active state in list
        var listLinks = document.querySelectorAll('.color-list a');
        listLinks.forEach(function (a) {
            a.setAttribute('aria-current', a.getAttribute('data-color') === c.name ? 'true' : 'false');
        });

        // Restart animation
        var displayMain = document.querySelector('.display-main');
        if (displayMain) {
            displayMain.style.animation = 'none';
            displayMain.offsetHeight; // trigger reflow
            displayMain.style.animation = '';
        }
    }

    function initList(items) {
        var ul = document.getElementById('color-list');
        if (!ul) return;
        ul.innerHTML = '';
        items.forEach(function (c) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + c.name;
            a.setAttribute('data-color', c.name);
            a.textContent = c.nameTW;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.hash = c.name;
                renderColor(c);
            });
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    function initSearch() {
        var input = document.getElementById('search-input');
        if (!input) return;
        input.addEventListener('input', function (e) {
            var val = e.target.value.toLowerCase().trim();
            filtered = colors.filter(function (c) {
                return c.nameTW.includes(val) ||
                    c.name.toLowerCase().includes(val) ||
                    c.nameJA.includes(val);
            });
            initList(filtered);
        });
    }

    function initRandom() {
        var btn = document.getElementById('random-btn');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            window.location.hash = randomColor.name;
            renderColor(randomColor);
        });
    }

    function initKeyboard() {
        window.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT') return;

            var index = colors.indexOf(current);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                var next = colors[(index + 1) % colors.length];
                window.location.hash = next.name;
                renderColor(next);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                var prev = colors[(index - 1 + colors.length) % colors.length];
                window.location.hash = prev.name;
                renderColor(prev);
            }
        });
    }

    function getColorFromHash() {
        var hash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
        if (!hash) return defaultColor();
        return colors.find(function (c) { return c.name === hash; }) || defaultColor();
    }

    function defaultColor() {
        var gunjyo = colors.find(function (c) { return c.name === 'gunjyo'; });
        return gunjyo || colors[0];
    }

    function initCopyHex() {
        var el = document.getElementById('hex');
        var announcer = document.getElementById('copy-announcer');
        if (!el) return;
        el.addEventListener('click', function () {
            var hex = current && current.hex ? current.hex : ('#' + el.textContent.trim());
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(hex).then(function () {
                    var t = el.textContent;
                    el.textContent = '已複製';
                    if (announcer) announcer.textContent = '已複製色碼 ' + hex;
                    setTimeout(function () {
                        el.textContent = t;
                        if (announcer) announcer.textContent = '';
                    }, 1200);
                });
            }
        });
    }

    function onHashChange() {
        renderColor(getColorFromHash());
    }

    function initLogo() {
        var logo = document.querySelector('.logo');
        if (!logo) return;
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.hash = '';
            renderColor(defaultColor());
        });
    }

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('load', function () {
        initList(colors);
        initSearch();
        initRandom();
        initKeyboard();
        initCopyHex();
        initLogo();
        onHashChange();
        // Initial render if no hash
        if (!window.location.hash) {
            renderColor(defaultColor());
        }
    });
})();
