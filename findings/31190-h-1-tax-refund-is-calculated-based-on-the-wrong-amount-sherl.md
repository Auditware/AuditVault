---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/stable
  - sector/staking
protocol: "[[Zap Protocol]]"
auditors:
  - "[[Krace]]"
  - "[[bughuntoor]]"
  - "[[s1ce]]"
  - "[[ydlee]]"
report: "https://github.com/sherlock-audit/2024-03-zap-protocol-judging"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# H-1: Tax refund is calculated based on the wrong amount

- id: 31190
- impact: HIGH
- protocol: [[Zap Protocol]]
- reporter: ydlee (Sherlock)
- source: N/A

## Summary


The tax refund feature in the Zap Protocol is not working properly. After the private period ends, users can claim a tax refund based on their max tax-free allocation. However, if the user's share is greater than their tax-free allocation, the tax refund is calculated incorrectly. This means that users are not being refunded enough tax. The code should be changed to correctly calculate the tax refund by taking into account both the unused USDC amount and the user's tax-free allocation. There was some discussion about whether or not the tax-free allocation should be considered when calculating the tax refund, but ultimately it was decided that it should not be. The issue has been escalated and resolved by the protocol's team. 

## Details

Source: https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/57 

The protocol has acknowledged this issue.

## Found by 
Krace, bughuntoor, s1ce, ydlee
## Summary
Tax refund is calculated based on the wrong amount

## Vulnerability Detail
After the private period has finished, users can claim a tax refund, based on their max tax free allocation.
```solidity
        (s.share, left) = _claim(s);
        require(left > 0, "TokenSale: Nothing to claim");
        uint256 refundTaxAmount;
        if (s.taxAmount > 0) {
            uint256 tax = userTaxRate(s.amount, msg.sender);
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
            } else {
                refundTaxAmount = (left * tax) / POINT_BASE;
            }
            usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount);
        }
```
The problem is that in case `s.share > taxFreeAllc`, the tax refund is calculated wrongfully. Not only it should refund the tax on the unused USDC amount, but it should also refund the tax for the tax-free allocation the user has. 

Imagine the following. 
1. User deposits 1000 USDC.
2. Private period finishes, token oversells. Only half of the user's money actually go towards the sell (s.share = 500 USDC, s.left = 500 USDC)
3. The user has 400 USDC tax-free allocation
4. The user must be refunded the tax for the 500 unused USDC, as well as their 400 USDC tax-free allocation. In stead, they're only refunded for the 500 unused USDC. (note, if the user had 500 tax-free allocation, they would've been refunded all tax)


## Impact
Users are not refunded enough tax 

## Code Snippet
https://github.com/sherlock-audit/2024-03-zap-protocol/blob/main/zap-contracts-labs/contracts/TokenSale.sol#L385

## Tool used

Manual Review

## Recommendation
change the code to the following: 
```solidity
                refundTaxAmount = ((left + taxFreeAllc) * tax) / POINT_BASE;
```



## Discussion

**ZdravkoHr**

Escalate 

Users are not supposed to be refunded for the tax free allocation, same reasoning as in [58](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/58#issuecomment-2025286194).

**sherlock-admin2**

> Escalate 
> 
> Users are not supposed to be refunded for the tax free allocation, same reasoning as in [58](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/58#issuecomment-2025286194).

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**koreanspicygarlic1**

escalation by watson is plain wrong. Users have taxfree allocation for which their tax should be refunded. The total refund should be for the taxfree allocation + tax on unused funds (s.left)

**ZdravkoHr**

@koreanspicygarlic1, users are not paying tax for the tax free allocation when depositing. What should they be refunded for then?

**merc1995**

@ZdravkoHr , users pay tax for the tax-free allocation when depositing because the `taxFreeAllcOfUser` is zero, as I mentioned in #7 .

**vsharma4394**

@merc1995 initially there is no tax free allocation so why should tax free amount be taken into consideration when claim function is called. The tax amount refunded to the user should be calculated for the left amount only i.e not taking into consideration the tax free amount. Otherwise every user would purposely make totalPrivateSold > totalSupplyValue so that they can avoid the tax.


**merc1995**

@vsharma4394 because the code says it should consider the tax free.

```
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
        require(left > 0, "TokenSale: Nothing to claim");
        uint256 refundTaxAmount;
        if (s.taxAmount > 0) {
            uint256 tax = userTaxRate(s.amount, msg.sender);
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE; //==> tax free 
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
            } else {
                refundTaxAmount = (left * tax) / POINT_BASE;
            }
            usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount);
        }
        s.claimed = true;
        usdc.safeTransfer(msg.sender, left);
        emit Claim(msg.sender, left);
    }
```

**ZdravkoHr**

@merc1995, that's because if the taxFree was set to 500 for example amd I deposit 600, the claim function should consider this and let me claim tax for only 100 (assumung I can claim 100%, which of course is not true, but makes the example more simple)

**merc1995**

The code use `left` rather than `s.shrare - taxFree` to calculate the `refundAmount`. According to your comment, this issue is valid because of the wrong implementation.

**merc1995**

> The tax amount refunded to the user should be calculated for the left amount only i.e not taking into consideration the tax free amount
@vsharma4394 
Could you please provide the doc which said that the tax free amount should not be taken into consideration?

**vsharma4394**

@merc1995 It is clear from the deposit function (which calls the _processPrivate function) that currently they don't allow tax free allocation. 

**merc1995**

So there should be no tax-free releated code in the `claim`, and this issue should be valid?

**vsharma4394**

I agree that there should not be tax free related code and refundTaxAmount should only be equal to (left * tax) / POINT_BASE.

**vsharma4394**

I don't agree with the following lines as stated in the vulnerability detail that 
The problem is that in case s.share > taxFreeAllc, the tax refund is calculated wrongfully. Not only it should refund the tax on the unused USDC amount, but it should also refund the tax for the tax-free allocation the user has.
They should never refund tax for the tax Free allocation because while calling deposit taxFreeAllocation was set to zero.

**vsharma4394**

According to me there is a logic error in the code where they first don't take into account taxFreeAllocation but they do so in claim function due to which there has been lot of miss interpretation of the code.

**Hash01011122**

I missed the part where user is not supposed to be refunded for tax free allocation, it would be better if someone with deeper knowledge of protocol can shed some light on taxFreeAllocation concept. Requesting insight from someone with deeper knowledge of the protocol is a prudent step. @ZdravkoHr  @deadrosesxyz ??

**ZdravkoHr**

@Hash01011122, if you look at TokenSale.processPrivate and assume the tax free amount is set to an extremely large number, the if statement where the actual tax transfer happens will never be entered. 

So the tax free allocation is tax-free because users don't pay for it from the very beginning. That's why a refund is not needed.

**spacegliderrrr**

@Hash01011122 When users deposit, they always have to pay tax. The users then have a tax-free allocation. Meaning, that for this amount, they don't have to pay tax and they'll be refunded for it. 

Tax refund must always be for the tax on their tax-free allocation.+ the tax on their unused funds (s.left)

**niketansainiantier**

we are taking the tax on the whole invested amount including all allocations, including the whitelist. So will refund the only tax on left amount(extra Amount). 

**deadrosesxyz**

@niketansainiantier if this was the case, then what is the purpose of `_maxTaxfreeAllocation` and the following lines of code? Why would they refund the whole tax amount if it was always intended to refund only based on the left/extra amount. What you've said simply contradicts the code.

```solidity
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
```

**Hash01011122**

Highlighting the specific [code line](https://github.com/sherlock-audit/2024-03-zap-protocol/blob/c2ad35aa844899fa24f6ed0cbfcf6c7e611b061a/zap-contracts-labs/contracts/TokenSale.sol#L227C1-L228C1) where `taxFreeAllocOfUser` is hardcoded to zero implies that users are indeed intended to be processed for a tax refund according to the protocol's logic. Let me know if I am getting anything wrong here @ZdravkoHr 

**vsharma4394**

@Hash01011122  the following is said by @niketansainiantier
``` we are taking the tax on the whole invested amount including all allocations, including the whitelist. So will refund the only tax on left amount(extra Amount).```
 Due to this users are only refunded on the left amount i.e not considering the tax free allocation. While depositing also taxFreeAllocation was not considered as taxFreeAllocOfUser is equal to zero so it should also not be considered while calling claim function.

I think you have misunderstood the code ,```taxfreeAllocOfUser``` is hardcoded to zero implies that users are processed tax on whole amount neglecting the tax free amount.So as now tax free amount is not taken into consideration , it should not be taken into account while calling claim function. 

**vsharma4394**

I think sponsers have also added the won't fix tag because it is intended behaviour to refund tax only on left amount. As initially also taxFreeAlloc was taken as zero. Thus making this finding as invalid.

**ZdravkoHr**

@vsharma4394 is right imo. There is a comment next to taxAlloc = 0 that says that all pools have tax

**vsharma4394**

> @vsharma4394 is right imo. There is a comment next to taxAlloc = 0 that says that all pools have tax

Yes,there has been a lot of misunderstanding because people have not understood wwhat taxAlloc = 0 means.

**vsharma4394**

> @niketansainiantier if this was the case, then what is the purpose of `_maxTaxfreeAllocation` and the following lines of code? Why would they refund the whole tax amount if it was always intended to refund only based on the left/extra amount. What you've said simply contradicts the code.
> 
> ```solidity
>             uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
>             if (taxFreeAllc >= s.share) {
>                 refundTaxAmount = s.taxAmount;
> ```

Again this is because they have taken taxFreeAlloc = 0. Hence this issue is invalid.

**niketansainiantier**

Yes, that's why I changed the logic here. 

` uint256 left;
        (s.share, left) = _claim(s);
        require(left > 0, "TokenSale: Nothing to claim");
        uint256 refundTaxAmount;
        if (s.taxAmount > 0) {
            uint256 tax = userTaxRate(s.amount, msg.sender);
            refundTaxAmount = (left * tax) / POINT_BASE;
            usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount);
        }`
       You guys can check this on 2nd PR

**vsharma4394**

> Yes, that's why I changed the logic here.
> 
> ` uint256 left; (s.share, left) = _claim(s); require(left > 0, "TokenSale: Nothing to claim"); uint256 refundTaxAmount; if (s.taxAmount > 0) { uint256 tax = userTaxRate(s.amount, msg.sender); refundTaxAmount = (left * tax) / POINT_BASE; usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount); }` You guys can check this on 2nd PR

@Hash01011122 now things should be very clear. This issue should be invalid and #159 should be a valid unique finding.Also #58 should also be invalid.

**ZdravkoHr**

[131](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/131) is also a dup of 159

**Hash01011122**

Seems logical enough, @vsharma4394 thanks for clearing the misunderstanding regarding `taxfreeAllocOfUser` I am inclined towards invalidating this issue. @deadrosesxyz Your input would be appreciated.

**deadrosesxyz**

@Hash01011122 The other watson simply assumes that `_maxTaxFreeAllocation` is always going to return 0. They assume the logic here, including the call to the staking contract, the tokensale tiers will all return 0 for whatever reason. There's contract logic based on the calculated `taxFreeAllc` and logic to calculate its value. `taxFreeAllc ` always having a value of 0 is not enforced anywhere, hence cannot be expected this would be the case (in fact it's just the opposite considering the function designed to calculate it). I'd politely ask other watsons to refrain from making any more comments. I believe everyone has made their point clear and it's simply time to wait for judge's decision.
```solidity
            uint256 taxFreeAllc = _maxTaxfreeAllocation(msg.sender) * PCT_BASE;
            if (taxFreeAllc >= s.share) {
                refundTaxAmount = s.taxAmount;
```
```solidity
    function _maxTaxfreeAllocation(address _sender) internal returns (uint256) {
        uint256 userTierAllc = stakingContract.getAllocationOf(_sender);
        uint256 giftedTierAllc = tokensaleTiers[_sender];

        if (userTierAllc > giftedTierAllc) {
            return userTierAllc;
        } else {
            return giftedTierAllc;
        }
    }
```


**Hash01011122**

Even I thought the same when I first looked at `taxFreeAllc` in codebase, but after @niketansainiantier cleared that this is not the case. Just want to know whether this was mentioned in by the sponsors at the time of contest. If nothing was mentioned this should remain a valid issue.

**Evert0x**

Planning to reject escalation and keep issue as is. 


**vsharma4394**

> Yes, that's why I changed the logic here.
> 
> ` uint256 left; (s.share, left) = _claim(s); require(left > 0, "TokenSale: Nothing to claim"); uint256 refundTaxAmount; if (s.taxAmount > 0) { uint256 tax = userTaxRate(s.amount, msg.sender); refundTaxAmount = (left * tax) / POINT_BASE; usdc.safeTransferFrom(marketingWallet, msg.sender, refundTaxAmount); }` You guys can check this on 2nd PR

@Evert0x see here the changed code by sponsers now tax amount which is returned is only calculated on the left amount excluding tax free allocation because which is contradiction to this finding, so doesn't that make this finding invalid. 

**vsharma4394**

@Evert0x In the following loc 
https://github.com/sherlock-audit/2024-03-zap-protocol/blob/c2ad35aa844899fa24f6ed0cbfcf6c7e611b061a/zap-contracts-labs/contracts/TokenSale.sol#L227
It is clearly commented that tax is charged for every pool, i.e the tax free calculation is not done so it doesn't makes sense that they would refund the tax on tax free allocation and similarly the protocol doesn't wishes to take into account tax free allocation while calling claim function that is why they changed the code in latest pr.Now its best you ask the sponsers and take your decision.
Sponsers have made that change by looking at #159 so asking sponsers would definitely resolve that issue too.

**Evert0x**

Result:
High
Has Duplicates

**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [ZdravkoHr](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/57/#issuecomment-2025488727): rejected
