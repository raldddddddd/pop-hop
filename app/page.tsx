'use client'

import Link from 'next/link'

function AlienBug({ size = 80 }: { size?: number }) {
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

const MARQUEE_ITEMS = ['POP HOP! ✦', 'ANGELES CITY ✦', 'FLEA MARKET ✦', 'VENDOR PORTAL ✦', 'PAMPANGA ✦', 'BOOK YOUR BOOTH ✦']

export default function HomePage() {
  return (
    <div style={{ background: 'var(--ph-yellow)', minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ── MARQUEE TICKER ── */}
      <div style={{
        background: 'var(--ph-black)',
        borderBottom: '2px solid var(--ph-black)',
        overflow: 'hidden',
        padding: '8px 0',
      }}>
        <div style={{
          display: 'flex',
          gap: '48px',
          animation: 'ph-marquee 18s linear infinite',
          width: 'max-content',
        }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              color: 'var(--ph-yellow)',
              whiteSpace: 'nowrap',
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: '48px 20px 32px', textAlign: 'center', position: 'relative' }}>
        {/* Checkerboard accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0, left: 0, height: '6px',
          backgroundImage: 'repeating-conic-gradient(var(--ph-black) 0% 25%, transparent 0% 50%)',
          backgroundSize: '12px 12px',
        }} />

        {/* Floating mascot */}
        <div className="ph-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <AlienBug size={80} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 10vw, 5rem)',
          lineHeight: 0.95,
          color: 'var(--ph-black)',
          margin: '0 0 16px',
        }}>
          THE FLEA<br />MARKET<br />
          <span style={{ color: 'var(--ph-magenta)' }}>OS.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          fontWeight: 500,
          color: 'var(--ph-black)',
          opacity: 0.7,
          maxWidth: '320px',
          margin: '0 auto 32px',
          lineHeight: 1.5,
        }}>
          The all-in-one platform for flea market organizers and vendors in <strong>Angeles City, Pampanga</strong>.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
          <Link href="/register" className="ph-btn ph-btn-secondary" style={{ fontSize: '1rem', padding: '14px 24px', justifyContent: 'center' }}>
            Get Started — It&apos;s Free
          </Link>
          <Link href="/login" className="ph-btn ph-btn-ghost" style={{ fontSize: '1rem', padding: '14px 24px', justifyContent: 'center' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* ── ROLE SPLIT CARDS ── */}
      <section style={{ padding: '16px 16px 40px' }}>
        <p style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginBottom: '16px',
        }}>Who are you?</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px', margin: '0 auto' }}>

          {/* ORGANIZER CARD */}
          <Link href="/register?role=ORGANIZER" style={{ textDecoration: 'none' }}>
            <div className="ph-card" style={{
              padding: '24px',
              background: 'var(--ph-magenta)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span className="ph-badge ph-badge-yellow" style={{ marginBottom: '10px' }}>Organizer</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'white', margin: '8px 0 6px' }}>
                  I RUN THE<br />MARKET
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>
                  Create events · Manage booths · Verify payments
                </p>
              </div>
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>🎪</div>
            </div>
          </Link>

          {/* VENDOR CARD */}
          <Link href="/register?role=VENDOR" style={{ textDecoration: 'none' }}>
            <div className="ph-card" style={{
              padding: '24px',
              background: 'var(--ph-blue)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span className="ph-badge ph-badge-yellow" style={{ marginBottom: '10px' }}>Vendor</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--ph-black)', margin: '8px 0 6px' }}>
                  I SELL AT<br />THE MARKET
                </h2>
                <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', fontWeight: 500 }}>
                  Apply to events · Get your booth · Build your brand
                </p>
              </div>
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>🛍️</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section style={{
        background: 'var(--ph-black)',
        padding: '32px 16px',
      }}>
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'var(--ph-yellow)',
          letterSpacing: '-0.01em',
          marginBottom: '24px',
        }}>
          Everything in one place
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '480px', margin: '0 auto' }}>
          {[
            { icon: '📋', label: 'Event Applications' },
            { icon: '🏪', label: 'Booth Assignment' },
            { icon: '💸', label: 'Payment Tracking' },
            { icon: '📣', label: 'Announcements' },
            { icon: '💬', label: 'In-App Chat' },
            { icon: '📊', label: 'Organizer Analytics' },
          ].map((f) => (
            <div key={f.label} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ph-white)' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--ph-yellow)',
        borderTop: '2.5px solid var(--ph-black)',
        padding: '20px 16px',
        textAlign: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem' }}>
          POP HOP! © 2025 · Angeles City, Pampanga
        </span>
      </footer>

      <style>{`
        @keyframes ph-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
