'use client';

import { useState, useEffect } from 'react';
import TypingGame from '../components/TypingGame';
import CategorySelector from '../components/CategorySelector';
import type { Term } from '@/types/term';
import { CategoryId, defaultCategories } from '@/data/categories';
import { filterTermsByCategory, countTermsByCategory } from '@/utils/termUtils';

export default function Home() {
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('terms'); // 'terms'のみに変更
  
  // 科目選択と問題数の状態
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(defaultCategories);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [includeImportance, setIncludeImportance] = useState(true); // 重要ポイントを含めるかどうか
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<CategoryId, number>>({} as Record<CategoryId, number>);

  useEffect(() => {
    // 用語データをJSON形式で読み込む
    const loadTerms = async () => {
      try {
        // 通常はAPI経由で取得するが、今回はローカルのJSONファイルから読み込む
        const response = await fetch('/data/terms.json');
        if (!response.ok) {
          throw new Error('用語データの読み込みに失敗しました');
        }
        const data = await response.json();
        setAllTerms(data);
        
        // カテゴリごとの用語数をカウント
        const counts = countTermsByCategory(data);
        setCategoryCounts(counts);
        
        setError(null);
      } catch (error) {
        console.error('Error loading terms:', error);
        setError('データの読み込み中にエラーが発生しました。再度お試しください。');
        
        // エラー時のダミーデータ
        setAllTerms([
          {
            id: 1,
            term: "SWOT分析",
            description: "企業の強み(Strengths)、弱み(Weaknesses)、機会(Opportunities)、脅威(Threats)を分析するフレームワーク。",
            importance: "経営戦略の立案や環境分析において頻出の基本フレームワーク。",
            category: "management"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

  // 練習開始時に選択された科目と問題数に基づいて用語をフィルタリング
  const handleStartPractice = () => {
    const filtered = filterTermsByCategory(allTerms, selectedCategories, questionCount);
    setFilteredTerms(filtered);
    setIsPracticeStarted(true);
  };

  // 練習終了・リセット
  const handleReset = () => {
    setIsPracticeStarted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] animate-pulse">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-xl text-gray-600">データを読み込んでいます...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold mb-1">エラーが発生しました</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* ヒーローセクション */}
      <section className="mb-8 text-center bg-white rounded-xl p-8 shadow-soft">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          中小企業診断士試験 <span className="text-primary">タイピング練習</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          資格試験の勉強をしながら、タイピングスキルも向上させる。一石二鳥の学習アプリで効率的に試験対策。
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/terms"
            className="px-6 py-2 rounded-full transition bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            用語管理
          </a>
          <a 
            href="/guide"
            className="px-6 py-2 rounded-full transition bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            使い方
          </a>
        </div>
      </section>

      {/* コンテンツエリア */}
      <div className="space-y-8">
        {!isPracticeStarted ? (
          <>
            <section className="bg-white p-6 rounded-xl shadow-soft">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">用語集モード</h2>
              </div>
              <p className="mb-3 text-gray-600">
                中小企業診断士試験の重要用語とその説明、試験における重要ポイントを繰り返しタイピングすることで記憶に定着させましょう。
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">全{allTerms.length}語収録</span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">7科目対応</span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">ランダム出題</span>
                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">科目選択可</span>
              </div>
              <div className="bg-gray-50 border-l-4 border-primary p-4 mb-4 rounded">
                <p className="text-sm">
                  <strong>使い方：</strong> 練習したい科目と問題数を選択して、タイピング練習を開始しましょう。表示される用語→説明→重要ポイントの順に入力します。
                </p>
              </div>
            </section>

            <CategorySelector
              selectedCategories={selectedCategories}
              questionCount={questionCount}
              includeImportance={includeImportance}
              onCategoriesChange={setSelectedCategories}
              onQuestionCountChange={setQuestionCount}
              onIncludeImportanceChange={setIncludeImportance}
              onStartPractice={handleStartPractice}
            />
            
            {/* 科目別用語数の表示 */}
            <section className="bg-white p-6 rounded-xl shadow-soft">
              <h3 className="text-lg font-bold mb-4 text-gray-800">科目別用語数</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categoryCounts)
                  .filter(([categoryId]) => categoryId !== 'all')
                  .map(([categoryId, count]) => {
                    const categoryName = categoryId === 'all' 
                      ? '全科目' 
                      : categoryId === 'economics' ? '経済学・経済政策'
                      : categoryId === 'finance' ? '財務・会計'
                      : categoryId === 'management' ? '企業経営理論'
                      : categoryId === 'operation' ? '運営管理'
                      : categoryId === 'law' ? '経営法務'
                      : categoryId === 'it' ? '経営情報システム'
                      : '中小企業経営・政策';
                      
                    return (
                      <div key={categoryId} className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500 text-sm mb-1">{categoryName}</p>
                        <p className="text-2xl font-semibold text-primary">{count}語</p>
                      </div>
                    );
                  })
                }
              </div>
            </section>
          </>
        ) : (
          <>
            {/* 選択情報と戻るボタン */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-soft mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  選択科目: {selectedCategories.includes('all') 
                    ? '全科目' 
                    : selectedCategories.map(id => {
                        return id === 'economics' ? '経済学・経済政策'
                          : id === 'finance' ? '財務・会計'
                          : id === 'management' ? '企業経営理論'
                          : id === 'operation' ? '運営管理'
                          : id === 'law' ? '経営法務'
                          : id === 'it' ? '経営情報システム'
                          : '中小企業経営・政策';
                      }).join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  出題数: {questionCount === -1 ? '全問題' : `${filteredTerms.length}問`}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                設定に戻る
              </button>
            </div>
            
            {/* タイピングゲーム */}
            {filteredTerms.length > 0 && <TypingGame terms={filteredTerms} includeImportance={includeImportance} />}
          </>
        )}
      </div>
    </div>
  );
} 