'use client'

import { useState } from 'react'
import { ProfileRow } from '@/data/bechtle'

interface ProfileTableProps {
  data: ProfileRow[]
}

type SortKey = 'profile' | 'shipments' | 'smallBasketPct' | 'marginPct' | 'turnoverSharePct'

function SuggestionBadge({ text }: { text: string }) {
  if (!text) return null
  const isRemove = text.toLowerCase().includes('remove')
  const isReview = text.toLowerCase().includes('review')
  const cls = isRemove
    ? 'bg-red-50 text-danger border border-red-200'
    : isReview
    ? 'bg-amber-50 text-warn border border-amber-200'
    : 'bg-emerald-50 text-ok border border-emerald-200'
  const label = text.replace(/^Suggestion:\s*/i, '')
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

export default function ProfileTable({ data }: ProfileTableProps) {
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

  function ColHead({
    label, k, align = 'left',
  }: { label: string; k: SortKey; align?: 'left' | 'right' }) {
    const active = sortKey === k
    return (
      <th
        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-${align} cursor-pointer select-none whitespace-nowrap transition-colors
          ${active ? 'text-accent' : 'text-muted hover:text-text'}`}
        onClick={() => handleSort(k)}
      >
        {label}
        <span className="ml-1 opacity-60">{active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </th>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-faint">
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
              ? 'text-danger font-bold'
              : row.smallBasketPct > 40
              ? 'text-warn font-semibold'
              : 'text-ok'
            const marginColor = row.marginPct < 10
              ? 'text-danger font-bold'
              : row.marginPct < 13
              ? 'text-warn'
              : 'text-text'

            return (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-faint transition-colors group">
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-text">{row.profile}</span>
                </td>
                <td className="px-4 py-3.5 text-right text-sm text-muted">
                  {row.shipments.toLocaleString()}
                </td>
                <td className={`px-4 py-3.5 text-right text-sm ${smallColor}`}>
                  {row.smallBasketPct.toFixed(1)}%
                </td>
                <td className={`px-4 py-3.5 text-right text-sm ${marginColor}`}>
                  {row.marginPct.toFixed(1)}%
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(row.turnoverSharePct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted w-9 text-right tabular-nums">
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
