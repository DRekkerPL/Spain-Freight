'use client'

import { SimulationRow } from '@/data/bechtle'

interface SimulationCompareProps {
  data: SimulationRow[]
}

function fmt(n: number, prefix = '€') {
  return `${prefix}${n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function SimulationCompare({ data }: SimulationCompareProps) {
  const before = data[0]
  const after  = data[1]
  if (!before || !after) return null

  const deltaGP  = after.deltaGP
  const deltaMar = after.marginPct - before.marginPct

  return (
    <div className="flex flex-col gap-px">
      {/* Before / After side by side */}
      <div className="grid grid-cols-2 gap-px bg-border">
        {/* Before */}
        <div className="bg-surface p-6">
          <div className="text-[0.6rem] tracking-[0.18em] uppercase text-muted mb-4">
            Before — customer profiles
          </div>
          <div className="flex flex-col gap-3">
            {[
              ['Revenue',      fmt(before.revenue)],
              ['Gross Profit', fmt(before.grossProfit)],
              ['GP Margin',    `${before.marginPct.toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-[0.65rem] text-muted">{label}</span>
                <span className="font-syne text-[1.05rem] font-bold text-[#e2e8f0]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div className="bg-surface2 p-6">
          <div className="text-[0.6rem] tracking-[0.18em] uppercase text-ok mb-4">
            After — system profile
          </div>
          <div className="flex flex-col gap-3">
            {[
              ['Revenue',      fmt(after.revenue),           'text-ok'],
              ['Gross Profit', fmt(after.grossProfit),       'text-ok'],
              ['GP Margin',    `${after.marginPct.toFixed(1)}%`, 'text-ok'],
            ].map(([label, value, color]) => (
              <div key={label} className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-[0.65rem] text-muted">{label}</span>
                <span className={`font-syne text-[1.05rem] font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delta bar */}
      <div className="bg-faint border-l-[3px] border-ok px-5 py-4 flex justify-between items-center">
        <div>
          <div className="text-[0.65rem] tracking-[0.12em] uppercase text-muted">
            GP uplift on same order volume
          </div>
          <div className="text-[0.62rem] text-muted mt-1">
            {after.items} items · 2025 order volumes · margin +{deltaMar.toFixed(1)}pp
          </div>
        </div>
        <div className="font-syne text-[1.8rem] font-extrabold text-ok">
          +{fmt(deltaGP)}
        </div>
      </div>
    </div>
  )
}
