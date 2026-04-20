'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ApplicationsPage() {
  const { eventId } = useParams()
  const [applications, setApplications] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/applications/event/${eventId}?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setApplications(res.data)
        setHasMore(res.hasMore)
      })
  }, [eventId, page])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      alert(`Application ${status}`)
      location.reload()
    }
  }

  const verifyPayment = async (id: string, status: string) => {
    await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status })
    })
    alert(`Payment ${status}`)
    location.reload()
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Applications</h1>

        <div className="grid gap-4">
          {applications.map(app => {
            const profile = app.user?.vendorProfile
            const isExpanded = expanded === app.id

            return (
              <div key={app.id} className="bg-white p-4 rounded-lg shadow">

                {/* TOP ROW */}
                <div className="flex justify-between items-start gap-4">

                  {/* LEFT: Vendor Info */}
                  <div className="flex gap-3 items-start flex-1">
                    {/* Profile image */}
                    {profile?.imageUrl ? (
                      <img src={profile.imageUrl} alt={app.user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg text-gray-500 font-bold">
                          {app.user.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-800">{app.user.name}</p>
                      <p className="text-sm text-gray-500">{app.user.email}</p>
                      {profile?.productType && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                          {profile.productType}
                        </span>
                      )}

                      {/* Application status */}
                      <p className="text-sm mt-1">
                        Status:{' '}
                        <span className={
                          app.status === 'APPROVED' ? 'text-green-600 font-medium' :
                          app.status === 'REJECTED' ? 'text-red-600 font-medium' :
                          'text-gray-600'
                        }>
                          {app.status}
                        </span>
                      </p>

                      {/* Toggle profile details */}
                      {profile && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : app.id)}
                          className="text-xs text-blue-500 hover:underline mt-1"
                        >
                          {isExpanded ? 'Hide Details ▲' : 'View Vendor Details ▼'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Action buttons */}
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(app.id, 'APPROVED')}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(app.id, 'REJECTED')}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">
                          Reject
                        </button>
                      </div>
                    )}
                    <Link href={`/dashboard/chat/${eventId}/${app.userId}`}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-3 py-1 rounded text-center">
                      💬 Chat
                    </Link>
                  </div>
                </div>

                {/* EXPANDED: Vendor Profile Details */}
                {isExpanded && profile && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.description && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">About</p>
                        <p className="text-sm text-gray-700">{profile.description}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Address</p>
                        <p className="text-sm text-gray-700">📍 {profile.address}</p>
                      </div>
                    )}
                    {profile.socialLinks && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Social Media</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{profile.socialLinks}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* PAYMENT SECTION */}
                {app.paymentProof && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <a href={app.paymentProof} target="_blank"
                      className="text-blue-600 underline text-sm">
                      View Payment Proof
                    </a>

                    {app.paymentStatus === 'PENDING' && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => verifyPayment(app.id, 'VERIFIED')}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm">Verify</button>
                        <button onClick={() => verifyPayment(app.id, 'REJECTED')}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm">Reject</button>
                      </div>
                    )}
                    {app.paymentStatus === 'VERIFIED' && (
                      <p className="text-green-600 mt-1 text-sm">✅ Payment verified</p>
                    )}
                    {app.paymentStatus === 'REJECTED' && (
                      <p className="text-red-600 mt-1 text-sm">❌ Payment rejected</p>
                    )}
                  </div>
                )}

              </div>
            )
          })}
        </div>

        {/* Pagination */}
        <div className="flex gap-2 mt-4 items-center">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}>
            Prev
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={!hasMore}
            className={`px-3 py-1 rounded ${!hasMore ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}