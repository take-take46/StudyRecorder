export const categories = [
  {
    id: 'all',
    name: '全科目',
    description: '全ての科目から出題されます',
  },
  {
    id: 'economics',
    name: '経済学・経済政策',
    description: 'マクロ経済学、ミクロ経済学、経済政策に関する用語',
  },
  {
    id: 'finance',
    name: '財務・会計',
    description: '企業の財務分析、会計、税務に関する用語',
  },
  {
    id: 'management',
    name: '企業経営理論',
    description: '経営戦略、組織論、マーケティングに関する用語',
  },
  {
    id: 'operation',
    name: '運営管理',
    description: '生産管理、品質管理、サプライチェーンに関する用語',
  },
  {
    id: 'law',
    name: '経営法務',
    description: '会社法、労働法、知的財産権に関する用語',
  },
  {
    id: 'it',
    name: '経営情報システム',
    description: 'IT戦略、情報システム、セキュリティに関する用語',
  },
  {
    id: 'sme',
    name: '中小企業経営・政策',
    description: '中小企業の経営戦略、政策に関する用語',
  },
];

export type CategoryId = 'all' | 'economics' | 'finance' | 'management' | 'operation' | 'law' | 'it' | 'sme';

export const defaultCategories: CategoryId[] = ['management', 'finance', 'economics']; 