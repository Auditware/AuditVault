---
tags:
  - lang/solidity
  - platform/codehawks
  - severity/high
  - sector/lending
  - sector/nft
  - sector/staking
  - sector/token
protocol: "[[Tadle]]"
auditors:
  - "[[p0wd3r]]"
genome:
  - "[[unchecked-return-value]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Token withdrawal fails until someone manually approves spending

- id: 38072
- impact: HIGH
- protocol: [[Tadle]]
- reporter: p0wd3r (Codehawks)
- source: N/A

## Summary


This bug report discusses an issue with the TokenManager contract in a protocol. The protocol uses this contract to control a capital pool that stores tokens. When a user tries to withdraw tokens, the TokenManager needs to have an allowance from the capital pool, but this is not checked for, causing the withdrawal to fail. This can affect the functionality of the protocol and is considered a medium risk. The bug can be fixed by adding a check and allowance in the TokenManager contract. 

## Details

## Summary

The protocol uses a contract called TokenManager to control a capital pool that stores tokens.

When a user wants to withdraw, the TokenManager needs spender allowance on the capital pool, but this is not checked for, so the withdrawal fails.

## Vulnerability Details

We simulate a user creating an offer, closing it and then trying to withdraw. The withdrawal fails because of zero allowance for the TokenManager as a spender of the capital pool.

```Solidity
function test_token_withdrawal_fails() public {
    // Data for creating an offer, not relevant.
    uint256 points = 1000;
    uint256 amountToken = 1000000 * 1e18;
    uint256 collateralRate = 12000;
    uint256 eachTradeTax = 300;

    vm.startPrank(user);
    preMarktes.createOffer(
        CreateOfferParams(
            marketPlace,
            address(mockUSDCToken),
            points,
            amountToken,
            collateralRate,
            eachTradeTax,
            OfferType.Ask,
            OfferSettleType.Turbo
        )
    );

    // Close the offer.
    address offerAddr = GenerateAddress.generateOfferAddress(0);
    address stockAddr = GenerateAddress.generateStockAddress(0);

    preMarktes.closeOffer(stockAddr, offerAddr);

    tokenManager.withdraw(address(mockUSDCToken), TokenBalanceType.MakerRefund);
    vm.stopPrank();
}
```

> ```Solidity
> ├─ [8858] UpgradeableProxy::withdraw(MockERC20Token: [0xF62849F9A0B5Bf2913b396098F7c7019b51A820a], 4)
> │   ├─ [8339] TokenManager::withdraw(MockERC20Token: [0xF62849F9A0B5Bf2913b396098F7c7019b51A820a], 4) [delegatecall]
> │   │   ├─ [534] TadleFactory::relatedContracts(4) [staticcall]
> │   │   │   └─ ← [Return] UpgradeableProxy: [0x76006C4471fb6aDd17728e9c9c8B67d5AF06cDA0]
> │   │   ├─ [2959] MockERC20Token::transferFrom(UpgradeableProxy: [0x76006C4471fb6aDd17728e9c9c8B67d5AF06cDA0], 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf, 1200000000000000000000000 [1.2e24])
> │   │   │   └─ ← [Revert] ERC20InsufficientAllowance(0x6891e60906DEBeA401F670D74d01D117a3bEAD39, 0, 1200000000000000000000000 [1.2e24])
> │   │   └─ ← [Revert] TransferFailed()
> │   └─ ← [Revert] TransferFailed()
> └─ ← [Revert] TransferFailed()
> ```



## Impact

For every new token whitelisted into the protocol, users will be unable to withdraw them until somebody calls \`\`capitalPool.approve(address(token))\`\`\`. **Because there's a disruption of protocol functionality**, I am reporting this as MEDIUM.

When someone calls the approve, TokenManager gets an allowance of uint.MAX on one of the capital pool's tokens, which means it withdrawals should work for the foreseeable future.

## Tools Used

Forge.

## Recommendations

In TokenManager::withdraw, line 175, before the safe transfer from call, check and add allowance if necessary:

```Solidity
if (IERC20(_tokenAddress).allowance(capitalPoolAddr, address(this)) == 0x0) {
        ICapitalPool(capitalPoolAddr).approve(_tokenAddress);
}
```

By doing that, the withdrawal no longer fails:

```Solidity
[PASS] test_token_withdrawal_fails() (gas: 612289)
```
