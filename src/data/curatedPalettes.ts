export interface CuratedPaletteRecord {
    label: string;
    emoji: string;
    names: string[];
}

export const CURATED_PALETTES: Record<string, CuratedPaletteRecord[]> = {
    red: [
        { label: '緋紅繚亂', emoji: '🌺', names: ['suoh', 'beni', 'momo', 'sakura', 'shironeri'] },
        { label: '夕陽餘暉', emoji: '🌅', names: ['akabeni', 'kohaku', 'kitsune', 'kitsurubami', 'hai'] }
    ],
    orange: [
        { label: '秋楓燦爛', emoji: '🍂', names: ['daidai', 'kitsune', 'tobi', 'rikyu_nezumi', 'byakuroku'] },
        { label: '暖陽金秋', emoji: '🍁', names: ['kohaku', 'kuchinashi', 'karakurenai', 'matsubairo', 'gofun'] }
    ],
    yellow: [
        { label: '金穗搖曳', emoji: '🌾', names: ['kitsurubami', 'kariyasu', 'ukon', 'wasurenagusa', 'shironeri'] },
        { label: '琥珀蜜光', emoji: '🍯', names: ['kohaku', 'tamago', 'nanohana', 'chigusa', 'nibi'] }
    ],
    green: [
        { label: '翠竹清風', emoji: '🎋', names: ['moegi', 'matsubairo', 'wakatake', 'byakuroku', 'shironeri'] },
        { label: '深山幽谷', emoji: '🌲', names: ['tokiwa', 'sensaicha', 'aotake', 'rikyucha', 'sunezumi'] }
    ],
    cyan: [
        { label: '碧海晴空', emoji: '🌊', names: ['asagi', 'mizuasagi', 'byakugun', 'noshimehana', 'gofun'] },
        { label: '湖光山色', emoji: '🏞️', names: ['seiji', 'rokusho', 'chigusa', 'wasurenagusa', 'hai'] }
    ],
    blue: [
        { label: '藍染物語', emoji: '🧵', names: ['gunjyo', 'ruri', 'hanada', 'byakugun', 'shironeri'] },
        { label: '星夜深邃', emoji: '🌌', names: ['kon', 'tetsukon', 'rurikon', 'fujimurasaki', 'gofun'] }
    ],
    purple: [
        { label: '紫藤花語', emoji: '🪻', names: ['fuji', 'fujimurasaki', 'shion', 'usubeni', 'gofun'] },
        { label: '宮廷典雅', emoji: '👘', names: ['murasaki', 'kokimurasaki', 'sumire', 'sakura', 'shironeri'] }
    ],
    neutral: [
        { label: '水墨寫意', emoji: '🖌️', names: ['sunezumi', 'nibi', 'hai', 'ginnezumi', 'shironeri'] },
        { label: '侘寂之美', emoji: '🏯', names: ['rikyucha', 'sensaicha', 'rikyu_nezumi', 'gofun', 'keshizumi'] }
    ]
};
