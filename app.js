(function () {
    'use strict';

    var colors = window.TRADITIONAL_COLORS || [];
    var current = null;

    function hexToRgb(hex) {
        var m = hex.replace(/^#/, '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (!m) return { r: 0, g: 0, b: 0 };
        return {
            r: parseInt(m[1], 16),
            g: parseInt(m[2], 16),
            b: parseInt(m[3], 16)
        };
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

    function renderColor(c) {
        if (!c) return;
        current = c;
        var hex = c.hex;
        var rgb = hexToRgb(hex);
        var cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        document.getElementById('bg').style.backgroundColor = hex;
        document.getElementById('color-name').textContent = c.nameTW;
        document.getElementById('color-name-ja').textContent = c.nameJA ? c.nameJA + ' · ' + c.name : '';
        document.getElementById('c').textContent = cmyk.c;
        document.getElementById('m').textContent = cmyk.m;
        document.getElementById('y').textContent = cmyk.y;
        document.getElementById('k').textContent = cmyk.k;
        document.getElementById('r').textContent = rgb.r;
        document.getElementById('g').textContent = rgb.g;
        document.getElementById('b').textContent = rgb.b;
        document.getElementById('hex').textContent = hex.slice(1).toUpperCase();

        document.body.classList.toggle('light-bg', isLight(rgb.r, rgb.g, rgb.b));

        var listLinks = document.querySelectorAll('.color-list a');
        listLinks.forEach(function (a) {
            a.setAttribute('aria-current', a.getAttribute('data-color') === c.name ? 'true' : 'false');
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

    function initList() {
        var ul = document.getElementById('color-list');
        if (!ul) return;
        ul.innerHTML = '';
        colors.forEach(function (c) {
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

    function initCopyHex() {
        var el = document.getElementById('hex');
        if (!el) return;
        el.addEventListener('click', function () {
            var hex = current && current.hex ? current.hex : ('#' + el.textContent);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(hex).then(function () {
                    var t = el.textContent;
                    el.textContent = 'Copied';
                    setTimeout(function () { el.textContent = t; }, 1200);
                });
            }
        });
    }

    function onHashChange() {
        renderColor(getColorFromHash());
    }

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('load', function () {
        initList();
        initCopyHex();
        onHashChange();
    });
})();
