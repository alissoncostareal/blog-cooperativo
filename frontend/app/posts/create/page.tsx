'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import PostForm from '@/components/PostForm';

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
      message: '',
      type: null,
  });

  const handleCreatePost = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    setError('');
    setFeedback({ message: '', type: null });

    try {
      
      const token = localStorage.getItem('access_token');
      
      const response = await api.post('/posts', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newId = response.data.id;
      setFeedback({ message: 'Post criado com sucesso! Redirecionando...', type: 'success' });
      setTimeout(() => {
            router.push(`/posts/${newId}`);
        }, 1500);
    } catch (err: any) {
      console.error(err);
      setFeedback({ message: 'Erro ao salvar post. Verifique se você está logado.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Criar Novo Post</h1>
        
        {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}
        
        <PostForm 
          onSubmit={handleCreatePost} 
          isLoading={isLoading} 
          buttonText="Publicar Post"
        />
      </div>
    </main>
  );
}