# Feature research — October 14, 2026

## Decision

Build a mechanical engineering resume–job description keyword and evidence checker. It extends the existing resume builder and gives visitors an immediate application task with a dedicated, indexable URL. This is a qualitative product and search-intent decision; no paid keyword volume, ranking difficulty, conversion data, or competitor traffic measurements were available. No ranking or citation outcome is guaranteed.

## Research findings

- Google says ordinary SEO practices apply to AI features, with no special AI schema required: https://developers.google.com/search/docs/appearance/ai-features
- Google emphasizes original, useful content and accessible page experiences: https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search/
- Bing emphasizes focused URLs, crawlable internal links, explicit facts, useful original content, and accurate structured data: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a
- MIT recommends describing actions, projects, and outcomes with relevant job terminology: https://capd.mit.edu/resources/resumes-writing-about-your-skills/
- CareerOneStop recommends specific accomplishments and relevant posting terminology: https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx
- O*NET provides mechanical engineering tasks and technology context, rather than a universal employer screening model: https://www.onetonline.org/link/summary/17-2141.00

Search results already contain generic ATS checkers and mechanical engineering keyword scanners. A checker alone is not a unique or low-competition opportunity. The chosen implementation combines a published dictionary, match excerpts, engineering evidence prompts, a worked example, clear limitations, local processing, and the existing resume builder.

## Alternatives considered

| Feature | Assessment |
| --- | --- |
| Generic FAQ library | Easy to crawl, but weak standalone utility and overlaps the existing career guides. |
| Salary predictor | Potentially useful, but needs reliable location-specific current data; simulated figures would not justify authoritative salary answers. |
| Resume–job evidence checker | Best fit with existing tools and deterministic constraints; supports a concrete task without invented employment statistics. |

## Implementation

One canonical HTML page with visible answer sections, a skill/evidence table, primary-source links, method disclosure, WebApplication markup, and a fictional demo. Homepage and career-guide links plus a sitemap entry support discovery. No fabricated ratings, hidden keywords, job listings, or hiring guarantees. Private input and generated results are not published as crawlable pages. The dictionary only measures literal technical mentions, including aliases; it cannot evaluate negation or competence.

## Measurement after indexing

Use Search Console to inspect the new URL and track impressions, clicks, and queries such as mechanical engineering resume checker, mechanical engineer resume keywords, and resume job description match. These are target query themes, not measured search volumes. Bing Webmaster Tools AI Performance can report citation activity separately from visits: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c

Compare results after sufficient impressions accumulate. Improve the page from actual queries and user feedback, rather than publishing many near-duplicate keyword pages. Indexing and rankings are controlled by search engines.
