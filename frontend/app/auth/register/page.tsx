'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; // Usando sua instância centralizada
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
      message: '',
      type: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ message: '', type: null });

    try {
        await api.post('/auth/register', {
            name: form.name,
            email: form.email,
            password: form.password,
        });

        
        
        setTimeout(() => {
            router.push('/auth/login');
        }, 1500);

    } catch (err: any) {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
        setFeedback({ message: errorMessage, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {feedback.message && (
            <div className={`p-3 rounded-lg text-sm text-center ${
              feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {feedback.message}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                required
                className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                required
                className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Registrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta? <Link href="/login" className="font-medium text-indigo-600">Faça login</Link>
        </p>
      </div>
    </main>
  );
}