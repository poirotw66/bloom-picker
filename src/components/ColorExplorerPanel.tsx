import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Palette, X } from 'lucide-react';
import { ColorData } from '../data/colors';
import { ColorSidebar } from './ColorSidebar';

interface ColorExplorerPanelProps {
    onSelect: (color: ColorData) => void;
    activeColor: ColorData | null;
    onToggleFavorite: (name: string) => void;
    isFavorite: (name: string) => boolean;
    colorCount: number;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const ColorExplorerPanel: React.FC<ColorExplorerPanelProps> = ({
    onSelect,
    activeColor,
    onToggleFavorite,
    isFavorite,
    colorCount,
    isOpen: controlledOpen,
    onOpenChange,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const panelRef = useRef<HTMLDivElement>(null);

    const setOpen = useCallback((open: boolean) => {
        if (!isControlled) {
            setInternalOpen(open);
        }
        onOpenChange?.(open);
    }, [isControlled, onOpenChange]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, setOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
        };
    }, [isOpen, setOpen]);

    const handleSelect = (color: ColorData) => {
        onSelect(color);
        setOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div
                    className="slide-panel-backdrop"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div
                ref={panelRef}
                className={`color-explorer-panel ${isOpen ? 'open' : ''}`}
            >
                <div
                    className="color-explorer-panel-drawer"
                    role="dialog"
                    aria-label="探索色票"
                    aria-hidden={!isOpen}
                >
                    <div className="color-explorer-panel-header">
                        <span className="color-explorer-panel-title">探索色票</span>
                        <span className="palette-count">{colorCount}</span>
                        <button
                            type="button"
                            className="color-explorer-panel-close touch-target"
                            onClick={() => setOpen(false)}
                            aria-label="關閉色票列表"
                            tabIndex={isOpen ? 0 : -1}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="color-explorer-panel-body">
                        {isOpen && (
                            <ColorSidebar
                                onSelect={handleSelect}
                                activeColor={activeColor}
                                onToggleFavorite={onToggleFavorite}
                                isFavorite={isFavorite}
                                showSearch={false}
                                variant="explorer"
                            />
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className="color-explorer-panel-tab touch-target"
                    onClick={() => setOpen(!isOpen)}
                    aria-label={isOpen ? '收合色票列表' : '展開色票列表'}
                    aria-expanded={isOpen}
                >
                    <Palette size={20} aria-hidden="true" />
                </button>
            </div>
        </>
    );
};
