import React from 'react';
import { ArrowLeft, Sunrise, Shuffle } from 'lucide-react';

interface HeaderProps {
    onRandomColor: () => void;
    onTodayColor: () => void;
    onGoHome?: () => void;
    showActions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    onRandomColor,
    onTodayColor,
    onGoHome,
    showActions = true,
}) => {
    return (
        <header className="header">
            <div className="header-island">
                {onGoHome ? (
                    <button
                        type="button"
                        className="logo-group logo-group--button"
                        onClick={onGoHome}
                        aria-label="回到選色首頁"
                    >
                        <span className="logo">雅色</span>
                        <span className="logo-sub">Bloom Picker</span>
                    </button>
                ) : (
                    <div className="logo-group">
                        <div className="logo">雅色</div>
                        <div className="logo-sub">Bloom Picker</div>
                    </div>
                )}
                {showActions && (
                    <nav className="header-actions" aria-label="靈感探索">
                        {onGoHome && (
                            <button
                                type="button"
                                className="header-btn header-btn--home touch-target"
                                onClick={onGoHome}
                            >
                                <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
                                <span>返回首頁</span>
                            </button>
                        )}
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
                )}
            </div>
        </header>
    );
};
