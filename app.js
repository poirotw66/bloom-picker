(function () {
    'use strict';

    var colors = window.TRADITIONAL_COLORS || [];
    var current = null;
    var activeHue = 'all';
    var searchTerm = '';
    var favorites = [];
    var STORAGE_KEY = 'bloom-picker-favorites';

    /* ════════════════════════════════════════
       Color Math Utilities
       ════════════════════════════════════════ */

    function hexToRgb(hex) {
        var m = hex.replace(/^#/, '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (!m) return { r: 0, g: 0, b: 0 };
        return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(function (x) {
            var h = Math.max(0, Math.min(255, Math.round(x))).toString(16);
            return h.length === 1 ? '0' + h : h;
        }).join('').toUpperCase();
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        var r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgbToCmyk(r, g, b) {
        var rr = r / 255, gg = g / 255, bb = b / 255;
        var k = 1 - Math.max(rr, gg, bb);
        if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
        return {
            c: Math.round((1 - rr - k) / (1 - k) * 100),
            m: Math.round((1 - gg - k) / (1 - k) * 100),
            y: Math.round((1 - bb - k) / (1 - k) * 100),
            k: Math.round(k * 100)
        };
    }

    function isLightColor(r, g, b) {
        return (0.299 * r + 0.587 * g + 0.114 * b) >= 160;
    }

    function colorDistance(hex1, hex2) {
        var a = hexToRgb(hex1), b = hexToRgb(hex2);
        return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
    }

    /* ════════════════════════════════════════
       WCAG Contrast Ratio
       ════════════════════════════════════════ */

    function srgbToLinear(channel) {
        var c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    function relativeLuminance(r, g, b) {
        return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
    }

    function contrastRatio(l1, l2) {
        var lighter = Math.max(l1, l2);
        var darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    function formatRatio(ratio) {
        return ratio.toFixed(1) + ':1';
    }

    function wcagGrade(ratio, threshold) {
        if (ratio >= threshold) return 'pass';
        if (ratio >= threshold * 0.7) return 'warn';
        return 'fail';
    }

    function wcagIcon(grade) {
        if (grade === 'pass') return '✅';
        if (grade === 'warn') return '⚠️';
        return '❌';
    }

    /* ════════════════════════════════════════
       Hue Classification
       ════════════════════════════════════════ */

    function classifyHue(hex) {
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var h = hsl.h, s = hsl.s, l = hsl.l;
        if (s < 12 || l < 8 || l > 95) return 'neutral';
        if (h >= 345 || h < 15) return 'red';
        if (h >= 15 && h < 45) return 'orange';
        if (h >= 45 && h < 70) return 'yellow';
        if (h >= 70 && h < 165) return 'green';
        if (h >= 165 && h < 200) return 'cyan';
        if (h >= 200 && h < 265) return 'blue';
        if (h >= 265 && h < 345) return 'purple';
        return 'neutral';
    }

    /* ════════════════════════════════════════
       Color Harmony
       ════════════════════════════════════════ */

    function findNearestTraditionalColor(targetHex) {
        var best = null, bestDist = Infinity;
        colors.forEach(function (c) {
            var d = colorDistance(targetHex, c.hex);
            if (d < bestDist) { bestDist = d; best = c; }
        });
        return best;
    }

    function computeHarmonyColors(hex) {
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var h = hsl.h, s = hsl.s, l = hsl.l;

        function makeHex(hueOffset) {
            var nh = (h + hueOffset + 360) % 360;
            var c = hslToRgb(nh, s, l);
            return rgbToHex(c.r, c.g, c.b);
        }

        return [
            { type: '互補色', hex: makeHex(180) },
            { type: '類似色', hex: makeHex(30) },
            { type: '三角配色', hex: makeHex(120) },
            { type: '分裂互補', hex: makeHex(150) }
        ].map(function (item) {
            var nearest = findNearestTraditionalColor(item.hex);
            return {
                type: item.type,
                computedHex: item.hex,
                color: nearest
            };
        });
    }

    /* ════════════════════════════════════════
       Variations (Tints & Shades)
       ════════════════════════════════════════ */

    function getVariations(hex) {
        var rgb = hexToRgb(hex);
        return [-0.4, -0.2, 0, 0.2, 0.4].map(function (f) {
            var r = rgb.r, g = rgb.g, b = rgb.b;
            if (f < 0) { r *= (1 + f); g *= (1 + f); b *= (1 + f); }
            else if (f > 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
            return rgbToHex(r, g, b);
        });
    }

    /* ════════════════════════════════════════
       Favorites / Palette
       ════════════════════════════════════════ */

    function loadFavorites() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            favorites = data ? JSON.parse(data) : [];
        } catch (e) { favorites = []; }
    }

    function saveFavorites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }

    function isFavorite(name) {
        return favorites.indexOf(name) !== -1;
    }

    function toggleFavorite(name) {
        var idx = favorites.indexOf(name);
        if (idx === -1) favorites.push(name);
        else favorites.splice(idx, 1);
        saveFavorites();
        renderPalette();
        updateFavoriteButtons();
    }

    function updateFavoriteButtons() {
        document.querySelectorAll('.fav-heart').forEach(function (btn) {
            var name = btn.getAttribute('data-name');
            btn.classList.toggle('is-fav', isFavorite(name));
            btn.textContent = isFavorite(name) ? '♥' : '♡';
        });
    }

    function renderPalette() {
        var container = document.getElementById('palette-colors');
        var countEl = document.getElementById('palette-count');
        if (!container) return;

        countEl.textContent = favorites.length;
        container.innerHTML = '';

        if (favorites.length === 0) {
            var empty = document.createElement('span');
            empty.className = 'palette-empty';
            empty.textContent = '點擊色塊上的 ♡ 加入收藏';
            container.appendChild(empty);
            return;
        }

        favorites.forEach(function (name) {
            var c = colors.find(function (x) { return x.name === name; });
            if (!c) return;

            var item = document.createElement('div');
            item.className = 'palette-item';
            item.title = c.nameTW + ' ' + c.hex;

            var swatch = document.createElement('div');
            swatch.className = 'palette-swatch';
            swatch.style.backgroundColor = c.hex;

            var label = document.createElement('span');
            label.className = 'palette-item-name';
            label.textContent = c.nameTW;

            var remove = document.createElement('button');
            remove.className = 'palette-remove';
            remove.textContent = '×';
            remove.title = '移除 ' + c.nameTW;
            remove.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleFavorite(name);
            });

            item.appendChild(swatch);
            item.appendChild(label);
            item.appendChild(remove);

            // Click on palette item to navigate
            item.addEventListener('click', function () {
                window.location.hash = c.name;
                renderColor(c);
            });

            container.appendChild(item);
        });
    }

    function showToast(msg) {
        var existing = document.querySelector('.export-toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'export-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function () { toast.remove(); }, 2000);
    }

    function exportCSS() {
        if (favorites.length === 0) { showToast('請先收藏顏色'); return; }
        var lines = [':root {'];
        favorites.forEach(function (name) {
            var c = colors.find(function (x) { return x.name === name; });
            if (c) lines.push('    --color-' + c.name + ': ' + c.hex + ';');
        });
        lines.push('}');
        var text = lines.join('\n');
        navigator.clipboard.writeText(text).then(function () {
            showToast('已複製 CSS 變數 (' + favorites.length + ' 色)');
        });
    }

    function exportJSON() {
        if (favorites.length === 0) { showToast('請先收藏顏色'); return; }
        var data = favorites.map(function (name) {
            var c = colors.find(function (x) { return x.name === name; });
            if (!c) return null;
            return { name: c.name, nameTW: c.nameTW, hex: c.hex };
        }).filter(Boolean);
        var text = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(text).then(function () {
            showToast('已複製 JSON (' + favorites.length + ' 色)');
        });
    }

    /* ════════════════════════════════════════
       Single-Color Multi-Format Export
       ════════════════════════════════════════ */

    function exportSingleFormat(format) {
        if (!current) return;
        var c = current;
        var rgb = hexToRgb(c.hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var text = '';

        switch (format) {
            case 'css':
                text = '--color-' + c.name + ': ' + c.hex + ';';
                break;
            case 'scss':
                text = '$' + c.name + ': ' + c.hex + ';';
                break;
            case 'rgb':
                text = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
                break;
            case 'hsl':
                text = 'hsl(' + Math.round(hsl.h) + ', ' + Math.round(hsl.s) + '%, ' + Math.round(hsl.l) + '%)';
                break;
        }

        if (text) {
            navigator.clipboard.writeText(text).then(function () {
                showToast('已複製 ' + text);
            });
        }

        // Close dropdown
        var dd = document.getElementById('export-dropdown');
        if (dd) dd.classList.remove('open');
    }

    /* ════════════════════════════════════════
       Filtering (Hue + Search)
       ════════════════════════════════════════ */

    function getFilteredColors() {
        return colors.filter(function (c) {
            var hueMatch = (activeHue === 'all') || (classifyHue(c.hex) === activeHue);
            var searchMatch = !searchTerm ||
                c.nameTW.includes(searchTerm) ||
                c.name.toLowerCase().includes(searchTerm) ||
                c.nameJA.includes(searchTerm);
            return hueMatch && searchMatch;
        });
    }

    function applyFilters() { renderList(getFilteredColors()); }

    /* ════════════════════════════════════════
       Recommended Palettes: Curated Data
       ════════════════════════════════════════ */

    // Hand-curated classic groupings per hue family.
    // Each entry: { label, emoji, names: [5 traditional color names] }
    var CURATED_PALETTES = {
        red: [
            { label: '緋紅繚亂', emoji: '🌺', names: ['suoh', 'beni', 'momo', 'sakura', 'shironeri'] },
            { label: '夕陽餘暉', emoji: '🌅', names: ['akabeni', 'kohaku', 'kitsune', 'kitsurubami', 'hai'] }
        ],
        orange: [
            { label: '秋楓燦爛', emoji: '🍂', names: ['daidai', 'kitsune', 'tobi', 'rikyu_nezumi', 'byakuroku'] },
            { label: '暖陽金秋', emoji: '🍁', names: ['kohaku', 'kuchinashi', 'karakurenai', 'matsubairo', 'gofun'] }
        ],
        yellow: [
            { label: '金穗搖曳', emoji: '🌾', names: ['kitsurubami', 'kariyasu', 'ukon', 'wasurenagusa', 'shironeri'] },
            { label: '琥珀蜜光', emoji: '🍯', names: ['kohaku', 'tamago', 'nanohana', 'chigusa', 'nibi'] }
        ],
        green: [
            { label: '翠竹清風', emoji: '🎋', names: ['moegi', 'matsubairo', 'wakatake', 'byakuroku', 'shironeri'] },
            { label: '深山幽谷', emoji: '🌲', names: ['tokiwa', 'sensaicha', 'aotake', 'rikyucha', 'sunezumi'] }
        ],
        cyan: [
            { label: '碧海晴空', emoji: '🌊', names: ['asagi', 'mizuasagi', 'byakugun', 'noshimehana', 'gofun'] },
            { label: '湖光山色', emoji: '🏞️', names: ['seiji', 'rokusho', 'chigusa', 'wasurenagusa', 'hai'] }
        ],
        blue: [
            { label: '藍染物語', emoji: '🧵', names: ['gunjyo', 'ruri', 'hanada', 'byakugun', 'shironeri'] },
            { label: '星夜深邃', emoji: '🌌', names: ['kon', 'tetsukon', 'rurikon', 'fujimurasaki', 'gofun'] }
        ],
        purple: [
            { label: '紫藤花語', emoji: '🪻', names: ['fuji', 'fujimurasaki', 'shion', 'usubeni', 'gofun'] },
            { label: '宮廷典雅', emoji: '👘', names: ['murasaki', 'kokimurasaki', 'sumire', 'sakura', 'shironeri'] }
        ],
        neutral: [
            { label: '水墨寫意', emoji: '🖌️', names: ['sunezumi', 'nibi', 'hai', 'ginnezumi', 'shironeri'] },
            { label: '侘寂之美', emoji: '🏯', names: ['rikyucha', 'sensaicha', 'rikyu_nezumi', 'gofun', 'keshizumi'] }
        ]
    };

    /* ════════════════════════════════════════
       Recommended Palettes: Algorithm
       ════════════════════════════════════════ */

    function findNearestExcluding(targetHex, excludeNames) {
        var best = null, bestDist = Infinity;
        colors.forEach(function (c) {
            if (excludeNames.indexOf(c.name) !== -1) return;
            var d = colorDistance(targetHex, c.hex);
            if (d < bestDist) { bestDist = d; best = c; }
        });
        return best;
    }

    function generateUIPalette(hex) {
        // Generate a UI-oriented palette: primary, background, text, accent, secondary
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var h = hsl.h, s = hsl.s;
        var used = [];

        // Primary = current color
        var primary = findNearestTraditionalColor(hex);
        used.push(primary.name);

        // Background = very light version
        var bgC = hslToRgb(h, Math.max(s * 0.3, 5), 95);
        var background = findNearestExcluding(rgbToHex(bgC.r, bgC.g, bgC.b), used);
        used.push(background.name);

        // Text = very dark version
        var textC = hslToRgb(h, Math.max(s * 0.2, 5), 12);
        var textColor = findNearestExcluding(rgbToHex(textC.r, textC.g, textC.b), used);
        used.push(textColor.name);

        // Accent = complementary hue, vivid
        var accentC = hslToRgb((h + 180) % 360, Math.min(s * 1.2, 85), 50);
        var accent = findNearestExcluding(rgbToHex(accentC.r, accentC.g, accentC.b), used);
        used.push(accent.name);

        // Secondary = analogous, slightly muted
        var secC = hslToRgb((h + 40) % 360, s * 0.7, 55);
        var secondary = findNearestExcluding(rgbToHex(secC.r, secC.g, secC.b), used);
        used.push(secondary.name);

        return {
            label: '介面配色', emoji: '🖥️',
            colors: [primary, background, textColor, accent, secondary]
        };
    }

    function generateCreativePalette(hex) {
        // Generate an artistic palette: warm-cold contrast with variety
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var h = hsl.h, s = hsl.s, l = hsl.l;
        var used = [];

        var primary = findNearestTraditionalColor(hex);
        used.push(primary.name);

        // Warm accent
        var warmC = hslToRgb((h + 150) % 360, Math.min(s + 15, 80), Math.max(l - 10, 35));
        var warm = findNearestExcluding(rgbToHex(warmC.r, warmC.g, warmC.b), used);
        used.push(warm.name);

        // Cool contrast
        var coolC = hslToRgb((h + 210) % 360, Math.min(s + 10, 75), Math.min(l + 5, 65));
        var cool = findNearestExcluding(rgbToHex(coolC.r, coolC.g, coolC.b), used);
        used.push(cool.name);

        // Dark anchor
        var darkC = hslToRgb((h + 20) % 360, s * 0.4, 18);
        var dark = findNearestExcluding(rgbToHex(darkC.r, darkC.g, darkC.b), used);
        used.push(dark.name);

        // Light highlight
        var lightC = hslToRgb((h - 15 + 360) % 360, Math.max(s * 0.5, 10), 88);
        var light = findNearestExcluding(rgbToHex(lightC.r, lightC.g, lightC.b), used);
        used.push(light.name);

        return {
            label: '創意配色', emoji: '🎨',
            colors: [primary, warm, cool, dark, light]
        };
    }

    function generateRecommendedPalettes(hex) {
        var hueFamily = classifyHue(hex);
        var curated = CURATED_PALETTES[hueFamily] || CURATED_PALETTES['neutral'];

        // Pick the curated palette whose first color is closest to the selected
        var bestCurated = curated.map(function (p) {
            var resolved = p.names.map(function (n) {
                return colors.find(function (c) { return c.name === n; });
            }).filter(Boolean);
            return { label: p.label, emoji: p.emoji, colors: resolved };
        });

        // Generate 2 curated + 2 algorithmic = 4 total
        var uiPalette = generateUIPalette(hex);
        var creativePalette = generateCreativePalette(hex);

        return [
            bestCurated[0],
            uiPalette,
            bestCurated[1],
            creativePalette
        ].filter(function (p) { return p && p.colors && p.colors.length >= 5; });
    }

    /* ════════════════════════════════════════
       Download Palette as PNG
       ════════════════════════════════════════ */

    function downloadPalettePNG(palette) {
        var W = 1200, H = 560;
        var canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Title bar
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(0, 0, W, 90);
        ctx.font = '600 28px "Noto Sans TC", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textBaseline = 'middle';
        ctx.fillText(palette.emoji + '  ' + palette.label, 40, 48);

        // Watermark
        ctx.font = '400 16px "Outfit", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.textAlign = 'right';
        ctx.fillText('Bloom Picker · 雅色', W - 40, 48);
        ctx.textAlign = 'left';

        // Color swatches
        var count = palette.colors.length;
        var swatchW = (W - 80 - (count - 1) * 16) / count;
        var swatchH = 320;
        var swatchY = 120;

        palette.colors.forEach(function (c, i) {
            var x = 40 + i * (swatchW + 16);

            // Draw rounded swatch
            var radius = 12;
            ctx.beginPath();
            ctx.moveTo(x + radius, swatchY);
            ctx.lineTo(x + swatchW - radius, swatchY);
            ctx.quadraticCurveTo(x + swatchW, swatchY, x + swatchW, swatchY + radius);
            ctx.lineTo(x + swatchW, swatchY + swatchH - radius);
            ctx.quadraticCurveTo(x + swatchW, swatchY + swatchH, x + swatchW - radius, swatchY + swatchH);
            ctx.lineTo(x + radius, swatchY + swatchH);
            ctx.quadraticCurveTo(x, swatchY + swatchH, x, swatchY + swatchH - radius);
            ctx.lineTo(x, swatchY + radius);
            ctx.quadraticCurveTo(x, swatchY, x + radius, swatchY);
            ctx.closePath();
            ctx.fillStyle = c.hex;
            ctx.fill();

            // Border
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Color name (TW)
            var centerX = x + swatchW / 2;
            ctx.textAlign = 'center';
            ctx.font = '600 22px "Noto Sans TC", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillText(c.nameTW, centerX, swatchY + swatchH + 36);

            // Hex code
            ctx.font = '500 16px "Outfit", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(c.hex.toUpperCase(), centerX, swatchY + swatchH + 62);

            // Romaji name
            ctx.font = '400 13px "Outfit", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fillText(c.name, centerX, swatchY + swatchH + 82);
        });

        ctx.textAlign = 'left';

        // Download
        var link = document.createElement('a');
        link.download = 'bloom-picker-' + palette.label + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('已下載 ' + palette.label + ' 色票');
    }

    /* ════════════════════════════════════════
       Render: Recommended Palettes
       ════════════════════════════════════════ */

    function renderPaletteReco(hex) {
        var grid = document.getElementById('palette-reco-grid');
        if (!grid) return;
        grid.innerHTML = '';

        var palettes = generateRecommendedPalettes(hex);
        palettes.forEach(function (p) {
            var card = document.createElement('div');
            card.className = 'reco-card';

            // Header row: emoji + label + save-all button
            var header = document.createElement('div');
            header.className = 'reco-card-header';

            var label = document.createElement('span');
            label.className = 'reco-label';
            label.textContent = p.emoji + ' ' + p.label;

            var saveBtn = document.createElement('button');
            saveBtn.className = 'reco-save-all';
            saveBtn.textContent = '+ 收藏整組';
            saveBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var added = 0;
                p.colors.forEach(function (c) {
                    if (!isFavorite(c.name)) {
                        favorites.push(c.name);
                        added++;
                    }
                });
                if (added > 0) {
                    saveFavorites();
                    renderPalette();
                    updateFavoriteButtons();
                    showToast('已加入 ' + added + ' 色到調色盤');
                } else {
                    showToast('這組色票已全部收藏');
                }
            });

            header.appendChild(label);

            // Action buttons wrapper
            var actions = document.createElement('div');
            actions.className = 'reco-actions';

            var dlBtn = document.createElement('button');
            dlBtn.className = 'reco-save-all';
            dlBtn.textContent = '⬇ 下載 PNG';
            dlBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                downloadPalettePNG(p);
            });
            actions.appendChild(dlBtn);
            actions.appendChild(saveBtn);
            header.appendChild(actions);
            card.appendChild(header);

            // Color strip
            var strip = document.createElement('div');
            strip.className = 'reco-strip';

            p.colors.forEach(function (c) {
                var cell = document.createElement('div');
                cell.className = 'reco-strip-cell';
                cell.style.backgroundColor = c.hex;
                cell.setAttribute('data-hex', c.hex);
                var cellRgb = hexToRgb(c.hex);
                cell.style.color = isLightColor(cellRgb.r, cellRgb.g, cellRgb.b)
                    ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
                cell.addEventListener('click', function () {
                    window.location.hash = c.name;
                    renderColor(c);
                });
                strip.appendChild(cell);
            });
            card.appendChild(strip);

            // Color names row
            var names = document.createElement('div');
            names.className = 'reco-names';
            p.colors.forEach(function (c) {
                var nameCell = document.createElement('span');
                nameCell.className = 'reco-name-cell';
                nameCell.textContent = c.nameTW;
                nameCell.title = c.nameTW + ' ' + c.hex;
                nameCell.addEventListener('click', function () {
                    window.location.hash = c.name;
                    renderColor(c);
                });
                names.appendChild(nameCell);
            });
            card.appendChild(names);

            grid.appendChild(card);
        });
    }

    /* ════════════════════════════════════════
       Render: Main Color Display
       ════════════════════════════════════════ */

    function renderColor(c) {
        if (!c) return;
        current = c;
        var hex = c.hex;
        var rgb = hexToRgb(hex);
        var cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        document.getElementById('bg').style.backgroundColor = hex;
        document.getElementById('color-name').textContent = c.nameTW;
        document.getElementById('color-name-ja').textContent =
            c.nameJA ? c.nameJA + ' · ' + c.name : '';

        // CMYK
        document.getElementById('c').textContent = cmyk.c;
        document.getElementById('m').textContent = cmyk.m;
        document.getElementById('y').textContent = cmyk.y;
        document.getElementById('k').textContent = cmyk.k;

        // RGB
        document.getElementById('r').textContent = rgb.r;
        document.getElementById('g').textContent = rgb.g;
        document.getElementById('b').textContent = rgb.b;

        // HSL
        document.getElementById('h-val').textContent = Math.round(hsl.h) + '°';
        document.getElementById('s-val').textContent = Math.round(hsl.s) + '%';
        document.getElementById('l-val').textContent = Math.round(hsl.l) + '%';

        // Hex
        var hexEl = document.getElementById('hex');
        if (hexEl) {
            hexEl.textContent = hex.slice(1).toUpperCase();
            hexEl.setAttribute('aria-label', '複製 Hex 色碼 ' + hex.slice(1).toUpperCase());
        }

        document.body.classList.toggle('light-bg', isLightColor(rgb.r, rgb.g, rgb.b));

        // WCAG Contrast
        renderWCAG(rgb);

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
                    div.style.transform = 'scale(0.9)';
                    setTimeout(function () { div.style.transform = ''; }, 150);
                });
                varContainer.appendChild(div);
            });
        }

        // Color Harmony
        renderHarmony(hex);

        // Recommended Palettes
        renderPaletteReco(hex);

        // Active state in list
        document.querySelectorAll('.color-list a').forEach(function (a) {
            a.setAttribute('aria-current',
                a.getAttribute('data-color') === c.name ? 'true' : 'false');
        });

        // Restart animation
        var displayMain = document.querySelector('.display-main');
        if (displayMain) {
            displayMain.style.animation = 'none';
            displayMain.offsetHeight;
            displayMain.style.animation = '';
        }
    }

    /* ════════════════════════════════════════
       Render: WCAG Contrast Checker
       ════════════════════════════════════════ */

    function renderWCAG(rgb) {
        var bgLum = relativeLuminance(rgb.r, rgb.g, rgb.b);
        var whiteLum = relativeLuminance(255, 255, 255);
        var blackLum = relativeLuminance(0, 0, 0);

        var whiteRatio = contrastRatio(whiteLum, bgLum);
        var blackRatio = contrastRatio(bgLum, blackLum);

        // Update white text row
        var whiteSample = document.getElementById('wcag-white-sample');
        if (whiteSample && current) whiteSample.style.backgroundColor = current.hex;
        document.getElementById('wcag-white-ratio').textContent = formatRatio(whiteRatio);

        var whiteAaGrade = wcagGrade(whiteRatio, 4.5);
        var whiteAaaGrade = wcagGrade(whiteRatio, 7);
        var whiteAaEl = document.getElementById('wcag-white-aa');
        var whiteAaaEl = document.getElementById('wcag-white-aaa');
        whiteAaEl.textContent = wcagIcon(whiteAaGrade) + ' AA';
        whiteAaEl.className = 'wcag-badge ' + whiteAaGrade;
        whiteAaaEl.textContent = wcagIcon(whiteAaaGrade) + ' AAA';
        whiteAaaEl.className = 'wcag-badge ' + whiteAaaGrade;

        // Update black text row
        var blackSample = document.getElementById('wcag-black-sample');
        if (blackSample && current) blackSample.style.backgroundColor = current.hex;
        document.getElementById('wcag-black-ratio').textContent = formatRatio(blackRatio);

        var blackAaGrade = wcagGrade(blackRatio, 4.5);
        var blackAaaGrade = wcagGrade(blackRatio, 7);
        var blackAaEl = document.getElementById('wcag-black-aa');
        var blackAaaEl = document.getElementById('wcag-black-aaa');
        blackAaEl.textContent = wcagIcon(blackAaGrade) + ' AA';
        blackAaEl.className = 'wcag-badge ' + blackAaGrade;
        blackAaaEl.textContent = wcagIcon(blackAaaGrade) + ' AAA';
        blackAaaEl.className = 'wcag-badge ' + blackAaaGrade;
    }

    /* ════════════════════════════════════════
       Render: Color Harmony Cards
       ════════════════════════════════════════ */

    function renderHarmony(hex) {
        var grid = document.getElementById('harmony-grid');
        if (!grid) return;
        grid.innerHTML = '';

        var harmonies = computeHarmonyColors(hex);
        harmonies.forEach(function (h) {
            var card = document.createElement('div');
            card.className = 'harmony-card';

            var type = document.createElement('div');
            type.className = 'harmony-type';
            type.textContent = h.type;

            var swatch = document.createElement('div');
            swatch.className = 'harmony-swatch';
            swatch.style.backgroundColor = h.color.hex;

            var name = document.createElement('div');
            name.className = 'harmony-name';
            name.textContent = h.color.nameTW;

            var hexLabel = document.createElement('div');
            hexLabel.className = 'harmony-hex';
            hexLabel.textContent = h.color.hex;

            card.appendChild(type);
            card.appendChild(swatch);
            card.appendChild(name);
            card.appendChild(hexLabel);

            // Click to navigate to that color
            card.addEventListener('click', function () {
                window.location.hash = h.color.name;
                renderColor(h.color);
            });

            grid.appendChild(card);
        });
    }

    /* ════════════════════════════════════════
       Render: Color List (Colored Tiles)
       ════════════════════════════════════════ */

    function renderList(items) {
        var ul = document.getElementById('color-list');
        if (!ul) return;
        ul.innerHTML = '';

        items.forEach(function (c) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + c.name;
            a.setAttribute('data-color', c.name);

            // Set tile background to the ACTUAL color
            a.style.backgroundColor = c.hex;

            // Text color based on brightness
            var rgb = hexToRgb(c.hex);
            a.style.color = isLightColor(rgb.r, rgb.g, rgb.b)
                ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)';

            a.textContent = c.nameTW;

            // Mark active
            if (current && current.name === c.name) {
                a.setAttribute('aria-current', 'true');
            }

            // Favorite heart button
            var heart = document.createElement('button');
            heart.className = 'fav-heart' + (isFavorite(c.name) ? ' is-fav' : '');
            heart.setAttribute('data-name', c.name);
            heart.textContent = isFavorite(c.name) ? '♥' : '♡';
            heart.title = '收藏';
            heart.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(c.name);
            });
            a.appendChild(heart);

            a.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.hash = c.name;
                renderColor(c);
            });

            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    /* ════════════════════════════════════════
       Init Functions
       ════════════════════════════════════════ */

    function initSearch() {
        var input = document.getElementById('search-input');
        if (!input) return;
        input.addEventListener('input', function (e) {
            searchTerm = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    function initHueFilters() {
        var container = document.getElementById('hue-filters');
        if (!container) return;
        container.addEventListener('click', function (e) {
            var btn = e.target.closest('.hue-btn');
            if (!btn) return;
            container.querySelectorAll('.hue-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeHue = btn.getAttribute('data-hue');
            applyFilters();
        });
    }

    function initRandom() {
        var btn = document.getElementById('random-btn');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var c = colors[Math.floor(Math.random() * colors.length)];
            window.location.hash = c.name;
            renderColor(c);
        });
    }

    function initKeyboard() {
        window.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT') return;
            var idx = colors.indexOf(current);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                var next = colors[(idx + 1) % colors.length];
                window.location.hash = next.name;
                renderColor(next);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                var prev = colors[(idx - 1 + colors.length) % colors.length];
                window.location.hash = prev.name;
                renderColor(prev);
            }
        });
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

    function initLogo() {
        var logo = document.querySelector('.logo');
        if (!logo) return;
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.hash = '';
            renderColor(defaultColor());
        });
    }

    function initPalette() {
        var toggle = document.getElementById('palette-toggle');
        var drawer = document.getElementById('palette-drawer');
        if (!toggle || !drawer) return;

        document.body.classList.add('has-palette');

        toggle.addEventListener('click', function () {
            drawer.classList.toggle('open');
        });

        document.getElementById('export-css').addEventListener('click', exportCSS);
        document.getElementById('export-json').addEventListener('click', exportJSON);
        document.getElementById('palette-clear').addEventListener('click', function () {
            if (favorites.length === 0) return;
            favorites = [];
            saveFavorites();
            renderPalette();
            updateFavoriteButtons();
            showToast('已清除全部收藏');
        });
    }

    function initExportDropdown() {
        var btn = document.getElementById('export-format-btn');
        var dd = document.getElementById('export-dropdown');
        if (!btn || !dd) return;

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = dd.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        dd.addEventListener('click', function (e) {
            var opt = e.target.closest('.export-opt');
            if (!opt) return;
            e.stopPropagation();
            exportSingleFormat(opt.getAttribute('data-format'));
        });

        // Close dropdown on outside click
        document.addEventListener('click', function () {
            dd.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    }

    /* ════════════════════════════════════════
       Helpers
       ════════════════════════════════════════ */

    function getColorFromHash() {
        var hash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
        if (!hash) return defaultColor();
        return colors.find(function (c) { return c.name === hash; }) || defaultColor();
    }

    function defaultColor() {
        return colors.find(function (c) { return c.name === 'gunjyo'; }) || colors[0];
    }

    /* ════════════════════════════════════════
       Boot
       ════════════════════════════════════════ */

    window.addEventListener('hashchange', function () { renderColor(getColorFromHash()); });
    window.addEventListener('load', function () {
        loadFavorites();
        renderList(colors);
        initSearch();
        initHueFilters();
        initRandom();
        initKeyboard();
        initCopyHex();
        initLogo();
        initPalette();
        initExportDropdown();
        renderPalette();
        renderColor(getColorFromHash());
    });
})();
