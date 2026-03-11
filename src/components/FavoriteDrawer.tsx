import React, { useState } from 'react';
import { ColorData, TRADITIONAL_COLORS } from '../data/colors';
import { ChevronUp } from 'lucide-react';

interface FavoriteDrawerProps {
    favorites: string[];
    onSelectColor: (color: ColorData) => void;
    onRemoveFavorite: (name: string) => void;
    onClear: () => void;
    onExportCSS: () => void;
    onExportJSON: () => void;
}

export const FavoriteDrawer: React.FC<FavoriteDrawerProps> = ({
    favorites, onSelectColor, onRemoveFavorite, onClear, onExportCSS, onExportJSON
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const favColors = favorites.map(name => TRADITIONAL_COLORS.find(c => c.name === name)).filter((c): c is ColorData => !!c);

    return (
        <div className={`palette-drawer ${isOpen ? 'open' : ''}`}>
            <div className="palette-header" onClick={() => setIsOpen(!isOpen)}>
                <button className="palette-toggle">
                    <ChevronUp
                        size={18}
                        className="palette-toggle-icon"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                    我的調色盤
                    <span className="palette-count">{favorites.length}</span>
                </button>

                <div className="palette-actions">
                    <button className="palette-action-btn" onClick={(e) => { e.stopPropagation(); onExportCSS(); }}>CSS</button>
                    <button className="palette-action-btn" onClick={(e) => { e.stopPropagation(); onExportJSON(); }}>JSON</button>
                    <button className="palette-action-btn palette-clear" onClick={(e) => { e.stopPropagation(); onClear(); }}>清除</button>
                </div>
            </div>

            <div className="palette-colors">
                {favColors.length === 0 ? (
                    <span className="palette-empty">點擊色塊上的 ♡ 加入收藏</span>
                ) : (
                    favColors.map(c => (
                        <div key={c.name} className="palette-item" onClick={() => onSelectColor(c)}>
                            <div className="palette-swatch" style={{ backgroundColor: c.hex }}></div>
                            <span className="palette-item-name">{c.nameTW}</span>
                            <button
                                className="palette-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveFavorite(c.name);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
