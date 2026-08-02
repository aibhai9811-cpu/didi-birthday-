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

## Notes on the experience (matches your template)

- **Page 1** — a crescent moon, twinkling parallax stars, floating fireflies,
  your hero line typing itself out letter by letter, a gently pulsing "Open"
  button, and one of your photos faded in at the bottom with a "Made with
  love 🤍" caption. Tapping Open shrinks the button, a soft golden glow
  spreads and fades to black over ~1 second, then the loading line appears.
- **Page 2** — a frosted glass card slides up from the bottom as the
  starfield softly blurs behind it, with a small hanging star swaying above.
  The letter types itself out with natural pauses, then "Continue" fades in.
- **Page 3 (Memories)** — each photo appears as a polaroid-style card,
  gently tilted, sliding in from alternating sides with a slow Ken Burns
  zoom and a caption + tiny heart underneath, ~5-6 seconds each, with dot
  pagination up top. "Keep going" fades in after the last one.
- **Page 4** — the background slowly brightens, hundreds of tiny particles
  drift together into a glowing heart above the title, fireworks crackle,
  balloons rise, confetti falls, "Happy Birthday, Didi ❤️" glows in gold,
  and the gently-pulsing call button sits fixed at the bottom.

### About the sound effects

Fireworks crackle, balloon pops, the celebration chime, and the soft notes
on each button tap are all **generated in the browser with the Web Audio
API** — nothing to upload for those. The only audio file needed is the
background music track described above, which loops softly under
everything.

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
