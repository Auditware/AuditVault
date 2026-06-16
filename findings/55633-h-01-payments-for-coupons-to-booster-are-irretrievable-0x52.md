---
tags:
  - lang/solidity
  - platform/0x52
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Buffer]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md"
genome:
  - "[[frozen-funds]]"
  - "[[fee-accounting]]"
  - "[[locked-funds]]"
---
# [H-01] Payments for coupons to Booster are irretrievable

- id: 55633
- impact: HIGH
- protocol: [[Buffer]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md

## Summary


This bug report is about a problem in the code of a smart contract called Booster. The code in question is lines 92-99 and 80-100. The issue is that the contract transfers tokens to itself but does not have a way to retrieve them, causing them to be stuck in the contract forever. The recommendation is to send the fees to a configurable address instead of the booster contract. This issue has been fixed in a recent update by sending the fees to the admin instead of the booster contract. 

## Details

**Details**

[Booster.sol#L92-L99](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/Booster.sol#L92-L99)

        uint256 price = couponPrice - discount;
        require(token.balanceOf(user) >= price, "Not enough balance");


        token.safeTransferFrom(user, address(this), couponPrice); <- @audit tokens transferred to this
        userBoostTrades[tokenAddress][user]
            .totalBoostTrades += MAX_TRADES_PER_BOOST;


        emit BuyCoupon(tokenAddress, user, couponPrice);

Booster#buy transfers tokens to itself but has no way to recover these tokens, causing them to be permanently trapped in this contract.

**Lines of Code**

[Booster.sol#L80-L100](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/Booster.sol#L80-L100)

**Recommendation**

Transfer fees to a configurable address such as admin

**Remediation**

Mitigated [here](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/pull/8) by sending fees to admin rather than the booster contract
