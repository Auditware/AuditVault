---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Statusl]]"
auditors:
  - "[[Samuraii77]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Any slasher can increase another one's reveal delays

- id: 65327
- impact: HIGH
- protocol: [[Statusl]]
- reporter: Samuraii77 (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md

## Summary


The bug report describes a problem with the `slashCommit` function in the `RLN` code. This function is used to make commits, which are based on a PK and a reward recipient address. However, any slasher can spam the function with someone else's hash and cause a delay in revealing the slash, preventing them from receiving their rewards. The report suggests adding another key to the function to mitigate this issue. The bug has been fixed in the latest commit and has been verified.

## Details

**Description:** Commits in `RLN` are made as follows:
```solidity
function slashCommit(address account, bytes32 hash) external onlyRole(SLASHER_ROLE) {
    uint256 lastReveal = lastRevealStartTime[account];
    uint256 revealStartTime;

    if (lastReveal == 0 || lastReveal + slashRevealWindowTime < block.timestamp) {
        revealStartTime = block.timestamp;
    } else {
        revealStartTime = lastReveal + slashRevealWindowTime;
    }

    slashCommitments[account][hash] = revealStartTime;
    lastRevealStartTime[account] = revealStartTime;
}
```
The hash is based on a PK and a reward recipient address. Thus, it seems like an assumption is made that this hash would only ever be used from the legitimate address as he is the one who benefits from having his own reward recipient address. However, any other slasher can simply spam the function a lot using someone else's hash and cause the reveal time for that slash to be very far in the future, thus disallow that slasher from getting the rewards he is entitled to. Then, he can be the one who actually gets these rewards.

**Impact:** Any slasher can significantly increase another one's reveal delays

**Recommended Mitigation:** Consider adding another key to `slashCommitments` which holds the address who commits (`msg.sender` during `slashCommit` call).

**StatusL2:** Fixed in [f15f5e9](https://github.com/status-im/status-network-monorepo/commit/f15f5e9997243a1991c4dadc98f790bfe57ae100).

**Cyfrin:** Verified.
