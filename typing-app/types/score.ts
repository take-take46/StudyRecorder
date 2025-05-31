export interface ScoreRecord {
  id: string;
  subject: string; // 科目
  year: number; // 年度
  score: number; // 点数
  date: string; // 記録日付 (YYYY-MM-DD)
  createdAt: string; // 作成日時 (ISO string)
}

export type Subject = 
  | '経済学・経済政策'
  | '財務・会計'
  | '企業経営理論'
  | '運営管理'
  | '経営法務'
  | '経営情報システム'
  | '中小企業経営・政策';

export const SUBJECTS: Subject[] = [
  '経済学・経済政策',
  '財務・会計',
  '企業経営理論',
  '運営管理',
  '経営法務',
  '経営情報システム',
  '中小企業経営・政策'
];

export interface ScoreFilter {
  year?: number;
  subject?: Subject;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ScoreChartData {
  year: number;
  subject: string;
  score: number;
  total?: number;
}