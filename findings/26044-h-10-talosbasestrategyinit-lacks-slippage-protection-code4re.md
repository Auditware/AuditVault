---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/access-control/missing-modifier
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[los_chicos]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[missing-modifier]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-10] `TalosBaseStrategy#init()` lacks slippage protection

- id: 26044
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: los\_chicos (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


This bug report is regarding the TalosBaseStrategy smart contract which is used to add slippage protection for an increase/decrease in liquidity operations. It is applied to `deposit/redeem`, `rerange/rebalance` but the `init()` function is missing it. This means that the `init()` function does not utilize the `checkDeviation` modifier, which was specifically designed to safeguard users against slippage. As a result, there is no slippage protection on `init()`.

The recommended mitigation steps for this bug are to apply `checkDeviation` to `init()` function. This was confirmed by the Maia team, and the bug was addressed in the `eco-c4-contest` repository.

## Details


The `checkDeviation`s modifier's purpose is to add slippage protection for an increase/decrease in liquidity operations. It's applied to `deposit/redeem`, `rerange/rebalance`  but `init()` is missing it.

### Impact

There is no slippage protection on `init()`.

### Proof of Concept

In the `init()` function of `TalosBaseStrategy`, the following actions are performed: an initial deposit is made, a tokenId and shares are minted.

The `_nonfungiblePositionManager.mint()` function is called with hardcoded values of `amount0Min` and `amount1Min` both set to 0. Additionally, it should be noted that the `init()` function does not utilize the `checkDeviation` modifier, which was specifically designed to safeguard users against slippage.

```solidity
    function init(uint256 amount0Desired, uint256 amount1Desired, address receiver)
        external
        virtual
        nonReentrant
        returns (uint256 shares, uint256 amount0, uint256 amount1)
    {
    ...
        (_tokenId, _liquidity, amount0, amount1) = _nonfungiblePositionManager.mint(
            INonfungiblePositionManager.MintParams({
                token0: address(_token0),
                token1: address(_token1),
                fee: poolFee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0Desired,
                amount1Desired: amount1Desired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            })
        );
        ...
```
<https://github.com/Maia-DAO/maia-ecosystem-monorepo/blob/2f6e87348877684aa0c12aec204fea210cfbe6eb/src/scope/talos/base/TalosBaseStrategy.sol#L99-L147>

```solidity
    /// @notice Function modifier that checks if price has not moved a lot recently.
    /// This mitigates price manipulation during rebalance and also prevents placing orders when it's too volatile.
    modifier checkDeviation() {
        ITalosOptimizer _optimizer = optimizer;
        pool.checkDeviation(_optimizer.maxTwapDeviation(), _optimizer.twapDuration());
        _;
    }
```
<https://github.com/Maia-DAO/maia-ecosystem-monorepo/blob/2f6e87348877684aa0c12aec204fea210cfbe6eb/src/scope/talos/base/TalosBaseStrategy.sol#L419-L425>

### Tools Used

VS Code, `uniswapv3book`

### Recommended Mitigation Steps

Apply `checkDeviation` to `init()` function.

**[Trust (judge) increased severity to High](https://github.com/code-423n4/2023-05-maia-findings/issues/658#issuecomment-1631195362)**

**[0xLightt (Maia) confirmed](https://github.com/code-423n4/2023-05-maia-findings/issues/658#issuecomment-1655668470)**

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/658#issuecomment-1708812040):**
> Addressed [here](https://github.com/Maia-DAO/eco-c4-contest/tree/577-57-504-658-583-730).

***
