export default function Home() {
  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* ヒーローセクション */}
      <section className="mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          中小企業診断士試験 <span className="text-yellow-300">たけちゃんスペシャルツール</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
          一次試験対策の総合学習ツール。タイピング練習で用語を覚え、過去問スコアを記録・分析して効率的に合格を目指しましょう。
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">🎯 効率的学習</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">📊 スコア管理</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">⌨️ タイピング練習</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">📈 進捗可視化</span>
        </div>
      </section>

      {/* 機能メニュー */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">学習ツールメニュー</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* タイピング練習 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-2xl font-bold">⌨️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">タイピング練習</h3>
              <p className="text-green-100 text-sm">重要用語をタイピングで覚える</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>7科目対応の用語集</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>ランダム出題機能</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>科目別・問題数選択</li>
              </ul>
              <a 
                href="/typing"
                className="block w-full text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                練習を開始
              </a>
            </div>
          </div>

          {/* スコア記録 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-2xl font-bold">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-2">スコア記録</h3>
              <p className="text-blue-100 text-sm">過去問の成績を記録・管理</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>科目別スコア入力</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>年度・日付管理</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>簡単操作で記録</li>
              </ul>
              <a 
                href="/scores"
                className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                スコアを記録
              </a>
            </div>
          </div>

          {/* スコア分析 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-2xl font-bold">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">スコア分析</h3>
              <p className="text-purple-100 text-sm">成績をグラフで可視化</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>年度別推移グラフ</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>科目別分析</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>フィルタ機能</li>
              </ul>
              <a 
                href="/analytics"
                className="block w-full text-center bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
              >
                分析を見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">なぜたけちゃんスペシャルツールなのか？</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">効率的な学習</h3>
                <p className="text-gray-600 text-sm">タイピング練習で用語を覚えながら、過去問スコアで弱点を把握。2つの学習が同時に進行します。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">可視化された進捗</h3>
                <p className="text-gray-600 text-sm">グラフで成績推移を確認。科目別の得意・不得意が一目瞭然で、学習計画が立てやすくなります。</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">カスタマイズ可能</h3>
                <p className="text-gray-600 text-sm">練習する科目の選択、問題数の設定、分析期間の指定など、あなたの学習スタイルに合わせてカスタマイズできます。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">学習継続をサポート</h3>
                <p className="text-gray-600 text-sm">楽しいタイピング練習と成績の可視化で、モチベーションを維持しながら継続的な学習をサポートします。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}