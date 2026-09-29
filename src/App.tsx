import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { TRADITIONAL_COLORS, ColorData } from './data/colors';
import { COLOR_BY_NAME } from './utils/colorMeta';
import { Header } from './components/Header';
import { ColorDetail } from './components/ColorDetail';
import { ColorHome } from './components/ColorHome';
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
const TOAST_VISIBLE_MS = 2000;
const TOAST_EXIT_MS = 320;
const HOME_THEME_HEX = '#1a1f28';

interface ToastState {
    message: string;
    leaving: boolean;
}

function readHashColor(): ColorData | null {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        return null;
    }
    return COLOR_BY_NAME.get(hash) ?? null;
}

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState<ColorData | null>(() => readHashColor());
    const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();
    const [toast, setToast] = useState<ToastState | null>(null);
    const toastTimers = useRef<number[]>([]);
    const isMobile = useIsMobile();
    const isHome = activeColor === null;

    const showToast = useCallback((message: string) => {
        toastTimers.current.forEach(window.clearTimeout);
        toastTimers.current = [
            window.setTimeout(() => {
                setToast((current) => (current ? { ...current, leaving: true } : null));
            }, TOAST_VISIBLE_MS),
            window.setTimeout(() => {
                setToast(null);
            }, TOAST_VISIBLE_MS + TOAST_EXIT_MS),
        ];
        setToast({ message, leaving: false });
    }, []);

    useEffect(() => () => {
        toastTimers.current.forEach(window.clearTimeout);
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
        () => computeThemeTokens(activeColor?.hex ?? HOME_THEME_HEX),
        [activeColor?.hex],
    );

    useEffect(() => {
        const syncRouteFromLocation = () => {
            setActiveColor(readHashColor());
        };

        syncRouteFromLocation();
        window.addEventListener('hashchange', syncRouteFromLocation);
        window.addEventListener('popstate', syncRouteFromLocation);
        return () => {
            window.removeEventListener('hashchange', syncRouteFromLocation);
            window.removeEventListener('popstate', syncRouteFromLocation);
        };
    }, []);

    useEffect(() => {
        if (activeColor) {
            document.title = `${activeColor.nameTW} · Bloom Picker`;
        } else {
            document.title = '雅色 · Bloom Picker';
        }
    }, [activeColor]);

    const handleSelectColor = useCallback((color: ColorData) => {
        setActiveColor(color);
        window.location.hash = color.name;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }, []);

    const handleGoHome = useCallback(() => {
        setActiveColor(null);
        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname + window.location.search);
        }
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }, []);

    const handleRandomColor = useCallback(() => {
        const index = Math.floor(Math.random() * TRADITIONAL_COLORS.length);
        handleSelectColor(TRADITIONAL_COLORS[index]);
    }, [handleSelectColor]);

    const handleTodayColor = useCallback(() => {
        const now = new Date();
        const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
        const index = ((dayIndex % TRADITIONAL_COLORS.length) + TRADITIONAL_COLORS.length) % TRADITIONAL_COLORS.length;
        handleSelectColor(TRADITIONAL_COLORS[index]);
    }, [handleSelectColor]);

    const handleReorderFavorites = useCallback((names: string[]) => {
        setFavorites(names);
    }, [setFavorites]);

    return (
        <div
            className={`app-container ${isMobile ? 'app-container--mobile' : 'app-container--desktop'} ${isHome ? 'app-container--home' : 'app-container--detail'}`}
            style={themeTokens as React.CSSProperties}
        >
            {!isHome && (
                <>
                    <div className="bg" style={{ backgroundColor: activeColor.hex }} />
                    <div className="bg-overlay" aria-hidden="true" />
                </>
            )}

            {!isHome && (
                <Header
                    onRandomColor={handleRandomColor}
                    onTodayColor={handleTodayColor}
                    onGoHome={handleGoHome}
                />
            )}

            {isHome ? (
                <main className="main main--home">
                    <ColorHome
                        onSelectColor={handleSelectColor}
                        onTodayColor={handleTodayColor}
                        onRandomColor={handleRandomColor}
                    />
                </main>
            ) : (
                <>
                    <main className="main">
                        <div className="content-area">
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
                            </Suspense>
                        </div>
                    </main>

                    <LeftEdgeRail
                        onSelectColor={handleSelectColor}
                        activeColor={activeColor}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                        colorCount={TRADITIONAL_COLORS.length}
                    />
                </>
            )}

            {!isHome && (
                <FavoriteDrawer
                    favorites={favorites}
                    onSelectColor={handleSelectColor}
                    onRemoveFavorite={toggleFavorite}
                    onClear={clearFavorites}
                    onExportCSS={exportCSS}
                    onExportJSON={exportJSON}
                    onReorder={handleReorderFavorites}
                />
            )}

            {toast && (
                <div
                    key={toast.message}
                    className={`export-toast ${toast.leaving ? 'export-toast--leaving' : ''}`}
                    role="status"
                    aria-live="polite"
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default App;
