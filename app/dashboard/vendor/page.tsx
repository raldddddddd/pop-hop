'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function VendorDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // 🔥 NEW
  const [announcementsMap, setAnnouncementsMap] = useState<{[key: string]: any[]}>({})

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    fetch(`/api/applications/user/${userId}?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setApplications(res.data)
        setHasMore(res.hasMore)
      })
  }, [page])

  // 🔥 fetch announcements per event
  useEffect(() => {
    applications.forEach(app => {
      fetch(`/api/announcements/${app.event.id}`)
        .then(res => res.json())
        .then(data => {
          setAnnouncementsMap(prev => ({
            ...prev,
            [app.event.id]: data
          }))
        })
    })
  }, [applications])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Vendor Dashboard</h1>

        {applications.length === 0 ? (
          <div className="bg-white p-4 rounded shadow">
            <p>No applications yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-xl shadow border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {app.event.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(app.event.date).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        app.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Description */}
                  {app.event.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {app.event.description}
                    </p>
                  )}

                  <div className="mt-2">
                    <Link 
                      href={`/dashboard/chat/${app.eventId}/${app.event.organizerId}`}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                    >
                      💬 Chat with Organizer
                    </Link>
                  </div>

                  {/* 🔥 ANNOUNCEMENTS */}
                  {announcementsMap[app.event.id]?.length > 0 && (
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <p className="font-semibold text-sm mb-2">
                        Announcements
                      </p>

                      {announcementsMap[app.event.id].map(a => (
                        <div key={a.id} className="text-sm mb-2">
                          <p className="font-medium">{a.title}</p>
                          <p className="text-gray-600">{a.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PAYMENT */}
                  {app.paymentStatus === 'UNPAID' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Paste payment proof URL"
                        onBlur={async (e) => {
                          const url = e.target.value
                          if (!url) return

                          await fetch('/api/payments/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicationId: app.id,
                              paymentProof: url
                            })
                          })

                          alert('Payment submitted')
                          location.reload()
                        }}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  )}

                  {app.paymentStatus === 'PENDING' && (
                    <p className="text-yellow-600 mt-2 text-sm">
                      Payment pending verification
                    </p>
                  )}

                  {app.paymentStatus === 'VERIFIED' && (
                    <p className="text-green-600 mt-2 text-sm">
                      Payment verified
                    </p>
                  )}

                  {app.paymentStatus === 'REJECTED' && (
                    <p className="text-red-600 mt-2 text-sm">
                      Payment rejected
                    </p>
                  )}

                  {/* Booth */}
                  {app.booth && (
                    <p className="mt-2 text-blue-600 text-sm">
                      Booth #{app.booth.number}
                    </p>
                  )}

                  {/* Pending note */}
                  {app.status === 'PENDING' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Waiting for organizer approval
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex gap-2 mt-4 items-center">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1 ? 'bg-gray-200' : 'bg-gray-300'
                }`}
              >
                Prev
              </button>

              <span>Page {page}</span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className={`px-3 py-1 rounded ${
                  !hasMore ? 'bg-gray-200' : 'bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}