---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/algo-stable
  - sector/dex
  - sector/lending
protocol: "[[Fei Protocol V2 Phase 1]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2021/09/fei-protocol-v2-phase-1/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# StableSwapOperatorV1 - resistantFei value is not correct in the resistantBalanceAndFei function

- id: 13296
- impact: HIGH
- protocol: [[Fei Protocol V2 Phase 1]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2021/09/fei-protocol-v2-phase-1/

## Summary


This bug report is about the `resistantBalanceAndFei` function of a `PCVDeposit` contract. This function is supposed to return the amount of funds that the contract controls and the number of FEI tokens that are protocol-controlled. These FEI tokens are “temporarily minted” and should not be used in calculations that determine the collateralization of the protocol.

Currently, the amount of these FEI tokens is different during the deposit, withdrawal, and the `resistantBalanceAndFei` function call. This can lead to a significant change in the total PCV value and collateralization after one of the steps (deposit or withdrawal).

The recommendation is to ensure that deposit, withdrawal, and the `resistantBalanceAndFei` are consistent and won’t instantly change the PCV value significantly.

## Details

#### Description


The `resistantBalanceAndFei` function of a `PCVDeposit` contract is supposed to return the amount of funds that the contract controls; it is then used to evaluate the total value of PCV (collateral in the protocol). Additionally, this function returns the number of FEI tokens that are protocol-controlled. These FEI tokens are “temporarily minted”; they are not backed up by the collateral and shouldn’t be used in calculations that determine the collateralization of the protocol.


Ideally, the amount of these FEI tokens should be the same during the deposit, withdrawal, and the `resistantBalanceAndFei` function call. In the `StableSwapOperatorV1`  contract, all these values are totally different:


* during the deposit, the amount of required FEI tokens is calculated. It’s done in a way so the values of FEI and 3pool tokens in the metapool should be equal after the deposit. So if there is the initial imbalance of FEI and 3pool tokens, the deposit value of these tokens will be different:


**code/contracts/pcv/curve/StableSwapOperatorV1.sol:L156-L171**



```
// get the amount of tokens in the pool
(uint256 \_3crvAmount, uint256 \_feiAmount) = (
    IStableSwap2(pool).balances(\_3crvIndex),
    IStableSwap2(pool).balances(\_feiIndex)
);
// ... and the expected amount of 3crv in it after deposit
uint256 \_3crvAmountAfter = \_3crvAmount + \_3crvBalanceAfter;
 
// get the usd value of 3crv in the pool
uint256 \_3crvUsdValue = \_3crvAmountAfter \* IStableSwap3(\_3pool).get\_virtual\_price() / 1e18;
 
// compute the number of FEI to deposit
uint256 \_feiToDeposit = 0;
if (\_3crvUsdValue > \_feiAmount) {
    \_feiToDeposit = \_3crvUsdValue - \_feiAmount;
}

```
* during the withdrawal, the FEI and 3pool tokens are withdrawn in the same proportion as they are present in the metapool:


**code/contracts/pcv/curve/StableSwapOperatorV1.sol:L255-L258**



```
uint256[2] memory \_minAmounts; // [0, 0]
IERC20(pool).approve(pool, \_lpToWithdraw);
uint256 \_3crvBalanceBefore = IERC20(\_3crv).balanceOf(address(this));
IStableSwap2(pool).remove\_liquidity(\_lpToWithdraw, \_minAmounts);

```
* in the `resistantBalanceAndFei` function, the value of protocol-controlled FEI tokens and the value of 3pool tokens deposited are considered equal:


**code/contracts/pcv/curve/StableSwapOperatorV1.sol:L348-L349**



```
resistantBalance = \_lpPriceUSD / 2;
resistantFei = resistantBalance;

```


Some of these values may be equal under some circumstances, but that is not enforced. After one of the steps (deposit or withdrawal), the total PCV value and collateralization may be changed significantly.


#### Recommendation


Make sure that deposit, withdrawal, and the `resistantBalanceAndFei` are consistent and won’t instantly change the PCV value significantly.
