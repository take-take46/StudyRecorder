import { CategoryId } from '@/data/categories';

export interface Term {
  id: number;
  term: string;
  description: string;
  importance: string;
  category: CategoryId;
  isHidden?: boolean;
} 