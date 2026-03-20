'use client'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'positive' | 'negative' | 'accent'
}

const variantColors: Record<string, string> = {
  default:  'text-white',
  positive: 'text-ok',
  negative: 'text-danger',
  accent:   'text-accent',
}

export default function KpiCard({ label, value, sub, variant = 'default' }: KpiCardProps) {
  return (
    <div className="bg-surface hover:bg-surface2 transition-colors duration-200 p-6 flex flex-col gap-1.5">
      <div className="text-[0.62rem] tracking-[0.15em] uppercase text-muted font-mono">{label}</div>
      <div className={`font-syne text-[2rem] font-extrabold leading-none ${variantColors[variant]}`}>
        {value}
      </div>
      {sub && <div className="text-[0.65rem] text-muted font-mono">{sub}</div>}
    </div>
  )
}
