'use client';

import { useState, useEffect } from 'react';
import { ScoreRecord, Subject, SUBJECTS } from '@/types/score';
import { saveScore, getScores, deleteScore } from '@/utils/scoreStorage';

export default function ScoresPage() {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '' as Subject,
    year: new Date().getFullYear(),
    score: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = () => {
    try {
      const loadedScores = getScores();
      setScores(loadedScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      setError('データの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.subject || !formData.score || !formData.date) {
        throw new Error('すべての項目を入力してください');
      }

      const scoreValue = parseInt(formData.score);
      if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
        throw new Error('スコアは0-100の範囲で入力してください');
      }

      const newScore: ScoreRecord = {
        id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subject: formData.subject,
        year: formData.year,
        score: scoreValue,
        date: formData.date,
        createdAt: new Date().toISOString()
      };

      saveScore(newScore);
      loadScores();
      setFormData({
        subject: '' as Subject,
        year: new Date().getFullYear(),
        score: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スコアの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('このスコアを削除しますか？')) {
      try {
        deleteScore(id);
        loadScores();
      } catch (error) {
        setError('スコアの削除に失敗しました');
      }
    }
  };

  const years = Array.from(new Set(scores.map(score => score.year))).sort((a, b) => b - a);
  
  const filteredScores = selectedYear 
    ? scores.filter(score => score.year === selectedYear)
    : scores;

  const groupedScores = filteredScores.reduce((acc, score) => {
    const key = `${score.year}年`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(score);
    return acc;
  }, {} as Record<string, ScoreRecord[]>);

  const getTableData = () => {
    const yearSubjectMatrix: Record<number, Record<Subject, ScoreRecord[]>> = {};
    
    filteredScores.forEach(score => {
      if (!yearSubjectMatrix[score.year]) {
        yearSubjectMatrix[score.year] = {} as Record<Subject, ScoreRecord[]>;
      }
      if (!yearSubjectMatrix[score.year][score.subject]) {
        yearSubjectMatrix[score.year][score.subject] = [];
      }
      yearSubjectMatrix[score.year][score.subject].push(score);
    });

    return Object.entries(yearSubjectMatrix)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .map(([year, subjects]) => ({
        year: parseInt(year),
        subjects: Object.fromEntries(
          SUBJECTS.map(subject => [
            subject,
            subjects[subject] ? subjects[subject].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []
          ])
        )
      }));
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">スコア記録</h1>
            <p className="text-gray-600">過去問の成績を記録して学習の進捗を管理しましょう</p>
          </div>
          <a 
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            ホームに戻る
          </a>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* フィルターとビューモード */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年度で絞り込み</label>
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全年度</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">表示形式</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    viewMode === 'grouped'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  年度別
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    viewMode === 'table'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  表形式
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しいスコアを記録
        </button>
        <a
          href="/analytics"
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          分析を見る
        </a>
      </div>

      {/* スコア入力フォーム */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">スコアを記録</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  科目 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value as Subject })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">科目を選択</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年度 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="2000"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  点数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  min="0"
                  max="100"
                  placeholder="0-100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  実施日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {isLoading ? '保存中...' : 'スコアを保存'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* スコア一覧 */}
      {scores.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">まだスコアが記録されていません</h3>
          <p className="text-gray-500 mb-4">「新しいスコアを記録」ボタンから最初のスコアを追加しましょう</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            スコアを記録する
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
            <h3 className="text-lg font-bold">スコア一覧表</h3>
            <p className="text-blue-100 text-sm">{filteredScores.length}件のスコア</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">年度</th>
                  {SUBJECTS.map(subject => (
                    <th key={subject} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      {subject}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getTableData().map(({ year, subjects }) => (
                  <tr key={year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{year}年</td>
                    {SUBJECTS.map(subject => (
                      <td key={subject} className="px-4 py-3 text-center">
                        {subjects[subject as Subject].length > 0 ? (
                          <div className="space-y-1">
                            {subjects[subject as Subject].map((score, index) => (
                              <div key={score.id} className="flex items-center justify-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  score.score >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {score.score}点
                                </span>
                                <span className="text-xs text-gray-500">{score.date}</span>
                                <button
                                  onClick={() => handleDelete(score.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                                  title="削除"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-500">
                        {Object.values(subjects).reduce((sum, scores) => sum + scores.length, 0)}件
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedScores).map(([year, yearScores]) => (
            <div key={year} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                <h3 className="text-lg font-bold">{year}</h3>
                <p className="text-blue-100 text-sm">{yearScores.length}件のスコア</p>
              </div>
              <div className="p-4">
                <div className="grid gap-4">
                  {yearScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {score.subject}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            score.score >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {score.score}点
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">実施日: {score.date}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(score.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="削除"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}