---
tags:
  - lang/solidity
  - sector/bridge
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
protocol: "[[Optimism Interop]]"
auditors:
  - Zach Obront
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/OptimismInterop-Spearbit-Security-Review-February-2025.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
---
# Chain operator can DOS entire cluster during upgrade block, potentially stealing ETH from other

- id: 50076
- impact: HIGH
- protocol: Optimism Interop
- reporter: Zach Obront (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/OptimismInterop-Spearbit-Security-Review-February-2025.pdf

## Summary


This bug report discusses a high-risk issue in the Interop Network Upgrade and other OP hard forks. The issue is related to the organization of the upgrade block and the gas limit for transactions. If the gas limit is not set high enough, it can cause the chain to crash and make fault proofs impossible. This can also lead to a denial of service attack and potential theft of funds. The bug can be exploited by a malicious chain operator by reducing the gas limit and forcing the network upgrade transaction to run out of gas. The report recommends adding a buffer between the L2 gas limit and systemTxMaxGas + maxResourceLimit and ensuring all network upgrade transactions use less gas than this buffer. The bug is being fixed in an earlier hardfork and will also be addressed by changes outside of the scope of this report.

## Details

## Chains

**Severity:** High Risk  
**Context:** (No context files were provided by the reviewer)  

**Description:**  
In the Interop Network Upgrade (as well as other OP hard forks that include L2 contract changes), the upgrade block is organized as follows:  
1. L1 Attributes Transaction calling `setL1BlockValuesEcotone`.  
2. User deposits from L1.  
3. Network upgrade transactions.  

It is required that the block has sufficient gas for all of these transactions because they are all deposit transactions and therefore must be included in the block. If this is not the case, we will get an `ErrGasLimitReached`. This will cause a crash of all op-node and op-program instances, halting the chain and making fault proofs impossible to prove. At a minimum, this will DoS the entire cluster. Depending on how interop fault proofs are implemented, it also may create the opportunity for the malicious chain operator to propose a malicious root that cannot be disputed. In this case, they could create a root that includes a withdrawal of all ETH in the SharedLockbox, stealing funds from the other chains.

**Is it possible for a single chain operator to create this out of gas situation?**  
We can see in `SystemConfig.sol`, the `setGasLimit()` function is callable by the chain operator. It requires that they set the gas limit to at least the minimum:

```solidity
function minimumGasLimit() public view returns (uint64) {
    return uint64(_resourceConfig.maxResourceLimit) + uint64(_resourceConfig.systemTxMaxGas);
}
```

However, as we can see, this minimum only takes into account the L1 attributes transaction (systemTxMaxGas) and user deposits (maxResourceLimit). It is therefore possible to reduce the gas limit down to the minimum, use all the possible gas for user deposits, and force the network upgrade transaction to run out of gas.

## Proof of Concept:
- Let's imagine a chain has 1mm allocated for the system transaction and 20mm for user deposits.
- The total of all the upgrade transactions is 5mm gas.
- Some time before the upgrade block, the chain operator lowers the gas limit to the minimum (21mm).
- At the upgrade block, they submit a 20mm gas transaction through the bridge.
- As the upgrade block executes, it will use some portion of the 1mm for the system transaction, all 20mm for the user deposits, and not have sufficient gas left in the block for the network upgrade transactions.
- The result is that the chain halts, with op-node and op-program unable to perform derivation.

**Recommendation:**  
Ensure an additional buffer is added between the L2 gas limit and `systemTxMaxGas + maxResourceLimit`. Ensure all network upgrade transactions use an amount of gas that is less than this buffer.

**OP Labs:**  
This is being fixed in an earlier hardfork (Ishtmus) in commit 8966189c.

**Cantina Managed:**  
Will be fixed by changes outside of the scope.
