---
tags:
  - checklist
generated: true
---
# Web Audit Checklists

Data-driven checklists of what tends to go wrong per web2 attack surface (env/stack/os), ranked by frequency across AuditVault disclosures. Start here when auditing a web property - open the checklist for its surface before reading a line of code.

### env/ - where the bug lives (web app, mobile, cloud, desktop, appliance, network)

| Checklist | Disclosures | Critical | Distinct CWEs |
| --- | ---: | ---: | ---: |
| [[web-checklist\|Web]] | 2669 | 912 | 137 |
| [[cloud-checklist\|Cloud]] | 78 | 31 | 24 |
| [[network-checklist\|Network]] | 72 | 23 | 32 |
| [[mobile-checklist\|Mobile]] | 29 | 9 | 17 |
| [[appliance-checklist\|Appliance]] | 12 | 3 | 9 |

### stack/ - technology stack involved (kubernetes, aws, nginx, ...)

| Checklist | Disclosures | Critical | Distinct CWEs |
| --- | ---: | ---: | ---: |
| [[node-checklist\|Node]] | 241 | 66 | 48 |
| [[gitlab-checklist\|Gitlab]] | 104 | 31 | 29 |
| [[php-checklist\|Php]] | 49 | 17 | 17 |
| [[wordpress-checklist\|Wordpress]] | 44 | 14 | 17 |
| [[aws-checklist\|Aws]] | 37 | 15 | 19 |
| [[ruby-checklist\|Ruby]] | 28 | 2 | 13 |
| [[apache-checklist\|Apache]] | 23 | 7 | 12 |
| [[cloudflare-checklist\|Cloudflare]] | 22 | 5 | 9 |
| [[kubernetes-checklist\|Kubernetes]] | 21 | 3 | 11 |
| [[java-checklist\|Java]] | 18 | 8 | 8 |
| [[python-checklist\|Python]] | 11 | 4 | 7 |
| [[docker-checklist\|Docker]] | 10 | 6 | 7 |

### os/ - operating system where relevant (ios, android, windows, ...)

| Checklist | Disclosures | Critical | Distinct CWEs |
| --- | ---: | ---: | ---: |
| [[windows-checklist\|Windows]] | 27 | 1 | 11 |
| [[android-checklist\|Android]] | 23 | 7 | 15 |
| [[linux-checklist\|Linux]] | 19 | 3 | 11 |

> Skipped (fewer than 10 disclosures): `env/desktop`, `stack/firebase`, `stack/nginx`, `stack/gcp`, `os/ios`, `os/macos`

> Generated pages only: frequency + canonical example reports. No trigger/fix/impact axes - disclosure cards carry metadata (report bodies are login-walled). Prose methodology per class would need hand curation.
