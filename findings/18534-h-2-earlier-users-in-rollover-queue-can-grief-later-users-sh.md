---
tags:
  - lang/solidity
  - sector/options
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - novelty/variant
protocol: "[[Y2K]]"
auditors:
  - "[[spyrosonic10]]"
report: "https://github.com/sherlock-audit/2023-03-Y2K-judging"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# H-2: Earlier users in rollover queue can grief later users

- id: 18534
- impact: HIGH
- protocol: [[Y2K]]
- reporter: spyrosonic10 (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the Earthquake protocol, which is a decentralized options trading protocol. The issue is that the current implementation enables users who are earlier in the queue to grief those who are later. This happens because when a user delists from the queue, the last user enlisted will replace the delisted user's queue index. As a result, the last user may not have their funds rollover.

The issue was found by BPZ, Ch\_301, Dug, Emmanuel, J4de, Ruhum, TrungOre, ast3ros, berndartmueller, bin2chen, evan, hickuphh3, immeas, jprod15, kenzo, ltyu, minhtrng, mstpr-brainbot, nobody2018, roguereddwarf, sinarette, spyrosonic10, toshii, and twicek.

The code snippet can be found at https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L293-L296 and the tool used was Manual Review.

The recommendation to fix this issue is to instead of specifying the number of operations to execute, consider having start and end indexes, with a boolean mapping to track if a user's rollover has been processed. It was suggested that setting assets to 0 instead of removing the QueueItem from the array would be a more reasonable approach. A fix PR was also provided.

The impact of this issue is that whether accidental or deliberate, it is possible for users to not have their funds rollover.

The issue was initially escalated for 10 USDC, but this was rejected as it is more of an inconvenience for the user and there is no loss. It was then identified as a valid high issue since it breaks the core functionality. Additional changes were needed, and a fix looks good. Finally, a note was provided about the commit that was made.

## Details

Source: https://github.com/sherlock-audit/2023-03-Y2K-judging/issues/72 

## Found by 
BPZ, Ch\_301, Dug, Emmanuel, J4de, Ruhum, TrungOre, ast3ros, berndartmueller, bin2chen, evan, hickuphh3, immeas, jprod15, kenzo, ltyu, minhtrng, mstpr-brainbot, nobody2018, roguereddwarf, sinarette, spyrosonic10, toshii, twicek

## Summary
The current implementation enables users who are earlier in the queue to grief those who are later.

## Vulnerability Detail
There is a `rolloverAccounting` mapping that, for every epoch, tracks the current index of the queue for which mints have been processed up to thus far.

When a user delists from the queue, the last user enlisted will replace the delisted user's queue index.

It is thus possible for the queue to be processed up to, or past, the delisted user's queue index, but before the last user has been processed, the processed user delists, thus causing the last user to not have his funds rollover.

## POC
1. Alice enlists into the queue (index `1`), then Bob (index `2`)
2. Alice (or a relayer) calls `mintRollovers()` with `_operations = 1`, and Alice has her funds rollover.
3. Alice delists from the rollover.

Bob is then unable to have his funds rollover until the next epoch is created, unless he delists and re-enlists into the queue (defeating the purpose of rollover functionality).

## Impact
Whether accidental or deliberate, it is possible for users to not have their funds rollover.

## Code Snippet
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L293-L296

## Tool used
Manual Review

## Recommendation
Instead of specifying the number of operations to execute, consider having start and end indexes, with a boolean mapping to track if a user's rollover has been processed.



## Discussion

**3xHarry**

keeping track of rollovers with a mapping would increase gas cost substantially, however it would be a better solution than blocking delisting during deposit period 

**3xHarry**

setting assets to 0 instead of removing the QueueItem from the array sounds like a more reasonable approach, given that it's very unlikely for the rollover queue array length to reach the max size. Also, there can be more markets with similar strike prices deployed at any time. 

**3xHarry**

fix PR: https://github.com/Y2K-Finance/Earthquake/pull/127

**0xRobocop**

Escalate for 10 USDC

This is a valid low issue but not a high or med

This is more of an inconvenience for the user and there is no loss:

"User experience and design improvement issues:  Issues that cause minor inconvenience to users where there is no material loss of funds are not considered valid. Funds are temporarily stuck and can be recovered by the administrator or owner. Also, if a submission is a design opinion/suggestion without any clear indications of loss of funds is not a valid issue."

There is also a little guideline to identify [highs](https://docs.sherlock.xyz/audits/judging/judging#how-to-identify-a-high-issue) and [meds](https://docs.sherlock.xyz/audits/judging/judging#how-to-identify-a-medium-issue). Pay attention to "should not be easily replaced without loss of funds" which is not the case in this issue.

**sherlock-admin**

 > Escalate for 10 USDC
> 
> This is a valid low issue but not a high or med
> 
> This is more of an inconvenience for the user and there is no loss:
> 
> "User experience and design improvement issues:  Issues that cause minor inconvenience to users where there is no material loss of funds are not considered valid. Funds are temporarily stuck and can be recovered by the administrator or owner. Also, if a submission is a design opinion/suggestion without any clear indications of loss of funds is not a valid issue."
> 
> There is also a little guideline to identify [highs](https://docs.sherlock.xyz/audits/judging/judging#how-to-identify-a-high-issue) and [meds](https://docs.sherlock.xyz/audits/judging/judging#how-to-identify-a-medium-issue). Pay attention to "should not be easily replaced without loss of funds" which is not the case in this issue.

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**dmitriia**

Not agree with the escalation, that's core logic flaw with a range of material impacts, definitely high.

**hrishibhat**

Escalation rejected

Based on the issue and its duplicates and their impacts, considering this issue as a valid high since it breaks the core functionality. 

**sherlock-admin**

> Escalation rejected
> 
> Based on the issue and its duplicates and their impacts, considering this issue as a valid high since it breaks the core functionality. 

This issue's escalations have been rejected!

Watsons who escalated this issue will have their escalation amount deducted from their next payout.

**IAm0x52**

Needs additional changes. Using isEnlistedInRolloverQueue causes duplicate entries that can't be removed

**IAm0x52**

Fix looks good. isEnlistedInRolloverQueue has been changed making it impossible to have duplicate entries

**jacksanford1**

Note: 0x52's last message is in reference to this commit:

https://github.com/Y2K-Finance/Earthquake/pull/127/commits/1d1ac0a3411208cc7a3a7d4668ff123bffb2ff21
