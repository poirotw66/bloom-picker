import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { TRADITIONAL_COLORS, ColorData } from './data/colors';
import { COLOR_BY_NAME } from './utils/colorMeta';
import { Header } from './components/Header';
import { ColorDetail } from './components/ColorDetail';
import { FavoriteDrawer } from './components/FavoriteDrawer';
import { LeftEdgeRail } from './components/LeftEdgeRail';
import { useFavorites } from './hooks/useFavorites';
import { usePaletteExport } from './hooks/usePaletteExport';
import { useIsMobile } from './hooks/useIsMobile';
import { computeThemeTokens } from './utils/themeTokens';
import './App.css';

const PaletteReco = lazy(() =>
    import('./components/PaletteReco').then((module) => ({ default: module.PaletteReco })),
);
const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState<ColorData>(TRADITIONAL_COLORS[191]);
    const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();
    const [toast, setToast] = useState<string | null>(null);
    const isMobile = useIsMobile();

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
        [activeColor.hex],
    );

    useEffect(() => {
        const applyHashColor = () => {
            const hash = window.location.hash.slice(1);
            if (!hash) {
                return;
            }
            const found = COLOR_BY_NAME.get(hash);
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
            className={`app-container ${isMobile ? 'app-container--mobile' : 'app-container--desktop'}`}
            style={themeTokens as React.CSSProperties}
        >
            <div className="bg" style={{ backgroundColor: activeColor?.hex }} />
            <div className="bg-overlay" aria-hidden="true" />

            <Header
                onRandomColor={handleRandomColor}
                onTodayColor={handleTodayColor}
            />

            <main className="main">
                <div className="content-area">
                    {activeColor && (
                        <>
                            <ColorDetail
                                color={activeColor}
                                onShowToast={showToast}
                                onSelectColor={handleSelectColor}
                                showHeroHex
                            />
                            <Suspense fallback={null}>
                                <PaletteReco
                                    baseHex={activeColor.hex}
                                    onSelectColor={handleSelectColor}
                                    onAddAll={handleAddAll}
                                    onShowToast={showToast}
                                />
                            </Suspense>                        </>
                    )}
                </div>
            </main>

            <LeftEdgeRail
                onSelectColor={handleSelectColor}
                activeColor={activeColor}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                colorCount={TRADITIONAL_COLORS.length}
            />

            <FavoriteDrawer
                favorites={favorites}
                onSelectColor={handleSelectColor}
                onRemoveFavorite={toggleFavorite}
                onClear={clearFavorites}
                onExportCSS={exportCSS}
                onExportJSON={exportJSON}
                onReorder={handleReorderFavorites}
            />

            {toast && (
                <div className="export-toast" role="status" aria-live="polite">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default App;
