# Cross-sell component

Reusable section for protocol and formula PDPs: “Explore other protocols” with quiz CTA, protocol cards, and formulas showcase.

## Location

`app/components/crossSell/` — `CrossSell.tsx` (wrapper), `CrossSellDesktop.tsx`, `CrossSellMobile.tsx`, `types.ts`, `index.ts`.

## Usage

**Protocol page:** show other protocols + quiz CTA + formulas showcase.

```tsx
<CrossSell variant="protocol" currentProtocolId={protocolId} />
```

**Formula page:** show quiz CTA + all protocol cards + formulas showcase (and optional secondary link to the other formula).

```tsx
<CrossSell variant="formula" currentFormulaId="01" />  // or "02"
```

## Behaviour

- **Wrapper** uses `useIsMobile(1024)` and renders `CrossSellDesktop` or `CrossSellMobile`.
- **Protocol variant:** heading “Explore Other Protocols”, subline “find your perfect match”, **Take the Quiz** button (link to `/quiz`), grid/carousel of other protocol cards (`ProtocolCard` / `ProtocolCardMobile`), then `FormulasShowcase` / `FormulasShowcaseMobile`.
- **Formula variant:** same CTA above protocols as protocol variant — heading “Explore Other Protocols”, subline “find your perfect match”, **Take the Quiz** button (link to `/quiz`). A secondary line “Want the complete experience? [Explore CONKA Clear / Explore CONKA Flow]” links to the other formula (we never offer the current formula on its own page: Flow page never promotes Flow, Clarity page never promotes Clear). Then grid/carousel of all four protocol cards, then formulas showcase.
- Protocol IDs and copy live in the component; formula “other” mapping and links (`/conka-flow`, `/conka-clarity`) are internal.

## Dependencies

Uses `protocolSelectorData`, `ProtocolCard`, `ProtocolCardMobile`, `FormulasShowcase`, `FormulasShowcaseMobile`. `VALID_PROTOCOL_IDS` is in `types.ts`.
