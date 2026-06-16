---
tags:
  - lang/solidity
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[koxuan]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# [H-06] `BringUnusedETHBackIntoGiantPool` can cause stuck ether funds in Giant Pool

- id: 43029
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: koxuan (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


The bug report is about a function called `withdrawUnusedETHToGiantPool` in two contracts, `GiantMevAndFeesPool.sol` and `GiantSavETHVaultPool.sol`. This function is supposed to withdraw any unused ETH from the vault if staking has not yet started. However, the report found that the `idleETH` variable, which represents the available ETH for withdrawing and depositing for staking, is not being updated when ETH is withdrawn from the vault. This means that the withdrawn ETH will be stuck forever and cannot be used for staking. The report includes a proof of concept in the form of a Solidity code, which shows that the bug can be replicated. The report recommends updating the `idleETH` variable in the `withdrawUnusedETHToGiantPool` function to fix the issue. The bug has been confirmed by a team member and the recommended mitigation steps have been provided.

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantMevAndFeesPool.sol#L126-L138><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantSavETHVaultPool.sol#L137-L158><br>

`withdrawUnusedETHToGiantPool` will withdraw any eth from the vault if staking has not commenced(knot status is `INITIALS_REGISTERED`), the eth will be drawn successful to the giant pool. However, idleETH variable is not updated. idleETH  is the available ETH for withdrawing and depositing eth for staking. Since there is no other places that updates idleETH other than depositing eth for staking and withdrawing eth, the eth withdrawn from the vault will be stuck forever.

### Proof of Concept

Place poc in GiantPools.t.sol with `import { MockStakingFundsVault } from "../../contracts/testing/liquid-staking/MockStakingFundsVault.sol";`

```solidity
    function testStuckFundsInGiantMEV() public {

        stakingFundsVault = MockStakingFundsVault(payable(manager.stakingFundsVault()));
        address nodeRunner = accountOne; vm.deal(nodeRunner, 4 ether);
        //address feesAndMevUser = accountTwo; vm.deal(feesAndMevUser, 4 ether);
        //address savETHUser = accountThree; vm.deal(savETHUser, 24 ether);
        address victim = accountFour; vm.deal(victim, 1 ether);


        registerSingleBLSPubKey(nodeRunner, blsPubKeyOne, accountFour);

        emit log_address(address(giantFeesAndMevPool));
        vm.startPrank(victim);

        emit log_uint(victim.balance);
        giantFeesAndMevPool.depositETH{value: 1 ether}(1 ether);
        bytes[][] memory blsKeysForVaults = new bytes[][](1);
        blsKeysForVaults[0] = getBytesArrayFromBytes(blsPubKeyOne);

        uint256[][] memory stakeAmountsForVaults = new uint256[][](1);
        stakeAmountsForVaults[0] = getUint256ArrayFromValues(1 ether);
        giantFeesAndMevPool.batchDepositETHForStaking(getAddressArrayFromValues(address(stakingFundsVault)),getUint256ArrayFromValues(1 ether) , blsKeysForVaults, stakeAmountsForVaults);

        emit log_uint(victim.balance);


        vm.warp(block.timestamp + 60 minutes);
        LPToken lp = (stakingFundsVault.lpTokenForKnot(blsKeysForVaults[0][0]));
        LPToken [][] memory lpToken = new LPToken[][](1);
        LPToken[] memory temp  = new LPToken[](1);
        temp[0] = lp;
        lpToken[0] = temp;

        emit log_uint(address(giantFeesAndMevPool).balance);
        giantFeesAndMevPool.bringUnusedETHBackIntoGiantPool(getAddressArrayFromValues(address(stakingFundsVault)),lpToken, stakeAmountsForVaults);

        emit log_uint(address(giantFeesAndMevPool).balance);
        vm.expectRevert();
        giantFeesAndMevPool.batchDepositETHForStaking(getAddressArrayFromValues(address(stakingFundsVault)),getUint256ArrayFromValues(1 ether) , blsKeysForVaults, stakeAmountsForVaults);

        vm.expectRevert();
        giantSavETHPool.withdrawETH(1 ether);

        vm.stopPrank();
    }


```

Both withdrawing eth for user and depositing eth to stake fails and reverts as shown in the poc due to underflow in idleETH.

Note that the same problem also exists in GiantSavETHVaultPool, however a poc cannot be done for it as another bug exist in GiantSavETHVaultPool which prevents it from receiving funds as it lacks a receive() or fallback() implementation.

### Tools Used

Foundry

### Recommended Mitigation Steps

Update `idleETH` in withdrawUnusedETHToGiantPool

**[vince0656 (Stakehouse) confirmed](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/115)**



***
