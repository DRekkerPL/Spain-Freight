'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { OrderLossBucket } from '@/data/bechtle'

interface OrderLossChartProps {
  data: OrderLossBucket[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border p-3 text-[0.65rem] font-mono shadow-sm">
      <div className="text-text mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="text-text">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function OrderLossChart({ data }: OrderLossChartProps) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const chartData = data.map(row => ({
    name: row.basketSize.replace(/^\d+\.\s*/, ''),
    Profitable: row.shipments - row.lossMaking,
    'Loss-making': row.lossMaking,
    lossPct: row.lossMakingPct,
    avgNetProfit: row.avgNetProfit,
    totalNetProfit: row.totalNetProfit,
  }))

  return (
    <div ref={ref}>
      {/* Bar chart */}
      <div className="px-5 pt-4 pb-2" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={32} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#E0DDD7" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: '#6B7A84', fontFamily: 'DM Mono, monospace' }}
              axisLine={{ stroke: '#E0DDD7' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#6B7A84', fontFamily: 'DM Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0EEEA' }} />
            <Bar dataKey="Profitable" stackId="a" fill="#006B44" fillOpacity={0.75} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Loss-making" stackId="a" fill="#ef4444" fillOpacity={0.75} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 pb-3">
        <div className="flex items-center gap-1.5 text-[0.58rem] text-muted">
          <div className="w-3 h-1.5 rounded-sm" style={{ background: '#006B44', opacity: 0.75 }} />
          Profitable
        </div>
        <div className="flex items-center gap-1.5 text-[0.58rem] text-muted">
          <div className="w-3 h-1.5 rounded-sm" style={{ background: '#ef4444', opacity: 0.75 }} />
          Loss-making
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid border-t border-border" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((row, i) => {
          const lossColor = row.lossMakingPct >= 99
            ? 'text-danger'
            : row.lossMakingPct > 50
            ? 'text-warn'
            : 'text-ok'
          const profitColor = row.avgNetProfit < 0 ? 'text-danger' : 'text-ok'
          return (
            <div
              key={i}
              className={`p-3 flex flex-col gap-1.5 bg-surface ${i < data.length - 1 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[0.58rem] text-muted leading-tight">
                {row.basketSize.replace(/^\d+\.\s*/, '')}
              </div>
              <div className={`font-syne text-[0.95rem] font-bold ${lossColor}`}>
                {row.lossMakingPct.toFixed(0)}%
              </div>
              <div className="text-[0.55rem] text-muted">loss rate</div>
              <div className={`font-mono text-[0.65rem] ${profitColor}`}>
                avg {row.avgNetProfit >= 0 ? '+' : ''}€{row.avgNetProfit.toFixed(1)}
              </div>
              <div className="text-[0.55rem] text-muted">net/shipment</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
