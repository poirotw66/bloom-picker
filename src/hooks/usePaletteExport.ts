import { useCallback } from 'react';
import { TRADITIONAL_COLORS } from '../data/colors';

export interface PaletteExportHandlers {
    showToast: (message: string) => void;
    exportCSS: () => void;
    exportJSON: () => void;
    handleAddAll: (colors: { name: string }[]) => void;
    clearFavorites: () => void;
}

interface UsePaletteExportParams {
    favorites: string[];
    setFavorites: (names: string[]) => void;
    onShowToast: (message: string) => void;
}

export function usePaletteExport(params: UsePaletteExportParams): PaletteExportHandlers {
    const { favorites, setFavorites, onShowToast } = params;

    const showToast = useCallback((message: string) => {
        onShowToast(message);
    }, [onShowToast]);

    const exportCSS = useCallback(() => {
        if (favorites.length === 0) {
            showToast('請先收藏顏色');
            return;
        }
        const lines: string[] = [':root {'];
        favorites.forEach((name) => {
            const color = TRADITIONAL_COLORS.find((item) => item.name === name);
            if (color) {
                lines.push(`    --color-${color.name}: ${color.hex};`);
            }
        });
        lines.push('}');
        navigator.clipboard
            .writeText(lines.join('\n'))
            .then(() => showToast(`已複製 CSS 變數 (${favorites.length} 色)`));
    }, [favorites, showToast]);

    const exportJSON = useCallback(() => {
        if (favorites.length === 0) {
            showToast('請先收藏顏色');
            return;
        }
        const data = favorites
            .map((name) => {
                const color = TRADITIONAL_COLORS.find((item) => item.name === name);
                return color ? { name: color.name, nameTW: color.nameTW, hex: color.hex } : null;
            })
            .filter((item) => item !== null);
        navigator.clipboard
            .writeText(JSON.stringify(data, null, 2))
            .then(() => showToast(`已複製 JSON (${favorites.length} 色)`));
    }, [favorites, showToast]);

    const handleAddAll = useCallback(
        (colors: { name: string }[]) => {
            const current = [...favorites];

            let addedCount = 0;
            colors.forEach((color) => {
                if (!current.includes(color.name)) {
                    current.push(color.name);
                    addedCount += 1;
                }
            });

            if (addedCount > 0) {
                setFavorites(current);
                showToast(`已加入 ${addedCount} 色到調色盤`);
            } else {
                showToast('這組色票已全部收藏');
            }
        },
        [favorites, setFavorites, showToast],
    );

    const clearFavorites = useCallback(() => {
        if (window.confirm('確定要清除所有收藏嗎？')) {
            setFavorites([]);
        }
    }, [setFavorites]);

    return {
        showToast,
        exportCSS,
        exportJSON,
        handleAddAll,
        clearFavorites,
    };
}

