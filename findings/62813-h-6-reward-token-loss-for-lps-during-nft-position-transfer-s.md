---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/farm
  - sector/lending
  - sector/nft
protocol: "[[BMX]]"
auditors:
  - "[[0x73696d616f]]"
  - "[[blockace]]"
  - "[[secret__one]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[ownership-transfer]]"
  - "[[reward-accounting]]"
---
# H-6: Reward Token Loss for LPs During NFT Position Transfer

- id: 62813
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


Summary:

The DeliHook v4 pools have a bug where when a liquidity provider (LP) transfers their NFT position to a new owner, the auto-claiming of rewards is executed in favor of the new owner instead of the previous owner. This results in the previous LP permanently losing their accumulated reward tokens. The bug occurs because the ownership of the NFT position is changed before the unsubscribe process is triggered, causing the reward claim to be credited to the new owner instead of the previous owner. This bug can be exploited by attackers to purchase an existing NFT position from an LP and receive all the reward tokens that belonged to the previous LP. The impact of this bug is high as it results in direct and irreversible economic loss for LPs. To fix this bug, the reward claim logic should be updated to reference the recorded position owner instead of the current NFT owner. 

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/184 

## Found by 
0x73696d616f, blockace, secret\_\_one

### Summary

In **DeliHook v4 pools**, when a liquidity provider (LP) transfers their NFT position to a new owner, the **auto-claiming of rewards** is executed in favor of the new owner instead of the previous owner.  

As a result, the previous LP permanently loses their accumulated reward tokens at the time of transfer.

Currently, during **position removal or modification**, the protocol performs an auto-claim of reward tokens to the LP. 

However, during a **position transfer** (DeliHook v4 Pools), the `transferFrom` function changes ownership *before* the unsubscribe process is triggered. This ordering causes the reward claim to be credited to the **new owner**, not the previous owner.

### Vulnerability Details

When an NFT position is transferred, the following function is called:

```solidity
function transferFrom(
    address from,
    address to,
    uint256 id
) public virtual override onlyIfPoolManagerLocked {
    super.transferFrom(from, to, id);   // Ownership is updated first
    if (positionInfo[id].hasSubscriber()) _unsubscribe(id);
}
```

- Ownership of the NFT position is changed first.
- _unsubscribe is then called, which triggers the notifyUnsubscribe logic.

```solidity
    function notifyUnsubscribe(
        uint256 tokenId
    ) external override onlyAuthorizedCaller {
        NotifyContext memory c = _buildContextFromToken(tokenId, true);

        dailyEpochGauge.notifyUnsubscribeWithContext(
            c.posKey,
            c.pidRaw,
            c.currentTick,
            c.owner,
            c.tickLower,
            c.tickUpper,
            c.liquidity
        );

        ...
    }

```

During unsubscribe, context is built for the position, including the owner:

```solidity
    function _buildContextFromToken(
        uint256 tokenId,
        bool includeOwner
    ) internal view returns (NotifyContext memory ctx) {
        IPositionHandler handler = getHandler(tokenId);

        ...
 
        if (includeOwner) {
            ctx.owner = handler.ownerOf(tokenId);
        }

    }
```

```solidity
    function ownerOf(uint256 tokenId) external view override returns (address) {
        return IERC721(address(positionManager)).ownerOf(tokenId);
    }
```

Because the transfer already occurred, ownerOf(tokenId) returns the new owner’s address.

The unsubscribe function then passes this owner to notifyUnsubscribeWithContext:

```solidity
    function notifyUnsubscribeWithContext(
        bytes32 posKey,
        bytes32 poolIdRaw,
        int24 currentTick,
        address ownerAddr,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) external onlyPositionManagerAdapter {
        ....

        _claimRewards(posKey, ownerAddr);

        _removePosition(pid, posKey);

    }
```

Finally, rewards are transferred:

```solidity
    function _claimRewards(
        bytes32 posKey,
        address recipient
    ) internal returns (uint256 amount) {
        amount = positionRewards[posKey].claim();

        if (amount > 0) {
            BMX.transfer(recipient, amount); 

            emit Claimed(recipient, amount);
        }
    }
```

Since recipient is the new owner, the previous LP loses all their accumulated rewards.

### Root Cause

The reward claim in notifyUnsubscribeWithContext (https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/DailyEpochGauge.sol#L706-L707) uses the current NFT owner (post-transfer) instead of the previous LP (position owner):

```solidity

    function notifyUnsubscribeWithContext(
        bytes32 posKey,
        bytes32 poolIdRaw,
        int24 currentTick,
        address ownerAddr,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) external onlyPositionManagerAdapter {

        ...

        _claimRewards(posKey, ownerAddr); // root-cause
        _removePosition(pid, posKey);
    }

```

### Internal Pre-conditions

1. LP holds an NFT position in a DeliHook v4 pool.
2. LP transfers their NFT position to another account.

### External Pre-conditions

None

### Attack Path

1. An attacker purchases an existing NFT position from an LP.

2. The transferFrom function executes, updating the NFT ownership to the attacker.

3. _unsubscribe is triggered, building context with the attacker’s address as the new owner.

4. notifyUnsubscribeWithContext calls _claimRewards with the attacker’s address.

5. The attacker receives all reward tokens that belonged to the previous LP.

### Impact

- Loss of accumulated rewards: The previous LP permanently loses all their unclaimed rewards.

- High Impact - direct and irreversible economic loss for LPs.

### PoC

None

### Mitigation

The reward claim logic should be updated to reference the recorded position owner (tracked from subscription) rather than the current NFT owner.

```diff

```solidity
    function notifyUnsubscribeWithContext(
        bytes32 posKey,
        bytes32 poolIdRaw,
        int24 currentTick,
        address ownerAddr,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) external onlyPositionManagerAdapter {

        ...
        
        @ audit Bug
-     _claimRewards(posKey, ownerAddr); 
     
       @ audit Fix

+     address owner = positionOwner[posKey];
+     _claimRewards(posKey, ownerAddr);



    }

```
```
