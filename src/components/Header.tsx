import React from 'react';
import { Sunrise, Shuffle } from 'lucide-react';

interface HeaderProps {
    onRandomColor: () => void;
    onTodayColor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRandomColor, onTodayColor }) => {
    return (
        <header className="header">
            <div className="header-island">
                <div className="logo-group">
                    <div className="logo">雅色</div>
                    <div className="logo-sub">Bloom Picker</div>
                </div>
                <nav className="header-actions" aria-label="靈感探索">
                    <button
                        type="button"
                        className="header-btn touch-target"
                        onClick={onTodayColor}
                    >
                        <Sunrise size={15} strokeWidth={1.5} aria-hidden="true" />
                        <span>今日之色</span>
                    </button>
                    <button
                        type="button"
                        className="header-btn touch-target"
                        onClick={onRandomColor}
                    >
                        <Shuffle size={15} strokeWidth={1.5} aria-hidden="true" />
                        <span>隨機一色</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};
