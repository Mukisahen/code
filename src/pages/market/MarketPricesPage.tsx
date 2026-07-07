import { useEffect, useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Sparkline } from '@/components/charts/Sparkline'
import { LiveBadge } from '@/components/common/LiveBadge'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { useLivePrices } from '@/hooks/useLivePrices'
import * as marketPricesService from '@/services/marketPricesService'
import type { MarketPriceEntry } from '@/types/marketPrice'
import { cn } from '@/utils/cn'

const TREND_DISTRICT = 'Masindi'
const TREND_CATEGORY = 'Dry Grain'

export default function MarketPricesPage() {
  const [district, setDistrict] = useState('all')
  const [basePrices, setBasePrices] = useState<MarketPriceEntry[]>([])
  const [trend, setTrend] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const { prices, lastUpdated } = useLivePrices(basePrices)

  useEffect(() => {
    Promise.all([
      marketPricesService.listMarketPrices(),
      marketPricesService.getPriceTrend(TREND_DISTRICT, TREND_CATEGORY),
    ])
      .then(([priceResult, trendResult]) => {
        setBasePrices(priceResult)
        setTrend(trendResult)
      })
      .finally(() => setLoading(false))
  }, [])

  const districts = useMemo(() => ['all', ...new Set(prices.map((p) => p.district))], [prices])

  const filtered = useMemo(
    () => (district === 'all' ? prices : prices.filter((p) => p.district === district)),
    [district, prices],
  )

  if (loading) {
    return (
      <DashboardLayout title="Market Prices" subtitle="Live maize prices across Uganda">
        <InlineSpinner label="Loading prices…" />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Market Prices" subtitle="Live maize prices across Uganda">
      <Card className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
              <TrendingUp className="size-4 text-primary" /> {TREND_CATEGORY} Maize — 7 day trend ({TREND_DISTRICT})
            </p>
            <p className="mt-1 text-2xl font-bold text-on-surface">
              {trend.length > 0 ? `UGX ${trend.at(-1)?.toLocaleString()}/kg` : 'No trend data yet'}
            </p>
          </div>
          <LiveBadge lastUpdated={lastUpdated} />
        </div>
        {trend.length > 0 && (
          <Sparkline data={trend} valueFormatter={(v) => `UGX ${v.toLocaleString()}`} height={72} width={600} />
        )}
      </Card>

      <div className="mb-4 flex justify-end">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-11 rounded-md border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {districts.map((d) => (
            <option key={d} value={d}>
              {d === 'all' ? 'All districts' : d}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-outline-variant/60 text-left text-xs font-semibold text-on-surface-variant">
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price (UGX/kg)</th>
              <th className="px-4 py-3 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((price) => (
              <tr key={price.id} className="border-b border-outline-variant/40 last:border-0">
                <td className="px-4 py-3 font-medium text-on-surface">{price.district}</td>
                <td className="px-4 py-3 text-on-surface-variant">{price.category}</td>
                <td className="px-4 py-3 text-right font-semibold text-on-surface transition-colors duration-500">
                  {price.pricePerKg.toLocaleString()}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-semibold transition-colors duration-500',
                    price.changePercent >= 0 ? 'text-primary' : 'text-error',
                  )}
                >
                  {price.changePercent >= 0 ? '+' : ''}
                  {price.changePercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  )
}
