---
tags:
  - lang/solidity
  - sector/dex
  - sector/gaming
  - sector/nft
  - sector/stable
  - platform/shieldify
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/low-liquidity
protocol: "[[Abster Freefall]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Abster-Freefall-Security-Review.md"
genome:
  - "[[missing]]"
  - "[[direct-drain]]"
  - "[[trigger/low-liquidity]]"
  - "[[access-roles]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
---
# [H-01] Claim Allows Payouts From an Arbitrary Token Pool, Not the Game’s Token

- id: 65079
- impact: HIGH
- protocol: [[Abster Freefall]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Abster-Freefall-Security-Review.md

## Summary


A bug has been found in a game contract where a user can claim their payout using a different token than the one used for the game. This can result in the user draining the liquidity pool of the wrong token. This is a high-risk issue as it can lead to direct cross-asset theft. The bug has been located in the code at line 219 of the Freefall.sol file. The code currently trusts the caller-supplied token address and does not check if it matches the token used for the game. This can be exploited by a malicious player who can play a game using a small token and then claim their payout using a token with a large pool, draining the liquidity entirely. The team has fixed the issue by binding the claim payout to the token used for the game and always using the game's token address for pool and transfers. This will prevent any potential exploitation in the future.

## Details


## Severity

High Risk

## Description

The `claim()` trusts the caller-supplied `_tokenAddress` and never checks if it matches the token used for the game.
As a result, a user who played a game in TokenA can claim their payout using TokenB, draining the liquidity pool of **B** even though they never bet that token.

This is a direct cross-asset theft vector.

**Example:**

- There are two supported tokens:
  - `tokenA` (e.g. USDC) with a small pool.
  - `tokenB` (e.g. WETH) with a large pool.
- User plays a game using `tokenA`:
  - `createGame(tokenA, ...)` stores `game.tokenAddress = tokenA`.
  - VRNG resolves, sets `game.determinedMultiplier`.
- Payout is determined, say `payout = 1_000e6` (USDC).

## Location of the code

File: [src/Freefall.sol#L219](https://github.com/Gaply-Labs/freefall-contract/blob/35509deea2637a80b1059ee3ed4c56893818da7d/src/Freefall.sol#L219)

```solidity
function claim(address _tokenAddress, string calldata _gameId)
{
    Pool storage pool = liquidityPool[_tokenAddress];        // <-- attacker controls
    uint256 onChainGameId = offChainGameIdToOnChainGameId[_gameId];
    Game storage game = games[onChainGameId];

    // payout computed from game.tokenAddress’s bet
    uint256 payout = (game.betAmount * game.determinedMultiplier) / BASIS_POINTS;

    pool.balance -= payout;                                  // <-- drains wrong pool
    tokenTransfer(_tokenAddress, payout, msg.sender);        // <-- sends attacker chosen token
}
```

## Impact

A malicious player can:

- Play a game in a small token (e.g., USDC with a low pool).
- Claim using a token with a large pool (e.g., WETH).
- Drain WETH liquidity entirely.

## Recommendation

Bind the claim payout to the token used for the game:

```solidity
require(_tokenAddress == game.tokenAddress, "Invalid token for claim");
```

Then always use `game.tokenAddress` for pool and transfers.

## Team Response

Fixed.
