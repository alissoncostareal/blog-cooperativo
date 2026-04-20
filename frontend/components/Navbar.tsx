'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificamos se o token existe ao carregar a página
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    router.push('/'); // Volta para o feed após sair
    // Se precisar forçar o refresh do estado do menu, o router.push já resolve
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <Link href="/posts" className="text-xl font-bold text-gray-800">
        Meu Blog
      </Link>

      <div className="flex gap-4">
        {isLogged ? (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Meus Posts
            </Link>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}