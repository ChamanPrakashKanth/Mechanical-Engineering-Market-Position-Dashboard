# MechIntel Fieldnotes

A free engineering learning hub with eight working calculators, eleven original guides, a printable reference sheet, local saved-tool shortcuts and scenario comparisons. No account, paywall, analytics or active ad scripts. Research and decisions are documented in [IMPLEMENTATION-RESEARCH.md](IMPLEMENTATION-RESEARCH.md).

## Run locally

Requires Node 22.12+ (verified with Node 22.22.3).

```powershell
npm ci
npm run dev
```

Production preview (includes prerendered pages):

```powershell
npm run build
npm test
npm run preview -- --host 127.0.0.1
```

`npm run build` builds client and server bundles, then generates 26 HTML files in `dist/`: home, eight calculators, eleven guides, a unit converter, a formula sheet, About, Privacy, Methods, and 404. Deploy the contents of `dist/` to a static host. `dist-ssr/` is a build artifact, not a public deployment directory. The preview must remain running for local browser access.

## Hosting configuration

For a domain-root deployment, set SITE_URL to the actual site root before building. For deployment beneath a path, also set BASE_PATH. Both paths must end in `/` and match. No domain is assumed by default.

```powershell
# Replace these example values with your actual deployment location.
$env:SITE_URL = 'https://YOUR-ACTUAL-HOST/fieldnotes/'
$env:BASE_PATH = '/fieldnotes/'
npm run build
```

With SITE_URL, builds include self-referencing canonical links and a sitemap. Without it, the site works but those domain-specific signals are omitted. `robots.txt` is generated in both cases. For a subdirectory deployment, configure the domain-root robots.txt separately with the sitemap location. Configure the host to serve the generated 404.html with HTTP status 404. Existing public sites have not been changed.

## Publishing and advertising

1. Choose the hosting destination and build with its actual URL. Review the creator contact links and public text. Deploy `dist/` and confirm every deep link, mobile layout and calculator works over HTTPS.
2. Verify the property in Search Console or Bing Webmaster Tools and submit the generated sitemap. Review actual index coverage and search performance; do not invent traffic targets from the number of guides.
3. Apply for AdSense using the actual live property. If you already have a Blogger-linked AdSense account, add this site to that account for its own review. Do not create a duplicate account or accept terms without the account owner's action.
4. Once account setup, site review and required privacy/consent configuration are complete, use the real publisher verification code from AdSense. Add only the verified ads.txt record supplied for the account. No dummy ads.txt or fake publisher ID is generated here.
5. Update privacy text to the actual ad and analytics practices before loading those scripts. Configure Google's required consent tooling for applicable regions. Follow the current account instructions and regional requirements; this README is not a substitute for them.
6. Begin with one clearly labelled responsive placement after a substantive article section. Keep ads away from calculator controls and navigation; exclude error/empty/about/privacy pages. Measure layout shift, page speed, engaged visits and actual revenue before adding placements. Do not encourage users to click ads or create forced page views.

Ads are intentionally not activated: this workspace has no supplied publisher ID, approved property or chosen production domain. This implementation is a free publishing foundation, not an assertion of AdSense approval or live revenue.

## Engineering behaviour

- Reynolds: explicit mm → m and mPa·s → Pa·s conversion. Re < 2,000 is laminar, 2,000–4,000 inclusive transitional, above 4,000 turbulent. These are pipe-flow conventions.
- Pipe drop: fully developed incompressible circular flow; Darcy–Weisbach, 64/Re or iterative Colebrook. No transition estimate; relative roughness limited to 0.05 and Re to 10⁸. Excludes fittings, elevation, entrances and equipment. Zero speed gives zero loss.
- Conduction: one-dimensional steady single flat layer, constant k. Signed rate, heat flux, whole-panel resistance and flow direction. Rejects below-absolute-zero temperatures and nonpositive geometry/properties.
- Calculations stay in browser memory. The download contains input values and units, formula, assumptions, reference and results as JSON. It is not uploaded or saved to browser storage. Users may separately save tool identifiers on their device; no inputs or scenario baselines are persisted.

## Checks

Run `npm run build` before `npm test`, because site tests inspect the production HTML. The 41 checks cover known-answer examples, boundary conditions, dimensional conversions, overflow, invalid inputs, Colebrook residual, model relations, prerendering and local link integrity. `npm run lint` reports pre-existing warnings in preserved old components; active new modules can be checked with `npx oxlint src/App.jsx src/engineering.js src/expansion.js src/Comparison.jsx src/LearningPaths.jsx src/Reference.jsx src/useSavedTools.js src/main.jsx src/entry-server.jsx scripts tests`.

Previous MonetizeOS app entry and styles are preserved under `legacy/`. Restore the entry at src/App.jsx and its original styles to revisit that version; its imported component/data files remain in src/. No original project outside this workspace was edited.

## Expanded toolbox

Pipe flow & velocity converts L/min and bore to mean speed and mass flow. Pump power separates fluid, shaft and electrical power with independent pump/motor efficiencies. Sensible heat estimates signed energy and ideal duration at constant net power. Each includes a worked example and bounds.

On a calculator, choose **Pin as baseline**, then edit inputs to compare numeric results. Baseline inputs remain inspectable, and downloads include the baseline. **Save tool** stores its identifier locally; the home page Saved tools filter retrieves those shortcuts. The formula sheet supports browser Print / Save as PDF.

## Published integration

The dashboard deployment hosts this app at https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/fieldnotes/ . Build with BASE_PATH=/Mechanical-Engineering-Market-Position-Dashboard/fieldnotes/ and the matching SITE_URL. The repository workflow builds and tests the app and copies it into the existing Pages artifact. A unit converter supports five quantities; the expanded calculators add axial stress/extension and linear free thermal expansion with explicit limits. No ad publisher account has been configured.
