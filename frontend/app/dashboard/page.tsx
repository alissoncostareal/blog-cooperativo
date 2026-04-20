'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Console } from 'node:console';

interface Post {
  id: number;       
  title: string;    
  content: string;
  author_id: number;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
  setLoading(true);
  try {
        const response = await api.get('/my-posts');
        setPosts(response.data);
    } catch (error: any) {
        if (error.response) {
        console.error("Erro do Servidor (Laravel):", error.response.data);
        } else {
        console.error("Erro de Rede:", error.message);
        }
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Deseja excluir este post?')) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        alert("Erro ao excluir post.");
      }
    }
  };

  if (loading) return <div className="p-8">Carregando seus posts...</div>;

  return (
    <main className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Posts</h1>
        <Link href="/dashboard/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Criar Post
        </Link>
      </div>
      
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="border p-4 mb-4 rounded flex justify-between items-center bg-white shadow-sm">
            <h2 className="font-semibold text-lg">{post.title}</h2> 
            <div className="flex gap-2">
              <Link href={`/dashboard/edit/${post.id}`} className="text-blue-500 hover:text-blue-700 font-medium">
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
        ))
      ) : (
        <p className="text-gray-500">Você ainda não criou nenhum post.</p>
      )}
    </main>
  );
}