'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientUser } from '@/lib/auth'

export default function VendorProfilePage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    description: '',
    productType: '',
    address: '',
    socialLinks: '',
    imageUrl: ''
  })

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) { router.push('/login'); return }
      const userId = user.userId

      fetch(`/api/vendor-profile?userId=${userId}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setForm({
            description: res.data.description || '',
            productType: res.data.productType || '',
            address: res.data.address || '',
            socialLinks: res.data.socialLinks || '',
            imageUrl: res.data.imageUrl || ''
          })
        }
      })
    })
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await getClientUser()
    if (!user) return

    const res = await fetch('/api/vendor-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, ...form })
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('Failed to save profile')
    }
  }

  return (
    <div style={{ background: 'var(--ph-yellow)', minHeight: '100dvh', paddingBottom: '40px' }}>
      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ph-white)', margin: 0 }}>
          My Vendor Profile
        </h1>
        <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
          &larr; Back
        </button>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="ph-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Image preview */}
          {form.imageUrl && (
            <div className="flex justify-center">
              <img
                src={form.imageUrl}
                alt="Vendor"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          <div>
            <label className="ph-label">Profile Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="ph-input"
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Paste a direct link to your photo or logo</p>
          </div>

          <div>
            <label className="ph-label">About Your Business</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell organizers about your business..."
              className="ph-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="ph-label">Product Type</label>
            <input
              type="text"
              name="productType"
              value={form.productType}
              onChange={handleChange}
              placeholder="e.g. Thrift Clothes, Handmade Jewelry, Food"
              className="ph-input"
            />
          </div>

          <div>
            <label className="ph-label">Business Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Angeles City, Pampanga"
              className="ph-input"
            />
          </div>

          <div>
            <label className="ph-label">Social Media Links</label>
            <textarea
              name="socialLinks"
              value={form.socialLinks}
              onChange={handleChange}
              rows={2}
              placeholder="Instagram: https://instagram.com/myshop&#10;Facebook: https://facebook.com/myshop"
              className="ph-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="ph-btn ph-btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '12px' }}
          >
            Save Profile
          </button>

          {saved && (
            <p style={{ textAlign: 'center', color: 'var(--ph-green)', fontWeight: 700, marginTop: '8px' }}>✅ Profile saved successfully!</p>
          )}
        </form>
      </div>
    </div>
  )
}
