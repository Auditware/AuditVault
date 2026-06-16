---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[INIT Capital]]"
auditors:
  - "[[Said]]"
report: "https://code4rena.com/reports/2023-12-initcapital"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
---
# [H-03] `_handleRepay` of `MoneyMarketHook` does not consider the actual debt shares of the `posId` inside the position manager and could lead to a user's tokens getting stuck inside the hook

- id: 29591
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: said (Code4rena)
- source: https://code4rena.com/reports/2023-12-initcapital

## Summary


The bug report discusses an issue where users' tokens can get stuck inside the MoneyMarketHook contract when they try to repay their positions. This happens because the contract does not consider the actual debt shares of the position, leading to an incorrect calculation of the amount of tokens needed for repayment. This can happen when a liquidator front-runs the operation, leaving the tokens stuck in the contract. To mitigate this issue, it is recommended to check the provided shares against the actual debt shares in the InitCore and PosManager contracts. The severity of this issue is debated, with some suggesting it is a medium issue and others considering it a high issue. 

## Details


When users construct repay operations via `MoneyMarketHook`, it doesn't consider the actual debt shares of the position inside the `InitCore` and `PosManager`. This could lead to users' tokens getting stuck inside the `MoneyMarketHook` contract.

### Proof of Concept

When users want to repay his positions in `MoneyMarketHook`, they can provide the parameters inside `repayParams`, and `MoneyMarketHook` will construct the operation via `_handleRepay` function.

<https://github.com/code-423n4/2023-12-initcapital/blob/main/contracts/hook/MoneyMarketHook.sol#L145-L159>

```solidity
    function _handleRepay(uint _offset, bytes[] memory _data, uint _initPosId, RepayParams[] memory _params)
        internal
        returns (uint, bytes[] memory)
    {
        for (uint i; i < _params.length; i = i.uinc()) {
            address uToken = ILendingPool(_params[i].pool).underlyingToken();
>>>         uint repayAmt = ILendingPool(_params[i].pool).debtShareToAmtCurrent(_params[i].shares);
            _ensureApprove(uToken, repayAmt);
>>>         IERC20(uToken).safeTransferFrom(msg.sender, address(this), repayAmt);
            _data[_offset] =
                abi.encodeWithSelector(IInitCore.repay.selector, _params[i].pool, _params[i].shares, _initPosId);
            _offset = _offset.uinc();
        }
        return (_offset, _data);
    }
```

It can be observed that it calculates the `repayAmt` based on the shares provided by the users and transfers the corresponding amount of tokens from the sender to the hook. However, the actual debt shares of the position can be less than the `_params[i].shares` provided by users. This means that the actual repay amount of tokens needed could be less than the calculated `repayAmt`.

<https://github.com/code-423n4/2023-12-initcapital/blob/main/contracts/core/InitCore.sol#L530-L551>

```solidity
    function _repay(IConfig _config, uint16 _mode, uint _posId, address _pool, uint _shares)
        internal
        returns (address tokenToRepay, uint amt)
    {
        // check status
        _require(_config.getPoolConfig(_pool).canRepay && _config.getModeStatus(_mode).canRepay, Errors.REPAY_PAUSED);
        // get position debt share
>>>     uint positionDebtShares = IPosManager(POS_MANAGER).getPosDebtShares(_posId, _pool);
>>>     uint sharesToRepay = _shares < positionDebtShares ? _shares : positionDebtShares;
        // get amtToRepay (accrue interest)
>>>     uint amtToRepay = ILendingPool(_pool).debtShareToAmtCurrent(sharesToRepay);
        // take token from msg.sender to pool
        tokenToRepay = ILendingPool(_pool).underlyingToken();
>>>     IERC20(tokenToRepay).safeTransferFrom(msg.sender, _pool, amtToRepay);
        // update debt on the position
        IPosManager(POS_MANAGER).updatePosDebtShares(_posId, _pool, -sharesToRepay.toInt256());
        // call repay on the pool
        amt = ILendingPool(_pool).repay(sharesToRepay);
        // update debt on mode
        IRiskManager(riskManager).updateModeDebtShares(_mode, _pool, -sharesToRepay.toInt256());
        emit Repay(_pool, _posId, msg.sender, _shares, amt);
    }
```

Consider a scenario where the user's positions are currently liquidatable, and the user wishes to repay all of the position's debt inside the `MoneyMarketHook`. However, a liquidator front-runs the operation by liquidating the user's position. Now, when the repayment operation executes from `MoneyMarketHook`, it transfers the `repayAmt` to the `MoneyMarketHook` but the amount is not used/fully utilized and becomes stuck inside the contract.

### Recommended Mitigation Steps

Consider to also check the provided shares against the actual debt shares inside the `InitCore`/`PosManager`.

**[fez-init (INIT) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2023-12-initcapital-findings/issues/28#issuecomment-1870322481):**
 > The issue should be medium, since the funds cannot be retrieved by someone else. The hook will be upgradeable, so if funds actually get stuck, it is still retrievable.

**[hansfriese (Judge) commented](https://github.com/code-423n4/2023-12-initcapital-findings/issues/28#issuecomment-1871745239):**
 > I agree that this issue is in the middle of Medium and High.
> Users might face a temporary lock on their funds, and the hook should be upgraded every time to unlock them.
>
> Given the high probability of this scenario occurring, I will keep this issue as a valid High.


***
