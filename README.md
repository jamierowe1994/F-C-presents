# Fine & Country — Private Presentation Demo

A pre-valuation presentation experience for Fine & Country. Sent to the client as a link ahead of their valuation appointment.

**Flow (desktop):** simulated MacBook desktop → Mail notification → branded email → cinematic welcome → six-slide presentation.
**Flow (mobile/tablet portrait):** iOS-style mail view → welcome → presentation with bottom navigation and swipe.

- `#presentation` or `?presentation` on the URL skips the intro.
- Personalisation (client name, address, appointment) lives in `js/app.js` (`CONFIG`) and the matching copy in `index.html`.
- Sample reviews on the closing slide are placeholders — replace with genuine client reviews.
- Agent photo and welcome video are placeholder slots.

## Run locally

```bash
python3 -m http.server 8765
```

or `npm install && npm start` (serves on `$PORT`, default 3000 — this is what Railway uses).
