---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Vader Protocol]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-vader"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-02] Redemption value of synths can be manipulated to drain `VaderPool` of all native assets

- id: 42333
- impact: HIGH
- protocol: [[Vader Protocol]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-vader

## Summary


This report was submitted by TomFrenchBlockchain and it highlights a bug that can lead to the draining of funds from `VaderPool`. The bug can be exploited by manipulating the pool's reserves through flashloans, similar to how it can be done on UniswapV2. The attacker can do this by manipulating the exchange rate between `nativeAsset` and synths, causing the pool to think that `nativeAsset` is extremely valuable. The attacker can then use a small amount of `nativeAsset` to mint a large amount of synths and manipulate the pool in the opposite direction, buying back the `foreignAsset` they sold to the pool. This process can be repeated as long as it remains profitable for the attacker. To prevent this bug, it is recommended to either prevent the minting of synths or tie the exchange rate to a manipulation-resistant oracle.

## Details

_Submitted by TomFrenchBlockchain_

#### Impact

Draining of funds from `VaderPool`

#### Proof of Concept

See the `VaderPool.mintSynth` function:
<https://github.com/code-423n4/2021-11-vader/blob/607d2b9e253d59c782e921bfc2951184d3f65825/contracts/dex-v2/pool/VaderPoolV2.sol#L126-L167>

As the pool's reserves can be manipulated through flashloans similar to on UniswapV2, an attacker may set the exchange rate between `nativeAsset` and synths (calculated from the reserves). An attacker can exploit this to drain funds from the pool.

1.  The attacker first flashloans and sells a huge amount of `foreignAsset` to the pool. The pool now thinks `nativeAsset` is extremely valuable.
2.  The attacker now uses a relatively small amount of `nativeAsset` to mint synths using `VaderPool.mintSynth`. As the pool thinks `nativeAsset` is very valuable the attacker will receive a huge amount of synths.
3.  The attacker can now manipulate the pool in the opposite direction by buying up the `foreignAsset` they sold to the pool. `nativeAsset` is now back at its normal price, or perhaps artificially low if the attacker wishes.
4.  The attacker now burns all of their synths. As `nativeAsset` is considered much less valuable than at the point the synths were minted it takes a lot more of `nativeAsset` in order to pay out for the burned synths.

For the price of a flashloan and some swap fees, the attacker has now managed to extract a large amount of `nativeAsset` from the pool. This process can be repeated as long as it is profitable.

#### Recommended Mitigation Steps

Prevent minting of synths or at the very least tie the exchange rate to a manipulation resistant oracle.
