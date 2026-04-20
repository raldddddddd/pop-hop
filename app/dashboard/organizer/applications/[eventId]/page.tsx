'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ApplicationsPage() {
  const { eventId } = useParams()
  const [applications, setApplications] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

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
      body: JSON.stringify({
        applicationId: id,
        status
      })
    })

    alert(`Payment ${status}`)
    location.reload()
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Applications</h1>

        <div className="grid gap-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div>
                <p className="font-medium">{app.user.name}</p>
                <p className="text-sm text-gray-500">{app.user.email}</p>

                {/* Application status */}
                <p className="text-sm mt-1">
                  Status:{' '}
                  <span
                    className={
                      app.status === 'APPROVED'
                        ? 'text-green-600'
                        : app.status === 'REJECTED'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }
                  >
                    {app.status}
                  </span>
                </p>

                {/* 🔥 PAYMENT SECTION */}
                {app.paymentProof && (
                  <div className="mt-2">
                    <a
                      href={app.paymentProof}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Payment Proof
                    </a>

                    {/* Pending payment */}
                    {app.paymentStatus === 'PENDING' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => verifyPayment(app.id, 'VERIFIED')}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Verify
                        </button>

                        <button
                          onClick={() => verifyPayment(app.id, 'REJECTED')}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Status display */}
                    {app.paymentStatus === 'VERIFIED' && (
                      <p className="text-green-600 mt-1">
                        Payment verified
                      </p>
                    )}

                    {app.paymentStatus === 'REJECTED' && (
                      <p className="text-red-600 mt-1">
                        Payment rejected
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex gap-2">
                {app.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, 'APPROVED')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(app.id, 'REJECTED')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
                <Link
                  href={`/dashboard/chat/${eventId}/${app.userId}`}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 flex items-center justify-center rounded"
                >
                  💬 Chat
                </Link>
              </div>
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
      </div>
    </div>
  )
}