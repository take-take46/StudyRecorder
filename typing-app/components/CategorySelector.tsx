import React, { useState } from 'react';
import { categories, CategoryId } from '@/data/categories';

interface CategorySelectorProps {
  selectedCategories: CategoryId[];
  questionCount: number;
  includeImportance: boolean; // 重要ポイントを含めるかどうか
  onCategoriesChange: (categories: CategoryId[]) => void;
  onQuestionCountChange: (count: number) => void;
  onIncludeImportanceChange: (include: boolean) => void; // 重要ポイントを含めるかどうかの変更ハンドラ
  onStartPractice: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  questionCount,
  includeImportance,
  onCategoriesChange,
  onQuestionCountChange,
  onIncludeImportanceChange,
  onStartPractice,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (categoryId: CategoryId) => {
    // 「全科目」が選択された場合
    if (categoryId === 'all') {
      if (selectedCategories.includes('all')) {
        onCategoriesChange([]);
      } else {
        onCategoriesChange(['all']);
      }
      return;
    }

    // 通常の科目の選択/解除
    const newSelectedCategories = [...selectedCategories];
    
    // 「全科目」が選択されていたら解除
    if (newSelectedCategories.includes('all')) {
      const index = newSelectedCategories.indexOf('all');
      newSelectedCategories.splice(index, 1);
    }
    
    // 既に選択されていれば解除、なければ追加
    if (newSelectedCategories.includes(categoryId)) {
      const index = newSelectedCategories.indexOf(categoryId);
      newSelectedCategories.splice(index, 1);
    } else {
      newSelectedCategories.push(categoryId);
    }
    
    onCategoriesChange(newSelectedCategories);
  };

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onQuestionCountChange(parseInt(e.target.value, 10));
  };

  const getSelectedCategoriesText = () => {
    if (selectedCategories.includes('all')) {
      return '全科目';
    }
    
    if (selectedCategories.length === 0) {
      return '選択されていません';
    }
    
    return selectedCategories
      .map(id => categories.find(c => c.id === id)?.name)
      .join(', ');
  };

  // 問題数の選択肢を生成（1から30まで）
  const generateQuestionCountOptions = () => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
      options.push(
        <option key={i} value={i}>{i}問</option>
      );
    }
    options.push(<option key="-1" value={-1}>全問題（制限なし）</option>);
    return options;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 mb-8 animate-fadeIn">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        タイピング練習の設定
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 科目選択セクション */}
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              科目の選択
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="block truncate">{getSelectedCategoriesText()}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                        selectedCategories.includes(category.id as CategoryId) ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => handleCategoryToggle(category.id as CategoryId)}
                    >
                      {selectedCategories.includes(category.id as CategoryId) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className={selectedCategories.includes(category.id as CategoryId) ? 'font-medium' : ''}>
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">複数の科目を選択できます</p>
          </div>
        </div>

        {/* 問題数選択セクション */}
        <div>
          <div className="mb-2">
            <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 mb-1">
              出題数の選択
            </label>
            <select
              id="question-count"
              value={questionCount}
              onChange={handleQuestionCountChange}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {generateQuestionCountOptions()}
            </select>
            <p className="mt-1 text-xs text-gray-500">1セッションで練習する問題数を選択</p>
          </div>
        </div>
      </div>

      {/* 追加オプション */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">追加オプション</h4>
        <div className="flex items-center">
          <input
            id="include-importance"
            type="checkbox"
            checked={includeImportance}
            onChange={(e) => onIncludeImportanceChange(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="include-importance" className="ml-2 block text-sm text-gray-700">
            重要ポイントも出題する
          </label>
          <div className="ml-2 bg-yellow-50 px-2 py-0.5 rounded-full text-xs text-yellow-700">
            オススメ
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 pl-6">
          オフにすると、用語と説明のみを出題します。重要ポイントは出題されません。
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onStartPractice}
          disabled={selectedCategories.length === 0}
          className={`px-6 py-3 rounded-full shadow-md text-white font-medium transition transform hover:-translate-y-1 ${
            selectedCategories.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            タイピング練習を開始
          </div>
        </button>
        {selectedCategories.length === 0 && (
          <p className="mt-2 text-sm text-red-500">科目を少なくとも1つ選択してください</p>
        )}
      </div>
    </div>
  );
};

export default CategorySelector; 