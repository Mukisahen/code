import { useState, type FormEvent } from 'react'
import { PlusCircle, CalendarDays } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { MOCK_PLAN_ENTRIES } from '@/mocks/tasks'
import type { PlanEntry } from '@/types/task'

const STATUS_TONE: Record<PlanEntry['status'], 'neutral' | 'warning' | 'success'> = {
  upcoming: 'neutral',
  'in-progress': 'warning',
  done: 'success',
}

const STATUS_LABEL: Record<PlanEntry['status'], string> = {
  upcoming: 'Upcoming',
  'in-progress': 'In progress',
  done: 'Done',
}

export default function PlanningPage() {
  const [entries, setEntries] = useState(MOCK_PLAN_ENTRIES)
  const [isAdding, setIsAdding] = useState(false)
  const [activity, setActivity] = useState('')
  const [window, setWindowValue] = useState('')

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!activity.trim() || !window.trim()) return
    setEntries((prev) => [
      { id: `plan-${Date.now()}`, activity, window, status: 'upcoming', notes: '' },
      ...prev,
    ])
    setActivity('')
    setWindowValue('')
    setIsAdding(false)
  }

  return (
    <DashboardLayout
      title="Planning"
      subtitle="Your season calendar, from land prep to harvest"
      actions={
        <Button size="sm" leadingIcon={<PlusCircle className="size-4" />} onClick={() => setIsAdding((v) => !v)}>
          <span className="hidden sm:inline">Add activity</span>
        </Button>
      }
    >
      {isAdding && (
        <Card className="mb-5">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="Activity, e.g. Weeding"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
            />
            <Input
              placeholder="Window, e.g. Apr 1 - Apr 10"
              value={window}
              onChange={(e) => setWindowValue(e.target.value)}
              required
            />
            <Button type="submit">Add</Button>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <CalendarDays className="size-4.5" />
              </span>
              <div>
                <p className="font-semibold text-on-surface">{entry.activity}</p>
                <p className="text-xs text-on-surface-variant">{entry.window}</p>
                {entry.notes && <p className="mt-1 text-sm text-on-surface-variant">{entry.notes}</p>}
              </div>
            </div>
            <Badge tone={STATUS_TONE[entry.status]} className="w-fit sm:ml-4">
              {STATUS_LABEL[entry.status]}
            </Badge>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
