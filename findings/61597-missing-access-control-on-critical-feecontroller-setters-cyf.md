---
tags:
  - lang/solidity
  - sector/account
  - sector/bridge
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/dos/griefing
  - fix/add-access-control
  - novelty/variant
  - misassumption/admin-is-honest
protocol: "[[Octodefi]]"
auditors:
  - "[[Giovanni Di Siena]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-17-cyfrin-octodefi-v2.0.md"
genome:
  - "[[missing-modifier]]"
  - "[[griefing]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# Missing access control on critical `FeeController` setters

- id: 61597
- impact: HIGH
- protocol: [[Octodefi]]
- reporter: Giovanni Di Siena (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-17-cyfrin-octodefi-v2.0.md

## Summary


This bug report discusses an issue with the `FeeController` contract in the `strategy-builder-plugin` project. The functions `setFunctionFeeConfig()`, `setTokenGetter()`, and `setGlobalTokenGetter()` are declared as `external` but do not have any modifier restricting who can call them. This means that any account can change the fee percentages, token-getter addresses, or even swap in malicious contracts. This could lead to attackers draining revenue or causing a denial of service attack. The recommended solution is to add an `onlyOwner` modifier to these functions. The bug has been fixed in the latest version of the project. 

## Details

**Description:** `FeeController.setFunctionFeeConfig()`, `setTokenGetter()`, and `setGlobalTokenGetter()` are declared `external` but have **no modifier** restricting the caller. Any account can freely (re)configure fee percentages, token-getter addresses, or even swap in malicious contracts.

```solidity
/// @inheritdoc IFeeController
function setFunctionFeeConfig(bytes4 _selector, FeeType _feeType, uint256 _feePercentage) external {
    if (_feePercentage > maxFeeLimits[_feeType]) {
        revert FeePercentageExceedLimit();
    }

    functionFeeConfigs[_selector] = FeeConfig(_feeType, _feePercentage);

    emit FeeConfigSet(_selector, _feeType, _feePercentage);
}

/// @inheritdoc IFeeController
function setTokenGetter(bytes4 _selector, address _tokenGetter, address _target) external {
    if (_target == address(0) || _tokenGetter == address(0)) {
        revert ZeroAddressNotValid();
    }

    tokenGetters[_target][_selector] = _tokenGetter;
    emit TokenGetterSet(_target, _selector, _tokenGetter);
}

/// @inheritdoc IFeeController
function setGlobalTokenGetter(bytes4 _selector, address _tokenGetter) external {
    if (_tokenGetter == address(0)) {
        revert ZeroAddressNotValid();
    }

    globalTokenGetters[_selector] = _tokenGetter;
    emit GlobalTokenGetterSet(_selector, _tokenGetter);
}
```

**Impact:** Attackers can:
* Set the fee percentage to 0 and drain executors' revenue, or maximize it to grief smart accounts using the plugin.
* Cause DoS by setting the `tokenGetters` and `globalTokenGetters` to a contract that reverts on all calls


**Recommended Mitigation:** Add `onlyOwner` modifier to all state-changing admin setters inside `FeeController`.

**OctoDeFi:** Fixed in PR [\#12](https://github.com/octodefi/strategy-builder-plugin/pull/12).

**Cyfrin:** Verified. The `onlyOwner` modifier has been applied to the `setFunctionFeeConfig()`, `setTokenGetter()`, and `setGlobalTokenGetter()` functions.

\clearpage
