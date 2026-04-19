'use client'

import { useState } from 'react'

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    boothLimit: 0,
    price: 0,
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const organizerId = localStorage.getItem('userId')

    const res = await fetch('/api/events/create', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        boothLimit: Number(form.boothLimit), // 👈 FIX
        price: Number(form.price),           // 👈 FIX
        organizerId,
      }),
    })

    if (res.ok) {
      alert('Event created!')
    } else {
      alert('Error creating event')
    }
  }

  return (
    <div className="p-6">
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="date" type="date" onChange={handleChange} />
        <input name="boothLimit" type="number" onChange={handleChange} />
        <input name="price" type="number" onChange={handleChange} />

        <button type="submit">Create</button>
      </form>
    </div>
  )
}