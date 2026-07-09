import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, Globe, Bell, Lock, Trash2, LogOut, ChevronRight, MessageSquareText, Info, WifiOff, MessageSquare, Mic } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Switch } from '@/components/common/Switch'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Badge } from '@/components/common/Badge'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import * as ticketsService from '@/services/ticketsService'
import type { MyTicket } from '@/types/ticket'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'

const TICKET_STATUS_TONE = { open: 'error', 'in-progress': 'warning', resolved: 'success' } as const

const LANGUAGES = ['English', 'Luganda', 'Runyankole', 'Ateso']

const ROADMAP_ITEMS = [
  { icon: WifiOff, label: 'Offline Mode', description: 'Keep working in the field and sync automatically once you reconnect' },
  { icon: MessageSquare, label: 'USSD & SMS Access', description: 'Check prices and post listings from any basic phone, no internet needed' },
  { icon: Mic, label: 'Voice Assistant', description: 'Ask farming questions out loud in English or Luganda' },
] as const

const NOTIFICATION_PREFS = [
  { key: 'orders', label: 'Order updates', description: 'New orders, offers and status changes' },
  { key: 'prices', label: 'Market price alerts', description: 'Significant price movements near you' },
  { key: 'weather', label: 'Weather alerts', description: 'Rain, drought and storm warnings' },
  { key: 'messages', label: 'Messages', description: 'New chat messages from buyers and sellers' },
] as const

export default function SettingsPage() {
  const { mode, setMode } = useTheme()
  const { logout } = useAuth()
  const { pushToast } = useToast()
  const [language, setLanguage] = useState('English')
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orders: true,
    prices: true,
    weather: true,
    messages: true,
  })

  const [tickets, setTickets] = useState<MyTicket[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ticketsService.listMyTickets().then(setTickets).catch(() => {})
  }, [])

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault()
    if (!subject.trim() || !message.trim()) return

    setSubmitting(true)
    try {
      const ticket = await ticketsService.createTicket({ subject: subject.trim(), message: message.trim(), priority })
      setTickets((prev) => [ticket, ...prev])
      setSubject('')
      setMessage('')
      setPriority('medium')
      pushToast({ type: 'system', title: 'Feedback sent', description: 'Thanks — our team will follow up if needed.' })
    } catch {
      pushToast({ type: 'system', title: 'Could not send feedback', description: 'Please try again in a moment.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Settings" subtitle="Customize your Farm Bhade experience">
      <div className="space-y-5">
        <Card>
          <h2 className="mb-3 font-bold text-on-surface">Appearance</h2>
          <div className="flex gap-2">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold capitalize transition-colors',
                  mode === m ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant text-on-surface-variant',
                )}
              >
                {m === 'light' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
                {m}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-on-surface">
            <Globe className="size-4.5" /> Language
          </h2>
          <select
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-12 w-full rounded-md border border-outline-variant bg-surface px-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-on-surface">
            <Bell className="size-4.5" /> Notifications
          </h2>
          <div className="divide-y divide-outline-variant/60">
            {NOTIFICATION_PREFS.map((pref) => (
              <div key={pref.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{pref.label}</p>
                  <p className="text-xs text-on-surface-variant">{pref.description}</p>
                </div>
                <Switch
                  checked={prefs[pref.key]}
                  onChange={(checked) => setPrefs((prev) => ({ ...prev, [pref.key]: checked }))}
                  label={pref.label}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-bold text-on-surface">Coming soon</h2>
          <div className="divide-y divide-outline-variant/60">
            {ROADMAP_ITEMS.map(({ icon: Icon, label, description }) => (
              <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface">{label}</p>
                  <p className="text-xs text-on-surface-variant">{description}</p>
                </div>
                <Badge tone="warning">Coming soon</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0">
          <button className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-container">
            <Lock className="size-4.5 text-on-surface-variant" />
            <span className="flex-1 text-sm font-semibold text-on-surface">Change password</span>
            <ChevronRight className="size-4 text-on-surface-variant" />
          </button>
          <Link
            to={ROUTES.about}
            className="flex w-full items-center gap-3 border-t border-outline-variant/60 px-5 py-4 text-left hover:bg-surface-container"
          >
            <Info className="size-4.5 text-on-surface-variant" />
            <span className="flex-1 text-sm font-semibold text-on-surface">About Farm Bhade</span>
            <ChevronRight className="size-4 text-on-surface-variant" />
          </Link>
          <button className="flex w-full items-center gap-3 border-t border-outline-variant/60 px-5 py-4 text-left hover:bg-error-container/40">
            <Trash2 className="size-4.5 text-error" />
            <span className="flex-1 text-sm font-semibold text-error">Delete account</span>
            <ChevronRight className="size-4 text-error" />
          </button>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-on-surface">
            <MessageSquareText className="size-4.5" /> Send feedback
          </h2>
          <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-3">
            <Input
              label="Subject"
              placeholder="e.g. Photo upload doesn't work"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div className="w-full text-left">
              <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                What happened, or what would help?
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Tell us what you were doing and what went wrong (or what you'd like to see)…"
                className="w-full resize-none rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="feedback-priority" className="text-sm font-medium text-on-surface-variant">
                Priority
              </label>
              <select
                id="feedback-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="h-10 flex-1 rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low — general suggestion</option>
                <option value="medium">Medium — something's off</option>
                <option value="high">High — blocking me from using the app</option>
              </select>
            </div>
            <Button type="submit" loading={submitting} disabled={!subject.trim() || !message.trim()}>
              Send feedback
            </Button>
          </form>

          {tickets.length > 0 && (
            <div className="mt-5 space-y-2 border-t border-outline-variant/60 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Your feedback</p>
              {tickets.map((t) => (
                <div key={t.id} className="flex items-start justify-between gap-3 rounded-md bg-surface-container-low px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{t.subject}</p>
                    <p className="text-xs text-on-surface-variant">{formatRelativeTime(t.createdAt)}</p>
                  </div>
                  <Badge tone={TICKET_STATUS_TONE[t.status]}>{t.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Button variant="outlined" fullWidth leadingIcon={<LogOut className="size-4.5" />} onClick={logout}>
          Log out
        </Button>
      </div>
    </DashboardLayout>
  )
}
