---
tags:
  - checklist
  - stack/java
generated: true
---
# Java — Web Audit Checklist

> **Surface:** `stack/java` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 18 | **Critical:** 8 | **Total known bounty:** $29,240 (4 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/code-injection|Code Injection]] - 6 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 3 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 2 disclosures
- [ ] [[cwe/http-request-smuggling|Http Request Smuggling]] - 2 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 1 disclosure
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 1 disclosure
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 1 disclosure
- [ ] [[cwe/path-traversal|Path Traversal]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `U.S. Dept Of Defense` (4), `Internet Bug Bounty` (4), `IBM` (3), `JetBlue` (1), `Udemy` (1), `Starbucks` (1), `Snapchat` (1), `Ubiquiti Inc.` (1), `Django` (1), `MTN Group` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-231460-open-prod-jenkins-instance|"Open prod Jenkins instance"]] - `high`, $15,000, 436 votes, [[programs/snapchat|Snapchat]]
- [[disclosures/h1-768266-public-instance-of-jenkins-on-https-with-script-enabled|"Public instance of Jenkins on https://██████████/ with /script enabled"]] - `critical`, undisclosed, 118 votes, [[programs/deptofdefense|U.S. Dept Of Defense]]
- [[disclosures/h1-403402-public-jenkins-instance-with-script-enabled|"Public Jenkins instance with /script enabled"]] - `critical`, undisclosed, 74 votes, [[programs/ui|Ubiquiti Inc.]]
- [[disclosures/h1-182104-completed-compromise-source-code-disclosure-via-exposed-jenk|"Completed Compromise & Source Code Disclosure via Exposed Jenkins Dashboard at https://jenkins101.udemy.com"]] - `high`, undisclosed, 63 votes, [[programs/udemy|Udemy]]
- [[disclosures/h1-2586226-cve-2024-34750-apache-tomcat-dos-vulnerability-in-http-2-con|"CVE-2024-34750 Apache Tomcat DoS vulnerability in HTTP/2 connector"]] - `high`, $4,920, 60 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-2327341-cve-2024-21733-apache-tomcat-http-request-smuggling-client-s|"CVE-2024-21733 Apache Tomcat HTTP Request Smuggling (Client- Side Desync) (CWE: 444)"]] - `high`, $4,660, 57 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-2299692-request-smuggling-in-apache-tomcat-important-cve-2023-45648|"Request Smuggling in Apache Tomcat (Important, CVE-2023-45648)"]] - `high`, $4,660, 51 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-221294-java-deserialization-rce-via-jboss-on-card-starbucks-in|"Java Deserialization RCE via JBoss on card.starbucks.in"]] - `critical`, undisclosed, 48 votes, [[programs/starbucks|Starbucks]]

## ⚠️ Top bug classes (vuln/)

- `command-injection` - 2
- `misconfiguration` - 2
- `info-disclosure` - 2
- `code-injection` - 2
- `path-traversal` - 2
- `dos` - 1
- `race-condition` - 1
- `xss` - 1

## 🎯 Exploit triggers (trigger/)

- `unauthenticated` - 1
- `race-window` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 5
- `account-takeover` - 1
- `internal-network` - 1
