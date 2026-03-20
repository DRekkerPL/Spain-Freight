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
    <div className="bg-white border border-border p-4 text-sm shadow-lg rounded-lg">
      <p className="font-semibold text-text mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-6">
          <span style={{ color: p.fill }} className="font-medium">{p.name}</span>
          <span className="text-text font-semibold">{p.value.toLocaleString()}</span>
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
  }))

  return (
    <div ref={ref}>
      {/* Bar chart */}
      <div className="px-6 pt-5 pb-3" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={36} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#E0DDD7" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7A84', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
              axisLine={{ stroke: '#E0DDD7' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7A84', fontFamily: 'Montserrat, sans-serif' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0EEEA' }} />
            <Bar dataKey="Profitable"   stackId="a" fill="#006B44" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Loss-making"  stackId="a" fill="#ef4444" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-3 rounded-sm" style={{ background: '#006B44', opacity: 0.8 }} />
          Profitable
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-3 rounded-sm" style={{ background: '#ef4444', opacity: 0.8 }} />
          Loss-making
        </div>
      </div>

      {/* Stats grid — colour-coded by loss severity */}
      <div className="grid border-t border-border" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((row, i) => {
          const severity =
            row.lossMakingPct >= 99 ? 'high' :
            row.lossMakingPct > 50  ? 'med'  :
            row.lossMakingPct > 10  ? 'low'  : 'none'

          const cellBg =
            severity === 'high' ? 'bg-red-50' :
            severity === 'med'  ? 'bg-amber-50' :
            severity === 'low'  ? 'bg-blue-50/50' : 'bg-emerald-50/60'

          const lossColor =
            severity === 'high' ? 'text-danger font-bold' :
            severity === 'med'  ? 'text-warn font-bold'   :
            severity === 'low'  ? 'text-accent font-semibold' : 'text-ok font-bold'

          const profitColor = row.avgNetProfit < 0 ? 'text-danger' : 'text-ok'

          return (
            <div
              key={i}
              className={`px-4 py-5 flex flex-col gap-1.5 ${cellBg} ${i < data.length - 1 ? 'border-r border-border' : ''} hover:brightness-95 transition-all`}
            >
              <p className="text-sm font-semibold text-muted leading-tight">
                {row.basketSize.replace(/^\d+\.\s*/, '')}
              </p>
              <p className={`text-3xl ${lossColor}`}>
                {row.lossMakingPct.toFixed(0)}%
              </p>
              <p className="text-xs text-muted uppercase tracking-wide font-medium">loss rate</p>
              <p className={`text-base mt-1 tabular-nums font-semibold ${profitColor}`}>
                avg {row.avgNetProfit >= 0 ? '+' : ''}€{row.avgNetProfit.toFixed(1)}
              </p>
              <p className="text-xs text-muted">net / shipment</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
