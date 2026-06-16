---
tags:
  - lang/solidity
  - sector/farm
  - sector/governance
  - sector/token
  - platform/0x52
  - has/github
  - severity/high
  - lang/vyper
protocol: "[[Hyperstable]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md"
genome:
  - "[[access-roles]]"
  - "[[specific-token-type]]"
  - "[[add-access-control]]"
---
# [H-02] `EmissionScheduler#epochEmission` lacks access control and can be called by anyone to cause epoch to mint no emissions

- id: 55693
- impact: HIGH
- protocol: Hyperstable
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md

## Summary


This bug report is about a function called `epochEmission` in the file EmissionScheduler.sol. The function is used to calculate the amount of tokens to be emitted in an epoch, but there is a problem with how it is called. The function can be called by anyone, even though it should only be accessible to a specific user called `minter`. This means that when the function is called by someone other than the `minter`, it will return incorrect values and cause all emissions for that epoch to be wiped out. To fix this issue, the developers have added access control to the function and made sure that only the `minter` can call it. This fix has been implemented in the latest version of the code.

## Details

**Details**

[EmissionScheduler.sol#L63-L80](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/EmissionScheduler.sol#L63-L80)

    @>  function epochEmission(uint256 _pegSupply, uint256 _veSupply) external returns (uint256, uint256, uint256) {
            uint256 currentEpoch = _currentEpoch();

            if (currentEpoch == lastEpoch) {
                return (0, 0, 0);
            }

    @>      lastEpoch = currentEpoch;

            uint256 toEmit = (_pegSupply - _veSupply).mulDiv(2, EMISSION_PRECISION);

            lastEpochEmission = toEmit;

            uint256 rebase = _calculateRebase(toEmit, _pegSupply, _veSupply);
            uint256 teamEmission = _calculateTeamEmission(toEmit, rebase);

            return (toEmit, rebase, teamEmission);
        }

We see above that `lastEpoch` is updated to `currentEpoch` when called. Also notice that there is no access control on calls to this function and therefore it can be called by anyone. The result in that when the legitimate call is made it will return `(0, 0, 0)`, completely wipe out all emissions owed for the epoch.

**Lines of Code**

[EmissionScheduler.sol#L63-L80](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/EmissionScheduler.sol#L63-L80)

**Recommendation**

`epochEmission` should only be callable by `minter`.

**Remediation**

Fixed in [7866674](https://github.com/hyperstable/contracts/commit/786667407e84ff76111aa0a8213b698f791f532d). Creates `_onlyMinter` which provides access control and applies it to `EmissionScheduler#epochEmission`.
