# PRAISER frontend

A single-page landing page for PRAISER: Practical AI for Sustaining Education and Research.

Open `index.html` in a browser. No install or build is required. The page uses plain HTML, CSS, and JavaScript, system fonts, and local assets. It makes no external font or script requests.

Edit content in `index.html`, the responsive plum, ivory, and gold theme in `styles.css`, and the motion controls in `app.js`. The website files and the `assets/` and `resources/` folders live at the repository root.

The homepage combines the welcome and purpose messages into one compact hero, followed by the footer. Beneath "Welcome to PRAISER," the left column contains the "Practical AI. Shared Possibilities." headline, the disciplines subtitle, and a compact "Connecting ideas. Advancing practice." heading with one continuous purpose paragraph. The repeated headline, separate lower purpose section, and redundant "Explore our purpose" link have been removed. The masthead displays the identity without navigation or menus. The headline and connected-discipline diagram emphasize AI for engineering, management, education, research, and practice.

The identity uses `logos/Plum and Gold P Emblem.png`. Its transparent margins are trimmed and it is resized to 176 × 205 pixels in `assets/praiser-emblem.png` (approximately 29 KB). The symbol is paired with a readable text wordmark and also serves as the favicon. The full name appears immediately under the wordmark, with **Pr**, **AI**, **S**, **E**, and **R** bolded in "Practical AI for Sustaining Education and Research." There is no separate abbreviation key.

The compact layout reduces section padding and headline size. Body copy is 16–18 px. The masthead contains only the logo, wordmark, and full name; the repeated top-right tagline has been removed. Figure labels are 16 px on larger screens and 14 px on phones. The figure shares the page background and has no rectangular frame, heading, footer controls, or progress bar. The figure takes roughly 60% of the hero width and reaches 660 px on desktop, with a 20 px gap from the narrower welcome copy. Tablet figures reach 540 px and stacked phone figures reach 460 px when space permits. Stronger plum and gold colors, thicker paths, and larger nodes make the connections easier to see.

The interactive SVG figure places the optimized plum-and-gold emblem from `logos/Plum and Gold P Emblem.png` and the PRAISER wordmark at its center. Surrounding themes are Practice, AI, Sustaining, Education, and Research. One plum-and-gold satellite, with solar panels and an antenna, orbits in 10 seconds. Its position, active theme, description, and letter emphasis share one animation clock. When it passes Practice, PR pulses in gold; AI emphasizes AI, Sustaining emphasizes S, Education emphasizes E, and Research emphasizes R. Arrival angles are measured from label centers in their local layout coordinates and recalculated after resizing, independently of the scene's 3D projection. Direct theme selection also positions the satellite and emphasizes the matching letters. The satellite is 68 SVG units wide (approximately 80 px at the largest figure size, before projection and depth scaling). Inline SVG and browser animation frames keep the figure lightweight. The theme descriptions appear within the figure.

Labels and their SVG dots share a square coordinate system and are joined by short gold connectors. Labels remain anchored while satellites, connection signals, and the central glow animate, so Practice and Sustaining stay visibly attached to their dots at every screen size.

The center is styled as a gently floating sphere, with directional lighting, a shaded rim, and a soft ground shadow. Three staggered ripples use a light champagne-gold-to-lavender radial gradient with soft transparent edges. They begin at the sphere's diameter and expand outward over a 4.8-second cycle, flattening into a tilted pond plane as they fade. The satellite grows on the near side of its orbit and shrinks on the far side to suggest depth. The original P breathes gently and catches a gold highlight clipped to its transparent silhouette. Only the matching group of letters in the central PRAISER text pulses as the satellite reaches each theme. These effects use CSS, inline SVG, and the existing logo asset, with no GIF, library, or additional image download. All effects honor the center pause control and reduced-motion preferences; browsers without CSS masking retain the breathing logo and pond ripples.

The whole diagram sits in a shared CSS perspective scene with a gentle resting tilt. Cursor movement rotates this scene within bounded angles, keeping labels and SVG connections aligned; the central sphere sits slightly forward for depth. A stationary wrapper supplies pointer coordinates so the tilt does not feed back into cursor measurements. On pointer exit, the scene smoothly returns to its resting angle. Touch screens retain a fixed, shallower tilt and normal scrolling; no touch gesture is captured. Reduced-motion preferences provide a flat, stable view.

The central logo doubles as the pause/resume control, with an accessible button label and a tooltip. Pointer hover and keyboard focus pause the satellite and matching content together, while cursor rotation remains available during hover. Explicit pause also disables cursor rotation. Operating-system reduced-motion preferences disable both animation and automatic content changes, while direct theme selection still works with static emphasis. Motion pauses in background tabs and when the figure is outside the viewport. Without JavaScript, the figure is static and all five descriptions remain available within it. Automatic changes do not generate screen-reader announcements; manual selections do. The homepage includes a keyboard skip link, visible focus indicators, and semantic headings. Existing standalone brand and resource files remain available separately.

Responsive layouts stack the welcome copy and figure on phones, balance them in two columns on tablets, and retain the larger figure on desktop screens. The entire welcome and purpose text block is vertically centered alongside the figure in desktop, tablet, and compact landscape layouts. Stacked phone layouts retain natural top alignment. Hero top padding is 12 px on desktops and tablets, 16 px on stacked phone layouts, and 8 px in compact landscape layouts. The diagram has a responsive upward offset of 24–40 px in columns and 16 px in compact landscape layouts to reduce its internal top whitespace. Stacked phone layouts retain normal figure spacing. The square diagram geometry and pointer coordinates remain consistent. Phone buttons use generous touch targets, typography scales with the viewport, and a compact layout accommodates landscape phones and tablets. The segmented wordmark stays on one line. Header text can wrap without forcing horizontal scrolling.

`praiser-cloudflare.zip` contains only the website files, with `index.html` at the ZIP root, ready for direct upload. Recreate the ZIP after future edits before uploading it:

~~~powershell
Compress-Archive -LiteralPath index.html,styles.css,app.js,brand.html,favicon.svg,robots.txt,sitemap.xml,_headers,assets,resources -DestinationPath praiser-cloudflare.zip -Force
~~~

## GitHub Pages hosting

The production hostname is https://praiser.us/. In the GitHub repository, open **Settings → Pages** and use **Deploy from a branch**, with branch **main** and folder **/ (root)**. Keep the custom domain set to **praiser.us**. Commit and push the relocated website files to publish the landing page. The root `index.html` is the homepage; `README.md` remains project documentation.

## Cloudflare Pages hosting

The production hostname is intended to be https://praiser.us/. The page is static and needs no build. No Cloudflare deployment has been verified yet.

### Dashboard upload

1. Sign in to the Cloudflare account that manages praiser.us.
2. Open Workers & Pages, create a Pages application, and select the Direct Upload / drag-and-drop option.
3. Name the project praiser (or reuse the intended existing Pages project). Upload praiser-cloudflare.zip and deploy. The ZIP has index.html at its root.
4. Open the Pages project's Custom domains tab and choose Set up a custom domain. Enter praiser.us and follow the activation flow.
5. Cloudflare can add the DNS record automatically when the domain is in the same account. If an existing website record conflicts, inspect it before replacing it. Preserve email and unrelated DNS records.
6. Verify the Pages deployment and then https://praiser.us/ after the domain and certificate become active.

### Later updates using Wrangler

From this project directory in a normal PowerShell terminal:

~~~powershell
npx.cmd wrangler login
npx.cmd wrangler pages project list
Expand-Archive -LiteralPath praiser-cloudflare.zip -DestinationPath .sites-runtime/cloudflare-public -Force
npx.cmd wrangler pages deploy .sites-runtime/cloudflare-public --project-name praiser --branch main
~~~

Use the actual project name and production branch returned by Cloudflare. For the first CLI deployment, create the project with 'npx.cmd wrangler pages project create praiser --production-branch main' only if it does not already exist. Authenticate through Cloudflare; no token needs to be placed in source files or chat.

Direct Upload projects cannot be converted to Git-integrated projects. Cloudflare Pages is an alternative host to GitHub Pages; its ZIP upload contains only the website files.

Official guides: https://developers.cloudflare.com/pages/get-started/direct-upload/ and https://developers.cloudflare.com/pages/configuration/custom-domains/
