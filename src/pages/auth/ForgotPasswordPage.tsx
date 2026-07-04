import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Phone, MailCheck } from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { requestPasswordReset, AuthError } from '@/services/authService'
import { ROUTES } from '@/constants/routes'

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await requestPasswordReset(phone)
      setIsSent(true)
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSent) {
    return (
      <AuthLayout title="Check your messages">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <MailCheck className="size-8" />
          </span>
          <p className="text-sm text-on-surface-variant">
            We&apos;ve sent password reset instructions by SMS to <span className="font-semibold">{phone}</span>.
          </p>
          <Link to={ROUTES.login} className="w-full">
            <Button fullWidth size="lg">
              Back to login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your phone number and we'll send you a reset code">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Phone number"
          type="tel"
          placeholder="+256 7XX XXX XXX"
          leadingIcon={<Phone className="size-4.5" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
        />

        {error && (
          <p role="alert" className="rounded-md bg-error-container px-3.5 py-2.5 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Send reset code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Remembered your password?{' '}
        <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
