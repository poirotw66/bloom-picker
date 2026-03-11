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

/**
 * Generate a seasonal harmony palette using analogous + complementary split.
 */
export function generateSeasonalPalette(hex: string): RecommendedPalette {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;
    const used: string[] = [];

    const primary = findNearestTraditionalColor(hex);
    used.push(primary.name);

    // Analogous warm neighbor
    const warmC = hslToRgb((h + 30) % 360, Math.min(s * 1.1, 80), Math.min(l + 8, 70));
    const warm = findNearestExcluding(rgbToHex(warmC.r, warmC.g, warmC.b), used);
    used.push(warm.name);

    // Analogous cool neighbor
    const coolC = hslToRgb((h - 25 + 360) % 360, Math.min(s * 0.9, 70), Math.max(l - 5, 30));
    const cool = findNearestExcluding(rgbToHex(coolC.r, coolC.g, coolC.b), used);
    used.push(cool.name);

    // Split-complementary 1
    const splitC1 = hslToRgb((h + 150) % 360, Math.min(s * 0.8, 65), 55);
    const split1 = findNearestExcluding(rgbToHex(splitC1.r, splitC1.g, splitC1.b), used);
    used.push(split1.name);

    // Neutral anchor
    const neutralC = hslToRgb(h, Math.max(s * 0.15, 3), 90);
    const neutral = findNearestExcluding(rgbToHex(neutralC.r, neutralC.g, neutralC.b), used);
    used.push(neutral.name);

    return {
        label: '和風調和', emoji: '🎐',
        colors: [primary, warm, cool, split1, neutral]
    };
}

/**
 * Generate a 5-step gradient palette from dark to light within the same hue family.
 */
export function generateGradientPalette(hex: string): RecommendedPalette {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s } = hsl;
    const used: string[] = [];

    // 5 lightness stops from deep to pale
    const stops = [15, 35, 50, 70, 90];
    const colors: ColorData[] = [];

    for (const targetL of stops) {
        const adjustedS = targetL > 75 ? s * 0.4 : targetL < 25 ? s * 0.5 : s * 0.85;
        const c = hslToRgb(h, Math.min(adjustedS, 75), targetL);
        const nearest = findNearestExcluding(rgbToHex(c.r, c.g, c.b), used);
        used.push(nearest.name);
        colors.push(nearest);
    }

    return {
        label: '漸層配色', emoji: '🌈',
        colors
    };
}

/**
 * Inject the active color into a curated palette.
 * If the active color is already present, move it to the front.
 * Otherwise replace the most distant color and put it first.
 */
function injectActiveColor(palette: RecommendedPalette, hex: string): RecommendedPalette {
    const activeColor = findNearestTraditionalColor(hex);
    const colors = [...palette.colors];
    const existingIdx = colors.findIndex(c => c.name === activeColor.name);

    if (existingIdx >= 0) {
        // Already present — move to front
        const [found] = colors.splice(existingIdx, 1);
        colors.unshift(found);
    } else {
        // Replace the most distant color
        let worstIdx = 0;
        let worstDist = 0;
        colors.forEach((c, i) => {
            const d = colorDistance(hex, c.hex);
            if (d > worstDist) { worstDist = d; worstIdx = i; }
        });
        colors.splice(worstIdx, 1);
        colors.unshift(activeColor);
    }

    return { ...palette, colors };
}

/**
 * Find the best 2 curated palettes for a given hex,
 * ranked by how close the palette's average color distance is to the target.
 * Each returned palette is guaranteed to contain the active color in slot 0.
 */
function pickBestCurated(hex: string, allCurated: RecommendedPalette[]): RecommendedPalette[] {
    const scored = allCurated.map(p => {
        const avgDist = p.colors.reduce((sum, c) => sum + colorDistance(hex, c.hex), 0) / p.colors.length;
        return { palette: p, score: avgDist };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 2).map(s => injectActiveColor(s.palette, hex));
}

export function generateRecommendedPalettes(hex: string): RecommendedPalette[] {
    const hueFamily = classifyHue(hex);
    const curatedRecords = CURATED_PALETTES[hueFamily] || CURATED_PALETTES['neutral'];

    // Resolve curated palette names to actual ColorData
    const resolvedCurated = curatedRecords
        .map(p => {
            const resolved = p.names
                .map(n => TRADITIONAL_COLORS.find(c => c.name === n))
                .filter((c): c is ColorData => !!c);
            return { label: p.label, emoji: p.emoji, colors: resolved };
        })
        .filter(p => p.colors.length >= 5);

    // Pick the 2 most relevant curated palettes
    const bestTwo = pickBestCurated(hex, resolvedCurated);

    // Generate 4 algorithmic palettes
    const algorithmic = [
        generateUIPalette(hex),
        generateCreativePalette(hex),
        generateSeasonalPalette(hex),
        generateGradientPalette(hex)
    ];

    // Assemble: interleave curated and algorithmic for variety
    const result: RecommendedPalette[] = [];
    if (bestTwo[0]) result.push(bestTwo[0]);
    if (algorithmic[0]) result.push(algorithmic[0]);
    if (bestTwo[1]) result.push(bestTwo[1]);
    if (algorithmic[1]) result.push(algorithmic[1]);

    // Fallback: if curated is missing, fill with remaining algorithmic
    if (result.length < 4) {
        for (const alg of [algorithmic[2], algorithmic[3]]) {
            if (result.length >= 4) break;
            result.push(alg);
        }
    }

    return result.slice(0, 4);
}
