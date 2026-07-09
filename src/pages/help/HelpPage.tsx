import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Sparkles, Loader2, LifeBuoy, CheckCircle2 } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import * as chatbotService from '@/services/chatbotService'
import * as ticketsService from '@/services/ticketsService'
import type { ChatLang } from '@/types/chatbot'
import { cn } from '@/utils/cn'

interface HelpMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const LANG_LABEL: Record<ChatLang, string> = { en: 'English', lg: 'Luganda' }

const GREETING: Record<ChatLang, string> = {
  en: "Hi! I'm the Farm Bhade Help Assistant. Ask me how to do anything in the app — post a listing, check prices, contact a seller, and more.",
  lg: "Nkulamusizza! Nze Muyambi wa Farm Bhade. Mbuuze buli kimu ku ngeri y'okukozesa app — okuteeka ekiweebwayo, okulaba emiwendo, okutuukirira omuguzi, n'ebirala.",
}

const SUGGESTED: Record<ChatLang, string[]> = {
  en: ['How do I list my maize for sale?', 'How do I contact a buyer?', 'How do I check today\'s prices?', "I can't find the logout button"],
  lg: ['Nteeka ntya ekiweebwayo?', 'Ntuukirira ntya omuguzi?', 'Nkebera ntya emiwendo gya leero?', 'Sirabye button ya kufuluma'],
}

export default function HelpPage() {
  const [lang, setLang] = useState<ChatLang>('en')
  const [messages, setMessages] = useState<HelpMessage[]>([{ id: 'greet', role: 'assistant', text: GREETING.en }])
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  function switchLanguage(next: ChatLang) {
    setLang(next)
    if (messages.length === 1 && messages[0].id === 'greet') {
      setMessages([{ id: 'greet', role: 'assistant', text: GREETING[next] }])
    }
  }

  async function send(text: string) {
    if (!text.trim() || isThinking) return
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'user', text }])
    setDraft('')
    setIsThinking(true)
    const reply = await chatbotService.askAssistant(text, lang, 'app')
    setMessages((prev) => [...prev, { id: `msg-${Date.now() + 1}`, role: 'assistant', text: reply }])
    setIsThinking(false)
  }

  function handleChatSubmit(event: FormEvent) {
    event.preventDefault()
    send(draft)
  }

  async function handleContactSubmit(event: FormEvent) {
    event.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      await ticketsService.createTicket({ subject: subject.trim(), message: message.trim(), priority: 'medium' })
      setSent(true)
      setSubject('')
      setMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  const showSuggestions = messages.length <= 1

  return (
    <DashboardLayout title="Help & Support" subtitle="Get guidance on using Farm Bhade, or reach our team directly">
      <div className="mx-auto flex max-w-xl flex-col overflow-hidden rounded-lg border border-outline-variant/60 bg-surface">
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-4 py-3">
          <p className="flex items-center gap-1.5 text-sm font-bold text-on-surface">
            <Sparkles className="size-4 text-primary" /> App Help Assistant
          </p>
          <div className="flex gap-1 rounded-full bg-surface-variant p-1">
            {(['en', 'lg'] as ChatLang[]).map((l) => (
              <button
                key={l}
                onClick={() => switchLanguage(l)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
                  lang === l ? 'bg-surface text-on-surface shadow-elevation-1' : 'text-on-surface-variant',
                )}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="h-[min(50vh,420px)] space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={cn('flex animate-bubble-in', m.role === 'user' ? 'justify-end' : 'justify-start')}>
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
            <div className="flex animate-bubble-in justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-surface-container px-3.5 py-2 text-sm text-on-surface-variant">
                <Loader2 className="size-3.5 animate-spin" /> {lang === 'en' ? 'Thinking…' : 'Nfumiitiriza…'}
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTED[lang].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-variant"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="flex items-center gap-2 border-t border-outline-variant/60 p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={lang === 'en' ? 'Ask how to do something…' : 'Buuza engeri y’okukola ekintu…'}
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

      <Card className="mx-auto mt-5 max-w-xl">
        <h2 className="flex items-center gap-2 font-bold text-on-surface">
          <LifeBuoy className="size-4.5 text-primary" /> Still need help?
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Send a message to the Farm Bhade admin team and we'll follow up as soon as we can.
        </p>

        {sent ? (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-primary-container px-3.5 py-2.5 text-sm text-on-primary-container">
            <CheckCircle2 className="size-4.5 shrink-0" />
            Thanks — your message has been sent to our team.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="mt-3 flex flex-col gap-3">
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              placeholder="What do you need help with?"
              className="w-full resize-none rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" loading={submitting} disabled={!subject.trim() || !message.trim()}>
              Contact support
            </Button>
          </form>
        )}
      </Card>
    </DashboardLayout>
  )
}
