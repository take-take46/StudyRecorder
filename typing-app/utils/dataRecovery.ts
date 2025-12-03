import { ScoreRecord } from '@/types/score';

// 可能性のあるストレージキー一覧
const POSSIBLE_STORAGE_KEYS = [
  'takechan_special_tool_scores',
  'typing-practice-scores',
  'sme-consultant-scores',
  'diagnostic-test-scores',
  'scores',
  'test_scores',
  'study_scores'
];

export const findStoredScoreData = (): { key: string; data: ScoreRecord[] } | null => {
  if (typeof window === 'undefined') return null;
  
  for (const key of POSSIBLE_STORAGE_KEYS) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // スコアデータの形式をチェック
        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstItem = parsed[0];
          if (firstItem && 
              typeof firstItem.id === 'string' &&
              typeof firstItem.subject === 'string' &&
              typeof firstItem.score === 'number' &&
              typeof firstItem.year === 'number') {
            console.log(`Found score data in key: ${key}, count: ${parsed.length}`);
            return { key, data: parsed };
          }
        }
      }
    } catch (error) {
      console.warn(`Error checking key ${key}:`, error);
    }
  }
  
  return null;
};

export const getAllLocalStorageKeys = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
};

export const migrateScoreData = (fromKey: string, toKey: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const data = localStorage.getItem(fromKey);
    if (data) {
      localStorage.setItem(toKey, data);
      console.log(`Successfully migrated data from ${fromKey} to ${toKey}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

// サンプルデータを作成する関数（テスト用）
export const createSampleScores = (): ScoreRecord[] => {
  const subjects = ['企業経営理論', '財務・会計', '運営管理', '経営情報システム', '経営法務', '経済学・経済政策', '中小企業経営・中小企業政策'];
  const years = [2023, 2024];
  const sampleScores: ScoreRecord[] = [];
  
  years.forEach(year => {
    subjects.forEach((subject, index) => {
      // 各科目に2-3個のスコアを追加
      const scoreCount = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < scoreCount; i++) {
        const baseScore = 50 + Math.floor(Math.random() * 40); // 50-89点
        sampleScores.push({
          id: `sample-${year}-${index}-${i}-${Date.now()}`,
          year,
          subject,
          score: baseScore,
          date: new Date(
            year,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split('T')[0],
          createdAt: new Date().toISOString()
        });
      }
    });
  });
  
  return sampleScores;
};