# Dashboard analytics and repository privacy

## Verified repository state (25 October 2026)

- Repository: `ChamanPrakashKanth/Mechanical-Engineering-Market-Position-Dashboard`, public.
- Pages API: `build_type: workflow`, `public: true`, `https_enforced: true`.
- The authenticated GitHub API did not return account plan information. The owner confirmed **GitHub Free** in this chat on 25 October 2026. This plan does not support Pages from private repositories. Repository visibility remains public to preserve the live website.
- The existing deployment builds Fieldnotes, runs its checks and the MCP checks, assembles `_site`, then deploys with `actions/deploy-pages`. This integration preserves that workflow and existing URLs.
- Dependency audit identified existing Vite 8.2.2 development-server/editor vulnerabilities. Vite is updated to the patched 8.2.4 release with a lockfile update. The deployed site serves static output rather than a Vite development server.

GitHub Free supports Pages from public repositories. Pro and other eligible paid plans support private source repositories with publicly accessible Pages. Check the repository owner's **Settings → Billing and licensing → Overview** before changing visibility. Obtain explicit owner confirmation immediately before a visibility change. Preserve public Pages access and recheck the live URL after any approved change. See [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [visibility consequences](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).

If the plan is Free or uncertain, keep this repository public. To protect future source while retaining this exact github.io URL, develop in a separate private repository and publish only the static build to this existing public repository. That requires a separately reviewed cross-repository credential/workflow; none is created here. Alternatively host a private-source build on Cloudflare Pages or Netlify; that changes the hostname unless you establish a custom domain and migration. Public HTML/JS/CSS and downloadable CAD remain publicly retrievable under every static hosting strategy. Making the repository private cannot retract prior public clones or protect code already delivered to browsers.

## Scope and configuration

GA4 is integrated into the **main dashboard (`index.html`) only**. Standalone CAD tools, Fieldnotes, AnswerLens and other pages retain their current offline/no-analytics behavior. No GA4 property or web stream has been created by this change, and analytics are not operational until a real ID is configured and delivery is verified.

In GitHub repository **Settings → Secrets and variables → Actions → Variables**, set:

| Variable | Value | Default |
| --- | --- | --- |
| `GA4_MEASUREMENT_ID` | Your real web-stream ID, e.g. `G-` followed by your stream's code | Empty, disabled |
| `GA4_ENHANCED_MEASUREMENT_DISABLED` | `true` only after completing the GA4 stream configuration below | Disabled |
| `GA4_DEBUG` | `true` temporarily for DebugView, then `false` | `false` |

These are public build settings, not secrets. Do not add account passwords, API keys or service-account credentials. The workflow generates `_site/analytics-config.js` from these variables. Missing settings keep the deployed site working with analytics off. A malformed or placeholder ID fails the configuration step rather than silently deploying a misleading setup. The checked-in `analytics-config.js` is deliberately disabled for local development. No paid service, API key, GPU or backend is required for the website integration.

## Required GA4 stream setup before activation

1. In GA4 **Admin → Data streams → Web**, use the dashboard's public URL. Copy its Measurement ID.
2. **Turn off all Enhanced Measurement for this stream**, especially form interactions, file downloads, history-based page views and site search. Google can otherwise collect URLs, search terms, form metadata or duplicate events outside our allowlist. The deployment confirmation variable is an owner attestation; the static site cannot inspect server-side stream settings.
3. Leave user-provided data collection, Google Signals and advertising features disabled. The code also disables Signals and advertising personalization. Do not configure a user ID, personal user properties or a second Google tag/GTM container.
4. Configure data retention, access controls, reporting timezone and any applicable data processing arrangements for your audience. The consent UI blocks GA4 globally until opt-in, respects Do Not Track/Global Privacy Control, and offers a persistent preferences button. Review the notice and consent policy for your actual jurisdiction and organization before activation; this code alone does not establish legal compliance.
5. Set the repository variables, then run **Actions → Deploy crawlable MechIntel site → Run workflow** (or push a commit). Check that deployment succeeds.

## Privacy and event behavior

- Basic consent mode: **no Google tag request or measurement ping before acceptance**, after rejection, or with browser privacy signals. Events before consent are dropped and never replayed. Consent choice alone is stored locally for up to 180 days; storage errors default to no consent.
- A valid configuration enables an opt-in notice. Missing configuration exposes only an explanatory preferences control. Reject is as accessible as Accept. Revoking consent disables collection, removes this integration's cookies and reloads the page to unload Google's timers. Cross-tab revocation is handled too.
- One manual `page_view` is emitted per document after consent. Automatic initial page views are disabled in code; Enhanced Measurement must also be disabled in GA4. Hash changes and dashboard panel switches are not additional page views.
- Location and title are fixed canonical dashboard values. Query strings and fragments are excluded. Referrer is reduced to its origin; campaign query values and full referring paths are intentionally excluded. Source/medium reports can use the referring origin, but UTM campaign attribution and campaign detail will be limited.
- GA4 uses its consented cookie identifiers for users/sessions and automatically measures engagement. Approximate geography and device/network processing are handled by Google; no region, location or identity from the resume/profile is sent. Counts are estimates for consented, unblocked browsers, not a complete visitor census. Never add arbitrary DOM tracking, error messages, filenames, resume text, names, contact details, user IDs or profile fields.

| Event | Actual trigger | Fixed parameters |
| --- | --- | --- |
| `resume_uploaded` | PDF successfully read locally and readable text extracted | `input_type: pdf` |
| `analysis_started` | User requests the career assessment, immediately before dashboard calculation/render | `analysis_type: career_assessment` |
| `analysis_completed` | That requested calculation/render returns successfully | Same fixed analysis type |
| `analysis_failed` | That requested calculation/render throws | Same fixed analysis type, no exception text |
| `report_downloaded` | Generated competency CSV or visual portfolio HTML download is dispatched | Allowlisted report type and `csv`/`html` |

`resume_uploaded` means successful local ingestion, not server upload. Unsupported/unreadable files and pasted text do not emit it. Startup restore, preset selection, course updates and profile edits are not recorded as newly requested analyses. Print dialog opening is not a confirmed PDF download, so it does not emit `report_downloaded`; browsers do not expose whether a user actually saved a print-to-PDF file. Download events represent dispatch of generated files, not proof of disk save. Repeated real user actions create repeated events; duplicate listeners/tag initialization do not.

## Verify after configuring a real Measurement ID

1. Open a fresh browser profile without blockers. Before choosing consent, inspect Network: no `googletagmanager.com/gtag/js` or Google Analytics collection requests. Reject and reload; confirm the same. Check a DNT/GPC-enabled browser too.
2. Accept analytics. Inspect Network: exactly one `gtag/js?id=G-…` script and one initial `page_view` collection event. The local `analytics.js`/`analytics-config.js` files loading does **not** demonstrate GA4 delivery.
3. Use a synthetic resume containing no personal information. Read a PDF, run analysis once, export the competency CSV and portfolio HTML. Confirm only the corresponding events. A canceled print dialog, empty/unreadable PDF, page restore and navigating dashboard panels must not create these events. For failure, use the isolated automated test rather than deliberately breaking the live app.
4. Inspect collection payloads (`collect`, often `g/collect`, including POST bodies): event parameters, `dl`, `dr` and title must not contain resume content, filenames, names, emails, query/hash values or full referrer paths. Google-generated client/session identifiers after consent are expected.
5. Open **GA4 → Reports → Realtime** and check the page and custom event names. Use **Admin → Data display → DebugView** with `GA4_DEBUG=true` deployed to inspect the sequence on your test device. Reporting processing can lag; ad blockers can prevent delivery.
6. In GA4 **Admin → Data display → Custom definitions**, optionally register event-scoped dimensions `analysis_type`, `input_type`, `report_type` and `file_format` for later standard reports. Users/sessions, acquisition, geographic region and engagement use GA4's built-in reports; there are no separate custom events for these metrics.
7. Revoke consent through Analytics preferences. Verify cookie removal and no further measurement after reload. Finally deploy `GA4_DEBUG=false`. Do not claim analytics operational until tag loading, sanitized collection requests and the intended property's Realtime/DebugView have all been verified.

## Checks

Run `node --test tests/analytics.test.cjs` and `node --check app.js`. The analytics tests use an isolated browser harness and a fake ID without sending network traffic. They cover consent gating, sanitization, allowed events, failure paths, duplicate prevention, cookie cleanup, cross-tab revocation and build config. The deployment also builds/tests Fieldnotes and verifies the MCP integration as before. These checks cannot prove delivery to a real GA4 property.

References: [Google basic consent mode](https://support.google.com/analytics/answer/14009635), [manual page views and Enhanced Measurement](https://developers.google.com/analytics/devguides/collection/ga4/views), [GA4 configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
