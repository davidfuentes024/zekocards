# ZEKOCARDS — Project Map

Companion to [`IDENTITY.md`](./IDENTITY.md), which is immutable.
This file describes **how the app is built, what the core is, and what must
not be touched** when adding features in future sessions.

---

> A Flutter port for Android and iOS lives in `../japones-mobile`. It shares
> this repo's identity and data — its asset tables are exported straight out of
> `src/lib/data/` — and adds five harder drills on top of the nine here.

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
      dictionary.js ⚠ CORE     N5 base list, parsed into sound ids
      dictionary-extra.js      N4 → N2 vocabulary (same row format)
      dictionary-core.js       the 4000-word frequency core (generated)
      kanji.js                 N5 kanji + merge/dedupe of the extra files
      kanji-extra.js           N4 → N3 kanji
      kanji-core.js            the 1000 most frequent kanji (generated)
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
    /dictionary                4482-word dictionary
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

| id | Component | Question → Answer | Why it cannot be gamed |
|---|---|---|---|
| `blind` | Blind.svelte | audio only → tap the symbol | nothing is written on screen; pad holds every symbol in the script, reshuffled each question |
| `bridge` | Bridge.svelte | symbol in one script → same sound in the other | no romaji at any point; full shuffled pad |
| `dictation` | Dictation.svelte | spoken word → spell it kana by kana | wrong keys refuse to land; full shuffled pad |
| `build` | WordBuild.svelte | English meaning → spell it in kana | only the meaning is given; full shuffled pad |
| `words` | WordRead.svelte | word in kana → type the meaning in English | comprehension, not transcription |
| `lookalike` | LookAlike.svelte | one of a confusable family → produce it in the other script | the family is shown unlabelled; answering needs the actual identity |
| `anchor` | Anchor.svelte | the learner's own note → tap the symbol | the only clue is their own handwriting |
| `speed` | Speed.svelte | 60 s of audio → symbol | no time to reason it out |
| `kanji` | KanjiDrill.svelte | meaning in English / reading built in kana | readings are spelled on the full grid, never romanised |

**The two rules every drill obeys**

1. **Prompts** only ever come from the learner's selection.
2. **Distractors** are the entire script, always — never the selection. A
   symbol can therefore never be identified by elimination, by position, or by
   the order of the pad.

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
4. The forced-repetition loop: a miss must cost a repetition, not a life. A
   wrong answer never advances the question — the correct symbol must still be
   produced.
4b. **No romaji as an answer, ever.** Romaji appears only as reference text in
   the dictionary and as the emergency fallback in `SoundPrompt` when the
   browser has no Japanese voice at all. Typing "ka" is not reading Japanese.
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
  The generated `dictionary-core.js` is merged *behind* it, so a hand-written
  row always wins the dedupe.
- More kanji in `kanji.js`, merged the same way ahead of `kanji-core.js`.
- More confusion sets in `CONFUSION_SETS`.
- More drills (see above), more presets on the Cards page, more icons.
- More scenery components, as long as they are pure CSS.

---

## 6b. Open proposals

Two problems are documented but deliberately **not** implemented yet:

- [`AUDIO.md`](./AUDIO.md) — why `speechSynthesis` sounds clipped and thin, and
  four routes to replacing it (pre-rendered Opus sprites are the recommended
  one). **Every audio-first drill depends on this being solved properly.**
- [`PRONUNCIATION.md`](./PRONUNCIATION.md) — how to help learners whose first
  language is not English, ordered from cheapest to most speculative.

## 7. Known limits / good next steps

- **Speech** depends on the browser having a `ja-JP` voice. `SoundPrompt`
  detects this and falls back to showing the reading, because otherwise the
  audio-first drills would be impossible rather than hard. See `AUDIO.md`.
- **Stroke order** is not taught. A CSS/SVG stroke-order animation per kana is
  the most valuable missing feature; `zk-stroke-draw` in `animations.css` is
  already there for it.
- **Import** of an exported JSON file is not implemented (export is).
- The dictionary is now two layers: a hand-written topical list (curated tags,
  first pick in the dedupe) and a generated frequency core — the 4000 most-used
  words, ranked against a corpus list and banded by JLPT level. 4482 words
  total. Every new word automatically becomes available to the drills that can
  reach it. `kanji.js` is layered the same way and holds 1016 characters, the
  1000 most frequent plus the hand-written extras.
- The generators live in `../japones-mobile/tool/`.
- Kanji progress is tracked separately (`kanji-stats`) and is not part of the
  kana mastery map.
