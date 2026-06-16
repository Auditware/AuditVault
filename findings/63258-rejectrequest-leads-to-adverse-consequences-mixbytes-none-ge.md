---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Gearbox]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Midas%20Integration/README.md#1-rejectrequest-leads-to-adverse-consequences"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[account-ownership]]"
---
# `rejectRequest()` Leads to Adverse Consequences

- id: 63258
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Midas%20Integration/README.md#1-rejectrequest-leads-to-adverse-consequences

## Summary


The Midas vault admin is facing a bug where if they reject a pending redemption request, the user's mTokens remain locked in the Midas vault. The admin can transfer these tokens back to any address, but there is no way to recover them from the Gateway to the user's credit account. This can lead to serious consequences such as permanently blocked user funds and inflated collateral calculations. The recommendation is to implement functionality to handle these cases and allow the system to clear rejected requests and transfer tokens out of the Gateway. The client and MixBytes have differing opinions on how to handle the issue, but the functionality to manually process rejected requests was added later in response to the bug report.

## Details

##### Description
If the Midas vault admin calls `rejectRequest()` on a pending redemption request, the request status is set to **Cancelled** and the user's mTokens remain locked in the Midas vault. The Midas admin can transfer these mTokens back to any address, especially to the Gateway (which created the request). However, even if mTokens are transferred back to the Gateway, there's no mechanism to recover them from the Gateway to the user's credit account. 

Additionally, if mTokens are sent to the credit account or any address other than the Gateway, `MidasRedemptionVaultGateway.pendingTokenOutAmount()` will continue to show a non-zero result despite the request being rejected, inflating the phantom token's balance and the credit account's collateral value.

This issue is classified as **High** severity because, despite being caused by the Midas admin, it can lead to several serious consequences: permanently blocked user funds, inability to recover mTokens from the Gateway, and inflated collateral calculations.

##### Recommendation
We recommend implementing functionality to handle such cases, allowing the system to clear rejected requests and transfer tokens out of the Gateway.

> **Client's Commentary**
Client: When designing the gateway, we focused on being able to gracefully resolve issues arising from `rejectRequest()` that can negatively affect borrowers and LPs. In particular, there is no way to solve Midas transferring assets to the gateway without introducing strong new trust assumptions, as the Gateway may hold processed withdrawals from other users and a generic token transfer function would allow the authorized party to take their withdrawals. At the same time, transferring to the gateway would be an error by Midas that does not affect users (or rather, does not affect them further if `rejectRequest` already was called) - this is analogous to Midas accidentally transferring to any other unrecoverable address, such as address(0).
The gateway has functionality that allows to manually process a request inside the gateway if the request was rejected on the Midas side. This allows the market curator to collaborate with Midas to recover a withdrawal without additional friction to the Credit Account owner in order to correct the mistake (as calling `rejectRequest` for a gateway withdrawal would always be accidental).
As for account value inflation - this can simply be solved by proper monitoring and adjustment of risk parameters. In case a request rejection to the gateway is detected, the withdrawal phantom token can be forbidden, effectively disallowing any further borrows or withdrawals on the account while the phantom token is enabled as collateral on it - this nullifies any possible attack vectors from the troubled account. From there, there are several ways to correct the issue - the account owner can either cooperate with Midas and the market owner to process the withdrawal properly through the gateway, or they can close the account and recover the funds transferred from Midas, at which point the Gearbox DAO can take the account out of the Account Factory to prevent further use.
With all this in mind, we believe that currently the gateway design strikes a good balance between complexity and ability to resolve issues stemming from incorrect behavior from Midas, and see no further reason to modify it.
MixBytes: The functionality, which allows manual processing of rejected requests, was not present in the initial commit - it was added later in response to the issue report. Therefore, the issue was marked as fixed.

---
