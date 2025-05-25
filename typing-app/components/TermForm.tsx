import { useState, useEffect } from 'react';
import { Term } from '@/types/term';
import { categories, CategoryId } from '@/data/categories';

interface TermFormProps {
  term?: Term;
  onSubmit: (term: Omit<Term, 'id'>) => void;
  onCancel: () => void;
}

const TermForm = ({ term, onSubmit, onCancel }: TermFormProps) => {
  const [formData, setFormData] = useState<Omit<Term, 'id'>>({
    term: '',
    description: '',
    importance: '',
    category: 'management',
    isHidden: false
  });
  
  const [errors, setErrors] = useState({
    term: '',
    description: '',
    importance: '',
    category: ''
  });
  
  useEffect(() => {
    if (term) {
      setFormData({
        term: term.term,
        description: term.description,
        importance: term.importance,
        category: term.category,
        isHidden: term.isHidden || false
      });
    }
  }, [term]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // エラーをクリア
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const validateForm = () => {
    const newErrors = {
      term: !formData.term ? '用語を入力してください' : '',
      description: !formData.description ? '説明を入力してください' : '',
      importance: !formData.importance ? '重要ポイントを入力してください' : '',
      category: !formData.category ? 'カテゴリを選択してください' : ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-soft">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {term ? '用語を編集' : '新しい用語を追加'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            用語 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.term ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.term && <p className="mt-1 text-sm text-red-500">{errors.term}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-1">
            重要ポイント <span className="text-red-500">*</span>
          </label>
          <textarea
            id="importance"
            name="importance"
            value={formData.importance}
            onChange={handleChange}
            rows={2}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.importance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.importance && <p className="mt-1 text-sm text-red-500">{errors.importance}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {categories
              .filter(cat => cat.id !== 'all')
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>
        
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isHidden"
              checked={formData.isHidden}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-primary"
            />
            <span className="ml-2 text-gray-700">問題から除外する</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            チェックすると、この用語はタイピング練習に表示されなくなります。
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            {term ? '更新する' : '追加する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TermForm;