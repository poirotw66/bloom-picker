const fs = require('fs');

const elegantMap = {
    "nadeshiko": "撫子", "kohbai": "紅梅", "suoh": "蘇芳", "taikoh": "褪紅", "ikkonzome": "初櫻",
    "kuwazome": "桑花", "momo": "桃花", "ichigo": "莓果", "usubeni": "淺紅", "imayoh": "紅顏",
    "nakabeni": "朱華", "sakura": "櫻花", "umenezumi": "梅尾", "karakurenai": "韓紅", "enji": "燕脂",
    "kurenai": "深紅", "toki": "鴇羽", "cyohsyun": "長春", "kokiake": "深緋", "sakuranezumi": "櫻尾",
    "jinzamomi": "朱槿", "azuki": "紅豆", "suohkoh": "蘇芳香", "akabeni": "赤紅", "shinsyu": "真朱",
    "haizakura": "灰櫻", "kuriume": "栗梅", "ebicha": "海老茶", "ginsyu": "銀朱", "kurotobi": "黑鳶",
    "benitobi": "紅鳶", "akebono": "曙霞", "benikaba": "紅樺", "mizugaki": "水柿", "sangosyu": "珊瑚",
    "benihiwada": "紅檜皮", "syojyohi": "猩猩緋", "entan": "鉛丹", "shikancha": "茶梅", "hiwada": "檜皮",
    "kakishibu": "柿澀", "ake": "丹緋", "tobi": "鳶尾", "benihi": "紅緋", "kurikawacha": "栗皮",
    "bengara": "辨柄", "terigaki": "照柿", "edocha": "江戶茶", "araisyu": "洗朱", "momoshiocha": "百鹽",
    "karacha": "唐茶", "tokigaracha": "鴇唐", "ohni": "黃丹", "sohi": "纁黃", "ensyucha": "遠州",
    "kabacha": "樺茶", "kogecha": "焦茶", "akakoh": "赤香", "suzumecha": "雀茶", "shishi": "肉色",
    "sodenkaracha": "唐木", "kaba": "樺木", "kokikuchinashi": "深梔", "kurumi": "胡桃", "taisya": "代赭",
    "araigaki": "洗柿", "kohrozen": "黃櫨", "akakuchiba": "赤朽葉", "tonocha": "礪茶", "akashiritsurubami": "白橡",
    "sencha": "煎茶", "kanzo": "萱草", "sharegaki": "灑落", "beniukon": "紅鬱金", "umezome": "梅染",
    "biwacha": "枇杷", "chojicha": "丁子", "kenpohzome": "黑栗", "kohaku": "琥珀", "usugaki": "淺柿",
    "kyara": "伽羅", "chojizome": "丁染", "fushizome": "柴染", "kuchiba": "朽葉", "kincha": "金茶",
    "kitsune": "狐黃", "susutake": "煤竹", "usukoh": "淺香", "tonoko": "砥粉", "ginsusutake": "銀竹",
    "ohdo": "黃土", "shiracha": "白茶", "kobicha": "媚茶", "kigaracha": "黃唐", "yamabuki": "棣棠",
    "yamabukicha": "棣棠茶", "hajizome": "櫨染", "kuwacha": "桑茶", "tamago": "卵黃", "shirotsurubami": "白袍",
    "kitsurubami": "黃袍", "tamamorokoshi": "玉蜀黍", "hanaba": "花葉", "namakabe": "生壁", "torinoko": "鳥子",
    "usuki": "淺黃", "kikuchiba": "黃朽葉", "kuchinashi": "梔子", "tohoh": "籐黃", "ukon": "鬱金",
    "karashi": "芥子", "higosusutake": "竹花", "rikyushiracha": "休白", "aku": "灰汁", "rikyucha": "利休",
    "rokohcha": "苔茶", "nataneyu": "油菜", "uguisucha": "鶯茶", "kimirucha": "黃松", "mirucha": "海松",
    "kariyasu": "藎草", "nanohana": "菜花", "kihada": "黃蘗", "mushikuri": "栗黃", "aokuchiba": "青朽葉",
    "ominaeshi": "敗醬", "hiwacha": "鶸茶", "hiwa": "綠鶸", "uguisu": "鶯綠", "yanagicha": "柳茶",
    "koke": "苔蘚", "kikujin": "麴塵", "rikancha": "璃寬", "aikobicha": "藍媚", "miru": "海藻",
    "sensaicha": "千歲", "baikocha": "梅幸", "hiwamoegi": "鶸萌", "yanagizome": "柳染", "urayanagi": "裡柳",
    "iwaicha": "岩井", "moegi": "萌黃", "nae": "青苗", "yanagisusutake": "柳竹", "matsuba": "松葉",
    "aoni": "青丹", "usuao": "淺草", "yanaginezumi": "柳鼠", "tokiwa": "常磐", "wakatake": "若竹",
    "chitosemidori": "千歲綠", "midori": "嫩綠", "byakuroku": "白綠", "oitake": "老竹", "tokusa": "木賊",
    "onandocha": "納戶", "rokusyoh": "綠青", "sabiseiji": "鏽青磁", "aotake": "青竹", "veludo": "絲絨",
    "mushiao": "蟲襖", "aimirucha": "藍松", "tonocha2": "沉香", "aomidori": "青綠", "seiji": "青磁",
    "tetsu": "鐵線蓮", "mizuasagi": "水蔥", "seiheki": "青碧", "sabitetsuonando": "蒼蘭", "korainando": "麗蘭",
    "byakugun": "白群", "omeshicha": "御召", "kamenozoki": "月見蘭", "fukagawanezumi": "鼠尾草", "sabiasagi": "蔥蘭",
    "mizu": "天水", "asagi": "淺蔥", "onando": "納戶蘭", "ai": "藍草", "shinbashi": "新橋",
    "sabionando": "鏽蘭", "tetsuonando": "鐵蘭", "hanaasagi": "花蔥", "ainezumi": "藍鼠", "masuhana": "舛花",
    "sora": "空色", "noshimehana": "藍薊", "chigusa": "千草", "omeshionando": "召蘭", "hanada": "縹草",
    "wasurenagusa": "勿忘草", "gunjyo": "群青", "tsuyukusa": "露草", "kurotsurubami": "黑袍", "kon": "深紺",
    "kachi": "褐藍", "ruri": "琉璃", "rurikon": "琉璃紺", "benimidori": "紅碧", "fujinezumi": "藤鼠",
    "tetsukon": "鐵紺", "konjyo": "紺青", "benikakehana": "紅花", "konkikyo": "紺桔梗", "fuji": "紫藤",
    "futaai": "二藍", "ouchi": "苦楝", "fujimurasaki": "藤紫", "kikyo": "桔梗", "shion": "紫苑",
    "messhi": "滅紫", "usu": "淺紫", "hashita": "半紫", "edomurasaki": "江戶紫", "shikon": "紫紺",
    "kokimurasaki": "深紫", "sumire": "堇花", "murasaki": "紫草", "ayame": "菖蒲", "fujisusutake": "藤竹",
    "benifuji": "紅藤", "kurobeni": "黑紅", "nasukon": "茄紺", "budohnezumi": "葡萄鼠", "hatobanezumi": "鳩羽",
    "kakitsubata": "燕子花", "ebizome": "蒲葡", "botan": "牡丹", "umemurasaki": "梅紫", "nisemurasaki": "似紫",
    "tsutsuji": "躑躅", "murasakitobi": "紫鳶", "shironeri": "雪絨", "gofun": "胡粉", "shironezumi": "白鼠",
    "ginnezumi": "銀鼠", "namari": "鉛灰", "hai": "銀灰", "sunezumi": "素鼠", "rikyunezumi": "利休鼠",
    "nibi": "鈍灰", "aonibi": "青鈍", "dobunezumi": "暗灰", "benikeshinezumi": "紅消", "aisumicha": "藍墨",
    "binrojizome": "檳榔", "keshizumi": "消炭", "sumi": "墨灰", "kuro": "玄黑", "ro": "呂墨"
};

let code = fs.readFileSync('src/data/colors.ts', 'utf8');

const mapStr = Object.entries(elegantMap).map(([k, v]) => \`    "\${k}": "\${v}"\`).join(',\\n');
const replacement = \`const ELEGANT_NAMES: Record<string, string> = {
\${mapStr}
};

function toTaiwanName(name: string, cname: string): string {
    return ELEGANT_NAMES[name] || cname;
}\`;

code = code.replace(/const JP_TO_TW: Record<string, string> = [\\s\\S]*?function toTaiwanName\\(cname: string\\): string {[\\s\\S]*?\\n}/, replacement);

code = code.replace(/nameTW: toTaiwanName\\(item\\.cname\\),/, 'nameTW: toTaiwanName(item.name.toLowerCase(), item.cname),');

fs.writeFileSync('src/data/colors.ts', code);
