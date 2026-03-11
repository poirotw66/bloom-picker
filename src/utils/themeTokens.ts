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
            '--ui-text': 'rgba(15, 23, 42, 0.95)',
            '--ui-text-secondary': 'rgba(15, 23, 42, 0.65)',
            '--ui-text-muted': 'rgba(15, 23, 42, 0.45)',
            '--ui-border': 'rgba(0, 0, 0, 0.1)',
            '--ui-border-hover': 'rgba(0, 0, 0, 0.2)',
            '--ui-bg': 'rgba(0, 0, 0, 0.04)',
            '--ui-bg-hover': 'rgba(0, 0, 0, 0.08)',
            '--ui-card-bg': 'rgba(255, 255, 255, 0.4)',
            '--ui-card-border': 'rgba(0, 0, 0, 0.05)',
            '--ui-sidebar-bg': 'rgba(255, 255, 255, 0.3)',
            '--ui-btn-bg': 'rgba(0, 0, 0, 0.06)',
            '--ui-btn-bg-active': 'rgba(0, 0, 0, 0.12)',
            '--ui-icon-hover-bg': 'rgba(0, 0, 0, 0.05)',
            '--ui-hex-bg': 'rgba(0, 0, 0, 0.06)',
            '--ui-wcag-bg': 'rgba(0, 0, 0, 0.04)',
            '--ui-theme': 'light',
        };
    }

    return {
        '--ui-text': 'rgba(255, 255, 255, 0.95)',
        '--ui-text-secondary': 'rgba(255, 255, 255, 0.7)',
        '--ui-text-muted': 'rgba(255, 255, 255, 0.45)',
        '--ui-border': 'rgba(255, 255, 255, 0.15)',
        '--ui-border-hover': 'rgba(255, 255, 255, 0.3)',
        '--ui-bg': 'rgba(255, 255, 255, 0.08)',
        '--ui-bg-hover': 'rgba(255, 255, 255, 0.15)',
        '--ui-card-bg': 'rgba(255, 255, 255, 0.15)',
        '--ui-card-border': 'rgba(255, 255, 255, 0.1)',
        '--ui-sidebar-bg': 'rgba(255, 255, 255, 0.12)',
        '--ui-btn-bg': 'rgba(255, 255, 255, 0.08)',
        '--ui-btn-bg-active': 'rgba(255, 255, 255, 0.35)',
        '--ui-icon-hover-bg': 'rgba(255, 255, 255, 0.15)',
        '--ui-hex-bg': 'rgba(255, 255, 255, 0.2)',
        '--ui-wcag-bg': 'rgba(255, 255, 255, 0.08)',
        '--ui-theme': 'dark',
    };
}

