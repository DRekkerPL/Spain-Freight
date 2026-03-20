'use client'

import { useEffect, useRef, useState } from 'react'
import { BucketRow } from '@/data/bechtle'

interface BucketChartProps {
  data: BucketRow[]
}

const MAX_MARGIN = 40

export default function BucketChart({ data }: BucketChartProps) {
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

  return (
    <div ref={ref} className="flex flex-col">
      {/* Column headers */}
      <div className="grid grid-cols-[130px_1fr_72px_72px_64px] gap-3 px-6 py-3 border-b border-border bg-faint">
        {['Bucket', '', 'Before', 'After', '+pp'].map((h, i) => (
          <span key={i} className={`text-xs font-bold uppercase tracking-wider text-muted ${i >= 2 ? 'text-right' : ''}`}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {data.map((row, i) => {
          const beforeW = (row.avgCurrentMargin / MAX_MARGIN) * 100
          const afterW  = (row.avgNewMargin     / MAX_MARGIN) * 100
          const diffColor = row.marginDiffPp > 10
            ? 'text-ok font-bold'
            : row.marginDiffPp > 4
            ? 'text-accent font-semibold'
            : 'text-muted'
          const label = row.costBucket.replace(/^\d+\.\s*/, '')

          return (
            <div
              key={i}
              className="grid grid-cols-[130px_1fr_72px_72px_64px] gap-3 px-6 py-4 items-center hover:bg-faint transition-colors"
            >
              <span className="text-sm font-medium text-muted">{label}</span>

              <div className="relative h-2.5 bg-border rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-brand-sand/70 rounded-full transition-all duration-700 ease-out"
                  style={{ width: animated ? `${beforeW}%` : '0%', transitionDelay: `${i * 40}ms` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-700 ease-out"
                  style={{ width: animated ? `${afterW}%` : '0%', transitionDelay: `${i * 40 + 100}ms` }}
                />
              </div>

              <span className="text-right text-sm text-muted tabular-nums">{row.avgCurrentMargin.toFixed(1)}%</span>
              <span className="text-right text-sm font-semibold text-accent tabular-nums">{row.avgNewMargin.toFixed(1)}%</span>
              <span className={`text-right text-sm tabular-nums ${diffColor}`}>+{row.marginDiffPp.toFixed(1)}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-4 border-t border-border bg-faint">
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-5 h-2.5 bg-brand-sand/70 rounded-full" />
          Before
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-5 h-2.5 bg-accent rounded-full" />
          After
        </div>
      </div>
    </div>
  )
}
