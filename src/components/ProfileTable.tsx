'use client'

import { useState } from 'react'
import { ProfileRow } from '@/data/bechtle'

type SortKey = 'profile' | 'shipments' | 'smallBasketPct' | 'marginPct' | 'turnoverSharePct'

function SuggestionBadge({ text }: { text: string }) {
  if (!text) return null
  const isRemove = text.toLowerCase().includes('remove')
  const isReview = text.toLowerCase().includes('review')
  const cls = isRemove
    ? 'bg-red-100 text-red-700 border border-red-200'
    : isReview
    ? 'bg-amber-100 text-amber-700 border border-amber-200'
    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  const label = isRemove ? 'remove' : isReview ? 'review' : 'ok'
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

export default function ProfileTable({ data }: { data: ProfileRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('smallBasketPct')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
    return sortDir === 'asc' ? cmp : -cmp
  })

  function ColHead({ label, k, align = 'left' }: { label: string; k: SortKey; align?: 'left' | 'right' }) {
    const active = sortKey === k
    return (
      <th
        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-${align} cursor-pointer select-none whitespace-nowrap transition-colors
          ${active ? 'text-primary bg-blue-50' : 'text-muted hover:text-ink'}`}
        onClick={() => handleSort(k)}
      >
        {label}
        <span className="ml-1">{active ? (sortDir === 'asc' ? '↑' : '↓') : <span className="opacity-30">↕</span>}</span>
      </th>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-subtle">
            <ColHead label="Profile"   k="profile"          align="left"  />
            <ColHead label="Shipments" k="shipments"        align="right" />
            <ColHead label="Small %"   k="smallBasketPct"   align="right" />
            <ColHead label="Margin"    k="marginPct"        align="right" />
            <ColHead label="Share"     k="turnoverSharePct" align="right" />
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-left text-muted">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const smallColor = row.smallBasketPct > 50
              ? 'text-danger font-semibold'
              : row.smallBasketPct > 40
              ? 'text-warning font-semibold'
              : 'text-success'
            const marginColor = row.marginPct < 10
              ? 'text-danger font-semibold'
              : row.marginPct < 13
              ? 'text-warning'
              : 'text-ink'

            return (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-subtle transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-ink">{row.profile}</span>
                </td>
                <td className="px-4 py-3.5 text-right text-sm text-muted tabular-nums">
                  {row.shipments.toLocaleString()}
                </td>
                <td className={`px-4 py-3.5 text-right text-sm tabular-nums ${smallColor}`}>
                  {row.smallBasketPct.toFixed(1)}%
                </td>
                <td className={`px-4 py-3.5 text-right text-sm tabular-nums ${marginColor}`}>
                  {row.marginPct.toFixed(1)}%
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-14 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(row.turnoverSharePct, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted tabular-nums w-10 text-right">
                      {row.turnoverSharePct.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <SuggestionBadge text={row.suggestion} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
