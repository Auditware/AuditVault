---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[KIntern_NA]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[precision-loss]]"
  - "[[specific-token-type]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# [H-07] Incorrect math means `data.removeAndRepayData.removeAssetFromSGL` will never work once SGL has accrued interest

- id: 32318
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: KIntern\_NA (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


The bug report discusses an issue with the code used to remove shares from Singularity, a financial platform. The code is not correctly calculating the amount of shares to remove, which can cause problems when Singularity has any operations that generate interest. The report provides a proof of concept and logs to demonstrate the issue, and suggests a mitigation through the use of an unused function. The team has confirmed the bug and provided a fix. 

## Details


The code to remove shares from Singularity is as follows:

<https://github.com/Tapioca-DAO/tapioca-periph/blob/2ddbcb1cde03b548e13421b2dba66435d2ac8eb5/contracts/Magnetar/modules/MagnetarOptionModule.sol#L158-L159>

```solidity
            singularity_.removeAsset(data.user, removeAssetTo, share);
```

Where `share` is computed in this way:

<https://github.com/Tapioca-DAO/tapioca-periph/blob/2ddbcb1cde03b548e13421b2dba66435d2ac8eb5/contracts/Magnetar/modules/MagnetarOptionModule.sol#L153>

```solidity
uint256 share = yieldBox_.toShare(_assetId, _removeAmount, false);
```

The line is calculating: The (incorrectly rounded down) amount of shares of Yieldbox to burn in order to withdraw from Yieldbox the `_removeAmount`.

But the code is calling:

`singularity_.removeAsset(data.user, removeAssetTo, share);`

This is asking Singularity to remove a % (part) of the total assets in Singularity. Due to this, the line will stop working as soon as singularity has had any operation that generated interest.

### Proof of Concept

Please see the formula used by Singularity for pricing asset:

<https://github.com/Tapioca-DAO/Tapioca-bar/blob/c2031ac2e2667ac8f9ac48eaedae3dd52abef559/contracts/markets/singularity/SGLCommon.sol#L199-L216>

```solidity
    function _removeAsset(address from, address to, uint256 fraction) internal returns (uint256 share) {
        if (totalAsset.base == 0) {
            return 0;
        }
        Rebase memory _totalAsset = totalAsset;
        uint256 allShare = _totalAsset.elastic + yieldBox.toShare(assetId, totalBorrow.elastic, false);
        share = (fraction * allShare) / _totalAsset.base;
    }
```

As you can see, the `fraction` will be computed against `_totalAsset.elastic + yieldBox.toShare(assetId, totalBorrow.elastic, false);`. Meaning that the math will be incorrect as soon as any operation is done in Singularity

### Coded POC

This Poc is built on the public repo: <https://github.com/GalloDaSballo/yieldbox-foundry>

We show how a change in interest will change `fraction`. In my local testing, `fraction` and `shares` are already out of sync. However, due to decimals it may be possible for them to be the same value, until some interest will make `borrowElastic` grow.

### Logs

```
[PASS] testSingularityRebasedMathIsNotYieldbox() (gas: 34810)
Logs:
fraction 999999990000000099999
share 100000000000000000000000000000

[PASS] testSingularityRebasedMathIsNotYieldboxAfterInterest() (gas: 34756)
Logs:
fraction 666666662222222251851
share 100000000000000000000000000000
```

### Code

```solidity

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {TargetFunctions} from "./TargetFunctions.sol";
import {FoundryAsserts} from "@chimera/FoundryAsserts.sol";

contract CryticToFoundry is Test, TargetFunctions, FoundryAsserts {
    function setUp() public {
        setup();
    }

    
    function testSingularityRebasedMathIsNotYieldbox() public {        
        uint256 amountToRepay = 1000e18;

        uint256 totalAssetShares = 2000e18;
        uint256 totalAssetBase = 2000e18;
        uint256 totalBorrowElastic = 2000e18;

        uint256 share = yieldBox.toShare(assetId, amountToRepay, false);
        uint256 allShare = totalAssetShares + yieldBox.toShare(assetId, totalBorrowElastic, true);

        uint256 fraction = allShare == 0 ? share : (share * totalAssetBase) / allShare;
        console2.log("fraction", fraction);
        console2.log("share", share);
    }

    function testSingularityRebasedMathIsNotYieldboxAfterInterest() public {        
        uint256 amountToRepay = 1000e18;

        uint256 totalAssetShares = 2000e18;
        uint256 totalAssetBase = 2000e18;
        uint256 totalBorrowElastic = 3000e18; // NOTE: Higher cause of interest

        uint256 share = yieldBox.toShare(assetId, amountToRepay, false);
        uint256 allShare = totalAssetShares + yieldBox.toShare(assetId, totalBorrowElastic, true);

        uint256 fraction = allShare == 0 ? share : (share * totalAssetBase) / allShare;
        console2.log("fraction", fraction);
        console2.log("share", share);
    }
}
```

### Mitigation

The unused function `getFractionForAmount` should help, minus some possible rounding considerations.

**[cryptotechmaker (Tapioca) confirmed, but disagreed with severity and commented via duplicate Issue #159](https://github.com/code-423n4/2024-02-tapioca-findings/issues/159#issuecomment-2034483179):**
> PR [here](https://github.com/Tapioca-DAO/tapioca-periph/commit/a22fdf0efe5a63538e072f4947ed65fd72e029a2).

***
