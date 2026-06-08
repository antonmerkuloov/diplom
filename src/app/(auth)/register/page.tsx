'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
export const dynamic = 'force-dynamic';
export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    username?: string
    general?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!username.trim()) newErrors.username = 'Имя пользователя обязательно'
    if (!email.trim()) newErrors.email = 'Email обязателен'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Некорректный формат email'
    if (!password) newErrors.password = 'Пароль обязателен'
    else if (password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    // Регистрация в Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }, // передаём имя пользователя в метаданные
    })

    if (signUpError) {
      if (signUpError.message.includes('rate limit') || signUpError.status === 429) {
        setErrors({ general: 'Слишком много попыток. Подождите несколько минут или используйте другой email.' })
      } else {
        setErrors({ general: signUpError.message })
      }
      setLoading(false)
      return
    }

    if (!authData.user) {
      setErrors({ general: 'Не удалось создать пользователя' })
      setLoading(false)
      return
    }

    // Запись в public.users создаст триггер в Supabase (см. ниже).
    // Убедитесь, что вы выполнили SQL-скрипт для создания триггера.

    // Успех – перенаправляем на дашборд
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-card)]k">
      <div className="bg-[var(--bg-card)]-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-[var(--border)]-700">
        <h1 className="text-2xl font-bold text-gold text-center mb-6">Регистрация</h1>

        {errors.general && (
          <div className="mb-4 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)]">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-[var(--bg-card)]-800 border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.username ? 'border-red-500' : 'border-[var(--border)]-600'
              }`}
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-[var(--bg-card)]-800 border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.email ? 'border-red-500' : 'border-[var(--border)]-600'
              }`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-[var(--bg-card)]-800 border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.password ? 'border-red-500' : 'border-[var(--border)]-600'
              }`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-4 text-center text-[var(--text-secondary)]">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-gold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}