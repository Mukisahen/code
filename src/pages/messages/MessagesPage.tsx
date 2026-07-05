import { useState, type FormEvent } from 'react'
import { ArrowLeft, Send, MessageCircle, Users, MapPin } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/mocks/messages'
import { MOCK_COMMUNITY_FARMERS } from '@/mocks/communityFarmers'
import type { ChatMessage, Conversation } from '@/types/message'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

type Panel = 'chats' | 'community'

export default function MessagesPage() {
  const [panel, setPanel] = useState<Panel>('chats')
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const active = conversations.find((c) => c.id === activeId)
  const threadMessages = messages.filter((m) => m.conversationId === activeId)
  const onlineCount = MOCK_COMMUNITY_FARMERS.filter((f) => f.online).length

  function handleSend(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim() || !activeId) return
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, conversationId: activeId, senderId: 'me', text: draft, sentAt: new Date().toISOString() },
    ])
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, lastMessage: draft, lastMessageAt: new Date().toISOString() } : c)),
    )
    setDraft('')
  }

  function startConversationWith(farmerId: string, name: string, initials: string) {
    const existing = conversations.find((c) => c.id === `farmer-${farmerId}`)
    if (existing) {
      setActiveId(existing.id)
      setPanel('chats')
      return
    }
    const newConversation: Conversation = {
      id: `farmer-${farmerId}`,
      participantName: name,
      participantInitials: initials,
      participantRole: 'farmer',
      lastMessage: 'Say hello to start the conversation.',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveId(newConversation.id)
    setPanel('chats')
  }

  return (
    <DashboardLayout title="Messages" subtitle="Chat with buyers, farmers and processors">
      <div className="flex h-[calc(100dvh-14rem)] min-h-[420px] overflow-hidden rounded-lg border border-outline-variant/60 bg-surface">
        {/* List pane */}
        <div className={cn('flex w-full shrink-0 flex-col border-outline-variant/60 lg:flex lg:w-80 lg:border-r', active && 'hidden lg:flex')}>
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant/60 p-3">
            <div className="flex gap-1 rounded-full bg-surface-variant p-1">
              {(['chats', 'community'] as Panel[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPanel(p)}
                  aria-pressed={panel === p}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
                    panel === p ? 'bg-surface text-on-surface shadow-elevation-1' : 'text-on-surface-variant',
                  )}
                >
                  {p === 'chats' ? 'Chats' : 'Farmer Community'}
                </button>
              ))}
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {onlineCount} online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {panel === 'chats' ? (
              conversations.length === 0 ? (
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
              )
            ) : (
              <div className="divide-y divide-outline-variant/40">
                <p className="flex items-center gap-1.5 px-4 pt-3 text-xs text-on-surface-variant">
                  <Users className="size-3.5" /> Farmers you can message directly
                </p>
                {MOCK_COMMUNITY_FARMERS.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-4">
                    <div className="relative">
                      <Avatar initials={f.initials} />
                      {f.online && (
                        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-on-surface">{f.name}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                        <MapPin className="size-3" /> {f.district} &middot; {f.focus}
                      </p>
                    </div>
                    <Button size="sm" variant="outlined" onClick={() => startConversationWith(f.id, f.name, f.initials)}>
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                {threadMessages.length === 0 ? (
                  <p className="pt-8 text-center text-sm text-on-surface-variant">
                    Say hello to {active.participantName.split(' ')[0]} to start the conversation.
                  </p>
                ) : (
                  threadMessages.map((m) => (
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
                  ))
                )}
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
