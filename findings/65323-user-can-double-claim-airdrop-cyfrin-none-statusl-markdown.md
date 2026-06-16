---
tags:
  - lang/solidity
  - sector/token
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - fix/add-access-control
  - novelty/variant
  - misassumption/admin-is-honest
protocol: "[[Statusl]]"
auditors:
  - "[[Samuraii77]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
---
# User can double claim airdrop

- id: 65323
- impact: HIGH
- protocol: [[Statusl]]
- reporter: Samuraii77 (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md

## Summary


The bug report is about a smart contract called `KarmaAirdrop.sol` which is used for distributing tokens to users. There is a functionality in the contract that updates a variable called `merkleRoot` which adds new users to the airdrop list. However, this can cause a problem where users who have not claimed their tokens yet can claim them twice, which is not intended. To fix this, the contract needs to inherit another contract called `Pausable.sol` and add a modifier to the `claim` function. This issue has been fixed in a recent commit and has been verified by a team member.

## Details

**Description:** `KarmaAirdrop.sol` is pausable. That's because there is functionality to update `merkleRoot`: when it's updated, previously unclaimed tokens are added to the new `merkleRoot`. So following scenario is possible:
1) User have not claimed. `merkleRoot` will be updated to include some new people and previously unclaimed users
2) User frontruns upgrade by claiming his part
3) New `merkleRoot` now again contains his airdrop, so user can claim second time

To prevent this scenario, `KarmaAirdrop.sol` inherits `Pausable.sol`, however `KarmaAirdrop::claim` doesn't have `whenNotPaused` modifier

**Impact:** During `merkleRoot` upgrade, previously unclaimed users can double claim, stealing tokens.

**Recommended Mitigation:** Add modifier `whenNotPaused` to `KarmaAirdrop::claim`.

**StatusL2:** Fixed in [ebbf84b](https://github.com/status-im/status-network-monorepo/commit/ebbf84b63eb3b4559c93d130b883d78c9cb040f8).

**Cyfrin:** Verified.

\clearpage
