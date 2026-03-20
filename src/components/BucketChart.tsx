'use client'

import { useEffect, useRef, useState } from 'react'
import { BucketRow } from '@/data/bechtle'

const MAX_MARGIN = 40

export default function BucketChart({ data }: { data: BucketRow[] }) {
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
      <div className="grid grid-cols-[130px_1fr_72px_72px_64px] gap-3 px-6 py-3 border-b border-border bg-subtle">
        {['Bucket', '', 'Before', 'After', '+pp'].map((h, i) => (
          <span key={i} className={`text-xs font-semibold uppercase tracking-wider text-muted ${i >= 2 ? 'text-right' : ''}`}>
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
            ? 'text-success font-bold'
            : row.marginDiffPp > 4
            ? 'text-primary font-semibold'
            : 'text-muted'
          const label = row.costBucket.replace(/^\d+\.\s*/, '')

          return (
            <div
              key={i}
              className="grid grid-cols-[130px_1fr_72px_72px_64px] gap-3 px-6 py-4 items-center hover:bg-subtle transition-colors"
            >
              <span className="text-sm text-muted">{label}</span>

              <div className="relative h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: animated ? `${beforeW}%` : '0%',
                    transitionDelay: `${i * 40}ms`,
                    background: '#B5AA9C',
                    opacity: 0.7,
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: animated ? `${afterW}%` : '0%', transitionDelay: `${i * 40 + 100}ms` }}
                />
              </div>

              <span className="text-right text-sm text-muted tabular-nums">{row.avgCurrentMargin.toFixed(1)}%</span>
              <span className="text-right text-sm font-semibold text-primary tabular-nums">{row.avgNewMargin.toFixed(1)}%</span>
              <span className={`text-right text-sm tabular-nums ${diffColor}`}>+{row.marginDiffPp.toFixed(1)}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-4 border-t border-border bg-subtle">
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-5 h-2 rounded-full" style={{ background: '#B5AA9C', opacity: 0.7 }} />
          Before
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-5 h-2 bg-primary rounded-full" />
          After
        </div>
      </div>
    </div>
  )
}
