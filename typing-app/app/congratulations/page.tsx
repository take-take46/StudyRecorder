'use client';

import { useEffect, useState } from 'react';

export default function CongratulationsPage() {
  const [showFireworks, setShowFireworks] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [character1Position, setCharacter1Position] = useState({ x: 20, y: 20 });
  const [character2Position, setCharacter2Position] = useState({ x: 80, y: 20 });

  // 2025年度の実際の合格結果データ
  const examResults = {
    year: 2025,
    subjects: [
      { subject: '経済学・経済政策', score: 64 },
      { subject: '財務・会計', score: 48 },
      { subject: '企業経営理論', score: 71 },
      { subject: '運営管理', score: 67 },
      { subject: '経営法務', score: 68 },
      { subject: '経営情報システム', score: null, exempt: true }, // 免除
      { subject: '中小企業経営・中小企業政策', score: 82 }
    ],
    totalScore: 400, // 6科目の合計
    maxScore: 500, // 免除科目を除いた満点 (6科目×100-経営情報システム100)
    fullMaxScore: 600, // 全科目の満点
    percentage: 66.7, // 400/600*100
    isPass: true
  };

  useEffect(() => {
    // ページロード時にアニメーション開始
    const timer1 = setTimeout(() => setShowFireworks(true), 500);
    const timer2 = setTimeout(() => setShowContent(true), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // キャラクターを動かすアニメーション
  useEffect(() => {
    const moveCharacters = () => {
      // キャラクター1の移動（左側のキャラクター）
      setCharacter1Position(prev => {
        const newX = Math.random() * 30; // 画面左30%の範囲で移動
        const newY = Math.random() * 80 + 10; // 画面上10%-90%の範囲で移動
        return { x: newX, y: newY };
      });

      // キャラクター2の移動（右側のキャラクター）
      setCharacter2Position(prev => {
        const newX = Math.random() * 30 + 70; // 画面右30%の範囲で移動
        const newY = Math.random() * 80 + 10; // 画面上10%-90%の範囲で移動
        return { x: newX, y: newY };
      });
    };

    let interval: NodeJS.Timeout;

    // 3秒後にキャラクターの移動開始
    const startTimer = setTimeout(() => {
      moveCharacters(); // 初回移動
      interval = setInterval(moveCharacters, 4000); // 4秒ごとに移動
    }, 3000);

    return () => {
      clearTimeout(startTimer);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 relative overflow-hidden">
      {/* キャラクター画像 - 動き回るアニメーション */}
      <div 
        className="absolute z-20 transition-all duration-[3000ms] ease-in-out"
        style={{ 
          left: `${character1Position.x}%`,
          top: `${character1Position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="animate-bounce">
          <img 
            src="/data/ChatGPT Image 2025年3月28日 20_49_00.png" 
            alt="キャラクター1" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer"
            style={{ animationDelay: '2s' }}
          />
        </div>
      </div>
      <div 
        className="absolute z-20 transition-all duration-[3000ms] ease-in-out"
        style={{ 
          left: `${character2Position.x}%`,
          top: `${character2Position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="animate-bounce">
          <img 
            src="/data/IMG_7683.JPG" 
            alt="キャラクター2" 
            className="w-18 h-18 md:w-28 md:h-28 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer object-cover"
            style={{ 
              animationDelay: '2.5s',
              objectPosition: 'center center'
            }}
          />
        </div>
      </div>
      {/* 花火アニメーション */}
      {showFireworks && (
        <>
          {/* 花火エフェクト */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-75"></div>
              </div>
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              >
                <div className="text-2xl">⭐</div>
              </div>
            ))}
          </div>

          {/* 紙吹雪エフェクト */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-2 h-2 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32', '#FF6347'][i % 5],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  animationIterationCount: 'infinite'
                }}
              ></div>
            ))}
          </div>
        </>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-end gap-3 mb-6 mt-24">
            <a 
              href="/sme-consultant"
              className="px-4 py-2 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a2 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              中小企業診断士ツールに戻る
            </a>
            
            <a 
              href="/"
              className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a2 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホームに戻る
            </a>

            <button 
              className="px-4 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-500 transition flex items-center shadow-md"
              onClick={() => alert('他のツールは準備中です！')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              別のツール
            </button>
          </div>
        </div>

        {showContent && (
          <div className="animate-fadeIn">
            {/* メインタイトル */}
            <div className="text-center mb-12">
              <div className="mb-4">
                <h2 className="text-lg text-gray-600 mb-2">2025年度</h2>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6 animate-pulse">
                  🎉 合格！ 🎉
                </h1>
                <p className="text-xl text-gray-700 mb-8 font-bold">
                  中小企業診断士一次試験
                </p>
              </div>
            </div>

            {/* 合格結果カード */}
            <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">🏆 総合結果 🏆</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{examResults.totalScore}</div>
                    <div className="text-xs text-gray-600">合計点</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{examResults.percentage}%</div>
                    <div className="text-xs text-gray-600">{examResults.fullMaxScore}点中の割合</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">✅ 合格</div>
                    <div className="text-xs text-gray-600">判定結果</div>
                  </div>
                </div>
              </div>

              {/* 科目別詳細結果 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">📊 科目別得点</h3>
                <div className="space-y-2">
                  {examResults.subjects.map((subjectData, index) => (
                    <div key={subjectData.subject} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-blue-500">
                      <span className="font-medium text-gray-800 text-sm">{subjectData.subject}</span>
                      <span className="text-base font-bold">
                        {subjectData.exempt ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">免除</span>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            subjectData.score! >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subjectData.score}点
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* アクションボタン */}
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/analytics"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  詳細分析を見る
                </a>
                <a 
                  href="/scores"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新しいスコアを記録
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}