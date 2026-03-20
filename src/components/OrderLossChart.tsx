'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { OrderLossBucket } from '@/data/bechtle'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-4 text-sm min-w-[180px]">
      <p className="font-semibold text-ink mb-3">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-8 mb-1">
          <span className="text-muted">{p.name}</span>
          <span className="font-semibold text-ink">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function OrderLossChart({ data }: { data: OrderLossBucket[] }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const chartData = data.map(r => ({
    name: r.basketSize.replace(/^\d+\.\s*/, ''),
    Profitable: r.shipments - r.lossMaking,
    'Loss-making': r.lossMaking,
  }))

  return (
    <div ref={ref}>
      <div className="px-6 pt-5 pb-2" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={40} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 4" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'Inter, sans-serif', fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<Tip />} cursor={{ fill: '#F1F5F9' }} />
            <Bar dataKey="Profitable"  stackId="a" fill="#16A34A" fillOpacity={0.85} radius={[0,0,0,0]} />
            <Bar dataKey="Loss-making" stackId="a" fill="#DC2626" fillOpacity={0.85} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-5 px-6 pb-4">
        {[['#16A34A', 'Profitable'], ['#DC2626', 'Loss-making']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color, opacity: 0.85 }} />
            {label}
          </div>
        ))}
      </div>

      {/* Stat cells */}
      <div className="grid border-t border-border" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((row, i) => {
          const pct = row.lossMakingPct
          const borderColor = pct >= 99 ? 'border-l-danger' : pct > 50 ? 'border-l-warning' : pct > 5 ? 'border-l-primary' : 'border-l-success'
          const pctColor    = pct >= 99 ? 'text-danger'  : pct > 50 ? 'text-warning' : pct > 5 ? 'text-primary' : 'text-success'
          const netColor    = row.avgNetProfit < 0 ? 'text-danger' : 'text-success'
          return (
            <div key={i} className={`px-4 py-5 border-l-4 ${borderColor} ${i < data.length-1 ? 'border-r border-border' : ''} hover:bg-subtle transition-colors`}>
              <p className="text-xs font-semibold text-muted mb-2">{row.basketSize.replace(/^\d+\.\s*/, '')}</p>
              <p className={`text-3xl font-bold leading-none ${pctColor}`}>{pct.toFixed(0)}%</p>
              <p className="text-xs text-muted mt-1">loss rate</p>
              <p className={`text-sm font-semibold mt-3 tabular-nums ${netColor}`}>
                {row.avgNetProfit >= 0 ? '+' : ''}€{row.avgNetProfit.toFixed(1)}
              </p>
              <p className="text-xs text-muted">avg net / shipment</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
