---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[tjonair]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# H-3: `Borrowing::redeemYields` debits `ABOND` from `msg.sender` but redeems to `user` using `ABOND.State` data from `user`

- id: 45456
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: tjonair (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the `redeemYields` function in the `Borrowing` contract. This function incorrectly debits `ABOND` from the `msg.sender` instead of the `user` and uses the `user`'s data to calculate the amount to be withdrawn from an external protocol. This allows an attacker to repeatedly purchase `ABOND` and redeem yields from the `user` without debiting from their account. The root cause is a mistake in the code where the `msg.sender` is used instead of the `user`. The impact of this bug is that the ETH deposited in the external protocol can be drained and the value of `ABOND` will decrease. The report suggests enforcing `msg.sender` to be equal to `user` as a mitigation.

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/271 

## Found by 
0x73696d616f, RampageAudit, kenzo123, santiellena, super\_jack, t.aksoy, tjonair, volodya

### Summary

`Borrowing::redeemYields` debits `ABOND` from `msg.sender` (which updates its state), but uses the information of the `user` passed to calculate the amount to be withdrawn from the external protocol to send to the `user`. This allows an attacker to have one address with `ABOND` recently purchased (`msg.sender`), redeem yield to `user` using `user` `ABOND.State` data (`ethBacked` and `cumulativeRate`). As the debit occurs to `msg.sender` address, the attacker can repeatedly buy `ABOND` in an external market and redeem yields from `user` without debiting from `user`.

### Root Cause

The `Borrowing::redeemYields` function, receives as parameters `address user, uint128 aBondAmount` and calls the `BorrowLib::redeemYields` function:

First, the function incorrectly checks if the `user` has enough `ABOND` balance when it should check if `msg.sender` enough balance:
[BorrowLib.sol#L990-L992](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/lib/BorrowLib.sol#L990-L992)
```solidity
State memory userState = abond.userStates(user);
// check user have enough abond
if (aBondAmount > userState.aBondBalance) revert IBorrowing.Borrow_InsufficientBalance();
```

Then, it calculates the amount of `USDa` that has to burn, and the amount to send to `user` for the liquidation earnings of the protocol.

Finally, the `Treasury::withdrawFromExternalProtocol` function is called with `user` and `abondAmount` as parameters:
[BorrowLib.sol#L1028-L1029](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/lib/BorrowLib.sol#L1028-L1029)
```solidity
// withdraw eth from ext protocol
uint256 withdrawAmount = treasury.withdrawFromExternalProtocol(user,aBondAmount);
```

Going through the `Treasury::withdrawFromExternalProtocol`:
[Treasury.sol#L283-L296](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Core_logic/Treasury.sol#L283-L296)
```solidity
    function withdrawFromExternalProtocol(
        address user,
        uint128 aBondAmount
    ) external onlyCoreContracts returns (uint256) {
        if (user == address(0)) revert Treasury_ZeroAddress();
        
        // Withdraw from external protocols
        uint256 redeemAmount = withdrawFromIonicByUser(user, aBondAmount);
        // Send the ETH to user
        (bool sent, ) = payable(user).call{value: redeemAmount}("");
        // check the transfer is successfull or not
        require(sent, "Failed to send Ether");
        return redeemAmount;
    }
```

The `redeemAmount` of ETH got in `Treasury::withdrawFromIonicByUser` is sent to the `user`:
[Treasury.sol#L703-L724](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Core_logic/Treasury.sol#L703-L724)
```solidity
    function withdrawFromIonicByUser(
        address user,
        uint128 aBondAmount
    ) internal nonReentrant returns (uint256) {
        uint256 currentExchangeRate = ionic.exchangeRateCurrent();
        uint256 currentCumulativeRate = _calculateCumulativeRate(currentExchangeRate, Protocol.Ionic);
        
        State memory userState = abond.userStates(user);
        uint128 depositedAmount = (aBondAmount * userState.ethBacked) / PRECISION;
        uint256 normalizedAmount = (depositedAmount * CUMULATIVE_PRECISION) / userState.cumulativeRate;
        
        //withdraw amount
        uint256 amount = (currentCumulativeRate * normalizedAmount) / CUMULATIVE_PRECISION;
        // withdraw from ionic
        ionic.redeemUnderlying(amount);
        
        protocolDeposit[Protocol.Ionic].totalCreditedTokens = ionic.balanceOf(address(this));
        protocolDeposit[Protocol.Ionic].exchangeRate = currentExchangeRate;
        // convert weth to eth
        WETH.withdraw(amount);
        return amount;
    }
```

As it can be seen, the `amont` is calculated with `userState` data of the user. That data is stored in the `ABOND` contract. After this redeem, the `ethBacked` of the user should be zero because it is withdraw.

However, the account that gets its `ABOND` debited and thus its `ethBacked` and `cumulativeRate` data set to zero is the `msg.sender`, and not the `user`.
[BorrowLib.sol#L1032](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/lib/BorrowLib.sol#L1032)
```solidity
bool success = abond.burnFromUser(msg.sender, aBondAmount);
```

[Abond_Token.sol#L172-L184](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Token/Abond_Token.sol#L172-L184)
```solidity
    function burnFromUser(
        address to,
        uint256 amount
    ) public onlyBorrowingContract returns (bool) {
        //get the state
        State memory state = userStates[to];
        // update the state
        state = Colors._debit(state, uint128(amount));
        userStates[to] = state;
        // burn abond
        burnFrom(to, amount);
        return true;
    }
```

[Colors.sol#L41-L60](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/lib/Colors.sol#L41-L60)
```solidity
    function _debit(
        State memory _fromState,
        uint128 _amount
    ) internal pure returns(State memory) {
    
        uint128 balance = _fromState.aBondBalance;
        
        // check user has sufficient balance
        require(balance >= _amount,"InsufficientBalance");
        
        // update user abond balance
        _fromState.aBondBalance = balance - _amount;
        
        // after debit, if abond balance is zero, update cr and eth backed as 0
        if(_fromState.aBondBalance == 0){
            _fromState.cumulativeRate = 0;
            _fromState.ethBacked = 0;
        }
        return _fromState;
    }
```

As can be seen, the address that gets its state modified is `msg.sender` and not `user`.

### Internal pre-conditions

The following conditions are not a restriction, with just time and funds it can be done.
- An old position of `ABOND` with `ethBacked`.
- Another account owning some `ABOND` (acquired in the protocol or purchased in an external market).

### External pre-conditions

None

### Attack Path

- The attacker deposits a big amount of ETH in the `Borrowing` contract.
- The attacker withdraws that deposit receiving `ABOND` (which is backed by ETH deposited in another protocol)
- The attacker wait until the `cumulativeRate` is significant.
- The attacker purchases with another address some `ABOND`
- The attacker calls `Borrowing::redeemYields` with the `user` parameter set as the first address that deposited in step 1.

### Impact

-  The ETH deposited in the external protocol that backs `ABOND` can be completely drained.
- `ABOND` value will fall to zero as there won't be ETH to redeem it for.

### PoC

None

### Mitigation

Enforce `msg.sender` to be equal to `user`.
