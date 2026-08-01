# The first send from workagedleads.com

One-time broadcast. Goes out **before** normal sending resumes on the new domain,
and before any lifecycle or course email fires from it.

## The list is 2,435, and 90% of it never subscribed to a newsletter

Measured against the Resend API on 2026-08-01, after Bill's decision to fold the
ALS programs into one list:

| Audience | Total | Sendable | Unsub |
|---|---:|---:|---:|
| `workagedleads.com` — merged newsletter | 250 | 218 | 32 |
| `ALS Aged-Lead Buyers — Purchasers` | 1,029 | 1,023 | 6 |
| `ALS Aged-Lead Buyers — Inquiries` | 1,245 | 1,236 | 9 |
| `ALS Store Self-Serve — Inquiries` | 31 | 31 | 0 |
| **One list, deduplicated** | **2,435** | **2,388** | **47** |

The three ALS programs hold 2,205 distinct addresses. Only **20** of them are
already on the newsletter list, so folding them in adds **2,185 net new people**
— and it means **90% of the one list has no newsletter relationship at all.**
Their relationship is with Aged Lead Store: they bought leads, or asked about
buying them, and opted into the newsletter during that process.

That is the fact the copy has to be built around, and it is a different fact from
the one this file was written against yesterday.

> **Correction.** An earlier version of this file said "the lists are small,
> which helps — at a couple hundred addresses, domain warming is a much smaller
> problem than recognition." That was true of 250. It is not true of 2,388
> sendable on a domain with no sending history. See **Staging** below.

## Why this send exists

Nobody on this list subscribed to "Work Aged Leads." The newsletter minority
subscribed to Aged Lead Sales or How To Work Leads. The buyer majority
subscribed at an Aged Lead Store checkout or inquiry form and has, in most cases,
never seen either site.

So the first send from the new domain reaches a list where almost everyone has
consented and almost nobody will recognise the sender. Consent is not
recognition, and it is recognition that decides whether someone hits report-spam.
A new sending domain has no reputation to spend, and complaints on the first send
set inbox placement for every send after it.

The fix is editorial: name the relationship the reader actually has, in the
from-name, the subject line, and the first two sentences.

## Audiences

| Audience | ID |
|---|---|
| `workagedleads.com` (destination) | `43fe6675-cc8f-44f3-9c1c-70a094b2d47d` |
| `agedleadsales-newsletter` (merged in) | `d579bf1f-0467-45a3-ad6b-52460920a903` |
| `howtoworkleads-newsletter` (merged in) | `8a35228e-149f-4b15-8e24-26a24e3d6e98` |
| `ALS Aged-Lead Buyers — Purchasers` | `9657093e-99fe-4a34-9846-946be85b64f7` |
| `ALS Aged-Lead Buyers — Inquiries` | `83613b84-c1fd-4362-9dd1-8914533e30f8` |
| `ALS Store Self-Serve — Inquiries` | `74476de7-677f-4686-bfb9-d6fe66a5d855` |

> **Editor note — for Builder.** The Resend account holds audiences for several
> other properties. The migration should touch exactly these six IDs.

## Headers

```
From:      Bill Rice <bill@workagedleads.com>
Reply-To:  bill@billricestrategy.com
```

The person is the continuity. Every one of these audiences has had mail from
Bill Rice; none has seen "Work Aged Leads."

`bill@workagedleads.com` is send-only. Replies route to
`bill@billricestrategy.com`, which is the inbox that already receives the
`/contact` form. No new mailbox.

> **Editor note.** Set the Reply-To explicitly on the broadcast. If it is left
> unset, replies go to an address nobody monitors — which is the same failure the
> trust pages had until PR #52.

## Staging

Do not send 2,388 in one shot from a domain with no history. Split by audience,
oldest relationship first, and stop if complaints move:

1. **Day 1 — the newsletter minority, 218 sendable.** These are the people most
   likely to recognise the sender. They are the warm-up and the canary.
2. **Day 3 — ALS Purchasers, ~1,023.** People who actually bought. Strongest
   relationship on the buyer side.
3. **Day 5 — ALS Inquiries + Self-Serve, the remainder.** Weakest relationship,
   sent last, once the domain has two clean sends behind it.

Between each stage, check complaint rate and hard bounces. **A complaint rate at
or above 0.1% is the stop signal** — that is Google's published threshold, and
crossing it on a new domain is expensive to undo. If it trips, stop and reassess
rather than continuing on schedule.

Nothing else — not the weekly newsletter, not the flagship course, not the ALS
lifecycle — fires from the new domain until all three stages are clean.

## Sequence

1. Verify `workagedleads.com` as a Resend sending domain. (Done —
   `435a8cd1-0e4e-41c9-8227-1650e5e253f2`.)
2. Merge all source audiences into `43fe6675-…`. **Carry the unsubscribed flag
   across** — anyone who opted out of any source list must arrive opted out. A
   merge that resets suppression is a re-subscribe, and it is the one error here
   that cannot be undone.
3. De-duplicate. 20 addresses sit on both the newsletter and an ALS program.
4. Send this broadcast in the three stages above. Nothing else.
5. Watch complaints and bounces for 48 hours after the final stage.
6. Only then repoint `RESEND_AUDIENCE_ID` and `RESEND_FROM_EMAIL` and let the
   other programs resume.

## Subject line

**Primary:**

```
Where your aged-lead emails come from now
```

**Alternate, if you want the brands named:**

```
Aged Lead Sales and How To Work Leads are now one thing
```

I recommend the primary now that the list composition is known. The alternate
names two brands that 90% of this list has never interacted with — it was the
right subject when the list was 250 newsletter subscribers and it is the wrong
one at 2,435. The primary works for a buyer and for a subscriber equally, because
"aged-lead emails" is the thing all of them actually signed up for.

## Preview text

```
Two sites merged into one. Same person, same archive, new address.
```

## Copy

---

**This is Bill Rice. The address changed; nothing else did.**

You are getting this because you either subscribed to one of my newsletters —
Aged Lead Sales or How To Work Leads — or you opted in while buying or asking
about leads at Aged Lead Store. Either way, this is the same person you heard
from before, at a new address.

Here is what changed. Aged Lead Sales and How To Work Leads were two separate
sites. One covered working leads: scripts, cadences, CRM setup, the work of
reaching someone weeks after they filled out a form. The other covered buying
them: what leads cost, which providers sell them, how the vendors compare.

They are now one site, **Work Aged Leads**, and every article from both is at
that one address. Old links redirect.

The split never matched how the job works. You can't judge what a lead is worth
without knowing what it takes to work one, and you can't build a cadence without
knowing what you paid. Answering one question meant visiting two sites.

**What this means for you:**

- Mail now comes from workagedleads.com. Worth adding to your contacts so it
  keeps landing in your inbox.
- If you were on more than one of these lists, the duplicates stop.
- Nothing else changes.

[**Start here →**]

*Not what you signed up for? Unsubscribe — one click, and it is better for both
of us than sending this to spam.*

---

**CTA destination:** `/start-here` — "Start Here — Your Complete Guide to Working
Aged Leads." It is the orientation page, which is the right landing for a list
where most people have never seen the site.

## Notes on the copy

**One job, one CTA.** The job is recognition. The first line is the sender's
name, not the new brand — for 90% of this list the brand is the unfamiliar part
and the person is not.

**The second paragraph names the reason they are receiving it**, covering both
origins in one sentence. Telling someone why an email is in their inbox is the
single most effective anti-complaint move available, and on a list this
heterogeneous it cannot be left implicit.

**The CTA is a link, not a reply.** Bill's call, and it is the right one: there
is no monitored `bill@workagedleads.com` and no reason to create one for
occasional replies. An earlier version of this file argued for a reply CTA on
inbox-placement grounds. Superseded.

**The unsubscribe line is prominent and is deliberately not the CTA.** An easy
visible exit converts a would-be spam complaint into a clean unsubscribe. With
2,185 people who have never seen this brand, that trade is worth more here than
it would be on a warm list. It sits below the CTA and in smaller type.

**What is deliberately not in here.** No subscriber counts, no "you asked for
this," no claim about send frequency, no first-person claim about Bill reading
replies. Every factual statement is one that can be verified: the two sites
merged, both archives are at the new address, old links redirect, the lists are
becoming one.

## HTML

Matches the house template in `app/api/newsletter/route.ts` — 600px table, same
gradient header, same type scale. Paste into a Resend broadcast and set the
Reply-To header.

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
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #111827;">This is Bill Rice. The address changed; nothing else did.</p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                You are getting this because you either subscribed to one of my newsletters &mdash; Aged Lead Sales or How To Work Leads &mdash; or you opted in while buying or asking about leads at Aged Lead Store. Either way, this is the same person you heard from before, at a new address.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Here is what changed. Aged Lead Sales and How To Work Leads were two separate sites. One covered working leads: scripts, cadences, CRM setup, the work of reaching someone weeks after they filled out a form. The other covered buying them: what leads cost, which providers sell them, how the vendors compare.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                They are now one site, <strong style="color: #111827;">Work Aged Leads</strong>, and every article from both is at that one address. Old links redirect.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                The split never matched how the job works. You can&rsquo;t judge what a lead is worth without knowing what it takes to work one, and you can&rsquo;t build a cadence without knowing what you paid. Answering one question meant visiting two sites.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 6px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #111827;">What this means for you</p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>Mail now comes from workagedleads.com.</strong> Worth adding to your contacts so it keeps landing in your inbox.
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>If you were on more than one of these lists, the duplicates stop.</strong>
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">
                      <strong>Nothing else changes.</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0 0 0;">
                <tr>
                  <td style="border-radius: 6px; background-color: #2563eb;">
                    <a href="https://workagedleads.com/start-here" style="display: inline-block; padding: 13px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Start here &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0 0; font-size: 15px; line-height: 1.6; color: #111827;">
                &mdash; Bill
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 28px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #6b7280; font-style: italic;">
                Not what you signed up for?
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #6b7280;">Unsubscribe</a>
                &mdash; one click, and it is better for both of us than sending this to spam.
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
> unsubscribe merge tag. Confirm it renders in a test send before the real one.
> On this particular email, to this particular list, a broken unsubscribe is the
> worst available outcome.
