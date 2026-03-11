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

import { motion, AnimatePresence } from 'framer-motion';

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
                    <span>我的調色盤</span>
                    <span className="palette-count">{favorites.length}</span>
                </button>

                <div className="palette-actions">
                    <button className="palette-action-btn" onClick={(e) => { e.stopPropagation(); onExportCSS(); }}>CSS</button>
                    <button className="palette-action-btn" onClick={(e) => { e.stopPropagation(); onExportJSON(); }}>JSON</button>
                    <button className="palette-action-btn palette-clear" onClick={(e) => { e.stopPropagation(); onClear(); }}>清除</button>
                </div>
            </div>

            <div className="palette-colors">
                <AnimatePresence mode="popLayout">
                    {favColors.length === 0 ? (
                        <motion.span
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="palette-empty"
                        >
                            點擊色塊上的 ♡ 加入收藏
                        </motion.span>
                    ) : (
                        favColors.map(c => (
                            <motion.div
                                layout
                                key={c.name}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="palette-item"
                                onClick={() => onSelectColor(c)}
                            >
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
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
