import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { COLORS_WITH_META } from '../utils/colorMeta';
import { ColorData } from '../data/colors';

interface SearchPanelProps {
    onSelectColor: (color: ColorData) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function normalizeLatin(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
    onSelectColor,
    isOpen: controlledOpen,
    onOpenChange,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const setOpen = useCallback((open: boolean) => {
        if (!isControlled) {
            setInternalOpen(open);
        }
        onOpenChange?.(open);
    }, [isControlled, onOpenChange]);

    const filteredColors = useMemo(() => {
        const rawTerm = searchTerm.trim();
        if (!rawTerm) {
            return COLORS_WITH_META.slice(0, 12);
        }

        const latinTerm = normalizeLatin(rawTerm);
        return COLORS_WITH_META.filter((color) => {
            const twMatch = color.nameTW.includes(rawTerm);
            const latinName = normalizeLatin(color.name);
            const latinMatch = latinTerm !== ''
                && (latinName.startsWith(latinTerm) || latinName.includes(latinTerm));
            const jaMatch = color.nameJA.includes(rawTerm);
            return twMatch || jaMatch || latinMatch;
        }).slice(0, 24);
    }, [searchTerm]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        inputRef.current?.focus();
    }, [isOpen]);

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
        onSelectColor(color);
        setOpen(false);
        setSearchTerm('');
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
                className={`search-panel ${isOpen ? 'open' : ''}`}
            >
                <div className="search-panel-drawer" role="dialog" aria-label="搜尋色名" aria-hidden={!isOpen}>
                    <div className="search-panel-header">
                        <span className="search-icon" aria-hidden="true">
                            <Search size={16} />
                        </span>
                        <input
                            ref={inputRef}
                            type="search"
                            className="search-input search-panel-input"
                            placeholder="搜尋色名..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            aria-label="搜尋色名"
                            tabIndex={isOpen ? 0 : -1}
                        />
                        <button
                            type="button"
                            className="search-panel-close touch-target"
                            onClick={() => setOpen(false)}
                            aria-label="關閉搜尋"
                            tabIndex={isOpen ? 0 : -1}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <ul className="search-results">
                        {filteredColors.map((color) => (
                            <li key={color.name}>
                                <button
                                    type="button"
                                    className="search-result-item touch-target"
                                    onClick={() => handleSelect(color)}
                                    tabIndex={isOpen ? 0 : -1}
                                >
                                    <span
                                        className="search-result-swatch"
                                        style={{ backgroundColor: color.hex }}
                                        aria-hidden="true"
                                    />
                                    <span className="search-result-name">{color.nameTW}</span>
                                    <span className="search-result-hex">{color.hex}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="button"
                    className="search-panel-tab touch-target"
                    onClick={() => setOpen(!isOpen)}
                    aria-label={isOpen ? '收合搜尋' : '展開搜尋'}
                    aria-expanded={isOpen}
                >
                    <Search size={20} aria-hidden="true" />
                </button>
            </div>
        </>
    );
};
