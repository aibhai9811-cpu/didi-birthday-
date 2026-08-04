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

## Notes on this interaction-craft pass

Same design, same pages — this round rebuilt three interactions to feel
like real physical objects rather than web elements. No GSAP was added
(kept the site dependency-free); instead it uses real CSS 3D transforms
(`perspective`, `rotateX` from proper hinge points) with physics-shaped
easing curves — a slow decelerate curve for paper/lid motion, and a
gravity-style accelerating curve for anything falling.

- **Envelope** — proper 3D hinge (not a flat flip), a wax seal that pulses
  gently then visibly cracks into two halves that rotate apart, fine paper
  fiber texture, and a letter that peeks out and can genuinely be **dragged
  upward** to pull it free (it resists as you drag, and springs back if you
  let go too early). If you don't drag it, it gently continues on its own
  after a beat, so no one gets stuck.
- **Letter** — real ivory stationery texture with fiber grain, embossed
  shadow, and two subtle fold-crease lines like an actual tri-folded
  letter. It's built from **three hinged panels** that flip open one after
  another (not scaled or faded) to reveal the message underneath, floats
  very gently as if resting on a table, and ends in a handwritten-style
  signature in a cursive font — "— Your Little Brother ❤️".
- **Gift** — completely restaged: tap → box gives slightly → ribbon and bow
  visibly loosen → bow falls away under gravity → ribbon falls → lid lifts
  from a **back hinge** in true 3D → golden light leaks through the
  growing gap and brightens as it opens. The fireworks/confetti/balloons
  are now triggered by listening directly to the lid's own `transitionend`
  event, so they always start in sync with the lid actually finishing —
  not a guessed timeout. Retapping mid-animation is now ignored, so it
  can't double-trigger.

### About the sound effects (same note as before)

Nothing here uses real recordings — everything is synthesized live with
the Web Audio API, since I have no way to source or license actual
recordings. If you want true recorded realism (especially for the
fireworks), send me a few short real clips and I'll wire them in.

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
