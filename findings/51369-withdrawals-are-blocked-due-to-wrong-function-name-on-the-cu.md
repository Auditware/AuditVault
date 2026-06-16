---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/farm
  - sector/liquid-staking
  - sector/staking
  - sector/staking-pool
  - sector/token
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Withdrawals Are Blocked Due to Wrong Function Name On the Curve Convex

- id: 51369
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


The Entangle LSD Protocol is facing a critical issue with its integration with the Curve Convex system. This is due to a mismatch in function naming conventions between the Entangle contract and the actual Convex contract on the Ethereum mainnet. The function "witdraw" in the Entangle contract is spelled incorrectly, leading to a failure in interfacing with the Convex contract. This can impact the withdrawal of LP tokens and potentially affect liquidity providers and the overall functioning of the protocol. The recommended solution is to correct the function name in the Entangle contract to match the Convex contract. The issue has been resolved by the Entangle team by correcting the function name. 

## Details

##### Description

The Entangle LSD Protocol's integration with the **Curve Convex system** in its **CurveCompoundConvexSynthChef.sol** contract is facing a critical issue due to a mismatch in function naming conventions. The **Convex** interface in the Entangle LSD Protocol contract defines a function ***witdraw(uint256 pid, uint256 amount)***. However, the actual **Convex** contract on the Ethereum mainnet defines this function as withdraw(uint256 *pid, uint256* amount). The discrepancy lies in the spelling of "**withdraw**" (missing 'h' in the **Entangle** contract).

This mismatch leads to a failure in interfacing with the Convex contract, as calls to **withdraw** will not be recognized by the Convex system. This issue can halt critical functionalities related to withdrawing LP tokens, potentially impacting liquidity providers and the overall functioning of the protocol.

  

[[CurveCompoundConvexSynthChef.sol#L184](https://github.com/Entangle-Protocol/entangle-lsd-protocol/blob/48e025e4ddf330e8ac710e82114db704a76d2857/contracts/SynthChefs/CurveCompoundConvexSynthChef.sol#L184)](<https://github.com/Entangle-Protocol/entangle-lsd-protocol/blob/48e025e4ddf330e8ac710e82114db704a76d2857/contracts/SynthChefs/CurveCompoundConvexSynthChef.sol#L184>)

```
    /// @notice Withdraw LP tokens from farm and transfer it to entangle MasterChef. Can only be called by the MASTER.
    /// @param poolId Entangle internal poolId.
    /// @param lpAmount Amount of LP tokens to withdraw.
    function withdrawLP(uint32 poolId, uint256 lpAmount) external onlyRole(MASTER) {
        console.log("CurveChef_withdrawLp", poolId);
        Pool memory pool = pools[poolId];
        //console.log(pool.convexID);
                console.log("CurveChef_withdrawLp");

        bool suc = convex.witdraw(pool.convexID, lpAmount);

        if (!suc) revert CurveCompoundConvexSynthChef__E4();

        IERC20Upgradeable(pool.lp).safeTransfer(masterChef, lpAmount);
    }
```

##### Proof of Concept

```
it("It should DepositLp", async () => {
    for (let index = 0; index < CurveConfig.Pools.length; index++) {
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

  

**Ethereum Main-net Contract :** <https://etherscan.io/address/0xF403C135812408BFbE8713b5A23a04b3D48AAE31#code>

  
![](https://halbornmainframe.com/proxy/audits/images/65ca6cdc4e98381432d55415)

##### BVSS

[AO:A/AC:L/AX:L/C:C/I:C/A:C/D:N/Y:N/R:P/S:C (9.4)](/bvss?q=AO:A/AC:L/AX:L/C:C/I:C/A:C/D:N/Y:N/R:P/S:C)

##### Recommendation

Correct the function name in the Convex interface within the ***CurveCompoundConvexSynthChef.sol*** contract to match the Convex mainnet contract. The correct function name is **withdraw(uint256 *pid, uint256* amount)**.

**Remediation Plan:** The Entangle team solved the issue by correcting the function name.

##### Remediation Hash

<https://github.com/Entangle-Protocol/entangle-lsd-protocol/commit/2de2bc00ca464abb1dfd3dd519134ac96cb959ce>

##### References

<https://etherscan.io/address/0xF403C135812408BFbE8713b5A23a04b3D48AAE31#code>
