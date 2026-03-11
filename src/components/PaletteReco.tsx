import React from 'react';
import { ColorData } from '../data/colors';
import { generateRecommendedPalettes, RecommendedPalette } from '../utils/paletteGen';
import { isLightColor, hexToRgb } from '../utils/colorConverter';
import { downloadPalettePNG } from '../utils/exportUtils';

interface PaletteRecoProps {
    baseHex: string;
    onSelectColor: (color: ColorData) => void;
    onAddAll: (colors: ColorData[]) => void;
    onShowToast: (msg: string) => void;
}

export const PaletteReco: React.FC<PaletteRecoProps> = ({ baseHex, onSelectColor, onAddAll, onShowToast }) => {
    const palettes = generateRecommendedPalettes(baseHex);

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
                {palette.colors.map((c, i) => {
                    const rgb = hexToRgb(c.hex);
                    const isLight = isLightColor(rgb.r, rgb.g, rgb.b);
                    return (
                        <div
                            key={i}
                            className="reco-strip-cell"
                            style={{
                                backgroundColor: c.hex,
                                color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'
                            }}
                            data-hex={c.hex}
                            onClick={() => onSelectColor(c)}
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
