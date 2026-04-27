'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClientUser } from '@/lib/auth'

export default function VendorDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [announcementsMap, setAnnouncementsMap] = useState<{ [key: string]: any[] }>({})
  const [userName, setUserName] = useState('')
  const [needsProfile, setNeedsProfile] = useState(false)

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) return
      setUserName(user.name || 'Vendor')
      const userId = user.userId
      
      // Check if profile exists
      fetch(`/api/vendor-profile?userId=${userId}`)
        .then(r => r.json())
        .then(res => {
          if (!res.data || !res.data.description) setNeedsProfile(true)
        })

      fetch(`/api/applications/user/${userId}?page=${page}`)
        .then(r => r.json())
        .then(res => {
          setApplications(res.data || [])
          setHasMore(res.hasMore)
        })
    })
  }, [page])

  useEffect(() => {
    applications.forEach(app => {
      fetch(`/api/announcements/${app.event.id}`)
        .then(r => r.json())
        .then(data => setAnnouncementsMap(prev => ({ ...prev, [app.event.id]: data })))
    })
  }, [applications])

  const statusColor: Record<string, string> = {
    APPROVED: 'var(--ph-green)',
    REJECTED: 'var(--ph-magenta)',
    PENDING: 'var(--ph-blue)',
  }

  const paymentStatusBadge: Record<string, string> = {
    UNPAID: 'ph-badge-yellow',
    PENDING: 'ph-badge-blue',
    VERIFIED: 'ph-badge-green',
    REJECTED: 'ph-badge-magenta',
  }

  return (
    <div style={{ background: 'var(--ph-yellow)', minHeight: '100dvh', paddingBottom: '40px' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
      }}>
        <p style={{ color: 'var(--ph-blue)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Vendor</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--ph-white)', margin: 0 }}>
            Hey, {userName.split(' ')[0]}! 👋
          </h1>
          <Link href="/dashboard/vendor/profile" className="ph-btn ph-btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
            👤 Profile
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '6px' }}>
          {applications.length} active application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {needsProfile && (
        <div style={{ background: 'var(--ph-magenta)', color: 'white', padding: '12px 16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
          Missing Profile! <Link href="/dashboard/vendor/profile" style={{ color: 'var(--ph-yellow)', textDecoration: 'underline' }}>Complete your profile to get approved faster ➔</Link>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <Link href="/dashboard/vendor/events" className="ph-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', textDecoration: 'none', marginBottom: '16px',
          background: 'var(--ph-magenta)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'white', margin: 0 }}>Browse Open Events</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Find your next market opportunity</p>
          </div>
          <span style={{ fontSize: '2rem' }}>→</span>
        </Link>

        {/* ── APPLICATIONS ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>My Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div className="ph-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>No applications yet</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '16px' }}>Browse events and apply for a booth!</p>
            <Link href="/dashboard/vendor/events" className="ph-btn ph-btn-primary">Browse Events</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map(app => (
              <div key={app.id} className="ph-card" style={{ padding: '0', overflow: 'hidden' }}>

                {/* Event banner */}
                {app.event.imageUrl && (
                  <img src={app.event.imageUrl} alt={app.event.title}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderBottom: '2px solid var(--ph-black)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}

                <div style={{ padding: '14px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', margin: '0 0 2px' }}>{app.event.title}</h3>
                      <p style={{ fontSize: '0.78rem', opacity: 0.55, margin: 0 }}>
                        {new Date(app.event.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {app.event.address && ` · ${app.event.address}`}
                      </p>
                    </div>
                    {/* Application status pill */}
                    <span style={{
                      flexShrink: 0,
                      background: statusColor[app.status] || '#ccc',
                      border: '2px solid var(--ph-black)',
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: app.status === 'APPROVED' ? 'var(--ph-black)' : 'white',
                    }}>{app.status}</span>
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span className={`ph-badge ${paymentStatusBadge[app.paymentStatus] || 'ph-badge-yellow'}`}>
                      💸 {app.paymentStatus}
                    </span>
                    {app.booth && (
                      <span className="ph-badge ph-badge-lavender">🏪 Booth #{app.booth.number}</span>
                    )}
                  </div>

                  {/* Pending note */}
                  {app.status === 'PENDING' && (
                    <p style={{ fontSize: '0.78rem', opacity: 0.55, marginBottom: '10px' }}>⏳ Waiting for organizer approval</p>
                  )}

                  {/* Payment upload */}
                  {app.paymentStatus === 'UNPAID' && app.status !== 'REJECTED' && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.6 }}>Upload Payment Proof</p>
                      <input
                        type="text"
                        className="ph-input"
                        placeholder="Paste GCash screenshot URL..."
                        style={{ fontSize: '0.82rem' }}
                        onBlur={async (e) => {
                          const url = e.target.value
                          if (!url) return
                          await fetch('/api/payments/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ applicationId: app.id, paymentProof: url })
                          })
                          location.reload()
                        }}
                      />
                    </div>
                  )}

                  {/* Announcements */}
                  {(announcementsMap[app.event.id]?.length ?? 0) > 0 && (
                    <div style={{
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '10px',
                    }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>📣 Announcements</p>
                      {announcementsMap[app.event.id].slice(0, 2).map(a => (
                        <div key={a.id} style={{ marginBottom: '6px', borderLeft: '3px solid var(--ph-magenta)', paddingLeft: '8px' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.82rem', margin: '0 0 1px' }}>{a.title}</p>
                          <p style={{ fontSize: '0.78rem', opacity: 0.65, margin: 0 }}>{a.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat button */}
                  <Link href={`/dashboard/chat/${app.eventId}/${app.event.organizerId}`} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                    💬 Chat with Organizer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(page > 1 || hasMore) && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>← Prev</button>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}