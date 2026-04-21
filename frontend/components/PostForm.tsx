'use client';

import { useState, useEffect } from 'react';

// 1. Defina a estrutura dos dados
export interface PostFormData {
  title: string;
  content: string;
}

// 2. Defina o que o componente recebe (as Props)
interface PostFormProps {
  initialData?: PostFormData; // Opcional, pois no 'Create' não existirá
  onSubmit: (data: PostFormData) => void;
  isLoading: boolean;
  buttonText: string;
}

export default function PostForm({ initialData, onSubmit, isLoading, buttonText }: PostFormProps) {
    
  const [form, setForm] = useState<PostFormData>({ title: '', content: '' });

  // 3. Sincroniza quando o initialData (post) chegar do banco
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        onSubmit(form); 
      }} 
      className="space-y-4"
    >
      {/* ... inputs conforme vimos antes ... */}
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full text-black shadow-sm border border-gray-200 p-2 border rounded"
        placeholder="Título"
        required
      />
      <textarea
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full text-black p-2 border shadow-sm border border-gray-200 rounded h-40"
        placeholder="Conteúdo"
        required
      />
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Salvando...' : buttonText}
      </button>
    </form>
  );
}