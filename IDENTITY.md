# ZEKOCARDS — Visual & Product Identity

> **This file is immutable.** Everything written here is a fixed decision.
> Future sessions may add features, pages and drills, but must not change,
> "modernise" or override anything in this document. If a new feature seems
> to require breaking a rule here, the feature is wrong, not the rule.

---

## 1. What Zekocards is

A free browser card game for learning **hiragana, katakana and kanji** by
repetition. It is a study tool with the manners of a quiet stationery shop,
not a gamified app.

**Name:** `zekocards` — always lowercase in the wordmark, capitalised as
"Zekocards" in prose. Japanese subtitle: `ゼコカード`.

**Non-negotiable product promises**

| Promise | Meaning |
|---|---|
| Free forever | No account, no login, no payment, no paywalled content. |
| Local only | All state lives in `localStorage`. Nothing is ever sent anywhere. |
| No network dependency | The app must keep working with the network switched off. |
| English UI, Japanese subject | Interface language is English; the content taught is Japanese. |
| Nothing outside the selection | No exercise may ever show a sound or word the learner has not selected. |
| No elimination answers | Never a shortlist. The answer pad always shows **every symbol in the script**, reshuffled every question. |
| Answers are Japanese | Answers are given as kana, or as an English meaning. **Romaji is never a valid answer** — typing "ka" trains the wrong skill. |

---

## 2. Palette — fixed

| Token | Name | Hex | Role |
|---|---|---|---|
| `--mint` | Menta | `#F2FAEF` | Page ground, inverted text |
| `--aqua` | Isla Acuática | `#A7DADC` | Secondary surfaces, mascot fur, accents |
| `--wedge` | Wedgewood | `#447A9C` | Primary action, links, meters |
| `--cello` | Cello | `#1D3658` | Ink, selected states, deep surfaces |

Derived tints (`--mint-deep`, `--aqua-soft`, `--wedge-deep`, `--cello-ink`, …)
are all mixed from these four and live in `src/lib/styles/tokens.css`.

**How the palette is applied (revised):** the page ground is near-white
(`--bg: #fdfffc`), and Menta is used as the *tint* — section bands, sunken
surfaces, card metadata rows. The app must read as white paper with mint and
aqua accents, never as a blue-green wash. `--bg-tint` and `--bg-sunken` carry
the colour; large flat areas do not.

**The single exception:** `--hanko` `#C4573F`, a vermilion borrowed from the
Japanese seal stamp. It exists only so "wrong" is distinguishable from "right"
for colour-blind and low-vision users. It is used **only** for error states and
the seal motif — never as decoration, never as a brand colour.

Rules:
- No colour may be hardcoded in a component. Everything comes from a token.
- No generic gradients. The only gradients allowed are the washi-paper grain in
  `base.css`, the seigaiha wave pattern, and mask fades.
- No glow, neon, drop-shadow colour or "shiny" text. Shadows are soft and blue-grey.

---

## 3. Typography — fixed

- **Display / headings / mascot:** `Zen Maru Gothic` (rounded, friendly, has kana).
- **UI / body:** `Zen Kaku Gothic New`.
- **Japanese text:** `Zen Maru Gothic` via the `.jp` class, always.

Scale rules:
- This is a learning toy, not a document. Base body text is `1.125rem`,
  headings are large and tight, and the display face carries weight 700–800.
  If a screen starts to read like a Word document, the type is too small.
- Headings may break lines by hand for rhythm; one clause per line.
- A key phrase in a heading may be wrapped in `<em>` — it renders in
  `--wedge` with an aqua highlight bar behind it. That is the only
  decorative type treatment allowed.

Rules:
- Headings are tight (`--lh-tight`), body is generous (`--lh-body`).
- Eyebrows/labels are uppercase, letter-spaced, small, in `--wedge`.
- Never centre long paragraphs. Never use all-caps for sentences.
- Kana and kanji are always set in the `.jp` class so they never fall back to
  a system serif.

---

## 4. Zeko — the mascot

Zeko is a **Japanese macaque** built entirely from CSS boxes
(`src/lib/components/Zeko.svelte`). No SVG, no images, no sprite sheets.

- Fur: `--aqua`; shading `--wedge-soft`; face patch `--mint`; ink `--cello`.
- Wears a `--cello` hachimaki headband with a `--mint` dot.
- Drawn on a fixed **200 × 220** stage and scaled by `--k` so one component
  serves every size from a 42px header chip to a 280px hero.
- Moods: `idle · happy · cheer · wrong · think · read · sleep`.
  Each mood is a CSS class on the wrapper. **Mood animations must stay on the
  wrapper element** — putting them on `.stage` overwrites the scale transform.

Rules:
- Zeko never nags and never guilt-trips.
- Zeko reacts, he does not reward. No confetti, no coins, no badges.
- Zeko is never redrawn in a different medium (no illustration, no PNG).
- **Zeko is present and interactive on every main screen** via
  `ZekoSpeak.svelte`: a speech bubble plus a poke target that cycles his mood
  and his line. Lines are page-specific, short, and dry. In drills he reacts
  to the answer (`そう！` / `ちがう`) from `DrillFrame`.

---

## 4b. Surfaces, buttons and menus — the game-piece language

Everything interactive is a solid object with a visible bottom edge; it
depresses when pressed. This is the whole reason the app does not read as a
document.

- `.btn` — chunky, coloured, `box-shadow: 0 var(--lift) 0 <edge>`, and on
  `:active` it translates down by `--lift` and loses the shadow. Variants:
  solid (Wedgewood), `--soft` (aqua), `--ink` (Cello), `--ghost` (white),
  sizes `--sm --lg --xl`.
- `.tab` — square-ish (`--r-tab`) filter control with a 3px bottom edge.
  Filters are **never** pill-shaped and never fully rounded.
- `.tile` — the menu button of the app: thick border, `--r-tile` radius,
  bottom edge, lifts and rotates slightly on hover.
- `.seg` — segmented switch used for script and level选択.
- Panels and cards use 2–3px borders and a solid bottom edge, not soft
  drop-shadows alone.

**Layout law:** every main screen is a *menu*, not a stacked document.
Horizontal rails (`.rail`), tab-switched groups and staggered grids are the
default; long vertical stacks of full-width panels are not. Blocks are
deliberately knocked off the grid line (`.tilt-l`, `.nudge-down`, per-child
`margin-top`), so nothing lines up like a form.

## 4c. Choreography

- `Reveal.svelte` drifts blocks in as they enter the viewport (up / left /
  right / scale / tilt), staggered by index. It always carries a visibility
  safety net: content must never stay invisible if observers fail.
- Modals (`Modal.svelte`) are **centred floating panels**. Side drawers are
  not used anywhere in this product.
- `Motif.svelte` scatters CSS-drawn Japanese objects (torii, koi, lantern,
  sakura, fan, daruma, cloud, onigiri, wave) around every screen at odd
  angles and low opacity. Each page gets its own motifs, matched to its
  subject.

## 5. Iconography

One family only: `src/lib/components/Icon.svelte`.

- 24 × 24 grid, stroke-only, `stroke-linecap: round`, weight ~1.7.
- Motifs are Japanese objects — torii, brush, seal, sakura, Fuji, wave, koi,
  lantern, tea, fan, bamboo, mochi — plus the minimum neutral UI set.
- **Emoji are forbidden anywhere in the interface.** No exceptions.
- Adding an icon means adding a path to `ICONS` in the same style. Never import
  a second icon library.

---

## 6. Motion

All keyframes live in `src/lib/styles/animations.css`, prefixed `zk-`.

- Motion is ambient and slow: floating, swaying, drifting, blinking, breathing.
- Feedback motion is short and physical: `zk-pop`, `zk-shake`, `zk-hop`.
- Easing: `--ease-out` for entrances, `--ease-spring` for interactions.
- `prefers-reduced-motion` reduces every duration to ~0 in `tokens.css`.
  This must never be bypassed.

Scenery (Fuji, torii, pagoda, bamboo, koi, seigaiha sea, clouds, petals) is
drawn only with CSS boxes and gradients — `Scenery.svelte`, `Petals.svelte`.

---

## 7. Tone of voice

Plain, dry, encouraging without flattery. It respects the learner's time and
says what the app does and refuses to do.

- Good: "Miss it and you type the answer before moving on."
- Bad: "Amazing job!! 🎉 You're on fire!!"

No exclamation-mark enthusiasm, no streak guilt, no "don't lose your progress"
pressure, no dark patterns of any kind.

**Do not advertise the ethics.** The app is free, accountless and local-only,
but that is not a slogan and must not be repeated across the interface. It is
stated once, in the letter (`#letter` on the home page, opened from a small
envelope and linked discreetly from the footer). Everywhere else the app just
teaches.

---

## 8. Layout & component law

- All shared classes live in `components.css` (`.panel .btn .chip .field .tag
  .meter .grid-auto .scroll`). Components consume them.
- A component may only add **structural** CSS of its own (position, size,
  grid) — never new colour values, radii or shadows.
- Everything must work at 400px wide. The page never scrolls horizontally;
  wide tables scroll inside their own `.scroll` container.
