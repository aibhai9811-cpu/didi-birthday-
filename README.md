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

## Notes on the experience

- **Page 1** — a crescent moon, twinkling parallax stars, floating fireflies,
  your hero line typing itself out letter by letter, a gently pulsing "Open"
  button, and one of your photos faded in at the bottom with a "Made with
  love 🤍" caption. Tapping Open shrinks the button, a soft golden glow
  spreads and fades to black, then the loading line appears.
- **Page 2** — a cream envelope with a wax seal sits waiting. Tapping it
  plays a soft paper sound, the seal breaks, the flap opens, the letter
  slides out, and a frosted glass card unfolds with the message typing
  itself out. Music nudges slightly louder for this moment.
- **Page 3 (Memories)** — swipe left for the next photo, right to go back
  (tap the left/right edges works too on desktop). Each one is a tilted
  polaroid card with a slow Ken Burns zoom and a caption + tiny heart
  underneath, with dot pagination and a "Swipe to relive memories..." hint.
  "Keep going" appears once you've reached the last photo.
- **Page 4** — a wrapped gift box sits shaking gently, waiting to be tapped.
  On tap: the ribbon unties, the lid pops open, golden light bursts out,
  and then the background brightens, hundreds of particles assemble into a
  glowing heart above the title, fireworks crackle, balloons rise, confetti
  falls, and "Happy Birthday, Didi ❤️" glows in gold. After about 5 seconds
  everything settles quietly — the fireworks and balloons fade, the stars
  become visible again, and the line beneath the title softens to "I love
  you." The call button stays gently pulsing at the bottom throughout.

### About the sound effects

Fireworks crackle, balloon pops, the paper-unfolding sound, the celebration
chime, and the soft notes on each tap are all **generated in the browser
with the Web Audio API** — nothing to upload for those. The only audio file
needed is the background music track described above, which loops softly
under everything.

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
