---
tags:
  - checklist
  - os/linux
generated: true
---
# Linux — Web Audit Checklist

> **Surface:** `os/linux` (operating system where relevant (ios, android, windows, ...)) | **Disclosures:** 19 | **Critical:** 3 | **Total known bounty:** $8,850 (6 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 3 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 3 disclosures
- [ ] [[cwe/cross-site-scripting-xss-reflected|Cross Site Scripting Xss Reflected]] - 2 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 2 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 2 disclosures
- [ ] [[cwe/memory-corruption-generic|Memory Corruption Generic]] - 2 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 1 disclosure
- [ ] [[cwe/path-traversal|Path Traversal]] - 1 disclosure
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 1 disclosure
- [ ] [[cwe/double-free|Double Free]] - 1 disclosure
- [ ] [[cwe/improper-restriction-of-authentication-attempts|Improper Restriction Of Authentication Attempts]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Linux Foundation Decentralized Trust` (11), `Internet Bug Bounty` (6), `Node.js` (1), `Tor` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-496285-ubuntu-linux-privilege-escalation-dirty-sock|"Ubuntu Linux privilege escalation (dirty_sock)"]] - `high`, undisclosed, 103 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-253429-linux-tbb-sftp-uri-allows-local-ip-disclosure|"Linux TBB SFTP URI allows local IP disclosure"]] - `critical`, $3,000, 71 votes, [[programs/torproject|Tor]]
- [[disclosures/h1-411364-brute-force-of-fabric-ca-server-admin-account|"Brute Force of fabric-ca server admin account"]] - `high`, undisclosed, 61 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-2410111-docker-secret-disclosure-via-github-actions-cache-poisoning|"Docker Secret Disclosure via GitHub Actions Cache Poisoning"]] - `high`, undisclosed, 56 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-1705717-pool-upgrade-request-handler-may-allow-an-unauthenticated-at|"POOL_UPGRADE request handler may allow an unauthenticated attacker to remotely execute code on every node in the network. "]] - `critical`, $2,000, 39 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-2255968-cve-2023-46132|"CVE-2023-46132"]] - `high`, undisclosed, 34 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-1604951-remote-denial-of-service-in-hyperledger-fabric|"Remote denial of service in  HyperLedger Fabric"]] - `high`, undisclosed, 32 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-1548870-unauthorized-packages-modification-or-secrets-exfiltration-v|"Unauthorized packages modification or secrets exfiltration via GitHub actions"]] - `high`, $1,500, 25 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]

## ⚠️ Top bug classes (vuln/)

- `dos` - 6
- `code-injection` - 4
- `misconfiguration` - 2
- `xss` - 1
- `path-traversal` - 1
- `broken-access-control` - 1
- `privilege-escalation` - 1

## 🎯 Exploit triggers (trigger/)

- `auth-required` - 1
- `admin-required` - 1
- `brute-force` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 2
