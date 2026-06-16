---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/stable
  - sector/staking
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# User’s stakes after admin’s removed can not be refunded again

- id: 37618
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


The report states that there is a bug in the `treasury.sol` code where users are unable to receive refunds if they continue staking after the admin has already executed the `refundFromAdminInETH()` or `refundFromAdminInUSDT()` functions. This is because the code does not allow for multiple refunds to be made to the same user. This can cause issues if a user stakes more tokens after already receiving a refund. The recommendation is to allow for multiple refunds but to keep track of the user's funds to ensure they are not refunded more tokens than they staked. The bug has been marked as resolved.

## Details

**Severity**: High	

**Status**: Resolved

If users continue staking after admin has executed `refundFromAdminInETH()` or `refundFromAdminInUSDT()` in `treasury.sol` then the funds will not be able to get refunded again. These functions implements a check `require (!isRefundedInUSDT[user][projectId],'Already refunded');` which does not allow refunding more than one. The following scenario can take place:

- Alice stakes 200k USDT.
- Admin refunds users.
- Alice stakes 200k USDT more.
- Admin can not refund again.

**Recommendation:**

Allow refunding more than once but keep track of user funds to not refund more tokens than staked by the user.
