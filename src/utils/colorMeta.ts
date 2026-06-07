import { TRADITIONAL_COLORS, ColorData } from '../data/colors';
import { classifyHue } from './paletteGen';
import { hexToRgb } from './colorConverter';
import { relativeLuminance, contrastRatio } from './wcag';

export interface ColorWithMeta extends ColorData {
    hue: string;
    useDarkText: boolean;
}

export const COLORS_WITH_META: ColorWithMeta[] = TRADITIONAL_COLORS.map((color) => {
    const rgb = hexToRgb(color.hex);
    const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const useDarkText = contrastRatio(0, lum) > contrastRatio(1, lum);
    return {
        ...color,
        hue: classifyHue(color.hex),
        useDarkText,
    };
});

export const COLOR_BY_NAME = new Map<string, ColorWithMeta>(
    COLORS_WITH_META.map((color) => [color.name, color]),
);

export const DARK_TEXT_COLOR = 'rgba(15,23,42,0.9)';
export const LIGHT_TEXT_COLOR = 'rgba(255,255,255,0.9)';

export function getColorTextStyle(useDarkText: boolean): { color: string } {
    return { color: useDarkText ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR };
}
