import React, { useState, useCallback, useEffect } from 'react';
import { ColorData } from '../data/colors';
import { ColorExplorerPanel } from './ColorExplorerPanel';
import { SearchPanel } from './SearchPanel';

type RailPanel = 'explorer' | 'search';

interface LeftEdgeRailProps {
    onSelectColor: (color: ColorData) => void;
    activeColor: ColorData | null;
    onToggleFavorite: (name: string) => void;
    isFavorite: (name: string) => boolean;
    colorCount: number;
}

function syncHeaderRailOffset(): void {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }
    const height = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-rail-offset', `${height}px`);
}

export const LeftEdgeRail: React.FC<LeftEdgeRailProps> = ({
    onSelectColor,
    activeColor,
    onToggleFavorite,
    isFavorite,
    colorCount,
}) => {
    const [openPanel, setOpenPanel] = useState<RailPanel | null>(null);

    useEffect(() => {
        syncHeaderRailOffset();

        const header = document.querySelector('.header');
        if (!header) {
            return;
        }

        const observer = new ResizeObserver(syncHeaderRailOffset);
        observer.observe(header);
        window.addEventListener('resize', syncHeaderRailOffset);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', syncHeaderRailOffset);
        };
    }, []);

    const handleExplorerOpenChange = useCallback((open: boolean) => {
        setOpenPanel(open ? 'explorer' : null);
    }, []);

    const handleSearchOpenChange = useCallback((open: boolean) => {
        setOpenPanel(open ? 'search' : null);
    }, []);
    return (
        <div className="left-edge-rail" aria-label="側邊工具列">
            <ColorExplorerPanel
                onSelect={onSelectColor}
                activeColor={activeColor}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite}
                colorCount={colorCount}
                isOpen={openPanel === 'explorer'}
                onOpenChange={handleExplorerOpenChange}
            />
            <SearchPanel
                onSelectColor={onSelectColor}
                isOpen={openPanel === 'search'}
                onOpenChange={handleSearchOpenChange}
            />
        </div>
    );
};
