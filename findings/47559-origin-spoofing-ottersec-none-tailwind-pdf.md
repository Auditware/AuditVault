---
tags:
  - platform/ottersec
  - severity/high
  - sector/vault
protocol: "[[Tailwind]]"
auditors:
  - "[[Caue Obici]]"
report: "https://www.tailwind.zone/"
genome:
  - "[[message-spoofing]]"
  - "[[role-bypass]]"
  - "[[bridge-sender-auth]]"
---
# Origin Spoofing

- id: 47559
- impact: HIGH
- protocol: [[Tailwind]]
- reporter: Caue Obici (OtterSec)
- source: https://www.tailwind.zone/

## Summary


The report describes a bug where an attacker can manipulate the URL parameters in a variable called "sign_doc" and change the URL to a malicious one, allowing them to spoof the origin. This could potentially lead to security issues. The bug can be fixed by properly encoding the URL parameters or using a different method of communication. The bug has been patched by encoding all URL parameters in a recent update.

## Details

## Code Injection Vulnerability

An attacker may inject a `&` inside the `sign_doc` variable and modify other URL parameters, including `origin`, which is vulnerable to origin spoofing.

## Code Snippet

```typescript
worker.ts TS
chrome.windows.create(
{
/**
* @security what if sign_doc is a script?
* Will it be executed in the context of the extension?
*/
url: `sign.html?data=${sign_doc}&host=${domain}&mode=${mode}`,
type: "popup",
width: 360,
height: 580,
},
(window) =>
window &&
chrome.windows.onRemoved.addListener(
(id) => window.id == id && reject("User denied sign permission"),
),
);
```

## Remediation

Utilize `encodeURIComponent` when appending user data into the URL, or change the communication to a `postMessage` or `chrome.runtime.sendMessage` (detailed on OS-TWD-SUG-03).

## Patch

Fixed by encoding all URL parameters in commit `8b59d3c`.

### Code Diff

```typescript
worker.ts DIFF
request_signature: async ({ domain, sign_doc, mode }) => {
+ const url = `sign.html?data=${encodeURIComponent(
+ sign_doc,
+ )}&host=${encodeURIComponent(domain)}&mode=${encodeURIComponent(mode)}`;
return new Promise((resolve, reject) => {
chrome.windows.create(
{
url
```
