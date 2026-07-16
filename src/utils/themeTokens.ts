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
            '--ui-text': 'rgba(28, 24, 20, 0.92)',
            '--ui-text-secondary': 'rgba(28, 24, 20, 0.58)',
            '--ui-text-muted': 'rgba(28, 24, 20, 0.38)',
            '--ui-border': 'rgba(28, 24, 20, 0.1)',
            '--ui-border-hover': 'rgba(28, 24, 20, 0.2)',
            '--ui-bg': 'rgba(252, 248, 242, 0.42)',
            '--ui-bg-hover': 'rgba(252, 248, 242, 0.62)',
            '--ui-card-bg': 'rgba(252, 248, 242, 0.58)',
            '--ui-card-border': 'rgba(255, 252, 246, 0.72)',
            '--ui-sidebar-bg': 'rgba(252, 248, 242, 0.48)',
            '--ui-btn-bg': 'rgba(252, 248, 242, 0.5)',
            '--ui-btn-bg-active': 'rgba(252, 248, 242, 0.78)',
            '--ui-icon-hover-bg': 'rgba(28, 24, 20, 0.05)',
            '--ui-hex-bg': 'rgba(252, 248, 242, 0.62)',
            '--ui-wcag-bg': 'rgba(252, 248, 242, 0.45)',
            '--ui-accent': 'rgba(168, 128, 56, 0.75)',
            '--ui-accent-soft': 'rgba(168, 128, 56, 0.18)',
            '--ui-shadow-soft': '0 4px 28px rgba(28, 24, 20, 0.07)',
            '--ui-shadow-card': '0 16px 48px rgba(28, 24, 20, 0.09), 0 1px 0 rgba(255, 252, 246, 0.7) inset',
            '--ui-shadow-elevated': '0 24px 64px rgba(28, 24, 20, 0.14)',
            '--ui-vignette-edge': 'rgba(28, 24, 20, 0.12)',
            '--ui-glow': 'rgba(255, 252, 246, 0.4)',
            '--ui-theme': 'light',
        };
    }

    return {
        '--ui-text': 'rgba(255, 252, 246, 0.96)',
        '--ui-text-secondary': 'rgba(255, 252, 246, 0.7)',
        '--ui-text-muted': 'rgba(255, 252, 246, 0.46)',
        '--ui-border': 'rgba(255, 252, 246, 0.16)',
        '--ui-border-hover': 'rgba(255, 252, 246, 0.32)',
        '--ui-bg': 'rgba(255, 252, 246, 0.1)',
        '--ui-bg-hover': 'rgba(255, 252, 246, 0.18)',
        '--ui-card-bg': 'rgba(255, 252, 246, 0.13)',
        '--ui-card-border': 'rgba(255, 252, 246, 0.24)',
        '--ui-sidebar-bg': 'rgba(255, 252, 246, 0.11)',
        '--ui-btn-bg': 'rgba(255, 252, 246, 0.1)',
        '--ui-btn-bg-active': 'rgba(255, 252, 246, 0.22)',
        '--ui-icon-hover-bg': 'rgba(255, 252, 246, 0.12)',
        '--ui-hex-bg': 'rgba(255, 252, 246, 0.16)',
        '--ui-wcag-bg': 'rgba(255, 252, 246, 0.1)',
        '--ui-accent': 'rgba(212, 175, 95, 0.85)',
        '--ui-accent-soft': 'rgba(212, 175, 95, 0.2)',
        '--ui-shadow-soft': '0 4px 28px rgba(0, 0, 0, 0.14)',
        '--ui-shadow-card': '0 16px 48px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 252, 246, 0.14) inset',
        '--ui-shadow-elevated': '0 28px 72px rgba(0, 0, 0, 0.32)',
        '--ui-vignette-edge': 'rgba(0, 0, 0, 0.32)',
        '--ui-glow': 'rgba(255, 252, 246, 0.06)',
        '--ui-theme': 'dark',
    };
}
