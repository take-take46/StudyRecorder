'use client';

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-soft">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">使い方ガイド</h1>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">科目と問題数を選択</h3>
              <p className="text-gray-600">トップページで練習したい科目と問題数を選択します。特定の科目だけに絞って効率的に学習したり、複数の科目を組み合わせたりできます。</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">タイピング練習を開始</h3>
              <p className="text-gray-600">「タイピング練習を開始」ボタンをクリックすると、選択した条件に基づいてランダムに問題が出題されます。</p>
              <div className="mt-2 bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>ヒント：</strong> 入力フィールドの下にキーボード入力例が表示されます。日本語入力モードにして入力してください。
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3ステップ学習</h3>
              <p className="text-gray-600">各用語について、以下の3つのステップでタイピングします：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>用語自体（例：SWOT分析）</li>
                <li>用語の説明文</li>
                <li>試験における重要ポイント</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <span className="text-primary font-bold">4</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">進捗確認と復習</h3>
              <p className="text-gray-600">画面上部の進捗バーで学習の進み具合を確認できます。難しい用語はスキップボタンを使用して後で復習することもできます。</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <span className="text-primary font-bold">5</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">学習結果の確認</h3>
              <p className="text-gray-600">すべての用語を終えると、タイピングの正確性と速度が表示されます。再挑戦して成績向上を目指しましょう。</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold mb-3">効果的な学習のコツ</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>毎日15〜30分程度の短時間でも定期的に練習することで効果が高まります。</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>タイピング中に用語の意味を意識することで、記憶の定着率が向上します。</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>試験前は特に苦手分野の科目を選択して集中的に学習するのが効果的です。</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 flex justify-center">
          <a 
            href="/"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
} 