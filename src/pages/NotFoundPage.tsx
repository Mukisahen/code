import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
        <Sprout className="size-8" />
      </span>
      <h1 className="text-2xl font-bold text-on-surface">Page not found</h1>
      <p className="max-w-sm text-sm text-on-surface-variant">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to={ROUTES.splash}>
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
