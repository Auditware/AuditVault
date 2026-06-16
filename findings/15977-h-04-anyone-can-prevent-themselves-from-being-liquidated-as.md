---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/nft
  - sector/options
  - sector/oracle
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-multi-oracle
protocol: "[[ParaSpace]]"
auditors:
  - "[[xiaoming90]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[liquidation-logic]]"
  - "[[use-multi-oracle]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-04] Anyone can prevent themselves from being liquidated as long as they hold one of the supported NFTs

- id: 15977
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: xiaoming90 (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


A bug has been discovered in the NFTFloorOracle contract of the Paraspace project. The function `removeFeeder()` is able to be called by anyone, not just the owner. This allows a malicious user to cause all queries for the price of NFTs reliant on the `NFTFloorOracle` to revert, which will cause all calls to `liquidateERC721()` to revert. This will cause positions to remain open for longer than they should, and the protocol may become insolvent by the time the issue is resolved.

The `onlyRole(DEFAULT_ADMIN_ROLE)` modifier should be used instead of `onlyWhenFeederExisted` in the `removeFeeder()` function. This will ensure that only the owner can call the function.

A person close to liquidation can remove all feeders, giving themselves a free option on whether the extra time it takes for the admins to resolve the issue, is enough time for their position to go back into the green. Alternatively, a competitor can analyze what price most liquidations will occur at (based on on-chain data about every user's account health), and can time the removal of feeders for maximum effect. Note that even if the admins re-add the feeders, the malicious user can just remove them again.

The recommended mitigation step is to add the `onlyRole(DEFAULT_ADMIN_ROLE)` modifier to the `removeFeeder()` function. This will ensure that only the owner can call the function. Code inspection was used to identify the bug.

## Details


Contrary to what the function comments say, `removeFeeder()` is able to be called by anyone, not just the owner. By removing all feeders (i.e. floor twap price oracle keepers), a malicious user can cause all queries for the price of NFTs reliant on the `NFTFloorOracle` (all NFTs except for the UniswapV3 ones), to revert, which will cause all calls to `liquidateERC721()` to revert.

### Impact

If NFTs can't be liquidated, positions will remain open for longer than they should, and the protocol may become insolvent by the time the issue is resolved.

### Proof of Concept

The `onlyRole(DEFAULT_ADMIN_ROLE)` should have been used instead of `onlyWhenFeederExisted`...

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #1

165      /// @notice Allows owner to remove feeder.
166      /// @param _feeder feeder to remove
167      function removeFeeder(address _feeder)
168          external
169          onlyWhenFeederExisted(_feeder)
170      {
171          _removeFeeder(_feeder);
172:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L165-L172><br>

... since `onlyWhenFeederExisted` is already on the internal call to `_removeFeeder()` (`onlyWhenFeederExisted` doesn't do any authentication of the caller):

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #2

326      function _removeFeeder(address _feeder)
327          internal
328          onlyWhenFeederExisted(_feeder)
329      {
330          uint8 feederIndex = feederPositionMap[_feeder].index;
331          if (feederIndex >= 0 && feeders[feederIndex] == _feeder) {
332              feeders[feederIndex] = feeders[feeders.length - 1];
333              feeders.pop();
334          }
335          delete feederPositionMap[_feeder];
336          revokeRole(UPDATER_ROLE, _feeder);
337          emit FeederRemoved(_feeder);
338:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L326-L338><br>

Note that `feeders` must have the `UPDATER_ROLE` (revoked above) in order to update the price.

The fetching of the price will revert if the price is stale:

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #3

234      /// @param _asset The nft contract
235      /// @return price The most recent price on chain
236      function getPrice(address _asset)
237          external
238          view
239          override
240          returns (uint256 price)
241      {
242          uint256 updatedAt = assetPriceMap[_asset].updatedAt;
243          require(
244 @>           (block.number - updatedAt) <= config.expirationPeriod,
245              "NFTOracle: asset price expired"
246          );
247          return assetPriceMap[_asset].twap;
248:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L234-L248><br>

And it will become stale if there are no feeders for enough time:

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #4

195      function setPrice(address _asset, uint256 _twap)
196          public
197 @>       onlyRole(UPDATER_ROLE)
198          onlyWhenAssetExisted(_asset)
199          whenNotPaused(_asset)
200      {
201          bool dataValidity = false;
202          if (hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
203 @>           _finalizePrice(_asset, _twap);
204              return;
205          }
206          dataValidity = _checkValidity(_asset, _twap);
207          require(dataValidity, "NFTOracle: invalid price data");
208          // add price to raw feeder storage
209          _addRawValue(_asset, _twap);
210          uint256 medianPrice;
211          // set twap price only when median value is valid
212          (dataValidity, medianPrice) = _combine(_asset, _twap);
213          if (dataValidity) {
214 @>           _finalizePrice(_asset, medianPrice);
215          }
216:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L195-L216><br>

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #5

376      function _finalizePrice(address _asset, uint256 _twap) internal {
377          PriceInformation storage assetPriceMapEntry = assetPriceMap[_asset];
378          assetPriceMapEntry.twap = _twap;
379 @>       assetPriceMapEntry.updatedAt = block.number;
380          assetPriceMapEntry.updatedTimestamp = block.timestamp;
381          emit AssetDataSet(
382              _asset,
383              assetPriceMapEntry.twap,
384              assetPriceMapEntry.updatedAt
385          );
386:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L376-L386><br>

Note that the default staleness interval is six hours:

```solidity
File: /paraspace-core/contracts/misc/NFTFloorOracle.sol   #6

10   //expirationPeriod at least the interval of client to feed data(currently 6h=21600s/12=1800 in mainnet)
11   //we do not accept price lags behind to much
12:  uint128 constant EXPIRATION_PERIOD = 1800;
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/NFTFloorOracle.sol#L10-L12><br>

The reverting `getPrice()` function is called from the `ERC721OracleWrapper` where it is not caught:

```solidity
File: /paraspace-core/contracts/misc/ERC721OracleWrapper.sol   #7

44       function setOracle(address _oracleAddress)
45           external
46           onlyAssetListingOrPoolAdmins
47       {
48 @>        oracleAddress = INFTFloorOracle(_oracleAddress);
49       }
50   
...
54   
55       function latestAnswer() external view override returns (int256) {
56 @>        return int256(oracleAddress.getPrice(asset));
57:      }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/ERC721OracleWrapper.sol#L44-L57><br>

And neither is it caught from any of the callers further up the chain (note that the fallback oracle can't be hit since the call reverts before that):

```solidity
File: /paraspace-core/contracts/misc/ERC721OracleWrapper.sol   #8

10:  contract ERC721OracleWrapper is IEACAggregatorProxy {
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/ERC721OracleWrapper.sol#L10><br>

```solidity
File: /paraspace-core/contracts/misc/ParaSpaceOracle.sol   #9

114      /// @inheritdoc IPriceOracleGetter
115      function getAssetPrice(address asset)
116          public
117          view
118          override
119          returns (uint256)
120      {
121          if (asset == BASE_CURRENCY) {
122              return BASE_CURRENCY_UNIT;
123          }
124  
125          uint256 price = 0;
126 @>       IEACAggregatorProxy source = IEACAggregatorProxy(assetsSources[asset]);
127          if (address(source) != address(0)) {
128 @>           price = uint256(source.latestAnswer());
129          }
130          if (price == 0 && address(_fallbackOracle) != address(0)) {
131              price = _fallbackOracle.getAssetPrice(asset);
132          }
133  
134          require(price != 0, Errors.ORACLE_PRICE_NOT_READY);
135          return price;
136:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/ParaSpaceOracle.sol#L114-L136><br>

```solidity
File: /paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol   #10

535      function _getAssetPrice(address oracle, address currentReserveAddress)
536          internal
537          view
538          returns (uint256)
539      {
540 @>       return IPriceOracleGetter(oracle).getAssetPrice(currentReserveAddress);
541:     }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol#L535-L541><br>

```solidity
File: /paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol : _getUserBalanceForERC721()  #11

388 @>           uint256 assetPrice = _getAssetPrice(
389                  params.oracle,
390                  vars.currentReserveAddress
391              );
392              totalValue =
393                  ICollateralizableERC721(vars.xTokenAddress)
394                      .collateralizedBalanceOf(params.user) *
395                  assetPrice;
396:         }
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol#L388-L396><br>

```solidity
File: /paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol : calculateUserAccountData()  #12

214                          vars
215                              .userBalanceInBaseCurrency = _getUserBalanceForERC721(
216                              params,
217                              vars
218:                         );
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol#L214-L218><br>

```solidity
File: /paraspace-core/contracts/protocol/libraries/logic/LiquidationLogic.sol   #13

286      function executeLiquidateERC721(
287          mapping(address => DataTypes.ReserveData) storage reservesData,
288          mapping(uint256 => address) storage reservesList,
289          mapping(address => DataTypes.UserConfigurationMap) storage usersConfig,
290          DataTypes.ExecuteLiquidateParams memory params
291      ) external returns (uint256) {
292          ExecuteLiquidateLocalVars memory vars;
...
311          (
312              vars.userGlobalCollateral,
313              ,
314              vars.userGlobalDebt, //in base currency
315              ,
316              ,
317              ,
318              ,
319              ,
320              vars.healthFactor,
321  
322 @>       ) = GenericLogic.calculateUserAccountData(
323              reservesData,
324              reservesList,
325              DataTypes.CalculateUserAccountDataParams({
326                  userConfig: userConfig,
327                  reservesCount: params.reservesCount,
328                  user: params.borrower,
329                  oracle: params.priceOracle
330              })
331:         );
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/libraries/logic/LiquidationLogic.sol#L286-L331><br>

```solidity
File: /paraspace-core/contracts/protocol/pool/PoolCore.sol   #14

457      /// @inheritdoc IPoolCore
458      function liquidateERC721(
459          address collateralAsset,
460          address borrower,
461          uint256 collateralTokenId,
462          uint256 maxLiquidationAmount,
463          bool receiveNToken
464      ) external payable virtual override nonReentrant {
465          DataTypes.PoolStorage storage ps = poolStorage();
466  
467 @>       LiquidationLogic.executeLiquidateERC721(
468              ps._reserves,
469              ps._reservesList,
470:             ps._usersConfig,
```

<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/pool/PoolCore.sol#L457-L470><br>

A person close to liquidation can remove all feeders, giving themselves a free option on whether the extra time it takes for the admins to resolve the issue, is enough time for their position to go back into the green. Alternatively, a competitor can analyze what price most liquidations will occur at (based on on-chain data about every user's account health), and can time the removal of feeders for maximum effect. Note that even if the admins re-add the feeders, the malicious user can just remove them again.

### Recommended Mitigation Steps

Add the `onlyRole(DEFAULT_ADMIN_ROLE)` modifier to `removeFeeder()`.

**[yubo-ruan (Paraspace) confirmed via duplicate issue `#55`](https://github.com/code-423n4/2022-11-paraspace-findings/issues/55#issuecomment-1338712962)**



***
