import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { ColorData } from '../data/colors';
import { COLOR_CAPTIONS } from '../data/colorCaptions';
import { hexToRgb, rgbToCmyk, rgbToHsl } from '../utils/colorConverter';
import { relativeLuminance, contrastRatio, formatRatio, wcagGrade, wcagIcon } from '../utils/wcag';
import { getVariations, findNearestTraditionalColor } from '../utils/paletteGen';

interface ColorDetailProps {
    color: ColorData;
    onShowToast: (msg: string) => void;
    onSelectColor: (color: ColorData) => void;
    showHeroHex?: boolean;
}

export const ColorDetail: React.FC<ColorDetailProps> = memo(function ColorDetail({
    color,
    onShowToast,
    onSelectColor,
    showHeroHex = false,
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const { rgb, cmyk, hsl, ratioWhite, ratioBlack, variations } = useMemo(() => {
        const rgbValue = hexToRgb(color.hex);
        const cmykValue = rgbToCmyk(rgbValue.r, rgbValue.g, rgbValue.b);
        const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
        const colorLum = relativeLuminance(rgbValue.r, rgbValue.g, rgbValue.b);
        const variationList = getVariations(color.hex).map((hexValue) => ({
            hex: hexValue,
            nearest: findNearestTraditionalColor(hexValue),
        }));

        return {
            rgb: rgbValue,
            cmyk: cmykValue,
            hsl: hslValue,
            ratioWhite: contrastRatio(1.0, colorLum),
            ratioBlack: contrastRatio(0.0, colorLum),
            variations: variationList,
        };
    }, [color.hex]);

    const copy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => onShowToast(`已複製 ${text}`));
    }, [onShowToast]);

    const exportSingle = useCallback((format: 'css' | 'scss' | 'rgb' | 'hsl') => {
        let text = '';
        switch (format) {
            case 'css': text = `--color-${color.name}: ${color.hex};`; break;
            case 'scss': text = `$${color.name}: ${color.hex};`; break;
            case 'rgb': text = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; break;
            case 'hsl': text = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`; break;
        }
        copy(text);
        setDropdownOpen(false);
    }, [color.hex, color.name, copy, hsl.h, hsl.l, hsl.s, rgb.b, rgb.g, rgb.r]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (!dropdownOpen) {
            return;
        }
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    }, [dropdownOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="color-display">
            <div key={color.name} className="display-main color-detail-enter">
                <h1 className="color-name">{color.nameTW}</h1>
                {showHeroHex && (
                    <button
                        type="button"
                        className="color-hex-hero touch-target"
                        onClick={() => copy(color.hex)}
                        aria-label={`複製色碼 ${color.hex}`}
                    >
                        {color.hex.replace('#', '')}
                    </button>
                )}
                <p className="color-name-ja">{color.nameJA} · {color.name}</p>
                {COLOR_CAPTIONS[color.name] && (
                    <p className="color-caption">
                        {COLOR_CAPTIONS[color.name]}
                    </p>
                )}

                <div className="variation-section">
                    <p className="variation-heading">相似顏色</p>
                    <div className="color-variations">
                        {variations.map((swatch) => (
                            <div key={swatch.hex} className="variation-item-wrap">
                                <div
                                    className="variation-item"
                                    style={{ backgroundColor: swatch.hex }}
                                    data-hex={swatch.hex}
                                    onClick={() => onSelectColor(swatch.nearest)}
                                />
                                <span className="variation-label">
                                    {swatch.nearest.nameTW}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="color-values">
                <dl className="value-list">
                    <div className="value-entry">
                        <dt className="value-label">CMYK</dt>
                        <dd className="value">{cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}</dd>
                    </div>
                    <div className="value-entry">
                        <dt className="value-label">RGB</dt>
                        <dd className="value">{rgb.r}, {rgb.g}, {rgb.b}</dd>
                    </div>
                    <div className="value-entry">
                        <dt className="value-label">HSL</dt>
                        <dd className="value">
                            {Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%
                        </dd>
                    </div>
                    {!showHeroHex && (
                        <div className="value-entry">
                            <dt className="value-label">HEX</dt>
                            <dd className="value value-hex" onClick={() => copy(color.hex)}>
                                {color.hex.replace('#', '')}
                            </dd>
                        </div>
                    )}
                </dl>

                <div className="value-toolbar">
                    <span className="value-toolbar-label">匯出格式</span>
                    <div className="export-dropdown-wrap" ref={dropdownRef}>
                        <button
                            type="button"
                            className="export-format-btn touch-target"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                            aria-haspopup="menu"
                        >
                            ▼ 格式
                        </button>
                        {dropdownOpen && (
                            <div className="export-dropdown" role="menu">
                                <button type="button" className="export-opt" onClick={() => exportSingle('css')}>CSS Variable</button>
                                <button type="button" className="export-opt" onClick={() => exportSingle('scss')}>SCSS Variable</button>
                                <button type="button" className="export-opt" onClick={() => exportSingle('rgb')}>RGB Formula</button>
                                <button type="button" className="export-opt" onClick={() => exportSingle('hsl')}>HSL Formula</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="wcag-checker">
                    <p className="wcag-heading">無障礙對比</p>
                    <div className="wcag-row">
                        <div className="wcag-preview">
                            <div className="wcag-sample wcag-white" style={{ backgroundColor: color.hex }}>Aa</div>
                            <span className="wcag-ratio">{formatRatio(ratioWhite)}</span>
                            <span className="wcag-legend">白字</span>
                        </div>
                        <div className="wcag-results">
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioWhite, 4.5)}`}>
                                    {wcagIcon(wcagGrade(ratioWhite, 4.5))} AA
                                </span>
                                <span className="wcag-desc">大文本 / 圖表</span>
                            </div>
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioWhite, 7)}`}>
                                    {wcagIcon(wcagGrade(ratioWhite, 7))} AAA
                                </span>
                                <span className="wcag-desc">所有大小文字</span>
                            </div>
                        </div>
                    </div>
                    <div className="wcag-row">
                        <div className="wcag-preview">
                            <div className="wcag-sample wcag-black" style={{ backgroundColor: color.hex }}>Aa</div>
                            <span className="wcag-ratio">{formatRatio(ratioBlack)}</span>
                            <span className="wcag-legend">黑字</span>
                        </div>
                        <div className="wcag-results">
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioBlack, 4.5)}`}>
                                    {wcagIcon(wcagGrade(ratioBlack, 4.5))} AA
                                </span>
                                <span className="wcag-desc">大文本 / 圖表</span>
                            </div>
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioBlack, 7)}`}>
                                    {wcagIcon(wcagGrade(ratioBlack, 7))} AAA
                                </span>
                                <span className="wcag-desc">所有大小文字</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
