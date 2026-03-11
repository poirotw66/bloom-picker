import { RecommendedPalette } from './paletteGen';

export function downloadPalettePNG(palette: RecommendedPalette, onComplete?: (msg: string) => void) {
    const W = 1200, H = 560;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Title bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, 0, W, 90);
    ctx.font = '600 28px "Noto Sans TC", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textBaseline = 'middle';
    ctx.fillText(palette.emoji + '  ' + palette.label, 40, 48);

    // Watermark
    ctx.font = '400 16px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.textAlign = 'right';
    ctx.fillText('Bloom Picker · 雅色', W - 40, 48);
    ctx.textAlign = 'left';

    // Color swatches
    const count = palette.colors.length;
    const swatchW = (W - 80 - (count - 1) * 16) / count;
    const swatchH = 320;
    const swatchY = 120;

    palette.colors.forEach((c, i) => {
        const x = 40 + i * (swatchW + 16);

        // Draw rounded swatch
        const radius = 12;
        ctx.beginPath();
        ctx.moveTo(x + radius, swatchY);
        ctx.lineTo(x + swatchW - radius, swatchY);
        ctx.quadraticCurveTo(x + swatchW, swatchY, x + swatchW, swatchY + radius);
        ctx.lineTo(x + swatchW, swatchY + swatchH - radius);
        ctx.quadraticCurveTo(x + swatchW, swatchY + swatchH, x + swatchW - radius, swatchY + swatchH);
        ctx.lineTo(x + radius, swatchY + swatchH);
        ctx.quadraticCurveTo(x, swatchY + swatchH, x, swatchY + swatchH - radius);
        ctx.lineTo(x, swatchY + radius);
        ctx.quadraticCurveTo(x, swatchY, x + radius, swatchY);
        ctx.closePath();
        ctx.fillStyle = c.hex;
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Color name (TW)
        const centerX = x + swatchW / 2;
        ctx.textAlign = 'center';
        ctx.font = '600 22px "Noto Sans TC", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fillText(c.nameTW, centerX, swatchY + swatchH + 36);

        // Hex code
        ctx.font = '500 16px "Outfit", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(c.hex.toUpperCase(), centerX, swatchY + swatchH + 62);

        // Romaji name
        ctx.font = '400 13px "Outfit", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText(c.name, centerX, swatchY + swatchH + 82);
    });

    const link = document.createElement('a');
    link.download = `bloom-picker-${palette.label}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (onComplete) onComplete(`已下載 ${palette.label} 色票`);
}
