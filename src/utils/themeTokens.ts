import { hexToRgb } from './colorConverter';
import { relativeLuminance, contrastRatio } from './wcag';

export function computeThemeTokens(hex: string): Record<string, string> {
    const { r, g, b } = hexToRgb(hex);
    const backgroundLuminance = relativeLuminance(r, g, b);
    const ratioWithWhite = contrastRatio(1.0, backgroundLuminance);
    const ratioWithBlack = contrastRatio(0.0, backgroundLuminance);

    const shouldUseDarkText = ratioWithBlack > ratioWithWhite;

    if (shouldUseDarkText) {
        return {
            '--ui-text': 'rgba(15, 23, 42, 0.94)',
            '--ui-text-secondary': 'rgba(15, 23, 42, 0.62)',
            '--ui-text-muted': 'rgba(15, 23, 42, 0.42)',
            '--ui-border': 'rgba(0, 0, 0, 0.08)',
            '--ui-border-hover': 'rgba(0, 0, 0, 0.16)',
            '--ui-bg': 'rgba(255, 255, 255, 0.35)',
            '--ui-bg-hover': 'rgba(255, 255, 255, 0.55)',
            '--ui-card-bg': 'rgba(255, 255, 255, 0.52)',
            '--ui-card-border': 'rgba(255, 255, 255, 0.65)',
            '--ui-sidebar-bg': 'rgba(255, 255, 255, 0.42)',
            '--ui-btn-bg': 'rgba(255, 255, 255, 0.45)',
            '--ui-btn-bg-active': 'rgba(255, 255, 255, 0.72)',
            '--ui-icon-hover-bg': 'rgba(0, 0, 0, 0.04)',
            '--ui-hex-bg': 'rgba(255, 255, 255, 0.55)',
            '--ui-wcag-bg': 'rgba(255, 255, 255, 0.38)',
            '--ui-shadow-soft': '0 4px 24px rgba(15, 23, 42, 0.06)',
            '--ui-shadow-card': '0 12px 40px rgba(15, 23, 42, 0.08), 0 1px 0 rgba(255, 255, 255, 0.6) inset',
            '--ui-shadow-elevated': '0 20px 60px rgba(15, 23, 42, 0.12)',
            '--ui-vignette-edge': 'rgba(15, 23, 42, 0.1)',
            '--ui-glow': 'rgba(255, 255, 255, 0.35)',
            '--ui-theme': 'light',
        };
    }

    return {
        '--ui-text': 'rgba(255, 255, 255, 0.96)',
        '--ui-text-secondary': 'rgba(255, 255, 255, 0.72)',
        '--ui-text-muted': 'rgba(255, 255, 255, 0.48)',
        '--ui-border': 'rgba(255, 255, 255, 0.14)',
        '--ui-border-hover': 'rgba(255, 255, 255, 0.28)',
        '--ui-bg': 'rgba(255, 255, 255, 0.1)',
        '--ui-bg-hover': 'rgba(255, 255, 255, 0.18)',
        '--ui-card-bg': 'rgba(255, 255, 255, 0.14)',
        '--ui-card-border': 'rgba(255, 255, 255, 0.22)',
        '--ui-sidebar-bg': 'rgba(255, 255, 255, 0.12)',
        '--ui-btn-bg': 'rgba(255, 255, 255, 0.1)',
        '--ui-btn-bg-active': 'rgba(255, 255, 255, 0.22)',
        '--ui-icon-hover-bg': 'rgba(255, 255, 255, 0.12)',
        '--ui-hex-bg': 'rgba(255, 255, 255, 0.16)',
        '--ui-wcag-bg': 'rgba(255, 255, 255, 0.1)',
        '--ui-shadow-soft': '0 4px 24px rgba(0, 0, 0, 0.12)',
        '--ui-shadow-card': '0 12px 40px rgba(0, 0, 0, 0.18), 0 1px 0 rgba(255, 255, 255, 0.12) inset',
        '--ui-shadow-elevated': '0 24px 64px rgba(0, 0, 0, 0.28)',
        '--ui-vignette-edge': 'rgba(0, 0, 0, 0.28)',
        '--ui-glow': 'rgba(255, 255, 255, 0.08)',
        '--ui-theme': 'dark',
    };
}
