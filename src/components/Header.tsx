import React from 'react';
import { Sunrise, Shuffle } from 'lucide-react';

interface HeaderProps {
    onRandomColor: () => void;
    onTodayColor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRandomColor, onTodayColor }) => {
    return (
        <header className="header">
            <div className="header-top">
                <div className="logo">BLOOM PICKER</div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="header-btn"
                        onClick={onTodayColor}
                    >
                        <Sunrise size={14} />
                        <span>今日之色</span>
                    </button>
                    <button
                        type="button"
                        className="header-btn"
                        onClick={onRandomColor}
                    >
                        <Shuffle size={14} />
                        <span>隨機一色</span>
                    </button>
                </div>
            </div>
            <p className="tagline">傳統色彩 · 雅緻選色</p>
        </header>
    );
};
