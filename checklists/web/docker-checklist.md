---
tags:
  - checklist
  - stack/docker
generated: true
---
# Docker — Web Audit Checklist

> **Surface:** `stack/docker` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 10 | **Critical:** 6 | **Total known bounty:** $600 (2 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/information-disclosure|Information Disclosure]] - 3 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 2 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 1 disclosure
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Nextcloud` (2), `Internet Bug Bounty` (2), `U.S. Dept Of Defense` (2), `Linux Foundation Decentralized Trust` (1), `Semmle` (1), `Uber` (1), `Informatica` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-347296-docker-registry-http-api-v2-exposed-in-http-without-authenti|"Docker Registry HTTP API v2 exposed in HTTP without authentication leads to docker images dumping and poisoning"]] - `critical`, undisclosed, 83 votes, [[programs/semmle|Semmle]]
- [[disclosures/h1-2410111-docker-secret-disclosure-via-github-actions-cache-poisoning|"Docker Secret Disclosure via GitHub Actions Cache Poisoning"]] - `high`, undisclosed, 56 votes, [[programs/hyperledger|Linux Foundation Decentralized Trust]]
- [[disclosures/h1-366638-data-07-uberinternal-com-ssrf-in-portainer-app-lead-to-acces|"[data-07.uberinternal.com] SSRF in Portainer app lead to access to Internal Docker API without Auth"]] - `critical`, $500, 37 votes, [[programs/uber|Uber]]
- [[disclosures/h1-631348-public-github-repo-leaking-internal-credentials-leading-to-d|"Public Github Repo Leaking Internal Credentials Leading To DiscoveryIQ Docker Access"]] - `critical`, undisclosed, 24 votes, [[programs/informatica|Informatica]]
- [[disclosures/h1-1671140-cve-2022-38362-apache-airflow-docker-provider-3-0-rce-vulner|"CVE-2022-38362: Apache Airflow Docker Provider <3.0 RCE vulnerability in example dag"]] - `high`, undisclosed, 22 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-2312609-full-access-to-sonarqube-and-docker|"Full Access to sonarQube and Docker"]] - `critical`, undisclosed, 21 votes, [[programs/deptofdefense|U.S. Dept Of Defense]]
- [[disclosures/h1-720306-docker-image-with-fpm-is-vulnerable-to-cve-2019-11043|"Docker image with FPM is vulnerable to CVE-2019-11043"]] - `critical`, $100, 16 votes, [[programs/nextcloud|Nextcloud]]
- [[disclosures/h1-924487-exposed-docker-registry-at-https|"Exposed Docker Registry at https://████"]] - `high`, undisclosed, 15 votes, [[programs/deptofdefense|U.S. Dept Of Defense]]

## ⚠️ Top bug classes (vuln/)

- `command-injection` - 1
- `authentication-bypass` - 1

## 🎯 Exploit triggers (trigger/)

- `unauthenticated` - 2

## 💥 Demonstrated impact (impact/)

- `rce` - 3
