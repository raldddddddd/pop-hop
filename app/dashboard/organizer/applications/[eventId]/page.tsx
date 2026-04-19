'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ApplicationsPage() {
  const { eventId } = useParams()
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/applications/${eventId}`)
      .then(res => res.json())
      .then(data => setApplications(data))
  }, [eventId])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/applications/update', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    })

    if (res.ok) {
      alert(`Application ${status}`)
      location.reload()
    }
  }

  return (
    <div className="p-6">
      <h1>Applications</h1>

      {applications.map(app => (
        <div key={app.id} className="border p-4 my-2">
          <p>Name: {app.user.name}</p>
          <p>Email: {app.user.email}</p>
          <p>Status: {app.status}</p>

          <button onClick={() => updateStatus(app.id, 'APPROVED')}>
            Approve
          </button>

          <button onClick={() => updateStatus(app.id, 'REJECTED')}>
            Reject
          </button>
        </div>
      ))}
    </div>
  )
}