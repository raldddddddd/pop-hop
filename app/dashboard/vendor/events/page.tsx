'use client'

import { useEffect, useState } from 'react'

export default function VendorEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [appliedEvents, setAppliedEvents] = useState<string[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId || userId === 'null') return
    fetch(`/api/applications/user/${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (!res) return
        setAppliedEvents((res.data || []).map((a: any) => a.eventId))
      })
  }, [])

  const handleApply = async (eventId: string) => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    setApplying(eventId)
    const res = await fetch('/api/applications/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, eventId }),
    })
    if (res.ok) {
      setAppliedEvents(prev => [...prev, eventId])
      setSelected((prev: any) => prev ? { ...prev, _applied: true } : null)
    } else {
      alert('Could not apply. You may have already applied.')
    }
    setApplying(null)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100dvh', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EBEBEB', padding: '20px 16px 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Browse Events</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>{events.length} event{events.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Event cards */}
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏪</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>No events yet</p>
            <p style={{ fontSize: '0.85rem' }}>Check back soon!</p>
          </div>
        ) : events.map(event => {
          const isApplied = appliedEvents.includes(event.id)
          return (
            <div
              key={event.id}
              onClick={() => setSelected(event)}
              style={{
                background: '#FFFFFF',
                border: '2px solid #E0E0E0',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{event.title}</h2>
                  {isApplied && (
                    <span style={{
                      background: 'var(--ph-green)', border: '1.5px solid var(--ph-black)',
                      borderRadius: '999px', padding: '2px 10px',
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
                      textTransform: 'uppercase', flexShrink: 0, color: 'var(--ph-black)',
                    }}>Applied ✓</span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888', margin: '4px 0 8px' }}>
                  📅 {new Date(event.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {event.address && ` · 📍 ${event.address}`}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ph-magenta)' }}>₱{event.price}/booth</span>
                  <span style={{ fontSize: '0.78rem', color: '#aaa' }}>Tap to view details →</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── DETAIL BOTTOM SHEET ── */}
      {selected && (
        <>
          {/* Backdrop */}
          <div onClick={() => setSelected(null)} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 40,
            animation: 'ph-fade-in 0.2s ease',
          }} />

          {/* Sheet */}
          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            background: '#FFFFFF',
            borderRadius: '20px 20px 0 0',
            border: '2px solid #D0D0D0',
            borderBottom: 'none',
            maxHeight: '85dvh',
            overflowY: 'auto',
            zIndex: 50,
            animation: 'ph-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', background: '#D0D0D0', borderRadius: '999px' }} />
            </div>

            {selected.imageUrl && (
              <img src={selected.imageUrl} alt={selected.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}

            <div style={{ padding: '20px 20px 32px' }}>
              {/* Close */}
              <button onClick={() => setSelected(null)} style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#F0F0F0', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem',
              }}>✕</button>

              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 12px' }}>{selected.title}</h2>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { icon: '📅', label: 'Date', value: formatDate(selected.date) },
                  { icon: '⏰', label: 'Time', value: selected.startTime ? `${selected.startTime}${selected.endTime ? ` – ${selected.endTime}` : ''}` : 'TBA' },
                  { icon: '📆', label: 'Duration', value: `${selected.durationDays || 1} day${(selected.durationDays || 1) > 1 ? 's' : ''}` },
                  { icon: '🏪', label: 'Booths', value: `${selected.boothLimit} slots` },
                  { icon: '💸', label: 'Booth Fee', value: `₱${selected.price}` },
                  ...(selected.address ? [{ icon: '📍', label: 'Location', value: selected.address }] : []),
                ].map(item => (
                  <div key={item.label} style={{ background: '#F8F8F8', borderRadius: '10px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>{item.icon} {item.label}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>About this event</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#333', margin: 0 }}>{selected.description}</p>
                </div>
              )}

              {/* Google Maps link */}
              {selected.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selected.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    background: '#F0F8FF',
                    border: '1.5px solid #BDDCF5',
                    borderRadius: '10px',
                    color: '#1A73E8',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    marginBottom: '12px',
                  }}
                >
                  🗺️ Open in Google Maps
                </a>
              )}

              {/* Apply button */}
              {appliedEvents.includes(selected.id) ? (
                <div style={{
                  textAlign: 'center', padding: '14px',
                  background: 'rgba(61,218,85,0.1)',
                  border: '2px solid var(--ph-green)',
                  borderRadius: '999px',
                  fontWeight: 700, color: '#1a8c2e',
                }}>
                  ✅ You have applied to this event
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selected.id)}
                  disabled={applying === selected.id}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: applying === selected.id ? '#ccc' : 'var(--ph-black)',
                    color: 'white',
                    border: '2px solid var(--ph-black)',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: applying === selected.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {applying === selected.id ? 'Applying...' : 'Apply for a Booth →'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes ph-slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}