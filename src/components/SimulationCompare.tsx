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
    { label: 'Revenue',      bv: fmt(before.revenue),               av: fmt(after.revenue)               },
    { label: 'Gross Profit', bv: fmt(before.grossProfit),           av: fmt(after.grossProfit)           },
    { label: 'GP Margin',    bv: `${before.marginPct.toFixed(1)}%`, av: `${after.marginPct.toFixed(1)}%` },
  ]

  return (
    <div>
      {/* Column headers */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="px-6 py-4 bg-faint" />
        <div className="px-6 py-4 bg-faint border-l border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Before</p>
          <p className="text-sm text-muted mt-0.5">Customer profiles</p>
        </div>
        <div className="px-6 py-4 bg-ok/10 border-l border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-ok">After</p>
          <p className="text-sm text-ok/70 mt-0.5">System profile</p>
        </div>
      </div>

      {/* Data rows */}
      <div className="divide-y divide-border">
        {rows.map(({ label, bv, av }) => (
          <div key={label} className="grid grid-cols-3 items-center">
            <div className="px-6 py-4 bg-faint border-r border-border">
              <span className="text-base font-medium text-muted">{label}</span>
            </div>
            <div className="px-6 py-4 border-r border-border hover:bg-faint transition-colors">
              <span className="text-xl font-bold text-text tabular-nums">{bv}</span>
            </div>
            <div className="px-6 py-4 bg-ok/5 hover:bg-ok/10 transition-colors">
              <span className="text-xl font-bold text-ok tabular-nums">{av}</span>
            </div>
          </div>
        ))}
      </div>

      {/* GP Uplift banner */}
      <div className="border-t-2 border-ok bg-ok px-6 py-6 flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-white">GP uplift on same order volume</p>
          <p className="text-sm text-white/70 mt-1">
            {after.items} items · 2025 order volumes · margin +{deltaMar.toFixed(1)} pp
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-white">+{fmt(deltaGP)}</p>
          <p className="text-sm text-white/70 mt-1">gross profit uplift</p>
        </div>
      </div>
    </div>
  )
}
