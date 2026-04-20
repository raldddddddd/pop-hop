'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    const userId = localStorage.getItem('userId')
    if (!userId) return

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
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId) return

    const res = await fetch('/api/vendor-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...form })
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('Failed to save profile')
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Vendor Profile</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">Paste a direct link to your photo or logo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Your Business</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell organizers about your business..."
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
            <input
              type="text"
              name="productType"
              value={form.productType}
              onChange={handleChange}
              placeholder="e.g. Thrift Clothes, Handmade Jewelry, Food"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Angeles City, Pampanga"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
            <textarea
              name="socialLinks"
              value={form.socialLinks}
              onChange={handleChange}
              rows={2}
              placeholder="Instagram: https://instagram.com/myshop&#10;Facebook: https://facebook.com/myshop"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Save Profile
          </button>

          {saved && (
            <p className="text-center text-green-600 font-medium">✅ Profile saved successfully!</p>
          )}
        </form>
      </div>
    </div>
  )
}
