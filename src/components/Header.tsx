import React from 'react';
import { Sunrise, Shuffle } from 'lucide-react';

interface HeaderProps {
    onRandomColor: () => void;
    onTodayColor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRandomColor, onTodayColor }) => {
    return (
        <header className="header">
            <div className="header-ornament" aria-hidden="true">
                <span className="header-ornament-line" />
                <span className="header-ornament-gem" />
                <span className="header-ornament-line" />
            </div>
            <div className="header-top">
                <div className="logo-group">
                    <div className="logo">雅色</div>
                    <div className="logo-sub">BLOOM PICKER</div>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="header-btn touch-target"
                        onClick={onTodayColor}
                    >
                        <Sunrise size={14} strokeWidth={1.5} />
                        <span>今日之色</span>
                    </button>
                    <button
                        type="button"
                        className="header-btn touch-target"
                        onClick={onRandomColor}
                    >
                        <Shuffle size={14} strokeWidth={1.5} />
                        <span>隨機一色</span>
                    </button>
                </div>
            </div>
            <p className="tagline">傳統色彩 · 雅緻選色</p>
        </header>
    );
};
