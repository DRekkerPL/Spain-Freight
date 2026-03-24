import KpiCard from '@/components/KpiCard'
import ProfileTable from '@/components/ProfileTable'
import SimulationCompare from '@/components/SimulationCompare'
import BucketChart from '@/components/BucketChart'
import OrderLossChart from '@/components/OrderLossChart'
import { kpiSummary, profiles, simulation, buckets, orderLoss } from '@/data/bechtle'

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-surface rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
}

function CardHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {action && <span className="text-xs text-muted">{action}</span>}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-base">B</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-ink">Bechtle ES</span>
              <span className="text-border text-xl">|</span>
              <span className="text-xl font-medium text-muted">Margin Initiative</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted bg-subtle border border-border px-3 py-1.5 rounded-lg">2025 YTD</span>
            <span className="text-sm font-medium text-primary bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">EET Spain · Confidential</span>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-8 pb-3">
          <p className="text-xs text-muted">Spain · Customer Profile Analysis · Logistics €10.04 / LU · Small basket &lt;€75 · Bechtle Direct (9136402341)</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-10">

        {/* KPIs */}
        <Section title="Overview" description="Key metrics for 2025 year-to-date">
          <div className="grid grid-cols-4 gap-4">
            <KpiCard label="Total Shipments" value="2,760" sub="2025 year to date" variant="neutral" />
            <KpiCard label="Loss-Making" value="1,678" sub="60.8% of all shipments" variant="danger" />
            <KpiCard label="Small Basket (< €75)" value="1,281" sub="46.4% of all shipments" variant="warning" />
            <KpiCard label="GP Margin" value="14.0%" sub="€91K GP on €651K revenue" variant="primary" />
          </div>
        </Section>

        {/* Chart */}
        <Section title="Loss by Basket Size" description="Profitable vs loss-making shipments across basket size segments">
          <Card>
            <CardHeader title="Order Loss by Basket Size" action="2025 YTD · shipments" />
            <OrderLossChart data={orderLoss} />
          </Card>
        </Section>

        {/* Two-col */}
        <div className="grid grid-cols-[5fr_7fr] gap-6 items-start">
          <Section title="Pricing Profiles" description="Click a column header to sort">
            <Card>
              <ProfileTable data={profiles} />
            </Card>
          </Section>

          <div className="flex flex-col gap-6">
            <Section title="Fix Simulation" description="Apply system price profile — GP impact on 2025 order volumes">
              <Card><SimulationCompare data={simulation} /></Card>
            </Section>
            <Section title="Margin by Cost Bucket" description="Avg GP% before and after applying system profile">
              <Card>
                <CardHeader title="Before vs After — average margin %" action="system profile applied" />
                <BucketChart data={buckets} />
              </Card>
            </Section>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between">
          <span className="text-xs text-muted">Bechtle Direct · 9136402341 · EET Spain</span>
          <span className="text-xs text-muted">Logistics €10.04/LU · Small basket &lt;€75 · Ratio filter ≤2.5×</span>
        </div>
      </footer>
    </div>
  )
}
