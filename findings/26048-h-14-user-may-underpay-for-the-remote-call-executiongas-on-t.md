---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/governance
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[xuwinnie]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[fee-calculation]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
---
# [H-14] User may underpay for the remote call `ExecutionGas` on the root chain

- id: 26048
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: xuwinnie (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


A bug has been discovered in the Ulysses-omnichain and Anycall Multichain contracts where users may underpay for the remote call `ExecutionGas`. This is due to the incorrect minimum execution cost being deposited at the `_replenishGas` call inside `_payExecutionGas` function.

The user is paying the incorrect minimum execution cost for `Anycall Mutlichain` as the value of `minExecCost` is calculated incorrectly. This is because the `AnycallV7` protocol considers a premium fee (`_feeData.premium`) on top of the TX gas price, which is not considered here.

The `anyExec` function calls the `chargeDestFee` modifier which calls the `chargeFeeOnDestChain` function. This function includes `_feeData.premium` for the execution cost `totalCost`. The conclusion is that the `minExecCost` calculation doesn't include `_feeData.premium`.

The recommended mitigation steps are to include `_feeData.premium` in `minExecCost` and to get `_feeData.premium` from `AnycallV7Config` by the `premium(`) function. This also applicable on `_payFallbackGas()` in `RootBridgeAgent` and `BranchBridgeAgent`, and `_payExecutionGas` in `BranchBridgeAgent`. However, due to the upcoming migration of this section to LayerZero, these findings will not be rectified.

## Details


User may underpay for the remote call `ExecutionGas`. Meaning, the incorrect `minExecCost` is being deposited at the `_replenishGas` call inside `_payExecutionGas` function.

### Proof of Concept

Multichain contracts - `anycall` v7 lines:<br>
<https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Upgradeable.sol#L265>
<br><https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Upgradeable.sol#L167>
<br><https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Upgradeable.sol#L276>

Ulysses-omnichain contract lines:
<br><https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L811>
<br><https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L851>

The user is paying the incorrect minimum execution cost for `Anycall Mutlichain` [L820](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L820), as the value of `minExecCost` is calculated incorrectly. The `AnycallV7` protocol considers a premium fee (`_feeData.premium`) on top of the TX gas price, which is not considered here.

Let's get into the flow from the start. When `anyExec` is called by the executor ([L265](https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Upgradeable.sol#L265)), the `anycall` request that comes from a source chain includes the `chargeDestFee` modifier.

```Solidity
    function anyExec(
        address _to,
        bytes calldata _data,
        string calldata _appID,
        RequestContext calldata _ctx,
        bytes calldata _extdata
    )
        external
        virtual
        lock
        whenNotPaused
        chargeDestFee(_to, _ctx.flags)
        onlyMPC
    {
        IAnycallConfig(config).checkExec(_appID, _ctx.from, _to);
```

Now, the `chargeDestFee` modifier will call the `chargeFeeOnDestChain` function as well at [L167](https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Upgradeable.sol#L167).

```Solidity
/// @dev Charge an account for execution costs on this chain
/// @param _from The account to charge for execution costs
    modifier chargeDestFee(address _from, uint256 _flags) {
        if (_isSet(_flags, AnycallFlags.FLAG_PAY_FEE_ON_DEST)) {
            uint256 _prevGasLeft = gasleft();
            _;
            IAnycallConfig(config).chargeFeeOnDestChain(_from, _prevGasLeft);
        } else {
            _;
        }
    }
```

As you see here in [L198-L210](https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Config.sol#L198C1-L210), inside the `chargeFeeOnDestChain` function includes `_feeData.premium` for the execution cost `totalCost`.

```Solidity
function chargeFeeOnDestChain(address _from, uint256 _prevGasLeft)
        external
        onlyAnycallContract
    {
        if (!_isSet(mode, FREE_MODE)) {
            uint256 gasUsed = _prevGasLeft + EXECUTION_OVERHEAD - gasleft();
            uint256 totalCost = gasUsed * (tx.gasprice + _feeData.premium);
            uint256 budget = executionBudget[_from];
            require(budget > totalCost, "no enough budget");
            executionBudget[_from] = budget - totalCost;
            _feeData.accruedFees += uint128(totalCost);
        }
    }
```

The conclusion: the `minExecCost` calculation doesn't include `_feeData.premium` at [L811](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L811), according to the Multichain `AnycallV7` protocol.

You should include `_feeData.premium` in `minExecCost` as well. The same as in [L204](https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Config.sol#L204).

    uint256 totalCost = gasUsed * (tx.gasprice + _feeData.premium);

This also applicable on:<br>
`_payFallbackGas()` in `RootBridgeAgent` at [L836](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L836).<br>
`_payFallbackGas()` in `BranchBridgeAgent` at [L1066](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/BranchBridgeAgent.sol#L1066).<br>
`_payExecutionGas` in `BranchBridgeAgent` at [L1032](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/BranchBridgeAgent.sol#L1032).

### Recommended Mitigation Steps

Add `_feeData.premium` to `minExecCost` at the `_payExecutionGas` function [L811](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/RootBridgeAgent.sol#L811).

You need to get `_feeData.premium` first from `AnycallV7Config` by the `premium(`) function at [L286-L288](https://github.com/anyswap/multichain-smart-contracts/blob/645d0053d22ed63005b9414b5610879094932304/contracts/anycall/v7/AnycallV7Config.sol#L286-L288).

```
uint256 minExecCost = (tx.gasprice  + _feeData.premium) * (MIN_EXECUTION_OVERHEAD + _initialGas - gasleft()));

```

**[0xBugsy (Maia) confirmed and commented](https://github.com/code-423n4/2023-05-maia-findings/issues/612#issuecomment-1655675080):**
 > We recognize the audit's findings on Anycall Gas Management. These will not be rectified due to the upcoming migration of this section to LayerZero.

***
