---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/perpetuals
  - sector/staking
  - sector/governance
protocol: "[[Hyperstable]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperstable-security-review_2025-03-19.md"
genome:
  - "[[governance-voting-power-snapshot]]"
  - "[[logic/reward-calculation]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Non-perpetual locks gaining extra delegation power

- id: 57824
- impact: HIGH
- protocol: Hyperstable_2025-03-19
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperstable-security-review_2025-03-19.md

## Summary


This report is about a bug in the `vePeg._delegate()` function. This function requires that the source token (`_from`) is locked before allowing delegation. However, the `_moveAllDelegates()` function ignores this restriction and moves all tokens owned by the user to the new delegate, including non-perpetual locks. This bypasses the intention of only allowing perpetual locks to have delegation power. The recommendation is to either update the `_delegate()` function to accept a delegatee address or to clarify that address-level delegation is the intended design.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `vePeg._delegate()` function requires that the source token (`_from`) must be perpetually locked before allowing delegation. However, the `_moveAllDelegates()` function ignores this restriction and moves ALL tokens owned by the user to the new delegate, including non-perpetual locks.

This completely bypasses the intention where only perpetual locks should have delegation power.

```solidity
function _delegate(uint256 _from, uint256 _to) internal {
    LockedBalance memory currentLock = locked[_from];
    require(currentLock.perpetuallyLocked == true, "Lock is not perpetual");
    --- SNIPPED 
---
    _moveAllDelegates(delegator, currentDelegate, delegatee);
}
```

The `_moveAllDelegates()` function adds ALL tokens owned by the user to the delegation, not just perpetual ones.

```solidity
//File: src/governance/vePeg.sol

function _moveAllDelegates(address owner, address srcRep, address dstRep) internal {
    --- SNIPPED 
---

    if (dstRep != address(0)) {
        --- SNIPPED 
---

        // Plus all that's owned
        for (uint256 i = 0; i < ownerTokenCount; i++) {
@>          uint256 tId = ownerToNFTokenIdList[owner][i];   //@audit This contains all locks, including non-perpetual locks
            dstRepNew.push(tId);
        }

        --- SNIPPED 
---
    }
}
```

## Recommendation

The `_moveTokenDelegates()` function could be used to delegate a specific token to a target user.

However, the `_delegate()` function currently takes token IDs but performs delegation at the address level, creating inconsistency and making the to token ID redundant. If the intended behavior is to delegate a single token’s voting power, it would be clearer to update `_delegate()` to accept a delegatee address and use `_moveTokenDelegates()` accordingly. Otherwise, if address-level delegation is the intended design, the function interface should reflect that to avoid confusion.
