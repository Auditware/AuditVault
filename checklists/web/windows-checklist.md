---
tags:
  - checklist
  - os/windows
generated: true
---
# Windows — Web Audit Checklist

> **Surface:** `os/windows` (operating system where relevant (ios, android, windows, ...)) | **Disclosures:** 27 | **Critical:** 1 | **Total known bounty:** $15,710 (6 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/code-injection|Code Injection]] - 8 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 3 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 3 disclosures
- [ ] [[cwe/improper-certificate-validation|Improper Certificate Validation]] - 2 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 2 disclosures
- [ ] [[cwe/information-exposure-through-sent-data|Information Exposure Through Sent Data]] - 1 disclosure
- [ ] [[cwe/untrusted-search-path|Untrusted Search Path]] - 1 disclosure
- [ ] [[cwe/cleartext-transmission-of-sensitive-information|Cleartext Transmission Of Sensitive Information]] - 1 disclosure
- [ ] [[cwe/encoding-error|Encoding Error]] - 1 disclosure
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 1 disclosure
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `curl` (6), `Node.js third-party modules` (4), `Internet Bug Bounty` (3), `Acronis` (2), `Node.js` (2), `Monero` (2), `Basecamp` (1), `Ubiquiti Inc.` (1), `8x8` (1), `Brave Software` (1), `Cloudflare Public Bug Bounty` (1), `Kubernetes` (1), `Automattic` (1), `GitLab` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-955016-gitlab-runner-on-windows-docker-auth-config-container-host-c|"GitLab-Runner on Windows `DOCKER_AUTH_CONFIG` container host Command Injection"]] - `high`, undisclosed, 77 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-2231019-cve-2023-5528-insufficient-input-sanitization-in-in-tree-sto|"CVE-2023-5528: Insufficient input sanitization in in-tree storage plugin leads to privilege escalation on Windows nodes"]] - `high`, $5,000, 69 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1941390-plaintext-leakage-of-dns-requests-in-windows-1-1-1-1-warp-cl|"Plaintext leakage of DNS requests in Windows 1.1.1.1 WARP client"]] - `high`, undisclosed, 53 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-1692603-jitsi-desktop-client-rce-by-interacting-with-malicious-url-s|"Jitsi Desktop Client RCE By Interacting with Malicious URL Schemes on Windows"]] - `high`, $777, 51 votes, [[programs/8x8-bounty|8x8]]
- [[disclosures/h1-1016966-remote-code-execution-in-basecamp-windows-electron-app|"Remote Code Execution in Basecamp Windows Electron App"]] - `high`, undisclosed, 48 votes, [[programs/basecamp|Basecamp]]
- [[disclosures/h1-2585385-important-apache-http-server-on-windows-unc-ssrf-cve-2024-38|"important: Apache HTTP Server on WIndows UNC SSRF (CVE-2024-38472)"]] - `high`, $4,920, 45 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-3619409-windows-installer-grants-low-privileged-users-write-access-t|"Windows installer grants low-privileged users write access to executable P2Pool directory, enabling local code execution"]] - `high`, undisclosed, 40 votes, [[programs/monero|Monero]]
- [[disclosures/h1-3255707-windows-device-names-still-allow-path-traversal-in-unc-paths|"Windows Device Names Still Allow Path Traversal in UNC Paths After CVE-2025-27210 Fix"]] - `high`, undisclosed, 39 votes, [[programs/nodejs|Node.js]]

## ⚠️ Top bug classes (vuln/)

- `code-injection` - 7
- `broken-access-control` - 5
- `privilege-escalation` - 5
- `command-injection` - 4
- `path-traversal` - 4
- `ssrf` - 3
- `dos` - 1
- `race-condition` - 1
- `info-disclosure` - 1

## 🎯 Exploit triggers (trigger/)

- `victim-interaction` - 1
- `low-priv-user` - 1
- `race-window` - 1
- `auth-required` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 5
- `internal-network` - 2
- `credential-theft` - 1

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 1
