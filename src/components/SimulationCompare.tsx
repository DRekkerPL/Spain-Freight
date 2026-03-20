'use client'

import { SimulationRow } from '@/data/bechtle'

function fmt(n: number) {
  return `€${n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function SimulationCompare({ data }: { data: SimulationRow[] }) {
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
        <div className="px-6 py-4 bg-subtle" />
        <div className="px-6 py-4 bg-subtle border-l border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Before</p>
          <p className="text-sm text-muted mt-0.5">Customer profiles</p>
        </div>
        <div className="px-6 py-4 bg-emerald-50 border-l border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-success">After</p>
          <p className="text-sm text-success/70 mt-0.5">System profile</p>
        </div>
      </div>

      {/* Data rows */}
      <div className="divide-y divide-border">
        {rows.map(({ label, bv, av }) => (
          <div key={label} className="grid grid-cols-3 items-center">
            <div className="px-6 py-5 bg-subtle border-r border-border">
              <span className="text-sm font-medium text-muted">{label}</span>
            </div>
            <div className="px-6 py-5 border-r border-border hover:bg-subtle transition-colors">
              <span className="text-xl font-bold text-ink tabular-nums">{bv}</span>
            </div>
            <div className="px-6 py-5 bg-emerald-50/60 hover:bg-emerald-50 transition-colors">
              <span className="text-xl font-bold text-success tabular-nums">{av}</span>
            </div>
          </div>
        ))}
      </div>

      {/* GP Uplift banner */}
      <div className="bg-success px-6 py-6 flex justify-between items-center">
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
