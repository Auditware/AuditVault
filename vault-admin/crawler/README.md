# AuditVault Crawler

Scripts that feed data into the vault. All paths are relative to the vault root - no hardcoded absolute paths.

## Structure

```
crawler/
  lib/http.js             Shared transport - crawlee GotScrapingHttpClient
  scrape_all.js           Scrape findings from Solodit/Cyfrin (web3)
  scrape_rekt.js          Scrape hacks from rekt.news leaderboard (web3)
  scrape_github_audits.js Scrape HIGH/CRITICAL findings from GitHub audit repos (web3)
  scrape_hacktivity.js    Scrape disclosed high/critical reports from HackerOne (web2)
  enrich_disclosures.js  Append public report detail (researcher summary + triage timeline) to disclosures/
  tag_new.js              Add frontmatter to findings that have none yet
  tag_vault.js            Add protocol/ web3-sector tags to vault findings
  tag_report_lang.js      Detect lang/ tags by fetching GitHub report sources
  tag_report_sector.js    Add web3-sector/ tags (content-first, report-fetch fallback)
  tag_bugs.js             Rule-based vuln/ impact/ trigger/ taxonomy tagger (web3)
  tag_protocols.js        Tag protocols/ notes from proto_data.json
  gen_proto_data.js      Synthesize data/proto_data.json from the vault (findings links + protocol page bodies)
  normalize_protocols.js  Normalize protocol: fields to [[WikiLink]] format
  gen_auditor_profiles.js Generate/update auditors/ notes from indexed findings
  gen_sector_checklists.js Build per-web3-sector audit checklists from tagged findings
  tag_disclosures.js     Add env/ stack/ os/ axes to disclosures/ (web2)
  gen_program_pages.js    Generate programs/ pages from disclosures
  gen_cwe_pages.js        Generate cwe/ per-CWE reference pages from disclosures
  gen_web_checklists.js   Build per-surface web checklists (checklists/web/)
  gen_web2_correlations.js Cross-axis correlation analysis -> Web2 Correlations.md
  data/                   Runtime data (proto_data.json, etc.) - not committed
```

## Transport standard

All scraping goes through `lib/http.js` - crawlee's `GotScrapingHttpClient`: real browser TLS fingerprint, auto-generated browser-like headers, retries with gentle backoff on 403/429/5xx (honoring `retry-after`), randomized pacing so requests are never metronomic. Never raw `https.get` or curl against bot-protected sites: plain node/curl TLS fingerprints are what trip Cloudflare/Vercel bot walls. Pacing: 2s+ randomized between requests on Cloudflare-fronted sites.

## Setup

```bash
cd AuditVault/vault-admin/crawler
npm install
```

## Typical pipeline

```bash
# 1. Scrape (each source separately)
node scrape_all.js                     # Solodit (web3 findings)
node scrape_rekt.js                    # rekt.news (web3 hacks)
GITHUB_TOKEN=... node scrape_github_audits.js
node scrape_hacktivity.js              # HackerOne (web2 disclosures; H1_MAX_PAGES=2 caps a test run)

# 2. Tag + enrich web3 (findings/, hacks/)
node tag_new.js
node tag_vault.js
node tag_report_lang.js
node tag_report_sector.js
node tag_bugs.js
node normalize_protocols.js
node gen_proto_data.js
node tag_protocols.js

# 3. Generate web3 derived pages
node gen_auditor_profiles.js
node gen_sector_checklists.js

# 4. Tag + enrich web2 (disclosures/)
node tag_disclosures.js

# 5. Generate web2 derived pages
node gen_program_pages.js
node gen_cwe_pages.js
node gen_web_checklists.js
node gen_web2_correlations.js   # Web2 Correlations.md - cross-axis stats + live query blocks

# 6. Append public report detail to web2 cards (researcher summary + triage timeline)
node enrich_disclosures.js            # H1_ENRICH_MAX=3 caps a test run
```

## Notes

- All scripts are **re-run safe** - they skip files that already exist or are already tagged, so a rerun fills only the gap.
- `scrape_progress.json` tracks Solodit pagination. `hacktivity_progress.json` stores the disclosed_at watermark, written per page so a killed run resumes where it stopped. Both gitignored.
- `data/proto_data.json` must be generated before running `tag_protocols.js`.
- HackerOne: anonymous read-only queries; report bodies are login-walled and are never fetched.
- web3 (`findings/`, `hacks/`, `protocols/`, `auditors/`, `checklists/*.md`, `classifications/`) and web2 (`disclosures/`, `programs/`, `cwe/`, `checklists/web/`) never share tag axes: `web3-sector/` vs `env/` + `stack/` + `os/`; `blockchain/` + `sdk/` exist only on web3.