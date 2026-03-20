# Bechtle ES — Margin Initiative Dashboard

Spain customer profile analysis and margin improvement simulation.

## Stack

- **Next.js 14** (App Router, static export)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (available for additional charts)
- **Vercel** deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx          ← Main dashboard page
    layout.tsx        ← Root layout
    globals.css       ← Design tokens, fonts
  components/
    KpiCard.tsx       ← KPI metric card
    ProfileTable.tsx  ← Pricing profile analysis table
    SimulationCompare.tsx  ← Before/After fix simulation
    BucketChart.tsx   ← Cost bucket margin chart
  data/
    bechtle.ts        ← All dashboard data (typed constants)
sql/
  bechtle_dashboard_v2.sql  ← SQL to regenerate data from database
```

## Updating Data

1. Run `sql/bechtle_dashboard_v2.sql` against the production database
2. Paste each result set into the matching sheet in `Bechtle_Dashboard_Data.xlsx`
3. Update the constants in `src/data/bechtle.ts` with new values
4. Push to GitHub — Vercel auto-deploys

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Or connect the GitHub repo to Vercel via the Vercel dashboard for automatic deployments on push.

## Data Sources

| Sheet | SQL Result | Description |
|-------|-----------|-------------|
| 1_Summary | Result 1 | KPI totals |
| 2_OrderLoss | Result 2 | Loss by basket size |
| 3_Profiles | Result 3 | Profile analysis |
| 4_Items | Result 4 | Item detail |
| 5_Brands | Result 5 | Brand summary |
| 6_Simulation | Result 6 | Before vs after |
| 7_Buckets | Result 7 | By cost bucket |
| 8_ItemSim | Result 8 | Item simulation |
| 9_BelowCost | Result 9 | Below cost items |

## Key Parameters

- **Customer**: BECHTLE DIRECT (9136402341)
- **Year**: 2025
- **Logistics cost**: €10.04 per logistical unit
- **Small basket threshold**: €75
- **Bechtle PriceConfigNo**: 65377
- **Dummy system PriceConfigNo**: 65578
- **Ratio filter**: system price / Bechtle price ≤ 2.5×

## Next Steps

- [ ] Add remaining 4 customers (Solitium, Servicios, Suministros, Markit)
- [ ] Customer selector dropdown
- [ ] Aggregate Spain total view
- [ ] Below-cost items table
- [ ] Item simulation detail table
