---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/privacy
protocol: "[[Nocturne Snap]]"
auditors:
  - "[[Caue Obici]]"
report: "https://nocturne.xyz/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Unrestricted Setting Of Variable

- id: 47751
- impact: HIGH
- protocol: [[Nocturne Snap]]
- reporter: Caue Obici (OtterSec)
- source: https://nocturne.xyz/

## Summary

A bug has been found in the Nocturne snap, which is a remote procedure call method used for setting a permanent spendKey. This method does not have any constraints on which application can set it, making it vulnerable to malicious websites. This means that if a user enters a malicious website and deposits money, the website could steal all the deposited assets by knowing the spendKey of the account. To fix this issue, a list of allowed domains should be hard-coded to restrict the setting of the spendKey. This issue has been resolved in a recent commit, which added an allowed origins constraint to set the spendKey.

## Details

## Nocturne Snap Security Vulnerability

Nocturne snap exposes a remote procedure call method to set a permanent `spendKey`, which the protocol utilizes for critical operations such as sending transactions. However, this method does not enforce any constraints on which application may set it.

## Code Snippet

```typescript
case "nocturne_setSpendKey": {
    const spendKey = new Uint8Array(request.params.spendKey);
    // Can only set spend key if not already set, only way to reset is to clear 
    // snap db and regenerate key
    // Return error string if spend key already set
    if (await kvStore.getString(SPEND_KEY_DB_KEY)) {
        return "Error: Spend key already set";
    }
    await kvStore.putString(SPEND_KEY_DB_KEY, ethers.utils.hexlify(spendKey));
}
```

If a user enters a malicious website and then deposits money, all those deposited assets will be stolen since the website would know the `spendKey` of the account.

## Remediation

Hardcode a list of allowed domains to set the `spendKey`.

## Patch

Resolved in commit `f10bd84`, which added allowed origins constraint to set the `spendKey`:

```diff
case "nocturne_setSpendKey": {
+   if (!ALLOWED_ORIGINS.includes(origin)) {
+       throw new Error(
+           `Non-allowed origin cannot set spend key. Origin: ${origin}`
+       );
+   }
}
```
