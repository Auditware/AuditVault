---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - severity/high
  - precondition/uninitialized
  - fix/use-reentrancy-guard
protocol: "[[Iron Bank]]"
auditors:
  - "[[CMierez]]"
report: "https://github.com/sherlock-audit/2023-05-ironbank-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[data/uninitialized]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[initializer-auth]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# H-1: supplyNativeToken will strand ETH in contract if called after ACTION_DEFER_LIQUIDITY_CHECK

- id: 19169
- impact: HIGH
- protocol: [[Iron Bank]]
- reporter: CMierez (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability in the IronBank protocol where ETH can be stranded in the contract if the function supplyNativeToken is called after the function ACTION_DEFER_LIQUIDITY_CHECK. This is because when the IronBank makes a callback to the TxBuilderExtension, it creates a new context in which msg.value is always 0. Since the ETH is not sent along to this new context, msg.value will always be 0, resulting in no ETH being deposited and the sent ether being left in the contract. 

This can cause the user to be unfairly liquidated in the meantime since a (potentially significant) portion of their collateral hasn't been deposited. Additionally, if the ownable feature is not initialized correctly, the funds would be completely unrecoverable due to lack of owner.

The vulnerability was found by 0x52, CMierez, and evilakela while manual reviewing the code. The code snippet in question is located at TxBuilderExtension.sol#L252-L256. To fix the issue, it is suggested to cache msg.value as an internal storage variable at the beginning of the function and adjust supplyNativeToken to use that storage variable rather than msg.value. 

The severity of the issue was initially escalated to 10 USDC, but was later rejected. The issue was then maintained as a High severity. The fix for the issue is located at https://github.com/ibdotxyz/ib-v2/pull/53.

## Details

Source: https://github.com/sherlock-audit/2023-05-ironbank-judging/issues/361 

## Found by 
0x52, CMierez, evilakela
## Summary

supplyNativeToken deposits msg.value to the WETH contract. This is very problematic if it is called after ACTION_DEFER_LIQUIDITY_CHECK. Since onDeferredLiqudityCheck creates a new context msg.value will be 0 and no ETH will actually be deposited for the user, causing funds to be stranded in the contract. 

## Vulnerability Detail

[TxBuilderExtension.sol#L252-L256](https://github.com/sherlock-audit/2023-05-ironbank/blob/main/ib-v2/src/extensions/TxBuilderExtension.sol#L252-L256)

    function supplyNativeToken(address user) internal nonReentrant {
        WethInterface(weth).deposit{value: msg.value}();
        IERC20(weth).safeIncreaseAllowance(address(ironBank), msg.value);
        ironBank.supply(address(this), user, weth, msg.value);
    }

supplyNativeToken uses the context sensitive msg.value to determine how much ETH to send to convert to WETH. After ACTION_DEFER_LIQUIDITY_CHECK is called, it enters a new context in which msg.value is always 0. We can outline the execution path to see where this happens:

`execute > executeInteral > deferLiquidityCheck > ironBank.deferLiquidityCheck > onDeferredLiquidityCheck (new context) > executeInternal > supplyNativeToken`

When IronBank makes it's callback to TxBuilderExtension it creates a new context. Since the ETH is not sent along to this new context, msg.value will always be 0. Which will result in no ETH being deposited and the sent ether is left in the contract.

Although these funds can be recovered by the admin, it may can easily cause the user to be unfairly liquidated in the meantime since a (potentially significant) portion of their collateral hasn't been deposited. Additionally in conjunction with my other submission on ownable not being initialized correctly, the funds would be completely unrecoverable due to lack of owner.

## Impact

User funds are indefinitely (potentially permanently) stuck in the contract. Users may be unfairly liquidated due to their collateral not depositing.

## Code Snippet

[TxBuilderExtension.sol#L252-L256](https://github.com/sherlock-audit/2023-05-ironbank/blob/main/ib-v2/src/extensions/TxBuilderExtension.sol#L252-L256)

## Tool used

Manual Review

## Recommendation

msg.value should be cached at the beginning of the function to preserve it across contexts



## Discussion

**ibsunhub**

Confirm the issue!

However, we believe the correct modification is to pass `msg.value` through the whole external call and make `deferLiquidityCheck` function payable.

**0xffff11**

Valid high. I also think the fix from sponsor is most accurate.

**IAm0x52**

Passing through `msg.value` will result in it being nonfunctional in the event that `supplyNativeToken` is called before `ACTION_DEFER_LIQUIDITY_CHECK` since it will deposit msg.value into WETH. Then when it calls `deferLiquidityCheck` it would again attempt to send `msg.value` which would cause it to revert due to lack of funds. 

My suggestion would be to cache msg.value as an internal storage variable (i.e. _msgValue) at the beginning of [execute](https://github.com/sherlock-audit/2023-05-ironbank/blob/9ebf1702b2163b55479624794ab7999392367d2a/ib-v2/src/extensions/TxBuilderExtension.sol#L101). Adjust [supplyNativeToken](https://github.com/sherlock-audit/2023-05-ironbank/blob/9ebf1702b2163b55479624794ab7999392367d2a/ib-v2/src/extensions/TxBuilderExtension.sol#L253-L255) to use that storage variable rather than `msg.value`. After the supply to ironBank reset this variable to 0. This allows you to preserve the msg.value across all contexts

**ibsunhub**

The situation mentioned is same with #192.
The solution sounds viable and better. Will work on a fix according to the recommendation.

**0xffff11**

@ibsunhub  You mean that #192 should be a dup of this one?

**ibsunhub**

No, just think they are related.

**iamjakethehuman**

Escalate for 10 USDC
I believe this issue to be of Medium Severity. Here's why:
1.  It is valid for one asset only (ETH)
2.  It requires to call two specific operations and in a specific order in order for the issue to occur
3. The lost ETH can be rescued by the owner of the protocol (we do not take into consideration there is a vulnerability the eth can be stolen by adversary as the Watson has both not mentioned it, nor reported it separately)
4. The biggest loss that can occur is getting liquidated. This would be the case if the user has no more assets to still supply their account. And even if liquidation is to occur, in worst case scenario, they'd lose up to just 20% of their portfolio in IronBank (max liquidation bonus = 125%, `(125-100)/125 = 20%`.
With all these external factors, considering in many cases there would be no loss of funds whatsoever and just in a tiny bit of them there would be a loss of 20%, I believe this to be of Medium severity.


**sherlock-admin**

 > Escalate for 10 USDC
> I believe this issue to be of Medium Severity. Here's why:
> 1.  It is valid for one asset only (ETH)
> 2.  It requires to call two specific operations and in a specific order in order for the issue to occur
> 3. The lost ETH can be rescued by the owner of the protocol (we do not take into consideration there is a vulnerability the eth can be stolen by adversary as the Watson has both not mentioned it, nor reported it separately)
> 4. The biggest loss that can occur is getting liquidated. This would be the case if the user has no more assets to still supply their account. And even if liquidation is to occur, in worst case scenario, they'd lose up to just 20% of their portfolio in IronBank (max liquidation bonus = 125%, `(125-100)/125 = 20%`.
> With all these external factors, considering in many cases there would be no loss of funds whatsoever and just in a tiny bit of them there would be a loss of 20%, I believe this to be of Medium severity.
> 

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**ibsunhub**

> The situation mentioned is same with #192. The solution sounds viable and better. Will work on a fix according to the recommendation.

Sorry, I mean #198 related to this issue, not #192 .

**C-Mierez**

My two cents on iamjakethehuman 's escalation.
> 2. It requires to call two specific operations and in a specific order in order for the issue to occur

I would argue that this set of actions is not "too" specific. Deferring liquidity is done to avoid wasting gas by executing `IronBank#_getAccountLiquidity()` multiple times, so you always want to call this at the beginning before performing all other actions (This behaviour/order can even be seen in [`TestTxBuilderExtension_integration.t.sol`](https://github.com/sherlock-audit/2023-05-ironbank-C-Mierez/blob/16ca5d48b856d51bea17cd23dd4161bb2c7470b4/ib-v2/test/extensions/TestTxBuilderExtension_integration.t.sol#L558-L562) as well). Thus having `ACTION_DEFER_LIQUIDITY_CHECK` before any of the problematic `ACTION_X_NATIVE_TOKEN` actions is not far fetched at all, imo.

> 3. The lost ETH can be rescued by the owner of the protocol (we do not take into consideration there is a vulnerability the eth can be stolen by adversary as the Watson has both not mentioned it, nor reported it separately)

I explored this possibility in my own report (#368 ), and I don't think we should just ignore the fact that the ETH stuck in the contract can be stolen. If the ETH were safe then this would just be an inconvenience until the owner comes in, but both facts together create a vector in which the user ***can*** lose their funds without virtually any cost or risk on the malicious actor's side, all due to this implementation flaw on `TxBuilderExtender`

**ib-tycho**

https://github.com/ibdotxyz/ib-v2/pull/53

**0xffff11**

Thanks for both comments. Imo this issue should be high. I agree, that it is quite likely for it to happen. 

'''
Deferring liquidity is done to avoid wasting gas by executing IronBank#_getAccountLiquidity() multiple times, so you always want to call this at the beginning before performing all other actions (This behaviour/order can even be seen in [TestTxBuilderExtension_integration.t.sol](https://github.com/sherlock-audit/2023-05-ironbank-C-Mierez/blob/16ca5d48b856d51bea17cd23dd4161bb2c7470b4/ib-v2/test/extensions/TestTxBuilderExtension_integration.t.sol#L558-L562) as well).
'''
Sponsor has also confirmed. This being said, to fully tie together the eth reports, the issue https://github.com/sherlock-audit/2023-05-ironbank-judging/issues/198 should now be valid imo as a medium. Because eth can in fact get stuck in the contract. So I would say, for this issue, keep it as a high and upgrade https://github.com/sherlock-audit/2023-05-ironbank-judging/issues/198 to medium

**ibsunhub**

fix: https://github.com/ibdotxyz/ib-v2/pull/53

**hrishibhat**

Result:
High
Has duplicates
Affecting only one token can still be a valid high, the given order of operations is not an unlikely scenario. And since this break the assumption of these contracts should not hold eth + it can be stolen as shown in #368,
Maintaining the severity as is. 

**sherlock-admin**

Escalations have been resolved successfully!

Escalation status:
- [iamjakethehuman](https://github.com/sherlock-audit/2023-05-ironbank-judging/issues/361/#issuecomment-1608985592): rejected
