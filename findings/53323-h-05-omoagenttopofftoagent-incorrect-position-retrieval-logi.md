---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/nft
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/wrong-condition]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-05] `OmoAgent.topOffToAgent` incorrect position retrieval logic

- id: 53323
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This report highlights a high severity bug in the `OmoAgent.topOffToAgent()` function. This function allows an agent to retrieve their deposited position NFT, but there are multiple issues with the current implementation. Firstly, the function incorrectly loops over all positions owned by the contract and checks if the caller is approved on each position. This is inaccurate because there is no tracking mechanism to associate each position with the agent who deposited it. Secondly, the function checks if the agent is approved on the position ID before transferring it back, but there is no function in the contract to grant NFT approvals to specific agents. This prevents agents from retrieving their deposited positions. To fix these issues, it is recommended to map each position ID to the agent who deposited it and remove the unnecessary approval check.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

- The `OmoAgent.topOffToAgent()` function allows an agent to retrieve their deposited position NFT, however, there are multiple issues in the current implementation:

```javascript
function topOffToAgent(uint256 _agentId, address asset) external onlyAgent(_agentId) {
        INonfungiblePositionManager nftManager = INonfungiblePositionManager(OmoAgentStorage.data().positionManager);
        for (uint256 i = 0; i < OmoAgentStorage.data()._positionIds.length; i++) {
            uint256 tokenId = OmoAgentStorage.data()._positionIds[i];
            require(nftManager.getApproved(tokenId) == OmoAgentStorage.data().agents[_agentId], "Not approved");

            nftManager.transferFrom(address(this), OmoAgentStorage.data().agents[_agentId], tokenId);
            _removePositionId(tokenId);
        }

        uint256 amount = IERC20(asset).balanceOf(address(this));
        if(amount > 0) {
            IERC20(asset).transfer(OmoAgentStorage.data().agents[_agentId], amount);
        }

        emit TopOffToAgent(_agentId);
    }
```

1. **Incorrect loop-based validation:**

   - The function loops over **all the positions owned by the contract** and checks whether the caller (agent) is approved on each of the owned positions.
   - If the agent is not approved on any one of them, the **call reverts**.
   - This assumption is inaccurate because **multiple agents interact with the `DynamicAccount`**, and there is **no tracking mechanism** to associate each deposited position with the agent who deposited it.

2. **Unnecessary approval check:**
   - The function verifies that the **agent is approved on the position ID** before transferring it back,however, there is **no implemented function in the contract that allows the DynamicAccount to make external calls** to grant NFT approvals to specific agents.
   - This check **cannot be enforced correctly** and **prevents agents from retrieving their deposited positions**.

## Recommendation

- Implement tracking for each deposited position by **mapping each position ID to the agent who deposited it**.
- Remove the `nftManager.getApproved(tokenId) == OmoAgentStorage.data().agents[_agentId]` check, as it is unnecessary when the position is being **transferred back to its original depositor**.
