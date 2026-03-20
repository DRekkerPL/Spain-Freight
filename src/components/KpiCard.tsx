'use client'

type Variant = 'neutral' | 'primary' | 'danger' | 'warning' | 'success'

const config: Record<Variant, { border: string; value: string; bg: string }> = {
  neutral:  { border: 'border-l-slate-300',  value: 'text-ink',     bg: '' },
  primary:  { border: 'border-l-primary',    value: 'text-primary', bg: 'bg-blue-50/40' },
  danger:   { border: 'border-l-danger',     value: 'text-danger',  bg: 'bg-red-50/40' },
  warning:  { border: 'border-l-warning',    value: 'text-warning', bg: 'bg-amber-50/40' },
  success:  { border: 'border-l-success',    value: 'text-success', bg: 'bg-emerald-50/40' },
}

export default function KpiCard({ label, value, sub, variant = 'neutral' }: {
  label: string; value: string; sub?: string; variant?: Variant
}) {
  const { border, value: valueColor, bg } = config[variant]
  return (
    <div className={`${bg || 'bg-surface'} rounded-xl border border-border border-l-4 ${border} px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-150`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{label}</p>
      <p className={`text-4xl font-bold tracking-tight leading-none ${valueColor}`}>{value}</p>
      {sub && <p className="text-sm text-muted mt-2">{sub}</p>}
    </div>
  )
}
