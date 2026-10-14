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


## Second feature batch — portfolio evidence workflow

Added one focused portfolio page with two tools: an educational project brief planner and a factual resume bullet builder. Four original project briefs cover CAD/drawings, FEA verification, thermal assumptions, and quality data. Effort ranges are editorial estimates, disclosed as such. No hiring scores or invented accomplishments.

Research: ABET Engineering Criteria 2026–2027 supports the educational focus on needs, constraints, and interpreting evidence: https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-engineering-programs-2026-2027/ . MIT CAPD supports connecting actions, projects, and documented outcomes: https://capd.mit.edu/resources/resumes-writing-about-your-skills/ . Neither organization endorses the tools.

Search results contain numerous project idea lists and portfolio examples. Our product hypothesis is that a brief with requirements and verification is more useful than another undifferentiated list. This has not been validated with keyword volume or traffic data.

### Agreed success measure

The user selected growing relevant impressions and clicks. Request Search Console Queries and Pages exports for the last three months; record an initial baseline and compare comparable periods with query and page context. Separate social traffic from organic traffic. Inspect indexing before attributing low impressions to content quality. Allow time for recrawling and sufficient impressions. No numeric growth target is set without a baseline.

Measurement reference: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console . Google warns against creating many unrelated pages mainly to attract search traffic: https://developers.google.com/search/docs/fundamentals/creating-helpful-content .

Priorities for later research (not implemented or validated demand): an engineering interview practice tool, a role-specific learning plan, and more transparent project evidence review. Choose among them using actual queries and visitor needs, not an automatic page quota.

The user reports no query history because the site is new. Baseline is currently unavailable, not assumed zero traffic. Continue launch improvements and defer performance conclusions until search data appears.
