export default function Home() {
  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* ヒーローセクション */}
      <section className="mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-yellow-300">たけちゃんすぺしゃるツール</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
          学習や作業効率化に役立つ様々なツールを提供する総合プラットフォーム。あなたの目標達成をサポートします。
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">🎯 効率的学習</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">🛠️ 多様なツール</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">📈 進捗管理</span>
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">🎨 使いやすいUI</span>
        </div>
      </section>

      {/* ツールメニュー */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">利用可能なツール</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 中小企業診断士試験ツール */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-2xl font-bold">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">中小企業診断士試験</h3>
              <p className="text-purple-100 text-sm">一次試験対策の総合学習ツール</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>タイピング練習で用語暗記</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>過去問スコア記録・分析</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span>科目別学習進捗管理</li>
              </ul>
              <a 
                href="/sme-consultant"
                className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                ツールを使用する
              </a>
            </div>
          </div>

          {/* 準備中のツール1 */}
          <div className="bg-white rounded-xl shadow-lg opacity-50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-2xl font-bold">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-2">新ツール</h3>
              <p className="text-green-100 text-sm">準備中...</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-400 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能1（準備中）</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能2（準備中）</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能3（準備中）</li>
              </ul>
              <button 
                disabled
                className="block w-full text-center bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-semibold"
              >
                準備中
              </button>
            </div>
          </div>

          {/* 準備中のツール2 */}
          <div className="bg-white rounded-xl shadow-lg opacity-50 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">効率化ツール</h3>
              <p className="text-orange-100 text-sm">準備中...</p>
            </div>
            <div className="p-6">
              <ul className="text-sm text-gray-400 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能1（準備中）</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能2（準備中）</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">○</span>機能3（準備中）</li>
              </ul>
              <button 
                disabled
                className="block w-full text-center bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-semibold"
              >
                準備中
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">たけちゃんすぺしゃるツールの特徴</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">多様な学習ツール</h3>
                <p className="text-gray-600 text-sm">タイピング練習、スコア管理、進捗分析など、学習を効率化する様々なツールを提供しています。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">データ可視化</h3>
                <p className="text-gray-600 text-sm">グラフとチャートで学習進捗を可視化。データに基づいた効率的な学習計画を立てられます。</p>
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
                <p className="text-gray-600 text-sm">ユーザーのニーズに合わせて設定をカスタマイズ。あなたの学習スタイルに最適化できます。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">継続的な改善</h3>
                <p className="text-gray-600 text-sm">ユーザーフィードバックに基づいて継続的に機能改善。より使いやすいツールを目指しています。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}