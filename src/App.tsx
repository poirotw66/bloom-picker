import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TRADITIONAL_COLORS, ColorData } from './data/colors';
import { Header } from './components/Header';
import { ColorSidebar } from './components/ColorSidebar';
import { ColorDetail } from './components/ColorDetail';
import { PaletteReco } from './components/PaletteReco';
import { FavoriteDrawer } from './components/FavoriteDrawer';
import { useFavorites } from './hooks/useFavorites';
import { usePaletteExport } from './hooks/usePaletteExport';
import { computeThemeTokens } from './utils/themeTokens';
import './App.css';

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState<ColorData>(TRADITIONAL_COLORS[191]);
    const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();
    const [toast, setToast] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    }, []);

    const {
        exportCSS,
        exportJSON,
        handleAddAll,
        clearFavorites,
    } = usePaletteExport({
        favorites,
        setFavorites,
        onShowToast: showToast,
    });

    const themeTokens = useMemo(
        () => computeThemeTokens(activeColor.hex),
        [activeColor.hex]
    );

    useEffect(() => {
        const applyHashColor = () => {
            const hash = window.location.hash.slice(1);
            if (!hash) {
                return;
            }
            const found = TRADITIONAL_COLORS.find((item) => item.name === hash);
            if (found) {
                setActiveColor(found);
            }
        };

        applyHashColor();

        const handleHashChange = () => {
            applyHashColor();
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        if (activeColor) {
            document.title = `${activeColor.nameTW} · Bloom Picker`;
        } else {
            document.title = 'Bloom Picker';
        }
    }, [activeColor]);

    const handleSelectColor = useCallback((color: ColorData) => {
        setActiveColor(color);
        window.location.hash = color.name;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRandomColor = useCallback(() => {
        const index = Math.floor(Math.random() * TRADITIONAL_COLORS.length);
        const randomColor = TRADITIONAL_COLORS[index];
        handleSelectColor(randomColor);
    }, [handleSelectColor]);

    const handleTodayColor = useCallback(() => {
        const now = new Date();
        const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
        const index = ((dayIndex % TRADITIONAL_COLORS.length) + TRADITIONAL_COLORS.length) % TRADITIONAL_COLORS.length;
        const todayColor = TRADITIONAL_COLORS[index];
        handleSelectColor(todayColor);
    }, [handleSelectColor]);

    const handleReorderFavorites = useCallback((names: string[]) => {
        setFavorites(names);
    }, [setFavorites]);

    return (
        <div
            className="app-container"
            style={themeTokens as React.CSSProperties}
        >
            <div className="bg" style={{ backgroundColor: activeColor?.hex }}></div>

            <Header
                onRandomColor={handleRandomColor}
                onTodayColor={handleTodayColor}
            />

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
                            <ColorDetail
                                color={activeColor}
                                onShowToast={showToast}
                                onSelectColor={handleSelectColor}
                            />
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
                onReorder={handleReorderFavorites}
            />

            {toast && <div className="export-toast">{toast}</div>}
        </div>
    );
};

export default App;
