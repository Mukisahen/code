import { Link, useLocation } from 'react-router-dom'
import { getBottomNavItemsForRole } from '@/constants/navigation'
import type { UserRole } from '@/types/user'
import { isNavItemActive } from '@/utils/isNavItemActive'
import { cn } from '@/utils/cn'

export function BottomNav({ role }: { role: UserRole }) {
  const items = getBottomNavItemsForRole(role)
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/60 bg-surface/95 backdrop-blur-md safe-bottom lg:hidden">
      <div className="mx-auto flex max-w-6xl items-stretch justify-between px-1">
        {items.map(({ label, route, icon: Icon }) => {
          const active = isNavItemActive(route, location.pathname, location.hash)
          return (
            <Link
              key={label}
              to={route}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors',
                active ? 'text-primary' : 'text-on-surface-variant',
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
