---
tags:
  - checklist
  - stack/cloudflare
generated: true
---
# Cloudflare — Web Audit Checklist

> **Surface:** `stack/cloudflare` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 22 | **Critical:** 5 | **Total known bounty:** $32,400 (12 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 5 disclosures
- [ ] [[cwe/client-side-enforcement-of-server-side-security|Client Side Enforcement Of Server Side Security]] - 4 disclosures
- [ ] [[cwe/http-request-smuggling|Http Request Smuggling]] - 2 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 2 disclosures
- [ ] [[cwe/improper-authorization|Improper Authorization]] - 1 disclosure
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 1 disclosure
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 1 disclosure
- [ ] [[cwe/cleartext-transmission-of-sensitive-information|Cleartext Transmission Of Sensitive Information]] - 1 disclosure
- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Cloudflare Public Bug Bounty` (22)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-1478633-http-request-smuggling-in-transform-rules-using-hexadecimal-|"HTTP Request Smuggling in Transform Rules using hexadecimal escape sequences in the concat() function"]] - `critical`, $6,000, 116 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-1952124-cloudflare-casb-confused-deputy-problem|"Cloudflare CASB Confused Deputy Problem"]] - `critical`, $3,300, 97 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-1805779-2fa-bypass|"2FA BYPASS"]] - `high`, undisclosed, 87 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-1785260-using-special-ipv4-mapped-ipv6-addresses-to-bypass-local-ip-|"Using special IPv4-mapped IPv6 addresses to bypass local IP ban"]] - `critical`, $7,500, 78 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-3027461-bypass-of-cloudflare-s-cache-keys-and-waf-via-header-overflo|"Bypass of Cloudflare's Cache Keys and WAF via header overflow"]] - `high`, undisclosed, 77 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-1419341-hijack-all-emails-sent-to-any-domain-that-uses-cloudflare-em|"Hijack all emails sent to any domain that uses Cloudflare Email Forwarding"]] - `critical`, $6,000, 76 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-2094346-yet-another-casb-integration-takeover-of-active-integrations|"Yet Another CASB Integration Takeover of Active Integrations"]] - `high`, undisclosed, 68 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
- [[disclosures/h1-3423950-variation-of-3321406-yetanother-1-click-chaining-of-self-xss|"[Variation of #3321406] YetAnother 1-Click Chaining of Self-XSS, Cookie Tossing and AntiCSRF Token Prediction leads to auto approval in AccessTempAuth"]] - `high`, undisclosed, 63 votes, [[programs/cloudflare|Cloudflare Public Bug Bounty]]
