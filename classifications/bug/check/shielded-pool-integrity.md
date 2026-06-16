---
tags:
  - check/shielded-pool-integrity
  - sector/zk
  - sector/privacy
  - lang/solidity
---
Is the total shielded balance conserved across all deposits, withdrawals, and internal transfers? Verify that the contract's token balance equals the sum of all unspent note values, that partial withdrawals correctly reduce note value in the circuit, and that fee deductions do not allow over-withdrawal relative to the committed amount.
