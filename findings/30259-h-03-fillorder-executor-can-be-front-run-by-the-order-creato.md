---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[INIT Capital]]"
auditors:
  - "[[Said]]"
report: "https://code4rena.com/reports/2024-01-init-capital-invitational"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-03] `fillOrder` executor can be front-run by the order creator by changing order's `limitPrice_e36`, the executor's assets can be stolen

- id: 30259
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: said (Code4rena)
- source: https://code4rena.com/reports/2024-01-init-capital-invitational

## Summary


The bug report discusses a potential vulnerability in the code for a margin trading platform. The code relies heavily on a variable called `limitPrice_e36` to calculate the amount of tokens that need to be transferred to the order creator. However, a malicious order creator can manipulate this variable and steal tokens from the executor. The report recommends adding a check for `limitPrice_e36` within the code to prevent this from happening. The team has acknowledged the issue and plans to change the logic to cancel and create a new order instead of modifying the existing one. 

## Details


<https://github.com/code-423n4/2024-01-init-capital-invitational/blob/main/contracts/hook/MarginTradingHook.sol#L539-L563> 

<https://github.com/code-423n4/2024-01-init-capital-invitational/blob/main/contracts/hook/MarginTradingHook.sol#L387>

`limitPrice_e36` acts as slippage protection for the order creator, depending on the trade/order position (whether long or short). A higher or lower limit price impacts the `tokenOut` amount that needs to be transferred to the order's creator. However, when the executor executes `fillOrder`, it can be front-run by the order creator to update `limitPrice_e36` and steal tokens from the executor.

### Proof of Concept

When `fillOrder` is executed, it will calculate the `amtOut` that needs to be transferred to `order.recipient` by calling `_calculateFillOrderInfo`.

<https://github.com/code-423n4/2024-01-init-capital-invitational/blob/main/contracts/hook/MarginTradingHook.sol#L532-L564>

```solidity
    function _calculateFillOrderInfo(Order memory _order, MarginPos memory _marginPos, address _collToken)
        internal
        returns (uint amtOut, uint repayShares, uint repayAmt)
    {
        (repayShares, repayAmt) = _calculateRepaySize(_order, _marginPos);
        uint collTokenAmt = ILendingPool(_marginPos.collPool).toAmtCurrent(_order.collAmt);
        // NOTE: all roundings favor the order owner (amtOut)
        if (_collToken == _order.tokenOut) {
            if (_marginPos.isLongBaseAsset) {
                // long eth hold eth
                // (2 * 1500 - 1500) = 1500 / 1500 = 1 eth
                // ((c * limit - borrow) / limit
>>>             amtOut = collTokenAmt - repayAmt * ONE_E36 / _order.limitPrice_e36;
            } else {
                // short eth hold usdc
                // 2000 - 1 * 1500 = 500 usdc
                // (c - borrow * limit)
>>>             amtOut = collTokenAmt - (repayAmt * _order.limitPrice_e36 / ONE_E36);
            }
        } else {
            if (_marginPos.isLongBaseAsset) {
                // long eth hold usdc
                // (2 * 1500 - 1500) = 1500 usdc
                // ((c * limit - borrow)
>>>             amtOut = (collTokenAmt * _order.limitPrice_e36).ceilDiv(ONE_E36) - repayAmt;
            } else {
                // short eth hold eth
                // (3000 - 1 * 1500) / 1500 = 1 eth
                // (c - borrow * limit) / limit
>>>             amtOut = (collTokenAmt * ONE_E36).ceilDiv(_order.limitPrice_e36) - repayAmt;
            }
        }
    }
```

As can be observed, it heavily relies on `limitPrice_e36` to calculate `amtOut`. A malicious order creator can front-run the execution of `fillOrder` and steal assets from the executor by changing `limitPrice_e36`, resulting in a high value of `amtOut` depending on the order's position.

### Recommended Mitigation Steps

Consider to add `limitPrice_e36` check inside the `fillOrder` if it bigger than min/max provided limit price, revert the operation.

**[fez-init (INIT) confirmed and commented](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/22#issuecomment-1929035101):**
 > We will change the `updateOrder` logic to cancel and create a new order instead of modifying the existing order instead.

***
