'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'VENDOR',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-bold">Register</h1>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <select name="role" onChange={handleChange}>
          <option value="VENDOR">Vendor</option>
          <option value="ORGANIZER">Organizer</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}