export function getUserFromStorage() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || !role) return null

  return { token, role }
}