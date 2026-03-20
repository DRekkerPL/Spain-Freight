'use client'

import { ProfileRow } from '@/data/bechtle'

interface ProfileTableProps {
  data: ProfileRow[]
}

function SuggestionBadge({ text }: { text: string }) {
  if (!text) return null

  const isRemove  = text.toLowerCase().includes('remove')
  const isReview  = text.toLowerCase().includes('review')

  const cls = isRemove
    ? 'bg-red-500/10 text-danger border border-red-500/20'
    : isReview
    ? 'bg-yellow-500/10 text-warn border border-yellow-500/20'
    : 'bg-emerald-500/10 text-ok border border-emerald-500/20'

  // strip "Suggestion: " prefix for display
  const label = text.replace(/^Suggestion:\s*/i, '')

  return (
    <span className={`inline-flex items-center text-[0.58rem] tracking-wide px-2 py-0.5 rounded-sm whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

export default function ProfileTable({ data }: ProfileTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface">
            {['Profile', 'Shipments', 'Small %', 'Margin', 'Share', 'Suggestion'].map(h => (
              <th key={h} className="text-left text-[0.58rem] tracking-[0.14em] uppercase text-muted px-4 py-2.5 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const smallColor = row.smallBasketPct > 50
              ? 'text-danger font-bold'
              : row.smallBasketPct > 40
              ? 'text-warn font-bold'
              : 'text-ok'

            const marginColor = row.marginPct < 10
              ? 'text-danger'
              : row.marginPct < 13
              ? 'text-warn'
              : 'text-text'

            return (
              <tr key={i} className="border-b border-faint hover:bg-faint transition-colors">
                <td className="px-4 py-2.5">
                  <span className="font-syne text-[0.75rem] font-semibold text-white">
                    {row.profile}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-[0.7rem] text-muted">
                  {row.shipments.toLocaleString()}
                </td>
                <td className={`px-4 py-2.5 text-right text-[0.7rem] font-syne ${smallColor}`}>
                  {row.smallBasketPct.toFixed(1)}%
                </td>
                <td className={`px-4 py-2.5 text-right text-[0.7rem] font-syne font-bold ${marginColor}`}>
                  {row.marginPct.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-faint rounded-sm overflow-hidden min-w-[50px]">
                      <div
                        className="h-full bg-accent rounded-sm transition-all duration-700"
                        style={{ width: `${Math.min(row.turnoverSharePct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[0.65rem] text-muted min-w-[35px] text-right">
                      {row.turnoverSharePct.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
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
