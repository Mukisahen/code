import { useState, type FormEvent } from 'react'
import { Factory, PackageCheck, Gauge, PlusCircle, Layers } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { StatTile } from '@/components/common/StatTile'
import { ProgressBar } from '@/components/common/ProgressBar'
import { MOCK_PRODUCTION_BATCHES } from '@/mocks/productionBatches'
import type { BatchStatus, ProductionBatch } from '@/types/processing'
import { formatDate } from '@/utils/format'

const STATUS_TONE: Record<BatchStatus, 'neutral' | 'warning' | 'success'> = {
  queued: 'neutral',
  processing: 'warning',
  done: 'success',
}

const STATUS_LABEL: Record<BatchStatus, string> = {
  queued: 'Queued',
  processing: 'Processing',
  done: 'Done',
}

const GRADE_TONE = { A: 'success', B: 'warning', C: 'error' } as const

const CAPACITY_UTILIZATION = 72

export default function ProcessingPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>(MOCK_PRODUCTION_BATCHES)
  const [isAdding, setIsAdding] = useState(false)
  const [inputProduct, setInputProduct] = useState('Dry Grain Maize')
  const [inputKg, setInputKg] = useState('')

  const totalIntake = batches.reduce((sum, b) => sum + b.inputKg, 0)
  const inProduction = batches.filter((b) => b.status !== 'done').length
  const totalOutput = batches.reduce((sum, b) => sum + b.outputBags, 0)

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!inputKg.trim()) return
    setBatches((prev) => [
      {
        id: `batch-${Date.now()}`,
        batchName: `Batch #2026-0${prev.length + 17}`,
        inputProduct,
        inputKg: Number(inputKg),
        outputBags: 0,
        outputProduct: 'Maize Flour (50kg bags)',
        status: 'queued',
        qualityGrade: null,
        startedAt: new Date().toISOString(),
        completedAt: null,
      },
      ...prev,
    ])
    setInputKg('')
    setIsAdding(false)
  }

  return (
    <DashboardLayout
      title="Processing"
      subtitle="Track intake, production batches and output"
      actions={
        <Button size="sm" leadingIcon={<PlusCircle className="size-4" />} onClick={() => setIsAdding((v) => !v)}>
          <span className="hidden sm:inline">Log new batch</span>
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Layers} label="Raw intake" value={`${totalIntake.toLocaleString()} kg`} tone="primary" />
        <StatTile icon={Factory} label="Batches in production" value={String(inProduction)} tone="secondary" />
        <StatTile icon={PackageCheck} label="Output produced" value={`${totalOutput} bags`} tone="tertiary" />
        <StatTile icon={Gauge} label="Capacity used" value={`${CAPACITY_UTILIZATION}%`} tone="primary" />
      </div>

      {isAdding && (
        <Card className="mt-5">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_auto]">
            <Input
              placeholder="Input product, e.g. Dry Grain Maize"
              value={inputProduct}
              onChange={(e) => setInputProduct(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Quantity (kg)"
              value={inputKg}
              onChange={(e) => setInputKg(e.target.value)}
              required
            />
            <Button type="submit">Add batch</Button>
          </form>
        </Card>
      )}

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">Capacity utilization this month</p>
          <p className="text-sm font-bold text-on-surface">{CAPACITY_UTILIZATION}%</p>
        </div>
        <ProgressBar value={CAPACITY_UTILIZATION} tone="secondary" />
      </Card>

      <div className="mt-6 space-y-3">
        {batches.map((batch) => (
          <Card key={batch.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-on-surface">{batch.batchName}</p>
                <p className="text-sm text-on-surface-variant">
                  {batch.inputKg.toLocaleString()} kg {batch.inputProduct} &rarr; {batch.outputProduct}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Started {formatDate(batch.startedAt)}
                  {batch.completedAt && ` · Completed ${formatDate(batch.completedAt)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <Badge tone={STATUS_TONE[batch.status]}>{STATUS_LABEL[batch.status]}</Badge>
                {batch.qualityGrade && <Badge tone={GRADE_TONE[batch.qualityGrade]}>Grade {batch.qualityGrade}</Badge>}
              </div>
            </div>
            {batch.status === 'done' && (
              <p className="mt-3 text-sm font-semibold text-on-surface">{batch.outputBags} bags produced</p>
            )}
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
