---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - platform/shieldify
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Soulsclub]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/SoulsClub-Wheel-Security-Review.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Stake Manipulation During Cooldown Period Allows Probability Gaming

- id: 64739
- impact: HIGH
- protocol: [[Soulsclub]] Wheel
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/SoulsClub-Wheel-Security-Review.md

## Summary


The Wheel contract has a bug that allows players to increase their chances of winning by depositing more funds during the cooldown period. This means that an attacker can manipulate the game to have a near 100% chance of winning by depositing a large amount of funds during the 60-second cooldown window. This can result in the game becoming unfair and predictable for the attacker. The team has fixed this issue and recommends implementing a limit on the amount of funds a player can deposit to prevent this type of exploit.

## Details


## Severity

High Risk

## Description

The Wheel contract allows players to call `joinGame()` multiple times to increase their stake even after the cooldown period has begun. This creates a severe vulnerability where an attacker can manipulate their winning probability to near 100% by continuously depositing funds during the cooldown window.

**Attack Scenario:**

1. **Initial Setup**: Attacker deposits `minStake` (0.0000001 ETH) to join as the first player
2. **Trigger Cooldown**: A legitimate user deposits, triggering the 60-second cooldown (`timeoutDuration`)
3. **Cooldown Exploitation**: During the 60-second window, the attacker repeatedly calls `joinGame()`:
   - Each call can deposit up to `maxStake` (1 ETH)
   - Total stake can reach: 60 transactions × 1 ETH = 60 ETH (or more with faster transactions)
   - Meanwhile, a legitimate user has only a small stake (e.g., 0.01 ETH)
4. **Winner Selection**: Attacker now has 60 ETH out of 60.01 ETH total pool = 99.98% win probability

**Example Calculation:**

```
Legitimate User Stake: 0.01 ETH (0.02% probability)
Attacker Initial Stake: 0.0000001 ETH
Attacker During Cooldown: 60 ETH (via 60 deposits of maxStake)
Total Pool: 60.0100001 ETH
Attacker Win Probability: (60.0000001 / 60.0100001) × 100 = 99.98%
```

## Location of Affected Code

File: [contracts/Wheel.sol#L295-L360](https://github.com/xgrisha666x/revolver-contract/blob/cae64f2684c68204c07240f4815fa0fcbe0297cb/contracts/Wheel.sol#L295-L360)

```solidity
function joinGame(
    string calldata uid,
    bytes calldata signature
) external payable nonReentrant {
    Session storage session = sessions[currentSessionId];
    if (session.status != SessionStatus.Gathering)
        revert SessionNotGathering();
    if (msg.value < minStake) revert StakeTooLow();
    // @audit can deposit multiple times to increase during cooldown
    if (msg.value > maxStake) revert StakeTooHigh();

    // ... signature verification ...

    // Track unique participants and pool
    uint256 previousStake = session.stakeByPlayer[msg.sender];
    if (previousStake == 0) {
        session.uniquePlayersCount++;
        session.participants.push(msg.sender);
        if (session.participants.length > MAX_PARTICIPANTS) revert MaxParticipantsExceeded();
    }

    session.stakeByPlayer[msg.sender] = previousStake + msg.value; // ❌ Unlimited accumulation
    session.pool += msg.value;

    // Activate when there are at least two unique players
    // @audit what if only 1 user joins?
    if (session.uniquePlayersCount >= 2 && session.startTimestamp == 0) {
        session.startTimestamp = block.timestamp; // Cooldown starts
        emit SessionActivated(currentSessionId, session.startTimestamp);
    }
}
```

File: [contracts/Wheel.sol#L365-L378](https://github.com/xgrisha666x/revolver-contract/blob/cae64f2684c68204c07240f4815fa0fcbe0297cb/contracts/Wheel.sol#L365-L378)

```solidity
function startSession(uint256 traceId) external onlyBackend {
    Session storage session = sessions[currentSessionId];
    if (session.status != SessionStatus.Gathering) revert InvalidState();
    if (session.uniquePlayersCount < 2) revert InvalidState();
    // @audit why cooldown period is given?
    if (block.timestamp < session.startTimestamp + timeoutDuration)
        revert WaitingForTimeout(); // 60 seconds of exploitation window
    // ...
}
```

## Impact

The attacker can achieve near-guaranteed wins (99%+ probability) in every session. The game becomes entirely unfair and predictable for the attacker.

## Recommendation

Implement a comprehensive stake cap system that limits any single player's control over the total pool.

## Team Response

Fixed.
