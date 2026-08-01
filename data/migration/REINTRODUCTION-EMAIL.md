# The first send from workagedleads.com

One-time broadcast. Goes out **before** normal sending resumes on the new domain,
and before any lifecycle or course email fires from it.

## Why this exists

Nobody on either list subscribed to "Work Aged Leads." They subscribed to Aged
Lead Sales or How To Work Leads. The moment sending moves, a merged list receives
mail from an unfamiliar brand at an unfamiliar domain — which reads as a cold
send even though every address on it is opted in.

That matters more than usual here because a brand-new sending domain has no
reputation to spend. Spam complaints on the first send are what decide inbox
placement for every send after it. The fix is editorial, not technical: say who
this is in the from-name, the subject line, and the first sentence.

The lists are small, which helps. The plan records the agedleadsales audience at
**216 contacts, 32 unsubscribed** (Phase 0 item 4). At a few hundred addresses,
domain warming is a much smaller problem than it would be at scale — the
recognition problem is the real one.

## Audiences

| Audience | ID |
|---|---|
| `workagedleads.com` (destination, created 2026-08-01) | `43fe6675-cc8f-44f3-9c1c-70a094b2d47d` |
| `agedleadsales-newsletter` (source) | `d579bf1f-0467-45a3-ad6b-52460920a903` |
| `howtoworkleads-newsletter` (source) | `8a35228e-149f-4b15-8e24-26a24e3d6e98` |

> **Editor note — for Builder.** The Resend account holds audiences for several
> other properties. The merge must target exactly these three IDs. Nothing else
> in that account is in scope for this migration.

> **Editor note — for Bill.** Phase 0 item 4 exports only the agedleadsales
> audience. There are two source lists. The howtoworkleads one is unexported and
> was not recorded anywhere until now. Both are the rollback backstop.

## Sequence

1. Verify workagedleads.com as a Resend sending domain. Do not proceed until it
   verifies.
2. Merge both source audiences into `43fe6675-…`. Carry the unsubscribed flag
   across — anyone who opted out of either old list must arrive opted out. A
   merge that resets suppression is the one mistake here that cannot be undone.
3. De-duplicate. Subscribers on both lists exist and must not receive two copies.
4. Send this broadcast. Nothing else.
5. Watch complaints and bounces for 48 hours before resuming the weekly
   newsletter, the flagship course, or the ALS lifecycle from the new domain.
6. Only then repoint `RESEND_AUDIENCE_ID` and `RESEND_FROM_EMAIL`.

## From name

```
Bill Rice <bill@workagedleads.com>
```

The person is the continuity. Both old lists received mail from Bill Rice;
neither has ever seen "Work Aged Leads." Lead with the name that is already
recognised.

> **Editor note.** `bill@workagedleads.com` has to exist and accept replies
> before this sends. The CTA below is a reply. It is also the contact address
> now published on `/methodology` and `/affiliate-disclosure`.

## Subject line

**Primary:**

```
Aged Lead Sales and How To Work Leads are now one thing
```

**Alternate, if you want the new name in the subject:**

```
Same newsletter, new name: Work Aged Leads
```

I recommend the primary. It names both old brands, which is the entire job of
this subject line — a reader scanning an inbox has to recognise something. The
alternate leads with a name nobody knows yet and spends the recognition on the
back half.

## Preview text

```
Two sites merged. Same author, same archive, one address.
```

## Copy

---

**Two things changed. One didn't.**

Aged Lead Sales and How To Work Leads are now a single site: **Work Aged Leads**.
Same author, same archive, one address.

If you signed up at How To Work Leads, you came for the sales side — scripts,
cadences, CRM setup, the work of reaching someone weeks after they filled out a
form. If you signed up at Aged Lead Sales, you came for the buying side — what
leads actually cost, which providers sell them, and how the vendors compare.

Both keep running. That is the reason to merge them rather than pick one. You
can't judge what a lead is worth without knowing what it takes to work one, and
you can't build a cadence without knowing what you paid. Keeping the two apart
meant visiting two sites to answer one question.

**What this means for you:**

- Nothing to do. You are on one list now instead of two. If you were on both,
  the duplicates stop.
- Mail now comes from workagedleads.com. Worth adding to your contacts so it
  keeps landing in your inbox.
- Everything published on either site is at the new address. Old links redirect.

**Hit reply and tell me what you're working on** — which vertical, and where your
follow-up is breaking down. That is what decides what I write next.

*Would rather not hear from me at the new address? Unsubscribe here. It takes one
click and it is better for both of us than sending me to spam.*

---

## Notes on the copy

**One job, one CTA.** The job is recognition: answer "who is this and why is it
in my inbox" in the first two lines. The CTA is a reply.

**Why a reply and not a link to the site.** On a domain with no sending history,
replies are the strongest positive signal available for inbox placement, and this
is the one send where the whole list is being asked to re-recognise the sender.
A click-through to the new site would be the obvious CTA and it is the weaker
one. Swap it if you disagree — it is a two-line change.

**Why the unsubscribe line is prominent and not a CTA.** An easy visible exit
converts a would-be spam complaint into a clean unsubscribe. On a new sending
domain that trade is strongly in your favour. It sits below the CTA and in
smaller type so it does not compete for the primary action.

**What is deliberately not in here.** No subscriber counts, no "you asked for
this," no claim about how often the newsletter goes out. Every factual claim in
the copy is one I could verify: the two sites merged, both archives are at the
new address, old links redirect, the two lists are becoming one.

## HTML

Matches the house template in `app/api/newsletter/route.ts` — 600px table, the
same gradient header, same type scale. Paste into a Resend broadcast.

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">Work Aged Leads</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Sales training from someone who actually dials</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #111827;">Two things changed. One didn&rsquo;t.</p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Aged Lead Sales and How To Work Leads are now a single site:
                <strong style="color: #111827;">Work Aged Leads</strong>. Same author, same archive, one address.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                If you signed up at How To Work Leads, you came for the sales side &mdash; scripts, cadences, CRM setup, the work of reaching someone weeks after they filled out a form. If you signed up at Aged Lead Sales, you came for the buying side &mdash; what leads actually cost, which providers sell them, and how the vendors compare.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Both keep running. That is the reason to merge them rather than pick one. You can&rsquo;t judge what a lead is worth without knowing what it takes to work one, and you can&rsquo;t build a cadence without knowing what you paid. Keeping the two apart meant visiting two sites to answer one question.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 6px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #111827;">What this means for you</p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>Nothing to do.</strong> You are on one list now instead of two. If you were on both, the duplicates stop.
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>Mail now comes from workagedleads.com.</strong> Worth adding to your contacts so it keeps landing in your inbox.
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>Everything published on either site is at the new address.</strong> Old links redirect.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 15px; line-height: 1.6; color: #374151;">
                <strong style="color: #111827;">Hit reply and tell me what you&rsquo;re working on</strong> &mdash; which vertical, and where your follow-up is breaking down. That is what decides what I write next.
              </p>

              <p style="margin: 24px 0 0 0; font-size: 15px; line-height: 1.6; color: #111827;">
                &mdash; Bill
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 28px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #6b7280; font-style: italic;">
                Would rather not hear from me at the new address?
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #6b7280;">Unsubscribe here</a>.
                It takes one click and it is better for both of us than sending me to spam.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

> **Editor note.** `{{{RESEND_UNSUBSCRIBE_URL}}}` is Resend's broadcast
> unsubscribe merge tag. Confirm it renders in a test send before the real one —
> a broken unsubscribe on this particular email is the worst possible version of
> this mistake.
