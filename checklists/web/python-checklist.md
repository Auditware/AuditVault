---
tags:
  - checklist
  - stack/python
generated: true
---
# Python — Web Audit Checklist

> **Surface:** `stack/python` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 11 | **Critical:** 4 | **Total known bounty:** $1,500 (1 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/sql-injection|Sql Injection]] - 5 disclosures
- [ ] [[cwe/classic-buffer-overflow|Classic Buffer Overflow]] - 1 disclosure
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 1 disclosure
- [ ] [[cwe/code-injection|Code Injection]] - 1 disclosure
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 1 disclosure
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 1 disclosure
- [ ] [[cwe/misconfiguration|Misconfiguration]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Django` (6), `Internet Bug Bounty` (3), `Starbucks` (1), `Dropcontact` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-3292573-sql-injection-when-using-filteredrelation|"SQL Injection when using FilteredRelation"]] - `critical`, undisclosed, 96 votes, [[programs/django|Django]]
- [[disclosures/h1-3335709-sql-injection-in-django-orm-via-unvalidated-connector-in-q-o|"SQL Injection in Django ORM via Unvalidated `_connector` in Q Objects"]] - `critical`, undisclosed, 77 votes, [[programs/django|Django]]
- [[disclosures/h1-301831-leaking-sensitive-files-on-github-leads-to-internal-files-py|"Leaking sensitive files on Github leads to internal files (python scripts,SQL files)"]] - `critical`, undisclosed, 73 votes, [[programs/starbucks|Starbucks]]
- [[disclosures/h1-2588426-sql-injection-in-jsonfield-keytransform|"SQL injection in JSONField KeyTransform"]] - `high`, undisclosed, 68 votes, [[programs/django|Django]]
- [[disclosures/h1-2882887-cve-2024-53908-django-potential-sql-injection-in-haskey-lhs-|"CVE-2024-53908: Django Potential SQL injection in `HasKey(lhs, rhs)` on Oracle"]] - `high`, undisclosed, 61 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-3417967-potential-sql-injection-when-annotating-filteredrelation-on-|"Potential SQL Injection when annotating FilteredRelation on PostgreSQL"]] - `high`, undisclosed, 52 votes, [[programs/django|Django]]
- [[disclosures/h1-1084342-buffer-overflow-in-pycarg-repr-in-ctypes-callproc-c-for-pyth|"Buffer overflow in PyCArg_repr in _ctypes/callproc.c for Python 3.x to 3.9.1"]] - `high`, $1,500, 51 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-579760-jenkins-unauthenticated-rce-on-https-djangoci-com|"Jenkins Unauthenticated RCE on https://djangoci.com/"]] - `critical`, undisclosed, 22 votes, [[programs/django|Django]]

## ⚠️ Top bug classes (vuln/)

- `sql-injection` - 5
- `code-injection` - 2
- `dos` - 2
- `command-injection` - 2
- `deserialization` - 1
- `broken-access-control` - 1
- `privilege-escalation` - 1
- `info-disclosure` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 3

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 1
