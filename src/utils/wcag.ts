export function srgbToLinear(channel: number): number {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(r: number, g: number, b: number): number {
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

export function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio: number): string {
    return ratio.toFixed(1) + ':1';
}

export type WCAGGrade = 'pass' | 'warn' | 'fail';

export function wcagGrade(ratio: number, threshold: number): WCAGGrade {
    if (ratio >= threshold) return 'pass';
    if (ratio >= threshold * 0.7) return 'warn';
    return 'fail';
}

export function wcagIcon(grade: WCAGGrade): string {
    if (grade === 'pass') return '✅';
    if (grade === 'warn') return '⚠️';
    return '❌';
}
