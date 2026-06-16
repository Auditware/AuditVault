---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/nft-marketplace
  - platform/sherlock
  - has/github
  - severity/high
  - precondition/uninitialized
  - fix/use-reentrancy-guard
protocol: "[[LooksRare]]"
auditors:
  - "[[cergyk]]"
  - "[[detectiveking]]"
report: "https://github.com/sherlock-audit/2023-10-looksrare-judging"
genome:
  - "[[single-function]]"
  - "[[data/uninitialized]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[initializer-auth]]"
  - "[[reentrancy-guard]]"
---
# H-2: Winning agent id may be uninitialized when game is over, locking grand prize

- id: 27587
- impact: HIGH
- protocol: [[LooksRare]]
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


This bug report is about the Infiltration contract, which is used to determine the rankings of agents and prizes at the end of the game. The bug is that the winning agent's id may be uninitialized when the game is over, which locks the grand prize. 

The bug is caused by the agents mapping, which lazily initializes its records when two agents are swapped. The agentId of the first agent in the array is only set when it is swapped, so if it is never swapped, it keeps its agentId as zero, and the grand prize is unclaimable. This is because the field Agent.agentId of the struct is used to determine if the caller can claim the grand prize, and since the id is zero, there is no owner for it and the condition always reverts.

The impact of this bug is that the grand prize ends up locked and unclaimable by the winner. To fix this, a code snippet was proposed to use 1 as the default if `agents[1].agentId == 0`. This fix was accepted and implemented with the Pull Requests #153 and #178.

## Details

Source: https://github.com/sherlock-audit/2023-10-looksrare-judging/issues/31 

## Found by 
cergyk, detectiveking
In the `Infiltration` contract, the `agents` mapping holds all of the agents structs, and encodes the ranking of the agents (used to determine prizes at the end of the game).

This mapping records are lazily initialized when two agents are swapped (an agent is either killed or escapes):
- The removed agent goes to the end of currently alive agents array with the status `Killed/Escaped` and its `agentId` is set  
- The last agent of the currently alive agents array is put in place of the previously removed agent and its `agentId` is set

This is the only moment when the `agentId` of an agent record is set.

This means that if the first agent in the array ends up never being swapped, it keeps its agentId as zero, and the grand prize is unclaimable. 

## Vulnerability Detail
We can see in the implementation of `claimGrandPrize` that:
https://github.com/sherlock-audit/2023-10-looksrare/blob/main/contracts-infiltration/contracts/Infiltration.sol#L658

The field `Agent.agentId` of the struct is used to determine if the caller can claim. Since the id is zero, and it is and invalid id for an agent, there is no owner for it and the condition:

https://github.com/sherlock-audit/2023-10-looksrare/blob/main/contracts-infiltration/contracts/Infiltration.sol#L1666-L1670

Always reverts.

## Impact
The grand prize ends up locked/unclaimable by the winner

## Code Snippet

## Tool used

Manual Review

## Recommendation
In `claimGrandPrize` use 1 as the default if `agents[1].agentId == 0`:

```diff
function claimGrandPrize() external nonReentrant {
    _assertGameOver();
    uint256 agentId = agents[1].agentId;
+   if (agentId == 0)
+       agentId = 1;
    _assertAgentOwnership(agentId);

    uint256 prizePool = gameInfo.prizePool;

    if (prizePool == 0) {
        revert NothingToClaim();
    }

    gameInfo.prizePool = 0;

    _transferETHAndWrapIfFailWithGasLimit(WETH, msg.sender, prizePool, gasleft());

    emit PrizeClaimed(agentId, address(0), prizePool);
}
```



## Discussion

**0xhiroshi**

https://github.com/LooksRare/contracts-infiltration/pull/153

**0xhiroshi**

https://github.com/LooksRare/contracts-infiltration/pull/178

@nevillehuang 

**SergeKireev**

Fix LGTM
