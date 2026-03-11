import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { TRADITIONAL_COLORS, ColorData } from '../data/colors';
import { classifyHue } from '../utils/paletteGen';
import { hexToRgb } from '../utils/colorConverter';
import { relativeLuminance, contrastRatio } from '../utils/wcag';

interface ColorSidebarProps {
    onSelect: (color: ColorData) => void;
    activeColor: ColorData | null;
    onToggleFavorite: (name: string) => void;
    isFavorite: (name: string) => boolean;
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
    { id: 'neutral', label: '灰', color: '#828282' }
];

export const ColorSidebar: React.FC<ColorSidebarProps> = ({ onSelect, activeColor, onToggleFavorite, isFavorite }) => {
    const [activeHue, setActiveHue] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredColors = useMemo(() => {
        return TRADITIONAL_COLORS.filter(c => {
            const hueMatch = activeHue === 'all' || classifyHue(c.hex) === activeHue;
            const searchMatch = !searchTerm ||
                c.nameTW.includes(searchTerm) ||
                c.name.includes(searchTerm.toLowerCase()) ||
                c.nameJA.includes(searchTerm);
            return hueMatch && searchMatch;
        });
    }, [activeHue, searchTerm]);

    return (
        <aside className="color-nav">
            <div className="search-container">
                <span className="search-icon"><Search size={16} /></span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="搜尋色名..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="hue-filters" style={{ marginTop: '1.5rem' }}>
                {HUES.map(h => (
                    <button
                        key={h.id}
                        className={`hue-btn ${activeHue === h.id ? 'active' : ''}`}
                        onClick={() => setActiveHue(h.id)}
                    >
                        <span className="hue-dot" style={{ backgroundColor: h.color }}></span>
                        {h.label}
                    </button>
                ))}
            </div>

            <ul className="color-list">
                {filteredColors.map(c => {
                    const rgb = hexToRgb(c.hex);
                    const bgLum = relativeLuminance(rgb.r, rgb.g, rgb.b);
                    const ratioWhite = contrastRatio(1.0, bgLum);
                    const ratioBlack = contrastRatio(0.0, bgLum);
                    const useDarkText = ratioBlack > ratioWhite;
                    return (
                        <li key={c.name}>
                            <div
                                className={`color-card ${activeColor?.name === c.name ? 'active' : ''}`}
                                style={{
                                    backgroundColor: c.hex,
                                    color: useDarkText ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)'
                                }}
                                onClick={() => onSelect(c)}
                            >
                                {c.nameTW}
                                <button
                                    className={`fav-heart ${isFavorite(c.name) ? 'is-fav' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(c.name);
                                    }}
                                >
                                    {isFavorite(c.name) ? '♥' : '♡'}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};
