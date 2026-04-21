'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';

export default function PostDetalhes() {
    const params = useParams();
    const id = params.id;

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api.get(`/posts/${id}`)
      .then((response) => setPost(response.data))
      .catch((error) => console.error("Erro ao carregar post:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-gray-500">
      Carregando conteúdo...
    </div>
  );

  if (!post) return (
    <div className="p-8 text-center text-red-600">Post não encontrado.</div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <Link 
            href="/posts"
            className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
            >
                ← Voltar para a listagem
            </Link>
            <Link href="/posts/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Criar Post
            </Link>
        </div>
        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <header className="mb-8">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Artigo
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-400">
                <p>Por {post.author.name}</p>
            </div>
            <div className="flex items-center text-sm text-gray-400">
                <p>Criado em {new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </header>

          <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-8">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
}