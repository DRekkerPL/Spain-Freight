'use client'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'positive' | 'negative' | 'warn' | 'accent'
}

const variantMap = {
  default:  { topBorder: 'border-t-border',  valueColor: 'text-text',    bg: '' },
  positive: { topBorder: 'border-t-ok',      valueColor: 'text-ok',      bg: 'bg-emerald-50/60' },
  negative: { topBorder: 'border-t-danger',  valueColor: 'text-danger',  bg: 'bg-red-50/60' },
  warn:     { topBorder: 'border-t-warn',    valueColor: 'text-warn',    bg: 'bg-amber-50/60' },
  accent:   { topBorder: 'border-t-accent',  valueColor: 'text-accent',  bg: 'bg-blue-50/60' },
}

export default function KpiCard({ label, value, sub, variant = 'default' }: KpiCardProps) {
  const { topBorder, valueColor, bg } = variantMap[variant]
  return (
    <div className={`${bg || 'bg-white'} rounded-xl border border-border border-t-4 ${topBorder} p-7 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-200`}>
      <p className="text-sm font-semibold tracking-widest uppercase text-muted">{label}</p>
      <p className={`text-5xl font-bold leading-none tracking-tight ${valueColor}`}>{value}</p>
      {sub && <p className="text-sm text-muted">{sub}</p>}
    </div>
  )
}
