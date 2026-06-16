---
tags:
  - lang/solidity
  - sector/launchpad
  - platform/ottersec
  - severity/high
  - impact/mev/frontrun
protocol: "[[EthSign Launchpad]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.ethsign.xyz/"
genome:
  - "[[signature-replay]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Signature Reuse Via Front-Running

- id: 47227
- impact: HIGH
- protocol: [[EthSign Launchpad]]
- reporter: Robert Chen (OtterSec)
- source: https://www.ethsign.xyz/

## Summary


The current signature scheme in NFTSimpleAuction may be vulnerable to front-running. This means that a legitimate user who completes the whitelist procedure and receives a valid signed code from the authorizedWLSigner can buy NFTs at a discounted price. However, if an attacker detects a whitelist purchase transaction, they can exploit the absence of ownership checks in the signature. The attacker can submit their own purchase transaction using the stolen signed code before the original user's transaction is confirmed. This allows them to purchase NFTs at the discounted price intended for the original user.

To fix this issue, a nonce mechanism should be introduced in the signed code. The whitelist server would generate a unique nonce for each user and include it in the signed data (extraData). The _checkAndSaveWL function would need to verify that the nonce has not been used before. This ensures that the signed code can only be used once, preventing attackers from re-using stolen codes.

This issue has been fixed in the adf0fe6 version. 

## Details

## Security Vulnerability in NFTSimpleAuction

The current signature scheme in purchase within NFTSimpleAuction may be susceptible to front-running. In this process, a legitimate user completes the whitelist procedure and receives a valid signed code from the `authorizedWLSigner` allowing them to buy NFTs at a discounted price. However, if an attacker detects a whitelist purchase transaction, they can exploit the absence of ownership checks in the signature. The attacker may submit their own purchase transaction using the stolen signed code before the original user's transaction is confirmed.

```solidity
// NFTSimpleAuction.sol
function _checkAndSaveWL(bytes calldata extraData) internal returns (uint256) {
    (uint256 approvedPurchaseAmount, bytes32 hash, bytes memory signature) =
    abi.decode(extraData, (uint256, bytes32, bytes));
    if (_usedCodes[hash]) revert InvalidCode();
    if (!SignatureChecker.isValidSignatureNow(authorizedWLSigner, hash, signature)) revert InvalidSignature();
    _usedCodes[hash] = true;
    return approvedPurchaseAmount;
}
```

Since the attacker's transaction includes a valid signed code, it will bypass the signature validation and allow them to purchase NFTs at the discounted price intended for the original user.

## Remediation

Introduce a nonce mechanism in the signed code. The whitelist server would generate a unique nonce for each user and include it in the signed data (`extraData`). `_checkAndSaveWL` would need to verify that the nonce has not been utilized before. This ensures the signed code may only be utilized once, preventing attackers from re-utilizing stolen codes.

## Patch

Fixed in commit `adf0fe6`.

© 2024 Otter Audits LLC. All Rights Reserved. 6/14
