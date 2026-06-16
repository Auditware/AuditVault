---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[bin2chen]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[reward-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-07] `redeem()` in `beforeRedeem` is using the wrong owner parameter

- id: 26041
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: bin2chen (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


A bug has been found in the `TalosStrategyStaked.sol` contract that can cause users to lose rewards. When the `redeem()` function is called with the wrong owner parameter, the user's shares are reduced without `accrue`, causing them to lose their rewards. The code for the `redeem()` function should be updated to call `beforeRedeem` with the correct owner parameter. This bug has been confirmed and the recommended mitigation steps have been taken.

## Details


Using the wrong owner parameter can cause users to lose rewards.

### Proof of Concept

In `TalosStrategyStaked.sol`, if the user's `shares` have changed, we need to call `flywheel.accrue()` first, which will accrue `rewards` and update the corresponding `userIndex`. This way, we can ensure the accuracy of `rewards`. So we will call `flywheel.accrue()` before `beforeDeposit`/`beforeRedeem`/transfer etc.

Take `redeem()` as an example, the code is as follows:

```solidity
contract TalosStrategyStaked is TalosStrategySimple, ITalosStrategyStaked {
...

    function beforeRedeem(uint256 _tokenId, address _owner) internal override {
        _earnFees(_tokenId);
@>      flywheel.accrue(_owner);
    }
```

But when `beforeRedeem()` is called with the wrong owner passed in. The `redeem()` code is as follows:

```solidity
    function redeem(uint256 shares, uint256 amount0Min, uint256 amount1Min, address receiver, address _owner)
        public
        virtual
        override
        nonReentrant
        checkDeviation
        returns (uint256 amount0, uint256 amount1)
    {
...
        if (msg.sender != _owner) {
            uint256 allowed = allowance[_owner][msg.sender]; // Saves gas for limited approvals.

            if (allowed != type(uint256).max) allowance[_owner][msg.sender] = allowed - shares;
        }

        if (shares == 0) revert RedeemingZeroShares();
        if (receiver == address(0)) revert ReceiverIsZeroAddress();

        uint256 _tokenId = tokenId;
@>      beforeRedeem(_tokenId, receiver);

        INonfungiblePositionManager _nonfungiblePositionManager = nonfungiblePositionManager; // Saves an extra SLOAD
        {
            uint128 liquidityToDecrease = uint128((liquidity * shares) / totalSupply);

            (amount0, amount1) = _nonfungiblePositionManager.decreaseLiquidity(
                INonfungiblePositionManager.DecreaseLiquidityParams({
                    tokenId: _tokenId,
                    liquidity: liquidityToDecrease,
                    amount0Min: amount0Min,
                    amount1Min: amount1Min,
                    deadline: block.timestamp
                })
            );

            if (amount0 == 0 && amount1 == 0) revert AmountsAreZero();

@>          _burn(_owner, shares);

            liquidity -= liquidityToDecrease;
        }    
```

From the above code, we see that the parameter is the `receiver`, but the person whose shares are burned is `_owner`.

We need to accrue `_owner`, not `receiver`. This leads to a direct reduction of the user's shares without `accrue`, and the user loses the corresponding rewards.

### Recommended Mitigation Steps

```solidity
    function redeem(uint256 shares, uint256 amount0Min, uint256 amount1Min, address receiver, address _owner)
        public
        virtual
        override
        nonReentrant
        checkDeviation
        returns (uint256 amount0, uint256 amount1)
    {
        if (msg.sender != _owner) {
            uint256 allowed = allowance[_owner][msg.sender]; // Saves gas for limited approvals.

            if (allowed != type(uint256).max) allowance[_owner][msg.sender] = allowed - shares;
        }

        if (shares == 0) revert RedeemingZeroShares();
        if (receiver == address(0)) revert ReceiverIsZeroAddress();

        uint256 _tokenId = tokenId;
-       beforeRedeem(_tokenId, receiver);
+       beforeRedeem(_tokenId, _owner);
```

### Assessed type

Context

**[0xLightt (Maia) confirmed](https://github.com/code-423n4/2023-05-maia-findings/issues/730#issuecomment-1644201456)**

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/730#issuecomment-1708805564):**
> Addressed [here](https://github.com/Maia-DAO/eco-c4-contest/tree/577-57-504-658-583-730).

***
