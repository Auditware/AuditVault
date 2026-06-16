---
tags:
  - blockchain/evm
  - lang/solidity
  - blockchain/evm/optimism
  - platform/quantstamp
  - severity/high
  - sector/staking
protocol: "[[Kiln]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html"
genome:
  - "[[missing]]"
  - "[[reward-accounting]]"
---
# OWASP recommended security headers not present

- id: 64124
- impact: HIGH
- protocol: [[Kiln]] - Minitel
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html

## Summary


The application is missing important security headers that protect against cross-site scripting, clickjacking, and other client-side attacks. This is due to the design of the application, which allows user-supplied or URL-driven content to be rendered. To fix this, the recommended headers should be implemented at the server or reverse-proxy level for all responses. These headers include `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Strict-Transport-Security`. They should be consistently applied at the lowest level of the application stack to protect all endpoints. 

## Details

**Description:** The application does not enforce key HTTP security headers (e.g., Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) at the lowest level. These headers are critical to mitigating cross-site scripting (XSS), clickjacking, content sniffing, and other client-side attacks. Given the application’s design, which allows rendering user-supplied or URL-driven content, the absence of these headers leaves users exposed to potential exploitation through malicious content injection or UI manipulation.

**Recommendation:** Implement OWASP-recommended security headers at the server or reverse-proxy level for all responses, including static and dynamic content. Recommended headers include: `Content-Security-Policy` (CSP). Restrict scripts, styles, and resources to trusted origins and disable inline execution. `X-Frame-Options` / `frame-ancestors`: Prevent clickjacking by restricting framing of pages. `X-Content-Type-Options: nosniff`: Prevent MIME type sniffing attacks. `Referrer-Policy`: Control referrer information shared with third-party sites. `Strict-Transport-Security (HSTS)`: Enforce HTTPS connections. Ensure these headers are consistently applied at the lowest level in the application stack (web server, reverse proxy, or application server) to protect all endpoints, including any future content rendered from user-supplied data.
