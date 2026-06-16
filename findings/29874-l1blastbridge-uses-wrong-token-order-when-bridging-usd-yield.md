---
tags:
  - lang/solidity
  - sector/bridge
  - sector/liquid-staking
  - sector/stable
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - trigger/cross-chain-message
protocol: "[[DRAFT]]"
auditors:
  - "[[Milo Truck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/report-blast-contracts-review-draft.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[cross-chain-message]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# L1BlastBridge uses wrong token order when bridging USD yield tokens

- id: 29874
- impact: HIGH
- protocol: [[DRAFT]]
- reporter: Milo Truck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/report-blast-contracts-review-draft.pdf

## Summary


The bug report discusses two critical bugs in different parts of the code. The first bug is related to bridging USD yield tokens, which currently fails due to incorrect token swapping. The recommended solution is to swap the local and remote tokens in the code. 

The second bug is in the DelegateCalls library, which is used by the YieldManager to delegate calls to a YieldProvider. The bug is caused by incorrect calldata encoding, which can lead to writing into unallocated memory and incorrect function calls. The recommended solution is to clean up the functions in the library and use the abi.encodeWithSelector function instead of hand-crafting the calldata. 

The report also suggests defining an interface for the desired functions and adding mainnet fork integration tests with the actual protocols to ensure proper functionality. These bugs prevent L2 to L1 withdrawals and claiming unstaked funds from Lido, making it critical to address them.

## Details

## Vulnerability Report

## DRAFT5.1.3: _initiateBridgeERC20 Function Issue

**Severity:** Critical Risk  
**Context:** L1BlastBridge.sol#L196-L197, StandardBridge.sol#L265-L267  

**Description:**  
The `_initiateBridgeERC20` function encodes the USD bridge message as follows:

```solidity
messenger.sendMessage(
    Predeploys.L2_BLAST_BRIDGE,
    abi.encodeWithSelector(
        StandardBridge.finalizeBridgeERC20.selector,
        address(USDConversions.DAI),
        Predeploys.USDB,
        _from,
        _to,
        amountToMintWad,
        _extraData
    ),
    _minGasLimit
);
```

The DAI and USDB tokens need to be swapped. Currently, the L2 `L2BlastBridge.finalizeBridgeERC20` will decode `_localToken=DAI` and `_remoteToken=USDB`. It will then attempt to call `transfer` on the DAI address on L2 using `safeTransfer`, which will fail as no contract is deployed for it. Bridging USD yield tokens currently fails.

**Recommendation:**  
Swap the local and remote tokens in `L1BlastBridge._initiateBridgeERC20`.

---

## DRAFT5.1.3: _delegatecall_uint256_arr_arg_returns_uint256 Wrong Calldata Encoding

**Severity:** Critical Risk  
**Context:** DelegateCalls.sol#L26-L84  

**Description:**  
The DelegateCalls library is used by the YieldManager to delegatecall into a YieldProvider. The calldata encoding for most of the `_delegatecall_*` functions is excessive (uses more calldata bytes than needed) or incorrect:

- The `abi.encodePacked` function is used to encode the calldata, using a 256-bit selector argument when 4 bytes are enough.
- The `_delegatecall_uint256_arg_returns_uint256` can write into unallocated memory in `returndata-copy(ptr, 0, size)` if `size > 0x24`.
- The `_delegatecall_uint256_arr_arg_returns_uint256` encodes the calldata as `abi.encodePacked(selector, uint256[] arg)` which leads to an incorrect calldata encoding:

    ```plaintext
    0x00-0x20: selector
    0x20-0x40: arg[0]
    0x40-0x60: arg[1]
    // ...
    ```

  However, this should be ABI encoded. For instance, `abi.encodeWithSelector(bytes4(bytes32(selector)), arg)` should provide the correct result:

    ```plaintext
    aabbccdd // selector
    0000000000000000000000000000000000000000000000000000000000000020 // arr offset
    0000000000000000000000000000000000000000000000000000000000000002 // arr length
    0000000000000000000000000000000000000000000000000000000000001337 // arr[0]
    0000000000000000000000000000000000000000000000000000000000001338 // arr[1]
    ```

Currently, the `YieldProvider.claim(uint256[] calldata requestIds)` calls are all performed with an empty `requestIds` regardless of the `requestIds` defined by the calling YieldManager. The `YieldManager.claimPending(uint256 idx, address providerAddress, uint256[] requestIds)` calling `LidoYieldProvider.claim(requestIds)` will not actually perform a withdrawal from Lido. This prevents claiming unstaked funds from Lido, thereby hindering L2 to L1 withdrawals.

**Recommendation:**  
Consider cleaning up the functions in the DelegateCalls library and using `abi.encodeWithSelector(selector, args)` everywhere instead of hand-crafting the calldata:

```solidity
// always use encodeWithSelector with an optional argument
- abi.encodePacked(selector, arg)
+ abi.encodeWithSelector(bytes4(bytes32(selector)), arg)
```

Alternatively, directly define the interface for the desired functions:

```solidity
// pseudo code
- function _delegatecall_uint256_arr_arg_returns_uint256(address provider, uint256 selector, uint256[] memory arg) internal returns (uint256) {
- (bool success, bytes memory res) = provider.delegatecall(abi.encodePacked(selector, arg));
- require(success, "delegatecall failed");
- return abi.decode(res, (uint256));
- }

+ interface IDelegateCalls {
+ function claim(uint256[] calldata requestIds) external returns (uint256 claimed);
+ // ...
+ }
+ function _delegatecall_claim(address provider, uint256[] memory arg) internal returns (uint256) {
+ (bool success, bytes memory res) = provider.delegatecall(abi.encodeCall(IDelegateCalls.claim, arg));
+ require(success, "delegatecall failed");
+ return abi.decode(res, (uint256));
+ }
```

Consider adding mainnet fork integration tests with the actual protocols. The `YieldManager.t.sol:test_claimPending_Lido_succeeds` currently passes because the `MockLidoWithdrawalQueue.claimWithdrawals` ignores the array parameters.
