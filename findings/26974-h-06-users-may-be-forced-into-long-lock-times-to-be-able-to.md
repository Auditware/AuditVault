---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Canto]]"
auditors:
  - "[[ADM]]"
report: "https://code4rena.com/reports/2023-08-verwa"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# [H-06] Users may be forced into long lock times to be able to undelegate back to themselves

- id: 26974
- impact: HIGH
- protocol: [[Canto]]
- reporter: ADM (Code4rena)
- source: https://code4rena.com/reports/2023-08-verwa

## Summary


This bug report discusses an issue in the veRWA contracts, which is part of the FiatDAO system. It has been identified that users may be forced to remain delegated to someone they do not wish to be or extend their lock much longer than they wish. This is due to a check requiring users only be able to delegate to others or themselves with longer lock times and veRWA's restrictions of all changes increasing lock times by 5 years.

To illustrate this issue, an example is provided. Bob creates a lock in week 1 and Dave creates a lock in week 2. Bob delegates to Dave. Three years pass and Bob decides he wishes to undelegate his votes back to himself, however the call will fail due to the check in VotingEscrow#L384 which requires the lock to be longer than the current lock. The issue is that any changes in the veRWA contract results in a lock extension of 5 years which the user may not want to extend their lock by.

To mitigate this issue, it is recommended to modify VotingEscrow#L384 to allow users to delegate either to longer locks or undelegate back to themselves. The severity of the issue has been increased to High as locking CANTO for an additional 5 years has an extremely high chance of resulting in losses due to market movements or other factors. This has been confirmed by OpenCoreCH. 

In conclusion, this bug report highlights an issue in the veRWA contracts which has been identified to potentially force users to remain delegated to someone they do not wish to be or extend their lock much longer than they wish. A mitigation step has been proposed and the severity of the issue has been increased to High.

## Details


Due to a check requiring users only be able to delegate to others or themselves with longer lock times and verwa's restrictions of all changes increasing lock times by 5 years users may be forced to remain delegated to someone they do not wish to be or extend their lock much longer than they wish.

### Proof of Concept

If a user does not delegate to another user who started their lock during the same epoch they will be unable to undelegate back to themselves without extending their own lock. This is not much of an issue if they wish to do so early in the lock period but can become a problem if they wish to delegate to themselves after a longer period of time. i.e.

1.  Bob creates lock in week 1.
2.  Dave create lock in week 2 & Bob delegates to Dave.
3.  3 years pass and Bob decides he wishes to undelegate his votes back to himself and calls delegate(msg.sender) but the call will fail due to the check in VotingEscrow#L384:

```Solidity
require(toLocked.end >= fromLocked.end, "Only delegate to longer lock");
```

4.  In the original FiatDAO contracts a user would be able to just extend their lock by one week to get around this however any changes in the verwa contract results in an extension of 5 years which the user may not want extend their lock by such a long time just to be able to undelegate.

The undelegate fail can be shown by modifying the test testSuccessDelegate to:

```Solidity
    function testSuccessDelegate() public {
        // successful delegate
        testSuccessCreateLock();
        vm.warp(8 days); // warp more than 1 week so both users are not locking in same epoch
        vm.prank(user2);
        ve.createLock{value: LOCK_AMT}(LOCK_AMT);
        vm.prank(user1);
        ve.delegate(user2);
        (, , , address delegatee) = ve.locked(user1);
        assertEq(delegatee, user2);
        (, , int128 delegated, ) = ve.locked(user2);
        assertEq(delegated, 2000000000000000000);
    }
```

and running:<br>
forge test `--match testSuccessUnDelegate`

### Recommended Mitigation Steps

Modify VotingEscrow#L384 to:

```Solidity
require(toLocked.end >= locked_.end, "Only delegate to self or longer lock");
```

which will allow users to delegate either to longer locks or undelegate back to themselves.

**[alcueca (Judge) increased severity to High and commented](https://github.com/code-423n4/2023-08-verwa-findings/issues/182#issuecomment-1696857059):**
 > I'm merging [#245](https://github.com/code-423n4/2023-08-verwa-findings/issues/245) into this one as the root cause and general mechanics are the same, only that in the 245 group the intent was malicious and in this group is not.
> 
> At the same time, I'm upgrading the severity to High. Locking CANTO for an additional 5 years, considering that this is by nature a volatile environment, has an extremely high chance of resulting in losses due to market movements or other factors.

**[OpenCoreCH (veRWA) confirmed on duplicate 178](https://github.com/code-423n4/2023-08-verwa-findings/issues/178)**


***
