import { useState, type FormEvent } from 'react'
import { ShieldCheck, MapPin, Phone, Crown, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Avatar } from '@/components/common/Avatar'
import { Badge } from '@/components/common/Badge'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { UGANDA_MAIZE_DISTRICTS } from '@/mocks/districts'
import { formatDate } from '@/utils/format'

export default function ProfilePage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [district, setDistrict] = useState(user?.district ?? '')
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const initials = user.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleSave(event: FormEvent) {
    event.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <Card className="mb-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <Avatar initials={initials} size="lg" />
        <div className="flex-1">
          <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-on-surface sm:justify-start">
            {user.fullName}
            {user.verified && <ShieldCheck className="size-4.5 text-primary" />}
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-on-surface-variant sm:justify-start">
            <MapPin className="size-3.5" /> {user.district}
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-on-surface-variant sm:justify-start">
            <Phone className="size-3.5" /> {user.phone}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <Badge tone={user.subscriptionTier === 'premium' ? 'secondary' : 'neutral'}>
            <Crown className="size-3.5" /> {user.subscriptionTier === 'premium' ? 'Premium' : 'Free plan'}
          </Badge>
          <p className="text-xs text-on-surface-variant">Member since {formatDate(user.createdAt)}</p>
        </div>
      </Card>

      {user.subscriptionTier === 'free' && (
        <Card className="mb-5 flex flex-col items-center justify-between gap-3 bg-secondary-container/40 sm:flex-row">
          <div>
            <p className="font-semibold text-on-surface">Upgrade to Farm Bhade Premium</p>
            <p className="text-sm text-on-surface-variant">Unlock unlimited listings, priority support and advanced analytics.</p>
          </div>
          <Link to={ROUTES.subscription}>
            <Button size="sm">View plans</Button>
          </Link>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-bold text-on-surface">Personal information</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div>
            <label htmlFor="profile-district" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
              District
            </label>
            <select
              id="profile-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-12 w-full rounded-md border border-outline-variant bg-surface px-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {UGANDA_MAIZE_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {saved && (
            <div className="flex items-center gap-2 rounded-md bg-primary-container px-3.5 py-2.5 text-sm text-on-primary-container">
              <CheckCircle2 className="size-4.5" /> Changes saved successfully.
            </div>
          )}

          <Button type="submit" className="sm:w-fit">
            Save changes
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  )
}
