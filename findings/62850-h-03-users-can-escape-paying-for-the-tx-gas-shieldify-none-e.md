---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/account
  - sector/bridge
  - sector/token
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
---
# [H-03] Users Can Escape Paying for the TX Gas

- id: 62850
- impact: HIGH
- protocol: [[Etherspot]] Gastankpaymastermodule Extended
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md

## Summary


The current implementation of Paymaster is not taking the amount of gas paid by the paymaster for the transaction execution within the same user transaction. This means that users can withdraw their balance from the GasTank and avoid paying for the gas. To fix this, the team recommends adding a mapping to prevent users from withdrawing their balance if they have unpaid transactions. This will ensure that users cannot escape paying for the gas. The team has fixed this issue.

## Details


## Severity

High Risk

## Description

The current implementation of Paymaster is not taking the amount of gas paid by the paymaster for the tx execution within the same user tx, or before it. It is collected after the execution of the tx.

- `GasTankPaymaster::_validatePaymasterUserOp()` is checking that the verified signer accepts paying for that user
- `GasTankPaymaster::_postOp()` calculates the amount of gas used and emits an event for this

No taking of funds occurs after `_postOp()`, it is designed that Admins will claim the funds by processing `GasTankPaymaster_UserOperationSponsored` event, where they will call `GasTank::repaySponsoredTransaction()` to take ERC20 from the user.

[GasTankPaymaster.sol#L361-L368](https://github.com/etherspot/etherspot-modular-accounts/blob/audit/GTP-CAM-RLV-IM/src/paymaster/GasTankPaymaster.sol#L361-L368)

```solidity
function repaySponsoredTransaction(address _from, uint256 _amount) external onlyOwner {
    if (_from == address(0)) revert GasTankPaymaster_InvalidAddress();
    if (_amount == 0) revert GasTankPaymaster_InvalidAmount();
    if (balances[_from] < _amount) revert GasTankPaymaster_InsufficientBalance(_from, _amount);
    balances[_from] -= _amount;
    balances[feeReceiver] += _amount;
    emit GasTankPaymaster_RepaySponsoredTransaction(_from, _amount);
}
```

But the problem is that the user can simply withdraw all his balance from the `GasTank` and escape paying for the tx gas. where anyUser can call `gasTankWithdraw()` at any time and withdraw all their balance.

## Location of Affected Code

File: [GasTankPaymaster.sol#L347-L353](https://github.com/etherspot/etherspot-modular-accounts/blob/audit/GTP-CAM-RLV-IM/src/paymaster/GasTankPaymaster.sol#L347-L353)

```solidity
function gasTankWithdraw(uint256 _amount) external {
    uint256 currentBalance = balances[msg.sender];
    if (currentBalance < _amount) revert GasTankPaymaster_InsufficientBalance(msg.sender, _amount);
    SafeERC20.safeTransfer(token, msg.sender, _amount);
    balances[msg.sender] = currentBalance - _amount; // Safe due to check above
    emit GasTankPaymaster_Withdrawn(msg.sender, _amount);
}
```

## Impact

- Users can escape paying for the gas paid by the GasTank

## Proof of Concept

- UserA has deposited an amount of tokens into the GasTank
- UserA has submitted an ERC4337 transaction
- off-chain system caught the tx, and will execute it
- Tx has been executed successfully, and GasTank paid for it
- User immediately call `GasTank::gasTankWithdraw()` and withdraw all his tokens
- Admins can't repay the fees to the feeReceiver

## Recommendation

To mitigate the risk, we should prevent the user from withdrawing his balance in case he has some transactions that have not been paid for. It should be like this.

- Add a mapping (user -> isWithdrawPaused)
- `_validatePaymasterUserOp()` will check that `isWithdrawPaused` is false
- `_postOp()` will pause the user (making isWithdrawPaused true)
- `repaySponsoredTransaction()` will reset the user pausing (making isWithdrawPaused false)
- and `gasTankWithdraw()` should prevent withdrawing if user->isWithdrawPaused is true.

This will ensure the user does not withdraw his balance and escape from paying, but this will only work if it is intended for the user to pay for the tx from the same chain. If cross-chain gas is intended to be used where the user can pay from GasTank on Polygon and execute on Arbitrum, for example, then the gas should be taken before executing, or having a system that prevents this can be complex.

## Team Response

Fixed.
