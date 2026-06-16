---
tags:
  - lang/solidity
  - sector/governance
  - sector/infra
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/fee-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[MANTRA]]"
auditors:
  - "[[ABAIKUNANBAEV]]"
report: "https://code4rena.com/reports/2024-11-mantra-chain"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# [H-02] Unspent gas fees are always refunded to the `FeePayer()` which leads to incorrect refunds if the `FeeGranter()` paid for the fees

- id: 54962
- impact: HIGH
- protocol: [[MANTRA]]
- reporter: ABAIKUNANBAEV (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-chain

## Summary


The bug report discusses an issue with the `FeeMarketDeductDecorator.PostHandle()` function, which is used to refund unused gas fees after a transaction is executed. The problem is that the refund is always sent to the `FeePayer()`, even if a `FeeGranter()` has paid for the fees. This can cause issues for the fee granter, as they will not receive the refund and may lose funds. A solution is suggested to determine the actual fee payer and refund the fees to the correct address. The impact of this bug is considered medium-high, as it can potentially drain the fee granter's account. The team has already found this bug and will be patching it in the next upgrade.

## Details



### Finding description and impact

`FeeMarketDeductDecorator.PostHandle()` is called after the transaction is executed to refund the paid but unspent gas.

The issue is that the refund is always sent to the `FeePayer()`, which is not the address that paid for the gas if a **fee granter** (`FeeGranter()`) [paid for the tx fees instead](https://github.com/cosmos/cosmos-sdk/blob/c64d1010800d60677cc25e2fca5b3d8c37b683cc/x/auth/ante/fee.go# L89-L104).

In this case, the fee granter will not receive the refund, the fee payer (i.e., the sender) will receive the refund instead. This would slowly drain the fee granter’s account if they are paying for tx fees on behalf of others. Or, if the fee granter assumes to receive the refund, only paying the actual consumed gas fees, and thus only charging the user for the consumed gas fees (afterwards, settled off-chain, e.g., via credit card), they would make a loss.

### Proof of Concept

[`x/xfeemarket/post/fee.go# L123-L127`](https://github.com/code-423n4/2024-11-mantra/blob/37dedf312c3ea161792b8e1278978db23bb5a8b0/x/xfeemarket/post/fee.go# L123-L127)

The `feePayer` is passed to `BurnFeeAndRefund()`.
```

123: feePayer := feeTx.FeePayer()
124:
125: if err := dfd.BurnFeeAndRefund(ctx, payCoin, tip, feePayer, params.FeeDenom); err != nil {
126: 	return ctx, err
127: }
```

[`x/xfeemarket/post/fee.go# L164-L176`](https://github.com/code-423n4/2024-11-mantra/blob/37dedf312c3ea161792b8e1278978db23bb5a8b0/x/xfeemarket/post/fee.go# L164-L176)

`BurnFeeAndRefund()` subsequently refunds the tip to the `feePayer` via [`SendCoinsFromModuleToAccount()`](https://github.com/code-423n4/2024-11-mantra/blob/37dedf312c3ea161792b8e1278978db23bb5a8b0/x/xfeemarket/post/fee.go# L193).
```

148: func (dfd FeeMarketDeductDecorator) BurnFeeAndRefund(ctx sdk.Context, fee, tip sdk.Coin, feePayer sdk.AccAddress, defaultFeeDenom string) error {
...   // [...]
163:
164: 	// refund the tip if it is not nil and non zero
165: 	if !tip.IsNil() && !tip.IsZero() {
166: 		err := RefundTip(dfd.bankKeeper, ctx, feePayer, sdk.NewCoins(tip))
167: 		if err != nil {
168: 			return err
169: 		}
170:
171: 		events = append(events, sdk.NewEvent(
172: 			xfeemarkettypes.EventTypeTipRefund,
173: 			sdk.NewAttribute(feemarkettypes.AttributeKeyTip, tip.String()),
174: 			sdk.NewAttribute(feemarkettypes.AttributeKeyTipPayee, feePayer.String()),
175: 		))
176: 	}
177:
178: 	ctx.EventManager().EmitEvents(events)
179: 	return nil
180: }
```

### Recommended mitigation steps

Consider determining the actual fee payer, which is either the `FeePayer()` or the `FeeGranter()`, and refund the unused gas fees to the correct address.

For example, see Celestia’s solution: <https://github.com/rootulp/celestia-app/blob/d10fdbd4e5507f8449747a2388c4657f593b691b/app/posthandler/refund_gas_remaining.go# L133-L138>

**[Lance Lan (MANTRA) confirmed and commented](https://code4rena.com/audits/2024-11-mantra-chain/submissions/F-38?commentParent=GYFbXRk6jHt):**

> Valid. Grantee can drain all granter’s granted funds; however, most of the granter grantee relationship are internal so the impact is relatively low.

**[Lance Lan (MANTRA) commented](https://code4rena.com/audits/2024-11-mantra-chain/submissions/F-38?commentParent=cnVweFjsWsb):**

> Regarding [S-203](https://code4rena.com/audits/2024-11-mantra-chain/submissions/S-203): yes, we have found this bug prior to it being reported and will be patched in next upgrade. This should be medium-high as all feegranter feegrantee relationships are mostly internal now.

---



## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
