import { hexToRgb } from './colorConverter';
import { relativeLuminance, contrastRatio } from './wcag';

/**
 * Cold silk / ink pavilion tokens.
 * Cool neutrals so the selected traditional color stays the hero.
 * Single accent: muted vermillion (朱), not brass / cream craft defaults.
 */
export function computeThemeTokens(hex: string): Record<string, string> {
    const { r, g, b } = hexToRgb(hex);
    const backgroundLuminance = relativeLuminance(r, g, b);
    const ratioWithWhite = contrastRatio(1.0, backgroundLuminance);
    const ratioWithBlack = contrastRatio(0.0, backgroundLuminance);

    const shouldUseDarkText = ratioWithBlack > ratioWithWhite;

    if (shouldUseDarkText) {
        return {
            '--ui-text': 'rgba(17, 22, 28, 0.92)',
            '--ui-text-secondary': 'rgba(17, 22, 28, 0.58)',
            '--ui-text-muted': 'rgba(17, 22, 28, 0.4)',
            '--ui-border': 'rgba(17, 22, 28, 0.1)',
            '--ui-border-hover': 'rgba(17, 22, 28, 0.22)',
            '--ui-bg': 'rgba(245, 247, 250, 0.48)',
            '--ui-bg-hover': 'rgba(245, 247, 250, 0.7)',
            '--ui-card-bg': 'rgba(245, 247, 250, 0.62)',
            '--ui-card-border': 'rgba(255, 255, 255, 0.72)',
            '--ui-sidebar-bg': 'rgba(245, 247, 250, 0.5)',
            '--ui-btn-bg': 'rgba(245, 247, 250, 0.55)',
            '--ui-btn-bg-active': 'rgba(245, 247, 250, 0.82)',
            '--ui-icon-hover-bg': 'rgba(17, 22, 28, 0.06)',
            '--ui-hex-bg': 'rgba(245, 247, 250, 0.7)',
            '--ui-wcag-bg': 'rgba(245, 247, 250, 0.48)',
            '--ui-accent': 'rgba(168, 58, 58, 0.88)',
            '--ui-accent-soft': 'rgba(168, 58, 58, 0.14)',
            '--ui-shadow-soft': '0 8px 32px rgba(17, 28, 45, 0.08)',
            '--ui-shadow-card': '0 20px 56px rgba(17, 28, 45, 0.1), 0 1px 0 rgba(255, 255, 255, 0.65) inset',
            '--ui-shadow-elevated': '0 28px 72px rgba(17, 28, 45, 0.14)',
            '--ui-vignette-edge': 'rgba(17, 28, 45, 0.14)',
            '--ui-glow': 'rgba(255, 255, 255, 0.28)',
            '--ui-theme': 'light',
        };
    }

    return {
        '--ui-text': 'rgba(244, 247, 250, 0.96)',
        '--ui-text-secondary': 'rgba(244, 247, 250, 0.7)',
        '--ui-text-muted': 'rgba(244, 247, 250, 0.46)',
        '--ui-border': 'rgba(244, 247, 250, 0.16)',
        '--ui-border-hover': 'rgba(244, 247, 250, 0.32)',
        '--ui-bg': 'rgba(244, 247, 250, 0.1)',
        '--ui-bg-hover': 'rgba(244, 247, 250, 0.18)',
        '--ui-card-bg': 'rgba(244, 247, 250, 0.12)',
        '--ui-card-border': 'rgba(244, 247, 250, 0.22)',
        '--ui-sidebar-bg': 'rgba(244, 247, 250, 0.1)',
        '--ui-btn-bg': 'rgba(244, 247, 250, 0.1)',
        '--ui-btn-bg-active': 'rgba(244, 247, 250, 0.22)',
        '--ui-icon-hover-bg': 'rgba(244, 247, 250, 0.12)',
        '--ui-hex-bg': 'rgba(244, 247, 250, 0.14)',
        '--ui-wcag-bg': 'rgba(244, 247, 250, 0.1)',
        '--ui-accent': 'rgba(214, 120, 120, 0.9)',
        '--ui-accent-soft': 'rgba(214, 120, 120, 0.18)',
        '--ui-shadow-soft': '0 8px 32px rgba(0, 0, 0, 0.18)',
        '--ui-shadow-card': '0 20px 56px rgba(0, 0, 0, 0.24), 0 1px 0 rgba(255, 255, 255, 0.12) inset',
        '--ui-shadow-elevated': '0 28px 72px rgba(0, 0, 0, 0.36)',
        '--ui-vignette-edge': 'rgba(0, 0, 0, 0.36)',
        '--ui-glow': 'rgba(244, 247, 250, 0.05)',
        '--ui-theme': 'dark',
    };
}
