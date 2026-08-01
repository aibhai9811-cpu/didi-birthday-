For My Didi — birthday site
A single-page cinematic birthday surprise. No frameworks, no build step — just open index.html.
Files
index.html
style.css
script.js
assets/
  images/     ← the 6 gallery photos already dropped in here
  music/      ← put your instrumental track here
Photos (already done)
Your 6 photos are already placed at assets/images/gallery-1.jpg through gallery-6.jpg and wired up in script.js inside the PHOTO_DATA array, each with its own caption. To swap a photo or edit a caption later, open script.js and edit that array — nothing else needs to change:
const PHOTO_DATA = [
  { src: 'assets/images/gallery-1.jpg', caption: 'A smile that always makes home feel like home.' },
  ...
];
To add a 7th photo, just add another line the same way and drop the file in assets/images/.
Music (you need to add this)
Put one instrumental MP3 at:
assets/music/theme.mp3
Keep it soft and instrumental (lo-fi piano/strings work beautifully here) — something like 2–4 minutes is plenty since it loops. Most phone browsers block autoplay with sound until the person has interacted with the page, so the "✨ Open" tap on Page 1 is used to try starting it — if that's still blocked, the floating music button in the bottom-right corner lets her turn it on herself.
The call button
Page 4's button dials tel:+919263297366 directly on tap — update that number in index.html (search for tel:) if it ever changes.
Hosting it
Since you already build on GitHub with the web UI + Pages:
Create a new repo (or a folder in an existing one).
Upload all files/folders exactly as they are, keeping the same structure.
Turn on GitHub Pages for that repo (Settings → Pages → deploy from the main branch).
Share the generated https://yourname.github.io/repo-name/ link.
No build step, no dependencies — it just works once the files are uploaded.
Notes on the experience
Page 1 — animated stars, an "Open" button that gives a small vibration on tap (supported phones only), then a 2-second loading line before the letter appears.
Page 2 — the letter types itself out, line by line, with natural pauses at line breaks and full stops.
Page 3 — a fullscreen Ken Burns slideshow of the 6 photos, ~6 seconds each, with a thin progress bar up top so it never feels random. A "Keep going" button fades in once the last photo has shown.
Page 4 — confetti, floating hearts, the birthday line, and the call button.
Respects prefers-reduced-motion — animations calm down automatically for anyone with that setting on.
