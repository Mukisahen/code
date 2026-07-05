import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { getNavItemsForRole } from '@/constants/navigation'
import type { UserRole } from '@/types/user'
import { isNavItemActive } from '@/utils/isNavItemActive'
import { cn } from '@/utils/cn'

export function Sidebar({ role }: { role: UserRole }) {
  const items = getNavItemsForRole(role)
  const location = useLocation()

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-outline-variant/60 bg-surface px-3 py-5 lg:flex">
      <div className="px-2 pb-6">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {items.map(({ label, route, icon: Icon }) => {
          const active = isNavItemActive(route, location.pathname, location.hash)
          return (
            <Link
              key={label}
              to={route}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                active
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant',
              )}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
