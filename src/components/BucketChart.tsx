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
      {/* Header */}
      <div className="grid grid-cols-[90px_1fr_56px_56px_56px] gap-3 px-5 py-2 border-b border-border
                      text-[0.58rem] tracking-[0.12em] uppercase text-muted">
        <span>Bucket</span>
        <span></span>
        <span className="text-right">Before</span>
        <span className="text-right">After</span>
        <span className="text-right">+pp</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5 px-5 py-3">
        {data.map((row, i) => {
          const beforeW = (row.avgCurrentMargin / MAX_MARGIN) * 100
          const afterW  = (row.avgNewMargin     / MAX_MARGIN) * 100
          const diffColor = row.marginDiffPp > 10
            ? 'text-ok'
            : row.marginDiffPp > 4
            ? 'text-accent2'
            : 'text-muted'

          // clean bucket label: strip "1. " prefix
          const label = row.costBucket.replace(/^\d+\.\s*/, '')

          return (
            <div
              key={i}
              className="grid grid-cols-[90px_1fr_56px_56px_56px] gap-3 items-center"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-[0.65rem] text-muted whitespace-nowrap">{label}</span>

              {/* Stacked bar */}
              <div className="relative h-1.5 bg-faint rounded-sm overflow-hidden">
                {/* before bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-muted/40 rounded-sm transition-all duration-700 ease-out"
                  style={{ width: animated ? `${beforeW}%` : '0%', transitionDelay: `${i * 40}ms` }}
                />
                {/* after bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-accent rounded-sm transition-all duration-700 ease-out"
                  style={{ width: animated ? `${afterW}%` : '0%', transitionDelay: `${i * 40 + 80}ms` }}
                />
              </div>

              <span className="text-right text-[0.65rem] text-muted">
                {row.avgCurrentMargin.toFixed(1)}%
              </span>
              <span className="text-right text-[0.65rem] text-accent2">
                {row.avgNewMargin.toFixed(1)}%
              </span>
              <span className={`text-right text-[0.65rem] font-syne font-bold ${diffColor}`}>
                +{row.marginDiffPp.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-[0.58rem] text-muted">
          <div className="w-3 h-1 bg-muted/40 rounded-sm" /> Before
        </div>
        <div className="flex items-center gap-1.5 text-[0.58rem] text-muted">
          <div className="w-3 h-1 bg-accent rounded-sm" /> After
        </div>
      </div>
    </div>
  )
}
