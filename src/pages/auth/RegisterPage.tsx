import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Lock, MapPin, Sprout, ShoppingCart, Factory, ShieldCheck } from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { AuthError } from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { dashboardRouteForRole } from '@/utils/roleRoutes'
import { UGANDA_MAIZE_DISTRICTS } from '@/mocks/districts'
import type { UserRole } from '@/types/user'
import { cn } from '@/utils/cn'
import { validateFullName, validatePhone, validatePassword, validateConfirmPassword } from '@/utils/validation'

// Admin is never a self-service registration option — accounts are promoted
// by an existing super admin from the Administrator Dashboard instead.
const ROLE_OPTIONS: { value: Exclude<UserRole, 'admin'>; label: string; icon: typeof Sprout }[] = [
  { value: 'farmer', label: 'Farmer', icon: Sprout },
  { value: 'buyer', label: 'Buyer', icon: ShoppingCart },
  { value: 'processor', label: 'Processor', icon: Factory },
]

interface FieldErrors {
  fullName?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [district, setDistrict] = useState<string>(UGANDA_MAIZE_DISTRICTS[0])
  const [role, setRole] = useState<UserRole>('farmer')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)

    const nextErrors: FieldErrors = {
      fullName: validateFullName(fullName) ?? undefined,
      phone: validatePhone(phone) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirmPassword: validateConfirmPassword(password, confirmPassword) ?? undefined,
    }
    setFieldErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setIsSubmitting(true)
    try {
      const user = await register({ fullName, phone, password, role, district })
      navigate(dashboardRouteForRole(user.role), { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join the Farm Bhade community in minutes">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-on-surface-variant">I am a...</span>
          <div className="grid grid-cols-4 gap-2">
            {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                aria-pressed={role === value}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-xs font-semibold transition-colors',
                  role === value
                    ? 'border-primary bg-primary-container text-on-primary-container'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant',
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Full name"
          placeholder="e.g. Nakato Grace"
          leadingIcon={<User className="size-4.5" />}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            clearFieldError('fullName')
          }}
          error={fieldErrors.fullName}
          autoComplete="name"
          required
        />
        <Input
          label="Phone number"
          type="tel"
          placeholder="+256 7XX XXX XXX"
          leadingIcon={<Phone className="size-4.5" />}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            clearFieldError('phone')
          }}
          error={fieldErrors.phone}
          autoComplete="tel"
          required
        />

        <div>
          <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
            District
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-on-surface-variant" />
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-12 w-full appearance-none rounded-md border border-outline-variant bg-surface pl-11 pr-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {UGANDA_MAIZE_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters, with a number"
          leadingIcon={<Lock className="size-4.5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            clearFieldError('password')
          }}
          error={fieldErrors.password}
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          leadingIcon={<Lock className="size-4.5" />}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            clearFieldError('confirmPassword')
          }}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          required
        />

        {formError && (
          <p role="alert" className="rounded-md bg-error-container px-3.5 py-2.5 text-sm text-on-error-container">
            {formError}
          </p>
        )}

        <p className="flex items-start gap-2 rounded-md bg-surface-variant px-3.5 py-2.5 text-xs text-on-surface-variant">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Your password is encrypted and your phone number is never shown publicly. Only your name, role and
          district appear on listings.
        </p>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
