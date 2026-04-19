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

    fetch(`/api/applications/${eventId}`)
      .then(res => res.json())
      .then(data =>
        setApplications(data.filter((a: any) => a.status === 'APPROVED'))
      )
  }, [eventId])

  const assign = async (boothId: string, vendorId: string) => {
    const res = await fetch('/api/booths/assign', {
      method: 'POST',
      body: JSON.stringify({ boothId, vendorId }),
    })

    if (res.ok) {
      alert('Booth assigned')
      location.reload()
    }
  }

  return (
    <div className="p-6">
      <h1>Booth Assignment</h1>

      {booths.map(booth => (
        <div key={booth.id} className="border p-3 my-2">
          <p>Booth #{booth.number}</p>

          {booth.isTaken ? (
            <p>Assigned to: {booth.vendor?.name}</p>
          ) : (
            <select
              onChange={(e) => assign(booth.id, e.target.value)}
              defaultValue=""
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
  )
}