---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Livepeer]]"
auditors:
  - "[[Banditx0x]]"
report: "https://code4rena.com/reports/2023-08-livepeer"
genome:
  - "[[proposal-manipulation]]"
  - "[[role-bypass]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] By delegating to a non-transcoder, a delegator can reduce the tally of someone else's vote choice without first granting them any voting power

- id: 27048
- impact: HIGH
- protocol: [[Livepeer]]
- reporter: Banditx0x (Code4rena)
- source: https://code4rena.com/reports/2023-08-livepeer

## Summary


This bug report is about a vulnerability in the Livepeer protocol that allows one delegate to subtract their own voting weight from the voting choice of another delegate, even if that user isn't a transcoder. This could be used maliciously to effectively double one's voting power, by delegating their votes to a delegator who is about to vote for the choice which they don't want. It can also occur accidentally, for example when somebody delegates to a transcoder who later switches role to delegate.

The bug occurs when a user is not a transcoder, their votes are determined by the amount they have delegated to the delegatedAddress, and does not increase when a user delegates to them. If a delegator (Alice) has 100 votes and votes `For`, then another delegator (Bob) has delegated 1000 votes to Alice. As Alice doesn't get the voting power of Bob's 1000 votes, so the `For` count increases by 100.

Bob now votes, and `_handleVotesOverrides` is called. In this function, the first conditional, `if isTranscoder` will return false as Bob is not self-delegating. The logic inside `if (delegateVoter.hasVoted)` is executed and reduces the tally of whatever choice Alice voted for by Bob's weight. This will result in an aggregate 900 vote reduction in the `For` tally and +1000 votes for `Agaisnt` after Alice and Bob has finished voting.

The recommended mitigation steps is to add a check that a delegate is a transcoder before subtracting the tally. This is an edit of the conditional of the function `_handleOverrides`. This ensures that the subtraction of vote tally is only performed when the delegate is a voter AND the delegate is a transcoder. This should fix the accounting/subtraction issue of vote tally for non-transcoder delegates. This bug has been confirmed and mitigated by Livepeer.

## Details


A delegate can subtract their own voting weight from the voting choice of another delegate, even if that user isn't a transcoder. Since they are not a transcoder, they don't have their votes initially increased by the amount delegated to them, voting weight is still subtracted from the tally of their vote choice.

Maliciously, this could be used to effectively double one's voting power, by delegating their votes to a delegator who is about to vote for the choice which they don't want. It can also occur accidentally, for example when somebody delegates to a transcoder who later switches role to delegate.

### Proof of Concept

When a user is not a transcoder, their votes are determined by the amount they have delegated to the delegatedAddress, and does not increase when a user delegates to them:

```solidity
        if (bond.bondedAmount == 0) {
            amount = 0;
        } else if (isTranscoder) {
            amount = bond.delegatedAmount;
        } else {
            amount = delegatorCumulativeStakeAt(bond, _round);
        }
    }
```

Let's say that this delegator (Alice) has 100 votes and votes `For`, then another delegator(Bob) has delegated 1000 votes to Alice. As stated above, Alice doesn't get the voting power of Bob's 1000 votes, so the `For` count increases by 100.

Bob now votes, and `_handleVotesOverrides` is called. In this function, the first conditional, `if isTranscoder` will return false as Bob is not self-delegating.

Then, there is a check that the address Bob has delegated to has voted. Note that there is a missing check of whether the delegate address is a transcoder. Therefore the logic inside `if (delegateVoter.hasVoted)` is executed:

```solidity
if (delegateVoter.hasVoted) {
// this is a delegator overriding its delegated transcoder vote,
// we need to update the current totals to move the weight of
// the delegator vote to the right outcome.
VoteType delegateSupport = delegateVoter.support;

            if (delegateSupport == VoteType.Against) {
                _tally.againstVotes -= _weight;
            } else if (delegateSupport == VoteType.For) {
                _tally.forVotes -= _weight;
            } else {
                assert(delegateSupport == VoteType.Abstain);
                _tally.abstainVotes -= _weight;
            }
        }

```

The logic reduces the tally of whatever choice Alice voted for by Bob's weight. Alice initially voted `For` with 100 votes, and then the For votes is reduced by Bob's `1000 votes`. Lets say that Bob votes `Against`. This will result in an aggregate 900 vote reduction in the `For` tally and +1000 votes for `Agaisnt` after Alice and Bob has finished voting.

If Alice was a transcoder, Bob will be simply reversing the votes they had delegated to Alice. However since Alice was a delegate, they never gained the voting power that was delegated to her.

Bob has effectively gained the ability to vote against somebody else's votes (without first actually increasing their voting power since they are not a transcoder) and can vote themselves, which allows them to manipulate governance.

### Recommended Mitigation Steps

There should be a check that a delegate is a transcoder before subtracting the tally. Here is some pseudocode:

    if (delegateVoter.hasVoted && ---delegate is transcoder ---)

This is an edit of the conditional of the function `_handleOverrides`. This ensures that the subtraction of vote tally is only performed when the delegate is a voter AND the delegate is a transcoder. This should fix the accounting/subtraction issue of vote tally for non-transcoder delegates.

### Assessed type

Invalid Validation

**[victorges (Livepeer) confirmed](https://github.com/code-423n4/2023-08-livepeer-findings/issues/96#issuecomment-1720114654)**

**[victorges (Livepeer) mitigated](https://github.com/code-423n4/2023-08-livepeer-findings/issues/96):**
 > https://github.com/livepeer/protocol/pull/625
 > https://github.com/livepeer/protocol/pull/626



***
