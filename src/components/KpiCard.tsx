'use client'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'positive' | 'negative' | 'accent'
}

const variantMap = {
  default:  { topBorder: 'border-t-border',  valueColor: 'text-text'   },
  positive: { topBorder: 'border-t-ok',      valueColor: 'text-ok'     },
  negative: { topBorder: 'border-t-danger',  valueColor: 'text-danger' },
  accent:   { topBorder: 'border-t-accent',  valueColor: 'text-accent' },
}

export default function KpiCard({ label, value, sub, variant = 'default' }: KpiCardProps) {
  const { topBorder, valueColor } = variantMap[variant]
  return (
    <div className={`bg-white rounded-xl border border-border border-t-4 ${topBorder} p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-200`}>
      <p className="text-xs font-semibold tracking-widest uppercase text-muted">{label}</p>
      <p className={`text-4xl font-bold leading-none tracking-tight ${valueColor}`}>{value}</p>
      {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
    </div>
  )
}
