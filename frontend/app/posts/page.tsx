'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/dist/client/link';

interface Author {
  name: string;
}

interface Post {
  id: number;
  title: string;
  created_at: string;
  author?: Author;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/posts')
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar posts:", error);
        setError("Nenhum post encontrado.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Carregando posts...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Todos os Posts</h1>
        
        {error && (
          <div className="mb-6 p-4 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="grid gap-6">
          {!error && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                  {post.author && (
                    <p className="mt-4 text-sm text-gray-400">Por: {post.author.name}</p>
                  )}
                  {post.created_at && (
                    <p className="text-sm text-gray-400">Criado em: {new Date(post.created_at).toLocaleDateString()}</p>
                  )}
                </Link>
              </div>
            ))
          ) : !error && (
            <p className="text-center text-gray-500">Nenhum post encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}