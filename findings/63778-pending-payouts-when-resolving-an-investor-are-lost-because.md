---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/stable
protocol: "[[Remora]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# Pending payouts when resolving an investor are lost because there is no mechanism to claim the resolved payment

- id: 63778
- impact: HIGH
- protocol: [[Remora]] Dynamic Tokens
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md

## Summary


The report describes a problem with the `ChildToken::resolveUser` function, which is used to transfer balances, locks, and frozen tokens to a new address when a user loses access to their account. The function is supposed to also migrate pending payouts to the new address, but there is no way for the new address to claim these payouts. This means that investors who have had their balances transferred to a new address may lose their pending payouts. The report recommends implementing a new function to allow the new address to claim these payouts. The bug has been fixed in a recent commit.

## Details

**Description:** When resolving a user who loses access to their account, the `ChildToken::resolveUser` function migrates balances, locks, and frozen tokens to a new address, ensuring the investor retains their previous balances. Even the pending payouts are calculated and assigned to the new address with the intention of allowing the investor to claim those pending payouts from the new account.

The problem is that no function allows an account to claim the calculated `resolvedPay`, which means the pending payouts for the old addresses are indeed migrated to the new addresses; however, the contracts don't offer a mechanism for investors to claim such payouts.
```solidity
///DividendManager.sol//
    function _resolvePay(address oldAddress, address newAddress) internal {
//@audit-issue => no function allows the `newAddress` to claim the payout of the `oldAddress` saved on the `_resolvedPay` mapping associated to the `newAddress`
@>      _getHolderManagementStorage()._resolvedPay[newAddress] = SafeCast.toUint128(_claimPayout(oldAddress));
        emit PaymentResolved(oldAddress, newAddress);
    }
```

Additionally, it is theoretically possible that payouts for an old address are lost if the newAddress is an address with an existing `resolvedPay` balance. The `DividendManager::_resolvePay` function assigns the calculated payout of the old address, regardless of whether the `resolvedPay` mapping has any value in it.

**Impact:** Pending payments for investors who lost access to their accounts and had their balances transferred to a new account via the `ChildToken::resolveUser` are lost.

**Recommended Mitigation:** Consider implementing a function that allows the new addresses to claim the calculated `resolvedPay` of the old addresses.

**Remora:** Fixed at commit [1a69894](https://github.com/remora-projects/remora-dynamic-tokens/commit/1a698942c15a8a0ab7b866bca2a6409bcb221828).

**Cyfrin:** Verified. Payouts of resolved users are claimable by the `newAddress` via the `ChildToken::claimPayout`
