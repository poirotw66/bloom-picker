import React, { useState, useEffect, useCallback } from 'react';
import { TRADITIONAL_COLORS, ColorData } from './data/colors';
import { Header } from './components/Header';
import { ColorSidebar } from './components/ColorSidebar';
import { ColorDetail } from './components/ColorDetail';
import { PaletteReco } from './components/PaletteReco';
import { FavoriteDrawer } from './components/FavoriteDrawer';
import { useFavorites } from './hooks/useFavorites';
import './App.css';

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState<ColorData>(TRADITIONAL_COLORS[191]); // Default to gunjyo (群青) or similar
    const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();
    const [toast, setToast] = useState<string | null>(null);

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
        <div className={`app-container ${activeColor ? (isLight() ? 'light-bg' : '') : ''}`}>
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

    function isLight() {
        if (!activeColor) return false;
        const { r, g, b } = hexToRgb(activeColor.hex);
        return (0.299 * r + 0.587 * g + 0.114 * b) >= 160;
    }
};

function hexToRgb(hex: string) {
    const m = hex.replace(/^#/, '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export default App;
