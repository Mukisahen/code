import { useState } from 'react'
import { Moon, Sun, Globe, Bell, Lock, Trash2, LogOut, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Switch } from '@/components/common/Switch'
import { Button } from '@/components/common/Button'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const LANGUAGES = ['English', 'Luganda', 'Runyankole', 'Ateso']

const NOTIFICATION_PREFS = [
  { key: 'orders', label: 'Order updates', description: 'New orders, offers and status changes' },
  { key: 'prices', label: 'Market price alerts', description: 'Significant price movements near you' },
  { key: 'weather', label: 'Weather alerts', description: 'Rain, drought and storm warnings' },
  { key: 'messages', label: 'Messages', description: 'New chat messages from buyers and sellers' },
] as const

export default function SettingsPage() {
  const { mode, setMode } = useTheme()
  const { logout } = useAuth()
  const [language, setLanguage] = useState('English')
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orders: true,
    prices: true,
    weather: true,
    messages: true,
  })

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

        <Card className="p-0">
          <button className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-container">
            <Lock className="size-4.5 text-on-surface-variant" />
            <span className="flex-1 text-sm font-semibold text-on-surface">Change password</span>
            <ChevronRight className="size-4 text-on-surface-variant" />
          </button>
          <button className="flex w-full items-center gap-3 border-t border-outline-variant/60 px-5 py-4 text-left hover:bg-error-container/40">
            <Trash2 className="size-4.5 text-error" />
            <span className="flex-1 text-sm font-semibold text-error">Delete account</span>
            <ChevronRight className="size-4 text-error" />
          </button>
        </Card>

        <Button variant="outlined" fullWidth leadingIcon={<LogOut className="size-4.5" />} onClick={logout}>
          Log out
        </Button>
      </div>
    </DashboardLayout>
  )
}
