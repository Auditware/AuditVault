---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/dos/griefing
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-Security-Review-June-2024.pdf"
genome:
  - "[[griefing]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# A malicious entity can grieve Restoration Servers for their funds

- id: 36774
- impact: HIGH
- protocol: [[Overprotocol]]
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-Security-Review-June-2024.pdf

## Summary


This bug report describes a critical risk in the EVM (Ethereum Virtual Machine) code, specifically in the Restore() function. The issue is that the CanTransfer() check is located after the gas consumption portion, which allows a malicious entity to exploit the system and cause honest restoration servers to lose their gas funds. This can happen if the entity creates a large number of accounts and then waits for them to go dormant before creating their own restoration proofs, effectively collecting all the balances into their own account. The bug has been fixed in a recent commit, which moves the CanTransfer() check to before the gas consumption portion in the Restore() function. 

## Details

## Severity: Critical Risk

## Context
`core/vm/evm.go#L813-L862`

## Description
Due to the location of the `CanTransfer()` check in `(evm *EVM) Restore()`, it is possible for a malicious entity to grief honest restoration servers for a significant amount of gas. This can become a more serious issue if a large portion of restoration servers run out of gas and their accounts expire before owners realize. A competing restoration server may want to do this to harm its competition.

An example attack could be a malicious actor creating a large number of accounts (100+) and seeding them all with 10 OVER. It would then need to let some time pass and the accounts go dormant (the longer the accounts are dormant, the larger the restoration proof and the more effective this attack will be). The entity then could create its own restoration proofs with the fees costing the entire 10 OVER for each account. This would effectively collect all of the account balances into its own account. It could wait until it either controls a validator that is the proposer for the next block, or it can use increased priority fees to make sure that its transactions are placed early in the next block. It can send all of its own `restorationTX`'s at the same time that it makes restoration requests to all of the other known restoration servers in the network.

The remaining honest restoration servers will query their local nodes that will not have their state updated yet with the malicious entity's self-created `restorationTX`'s. All checks will pass including `checkFeePayable()` which will see 10 OVER in each account. The honest restoration servers will all create and submit `restorationTX`'s for the 100+ accounts. By the time they are processed by the EVM, the malicious entity's `restorationTX`'s will have already processed and the victim restoration servers' `restorationTX`'s will fail at the requester’s balance check in `(evm *EVM) Restore()`. When this happens, all of the honest restoration servers' gas will be consumed:

```go
// The sender of the restore data has to have enough balance to send the restoration fee
if restoreData.FeeRecipient != nil && restoreData.Fee.Sign() != 0 {
    if !evm.Context.CanTransfer(evm.StateDB, sender, restoreData.Fee) {
        err = ErrInsufficientBalance
    } else {
        evm.Context.Transfer(evm.StateDB, sender, *restoreData.FeeRecipient, restoreData.Fee)
    }
}
if err != nil {
    evm.StateDB.RevertToSnapshot(snapshot)
    if err != ErrExecutionReverted {
        gas = 0
    }
}
```

The result of this attack is that the restoration servers will have their gas funds burned without being able to recoup the fees required to cover their loss. In its current form, the max gas that can be grieved is only limited by the base fee and the size of the proof (length of time the account has been dormant). Using hundreds or thousands of accounts requiring large proofs can enable an attacker to trick honest restoration servers to burn all of their balances in gas.

## Recommendation
Move the following check up to before the gas consumption portion of `(evm *EVM) Restore()`:

```go
if restoreData.SourceEpoch != epochCoverage {
    return nil, gas, ErrInvalidSourceEpoch
}
```

## Overprotocol
Fixed in commit `b4625c76`.

## Spearbit
The Spearbit Review team confirmed that this issue has been mitigated by moving the `CanTransfer()` and `restoreData.SourceEpoch != epochCoverage` checks up to before the gas proof is consumed in `Restore()`. These changes were introduced in commit `b4625c76`.
