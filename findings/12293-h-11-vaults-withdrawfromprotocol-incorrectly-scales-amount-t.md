---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Derby]]"
auditors:
  - "[[hyh]]"
report: "https://github.com/sherlock-audit/2023-01-derby-judging"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[token-decimal-normalization]]"
---
# H-11: Vault's withdrawFromProtocol incorrectly scales amount to be withdrawn

- id: 12293
- impact: HIGH
- protocol: [[Derby]]
- reporter: hyh (Sherlock)
- source: N/A

## Summary


This bug report is about Vault's withdrawFromProtocol() function incorrectly scaling the amount to be withdrawn. The issue arises when the vaultCurrency and the underlying currency are different, such as CompoundProvider's cUSDC and USDC. withdrawFromProtocol() is called with an amount in vaultCurrency, however, it converts the amount to LP Token decimals and uses the resulting amount in a Provider calcShares() call. All Providers expect input amount for calcShares() to have underlying token decimals, not LP Token decimals, so the 100x amount will be requested to be withdrawn. This can lead to massive Vault misbalancing and alter the effective distribution and shift actual results far from expected, leading to losses for protocol depositors in a substantial number of cases.

The code snippet provided in the report shows that the input argument _amount is in vaultCurrency, and _amount = (_amount * protocol.uScale) / uScale reset decimals to be LP Token's decimals. The problem is that all calcShares() methods expect amount in underlying token, not in LP token.

The recommended solution is to introduce underlying token decimals as an additional variable in ProtocolInfoS structure, populating and using it for decimals conversion to obtain the resulting Provider's underlying amount needed for a number of shares request. This issue has been accepted, and contestants' payouts and scores will be updated according to the changes made on this issue.

## Details

Source: https://github.com/sherlock-audit/2023-01-derby-judging/issues/132 

## Found by 
hyh

## Summary

withdrawFromProtocol() converts its `_amount` argument from `vaultCurrency` into `LP Token` decimals and use the resulting amount in a Provider calcShares() call, while all Providers expect input amount for calcShares() to have underlying token decimals.

## Vulnerability Detail

Suppose `vaultCurrency` and Provider's underlying currency is USDC, Provider is CompoundProvider (`compound_usdc_01`).

withdrawFromProtocol() being called with `10^12` amount is a request to withdraw `10^6 USDC`, while CompoundProvider's calcShares() will be called with `(_amount * protocol.uScale) / uScale = 10^12 * 10^8 / 10^6 = 10^14` (cUSDC is 8 decimals token), which it will treat as USDC amount. I.e. the 100x amount will be requested to be withdrawn.

## Impact

Withdrawal from a protocol is a base functionality of the Vault and it will malfunction whenever LP Token decimals and underlying decimals aren't equal, which is a frequent case. For example, Compound and Idle LP Tokens have own decimals not corresponding to underlying decimals (fixed at 8 and 18).

Net impact is massive Vault misbalancing, which will alter the effective distribution and shift actual results far from expected, leading to losses for protocol depositors in a substantial enough number of cases.

## Code Snippet

withdrawFromProtocol's input argument `_amount` is in vaultCurrency, and `_amount = (_amount * protocol.uScale) / uScale` reset decimals to be LP Token's decimals:

https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/Vault.sol#L303-L316

```solidity
  /// @notice Withdraw amount from underlying protocol
  /// @dev shares = amount / PricePerShare
  /// @param _protocolNum Protocol number linked to an underlying protocol e.g compound_usdc_01
  /// @param _amount in VaultCurrency to withdraw
  function withdrawFromProtocol(uint256 _protocolNum, uint256 _amount) internal {
    if (_amount <= 0) return;
    IController.ProtocolInfoS memory protocol = controller.getProtocolInfo(
      vaultNumber,
      _protocolNum
    );

    _amount = (_amount * protocol.uScale) / uScale;
    uint256 shares = IProvider(protocol.provider).calcShares(_amount, protocol.LPToken);
    uint256 balance = IProvider(protocol.provider).balance(address(this), protocol.LPToken);
```

As `protocol.uScale` is `10**LP_Token.decimals`:

https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/Interfaces/IController.sol#L6-L11

```solidity
  struct ProtocolInfoS {
    address LPToken;
    address provider;
    address underlying; // address of underlying token of the protocol eg USDC
    uint256 uScale; // uScale of protocol LP Token
  }
```

But all calcShares() methods expect amount in underlying token, not in LP token:

https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/Providers/AaveProvider.sol#L88-L96

```solidity
  /// @notice Calculates how many shares are equal to the amount
  /// @dev Aave exchangeRate is 1
  /// @param _amount Amount in underyling token e.g USDC
  /// @param _aToken Address of protocol LP Token eg aUSDC
  /// @return number of shares i.e LP tokens
  function calcShares(uint256 _amount, address _aToken) external view override returns (uint256) {
    uint256 shares = _amount / exchangeRate(_aToken);
    return shares;
  }
```

...

https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/Providers/CompoundProvider.sol#L102-L111

```solidity
  /// @notice Calculates how many shares are equal to the amount
  /// @dev returned price from compound is scaled https://compound.finance/docs/ctokens#exchange-rate
  /// @param _amount Amount in underyling token e.g USDC
  /// @param _cToken Address of protocol LP Token eg cUSDC
  /// @return number of shares i.e LP tokens
  function calcShares(uint256 _amount, address _cToken) external view override returns (uint256) {
    uint256 decimals = IERC20Metadata(ICToken(_cToken).underlying()).decimals();
    uint256 shares = (_amount * (10 ** (10 + decimals))) / exchangeRate(_cToken);
    return shares;
  }
```

LP token decimals and underlying decimals can drastically differ.

For example, Compound's cDAI has 8 decimals:

https://etherscan.io/token/0x5d3a536e4d6dbd6114cc1ead35777bab948e3643

While DAI has 18:

https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f

## Tool used

Manual Review

## Recommendation

As LP token and underlying token differs in general, consider introducing underlying token decimals as an additional variable in `ProtocolInfoS` structure, populating and using it for decimals conversion to obtain the resulting Provider's underlying amount needed for a number of shares request.



## Discussion

**sjoerdsommen**

duplicate with #202 

**dmitriia**

Escalate for 10 USDC
202 and this aren't duplicates.

202 deals with CompoundProvider's treatment of cToken exchange rate in balanceUnderlying() and calcShares().

This issue is about *calling* of all Providers' calcShares() with LP Token decimals scaled amount instead of underlying token decimals scaled amount in Vault's withdrawFromProtocol(). Notice that this requires another fix, i.e. correcting balanceUnderlying() and calcShares() will fix 202, but here IController's `ProtocolInfoS` needs to be extended and underlying token decimals be used in withdrawFromProtocol().

**sherlock-admin**

 > Escalate for 10 USDC
> 202 and this aren't duplicates.
> 
> 202 deals with CompoundProvider's treatment of cToken exchange rate in balanceUnderlying() and calcShares().
> 
> This issue is about *calling* of all Providers' calcShares() with LP Token decimals scaled amount instead of underlying token decimals scaled amount in Vault's withdrawFromProtocol(). Notice that this requires another fix, i.e. correcting balanceUnderlying() and calcShares() will fix 202, but here IController's `ProtocolInfoS` needs to be extended and underlying token decimals be used in withdrawFromProtocol().

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**hrishibhat**

Escalation accepted

Not a duplicate of #202 
Considering this issue a valid separate issue

**sherlock-admin**

> Escalation accepted
> 
> Not a duplicate of #202 
> Considering this issue a valid separate issue

This issue's escalations have been accepted!

Contestants' payouts and scores will be updated according to the changes made on this issue.
