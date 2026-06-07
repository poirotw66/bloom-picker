import React, { memo, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ColorData } from '../data/colors';
import {
    COLORS_WITH_META,
    ColorWithMeta,
    getColorTextStyle,
} from '../utils/colorMeta';

interface ColorSidebarProps {
    onSelect: (color: ColorData) => void;
    activeColor: ColorData | null;
    onToggleFavorite: (name: string) => void;
    isFavorite: (name: string) => boolean;
    showSearch?: boolean;
    variant?: 'sidebar' | 'explorer';
}

const HUES = [
    { id: 'all', label: '全部', color: '#ffffff' },
    { id: 'red', label: '紅', color: '#E83015' },
    { id: 'orange', label: '橙', color: '#F05E1C' },
    { id: 'yellow', label: '黃', color: '#FFB11B' },
    { id: 'green', label: '綠', color: '#1B813E' },
    { id: 'cyan', label: '青', color: '#0089A7' },
    { id: 'blue', label: '藍', color: '#005CAF' },
    { id: 'purple', label: '紫', color: '#6A4C9C' },
    { id: 'neutral', label: '灰', color: '#828282' },
];

function normalizeLatin(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface ColorCardProps {
    color: ColorWithMeta;
    isActive: boolean;
    isFav: boolean;
    onSelect: (color: ColorData) => void;
    onToggleFavorite: (name: string) => void;
}

const ColorCard = memo(function ColorCard({
    color,
    isActive,
    isFav,
    onSelect,
    onToggleFavorite,
}: ColorCardProps) {
    return (
        <li>
            <div
                className={`color-card ${isActive ? 'active' : ''}`}
                style={{
                    backgroundColor: color.hex,
                    ...getColorTextStyle(color.useDarkText),
                }}
                onClick={() => onSelect(color)}
            >
                {color.nameTW}
                <button
                    type="button"
                    className={`fav-heart touch-target ${isFav ? 'is-fav' : ''}`}
                    aria-label={isFav ? '取消收藏' : '加入收藏'}
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(color.name);
                    }}
                >
                    {isFav ? '♥' : '♡'}
                </button>
            </div>
        </li>
    );
});

export const ColorSidebar: React.FC<ColorSidebarProps> = ({
    onSelect,
    activeColor,
    onToggleFavorite,
    isFavorite,
    showSearch = true,
    variant = 'sidebar',
}) => {
    const [activeHue, setActiveHue] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredColors = useMemo(() => {
        if (!searchTerm) {
            if (activeHue === 'all') {
                return COLORS_WITH_META;
            }
            return COLORS_WITH_META.filter((color) => color.hue === activeHue);
        }

        const rawTerm = searchTerm.trim();
        const latinTerm = normalizeLatin(rawTerm);

        return COLORS_WITH_META.filter((color) => {
            if (activeHue !== 'all' && color.hue !== activeHue) {
                return false;
            }

            const twMatch = color.nameTW.includes(rawTerm);
            const latinName = normalizeLatin(color.name);
            const latinMatch = latinTerm !== ''
                && (latinName.startsWith(latinTerm) || latinName.includes(latinTerm));
            const jaMatch = color.nameJA.includes(rawTerm);

            return twMatch || jaMatch || latinMatch;
        });
    }, [activeHue, searchTerm]);

    return (
        <aside className={`color-nav color-nav--${variant}`}>
            {showSearch && (
                <div className="search-container">
                    <span className="search-icon"><Search size={16} /></span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="搜尋色名..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
            )}

            <div className={`hue-filters ${showSearch ? 'hue-filters--with-search' : ''}`}>
                {HUES.map((hue) => (
                    <button
                        key={hue.id}
                        type="button"
                        className={`hue-btn touch-target ${activeHue === hue.id ? 'active' : ''}`}
                        onClick={() => setActiveHue(hue.id)}
                    >
                        <span className="hue-dot" style={{ backgroundColor: hue.color }} />
                        {hue.label}
                    </button>
                ))}
            </div>

            <ul className="color-list">
                {filteredColors.map((color) => (
                    <ColorCard
                        key={color.name}
                        color={color}
                        isActive={activeColor?.name === color.name}
                        isFav={isFavorite(color.name)}
                        onSelect={onSelect}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </ul>
        </aside>
    );
};
