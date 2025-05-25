import React from 'react';

interface KeyboardHintProps {
  text: string;
}

// 日本語をローマ字入力に変換するためのヒントマップ
const jaToRomajiMap: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'nn',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'っ': 'ltu', // 小さい「っ」
  'ゃ': 'lya', 'ゅ': 'lyu', 'ょ': 'lyo', // 小さい「ゃ」「ゅ」「ょ」
  '。': '.', '、': ',', '「': '[', '」': ']', '・': '/',
  '！': '!', '？': '?', '（': '(', '）': ')',
  '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
  '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
  'ー': '-', '　': ' ', // 長音符とスペース
};

// アルファベットと数字、記号の変換マップ
const symbolsMap: Record<string, string> = {
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G',
  'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N',
  'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U',
  'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
  'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g',
  'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
  'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u',
  'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '.': '.', ',': ',', '(': '(', ')': ')', '[': '[', ']': ']',
  '/': '/', '!': '!', '?': '?', '-': '-', ' ': 'space',
  '：': ':', '；': ';', '＝': '=', '＋': '+', '＊': '*', '＆': '&', '＾': '^', '％': '%', '＄': '$', '＃': '#', '＠': '@',
};

/**
 * 日本語テキストをローマ字入力に変換するヒントを生成
 */
const getInputHint = (text: string): string => {
  let hint = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 英数字や記号の場合
    if (symbolsMap[char]) {
      hint += symbolsMap[char];
    } 
    // ひらがな・カタカナの場合
    else if (jaToRomajiMap[char]) {
      hint += jaToRomajiMap[char];
    }
    // 変換マップにない文字（漢字など）は「?」で表示
    else {
      hint += '?';
    }
    
    // 文字間にスペースを入れて読みやすくする（最後の文字以外）
    if (i < text.length - 1) {
      hint += ' ';
    }
  }
  return hint;
};

const KeyboardHint: React.FC<KeyboardHintProps> = ({ text }) => {
  const hintText = getInputHint(text);
  
  return (
    <div className="keyboard-hint text-xs text-gray-500 mt-2 font-mono tracking-wider">
      <p className="text-center">【キー入力ヒント】</p>
      <p className="text-center bg-gray-100 p-2 rounded shadow-inner">{hintText}</p>
    </div>
  );
};

export default KeyboardHint; 