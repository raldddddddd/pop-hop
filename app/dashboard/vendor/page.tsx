'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromStorage } from '@/lib/auth'

export default function VendorDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserFromStorage()

    if (!user || user.role !== 'VENDOR') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
    </div>
  )
}