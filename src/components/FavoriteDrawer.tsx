import React, { useState } from 'react';
import { ColorData, TRADITIONAL_COLORS } from '../data/colors';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteDrawerProps {
    favorites: string[];
    onSelectColor: (color: ColorData) => void;
    onRemoveFavorite: (name: string) => void;
    onClear: () => void;
    onExportCSS: () => void;
    onExportJSON: () => void;
    onReorder: (names: string[]) => void;
}

export const FavoriteDrawer: React.FC<FavoriteDrawerProps> = ({
    favorites,
    onSelectColor,
    onRemoveFavorite,
    onClear,
    onExportCSS,
    onExportJSON,
    onReorder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draggingName, setDraggingName] = useState<string | null>(null);

    const favColors = favorites
        .map((name) => TRADITIONAL_COLORS.find((color) => color.name === name))
        .filter((color): color is ColorData => !!color);

    const handleDragStart = (name: string) => {
        setDraggingName(name);
    };

    const handleDragOver = (targetName: string) => {
        if (!draggingName || draggingName === targetName) {
            return;
        }

        const currentOrder = favColors.map((color) => color.name);
        const fromIndex = currentOrder.indexOf(draggingName);
        const toIndex = currentOrder.indexOf(targetName);

        if (fromIndex === -1 || toIndex === -1) {
            return;
        }

        const nextOrder = [...currentOrder];
        nextOrder.splice(fromIndex, 1);
        nextOrder.splice(toIndex, 0, draggingName);
        onReorder(nextOrder);
    };

    const handleDragEnd = () => {
        setDraggingName(null);
    };

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
                    <button
                        className="palette-action-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onExportCSS();
                        }}
                    >
                        CSS
                    </button>
                    <button
                        className="palette-action-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onExportJSON();
                        }}
                    >
                        JSON
                    </button>
                    <button
                        className="palette-action-btn palette-clear"
                        onClick={(event) => {
                            event.stopPropagation();
                            onClear();
                        }}
                    >
                        清除
                    </button>
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
                        favColors.map((color) => (
                            <motion.div
                                layout
                                key={color.name}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="palette-item"
                                draggable
                                onDragStart={() => handleDragStart(color.name)}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    handleDragOver(color.name);
                                }}
                                onDragEnd={handleDragEnd}
                                onClick={() => onSelectColor(color)}
                            >
                                <div className="palette-swatch" style={{ backgroundColor: color.hex }}></div>
                                <span className="palette-item-name">{color.nameTW}</span>
                                <button
                                    className="palette-remove"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onRemoveFavorite(color.name);
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

