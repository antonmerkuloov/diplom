'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function TestLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const supabase = createClient()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setResult(`Ошибка: ${error.message}`)
    else setResult(`Успех! Сессия: ${!!data.session}, user: ${data.user?.email}`)
  }

  return (
    <div className="p-8 space-y-2">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-[var(--text-primary)] p-2">Login</button>
      <pre>{result}</pre>
    </div>
  )
}