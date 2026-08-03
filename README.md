# For My Didi — birthday site

A single-page cinematic birthday surprise. No frameworks, no build step —
just open `index.html`.

## Files

```
index.html
style.css
script.js
assets/
  images/     ← the 6 gallery photos already dropped in here
  music/      ← put your instrumental track here
```

## Photos (already done)

Your 7 photos are already in `assets/images/` under their original camera
filenames, and wired up in `script.js` inside the `PHOTO_DATA` array, each
with its own caption, in chronological order:

```js
const PHOTO_DATA = [
  { src: 'assets/images/20220812_093508.jpg', caption: 'Where it all began...' },
  { src: 'assets/images/IMG_20250111_163717706.jpg', caption: 'A smile that always makes home feel like home.' },
  { src: 'assets/images/IMG-20251015-WA0187.jpg', caption: 'No matter how far you are...' },
  { src: 'assets/images/IMG_20260123_171413.jpg', caption: 'Distance changed the address...' },
  { src: 'assets/images/IMG_20260123_171456.jpg', caption: 'Some people don\u2019t need to try...' },
  { src: 'assets/images/IMG_20260123_171806.jpg', caption: 'Every golden hour reminds me of you.' },
  { src: 'assets/images/20260420_203738.jpg', caption: 'I miss you more than I say.' },
];
```

To swap a photo, edit a caption, reorder, or add more, open `script.js` and
edit the `PHOTO_DATA` array — nothing else needs to change. To add another
photo, drop the file in `assets/images/` and add a matching line to the
array.

## Music (already done)

Your track is already in place at:

```
assets/music/after_the_longest_sunday.mp3
```

Most phone browsers block autoplay with sound until the person has
interacted with the page, so the "✨ Open" tap on Page 1 is used to try
starting it — if that's still blocked, the floating music button in the
bottom-right corner lets her turn it on herself. To use a different track,
just replace this file and update the `<source>` path in `index.html` to
match.

## The call button

Page 4's button dials `tel:+919263297366` directly on tap — update that
number in `index.html` (search for `tel:`) if it ever changes.

## Hosting it

Since you already build on GitHub with the web UI + Pages:

1. Create a new repo (or a folder in an existing one).
2. Upload all files/folders exactly as they are, keeping the same structure.
3. Turn on GitHub Pages for that repo (Settings → Pages → deploy from the
   main branch).
4. Share the generated `https://yourname.github.io/repo-name/` link.

No build step, no dependencies — it just works once the files are uploaded.

## Notes on this polish pass

Same design, same pages, same colors — this round only upgraded motion,
interaction, and sound realism:

- **Page 1** — shooting stars now streak across the sky every 15–25
  seconds. Tapping Open makes the stars zoom/converge toward the center
  before the fade to black.
- **Page 2** — the wax seal gently pulses while waiting to be tapped. On
  tap, the background softly blurs and zooms in behind the envelope for
  focus. The letter card is now a warm textured paper (not glass), with a
  handwritten-style signature — "— Your Little Brother ❤️" — that fades in
  once the message finishes typing.
- **Page 3** — swiping now plays a light page-turn sound.
- **Page 4** — the gift's bow now falls away naturally (instead of flying
  up) before the lid opens and gold light bursts. There's a beat of silence
  after the burst before the first firework launches. The ending is now
  sequential: title fades in, 2 seconds later "I love you" appears, 2
  seconds after that the call button appears. Tap "Call Your Little
  Brother" and when you return to the tab afterward, everything quietly
  fades except the stars and a final line: *"Thank you for opening my
  heart, Didi. ❤️"*

### A transparent note on the fireworks sound

I don't have the ability to source or license real fireworks/crowd
recordings — everything audio-related is synthesized live in the browser
with the Web Audio API. I've layered it as much as I can (a whoosh, a
crackle burst, a soft echo), but it will never sound like an actual
recording, however good the synthesis gets.

If real recorded sound matters to you, the way to get there is to find or
record 3–4 short clips yourself — a firework whoosh+boom, distant crowd
ambience, paper flutter, a soft chime — and send them over. I can then wire
them into the code with proper timing and layering, which will sound far
more convincing than synthesis ever will. Until then, the synthesized
versions are what's live.

### If photos or music still don't show up after uploading

- Double-check the files actually landed inside `assets/images/` and
  `assets/music/` in the repo (open the repo on github.com and look for the
  `assets` folder sitting next to `index.html`).
- File names are case-sensitive: they must match exactly what's listed in
  `PHOTO_DATA` in `script.js`, and `assets/music/after_the_longest_sunday.mp3`.
- After any upload, give GitHub Pages 1–2 minutes to rebuild before
  refreshing the live link.

Respects `prefers-reduced-motion` — animations and effects calm down
automatically for anyone with that setting on.
