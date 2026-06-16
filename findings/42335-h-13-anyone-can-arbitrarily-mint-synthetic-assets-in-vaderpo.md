---
tags:
  - lang/solidity
  - sector/dex
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Vader Protocol]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-vader"
genome:
  - "[[fake-account-substitution]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-13] Anyone Can Arbitrarily Mint Synthetic Assets In `VaderPoolV2.mintSynth()`

- id: 42335
- impact: HIGH
- protocol: [[Vader Protocol]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-vader

## Summary


The report discusses a bug in the `mintSynth()` function of the VaderPoolV2 contract. This function can be called by any user and creates a synthetic asset against a foreign asset. The problem is that a user can bypass the expected approval process and frontrun their call to `mintSynth()` by setting the `to` argument to their own address. This allows them to transfer the victim's native deposit and receive the synthetic asset. The bug was identified through manual code review and discussions with the developer. The suggested mitigation step is to remove the `from` argument and update the `safeTransferFrom()` call to transfer from `msg.sender` instead.

## Details

_Submitted by leastwood_

#### Impact

The `mintSynth()` function is callable by any user and creates a synthetic asset against `foreignAsset` if it does not already exist. The protocol expects a user to first approve the contract as a spender before calling `mintSynth()`. However, any arbitrary user could monitor the blockchain for contract approvals that match `VaderPoolV2.sol` and effectively frontrun their call to `mintSynth()` by setting the `to` argument to their own address. As a result, the `nativeDeposit` amount is transferred from the victim, and a synthetic asset is minted and finally transferred to the malicious user who is represented by the `to` address.

#### Proof of Concept

<https://github.com/code-423n4/2021-11-vader/blob/main/contracts/dex-v2/pool/VaderPoolV2.sol#L126-L167>

#### Tools Used

Manual code review.
Discussions with dev.

#### Recommended Mitigation Steps

Consider removing the `from` argument in `mintSynth()` and update the `safeTransferFrom()` call to instead transfer from `msg.sender`.

**[SamSteinGG (Vader) commented](https://github.com/code-423n4/2021-11-vader-findings/issues/146#issuecomment-979164782):**
 >  The pool contracts, similarly to Uniswap V2, are never meant to be interacted with directly.
