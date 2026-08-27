# Case studies (FormulaCaseStudies)

Single component that shows athlete case-study cards (photo, metrics, improvements) filtered by product: formula or protocol.

## Location

`app/components/FormulaCaseStudies.tsx` (desktop + mobile), `app/lib/caseStudiesData.ts` (data + filters).

## Usage

Pass **either** `productId` **or** `formulaId` so the component knows which athletes to show.

**By product (protocol or formula):**

```tsx
<FormulaCaseStudies productId={protocolId} />   // "1" | "2" | "3" | "4"
<FormulaCaseStudies productId="01" />           // Flow
<FormulaCaseStudies productId="02" />           // Clear
```

**By formula only:**

```tsx
<FormulaCaseStudies formulaId="01" />
<FormulaCaseStudies formulaId="02" />
```

Optional: pass a pre-filtered `athletes` array to override the data source.

## How data is chosen

- **`productId`** (preferred):  
  - `"03"` (Both) → `getAthletesForBoth()`  
  - `"01"` | `"02"` → `getAthletesForFormula(productId)`
- **`formulaId`** (no productId): `getAthletesForFormula(formulaId)`  
- **`athletes`**: if provided, used as-is (no filter).

**In `caseStudiesData.ts`:**

- **`getAthletesForFormula("01" | "02")`** — keeps athletes where `productVersion === formulaId` or `"both"`, sorted by average improvement; falls back to default athletes if fewer than 3.
- **`getAthletesForBoth()`** — the Both (`"03"`) equivalent: draws across both formulas rather than filtering to one, sorted by improvement.

Each athlete has `productVersion` (`"01"` | `"02"` | `"both"`) and optional `protocolUsed`; filters use these to match the current PDP.
