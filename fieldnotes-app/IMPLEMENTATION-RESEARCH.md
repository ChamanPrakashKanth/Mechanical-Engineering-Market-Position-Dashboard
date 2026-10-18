# Research and implementation notes

Research date: 18 October 2026. The user requested a free, advertising-supported business with no early paywall. This implementation converts the local money app into MechIntel Fieldnotes, a standalone companion to the existing career dashboard. The dashboard and Blogger publication were not modified or deployed.

## What the research supports

- [NASA Glenn, Reynolds number](https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html): supports the dimensionless ratio and dynamic/kinematic viscosity relationship. Implemented with explicit SI conversions; pipe flow bands are stated separately.
- [DOE Fundamentals Handbook, Fluid Flow](https://www.energy.gov/documents/doe-hdbk-1012-92vol3): supports the internal-flow and head-loss models. Implemented Darcy friction factors with a laminar solution and iterative Colebrook turbulent solution. Transition is deliberately not interpolated.
- [OpenStax, heat transfer](https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer): supports the flat-wall steady-conduction model. Implemented signed heat rate, flux and whole-panel resistance. Examples are original and use explicitly stated exercise values.
- [Google Search Central, crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): recommends real anchor links. Implemented standalone HTML URLs, real links and per-page metadata.
- [Google Search Central, JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): describes separate crawl/render processing. All 20 content pages are prerendered, with an additional 404 page. Calculator interactions hydrate in the browser.
- [AdSense content policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en): excludes low-value and unfinished screens. No ad snippets are placed on input/error screens or elsewhere in this release.
- [AdSense privacy disclosures](https://support.google.com/adsense/answer/10502938?hl=en&topic=1271507) and [cookies](https://support.google.com/adsense/answer/7549925?hl=en): actual data practices must be disclosed. Privacy text accurately describes the current implementation: no analytics, cookies or ads; external links and hosting requests remain relevant.
- [Blogger advertising integration](https://support.google.com/blogger/answer/1269077?hl=en): provides a separate Earnings flow for the existing blog. Blog approval does not automatically approve this companion site; [each added site is reviewed](https://support.google.com/adsense/answer/9246927?hl=en-GB).

## Decisions and limits

Primary-source research validates the models and site architecture. It does not establish keyword volumes, traffic potential, ranking, advertiser RPM, business profitability, or likelihood of approval. No paid keyword data, Search Console, Bing reports, audience analytics or AdSense account was inspected. Nine guides are distinct explanations, not keyword variants generated at scale. Page counts are not eligibility guarantees.

No fabricated revenue dashboard, paid checkout, publisher ID, domain, analytics results or approval status is included. A real deployment URL enables canonical URLs and a sitemap at build time. Ad integration remains an account-dependent launch step, documented in README.

The new app does not import the earlier monetization components. Earlier entry point and styles are preserved in legacy/; original component and data files remain available in src/.

## Toolbox expansion

Added pipe velocity (Q/A), pump power (hydraulic, shaft, electrical) and sensible heating energy (mcΔT). The pump model references the [DOE pumping sourcebook](https://www.energy.gov/sites/default/files/2014/05/f16/pump.pdf); sensible heating references [OpenStax specific heat](https://openstax.org/books/physics/pages/11-2-heat-specific-heat-and-heat-transfer). Each has an original worked exercise and known-answer tests. Three more guide pages and a formula sheet bring the build to 21 pages.

Optional saved-tool identifiers use local storage, explicitly disclosed in Privacy. Calculation inputs and what-if baselines are not persisted. Scenario comparisons display baseline inputs, absolute changes and relative percentages; efficiency differences use percentage points.

## Mechanics and unit conversion release

Added uniform-bar axial stress/extension and free linear thermal expansion using [OpenStax elasticity](https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus) and [OpenStax thermal expansion](https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion). Both use a stated 1% approximation bound, not a material strength or safety threshold. Added two original worked exercises. The unit converter references [NIST conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8). It preserves pressure references and handles affine temperature conversions separately. This release contains eight calculators, eleven guides and 26 total static pages.
