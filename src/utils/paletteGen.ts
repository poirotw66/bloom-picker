import { TRADITIONAL_COLORS, ColorData } from '../data/colors';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './colorConverter';

export function colorDistance(hex1: string, hex2: string): number {
    const a = hexToRgb(hex1);
    const b = hexToRgb(hex2);
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
}

export function classifyHue(hex: string): string {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;
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

export function findNearestTraditionalColor(targetHex: string): ColorData {
    let best = TRADITIONAL_COLORS[0];
    let bestDist = Infinity;
    TRADITIONAL_COLORS.forEach(c => {
        const d = colorDistance(targetHex, c.hex);
        if (d < bestDist) {
            bestDist = d;
            best = c;
        }
    });
    return best;
}

export function findNearestExcluding(targetHex: string, excludeNames: string[]): ColorData {
    let best = TRADITIONAL_COLORS[0];
    let bestDist = Infinity;
    TRADITIONAL_COLORS.forEach(c => {
        if (excludeNames.includes(c.name)) return;
        const d = colorDistance(targetHex, c.hex);
        if (d < bestDist) {
            bestDist = d;
            best = c;
        }
    });
    return best;
}

export interface HarmonyResult {
    type: string;
    computedHex: string;
    color: ColorData;
}

export function computeHarmonyColors(hex: string): HarmonyResult[] {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;

    const makeHex = (hueOffset: number) => {
        const nh = (h + hueOffset + 360) % 360;
        const c = hslToRgb(nh, s, l);
        return rgbToHex(c.r, c.g, c.b);
    };

    return [
        { type: '互補色', hex: makeHex(180) },
        { type: '類似色', hex: makeHex(30) },
        { type: '三角配色', hex: makeHex(120) },
        { type: '分裂互補', hex: makeHex(150) }
    ].map(item => ({
        type: item.type,
        computedHex: item.hex,
        color: findNearestTraditionalColor(item.hex)
    }));
}

export function getVariations(hex: string): string[] {
    const rgb = hexToRgb(hex);
    return [-0.4, -0.2, 0, 0.2, 0.4].map(f => {
        let { r, g, b } = rgb;
        if (f < 0) {
            r *= (1 + f); g *= (1 + f); b *= (1 + f);
        } else if (f > 0) {
            r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f;
        }
        return rgbToHex(r, g, b);
    });
}

export interface RecommendedPalette {
    label: string;
    emoji: string;
    colors: ColorData[];
}

export function generateUIPalette(hex: string): RecommendedPalette {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s } = hsl;
    const used: string[] = [];

    const primary = findNearestTraditionalColor(hex);
    used.push(primary.name);

    const bgC = hslToRgb(h, Math.max(s * 0.3, 5), 95);
    const background = findNearestExcluding(rgbToHex(bgC.r, bgC.g, bgC.b), used);
    used.push(background.name);

    const textC = hslToRgb(h, Math.max(s * 0.2, 5), 12);
    const textColor = findNearestExcluding(rgbToHex(textC.r, textC.g, textC.b), used);
    used.push(textColor.name);

    const accentC = hslToRgb((h + 180) % 360, Math.min(s * 1.2, 85), 50);
    const accent = findNearestExcluding(rgbToHex(accentC.r, accentC.g, accentC.b), used);
    used.push(accent.name);

    const secC = hslToRgb((h + 40) % 360, s * 0.7, 55);
    const secondary = findNearestExcluding(rgbToHex(secC.r, secC.g, secC.b), used);
    used.push(secondary.name);

    return {
        label: '介面配色', emoji: '🖥️',
        colors: [primary, background, textColor, accent, secondary]
    };
}

export function generateCreativePalette(hex: string): RecommendedPalette {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;
    const used: string[] = [];

    const primary = findNearestTraditionalColor(hex);
    used.push(primary.name);

    const warmC = hslToRgb((h + 150) % 360, Math.min(s + 15, 80), Math.max(l - 10, 35));
    const warm = findNearestExcluding(rgbToHex(warmC.r, warmC.g, warmC.b), used);
    used.push(warm.name);

    const coolC = hslToRgb((h + 210) % 360, Math.min(s + 10, 75), Math.min(l + 5, 65));
    const cool = findNearestExcluding(rgbToHex(coolC.r, coolC.g, coolC.b), used);
    used.push(cool.name);

    const darkC = hslToRgb((h + 20) % 360, s * 0.4, 18);
    const dark = findNearestExcluding(rgbToHex(darkC.r, darkC.g, darkC.b), used);
    used.push(dark.name);

    const lightC = hslToRgb((h - 15 + 360) % 360, Math.max(s * 0.5, 10), 88);
    const light = findNearestExcluding(rgbToHex(lightC.r, lightC.g, lightC.b), used);
    used.push(light.name);

    return {
        label: '創意配色', emoji: '🎨',
        colors: [primary, warm, cool, dark, light]
    };
}

export function generateRecommendedPalettes(hex: string): RecommendedPalette[] {
    const hueFamily = classifyHue(hex);
    const curated = CURATED_PALETTES[hueFamily] || CURATED_PALETTES['neutral'];

    const bestCurated = curated.map(p => {
        const resolved = p.names.map(n =>
            TRADITIONAL_COLORS.find(c => c.name === n)
        ).filter((c): c is ColorData => !!c);
        return { label: p.label, emoji: p.emoji, colors: resolved };
    });

    return [
        bestCurated[0],
        generateUIPalette(hex),
        bestCurated[1],
        generateCreativePalette(hex)
    ].filter(p => p && p.colors && p.colors.length >= 5);
}
