---
tags:
  - lang/solidity
  - sector/stable
  - sector/staking
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Zap Protocol]]"
auditors:
  - "[[bughuntoor]]"
  - "[[s1ce]]"
report: "https://github.com/sherlock-audit/2024-03-zap-protocol-judging"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# H-2: If token does not oversell, users cannot claim tax refund on their tax free allocation.

- id: 31191
- impact: HIGH
- protocol: [[Zap Protocol]]
- reporter: s1ce (Sherlock)
- source: N/A

## Summary


Bug report H-2 is about an issue in the Zap Protocol, where users may not be able to claim a tax refund on their tax free allocation if the token does not oversell. This issue was found by bughuntoor and s1ce, and it has been acknowledged by the protocol. The vulnerability is caused by an unnecessary require check in the `claim` function, which prevents users from claiming their tax refund unless the token has oversold. This means that even if a user has an infinite tax free allocation, they will not be able to claim a tax refund if the token has not oversold. The impact of this issue is a potential loss of funds for users. The bug report includes a code snippet and a discussion among developers and sponsors, where there is some confusion about the design of the system and whether the issue is valid. The recommendation is to remove the unnecessary require check. The issue has been escalated and resolved successfully. 

## Details

Source: https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/58 

The protocol has acknowledged this issue.

## Found by 
bughuntoor, s1ce
## Summary
Users may not be able to claim tax refund

## Vulnerability Detail
Within TokenSale, upon depositing users, users have to pay tax. Then, users can receive a tax-free allocation - meaning they'll be refunded the tax they've paid on part of their deposit.

The problem is that due to a unnecessary require check, users cannot claim their tax refund, unless the token has oversold. 
```solidity
 function claim() external {
        checkingEpoch();
        require(
            uint8(epoch) > 1 && !admin.blockClaim(address(this)),
            "TokenSale: Not time or not allowed"
        );

        Staked storage s = stakes[msg.sender];
        require(s.amount != 0, "TokenSale: No Deposit"); 
        require(!s.claimed, "TokenSale: Already Claimed");

        uint256 left;
        (s.share, left) = _claim(s);
        require(left > 0, "TokenSale: Nothing to claim");  // @audit - problematic line 
        uint256 refundTaxAmount;
        if (s.taxAmount > 0) {
            uint256 tax = userTaxRate(s.amount, msg.sender);
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
            } else {
                refundTaxAmount = (left * tax) / POINT_BASE; // tax refund is on the wrong amount 
            }
            usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount);
        }
        s.claimed = true;
        usdc.safeTransfer(msg.sender, left);
        emit Claim(msg.sender, left);
    }
```
```solidity

    function _claim(Staked memory _s) internal view returns (uint120, uint256) {
        uint256 left;
        if (state.totalPrivateSold > (state.totalSupplyInValue)) {
            uint256 rate = (state.totalSupplyInValue * PCT_BASE) /
                state.totalPrivateSold;
            _s.share = uint120((uint256(_s.amount) * rate) / PCT_BASE);
            left = uint256(_s.amount) - uint256(_s.share);
        } else {
            _s.share = uint120(_s.amount);
        }

        return (_s.share, left);
    }
```
`left` only has value if the token has oversold. Meaning that even if the user has an infinite tax free allocation, if the token has not oversold, they won't be able to claim a tax refund. 


## Impact
loss of funds

## Code Snippet
https://github.com/sherlock-audit/2024-03-zap-protocol/blob/main/zap-contracts-labs/contracts/TokenSale.sol#L377

## Tool used

Manual Review

## Recommendation
Remove the require check 



## Discussion

**ZdravkoHr**

Escalate

This should not be a valid issue. The idea of the `claim` function is to let investors claim the surplus amount that is left after the ICO has ended, i.e when tokens `oversell`.

```solidity
 If the the demand is higher than supply, the number of tokens investors will receive is adjusted, and then the native token used to invest are partially refunded.
```

The following claim stated in the report is also wrong: 
```Then, users can receive a tax-free allocation - meaning they'll be refunded the tax they've paid on part of their deposit.```

Tax free allocation does not mean users will pay all the taxes and will be refunded later for the tax free amount. They are just not charged for the given amount from the very beginning of the deposit process. So they should not receive any refund.

This is evident from the way the tax is calculated in[`TokenSale._processPrivate()`](https://github.com/sherlock-audit/2024-03-zap-protocol/blob/c2ad35aa844899fa24f6ed0cbfcf6c7e611b061a/zap-contracts-labs/contracts/TokenSale.sol#L231-L240)
```solidity
        if (sum > taxFreeAllcOfUser) {
            uint256 userTxRate = userTaxRate(sum, _sender);
            if (s.amount < taxFreeAllcOfUser) {
                userTaxAmount =
                    ((sum - taxFreeAllcOfUser) * userTxRate) /
                    POINT_BASE;
            } else {
                userTaxAmount = (amount * userTxRate) / POINT_BASE;
            }
        }
```

The reason why there is a tax refund logic in the `claim` function is because users that claim back `amount` of tokens will not have these tokens as deposited in the end of the ICO, therefore they should be refunded the tax they have paid for them.



**sherlock-admin2**

> Escalate
> 
> This should not be a valid issue. The idea of the `claim` function is to let investors claim the surplus amount that is left after the ICO has ended, i.e when tokens `oversell`.
> 
> ```solidity
>  If the the demand is higher than supply, the number of tokens investors will receive is adjusted, and then the native token used to invest are partially refunded.
> ```
> 
> The following claim stated in the report is also wrong: 
> ```Then, users can receive a tax-free allocation - meaning they'll be refunded the tax they've paid on part of their deposit.```
> 
> Tax free allocation does not mean users will pay all the taxes and will be refunded later for the tax free amount. They are just not charged for the given amount from the very beginning of the deposit process. So they should not receive any refund.
> 
> This is evident from the way the tax is calculated in[`TokenSale._processPrivate()`](https://github.com/sherlock-audit/2024-03-zap-protocol/blob/c2ad35aa844899fa24f6ed0cbfcf6c7e611b061a/zap-contracts-labs/contracts/TokenSale.sol#L231-L240)
> ```solidity
>         if (sum > taxFreeAllcOfUser) {
>             uint256 userTxRate = userTaxRate(sum, _sender);
>             if (s.amount < taxFreeAllcOfUser) {
>                 userTaxAmount =
>                     ((sum - taxFreeAllcOfUser) * userTxRate) /
>                     POINT_BASE;
>             } else {
>                 userTaxAmount = (amount * userTxRate) / POINT_BASE;
>             }
>         }
> ```
> 
> The reason why there is a tax refund logic in the `claim` function is because users that claim back `amount` of tokens will not have these tokens as deposited in the end of the ICO, therefore they should be refunded the tax they have paid for them.
> 
> 

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**koreanspicygarlic1**

This escalation is also plain wrong, watson has not properly understood the design of the system.

**vsharma4394**

If the above reasoning is wrong then my issue #159  which has been invalidated becomes a valid issue,so can someone escalate that too. @Hash01011122 please look into it carefully please.

**vsharma4394**

Hardcoding the value of taxfreeAllocation to zero implies that the protocol doesn't allow for taxFreeAllocation to occur as of now. So this directly implies that while claiming also taxFreeAmount should not be taken into consideration while refunding the amount to the user.


**Hash01011122**

Well I don't thoroughly understand the basis of this escalation as it is clearly mentioned in the codebase how tax system is calculated, where the tax-free allocation isn't zero. 

**vsharma4394**

@Hash01011122 the following loc in _processPrivate function which is called when user deposits usdc has caused different understanding of he code 
```solidity
 uint256 taxFreeAllcOfUser = 0; // hardcode zero - all pools have ax

        uint256 userTaxAmount;

        if (sum > taxFreeAllcOfUser) {
            uint256 userTxRate = userTaxRate(sum, _sender);
            if (s.amount < taxFreeAllcOfUser) {
                userTaxAmount =
                    ((sum - taxFreeAllcOfUser) * userTxRate) /
                    POINT_BASE;
            } else {
                userTaxAmount = (amount * userTxRate) / POINT_BASE;
            }
        }
```
Due to hardcoded value of taxFreeAllocation as zero ,user tax amount is calculated as follows
userTaxAmount = (amount * userTxRate) / POINT_BASE i.e while depositing users have to pay tax irrespective of having taxFreeAllocation. If logic is never executed. So while claiming also taxFreeAllocation should also not be taken into account so as be consistent with the code. (Making taxFreeAllocation to zero is intended design.)

I think confusion has arised from considering taxFreeAllocation but it is considered as zero from starting due to hardcoded value of taxFreeAllocation as zero.

Asking from sponsers is the best way to deal with all the issue related to claim function and tax related issue.

**ZdravkoHr**

The issue is not that tax free allocation is 0. Even if it wasn't and the firsr if was entered, the user would not have been taxed for it. That's why I believe a refund should not be made

**niketansainiantier**

we are not giving a refund for the tax if a sale does not reach the hard cap.

**vsharma4394**

@niketansainiantier so this issue should be invalid right?

**Hash01011122**

Well I agree with what @vsharma4394 has mentioned above and came to the same conclusion when I revisited codebase. @ZdravkoHr and even sponsors have confirmed this one. This is valid finding.

**vsharma4394**

@Hash01011122 i dont think that this issue is valid because @niketansainiantier clearly mentioned the following 
```we are taking the tax on the whole invested amount including all allocations, including the whitelist. So will refund the only tax on left amount(extra Amount).```
Now if token oversells tax is refunded based on the extra amount which should not consider taxFreeAllocation as said by the sponsers. Thus in claim function 
```solidity
if (s.taxAmount > 0) {
            uint256 tax = userTaxRate(s.amount, msg.sender);
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
            } else {
                refundTaxAmount = (left * tax) / POINT_BASE; // tax refund is on the wrong amount 
            }
            usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount);
        }
```
RefundTaxAmount should always be  refundTaxAmount = (left * tax) / POINT_BASE because taxFreeAlloc is hardcoded as zero initially which clearly indicates protocol doesn't allow for taxFreeAllocation as of now.

**Evert0x**

I believe the escalation should be rejected the issue should stay as is.

Users should be able to get a tax refund on their tax-free allocation. 

> **Tax free allocation does not mean users will pay all the taxes and will be refunded later for the tax free amount.** They are just not charged for the given amount from the very beginning of the deposit process. So they should not receive any refund.

This is not true, would like to see a link to a public message or to a code comment as a counter argument 

**vsharma4394**

> I believe the escalation should be rejected the issue should stay as is.
> 
> Users should be able to get a tax refund on their tax-free allocation.
> 
> > **Tax free allocation does not mean users will pay all the taxes and will be refunded later for the tax free amount.** They are just not charged for the given amount from the very beginning of the deposit process. So they should not receive any refund.
> 
> This is not true, would like to see a link to a public message or to a code comment as a counter argument

@Evert0x i agree the above reasoning is incorrect, please look at my reasoning and then decide

**Evert0x**

@vsharma4394  My understanding that the codebase is taxing all deposited and provide a tax-return on unallocated part + tax-free allocation. Which makes this issue a valid issue.

So if the token doesn't oversell, we should still take into account the tax free allocation. 

I don't understand how your previous comment provides an argument against that. 

**vsharma4394**

> @vsharma4394 My understanding that the codebase is taxing all deposited and provide a tax-return on unallocated part + tax-free allocation. Which makes this issue a valid issue.
> 
> So if the token doesn't oversell, we should still take into account the tax free allocation.
> 
> I don't understand how your previous comment provides an argument against that.

This would most probably because of the protocol design @niketansainiantier  can answer it the best. 

**Evert0x**

Result:
High
Has Duplicates

**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [ZdravkoHr](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/58/#issuecomment-2025286194): rejected
