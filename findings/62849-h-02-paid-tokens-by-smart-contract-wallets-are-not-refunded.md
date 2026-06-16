---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Paid Tokens by Smart Contract Wallets Are Not Refunded When Cancelling Invoice

- id: 62849
- impact: HIGH
- protocol: [[Etherspot]] Gastankpaymastermodule Extended
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md

## Summary


The bug report describes an issue where the smart wallet is not able to claim tokens and credit them to an invoice. This is due to an expiration of the session and a failure to check if the tokens have already been claimed. As a result, the smart wallet is not able to settle the invoice and refund the money it paid. The team has recommended implementing invoice locked tokens and returning the amount to the original smart wallet. This issue has been fixed by the team.

## Details


## Severity

High Risk

## Description

When processing the claiming process, the smart wallet pays for the amount of token locked and sends it to the `InvoiceManager` contract. In order for the claiming to occur, the session should not have expired, and it should not have already claimed tokens.

After sending tokens, we call `InvoiceManager::creditTokensToInvoice()`, which increases `creditedAmount` for that token.

File: [CredibleAccountModule.sol#L731-L732](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/modules/validators/CredibleAccountModule.sol#L731-L732)

```solidity
function claim(address _sessionKey, address _token, uint256 _amount) external nonReentrant returns (bool) {
    // code
    if (!sd.live || block.timestamp < sd.validAfter || block.timestamp > sd.validUntil) {
        revert CredibleAccountModule_SessionKeyDoesNotExist(_sessionKey);
    }
    // code
    for (uint256 i; i < tokenLength;) {
        if (tokens[i].token == _token) {
            // code
>>          IERC20(_token).safeTransferFrom(wallet, invoiceManager, _amount);
>>          IInvoiceManager(invoiceManager).creditTokensToInvoice(_sessionKey, _token, _amount);
            return true;
        }
        unchecked {
            ++i;
        }
    }
    // code
}
```

File: [src/invoice_manager/InvoiceManager.sol#L221](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/invoice_manager/InvoiceManager.sol#L221)

```solidity
function creditTokensToInvoice(address _sessionKey, address _token, uint256 _amount) external onlyRole(CREDIBLE_ACCOUNT_ROLE) {
    //code

    // 4. If checks passed, then attribute to the invoice
>>  tokenData[tokenIndex].creditedAmount = newCreditedAmount;
    emit TokensCreditedToInvoice(_sessionKey, _token, _amount);
}
```

In order for the Invoice to get settled, all tokens in that Invoice should be credited so that the settlement process can occur.

File: [InvoiceManager.sol#L159-L165](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/invoice_manager/InvoiceManager.sol#L159-L165)

```solidity
function settleInvoice(address _sessionKey) external onlySettlerOrLinkedWallet(_sessionKey) nonReentrant {
    // code
    for (uint256 i; i < tokensLength; ++i) {
>>  if (tokens[i].creditedAmount != tokens[i].amount) {
            revert IM_InvoiceNotFullyCredited(
                _sessionKey, tokens[i].token, tokens[i].amount, tokens[i].creditedAmount
            );
        }
    }

    // code
}
```

So, in case the session expired and there were still one or more tokens not getting claimed. We will not be able to claim them from `CredibleAccountModule` or credit them on `InvoiceManager`.

Admins can handle this, where they can delete any Invoice they want in case of any error occurring, or unfulfillment, but the problem is that when deleting the Invoice, the SCW does not refund the money it paid.

File: [InvoiceManager.sol#L232-L245](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/invoice_manager/InvoiceManager.sol#L232-L245)

```solidity
function cancelInvoice(address _sessionKey, string calldata _reason) external onlyRole(SETTLER_ROLE) {
    Invoice storage invoice = invoices[_sessionKey];
    if (invoice.createdAt == 0) revert IM_InvoiceNotFound();

    bytes32 bidHash = invoice.data.bidHash;
    address solver = invoice.data.solver;

    delete invoices[_sessionKey];
    delete invoiceTokenData[_sessionKey];
    delete bidHashToSessionKey[bidHash];
    _removeSolverInvoice(solver, _sessionKey);

    emit InvoiceCancelled(_sessionKey, _reason);
}
```

Since the Invoice is for cross-chain payment, after it is settled and sent to Solver. It will handle the payment for the SCW on the destination chain. In case of non-full settlement, the funds should be refunded to the sender on the Source chain.

## Location of Affected Code

File: [InvoiceManager.sol#L232-L245](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/invoice_manager/InvoiceManager.sol#L232-L245)

```solidity
function cancelInvoice(address _sessionKey, string calldata _reason) external onlyRole(SETTLER_ROLE) {
    Invoice storage invoice = invoices[_sessionKey];
    if (invoice.createdAt == 0) revert IM_InvoiceNotFound();

    bytes32 bidHash = invoice.data.bidHash;
    address solver = invoice.data.solver;

    delete invoices[_sessionKey];
    delete invoiceTokenData[_sessionKey];
    delete bidHashToSessionKey[bidHash];
    _removeSolverInvoice(solver, _sessionKey);

    emit InvoiceCancelled(_sessionKey, _reason);
}
```

## Impact

Smart Wallets will not take the money they paid in case the Invoice got cancelled and they paid part of it

## Recommendation

We should go for the invoice locked tokens, and in case it is credited, the `amount` should be returned to the original `SmartWallet` (it is stored in the `InvoiceData` struct.

## Team Response

Fixed.
