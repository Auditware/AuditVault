---
tags:
  - lang/move
  - lang/solidity
  - sector/dex
  - sector/oracle
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/access-control/uninitialized-owner
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-access-control
  - fix/initialize-proxy
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[uninitialized-owner]]"
  - "[[reinitialization]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
  - "[[timestamp-dependence]]"
---
# [H-02] `totalXP` is wrongly calculated for existing users

- id: 41689
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


The bug report is about a medium severity issue in the `DyadXPv2.sol` contract. During the contract's initialization, the `totalXP` of each user is calculated, but it doesn't consider the last accrued bonus. This is because the elapsed time between the upgrade and the user's last action is likely not zero. This can result in incorrect `totalXP` values, which can affect the `accrualRateModifier` and rewards for users. The report recommends a fix to correctly calculate the `totalXP` by using the `_computeXP` function.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In `src/staking/DyadXPv2.sol`, the contract must be initialized through the `initialize` function, and the `totalXP` of each user is also calculated here:

```solidity
    function initialize(address owner) public reinitializer(2) {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);

        uint256 dnftSupply = DNFT.totalSupply();

        for (uint256 i = 0; i < dnftSupply; ++i) {
            noteData[i] = NoteXPData({
                lastAction: uint40(block.timestamp),
                keroseneDeposited: uint96(KEROSENE_VAULT.id2asset(i)),
                lastXP: noteData[i].lastXP,
->              totalXP: noteData[i].lastXP,
                dyadMinted: DYAD.mintedDyad(i)
            });
        }
    }

```

However, the `totalXP` doesn't consider the last accrued bonus, as it is only the `lastXP` rather than the actual total (including the bonus) during the upgrade.

This is because the `elapsed` time between the upgrade and their last action is very likely to not be zero:

```solidity
    function _computeXP(NoteXPData memory lastUpdate) internal view returns (uint256) {
->      uint256 elapsed = block.timestamp - lastUpdate.lastAction;
        uint256 deposited = lastUpdate.keroseneDeposited;
        uint256 dyadMinted = lastUpdate.dyadMinted;
        uint256 totalXP = lastUpdate.totalXP;

        uint256 accrualRateModifier = totalXP > 0 ? 1e18 / totalXP.log10() : 1e18;

        uint256 adjustedAccrualRate = accrualRateModifier * 1e7;

        // bonus = deposited + deposited * (dyadMinted / (dyadMinted + deposited))
        uint256 bonus = deposited;

        if (dyadMinted + deposited != 0) {
            bonus += deposited.mulWadDown(dyadMinted.divWadDown(dyadMinted + deposited));
        }

        return uint256(lastUpdate.lastXP + (elapsed * adjustedAccrualRate * bonus) / 1e18);
    }
```

A numerical example:

```
lastXP: 1e18

_computeXP:

elapsed: 10_000
deposited: 1e18
dyadMinted: 0
totalXP: 0

accrualRateModifier: 1e18

adjustedAccrualRate: 1e18 * 1e7 = 1e25

bonus: 1e18

0 + 1e18 != 0
    bonus = 1e18 + (1e18 * (0 / (0 + 1e18)) = 1e18

-> 1e18 + (10_000 * 1e25 * bonus) / 1e18 = 1e18 + 10_000 * 1e25

```

In this example, the user will have a `totalXP = 1e18` with the current code, but they should have `totalXP = 1e18 + 1e29` instead.

This will affect the `accrualRateModifier` the next time the function is called (for example, to calculate rewards of a Uniswap position), as the `totalXP` will be lower than intended.

## Recommendations

Consider applying the following fix:

```diff
    function initialize(address owner) public reinitializer(2) {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);

        uint256 dnftSupply = DNFT.totalSupply();

        for (uint256 i = 0; i < dnftSupply; ++i) {
+       uint256 totalXP = _computeXP(noteData[i]);
            noteData[i] = NoteXPData({
                lastAction: uint40(block.timestamp),
                keroseneDeposited: uint96(KEROSENE_VAULT.id2asset(i)),
                lastXP: noteData[i].lastXP,
-               totalXP: noteData[i].lastXP,
+               totalXP: totalXP,
                dyadMinted: DYAD.mintedDyad(i)
            });
        }
    }

```
