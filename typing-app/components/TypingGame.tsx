import React, { useState, useEffect, useRef } from 'react';
import type { Term } from '@/types/term';
import KeyboardHint from './KeyboardHint';

interface TypingGameProps {
  terms: Term[];
  includeImportance: boolean; // 重要ポイントを含めるかどうか
}

interface SectionStats {
  correctChars: number;
  totalChars: number;
  mistypeCount: number;
  timeSpent: number;  // セクションごとの時間（ミリ秒）
}

const TypingGame: React.FC<TypingGameProps> = ({ terms, includeImportance }) => {
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [input, setInput] = useState('');
  const [typedText, setTypedText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [typingStats, setTypingStats] = useState({
    startTime: 0,
    endTime: 0,
    accuracy: 0,
    wpm: 0,
    correctChars: 0,
    totalChars: 0,
    mistypeCount: 0,
    totalTime: 0,
    cps: 0,
    totalScore: 0,
  });
  // 各セクションごとの統計を記録
  const [sectionStats, setSectionStats] = useState<SectionStats[]>([]);
  const [currentSectionStartTime, setCurrentSectionStartTime] = useState(0);
  
  const [section, setSection] = useState<'term' | 'description' | 'importance'>('term');
  const [showHint, setShowHint] = useState(true);
  const [animation, setAnimation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevInputRef = useRef<string>('');

  // 現在の表示セクションに応じたテキストを設定
  useEffect(() => {
    if (currentTermIndex < terms.length) {
      const currentTerm = terms[currentTermIndex];
      switch (section) {
        case 'term':
          setTargetText(currentTerm.term);
          break;
        case 'description':
          setTargetText(currentTerm.description);
          break;
        case 'importance':
          setTargetText(currentTerm.importance);
          break;
      }
      setInput('');
      setTypedText('');
      
      // アニメーション効果
      setAnimation(true);
      setTimeout(() => setAnimation(false), 300);
      
      // 初回開始時または新しいセクション開始時に時間を記録
      if (typingStats.startTime === 0) {
        const now = Date.now();
        setTypingStats({ ...typingStats, startTime: now });
        setCurrentSectionStartTime(now);
      } else {
        setCurrentSectionStartTime(Date.now());
      }
    } else {
      // 全ての問題が終了したとき、最終的な統計情報を計算
      const endTime = Date.now();
      
      // セクションごとのデータを合計して全体のスタッツを計算
      let totalCorrectChars = 0;
      let totalChars = 0;
      let totalMistypes = 0;
      
      sectionStats.forEach(stat => {
        totalCorrectChars += stat.correctChars;
        totalChars += stat.totalChars;
        totalMistypes += stat.mistypeCount;
      });
      
      const totalTimeInSec = (endTime - typingStats.startTime) / 1000;
      const accuracy = totalChars > 0 ? Math.round((totalCorrectChars / totalChars) * 100) : 100;
      const cps = totalTimeInSec > 0 ? Number((totalCorrectChars / totalTimeInSec).toFixed(2)) : 0;
      const totalScore = calculateTotalScore(accuracy, cps, totalMistypes);
      
      setIsCompleted(true);
      setTypingStats({
        ...typingStats,
        endTime,
        accuracy,
        correctChars: totalCorrectChars,
        totalChars,
        mistypeCount: totalMistypes,
        totalTime: totalTimeInSec,
        cps,
        totalScore,
      });
    }
  }, [currentTermIndex, section, terms]);

  // 入力処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const prevValue = prevInputRef.current;
    
    // ミスタイプを検出：新しい文字が追加され、その文字が正しくない場合
    if (value.length > prevValue.length) {
      const newChar = value[value.length - 1];
      const expectedChar = targetText[value.length - 1];
      
      if (newChar !== expectedChar) {
        setTypingStats(prev => ({
          ...prev,
          mistypeCount: prev.mistypeCount + 1
        }));
      }
    }
    
    prevInputRef.current = value;
    setInput(value);
    setTypedText(value);

    // 正確性の統計情報を更新
    updateAccuracyStats(value);

    // 入力テキストとターゲットテキストが一致したら次へ
    if (value === targetText) {
      // 完了アニメーション
      const successSound = new Audio('/sounds/success.mp3');
      try {
        successSound.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.log('Audio play error:', error);
      }
      
      // セクション終了時の統計を記録
      saveSectionStats();
      
      // 次のセクションまたは次の用語へ
      if (section === 'term') {
        setSection('description');
      } else if (section === 'description') {
        // 重要ポイントを含めるかどうかで遷移先を変える
        if (includeImportance) {
          setSection('importance');
        } else {
          setSection('term');
          setCurrentTermIndex(currentTermIndex + 1);
        }
      } else {
        setSection('term');
        setCurrentTermIndex(currentTermIndex + 1);
      }
      
      // 少し待ってから入力フィールドをクリア
      setTimeout(() => {
        setInput('');
        prevInputRef.current = '';
      }, 300);
    }
  };

  // 現在のセクションの統計を保存
  const saveSectionStats = () => {
    const now = Date.now();
    const timeSpent = now - currentSectionStartTime;
    
    // 現在の入力状態を元に、このセクションの統計を計算
    let correctChars = 0;
    const minLength = Math.min(typedText.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === targetText[i]) {
        correctChars++;
      }
    }
    
    const sectionStat: SectionStats = {
      correctChars,
      totalChars: typedText.length,
      mistypeCount: typingStats.mistypeCount,
      timeSpent,
    };
    
    // 統計を追加
    setSectionStats(prev => [...prev, sectionStat]);
    
    // ミスタイプカウントをリセット（次のセクション用）
    setTypingStats(prev => ({
      ...prev,
      mistypeCount: 0
    }));
  };

  // 正確性の統計を更新
  const updateAccuracyStats = (currentInput: string) => {
    let correctChars = 0;
    const minLength = Math.min(currentInput.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (currentInput[i] === targetText[i]) {
        correctChars++;
      }
    }
    
    setTypingStats({
      ...typingStats,
      correctChars,
      totalChars: currentInput.length,
    });
  };

  // 正確性を計算（文字単位）- リアルタイム表示用
  const calculateAccuracy = () => {
    const totalTyped = typingStats.totalChars > 0 ? typingStats.totalChars : 1;
    return Math.round((typingStats.correctChars / totalTyped) * 100);
  };

  // WPMを計算
  const calculateWPM = () => {
    const timeInMinutes = (typingStats.endTime - typingStats.startTime) / 60000;
    const charCount = typingStats.correctChars;
    return Math.round(charCount / (timeInMinutes * 5));
  };

  // 1秒あたりのタイピング文字数（CPS）を計算 - リアルタイム表示用
  const calculateCPS = (totalTimeInSec: number) => {
    if (totalTimeInSec === 0) return 0;
    return Number((typingStats.correctChars / totalTimeInSec).toFixed(2));
  };

  // 総合スコアを計算
  const calculateTotalScore = (accuracy: number, cps: number, mistypeCount: number) => {
    // 計算式: (基本点 + スピードボーナス + 正確性ボーナス - ミスペナルティ) × 問題数ボーナス
    const baseScore = typingStats.correctChars * 20;        // 正確に打った文字1つにつき20点（2倍に増加）
    const speedBonus = cps * 100;                           // 1文字/秒につき100点のボーナス（2倍に増加）
    const accuracyBonus = Math.pow(accuracy, 2) * 0.5;      // 正確性の2乗 × 0.5 のボーナス（最大で5000点）
    const mistypePenalty = mistypeCount * 5;                // ミスタイプ1回につき5点減点（軽減）
    
    // 問題数ボーナス（問題数が多いほどスコアが高くなる）
    const termCount = terms.length;
    const termBonus = termCount >= 10 ? 1.2 : (1 + termCount * 0.02); // 10問以上で1.2倍、それ以下は問題数×0.02を加算
    
    // 最低スコアは0点
    const rawScore = Math.max(0, Math.round((baseScore + speedBonus + accuracyBonus - mistypePenalty) * termBonus));
    
    // スコアの上限を設定（約1万点）
    return Math.min(rawScore, 10000);
  };

  // スコアに応じた評価コメントを取得
  const getScoreComment = (score: number) => {
    if (score >= 9000) return "神レベル！プロ級タイピング！";
    if (score >= 7500) return "素晴らしい！上級者レベル";
    if (score >= 5000) return "かなり良い成績です！";
    if (score >= 3000) return "順調に上達しています";
    if (score >= 1500) return "もう少し練習しましょう";
    return "基礎からコツコツと！";
  };

  // 次の用語へ手動で進むボタン
  const handleSkip = () => {
    // スキップ時の統計を記録（正確な文字は0とする）
    const now = Date.now();
    const timeSpent = now - currentSectionStartTime;
    
    const sectionStat: SectionStats = {
      correctChars: 0,
      totalChars: targetText.length, // スキップした場合は全体の長さを総文字数とする
      mistypeCount: typingStats.mistypeCount + 0.5, // スキップペナルティは軽め
      timeSpent,
    };
    
    setSectionStats(prev => [...prev, sectionStat]);
    
    // ミスタイプカウントをリセット
    setTypingStats(prev => ({
      ...prev,
      mistypeCount: 0
    }));
    
    // 次のセクションへ
    if (section === 'term') {
      setSection('description');
    } else if (section === 'description') {
      // 重要ポイントを含めるかどうかで遷移先を変える
      if (includeImportance) {
        setSection('importance');
      } else {
        setSection('term');
        setCurrentTermIndex(currentTermIndex + 1);
      }
    } else {
      setSection('term');
      setCurrentTermIndex(currentTermIndex + 1);
    }
    
    // 新しいセクションの開始時間を設定
    setCurrentSectionStartTime(now);
  };

  // ヒント表示の切り替え
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // 表示するテキストを整形（入力済み、未入力、誤りを区別）
  const renderText = () => {
    const renderChars = [];
    
    for (let i = 0; i < targetText.length; i++) {
      if (i < typedText.length) {
        const isCorrect = typedText[i] === targetText[i];
        renderChars.push(
          <span 
            key={i} 
            className={`transition-all duration-150 ${isCorrect ? 'correct font-medium' : 'incorrect'}`}
          >
            {targetText[i]}
          </span>
        );
      } else {
        renderChars.push(
          <span key={i} className="text-gray-400">
            {targetText[i]}
          </span>
        );
      }
    }

    // カーソル表示
    if (typedText.length < targetText.length) {
      renderChars[typedText.length] = (
        <span key={`cursor-${typedText.length}`} className="cursor">
          {targetText[typedText.length]}
        </span>
      );
    }

    return renderChars;
  };

  // セクションタイトルを取得
  const getSectionTitle = () => {
    switch (section) {
      case 'term':
        return '用語';
      case 'description':
        return '説明';
      case 'importance':
        return '重要ポイント';
    }
  };

  // 現在のセクションが重要ポイントで、includeImportanceがfalseの場合は自動的に次に進む
  useEffect(() => {
    if (section === 'importance' && !includeImportance) {
      setSection('term');
      setCurrentTermIndex(currentTermIndex + 1);
    }
  }, [section, includeImportance]);

  // 合計セクション数を計算（重要ポイントを含めるかどうかで変わる）
  const getTotalSections = () => {
    return terms.length * (includeImportance ? 3 : 2);
  };

  // 現在のセクション番号を計算
  const getCurrentSectionNumber = () => {
    const sectionIndex = ['term', 'description', 'importance'].indexOf(section);
    if (includeImportance) {
      return currentTermIndex * 3 + sectionIndex + 1;
    } else {
      return currentTermIndex * 2 + (sectionIndex >= 2 ? 0 : sectionIndex + 1);
    }
  };

  // 現在までの合計統計を計算（リアルタイム表示用）
  const getCurrentTotalStats = () => {
    let totalCorrectChars = 0;
    let totalChars = 0;
    let totalMistypes = 0;
    
    // 完了したセクションの統計
    sectionStats.forEach(stat => {
      totalCorrectChars += stat.correctChars;
      totalChars += stat.totalChars;
      totalMistypes += stat.mistypeCount;
    });
    
    // 現在のセクションの統計を追加
    let currentCorrectChars = 0;
    const minLength = Math.min(typedText.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === targetText[i]) {
        currentCorrectChars++;
      }
    }
    
    totalCorrectChars += currentCorrectChars;
    totalChars += typedText.length;
    totalMistypes += typingStats.mistypeCount;
    
    // 全体の所要時間
    const totalTimeInSec = (Date.now() - typingStats.startTime) / 1000;
    
    // 正確性と速度を計算
    const accuracy = totalChars > 0 ? Math.round((totalCorrectChars / totalChars) * 100) : 100;
    const cps = totalTimeInSec > 0 ? Number((totalCorrectChars / totalTimeInSec).toFixed(2)) : 0;
    
    return { accuracy, cps, totalMistypes: Math.floor(totalMistypes) };
  };

  // 前回の成績表示（2回目以降）を更新
  const renderPreviousStats = () => {
    if (currentTermIndex > 0 || section !== 'term') {
      const { accuracy, cps, totalMistypes } = getCurrentTotalStats();
      
      return (
        <div className="w-full mb-4 flex justify-end">
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>正確性: {accuracy}%</span>
            <span>速度: {cps.toFixed(2)} 文字/秒</span>
            <span>ミス: {totalMistypes}回</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // 完了画面
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="w-24 h-24 mb-6 bg-primary/10 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">タイピング完了！</h2>
        <div className="text-lg mb-8 grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center score-appear" style={{animationDelay: '0.1s'}}>
            <p className="text-gray-500 mb-1">正確性</p>
            <p className="text-2xl font-semibold text-primary">{typingStats.accuracy}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center score-appear" style={{animationDelay: '0.2s'}}>
            <p className="text-gray-500 mb-1">速度</p>
            <p className="text-2xl font-semibold text-primary">{typingStats.cps.toFixed(2)} 文字/秒</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center score-appear" style={{animationDelay: '0.3s'}}>
            <p className="text-gray-500 mb-1">ミスタイプ数</p>
            <p className="text-2xl font-semibold text-primary">{Math.floor(typingStats.mistypeCount)}回</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center score-appear" style={{animationDelay: '0.4s'}}>
            <p className="text-gray-500 mb-1">かかった時間</p>
            <p className="text-2xl font-semibold text-primary">{Math.round(typingStats.totalTime)}秒</p>
          </div>
        </div>
        
        {/* 問題統計 */}
        <div className="w-full mb-6 bg-gray-50 p-4 rounded-lg text-center score-appear" style={{animationDelay: '0.5s'}}>
          <p className="text-gray-500 mb-1">タイピング文字数 / 総文字数</p>
          <p className="text-xl font-semibold text-primary">
            {typingStats.correctChars} / {typingStats.totalChars} 文字
          </p>
        </div>
        
        {/* 総合スコア表示 */}
        <div className="w-full mb-8 bg-primary/10 p-6 rounded-xl text-center score-appear" style={{animationDelay: '0.6s'}}>
          <p className="text-gray-700 mb-2">総合スコア</p>
          <p className="text-4xl font-bold text-primary">{typingStats.totalScore}点</p>
          <p className="mt-2 text-secondary font-medium">{getScoreComment(typingStats.totalScore)}</p>
          <p className="text-xs text-gray-500 mt-2">
            （計算式: 基本点 + 速度ボーナス + 正確性ボーナス - ミスタイプペナルティ）
          </p>
        </div>
        
        <button
          onClick={() => {
            setCurrentTermIndex(0);
            setSection('term');
            setIsCompleted(false);
            setSectionStats([]);
            setTypingStats({
              startTime: Date.now(),
              endTime: 0,
              accuracy: 0,
              wpm: 0,
              correctChars: 0,
              totalChars: 0,
              mistypeCount: 0,
              totalTime: 0,
              cps: 0,
              totalScore: 0,
            });
            prevInputRef.current = '';
          }}
          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 font-medium"
        >
          もう一度挑戦
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 ${animation ? 'animate-fadeIn' : ''}`}>
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
              {currentTermIndex + 1}
            </span>
            <span className="text-gray-800">{terms[currentTermIndex]?.term}</span>
            <span className="ml-3 text-sm bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
              {getSectionTitle()}
            </span>
          </h2>
          <span className="text-gray-500 bg-gray-100 py-1 px-3 rounded-full text-sm">
            {includeImportance 
              ? (section === 'term' ? '1/3' : section === 'description' ? '2/3' : '3/3')
              : (section === 'term' ? '1/2' : '2/2')}
          </span>
        </div>
        
        {/* 進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(getCurrentSectionNumber() / getTotalSections()) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 前回の成績表示（2回目以降） */}
      {renderPreviousStats()}

      {/* タイピング対象のテキスト表示エリア */}
      <div className="w-full p-6 mb-6 bg-gray-50 rounded-lg text-lg min-h-[120px] leading-relaxed relative shadow-inner">
        <div className="typing-text">{renderText()}</div>
        
        {/* キーボードヒント */}
        {showHint && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <KeyboardHint text={targetText} />
          </div>
        )}
      </div>

      {/* 入力フィールド */}
      <div className="w-full mb-6">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg"
            placeholder="ここに入力してください..."
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="flex justify-between items-center w-full">
        <div className="flex space-x-2">
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            スキップ
          </button>
          <button
            onClick={toggleHint}
            className={`px-4 py-2 rounded-lg transition flex items-center ${showHint ? 'bg-secondary/20 text-secondary' : 'bg-gray-200 text-gray-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHint ? 'ヒントを隠す' : 'ヒントを表示'}
          </button>
        </div>
        <div className="hidden md:block text-gray-500 text-sm">
          <span>正確に入力すると自動的に次に進みます</span>
        </div>
      </div>
    </div>
  );
};

export default TypingGame; 