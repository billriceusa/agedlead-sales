# Click Loop ledger

Operating record for the growth cycle in [`CLICK-LOOP.md`](../../CLICK-LOOP.md).
JSON has no comments, so the row shape lives here.

## Why this file exists

Step 6 of the loop kills any asset earning under 3 affiliate clicks/month, and the
monthly engine review reallocates effort by measured clicks-per-asset. Both need a
record that survives context windows and sessions. Without it the loop drifts back
into publishing on instinct — which is how the site accumulated 76 blog posts worth
34 clicks.

## `iterations[]` row

| field | meaning |
|---|---|
| `iteration` | Sequential integer. Iteration 0 is the unblock round. |
| `date` | ISO date the asset shipped. |
| `engine` | `merchant-intelligence` \| `live-data` \| `tools` \| `experiences` |
| `asset` | Path or slug of what shipped. |
| `targetCluster` | The query cluster it was built for. |
| `expected` | `{ D, P, C, clicksPerMonth }` — the step-2 score at pick time. Record the estimate even when it turns out wrong; the gap between expected and measured is how the scoring rule gets calibrated. |
| `measured` | `{ at2w, at8w }` — affiliate clicks from `affiliate.byPage30d` for this path. |
| `verdict` | `pending` \| `keep` \| `kill` |
| `notes` | Anything the next iteration needs to know. |

## `kills[]` row

`{ date, asset, engine, measured, reason }` — logged so a killed archetype does not
get quietly revived under a new name three months later.

## Discipline

- Append at step 1 of every iteration, before picking. Reading the scoreboard is
  what makes the pick honest.
- `measured` values come from the report, never from memory or estimate.
- A `null` click rate in the report means GA4 had clicks but no pageview denominator
  for that path. Carry the `null` through — do not substitute zero.
