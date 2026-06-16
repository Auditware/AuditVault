---
tags:
  - lang/solidity
  - sector/oracle
  - platform/ottersec
  - severity/high
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - fix/add-check
protocol: "[[Switchboard]]"
auditors:
  - "[[Woosun Song]]"
report: "https://switchboard.xyz/"
genome:
  - "[[stale-price]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
  - "[[timestamp-dependence]]"
---
# Incorrect Oracle Garbage Collection

- id: 47982
- impact: HIGH
- protocol: Switchboard_evm
- reporter: Woosun Song (OtterSec)
- source: https://[[Switchboard]].xyz/

## Summary


The oracleHeartbeat function in the Switchboard contract has a bug where it sets the numRows of the wrong oracle during garbage collection. This can lead to a situation where an oracle exists in multiple queues at the same time, causing issues with other parts of the code that assume an oracle only exists in one queue. To fix this, the setNumRows function should be changed to use the correct oracleId. This bug has been patched in the latest version of the contract.

## Details

## Oracle Heartbeat Vulnerability

`oracleHeartbeat` performs garbage collection on a valid oracle instead of an expired one. Each oracle has a field named `numRows`, which indicates the number of queues associated with it. An oracle may only be added to a queue if its `numRows` value is zero. Therefore, setting `numRows` of an oracle back to zero should always be accompanied by queue removal to prevent the oracle from existing in multiple queues simultaneously.

However, `oracleHeartbeat` erroneously performs `setNumRows` on `oracleId` instead of `gcOracleId` during garbage collection.

### Code Snippet
```solidity
// contracts/src/Switchboard/oracle/Oracle.sol
function oracleHeartbeat(address oracleId) external {
    /* ... */
    // get gcIdx - guaranteed to have at least 1 element here
    uint256 gcIdx = queue.gcIdx;
    address gcOracleId = queue.oracles[gcIdx];
    // increment gcIdx
    OracleQueueLib.incrementGC(oracle.queueId);
    // handle expired oracles if gcIdx is expired
    if (
        (OracleLib.oracles(gcOracleId).lastHeartbeat + queue.oracleTimeout) < block.timestamp
    ) {
        // log the garbage collection
        emit OracleGC(gcOracleId, oracle.queueId);
        // swap remove queue.oracles[gcIdx]
        OracleLib.setNumRows(oracleId, 0);
        OracleQueueLib.swapRemove(oracle.queueId, gcIdx);
    }
}
```

### Vulnerability Explanation
By exploiting this vulnerability, an attacker may create an oracle that exists in two queues simultaneously, violating crucial assumptions made by other parts of the code. For example, `saveResults` assumes that an oracle exists in only one queue and that an oracle’s effective heartbeat indicates it is not expired. However, if an oracle is present in multiple queues, it may continue to perform heartbeats even when it is already expired.

### Remediation
Change `setNumRows(oracleId, 0)` to `setNumRows(gcOracleId, 0)`.

### Patch
Fixed in commit `e833e48`.
