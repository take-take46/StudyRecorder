'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScoreRecord, Subject, SUBJECTS } from '@/types/score';
import { getScores } from '@/utils/scoreStorage';
import { calculateYearlyTotals, calculateSubjectAverages, getYearlySubjectData, getProgressData, getScoreStats, getYearlySubjectDistribution } from '@/utils/scoreAnalytics';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

export default function AnalyticsPage() {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [filteredScores, setFilteredScores] = useState<ScoreRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'yearly' | 'subject' | 'progress'>('overview');
  const [yearlyFilterSubject, setYearlyFilterSubject] = useState<Subject | null>(null);
  const [yearlyFilterYear, setYearlyFilterYear] = useState<number | null>(null);

  useEffect(() => {
    const loadedScores = getScores();
    setScores(loadedScores);
    setFilteredScores(loadedScores);
  }, []);

  useEffect(() => {
    let filtered = scores;
    if (selectedYear) {
      filtered = filtered.filter(score => score.year === selectedYear);
    }
    if (selectedSubject) {
      filtered = filtered.filter(score => score.subject === selectedSubject);
    }
    setFilteredScores(filtered);
  }, [scores, selectedYear, selectedSubject]);

  const years = Array.from(new Set(scores.map(score => score.year))).sort((a, b) => b - a);
  const yearlyTotals = calculateYearlyTotals(filteredScores);
  const subjectAverages = calculateSubjectAverages(filteredScores);
  const stats = getScoreStats(filteredScores);
  const progressData = getProgressData(filteredScores, selectedSubject || undefined);

  const resetFilters = () => {
    setSelectedYear(null);
    setSelectedSubject(null);
  };

  if (scores.length === 0) {
    return (
      <div className="max-w-6xl mx-auto animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">スコア分析</h1>
              <p className="text-gray-600">成績データをグラフで可視化</p>
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

        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">まだスコアが記録されていません</h3>
          <p className="text-gray-500 mb-4">スコアを記録すると、ここに分析結果が表示されます</p>
          <a
            href="/scores"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            スコアを記録する
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">スコア分析</h1>
            <p className="text-gray-600">成績データをグラフで可視化して学習の進捗を確認</p>
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

      {/* ビューモード切り替え */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'overview' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 概要
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'yearly' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 年度別
          </button>
          <button
            onClick={() => setViewMode('subject')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'subject' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📚 科目別
          </button>
          <button
            onClick={() => setViewMode('progress')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'progress' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📈 推移
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">科目で絞り込み</label>
            <select
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value as Subject || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全科目</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          {(selectedYear || selectedSubject) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              フィルターをリセット
            </button>
          )}
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalTests}</div>
          <div className="text-gray-600 text-sm">受験回数</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.averageScore}</div>
          <div className="text-gray-600 text-sm">平均点</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.highestScore}</div>
          <div className="text-gray-600 text-sm">最高点</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.passRate}%</div>
          <div className="text-gray-600 text-sm">合格率</div>
        </div>
      </div>

      {/* メインコンテンツ */}
      {viewMode === 'overview' && (
        <div className="space-y-8">
          {/* 年度別平均点推移 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">年度別平均点推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="平均点"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 科目別平均点 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">科目別平均点</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#10B981" name="平均点" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'yearly' && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">年度別詳細分析</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年度で絞り込み</label>
                <select
                  value={yearlyFilterYear || ''}
                  onChange={(e) => setYearlyFilterYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全年度</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">科目で絞り込み</label>
                <select
                  value={yearlyFilterSubject || ''}
                  onChange={(e) => setYearlyFilterSubject(e.target.value as Subject || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全科目</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            {(yearlyFilterYear ? [yearlyFilterYear] : years).map(year => {
              const yearData = getYearlySubjectData(scores, year, yearlyFilterSubject || undefined);
              return (
                <div key={year} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    {year}年{yearlyFilterSubject ? ` - ${yearlyFilterSubject}` : ''}
                  </h4>
                  {yearData.length > 0 ? (
                    <div className="space-y-6">
                      {/* グラフ表示 */}
                      <div>
                        <h5 className="text-md font-semibold text-gray-800 mb-3">スコア分布グラフ</h5>
                        {yearData.map(({ subject, scores }) => {
                          const chartData = scores.map((scoreData, index) => ({
                            ...scoreData,
                            attempt: `${index + 1}回目`,
                            dateLabel: new Date(scoreData.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
                          }));
                          
                          return (
                            <div key={subject} className="mb-4">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">{subject}</h6>
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                    dataKey="attempt"
                                    tick={{ fontSize: 12 }}
                                  />
                                  <YAxis domain={[0, 100]} />
                                  <Tooltip 
                                    labelFormatter={(value) => `受験回数: ${value}`}
                                    formatter={(value, name, props) => [
                                      `${value}点`,
                                      'スコア',
                                      `実施日: ${props.payload.dateLabel}`
                                    ]}
                                  />
                                  <Bar 
                                    dataKey="score" 
                                    fill={COLORS[SUBJECTS.indexOf(subject as Subject) % COLORS.length]}
                                    name="スコア"
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* 詳細リスト表示 */}
                      <div className="space-y-4">
                        <h5 className="text-md font-semibold text-gray-800">詳細データ</h5>
                        {yearData.map(({ subject, scores, count }) => (
                          <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                            <h6 className="font-medium text-gray-800 mb-2">{subject} ({count}回受験)</h6>
                            <div className="grid gap-2">
                              {scores.map((scoreData, index) => (
                                <div key={scoreData.id} className="flex justify-between items-center p-2 bg-white rounded border">
                                  <span className="text-sm text-gray-600">{scoreData.date}</span>
                                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                                    scoreData.score >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {scoreData.score}点
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      この年度にはデータがありません
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'subject' && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">科目別成績分布</h3>
          {selectedYear ? (
            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedYear}年度の成績</h4>
                {(() => {
                  const yearDistribution = getYearlySubjectDistribution(scores, selectedYear);
                  return (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{yearDistribution.totalScore}</div>
                          <div className="text-sm text-gray-600">合計点</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${yearDistribution.isPass ? 'text-green-600' : 'text-red-600'}`}>
                            {yearDistribution.passStatus}
                          </div>
                          <div className="text-sm text-gray-600">判定結果</div>
                        </div>
                      </div>
                      
                      {/* 棒グラフ表示 */}
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-gray-800 mb-3">科目別得点グラフ</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={yearDistribution.subjects}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="subject" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis domain={[0, 100]} />
                            <Tooltip 
                              formatter={(value) => [`${value}点`, '得点']}
                            />
                            <Legend />
                            <Bar dataKey="score" fill="#3B82F6" name="得点" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* 詳細リスト表示 */}
                      <div className="space-y-2">
                        <h5 className="text-md font-semibold text-gray-800 mb-2">科目別詳細</h5>
                        {yearDistribution.subjects.map((subjectData, index) => (
                          <div key={subjectData.subject} className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="font-medium">{subjectData.subject}</span>
                            <span className="text-lg font-bold text-blue-600">{subjectData.score}点</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={subjectAverages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, average }) => `${subject}: ${average}点`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="average"
                >
                  {subjectAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {viewMode === 'progress' && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">スコア推移</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => `日付: ${value}`}
                formatter={(value, name) => [`${value}点`, name]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="スコア"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* アクションボタン */}
      <div className="mt-8 flex gap-4">
        <a
          href="/scores"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しいスコアを記録
        </a>
      </div>
    </div>
  );
}