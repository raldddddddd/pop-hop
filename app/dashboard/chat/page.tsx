'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClientUser } from '@/lib/auth'

export default function ChatInboxPage() {
  const [threads, setThreads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) { setLoading(false); return }
      setUserId(user.userId)

      fetch(`/api/messages?userId=${user.userId}`)
        .then(r => r.json())
        .then(res => {
          setThreads(res.data || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [])

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const roleColor = (role: string) =>
    role === 'ORGANIZER' ? 'var(--ph-magenta)' : 'var(--ph-blue)'

  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EBEBEB', padding: '20px 16px 16px', position: 'sticky', top: '56px', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Messages</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>
          {threads.length} conversation{threads.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '12px 16px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#AAA' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💬</p>
            <p>Loading messages...</p>
          </div>
        ) : threads.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #E0E0E0',
            borderRadius: '16px',
            padding: '40px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💬</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>No messages yet</p>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>
              Conversations with organizers and vendors will appear here.
            </p>
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #E0E0E0',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            {threads.map((thread, i) => (
              <Link
                key={thread.key}
                href={`/dashboard/chat/${thread.eventId}/${thread.otherUser.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: i < threads.length - 1 ? '1px solid #F0F0F0' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Avatar */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: roleColor(thread.otherUser.role),
                  border: '2px solid var(--ph-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: thread.otherUser.role === 'ORGANIZER' ? 'white' : 'var(--ph-black)',
                  flexShrink: 0,
                }}>
                  {initials(thread.otherUser.name)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {thread.otherUser.name}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: '#AAA', flexShrink: 0, marginLeft: '8px' }}>
                      {timeAgo(thread.lastAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Re: {thread.eventTitle}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#AAA', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {thread.lastMessage}
                  </p>
                </div>

                {/* Chevron */}
                <span style={{ color: '#CCC', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
