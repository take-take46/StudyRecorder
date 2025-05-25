import { Term } from '@/types/term';
import { CategoryId } from '@/data/categories';

/**
 * 指定されたカテゴリと問題数に基づいて用語をフィルタリングする
 */
export const filterTermsByCategory = (
  terms: Term[],
  selectedCategories: CategoryId[],
  questionCount: number
): Term[] => {
  // 非表示フラグがついた用語を除外
  const visibleTerms = terms.filter(term => !term.isHidden);
  
  // 全科目が選択されている場合は全ての用語を対象にする
  if (selectedCategories.includes('all')) {
    return questionCount > 0 
      ? shuffleArray(visibleTerms).slice(0, questionCount)
      : shuffleArray(visibleTerms);
  }
  
  // 選択されたカテゴリに属する用語をフィルタリング
  const filteredTerms = visibleTerms.filter(term => selectedCategories.includes(term.category));
  
  // シャッフルして問題数を制限
  const shuffled = shuffleArray(filteredTerms);
  
  // 問題数が-1の場合は全問出題、それ以外は指定された数だけを返す
  return questionCount > 0
    ? shuffled.slice(0, Math.min(questionCount, shuffled.length))
    : shuffled;
};

/**
 * 配列をシャッフルする（Fisher-Yates アルゴリズム）
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * 各カテゴリの用語数をカウントする
 */
export const countTermsByCategory = (terms: Term[]): Record<CategoryId, number> => {
  const counts: Partial<Record<CategoryId, number>> = {};
  
  // 非表示フラグがついた用語を除外してカウント
  const visibleTerms = terms.filter(term => !term.isHidden);
  
  visibleTerms.forEach(term => {
    if (counts[term.category]) {
      counts[term.category] = (counts[term.category] || 0) + 1;
    } else {
      counts[term.category] = 1;
    }
  });
  
  return counts as Record<CategoryId, number>;
}; 