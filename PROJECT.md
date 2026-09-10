# ZEKOCARDS — Project Map

Companion to [`IDENTITY.md`](./IDENTITY.md), which is immutable.
This file describes **how the app is built, what the core is, and what must
not be touched** when adding features in future sessions.

---

## 1. The core, in one paragraph

The learner selects sounds on the **Cards** page. That selection
(`selectedSounds`, a `Set` of sound ids in `localStorage`) is the single source
of truth for the entire application. Every drill, every dictionary result,
every example word is derived from it. **No screen may ever present Japanese
content that falls outside the current selection.** That constraint is the
product; if it is broken, Zekocards is just another kana app.

---

## 2. Stack

- **SvelteKit 2 + Svelte 5 (runes)**, Vite 5.
- `@sveltejs/adapter-static` — the whole app prerenders to static files with a
  `200.html` SPA fallback. It can be hosted anywhere, including a USB stick.
- Fonts vendored via `@fontsource` (no Google Fonts request at runtime).
- **Zero runtime dependencies beyond Svelte.** Do not add a UI library, a CSS
  framework, an icon package, or an analytics script.

```
npm install
npm run dev       # http://localhost:5173
npm run build     # -> build/
npm run preview
```

---

## 3. Directory map

```
src/
  app.html                     shell (theme colour, favicon, meta)
  lib/
    data/
      kana.js       ⚠ CORE     128 sounds, 33 columns, 4 groups, tokenizer
      dictionary.js ⚠ CORE     688 words, parsed into sound ids
      kanji.js                 134 kanji with kana readings + examples
      games.js                 the drill roster (id, title, icon, needs)
    stores/
      persisted.js  ⚠ CORE     localStorage-backed writable + Set bridge
      selection.js  ⚠ CORE     selectedSounds, script, derived readable words
      progress.js   ⚠ CORE     per-sound mastery, weighting, history, streaks
      associations.js          the learner's own anchor words
      settings.js              petals, speech rate, strict romaji, …
    utils/
      answer.js     ⚠ CORE     romaji normalisation + answer checking
      random.js     ⚠ CORE     weighted, non-repeating prompt selection
      drill.svelte.js          shared session bookkeeping for every game
      speech.js                Web Speech synthesis (ja-JP), degrades silently
    components/                Icon, Zeko, ZekoSpeak, ZekoPeek, Scenery,
                               Petals, Motif, Reveal, Modal, Button, Panel,
                               SoundCard, KanaColumn, CardDetail, KanaKeypad,
                               RomajiInput, DrillFrame, MasteryRing
    games/                     one component per drill
    styles/                    tokens · base · components · animations
  routes/
    /                          home
    /cards                     the deck — selection + card detail drawer
    /practice                  training hall
    /practice/[game]           drill host (registry → component)
    /dictionary                688-word dictionary
    /kanji                     kanji browser
    /progress                  stats, mastery map, anchors, settings, export
```

⚠ = load-bearing. Changing these changes the behaviour of everything else.

---

## 4. Data model

### Sound
```js
{ id: 'gojuon:ka:か', h: 'か', k: 'カ', r: 'ka', alt: [], column, group }
```
Ids are stable strings; **never renumber or reformat them** — they are the keys
under which learners' progress and anchors are stored on their own machines.

Groups: `gojuon` (46) · `dakuten` (25) · `yoon` (33) · `extended` (24,
katakana-only loanword combinations).

### Word
```js
{ id, kana, kanji|null, romaji, en, tags[], script, units[], soundIds[], length }
```
`tokenize()` in `kana.js` splits a kana string into sound records, longest
token first, so `しゅ` beats `し` + `ゆ`. `っ`, `ッ`, `ー`, spaces and punctuation
are **neutral** — always allowed, never need unlocking.

`wordsWithin(allowedIds)` is the gate: a word appears only if **every** one of
its sounds is selected.

### Mastery
`progress.js` keeps `{ seen, ok, bad, streak, best, level, last, ms }` per
sound. Level rises after `REPS_PER_LEVEL` (3) consecutive correct answers and
falls by one on a miss; `MAX_LEVEL` is 5. `weightOf()` mixes accuracy,
remaining levels and staleness — this is what makes weak sounds keep coming
back. Drills pick prompts with `nextPrompt()`, which is weighted **and**
refuses to repeat the last few items.

---

## 5. The drills

| id | Component | Question → Answer | Anti-guessing device |
|---|---|---|---|
| `recall` | Recall.svelte | kana → typed romaji | forced re-type of the correct answer after a miss |
| `produce` | Produce.svelte | romaji → tap kana | pad shows **every** selected sound |
| `words` | WordRead.svelte | whole word → typed reading | words limited to the selection |
| `build` | WordBuild.svelte | English + romaji → spell in kana | wrong keys refuse to land |
| `listen` | Listen.svelte | audio → typed reading | nothing shown until answered |
| `lookalike` | LookAlike.svelte | confusable kana → typed romaji | side-by-side comparison after a miss |
| `anchor` | Anchor.svelte | the learner's own note → the sound | the only clue is their own writing |
| `speed` | Speed.svelte | 60-second typed sprint | personal record kept locally |
| `kanji` | KanjiDrill.svelte | kanji → meaning or reading | readings typed, never chosen |

**Adding a drill:** create `src/lib/games/X.svelte` using `createDrill()` +
`DrillFrame`, add an entry to `src/lib/data/games.js`, register it in
`src/routes/practice/[game]/+page.svelte`. Nothing else needs touching — the
route entries and the hub build themselves from the roster.

---

## 5b. The visual layer (added in the redesign)

| Component | Purpose |
|---|---|
| `Reveal.svelte` | Scroll-in choreography with an IntersectionObserver, a scroll fallback **and** a 2.5s safety timer so content can never stay hidden. |
| `Modal.svelte` | The only overlay pattern: centred, bordered, `Escape` closes. Card detail and kanji detail both use it. |
| `Motif.svelte` | CSS-only Japanese motifs (torii, koi, lantern, sakura, fan, daruma, cloud, onigiri, wave) drawn on a 100×100 stage and scaled. |
| `ZekoSpeak.svelte` | Interactive mascot: bubble + poke-to-cycle mood and line. Used on home, cards, hall, dictionary, kanji, progress. |
| `ZekoPeek.svelte` | Mascot leaning in from a page edge, decorative only. |

Page shapes: **home** is a full-viewport hero + staggered step cards + a
horizontal drills rail + a stat strip + the letter; **cards** is a HUD +
preset rail + sticky control bar + one tab-switched kana table; **hall**,
**dictionary**, **kanji** and **progress** are menus (segmented switches,
topic rails, tab boards) rather than vertical stacks.

## 6. Rules for future work

**Do not touch / do not break**

1. `selectedSounds` as the universal filter. Never bypass `wordsWithin()`.
2. Sound ids and the `zekocards:v1:` localStorage namespace. Changing either
   silently erases every existing learner's progress. If the shape must change,
   bump to `v2` **and migrate**, never overwrite.
3. The no-multiple-choice rule. Answer pads show the full selected set.
4. The forced-repetition loop: a miss must cost a repetition, not a life.
5. Local-only storage. No account, no sync, no telemetry, no third-party script.
6. Static output. The app must keep building with `adapter-static` and running
   from `file:`-adjacent hosting with no server.
7. The identity rules in `IDENTITY.md` — palette, fonts, icon family, Zeko,
   no emoji, no generic gradients, the game-piece button language, the
   menu-not-document layout law.
9. The letter is the *only* place the free/local/no-account position is
   stated. Do not scatter it back through the UI.
10. `Reveal` must keep its safety net. Never ship a reveal that can leave
    content permanently invisible.
8. Zeko's scale contract: mood animations belong on the wrapper element.

**Safe to extend**

- More words in `dictionary.js` (same row format; the parser handles the rest).
- More kanji in `kanji.js`.
- More confusion sets in `CONFUSION_SETS`.
- More drills (see above), more presets on the Cards page, more icons.
- More scenery components, as long as they are pure CSS.

---

## 7. Known limits / good next steps

- **Speech** depends on the browser having a `ja-JP` voice. The Ear Training
  drill says so and stays usable when there is none. A bundled audio pack would
  remove the dependency (large, but offline-true).
- **Stroke order** is not taught. A CSS/SVG stroke-order animation per kana is
  the most valuable missing feature; `zk-stroke-draw` in `animations.css` is
  already there for it.
- **Import** of an exported JSON file is not implemented (export is).
- The dictionary is hand-written; it can grow indefinitely, and every new word
  automatically becomes available to the drills that can reach it.
- Kanji progress is tracked separately (`kanji-stats`) and is not part of the
  kana mastery map.
