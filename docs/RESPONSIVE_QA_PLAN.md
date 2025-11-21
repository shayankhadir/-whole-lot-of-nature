# Responsive QA Plan

## Automation helper

1. Start the Next.js server locally (`npm run dev` or `npm run start` after `build`).
2. Run `npm run qa:responsive`.
3. Screenshots for `/`, `/shop`, `/about`, `/account`, `/plantsy`, `/cart` are saved to `qa/screenshots/` for mobile, tablet, desktop, and XL breakpoints.
4. Drop the screenshots into Notion or Linear issues when flagging layout regressions.

Set `BASE_URL` if you want to audit a deployed environment:

```
BASE_URL=https://staging.wholelotofnature.com npm run qa:responsive
```

## Manual sweep checklist

| Area | Devices | What to look for |
| --- | --- | --- |
| Hero & navigation | iPhone 14 Pro, Pixel 7, iPad Mini | Ensure CTA buttons stay above the fold, floating nav doesn't overlap Plantsy widget. |
| Product carousels | Mobile + desktop | Confirm Keen slider arrows remain tappable and cards keep equal heights. |
| Popup & modals | Mobile Safari | Newsletter popup and Plantsy chat should not lock scroll. |
| Checkout funnel | Desktop + tablet | Cart sidebar, `/checkout`, and shipping estimator align with keyboard-safe areas. |
| Admin/Account | Desktop | New dashboard loads order data without layout shift. |

## Suggested tooling

- Percy or Chromatic for visual snapshots (hook into CI later).
- BrowserStack for physical device verification (especially low-power Android).
- Lighthouse (mobile/desktop) for CLS + layout metrics—add to `npm run perf:analyze` once blockers are fixed.
