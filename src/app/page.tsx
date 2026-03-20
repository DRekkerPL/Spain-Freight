import KpiCard from '@/components/KpiCard'
import ProfileTable from '@/components/ProfileTable'
import SimulationCompare from '@/components/SimulationCompare'
import BucketChart from '@/components/BucketChart'
import OrderLossChart from '@/components/OrderLossChart'
import { kpiSummary, profiles, simulation, buckets, orderLoss } from '@/data/bechtle'

function Section({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-text">{title}</h2>
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
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
      <span className="text-sm font-semibold text-text">{title}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Top accent line */}
      <div className="h-1 bg-accent flex-shrink-0" />

      {/* Header */}
      <header className="bg-white border-b border-border px-10 py-6 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text">
              Bechtle <span className="text-accent">ES</span>
            </h1>
            <span className="text-2xl font-light text-border mx-1">|</span>
            <span className="text-xl font-semibold text-text">Margin Initiative</span>
          </div>
          <p className="text-xs text-muted mt-1.5 tracking-wide">
            Spain · Customer Profile Analysis · 2025 YTD · Logistics €10.04 / LU · Small basket &lt;€75
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted bg-faint border border-border px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-ok inline-block" />
            EET Spain · Confidential
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-10 py-10 flex flex-col gap-10">

        {/* ── KPIs ── */}
        <Section
          title="Order Loss Overview"
          description="2025 YTD · Bechtle Direct (9136402341)"
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
              variant="negative"
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
        <div className="grid grid-cols-[1fr_1.5fr] gap-6 items-start">

          <Section
            title="Active Pricing Profiles"
            description="Excluding partner programmes · click a column to sort"
          >
            <Card>
              <ProfileTable data={profiles} />
            </Card>
          </Section>

          <div className="flex flex-col gap-6">

            <Section
              title="Fix Simulation"
              description="GP impact of applying the system price profile to all active profiles"
            >
              <Card>
                <SimulationCompare data={simulation} />
              </Card>
            </Section>

            <Section
              title="Margin Improvement by Cost Bucket"
              description="Average GP margin before and after applying the system price profile"
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
      <footer className="bg-white border-t border-border px-10 py-4 flex justify-between items-center flex-shrink-0">
        <span className="text-xs text-muted">Bechtle Direct · 9136402341 · EET Spain</span>
        <span className="text-xs text-muted">Logistics: €10.04 / LU · Small basket: &lt;€75 · Ratio filter: ≤2.5×</span>
      </footer>

    </div>
  )
}
