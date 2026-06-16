---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/vault
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Yield Basis]]"
auditors:
  - "[[Natalie Chin]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# Failure to use the batched transaction ﬂow may enable theft through front-running

- id: 16983
- impact: HIGH
- protocol: [[Yield V2]]
- reporter: Natalie Chin (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf

## Summary


The Yield Protocol relies on users interacting with the Ladle contract to batch their transactions. This is to ensure that users do not lose their funds through front-running. Front-running is when an attacker can front-run a function to steal the initial mint of strategy tokens. An example of this is when a user adds underlying tokens to the Strategy contract without using the router, and an attacker front-runs the call to the startPool() function to secure the strategy tokens initially minted for the user's underlying tokens. 

To limit the impact of function front-running, it is recommended to avoid minting tokens to the callers of the protocol’s functions. Long-term, it is also important to document the expectations around the use of the router to batch transactions, and analyze the implications of all uses of msg.sender in the system. This way, users are aware of the front-running risks that arise when the router is not used, and can be incentivized to not engage in front-running.

## Details

## Diﬃculty: Medium

## Type: Data Validation

## Description
The Yield Protocol relies on users interacting with the Ladle contract to batch their transactions (e.g., to transfer funds and then mint/burn the corresponding tokens in the same series of transactions). When they deviate from the batched transaction flow, users may lose their funds through front-running.

For example, an attacker could front-run the `startPool()` function to steal the initial mint of strategy tokens. The function relies on liquidity provider (LP) tokens to be transferred to the Strategy contract and then used to mint strategy tokens. The first time that strategy tokens are minted, they are minted directly to the caller:

```solidity
/// @dev Start the strategy investments in the next pool
/// @notice When calling this function for the first pool, some underlying needs to
/// be transferred to the strategy first, using a batchable router.
function startPool()
    external
    poolNotSelected
{
    [...]
    // Find pool proportion p = tokenReserves/(tokenReserves + fyTokenReserves)
    // Deposit (investment * p) base to borrow (investment * p) fyToken
    //   (investment * p) fyToken + (investment * (1 - p)) base = investment
    //   (investment * p) / ((investment * p) + (investment * (1 - p))) = p
    //   (investment * (1 - p)) / ((investment * p) + (investment * (1 - p))) = 1 - p
    uint256 baseBalance = base.balanceOf(address(this));
    require(baseBalance > 0, "No funds to start with");
    uint256 baseInPool = base.balanceOf(address(pool_));
    uint256 fyTokenInPool = fyToken_.balanceOf(address(pool_));
    uint256 baseToPool = (baseBalance * baseInPool) / (baseInPool + fyTokenInPool);
    // Rounds down
    uint256 fyTokenToPool = baseBalance - baseToPool;        // fyTokenToPool is rounded up
    // Mint fyToken with underlying
    base.safeTransfer(baseJoin, fyTokenToPool);
    fyToken.mintWithUnderlying(address(pool_), fyTokenToPool);
    // Mint LP tokens with (investment * p) fyToken and (investment * (1 - p)) base
    base.safeTransfer(address(pool_), baseToPool);
    (,, cached) = pool_.mint(address(this), true, 0); // We don't care about slippage, because the strategy holds to maturity and profits from sandwiching
    if (_totalSupply == 0) _mint(msg.sender, cached); // Initialize the strategy if needed
    invariants[address(pool_)] = pool_.invariant();   // Cache the invariant to help the frontend calculate profits
    emit PoolStarted(address(pool_));
}
```

## Exploit Scenario
Bob adds underlying tokens to the Strategy contract without using the router. Governance calls `setNextPool()` with a new pool address. Eve, an attacker, front-runs the call to the `startPool()` function to secure the strategy tokens initially minted for Bob’s underlying tokens.

## Recommendations
**Short term:** To limit the impact of function front-running, avoid minting tokens to the callers of the protocol’s functions.

**Long term:** Document the expectations around the use of the router to batch transactions; that way, users will be aware of the front-running risks that arise when it is not used. Additionally, analyze the implications of all uses of `msg.sender` in the system, and ensure that users cannot leverage it to obtain tokens that they do not deserve; otherwise, they could be incentivized to engage in front-running.
