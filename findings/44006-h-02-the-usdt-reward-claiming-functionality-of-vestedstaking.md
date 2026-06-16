---
tags:
  - lang/solidity
  - sector/stable
  - sector/staking
  - sector/staking-pool
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Csx]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [H-02] The `USDT` Reward Claiming Functionality of `VestedStaking` Can Be DoSed Due to a Logical Error

- id: 44006
- impact: HIGH
- protocol: [[Csx]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md

## Summary


This bug report describes a high-risk issue in the `claimRewards` function of the `VestedStaking.sol` contract. The issue affects the calculation of USDT rewards and can be exploited by malicious users to prevent others from claiming their rewards. A proof of concept test is included to demonstrate the issue. The affected code is located on line 170 of the `VestedStaking.sol` file. The recommended solution is to fetch the balance of the `msg.sender` instead of the current contract. The team has responded that the issue has been fixed as suggested.

## Details

## Severity

High Risk

## Description

There is a logical error in the current implementation of the `claimRewards` function in the `VestedStaking.sol` contract, and more specifically, in its logic for claiming USDT rewards.

```solidity
if (claimUsdt) {
  if (usdtAmount != 0) {
    uint256 beforeBalance = IUSDT_TOKEN.balanceOf(address(this));
    IUSDT_TOKEN.safeTransfer(msg.sender, usdtAmount);
    usdtAmount = IUSDT_TOKEN.balanceOf(msg.sender) - beforeBalance;
  }
}
```

As it can be seen, the balance of the current contract is being fetched into the `beforeBalance` variable. After the transfer of USDT rewards to the `msg.sender` that value gets subtracted from the `msg.sender` balance, in order to determine the actual amount of USDT that was transferred. Those operations will lead to the wrong value of `usdtAmount` being calculated.

Not only that but when the vester of the given contract has a zero or close to zero USDT balance, this issue can be abused by malicious users in order to DOS the USDT reward-claiming functionality of the vested staking contract. This can be achieved by directly transferring a USDT amount that is greater than the vester's balance to the `VestedStaking` contract - leading to the USDT reward claiming functionality always reverting on `VestedStaking.sol#L172` due to an arithmetic underflow error. The same DOS scenario is possible if the USDT transfer fees get enabled and they are greater than the vester's USDT balance.

## Impact

Users won't be able to claim their USDT staking rewards from their `VestedStaking` contracts.

Additionally, the `Claim` event at the end of the function will be emitted with a wrong USDT value when the function is not DOSed.

## Proof of Concept

The following test demonstrates how a user that has a X USDT balance can be prevented from claiming their USDT staking rewards.

```typescript
it("should revert reward claiming when the vester has a X USDT balance and the contract has a > X USDT balance", async () => {
  const vesterUsdtBalance = ethers.parseUnits("2", 6); // Vester has a total of 2 USDT
  await usdt.connect(deployer).transfer(vesterAddress, vesterUsdtBalance);

  const depositAmount = ethers.parseUnits("1000", 6);
  await usdt.connect(deployer).approve(stakedCSX.getAddress(), depositAmount);

  await stakedCSX
    .connect(deployer)
    .depositDividend(await usdt.getAddress(), depositAmount);
  await stakedCSX.connect(council).distribute(false, false, true);

  // Transfer 0.000001 USDT more than the vested balance to make the claimRewards() function revert
  await usdt
    .connect(deployer)
    .transfer(vestedStaking.getAddress(), vesterUsdtBalance + BigInt(1));

  await expect(
    vestedStaking.connect(vesterAddress).claimRewards(false, true, false, false)
  ).to.be.revertedWithPanic("0x11"); // Arithmetic under/overflow panic code
});
```

To run the PoC test, add it to the `VestedStaking` describe block of the `VestedStaking.test.ts` file and then run `npx hardhat test --grep "should revert reward claiming when the vester has a X USDT balance and the contract has a > X USDT balance"` in the project root directory

## Location of Affected Code

File: [contracts/CSX/VestedStaking.sol#L170](https://github.com/csx-protocol/csx-contracts/blob/4a066ae2229756518bfa3da1455c2ac646523a88/contracts/CSX/VestedStaking.sol#L170])

## Recommendation

Fetch the balance of `msg.sender` in the `beforeBalance` variable instead of the balance of the current contract:

```diff
if (claimUsdt) {
  if (usdtAmount != 0) {
- uint256 beforeBalance = IUSDT_TOKEN.balanceOf(address(this));
+ uint256 beforeBalance = IUSDT_TOKEN.balanceOf(msg.sender);
  IUSDT_TOKEN.safeTransfer(msg.sender, usdtAmount);
  usdtAmount = IUSDT_TOKEN.balanceOf(msg.sender) - beforeBalance;
  }
}
```

## Team Response

Fixed as suggested.
