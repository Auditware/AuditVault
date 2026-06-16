---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Napier]]"
auditors:
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-01-napier-judging"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[integer-bounds]]"
---
# H-2: YT holder are unable to claim their interest

- id: 30576
- impact: HIGH
- protocol: [[Napier]]
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue where a malicious user can prevent YT holders from claiming their interest, resulting in a loss of assets. The root cause of this issue is the ability to manipulate the "max scale" value, which is used to calculate interest accrued by users. This can be done by minting a small number of shares, transferring large amounts of assets, and triggering an update to the global scale. This manipulation locks the max scale at a large value, preventing YT holders from claiming their interest. The impact of this bug is that YT holders cannot claim their interest, leading to a loss of assets. The suggested mitigation is to mint shares in advance to prevent this type of attack. The severity of this issue was escalated from medium to high, and it was determined to be a duplicate of a similar issue. The bug report concludes by stating that the issue has been resolved.

## Details

Source: https://github.com/sherlock-audit/2024-01-napier-judging/issues/80 

The protocol has acknowledged this issue.

## Found by 
xiaoming90
## Summary

A malicious user could prevent YT holders from claiming their interest, leading to a loss of assets.

## Vulnerability Detail

The interest accrued (in target token) by a user is computed based on the following formula, where $lscale$ is the user's last scale update and $maxScale$ is the max scale observed so far. The formula is taken from [here](https://github.com/sherlock-audit/2024-01-napier/blob/main/napier-v1/src/Tranche.sol#L722):

$$
interestAccrued = y(\frac{1}{lscale} - \frac{1}{maxScale})
$$

A malicious user could perform the following steps to manipulate the $maxScale$ to a large value to prevent YT holders from claiming their interest.

1) When the Tranche and Adaptor are deployed, immediately mint the smallest possible number of shares. Attackers can do so by calling the Adaptor's `prefundedDeposit` function directly if they want to avoid issuance fees OR call the `Tranche.issue` function
2) Transfer large amounts of assets to the Adaptor directly. With a small amount of total supply and a large amount of total assets, the Adaptor's scale will be extremely large. Let the large scale at this point be $L$.
3) Trigger any function that will trigger an update to the global scale. The max scale will be updated to $L$ and locked at this large scale throughout the entire lifecycle of the Tranche, as it is not possible for the scale to exceed $L$ based on the current market yield or condition.
4) Attacker withdraws all their shares and assets via Adaptor's `prefundedDeposit` function or Tranche's redeem functions. Note that the attacker will not incur any fees during withdrawal. Thus, this attack is economically cheap and easy to execute.
5) After the attacker's withdrawal, the current scale of the adapter will revert back to normal (e.g. 1.0 exchange rate), and the scale will only increase due to the yield from staked ETH (e.g. daily rebase) and increase progressively (e.g., 1.0 > 1.05 > 1.10 > 1.15)

When a user issues/mints new PT and YT, their `lscales[user]` will be set to the $maxScale$, which is $L$. 

A user's `lscales[user]` will only be updated if the adaptor's current scale is larger than $L$. As stated earlier, it is not possible for the scale to exceed $L$ based on the current market yield or condition. Thus, the user's `lscales[user]` will be stuck at $L$ throughout the entire lifecycle of the Tranche.

As a result, there is no way for the YT holder to claim their interest because, since $lscale == maxScale$, the interest accrued computed from the formula will always be zero. Thus, even if the Tranche/Adaptor started gaining yield from staked ETH, there is no way for YT holders to claim that.

## Impact

YT holders cannot claim their interest, leading to a loss of assets.

## Code Snippet

https://github.com/sherlock-audit/2024-01-napier/blob/main/napier-v1/src/Tranche.sol#L704

## Tool used

Manual Review

## Recommendation

Ensure that the YT holders can continue to claim their accrued interest earned within the Tranche/Adaptor regardless of the max scale.



## Discussion

**nevillehuang**

Escalate

Duplicate of #92, exact same root cause, involving manipulations of maxScales

**sherlock-admin2**

> Escalate
> 
> Duplicate of #92, exact same root cause, involving manipulations of maxScales

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**massun-onibakuchi**

Escalate
@nevillehuang  
This issue should be lower. I think this is duplicate of #125.
As you say,  the root cause is that scale can be manipulated, which is mainly based on a kind of inflation attack. This attack assume an attacker is able to be the first depositor to manipulate rate effectively. Also at that time, basically no one has not issued any PT/YT. Even if someone mints some PT/YT, they can redeem them by burning together (`redeemWithYt`) with minimum issuance fee loss.  This issue can be easily prevented by minting some shares earlier than a attacker in the same way as well-known inflation attack.

**nevillehuang**

@massun-onibakuchi In that case, I think medium severity is appropriate for this issue and #92, which should be duplicated together. 

**xiaoming9090**

The sponsor mentioned that the mitigation would be to mint some shares in advance to prevent the well-known inflation attack. I agree with the sponsor that this is the correct approach to fix the issue.

However, the mitigation of minting some shares in advance to prevent this issue was not documented in the contest’s README. Thus, the issue remains valid and as it is, as mitigation cannot be applied retrospectively after the contest. Otherwise, it would be unfair to the Watsons to raise an issue that only gets invalid by a mitigation shared after the contest/audit.

**xiaoming9090**

> Escalate @nevillehuang This issue should be lower. I think this is duplicate of #125. As you say, the root cause is that scale can be manipulated, which is mainly based on a kind of inflation attack. This attack assume an attacker is able to be the first depositor to manipulate rate effectively. Also at that time, basically no one has not issued any PT/YT. Even if someone mints some PT/YT, they can redeem them by burning together (`redeemWithYt`) with minimum issuance fee loss. This issue can be easily prevented by minting some shares earlier than a attacker in the same way as well-known inflation attack.

Disagree that this issue should be duplicated with Issue https://github.com/sherlock-audit/2024-01-napier-judging/issues/125.

Issue https://github.com/sherlock-audit/2024-01-napier-judging/issues/125 (and its duplicate https://github.com/sherlock-audit/2024-01-napier-judging/issues/94, which has a better write-up of the issue) discusses the classic vault inflation attack. This attack exploits the rounding error and exchange rate manipulation to steal from the victim depositor. It is a well-known attack that everyone is aware of.

This issue concerns manipulating the max scale by malicious users, which has prevented the YT holders from claiming their interest. This is a more complex issue and only specific to the Naiper protocol.

Thus, these two are different issues, and we should be careful not to overgeneralize all issues under the same category (e.g., re-entrancy, manipulation, access control) as one single issue without considering the details.



**xiaoming9090**

Escalate

This issue should be a High risk instead of Medium as this issue prevents YT holders from claiming their interest, leading to a loss of assets.

**sherlock-admin2**

> Escalate
> 
> This issue should be a High risk instead of Medium as this issue prevents YT holders from claiming their interest, leading to a loss of assets.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**cvetanovv**

First, I disagree with the sponsor that this should be Low severity and a duplicate of the #125.

 As I wrote in other reports, this "inflation attack" is not documented as a known issue. 

I agree with the escalations of @xiaoming9090 and @nevillehuang. This issue has the same root cause as #92 and can be duplicated as a valid High.

**Czar102**

After some considerations, I think duplicating this issue with #92 makes sense by claiming that both of these are sourced in the ability to manipulate the scale by donations.

Please note that this doesn't mean that all "inflation attacks" are considered of the same root cause.

**Czar102**

Result:
High
Duplicate of #92

Accepting only the first escalation since it was the first accurate one.


**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [nevillehuang](https://github.com/sherlock-audit/2024-01-napier-judging/issues/80/#issuecomment-1984771258): accepted
- [xiaoming9090](https://github.com/sherlock-audit/2024-01-napier-judging/issues/80/#issuecomment-1987104210): rejected
