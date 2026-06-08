'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-card)]k dark:bg-white">
      <div className="bg-[var(--bg-card)]-900 dark:bg-[var(--bg-card)]-100 p-8 rounded-lg shadow-lg w-full max-w-md border border-[var(--border)]-700 dark:border-[var(--border)]-300">
        <h1 className="text-2xl font-bold text-gold dark:text-black text-center mb-6">Вход в систему</h1>
        {error && <div className="mb-4 p-2 bg-red-900/50 dark:bg-red-200 border border-red-700 dark:border-red-400 rounded text-red-300 dark:text-red-800 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="mt-4 text-center text-[var(--text-secondary)] dark:text-gray-600">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-gold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}