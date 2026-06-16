---
tags:
  - lang/solidity
  - sector/governance
  - sector/streaming
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Zap Protocol]]"
auditors:
  - "[[0x4non]]"
  - "[[0xR360]]"
  - "[[0xhashiman]]"
  - "[[404666]]"
  - "[[AMOW]]"
  - "[[BengalCatBalu]]"
  - "[[HonorLt]]"
  - "[[Silvermist]]"
  - "[[UbiquitousComputing]]"
  - "[[Varun_05]]"
  - "[[ZdravkoHr.]]"
  - "[[aman]]"
  - "[[bughuntoor]]"
  - "[[cats]]"
  - "[[cawfree]]"
  - "[[denzi_]]"
  - "[[dipp]]"
  - "[[enfrasico]]"
  - "[[klaus]]"
  - "[[mike-watson]]"
  - "[[nilay27]]"
  - "[[no]]"
  - "[[novaman33]]"
  - "[[psb01]]"
  - "[[s1ce]]"
  - "[[thank_you]]"
  - "[[turvec]]"
report: "https://github.com/sherlock-audit/2024-03-zap-protocol-judging"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# H-3: Reentrancy in Vesting.sol:claim() will allow users to drain the contract due to executing .call() on user's address before setting s.index = uint128(i)

- id: 31192
- impact: HIGH
- protocol: [[Zap Protocol]]
- reporter: ZdravkoHr. (Sherlock)
- source: N/A

## Summary


Issue H-3 is a vulnerability in the Vesting.sol contract that allows users to drain the contract by exploiting the claim() function. This is due to the contract executing .call() on the user's address before setting s.index = uint128(i). The vulnerability was found by multiple users and has been escalated for review. It is recommended to use a reentrancy guard to prevent this issue. Various discussions and escalations have taken place regarding the severity and validity of duplicate reports. The issue has been resolved by moving the updates above the transfers and adding a reentrancy guard. 

## Details

Source: https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/157 

## Found by 
0x4non, 0xR360, 0xhashiman, 404666, AMOW, BengalCatBalu, HonorLt, Silvermist, UbiquitousComputing, Varun\_05, ZdravkoHr., aman, bughuntoor, cats, cawfree, denzi\_, dipp, enfrasico, klaus, mike-watson, nilay27, no, novaman33, psb01, s1ce, thank\_you, turvec
## Summary
Reentrancy in Vesting.sol:claim() will allow users to drain the contract due to executing .call() on user's address before setting s.index = uint128(I)

## Vulnerability Detail
Here is the Vesting.sol:claim() function:
```solidity
function claim() external {
        address sender = msg.sender;

        UserDetails storage s = userdetails[sender];
        require(s.userDeposit != 0, "No Deposit");
@>      require(s.index != vestingPoints.length, "already claimed");
        uint256 pctAmount;
        uint256 i = s.index;
        for (i; i <= vestingPoints.length - 1; i++) {
            if (block.timestamp >= vestingPoints[i][0]) {
                pctAmount += (s.userDeposit * vestingPoints[i][1]) / 10000;
            } else {
                break;
            }
        }
        if (pctAmount != 0) {
            if (address(token) == address(1)) {
@>              (bool sent, ) = payable(sender).call{value: pctAmount}("");
                require(sent, "Failed to send BNB to receiver");
            } else {
                token.safeTransfer(sender, pctAmount);
            }
@>          s.index = uint128(i);
            s.amountClaimed += pctAmount;
        }
    }
```
From the above, You'll notice the claim() function checks if the caller already claimed by checking if the s.index has already been set to vestingPoints.length. You'll also notice the claim() function executes .call() and transfer the amount to the caller before setting the s.index = uint128(i), thereby allowing reentrancy.

Let's consider this sample scenario:
- An attacker contract(alice) has some native pctAmount to claim and calls `claim()`.
- "already claimed" check will pass since it's the first time she's calling `claim()` so her s.index hasn't been set
- However before updating Alice s.index, the Vesting contract performs external .call() to Alice with the amount sent as well
- Alice reenters `claim()` again on receive of the amount
- bypass index "already claimed" check since this hasn't been updated yet
- contract performs external .call() to Alice with the amount sent as well again,
- Same thing happens again
- Alice ends up draining the Vesting contract

## Impact
Reentrancy in Vesting.sol:claim() will allow users to drain the contract

## Code Snippet
https://github.com/sherlock-audit/2024-03-zap-protocol/blob/main/zap-contracts-labs/contracts/Vesting.sol#L84
https://github.com/sherlock-audit/2024-03-zap-protocol/blob/main/zap-contracts-labs/contracts/Vesting.sol#L89

## Tool used

Manual Review

## Recommendation
Here is the recommended fix:
```diff
if (pctAmount != 0) {
+           s.index = uint128(i);
            if (address(token) == address(1)) {
                (bool sent, ) = payable(sender).call{value: pctAmount}("");
                require(sent, "Failed to send BNB to receiver");
            } else {
                token.safeTransfer(sender, pctAmount);
            }
-           s.index = uint128(i);
            s.amountClaimed += pctAmount;
        }
```
I'll also recommend using reentrancyGuard.



## Discussion

**midori-fuse**

Escalate 

Per Sherlock's [duplication rule](https://docs.sherlock.xyz/audits/judging/judging#ix.-duplication-rules):

> In the above example if the root issue A is one of the following generic vulnerabilities:
> - Reentrancy
> - Access control
> - Front-running
>
> Then the submissions with valid attack paths and higher vulnerability are considered valid. If the submission is vague or does not identify the attack path with higher severity clearly it will be considered low.
> - B is a valid issue
> - C is low

The following submissions fail to and/or incorrectly identify the root cause that enables the attack path: #6 #34 #66 #68 #79 #90 #98 #132 #149  . 
- The issues in this category should be Low.

The following submissions are somewhat vague, but did manage to identify the erroneous storage variable that leads to re-entrancy (`s.index`): #10 #53 #104 #138 #186 (and a few more). 
- While they did not (or vaguely) described the "attack path", the attack path here is just "directly calling `claim()` in your `receive()`", so I suppose one can be ok with just spelling out the function and the wrong storage variable.
- Since submission quality is subjective, I am flagging these issues so the judges can help with reviewing dupes. Personally I think these submissions are still acceptable, but leaving to the judges to decide the where the bar is.

**sherlock-admin2**

> Escalate 
> 
> Per Sherlock's [duplication rule](https://docs.sherlock.xyz/audits/judging/judging#ix.-duplication-rules):
> 
> > In the above example if the root issue A is one of the following generic vulnerabilities:
> > - Reentrancy
> > - Access control
> > - Front-running
> >
> > Then the submissions with valid attack paths and higher vulnerability are considered valid. If the submission is vague or does not identify the attack path with higher severity clearly it will be considered low.
> > - B is a valid issue
> > - C is low
> 
> The following submissions fail to and/or incorrectly identify the root cause that enables the attack path: #6 #34 #66 #68 #79 #90 #98 #132 #149  . 
> - The issues in this category should be Low.
> 
> The following submissions are somewhat vague, but did manage to identify the erroneous storage variable that leads to re-entrancy (`s.index`): #10 #53 #104 #138 #186 (and a few more). 
> - While they did not (or vaguely) described the "attack path", the attack path here is just "directly calling `claim()` in your `receive()`", so I suppose one can be ok with just spelling out the function and the wrong storage variable.
> - Since submission quality is subjective, I am flagging these issues so the judges can help with reviewing dupes. Personally I think these submissions are still acceptable, but leaving to the judges to decide the where the bar is.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**Nilay27**

> Escalate
> 
> Per Sherlock's [duplication rule](https://docs.sherlock.xyz/audits/judging/judging#ix.-duplication-rules):
> 
> > In the above example if the root issue A is one of the following generic vulnerabilities:
> > 
> > * Reentrancy
> > * Access control
> > * Front-running
> > 
> > Then the submissions with valid attack paths and higher vulnerability are considered valid. If the submission is vague or does not identify the attack path with higher severity clearly it will be considered low.
> > 
> > * B is a valid issue
> > * C is low
> 
> The following submissions fail to and/or incorrectly identify the root cause that enables the attack path: #6 #34 #66 #68 #79 #90 #98 #132 #134 #149 .
> 
> * The issues in this category should be Low.
> 
> The following submissions are somewhat vague, but did manage to identify the erroneous storage variable that leads to re-entrancy (`s.index`): #10 #53 #104 #138 #186 (and a few more).
> 
> * While they did not (or vaguely) described the "attack path", the attack path here is just "directly calling `claim()` in your `receive()`", so I suppose one can be ok with just spelling out the function and the wrong storage variable.
> * Since submission quality is subjective, I am flagging these issues so the judges can help with reviewing dupes. Personally I think these submissions are still acceptable, but leaving to the judges to decide the where the bar is.

#134 identifies the issue of how the re-entrance occurs and suggests the same remediation.
It clearly explains the following:
"The vulnerability arises from the contract's failure to update a user's claim state (s.index and s.amountClaimed) before transferring funds to the user, which allows a malicious contract to receive the funds and re-enter the claim function before the original call completes, potentially claiming more funds repeatedly."

The recommendation suggests updating the state before or using a reentrancy guard.

 I am unsure why that has been included in the `low` category per your escalation?  

**midori-fuse**

@Nilay27 I suppose you are right. Sorry about that, there are just too many dupes here, I might have confused it with another issue that got lost somewhere.

But be assured that unless the head of judging downright disagrees with me, all dupes will be reviewed and judged accordingly. Once again I'm sorry for my mistake.

**novaman33**

My issue - #10 does show the root cause clearly and does suggest a thorough recommendation for the mitigation. I do not agree it is vague. 

**keesmark**

It is the same as this one, but why is it considered invalid? #119 

**novaman33**

Probably because #119 says that reentrancy will occur when transferring erc20 tokens while call is used to transfer eth.


**ZdravkoHr**

Also, BNB is out of scope

**Hash01011122**

Acknowledging that every mentioned issue accurately identifies both the root cause of the vulnerability and the correct attack paths, yet noting the straightforward nature of the issue as a reason for minimal effort in Watson's issue, suggests a potential oversight in the importance of comprehensive reporting. 

**shubham-antier**

Issue resolved: Moved the updations above the transfers. Also, added a reentrancy guard to better the security.

**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/Lithium-Ventures/zap-contracts-labs/pull/2.

**Evert0x**

@Hash01011122 what's your proposal on the exact family for this issue? Which reports should be excluded/included?

**Hash01011122**

@Evert0x Had a indepth review of this family of issues:
Issues which can be excluded are: #6, #10, #34, #66, #79, #90, #132, #138, #149.
The pinpoint the root cause but fail to explain any attack vector.

**armormadeofwoe**

> @Evert0x Had a indepth review of this family of issues: Issues which can be excluded are: #6, #10, #34, #66, #79, #90, #132, #138, #149. The pinpoint the root cause but fail to explain any attack vector.

Hi @Hash01011122, with all due respect, I believe #138 should remain valid since it showcases:
root cause - sending funds before updating variables (breach of CEI pattern)
attack path - the ability to trigger an arbitrary fallback function due to sending native ETH that could re-enter the same function and continue claiming funds due to the unchanged variables. 

I do agree that my report is a little short as this is arguably the most known and recognizable issue in this space, decided to spare the judges some extra reading.



**Hash01011122**

Imao #138 should be excluded as I mentioned above,

**0x3agle**

@Hash01011122 
#6 accurately identifies the root cause and the attack path.
Root cause:
> If the token == address(1) (i.e. the native token) it performs an external call which sends the token to msg.sender and then updates the storage variable.

Attack Path:
> This allows an attacker to reenter the claim function until the contract is drained completely.

**Hash01011122**

@0x3agle with all due respect your report doesn't mention any appropriate Attack Path.

**0x3agle**

@Hash01011122 

Issue: storage variable updated after external call
Attack path: reentering the claim function
Impact: Contract drained
Mitigation: Follow CEI, add non-reentrant

Isn't this enough for this issue to be considered a valid one? 

This issue is so obvious I didn't feel the need for a PoC to convey my point. 

Having said that, I respect your decision and will accept it. 

**Hash01011122**

Hey, if we look from that lens even issues like #10, #34, #66, #132 and #138 should be valid too. I understand what you are pointing even I don't want to invalidate any of the issues as I understand watson's would not spend more effort on writing low hanging fruit issues, However, I'm just adhering to Sherlock's rulebook. Do you want to add anything here @0x3agle?

**Evert0x**

> @Evert0x Had a indepth review of this family of issues: Issues which can be excluded are: #6, #10, #34, #66, #79, #90, #132, #138, #149. The pinpoint the root cause but fail to explain any attack vector.

Planning to accept escalation and move remove the reports mentioned by the Lead Judge as duplicates

**0x3agle**

@Hash01011122 @Evert0x 
You missed #53 and #104

*P.S. I'm not a fan of pulling down other reports but if a selected portion of reports are being disqualified because they didn't mention a "detailed" attack path for an obvious issue, then every report that did not include a detailed description/PoC should be considered for disqualification.*

**novaman33**

@Evert0x could you please identify how #10 fails to explain the attack vector. I believe the attack path is stated clearly and that the solution is also very detailed. 


**Hash01011122**

Agreed, @0x3agle we can add those issues in our list. Updated issues to get excluded will be:
#6, #10, #34, #53, #66, #79, #90, #104, #132, #138, #149 

**Hash01011122**

@novaman33 I don't see any valid attack path mentioned in #10 report.

**Evert0x**

I believe #10 identified the attack pack and shows a good understanding of the issue.

After taken a detailed look at all reports, I believe only the following ones should be excluded as all other reports pinpoint the exact logic in the code that allows the reentrancy to happen. 

https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/6, https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/34, https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/66, https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/79, https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/90, https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/132,  https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/149

**Evert0x**

Result:
High
Has Duplicates

**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [midori-fuse](https://github.com/sherlock-audit/2024-03-zap-protocol-judging/issues/157/#issuecomment-2025184779): accepted
