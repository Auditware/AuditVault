---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - sector/bridge
protocol: "[[Mellow]]"
auditors:
  - "[[bughuntoor]]"
  - "[[t.aksoy]]"
  - "[[tedox]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# H-6: Redeems through RedeemQueue avoid paying management and performance fee.

- id: 62111
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: tedox (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by a group of users regarding the `redeem` function in the `RedeemQueue` contract. When a user redeems their shares, the shares are immediately burned, but the funds remain in the vault until a report is handled. This means that these funds are not subject to performance and management fees, which results in a loss of fees for the vault. The root cause of this issue is flawed logic in the code. The attack path involves creating a redeem request after the last report is handled, which allows the user to claim their redeem without paying any fees for the past day. The impact of this bug is a loss of vault fees. The protocol team has fixed this issue in a recent pull request. To mitigate this issue, the team suggests transferring the fees to the queue contract when a user creates a redeem request and only burning the shares when the request is handled. 

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/491 

## Found by 
bughuntoor, t.aksoy, tedox

### Summary

When a user calls `redeem`, the amount of shares they want to redeem is immediately burned, effectively removing the shares from `activeShares` 

```solidity
        IShareManager shareManager_ = IShareManager(IShareModule(vault_).shareManager());
        shareManager_.burn(caller, shares);
        {
            IFeeManager feeManager = IShareModule(vault_).feeManager();
            uint256 fees = feeManager.calculateRedeemFee(shares);
            if (fees > 0) {
                shareManager_.mint(feeManager.feeRecipient(), fees);
                shares -= fees;
            }
        }
```

However, although the shares are burned, the funds actually remain within the vault up until a report is handled and it handles said redeems. For these reasons these funds should also be subject to performance and management fees (both for the time period between last fee accrual and creating redeem request and also after creating redeem request and up to report handling.

As the code does considers for `totalShares` only the `allocated` and minted shares, but not the ones waiting in redeem queue, the shares in redeem queue effectively bypass the necessary fees.

### Root Cause

Flawed logic.

### Code
https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/queues/RedeemQueue.sol#L98

### Attack Path

1. Reports are handled once a day.
2. Last report is at 00:00.
3. User creates a redeem request at 12:00. (12 hours since last report)
4. A new report comes at 00:00 (24 hours since previous report). 
5. The user claims their redeem and does not pay any fees for the past day.

### Impact

Loss of vault fees.

### PoC

_No response_

### Mitigation

When user creates a redeem request, transfer the fees to the queue contract. Burn the shares only when the request is handled (within `_handleReport`).



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/29
