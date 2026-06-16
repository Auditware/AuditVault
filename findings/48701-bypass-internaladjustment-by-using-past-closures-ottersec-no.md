---
tags:
  - lang/solidity
  - sector/nft
  - sector/vault
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Abacus]]"
auditors:
  - "[[Robert Chen]]"
report: "https://abacus.wtf/"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# Bypass internalAdjustment by Using Past Closures. . . . . . .

- id: 48701
- impact: HIGH
- protocol: [[Abacus]]
- reporter: Robert Chen (OtterSec)
- source: https://abacus.wtf/

## Summary


The report highlights a bug in the adjustTicketInfo function of the Vault contract. This function is used to adjust a trader's LP information after an NFT is closed. However, the function allows a user to skip the adjustment for past closures, which can be exploited by an attacker to avoid losses on NFT closures. The report provides a proof of concept and suggests removing a condition in the function to fix the issue. The bug has been fixed in the latest version of the contract.

## Details

## Vault Contract Analysis

In the Vault contract, the `adjustTicketInfo` function is used to adjust a trader’s LP (Liquidity Provider) information after an NFT is closed. Based on the auction value, traders may face either a loss or a profit. The trader’s profile is constrained by `adjustmentsMade[_user][_nonce]` to ensure the profile is adjusted within the closures.

## Function Definition

```solidity
function adjustTicketInfo(
    address _user,
    uint256 _nonce,
    address _nft,
    uint256 _id
) external nonReentrant returns(bool) {
    ...
    adjustmentsMade[_user][_nonce]++;
    if (
        trader.unlockEpoch < _epochOfClosure ||
        trader.startEpoch > _epochOfClosure
    ) {
        return true;
    }
    uint256 appLoss = internalAdjustment(
        ...
    );
    ...
}
```

The `adjustTicketInfo` function allows a user to skip the adjustment for past closures. This case is not required because those adjustments are already covered in the purchase function.

```solidity
adjustmentsMade[_buyer][_nonce] = adjustmentsRequired;
```

An attacker can exploit past closures to skip adjustment for losses on NFT closures.

## Proof of Concept

To reproduce the issue, follow the steps below:

1. NFTs A, B, C are closed before epoch-5. (`adjustmentsRequired = 3`)
2. User-A purchases the LP position in epoch-6 up to epoch-10. (`adjustmentsMade = 3`)
3. NFTs D, E, F, G, H are closed between epochs 6 & 10. (`adjustmentsRequired = 8`)
4. The attacker must perform 5 adjustments for the 5 closures, in which D, E, F faced losses.
5. The attacker skips the adjustments for D, E, F by using the past closures of NFTs A, B, C. (`adjustmentsMade = 6`)
6. The attacker then adjusts for NFTs G and H and obtains the profit. (`adjustmentsMade = 8`)

Since `(adjustmentsMade == adjustmentsRequired == 8)`, the attacker can sell their tickets without adjusting the position for NFTs D, E, F.

## Remediation

Remove the `trader.startEpoch > _epochOfClosure` condition in the `adjustTicketInfo` function.

## Patch

The check for allowing past closures in the `adjustTicketInfo` function has been removed. Fixed in commit `e25baa9`.

```diff
contracts/Vault.sol
@@ -839,10 +839,7 @@ contract Vault is ReentrancyGuard,
,→ ReentrancyGuard2, Initializable {
    Buyer storage trader = traderProfile[_user][_nonce];
    adjustmentsMade[_user][_nonce]++;
    - if(
    - trader.unlockEpoch < epochOfClosure[_closureNonce - 1][_nft][_id]
    - || trader.startEpoch > epochOfClosure[_closureNonce - 1][_nft][_id]
    - ) {
    + if(trader.unlockEpoch < epochOfClosure[_closureNonce - 1][_nft][_id]) {
        return true;
    }
    uint256 appLoss = internalAdjustment(
    uint256 appLoss = internalAdjustment(
```

© 2022 OtterSec LLC. All Rights Reserved.
