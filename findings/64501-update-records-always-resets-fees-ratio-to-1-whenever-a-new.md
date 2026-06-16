---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[fot-slippage]]"
---
# `update_records` always resets `fees_ratio` to 1 whenever a new currency is added

- id: 64501
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The `update_records` function is used to update fee discounts for users when a new currency is added. However, there is a bug where the discount is reset to 1.0 whenever a new currency is added, causing users to lose their previously earned discount. This can result in higher fees for users who have already made a prepayment. The bug has been fixed in commit 66c878 and has been verified by Cyfrin. To prevent this issue, the function should only iterate over newly added currency entries.

## Details

**Description:** The `update_records` function is used to update the `client_community_acc` by including more `ClientCommunityRecord` for every currency token. However, within this function the `fees_ratio` is always being reset to `1.0` whenever a new currency is added. This occurs because the function iterates over all existing `ClientCommunityRecord` entries and sets the `fees_ratio` to `1.0` during each iteration.

```rust
            self.data = unsafe {
                Vec::from_raw_parts(
                    dividends_ptr as *mut ClientCommunityRecord,
                    self.header.count as usize,
                    self.header.count as usize,
                )
            };
            for (d, b) in self.data.iter_mut().zip(community_state.base_crncy.iter()) {
                d.crncy_token_id = b.crncy_token_id;
                d.fees_ratio = 1.0;
            }
```
Scenario:
1. The user makes a prepayment of x currency tokens and becomes eligible for a 50% discount.
2. Later, a new currency is added by admin.
3. The user then deposits some amount of DRVS tokens. However, when the `update_records` function is called, the addition of the new currency causes the `fees_ratio` to reset to 1.0, thereby removing the user’s previously earned discount.




**Impact:** This will result in a loss for users who have already made a prepayment for a fee discount, as they would now be required to pay higher fees.

**Recommended Mitigation:** Iterate over only newly added ClientCommunityRecord entries to mitigate this issue.

**Deriverse:** Fixed in commit [66c878](https://github.com/deriverse/protocol-v1/commit/66c878370dc8041d6544b8fdee636102ce00fe8c).

**Cyfrin:** Verified.
