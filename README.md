# TGSMUN — Conference Website

Static website for the TGS Model United Nations conference. No build step, no dependencies — plain HTML/CSS/JS that deploys anywhere (GitHub Pages, Cloudflare Pages, Netlify).

## Pages

| Page | Contents |
|---|---|
| `index.html` | Hero + countdown, stats, about + SG letter, committee preview, schedule, FAQs, contact, footer |
| `committees.html` | All 7 committees with agendas, difficulty tags and background-guide slots |
| `secretariat.html` | Executive board + heads of department cards |
| `register.html` | Fees, registration steps, cancellation policy, form embed slot |

## Things to customize (placeholders)

1. **Conference date** — edit `CONFERENCE_DATE` at the top of `assets/js/main.js` (drives the countdown). Also update dates mentioned in `index.html` and `register.html`.
2. **School name** — the site says "TGS" throughout; search-and-replace with the school's full name.
3. **Secretariat names** — replace the `Name Here` placeholders in `secretariat.html`. To use real photos, swap each `<div class="sec-avatar">XX</div>` for `<img class="sec-avatar" src="...">`.
4. **Registration form** — create a Google Form and either paste its embed iframe into the marked block in `register.html`, or point the Register buttons at the form URL.
5. **Contact details** — email, phone and venue in `index.html` (contact section) and footers.
6. **Social links** — Instagram/LinkedIn placeholders in every footer.
7. **Committees & agendas** — edit cards in `index.html` and full entries in `committees.html`.
8. **Fees & policy** — amounts and dates in `register.html`.
9. **Stats** — delegate/school counts in `index.html` (`data-count` attributes).

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

Repo Settings → Pages → Deploy from branch → select the default branch, root folder. The site is served as-is.
