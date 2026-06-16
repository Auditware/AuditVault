---
tags:
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/infra
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Initia]]"
auditors:
  - "[[berndartmueller]]"
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-03] `ExecuteRequest`’s are not properly removed from the context queue

- id: 55306
- impact: HIGH
- protocol: [[Initia]]
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The `minievm` cosmos precompile allows a Solidity contract to dispatch a Cosmos SDK message, which is executed after the EVM call is successfully executed. This can be done by calling the cosmos precompile with specific function selectors and passing the encoded message. However, there is a bug where dispatched messages are not removed from the queue in certain scenarios, leading to unexpected behavior. This can have severe consequences, such as funds being locked or lost. A proof of concept has been provided to demonstrate this issue. The recommended mitigation step is to ensure that the dispatched messages are properly removed and not executed. The bug has been confirmed and fixed by the developers.

## Details



The `minievm` cosmos precompile allows a Solidity contract to dispatch a Cosmos SDK message, which is executed after the EVM call is successfully executed.

This is done by calling the cosmos precompile with the `execute_cosmos` or `execute_cosmos_with_options` function selector and passing the encoded message. This will wrap the message with `ExecuteRequest` and append it to the messages slice in the context with the key `types.CONTEXT_KEY_EXECUTE_REQUESTS`.

[`minievm:x/evm/precompiles/cosmos/contract.go# L287-L294`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/cosmos/contract.go# L287-L294)
```

287: messages := ctx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS).(*[]types.ExecuteRequest)
288: *messages = append(*messages, types.ExecuteRequest{
289: 	Caller: caller,
290: 	Msg:    sdkMsg,
291:
292: 	AllowFailure: executeCosmosArguments.Options.AllowFailure,
293: 	CallbackId:   executeCosmosArguments.Options.CallbackId,
294: })
```

Then, after the EVM call finished successfully in `EVMCallWithTracer()`, it [executes the scheduled messages](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L347-L353). The same is done in `EVMCreateWithTracer()`.
```

347: // handle cosmos execute requests
348: requests := sdkCtx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS).(*[]types.ExecuteRequest)
349: if dispatchLogs, err := k.dispatchMessages(sdkCtx, *requests); err != nil {
350: 	return nil, nil, err
351: } else {
352: 	logs = append(logs, dispatchLogs...)
353: }
```

The issue is that dispatched messages are not removed from the queue in the scenario where they have been dispatched by an external Solidity that reverts but where a `try/catch` contains the error. In this case, the messages are still executed.

It seems this is because `prepareSDKContext(..)` [sets the empty cosmos messages queue to the outer context](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L223), while any [internal EVM that creates a new `statedb` snapshot](https://github.com/initia-labs/evm/blob/3d312736d7fbf68af35df985b01536684bf6aafa/core/vm/evm.go# L196) will not result in a new context with it’s own, empty `types.CONTEXT_KEY_EXECUTE_REQUESTS` queue. When the cosmos precompile [retrieves the queue from the context](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/cosmos/contract.go# L287) with `ctx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS)`, the context is traversed up to the outer context which holds the key/value (pointer).

Overall, this is very problematic as it leads to unexpected behavior. For example, the external call reverts on purpose due to an invariant being violated, but the dispatched message that is still executed might be a sensitive operation (e.g., IBC token transfer) that should only be executed in the successful case. This can have severe consequences, including funds being locked or lost.

### Proof of Concept

The following Poc amends the `Counter` Solidity contract by adding a new external function `nested(..)`, which dispatches a nested `MsgCall` EVM Cosmos SDK messages, followed by a `revert()`.

The `nested(..)` function is called in the `recursive(..)` function, wrapped in a `try/catch` block so that the revert is caught and does not propagate.
```

diff --git a/x/evm/contracts/counter/Counter.sol b/x/evm/contracts/counter/Counter.sol
index 2c5166e..d6a4930 100644
--- a/x/evm/contracts/counter/Counter.sol
+++ b/x/evm/contracts/counter/Counter.sol
@@ -81,10 +81,18 @@ contract Counter is IIBCAsyncCallback {
             return;
         }

-        COSMOS_CONTRACT.execute_cosmos(_recursive(n));

-        // to test branching
+        try this.nested(n) {
+            // do nothing
+        } catch {
+            // do nothing
+        }
+    }
+
+    function nested(uint64 n) external {
         COSMOS_CONTRACT.execute_cosmos(_recursive(n));
+
+        revert();
     }

     function _recursive(uint64 n) internal returns (string memory message) {
```

After applying the git diff, re-compile the Solidity contracts with `make contracts-gen`.

Then, copy and paste the following test case in `x/evm/keeper/context_test.go`. It will show that the dispatched message is still executed, by verifying that the `logs` contain the `recursive_called` event twice.
```

func Test_Recursive_Audit_ExecuteRequestsNotCleanedOnRevert(t *testing.T) {
	ctx, input := createDefaultTestInput(t)
	_, _, addr := keyPubAddr()

	counterBz, err := hexutil.Decode(counter.CounterBin)
	require.NoError(t, err)

	// deploy counter contract
	caller := common.BytesToAddress(addr.Bytes())
	retBz, contractAddr, _, err := input.EVMKeeper.EVMCreate(ctx, caller, counterBz, nil, nil)
	require.NoError(t, err)
	require.NotEmpty(t, retBz)
	require.Len(t, contractAddr, 20)

	// call recursive function
	parsed, err := counter.CounterMetaData.GetAbi()
	require.NoError(t, err)

	inputBz, err := parsed.Pack("recursive", uint64(1))
	require.NoError(t, err)

	_, logs, err := input.EVMKeeper.EVMCall(ctx, caller, contractAddr, inputBz, nil, nil)
	require.NoError(t, err)
	require.Len(t, logs, 2)

	// check logs
	log := logs[0]
	require.Equal(t, contractAddr.Hex(), log.Address)
	require.Equal(t, parsed.Events["recursive_called"].ID.Hex(), log.Topics[0])
	require.Equal(t, "0x0000000000000000000000000000000000000000000000000000000000000001", log.Data)

	log = logs[1]
	require.Equal(t, contractAddr.Hex(), log.Address)
	require.Equal(t, parsed.Events["recursive_called"].ID.Hex(), log.Topics[0])
	require.Equal(t, "0x0000000000000000000000000000000000000000000000000000000000000000", log.Data)
}
```

### Recommended mitigation steps

Consider making sure that the `ExecuteRequest`’s that have been dispatched by an EVM call that reverted, are properly removed and not executed.

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-7?commentParent=Ng9wELuxANu):**

> Here is the [fix](https://github.com/initia-labs/minievm/commit/1dd732449ea414b0e3c3f6efd085d38e11d058ed).

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Fixed to maintain execute request on snapshot.

**Status:** Mitigation confirmed. Full details in reports from [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-15), [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-29) and [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-36).

---



## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
