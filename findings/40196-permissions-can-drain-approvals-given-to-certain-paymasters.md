---
tags:
  - lang/solidity
  - sector/account
  - sector/options
  - sector/token
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Coinbase Session Keys]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Coinbase-Session-Keys-Spearbit-Security-Review-September-2024.pdf"
genome:
  - "[[missing-signer]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
---
# Permissions can drain approvals given to certain paymasters

- id: 40196
- impact: HIGH
- protocol: [[Coinbase Session Keys]]
- reporter: Chinmay Farkya (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Coinbase-Session-Keys-Spearbit-Security-Review-September-2024.pdf

## Summary


The Smart Wallet Permissions system has a bug where a non-allowlisted paymaster can be used during the validation phase of a transaction, even though it will fail later on. This can result in unauthorized paymasters draining the account's pre-approved balance. The recommended fix is to move the paymaster allowlist check to the validation phase, but this may require a refactor and re-audit. A temporary fix has been implemented in PR 53, but Coinbase is exploring other options for a more permanent solution. Additionally, PR 54 has been added to prevent similar issues in future permission contracts.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
The Smart Wallet Permissions system requires all user operations to utilize an allowlisted paymaster. This is because without this requirement, a permission could arbitrarily use the Smart Wallet’s ETH for gas fees, which would increase the trust needed for each permission.

Currently, paymaster allowlisting is enforced via the `isPaymasterEnabled` mapping, which is checked in the `beforeCalls()` function:

```solidity
function beforeCalls(Permission calldata permission, address paymaster, address userOpCosigner) 
external 
whenNotPaused 
{
    //...
    if (!isPaymasterEnabled[paymaster]) revert DisabledPaymaster(paymaster);
    // ...
}
```

Note that the `beforeCalls()` function is invoked during the execution phase of the user operation, which implies a non-allowlisted paymaster can successfully pass the `validateUserOp()` step of the ERC-4337 transaction. This poses a problem because some paymasters are authorized to debit the account as long as the validation phase succeeds.

For example, some ERC20 paymasters are designed to withdraw ERC20 tokens from the account in exchange for covering transaction fees. These paymasters will always charge the account if the validation phase succeeds, regardless of whether the execution phase is successful.

As a result, if an account has pre-approved a paymaster outside of the Smart Wallet Permissions system, any of its permissions could potentially drain the pre-approved balance. This would be achieved by using the paymaster during the validation phase, even though it will fail the `beforeCalls()` step later. Since the paymaster would still charge the user, and since the permission could set excessively high gas costs, the account’s balance that it has pre-approved could be drained quickly.

Note that this behavior is not preventable by the cosigner, since the cosigner check is also in the execution phase.

## Recommendation
Consider moving the paymaster allowlist check into the validation phase. Since the `isPaymasterEnabled` mapping would violate the ERC-4337 storage rules during the validation step, this change would require a refactor of the paymaster check. One possible approach is to include the allowed paymaster as a field in the `Permission` struct.

## Coinbase
One possible fix for the core issue has been implemented in PR 53. Also, an additional safeguard for ensuring the paymaster is non-zero in `isValidSignature()` has been added in PR 54.

## Spearbit
Verified. The fix in PR 53 has changed the cosigner address into an immutable variable, allowing the cosigner check to be moved into the validation stage. As a result, as long as the cosigner correctly only signs user operations with approved paymasters, the validation step will not pass with any unauthorized paymasters. This resolves the core issue. After a discussion with the Coinbase team, this fix was verified as a potential solution but may not be the final change chosen. Coinbase is exploring other options that may involve larger refactors and potential re-audits.

The fix in PR 54 will help prevent similar issues in future permission contracts that don't enforce a paymaster.
