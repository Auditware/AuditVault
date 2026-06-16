---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - platform/hexens
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Fungify]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md"
genome:
  - "[[reward-calculation]]"
  - "[[specific-token-type]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# [FNG-11] All interest tokens can be stolen from the interest market

- id: 62379
- impact: HIGH
- protocol: [[Fungify]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md

## Summary


This bug report describes a critical issue in the CErc721 contract, which is used for NFTs. The contract uses a CErc20InterestMarket for interest rewards for suppliers and payments for borrowers. However, the process for calculating interest rewards does not take transfers into account, allowing for arbitrary interest rewards to be created. This means an attacker could drain all the underlying tokens from the interest market. The suggested fix is to override the `_beforeTokenTransfer` hook and force a claiming of interest rewards for both the sender and receiver. This issue has been fixed.

## Details

**Severity:** Critical

**Path:** CErc721.sol:supplyInterestStoredInternal#L752-L763

**Description:** The NFT underlying CToken, CErc721, uses a CErc20InterestMarket as tokens for both interest rewards for suppliers and interest payments for borrowers. In order to calculate the rewards for those supplies, it uses a supply index and `interestIndex` that is stored in the user’s snapshot such that past rewards aren’t counted (e.g. after claiming).

The difference between the new `supplyIndex` and `interestIndex` is then multiplied with the token balance of the user to calculate a supplier's earned interest. 

However, this process does not take transfers into account and this can be used to create arbitrary interest rewards. More specifically, when the shares (CTokens) are transferred to another user, the balance increases, but it does not set the `interestIndex` for the receiving user (e.g. by forcing a claim in a `_beforeTokenTransfer` hook).

In other words, a balance increase occurs and thus the receiving user can claim rewards over the new balance without actually having held this balance over the reward period.

For example:

1. User A supplies 1 NFT and mints 100 CTokens.

2. User B-Z call a reward claim to set their `interestIndex` (otherwise a division by 0 would occur).

3. After some time, the `supplyIndex` has increased.

4. User A can now claim rewards and transfer the balance of 100 CTokens to user B.

5. User B can now claim the same rewards over the new balance and then transfer the balance to user C.

6. Repeat step 5 for all users.

By having some built up interest from the index and enough accounts (e.g. using an exploit contract) an attacker could instantly and completely drain the interest market of all its underlying tokens.
```
    function supplyInterestStoredInternal(address account) internal view returns (uint) {
        Exp memory exchangeRate = Exp({mantissa: exchangeRateStored()});
        uint supplyBalance = mul_ScalarTruncate(exchangeRate, accountTokens[account]);

        if (supplyBalance == 0) {
            return 0;
        }

        SupplyInterestSnapshot storage supplyInterestSnapshot = supplyInterest[account];
        uint newInterestAccrued = (supplyBalance * supplyIndex / supplyInterestSnapshot.interestIndex) - supplyBalance;
        return supplyInterestSnapshot.interestAccrued + newInterestAccrued;
    }
```

**Remediation:**  The CErc721 contract should override the `_beforeTokenTransfer` hook and force a claiming of interest rewards for both the sender and receiver.

**Status:**  Fixed


- - -
