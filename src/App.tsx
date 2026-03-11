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
