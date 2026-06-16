---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/options
  - sector/staking
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[BMX]]"
auditors:
  - "[[blockace]]"
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[governance-voting-power-snapshot]]"
---
# H-2: Users' voting weight can be double-counted when finalize epoch is processed in multiple steps

- id: 62809
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


This bug report describes an issue in the `Voter.sol` contract where the admin can call `finalizeEpoch` to tally votes at the end of an epoch. However, the current balance of `SBF_BMX` is used in the tallying process, which allows for manipulation by malicious actors. The report suggests restricting staking during the finalization process or implementing a snapshotting system to prevent this issue. 

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/62 

## Found by 
blockace, cergyk

### Description

In `Voter.sol`, the admin can call `finalizeEpoch` in order to tally all of the votes when an epoch has ended. Since the list of voters can be unbounded, finalizing can be broken into multiple steps in order to avoid DOS by OOG.

Unfortunately, when tallying the votes, the current balance of `SBF_BMX` is used, which allows a manipulation of the result by malicious actors:

[Voter.sol#L338-L369](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/Voter.sol#L338-L369):
```solidity
    /// @dev Processes up to `maxBatch` auto-voters for `ep`, adding live balances to option weights.
    function _tallyAutoVotes(uint256 ep, uint256 maxBatch) internal returns (bool finished) {
        EpochData storage e = epochInfo[ep];
        uint256 processed;
        while (processed < maxBatch && batchCursor[ep] < autoVoterList.length) {
            uint256 i = batchCursor[ep];
            address voterAddr = autoVoterList[i];
            batchCursor[ep] = i + 1;
            processed++;

            uint8 opt = autoOption[voterAddr];
            if (opt >= 3) continue; // disabled
            if (userVoteWeight[ep][voterAddr] > 0) continue;


            //@audit current balance is used for voterAddr
>>          uint256 bal = SBF_BMX.balanceOf(voterAddr);
            if (bal == 0) {
                // queue for removal instead of removing now
                pendingRemovals[ep].push(voterAddr);
                continue;
            }
            e.optionWeight[opt] += bal;
            userVoteWeight[ep][voterAddr] = bal;
            userChoice[ep][voterAddr] = opt;
        }


        finished = (batchCursor[ep] >= autoVoterList.length);


        // process removals only after loop is complete
        if (finished && pendingRemovals[ep].length > 0) {
            _processPendingRemovals(ep);
        }
    }
```

### Concrete scenario

The admin separates the processing of autoVotes into 2 transactions, and Alice controls 2 addresses `voterAddressA` (included in the first batch) and `voterAddressB` (included in the second batch). 

Between the 2 admin transactions, Alice unstakes her `sbfBMX` from `voterAddressA` and stakes to `voterAddressB`.

Since the balance of `sbfBMX` at the time of admin calling is used, the `sbfBMX` from `voterAddressA` will be counted again when `voterAddressB` is processed during the second admin call.

Alice has successfully manipulated the result of the vote.

### Recommendation

Either restrict staking of sBMX when `finalizationInProgress`, or use a snapshotting system which would get the latest `userVoteWeight[prevEp][voterAddr]` where `prevEp` is the latest epoch where `userVoteWeight` was updated.
