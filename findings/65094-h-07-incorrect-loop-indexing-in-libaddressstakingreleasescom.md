---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Recall]]"
auditors:
  - "[[newspacexyz]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# [H-07] Incorrect loop indexing in `LibAddressStakingReleases.compact()` leads to unprocessed pending releases

- id: 65094
- impact: HIGH
- protocol: [[Recall]]
- reporter: newspacexyz (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


The `compact()` function in the `LibAddressStakingReleases` contract has a bug that prevents it from releasing claimable collateral. This is due to the use of an absolute index in the loop condition, which does not account for the number of pending releases. As a result, the function does not process pending releases and locks validator funds. The issue becomes more likely as the absolute index grows larger and at some point, it becomes inevitable. To fix this, the loop condition should be adjusted to account for the start index and the number of pending releases.

## Details



The root cause of this issue is the use of an absolute index (`self.startIdx`) in the loop condition of the `compact()` function in `LibAddressStakingReleases`, while `self.length` represents the number of pending releases.

If there are more processed releases than pending releases, the following will be true: `self.startIdx > self.length`.

This will cause the [`compact()` function](https://github.com/code-423n4/2025-02-recall/blob/main/contracts/contracts/lib/LibStaking.sol# L28-L60) to never enter the processing loop:
```

    function compact(AddressStakingReleases storage self) internal returns (uint256, uint16) {
        uint16 length = self.length;
        if (self.length == 0) {
            revert NoCollateralToWithdraw();
        }

        uint16 i = self.startIdx; // <-- 'i' is the absolute index, e.g., 100 after previous processing

        uint16 newLength = length;
        uint256 amount;
        while (i < length) { // <-- ! // Incorrect: compares absolute index (e.g., 100) with pending count (15)
            StakingRelease memory release = self.releases[i];

            // releases are ordered ascending by releaseAt, no need to check
            // further as they will still be locked.
            if (release.releaseAt > block.number) {
                break;
            }

            amount += release.amount;
            delete self.releases[i];

            unchecked {
                ++i;
                --newLength;
            }
        }

        self.startIdx = i; // <-- Updates startIdx to the final value of 'i'
        self.length = newLength; // Updates the length to the number of pending releases

        return (amount, newLength);
    }
```

This prevents the contract from processing and releasing collateral that should be claimable, locking validator funds and breaking the core logic of the `compact` function.

Since `startIdx` only increases over time (as it is never reset), this issue becomes more likely as the absolute index grows larger and at some point it becomes inevitable.

Note: [`compact` is called in the `claim` function](https://github.com/code-423n4/2025-02-recall/blob/main/contracts/contracts/lib/LibStaking.sol# L84-L93) that is critical for the validator collateral claiming flow.

### Proof of Concept

Let’s go over the following scenario:

* 115 releases to be processed, 100 of them available to claim at the current release time.
* `compact` function is called, `i = startIdx = 0`, `newLength = length = 115`.
* `compact` processes the 100 available releases, the loop breaks and this is executed:
```

self.startIdx = i; // = 100 (it was incremented 100 times)
self.length = newLength; // = 15 (it was decremented 100 times - number of pending releases)
```

Now, on the next iteration, let’s say for simplicity the number of releases stays the same, and time has passed so now they are available for claiming. We have this:

* `startIdx = 100`, `self.length = 15`.
* The loop starts with `i = 100` and checks `while (i < 15)`, which immediately fails.

Outcome:

* The loop body does not execute.
* Pending releases (indices 100 to 114 in absolute terms) are never processed.

This discrepancy between the absolute index and the relative count prevents claimable collateral from being released. This is extremely likely to happen since the absolute index of processed releases only grows; it never decreases. Therefore, it’ll reach a point of its value being `100`, `1000`, `10_000`, etc.

At some point, the value will be so big that the pending releases will inevitably be of much lower value than the processed releases, leading to locked validator collateral that should be available to claim.

### Recommended mitigation steps

Adjust the loop condition. For example, change the condition to:
```

while (i < self.startIdx + self.length)
```

**Recall confirmed**

---
