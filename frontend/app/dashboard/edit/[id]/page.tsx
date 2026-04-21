'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import PostForm, { PostFormData } from '@/components/PostForm';

export default function EditPostPage() {
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState<PostFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFeedback({ message: '', type: null });
    if (!id) return;

    api.get(`/posts/${id}`)
      .then((response) => {
        setPost({
          title: response.data.title,
          content: response.data.content,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar post:", error);
        setFeedback({ message: 'Erro ao buscar o post.', type: 'error' });
        router.push('/dashboard');
      });
  }, [id, router]);

  const handleUpdate = async (data: PostFormData) => {
    setFeedback({ message: '', type: null });
    setSubmitting(true);
    try {
      const response = await api.put(`/posts/${id}`, data);
      const newId = response.data.id;
      setFeedback({ message: 'Post atualizado com sucesso!', type: 'success' });
      setTimeout(() => {
            router.push(`/posts/${newId}`);
        }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setFeedback({ message: 'Erro ao atualizar o post.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Carregando post...</div>;

  return (
    <main className="p-8 mx-auto w-4/5">
      <h1 className="text-2xl font-bold mb-6">Editar Post</h1>

      {post ? (
        <PostForm 
          initialData={post} 
          onSubmit={handleUpdate} 
          isLoading={submitting} 
          buttonText="Salvar Alterações" 
        />
      ) : (
        <p>Carregando formulário...</p>
      )}
    </main>
  );
}