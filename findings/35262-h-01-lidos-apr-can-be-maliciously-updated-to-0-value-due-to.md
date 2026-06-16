---
tags:
  - lang/solidity
  - sector/lending
  - sector/liquid-staking
  - sector/oracle
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Gondi]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2024-06-gondi"
genome:
  - "[[frozen-funds]]"
  - "[[specific-token-type]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Lido's apr can be maliciously updated to 0 value due to missing `getLidoUpdateTolerance` check, DOS pool lending

- id: 35262
- impact: HIGH
- protocol: [[Gondi]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2024-06-gondi

## Summary


This bug report is about a function called `updateLidoValues()` in the code for Lido, a protocol for staking Ethereum. The function is missing a check that could allow a malicious actor to set a value to 0, which would cause problems with the pool's lending. The report also includes a suggested solution and notes from the person who confirmed the bug and a judge who increased the severity rating.

## Details

Function `updateLidoValues()` is permissionless and missing the [`getLidoupdateTolerance` check](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/LidoEthBaseInterestAllocator.sol#L95). Lido’s stETH [rebases daily](https://docs.lido.fi/guides/lido-tokens-integration-guide#accounting-oracle). A malicious actor can call `updateLidoValues()` between rebasing to directly set `lidoData.aprBps` to 0. Once set, this DOS pool lending, because calling `getBaseAprWithUpdate()` will always revert with `InvalidAprError`.

```solidity
//src/lib/pools/LidoEthBaseInterestAllocator.sol
    //@audit anyone can call updateLidoValues at any time, risks of _lidoData.aprBps being set to 0.
    function updateLidoValues() external {
        _updateLidoValues(getLidoData);
    }

    function _updateLidoValues(LidoData memory _lidoData) private {
        uint256 shareRate = _currentShareRate();
        _lidoData.aprBps = uint16(
            (_BPS * _SECONDS_PER_YEAR * (shareRate - _lidoData.shareRate)) /
                _lidoData.shareRate /
                (block.timestamp - _lidoData.lastTs)
        );
        _lidoData.shareRate = uint144(shareRate);
        _lidoData.lastTs = uint96(block.timestamp);
        getLidoData = _lidoData;
        emit LidoValuesUpdated(_lidoData);
    }
```

https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/LidoEthBaseInterestAllocator.sol#L105-L106

See added unit test:

```solidity
//test/pools/LidoEthBaseInterestAllocator.t.sol
...
    function testMaliciousUpdateLidoValues() public {
        assertEq(_baseAllocator.getBaseAprWithUpdate(), 1000);
        (uint96 lastTs, , ) = _baseAllocator.getLidoData();
        vm.warp(uint256(lastTs) + 12);
        _baseAllocator.updateLidoValues();
        (, , uint16 newAprBps) = _baseAllocator.getLidoData();
        assertEq(newAprBps, 0);
        vm.expectRevert(abi.encodeWithSignature("InvalidAprError()"));
        _baseAllocator.getBaseAprWithUpdate();
    }
...
```

```
Ran 1 test for test/pools/LidoEthBaseInterestAllocator.t.sol:LidoEthBaseInterestAllocatorTest
[PASS] testMaliciousUpdateLidoValues() (gas: 30835)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 7.93ms (486.17µs CPU time)
```

### Recommended Mitigation Steps

In `updateLidoValues()`, consider adding check to only run `_updateLidoValues()` when `(block.timestamp - lidoData.lastTs > getLidoUpdateTolerance)`.

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-06-gondi-findings/issues/9#event-13414822150)**

**[0xsomeone (judge) increased severity to High and commented](https://github.com/code-423n4/2024-06-gondi-findings/issues/9#issuecomment-2220116640):**
 > The Warden outlines how the lack of a timestamp-related validation check when updating Lido's APR permits the APR measurements from the `LidoEthBaseInterestAllocator` to revert due to the relevant metric becoming `0`.
> 
> A malicious user can repeatedly perform this attack at will by following any valid APR measurement by a re-measurement causing it to always be `0`. In turn, this would lead to the pool not being able to validate new offers and effectively result in a permanent Denial-of-Service with significant impact.
> 
> As a result of the above analysis, I believe a high-risk rating is appropriate for this submission given that an important feature of the protocol can be repetitively denied for an indeterminate amount of time.

***
