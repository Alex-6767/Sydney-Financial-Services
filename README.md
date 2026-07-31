# Sydney Financial Services — Website

A simple, three-page static site. No build step, no dependencies — just HTML, CSS and one JS file.

## Files
```
index.html        Home (holographic rotating hero)
about.html        About & Services
contact.html      Contact (enquiry form + details)
styles.css        All styling
main.js           Scroll-accelerating logo spin, reveals, mobile nav, form
assets/           logo.jpg · emblem-white.png · favicon.png
```

## Signature feature
The hero logo is a holographic medallion that spins continuously and **rotates faster the further you scroll down the page**. It respects `prefers-reduced-motion` (holds still for users who prefer no motion).

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy to GitHub
1. Create a new repository and upload every file (keep the folder structure).
2. Settings → Pages → deploy from the `main` branch, root folder. Your site goes live at `https://<user>.github.io/<repo>/`.

## Deploy to Vercel
1. Push the repo to GitHub, then in Vercel choose **Add New → Project** and import it.
2. Framework preset: **Other**. No build command. Output directory: `/` (root).
3. Deploy. That's it — it's a static site.

## Editing content
- Phone / email appear in each page footer and on `contact.html`. Update them there.
- Colours live at the top of `styles.css` (`--navy`, `--gold`, etc.).
- The enquiry form opens the visitor's email app addressed to `costa@sydneyfinancialservices.au`. To use a hosted form service instead, swap the submit handler in `main.js`.
