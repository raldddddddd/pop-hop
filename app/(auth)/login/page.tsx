'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email.trim()) return setError('Email is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
    if (!form.password) return setError('Password is required.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        // Notify Navbar to re-sync immediately
        window.dispatchEvent(new Event('ph-auth-change'))

        router.push(data.user.role === 'ORGANIZER' ? '/dashboard/organizer' : '/dashboard/vendor')
      } else {
        setError(data?.message || data || 'Invalid email or password.')
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
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ph-black)', textDecoration: 'none' }}>
          ← Back to home
        </Link>

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
          <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>Sign in to your account</p>
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
              <label className="ph-label">Email</label>
              <input
                className="ph-input"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="ph-label">Password</label>
              <input
                className="ph-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
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
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Link to Register */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#555' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--ph-magenta)', fontWeight: 700, textDecoration: 'none' }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  )
}