---
tags:
  - severity/high
  - has/github
  - sector/staking
  - lang/solidity
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[governance-voting-power-snapshot]]"
  - "[[commitment-uniqueness]]"
  - "[[governance/proposal-manipulation]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[governance-vote]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-04] Duplicate `tokenId` in delegate list may inflate votes

- id: 58155
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


This bug report discusses an issue that occurs when moving delegates in the Velodrome platform. This issue was identified in a security review by Spearbit. The bug occurs in the functions `_moveAllDelegates` and `_moveTokenDelegates`, where delegated tokenIds are removed from the previous delegatee and added to the new delegatee. However, if the operation is performed within the same block, there are several issues that arise. These include an increasing number of checkpoints, the tokenId not being removed from the previous delegatee's latest checkpoint, and duplicate tokenIds in the new delegatee's latest checkpoint. The report recommends adjusting the functions to account for scenarios where the operation is performed within the same block.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The following issue occurs when moving delegates and was already identified in the Spearbit audit of [Velodrome](https://github.com/spearbit/portfolio/raw/master/pdfs/Velodrome-Spearbit-Security-Review.pdf).

Inside `_moveAllDelegates` and `_moveTokenDelegates`, the delegated `tokenIds` will be removed from `srcRep` (previous delegatee) and will be added to the `dstRep` (new delegatee).

```solidity
    function _moveAllDelegates(
        address owner,
        address srcRep,
        address dstRep
    ) internal {
        // You can only redelegate what you own
        if (srcRep != dstRep) {
            if (srcRep != address(0)) {
                uint32 srcRepNum = numCheckpoints[srcRep];
                uint[] storage srcRepOld = srcRepNum > 0
                    ? checkpoints[srcRep][srcRepNum - 1].tokenIds
                    : checkpoints[srcRep][0].tokenIds;
                uint32 nextSrcRepNum = _findWhatCheckpointToWrite(srcRep);
                uint[] storage srcRepNew = checkpoints[srcRep][nextSrcRepNum]
                    .tokenIds;
                // All the same except what owner owns
                for (uint i = 0; i < srcRepOld.length; i++) {
                    uint tId = srcRepOld[i];
>>>                if (idToOwner[tId] != owner) {
                        srcRepNew.push(tId);
                    }
                }

>>>             numCheckpoints[srcRep] = srcRepNum + 1;
            }

            if (dstRep != address(0)) {
                uint32 dstRepNum = numCheckpoints[dstRep];
                uint[] storage dstRepOld = dstRepNum > 0
                    ? checkpoints[dstRep][dstRepNum - 1].tokenIds
                    : checkpoints[dstRep][0].tokenIds;
                uint32 nextDstRepNum = _findWhatCheckpointToWrite(dstRep);
                uint[] storage dstRepNew = checkpoints[dstRep][nextDstRepNum]
                    .tokenIds;
                uint ownerTokenCount = ownerToNFTokenCount[owner];
                require(
                    dstRepOld.length + ownerTokenCount <= MAX_DELEGATES,
                    "dstRep would have too many tokenIds"
                );
                // All the same
                for (uint i = 0; i < dstRepOld.length; i++) {
                    uint tId = dstRepOld[i];
>>>                 dstRepNew.push(tId);
                }
                // Plus all that's owned
                for (uint i = 0; i < ownerTokenCount; i++) {
                    uint tId = ownerToNFTokenIdList[owner][i];
>>>                 dstRepNew.push(tId);
                }

>>>             numCheckpoints[dstRep] = dstRepNum + 1;
            }
        }
    }
```

`_findWhatCheckpointToWrite` will be used to determine which checkpoint the list will be added / removed.

```solidity
    function _findWhatCheckpointToWrite(
        address account
    ) internal view returns (uint32) {
        uint _timestamp = block.timestamp;
        uint32 _nCheckPoints = numCheckpoints[account];

        if (
            _nCheckPoints > 0 &&
            checkpoints[account][_nCheckPoints - 1].timestamp == _timestamp
        ) {
            return _nCheckPoints - 1;
        } else {
            return _nCheckPoints;
        }
    }
```

Notice that if the operation is called within the same block, the same checkpoint will used for the move delegate operation.

This could cause an issue, consider this scenario (all operation is done on the same block).

**Alice**
Num checkpoint = 1
TokenIds (checkpoint 0) = 1 , 2

**Bob**
Num checkpoint = 1
TokenIds (checkpoint 0) = 3, 4

TokenId 1 is moved from alice to bob, resulting in the following state.

**Alice**
Num checkpoint = 2
TokenIds (checkpoint 0) = 1 , 2
TokenIds (checkpoint 1) = 2

**Bob**
Num checkpoint = 2
TokenIds (checkpoint 0) = 3, 4
TokenIds (checkpoint 1) = 3, 4, 1

TokenId 2 moved from alice to bob, but since it performed in the same block, will result in the following state.

**Alice**
Num checkpoint = 3
TokenIds (checkpoint 0) = 1 , 2
TokenIds (checkpoint 1) = 2

**Bob**
Num checkpoint = 3
TokenIds (checkpoint 0) = 3, 4
TokenIds (checkpoint 1) = 3, 4, 1, 3, 4, 1, 2

There are several issues here: the number of checkpoints keeps increasing even when using the same checkpoint, and the tokenId 2 is not removed from Alice's latest checkpoint. And Bob's latest checkpoint contains several duplicates, as it always assumes `dstRepNew` is empty.

## Recommendations

Consider adjusting `_moveAllDelegates` and `_moveTokenDelegates` to account for scenarios where the operation is performed within the same block.
