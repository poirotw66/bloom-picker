export interface CuratedPaletteRecord {
    label: string;
    emoji: string;
    names: string[];
}

/**
 * Curated palette combinations for each hue family.
 * Each hue has 4 palettes to ensure every color always has 4 recommendations.
 * All names MUST match the `name` field in TRADITIONAL_COLORS exactly.
 */
export const CURATED_PALETTES: Record<string, CuratedPaletteRecord[]> = {
    red: [
        { label: '緋紅繚亂', emoji: '🌺', names: ['suoh', 'kurenai', 'momo', 'sakura', 'shironeri'] },
        { label: '夕陽餘暉', emoji: '🌅', names: ['akabeni', 'kohaku', 'kitsune', 'kitsurubami', 'hai'] },
        { label: '春日和菓', emoji: '🌸', names: ['taikoh', 'usubeni', 'haizakura', 'byakuroku', 'gofun'] },
        { label: '深秋紅葉', emoji: '🍁', names: ['enji', 'kuriume', 'azuki', 'rikyucha', 'shironezumi'] }
    ],
    orange: [
        { label: '秋楓燦爛', emoji: '🍂', names: ['ohni', 'kitsune', 'tobi', 'rikyunezumi', 'byakuroku'] },
        { label: '暖陽金秋', emoji: '☀️', names: ['kohaku', 'kuchinashi', 'karakurenai', 'matsuba', 'gofun'] },
        { label: '琥珀茶香', emoji: '🍵', names: ['edocha', 'bengara', 'karacha', 'tonoko', 'shironeri'] },
        { label: '夕暮街景', emoji: '🏮', names: ['terigaki', 'sangosyu', 'akebono', 'ainezumi', 'keshizumi'] }
    ],
    yellow: [
        { label: '金穗搖曳', emoji: '🌾', names: ['kitsurubami', 'kariyasu', 'ukon', 'wasurenagusa', 'shironeri'] },
        { label: '琥珀蜜光', emoji: '🍯', names: ['kohaku', 'tamago', 'nanohana', 'chigusa', 'nibi'] },
        { label: '向日葵田', emoji: '🌻', names: ['yamabuki', 'kuchinashi', 'tohoh', 'moegi', 'gofun'] },
        { label: '金箔華麗', emoji: '✨', names: ['kincha', 'hajizome', 'usukoh', 'kon', 'shironezumi'] }
    ],
    green: [
        { label: '翠竹清風', emoji: '🎋', names: ['moegi', 'matsuba', 'wakatake', 'byakuroku', 'shironeri'] },
        { label: '深山幽谷', emoji: '🌲', names: ['tokiwa', 'sensaicha', 'aotake', 'rikyucha', 'sunezumi'] },
        { label: '新綠萌芽', emoji: '🌱', names: ['hiwamoegi', 'nae', 'yanagizome', 'urayanagi', 'gofun'] },
        { label: '抹茶庭園', emoji: '🍃', names: ['chitosemidori', 'oitake', 'tokusa', 'mushikuri', 'tonoko'] }
    ],
    cyan: [
        { label: '碧海晴空', emoji: '🌊', names: ['asagi', 'mizuasagi', 'byakugun', 'noshimehana', 'gofun'] },
        { label: '湖光山色', emoji: '🏞️', names: ['seiji', 'rokusyoh', 'chigusa', 'wasurenagusa', 'hai'] },
        { label: '清涼水面', emoji: '💧', names: ['mizu', 'kamenozoki', 'shinbashi', 'aomidori', 'shironeri'] },
        { label: '珊瑚礁影', emoji: '🐚', names: ['seiheki', 'sabiseiji', 'fukagawanezumi', 'sakura', 'sunezumi'] }
    ],
    blue: [
        { label: '藍染物語', emoji: '🧵', names: ['gunjyo', 'ruri', 'hanada', 'byakugun', 'shironeri'] },
        { label: '星夜深邃', emoji: '🌌', names: ['kon', 'tetsukon', 'rurikon', 'fujimurasaki', 'gofun'] },
        { label: '蒼穹萬里', emoji: '☁️', names: ['sora', 'tsuyukusa', 'wasurenagusa', 'mizu', 'shironezumi'] },
        { label: '藍海漸深', emoji: '🫧', names: ['hanaasagi', 'ai', 'konjyo', 'kamenozoki', 'tonoko'] }
    ],
    purple: [
        { label: '紫藤花語', emoji: '🪻', names: ['fuji', 'fujimurasaki', 'shion', 'usubeni', 'gofun'] },
        { label: '宮廷典雅', emoji: '👘', names: ['murasaki', 'kokimurasaki', 'sumire', 'sakura', 'shironeri'] },
        { label: '薰衣草原', emoji: '💜', names: ['ouchi', 'benifuji', 'usu', 'benimidori', 'shironezumi'] },
        { label: '夜幕華彩', emoji: '🎭', names: ['edomurasaki', 'kikyo', 'hashita', 'botan', 'hai'] }
    ],
    neutral: [
        { label: '水墨寫意', emoji: '🖌️', names: ['sunezumi', 'nibi', 'hai', 'ginnezumi', 'shironeri'] },
        { label: '侘寂之美', emoji: '🏯', names: ['rikyucha', 'sensaicha', 'rikyunezumi', 'gofun', 'keshizumi'] },
        { label: '暮色蒼茫', emoji: '🌫️', names: ['aonibi', 'dobunezumi', 'namari', 'shironezumi', 'tonoko'] },
        { label: '枯山水庭', emoji: '⛩️', names: ['aisumicha', 'benikeshinezumi', 'aku', 'shiracha', 'gofun'] }
    ]
};
