// ============================================================
// BECHTLE DASHBOARD — Data
// Source: SQL results from bechtle_dashboard_v2.sql
// Customer: BECHTLE DIRECT (9136402341) · 2025 YTD
// ============================================================

export interface KpiSummary {
  totalShipments: number
  lossMakingShipments: number
  lossMakingPct: number
  smallBasketShipments: number
  smallBasketPct: number
  totalRevenue: number
  totalGP: number
  gpMarginPct: number
  totalLogisticsCost: number
  netProfit: number
  avgBasketSize: number
}

export interface OrderLossBucket {
  basketSize: string
  shipments: number
  lossMaking: number
  lossMakingPct: number
  avgRevenue: number
  avgGP: number
  avgLogisticsCost: number
  avgNetProfit: number
  totalGP: number
  totalLogisticsCost: number
  totalNetProfit: number
}

export interface ProfileRow {
  profile: string
  shipments: number
  smallBasketShipments: number
  smallBasketPct: number
  marginPct: number
  totalRevenue: number
  turnoverSharePct: number
  suggestion: string
}

export interface SimulationRow {
  scenario: string
  items: number
  revenue: number
  grossProfit: number
  marginPct: number
  deltaRevenue: number
  deltaGP: number
}

export interface BucketRow {
  costBucket: string
  items: number
  orderLines: number
  avgCurrentMargin: number
  avgNewMargin: number
  marginDiffPp: number
}

// ── Result 1: KPI Summary ─────────────────────────────────────
export const kpiSummary: KpiSummary = {
  totalShipments: 2760,
  lossMakingShipments: 1678,
  lossMakingPct: 60.8,
  smallBasketShipments: 1281,
  smallBasketPct: 46.4,
  totalRevenue: 650625.51,
  totalGP: 91240.49,
  gpMarginPct: 14.0,
  totalLogisticsCost: 144254.72,
  netProfit: -53014.23,
  avgBasketSize: 235.73,
}

// ── Result 2: Loss by basket size ────────────────────────────
export const orderLoss: OrderLossBucket[] = [
  { basketSize: '1. <€50',     shipments: 952,  lossMaking: 952,  lossMakingPct: 100.0, avgRevenue: 28.4,  avgGP: 3.1,   avgLogisticsCost: 10.0, avgNetProfit: -6.9,  totalGP: 2951.2,   totalLogisticsCost: 9520.0,  totalNetProfit: -6568.8  },
  { basketSize: '2. €50-100',  shipments: 329,  lossMaking: 328,  lossMakingPct: 99.7,  avgRevenue: 72.1,  avgGP: 9.8,   avgLogisticsCost: 10.0, avgNetProfit: -0.2,  totalGP: 3224.2,   totalLogisticsCost: 3290.0,  totalNetProfit: -65.8    },
  { basketSize: '3. €100-200', shipments: 418,  lossMaking: 322,  lossMakingPct: 77.0,  avgRevenue: 143.6, avgGP: 18.9,  avgLogisticsCost: 10.0, avgNetProfit: 8.9,   totalGP: 7900.2,   totalLogisticsCost: 4180.0,  totalNetProfit: 3720.2   },
  { basketSize: '4. €200-500', shipments: 601,  lossMaking: 76,   lossMakingPct: 12.6,  avgRevenue: 299.2, avgGP: 42.1,  avgLogisticsCost: 20.1, avgNetProfit: 22.0,  totalGP: 25302.1,  totalLogisticsCost: 12080.1, totalNetProfit: 13222.0  },
  { basketSize: '5. €500+',    shipments: 460,  lossMaking: 0,    lossMakingPct: 0.0,   avgRevenue: 1191.0,avgGP: 173.2, avgLogisticsCost: 32.1, avgNetProfit: 141.1, totalGP: 79672.8,  totalLogisticsCost: 14764.0, totalNetProfit: 64908.8  },
]

// ── Result 3: Profile analysis ────────────────────────────────
export const profiles: ProfileRow[] = [
  { profile: 'PVP_ES',              shipments: 214,  smallBasketShipments: 153, smallBasketPct: 71.5, marginPct: 19.5, totalRevenue: 27539.28,  turnoverSharePct: 4.2,  suggestion: 'Suggestion: Review — small basket >40%'       },
  { profile: 'SCPP-HP PROJECT',     shipments: 829,  smallBasketShipments: 439, smallBasketPct: 53.0, marginPct: 10.7, totalRevenue: 160115.69, turnoverSharePct: 24.6, suggestion: 'Suggestion: Review — small basket >40%'       },
  { profile: 'BECHTLE NO_FREIGHT_1',shipments: 1460, smallBasketShipments: 636, smallBasketPct: 43.6, marginPct: 15.1, totalRevenue: 359782.33, turnoverSharePct: 55.3, suggestion: 'Suggestion: Review — small basket >40%'       },
  { profile: 'BECHTLE_UBIQUITI',    shipments: 39,   smallBasketShipments: 5,   smallBasketPct: 12.8, marginPct: 9.4,  totalRevenue: 33824.72,  turnoverSharePct: 5.2,  suggestion: 'Suggestion: Review — margin below 10%'       },
  { profile: 'BECHTLE_PRICES',      shipments: 88,   smallBasketShipments: 0,   smallBasketPct: 0.0,  marginPct: 17.2, totalRevenue: 24619.74,  turnoverSharePct: 3.8,  suggestion: 'Suggestion: Remove — low turnover share (<4%)' },
  { profile: 'PHILIPS PREMIUM',     shipments: 7,    smallBasketShipments: 0,   smallBasketPct: 0.0,  marginPct: 7.6,  totalRevenue: 12543.00,  turnoverSharePct: 1.9,  suggestion: 'Suggestion: Remove — low turnover share (<4%)' },
  { profile: 'POS-SPAIN',           shipments: 3,    smallBasketShipments: 0,   smallBasketPct: 0.0,  marginPct: 20.0, totalRevenue: 243.72,    turnoverSharePct: 0.0,  suggestion: 'Suggestion: Remove — low turnover share (<4%)' },
]

// ── Result 6: Simulation overall ─────────────────────────────
export const simulation: SimulationRow[] = [
  { scenario: 'Current — all profiles', items: 255, revenue: 590893.75, grossProfit: 61512.16,  marginPct: 10.4, deltaRevenue: 0,         deltaGP: 0         },
  { scenario: 'After — system profile', items: 255, revenue: 632250.78, grossProfit: 102869.19, marginPct: 16.3, deltaRevenue: 41357.03,  deltaGP: 41357.03  },
]

// ── Result 7: Simulation by cost bucket ──────────────────────
export const buckets: BucketRow[] = [
  { costBucket: '1. <€5',      items: 2,  orderLines: 4,   avgCurrentMargin: 18.4, avgNewMargin: 35.7, marginDiffPp: 17.2 },
  { costBucket: '2. €5-10',    items: 17, orderLines: 134, avgCurrentMargin: 8.7,  avgNewMargin: 28.2, marginDiffPp: 19.6 },
  { costBucket: '3. €10-20',   items: 51, orderLines: 521, avgCurrentMargin: 12.4, avgNewMargin: 25.9, marginDiffPp: 13.6 },
  { costBucket: '4. €20-50',   items: 55, orderLines: 522, avgCurrentMargin: 14.9, avgNewMargin: 25.0, marginDiffPp: 10.1 },
  { costBucket: '5. €50-100',  items: 43, orderLines: 351, avgCurrentMargin: 15.0, avgNewMargin: 17.5, marginDiffPp: 2.5  },
  { costBucket: '6. €100-200', items: 45, orderLines: 415, avgCurrentMargin: 11.8, avgNewMargin: 16.2, marginDiffPp: 4.4  },
  { costBucket: '7. €200-500', items: 37, orderLines: 314, avgCurrentMargin: 10.4, avgNewMargin: 15.6, marginDiffPp: 5.2  },
  { costBucket: '8. €500+',    items: 5,  orderLines: 17,  avgCurrentMargin: 11.5, avgNewMargin: 16.7, marginDiffPp: 5.2  },
]

// ── Constants ─────────────────────────────────────────────────
export const LOGISTICS_COST = 10.04
export const SMALL_BASKET_THRESHOLD = 75
export const CUSTOMER_NAME = 'Bechtle Direct'
export const CUSTOMER_NO = '9136402341'
export const YEAR = 2025
