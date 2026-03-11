import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TRADITIONAL_COLORS, ColorData } from './data/colors';
import { Header } from './components/Header';
import { ColorSidebar } from './components/ColorSidebar';
import { ColorDetail } from './components/ColorDetail';
import { PaletteReco } from './components/PaletteReco';
import { FavoriteDrawer } from './components/FavoriteDrawer';
import { useFavorites } from './hooks/useFavorites';
import { hexToRgb } from './utils/colorConverter';
import { relativeLuminance, contrastRatio } from './utils/wcag';
import './App.css';

/**
 * Compute adaptive UI theme tokens based on WCAG contrast ratios.
 * Compares white and black text against the given background color,
 * then selects the one with higher contrast to ensure readability.
 */
function computeThemeTokens(hex: string): Record<string, string> {
    const { r, g, b } = hexToRgb(hex);
    const bgLum = relativeLuminance(r, g, b);
    const ratioWhite = contrastRatio(1.0, bgLum);
    const ratioBlack = contrastRatio(0.0, bgLum);

    // Use whichever text color provides better WCAG contrast
    const useDarkText = ratioBlack > ratioWhite;

    if (useDarkText) {
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

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState<ColorData>(TRADITIONAL_COLORS[191]);
    const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();
    const [toast, setToast] = useState<string | null>(null);

    const themeTokens = useMemo(
        () => computeThemeTokens(activeColor.hex),
        [activeColor.hex]
    );

    // Sync hash with color
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const found = TRADITIONAL_COLORS.find(c => c.name === hash);
            if (found) setActiveColor(found);
        }
    }, []);

    const handleSelectColor = useCallback((c: ColorData) => {
        setActiveColor(c);
        window.location.hash = c.name;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const handleAddAll = (colors: ColorData[]) => {
        const newFavs = [...favorites];
        let added = 0;
        colors.forEach(c => {
            if (!newFavs.includes(c.name)) {
                newFavs.push(c.name);
                added++;
            }
        });
        if (added > 0) {
            setFavorites(newFavs);
            showToast(`已加入 ${added} 色到調色盤`);
        } else {
            showToast('這組色票已全部收藏');
        }
    };

    const exportCSS = () => {
        if (favorites.length === 0) { showToast('請先收藏顏色'); return; }
        const lines = [':root {'];
        favorites.forEach(name => {
            const c = TRADITIONAL_COLORS.find(x => x.name === name);
            if (c) lines.push(`    --color-${c.name}: ${c.hex};`);
        });
        lines.push('}');
        navigator.clipboard.writeText(lines.join('\n')).then(() => showToast(`已複製 CSS 變數 (${favorites.length} 色)`));
    };

    const exportJSON = () => {
        if (favorites.length === 0) { showToast('請先收藏顏色'); return; }
        const data = favorites.map(name => {
            const c = TRADITIONAL_COLORS.find(x => x.name === name);
            return c ? { name: c.name, nameTW: c.nameTW, hex: c.hex } : null;
        }).filter(Boolean);
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => showToast(`已複製 JSON (${favorites.length} 色)`));
    };

    const clearFavorites = () => {
        if (window.confirm('確定要清除所有收藏嗎？')) {
            setFavorites([]);
        }
    };

    return (
        <div
            className="app-container"
            style={themeTokens as React.CSSProperties}
        >
            <div className="bg" style={{ backgroundColor: activeColor?.hex }}></div>

            <Header />

            <main className="main">
                <ColorSidebar
                    onSelect={handleSelectColor}
                    activeColor={activeColor}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                />

                <div className="content-area" style={{ flex: 1 }}>
                    {activeColor && (
                        <>
                            <ColorDetail color={activeColor} onShowToast={showToast} />
                            <PaletteReco
                                baseHex={activeColor.hex}
                                onSelectColor={handleSelectColor}
                                onAddAll={handleAddAll}
                                onShowToast={showToast}
                            />
                        </>
                    )}
                </div>
            </main>

            <FavoriteDrawer
                favorites={favorites}
                onSelectColor={handleSelectColor}
                onRemoveFavorite={toggleFavorite}
                onClear={clearFavorites}
                onExportCSS={exportCSS}
                onExportJSON={exportJSON}
            />

            {toast && <div className="export-toast">{toast}</div>}
        </div>
    );
};

export default App;
