import KpiCard from '@/components/KpiCard'
import ProfileTable from '@/components/ProfileTable'
import SimulationCompare from '@/components/SimulationCompare'
import BucketChart from '@/components/BucketChart'
import OrderLossChart from '@/components/OrderLossChart'
import { kpiSummary, profiles, simulation, buckets, orderLoss } from '@/data/bechtle'

function Section({
  title, description, children, accent = 'blue',
}: {
  title: string; description?: string; children: React.ReactNode; accent?: 'blue' | 'green' | 'sand'
}) {
  const bar = accent === 'green' ? 'bg-ok' : accent === 'sand' ? 'bg-brand-sand' : 'bg-accent'
  return (
    <section className="flex flex-col gap-4">
      <div className={`border-l-4 ${bar} pl-4`}>
        <h2 className="text-2xl font-bold text-text">{title}</h2>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-border shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-faint">
      <span className="text-base font-semibold text-text">{title}</span>
      {sub && <span className="text-sm text-muted">{sub}</span>}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header — brand blue */}
      <header className="bg-accent px-10 py-7 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Bechtle ES</h1>
            <span className="text-2xl font-light text-white/40 mx-1">|</span>
            <span className="text-2xl font-semibold text-white/90">Margin Initiative</span>
          </div>
          <p className="text-sm text-white/70 mt-2 tracking-wide">
            Spain · Customer Profile Analysis · 2025 YTD · Logistics €10.04 / LU · Small basket &lt;€75
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 bg-white/10 border border-white/20 px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-brand-sage inline-block" />
            EET Spain · Confidential
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-10 py-10 flex flex-col gap-12">

        {/* ── KPIs ── */}
        <Section
          title="Order Loss Overview"
          description="2025 YTD · Bechtle Direct (9136402341)"
          accent="blue"
        >
          <div className="grid grid-cols-4 gap-5">
            <KpiCard
              label="Total Shipments"
              value={kpiSummary.totalShipments.toLocaleString()}
              sub="2025 year to date"
            />
            <KpiCard
              label="Loss-Making Shipments"
              value={kpiSummary.lossMakingShipments.toLocaleString()}
              sub={`${kpiSummary.lossMakingPct}% of all shipments`}
              variant="negative"
            />
            <KpiCard
              label="Small Basket (< €75)"
              value={kpiSummary.smallBasketShipments.toLocaleString()}
              sub={`${kpiSummary.smallBasketPct}% of all shipments`}
              variant="warn"
            />
            <KpiCard
              label="Current GP Margin"
              value={`${kpiSummary.gpMarginPct}%`}
              sub={`€${(kpiSummary.totalGP / 1000).toFixed(0)}K GP · €${(kpiSummary.totalRevenue / 1000).toFixed(0)}K revenue`}
              variant="accent"
            />
          </div>
        </Section>

        {/* ── Order Loss Chart ── */}
        <Section
          title="Loss Analysis by Basket Size"
          description="Breakdown of profitable vs loss-making shipments across basket size segments · 2025 YTD"
          accent="blue"
        >
          <Card>
            <CardHeader
              title="Order Loss by Basket Size"
              sub="shipments · profitable vs loss-making"
            />
            <OrderLossChart data={orderLoss} />
          </Card>
        </Section>

        {/* ── Profiles + Simulation ── */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-8 items-start">

          <Section
            title="Active Pricing Profiles"
            description="Excluding partner programmes · click column header to sort"
            accent="sand"
          >
            <Card>
              <ProfileTable data={profiles} />
            </Card>
          </Section>

          <div className="flex flex-col gap-8">
            <Section
              title="Fix Simulation"
              description="GP impact of applying the system price profile to all active profiles"
              accent="green"
            >
              <Card>
                <SimulationCompare data={simulation} />
              </Card>
            </Section>

            <Section
              title="Margin by Cost Bucket"
              description="Average GP margin before and after applying the system price profile"
              accent="blue"
            >
              <Card>
                <CardHeader
                  title="Before vs After — avg margin %"
                  sub="system price profile applied"
                />
                <BucketChart data={buckets} />
              </Card>
            </Section>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-accent/5 border-t border-border px-10 py-5 flex justify-between items-center flex-shrink-0">
        <span className="text-sm text-muted">Bechtle Direct · 9136402341 · EET Spain</span>
        <span className="text-sm text-muted">Logistics: €10.04 / LU · Small basket: &lt;€75 · Ratio filter: ≤2.5×</span>
      </footer>

    </div>
  )
}
