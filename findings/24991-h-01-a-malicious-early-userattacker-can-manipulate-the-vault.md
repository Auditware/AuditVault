---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/arithmetic/precision-loss
  - impact/data-corruption/price-manipulation
  - trigger/first-deposit
  - trigger/price-manipulation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[PoolTogether]]"
auditors:
  - "[[unforgiven]]"
report: "https://code4rena.com/reports/2022-04-pooltogether"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[first-deposit]]"
  - "[[trigger/price-manipulation]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# [H-01] A malicious early user/attacker can manipulate the vault's `pricePerShare` to take an unfair share of future users' deposits

- id: 24991
- impact: HIGH
- protocol: [[PoolTogether]]
- reporter: unforgiven (Code4rena)
- source: https://code4rena.com/reports/2022-04-pooltogether

## Summary


This bug report was submitted by WatchPug and also found by 0xDjango, berndartmueller, CertoraInc, gzeon, kebabsec, leastwood, Tadashi, and unforgiven. It is a well-known attack vector for new contracts that utilize pricePerShare for accounting. The vulnerability exists in the AaveV3YieldSource.sol contract, specifically in the `_tokenToShares` and `_sharesToToken` functions. 

A malicious early user can `supplyTokenTo()` with `1 wei` of `_underlyingAssetAddress` token as the first depositor of the `AaveV3YieldSource.sol`, and get `1 wei` of shares token. Then, the attacker can send `10000e18 - 1` of `aToken` and inflate the price per share from 1.0000 to an extreme value of 1.0000e22. As a result, the future user who deposits `19999e18` will only receive `1 wei` of shares token. They will immediately lose `9999e18` or half of their deposits if they `redeemToken()` right after the `supplyTokenTo()`. Furthermore, after the PPS has been inflated to an extremely high value (`10000e18`), the attacker can also redeem tokens up to `9999e18` for free, (burn `0` shares) due to the precision loss.

The recommended mitigation steps for this attack are to consider requiring a minimal amount of share tokens to be minted for the first minter, and send a port of the initial mints as a reserve to the DAO address so that the pricePerShare can be more resistant to manipulation. Additionally, consider adding `require(_shares > 0, "AaveV3YS/shares-gt-zero");` before `_burn(msg.sender, _shares);`. PierrickGT (PoolTogether) confirmed and commented, and a Pull Request has been submitted to address the issue.

## Details

_Submitted by WatchPug, also found by 0xDjango, berndartmueller, CertoraInc, gzeon, kebabsec, leastwood, Tadashi, and unforgiven_

This is a well-known attack vector for new contracts that utilize pricePerShare for accounting.

[AaveV3YieldSource.sol#L352-L374](https://github.com/pooltogether/aave-v3-yield-source/blob/e63d1b0e396a5bce89f093630c282ca1c6627e44/contracts/AaveV3YieldSource.sol#L352-L374)<br>

```solidity
  /**
   * @notice Calculates the number of shares that should be minted or burnt when a user deposit or withdraw.
   * @param _tokens Amount of asset tokens
   * @return Number of shares.
   */
  function _tokenToShares(uint256 _tokens) internal view returns (uint256) {
    uint256 _supply = totalSupply();

    // shares = (tokens * totalShares) / yieldSourceATokenTotalSupply
    return _supply == 0 ? _tokens : _tokens.mul(_supply).div(aToken.balanceOf(address(this)));
  }

  /**
   * @notice Calculates the number of asset tokens a user has in the yield source.
   * @param _shares Amount of shares
   * @return Number of asset tokens.
   */
  function _sharesToToken(uint256 _shares) internal view returns (uint256) {
    uint256 _supply = totalSupply();

    // tokens = (shares * yieldSourceATokenTotalSupply) / totalShares
    return _supply == 0 ? _shares : _shares.mul(aToken.balanceOf(address(this))).div(_supply);
  }
```

A malicious early user can `supplyTokenTo()` with `1 wei` of `_underlyingAssetAddress` token as the first depositor of the `AaveV3YieldSource.sol`, and get `1 wei` of shares token.

Then the attacker can send `10000e18 - 1` of `aToken` and inflate the price per share from 1.0000 to an extreme value of 1.0000e22 ( from `(1 + 10000e18 - 1) / 1`) .

As a result, the future user who deposits `19999e18` will only receive `1 wei` (from `19999e18 * 1 / 10000e18`) of shares token.

They will immediately lose `9999e18` or half of their deposits if they `redeemToken()` right after the `supplyTokenTo()`.

[AaveV3YieldSource.sol#L251-L256](https://github.com/pooltogether/aave-v3-yield-source/blob/e63d1b0e396a5bce89f093630c282ca1c6627e44/contracts/AaveV3YieldSource.sol#L251-L256)<br>

```solidity
  function redeemToken(uint256 _redeemAmount) external override nonReentrant returns (uint256) {
    address _underlyingAssetAddress = _tokenAddress();
    IERC20 _assetToken = IERC20(_underlyingAssetAddress);

    uint256 _shares = _tokenToShares(_redeemAmount);
    _burn(msg.sender, _shares);
    ...
```

Furthermore, after the PPS has been inflated to an extremely high value (`10000e18`), the attacker can also redeem tokens up to `9999e18` for free, (burn `0` shares) due to the precision loss.

### Recommended Mitigation Steps

Consider requiring a minimal amount of share tokens to be minted for the first minter, and send a port of the initial mints as a reserve to the DAO address so that the pricePerShare can be more resistant to manipulation.

Also, consder adding `require(_shares > 0, "AaveV3YS/shares-gt-zero");` before `_burn(msg.sender, _shares);`.

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-04-pooltogether-findings/issues/44#issuecomment-1119085805):**
 > PR: https://github.com/pooltogether/aave-v3-yield-source/pull/15



***
