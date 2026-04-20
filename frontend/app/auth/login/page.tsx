'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ message: '', type: null });

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      
      setFeedback({ message: 'Login realizado com sucesso! Redirecionando...', type: 'success' });
      
      setTimeout(() => {
        router.push('/posts');
      }, 1500);

    } catch (err) {
      setFeedback({ message: 'Erro: Credenciais inválidas ou servidor indisponível.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <form 
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md border border-gray-100"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Login</h1>
        
        {feedback.message && (
          <div className={`mb-4 p-3 rounded border text-sm ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {feedback.message}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email"
            className="mt-1 w-full text-black rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input 
            type="password"
            className="mt-1 w-full text-black rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}