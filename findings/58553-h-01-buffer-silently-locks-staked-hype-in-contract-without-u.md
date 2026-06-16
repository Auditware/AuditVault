---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - platform/code4rena
protocol: "[[Kinetiq]]"
auditors:
  - zhaojohnson
report: "https://code4rena.com/reports/2025-04-kinetiq"
genome:
  - "[[reward-accounting]]"
  - "[[dos/lockup]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] Buffer Silently Locks Staked HYPE in Contract Without Using Them For Withdrawals Or Providing A Way To Be Pulled Out Or Moved To L1

- id: 58553
- impact: HIGH
- protocol: Kinetiq
- reporter: zhaojohnson (Code4rena)
- source: https://code4rena.com/reports/2025-04-kinetiq

## Summary


This bug report discusses an issue with the Staking Manager contract in the Kinetiq project. The problem occurs when a user queues a withdrawal for their HYPE tokens, but then cancels it before the withdrawal is complete. This results in a loss of HYPE tokens, as they are not returned to the user or moved to the L1 layer of the project. The recommended mitigation steps include either reducing the target buffer to zero or using the `redelegateWithdrawnHYPE` function to move the cancelled withdrawals back to the protocol.

## Details



<https://github.com/code-423n4/2025-04-kinetiq/blob/7f29c917c09341672e73be2f7917edf920ea2adb/src/StakingManager.sol# L946-L957>

<https://github.com/code-423n4/2025-04-kinetiq/blob/7f29c917c09341672e73be2f7917edf920ea2adb/src/StakingManager.sol# L919-L941>

<https://github.com/code-423n4/2025-04-kinetiq/blob/7f29c917c09341672e73be2f7917edf920ea2adb/src/StakingManager.sol# L519-L533>

### Finding description and impact

When users stake into the Staking Manager and get their KHYPE tokens, after earning some rewards they might want to queue a withdrawal to get their HYPE tokens back. While the queued withdrawal delay is on, the user can decide to `cancelWithdrawal` and get their KHYPE tokens back. The way the buffer is handled in this flow leads to locking of HYPE in the staking manager contract.

Take for example a target buffer of `30 HYPE` with only `20 HYPE` left in the buffer, the user has initially staked some HYPE and gotten some KHYPE.

The user wishes to cash in that KHYPE worth `15 HYPE`, now the buffer can satisfy this amount of HYPE, so they’ll need to withdraw from the validator on L1. You can see this in the `_withdrawFromValidator` function UserWithdrawal operation type below.
```

    if (operationType == OperationType.UserWithdrawal) {
            // Buffer handling uses 18 decimal precision
            uint256 currentBuffer = hypeBuffer;
            uint256 amountFromBuffer = Math.min(amount, currentBuffer);

            if (amountFromBuffer > 0) {
                hypeBuffer = currentBuffer - amountFromBuffer;
                amount -= amountFromBuffer;
                emit BufferDecreased(amountFromBuffer, hypeBuffer);
            }

            // If fully fulfilled from buffer, return
            if (amount == 0) {
                return;
            }
        }
```

So the buffer reduces to `5 HYPE`(even though the contract still has the remaining `15 HYPE` because the transfer hasn’t occurred yet) and the withdrawal amount is fully satisfied, with the withdrawal request being created. Ideally, the user now has to wait the withdrawal delay and confirm their withdrawal but if at some point during the withdrawal delay, the user decides to cancel their withdrawal and keep their KHYPE tokens. We can observe the function below.
```

   function cancelWithdrawal(address user, uint256 withdrawalId) external onlyRole(MANAGER_ROLE) whenNotPaused {
        WithdrawalRequest storage request = _withdrawalRequests[user][withdrawalId];
        require(request.hypeAmount > 0, "No such withdrawal request");

        uint256 hypeAmount = request.hypeAmount;
        uint256 kHYPEAmount = request.kHYPEAmount;
        uint256 kHYPEFee = request.kHYPEFee;

        // Check kHYPE balances
        require(kHYPE.balanceOf(address(this)) >= kHYPEAmount + kHYPEFee, "Insufficient kHYPE balance");

        // Clear the withdrawal request
        delete _withdrawalRequests[user][withdrawalId];
        totalQueuedWithdrawals -= hypeAmount;

        // Return kHYPE tokens to user (including fees)
        kHYPE.transfer(user, kHYPEAmount + kHYPEFee);

        // Track cancelled amount for future redelegation
        _cancelledWithdrawalAmount += hypeAmount;

        emit WithdrawalCancelled(user, withdrawalId, hypeAmount, _cancelledWithdrawalAmount);
    }
```

There is no update to increment the buffer back after the withdrawal has been canceled, so the `15 HYPE` tokens are stored in the balance and are tracked in the `_cancelledWithdrawalAmount` which eventually can be moved via the `redelegateWithdrawnHYPE` function below.
```

    function redelegateWithdrawnHYPE() external onlyRole(MANAGER_ROLE) whenNotPaused {
        require(_cancelledWithdrawalAmount > 0, "No cancelled withdrawals");
        require(address(this).balance >= _cancelledWithdrawalAmount, "Insufficient HYPE balance");

        uint256 amount = _cancelledWithdrawalAmount;
        _cancelledWithdrawalAmount = 0;

        // Delegate to current validator using the SpotDeposit operation type
        _distributeStake(amount, OperationType.SpotDeposit);

        emit WithdrawalRedelegated(amount);
    }
```

Now we can see that the function calls the distributeStake internal function with a spot deposit operation type and it resets the `_cancelledWithdrawableAmount` to 0, meaning the `15 HYPE` that was initially taken from the buffer and canceled is no longer accounted for because it’s going to be redelegated to the validators.
```

    else if (operationType == OperationType.SpotDeposit) {
        // For spot deposits, first move from spot balance to staking balance
        uint256 truncatedAmount = _convertTo8Decimals(amount, false);
        require(truncatedAmount <= type(uint64).max, "Amount exceeds uint64 max");

        // 1. First move from spot balance to staking balance using cDeposit
        l1Write.sendCDeposit(uint64(truncatedAmount));

        // 2. Queue the delegation operation (8 decimals)
        _queueL1Operation(validator, truncatedAmount, OperationType.RebalanceDeposit);
    }
```

This basically converts the amount to 8 decimals and moves it from the spot balance in L1 to the staking balance. Now the issue arises from the fact that the withdrawn funds were taken from the buffer and the withdrawal amount never got to L1. My understanding of the connection between the HYPER core and EVM is that the funds need to be moved first to L1 as with the user deposit operation with the logic below before being moved from spot to staking balance on L1.
```

    (bool success,) = payable(L1_HYPE_CONTRACT).call{value: amount}("");
    require(success, "Failed to send HYPE to L1");
```

Hence the `15 HYPE` gets lost in the process and it can be repeated over and over again.

### Recommended Mitigation Steps

Ensure that when the the canceled withdrawn amount is taken from the buffer, the buffer is either re-bumped or the assets are first moved to L1 to avoid being locked in the staking manager contract.

**Kinetiq disputed and commented:**

> We can reduce the target buffer to zero to clear it as withdrawal liquidity.
>
> Alternatively we are able to redelegate those cancelled withdrawals back to protocol by using `redelegateWithdrawnHYPE`.

---


