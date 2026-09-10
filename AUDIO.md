# Proposal — fixing the audio

> Status: **proposal only, nothing implemented.**
> Written because the current playback sounds clipped, thin and inconsistent.

---

## 1. What is in the app today, and why it sounds bad

Everything you hear comes from `src/lib/utils/speech.js`, which calls the
browser's built-in **Web Speech API** (`speechSynthesis`) with `lang: 'ja-JP'`
and a rate of `0.85`.

That choice is free, offline and zero-weight — and it has five concrete
problems:

| Problem | Why it happens |
|---|---|
| **Sounds too short / cut off** | A single kana is one mora, ~120 ms. Most TTS engines fade in at utterance start, so a third of the sound is swallowed. There is no lead-in silence to protect it. |
| **Inconsistent from device to device** | macOS gives Kyoko/Otoya, Windows gives Haruka/Ayumi/Nanami, Android gives the Google engine, Linux usually gives **nothing**. Different voice, different quality, different timing. |
| **Wrong or flat pitch accent** | `speechSynthesis` exposes only `rate` and `pitch` (one global number). It cannot produce 箸 (HA-shi) vs 橋 (ha-SHI). Isolated kana get a default flat contour that is not how they sound in a word. |
| **`cancel()` races** | We call `cancel()` then `speak()` immediately. On Chrome that sometimes kills the new utterance too, which is why replaying occasionally does nothing. |
| **Slowing it down makes it worse** | `rate: 0.85` stretches the vowel and exaggerates the machine artefacts, so it sounds less natural, not clearer. |

Conclusion: `speechSynthesis` is acceptable as a **fallback**, never as the
primary teaching audio for a page whose whole premise is "hear it, identify it".

---

## 2. Option A — ship pre-rendered audio (recommended)

Generate every sound **once, at build time**, and ship the result as static
files. Runtime cost is zero, the result is byte-identical for every learner,
and it still works offline.

**How**

1. A build script walks `kana.js` (128 sounds) and `dictionary.js` (~1 580
   words) and renders each entry to audio with a **neural TTS**:
   - Google Cloud TTS `ja-JP-Neural2-B` / `Wavenet`
   - Azure `ja-JP-NanamiNeural` (has SSML prosody control)
   - ElevenLabs / OpenAI TTS (best prosody, check licence for redistribution)
2. Each clip is normalised (−16 LUFS), trimmed to silence, then padded with
   **80 ms of silence at each end** — this alone fixes "sounds too short".
3. Everything is packed into a small number of **audio sprites**: one file per
   group plus a JSON offset map.
   ```json
   { "gojuon:ka:か": { "start": 12.480, "dur": 0.42 } }
   ```
4. Encode as **Opus in WebM** (~24 kbps mono is plenty for speech).

**Size estimate**

| Set | Clips | Approx. size (Opus 24 kbps) |
|---|---|---|
| All kana | 128 | **~0.4 MB** |
| N5 words | ~690 | ~2.5 MB |
| Everything | ~1 580 | ~6 MB |

Ship the kana sprite eagerly (it is smaller than one photograph) and fetch
word sprites lazily, per level, the first time the learner opens a drill that
needs them.

**Playback**

Use the Web Audio API rather than `<audio>`:

```js
const ctx = new AudioContext();
const buf = await ctx.decodeAudioData(await (await fetch(url)).arrayBuffer());
// play one sprite slice
const src = ctx.createBufferSource();
src.buffer = buf;
src.connect(gain).connect(ctx.destination);
src.start(0, entry.start, entry.dur);
```

- Decoded buffers stay in memory for the session; the raw file is stored in
  **Cache Storage** so it survives reloads and works offline.
- No `cancel()` races: stop the previous `BufferSource` explicitly.
- Latency drops from ~200–400 ms (TTS engine spin-up) to ~5 ms, which matters
  a lot in Sixty Seconds.

**Licensing caveat.** Some TTS providers forbid redistributing generated audio
as a dataset. Check the terms before committing; Azure and Google both allow
it under their standard commercial terms, most consumer voice products do not.

---

## 3. Option B — record a human

Same pipeline, better result, more work: hire a native speaker (or use a
Creative Commons set) for the 128 kana and the most common ~300 words, and
fall back to TTS for the long tail.

- Human kana audio is dramatically clearer than any TTS for isolated morae.
- One recording session covers the kana set for the life of the project.
- Existing CC-licensed sources worth checking: **Tatoeba** audio (CC-BY),
  **Forvo** (per-clip licence), **JVS corpus** (research licence — read it),
  **Common Voice ja** (CC-0, but read-aloud sentences, not isolated kana).

---

## 4. Option C — patch what is there (a stopgap, one afternoon)

If shipping assets has to wait, these changes make `speechSynthesis` less bad:

1. **Pad the utterance.** Speak `「か」` with a trailing `、` or prepend a
   200 ms silent utterance, so the fade-in does not eat the mora.
2. **Speak the sound inside a carrier.** For isolated kana, saying `かか` or
   `かーか` and playing only the middle is hacky but audibly clearer.
3. **Rate back to 1.0** for single kana, `0.9` for words. Slow ≠ clear.
4. **Pick the voice deliberately** instead of taking the first `ja` match:
   prefer `Kyoko`, `Otoya`, `Google 日本語`, `Nanami`, `Haruka` by name.
5. **Fix the cancel race**: `cancel()`, then `speak()` on the next tick
   (`setTimeout(..., 0)`), and ignore taps while `speechSynthesis.speaking`.
6. **Detect "no Japanese voice" once** and surface it in Settings, not only
   inside a drill (partly done — `SoundPrompt` already falls back).

---

## 5. Recommendation

1. Do **Option C** now — it is cheap and removes the worst artefacts.
2. Build **Option A** for the 128 kana first. That sprite is ~0.4 MB and it is
   what every audio drill depends on.
3. Extend Option A to words per JLPT level, lazily loaded.
4. Consider **Option B** later for the kana set only, if the project ever has
   a budget; the words can stay TTS.

Keep `speechSynthesis` wired up as the last-resort fallback so the app still
half-works on a browser with no network and no cached sprite.
