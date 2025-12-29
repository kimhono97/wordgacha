const bibleJS = {};

bibleJS.versions = {
    개역개정: 'B_GAE', 개역한글: 'B_RHV', 공동번역: 'B_COGNEW', 새번역: 'B_SAENEW', 현대인의성경: 'B_HDB', // kr
    NIV: 'B_NIV', KJV: 'B_KJV', NASB: 'B_NASB', // en
    中文简体: 'BIBLE_cgb', 中文正體: 'BIBLE_cb5', // cn
    新改訳: 'B_KSNKI', 口語訳: 'B_KKUG', 新共同訳: 'B_KSNKD', // jp
};

bibleJS.books = { // VR
    kr_old: ['창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야', '예레미야', '예레미야 애가', '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기'],
    kr_new: ['마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서', '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한1서', '요한2서', '요한3서', '유다서', '요한계시록'],
    kr_old2: ['창', '출', '레', '민', '신', '수', '삿', '룻', '삼상', '삼하', '왕상', '왕하', '대상', '대하', '스', '느', '에', '욥', '시', '잠', '전', '아', '사', '렘', '애', '겔', '단', '호', '욜', '암', '옵', '욘', '미', '나', '합', '습', '학', '슥', '말'],
    kr_new2: ['마', '막', '눅', '요', '행', '롬', '고전', '고후', '갈', '엡', '빌', '골', '살전', '살후', '딤전', '딤후', '딛', '빌', '힙', '약', '벧전', '벧후', '요일', '요이', '요삼', '유', '계'],
    en_old: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
    en_new: ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'],
    cn_old: ['创世记', '出埃及记', '利未记', '民数记', '申命记', '约书亚记', '士师记', '路得记', '撒母耳记上', '撒母耳记下', '列王记上', '列王记下', '历代志上', '历代志下', '以斯拉记', '尼希米记', '以斯帖记', '约伯记', '诗篇', '箴言', '传道书', '雅歌', '以赛亚书', '耶利米书', '耶利米哀歌', '以西结书', '但以理书', '何西阿书', '约珥书', '阿摩司书', '俄巴底亚书', '约拿书', '弥迦书', '那鸿书', '哈巴谷书', '西番雅书', '哈该书', '撒迦利亚', '玛拉基书'],
    cn_new: ['马太福音', '马可福音', '路加福音', '约翰福音', '使徒行传', '罗马书', '哥林多前书', '哥林多後书', '加拉太书', '以弗所书', '腓立比书', '歌罗西书', '帖撒罗尼迦前书', '帖撒罗尼迦後书', '提摩太前书', '提摩太後书', '提多书', '腓利门书', '希伯来书', '雅各书', '彼得前书', '彼得後书', '约翰一书', '约翰二书', '约翰三书', '犹大书', '启示录'],
    jp_old: ["創世記", "出エジプト記", "レビ記", "民数記", "申命記", "ヨシュア記", "士師記", "ルツ記", "サムエル記第一", "サムエル記第二", "列王記第一", "列王記第二", "歴代誌第一", "歴代誌第二", "エズラ記", "ネヘミヤ記", "エステル記", "ヨブ記", "詩篇", "箴言", "伝道者の書", "雅歌", "イザヤ書", "エレミヤ書", "哀歌", "エゼキエル書", "ダニエル書", "ホセア書", "ヨエル書", "アモス書", "オバデヤ書", "ヨナ書", "ミカ書", "ナホム書", "ハバクク書", "ゼパニヤ書", "ハガイ書", "ゼカリヤ書", "マラキ書"],
    jp_new: ["マタイの福音書", "マルコの福音書", "ルカの福音書", "ヨハネの福音書", "使徒の働き", "ローマ人への手紙", "コリント人への手紙第一", "コリント人への手紙第二", "ガラテヤ人への手紙", "エペソ人への手紙", "ピリピ人への手紙", "コロサイ人への手紙", "テサロニケ人への手紙第一", "テサロニケ人への手紙第二", "テモテへの手紙第一", "テモテへの手紙第二", "テトスへの手紙", "ピレモンへの手紙", "ヘブル人への手紙", "ヤコブの手紙", "ペテロの手紙第一", "ペテロの手紙第二", "ヨハネの手紙第一", "ヨハネの手紙第二", "ヨハネの手紙第三", "ユダの手紙", "ヨハネの黙示録"],
};
bibleJS.num_chapter = [
    50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, // old
    28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22 // new
];

bibleJS.findLanguage = function (version='B_GAE'){
    switch(version){
    case 'B_GAE': case 'B_RHV': case 'B_COGNEW': case 'B_SAENEW': case 'B_HDB':
        return 'kr';
    case 'BIBLE_cgb': case 'BIBLE_cb5':
        return 'cn';
    case 'B_KSNKI': case 'B_KKUG': case 'B_KSNKD':
        return 'jp';
    default:
        return 'en';
    }
}

bibleJS.findBookIndex = function (book_name){
    let idx;
    const books = bibleJS.books;

    idx = books.kr_old.indexOf(book_name);
    if(idx != -1)   return 1 + idx;
    idx = books.kr_old2.indexOf(book_name);
    if(idx != -1)   return 1 + idx;
    idx = books.en_old.indexOf(book_name);
    if(idx != -1)   return 1 + idx;
    idx = books.cn_old.indexOf(book_name);
    if(idx != -1)   return 1 + idx;
    idx = books.jp_old.indexOf(book_name);
    if(idx != -1)   return 1 + idx;

    idx = books.kr_new.indexOf(book_name);
    if(idx != -1)   return 1 + books.kr_old.length + idx;
    idx = books.kr_new2.indexOf(book_name);
    if(idx != -1)   return 1 + books.kr_old.length + idx;
    idx = books.en_new.indexOf(book_name);
    if(idx != -1)   return 1 + books.en_old.length + idx;
    idx = books.cn_new.indexOf(book_name);
    if(idx != -1)   return 1 + books.cn_old.length + idx;
    idx = books.jp_new.indexOf(book_name);
    if(idx != -1)   return 1 + books.jp_old.length + idx;

    return -1;
}

bibleJS.getBookName = function (book=1, ver='B_GAE') {
    const lang = bibleJS.findLanguage(ver);
    if(book - 1 < bibleJS.books.kr_old.length) {
        return bibleJS.books[`${lang}_old`][book - 1];
    }
    return bibleJS.books[`${lang}_new`][book - 1 - bibleJS.books.kr_old.length];
};

bibleJS.updateKanji = function (input_text){
    const from = "亞惡壓圍爲醫壹逸稻飮隱羽營榮衞銳益驛悅謁閱圓緣艷鹽奧應橫歐毆黃溫穩假價禍畫會囘壞悔懷海繪慨槪擴殼覺學嶽樂喝渴褐鐮勸卷寬歡漢罐觀閒關陷館巖顏器既旣歸氣祈龜僞戲犧卻糺舊據擧虛峽挾敎强狹鄕響堯曉勤謹區驅勳薰羣契徑惠揭攜溪經繼莖螢輕鷄藝擊缺儉劍圈檢權獻縣硏險顯驗嚴戶吳娛效廣恆鑛號國穀黑歲濟碎齋劑冱櫻册殺雜產參慘棧蠶贊殘祉姊絲視飼齒兒辭濕實舍寫煮社者釋壽收臭從澁獸縱祝肅處暑緖署諸敍尙奬將牀涉燒祥稱證乘剩壤孃條淨狀疊穰讓釀囑觸寢愼晉眞神刄盡圖粹醉隨髓數樞瀨晴淸精靑聲靜齊稅蹟節說攝竊絕專戰淺潛纖踐錢禪曾祖僧雙壯層搜插巢爭瘦窗總聰莊裝騷增憎臟藏贈卽屬續墮體對帶滯臺瀧擇澤琢脫單嘆擔膽團彈斷癡遲著晝蟲鑄猪著廳徵懲聽敕鎭塚遞鐵轉點傳都黨盜燈當鬭鬪德獨讀突屆繩難貳姙黏惱腦霸廢拜梅賣麥發髮拔繁飯晚蠻卑碑祕彥姬濱賓頻敏甁侮福拂佛倂塀竝變邊勉辯辨瓣舖步穗寶萠襃豐墨沒飜槇每萬滿免麵默餠戾彌藥譯祐豫餘與譽搖樣謠遙瑤慾來賴亂欄覽畧隆龍虜旅兩獵綠鄰凜壘淚類勵禮隸靈齡曆歷廉戀練鍊爐勞廊朗樓郞祿錄亙灣";
    const to = "亜悪圧囲為医壱逸稲飲隠羽営栄衛鋭益駅悦謁閲円縁艶塩奥応横欧殴黄温穏仮価禍画会回壊悔懐海絵慨概拡殻覚学岳楽喝渇褐鎌勧巻寛歓漢缶観間関陥館巌顔器既既帰気祈亀偽戯犠却糾旧拠挙虚峡挟教強狭郷響尭暁勤謹区駆勲薫群契径恵掲携渓経継茎蛍軽鶏芸撃欠倹剣圏検権献県研険顕験厳戸呉娯効広恒鉱号国穀黒歳済砕斎剤冴桜冊殺雑産参惨桟蚕賛残祉姉糸視飼歯児辞湿実舎写煮社者釈寿収臭従渋獣縦祝粛処暑緒署諸叙尚奨将床渉焼祥称証乗剰壌嬢条浄状畳穣譲醸嘱触寝慎晋真神刃尽図粋酔随髄数枢瀬晴清精青声静斉税跡節説摂窃絶専戦浅潜繊践銭禅曽祖僧双壮層捜挿巣争痩窓総聡荘装騒増憎臓蔵贈即属続堕体対帯滞台滝択沢琢脱単嘆担胆団弾断痴遅着昼虫鋳猪著庁徴懲聴勅鎮塚逓鉄転点伝都党盗灯当闘闘徳独読突届縄難弐妊粘悩脳覇廃拝梅売麦発髪抜繁飯晩蛮卑碑秘彦姫浜賓頻敏瓶侮福払仏併塀並変辺勉弁弁弁舗歩穂宝萌褒豊墨没翻槙毎万満免麺黙餅戻弥薬訳祐予余与誉揺様謡遥瑶欲来頼乱欄覧略隆竜虜旅両猟緑隣凛塁涙類励礼隷霊齢暦歴廉恋練錬炉労廊朗楼郎禄録亘湾";
    let output_text = "";
    for(let i=0; i<input_text.length; i++){
        const pos = from.indexOf(input_text[i]);
        if(pos == -1){
            output_text += input_text[i];
        }else{
            output_text += to[pos];
        }
    }
    return output_text;
}