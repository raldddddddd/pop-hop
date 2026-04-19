'use client'

import { useEffect, useState } from 'react'

export default function VendorEventsPage() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const handleApply = async (eventId: string) => {
    const userId = localStorage.getItem('userId')

    const res = await fetch('/api/applications/create', {
      method: 'POST',
      body: JSON.stringify({ userId, eventId }),
    })

    if (res.ok) {
      alert('Applied successfully!')
    } else {
      alert('Application failed')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Available Events</h1>

      {events.map(event => (
        <div key={event.id} className="border p-4 my-2">
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Price: {event.price}</p>

          <button onClick={() => handleApply(event.id)}>
            Apply
          </button>
        </div>
      ))}
    </div>
  )
}