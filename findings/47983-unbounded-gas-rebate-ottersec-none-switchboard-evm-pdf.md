---
tags:
  - lang/solidity
  - sector/governance
  - sector/oracle
  - platform/ottersec
  - severity/high
  - fix/use-multi-oracle
protocol: "[[Switchboard]]"
auditors:
  - "[[Woosun Song]]"
report: "https://switchboard.xyz/"
genome:
  - "[[missing-modifier]]"
  - "[[use-multi-oracle]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Unbounded Gas Rebate

- id: 47983
- impact: HIGH
- protocol: Switchboard_evm
- reporter: Woosun Song (OtterSec)
- source: https://[[Switchboard]].xyz/

## Summary


The block builders in the Aggregator contract can exploit gas rebates by setting an unusually high gas price, which can result in the theft of Ether from the diamond. This is because the saveResult function provides gas rebates equal to the gas spent in the function multiplied by the transaction gas price, and regular users are responsible for paying the increased gas cost. However, this does not apply to block builders who can collude with an oracle authority to set an abnormally high gas price and receive inflated rebates. The severity of this issue is mitigated by the fact that there is a limit on the amount of rewards that can be extracted. To fix this issue, a constant boundary on spent gas has been implemented in the latest patches.

## Details

## Gas Rebates Exploitation in Block Builders

Block builders may exploit gas rebates, as they do not pay for gas costs. This enables them to set an unusually high gas price, potentially resulting in the theft of Ether from the diamond. 

### `saveResult` Function Overview

The `saveResult` function provides gas rebates equal to the gas spent in the function multiplied by `tx.gasprice`. Regular users gain no benefits from setting a high `tx.gasprice` as they are responsible for paying the increased gas cost. However, this does not apply to block builders. An oracle authority may collude with a block builder to set an abnormally high gas price to receive inflated rebates.

```solidity
// contracts/src/aggregator/Aggregator.sol
function saveResult(
    address aggregatorId,
    address oracleId,
    int256 result
) internal {
    // snapshot gas left
    uint256 remainingGas = gasleft();
    /* computation intensive work */
    // handle payment for oracle results - don't err out for now, just don't pay
    uint256 fullReward = reward + (remainingGas - gasleft()) * tx.gasprice;
    // remove funds from interval balance if we can (and if reward is not 0)
    if (aggregator.balanceLeftForInterval >= fullReward && reward != 0) {
        /* ... */
        // pay oracle for gas spend + reward - handing off trust to the oracle
        payable(msg.sender).transfer(fullReward);
    }
}
```

The severity of this issue is mitigated by the fact that `balanceLeftForInterval` bounds the amount of rewards extractable.

## Remediation

- Place a constant boundary on spent gas.

### Patch

- Fixed in `ee13d95` and `168ec96`.
