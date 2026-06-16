---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/nft
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Fluid]]"
auditors:
  - "[[0x04]]"
  - "[[0x23r0]]"
  - "[[0x37]]"
  - "[[0xBoraichoT]]"
  - "[[0xCrypt0nite]]"
  - "[[0xSeerBear]]"
  - "[[0xShoonya]]"
  - "[[0xastronatey]]"
  - "[[0xbzbee42]]"
  - "[[0xpetern]]"
  - "[[AV]]"
  - "[[Baazigar]]"
  - "[[Bigsam]]"
  - "[[Billy19d]]"
  - "[[Bizarro]]"
  - "[[Blackdruid]]"
  - "[[BogdanCastraveti]]"
  - "[[Draxen]]"
  - "[[EddiePumpin]]"
  - "[[Edoscoba]]"
  - "[[ElmInNyc99]]"
  - "[[Frontrunner]]"
  - "[[I1iveF0rTh1Sh1t]]"
  - "[[Icon_0x]]"
  - "[[Leaningone]]"
  - "[[Merlinsan]]"
  - "[[Proof-of-Spirit]]"
  - "[[Riceee]]"
  - "[[Ridden5839]]"
  - "[[SecurityAgentOZ]]"
  - "[[Thisisit]]"
  - "[[Waydou]]"
  - "[[Wojack]]"
  - "[[ZeroTrust]]"
  - "[[axelot]]"
  - "[[botdidy]]"
  - "[[bratwork]]"
  - "[[crab0saurus]]"
  - "[[crunter]]"
  - "[[elolpuer]]"
  - "[[ff4de]]"
  - "[[fgh56ty]]"
  - "[[fuzious]]"
  - "[[gabkov]]"
  - "[[gh0xt]]"
  - "[[hirusha]]"
  - "[[i-am-kuldeep]]"
  - "[[iamephraim]]"
  - "[[lanrebayode77]]"
  - "[[legat]]"
  - "[[luc1jan]]"
  - "[[maigadoh]]"
  - "[[neeloy]]"
  - "[[nonso72]]"
  - "[[oct0pwn]]"
  - "[[pranamya]]"
  - "[[rajatbeladiya]]"
  - "[[slowpoke]]"
  - "[[thimthor]]"
  - "[[vivekd]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2026-01-fluid-dex-v2-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# H-1: User can steal funds using `_processNormalSupplyAction` uncapped withdrawal

- id: 65649
- impact: HIGH
- protocol: [[Fluid]] DEX v2
- reporter: 0xSeerBear (Sherlock)
- source: N/A

## Summary


This bug report is about a problem found in a piece of code that helps with lending and borrowing money. The problem is that the code does not limit the amount of money a user can withdraw based on how much they have already supplied. This means that users can withdraw more money than they have put in, which can cause the system to lose money. This bug was found by a group of people and they have provided an example of how it can be exploited. The impact of this bug is that users can take out more money than they have put in, causing the system to lose money. To fix this, the code needs to be changed to limit the amount of money a user can withdraw based on how much they have already supplied.

## Details


Source: https://github.com/sherlock-audit/2026-01-fluid-dex-v2-judging/issues/610 

## Found by 
0x04, 0x23r0, 0x37, 0xBoraichoT, 0xCrypt0nite, 0xSeerBear, 0xShoonya, 0xastronatey, 0xbzbee42, 0xpetern, AV, Baazigar, Bigsam, Billy19d, Bizarro, Blackdruid, BogdanCastraveti, Draxen, EddiePumpin, Edoscoba, ElmInNyc99, Frontrunner, I1iveF0rTh1Sh1t, Icon\_0x, Leaningone, Merlinsan, Proof-of-Spirit, Riceee, Ridden5839, SecurityAgentOZ, Thisisit, Waydou, Wojack, ZeroTrust, axelot, botdidy, bratwork, crab0saurus, crunter, elolpuer, ff4de, fgh56ty, fuzious, gabkov, gh0xt, hirusha, i-am-kuldeep, iamephraim, lanrebayode77, legat, luc1jan, maigadoh, neeloy, nonso72, oct0pwn, pranamya, rajatbeladiya, slowpoke, thimthor, vivekd, xiaoming90

### Summary

In [`contracts/protocols/moneyMarket/core/operateModule/helpers.sol`](https://github.com/sherlock-audit/2026-01-fluid-dex-v2/blob/52ec6be99521c26ecb433c92ec9e1fb18c380a4a/fluid-contracts/contracts/protocols/moneyMarket/core/operateModule/helpers.sol#L459), `_processNormalSupplyAction` caps the `withdrawalAmountRaw` to the `totalRawSupply` of the user's position, but does not cap the user's withdrawal amount specified (`supplyAmount`) based on the `totalRawSupply` of the user's position (the amount user has previously supplied).

Hence, users can withdraw more than they supplied, protocol loss of funds.

### Root Cause

In [`contracts/protocols/moneyMarket/core/operateModule/helpers.sol`](https://github.com/sherlock-audit/2026-01-fluid-dex-v2/blob/52ec6be99521c26ecb433c92ec9e1fb18c380a4a/fluid-contracts/contracts/protocols/moneyMarket/core/operateModule/helpers.sol#L459), `_processNormalSupplyAction` caps the `withdrawalAmountRaw` to the `totalRawSupply` of the user's position, but does not cap the user's withdrawal amount specified (`supplyAmount`) based on the `totalRawSupply` of the user's position (the amount user has previously supplied).

```javascript
            if (supplyAmount_ == type(int256).min) {
                ...<SNIP>...
            } else {
                withdrawAmountRaw_ = (((uint256(-supplyAmount_) * LC.EXCHANGE_PRICES_PRECISION) + 1) / supplyExchangePrice_) + 1; // rounded up so protocol is on the winning side
@>              if (withdrawAmountRaw_ > tokenRawSupply_) withdrawAmountRaw_ = tokenRawSupply_; // added this check for safety
            }
```

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

Conditions of example:
1. Current `supplyExchangePrice` is 1e12

Example:
1. User creates a normal supply position and supplies a minimum amount (e.g. 1e6) of tokens. `tokenRawSupply` of user's `_positionData` is populated as follows. User now has an NFT and a position in the NFT
```javascript
// tokenRawSupply_ = ((uint256(supplyAmount_) * LC.EXCHANGE_PRICES_PRECISION) - 1) / supplyExchangePrice_;
// if (tokenRawSupply_ > 0) tokenRawSupply_ -= 1;

_positionData[][].tokenRawSupply = (((1e6 * 1e12) - 1) / 1e12) - 1 = 999998
```

2. User withdraws from the above position with `supplyAmount` of -1000e18 (or any amount > type(int256).min). This is more than what the user has supplied. In `_processNormalSupplyAction`, `withdrawAmountRaw_` is greater than `totalRawSupply` of the user's position, so it will be capped, and `_updateStorageForWithdraw` deletes user's `_positionData`. 

```javascript
// if (supplyAmount_ == type(int256).min) {
// } else {
//     withdrawAmountRaw_ = (((uint256(-supplyAmount_) * LC.EXCHANGE_PRICES_PRECISION) + 1) / supplyExchangePrice_) + 1;
//     if (withdrawAmountRaw_ > tokenRawSupply_) withdrawAmountRaw_ = tokenRawSupply_;
// }

withdrawAmountRaw_ = (((-(-1000e18) * 1e12) + 1) / 1e12) + 1 
                   = 1000000000000000000001
                   = 999998 // capped to user's totalRawSupply
```

3. However, `supplyAmount` is not correspondingly capped based on the `totalRawSupply` of the user's position. Thereafter, `_processNormalSupplyAction` calls `LIQUIDITY.operate` to transfer 1000e18 of tokens to user.

```javascript
LIQUIDITY.operate(token_, supplyAmount_, 0, to_, address(0), abi.encode(MONEY_MARKET_IDENTIFIER, NORMAL_WITHDRAW_ACTION_IDENTIFIER));
// supplyAmount not capped based on `totalRawSupply` of the user's position
// supplyAmount is still -1000e18 at this point
```

4. User supplied 1e6 tokens but withdraws 1000e18 tokens. User withdraws more than they supplied, protocol loss of funds.

### Impact

1. User withdraws more than they supplied
2. Protocol loss of funds 

### PoC

Refer attack path

### Mitigation

If `withdrawAmountRaw_` exceed `tokenRawSupply_`, cap the `supplyAmount` based on the `tokenRawSupply_`

```diff
            } else {
                withdrawAmountRaw_ = (((uint256(-supplyAmount_) * LC.EXCHANGE_PRICES_PRECISION) + 1) / supplyExchangePrice_) + 1; // rounded up so protocol is on the winning side
-               if (withdrawAmountRaw_ > tokenRawSupply_) withdrawAmountRaw_ = tokenRawSupply_; // added this check for safety
+               if (withdrawAmountRaw_ > tokenRawSupply_){
+                   withdrawAmountRaw_ = tokenRawSupply_;
+                   uint256 withdrawAmount_ = ((tokenRawSupply_ * supplyExchangePrice_) - 1) / LC.EXCHANGE_PRICES_PRECISION;
+                   if (withdrawAmount_ > 0) withdrawAmount_ -= 1;
+                   supplyAmount_ = -int256(withdrawAmount_);
+               }
            }
```
