---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/staking
  - sector/governance
  - platform/sherlock
protocol: "[[Babylon Chain Launch]]"
auditors:
  - LZ\_security
report: "https://github.com/sherlock-audit/2024-12-babylon-judging"
genome:
  - "[[timestamp-dependence]]"
  - "[[integer-bounds]]"
  - "[[logic/wrong-condition]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[trigger/time-based/timelock-expiry]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-2: The EXPIRED judgment does not include the current block

- id: 55372
- impact: HIGH
- protocol: Babylon chain launch (phase-2)
- reporter: LZ\_security (Sherlock)
- source: N/A

## Summary


Issue H-2: The EXPIRED judgment does not include the current block, causing a potential panic and double reduction in TotalBondedSat for delegators. This is due to a bug in the GetStatus function, which does not include the current block in its judgment. The bug can be triggered by executing BTCUndelegate and EXPIRED in the same block. The issue has been fixed by the protocol team in the following PRs/commits: https://github.com/babylonlabs-io/babylon/pull/597. 

## Details

Source: https://github.com/sherlock-audit/2024-12-babylon-judging/issues/33 

## Found by 
LZ\_security


### Summary
The EXPIRED judgment does not include the current block, fp can still be unbonded after Delegation EXPIRED.

### Root Cause
btcHeight+d.UnbondingTime > d.EndHeight should be btcHeight+d.UnbondingTime >= d.EndHeight

### Internal Pre-conditions

### External Pre-conditions

### Attack Path
1. The Delegation of fp is about to expire.
2. fp executes BTCUndelegate in the same block that expires.

### Impact

When the unbonded event is executed after the EXPIRED event, a painc occurs and the chain is halted.
Or it will result in a double reduction in the`TotalBondedSat` of fp.

### PoC

The `BTCUndelegate` function gets the status through `GetStatus`, and Delegation `EXPIRED` returns an error:

```go
func (ms msgServer) BTCUndelegate(goCtx context.Context, req *types.MsgBTCUndelegate) (*types.MsgBTCUndelegateResponse, error) {
	defer telemetry.ModuleMeasureSince(types.ModuleName, time.Now(), types.MetricsKeyBTCUndelegate)

	ctx := sdk.UnwrapSDKContext(goCtx)
	// basic stateless checks
	if err := req.ValidateBasic(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "%v", err)
	}

	btcDel, bsParams, err := ms.getBTCDelWithParams(ctx, req.StakingTxHash)

	if err != nil {
		return nil, err
	}

	// ensure the BTC delegation with the given staking tx hash is active
	btcTip := ms.btclcKeeper.GetTipInfo(ctx)

->	btcDelStatus := btcDel.GetStatus(
		btcTip.Height,
		bsParams.CovenantQuorum,
	)

->	if btcDelStatus == types.BTCDelegationStatus_UNBONDED || btcDelStatus == types.BTCDelegationStatus_EXPIRED {
		return nil, types.ErrInvalidBTCUndelegateReq.Wrap("cannot unbond an unbonded BTC delegation")
	}
    ......
}
```

The problem is that `GetStatus` does not include the current block in its judgment. If the current block is in `d.EndHeight - d.UnbondingTime`, 
`BTCDelegationStatus_EXPIRED` will not be returned:

```go
func (d *BTCDelegation) GetStatus(
	btcHeight uint32,
	covenantQuorum uint32,
) BTCDelegationStatus {
    ......

->   // btcHeight = currentBtcTipHeight 
->   // if btcHeight > d.EndHeight - d.UnbondingTime
->	if btcHeight+d.UnbondingTime > d.EndHeight {
		return BTCDelegationStatus_EXPIRED
	}

	return BTCDelegationStatus_ACTIVE
}
```

The EXPIRED event executes at: `d.EndHeight - d.UnbondingTime`

```go

func (k Keeper) AddBTCDelegation(
	ctx sdk.Context,
	btcDel *types.BTCDelegation,
) error {
    ......
    // record event that the BTC delegation will become expired (unbonded) at EndHeight-w
    // This event will be generated to subscribers as block event, when the
    // btc light client block height will reach btcDel.EndHeight-wValue
    expiredEvent := types.NewEventPowerDistUpdateWithBTCDel(&types.EventBTCDelegationStateUpdate{
        StakingTxHash: stakingTxHash.String(),
        NewState:      types.BTCDelegationStatus_EXPIRED,
    })

    // NOTE: we should have verified that EndHeight > btcTip.Height + unbonding_time
->  k.addPowerDistUpdateEvent(ctx, btcDel.EndHeight-btcDel.UnbondingTime, expiredEvent)
	......
}

```
https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/btcstaking/types/btc_delegation.go#L145-L147


So `BTCUndelegate` and `EXPIRED` can be executed in the same block.

When handling EXPIRED events, delegater's unbond state is determined first(IsUnbondedEarly), but since the event is handled in `BeginBlocker` and sent before `BTCUndelegate`, so `DelegatorUnbondingInfo` is not set:

```go
func (k Keeper) ProcessAllPowerDistUpdateEvents(
	ctx context.Context,
	dc *ftypes.VotingPowerDistCache,
	events []*types.EventPowerDistUpdate,
) *ftypes.VotingPowerDistCache {
	        ........
			case types.BTCDelegationStatus_UNBONDED:
				// add the unbonded BTC delegation to the map
				//@audit-info unbonded 之fp 应该从 fpByBtcPkHex 缓存列表中删除 UNBONDED 和 EXPIRED 同时发送?
				k.processPowerDistUpdateEventUnbond(ctx, fpByBtcPkHex, btcDel, unbondedSatsByFpBtcPk)
			case types.BTCDelegationStatus_EXPIRED:
				types.EmitExpiredDelegationEvent(sdkCtx, delStkTxHash)

->				// IsUnbondedEarly -> return d.BtcUndelegation.DelegatorUnbondingInfo != nil
->				if !btcDel.IsUnbondedEarly() {
					// only adds to the new unbonded list if it hasn't
					// previously unbonded with types.BTCDelegationStatus_UNBONDED
					k.processPowerDistUpdateEventUnbond(ctx, fpByBtcPkHex, btcDel, unbondedSatsByFpBtcPk)
				}
			}
```

This leads to a painc:

UpdatePowerDist -> ProcessAllPowerDistUpdateEvents -> MustProcessBtcDelegationUnbonded :

```go
func (k Keeper) MustProcessBtcDelegationUnbonded(ctx context.Context, fp, del sdk.AccAddress, sats uint64) {
	err := k.IncentiveKeeper.BtcDelegationUnbonded(ctx, fp, del, sats)
->	if err != nil {
->		panic(err)
	}
}

func (k Keeper) BtcDelegationUnbonded(ctx context.Context, fp, del sdk.AccAddress, sat uint64) error {
	amtSat := sdkmath.NewIntFromUint64(sat)
	return k.btcDelegationModifiedWithPreInitDel(ctx, fp, del, func(ctx context.Context, fp, del sdk.AccAddress) error {
->		return k.subDelegationSat(ctx, fp, del, amtSat)
	})
}


func (k Keeper) subDelegationSat(ctx context.Context, fp, del sdk.AccAddress, amt sdkmath.Int) error {
	btcDelRwdTracker, err := k.GetBTCDelegationRewardsTracker(ctx, fp, del)
	if err != nil {
		return err
	}

->	btcDelRwdTracker.SubTotalActiveSat(amt)
->	if btcDelRwdTracker.TotalActiveSat.IsNegative() {
->		return types.ErrBTCDelegationRewardsTrackerNegativeAmount
	}
	if err := k.setBTCDelegationRewardsTracker(ctx, fp, del, btcDelRwdTracker); err != nil {
		return err
	}

	return k.subFinalityProviderStaked(ctx, fp, amt)
}
```
https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/finality/keeper/power_dist_change.go#L437-L442

The event is handled in `BeginBlocker`, and painc causes the chain to halt.

finality/abci.go/BeginBlocker -> UpdatePowerDist -> ProcessAllPowerDistUpdateEvents

The`amt` passed by the`subDelegationSat` function, which is actually the amount of delegation, is set when`AddBTCDelegation` is added.

`UpdatePowerDist` function, through `k.BTCStakingKeeper.GetBTCDelegation(ctx, delStkTxHash)`  get this value and use this value to update `fp.TotalBondedSat`. If UNBOND is repeated, `fp.TotalBondedSat` will also be reduced repeatedly.

### Mitigation

```diff
func (d *BTCDelegation) GetStatus(
	btcHeight uint32,
	covenantQuorum uint32,
) BTCDelegationStatus {

    ......
-	if btcHeight+d.UnbondingTime > d.EndHeight {
+	if btcHeight+d.UnbondingTime >= d.EndHeight {
		return BTCDelegationStatus_EXPIRED
	}

	return BTCDelegationStatus_ACTIVE
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
 https://github.com/babylonlabs-io/babylon/pull/597
