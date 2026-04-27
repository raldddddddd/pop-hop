/**
 * Client-side auth utility – uses /api/auth/me (httpOnly cookie is sent automatically)
 * This file must NOT import anything from next/headers.
 */

export async function getClientUser(): Promise<{ userId: string; role: string; name: string } | null> {
  if (typeof window === 'undefined') return null
  try {
    const res = await fetch('/api/auth/me')
    if (!res.ok) return null
    const data = await res.json()
    return data.user as { userId: string; role: string; name: string }
  } catch {
    return null
  }
}