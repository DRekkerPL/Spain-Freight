import KpiCard from '@/components/KpiCard'
import ProfileTable from '@/components/ProfileTable'
import SimulationCompare from '@/components/SimulationCompare'
import BucketChart from '@/components/BucketChart'
import OrderLossChart from '@/components/OrderLossChart'
import { kpiSummary, profiles, simulation, buckets, orderLoss } from '@/data/bechtle'

function SectionLabel({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-syne text-[0.65rem] font-bold tracking-[0.2em] uppercase text-accent whitespace-nowrap">
        {children}
      </span>
      {sub && <span className="text-[0.6rem] text-muted">{sub}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border ${className}`}>
      {children}
    </div>
  )
}

function PanelHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-5 py-3 border-b border-border flex justify-between items-center">
      <span className="font-syne text-[0.75rem] font-bold tracking-[0.1em] uppercase text-text">
        {title}
      </span>
      {sub && <span className="text-[0.62rem] text-muted">{sub}</span>}
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative min-h-screen">

      {/* ── Header ── */}
      <header className="relative z-10 px-10 py-8 border-b border-border
                         flex items-end justify-between
                         bg-gradient-to-b from-[#0d0d0d] to-transparent">
        <div>
          <h1 className="font-syne text-[2rem] font-extrabold tracking-tight text-white leading-none">
            Bechtle <span className="text-accent">ES</span> — Margin Initiative
          </h1>
          <p className="mt-1.5 text-[0.68rem] tracking-[0.12em] uppercase text-muted">
            Spain · Customer Profile Analysis · 2025 YTD · Logistics €10.04/LU · Small basket &lt;€75
          </p>
        </div>
        <div className="text-[0.62rem] tracking-[0.1em] uppercase px-3 py-1.5
                        border border-border text-muted rounded-sm">
          EET Spain · Confidential
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-5 px-10 py-8 flex flex-col gap-8">

        {/* ── Section 1: KPIs ── */}
        <div>
          <SectionLabel>Current state — order loss overview</SectionLabel>
          <div className="grid grid-cols-4 gap-px bg-border border border-border">
            <KpiCard
              label="Total Shipments"
              value={kpiSummary.totalShipments.toLocaleString()}
              sub="2025 YTD"
            />
            <KpiCard
              label="Loss-Making Shipments"
              value={kpiSummary.lossMakingShipments.toLocaleString()}
              sub={`${kpiSummary.lossMakingPct}% of all shipments`}
              variant="negative"
            />
            <KpiCard
              label={`Small Basket (<€75)`}
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
        </div>

        {/* ── Section 2: Order Loss by Basket Size ── */}
        <div>
          <SectionLabel sub="shipments · 2025 YTD">Loss analysis by basket size</SectionLabel>
          <Panel>
            <PanelHead
              title="Order Loss by Basket Size"
              sub="profitable vs loss-making shipments"
            />
            <OrderLossChart data={orderLoss} />
          </Panel>
        </div>

        {/* ── Section 3: Profiles + Simulation ── */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-6 items-start">

          {/* Profile table */}
          <div>
            <SectionLabel sub="excl. partner programmes">
              Active pricing profiles
            </SectionLabel>
            <Panel>
              <PanelHead
                title="Profile Analysis"
                sub="ordered by small basket %"
              />
              <ProfileTable data={profiles} />
            </Panel>
          </div>

          {/* Right column: simulation + buckets */}
          <div className="flex flex-col gap-6">

            {/* Before / After */}
            <div>
              <SectionLabel>Fix simulation — apply system price profile</SectionLabel>
              <Panel>
                <SimulationCompare data={simulation} />
              </Panel>
            </div>

            {/* Cost buckets */}
            <div>
              <SectionLabel>Margin improvement by cost bucket</SectionLabel>
              <Panel>
                <PanelHead
                  title="Before vs After — avg margin %"
                  sub="system price profile applied"
                />
                <BucketChart data={buckets} />
              </Panel>
            </div>

          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-5 px-10 py-4 border-t border-border
                         flex justify-between items-center
                         text-[0.6rem] tracking-[0.1em] uppercase text-muted">
        <span>Bechtle Direct · 9136402341 · EET Spain</span>
        <span>Logistics: €10.04/LU · Small basket: &lt;€75 · Ratio filter: ≤2.5×</span>
      </footer>

    </div>
  )
}
