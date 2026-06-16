---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - precondition/uninitialized
  - sector/gaming
protocol: "[[Virtuals]]"
auditors:
  - "[[sergei2340]]"
report: "https://code4rena.com/reports/2025-04-virtuals-protocol"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[data/uninitialized]]"
  - "[[initializer-auth]]"
---
# [H-06] Missing `prevAgentId`update in `promptMulti()` function may cause token loss by transferring to `address(0)`

- id: 61827
- impact: HIGH
- protocol: [[Virtuals]] Protocol
- reporter: sergei2340 (Code4rena)
- source: https://code4rena.com/reports/2025-04-virtuals-protocol

## Summary


The report discusses a bug found in the `promptMulti()` function of the `AgentInference.sol` contract. This function is used to optimize token transfers by caching `agentTba` when the `agentId` remains the same. However, the function fails to update `prevAgentId` inside the loop, causing `agentTba` to remain outdated or uninitialized. This can lead to unintentional token transfers and loss of tokens for users. The report recommends a solution to fix this bug and provides a proof of concept to demonstrate how the bug can occur. The root cause of the bug is also explained, highlighting the importance of updating `prevAgentId` in the caching logic. 

## Details



<https://github.com/code-423n4/2025-04-virtuals-protocol/blob/main/contracts/AgentInference.sol# L80-L87>

### Finding description

The `promptMulti()` function attempts to optimize token transfers by caching `agentTba` when the `agentId` remains unchanged. However, it fails to update `prevAgentId` inside the loop, which causes `agentTba` to remain outdated or uninitialized.

As a result, if the first `agentId` equals the default `prevAgentId` (0), the contract never sets `agentTba` before the first transfer, causing a `safeTransferFrom(sender, address(0), amount)`, losing the user’s tokens.

Additionally, when the same `agentId` reoccurs after a different one, `agentTba` may point to the wrong address, resulting in unexpected transfers.

### Recommended mitigation steps

Consider implementing the following version of the code:
```

// Initialize prevAgentId to a value that no valid agentId will ever match,
// ensuring the first iteration always enters the if-block.
uint256 prevAgentId = type(uint256).max;

// Initialize agentTba to a placeholder; it will be set properly on the first iteration.
address agentTba = address(0);

for (uint256 i = 0; i < len; i++) {
    uint256 agentId = agentIds[I];
    require(amounts[i] > 0, "Amount must be > 0"); // Validate if amounts = 0

    // If the agentId changes, fetch the corresponding agent TBA (target address)
    if (prevAgentId != agentId) {
        agentTba = agentNft.virtualInfo(agentId).tba;
        require(agentTba != address(0), "Invalid agent TBA");  // Ensure the target address is valid
        prevAgentId = agentId;  // Update the cache to reflect the current agentId
    }

    token.safeTransferFrom(sender, agentTba, amounts[i]);

    inferenceCount[agentId]++;
    emit Prompt(sender, promptHashes[i], agentId, amounts[i], coreIds[i]);
}
```

### Proof of Concept

Assume the following scenario. The loop processes the following values, controlled by user:
```

agentIds = [0, 1, 0]
amounts  = [10, 20, 30]
```

**Initialization:**
```

prevAgentId = 0
agentTba = address(0)
```

**Iteration 0:**
```

agentId = 0
```

1. Check: `if (prevAgentId != agentId)` → `if (0 != 0)` → FALSE
2. No update to `agentTba` (remains `address(0)`)
3. Transfer:
```

token.safeTransferFrom(sender, address(0), 10)
```

→ User lost 10 tokens unintentionally.

**Iteration 1:**
```

agentId = 1
```

1. Check: `if (prevAgentId != agentId)` → `if (0 != 1)` → TRUE
2. `agentTba` is updated: `agentTba = agentNft.virtualInfo(1).tba`

→ BUT: `prevAgentId` is not updated, so it still holds 0

3. Transfer:
```

token.safeTransferFrom(sender, agent1Tba, 20)
```

→ So that’s correct.

**Iteration 2:**
```

agentId = 0
```

1. Check: `if (prevAgentId != agentId)` → `if (0 != 0)` → FALSE
2. No update to `agentTba`, which still holds the address for agent 1.
3. Transfer:
```

token.safeTransferFrom(sender, agent1Tba, 30)
```

→ Tokens are sent to the wrong agent (agent 1 instead of agent 0).

### Root Cause

The condition to fetch a new `agentTba` relies on `prevAgentId` being updated after each successful fetch.

* Because `prevAgentId` is never updated inside the loop, the caching logic becomes broken:

  + The first transfer may lose tokens (if `agentId == 0` and no update is triggered),
  + Subsequent transfers may send tokens to incorrect agents if agentId switches back and forth.

**Virtuals marked as informative**

---
