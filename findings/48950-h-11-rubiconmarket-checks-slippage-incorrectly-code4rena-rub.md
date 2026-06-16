---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/token
protocol: "[[Rubicon]]"
auditors:
  - "[[zhuXKET]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [H-11] `RubiconMarket` checks slippage incorrectly

- id: 48950
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: zhuXKET (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


The RubiconMarket contract has a function called `sellAllAmount` that allows users to sell a specific amount of one token for another. However, there is a bug in the code that can cause users to lose funds. The function has a parameter called `min_fill_amount` that is meant to limit the minimum amount of the second token that the user wants to receive. However, the code checks for slippage (difference between expected and actual price) before removing fees, which means that the user may not receive the expected amount even if they provide a `min_fill_amount`. The same issue also exists in the `buyAllAmount` function. To fix this, the code should first calculate the amount without fees and then check for slippage. The Rubicon team has confirmed the bug and is working on a solution. 

## Details


`RubiconMarket` checks slippage incorrectly, user can loose funds because of that.

### Proof of Concept

`RubiconMarket.sellAllAmount` function has price protection. User should provide `min_fill_amount` param to that function in order to limit minimum amount they would like to receive.
<br><https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L1028-L1067>

```solidity
    function sellAllAmount(
        ERC20 pay_gem,
        uint256 pay_amt,
        ERC20 buy_gem,
        uint256 min_fill_amount
    ) external returns (uint256 fill_amt) {
        require(!locked);


        uint256 offerId;
        while (pay_amt > 0) {
            //while there is amount to sell
            offerId = getBestOffer(buy_gem, pay_gem); //Get the best offer for the token pair
            require(offerId != 0, "0 offerId"); //Fails if there are not more offers


            // There is a chance that pay_amt is smaller than 1 wei of the other token
            if (
                mul(pay_amt, 1 ether) <
                wdiv(offers[offerId].buy_amt, offers[offerId].pay_amt)
            ) {
                break; //We consider that all amount is sold
            }
            if (pay_amt >= offers[offerId].buy_amt) {
                //If amount to sell is higher or equal than current offer amount to buy
                fill_amt = add(fill_amt, offers[offerId].pay_amt); //Add amount bought to acumulator
                pay_amt = sub(pay_amt, offers[offerId].buy_amt); //Decrease amount to sell
                take(bytes32(offerId), uint128(offers[offerId].pay_amt)); //We take the whole offer
            } else {
                // if lower
                uint256 baux = rmul(
                    mul(pay_amt, 10 ** 9),
                    rdiv(offers[offerId].pay_amt, offers[offerId].buy_amt)
                ) / 10 ** 9;
                fill_amt = add(fill_amt, baux); //Add amount bought to acumulator
                take(bytes32(offerId), uint128(baux)); //We take the portion of the offer that we need
                pay_amt = 0; //All amount is sold
            }
        }
        require(fill_amt >= min_fill_amount, "min_fill_amount isn't filled");
        fill_amt = calcAmountAfterFee(fill_amt);
    }
```

When order is filling in this function, the full [offer amount is added](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L1051) to `fill_amt` param.
`fill_amt` is the filled amount without fees. Fees [will be decreased](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L1066) in the end of function.
But slippage [is checked before](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L1065) fees are removed.

This is incorrect, as user will provide `min_fill_amount` that they want to receive after all fees.

The same problem exists for `RubiconMarket.buyAllAmount`.

### Tools Used

VsCode

### Recommended Mitigation Steps

First calculate amount without fees, then check slippage:

```solidity
fill_amt = calcAmountAfterFee(fill_amt);
require(fill_amt >= min_fill_amount, "min_fill_amount isn't filled");
```

**[bghughes (Rubicon) confirmed and commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/666#issuecomment-1535429281):**
 > Thanks - we messed up some of the fee logic in this build and are keyed in on a robust solution.
> 
> For this, we will simply remove `fill_amt = calcAmountAfterFee(fill_amt);` and extrapolate fees to view function level, keeping them only present in `buy`,  `getPayAmountWithFee` and `getBuyAmountWithFee`.

***
