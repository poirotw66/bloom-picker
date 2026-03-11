import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ColorData } from '../data/colors';
import { hexToRgb, rgbToCmyk, rgbToHsl } from '../utils/colorConverter';
import { relativeLuminance, contrastRatio, formatRatio, wcagGrade, wcagIcon } from '../utils/wcag';
import { getVariations, findNearestTraditionalColor } from '../utils/paletteGen';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorDetailProps {
    color: ColorData;
    onShowToast: (msg: string) => void;
    onSelectColor: (color: ColorData) => void;
}

const COLOR_CAPTIONS: Record<string, string> = {
    momo: '「 微雨乍晴的桃花頰，帶著初戀還未說出口的薄紅。 」',
};

export const ColorDetail: React.FC<ColorDetailProps> = ({ color, onShowToast, onSelectColor }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const rgb = hexToRgb(color.hex);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const variations = getVariations(color.hex).map((hexValue) => ({
        hex: hexValue,
        nearest: findNearestTraditionalColor(hexValue),
    }));

    const whiteLum = 1.0;
    const blackLum = 0.0;
    const colorLum = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const ratioWhite = contrastRatio(whiteLum, colorLum);
    const ratioBlack = contrastRatio(blackLum, colorLum);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => onShowToast(`已複製 ${text}`));
    };

    const exportSingle = (format: 'css' | 'scss' | 'rgb' | 'hsl') => {
        let text = '';
        switch (format) {
            case 'css': text = `--color-${color.name}: ${color.hex};`; break;
            case 'scss': text = `$${color.name}: ${color.hex};`; break;
            case 'rgb': text = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; break;
            case 'hsl': text = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`; break;
        }
        copy(text);
        setDropdownOpen(false);
    };

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
            <AnimatePresence mode="wait">
                <motion.div
                    key={color.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="display-main"
                >
                    <h1 className="color-name">{color.nameTW}</h1>
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
                </motion.div>
            </AnimatePresence>

            <div className="color-values">
                <div className="value-row">
                    <span className="value-label">CMYK</span>
                    <span className="value">{cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}</span>
                    <span className="value-label" style={{ marginLeft: '1rem' }}>RGB</span>
                    <span className="value">{rgb.r}, {rgb.g}, {rgb.b}</span>
                </div>
                <div className="value-row">
                    <span className="value-label">HSL</span>
                    <span className="value">{Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%</span>
                </div>
                <div className="value-row hex-row">
                    <span className="value-label">HEX</span>
                    <span className="value value-hex" onClick={() => copy(color.hex)}>{color.hex.replace('#', '')}</span>

                    <div className="export-dropdown-wrap" ref={dropdownRef}>
                        <button className="export-format-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            ▼ 格式
                        </button>
                        {dropdownOpen && (
                            <div className="export-dropdown">
                                <button className="export-opt" onClick={() => exportSingle('css')}>CSS Variable</button>
                                <button className="export-opt" onClick={() => exportSingle('scss')}>SCSS Variable</button>
                                <button className="export-opt" onClick={() => exportSingle('rgb')}>RGB Formula</button>
                                <button className="export-opt" onClick={() => exportSingle('hsl')}>HSL Formula</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="wcag-checker">
                    <div className="wcag-row">
                        <div className="wcag-sample wcag-white" style={{ backgroundColor: color.hex }}>Aa</div>
                        <span className="wcag-ratio">{formatRatio(ratioWhite)}</span>
                        <div className="wcag-results">
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioWhite, 4.5)}`}>
                                    {wcagIcon(wcagGrade(ratioWhite, 4.5))} AA
                                </span>
                                <span className="wcag-desc">適合大文本 / 圖表</span>
                            </div>
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioWhite, 7)}`}>
                                    {wcagIcon(wcagGrade(ratioWhite, 7))} AAA
                                </span>
                                <span className="wcag-desc">適合所有大小文字</span>
                            </div>
                        </div>
                    </div>
                    <div className="wcag-row">
                        <div className="wcag-sample wcag-black" style={{ backgroundColor: color.hex }}>Aa</div>
                        <span className="wcag-ratio">{formatRatio(ratioBlack)}</span>
                        <div className="wcag-results">
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioBlack, 4.5)}`}>
                                    {wcagIcon(wcagGrade(ratioBlack, 4.5))} AA
                                </span>
                                <span className="wcag-desc">適合大文本 / 圖表</span>
                            </div>
                            <div className="wcag-item">
                                <span className={`wcag-badge ${wcagGrade(ratioBlack, 7)}`}>
                                    {wcagIcon(wcagGrade(ratioBlack, 7))} AAA
                                </span>
                                <span className="wcag-desc">適合所有大小文字</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
