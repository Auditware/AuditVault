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
### [disclosures](./disclosures)
* https://hackerone.com/graphql - public Hacktivity index (anonymous, read-only; high/critical only; metadata cards, report bodies are login-walled)
### [auditors](./auditors)
* generated from findings and hacks data
### [protocols](./protocols)
* generated from findings and hacks data
### [programs](./programs)
* generated from disclosures (web2 bounty programs - the analog of protocols/)
### [cwe](./cwe)
* generated from disclosures - per-CWE reference pages, every disclosure of the class ranked by votes
### [terminology](./terminology)
* protocol-specific terms live under `protocols/{name}/terminology/`

vault admin notes on [./vault-admin](./vault-admin)
data scraped with `./crawler`

## General Preferences
### indexing
- use tags property for pure labels with no HON note: `lang/`, `severity/`, `platform/`, `has/`, `blockchain/`, `sdk/`, `env/`, `stack/`, `os/`, `cwe/`, `type/`
- use wikilinks (appended at end of body) for all HON-backed classifications: `check/`, `vuln/`, `impact/`, `web3-sector/`, `novelty/`, `trigger/`, `fix/`, `precondition/`, `misassumption/`, `blast-radius/`
- web3-sector wikilinks use `name/name` format (e.g. `[[lending/lending]]`) to resolve `classifications/web3-sector/{name}/{name}.md`
- all items under `./classifications/bug/` are wikilinks not tags
