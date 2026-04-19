'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromStorage } from '@/lib/auth'

export default function OrganizerDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const user = getUserFromStorage()

    if (!user || user.role !== 'ORGANIZER') {
      router.push('/login')
      return
    }

    // 👇 fetch events after auth check
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

      {/* 👇 show events */}
      {events.map(event => (
        <div key={event.id} className="border p-4 my-2">
          <h2 className="font-semibold">{event.title}</h2>
          <p>{event.description}</p>

          {/* 👇 THIS IS WHAT YOU NEEDED TO ADD */}
          <a
            href={`/dashboard/organizer/applications/${event.id}`}
            className="text-blue-500 underline"
          >
            View Applications
          </a>
        </div>
      ))}
    </div>
  )
}