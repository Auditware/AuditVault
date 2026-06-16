---
tags:
  - sector/infra
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Babylon Chain Launch]]"
auditors:
  - 0xeix
report: "https://github.com/sherlock-audit/2024-12-babylon-judging"
genome:
  - "[[fee-accounting]]"
  - "[[direct-drain]]"
---
# H-1: Refund mechanism doesn't make sure that there is a fee granter

- id: 55371
- impact: HIGH
- protocol: Babylon chain launch (phase-2)
- reporter: 0xeix (Sherlock)
- source: N/A

## Summary


This bug report addresses an issue with the refund mechanism in a software program. The problem is that the funds are being returned to the wrong entity, resulting in a loss of funds for the correct entity. The root cause of this issue is that the transaction fees can be paid by different entities, but the funds are only returned to the fee payer and not the fee granter. This can result in a loss of funds for the granter. The proposed solution is to check for the correct recipient of the refund and send the funds to the appropriate entity. The protocol team has already fixed this issue in their code.

## Details

Source: https://github.com/sherlock-audit/2024-12-babylon-judging/issues/20 

## Found by 
0xeix

### Summary

There is currently a refund logic that transfers the funds to a fee payer.

### Root Cause

The root cause lies in the fact that the transaction fees can be paid by other enitities and the funds are returned to a fee payer and not a granter.

### Internal Pre-conditions

-

### External Pre-conditions

Fee granter has to pay for the fees.

### Attack Path

Fee grantor paid for the fees but the funds are returned to a fee payer.

### Impact

Loss of funds for a fee granter.

### PoC

Consider the current refund mechanism:

https://github.com/sherlock-audit/2024-12-babylon/blob/main/babylon/x/incentive/keeper/refundable_msg_index.go#L10-23
```go

// RefundTx refunds the given tx by sending the fee back to the fee payer.
func (k Keeper) RefundTx(ctx context.Context, tx sdk.FeeTx) error {
	txFee := tx.GetFee()
	if txFee.IsZero() {
		// not possible with the global min gas price mechanism
		// but having this check for compatibility in the future
		return nil
	}
	txFeePayer := tx.FeePayer()

	return k.bankKeeper.SendCoinsFromModuleToAccount(ctx, k.feeCollectorName, txFeePayer, txFee)
}

```

The problem is that the fees are refunded to the `feePayer` (the sender of the message) without taking into account the fact that the actual payer can be `feeGranter` resulting in a loss of funds for the granter:


```go
type FeeTx interface {
	[Tx](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/types#Tx)
	GetGas() [uint64](https://pkg.go.dev/builtin#uint64)
	GetFee() [Coins](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/types#Coins)
	FeePayer() [][byte](https://pkg.go.dev/builtin#byte)
	FeeGranter() [][byte](https://pkg.go.dev/builtin#byte)
}
```


### Mitigation

Check out the Celestia solution for this issue:

 https://github.com/rootulp/celestia-app/blob/d10fdbd4e5507f8449747a2388c4657f593b691b/app/posthandler/refund_gas_remaining.go#L133-L138

```go
// getRecipient returns the address that should receive the refund.
func getRecipient(feeTx sdk.FeeTx) sdk.AccAddress {
	if feeGranter := feeTx.FeeGranter(); feeGranter != nil {
		return feeGranter
	}
	return feeTx.FeePayer()
}

```

Here the funds are actually sent to the right entity.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
 https://github.com/babylonlabs-io/babylon/pull/594
