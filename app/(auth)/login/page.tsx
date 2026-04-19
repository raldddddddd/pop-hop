'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('userId', data.user.id)

      if (data.user.role === 'ORGANIZER') {
        router.push('/dashboard/organizer')
      } else {
        router.push('/dashboard/vendor')
      }
    } else {
      alert(data)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-bold">Login</h1>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}