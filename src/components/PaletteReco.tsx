import React, { useMemo } from 'react';
import { ColorData } from '../data/colors';
import { generateRecommendedPalettes, RecommendedPalette } from '../utils/paletteGen';
import { hexToRgb } from '../utils/colorConverter';
import { relativeLuminance, contrastRatio } from '../utils/wcag';
import { downloadPalettePNG } from '../utils/exportUtils';

interface PaletteRecoProps {
    baseHex: string;
    onSelectColor: (color: ColorData) => void;
    onAddAll: (colors: ColorData[]) => void;
    onShowToast: (msg: string) => void;
}

export const PaletteReco: React.FC<PaletteRecoProps> = ({ baseHex, onSelectColor, onAddAll, onShowToast }) => {
    const palettes = useMemo(
        () => generateRecommendedPalettes(baseHex),
        [baseHex],
    );

    return (
        <section className="palette-reco">
            <h2 className="palette-reco-title">推薦色票</h2>
            <div className="palette-reco-grid">
                {palettes.map((p, idx) => (
                    <PaletteCard
                        key={`${p.label}-${idx}`}
                        palette={p}
                        onSelectColor={onSelectColor}
                        onAddAll={onAddAll}
                        onShowToast={onShowToast}
                    />
                ))}
            </div>
        </section>
    );
};

interface PaletteCardProps {
    palette: RecommendedPalette;
    onSelectColor: (color: ColorData) => void;
    onAddAll: (colors: ColorData[]) => void;
    onShowToast: (msg: string) => void;
}

const PaletteCard: React.FC<PaletteCardProps> = ({ palette, onSelectColor, onAddAll, onShowToast }) => {
    return (
        <div className="reco-card">
            <div className="reco-card-header">
                <span className="reco-label">{palette.emoji} {palette.label}</span>
                <div className="reco-actions">
                    <button className="reco-save-all" onClick={() => downloadPalettePNG(palette, onShowToast)}>
                        ⬇ 下載 PNG
                    </button>
                    <button className="reco-save-all" onClick={() => onAddAll(palette.colors)}>
                        + 收藏整組
                    </button>
                </div>
            </div>

            <div className="reco-strip">
                {palette.colors.map((color, index) => {
                    const rgb = hexToRgb(color.hex);
                    const backgroundLuminance = relativeLuminance(rgb.r, rgb.g, rgb.b);
                    const ratioWithWhite = contrastRatio(1.0, backgroundLuminance);
                    const ratioWithBlack = contrastRatio(0.0, backgroundLuminance);
                    const shouldUseDarkText = ratioWithBlack > ratioWithWhite;
                    return (
                        <div
                            key={index}
                            className="reco-strip-cell"
                            style={{
                                backgroundColor: color.hex,
                                color: shouldUseDarkText ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.85)'
                            }}
                            data-hex={color.hex}
                            onClick={() => onSelectColor(color)}
                        />
                    );
                })}
            </div>

            <div className="reco-names">
                {palette.colors.map((c, i) => (
                    <span key={i} className="reco-name-cell" onClick={() => onSelectColor(c)}>
                        {c.nameTW}
                    </span>
                ))}
            </div>
        </div>
    );
};
