-- ============================================================
-- BECHTLE DASHBOARD DATA v2
-- 9 result sets for Excel — paste each into matching sheet
-- Customer: BECHTLE DIRECT (9136402341)
-- Logistics cost: €10.04 per logistical unit
-- Small basket threshold: €75
-- ============================================================

IF OBJECT_ID('tempdb..#ShipAgg')  IS NOT NULL DROP TABLE #ShipAgg;
IF OBJECT_ID('tempdb..#items')    IS NOT NULL DROP TABLE #items;
IF OBJECT_ID('tempdb..#sim')      IS NOT NULL DROP TABLE #sim;

DECLARE @CustomerNo      NVARCHAR(20)   = '9136402341';
DECLARE @LogisticsCost   DECIMAL(10,4)  = 10.04;
DECLARE @SmallBasket     DECIMAL(10,2)  = 75.00;
DECLARE @DummyConfig     INT            = 65578;
DECLARE @DummyCustNo     NVARCHAR(20)   = '501820094';
DECLARE @BechtleConfig   INT            = 65377;

-- ─────────────────────────────────────────────────────────────
-- STAGE 1: Shipment aggregation
-- ─────────────────────────────────────────────────────────────
SELECT
    sh.[No.]                                        AS ShipmentNo,
    sh.[Posting Date]                               AS PostingDate,
    MAX(il.[Calculated Code])                       AS CalcProfile,
    SUM(il.[Amount (LCY)])                          AS Revenue,
    SUM(il.[Order Profit Margin (LCY)])             AS GP,
    CEILING(SUM(il.[Quantity])) * @LogisticsCost    AS LogisticsCost,
    SUM(il.[Quantity])                              AS TotalQty,
    COUNT(DISTINCT il.[No.])                        AS UniqueItems,
    CASE
        WHEN SUM(il.[Amount (LCY)]) < @SmallBasket
        THEN 1 ELSE 0
    END                                             AS IsSmallBasket,
    CASE
        WHEN SUM(il.[Order Profit Margin (LCY)])
           < CEILING(SUM(il.[Quantity])) * @LogisticsCost
        THEN 1 ELSE 0
    END                                             AS IsLossMaking
INTO #ShipAgg
FROM [financialsdk].[dbo].[EET Spain$Sales Invoice Header]  ih
JOIN [financialsdk].[dbo].[EET Spain$Sales Invoice Line]    il
    ON il.[Document No.] = ih.[No.]
JOIN [financialsdk].[dbo].[EET Spain$Sales Shipment Line]   sl
    ON sl.[Item Shpt. Entry No.] = il.[Item Shpt. Entry No.]
JOIN [financialsdk].[dbo].[EET Spain$Sales Shipment Header] sh
    ON sh.[No.] = sl.[Document No.]
WHERE
    ih.[Sell-to Customer No.]   = @CustomerNo
    AND YEAR(ih.[Posting Date]) = 2025
    AND il.[Type]               = 2
    AND il.[Quantity]           > 0
    AND ISNULL(il.[RMA No], '') = ''
    AND il.[Posting Group]      = 'GOODS'
GROUP BY sh.[No.], sh.[Posting Date];

-- ─────────────────────────────────────────────────────────────
-- STAGE 2: Item aggregation — all profiles, >1 transaction
-- ─────────────────────────────────────────────────────────────
SELECT
    il.[No.]                                        AS ItemNo,
    MAX(il.[Description])                           AS ItemDesc,
    MAX(br.[Name])                                  AS BrandName,
    MAX(il.[Calculated Code])                       AS CurrentProfile,
    COUNT(*)                                        AS Lines,
    SUM(il.[Quantity])                              AS TotalQty,
    SUM(il.[Amount (LCY)])                          AS TotalRevenue,
    SUM(il.[Order Profit Margin (LCY)])             AS TotalGP
INTO #items
FROM [financialsdk].[dbo].[EET Spain$Sales Invoice Header]  ih
JOIN [financialsdk].[dbo].[EET Spain$Sales Invoice Line]    il
    ON ih.[No.] = il.[Document No.]
JOIN [financialsdk].[dbo].[EET Spain$Sales Shipment Line]   sl
    ON sl.[Item Shpt. Entry No.] = il.[Item Shpt. Entry No.]
LEFT JOIN [financialsdk].[dbo].[Brand]                      br
    ON br.[No.] = sl.[Brand No.]
LEFT JOIN [financialsdk].[dbo].[EET Spain$Item]             i
    ON i.[No.] = il.[No.]
WHERE
    ih.[Sell-to Customer No.]   = @CustomerNo
    AND YEAR(ih.[Posting Date]) = 2025
    AND il.[Type]               = 2
    AND il.[Quantity]           > 0
    AND ISNULL(il.[RMA No], '') = ''
    AND il.[Posting Group]      = 'GOODS'
    AND ISNULL(i.[Product Prices Exist], 0) = 1
GROUP BY il.[No.]
HAVING COUNT(*) > 1;

-- ─────────────────────────────────────────────────────────────
-- STAGE 3: Price simulation
-- ─────────────────────────────────────────────────────────────
SELECT
    T.*,
    ISNULL(cp.[CostPrice],   0)                     AS CostPrice,
    ISNULL(cp.[VendorPrice], 0)                     AS VendorPrice,
    [WebES].[dbo].[Price_CalcSalesPrice](
        @BechtleConfig, @CustomerNo, 'A', T.ItemNo, 1, 1
    )                                               AS BechtlePrice,
    [WebES].[dbo].[Price_CalcSalesPrice](
        @DummyConfig, @DummyCustNo, 'A', T.ItemNo, 1, 1
    )                                               AS SystemPrice
INTO #sim
FROM #items T
LEFT JOIN [WebES].[dbo].[Costprices] cp ON cp.[ItemNo] = T.ItemNo;


-- ═════════════════════════════════════════════════════════════
-- RESULT 1: KPI Summary  →  Sheet: 1_Summary
-- ═════════════════════════════════════════════════════════════
SELECT
    COUNT(*)                                        AS TotalShipments,
    SUM(IsLossMaking)                               AS LossMakingShipments,
    CAST(SUM(IsLossMaking) * 100.0
         / NULLIF(COUNT(*), 0)
                            AS DECIMAL(5,1))        AS LossMakingPct,
    SUM(IsSmallBasket)                              AS SmallBasketShipments,
    CAST(SUM(IsSmallBasket) * 100.0
         / NULLIF(COUNT(*), 0)
                            AS DECIMAL(5,1))        AS SmallBasketPct,
    CAST(SUM(Revenue)       AS DECIMAL(12,2))       AS TotalRevenue,
    CAST(SUM(GP)            AS DECIMAL(12,2))       AS TotalGP,
    CAST(SUM(GP) * 100.0
         / NULLIF(SUM(Revenue), 0)
                            AS DECIMAL(5,1))        AS GPMarginPct,
    CAST(SUM(LogisticsCost) AS DECIMAL(12,2))       AS TotalLogisticsCost,
    CAST(SUM(GP) - SUM(LogisticsCost)
                            AS DECIMAL(12,2))       AS NetProfit,
    CAST(AVG(Revenue)       AS DECIMAL(10,2))       AS AvgBasketSize
FROM #ShipAgg;


-- ═════════════════════════════════════════════════════════════
-- RESULT 2: Loss by basket size  →  Sheet: 2_OrderLoss
-- ═════════════════════════════════════════════════════════════
SELECT
    CASE
        WHEN Revenue < 50    THEN '1. <€50'
        WHEN Revenue < 100   THEN '2. €50-100'
        WHEN Revenue < 200   THEN '3. €100-200'
        WHEN Revenue < 500   THEN '4. €200-500'
        ELSE                      '5. €500+'
    END                                             AS BasketSize,
    COUNT(*)                                        AS Shipments,
    SUM(IsLossMaking)                               AS LossMaking,
    CAST(SUM(IsLossMaking) * 100.0
         / NULLIF(COUNT(*), 0)
                            AS DECIMAL(5,1))        AS LossMakingPct,
    CAST(AVG(Revenue)       AS DECIMAL(10,2))       AS AvgRevenue,
    CAST(AVG(GP)            AS DECIMAL(10,2))       AS AvgGP,
    CAST(AVG(LogisticsCost) AS DECIMAL(10,2))       AS AvgLogisticsCost,
    CAST(AVG(GP - LogisticsCost)
                            AS DECIMAL(10,2))       AS AvgNetProfit,
    CAST(SUM(GP)            AS DECIMAL(12,2))       AS TotalGP,
    CAST(SUM(LogisticsCost) AS DECIMAL(12,2))       AS TotalLogisticsCost,
    CAST(SUM(GP - LogisticsCost)
                            AS DECIMAL(12,2))       AS TotalNetProfit
FROM #ShipAgg
GROUP BY
    CASE
        WHEN Revenue < 50    THEN '1. <€50'
        WHEN Revenue < 100   THEN '2. €50-100'
        WHEN Revenue < 200   THEN '3. €100-200'
        WHEN Revenue < 500   THEN '4. €200-500'
        ELSE                      '5. €500+'
    END
ORDER BY BasketSize;


-- ═════════════════════════════════════════════════════════════
-- RESULT 3: Profile analysis  →  Sheet: 3_Profiles
-- Excludes: partner programmes (Reason Type=3)
--           system date profiles (e.g. 20241108.302)
-- ═════════════════════════════════════════════════════════════
SELECT
    sa.CalcProfile                                  AS Profile,
    COUNT(DISTINCT sa.ShipmentNo)                   AS Shipments,
    SUM(sa.IsSmallBasket)                           AS SmallBasketShipments,
    CAST(SUM(sa.IsSmallBasket) * 100.0
         / NULLIF(COUNT(DISTINCT sa.ShipmentNo), 0)
                                AS DECIMAL(5,1))    AS SmallBasketPct,
    CAST(SUM(sa.GP) * 100.0
         / NULLIF(SUM(sa.Revenue), 0)
                                AS DECIMAL(5,1))    AS MarginPct,
    CASE
        WHEN COUNT(DISTINCT sa.ShipmentNo) < 20
            THEN 'Suggestion: Remove — low number of orders'
        WHEN SUM(sa.GP) * 100.0
             / NULLIF(SUM(sa.Revenue), 0) < 10
            THEN 'Suggestion: Review — margin below 10%'
        WHEN SUM(sa.IsSmallBasket) * 100.0
             / NULLIF(COUNT(DISTINCT sa.ShipmentNo), 0) > 40
            THEN 'Suggestion: Review — small basket >40%'
        ELSE ''
    END                                             AS Suggestion
FROM #ShipAgg sa
JOIN [financialsdk].[dbo].[EET Spain$Customer Price Profile] pp
    ON pp.[Code] = sa.CalcProfile
WHERE sa.CalcProfile IS NOT NULL
  AND sa.CalcProfile <> ''
  AND ISNULL(pp.[Reason Type], 0) <> 3
  AND sa.CalcProfile NOT LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].%'
GROUP BY sa.CalcProfile
ORDER BY SUM(sa.IsSmallBasket) * 100.0
         / NULLIF(COUNT(DISTINCT sa.ShipmentNo), 0) DESC;


-- ═════════════════════════════════════════════════════════════
-- RESULT 4: Items & flags  →  Sheet: 4_Items
-- ═════════════════════════════════════════════════════════════
SELECT
    il.[No.]                                        AS ItemNo,
    MAX(il.[Description])                           AS ItemDesc,
    MAX(br.[Name])                                  AS BrandName,
    MAX(il.[Calculated Code])                       AS Profile,
    COUNT(*)                                        AS OrderLines,
    SUM(il.[Quantity])                              AS TotalQty,
    CAST(AVG(ISNULL(cp.[CostPrice], 0))
                                AS DECIMAL(10,2))   AS CostPrice,
    CAST(AVG(il.[Unit Price])   AS DECIMAL(10,2))   AS AvgSellPrice,
    CAST(AVG(il.[Order Profit Margin (LCY)])
         / NULLIF(AVG(il.[Amount (LCY)]), 0) * 100
                                AS DECIMAL(5,1))    AS AvgMarginPct,
    CAST(AVG(il.[Order Profit Margin (LCY)]
         / NULLIF(il.[Quantity], 0))
                                AS DECIMAL(10,2))   AS AvgGPPerUnit,
    CAST(@LogisticsCost         AS DECIMAL(10,2))   AS LogisticsCostPerLU,
    CAST(AVG(il.[Order Profit Margin (LCY)]
         / NULLIF(il.[Quantity], 0))
         - @LogisticsCost       AS DECIMAL(10,2))   AS AvgNetPerUnit,
    CAST(SUM(il.[Amount (LCY)]) AS DECIMAL(12,2))   AS TotalRevenue,
    CAST(SUM(il.[Order Profit Margin (LCY)])
                                AS DECIMAL(12,2))   AS TotalGP,
    CASE
        WHEN AVG(il.[Unit Price]) < AVG(ISNULL(cp.[CostPrice], 0))
            THEN 'BELOW COST'
        WHEN AVG(il.[Order Profit Margin (LCY)]
             / NULLIF(il.[Quantity], 0)) < @LogisticsCost
            THEN 'LOSS AFTER LOGISTICS'
        ELSE 'OK'
    END                                             AS Flag
FROM [financialsdk].[dbo].[EET Spain$Sales Invoice Header]  ih
JOIN [financialsdk].[dbo].[EET Spain$Sales Invoice Line]    il
    ON ih.[No.] = il.[Document No.]
JOIN [financialsdk].[dbo].[EET Spain$Sales Shipment Line]   sl
    ON sl.[Item Shpt. Entry No.] = il.[Item Shpt. Entry No.]
LEFT JOIN [financialsdk].[dbo].[Brand]                      br
    ON br.[No.] = sl.[Brand No.]
LEFT JOIN [WebES].[dbo].[Costprices]                        cp
    ON cp.[ItemNo] = il.[No.]
WHERE
    ih.[Sell-to Customer No.]   = @CustomerNo
    AND YEAR(ih.[Posting Date]) = 2025
    AND il.[Type]               = 2
    AND il.[Quantity]           > 0
    AND ISNULL(il.[RMA No], '') = ''
    AND il.[Posting Group]      = 'GOODS'
GROUP BY il.[No.]
HAVING COUNT(*) > 1
ORDER BY
    CASE
        WHEN AVG(il.[Unit Price]) < AVG(ISNULL(cp.[CostPrice], 0)) THEN 1
        WHEN AVG(il.[Order Profit Margin (LCY)]
             / NULLIF(il.[Quantity], 0)) < @LogisticsCost THEN 2
        ELSE 3
    END,
    SUM(il.[Order Profit Margin (LCY)]) ASC;


-- ═════════════════════════════════════════════════════════════
-- RESULT 5: Brand summary  →  Sheet: 5_Brands
-- ═════════════════════════════════════════════════════════════
SELECT
    MAX(br.[Name])                                  AS BrandName,
    MAX(il.[Calculated Code])                       AS PrimaryProfile,
    COUNT(DISTINCT il.[No.])                        AS UniqueItems,
    COUNT(*)                                        AS OrderLines,
    SUM(il.[Quantity])                              AS TotalQty,
    CAST(SUM(il.[Amount (LCY)])     AS DECIMAL(12,2)) AS TotalRevenue,
    CAST(SUM(il.[Order Profit Margin (LCY)])
                                    AS DECIMAL(12,2)) AS TotalGP,
    CAST(SUM(il.[Order Profit Margin (LCY)]) * 100.0
         / NULLIF(SUM(il.[Amount (LCY)]), 0)
                                    AS DECIMAL(5,1))  AS MarginPct,
    CAST(AVG(ISNULL(cp.[CostPrice], 0))
                                    AS DECIMAL(10,2)) AS AvgCostPrice,
    CAST(AVG(il.[Unit Price])       AS DECIMAL(10,2)) AS AvgSellPrice,
    CAST(SUM(il.[Order Profit Margin (LCY)])
         / NULLIF(SUM(il.[Quantity]), 0)
         - @LogisticsCost           AS DECIMAL(10,2)) AS AvgNetPerUnit,
    SUM(CASE WHEN il.[Unit Price] < ISNULL(cp.[CostPrice], 0)
             THEN 1 ELSE 0 END)                       AS BelowCostLines,
    SUM(CASE WHEN il.[Order Profit Margin (LCY)]
                  / NULLIF(il.[Quantity], 0) < @LogisticsCost
             THEN 1 ELSE 0 END)                       AS LossAfterLogisticsLines
FROM [financialsdk].[dbo].[EET Spain$Sales Invoice Header]  ih
JOIN [financialsdk].[dbo].[EET Spain$Sales Invoice Line]    il
    ON ih.[No.] = il.[Document No.]
JOIN [financialsdk].[dbo].[EET Spain$Sales Shipment Line]   sl
    ON sl.[Item Shpt. Entry No.] = il.[Item Shpt. Entry No.]
LEFT JOIN [financialsdk].[dbo].[Brand]                      br
    ON br.[No.] = sl.[Brand No.]
LEFT JOIN [WebES].[dbo].[Costprices]                        cp
    ON cp.[ItemNo] = il.[No.]
WHERE
    ih.[Sell-to Customer No.]   = @CustomerNo
    AND YEAR(ih.[Posting Date]) = 2025
    AND il.[Type]               = 2
    AND il.[Quantity]           > 0
    AND ISNULL(il.[RMA No], '') = ''
    AND il.[Posting Group]      = 'GOODS'
GROUP BY sl.[Brand No.]
ORDER BY SUM(il.[Amount (LCY)]) DESC;


-- ═════════════════════════════════════════════════════════════
-- RESULT 6: Simulation — overall  →  Sheet: 6_Simulation
-- Current vs After only — no excluded row
-- ═════════════════════════════════════════════════════════════
SELECT
    Scenario,
    Items,
    CAST(Revenue        AS DECIMAL(12,2))   AS Revenue,
    CAST(GP             AS DECIMAL(12,2))   AS GrossProfit,
    CAST(GP * 100.0
         / NULLIF(Revenue, 0)
                        AS DECIMAL(5,1))    AS MarginPct,
    CAST(DeltaRevenue   AS DECIMAL(12,2))   AS DeltaRevenue,
    CAST(DeltaGP        AS DECIMAL(12,2))   AS DeltaGP
FROM (
    SELECT
        '1. Current — all profiles'             AS Scenario,
        COUNT(*)                                AS Items,
        SUM(BechtlePrice * TotalQty)            AS Revenue,
        SUM((BechtlePrice - CostPrice) * TotalQty) AS GP,
        0                                       AS DeltaRevenue,
        0                                       AS DeltaGP
    FROM #sim
    WHERE BechtlePrice > 0 AND CostPrice > 0

    UNION ALL

    SELECT
        '2. After — system profile',
        COUNT(*),
        SUM(SystemPrice * TotalQty),
        SUM((SystemPrice - CostPrice) * TotalQty),
        SUM((SystemPrice - BechtlePrice) * TotalQty),
        SUM((SystemPrice - CostPrice) * TotalQty
            - (BechtlePrice - CostPrice) * TotalQty)
    FROM #sim
    WHERE BechtlePrice > 0
      AND SystemPrice > 0
      AND CostPrice > 0
      AND SystemPrice / NULLIF(BechtlePrice, 0) <= 2.5
) x;


-- ═════════════════════════════════════════════════════════════
-- RESULT 7: Simulation — by cost bucket  →  Sheet: 7_Buckets
-- ═════════════════════════════════════════════════════════════
SELECT
    CASE
        WHEN CostPrice < 5    THEN '1. <€5'
        WHEN CostPrice < 10   THEN '2. €5-10'
        WHEN CostPrice < 20   THEN '3. €10-20'
        WHEN CostPrice < 50   THEN '4. €20-50'
        WHEN CostPrice < 100  THEN '5. €50-100'
        WHEN CostPrice < 200  THEN '6. €100-200'
        WHEN CostPrice < 500  THEN '7. €200-500'
        ELSE                       '8. €500+'
    END                                                 AS CostBucket,
    COUNT(*)                                            AS Items,
    SUM(Lines)                                          AS OrderLines,
    SUM(TotalQty)                                       AS TotalUnits,
    CAST(AVG(CostPrice)             AS DECIMAL(10,2))   AS AvgCostPrice,
    CAST(AVG(BechtlePrice)          AS DECIMAL(10,2))   AS AvgCurrentPrice,
    CAST(AVG((BechtlePrice - CostPrice) * 100.0
         / NULLIF(BechtlePrice, 0))
                                    AS DECIMAL(5,1))    AS AvgCurrentMargin,
    CAST(AVG(SystemPrice)           AS DECIMAL(10,2))   AS AvgNewPrice,
    CAST(AVG((SystemPrice - CostPrice) * 100.0
         / NULLIF(SystemPrice, 0))
                                    AS DECIMAL(5,1))    AS AvgNewMargin,
    CAST(AVG((SystemPrice - CostPrice) * 100.0
         / NULLIF(SystemPrice, 0))
         - AVG((BechtlePrice - CostPrice) * 100.0
         / NULLIF(BechtlePrice, 0))
                                    AS DECIMAL(5,1))    AS MarginDiff_pp,
    CAST(SUM(BechtlePrice * TotalQty)   AS DECIMAL(12,2)) AS CurrentRevenue,
    CAST(SUM((BechtlePrice - CostPrice)
         * TotalQty)                AS DECIMAL(12,2))   AS CurrentGP,
    CAST(SUM(SystemPrice * TotalQty)    AS DECIMAL(12,2)) AS NewRevenue,
    CAST(SUM((SystemPrice - CostPrice)
         * TotalQty)                AS DECIMAL(12,2))   AS NewGP,
    CAST(SUM((SystemPrice - BechtlePrice)
         * TotalQty)                AS DECIMAL(12,2))   AS DeltaRevenue,
    CAST(SUM((SystemPrice - CostPrice) * TotalQty
         - (BechtlePrice - CostPrice) * TotalQty)
                                    AS DECIMAL(12,2))   AS DeltaGP,
    CAST(@LogisticsCost             AS DECIMAL(10,2))   AS LogisticsCostPerLU,
    CAST(AVG(BechtlePrice - CostPrice)
         - @LogisticsCost           AS DECIMAL(10,2))   AS AvgNetPerUnit_Before,
    CAST(AVG(SystemPrice - CostPrice)
         - @LogisticsCost           AS DECIMAL(10,2))   AS AvgNetPerUnit_After
FROM #sim
WHERE BechtlePrice > 0
  AND SystemPrice > 0
  AND CostPrice > 0
  AND SystemPrice / NULLIF(BechtlePrice, 0) <= 2.5
GROUP BY
    CASE
        WHEN CostPrice < 5    THEN '1. <€5'
        WHEN CostPrice < 10   THEN '2. €5-10'
        WHEN CostPrice < 20   THEN '3. €10-20'
        WHEN CostPrice < 50   THEN '4. €20-50'
        WHEN CostPrice < 100  THEN '5. €50-100'
        WHEN CostPrice < 200  THEN '6. €100-200'
        WHEN CostPrice < 500  THEN '7. €200-500'
        ELSE                       '8. €500+'
    END
ORDER BY CostBucket;


-- ═════════════════════════════════════════════════════════════
-- RESULT 8: Simulation — item list  →  Sheet: 8_ItemSim
-- Cost price + margins only — no prices, no revenue columns
-- ═════════════════════════════════════════════════════════════
SELECT
    ItemNo,
    ItemDesc,
    BrandName,
    CurrentProfile,
    Lines                                                   AS OrderLines,
    TotalQty,
    CAST(CostPrice                  AS DECIMAL(10,2))       AS CostPrice,
    CAST((BechtlePrice - CostPrice) * 100.0
         / NULLIF(BechtlePrice, 0)
                                    AS DECIMAL(5,1))        AS CurrentMarginPct,
    CAST((SystemPrice - CostPrice) * 100.0
         / NULLIF(SystemPrice, 0)
                                    AS DECIMAL(5,1))        AS NewMarginPct,
    CAST((SystemPrice - CostPrice) * 100.0 / NULLIF(SystemPrice, 0)
         - (BechtlePrice - CostPrice) * 100.0 / NULLIF(BechtlePrice, 0)
                                    AS DECIMAL(5,1))        AS MarginDiff_pp,
    CASE
        WHEN BechtlePrice < CostPrice    THEN 'BELOW COST'
        WHEN SystemPrice  < BechtlePrice THEN 'PRICE DROP'
        ELSE ''
    END                                                     AS Flag
FROM #sim
WHERE BechtlePrice > 0
  AND SystemPrice > 0
  AND CostPrice > 0
  AND SystemPrice / NULLIF(BechtlePrice, 0) <= 2.5
ORDER BY (SystemPrice - BechtlePrice) * TotalQty DESC;


-- ═════════════════════════════════════════════════════════════
-- RESULT 9: Below cost items  →  Sheet: 9_BelowCost
-- Items where current price < cost price — strongest MD argument
-- ═════════════════════════════════════════════════════════════
SELECT
    ItemNo,
    ItemDesc,
    BrandName,
    CurrentProfile,
    Lines                                                   AS OrderLines,
    TotalQty,
    CAST(CostPrice              AS DECIMAL(10,2))           AS CostPrice,
    CAST(VendorPrice            AS DECIMAL(10,2))           AS VendorPrice,
    CAST((BechtlePrice - CostPrice) * 100.0
         / NULLIF(BechtlePrice, 0)
                                AS DECIMAL(5,1))            AS CurrentMarginPct,
    CAST((SystemPrice - CostPrice) * 100.0
         / NULLIF(SystemPrice, 0)
                                AS DECIMAL(5,1))            AS NewMarginPct
FROM #sim
WHERE BechtlePrice > 0
  AND CostPrice > 0
  AND BechtlePrice < CostPrice
ORDER BY (BechtlePrice - CostPrice) * TotalQty ASC;


DROP TABLE #ShipAgg;
DROP TABLE #items;
DROP TABLE #sim;
