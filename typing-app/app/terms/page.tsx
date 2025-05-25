'use client';

import { useState, useEffect } from 'react';
import { Term } from '@/types/term';
import { categories } from '@/data/categories';
import TermForm from '@/components/TermForm';

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddingTerm, setIsAddingTerm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 用語データの取得
  const fetchTerms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/terms');
      if (!response.ok) {
        throw new Error('Failed to fetch terms');
      }
      const data = await response.json();
      setTerms(data);
      setError(null);
    } catch (error) {
      console.error('Error loading terms:', error);
      setError('データの読み込み中にエラーが発生しました。再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // 用語の追加
  const handleAddTerm = async (newTerm: Omit<Term, 'id'>) => {
    try {
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTerm),
      });

      if (!response.ok) {
        throw new Error('Failed to add term');
      }

      fetchTerms();
      setIsAddingTerm(false);
    } catch (error) {
      console.error('Error adding term:', error);
      setError('用語の追加に失敗しました。再度お試しください。');
    }
  };

  // 用語の更新
  const handleUpdateTerm = async (updatedTerm: Omit<Term, 'id'>) => {
    if (!selectedTerm) return;

    try {
      const response = await fetch(`/api/terms/${selectedTerm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTerm),
      });

      if (!response.ok) {
        throw new Error('Failed to update term');
      }

      fetchTerms();
      setSelectedTerm(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating term:', error);
      setError('用語の更新に失敗しました。再度お試しください。');
    }
  };

  // 用語の削除
  const handleDeleteTerm = async (id: number) => {
    if (!confirm('この用語を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/terms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete term');
      }

      fetchTerms();
    } catch (error) {
      console.error('Error deleting term:', error);
      setError('用語の削除に失敗しました。再度お試しください。');
    }
  };

  // 用語の表示/非表示切り替え
  const handleToggleHidden = async (id: number, isHidden: boolean) => {
    try {
      const response = await fetch(`/api/terms/hide/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHidden }),
      });

      if (!response.ok) {
        throw new Error('Failed to update term visibility');
      }

      // 成功したら一覧を更新
      fetchTerms();
    } catch (error) {
      console.error('Error updating term visibility:', error);
      setError('用語の表示/非表示の更新に失敗しました。再度お試しください。');
    }
  };

  // 表示する用語をフィルタリング
  const filteredTerms = terms
    .filter(term => {
      // カテゴリでフィルタリング
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }
      
      // 検索クエリでフィルタリング
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          term.term.toLowerCase().includes(query) ||
          term.description.toLowerCase().includes(query) ||
          term.importance.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => a.id - b.id);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
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
            onClick={fetchTerms} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (isAddingTerm) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">新しい用語を追加</h1>
          <button
            onClick={() => setIsAddingTerm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <TermForm
          onSubmit={handleAddTerm}
          onCancel={() => setIsAddingTerm(false)}
        />
      </div>
    );
  }

  if (isFormOpen && selectedTerm) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">用語を編集</h1>
          <button
            onClick={() => {
              setIsFormOpen(false);
              setSelectedTerm(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <TermForm
          term={selectedTerm}
          onSubmit={handleUpdateTerm}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedTerm(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">用語管理</h1>
        <button
          onClick={() => setIsAddingTerm(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しい用語を追加
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              検索
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="用語、説明、重要ポイントを検索..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-2 mb-4 text-sm text-gray-500">
          全 {terms.length} 件中 {filteredTerms.length} 件表示
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用語
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTerms.map(term => (
                <tr key={term.id} className={term.isHidden ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {term.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{term.term}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{term.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategoryName(term.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {term.isHidden ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        非表示
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        表示中
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTerm(term);
                          setIsFormOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleToggleHidden(term.id, !term.isHidden)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {term.isHidden ? '表示' : '非表示'}
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTerms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    表示できる用語がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}