'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    durationDays: 1,
    boothLimit: 0,
    price: 0,
    address: '',
    imageUrl: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim()) return alert('Title is required')
    if (!form.date) return alert('Please select a date')
    if (!form.boothLimit || Number(form.boothLimit) <= 0) return alert('Booth limit must be greater than 0')
    if (Number(form.price) < 0) return alert('Price cannot be negative')

    const organizerId = localStorage.getItem('userId')
    if (!organizerId) return alert('You must be logged in')

    const res = await fetch('/api/events/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        boothLimit: Number(form.boothLimit),
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        organizerId
      })
    })

    if (res.ok) {
      alert('Event created!')
      router.push('/dashboard/organizer')
    } else {
      const error = await res.text()
      alert(error)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create Event</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

          {/* Event Image preview */}
          {form.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={form.imageUrl}
                alt="Event banner"
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Pop Hop Flea Market Vol. 3"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Describe your event for vendors..."
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promo Image / Ad URL</label>
            <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange}
              placeholder="https://... (paste a link to your poster or banner)"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              placeholder="e.g. SM City Clark, Angeles City, Pampanga"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <p className="text-xs text-gray-400 mt-1">Paste the place name exactly as it appears on Google Maps</p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input type="number" name="durationDays" value={form.durationDays} onChange={handleChange}
                min={1} placeholder="1"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          {/* Booth Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booth Limit <span className="text-red-500">*</span></label>
              <input type="number" name="boothLimit" value={form.boothLimit || ''} onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booth Fee (₱)</label>
              <input type="number" name="price" value={form.price || ''} onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Create Event
          </button>
        </form>
      </div>
    </div>
  )
}