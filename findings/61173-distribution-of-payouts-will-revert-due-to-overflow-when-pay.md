---
tags:
  - lang/solidity
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Remora Pledge]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# Distribution of payouts will revert due to overflow when payment is made using a stablecoin with high decimals

- id: 61173
- impact: HIGH
- protocol: Remora Pledge
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md

## Summary


The report describes a bug in the system where payouts are meant to be paid using a stablecoin with 6 decimals, but the system has the capability to change to a stablecoin with 8 or 18 decimals. This change introduced a critical vulnerability that can cause an irreversible denial of service (DoS) to users trying to collect their payouts. This is due to a change in the data type of a variable, which can cause an overflow when calculating payouts with a stablecoin of 18 decimals. This can result in users being unable to claim not only the most recent payout, but all previous payouts as well. To fix this issue, it is recommended to change the data type of the variable and standardize all token amounts to a fixed number of decimals. This can be done by having the PaymentSettler contract responsible for converting values to the actual decimals of the stablecoin being used. The bug has been fixed in recent commits and has been verified by a third party.

## Details

**Description:** Payouts are meant to be paid using a stablecoin, originally a stablecoin with 6 decimals (USDC). But the system has the capability of changing the stablecoin that is used for payments. Could be USDT (8 decimals), USDS (18 decimals).

As part of the changes made to introduce the PaymentSettler, the data type of the variable [`calculatedPayout` was changed from a uint256 to a uint64](https://github.com/remora-projects/remora-smart-contracts/blob/audit/Dacian/contracts/RWAToken/DividendManager.sol#L42). This change introduces a critical vulnerability that can cause an irreversible DoS to users to collect their payouts.

A uint64 would revert when distributing a payout of 20 USD using a stablecoin of 18 decimals.
- As we can see on chisel, 20e18 is > the max value a uint64 can fit
```
➜ bool a = type(uint64).max > 20e18;
➜ a
Type: bool
└ Value: false
```

For example, there is a user who has 5 distributions pending to be calculated, and in the most recent distribution, the distribution is paid with a stablecoin of 18 decimals. (assume the user is earning 50USD on each distribution)
- When the user attempts to calculate its payout, the tx will revert because the last distribution will take the user's payout beyond the value that can fit in a uint64, so, when [safeCasting the payout down to a uint64](https://github.com/remora-projects/remora-smart-contracts/blob/audit/Dacian/contracts/RWAToken/DividendManager.sol#L435-L440), an overflow will occur, and tx will blow up, resulting in this user getting DoS from claiming not only the most recent payout, but all the previous payouts that haven't been calculated yet.

```solidity
    function payoutBalance(address holder) public returns (uint256) {
        ...
        for (uint16 i = payRangeStart; i >= payRangeEnd; --i) {
            ...

            PayoutInfo memory pInfo = $._payouts[i];
//@audit => `pInfo.amount` set using a stablecoin with high decimals will bring up the payoutAmount beyond the limit of what can fit in a uint64
            payoutAmount +=
                (curEntry.tokenBalance * pInfo.amount) /
                pInfo.totalSupply;
            if (i == 0) break; // to prevent potential overflow
        }
        ...
        if (payoutForwardAddr == address(0)) {
//@audit-issue => overflow will blow up the tx
            holderStatus.calculatedPayout += SafeCast.toUint64(payoutAmount);
        } else {
//@audit-issue => overflow will blow up the tx
            $._holderStatus[payoutForwardAddr].calculatedPayout += SafeCast
                .toUint64(payoutAmount);
        }
```

**Impact:** Irreversible DoS to holders' payouts distribution.

**Recommended Mitigation:** To solve this issue, the most straightforward fix is to change the data type of `calculatePayout` to at least `uint128` & consider standardizing all token amounts to `uint128`.

But, this time it is recommended to go one step further and normalize the internal accounting of the system to a fixed number of decimals in such a way that it won't be affected by the decimals of the actual stablecoin that is being used to process the payments.

As part of this change, the `PaymentSettler` contract must be responsible for converting the values sent and received from the RemoraToken to the actual decimals of the current configured stablecoin.

**Remora:** Fixed in commits [a0b277f](https://github.com/remora-projects/remora-smart-contracts/commit/a0b277fe4a59354f3b3783c4b8c06eb60f5157610), [ced21ba](https://github.com/remora-projects/remora-smart-contracts/commit/ced21ba9758b814eb48a09a5e792aa89cc87e8f5).

**Cyfrin:** Verified.
