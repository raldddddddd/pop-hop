'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function BoothPage() {
  const { eventId } = useParams()
  const [booths, setBooths] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/booths/${eventId}`)
      .then(res => res.json())
      .then(setBooths)

    fetch(`/api/applications/event/${eventId}`)
      .then(res => res.json())
      .then(data =>
        setApplications(data.filter((a: any) => a.status === 'APPROVED'))
      )
  }, [eventId])

  const assign = async (boothId: string, vendorId: string) => {
    const res = await fetch('/api/booths/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boothId, vendorId }),
    })

    if (res.ok) {
      alert('Booth assigned')
      location.reload()
    } else {
      alert('Failed to assign booth')
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Booth Assignment</h1>

        <div className="grid gap-4">
          {booths.map(booth => (
            <div
              key={booth.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">Booth #{booth.number}</p>

                {booth.vendorId && (
                  <p className="text-sm text-gray-500">
                    Assigned to: {booth.vendor?.name}
                  </p>
                )}
              </div>

              {!booth.vendorId && (
                <select
                  onChange={(e) => assign(booth.id, e.target.value)}
                  defaultValue=""
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>

                  {applications.map(app => (
                    <option key={app.user.id} value={app.user.id}>
                      {app.user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}