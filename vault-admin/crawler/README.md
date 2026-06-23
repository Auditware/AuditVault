# AuditVault Crawler

Scripts that feed data into the vault. All paths are relative to the vault root - no hardcoded absolute paths.

## Structure

```
crawler/
  scrape_all.js           Scrape findings from Solodit/Cyfrin (HIGH severity)
  scrape_rekt.js          Scrape hacks from rekt.news leaderboard
  scrape_github_audits.js Scrape HIGH/CRITICAL findings from GitHub audit repos
  gen_auditor_profiles.js Generate/update auditors/ note from indexed findings
  tag_new.js              Add frontmatter to findings that have none yet
  tag_vault.js            Add protocol/ sector tags to vault findings
  tag_report_lang.js      Detect lang/ tags by fetching GitHub report sources
  tag_report_sector.js    Add sector/ tags (content-first, report-fetch fallback)
  tag_bugs.js             Rule-based vuln/ impact/ trigger/ taxonomy tagger
  tag_protocols.js        Tag protocols/ notes from proto_data.json
  normalize_protocols.js  Normalize protocol: fields to [[WikiLink]] format
  gen_sector_checklists.js Build per-sector audit checklists from tagged findings
  data/                   Runtime data (proto_data.json, etc.) - not committed
```

## Setup

```bash
cd AuditVault/vault-admin/crawler
npm install
```

## Typical pipeline

```bash
# 1. Scrape new findings
node scrape_all.js
node scrape_rekt.js
GITHUB_TOKEN=... node scrape_github_audits.js

# 2. Tag new findings
node tag_new.js
node tag_vault.js
node tag_report_lang.js
node tag_report_sector.js
node tag_bugs.js

# 3. Enrich protocol pages
node normalize_protocols.js
# generate data/proto_data.json externally, then:
node tag_protocols.js

# 4. Generate auditor profiles
node gen_auditor_profiles.js

# 5. Generate per-sector audit checklists (writes to checklists/)
node gen_sector_checklists.js
```

## Notes

- All scrapers are **re-run safe** - they skip files that already exist or are already tagged.
- `scrape_progress.json` tracks Solodit pagination so scrapes can be resumed.
- `data/proto_data.json` must be generated before running `tag_protocols.js`.
