---
tags:
  - severity/high
---
# AuditVault

## Scrape Sources
### [findings](./findings)
* https://solodit.cyfrin.io/?i=HIGH&maxf=&minf=&qs=&rf=alltime&rs=&sd=Desc&sf=Recency
* https://github.com/Auditware/audits
* https://github.com/Frankcastleauditor/public-audits
### [hacks](./hacks)
* https://rekt.news/leaderboard
### [auditors](./auditors)
* generated from findings and hacks data
### [protocols](./protocols)
* generated from findings and hacks data
### [terminology](./terminology)
* protocol-specific terms live under `protocols/{name}/terminology/`

vault admin notes on [./vault-admin](./vault-admin)
data scraped with `./crawler`

## General Preferences
### indexing
- use tags property for pure labels with no HON note: `lang/`, `severity/`, `platform/`, `has/`, `blockchain/`, `sdk/`
- use wikilinks (appended at end of body) for all HON-backed classifications: `check/`, `vuln/`, `impact/`, `sector/`, `novelty/`, `trigger/`, `fix/`, `precondition/`, `misassumption/`, `blast-radius/`
- sector wikilinks use `name/name` format (e.g. `[[lending/lending]]`) to resolve `classifications/sector/{name}/{name}.md`
- all items under `./classifications/bug/` are wikilinks not tags
