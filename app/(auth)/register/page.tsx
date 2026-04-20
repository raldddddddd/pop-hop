'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'VENDOR',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pre-fill role from URL ?role=ORGANIZER
  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'ORGANIZER' || roleParam === 'VENDOR') {
      setForm(f => ({ ...f, role: roleParam }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) return setError('Full name is required.')
    if (!form.email.trim()) return setError('Email is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok) {
        router.push('/login?registered=true')
      } else {
        setError(data?.message || data || 'Registration failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#F5F5F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--ph-green)',
            border: '2px solid var(--ph-black)',
            borderRadius: '999px',
            padding: '5px 16px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.1rem',
          }}>
            POP HOP!
          </span>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>Create your account</p>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex',
          background: '#EBEBEB',
          border: '2px solid #D0D0D0',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '16px',
        }}>
          {(['VENDOR', 'ORGANIZER'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setForm(f => ({ ...f, role: r }))}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '9px',
                border: 'none',
                background: form.role === r ? '#FFFFFF' : 'transparent',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: form.role === r ? 'var(--ph-black)' : '#888',
                cursor: 'pointer',
                boxShadow: form.role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {r === 'VENDOR' ? '🛍️ Vendor' : '🎪 Organizer'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          border: '2px solid #E0E0E0',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {error && (
              <div style={{
                background: '#FFF0F3',
                border: '1.5px solid var(--ph-magenta)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--ph-magenta)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <div>
              <label className="ph-label">Full Name</label>
              <input className="ph-input" name="name" placeholder="Juan dela Cruz" value={form.name} onChange={handleChange} autoComplete="name" />
            </div>
            <div>
              <label className="ph-label">Email</label>
              <input className="ph-input" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} autoComplete="email" />
            </div>
            <div>
              <label className="ph-label">Password</label>
              <input className="ph-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
            </div>
            <div>
              <label className="ph-label">Confirm Password</label>
              <input className="ph-input" type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#ccc' : 'var(--ph-black)',
                color: 'white',
                border: '2px solid var(--ph-black)',
                borderRadius: '999px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating account...' : `Create ${form.role === 'VENDOR' ? 'Vendor' : 'Organizer'} Account`}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#555' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--ph-magenta)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
