---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/dos/unbounded-loop
protocol: "[[Statusl]]"
auditors:
  - "[[Samuraii77]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md"
genome:
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# Any staker can fully avoid slashing by triggering OOG reverts

- id: 65322
- impact: HIGH
- protocol: [[Statusl]]
- reporter: Samuraii77 (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md

## Summary


This bug report discusses an issue where a user can register an unlimited number of vaults, causing a loop to go out of gas and making it impossible to penalize or "slash" the account. The recommended solution is to limit the number of vaults an account can register to 10. The bug has been fixed in a recent commit and has been verified by the team.

## Details

**Description:** The finding is similar to [*Malicious actors can force vaults to exit if they wish to get rewards*](#malicious-actors-can-force-vaults-to-exit-if-they-wish-to-get-rewards), but actually different (different fix, different impact, similarity is iterating over the vaults to trigger OOG).

Upon slashing, we calculate the redeemable rewards for the account to slash by going over all of the account vaults and summing them up:
```solidity
for (uint256 i = 0; i < accountVaults.length; i++) {
    accountTotalRewards += rewardsBalanceOf(accountVaults[i]);
}
```
The issue is that the account can register a ton of vaults using `VaultFactory::createVault()`:
```solidity
function createVault() external returns (StakeVault clone) {
    clone = StakeVault(Clones.clone(vaultImplementation));
    clone.initialize(msg.sender, stakeManager);
    clone.register();
    emit VaultCreated(address(clone), msg.sender);
}
````

This will cause the loop to go OOG, thus it is impossible to slash that account.

**Impact:** Slashes are made impossible.

**Recommended Mitigation:** Consider having a sensible limit on the vaults an account can register, i.e. 10.

**StatusL2:** Fixed in [6697432](https://github.com/status-im/status-network-monorepo/commit/6697432b862ee515d1783941a78d07e9a91991eb).

**Cyfrin:** Verified.
