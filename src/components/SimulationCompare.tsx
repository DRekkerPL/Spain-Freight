'use client'

import { SimulationRow } from '@/data/bechtle'

interface SimulationCompareProps {
  data: SimulationRow[]
}

function fmt(n: number) {
  return `€${n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function SimulationCompare({ data }: SimulationCompareProps) {
  const before = data[0]
  const after  = data[1]
  if (!before || !after) return null

  const deltaGP  = after.deltaGP
  const deltaMar = after.marginPct - before.marginPct

  const rows = [
    { label: 'Revenue',      before: fmt(before.revenue),               after: fmt(after.revenue)               },
    { label: 'Gross Profit', before: fmt(before.grossProfit),           after: fmt(after.grossProfit)           },
    { label: 'GP Margin',    before: `${before.marginPct.toFixed(1)}%`, after: `${after.marginPct.toFixed(1)}%` },
  ]

  return (
    <div>
      {/* Column headers */}
      <div className="grid grid-cols-3 border-b border-border bg-faint px-6 py-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted text-right">Before</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-ok text-right">After</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {rows.map(({ label, before: bv, after: av }) => (
          <div key={label} className="grid grid-cols-3 items-center px-6 py-4 hover:bg-faint transition-colors">
            <span className="text-sm text-muted font-medium">{label}</span>
            <span className="text-base font-bold text-text text-right">{bv}</span>
            <span className="text-base font-bold text-ok text-right">{av}</span>
          </div>
        ))}
      </div>

      {/* GP Uplift banner */}
      <div className="border-t-2 border-ok bg-ok/5 px-6 py-5 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-text">GP uplift on same order volume</p>
          <p className="text-xs text-muted mt-1">
            {after.items} items · 2025 order volumes · margin +{deltaMar.toFixed(1)} pp
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-ok">+{fmt(deltaGP)}</p>
          <p className="text-xs text-muted mt-0.5">gross profit uplift</p>
        </div>
      </div>
    </div>
  )
}
