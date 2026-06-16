---
tags:
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - precondition/specific-token-type
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[CryptoLegacy]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/CryptoLegacy/CryptoLegacy/README.md#1-rebaseable-tokens-cause-unfair-vesting-and-claim-failures"
genome:
  - "[[underflow]]"
  - "[[reward-theft]]"
  - "[[specific-token-type]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
---
# Rebaseable Tokens Cause Unfair Vesting and Claim Failures

- id: 61287
- impact: HIGH
- protocol: [[CryptoLegacy]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/CryptoLegacy/CryptoLegacy/README.md#1-rebaseable-tokens-cause-unfair-vesting-and-claim-failures

## Summary


This bug report discusses an issue with the `_claimTokenWithVesting` function in the CryptoLegacyBasePlugin contract. This function is not working correctly with rebaseable ERC-20 tokens, leading to unfair distribution of tokens and failed claims. The issue is classified as high severity because it breaks the principle of fair distribution and can cause claim failures. The recommendation is to calculate entitlements based on fixed shares applied to the current contract balance at the time of claim. The client believes that this behavior is consistent with other decentralized systems and does not compromise the correctness, safety, or reliability of the platform. However, another problem arises with minimal rebases causing an underflow during claiming.

## Details

##### Description
This issue has been identified within the `_claimTokenWithVesting` function of the **CryptoLegacyBasePlugin** contract, specifically related to its interaction with rebaseable ERC-20 tokens.

The function calculates the `amountToDistribute` at the time of each claim by summing the contract's *current* token balance and the `totalClaimedAmount`. This method leads to incorrect outcomes when the token balance changes due to rebasing events occurring *between claims* by different beneficiaries or between partial claims by the same beneficiary.

Two primary problems arise:
1.  **Unfair Distribution:** If a positive rebase occurs after partial claims, the calculation based on the current balance unfairly distributes the rebase gains. Depending on the claim timing relative to the rebase, this can disproportionately benefit or penalize beneficiaries compared to a scenario where gains are distributed across all original shares.
    * For example, if A and B have 50% shares each of 1000 tokens, A claims 250. 
    * Later, the token exchange rate doubles, meaning the remaining 750 tokens rebase to 1500, and claimed 250 tokens by A rebase to 500. 
    * When B claims, `amountToDistribute` becomes `1500 + 250 = 1750`. B gets `50% of 1750 = 875`. A claims the rest and gets `1750 * 50% - 250 = 625`. 
    * A received `625 + 500 = 1125` total, B received `875` total.
2.  **Failed Claims:** If a negative rebase occurs *after* an early claim, the recalculated `amountToDistribute` might imply a remaining entitlement exceeding the actual tokens held by the contract. This will cause subsequent `safeTransferFrom` calls for other beneficiaries to revert due to insufficient balance.

Moreover, it was identified that if `lrWithdrawTokensFromLegacy` in **LegacyRecoveryPlugin** is called to remove tokens from the contract after some tokens have already been partially claimed by beneficiaries, it may lead to issues when those beneficiaries attempt to claim their remaining tokens. In such cases, the vestedAmount might be less than the claimedAmount, potentially causing a temporary underflow.

The issue is classified as **High** severity because it breaks the principle of fair proportional distribution for vested rebaseable tokens and can lead to claim failures.
<br/>
##### Recommendation
We recommend calculating entitlements based on fixed shares applied to the current contract balance at the time of claim, ensuring proportional distribution of rebases across all originally vested tokens.

> **Client's Commentary:**
> Client: The failed claims scenario caused by negative rebases has been fully resolved. Specifically, we addressed the case where a rebase could reduce the token balance below the calculated entitlement, leading to unclaimable or locked tokens. As for the unfair distribution scenario involving positive rebases, we believe this does not require changes, based on the following considerations: The observed behavior is a consequence of using rebaseable tokens in a pull-based, asynchronous claim system. Any such system would experience similar effects when token balances change between claims. CryptoLegacy makes no assumptions about token supply stability and simply reflects the current state of the token at the time of claim, ensuring deterministic behavior without overengineering around external token mechanics. Most beneficiaries interact with standard ERC-20 tokens. Designing for perfect rebase fairness would introduce complexity and constraints irrelevant for the vast majority of use cases. Claims remain accurate relative to the contract’s live balance, and all entitlements are correctly enforced within the rules of the vesting schedule and distribution logic. This behavior is consistent with how other decentralized systems handle dynamic tokens and does not compromise the correctness, safety, or reliability of the platform. https://github.com/CryptoCust/cryptolegacy-contracts/commit/4558f24ad5c9aecf41751643e7e2ce9b1686092e
> MixBytes: Another problem that arises is that with a minimal rebase (down to 1e9), an underflow may occur during claiming. This happens when the actual balance becomes lower than `td.amountToDistribute`, due to the second condition: `(balanceDiff * 1 gwei / bal) < 1e3`.

---
