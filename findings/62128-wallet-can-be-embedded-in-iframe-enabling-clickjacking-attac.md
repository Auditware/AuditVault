---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[Gemini]]"
auditors:
  - "[[Coriolan Pinhas Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf"
genome:
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Wallet can be embedded in iframe, enabling clickjacking attacks

- id: 62128
- impact: HIGH
- protocol: [[Gemini]] Smart Wallet
- reporter: Coriolan Pinhas Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf

## Summary


The report describes a bug in the wallet SDK that allows the wallet UI to be embedded in an iframe instead of opening in a popup window. This creates a security vulnerability where a malicious dapp can overlay the wallet interface with hidden elements or misleading UI, tricking users into signing transactions or messages without their knowledge. The report provides a proof of concept showing how this can be exploited. The recommendations for fixing this bug include implementing Content-Security-Policy headers and X-Frame-Options headers to prevent the wallet from being embedded in iframes, and ensuring that the wallet can only be opened in a popup window or new tab.

## Details

## Diﬃculty: High

## Type: Data Validation

### Description
The wallet SDK allows the wallet UI to be embedded in an iframe instead of opening in a popup window. This creates a clickjacking vulnerability where a malicious dapp can overlay the wallet interface with hidden elements or misleading UI, tricking users into signing transactions or messages without their knowledge. Any dapp could make a user sign a malicious message, thinking they are signing a safe message.

### Exploit Scenario
A malicious dapp embeds the wallet in an iframe and overlays it with transparent elements or misleading UI. The user sees what appears to be a legitimate wallet interface but is actually interacting with hidden elements that trigger unwanted actions, such as signing a transaction with different parameters than what is displayed.

**Figure 9.1** provides a proof of concept showing the possibility of opening the wallet in an iframe.

```javascript
import { rpcErrors } from "@metamask/rpc-errors";

const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 650;

export const openPopup = (url: URL): Window => {
    const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
    const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
    const popupId = `wallet_${window?.crypto?.randomUUID()}`;

    // Try to find an existing iframe with this name/id
    let iframe = document.querySelector(`iframe[name='${popupId}']`) as HTMLIFrameElement | null;
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = popupId;
        iframe.name = popupId;
        iframe.allow = "publickey-credentials-get *";
        iframe.style.width = `${POPUP_WIDTH}px`;
        iframe.style.height = `${POPUP_HEIGHT}px`;
        iframe.style.position = 'fixed';
        iframe.style.right = '20px';
        iframe.style.bottom = '20px';
        iframe.style.zIndex = '9999';
        iframe.style.border = '1px solid #ccc';
        document.body.appendChild(iframe);
    }
    iframe.style.display = 'block';

    // Use window.open with the popupId as the target to load the URL in the iframe
    const popup = window.open(url.toString(), popupId);
    if (!iframe.contentWindow || !popup) {
        throw rpcErrors.internal('Pop up window failed to open');
    }

    // Focus is not relevant for iframes, but you can scroll to it if needed
    // iframe.contentWindow?.focus();
    return iframe.contentWindow as Window;
};

export const closePopup = (popup: Window | null) => {
    if (popup && !popup.closed) {
        popup.close();
    }
};
```

**Figure 9.1**: Modiﬁed `popup.ts` file that creates an iframe instead of a popup window

### Recommendations
- Short term: Implement Content-Security-Policy headers with the `frame-ancestors` directive set to none and X-Frame-Options headers set to DENY to prevent the wallet from being embedded in iframes.
- Long term: Ensure that the wallet can be opened only in a popup window or new tab, and implement additional security measures to prevent any form of embedding.
