---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/account
  - sector/token
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_external_policies_aug2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# ERC20SpendingLimitPolicy doesn't clear previous data 

- id: 42096
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_external_policies_aug2024.pdf

## Summary


The report discusses a bug in the SmartSession system where disabled policies do not have their storage properly cleaned up. This can lead to issues if the policy is re-enabled with the same configuration. The code for the ERC20SpendingLimitPolicy also does not fully overwrite the current state when re-enabled, which can cause problems. The report recommends making changes to ensure all previous storage is cleared or overwritten, but notes that this may be difficult to implement. The bug has since been fixed in a pull request.

## Details

## Policy Storage Management in SmartSession

## Context
(No context files were provided by the reviewer)

## Description
When a policy is disabled in the SmartSession system, there is no logic that is executed to clean up the policy's storage. To avoid issues if a policy is re-enabled with the same `configId`, policies are supposed to clear any existing storage during the `initializeWithMultiplexer()` call. This is explained in the following comment from the code:

```plaintext
/**
* Disables specified policies for a given permission ID and smart account.
*
* @dev This function removes the specified policies from the policy list and emits events for each disabled
policy.
* @notice Cleaning state on policies is not required as on enable, initializeWithMultiplexer is called which
MUST overwrite the current state.
...
*/
```

However, in the `ERC20SpendingLimitPolicy`, the `initializeWithMultiplexer()` function does not fully implement this overwriting. The function is currently implemented as follows:

```solidity
function initializeWithMultiplexer(address account, ConfigId configId, bytes calldata initData) external {
    (address[] memory tokens, uint256[] memory limits) = abi.decode(initData, (address[], uint256[]));
    for (uint256 i; i < tokens.length; i++) {
        address token = tokens[i];
        uint256 limit = limits[i];
        if (token == address(0)) revert InvalidTokenAddress(token);
        if (limit == 0) revert InvalidLimit(limit);
        TokenPolicyData storage $ = _getPolicy({ id: configId, userOpSender: account, token: token });
        $.spendingLimit = limit;
    }
    emit IPolicy.PolicySet(configId, msg.sender, account);
}
```

This is not fully correct because it does not reset the `alreadySpent` value in storage. The following modification could address this:

```solidity
function initializeWithMultiplexer(address account, ConfigId configId, bytes calldata initData) external {
    (address[] memory tokens, uint256[] memory limits) = abi.decode(initData, (address[], uint256[]));
    for (uint256 i; i < tokens.length; i++) {
        address token = tokens[i];
        uint256 limit = limits[i];
        if (token == address(0)) revert InvalidTokenAddress(token);
        if (limit == 0) revert InvalidLimit(limit);
        TokenPolicyData storage $ = _getPolicy({ id: configId, userOpSender: account, token: token });
        $.spendingLimit = limit;
        $.alreadySpent = 0;
    }
    emit IPolicy.PolicySet(configId, msg.sender, account);
}
```

However, with this change, there can still be problems if the newest tokens array does not match the tokens array from a previous installation. In this case, the existing tokens array would not have its storage overwritten, which can lead to re-enabling previous storage unintentionally.

Additionally, it can be noted that in most cases the tokens array is not fully necessary. This is because the `ERC20SpendingLimitPolicy` is an action policy, so the `configId` passed to `initializeWithMultiplexer()` will typically commit to a specific target address and function selector. This means there is only one token contract for which the spending limit can actually be reached. The only exception to this is the `FALLBACK_ACTIONID`, which can potentially reach multiple contracts from the same action policy. Since this one scenario exists where the tokens array can be useful, there can still be issues when the `ERC20SpendingLimitPolicy` is re-enabled and doesn’t clear previous data.

## Recommendation
Change the `ERC20SpendingLimitPolicy` function to ensure that all previous storage is cleared or overwritten. This may be difficult since there is no easy way to enumerate all the existing tokens that are in storage. Therefore, it may be worth considering reworking this part of the system, for example by never allowing a policy to re-enable a `configId` value after it has been disabled.

## Rhinestone
Fixed in PR 117.

## Cantina Managed
Verified. The `ERC20SpendingLimitPolicy` now contains an `EnumerableSet` to allow `initializeWithMultiplexer()` to iterate through and clear all previously initialized storage for the user.
