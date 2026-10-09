# ZEKOCARDS — Visual & Product Identity

> **This file is the law.** Everything written here is a fixed decision.
> Future sessions may add features, pages and drills, but must not change,
> "modernise" or override anything in this document. If a new feature seems
> to require breaking a rule here, the feature is wrong, not the rule.
>
> **Revision 2 — Apple-guideline redesign.** The visual language moved from
> chunky "game pieces" to flat, glass and spring-animated surfaces that follow
> Apple's Human Interface Guidelines. Product promises (§1) and the palette are
> unchanged. §2, §3, §4, §4b, §4c, §6 and the new §9 were rewritten; the old
> rules they replace no longer apply.

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
| No elimination answers | Never a shortlist. The answer pad always shows a **complete section of the script** — see §1b. |
| Answers are Japanese | Answers are given as kana, or as an English meaning. **Romaji is never a valid answer** — typing "ka" trains the wrong skill. |

---

## 1b. Amendment — the pad, and what "hard" means

*Amended once, deliberately, on the owner's instruction. The promise did not
change; the mechanism did.*

The original wording made **reshuffling** part of the law: the pad showed every
symbol in the script, in a new order every question. In practice that turned a
question about *recall* into a task of *visual search* across 104 tiles. The
learner was not being asked whether they knew き; they were being asked to find
it. That is confusion, not difficulty, and it is not what this app is for.

The promise the rule exists to keep is **"no shortlist"** — the answer must never
be findable by elimination, by position, or by the shape of the options. That
promise survives untouched. What is now adjustable is how the same complete set
of symbols is *presented*:

| Dial | Options | Why it cannot give an answer away |
|---|---|---|
| **Clock** | none · generous · standard · merciless | Time pressure is orthogonal to the answer. Running out is a miss, never a skip. |
| **Pad order** | gojūon grid · shuffled | The grid holds exactly the same keys. Knowing that き sits in the か row, い column **is** Japanese literacy — it is how dictionaries, conjugation tables and the Japanese keyboard are organised. Ordering the pad teaches; it does not tell. |
| **Pad scope** | section · whole script | "Section" is every **complete group** the learner's selection reaches into — 46, then 71, then 104, then 128. It is a public rule about the learner, never about the answer, so no information leaks from it. It never narrows to the selection. |

Three presets carry the dials: **稽古 Learn**, **標準 Standard** (the default) and
**鬼 Oni** — Oni being the original behaviour, kept exactly as it was.

**What no dial may ever change**, and what the rest of this document still
governs absolutely:

- the pad is never a shortlist, and never shrinks to the learner's selection;
- a wrong answer never advances the question, and the right symbol must still
  be produced;
- romaji is never a valid answer;
- nothing outside the selection is ever *asked*.

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
- No decorative gradients. Allowed: the faint fixed ambient light in `base.css`
  (what the glass blurs), the seigaiha wave pattern, and mask fades.
- No glow, neon, drop-shadow colour or "shiny" text. Shadows are soft and blue-grey.
- **Dark mode** is part of the identity, not an add-on. It follows the system by
  default; the manual override (Automatic / Light / Dark) lives only in
  Progress → Settings and is never shown in the chrome. Dark mode *inverts the
  brand ramp* in `tokens.css` (Cello becomes the ground, Menta the ink); it
  never introduces a new hue.
- **Zeko never changes colour with the theme.** `Zeko.svelte` re-pins the brand
  tokens to their light values on its own root.

---

## 3. Typography

- **Interface, headings, body:** the platform font (`-apple-system` / SF Pro),
  so text follows each device. `Zen Kaku Gothic New` is only the fallback.
- **Wordmark and all Japanese:** `Zen Maru Gothic` (`--font-brand`, `.jp`), always.
- Headings are semibold/bold, tight tracking, `text-wrap: balance`. Body is 400–500.
- A key phrase in a heading may be wrapped in `<em>` — it renders in
  `--wedge` with an aqua highlight bar. That is the only decorative type treatment.

Rules:
- Headings are tight (`--lh-tight`), body is generous (`--lh-body`).
- Eyebrows are small and quiet. On main screens an eyebrow is just the kanji of
  the page (道場, 辞書…), never a second title.
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
- **Zeko is present on every main screen** via `ZekoSpeak.svelte`, but he is
  **quiet until poked**: no permanent speech bubble. A poke shows one short,
  dry, page-specific line for a few seconds and cycles his mood. Only an empty
  state may pass `always`. In drills he reacts to the answer (`そう！` /
  `ちがう`) from `DrillFrame`.

---

## 4b. Surfaces, buttons and menus — flat, glass, springy

Surfaces are flat and translucent; hierarchy comes from space, type and soft
shadow, not from borders.

- **Glass** (`.glass`, `.panel`, `.tile`, `.bubble`, header, modals, drill bar):
  `--glass-fill`, `saturate(180%) blur(22px)`, a 0.5px `--glass-line` hairline.
- `.btn` — flat, continuous corners, no bottom edge. On `:active` it scales to
  0.97 with a short ease. Variants: solid (Wedgewood), `--soft`, `--ink`,
  `--ghost`, sizes `--sm --lg --xl`.
- `.tab` — 1px border, `--r-tab`; filters are never pill-shaped.
- `.tile` — the menu button: `--r-tile`, `--sh-1`, lifts 2px on hover.
- `.seg` / `.seg-set` — segmented switch; the selected segment is a raised chip.
- Modals are centred sheets: they rise 28px and settle with `--ease-ios`.
- **Drills only** keep a tactile edge: keys, answer pieces and the speaker use
  `box-shadow: 0 var(--lift-play) 0 <edge>` (3px) and press down. Nothing
  outside a drill has a solid bottom edge.
- Borders are 1px (1.5px on drill pieces). Never 2–3px.

**Layout law:** every main screen is a *menu*: horizontal rails (`.rail`),
tab-switched groups and grids. Content sits on the grid; nothing is rotated or
knocked off-line (`.tilt-*`, `.nudge-*`, `.bleed-*` are inert).

## 4c. Choreography

- `Reveal.svelte` drifts blocks in as they enter the viewport, staggered by
  index, with a visibility safety net: content must never stay invisible.
- Modals (`Modal.svelte`) are centred glass sheets. No side drawers.
- `Motif.svelte` scatters CSS-drawn Japanese objects at low opacity. They
  decorate; they never carry information.

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

- Ambient motion is slow and small: floating, swaying, blinking, breathing.
- Interaction motion is short and physical, in the iOS manner: press = scale
  0.97, release settles with `--ease-ios` (`cubic-bezier(.32,.72,0,1)`), no
  bounce on surfaces. `--ease-spring` is for Zeko and small pops only.
- Wrong answers: a soft shake plus a ring. Right answers: a soft ring. No
  heavy coloured slabs.
- Durations come from `--t-fast / --t-base / --t-slow`. Theme changes fade the
  colours (`--t-slow`).
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

---

## 9. Staying distinctive — the anti-generic rules

These exist so the app never drifts into a stock template.

1. **One accent.** Wedgewood is the only accent. Aqua is a quiet support colour.
   Hanko appears only for errors and the seal.
2. **Japanese is part of the layout.** Every screen carries its kanji eyebrow
   and `.jp` labels in Zen Maru; they are never swapped for system text.
3. **Zeko is a character, not a logo.** He reacts, is poked, and is never
   recoloured, restyled or used as a decorative sticker.
4. **Say less.** One title per screen, no subtitle that repeats it, no stat
   shown in two places, no instruction after the first answer. If a line does
   not help the learner play, it goes.
5. **No stock UI.** No gradient buttons, no emoji, no confetti or badges, no
   generic illustration packs, no purple, no card-with-icon-and-three-lines
   marketing sections.
6. **Quiet rewards.** Feedback is a ring and a short word; never a fanfare.
7. **Glass is a surface, not a style.** Blur is used where content passes
   behind it (header, sheets, panels). It is never stacked on blur.
8. **Hierarchy by space.** If a screen needs a border or a box to feel
   organised, fix the spacing first.
