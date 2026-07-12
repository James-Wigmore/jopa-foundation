# Connecting the forms — one setting, covers every form on the site

Every form on the site — the 4 forms on Contact (Volunteer, Partner,
Donate, General Inquiry), the newsletter form on News, and the
newsletter signup in the footer (which appears on *every* page) — is
now wired to **Formspree** from a single, shared place: `js/script.js`.
You only need to configure this once.

## Setup (takes about 3 minutes)

1. Go to https://formspree.io and sign up for a free account.
2. Click **"New Form"**, name it (e.g. "JOPA Foundation Website"), and
   set the destination email to `admin@jopafoundation.org` (or wherever
   you want submissions to land).
3. Formspree gives you an endpoint like:
   `https://formspree.io/f/abcdwxyz`
   The part after `/f/` — `abcdwxyz` — is your **form ID**.
4. Open `js/script.js` and find this line near the top:
   ```js
   const FORMSPREE_ID = "YOUR_FORM_ID_HERE";
   ```
   Replace it with your real ID:
   ```js
   const FORMSPREE_ID = "abcdwxyz";
   ```
5. Save, commit, push. That's it — every form on every page now submits
   through this one connection. There is nothing to configure
   per-page anymore.

## How submissions are labeled

Every form includes a hidden `_subject` field, so even though they all
share one Formspree form/inbox, the email subject line tells you which
form it came from — e.g. "New volunteer application", "New partnership
inquiry", "New donation intent", "New newsletter signup".

## What's already built in

- One shared handler (`wireUpForms()` in `js/script.js`) finds and
  wires up every `<form data-form-name="...">` on the page — including
  the footer's newsletter form, which loads asynchronously (it waits
  for the site's `includes:loaded` event, so it never misses the
  footer being injected).
- Each form points at its own success message via a
  `data-success-target="..."` attribute, matched to a
  `data-success-for="..."` element elsewhere on the page — explicit and
  easy to trace, not dependent on where things sit in the HTML.
- Submit buttons show "Sending..." and disable while submitting, so
  people don't double-click.
- If the request fails (offline, wrong ID, etc.), the person sees a
  friendly error pointing them to `admin@jopafoundation.org` directly,
  instead of the form silently failing.
- If you forget to paste in the ID, submitting shows a clear alert
  telling you exactly that, instead of pretending to send.

## If you want separate inboxes per form later

Formspree's free plan supports one form/one destination email; a paid
plan lets you create multiple forms with different destination emails.
If you get there, give the specific form(s) you want split out their
own `data-form-name`/endpoint handling — ask if you'd like help wiring
that up.

## Donations specifically

The Donate form only **records intent** (amount, frequency, preferred
payment method) — it does not process real payment. When you're ready
to accept live donations, look at **Flutterwave** or **Pesapal**, both
of which support Mobile Money (MTN/Airtel) and card payments in Uganda.
