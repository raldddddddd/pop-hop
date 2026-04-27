'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Booth = {
  id: string
  number: number
  vendorId: string | null
  vendor: { id: string; name: string } | null
}

type Application = {
  id: string
  status: string
  userId: string
  user: { id: string; name: string; vendorProfile?: { productType?: string } | null }
  booth: { id: string; number: number } | null
}

export default function BoothGridPage() {
  const { eventId } = useParams()
  const router = useRouter()
  const [booths, setBooths] = useState<Booth[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selected, setSelected] = useState<Booth | null>(null)
  const [assigning, setAssigning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [eventTitle, setEventTitle] = useState('')

  const fetchData = async () => {
    const [boothsRes, appsRes] = await Promise.all([
      fetch(`/api/booths/${eventId}`).then(r => r.json()),
      fetch(`/api/applications/event/${eventId}?page=1`).then(r => r.json()),
    ])
    setBooths(boothsRes.sort((a: Booth, b: Booth) => a.number - b.number))
    setApplications(appsRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // Also fetch event name for context
    fetch('/api/events/organizer')
      .then(r => r.json())
      .then((events: any[]) => {
        const ev = events.find((e: any) => e.id === eventId)
        if (ev) setEventTitle(ev.title)
      })
  }, [eventId])

  const approvedVendors = applications.filter(a => a.status === 'APPROVED' && !a.booth)
  const pendingApps = applications.filter(a => a.status === 'PENDING')
  const waitlistedApps = applications.filter(a => a.status === 'WAITLISTED')

  const assign = async (boothId: string, vendorId: string) => {
    setAssigning(true)
    const res = await fetch('/api/booths/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boothId, vendorId }),
    })
    setAssigning(false)
    if (res.ok) {
      setSelected(null)
      await fetchData()
    } else {
      alert('Failed to assign booth')
    }
  }

  const getBoothState = (booth: Booth): 'empty' | 'assigned' | 'pending' => {
    if (booth.vendorId) return 'assigned'
    // Has any pending application without a booth?
    if (pendingApps.length > 0) return 'pending'
    return 'empty'
  }

  const boothColors = {
    empty:    { bg: '#3DDA55', border: '#0D0D0D', label: '#0D0D0D', shadow: '3px 3px 0 #0D0D0D' },
    assigned: { bg: '#E8186D', border: '#0D0D0D', label: 'white',   shadow: '3px 3px 0 #0D0D0D' },
    pending:  { bg: '#FFE034', border: '#0D0D0D', label: '#0D0D0D', shadow: '3px 3px 0 #0D0D0D' },
  }

  const stats = {
    total:    booths.length,
    assigned: booths.filter(b => b.vendorId).length,
    empty:    booths.filter(b => !b.vendorId).length,
  }

  return (
    <div style={{ background: 'var(--ph-yellow)', minHeight: '100dvh', paddingBottom: '60px' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '20px 16px',
        borderBottom: '2.5px solid var(--ph-black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ color: 'var(--ph-yellow)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            Booth Grid
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'white', margin: 0 }}>
            {eventTitle || 'Event Booths'}
          </h1>
        </div>
        <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
          ← Back
        </button>
      </div>

      {/* ── LEGEND + STATS ── */}
      <div style={{ padding: '16px 16px 0', maxWidth: '600px', margin: '0 auto' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Total Booths', value: stats.total, color: 'var(--ph-black)' },
            { label: 'Assigned', value: stats.assigned, color: 'var(--ph-magenta)' },
            { label: 'Available', value: stats.empty, color: 'var(--ph-green)' },
          ].map(s => (
            <div key={s.label} className="ph-card" style={{ padding: '12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legend:</span>
          {[
            { color: '#3DDA55', label: 'Empty' },
            { color: '#E8186D', label: 'Assigned' },
            { color: '#FFE034', label: 'Pending' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '4px',
                background: l.color, border: '2px solid #0D0D0D',
                boxShadow: '2px 2px 0 #0D0D0D',
              }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOOTH GRID ── */}
      <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', fontSize: '2rem' }}>🏪</div>
        ) : booths.length === 0 ? (
          <div className="ph-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏗️</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>No booths created yet</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Booths are auto-created based on your event's booth limit.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '12px',
          }}>
            {booths.map(booth => {
              const state = booth.vendorId ? 'assigned' : 'empty'
              const colors = boothColors[state]
              return (
                <button
                  key={booth.id}
                  onClick={() => setSelected(booth)}
                  style={{
                    background: colors.bg,
                    border: `2.5px solid ${colors.border}`,
                    borderRadius: '12px',
                    boxShadow: colors.shadow,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    minHeight: '80px',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-2px, -2px)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '5px 5px 0 #0D0D0D'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0, 0)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = colors.shadow
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {booth.vendorId ? '🏪' : '📦'}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: colors.label,
                  }}>
                    #{booth.number}
                  </span>
                  {booth.vendor && (
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: colors.label,
                      opacity: 0.8,
                      maxWidth: '68px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}>
                      {booth.vendor.name.split(' ')[0]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── WAITLIST SECTION ── */}
      {waitlistedApps.length > 0 && (
        <div style={{ padding: '20px 16px 0', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', marginBottom: '10px' }}>
            ⏳ Waitlist ({waitlistedApps.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {waitlistedApps.map((app, i) => (
              <div key={app.id} className="ph-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '0.7rem', background: 'var(--ph-yellow)',
                  border: '2px solid var(--ph-black)', borderRadius: '999px',
                  padding: '2px 8px',
                }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>{app.user.name}</p>
                  {app.user.vendorProfile?.productType && (
                    <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>{app.user.vendorProfile.productType}</p>
                  )}
                </div>
                <span className="ph-badge ph-badge-yellow">WAITLIST</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOOTH DETAIL MODAL ── */}
      {selected && (
        <>
          <div
            onClick={() => { setSelected(null) }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
              animation: 'ph-fade-in 0.2s ease',
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            background: 'var(--ph-white)',
            borderRadius: '20px 20px 0 0',
            border: '2.5px solid var(--ph-black)',
            borderBottom: 'none',
            maxHeight: '75dvh',
            overflowY: 'auto',
            zIndex: 50,
            animation: 'ph-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', background: '#D0D0D0', borderRadius: '999px' }} />
            </div>

            <div style={{ padding: '16px 20px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 4px' }}>
                    {selected.vendorId ? 'Assigned Booth' : 'Empty Booth'}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>
                    Booth #{selected.number}
                  </h2>
                </div>
                <div style={{
                  width: '52px', height: '52px',
                  background: selected.vendorId ? 'var(--ph-magenta)' : 'var(--ph-green)',
                  border: '2.5px solid var(--ph-black)',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0 var(--ph-black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                }}>
                  {selected.vendorId ? '🏪' : '📦'}
                </div>
              </div>

              {selected.vendorId ? (
                /* Already assigned */
                <div style={{
                  background: 'rgba(232,24,109,0.08)',
                  border: '2px solid var(--ph-magenta)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 6px' }}>Assigned To</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
                    {selected.vendor?.name}
                  </p>
                </div>
              ) : (
                /* Assign vendor */
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>
                    Assign an approved vendor to this booth:
                  </p>

                  {approvedVendors.length === 0 ? (
                    <div style={{
                      background: 'rgba(0,0,0,0.04)',
                      border: '2px dashed rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚫</p>
                      <p style={{ fontWeight: 700, margin: 0 }}>No approved vendors available</p>
                      <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '4px 0 0' }}>
                        Approve applications first to assign them a booth.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {approvedVendors.map(app => (
                        <button
                          key={app.id}
                          disabled={assigning}
                          onClick={() => assign(selected.id, app.userId)}
                          style={{
                            background: 'var(--ph-white)',
                            border: '2.5px solid var(--ph-black)',
                            borderRadius: '12px',
                            boxShadow: '3px 3px 0 var(--ph-black)',
                            padding: '14px 16px',
                            textAlign: 'left',
                            cursor: assigning ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.1s, box-shadow 0.1s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            opacity: assigning ? 0.6 : 1,
                          }}
                          onMouseEnter={e => {
                            if (!assigning) {
                              (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-2px, -2px)'
                              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '5px 5px 0 var(--ph-black)'
                            }
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0,0)'
                            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 var(--ph-black)'
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.95rem', margin: 0 }}>
                              {app.user.name}
                            </p>
                            {app.user.vendorProfile?.productType && (
                              <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '2px 0 0' }}>
                                {app.user.vendorProfile.productType}
                              </p>
                            )}
                          </div>
                          <span style={{
                            background: 'var(--ph-green)',
                            border: '2px solid var(--ph-black)',
                            borderRadius: '999px',
                            padding: '4px 12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}>
                            {assigning ? '...' : 'Assign →'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
        @keyframes ph-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}