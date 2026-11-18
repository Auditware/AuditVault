---
tags:
  - checklist
  - env/network
generated: true
---
# Network — Web Audit Checklist

> **Surface:** `env/network` (where the bug lives (web app, mobile, cloud, desktop, appliance, network)) | **Disclosures:** 72 | **Critical:** 23 | **Total known bounty:** $65,005 (17 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 7 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 7 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 5 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 5 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 4 disclosures
- [ ] [[cwe/crlf-injection|Crlf Injection]] - 4 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 3 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 3 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 2 disclosures
- [ ] [[cwe/memory-corruption-generic|Memory Corruption Generic]] - 2 disclosures
- [ ] [[cwe/integer-overflow|Integer Overflow]] - 2 disclosures
- [ ] [[cwe/heap-overflow|Heap Overflow]] - 2 disclosures
- [ ] [[cwe/man-in-the-middle|Man In The Middle]] - 2 disclosures
- [ ] [[cwe/insecure-storage-of-sensitive-information|Insecure Storage Of Sensitive Information]] - 2 disclosures
- [ ] [[cwe/xml-injection|Xml Injection]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `curl` (14), `U.S. Dept Of Defense` (10), `Node.js` (5), `h1-ctf` (3), `8x8` (3), `Cloudflare Public Bug Bounty` (3), `Internet Bug Bounty` (3), `Brave Software` (2), `Rocket.Chat` (2), `Uber` (2), `Aiven Ltd` (1), `Palo Alto Software` (1), `Nextcloud` (1), `Linux Foundation Decentralized Trust` (1), `Mattermost` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-591295-potential-pre-auth-rce-on-twitter-vpn|"Potential pre-auth RCE on Twitter VPN"]] - `critical`, $20,160, 1246 votes, [[programs/x|X / xAI]]
- [[disclosures/h1-1888915-reset-password-link-sent-over-unsecured-http-protocol|"Reset password link sent over unsecured http protocol"]] - `high`, $750, 440 votes, [[programs/mattermost|Mattermost]]
- [[disclosures/h1-333419-turn-server-allows-tcp-and-udp-proxying-to-internal-network-|"TURN server allows TCP and UDP proxying to internal network, localhost and meta-data services"]] - `critical`, $3,500, 323 votes, [[programs/slack|Slack]]
- [[disclosures/h1-630462-heap-overflow-happen-when-receiving-short-length-key-from-ss|"Heap overflow happen when receiving short length key from ssh server using ssh protocol 1"]] - `high`, $3,645, 309 votes, [[programs/putty_h1c|PuTTY (European Commission - DIGIT)]]
- [[disclosures/h1-1077022-brave-browser-tor-window-leaks-user-s-real-ip-to-the-externa|"Brave Browser Tor Window leaks user's real IP to the external DNS server"]] - `high`, undisclosed, 280 votes, [[programs/brave|Brave Software]]
- [[disclosures/h1-807772-oob-reads-in-network-message-handlers-leads-to-rce|"OOB reads in network message handlers leads to RCE"]] - `critical`, $7,500, 219 votes, [[programs/valve|Valve]]
- [[disclosures/h1-2995025-mozilla-vpn-clients-rce-via-file-write-and-path-traversal|"Mozilla VPN Clients: RCE via file write and path traversal"]] - `high`, $6,000, 173 votes, [[programs/mozilla|Mozilla]]
- [[disclosures/h1-2858802-low-level-p2p-ping-tcp-flooding-leads-to-a-remote-crash-in-m|"low-level p2p ping + tcp flooding leads to a remote crash in monerod"]] - `critical`, undisclosed, 97 votes, [[programs/monero|Monero]]

## ⚠️ Top bug classes (vuln/)

- `code-injection` - 18
- `dos` - 16
- `command-injection` - 12
- `path-traversal` - 9
- `ssrf` - 8
- `info-disclosure` - 6
- `xss` - 5
- `authentication-bypass` - 5
- `misconfiguration` - 4
- `privilege-escalation` - 3
- `broken-access-control` - 3
- `sql-injection` - 2

## 🎯 Exploit triggers (trigger/)

- `dns-rebinding` - 7
- `victim-interaction` - 5
- `unauthenticated` - 5
- `admin-required` - 2
- `brute-force` - 2
- `social-engineering` - 2
- `low-priv-user` - 1
- `auth-required` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 18
- `sensitive-data` - 2
- `internal-network` - 2
- `dos-impact` - 1
- `account-takeover` - 1
- `persistence` - 1

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 1
- `network-isolation` - 1
- `csp` - 1
- `patch-upstream` - 1
