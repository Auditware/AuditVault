---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[ronnyx2017]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[precision-loss]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
---
# [H-05] `_vested()` claimable amount calculation error

- id: 32316
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: ronnyx2017 (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


The bug report is about an issue with the `Vesting._vested()` method, which is used to calculate the maximum claimable amount for a user. The calculation formula is incorrect and can result in users being able to claim more than they should. The recommended mitigation is to fix the calculation formula by taking into account the `__initialUnlockTimeOffset` variable. This will prevent users from claiming more than the maximum amount they are entitled to. A proposed solution has been provided in the report.

## Details


The `Vesting._vested()` method is used to calculate the maximum claimable amount for the current user. The calculation formula is as follows: `(_totalAmount * (block.timestamp - _start)) / _duration`. If there is an `__initialUnlockTimeOffset`, it needs to be subtracted from `_start` before performing the calculation, i.e., `_start = _start - __initialUnlockTimeOffset`.

```solidity
    function _vested(uint256 _totalAmount) internal view returns (uint256) {
        uint256 _cliff = cliff;
        uint256 _start = start;
        uint256 _duration = duration;

        if (_start == 0) return 0; // Not started

        if (_cliff > 0) {
            _start = _start + _cliff; // Apply cliff offset
            if (block.timestamp < _start) return 0; // Cliff not reached
        }

@>      if (block.timestamp >= _start + _duration) return _totalAmount; // Fully vested

        _start = _start - __initialUnlockTimeOffset; // Offset initial unlock so it's claimable immediately
        return (_totalAmount * (block.timestamp - _start)) / _duration; // Partially vested
    }
```

The issue with the code snippet above is that the check for being "Fully vested" is incorrect; it does not take into account the `__initialUnlockTimeOffset`. The correct approach should be:
`if (block.timestamp >= _start - __initialUnlockTimeOffset + _duration) return _totalAmount;// Fully vested`. Resulting in calculations that may be greater than the maximum number `_totalAmount`

Example:
`_totalAmount  =  500 ,  duration = 1000 __initialUnlockTimeOffset = 100 start = 1000  block.timestamp= 1999` because `block.timestamp < start + duration`  (`1999 < 1000 + 1000`) it will not return `Fully vested`.

Final calculation result:
start = `start - __initialUnlockTimeOffset = 1000 - 100 = 900`.
return = `(_totalAmount * (block.timestamp - _start)) / _duration = 500 * (1999 - 900) / 1000 = 549.5`.

It is greater 49.5 than the maximum `_totalAmount=500`.

### Impact

Users can `claim' more than they should.

### Recommended Mitigation

```diff
    function _vested(uint256 _totalAmount) internal view returns (uint256) {
        uint256 _cliff = cliff;
        uint256 _start = start;
        uint256 _duration = duration;

        if (_start == 0) return 0; // Not started

        if (_cliff > 0) {
            _start = _start + _cliff; // Apply cliff offset
            if (block.timestamp < _start) return 0; // Cliff not reached
        }

-       if (block.timestamp >= _start + _duration) return _totalAmount; // Fully vested
+       if (block.timestamp >= _start -  __initialUnlockTimeOffset + _duration) return _totalAmount; // Fully vested

        _start = _start - __initialUnlockTimeOffset; // Offset initial unlock so it's claimable immediately
        return (_totalAmount * (block.timestamp - _start)) / _duration; // Partially vested
    }
```
**[cryptotechmaker (Tapioca) confirmed, but disagreed with severity and commented via duplicate Issue #167](https://github.com/code-423n4/2024-02-tapioca-findings/issues/167#issuecomment-2034003168)**
> PR [here](https://github.com/Tapioca-DAO/tap-token/pull/175).

***
