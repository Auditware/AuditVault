---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/restaking
  - sector/staking
  - sector/governance
  - platform/sherlock
protocol: "[[Babylon Chain Launch]]"
auditors:
  - LZ\_security
report: "https://github.com/sherlock-audit/2024-12-babylon-judging"
genome:
  - "[[signature-malleability]]"
  - "[[approval-expiry]]"
  - "[[logic/wrong-condition]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[trigger/time-based/timelock-expiry]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-3: If the Covenant signature does not pass , EXPIRED events it will still be executed.

- id: 55373
- impact: HIGH
- protocol: Babylon chain launch (phase-2)
- reporter: LZ\_security (Sherlock)
- source: N/A

## Summary


The bug report describes an issue where if the Covenant signature does not pass, EXPIRED events, it will still be executed. This causes a decrease in the `fp.TotalBondedSat` and can potentially lead to a negative balance in the system. The bug was found by LZ\_security and the root cause is that the Covenant signature is still executed even if it fails. This can be exploited by a Delegater who can block the Covenant signature by using `BTCUndelegate`. To fix this issue, the suggestion is to send the EXPIRED and Active messages together instead of separately.

## Details

Source: https://github.com/sherlock-audit/2024-12-babylon-judging/issues/35 

## Found by 
LZ\_security


### Summary

If the Covenant signature does not pass , EXPIRED events it will still be executed, causes `fp.TotalBondedSat` to be incorrectly reduced.

### Root Cause
If the Covenant signature does not pass , EXPIRED events it will still be executed.

### Internal Pre-conditions

### External Pre-conditions

### Attack Path

1. Delegater uses the `CreateBTCDelegation` command to create a Delegation. The `EXPIRED` message is sent.
2. The Covenants began to sign.
3. Delegater unstake before the number of signatures reaches the threshold.
4. The signature fails. The Active message cannot be sent, but the EXPIRED message is sent.
5. The EXPIRED file is executed after a period of time.

### Impact
`fp.TotalBondedSat` to be incorrectly reduced.

### PoC

Create a Delegation, if by `AddBTCDelegationInclusionProof` function, `activeEvent` and `expiredEvent` will be added at the same time:

```go
func (ms msgServer) AddBTCDelegationInclusionProof(
	goCtx context.Context,
	req *types.MsgAddBTCDelegationInclusionProof,
) (*types.MsgAddBTCDelegationInclusionProofResponse, error) {
    ......
	activeEvent := types.NewEventPowerDistUpdateWithBTCDel(
		&types.EventBTCDelegationStateUpdate{
			StakingTxHash: stakingTxHash.String(),
			NewState:      types.BTCDelegationStatus_ACTIVE,
		},
	)

	ms.addPowerDistUpdateEvent(ctx, timeInfo.TipHeight, activeEvent)

	// record event that the BTC delegation will become unbonded at EndHeight-w
	expiredEvent := types.NewEventPowerDistUpdateWithBTCDel(&types.EventBTCDelegationStateUpdate{
		StakingTxHash: req.StakingTxHash,
		NewState:      types.BTCDelegationStatus_EXPIRED,
	})

	// NOTE: we should have verified that EndHeight > btcTip.Height + min_unbonding_time
	ms.addPowerDistUpdateEvent(ctx, btcDel.EndHeight-params.UnbondingTimeBlocks, expiredEvent)
......
}
```

The problem is that if the `CreateBTCDelegation` function is used, the `expiredEvent` is sent first, and the `activeEvent` is sent after the Covenants signature is passed.
If the signature does not pass the activeEvent, it will never be sent, but `expiredEvent` has been sent and will eventually execute:

https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/btcstaking/keeper/msg_server.go#L294-L297

https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/btcstaking/keeper/btc_delegations.go#L76-L83

https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/btcstaking/keeper/btc_delegations.go#L134-L141


If staker/Delegater is unstake in the btc chain after the `CreateBTCDelegation` enters the Covenants signature phase,Covenants should not sign:

In addition,`BTCUndelegate` causes the signature to fail:

```go

func (ms msgServer) AddCovenantSigs(goCtx context.Context, req *types.MsgAddCovenantSigs) (*types.MsgAddCovenantSigsResponse, error) {
    ......
	// ensure BTC delegation is still pending, i.e., not unbonded
	btcTipHeight := ms.btclcKeeper.GetTipInfo(ctx).Height
	status := btcDel.GetStatus(btcTipHeight, params.CovenantQuorum)
->	if status == types.BTCDelegationStatus_UNBONDED || status == types.BTCDelegationStatus_EXPIRED {
		ms.Logger(ctx).Debug("Received covenant signature after the BTC delegation is already unbonded", "covenant pk", req.Pk.MarshalHex())
		return nil, types.ErrInvalidCovenantSig.Wrap("the BTC delegation is already unbonded")
	}

    ......
}
```


Covenants If the signature is not passed, the `BTCUndelegate` can be executed only when the `UNBONDED` or `EXPIRED` status is unavailable
Undelegate, So staker can block Covenants' signatures by using `BTCUndelegate`.

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


expiredEvent causes fp's `TotalBondedSat` to decrease, or a negative number in the system causes painc.

The balance of Delegater is set upon creation and stored in the Store:

```go
// CreateBTCDelegation creates a BTC delegation
func (ms msgServer) CreateBTCDelegation(goCtx context.Context, req *types.MsgCreateBTCDelegation) (*types.MsgCreateBTCDelegationResponse, error) {
    ......

	// 7.all good, construct BTCDelegation and insert BTC delegation
	// NOTE: the BTC delegation does not have voting power yet. It will
	// have voting power only when it receives a covenant signatures
	newBTCDel := &types.BTCDelegation{
		StakerAddr:       parsedMsg.StakerAddress.String(),
		BtcPk:            parsedMsg.StakerPK.BIP340PubKey,
		Pop:              parsedMsg.ParsedPop,
		FpBtcPkList:      parsedMsg.FinalityProviderKeys.PublicKeysBbnFormat,
		StakingTime:      uint32(parsedMsg.StakingTime),
		StartHeight:      timeInfo.StartHeight,
		EndHeight:        timeInfo.EndHeight,
->		TotalSat:         uint64(parsedMsg.StakingValue),
		StakingTx:        parsedMsg.StakingTx.TransactionBytes,
		StakingOutputIdx: paramsValidationResult.StakingOutputIdx,
		SlashingTx:       types.NewBtcSlashingTxFromBytes(parsedMsg.StakingSlashingTx.TransactionBytes),
		DelegatorSig:     parsedMsg.StakerStakingSlashingTxSig.BIP340Signature,
		UnbondingTime:    uint32(parsedMsg.UnbondingTime),
		CovenantSigs:     nil, // NOTE: covenant signature will be submitted in a separate msg by covenant
		BtcUndelegation: &types.BTCUndelegation{
			UnbondingTx:              parsedMsg.UnbondingTx.TransactionBytes,
			SlashingTx:               types.NewBtcSlashingTxFromBytes(parsedMsg.UnbondingSlashingTx.TransactionBytes),
			DelegatorSlashingSig:     parsedMsg.StakerUnbondingSlashingSig.BIP340Signature,
			CovenantSlashingSigs:     nil, // NOTE: covenant signature will be submitted in a separate msg by covenant
			CovenantUnbondingSigList: nil, // NOTE: covenant signature will be submitted in a separate msg by covenant
			DelegatorUnbondingInfo:   nil,
		},
		ParamsVersion: paramsVersion,      // version of the params against which delegation was validated
		BtcTipHeight:  timeInfo.TipHeight, // height of the BTC light client tip at the time of the delegation creation
	}

	// add this BTC delegation, and emit corresponding events
->	if err := ms.AddBTCDelegation(ctx, newBTCDel); err != nil {
		panic(fmt.Errorf("failed to add BTC delegation that has passed verification: %w", err))
	}
```

When handling `expiredEvent` events, the balance of Delegater is read and fp TotalBondedSat is reduced:

```go
func (k Keeper) ProcessAllPowerDistUpdateEvents(
	ctx context.Context,
	dc *ftypes.VotingPowerDistCache,
	events []*types.EventPowerDistUpdate,
) *ftypes.VotingPowerDistCache {
	// a map where key is finality provider's BTC PK hex and value is a list
	// of BTC delegations satoshis amount that newly become active under this provider
	activedSatsByFpBtcPk := map[string][]uint64{}
	// a map where key is finality provider's BTC PK hex and value is a list
	// of BTC delegations satoshis that were unbonded or expired without previously
	// being unbonded
	unbondedSatsByFpBtcPk := map[string][]uint64{}
	// a map where key is slashed finality providers' BTC PK
	slashedFPs := map[string]struct{}{}
	// a map where key is jailed finality providers' BTC PK
	jailedFPs := map[string]struct{}{}
	// a map where key is unjailed finality providers' BTC PK
	unjailedFPs := map[string]struct{}{}

	// simple cache to load fp by his btc pk hex
	fpByBtcPkHex := map[string]*types.FinalityProvider{}

	/*
		filter and classify all events into new/expired BTC delegations and jailed/slashed FPs
	*/
	sdkCtx := sdk.UnwrapSDKContext(ctx)
	for _, event := range events {
		switch typedEvent := event.Ev.(type) {
		case *types.EventPowerDistUpdate_BtcDelStateUpdate:
			delEvent := typedEvent.BtcDelStateUpdate
			delStkTxHash := delEvent.StakingTxHash

->			btcDel, err := k.BTCStakingKeeper.GetBTCDelegation(ctx, delStkTxHash)
			if err != nil {
				panic(err) // only programming error
			}

			switch delEvent.NewState {
			case types.BTCDelegationStatus_ACTIVE:
				// newly active BTC delegation
				// add the BTC delegation to each restaked finality provider
				for _, fpBTCPK := range btcDel.FpBtcPkList {
					fpBTCPKHex := fpBTCPK.MarshalHex()
					activedSatsByFpBtcPk[fpBTCPKHex] = append(activedSatsByFpBtcPk[fpBTCPKHex], btcDel.TotalSat)
				}

				k.processRewardTracker(ctx, fpByBtcPkHex, btcDel, func(fp, del sdk.AccAddress, sats uint64) {
					k.MustProcessBtcDelegationActivated(ctx, fp, del, sats)//
				})
			case types.BTCDelegationStatus_UNBONDED:
				// add the unbonded BTC delegation to the map
->				k.processPowerDistUpdateEventUnbond(ctx, fpByBtcPkHex, btcDel, unbondedSatsByFpBtcPk)
			case types.BTCDelegationStatus_EXPIRED:
				types.EmitExpiredDelegationEvent(sdkCtx, delStkTxHash)

				// IsUnbondedEarly -> return d.BtcUndelegation.DelegatorUnbondingInfo != nil
				if !btcDel.IsUnbondedEarly() {
					// only adds to the new unbonded list if it hasn't
					// previously unbonded with types.BTCDelegationStatus_UNBONDED
->					k.processPowerDistUpdateEventUnbond(ctx, fpByBtcPkHex, btcDel, unbondedSatsByFpBtcPk)
				}
			}
            .....


            // process all new unbonding BTC delegations under this finality provider
            if fpUnbondedSats, ok := unbondedSatsByFpBtcPk[fpBTCPKHex]; ok {
                // handle unbonded delegations for this finality provider
                for _, unbodedSats := range fpUnbondedSats {
->                    // RemoveBondedSats -> v.TotalBondedSat -= sats
->                    fp.RemoveBondedSats(unbodedSats)
                }
                // remove the finality provider entry in fpUnbondedSats map, so that
                // after the for loop the rest entries in fpUnbondedSats belongs to new
                // finality providers that might have btc delegations entries
                // that activated and unbonded in the same slice of events
                delete(unbondedSatsByFpBtcPk, fpBTCPKHex)
            }
            ......
        }
    }

func (k Keeper) processPowerDistUpdateEventUnbond(
	ctx context.Context,
	cacheFpByBtcPkHex map[string]*types.FinalityProvider,
	btcDel *types.BTCDelegation,
	unbondedSatsByFpBtcPk map[string][]uint64,
) {
	for _, fpBTCPK := range btcDel.FpBtcPkList {
		fpBTCPKHex := fpBTCPK.MarshalHex()
->		unbondedSatsByFpBtcPk[fpBTCPKHex] = append(unbondedSatsByFpBtcPk[fpBTCPKHex], btcDel.TotalSat)
	}
	k.processRewardTracker(ctx, cacheFpByBtcPkHex, btcDel, func(fp, del sdk.AccAddress, sats uint64) {
		k.MustProcessBtcDelegationUnbonded(ctx, fp, del, sats)
	})
}
```

### Mitigation
Send EXPIRED and Active messages at the same time instead of separately.
