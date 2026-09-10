# Proposal — helping people actually pronounce it

> Status: **proposal only, nothing implemented.**

---

## 1. The problem, stated precisely

Zekocards is written in English so that anyone can use it. But English is the
*interface* language, not the learner's language. Someone arriving here may be
Spanish, Portuguese, Arabic, Korean, Hindi or Mandarin speaking, and each of
those brings a different set of mistakes to Japanese:

- A Spanish speaker rolls or taps `ら り る れ ろ`, rounds `う`, and hears
  `ざ` as `sa`.
- An English speaker aspirates `か` and `た`, diphthongises `お` into "ow",
  and reduces unstressed vowels to schwa.
- A Mandarin speaker imports tone onto a language that uses **pitch accent**,
  and merges `つ` with `ちゅ`.
- A Korean speaker has the opposite problem to everyone else: the vowels are
  easy, but the voiced/unvoiced distinction (`か` vs `が`) is not.

So "here is the correct sound, copy it" is not enough. Two different learners
listening to the same clip fail in two different directions, and neither of
them knows it.

There is also a structural problem: **Japanese is mora-timed**. `おばさん`
(4 morae) and `おばあさん` (5) differ only by duration, and almost no learner
hears that difference unaided. Length is phonemic; in most European languages
it is not.

---

## 2. Ideas, cheapest first

### Idea 1 — Native-language interference notes (content, not code)

Let the learner pick their first language once (stored locally, like
everything else). Each kana card and each drill can then show a short,
targeted warning instead of a generic tip.

```
ら · your language: Spanish
   Do NOT roll it. It is one quick tap of the tongue behind the teeth —
   closer to the "r" in "pero" than to "perro", and closer still to the
   "tt" in American English "butter".
```

- **Cost:** none technically. It is a table of `language × kana → note`.
  Start with 6 languages × ~25 problem sounds = 150 short strings.
- **Impact:** high. It is the only idea here that addresses the actual
  question the user raised: the *listener* differs.
- **Risk:** it is writing, and it has to be correct. Get each language's notes
  checked by someone who speaks it.

### Idea 2 — A mora-timing trainer (no audio required)

A drill where the word is displayed and the learner **taps once per mora** in
rhythm — `きって` is three taps (き-っ-て), `おばあさん` is five. Score is the
evenness of the intervals, measured with `performance.now()`.

- **Cost:** low. Pure DOM and timing maths, no assets, no network.
- **Impact:** teaches the single thing that most affects intelligibility, and
  it fits the existing "boring repetition" philosophy exactly.
- It also teaches `っ` and `ー` as real beats, which the current Word Forge
  drill treats as mere extra keys.

### Idea 3 — Pitch accent, shown as a line

Draw the accent contour above the word (the standard Japanese textbook
notation): `はし‾＿` vs `＿はし‾`, plus the four patterns (heiban, atamadaka,
nakadaka, odaka).

- **Cost:** medium — the code is trivial, the **data** is the work. Accent
  patterns must come from a source: **OJAD** (research use, check terms),
  **Wadoku** accent field, **NHK 日本語発音アクセント辞典** (copyrighted, do not
  scrape), or **JMdict/kanjidic** derivatives that carry accent.
- **Impact:** high for sounding natural, low for being understood. Do it after
  Ideas 1 and 2.
- Add it as a field on the dictionary rows so it degrades gracefully when
  unknown.

### Idea 4 — Record yourself and compare (privacy-safe)

Use `MediaRecorder` in the browser:

1. Play the reference clip.
2. Learner records themselves.
3. Play reference → own recording back to back, twice.
4. Draw both **pitch contours** side by side, extracted client-side with an
   autocorrelation / YIN pitch detector over the Web Audio `AnalyserNode`, and
   both **envelopes** so mora length is visible as shape.

- **Cost:** medium. Pitch detection in ~150 lines of JS, no libraries needed.
- **Privacy:** the audio never leaves the browser and is never stored. This
  matters — it must stay consistent with the promise in the letter.
- **Impact:** genuinely useful, and self-assessment sidesteps the L1 problem
  entirely: you are comparing your own curve with the reference curve.
- **Depends on** the audio work in `AUDIO.md` — there is nothing to compare
  against until the reference clips exist.

### Idea 5 — Automatic scoring with speech recognition

Two possible routes, both with a catch:

| Route | How | Catch |
|---|---|---|
| `webkitSpeechRecognition` with `lang: 'ja-JP'` | Ask the learner to say the word, see whether the browser transcribes it correctly | Chrome only, and **it sends audio to Google's servers**. That directly contradicts the local-only promise, so it can only ever be an explicit, clearly-labelled opt-in. |
| On-device Whisper (`transformers.js` / WASM) | Same idea, entirely offline | 40–75 MB model download, slow on low-end devices. Would have to be an opt-in "install the pronunciation checker" button. |

Recommendation: keep this out of the default experience. If it is ever built,
it is a toggle in Settings that explains exactly what leaves the device.

### Idea 6 — Minimal-pair listening drills

Once real audio exists, a drill that plays one of a pair and asks which it
was — `おじさん / おじいさん`, `きて / きって`, `びょういん / びよういん`,
`かこ / かっこ`, `ろく / りょく`.

- Trains the ear for length and palatalisation, which is the input side of
  Idea 2's output side.
- Fits the existing engine: it is the Blind Sound drill with a curated pool.

### Idea 7 — Mouth diagrams in CSS

Small cross-section drawings for the handful of sounds that are genuinely
articulated differently: `ふ` (bilabial, not labiodental `f`), `ら` (alveolar
tap), `う` (unrounded), `ん` (four allophones depending on what follows).

- Fits the CSS-only art direction of the project.
- Nice to have; nobody learns to pronounce from a diagram alone.

---

## 3. Suggested order

1. **Idea 1** — L1 interference notes. Highest value per hour, and it is the
   direct answer to "everyone who arrives pronounces differently".
2. **Idea 2** — mora-timing trainer. No dependencies, no assets.
3. *(after `AUDIO.md` is implemented)* **Idea 6** — minimal pairs, then
   **Idea 4** — record and compare.
4. **Idea 3** — pitch accent, once an accent data source is settled.
5. **Idea 5** — only as an explicit opt-in, if at all.

## 4. Open questions to decide first

- Which first languages to support at launch? (Suggest: Spanish, English,
  Portuguese, French, Chinese, Korean — covering the largest learner bases.)
- Is the L1 choice a one-time question, a Settings toggle, or auto-detected
  from `navigator.language` with an override? (Suggest: auto-detect, ask once,
  always overridable.)
- Where does the accent data come from, and what is its licence?
- Does microphone access break the "no account, nothing leaves the browser"
  promise in the reader's mind even when it is technically local? If so, the
  letter needs a sentence about it.
