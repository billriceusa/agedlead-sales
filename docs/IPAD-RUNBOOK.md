# Work Aged Leads — iPad Runbook

For running workagedleads.com from an iPad with no Mac, 2026-09-17 through 2026-09-30.
Written 2026-09-15.

Everything below works from Safari, the Gmail app, the GitHub app, and claude.ai. Nothing here
needs a terminal.

---

## What runs on its own while you are away

| when (UTC) | what | what you see |
|---|---|---|
| daily 10:00 | Commission report | email: "Affiliate commission — $N MTD" |
| daily 10:50 | Lifecycle mailer (welcome, replenishment, win-back) | nothing directly |
| daily 12:30 | Email program report | email: "Email program: N sent yesterday" |
| daily 13:00 | Cron health check | email only when something fails: "[ALERT] …" |
| Sun 09-20, 09-27 14:00 | Newsletter draft | email: "[PREVIEW] …" with a red Stop button |
| Tue 09-22, 09-29 13:00 | Newsletter send | goes to the list unless you pressed Stop |
| Sun 14:00 / Thu 13:00 weekly | Restock offer draft / send checks | nothing — they no-op until October |

The first restock offer drafts **2026-10-04** and sends **2026-10-08**, after you are back.

---

## Scenario 1 — a newsletter preview looks wrong

1. Open the "[PREVIEW]" email in Gmail.
2. Tap **Stop this issue**.
3. Done looks like a green page saying the issue will not send.

One tap, no login. Stopping is the safe direction: it cannot send anything. The issue does not go
out, and the next week's issue drafts normally.

---

## Scenario 2 — emergency stop for the lifecycle mailer

Use this if the daily email report shows a bounce-rate warning above 3%, a complaint arrives, or a
lifecycle email went out with something wrong in it. It stops all welcome, replenishment and
win-back sends. It does **not** touch the newsletter, which has its own Stop button.

1. In Safari, go to **vercel.com** and sign in.
2. Open the **agedlead-sales** project.
3. **Settings** → **Environment Variables**.
4. Find `ALS_LIFECYCLE_SEND_ENABLED`. Tap the **⋯** menu → **Edit**.
5. Change the value from `true` to `false`. **Save**. The mailer only sends when the value is exactly `true`.
6. Go to **Deployments**. On the top **Production** deployment, tap **⋯** → **Redeploy** → **Redeploy**.
   An environment change does nothing until a redeploy.
7. Wait for the deployment to show **Ready**, about three minutes.
8. Done looks like the next morning's "Email program" report showing **0 lifecycle emails sent**.

To turn it back on, repeat with `true`. The mailer picks up where it left off; it does not resend.

---

## Scenario 3 — an alert arrives

| alert | meaning | action |
|---|---|---|
| "[ALERT] Lead Price Index study … benchmarks are Nd old" | the quarterly price study is due | none while away — known and expected until the study is written |
| "[ALERT] … restock-offer-send" or "restock-offer-draft" | the weekly restock check stopped firing | none needed before October, but note it — the October 8 send will not happen unless fixed |
| "[ALERT] … als-lifecycle" | the mailer stopped running | no subscriber harm — it fails closed. Look at it when back |
| "[ALERT] … send-newsletter" or "weekly-newsletter" | an issue did not draft or send | no harm — nothing mailed. Look at it when back |
| "Email program … Bounce rate N% … above the 3% line" | mailbox providers may start throttling | if it repeats two days running, use Scenario 2 |

Every alert in this table means mail stopped, not that wrong mail went out. A missed send is
recoverable when you are back. A bad send is not, and no alert catches bad content, which is why
Scenario 2 exists and is the only urgent one.

---

## Scenario 4 — a reader or Troy needs a reply

1. In claude.ai, open a chat and say: *"Draft a reply to the latest email from [name] in my Gmail. Work Aged Leads scope."*
2. Review the draft in the Gmail app's **Drafts** folder.
3. Edit and send from Gmail.

Keep the standing rules in the prompt if it matters: no per-lead prices, never text purchased
leads, the store is a partner not us.

---

## Scenario 5 — fix a typo or fact on a blog post

Blog posts live in Sanity, which works in Safari.

1. Go to **workagedleads.com/studio** and sign in with Google as **bill@billrice.com**.
2. Open the post, make the change, tap **Publish**.
3. Wait five minutes, then load the page **twice**. The first load after an edit can still show the
   old copy while the cache refreshes; the second shows the new one.

Guides under `/guides/*` and lead-type pages are **not** in Sanity — they are code. Use Scenario 6.

---

## Scenario 6 — a code change is needed

For guide text, a broken page, or anything outside Sanity.

1. Open **claude.ai/code**, pick the **billriceusa/agedlead-sales** repository.
2. Describe the change. Ask it to open a **pull request**, not push to main.
3. Open the **GitHub** app → the repository → **Pull requests** → the new one.
4. Read the **Files changed** tab. If it looks right, tap **Merge pull request** → **Confirm**.
5. Vercel deploys main automatically. Done looks like the change live within about four minutes.

While away, always merge a pull request in the GitHub app. Never ask a cloud session to push to
main directly.

---

## Scenario 7 — Troy asks for a change on agedleadstore.com

Store pages are Troy's WordPress site, not this repository.

- A copy tweak you can do in the WordPress admin in Safari.
- Anything larger, reply that it will be done in the first week of October.

---

## Before you leave — readiness checks

| # | check | done looks like |
|---|---|---|
| T1 | The monitoring fix branch is merged to main | `lifecycle-welcome-phase2` shows no commits ahead of main |
| T2 | You can sign in to vercel.com on the iPad and see **Settings → Environment Variables** for agedlead-sales | the variable list loads |
| T3 | The GitHub app is signed in and shows the agedlead-sales repository | the repo opens |
| T4 | workagedleads.com/studio signs in on the iPad | the post list loads |
| T5 | claude.ai/code can open the agedlead-sales repository | a session starts on it |

Do **not** drill Scenario 2 for real. Flipping the variable and redeploying works; testing it
would stop a day of sends for nothing.
