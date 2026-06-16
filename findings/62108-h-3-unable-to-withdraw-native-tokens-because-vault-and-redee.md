---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Mellow]]"
auditors:
  - "[[0x23r0]]"
  - "[[0xc0ffEE]]"
  - "[[7]]"
  - "[[Cybrid]]"
  - "[[Greed]]"
  - "[[dan__vinci]]"
  - "[[edger]]"
  - "[[hunt1]]"
  - "[[katz]]"
  - "[[ke1caM]]"
  - "[[khaye26]]"
  - "[[klaus]]"
  - "[[t.aksoy]]"
  - "[[theboiledcorn]]"
  - "[[weblogicctf]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# H-3: Unable to withdraw native tokens because vault and redeem hooks do not handle native tokens

- id: 62108
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: 0x23r0 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by a group of users involving the vault and redeem hook not handling native tokens properly. This prevents users from withdrawing native tokens from the protocol. The root cause of the issue is that when querying token balances during withdrawal, the code does not consider the case where the asset token is a native token. This causes withdrawals to fail. The report provides a detailed explanation of the code and how it fails in different scenarios. The impact of this bug is that users cannot withdraw their native tokens from the protocol. The report also includes a proof of concept and suggests a mitigation for the issue. The protocol team has fixed this issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/147 

## Found by 
0x23r0, 0xc0ffEE, 7, Cybrid, Greed, dan\_\_vinci, edger, hunt1, katz, ke1caM, khaye26, klaus, t.aksoy, theboiledcorn, weblogicctf

### Summary

The vault and redeem hook do not handle native token, preventing them from processing native token withdrawal requests. Users cannot withdraw native tokens.

### Root Cause


The vault is generally implemented to support native tokens, and native tokens are included in the [supported token list](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/tree/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf?tab=readme-ov-file#q-if-you-are-integrating-tokens-are-you-allowing-only-whitelisted-tokens-to-work-with-the-codebase-or-any-complying-with-the-standard-are-they-assumed-to-have-certain-properties-eg-be-non-reentrant-are-there-any-types-of-weird-tokens-you-want-to-integrate). However, when querying token balances during withdrawal, it does not consider the case where the asset token is a native token. This causes withdrawals to fail.

1. RedeemQueue and SignatureRedeemQueue call `vault.getLiquidAssets` to query the token balance for processing withdrawals. If no hook is used, it calls ERC20's `balanceOf`. If the asset is a native token, this function call fails and the transaction is reverted.  [modules/ShareModule.sol#L150](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf/flexible-vaults/src/modules/ShareModule.sol#L150)

```solidity
function getLiquidAssets() public view returns (uint256) {
    ...
    address hook = getHook(queue);
@>  return hook == address(0) ? IERC20(asset).balanceOf(address(this)) : IRedeemHook(hook).getLiquidAssets(asset);
}
```

2. If a hook is used, it calls `Hook.getLiquidAssets`. Currently, only BasicRedeemHook exists as a redeem hook. The `BasicRedeemHook.getLiquidAssets` function fails if the asset is a native token because `balanceOf` fails and gets reverted. [hooks/BasicRedeemHook.sol#L35-L39](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf/flexible-vaults/src/hooks/BasicRedeemHook.sol#L35-L39) 

```solidity
function getLiquidAssets(address asset) public view virtual returns (uint256 assets) {
    IVaultModule vault = IVaultModule(msg.sender);
@>  assets = IERC20(asset).balanceOf(address(vault));
    uint256 subvaults = vault.subvaults();
    for (uint256 i = 0; i < subvaults; i++) {
        address subvault = vault.subvaultAt(i);
@>      assets += IERC20(asset).balanceOf(subvault);
    }
}
```

3. RedeemQueue and SignatureRedeemQueue call `vault.callHook` to process withdrawals. This function calls `Hook.callHook` via delegatecall if a redeem hook is registered. Currently, only BasicRedeemHook exists as a redeem hook. `BasicRedeemHook.callHook` fails if the asset is a native token because `balanceOf` fails and gets reverted. [hooks/BasicRedeemHook.sol#L11-L19](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf/flexible-vaults/src/hooks/BasicRedeemHook.sol#L11-L19)

```solidity
function callHook(address asset, uint256 assets) public virtual {
    IVaultModule vault = IVaultModule(address(this));
@>  uint256 liquid = IERC20(asset).balanceOf(address(vault));
    ...
    for (uint256 i = 0; i < subvaults; i++) {
        address subvault = vault.subvaultAt(i);
@>      uint256 balance = IERC20(asset).balanceOf(subvault);
        ...
    }
}
```


### Internal Pre-conditions

1. Using native token as asset token

### External Pre-conditions

None

### Attack Path

1. Attempt to withdraw after depositing native token

### Impact

Cannot withdraw native token. Users cannot withdraw asset token.

### PoC

The following PoC shows that `vault.getLiquidAssets` fails. Add to `flexible-vaults/test/unit/modules/ShareModule.t.sol` and run.

```solidity
function test_poc_GetLiquidAssets() external {
    address asset = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE); // native
    assets.push(address(asset));

    Deployment memory deployment = createVault(vaultAdmin, vaultProxyAdmin, assets);

    vm.startPrank(vaultAdmin);
    deployment.vault.setQueueLimit(2);
    deployment.vault.createQueue(0, true, vaultProxyAdmin, address(asset), new bytes(0));
    deployment.vault.createQueue(0, false, vaultProxyAdmin, address(asset), new bytes(0));
    assertEq(deployment.vault.getQueueCount(), 2, "Queue count should be 2");
    vm.stopPrank();

    address depositQueue = deployment.vault.queueAt(address(asset), 0);
    address redeemQueue = deployment.vault.queueAt(address(asset), 1);

    vm.prank(redeemQueue);
    vm.expectRevert();
    deployment.vault.getLiquidAssets();
}
```

### Mitigation

When the asset token is a native token, query the native token balance instead of using `ERC20.balanceOf`.


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/10/files
