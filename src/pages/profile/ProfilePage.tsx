import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ShieldCheck, MapPin, Phone, Crown, CheckCircle2, Camera, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Avatar } from '@/components/common/Avatar'
import { Badge } from '@/components/common/Badge'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import * as usersService from '@/services/usersService'
import { ROUTES } from '@/constants/routes'
import { UGANDA_MAIZE_DISTRICTS } from '@/mocks/districts'
import { formatDate } from '@/utils/format'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const { pushToast } = useToast()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [district, setDistrict] = useState(user?.district ?? '')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const initials = user.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await usersService.updateProfile({ fullName: fullName.trim(), district })
      updateUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      pushToast({ type: 'system', title: 'Could not save changes', description: 'Please try again in a moment.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploadingAvatar(true)
    try {
      const updated = await usersService.uploadAvatar(file)
      updateUser(updated)
      pushToast({ type: 'system', title: 'Profile photo updated', description: 'Your new photo is now visible to others.' })
    } catch {
      pushToast({ type: 'system', title: 'Could not upload photo', description: 'Please try a different photo.' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <Card className="mb-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <div className="relative shrink-0">
          <Avatar initials={initials} imageUrl={user.avatarUrl} size="lg" />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Change profile photo"
            className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-surface bg-primary text-on-primary shadow-elevation-1 disabled:opacity-60"
          >
            <Camera className="size-3.5" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
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
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} />
          <Input label="Phone number" value={user.phone} disabled helperText="Your phone number can't be changed." />
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

          <Button type="submit" loading={saving} className="sm:w-fit">
            Save changes
          </Button>
        </form>
      </Card>

      <Card className="mt-5 p-0">
        <Link
          to={ROUTES.settings}
          className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-container"
        >
          <Settings className="size-4.5 text-on-surface-variant" />
          <span className="flex-1 text-sm font-semibold text-on-surface">Settings &amp; feedback</span>
          <ChevronRight className="size-4 text-on-surface-variant" />
        </Link>
      </Card>

      <Button variant="outlined" fullWidth leadingIcon={<LogOut className="size-4.5" />} onClick={logout} className="mt-5">
        Log out
      </Button>
    </DashboardLayout>
  )
}
