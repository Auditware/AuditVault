---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Dolomite Polvaults]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-dolomite-POLVaults-v2.0.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[use-reentrancy-guard]]"
---
# InfraVault's Permissionless Reward Claiming Can Allow Anyone to Lock Rewards in the MetaVault

- id: 55624
- impact: HIGH
- protocol: Dolomite Polvaults
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-dolomite-POLVaults-v2.0.md

## Summary


The InfraredBGTMetaVault contract has a bug that allows anyone to call a function called `getRewardForUser` on any user's rewards. This can cause rewards to be transferred to the MetaVault address without going through the intended deposit or distribution logic. This can result in tokens being stuck in the MetaVault contract and unable to be used by the vault owner. The bug has been fixed by Dolomite in their code.

## Details

**Description:** The `InfraredBGTMetaVault` relies on `_performDepositRewardByRewardType` to handle newly claimed rewards by either depositing them into DolomiteMargin or sending them directly to the vault owner. However, the onchain Infrared vault [contract](https://berascan.com/address/0x67b4e6721ad3a99b7ff3679caee971b07fd85cd1#code) allows anyone to call `getRewardForUser` on any user’s rewards. Note that this function is defined in the `MultiRewards.sol`, the contract that infrared vault derives from.

This can trigger a reward transfer to the MetaVault unexpectedly. Because the code that deposits or forwards these tokens (`_performDepositRewardByRewardType`) only runs during the normal “self-claim” flow, rewards triggered through a third-party call would not go through the intended deposit or distribution logic.

```solidity
/// @inheritdoc IMultiRewards
function getRewardForUser(address _user)
    public
    nonReentrant
    updateReward(_user)
{
    onReward();
    uint256 len = rewardTokens.length;
    for (uint256 i; i < len; i++) {
        address _rewardsToken = rewardTokens[i];
        uint256 reward = rewards[_user][_rewardsToken];
        if (reward > 0) {
            (bool success, bytes memory data) = _rewardsToken.call{
                gas: 200000
            }(
                abi.encodeWithSelector(
                    ERC20.transfer.selector, _user, reward
                )
            );
            if (success && (data.length == 0 || abi.decode(data, (bool)))) {
                rewards[_user][_rewardsToken] = 0;
                emit RewardPaid(_user, _rewardsToken, reward);
            } else {
                continue;
            }
        }
    }
}
```

**Impact:** An attacker could force rewards to be sent to the MetaVault’s address without triggering `_performDepositRewardByRewardType`. As a result, those newly arrived tokens could stay in the MetaVault contract, never being staked or deposited into DolomiteMargin or distributed to the vault owner.

We note that the token loss is not permanent as the InfraredBGTMetaVault contract is upgradeable. Nevertheless this can cause delays as every user has an independent vault and upgrading each vault would be cumbersome. In the meanwhile, vault owners cannot use their received rewards within the Dolomite Protocol.


**Proof of Concept:** Consider the following scenario:
	1.	An attacker calls `infravault.getRewardForUser(metaVaultAddress)`.
	2.	The reward is transferred to metaVaultAddress rather than going through the `_performDepositRewardByRewardType` logic.
	3.	The tokens remain stuck in the MetaVault contract if there is no fallback mechanism to move or stake them again.

**Recommended Mitigation:** Consider modifying the `_performDepositRewardByRewardType` to add the token balance in the vault to the reward amount and routing all BGT token vault staking into Infrared vaults via the metavault.

```diff
  function _performDepositRewardByRewardType(
        IMetaVaultRewardTokenFactory _factory,
        IBerachainRewardsRegistry.RewardVaultType _type,
        address _token,
        uint256 _amount
    ) internal {
++ _amount += IERC20(token).balanceOf(address(this));
}
```

**Dolomite:** Fixed in [d0a638a](https://github.com/dolomite-exchange/dolomite-margin-modules/commit/d0a638aefdda72925329b2da60f405cd4450f78a).

**Cyfrin:** Verified

\clearpage
