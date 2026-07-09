import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { askAssistant } from '@/services/chatbotService'
import { CHATBOT_FAQ } from '@/mocks/chatbotFaq'
import type { AssistantMessage, ChatLang } from '@/types/chatbot'
import { cn } from '@/utils/cn'

const GREETING_ID = 'faq-greeting'
const SUGGESTED_IDS = ['faq-planting-time', 'faq-fertilizer', 'faq-armyworm', 'faq-harvest']

const LANG_LABEL: Record<ChatLang, string> = { en: 'English', lg: 'Luganda' }

function greetingMessage(lang: ChatLang): AssistantMessage {
  const greeting = CHATBOT_FAQ.find((f) => f.id === GREETING_ID)!
  return {
    id: `greet-${lang}`,
    role: 'assistant',
    text: greeting.answer[lang],
    createdAt: new Date().toISOString(),
  }
}

export function AskAiChat() {
  const [lang, setLang] = useState<ChatLang>('en')
  const [messages, setMessages] = useState<AssistantMessage[]>([greetingMessage('en')])
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  function switchLanguage(next: ChatLang) {
    setLang(next)
    if (messages.length === 1 && messages[0].id.startsWith('greet-')) {
      setMessages([greetingMessage(next)])
    }
  }

  async function send(text: string) {
    if (!text.trim() || isThinking) return
    const userMessage: AssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsThinking(true)
    const reply = await askAssistant(text, lang)
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
    <div className="mx-auto flex h-[calc(100dvh-16rem)] min-h-[420px] max-w-xl flex-col overflow-hidden rounded-lg border border-outline-variant/60 bg-surface">
      <div className="flex items-center justify-between border-b border-outline-variant/60 px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-on-surface">
          <Sparkles className="size-4 text-primary" /> Ask AI
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

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
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
            {SUGGESTED_IDS.map((id) => {
              const faq = CHATBOT_FAQ.find((f) => f.id === id)!
              return (
                <button
                  key={id}
                  onClick={() => send(faq.question[lang])}
                  className="rounded-full border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-variant"
                >
                  {faq.question[lang]}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-outline-variant/60 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={lang === 'en' ? 'Ask about planting, pests, disease…' : "Buuza ku kusimba, ebiwuka, obulwadde…"}
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
