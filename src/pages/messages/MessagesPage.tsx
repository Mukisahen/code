import { useState, type FormEvent } from 'react'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/mocks/messages'
import type { ChatMessage } from '@/types/message'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function MessagesPage() {
  const [conversations] = useState(MOCK_CONVERSATIONS)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const active = conversations.find((c) => c.id === activeId)
  const threadMessages = messages.filter((m) => m.conversationId === activeId)

  function handleSend(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim() || !activeId) return
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, conversationId: activeId, senderId: 'me', text: draft, sentAt: new Date().toISOString() },
    ])
    setDraft('')
  }

  return (
    <DashboardLayout title="Messages" subtitle="Chat with buyers, farmers and processors">
      <div className="flex h-[calc(100dvh-14rem)] min-h-[420px] overflow-hidden rounded-lg border border-outline-variant/60 bg-surface">
        {/* Conversation list */}
        <div className={cn('w-full shrink-0 overflow-y-auto border-outline-variant/60 lg:block lg:w-80 lg:border-r', active && 'hidden')}>
          {conversations.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No conversations yet" />
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-outline-variant/40 p-4 text-left transition-colors hover:bg-surface-container',
                  activeId === c.id && 'bg-surface-container',
                )}
              >
                <Avatar initials={c.participantInitials} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-on-surface">{c.participantName}</p>
                    <span className="shrink-0 text-xs text-on-surface-variant">
                      {formatRelativeTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-on-surface-variant">{c.lastMessage}</p>
                  {c.productContext && (
                    <p className="mt-0.5 truncate text-xs text-primary">{c.productContext}</p>
                  )}
                </div>
                {c.unreadCount > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Thread */}
        <div className={cn('flex flex-1 flex-col', !active && 'hidden lg:flex')}>
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-outline-variant/60 p-4">
                <button onClick={() => setActiveId(null)} className="lg:hidden" aria-label="Back">
                  <ArrowLeft className="size-5 text-on-surface-variant" />
                </button>
                <Avatar initials={active.participantInitials} size="sm" />
                <div>
                  <p className="font-semibold text-on-surface">{active.participantName}</p>
                  {active.productContext && <p className="text-xs text-on-surface-variant">{active.productContext}</p>}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {threadMessages.map((m) => (
                  <div key={m.id} className={cn('flex', m.senderId === 'me' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-3.5 py-2 text-sm',
                        m.senderId === 'me'
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface',
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-outline-variant/60 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="h-11 flex-1 rounded-full border border-outline-variant bg-surface px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" size="sm" className="!size-11 !p-0 rounded-full" aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={MessageCircle} title="Select a conversation" description="Choose a chat from the list to view messages." />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
