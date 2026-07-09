import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Phone, Lock, Sparkles } from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { AuthError } from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { dashboardRouteForRole } from '@/utils/roleRoutes'
import { MOCK_PASSWORD } from '@/mocks/users'
import { validatePhone } from '@/utils/validation'

const DEMO_FARMER_PHONE = '+256701234567'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)

    const phoneValidationError = validatePhone(phone)
    const passwordValidationError = password ? null : 'Password is required.'
    setPhoneError(phoneValidationError)
    setPasswordError(passwordValidationError)
    if (phoneValidationError || passwordValidationError) return

    setIsSubmitting(true)
    try {
      const user = await login({ phone, password })
      navigate(dashboardRouteForRole(user.role), { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDemoLogin() {
    setFormError(null)
    setIsDemoLoading(true)
    try {
      const user = await login({ phone: DEMO_FARMER_PHONE, password: MOCK_PASSWORD })
      navigate(dashboardRouteForRole(user.role), { replace: true })
    } catch {
      setFormError('Could not start the demo right now. Please try again.')
    } finally {
      setIsDemoLoading(false)
    }
  }

  const autoDemoTriggered = useRef(false)
  useEffect(() => {
    if (searchParams.get('demo') === '1' && !autoDemoTriggered.current) {
      autoDemoTriggered.current = true
      handleDemoLogin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue growing with Farm Bhade">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Phone number"
          type="tel"
          placeholder="+256 7XX XXX XXX"
          leadingIcon={<Phone className="size-4.5" />}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            if (phoneError) setPhoneError(null)
          }}
          error={phoneError ?? undefined}
          autoComplete="tel"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          leadingIcon={<Lock className="size-4.5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(null)
          }}
          error={passwordError ?? undefined}
          autoComplete="current-password"
          required
        />

        {formError && (
          <p role="alert" className="rounded-md bg-error-container px-3.5 py-2.5 text-sm text-on-error-container">
            {formError}
          </p>
        )}

        <div className="flex justify-end">
          <Link to={ROUTES.forgotPassword} className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Log in
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-outline-variant" />
          <span className="text-xs font-semibold text-on-surface-variant">OR</span>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        <Button
          type="button"
          variant="outlined"
          fullWidth
          size="lg"
          loading={isDemoLoading}
          leadingIcon={<Sparkles className="size-4.5" />}
          onClick={handleDemoLogin}
        >
          Explore instant demo
        </Button>
        <p className="text-center text-xs text-on-surface-variant">
          No sign-up needed — jump straight into a fully populated farmer account.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.register} className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
