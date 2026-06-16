---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/access-control/fake-account-substitution
  - trigger/time-based/epoch-boundary
  - misassumption/admin-is-honest
  - fix/add-access-control
  - sector/insurance
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-Security-Review-June-2024.pdf"
genome:
  - "[[fake-account-substitution]]"
  - "[[epoch-boundary]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
---
# Precisely timed malicious restoration requests can grieve restoration servers

- id: 36775
- impact: HIGH
- protocol: [[Overprotocol]]
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-Security-Review-June-2024.pdf

## Summary


This bug report discusses a high-risk issue in the core code of a virtual machine. The problem is that there is no check to ensure that a specific account exists before executing a restoration transaction. This can lead to a timing attack where a malicious account can cause a legitimate restoration server to use all of its gas without repercussions. The recommendation is to implement a check to make sure the account exists before executing the transaction. This issue has been fixed in the latest commit.

## Details

## Severity: High Risk

## Context
core/vm/evm.go#L821-L826

## Description
In order to execute a restoration transaction, the `restoreDataSigner.Sender` account that signed and sent the restoreData request must have sufficient balance to cover the fee. However, there is no check to make sure that the `restoreDataSigner.Sender` account actually exists in the current state. If that account has been expired from the state, the transaction will fail upon checking `CanTransfer`, and the gas paid by the honest restoration server will be burned without any repercussions to the `restoreDataSigner.Sender` account. 

Therefore, it is possible to execute a timing attack where the `restoreDataSigner.Sender` account exists when the restoration server verifies a request but then expires from the state before the restoration transaction gets executed in the EVM.

For example, I have an account we'll call "malicious account" that has been inactive for `2*SweepEpoch - 1` blocks. This account will expire on the next epoch. In the last slot of that epoch before expiration, the "malicious account" will sign and send a valid restoreData request for any expired account to an honest restoration server. The restoration server will generate the valid proof and send a valid restoration transaction for this request. By the time this restoration transaction gets executed in the EVM (which would be in the next slot), the "malicious account" will have expired. The "malicious account" will not have to pay any fee while costing the restoration server all of the gas of the transaction, which could be made to be very large.

If this got scaled up, similar to a scenario described in the issue "A malicious entity can grieve OVER network Restoration Servers for their funds", then this could cause some problems. Though this scenario is similar, the source and trigger of the vulnerability is unique and requires its own solution. It is also a more constrained attack scenario, requiring correct timing on the epoch boundary. But each slot is 12 seconds, and I believe that is plenty of time to execute this with reasonable expectations of success.

## Recommendation
If the `restoreDataSigner.Sender` account is not the same as the `restoreData.Target` account, then implement a check to make sure the `restoreDataSigner.Sender` account exists in the current state.

```go
sender, err := restoreDataSigner.Sender(restoreData)
if err != nil {
    return nil, 0, err
}

// Retrieve and get the current state of the target account
target := restoreData.Target

// Check sender exists in current state if it's not the restoration target.
if sender != target {
    if !evm.StateDB.Exist(sender) {
        return nil, gas, ErrNonexistentSender
    }
}
```

Though unnecessary, you could replace the `!evm.StateDB.Exist(sender)` with `!evm.Context.CanTransfer(evm.StateDB, sender, restoreData.Fee)` for the additional assurance that it can do the transfer.

## Overprotocol
Fixed in commit b4625c76.

## Spearbit
The Spearbit Review team confirmed that this issue is mitigated by checking if the sender can pay the restoration fee before performing the transaction. This check is at core/vm/evm.go#L806-L810 and was introduced in commit b4625c76.
