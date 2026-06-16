---
tags:
  - lang/solidity
  - sector/oracle
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Azuro]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Azuro_security_review.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# [H-01] BetExpress is broken when a bet has a condition with more than one outcome

- id: 31657
- impact: HIGH
- protocol: [[Azuro]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Azuro_security_review.md

## Summary


**Bug Summary: BetExpress fails to properly handle conditions with multiple winning outcomes, resulting in a revert due to underflow in the summing loop.**

This bug has a high impact as it affects the functionality of BetExpress, and a medium likelihood as it occurs when a condition has two or more winning outcomes. 

The bug occurs when a deposit is made for a condition with multiple winning outcomes. The construction logic of BetExpress only pushes one `subBetPayout` to the `condition.payouts` array, despite there being multiple possible outcomes. This leads to an incorrect count of winning outcomes, causing the `Math.maxSum` function to fail in calculating the reserve liquidity.

To fix this bug, the developers should handle the case where there is more than one winning outcome. This can be done by properly handling the `condition.payouts` array and ensuring that the correct number of winning outcomes is counted.

## Details

**Severity**

**Impact:** High, having a condition with two or more winning outcomes, the functionality of BetExpress doesn't work.

**Likelihood:** Medium, it happens when a condition has two or more winning outcomes.

**Description**

In the scenario where a deposit is made for a condition supporting two or more outcomes, BetExpress's construction logic improperly handles the `condition.payouts` array by pushing only one `subBetPayout`, despite multiple outcomes being possible.

        if (outcomeOrdinal == 0) {
            condition.payouts.push(subBetPayout);

The variable `winningOutcomesCount` is designated to count the winning outcomes for a condition. If a condition is configured with two or more outcomes, this count exceeds 2, indicating multiple winning outcomes.

        if (condition.winningOutcomesCount == 0)
            condition.winningOutcomesCount = winningOutcomesCounts[
                i
            ];

During liquidity reservation calculation, the `Math.maxSum` function is invoked with `condition.payouts` and `condition.winningOutcomesCount` as arguments, aiming to ensure sufficient liquidity is reserved.

        function _calcReserve(
            Condition storage condition
        ) internal view returns (uint128) {
            return
                uint128(
                    Math.diffOrZero(
                        Math.maxSum(
                            condition.payouts,
                            condition.winningOutcomesCount
                        ),
                        condition.fund
                    )
                );
        }

However, this logic fails for conditions with multiple outcomes as the `payouts` array contains only a single element, while `n >= 2`.

        /**
        * @notice Get the sum of `n` max items of `a`.
        */
        function maxSum(
            uint128[] memory a,
            uint256 n
        ) internal pure returns (uint256 sum_) {
            if (n < 2) return max(a);

            uint256 length = a.length;

            uint128[] memory sorted = new uint128[](length);
            for (uint256 i = 0; i < length; ++i) {
                sorted[i] = a[i];
            }
            sort(sorted, 0, length - 1);

            for (uint256 i = 0; i < n; ++i) {
                sum_ += sorted[length - 1 - i];
            }
        }

This operation leads to a revert due to underflow in the summing loop, where `length - 1 - i` becomes negative when `length = 1` and `i = 1` (since `n = 2`).

            for (uint256 i = 0; i < n; ++i) {
                sum_ += sorted[length - 1 - i];
            }

**Recommendations**

Handling the case there is more than one winning outcome.
