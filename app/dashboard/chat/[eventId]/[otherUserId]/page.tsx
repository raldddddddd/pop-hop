'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getClientUser } from '@/lib/auth'

export default function ChatPage() {
  const { eventId, otherUserId } = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getClientUser().then(user => {
      if (user) setCurrentUserId(user.userId)
    })
  }, [])

  const fetchMessages = async () => {
    if (!currentUserId || !eventId || !otherUserId) return
    try {
      const res = await fetch(`/api/messages/${eventId}/${otherUserId}?currentUserId=${currentUserId}`)
      const data = await res.json()
      if (data.data) {
        setMessages(data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    if (!currentUserId) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [currentUserId, eventId, otherUserId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !currentUserId) return

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        senderId: currentUserId,
        receiverId: otherUserId,
        content
      })
    })

    if (res.ok) {
      setContent('')
      fetchMessages() // fetch immediately after sending
    }
  }

  return (
    <div className=" min-h-screen flex flex-col items-center py-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between rounded-t-lg">
          <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
          <button 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            &larr; Back
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</p>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === currentUserId
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 flex gap-2 rounded-b-lg">
          <input
            type="text"
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  )
}
