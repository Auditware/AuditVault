---
tags:
  - platform/ottersec
  - severity/high
  - sector/infra
protocol: "[[Dialect Blinks]]"
auditors:
  - "[[Bruno Halltari]]"
report: "https://www.dialect.to/"
genome:
  - "[[role-bypass]]"
  - "[[dos-resistance]]"
---
# Proxy Service XSS

- id: 47108
- impact: HIGH
- protocol: [[Dialect Blinks]]
- reporter: Bruno Halltari (OtterSec)
- source: https://www.dialect.to/

## Summary


This bug report discusses a potential flaw in the https://proxy.dial.to service that could lead to a Cross-Site Scripting (XSS) attack. The service is used as a proxy and forwards requests to other domains. The vulnerability exploits a specific flaw related to handling the HTTP Link header, allowing attackers to execute malicious JavaScript code within a victim's browser. The report recommends modifying the service to exclude proxying of the HTTP Link header to prevent this type of attack. The issue has been fixed by not proxying the HTTP Link header. 

## Details

## Potential XSS Vulnerability in Proxy Service

There is a potential flaw in how the [https://proxy.dial.to](https://proxy.dial.to) service handles the HTTP Link header, which may result in a Cross-Site Scripting (XSS) attack even when Content Security Policy (CSP) is set to restrict all script execution (`default-src=none`). [https://proxy.dial.to](https://proxy.dial.to) acts as a full proxy service, implying it forwards requests to other domains on behalf of clients. This service is used by default if no other proxy is specified.

## Example Code

```typescript
let proxyUrl: string | null = 'https://proxy.dial.to';

export function setProxyUrl(url: string): void {
    if (!url) {
        console.warn(
            '[@dialectlabs/blinks] Proxy URL is not set, proxy will be disabled',
        );
        proxyUrl = null;
        return;
    }
    try {
        new URL(url);
    } catch (e) {
        console.warn('[@dialectlabs/blinks] Invalid proxy URL', e);
        return;
    }
    proxyUrl = url;
}
```

The vulnerability exploits a specific flaw related to handling the HTTP Link header by the proxy service. The attacker utilizes a new sink that interacts with the service worker workload, leveraging the Link header to execute JavaScript code. Despite the CSP being set to `default-src 'none'`, JavaScript execution is possible within the context of [https://proxy.dial.to](https://proxy.dial.to), bypassing the usual restrictions due to the way the service worker context interacts with content from the proxy service.

Attackers may execute malicious JavaScript within the victim’s browser, potentially leading to XSS attacks. This can be used to install a malicious service worker, causing a Denial-of-Service (DoS) on the proxy service itself or affecting the functionality of Solana actions. Once a malicious service worker is installed, it persists on the victim’s browser until manually removed.

## Remediation

Modify the proxy service ([https://proxy.dial.to](https://proxy.dial.to)) to exclude proxying of the HTTP Link header. This prevents attackers from leveraging this specific vector to execute JavaScript and bypass CSP protections.

## Patch

Fixed by not proxying the HTTP Link header.
