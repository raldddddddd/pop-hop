'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function AlienBug({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="18" x2="16" y2="8" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="15" cy="7" r="3" fill="#FF6B2C" stroke="#0D0D0D" strokeWidth="2"/>
      <line x1="42" y1="18" x2="48" y2="8" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="49" cy="7" r="3" fill="#FF6B2C" stroke="#0D0D0D" strokeWidth="2"/>
      <ellipse cx="32" cy="38" rx="20" ry="18" fill="#FF6B2C" stroke="#0D0D0D" strokeWidth="3"/>
      <ellipse cx="23" cy="33" rx="6" ry="8" fill="white" stroke="#0D0D0D" strokeWidth="2.5"/>
      <ellipse cx="41" cy="33" rx="6" ry="8" fill="white" stroke="#0D0D0D" strokeWidth="2.5"/>
      <circle cx="23" cy="34" r="3" fill="#0D0D0D"/>
      <circle cx="41" cy="34" r="3" fill="#0D0D0D"/>
      <circle cx="25" cy="31" r="1.5" fill="white"/>
      <circle cx="43" cy="31" r="1.5" fill="white"/>
      <line x1="14" y1="44" x2="6" y2="52" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
      <line x1="14" y1="50" x2="6" y2="58" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="44" x2="58" y2="52" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="50" x2="58" y2="58" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function readAuth() {
  return {
    role: localStorage.getItem('role'),
    name: localStorage.getItem('name'),
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const [auth, setAuth] = useState<{ role: string | null; name: string | null }>({ role: null, name: null })
  const [mounted, setMounted] = useState(false)

  const syncAuth = () => setAuth(readAuth())

  useEffect(() => {
    setMounted(true)
    syncAuth()

    // Re-sync on tab-level storage changes (different tabs)
    window.addEventListener('storage', syncAuth)
    // Re-sync on same-tab auth changes (login/logout dispatch this)
    window.addEventListener('ph-auth-change', syncAuth)
    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('ph-auth-change', syncAuth)
    }
  }, [])

  // Also re-sync when route changes (catches same-tab navigation after login)
  useEffect(() => {
    if (mounted) syncAuth()
  }, [pathname])

  if (!mounted) return null

  // Hide navbar on auth pages
  if (pathname === '/login' || pathname === '/register') return null

  const handleLogout = () => {
    localStorage.clear()
    setAuth({ role: null, name: null })
    window.dispatchEvent(new Event('ph-auth-change'))
    window.location.href = '/'
  }

  const { role } = auth

  return (
    <nav style={{
      background: '#FFFFFF',
      borderBottom: '2px solid #EBEBEB',
      padding: '0 16px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* LOGO */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--ph-green)',
          border: '2px solid var(--ph-black)',
          borderRadius: '999px',
          padding: '3px 12px 3px 6px',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '0.95rem',
          color: 'var(--ph-black)',
        }}>
          <AlienBug size={20} />
          POP HOP!
        </span>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {role === 'ORGANIZER' && (
          <>
            <Link href="/dashboard/organizer" style={navLink(pathname === '/dashboard/organizer')}>Dashboard</Link>
            <Link href="/dashboard/organizer/create-event" style={navLink(false)}>+ Event</Link>
            <Link href="/dashboard/chat" style={navLink(pathname.startsWith('/dashboard/chat'))}>💬 Chat</Link>
          </>
        )}
        {role === 'VENDOR' && (
          <>
            <Link href="/dashboard/vendor" style={navLink(pathname === '/dashboard/vendor')}>Dashboard</Link>
            <Link href="/dashboard/vendor/events" style={navLink(pathname === '/dashboard/vendor/events')}>Events</Link>
            <Link href="/dashboard/chat" style={navLink(pathname.startsWith('/dashboard/chat'))}>💬 Chat</Link>
          </>
        )}

        {role ? (
          <button onClick={handleLogout} style={{
            background: 'var(--ph-magenta)',
            color: 'white',
            border: '2px solid var(--ph-black)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginLeft: '4px',
          }}>
            Logout
          </button>
        ) : (
          <Link href="/login" style={{
            background: 'var(--ph-green)',
            color: 'var(--ph-black)',
            border: '2px solid var(--ph-black)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontWeight: 700,
            fontSize: '0.8rem',
            textDecoration: 'none',
            marginLeft: '4px',
          }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

const navLink = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--ph-magenta)' : '#444',
  fontWeight: active ? 700 : 600,
  fontSize: '0.85rem',
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '8px',
  background: active ? 'rgba(232,24,109,0.08)' : 'transparent',
  transition: 'background 0.15s, color 0.15s',
})