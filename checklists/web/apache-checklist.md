---
tags:
  - checklist
  - stack/apache
generated: true
---
# Apache — Web Audit Checklist

> **Surface:** `stack/apache` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 23 | **Critical:** 7 | **Total known bounty:** $72,603 (17 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/code-injection|Code Injection]] - 4 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 3 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 3 disclosures
- [ ] [[cwe/http-request-smuggling|Http Request Smuggling]] - 3 disclosures
- [ ] [[cwe/improper-input-validation|Improper Input Validation]] - 2 disclosures
- [ ] [[cwe/use-of-externally-controlled-format-string|Use Of Externally Controlled Format String]] - 1 disclosure
- [ ] [[cwe/null-pointer-dereference|Null Pointer Dereference]] - 1 disclosure
- [ ] [[cwe/inclusion-of-functionality-from-untrusted-control-sphere|Inclusion Of Functionality From Untrusted Control Sphere]] - 1 disclosure
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 1 disclosure
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Internet Bug Bounty` (19), `U.S. Dept Of Defense` (2), `MTN Group` (1), `Aiven Ltd` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-1418891-apache-flink-rce-via-get-jar-plan-api-endpoint|"Apache Flink RCE via GET jar/plan API Endpoint"]] - `critical`, $6,000, 134 votes, [[programs/aiven_ltd|Aiven Ltd]]
- [[disclosures/h1-520903-apache-http-2-4-17-2-4-38-local-root-privilege-escalation|"Apache HTTP [2.4.17-2.4.38] Local Root Privilege Escalation"]] - `high`, $1,500, 121 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-1394916-path-traversal-and-file-disclosure-vulnerability-in-apache-h|"Path traversal and file disclosure vulnerability in Apache HTTP Server 2.4.49"]] - `critical`, $4,000, 96 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-1707287-cve-2022-40604-apache-airflow-format-string-vulnerability|"CVE-2022-40604: Apache Airflow: Format String Vulnerability"]] - `critical`, $8,000, 89 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-1667974-pause-based-desync-in-apache-httpd|"Pause-based desync in Apache HTTPD"]] - `high`, $4,000, 75 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-1776476-cve-2022-40127-rce-in-apache-airflow-2-4-0-bash-example|"CVE-2022-40127: RCE in Apache Airflow <2.4.0 bash example"]] - `high`, $4,000, 60 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-2586226-cve-2024-34750-apache-tomcat-dos-vulnerability-in-http-2-con|"CVE-2024-34750 Apache Tomcat DoS vulnerability in HTTP/2 connector"]] - `high`, $4,920, 60 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-2327341-cve-2024-21733-apache-tomcat-http-request-smuggling-client-s|"CVE-2024-21733 Apache Tomcat HTTP Request Smuggling (Client- Side Desync) (CWE: 444)"]] - `high`, $4,660, 57 votes, [[programs/ibb|Internet Bug Bounty]]
