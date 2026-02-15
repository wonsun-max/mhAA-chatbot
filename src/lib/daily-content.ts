import { DAILY_WORDS_365 } from "./daily-content-words";

/**
 * Daily contents for the Christian school community.
 * Provides a deterministic verse and word based on the current date.
 */

export const DAILY_VERSES = [
    { ref: "시편 34:18", verse: "여호와께서 상하게 부서진 자의 영혼을 구원하시며 그들의 모든 뼈를 보호하시나니" },
    { ref: "로마서 8:28", verse: "우리가 아는 대로 모든 것이 선을 위하여 함께 역사하는 자들을 하나님은 사랑하시고 그의 뜻대로 부르신 자들을 위하여 모든 것이 합력하여 선을 이루게 하시느니라" },
    { ref: "시편 91:1-2", verse: "지존하신 자의 은밀한 곳에 살며 전능하신 자의 그늘 아래에 머무를 것이라 나의 하나님께서 나를 구원하시리로다" },
    { ref: "마태복음 6:34", verse: "그러므로 내일 일을 어떻게 될 것으로 염려하지 말라. 내일 일은 내일이 스스로 염려할 것이니. 하루에 족한 일이 그 날에 있느니라" },
    { ref: "시편 27:1", verse: "여호와는 나의 빛이시요 나의 구원이시니 내가 누구를 두려워하리요 여호와는 나의 인생의 능력이시로다" },
    { ref: "마태복음 28:20", verse: "내가 모든 것을 너희에게 가르쳤으니 볼지어다, 내가 세상 끝날 때까지 너희와 항상 함께 있으리라 하시니라" },
    { ref: "시편 46:1-2", verse: "하나님은 우리의 피난처요 우리의 능력이시며 환난 중에 큰 도움이시로다" },
    { ref: "마태복음 5:4", verse: "슬프게 하는 자들은 복이 있나니 그들은 위로를 받을 것임이라" },
    { ref: "시편 37:23-24", verse: "그가 그의 길을 굳게 하시면 걸음이 요동치 아니하며 그가 그의 길을 보호하시나니" },
    { ref: "시편 147:3", verse: "상처받은 자를 고치시며 그들의 상처를 싸매시는 자시니라" },
    { ref: "시편 55:22", verse: "너의 부담을 여호와께 맡기라 그가 너를 붙들어 주시리로다 의인으로 영원히 요동치 아니하는 자를 절대로 흔들리지 않으시리로다" },
    { ref: "이사야 40:31", verse: "그러나 여호와를 바란 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다" },
    { ref: "빌립보서 4:6-7", verse: "아무것도 염려하지 말고 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라" },
    { ref: "시편 119:50", verse: "주의 말씀이 나를 살려주므로 내가 주의 법도를 좇으리이다" },
    { ref: "마태복음 7:7-8", verse: "구하라 그리하면 받으리니 찾으라 그리하면 찾을 것이요 문을 두드리라 그리하면 열리리니 무릇 구하는 자는 받으며 찾는 자는 찾으며 문을 두드리는 자는 열리리라" },
    { ref: "시편 46:10", verse: "그러므로 너희는 여호와의 계신 것을 알라 그가 만민 중에 높으신 줄을 알리로다" },
    { ref: "이사야 26:3", verse: "견고한 마음을 지키며 네게 의지하는 자를 주께서 영원한 평강으로 지키시리라" },
    { ref: "시편 55:16-17", verse: "그러나 나는 하나님께 부르짖으리니 여호와께서 나를 구원하시리로다 저녁과 아침과 낮에 내가 울며 떠들리니 그가 나의 소리를 들으시리로다" },
    { ref: "마태복음 11:29-30", verse: "나의 멍에를 메고 배우라 그리하면 너희 영혼에게 안식을 주리라 내 멍에는 쉽고 내 짐은 가벼우니" },
    { ref: "시편 34:4", verse: "내가 여호와를 구하매 응답하시고 내 모든 두려움에서 나를 구원하셨도다" },
    { ref: "출애굽기 14:14", verse: "여호와께서 너희를 위하여 싸우시리니 너희는 잠잠히 있으라" },
    { ref: "시편 27:14", verse: "여호와를 바랄지어다 그의 힘을 믿으라 네 마음이 강하게 되리로다 여호와를 바랄지어다" },
    { ref: "골로새서 3:23-24", verse: "무엇을 하든지 마음을 다하여 일하되 사람에게 아니하듯이 주를 위하여 하여 주 그리스도로부터 받을 기업을 인하여 하라" },
    { ref: "마태복음 7:11", verse: "너희 하늘 아버지께서 구하는 자에게 선한 것을 주시지 않으시겠느냐" },
    { ref: "시편 91:2", verse: "내 하나님이시여 내가 피할 처소요 나의 요새시라" },
    { ref: "요한복음 16:33", verse: "이 세상에서 너희는 환난을 당하나 나는 세상을 이기었노라" },
    { ref: "시편 30:5", verse: "그 분노는 잠간이요 그 은혜는 평생이라 저녁에는 울음이 머무르나 아침에는 기쁨이 이를 것이로다" },
    { ref: "이사야 41:13", verse: "나 여호와는 네 하나님이니 너를 굳세게 잡은 오른손을 붙들며 네게 이르기를 두려워하지 말라 내가 너를 도우리라 하노라" },
    { ref: "시편 103:2-3", verse: "나의 영혼아 여호와를 찬송하며 그의 모든 은혜를 잊지 말지어다" },
    { ref: "요한일서 4:4", verse: "너희는 하나님께 속하였으니 그가 세상에 더 크신 이시라" },
    { ref: "시편 46:7", verse: "만군의 여호와와 함께한 우리의 요새는 하나님의 성이라" },
    { ref: "로마서 8:38-39", verse: "어떤 피조물도 우리를 우리 주 그리스도 예수 안에 있는 하나님의 사랑에서 끊을 수 없으리라" },
    { ref: "시편 34:8", verse: "너희는 여호와의 선하심을 맛보아 알지어다 그에게 피하는 자는 복이 있도다" },
    { ref: "마가복음 10:27", verse: "사람으로는 할 수 없으되 하나님으로는 그렇지 아니하니 하나님으로서 모든 것을 하실 수 있느니라" },
    { ref: "시편 126:5-6", verse: "눈물을 흘리며 씨를 뿌리는 자는 기쁨으로 거두리로다" },
    { ref: "빌립보서 4:13", verse: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" },
    { ref: "시편 62:1-2", verse: "나의 영혼이 잠잠히 하나님만 바람이여 나의 구원이 그에게서 나오는도다" },
    { ref: "마태복음 6:26", verse: "공중의 새를 보라 심지도 않고 거두지도 않고 창고에 모아들이지도 아니하되 너희 하늘 아버지께서 기르시나니 너희는 이것들보다 귀하지 아니하냐" },
    { ref: "시편 9:9", verse: "여호와는 압제를 당하는 자의 요새이시요 환난 때의 요새이시로다" },
    { ref: "누가복음 1:37", verse: "대저 하나님의 모든 말씀은 능하지 못하심이 없느니라" },
    { ref: "시편 34:17", verse: "의인이 부르짖으매 여호와께서 들으시고 그들의 모든 환난에서 건지셨도다" },
    { ref: "이사야 43:2", verse: "네가 물 가운데로 지날 때에 내가 너와 함께 할 것이라 강을 건널 때에 물이 너를 침몰하지 못할 것이며" },
    { ref: "시편 28:7", verse: "여호와는 나의 힘과 나의 방패시니 내 마음이 그를 의지하여 도움을 얻었도다" },
    { ref: "마태복음 6:33", verse: "너희는 먼저 그의 나라와 그의 의를 찾으라 그리하면 이 모든 것을 너희에게 더하시리라" },
    { ref: "시편 37:5", verse: "네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고" },
    { ref: "이사야 41:10", verse: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라" },
    { ref: "시편 23:1", verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다" },
    { ref: "마태복음 11:28", verse: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라" }
];

export const DAILY_WORDS = [
    { word: "vary", meaning: "바꾸다, 변경하다", example: "Prices vary according to the season." },
    { word: "varied", meaning: "다양한", example: "The menu is varied and offers many choices." },
    { word: "dwindle", meaning: "서서히 줄어들다", example: "Their savings began to dwindle." },
    { word: "release", meaning: "풀어주다, 해방시키다", example: "The prisoner was released yesterday." },
    { word: "irresistible", meaning: "억누를 수 없는, 매력적인", example: "The chocolate cake was irresistible." },
    { word: "ascertain", meaning: "확정하다, 확인하다", example: "We need to ascertain the facts." },
    { word: "consummate", meaning: "완료하다, 완성하다", example: "He is a consummate professional." },
    { word: "intimidate", meaning: "위협하다", example: "Don't let them intimidate you." },
    { word: "tilt", meaning: "기울이다", example: "He tilted his head to one side." },
    { word: "multiply", meaning: "늘리다, 증대시키다", example: "The population began to multiply rapidly." },
    { word: "finance", meaning: "자금을 공급하다", example: "The project was financed by the government." },
    { word: "confer", meaning: "상의하다, 수여하다", example: "The degree was conferred upon him." },
    { word: "dangle", meaning: "매달리다", example: "A set of keys dangled from his belt." },
    { word: "steep", meaning: "적시다, 담그다", example: "Steep the tea for five minutes." },
    { word: "assign", meaning: "배정하다, 지정하다", example: "The teacher assigned a lot of homework." },
    { word: "threaten", meaning: "위협하다", example: "The clouds threatened rain." },
    { word: "crown", meaning: "올리다, 왕관을 씌우다", example: "She was crowned queen of the festival." },
    { word: "archaic", meaning: "구식의, 오래된", example: "The law is now archaic." },
    { word: "hue", meaning: "색상", example: "The sky had a golden hue at sunset." },
    { word: "subdue", meaning: "진압하다, 억제하다", example: "He managed to subdue his anger." },
    { word: "pare", meaning: "깎다, 줄이다", example: "Pare the apples before cooking." },
    { word: "reassure", meaning: "안심시키다", example: "She reassured him that everything would be fine." },
    { word: "discharge", meaning: "방출하다, 수행하다", example: "He was discharged from the hospital." },
    { word: "infirm", meaning: "허약한, 쇠약한", example: "She is elderly and infirm." },
    { word: "utilize", meaning: "이용하다, 활용하다", example: "We should utilize our resources efficiently." },
    { word: "patron", meaning: "고객, 후원자", example: "He is a regular patron of the library." },
    { word: "crest", meaning: "정상, 절정", example: "They reached the crest of the hill." },
    { word: "fluid", meaning: "유동적인", example: "The situation is still fluid." },
    { word: "tranquil", meaning: "차분한, 평온한", example: "The lake was calm and tranquil." },
    { word: "inauspicious", meaning: "불운한, 불길한", example: "It was an inauspicious start to the day." },
    { word: "incise", meaning: "자르다, 새기다", example: "The design was incised into the stone." },
    { word: "capitalize", meaning: "이용하다, 활용하다", example: "Try to capitalize on your strengths." },
    { word: "mammoth", meaning: "거대한", example: "Cleaning the house was a mammoth task." },
    { word: "inert", meaning: "비활성의, 움직이지 않는", example: "The chemically inert gas is safe." },
    { word: "obsolete", meaning: "쓸모없게 된, 구식의", example: "CDs are becoming obsolete." },
    { word: "net", meaning: "최종적인, 순수한", example: "What is the net profit of the company?" },
    { word: "sterile", meaning: "불모의, 살균된", example: "The operating room must be sterile." },
    { word: "shard", meaning: "파편", example: "Be careful of the glass shards." },
    { word: "sediment", meaning: "침전물", example: "There was sediment at the bottom of the bottle." },
    { word: "decimate", meaning: "대량으로 죽이다, 파괴하다", example: "The disease decimated the population." },
    { word: "drastic", meaning: "강력한, 과감한", example: "We need to take drastic measures." },
    { word: "lethal", meaning: "치명적인", example: "The snake's venom is lethal." },
    { word: "lucrative", meaning: "수익성이 좋은", example: "This is a very lucrative business." },
    { word: "obscure", meaning: "불분명한, 가리다", example: "The meaning of the sentence is obscure." },
    { word: "prominent", meaning: "뛰어난, 유명한", example: "He is a prominent figure in the community." },
    { word: "pronounced", meaning: "뚜렷한, 현저한", example: "She has a pronounced accent." },
    { word: "advocate", meaning: "지지하다, 옹호하다", example: "He advocates for human rights." },
    { word: "comprise", meaning: "구성하다, 포함하다", example: "The committee comprises ten members." },
    { word: "disperse", meaning: "흩어지게 하다", example: "The crowd began to disperse." },
    { word: "exploit", meaning: "이용하다, 착취하다", example: "Don't exploit the workers." }
];

export function getDailyContent() {
    const today = new Date();
    // Use KST (UTC+9) for consistent date calculation
    const kstDate = new Date(today.getTime() + (9 * 60 * 60 * 1000));
    
    // Use an arbitrary epoch or just days since Unix epoch to ensure it increments daily
    const daysSinceEpoch = Math.floor(kstDate.getTime() / 86400000);
    
    const verse = DAILY_VERSES[daysSinceEpoch % DAILY_VERSES.length];
    const word = DAILY_WORDS_365[daysSinceEpoch % DAILY_WORDS_365.length];
    
    return { verse, word };
}
