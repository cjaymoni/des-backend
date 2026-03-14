# Warehouse Model Analysis (VB6 Backend)

The warehouse functionality is not a standalone module — it's distributed across three key areas.

## 1. Core Data Table: `HouseManifest`

The warehouse model is built on top of the `HouseManifest` table. The key warehouse-specific field is:

- `ReadStatusW` — a flag (`'*'` = available for warehouse, `' '` = already processed). This is what distinguishes a "warehouse manifest" from a regular house manifest.

**HouseManifest fields relevant to warehouse:**

| Field | Type | Purpose |
|---|---|---|
| `Auto` | Long | PK |
| `HBLNo` | String (≤20) | House Bill of Lading number |
| `Consignee` | String | Consignee name |
| `Description` | String | Cargo description |
| `NoPkg` | Integer | Number of packages |
| `Weight` | Double | Cargo weight |
| `TotalCBM` | Double | Volume (cubic metres) |
| `ContainerNo` | String | Container number |
| `Vessel` | String | Vessel name |
| `BLNo` | String | Master BL number |
| `ReadStatusW` | String | Warehouse availability flag |
| `ReleaseStatus` | String | Release flag |

---

## 2. Warehouse Job File: `JobFiles_Rent` table

When a warehouse entry is processed, it creates a record in `JobFiles_Rent`.

| Field | Purpose |
|---|---|
| `JobNo` | Warehouse job number |
| `HBL` | Links back to HouseManifest.HBLNo |
| `ConsigneeDetails` | Consignee |
| `Weight`, `TotalCBM`, `NoPkg` | Cargo dimensions |
| `RentCharge` | Base rent/storage charge |
| `NetRentCharge` | Rent after deductions |
| `VatAmt`, `NHILAmt`, `GFDAmt`, `COVIDAmt` | Tax components |
| `GrandTotal` | Total payable |
| `Period`, `UnitCharge` | Charge calculation basis |
| `PaidStatus` | `'1'` = paid, `'0'` = unpaid |
| `CalcStatus` | Calculation state |
| `UnstuffDate`, `DlvDate`, `arrivaldt` | Key dates |
| `CargoType`, `CargoTypeAmt`, `CargoTypeLevel` | Cargo classification for surcharges |
| `incvatStatus` | Whether VAT is included |
| `VATinvoice` | Invoice reference |

---

## 3. Rent Charge Rate Table: `RentCharges`

Lookup table for charge rates by weight band:

| Field | Purpose |
|---|---|
| `PeriodFrom` / `PeriodTo` | Weight range |
| `UnitCharge` | Rate per unit |
| `TotalCharges` | Total for band |
| `FromTH` / `ToTH` | Threshold labels |

---

## 4. Workflow

```
HouseManifest (ReadStatusW='*')
        ↓  LoadWarehouseManifest() — filters by ReadStatusW='*'
   User selects HBL
        ↓
   RentCharges lookup by Weight → calculates Period × UnitCharge
        ↓
   JobFiles_Rent.SaveJobFile()
        ↓  sets HouseManifest.ReadStatusW=' ' (marks as processed)
        ↓
   SaveAgencyFeeAsIncome() → posts to IncomeExpenditure table
```

---

## 5. Key Business Rules

- Required fields: `HBL` (≤20 chars), `ConsigneeDetails`, `Weight` (numeric)
- Tax rates (`VATper`, `NHILper`, `GFDper`, `COVIDper`) are pulled from global settings at save time
- Previous rent history is aggregated via `LoadPrevRent()` — sums GrandTotal, Period, charges for same HBL where `PaidStatus='1'`
- Deleting a warehouse job also deletes the linked `IncomeExpenditure` record
- Job counter is tracked in `TCounter` table under `Name='JobNoRent'`

---

## 6. Migration Notes for NestJS

The warehouse model maps to roughly 3 entities:

1. `HouseManifest` — needs `readStatusW` and `releaseStatus` fields added
2. `WarehouseJob` (= `JobFiles_Rent`) — main warehouse transaction entity
3. `RentCharge` — rate lookup table (weight band → unit charge)

---

## 7. Warehouse Rent Charge Calculation

Warehouse rent charges represent the storage cost applied to goods that remain in a warehouse for a specific number of days. The charge is calculated based on the duration between the **Unstuffing Date** (goods arrive) and the **Delivery Date** (goods leave).

### Rent Charge Setup

The system uses a configurable bracket table. Each bracket defines:

| Field | Description |
|---|---|
| `DateDifferenceFrom` | Starting day of the charge bracket |
| `DateDifferenceTo` | Ending day of the charge bracket |
| `UnitCharge` | Charge applied per day within the range |

**Example configuration:**

| Date Diff From | Date Diff To | Unit Charge |
|---|---|---|
| 1 | 7 | 0.00 |
| 8 | 14 | 11.64 |
| 15 | 1000 | 23.27 |

### Calculation Algorithm

**Inputs:**
- `UnstuffingDate` — date goods arrive at the warehouse
- `DeliveryDate` — date goods leave the warehouse
- `RentChargeSetup` — bracket table sorted by `DateDifferenceFrom` ascending

**Steps:**
1. `totalDays = DeliveryDate - UnstuffingDate`
2. Fetch all configured brackets ordered by start day ascending
3. For each bracket, determine how many of the total days fall within that range
4. Multiply applicable days by the bracket's unit charge
5. Sum all bracket charges to get the final rent charge

**Pseudocode:**

```
function CalculateWarehouseRent(UnstuffingDate, DeliveryDate):
    totalDays = DateDifference(DeliveryDate, UnstuffingDate)
    rentSetups = GetRentChargeSetupOrderedByStartDay()
    totalCharge = 0

    for each setup in rentSetups:
        rangeStart = setup.DateDifferenceFrom
        rangeEnd   = setup.DateDifferenceTo
        unitCharge = setup.UnitCharge

        if totalDays < rangeStart:
            continue

        applicableStart = max(rangeStart, 1)
        applicableEnd   = min(rangeEnd, totalDays)
        daysInRange     = applicableEnd - applicableStart + 1

        if daysInRange > 0:
            totalCharge += daysInRange * unitCharge

    return totalCharge
```

### Example Calculation

**Input:**
- Unstuffing Date: 22 Nov 2024
- Delivery Date: 02 Jan 2025
- Total Days: **42**

**Processing:**

| Range | Days Applied | Unit Charge | Charge |
|---|---|---|---|
| Day 1–7 | 7 | 0.00 | 0.00 |
| Day 8–14 | 7 | 11.64 | 81.48 |
| Day 15–1000 | 28 | 23.27 | 651.56 |

**Total Rent Charge = GHC 733.04**

### Developer Notes

- Brackets must be fetched from the database — never hardcoded
- Sort brackets by `DateDifferenceFrom` before calculation
- Only charge for days that fall within each configured bracket
- Algorithm must support future pricing changes without code modification
