import { ScoreRecord } from '@/types/score';

const STORAGE_KEY = 'takechan_special_tool_scores';

export const saveScore = (score: ScoreRecord): void => {
  try {
    const existingScores = getScores();
    const updatedScores = [...existingScores, score];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('スコアの保存に失敗しました:', error);
    throw new Error('スコアの保存に失敗しました');
  }
};

export const getScores = (): ScoreRecord[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('スコアの読み込みに失敗しました:', error);
    return [];
  }
};

export const deleteScore = (id: string): void => {
  try {
    const existingScores = getScores();
    const updatedScores = existingScores.filter(score => score.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('スコアの削除に失敗しました:', error);
    throw new Error('スコアの削除に失敗しました');
  }
};

export const updateScore = (id: string, updatedScore: Partial<ScoreRecord>): void => {
  try {
    const existingScores = getScores();
    const updatedScores = existingScores.map(score => 
      score.id === id ? { ...score, ...updatedScore } : score
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('スコアの更新に失敗しました:', error);
    throw new Error('スコアの更新に失敗しました');
  }
};

export const getScoresByYear = (year: number): ScoreRecord[] => {
  return getScores().filter(score => score.year === year);
};

export const getScoresBySubject = (subject: string): ScoreRecord[] => {
  return getScores().filter(score => score.subject === subject);
};

export const getYears = (): number[] => {
  const scores = getScores();
  const years = Array.from(new Set(scores.map(score => score.year)));
  return years.sort((a, b) => b - a);
};