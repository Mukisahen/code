import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { askAdminAssistant } from '@/services/adminService'
import type { AdminAssistantMessage } from '@/types/adminAssistant'
import { cn } from '@/utils/cn'

const SUGGESTIONS = [
  'How many pending verifications are there?',
  'How many open support tickets?',
  'What is our system status?',
  'How do I suspend a suspicious account?',
]

function greetingMessage(): AdminAssistantMessage {
  return {
    id: 'greet',
    role: 'assistant',
    text: "Hello! I'm your admin assistant. Ask me for a quick stat, or how to handle a task — verifications, suspensions, tickets, reports, flagged listings.",
    createdAt: new Date().toISOString(),
  }
}

export function AdminAskAiChat() {
  const [messages, setMessages] = useState<AdminAssistantMessage[]>([greetingMessage()])
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  async function send(text: string) {
    if (!text.trim() || isThinking) return
    const userMessage: AdminAssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsThinking(true)
    const reply = await askAdminAssistant(text)
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now() + 1}`, role: 'assistant', text: reply, createdAt: new Date().toISOString() },
    ])
    setIsThinking(false)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    send(draft)
  }

  const showSuggestions = messages.length <= 1

  return (
    <div className="mx-auto flex h-[calc(100dvh-16rem)] min-h-[420px] max-w-2xl flex-col overflow-hidden rounded-lg border border-outline-variant/60 bg-surface">
      <div className="flex items-center gap-1.5 border-b border-outline-variant/60 px-4 py-3">
        <Sparkles className="size-4 text-primary" />
        <p className="text-sm font-bold text-on-surface">Admin AI Assistant</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3.5 py-2 text-sm leading-relaxed',
                m.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg bg-surface-container px-3.5 py-2 text-sm text-on-surface-variant">
              <Loader2 className="size-3.5 animate-spin" /> Checking…
            </div>
          </div>
        )}

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => send(question)}
                className="rounded-full border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-variant"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-outline-variant/60 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about users, tickets, verifications, system status…"
          className="h-11 flex-1 rounded-full border border-outline-variant bg-surface px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={isThinking}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
