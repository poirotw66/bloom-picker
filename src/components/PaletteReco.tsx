import React, { useMemo } from 'react';
import { Download, Heart } from 'lucide-react';
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
        <div className="reco-card-shell">
            <div className="reco-card">
                <div className="reco-card-header">
                    <span className="reco-label">{palette.label}</span>
                    <div className="reco-actions">
                        <button
                            type="button"
                            className="reco-save-all"
                            onClick={() => downloadPalettePNG(palette, onShowToast)}
                        >
                            <Download size={12} strokeWidth={1.5} aria-hidden="true" />
                            PNG
                        </button>
                        <button
                            type="button"
                            className="reco-save-all"
                            onClick={() => onAddAll(palette.colors)}
                        >
                            <Heart size={12} strokeWidth={1.5} aria-hidden="true" />
                            收藏
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
                            <button
                                key={index}
                                type="button"
                                className="reco-strip-cell"
                                style={{
                                    backgroundColor: color.hex,
                                    color: shouldUseDarkText ? 'rgba(17,22,28,0.85)' : 'rgba(255,255,255,0.9)'
                                }}
                                data-hex={color.hex}
                                aria-label={`選擇 ${color.nameTW} ${color.hex}`}
                                onClick={() => onSelectColor(color)}
                            />
                        );
                    })}
                </div>

                <div className="reco-names">
                    {palette.colors.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            className="reco-name-cell"
                            aria-label={`選擇 ${c.nameTW}`}
                            onClick={() => onSelectColor(c)}
                        >
                            {c.nameTW}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
