---
tags:
  - severity/high
  - has/github
  - sector/bridge
  - sector/governance
  - sector/farm
  - platform/code4rena
protocol: "[[Initia]]"
auditors:
  - 0xAlix2
report: "https://code4rena.com/reports/2025-01-initia-rollup-modules"
genome:
  - "[[bridge-dispute-frontrun]]"
  - "[[bridge-message-validation]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] Challenger misses discrepancy events, allowing executors to perform malicious actions

- id: 55292
- impact: HIGH
- protocol: Initia
- reporter: 0xAlix2 (Code4rena)
- source: https://code4rena.com/reports/2025-01-initia-rollup-modules

## Summary


Summary: The Challenger process in the OPinit rollup system is responsible for monitoring and challenging any invalid submissions to ensure the integrity of the system. However, a bug has been found in the handler function that causes discrepancies in events to be missed, allowing malicious actions to go undetected. The recommended mitigation steps involve fixing the handler function to include all discrepancies in the pending challenges for proper handling. This bug has been confirmed and commented on by the developers and has been deemed a high-severity issue. 

## Details



<https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/child/handler.go# L95>

### Finding Description and Impact

The Challenger is a critical process responsible for monitoring the Executor’s output proposals and challenging any invalid submissions. It ensures the integrity of the rollup’s state and prevents malicious actions by the Executor.

The Challenger operates by accumulating emitted events from both the L1 and L2 chains. At the end of every L2 block, a handler is triggered to validate the events and determine if any challenges need to be issued.

When a user deposits tokens into the L2 by sending an `InitiateTokenDeposit` transaction on the L1, the following event is emitted:

[Event emission in L1](https://github.com/initia-labs/OPinit/blob/7da22a78f367cb25960ed9c536500c2754bd5d06/x/ophost/keeper/msg_server.go# L258-L269):
```

sdk.UnwrapSDKContext(ctx).EventManager().EmitEvent(sdk.NewEvent(
	types.EventTypeInitiateTokenDeposit,
	sdk.NewAttribute(types.AttributeKeyBridgeId, strconv.FormatUint(bridgeId, 10)),
	sdk.NewAttribute(types.AttributeKeyL1Sequence, strconv.FormatUint(l1Sequence, 10)),
	sdk.NewAttribute(types.AttributeKeyFrom, req.Sender),
	sdk.NewAttribute(types.AttributeKeyTo, req.To),
	sdk.NewAttribute(types.AttributeKeyL1Denom, coin.Denom),
	sdk.NewAttribute(types.AttributeKeyL2Denom, l2Denom),
	sdk.NewAttribute(types.AttributeKeyAmount, coin.Amount.String()),
	sdk.NewAttribute(types.AttributeKeyData, hex.EncodeToString(req.Data)),
))
```

This event is caught by the host component in the Challenger and saved to the child’s database at the end of the L1 block:

[Host event saving](https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/host/handler.go# L26-L27):
```

// save all pending events to child db
err = eventhandler.SavePendingEvents(h.stage.WithPrefixedKey(h.child.DB().PrefixedKey), h.eventQueue)
```

When the Executor finalizes the deposit on the L2 by sending a `FinalizeTokenDeposit` message, the following event is emitted:

[Event emission in L2](https://github.com/initia-labs/OPinit/blob/7da22a78f367cb25960ed9c536500c2754bd5d06/x/opchild/keeper/msg_server.go# L428-L437):
```

event := sdk.NewEvent(
	types.EventTypeFinalizeTokenDeposit,
	sdk.NewAttribute(types.AttributeKeyL1Sequence, strconv.FormatUint(req.Sequence, 10)),
	sdk.NewAttribute(types.AttributeKeySender, req.From),
	sdk.NewAttribute(types.AttributeKeyRecipient, req.To),
	sdk.NewAttribute(types.AttributeKeyDenom, coin.Denom),
	sdk.NewAttribute(types.AttributeKeyBaseDenom, req.BaseDenom),
	sdk.NewAttribute(types.AttributeKeyAmount, coin.Amount.String()),
	sdk.NewAttribute(types.AttributeKeyFinalizeHeight, strconv.FormatUint(req.Height, 10)),
)
```

The child component of the Challenger catches this event and saves it in the child’s database.

At the end of an L2 block, the [`endBlockHandler`](https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/child/handler.go# L33-L97) is called:
```

func (ch *Child) endBlockHandler(ctx types.Context, args nodetypes.EndBlockArgs) error {
	// ...

	// check value for pending events
1@>	challenges, processedEvents, err := ch.eventHandler.CheckValue(ctx, ch.eventQueue)
	if err != nil {
		return err
	}
	pendingChallenges = append(pendingChallenges, challenges...)

	// check timeout for unprocessed pending events
  	unprocessedEvents := ch.eventHandler.GetUnprocessedPendingEvents(processedEvents)
2@>	challenges, timeoutEvents := ch.eventHandler.CheckTimeout(args.Block.Header.Time, unprocessedEvents)
3@>	pendingChallenges = append(pendingChallenges, challenges...)

	// ...

	ch.eventHandler.DeletePendingEvents(processedEvents)
	ch.eventHandler.SetPendingEvents(timeoutEvents)
4@>	ch.challenger.SendPendingChallenges(challenges)
	return nil
}
```

The handler performs the following steps:

* Checks for discrepancies in the mapped events, such as `InitiateTokenDeposit` and `FinalizeTokenDeposit` (`1@`).
* Checks for timeout events among unprocessed pending events (`2@`).
* Groups both types of events into `pendingChallenges` for later handling/challenging/rollbacks (`3@`).

However, at `4@`, the handler sends only the `challenges` variable, which is overridden when fetching timeout events. This results in discrepancies being missed, as they are not included in `pendingChallenges`.

The [`SendPendingChallenges`](https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/handler.go# L79-L87) function sends these challenges to a channel (`c.challengeCh`) for asynchronous handling. The [`challengeHandler`](https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/handler.go# L12-L42) function, running in a separate goroutine, processes challenges from this channel, the discrepancy events won’t be included in this.

This defeats the purpose of the Challenger bot, allowing malicious Executors to act without detection.

### Recommended Mitigation Steps
```

func (ch *Child) endBlockHandler(ctx types.Context, args nodetypes.EndBlockArgs) error {
	// ...

	ch.eventHandler.DeletePendingEvents(processedEvents)
	ch.eventHandler.SetPendingEvents(timeoutEvents)
-	ch.challenger.SendPendingChallenges(challenges)
+	ch.challenger.SendPendingChallenges(pendingChallenges)
	return nil
}
```

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-01-initia-rollup-modules/submissions/F-4?commentParent=TgbVwEMcjPL&commentChild=ir57nZEKFAj):**

> Mitigation [here](https://github.com/initia-labs/opinit-bots/pull/62).
>
> `challenges` => `pendingChallengs`
>
> <https://github.com/initia-labs/opinit-bots/blame/90594098d4dc95f14bd409c69aee2fd772610041/challenger/child/handler.go# L95>

**[berndartmueller (warden) commented](https://code4rena.com/audits/2025-01-initia-rollup-modules/submissions/F-4?commentParent=fTPNV2DQPKs):**

> I just want to mention that those challenges are currently not acted upon (e.g., not sent to an alerting system, or actions and counter-measures taken):
>
> <https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/handler.go# L72-L77>
>
> 
```

> func (c *Challenger) handleChallenge(ctx types.Context, challenge challengertypes.Challenge) error {
> 	// TODO: warning log or send to alerting system
> 	ctx.Logger().Error("challenge", zap.Any("challenge", challenge))
>
> 	return nil
> }
> 
```

>
> Therefore, the challenger is currently not effective and it does not prevent malicious actions.

**[a\_kalout (warden) commented](https://code4rena.com/audits/2025-01-initia-rollup-modules/submissions/F-4?commentParent=fTPNV2DQPKs&commentChild=A8M8kDT9RTD):**

> @berndartmueller - The protocol already has those challenges errored out in the logs, which are, of course, caught somewhere else on their end. If you’re referencing the `TODO`, it is an improvement for later. This doesn’t change the fact that the discrepancy events are being thrown away.
>
> Our responsibility here is to make sure it is caught alongside the timeout issues, which are not being caught. This is enough impact to show that this is a high-severity issue.

**[LSDan (judge) commented](https://code4rena.com/audits/2025-01-initia-rollup-modules/submissions/F-4?commentParent=fTPNV2DQPKs&commentChild=aW49XGzByf6):**

> I agree. Leaving this in place as high.

---


