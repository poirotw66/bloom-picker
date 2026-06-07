import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronUp as ChevronUpIcon } from 'lucide-react';
import { ColorData } from '../data/colors';
import { COLOR_BY_NAME, ColorWithMeta } from '../utils/colorMeta';
import { useIsMobile } from '../hooks/useIsMobile';

interface FavoriteDrawerProps {
    favorites: string[];
    onSelectColor: (color: ColorData) => void;
    onRemoveFavorite: (name: string) => void;
    onClear: () => void;
    onExportCSS: () => void;
    onExportJSON: () => void;
    onReorder: (names: string[]) => void;
    onOpenChange?: (isOpen: boolean) => void;
}

export const FavoriteDrawer: React.FC<FavoriteDrawerProps> = ({
    favorites,
    onSelectColor,
    onRemoveFavorite,
    onClear,
    onExportCSS,
    onExportJSON,
    onReorder,
    onOpenChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draggingName, setDraggingName] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const favColors = favorites
        .map((name) => COLOR_BY_NAME.get(name))
        .filter((color): color is ColorWithMeta => !!color);
    const toggleOpen = () => {
        setIsOpen((open) => {
            const next = !open;
            onOpenChange?.(next);
            return next;
        });
    };

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

    const moveFavorite = (name: string, direction: 'up' | 'down') => {
        const currentOrder = favColors.map((color) => color.name);
        const index = currentOrder.indexOf(name);
        if (index === -1) {
            return;
        }

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentOrder.length) {
            return;
        }

        const nextOrder = [...currentOrder];
        nextOrder.splice(index, 1);
        nextOrder.splice(targetIndex, 0, name);
        onReorder(nextOrder);
    };

    return (
        <div className={`palette-drawer ${isOpen ? 'open' : ''}`}>
            <div className="palette-header touch-target" onClick={toggleOpen}>
                <button type="button" className="palette-toggle touch-target">
                    <ChevronUpIcon
                        size={18}
                        className="palette-toggle-icon"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                        aria-hidden="true"
                    />
                    <span>我的調色盤</span>
                    <span className="palette-count">{favorites.length}</span>
                </button>

                <div className="palette-actions">
                    <button
                        type="button"
                        className="palette-action-btn touch-target"
                        onClick={(event) => {
                            event.stopPropagation();
                            onExportCSS();
                        }}
                    >
                        CSS
                    </button>
                    <button
                        type="button"
                        className="palette-action-btn touch-target"
                        onClick={(event) => {
                            event.stopPropagation();
                            onExportJSON();
                        }}
                    >
                        JSON
                    </button>
                    <button
                        type="button"
                        className="palette-action-btn palette-clear touch-target"
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
                {favColors.length === 0 ? (
                    <span className="palette-empty">
                        點擊色塊上的 ♡ 加入收藏
                    </span>
                ) : (
                    favColors.map((color, index) => (
                        <div
                            key={color.name}
                            className="palette-item"
                            draggable={!isMobile}
                            onDragStart={() => handleDragStart(color.name)}
                            onDragOver={(event) => {
                                event.preventDefault();
                                handleDragOver(color.name);
                            }}
                            onDragEnd={handleDragEnd}
                            onClick={() => onSelectColor(color)}
                        >
                            <div className="palette-swatch" style={{ backgroundColor: color.hex }} />
                            <span className="palette-item-name">{color.nameTW}</span>
                            {isMobile && (
                                <div className="palette-reorder-group">
                                    <button
                                        type="button"
                                        className="palette-reorder-btn touch-target"
                                        aria-label={`將 ${color.nameTW} 上移`}
                                        disabled={index === 0}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            moveFavorite(color.name, 'up');
                                        }}
                                    >
                                        <ChevronUp size={16} aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        className="palette-reorder-btn touch-target"
                                        aria-label={`將 ${color.nameTW} 下移`}
                                        disabled={index === favColors.length - 1}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            moveFavorite(color.name, 'down');
                                        }}
                                    >
                                        <ChevronDown size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                            <button
                                type="button"
                                className="palette-remove touch-target"
                                aria-label={`移除 ${color.nameTW}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onRemoveFavorite(color.name);
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
