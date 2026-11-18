<h1 align="center">AuditVault</h1>

<p align="center">
  <b>The security audit knowledge base.</b><br/>
  <em>Every HIGH/CRITICAL finding. Every major hack. Every disclosed report. All linked, classified, and queryable.</em>
</p>

<p align="center">
  <img src="static/hero.svg" alt="AuditVault - security audit knowledge base" width="100%"/>
</p>


<p align="center">
  <img alt="findings" src="https://img.shields.io/badge/findings-2394-critical?style=flat-square">
  <img alt="hacks" src="https://img.shields.io/badge/hacks-330-orange?style=flat-square">
  <img alt="disclosures" src="https://img.shields.io/badge/disclosures-2857-yellow?style=flat-square">
  <img alt="auditors" src="https://img.shields.io/badge/auditors-1136-blue?style=flat-square">
  <img alt="protocols" src="https://img.shields.io/badge/protocols-826-purple?style=flat-square">
  <img alt="programs" src="https://img.shields.io/badge/programs-220-blueviolet?style=flat-square">
</p>

<p align="center">
  <b>Structured</b> · Obsidian wikilinks &nbsp;·&nbsp; <b>Deep taxonomy</b> · 10+ tag axes &nbsp;·&nbsp; <b>100% Node.js</b> · one npm install
</p>


<br/>

<h2 align="center">What's inside</h2>

<p align="center">
AuditVault is an <a href="https://obsidian.md/">Obsidian</a> knowledge base for security research.<br/>
It aggregates smart contract audit findings, DeFi hack post-mortems, and web bug bounty disclosures, enriches them with a deep<br/>
classification taxonomy, and links everything together - protocols to auditors, findings to bug patterns, hacks to attack vectors,<br/>
programs to disclosures, CWEs to surfaces.<br/><br/>
Think of it as <em>searchable institutional memory</em> for security researchers.
</p>

| Directory          | Source                                                                                                                                                                   | Content                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `findings/`        | [Solodit/Cyfrin](https://solodit.cyfrin.io), [Frankcastleauditor](https://github.com/Frankcastleauditor/public-audits), [Auditware](https://github.com/Auditware/audits) | HIGH/CRITICAL findings          |
| `hacks/`           | [rekt.news](https://rekt.news/leaderboard)                                                                                                                               | Hacks with confirmed loss       |
| `disclosures/`     | [HackerOne Hacktivity](https://hackerone.com/hacktivity)                                                                                                                  | High/Critical web2 disclosure cards |
| `programs/`       | Generated                                                                                                                                                                | Per-program pages with stats    |
| `cwe/`             | Generated                                                                                                                                                                | Per-CWE reference pages         |
| `auditors/`        | Generated                                                                                                                                                                | Per-auditor profiles with stats |
| `protocols/`       | Generated                                                                                                                                                                | Per-protocol pages with tags    |
| `classifications/` | Hand-curated                                                                                                                                                             | Full vulnerability taxonomy     |
| `checklists/`      | Generated                                                                                                                                                                | Per-sector audit checklists     |

<br/>

<h2 align="center">Deep taxonomy</h2>

<p align="center">Every finding is tagged across 10+ axes - queryable in Obsidian via tags, graph view, or Dataview.</p>

```yaml
tags:
  - severity/high
  - lang/solidity
  - blockchain/evm
  - web3-sector/lending
  - platform/code4rena
  - has/poc
  - vuln/reentrancy/read-only
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - blast-radius/protocol-wide
protocol: "[[Aave]]"
auditors:
  - "[[trust]]"
report: "https://github.com/..."
```

<br/>

<h2 align="center">Setup</h2>

<p align="center">Requires <a href="https://obsidian.md/">Obsidian</a> (free). Clone and open as vault.</p>

```bash
git clone https://github.com/Auditware/AuditVault
```

<br/>

<h2 align="center">Crawler</h2>

<p align="center">
The <code>vault-admin/crawler/</code> directory is a pure Node.js pipeline that keeps the vault fresh.<br/>
All scripts are <b>re-run safe</b> - they skip files that already exist or are already tagged.
</p>

```bash
cd vault-admin/crawler && npm install
```

```bash
# Scrape
node scrape_all.js              # Solodit/Cyfrin findings (web3)
node scrape_rekt.js             # rekt.news hacks (web3)
GITHUB_TOKEN=... node scrape_github_audits.js
node scrape_hacktivity.js       # HackerOne disclosed reports (web2)

# Tag
node tag_new.js                 # frontmatter for new findings
node tag_vault.js               # protocol/ sector tags
node tag_report_lang.js         # lang/ tags from GitHub report sources
node tag_report_sector.js       # sector/ tags (content + report fallback)
node tag_bugs.js                # vuln/ impact/ trigger/ full taxonomy

# Enrich
node normalize_protocols.js     # protocol: raw strings → [[WikiLink]]
node gen_proto_data.js          # synthesize data/proto_data.json from the vault
node tag_protocols.js           # tag protocol pages from proto_data.json
node gen_auditor_profiles.js    # rebuild auditors/ profiles
node gen_sector_checklists.js   # build checklists/ from tagged findings

# Web2 enrich (disclosures/)
node tag_disclosures.js         # env/ stack/ os/ axes
node gen_program_pages.js       # programs/ pages from disclosures
node gen_cwe_pages.js            # cwe/ per-CWE reference pages
node gen_web_checklists.js      # checklists/web/ per-surface checklists
node gen_web2_correlations.js   # Web2 Correlations.md - cross-axis stats + live query blocks
```

<br/>

<h2 align="center">Contributions</h2>

<table align="center">
<tr>
    <td align="center">
        <a href="https://github.com/forefy">
            <img src="https://avatars.githubusercontent.com/u/166978930?v=4" width="80" alt="forefy"/>
            <br/><sub><b>forefy</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/BLTC-520">
            <img src="https://avatars.githubusercontent.com/u/125104831?v=4" width="80" alt="BLTC-520"/>
            <br/><sub><b>BLTC-520</b></sub>
        </a>
    </td>
</tr>
</table>

<p align="center">PRs welcome - new classification rules, manual overrides, scraper improvements, or additional sources.</p>

