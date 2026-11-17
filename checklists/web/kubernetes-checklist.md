---
tags:
  - checklist
  - stack/kubernetes
generated: true
---
# Kubernetes — Web Audit Checklist

> **Surface:** `stack/kubernetes` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 21 | **Critical:** 3 | **Total known bounty:** $54,910 (11 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/code-injection|Code Injection]] - 6 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 4 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 2 disclosures
- [ ] [[cwe/cleartext-storage-of-sensitive-information|Cleartext Storage Of Sensitive Information]] - 1 disclosure
- [ ] [[cwe/cryptographic-issues-generic|Cryptographic Issues Generic]] - 1 disclosure
- [ ] [[cwe/cross-site-request-forgery-csrf|Cross Site Request Forgery Csrf]] - 1 disclosure
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 1 disclosure
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 1 disclosure
- [ ] [[cwe/misconfiguration|Misconfiguration]] - 1 disclosure
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 1 disclosure
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Kubernetes` (16), `Internet Bug Bounty` (2), `IBM` (1), `Snapchat` (1), `Central Security Project` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-455645-exposed-kubernetes-api-rce-exposed-creds|"Exposed Kubernetes API - RCE/Exposed Creds"]] - `critical`, $25,000, 1191 votes, [[programs/snapchat|Snapchat]]
- [[disclosures/h1-2701701-injection-in-path-parameter-of-ingress-nginx|"Injection in path parameter of Ingress-nginx"]] - `high`, undisclosed, 92 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1387366-elections-k8s-io-uses-weak-session-secret-key-may-place-elec|"elections.k8s.io uses weak session secret key, may place elections at risk"]] - `high`, $250, 86 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-2231019-cve-2023-5528-insufficient-input-sanitization-in-in-tree-sto|"CVE-2023-5528: Insufficient input sanitization in in-tree storage plugin leads to privilege escalation on Windows nodes"]] - `high`, $5,000, 69 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1580493-bypass-validation-parts-in-aws-iam-authenticator-for-kuberne|"Bypass validation parts in AWS IAM Authenticator for Kubernetes"]] - `high`, $2,500, 68 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1728174-ingress-nginx-annotation-injection-causes-arbitrary-command-|"Ingress nginx annotation injection causes arbitrary command execution"]] - `high`, $2,500, 57 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1249583-authenticated-kubernetes-principal-with-restricted-permissio|"Authenticated kubernetes principal with restricted permissions can retrieve ingress-nginx serviceaccount token and secrets across all namespaces"]] - `high`, undisclosed, 55 votes, [[programs/kubernetes|Kubernetes]]
- [[disclosures/h1-1842829-privilege-escalation-in-kops-using-gce-gcp-provider|"Privilege Escalation in kOps using GCE/GCP Provider"]] - `high`, $2,500, 52 votes, [[programs/kubernetes|Kubernetes]]
