import React, { useMemo, useState, useCallback, CSSProperties } from 'react';
import { Sunrise, Shuffle, Search, ArrowUpRight } from 'lucide-react';
import { ColorData } from '../data/colors';
import {
    COLORS_WITH_META,
    ColorWithMeta,
    getColorTextStyle,
} from '../utils/colorMeta';

const HUES = [
    { id: 'all', label: '全部' },
    { id: 'red', label: '紅' },
    { id: 'orange', label: '橙' },
    { id: 'yellow', label: '黃' },
    { id: 'green', label: '綠' },
    { id: 'cyan', label: '青' },
    { id: 'blue', label: '藍' },
    { id: 'purple', label: '紫' },
    { id: 'neutral', label: '灰' },
] as const;

/** Indices that expand into 2×2 mosaic tiles for bento rhythm. */
const FEATURED_SPANS = new Set([2, 11, 24, 33, 41]);

interface ColorHomeProps {
    onSelectColor: (color: ColorData) => void;
    onTodayColor: () => void;
    onRandomColor: () => void;
}

function normalizeQuery(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '');
}

function pickMosaicColors(count: number): ColorWithMeta[] {
    const total = COLORS_WITH_META.length;
    if (count >= total) {
        return COLORS_WITH_META;
    }
    const step = total / count;
    const picked: ColorWithMeta[] = [];
    for (let i = 0; i < count; i += 1) {
        picked.push(COLORS_WITH_META[Math.floor(i * step)]);
    }
    return picked;
}

export const ColorHome: React.FC<ColorHomeProps> = ({
    onSelectColor,
    onTodayColor,
    onRandomColor,
}) => {
    const [activeHue, setActiveHue] = useState<string>('all');
    const [query, setQuery] = useState('');
    const [preview, setPreview] = useState<ColorWithMeta | null>(null);

    const mosaicColors = useMemo(() => pickMosaicColors(48), []);

    const galleryColors = useMemo(() => {
        const normalized = normalizeQuery(query);
        return COLORS_WITH_META.filter((color) => {
            if (activeHue !== 'all' && color.hue !== activeHue) {
                return false;
            }
            if (!normalized) {
                return true;
            }
            return (
                normalizeQuery(color.nameTW).includes(normalized) ||
                normalizeQuery(color.nameJA).includes(normalized) ||
                normalizeQuery(color.name).includes(normalized) ||
                color.hex.toLowerCase().includes(normalized)
            );
        });
    }, [activeHue, query]);

    const clearPreview = useCallback(() => setPreview(null), []);

    const ambientHex = preview?.hex ?? '#141820';

    return (
        <div className="color-home">
            <div
                className="home-ambient"
                style={{ backgroundColor: ambientHex }}
                aria-hidden="true"
            />
            <div className="home-grain" aria-hidden="true" />

            <section className="home-hero" aria-labelledby="home-brand">
                <div
                    className="home-mosaic"
                    role="list"
                    aria-label="精選傳統色，點選進入"
                    onMouseLeave={clearPreview}
                >
                    {mosaicColors.map((color, index) => {
                        const isFeatured = FEATURED_SPANS.has(index);
                        return (
                            <button
                                key={color.name}
                                type="button"
                                role="listitem"
                                className={`home-mosaic-cell ${isFeatured ? 'home-mosaic-cell--lg' : ''}`}
                                style={{
                                    backgroundColor: color.hex,
                                    ['--i' as string]: index,
                                } as CSSProperties}
                                aria-label={`${color.nameTW} ${color.hex}`}
                                onMouseEnter={() => setPreview(color)}
                                onFocus={() => setPreview(color)}
                                onBlur={clearPreview}
                                onClick={() => onSelectColor(color)}
                            >
                                <span
                                    className="home-mosaic-label"
                                    style={getColorTextStyle(color.useDarkText)}
                                >
                                    {color.nameTW}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="home-hero-scrim" aria-hidden="true" />

                <div className="home-hero-copy">
                    <p id="home-brand" className="home-brand">雅色</p>
                    <h1 className="home-headline">選擇一抹傳統色</h1>
                    <p className="home-lead">
                        二百五十款東亞傳統色，點選即入色境。
                    </p>
                    <div className="home-ctas">
                        <button
                            type="button"
                            className="home-cta home-cta--primary"
                            onClick={onTodayColor}
                        >
                            <span>今日之色</span>
                            <span className="home-cta-icon" aria-hidden="true">
                                <Sunrise size={15} strokeWidth={1.5} />
                            </span>
                        </button>
                        <button
                            type="button"
                            className="home-cta home-cta--ghost"
                            onClick={onRandomColor}
                        >
                            <span>隨機一色</span>
                            <span className="home-cta-icon" aria-hidden="true">
                                <Shuffle size={15} strokeWidth={1.5} />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="home-preview" aria-live="polite">
                    {preview ? (
                        <>
                            <span className="home-preview-name">{preview.nameTW}</span>
                            <span className="home-preview-meta">
                                {preview.nameJA}
                                <span className="home-preview-sep" aria-hidden="true">/</span>
                                {preview.hex}
                            </span>
                        </>
                    ) : (
                        <span className="home-preview-hint">滑過色塊預覽 · 點選進入</span>
                    )}
                </div>
            </section>

            <section className="home-gallery" aria-labelledby="home-gallery-title">
                <div className="home-gallery-intro">
                    <h2 id="home-gallery-title" className="home-gallery-title">
                        全部色票
                    </h2>
                    <p className="home-gallery-lead">
                        依色相瀏覽，或搜尋繁中色名、日文與拼音。
                    </p>
                </div>

                <div className="home-gallery-tools">
                    <div className="home-search-shell">
                        <div className="home-search">
                            <Search size={16} strokeWidth={1.5} className="home-search-icon" aria-hidden="true" />
                            <input
                                type="search"
                                className="home-search-input"
                                placeholder="搜尋色名、拼音或色碼"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                aria-label="搜尋傳統色"
                            />
                        </div>
                    </div>
                    <div className="home-hues" role="group" aria-label="色相篩選">
                        {HUES.map((hue) => (
                            <button
                                key={hue.id}
                                type="button"
                                className={`home-hue-btn ${activeHue === hue.id ? 'is-active' : ''}`}
                                onClick={() => setActiveHue(hue.id)}
                                aria-pressed={activeHue === hue.id}
                            >
                                {hue.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="home-gallery-count">{galleryColors.length} 色</p>

                <ul className="home-swatch-grid">
                    {galleryColors.map((color, index) => (
                        <li
                            key={color.name}
                            style={{ ['--i' as string]: Math.min(index, 24) } as CSSProperties}
                        >
                            <button
                                type="button"
                                className="home-swatch"
                                style={{ backgroundColor: color.hex }}
                                aria-label={`${color.nameTW} ${color.hex}`}
                                onClick={() => onSelectColor(color)}
                            >
                                <span className="home-swatch-top">
                                    <span
                                        className="home-swatch-name"
                                        style={getColorTextStyle(color.useDarkText)}
                                    >
                                        {color.nameTW}
                                    </span>
                                    <span
                                        className="home-swatch-go"
                                        style={getColorTextStyle(color.useDarkText)}
                                        aria-hidden="true"
                                    >
                                        <ArrowUpRight size={14} strokeWidth={1.5} />
                                    </span>
                                </span>
                                <span
                                    className="home-swatch-hex"
                                    style={getColorTextStyle(color.useDarkText)}
                                >
                                    {color.hex.replace('#', '')}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                {galleryColors.length === 0 && (
                    <p className="home-empty">找不到相符的傳統色，試試其他關鍵字。</p>
                )}
            </section>
        </div>
    );
};
