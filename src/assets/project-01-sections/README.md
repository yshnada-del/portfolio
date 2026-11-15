# URL-free proposal artboards

Current: all 14 artboards use 1920 × 1080 canvases, exported at 3840 × 2160.
Original section headings, subtitles and introductions retain their text
pixels and weights. Home, Health, Calendar and Community use the same clean
left-explanation/right-mockup layout as My Page and Premium. Floating
leaders and gray panels have been removed from those nine artboards.
Explanations use the Premium type scale: Pretendard 24px/600 headings and
20px/400 body text. Five-screen sequences use a three-plus-two grid without
dropping screens. Background templates are in `../project-01-templates/`.

The updated app screenshots use the exact 390 × 844 viewport and a 3×
pixel density. Device frames match DesktopExperience (408 × 862 frame).
The full official Pretendard variable font is explicitly loaded before
capture to prevent CDN fallback fonts from changing Korean line breaks.
The login heading is checked to keep its first sentence on one line.

Screenshot sources and capture manifests are in `../project-01-screens/`.
Captures use an isolated demo account. Camera screens use the app's own
`pungpungi.png` as a camera fixture, without accessing a physical camera.

Run the local portfolio dev server, then refresh with:

```powershell
npm.cmd install --prefix .local-work/mockup-tools --no-save playwright sharp material-icons
Invoke-WebRequest 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2' -OutFile '.local-work/mockup-tools/PretendardVariable.woff2'
node scripts/refresh-jibsalife-mockups.mjs
node scripts/refresh-jibsalife-mockups.mjs --update-cropped
```

Use `--render-only` to rebuild from retained screenshots. Override
`JIBSALIFE_CAPTURE_URL` for another dev server URL. HTML/CSS composes device
frames, and the renderer composites them over the preserved original
templates. Typography verification results are saved with the captures.

My Page uses separate top-profile and lower-activity screenshots so the
subscription management entry is fully visible. Premium uses the latest
demo subscription management screen, plus an actual cropped capture of its
expanded benefits and subscription details. Legacy pricing screens are not
used. AI Chat shows the complete first greeting and record choices in two
separate native screenshots. No app typography or viewport sizes are changed.
All 14 artboards use a 24px gap between the mockup bottom and caption top.
`--audit-all` recaptures all states and audits visible text boundaries;
`--update-cropped --rebuild-panels` refreshes the split-state captures and
rebuilds the clean-layout boards. `--render-only --rebuild-panels` lays out
the retained captures without opening the app. Original visible heading
pixels are compared after every render; the old background gradient and
cropped callout fragments are excluded. Community's final board reuses the
complete Community heading from its first board. Explanation overflow,
caption bounds and caption/screenshot overlap are checked during rendering.
Capture and caption geometry checks are retained with the screenshots.
Health's four-screen sequence starts with the actual `/health/check` loading
screen, followed by the report, detailed information and nearby hospitals.
Use `--health-only --rebuild-panels` to capture that brief loading state and
rebuild this board. The strip below its heading is checked for leftover
callout pixels in the final export.

The cover and UI Design overview use `../project-01-cover.png` and
`../project-01-ui-design.png`. Rebuild these with
`node scripts/render-jibsalife-overviews.mjs`. They reuse the same latest
device frame and retained app captures; the cover uses `welcome.png`.
Backgrounds, logos, text and QR artwork outside the phone replacement
regions are compared pixel-for-pixel. `overview-checks.json` records those
checks. Local proposal replacement keys include `cover` and `ui-design`,
so the page and image enlargement both use the updated assets.

Original export source: Figma file `yPqbfIWAG8Reieect7REts`, page `166:43`.
The table below records the previous image exports.

The original proposal order is retained by matching the filenames below.
Both the proposal and its image enlargement dialog use these local assets.

| Filename | Figma frame | Imported from |
| --- | --- | --- |
| onboarding.png | 166:87 | Figma export |
| login-page.png | 166:201 | Figma export |
| health-01.png | 166:300 | Frame.png |
| health-02.png | 166:526 | Frame-1.png |
| calendar.png | 166:570 | Frame-2.png |
| home-01.png | 166:655 | Frame-3.png |
| home-02.png | 166:687 | Frame-4.png |
| home-03.png | 166:712 | Frame-5.png |
| my-page.png | 166:730 | Frame-6.png |
| petstagram.png | 166:781 | Frame-7.png |
| community-01.png | 166:817 | Frame-8.png |
| community-02.png | 166:873 | Frame-9.png |
| community-03.png | 166:930 | Frame-10.png |
| ai-chat.png | 166:976 | Frame-11.png |

Store source assets here, not in `dist/assets`: Vite regenerates `dist`
from these files during each build.
