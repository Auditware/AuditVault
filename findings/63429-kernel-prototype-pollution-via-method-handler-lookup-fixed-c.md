---
tags:
  - lang/solidity
  - sector/wallet
  - platform/consensys
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[MetaMask]]"
auditors:
  - "[[Pedro Santos]]"
report: "https://diligence.consensys.io/audits/2025/08/metamask-eip-7715-permissions-snap/"
genome:
  - "[[missing]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# Kernel - Prototype Pollution via Method Handler Lookup ✓ Fixed

- id: 63429
- impact: HIGH
- protocol: [[MetaMask]] - EIP-7715 Permissions Snap
- reporter:  Pedro Santos
                         (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/08/metamask-eip-7715-permissions-snap/

## Summary


The report describes a bug found in the MetaMask/snap-7715-permissions repository on GitHub. The bug allows attackers to access inherited functions from Object.prototype when making RPC requests. This can result in unintended functions being invoked, potentially causing harm or extracting sensitive information. The bug has been fixed by implementing explicit checks to ensure methods exist directly on the handler object. The fix can be found in the commit 476e6534f9e219ac130f7e9c4f10f6b3f17b12ed. It is recommended to use `Object.prototype.hasOwnProperty.call()` or `Map` data structure to prevent prototype chain access.

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

Fixed in [MetaMask/snap-7715-permissions@`476e653`](https://github.com/MetaMask/snap-7715-permissions/commit/476e6534f9e219ac130f7e9c4f10f6b3f17b12ed) by checking `Object.prototype.hasOwnProperty` on the request struct before accessing it. In `Gator` this is safeguarded by a check for `isMethodAllowedForOrigin`. The client provided additional details:

> **Summary of Finding:** request.method lacked validation, enabling prototype pollution.  
> **Resolution:** We introduced explicit checks to ensure methods exist directly on the handler object (not on its prototype). Additionally, in gator-permission-snap, we enforce isMethodAllowedForOrigin, which restricts invocation so that only the kernel can call specific methods. This design prevents prototype pollution attacks in that context.  
> **Implementation:** PR: [MetaMask/snap-7715-permissions#147](https://github.com/MetaMask/snap-7715-permissions/pull/147).  
> **Verification:** Attempting to invoke prototype methods correctly fails.  
> Reviewed call flow in Gator Snap to confirm isMethodAllowedForOrigin ensures untrusted origins cannot bypass validation.

#### Description

The RPC method handler lookup is vulnerable to prototype pollution attacks. When `request.method` contains prototype property names like `toString`, `valueOf`, `constructor`, or `hasOwnProperty`, the code accesses inherited methods from `Object.prototype` instead of returning `undefined`. This allows attackers to invoke unintended functions and potentially extract sensitive information or cause unexpected behavior.

#### Example

* `boundRpcHandlers` inherits functions from `Object.prototype`
* by accessing `boundRpcHandlers[request.method]` without whitelisting method names, the caller can call arbitrary inherited functions

**packages/permissions-kernel-snap/src/index.ts:L29-L52**

```
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  logger.info(
    `Custom request (origin="${origin}"):`,
    JSON.stringify(request, undefined, 2),
  );

  const handler = boundRpcHandlers[request.method];

  if (!handler) {
    throw new Error(`Method ${request.method} not found.`);
  }
```

**packages/permissions-kernel-snap/src/index.ts:L12-L27**

```
// set up dependencies
const rpcHandler = createRpcHandler({
  permissionOfferRegistryManager: createPermissionOfferRegistryManager(snap),
  snapsProvider: snap,
});

// configure RPC methods bindings
const boundRpcHandlers: {
  [RpcMethod: string]: (options: {
    siteOrigin: string;
    params?: JsonRpcParams;
  }) => Promise<Json>;
} = {
  [RpcMethod.WalletRequestExecutionPermissions]:
    rpcHandler.requestExecutionPermissions.bind(rpcHandler),
};
```

#### Recommendation

Use `Object.prototype.hasOwnProperty.call()` or `Map` data structure instead of object property access, or implement explicit method validation using `Object.hasOwn()` to prevent prototype chain access.
