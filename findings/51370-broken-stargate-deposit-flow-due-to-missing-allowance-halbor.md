---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/farm
  - sector/liquid-staking
  - sector/staking
  - sector/staking-pool
  - sector/token
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[missing-allowance]]"
  - "[[permanent]]"
  - "[[token-approval-flow]]"
---
# Broken Stargate Deposit Flow Due to Missing Allowance

- id: 51370
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


The **depositLP** function in the **StargateSynthChef.sol** contract of the Entangle LSD Protocol has a critical oversight that can cause failed transactions and hinder the deposit process. This is because the function calls the deposit function of the Stargate LP Staking contract without first making sure that the Stargate contract is allowed to transfer the LP tokens on behalf of the user. This means that if the user has not already given permission for the Stargate contract to transfer their LP tokens, the transaction will fail. To fix this issue, the contract needs to be updated to check for sufficient allowance and approve the Stargate router before making the deposit call. The Entangle team has already solved this issue by making these changes in the code. 

## Details

##### Description

The **depositLP** function in the **StargateSynthChef.sol** contract of the Entangle LSD Protocol is designed to facilitate the deposit of LP tokens for farming. However, a critical oversight in the contract's implementation can lead to failed transactions and impede the deposit process. The **depositLP** function directly calls the deposit function of the Stargate LP Staking contract without first ensuring that the Stargate contract is allowed to transfer the LP tokens on behalf of the user. In the absence of a prior **approve** transaction, the **safeTransferFrom** call in the Stargate contract will fail because the contract lacks the necessary allowance to transfer the user's LP tokens.

  

[[StargateSynthChef.sol#L127C1-L138C1](https://github.com/Entangle-Protocol/entangle-lsd-protocol/blob/48e025e4ddf330e8ac710e82114db704a76d2857/contracts/SynthChefs/StargateSynthChef.sol#L127C1-L138C1)](<https://github.com/Entangle-Protocol/entangle-lsd-protocol/blob/48e025e4ddf330e8ac710e82114db704a76d2857/contracts/SynthChefs/StargateSynthChef.sol#L127C1-L138C1>)

  

```
    /// @notice Deposit LP tokens to farm. Can only be called by the MASTER.
    /// @param poolId Entangle internal poolId
    /// @param lpAmount Amount of LP tokens to deposit
    function depositLP(uint32 poolId, uint256 lpAmount) external onlyRole(MASTER) isPoolExist(address(pools[poolId].LPToken)) {
        console.log("StargateChef_depositLP", poolId);
        if(lpAmount == 0) revert StargateSynthChef__E3();
        Pool memory pool = pools[poolId];
        console.log(address(lpStaking), lpAmount, pool.stargateLPStakingPoolID);

        lpStaking.deposit(pool.stargateLPStakingPoolID, lpAmount);
    }
```

##### Proof of Concept

```
it("It should DepositLp", async () => {
    for (let index = 0; index < StargateConfig.Pools.length; index++) {
        LP = await ethers.getContractAt("ERC20", await MasterChef.getLpToken(SIDs[index]));
        const lpAmountToDeposit = await LP.connect(admin).balanceOf(admin.address);
        let lpAmountBefore = await MasterChef.connect(admin).getLpTokenTotalBalance(SIDs[index]);
        console.log(lpAmountToDeposit);

        expect(lpAmountBefore).to.eq(0);

        await LP.connect(admin).approve(MasterChef.address, lpAmountToDeposit);
        const tx1 = await MasterChef.connect(admin).depositLP(SIDs[index], lpAmountToDeposit);
        await tx1.wait();

        let lpAmountAfterDeposit = await MasterChef.getLpTokenTotalBalance(SIDs[index]);
        expect(lpAmountAfterDeposit).to.be.greaterThan(lpAmountBefore);
        console.log(lpAmountAfterDeposit);
    }
});
```

##### BVSS

[AO:A/AC:L/AX:L/C:C/I:C/A:C/D:N/Y:N/R:P/S:C (9.4)](/bvss?q=AO:A/AC:L/AX:L/C:C/I:C/A:C/D:N/Y:N/R:P/S:C)

##### Recommendation

Before the **deposit** call, the contract should check if the Stargate LP Staking contract has sufficient allowance to transfer the user's LP tokens. Also, It should approve the Stargate router.

  

**Remediation Plan:** The Entangle team solved the issue by calling approve function.

##### Remediation Hash

<https://github.com/Entangle-Protocol/entangle-lsd-protocol/commit/5f18e6300960b56ca262cb6569120824c203853d>
