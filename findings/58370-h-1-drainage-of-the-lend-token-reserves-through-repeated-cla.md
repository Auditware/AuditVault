---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/perpetuals
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[reward-accounting]]"
  - "[[commitment-uniqueness]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-1: Drainage of the LEND token reserves through repeated claims of the same rewards

- id: 58370
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the `claimLend()` function of the CoreRouter contract of the Lend protocol. This vulnerability allows users to repeatedly claim LEND tokens, leading to a complete drainage of the protocol's LEND reserves. The root cause of this issue is that the accrued balance is not properly reset after successful grants. This allows users to claim the same rewards multiple times, potentially leading to protocol insolvency and preventing other users from claiming their rightful rewards. To mitigate this issue, the `claimLend()` function should be updated to properly reset the accrued balance after successful grants. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/148 

## Found by 
0x23r0, 0xAlix2, 0xMakSecur, 0xNForcer, 0xgh0st, 37H3RN17Y2, Allen\_George08, Audinarey, Brene, Drynooo, Etherking, HeckerTrieuTien, Kirkeelee, Kvar, Lamsya, MRXSNOWDEN, PNS, SafetyBytes, Sneks, Tigerfrake, Z3R0, algiz, benjamin\_0923, bigbear1229, dmdg321, dreamcoder, durov, future, ggg\_ttt\_hhh, h2134, hgrano, jokr, mahdifa, momentum, newspacexyz, patitonar, t.aksoy, velev, wickie, xiaoming90, yaioxy, ydlee, zacwilliamson, zraxx, zxriptor

### Summary

The `claimLend()` function in CoreRouter allows perpetual granting of LEND tokens because `lendStorage.lendAccrued` is never reset after successful grants, enabling users to claim the same rewards multiple times.

### Root Cause

In the [`claimLend()`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L402) function, the protocol calls `grantLendInternal()` to transfer LEND tokens to users but fails to reset the accrued balance afterwards:

```solidity
for (uint256 j = 0; j < holders.length;) {
    uint256 accrued = lendStorage.lendAccrued(holders[j]);
    if (accrued > 0) {
        grantLendInternal(holders[j], accrued);
    }
    unchecked {
        ++j;
    }
}
```

The `grantLendInternal()` function successfully transfers tokens but returns the remaining amount (0 if successful), which is ignored. This means `lendStorage.lendAccrued[holders[j]]` retains its value and can be claimed again.

In contrast, Compound's correct implementation [resets the accrued balance](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/Lendtroller.sol#L1456) after granting:

```solidity
lendAccrued[holders[j]] = grantLendInternal(holders[j], lendAccrued[holders[j]]);
```

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. User supplies tokens to the protocol and accrues LEND rewards
2. User calls `claimLend()` to receive their accrued LEND tokens
3. The function transfers the tokens but doesn't reset `lendStorage.lendAccrued[user]`
4. User can immediately call `claimLend()` again to receive the same rewards
5. The process can be repeated until the protocol's LEND balance is drained

### Impact

Complete drainage of the protocol's LEND token reserves through repeated claims of the same rewards. Users can exploit this to receive unlimited LEND tokens, far exceeding their legitimate rewards, which can lead to protocol insolvency and prevent other users from claiming their rightful rewards.

### PoC

No response

### Mitigation

Update the `claimLend()` function to reset the accrued balance after successful grants properly:

```solidity
for (uint256 j = 0; j < holders.length;) {
    uint256 accrued = lendStorage.lendAccrued(holders[j]);
    if (accrued > 0) {
        uint256 remaining = grantLendInternal(holders[j], accrued);
        lendStorage.updateLendAccrued(holders[j], remaining);
    }
    unchecked {
        ++j;
    }
}
```

This requires adding an `updateLendAccrued()` function to LendStorage to allow authorized contracts to update accrued balances.
