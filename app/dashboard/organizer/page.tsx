'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientUser } from '@/lib/auth'

export default function OrganizerDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [announcementsMap, setAnnouncementsMap] = useState<{ [key: string]: any[] }>({})
  const [announceTitles, setAnnounceTitles] = useState<{ [key: string]: string }>({})
  const [announceContents, setAnnounceContents] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    getClientUser().then(user => {
      if (!user || user.role !== 'ORGANIZER') { router.push('/login'); return }
      fetch('/api/events/organizer').then(r => r.json()).then(setEvents)
    })
  }, [])

  useEffect(() => {
    events.forEach(event => {
      fetch(`/api/announcements/${event.id}`)
        .then(r => r.json())
        .then(data => setAnnouncementsMap(prev => ({ ...prev, [event.id]: data })))
    })
  }, [events])

  const postAnnouncement = async (eventId: string) => {
    const title = announceTitles[eventId] || ''
    const content = announceContents[eventId] || ''
    if (!title || !content) return
    await fetch('/api/announcements/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, eventId })
    })
    setAnnounceTitles(p => ({ ...p, [eventId]: '' }))
    setAnnounceContents(p => ({ ...p, [eventId]: '' }))
    fetch('/api/events/organizer').then(r => r.json()).then(setEvents)
  }

  const updateEventStatus = async (eventId: string, status: string) => {
    await fetch(`/api/events/${eventId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetch('/api/events/organizer').then(r => r.json()).then(setEvents)
  }

  const totalRevenue = events.reduce((sum, e) => sum + (e.price * (e._count?.applications || 0)), 0)
  const totalBooths = events.reduce((sum, e) => sum + (e.boothLimit || 0), 0)

  return (
    <div style={{ background: 'var(--ph-yellow)', minHeight: '100dvh', paddingBottom: '40px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
      }}>
        <p style={{ color: 'var(--ph-green)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Organizer</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--ph-white)', margin: '0 0 16px' }}>Command Center</h1>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { value: events.length, label: 'Events', color: 'var(--ph-green)' },
            { value: totalBooths, label: 'Total Booths', color: 'var(--ph-blue)' },
            { value: `₱${totalRevenue.toLocaleString()}`, label: 'Est. Revenue', color: 'var(--ph-orange)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '12px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EVENTS LIST ── */}
      <div style={{ padding: '20px 16px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Your Events</h2>
          <Link href="/dashboard/organizer/create-event" className="ph-btn ph-btn-primary" style={{ fontSize: '0.8rem', padding: '7px 16px' }}>
            + New Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="ph-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎪</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>No events yet</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Create your first flea market event!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {events.map(event => (
              <div key={event.id} className="ph-card" style={{ padding: '0', overflow: 'hidden' }}>

                {/* Event banner/image */}
                {event.imageUrl && (
                  <img src={event.imageUrl} alt={event.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '2px solid var(--ph-black)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}

                <div style={{ padding: '16px' }}>
                  {/* Title & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0, lineHeight: 1.2 }}>{event.title}</h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="ph-badge ph-badge-green" style={{ flexShrink: 0 }}>
                        {new Date(event.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                      </span>
                      <select 
                        value={event.status} 
                        onChange={e => updateEventStatus(event.id, e.target.value)}
                        className="ph-input"
                        style={{ padding: '2px 8px', fontSize: '0.7rem', width: 'auto', fontWeight: 700, borderRadius: '999px', background: event.status === 'PUBLISHED' ? 'var(--ph-green)' : event.status === 'CLOSED' ? 'var(--ph-magenta)' : 'var(--ph-yellow)' }}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {event.address && <span style={{ fontSize: '0.78rem', opacity: 0.65 }}>📍 {event.address}</span>}
                    {event.startTime && <span style={{ fontSize: '0.78rem', opacity: 0.65 }}>⏰ {event.startTime}{event.endTime ? `–${event.endTime}` : ''}</span>}
                    <span style={{ fontSize: '0.78rem', opacity: 0.65 }}>🏪 {event.boothLimit} booths · ₱{event.price}/booth</span>
                    {event.durationDays > 1 && <span style={{ fontSize: '0.78rem', opacity: 0.65 }}>📆 {event.durationDays} days</span>}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <Link href={`/dashboard/organizer/applications/${event.id}`} className="ph-btn ph-btn-secondary" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                      Applications
                    </Link>
                    <Link href={`/dashboard/organizer/booths/${event.id}`} className="ph-btn ph-btn-primary" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                      Booths
                    </Link>
                  </div>

                  {/* Announcement form */}
                  <div style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1.5px dashed rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    padding: '12px',
                  }}>
                    <p style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.6 }}>Post Announcement</p>
                    <input
                      className="ph-input"
                      placeholder="Title"
                      value={announceTitles[event.id] || ''}
                      onChange={e => setAnnounceTitles(p => ({ ...p, [event.id]: e.target.value }))}
                      style={{ marginBottom: '6px', fontSize: '0.85rem' }}
                    />
                    <textarea
                      className="ph-input"
                      placeholder="Message to vendors..."
                      value={announceContents[event.id] || ''}
                      onChange={e => setAnnounceContents(p => ({ ...p, [event.id]: e.target.value }))}
                      rows={2}
                      style={{ marginBottom: '8px', fontSize: '0.85rem', resize: 'none' }}
                    />
                    <button onClick={() => postAnnouncement(event.id)} className="ph-btn ph-btn-accent" style={{ fontSize: '0.8rem', padding: '7px 16px' }}>
                      Post 📣
                    </button>
                  </div>

                  {/* Announcement list */}
                  {(announcementsMap[event.id]?.length ?? 0) > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      {announcementsMap[event.id].map(a => (
                        <div key={a.id} style={{
                          borderLeft: '3px solid var(--ph-magenta)',
                          paddingLeft: '10px',
                          marginBottom: '8px',
                        }}>
                          <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 2px' }}>{a.title}</p>
                          <p style={{ fontSize: '0.8rem', opacity: 0.65, margin: 0 }}>{a.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}