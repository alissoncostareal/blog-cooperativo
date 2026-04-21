'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
}

export default function Dashboard() {
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/my-posts');
      setPosts(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
      setFeedback({ message: 'Post excluído com sucesso!', type: 'success' });
    } catch (error) {
      setFeedback({ message: 'Erro ao excluir o post. Tente novamente.', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando seus posts...</div>;

  return (
    <main className="p-8 w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Posts</h1>
          <p className="text-gray-500">Gerencie seu conteúdo.</p>
        </div>

        <div className="flex gap-3">
          <Link 
            href="/dashboard/reports" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
           Relatórios
          </Link>
          <Link 
            href="/posts/create" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            + Novo Post
          </Link>
        </div>
      </div>

      {feedback.message && (
        <div className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback.message}
        </div>
      )}
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="p-4 rounded-xl flex justify-between items-center bg-white shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-gray-800 font-semibold text-lg hover:text-indigo-600">{post.title}</h2> 
              </Link>
              <div className="flex gap-4">
                <Link href={`/dashboard/edit/${post.id}`} className="text-gray-500 hover:text-indigo-600 font-medium">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Você ainda não criou nenhum post.</p>
        </div>
      )}
    </main>
  );
}