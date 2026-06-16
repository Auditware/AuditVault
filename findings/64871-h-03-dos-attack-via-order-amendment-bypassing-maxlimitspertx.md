---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[GTE]]"
auditors:
  - "[[eightzerofour]]"
report: "https://code4rena.com/reports/2025-07-gte-spot-clob-and-router"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# [H-03] DOS Attack via Order Amendment Bypassing maxLimitsPerTx Protection

- id: 64871
- impact: HIGH
- protocol: [[GTE]]
- reporter: eightzerofour (Code4rena)
- source: https://code4rena.com/reports/2025-07-gte-spot-clob-and-router

## Summary


The CLOB (Central Limit Order Book) system has a vulnerability in its `amend()` function that allows attackers to bypass the DOS protection mechanism. This vulnerability is caused by the fact that the function does not call `incrementLimitsPlaced()` when an order is amended to a new price or side, effectively creating new order book entries without incrementing the transaction limit counter. This allows attackers to flood the order book with unlimited price level changes in a single transaction, circumventing the protocol's DOS protection. The recommended mitigation step is to modify the `_processAmend` function in `CLOB.sol` to enforce DOS protection when an order is amended to a different price or side. This has been verified through testing and the fix prevents the attack.

## Details



`clob/CLOB.sol` [# L390](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/CLOB.sol# L390)

The CLOB (Central Limit Order Book) system implements DOS protection through the `maxLimitsPerTx` parameter, which limits the number of new limit orders a user can place within a single transaction. However, the `amend()` function allows users to bypass this critical protection mechanism by amending existing orders to different price levels without incrementing the transaction limit counter. This enables attackers to flood the order book with unlimited price level changes in a single transaction, effectively circumventing the protocol’s DOS protection.

### Vulnerability Details

The vulnerability stems from the fact that the `amend()` function in `CLOB.sol` does not call `incrementLimitsPlaced()` when an order is amended to a new price or side, even though such amendments effectively create new order book entries at different price levels.

In `CLOB.sol`, the `postLimitOrder` function properly enforces DOS protection:
```

    function postLimitOrder(address account, PostLimitOrderArgs calldata args)
        external
        onlySenderOrOperator(account, OperatorRoles.CLOB_LIMIT)
        returns (PostLimitOrderResult memory)
    {
        Book storage ds = _getStorage();

        ds.assertLimitPriceInBounds(args.price);
        ds.assertLimitOrderAmountInBounds(args.amountInBase);
        ds.assertLotSizeCompliant(args.amountInBase);

        // Max limits per tx is enforced on the caller to allow for whitelisted operators
        // to implement their own max limit logic.
        ds.incrementLimitsPlaced(address(factory), msg.sender);

        uint256 orderId;
        if (args.clientOrderId == 0) {
            orderId = ds.incrementOrderId();
        } else {
            orderId = account.getOrderId(args.clientOrderId);
            ds.assertUnusedOrderId(orderId);
        }

        Order memory newOrder = args.toOrder(orderId, account);

        if (newOrder.isExpired()) revert OrderExpired();

        emit LimitOrderSubmitted(CLOBEventNonce.inc(), account, orderId, args);

        if (args.side == Side.BUY) return _processLimitBidOrder(ds, account, newOrder, args);
        else return _processLimitAskOrder(ds, account, newOrder, args);
    }
```

However, the `amend()` function bypasses this protection entirely:
```

function amend(address account, AmendArgs calldata args)
    external
    override
    onlyOperatorCallback
    returns (int256 quoteTokenDelta, int256 baseTokenDelta)
{
    Book storage ds = CLOBStorageLib.getStorage();

    // No call to incrementLimitsPlaced() here!

    Order storage order = ds.orders[args.orderId.toOrderId()];
    order.assertExists();

    if (order.owner != account) revert Unauthorized();

    return _processAmend(ds, order, args);
}
```

When amending to a new price/side, the `_executeAmendNewOrder` function effectively creates a new order:
```

function _executeAmendNewOrder(Book storage ds, Order storage order, AmendArgs calldata args)
    internal
    returns (int256 quoteTokenDelta, int256 baseTokenDelta)
{
    // Removes order from current position
    ds.removeOrderFromBook(order);

    // Creates new order with new parameters
    Order memory newOrder = Order({
        id: order.id,
        prevOrderId: OrderId.wrap(0),
        nextOrderId: OrderId.wrap(0),
        owner: order.owner,
        amount: args.amountInBase,
        price: args.price,
        side: args.side,
        cancelTimestamp: args.cancelTimestamp
    });

    // Places order at new position - effectively a new limit order
    if (args.side == Side.BUY) {
        return _executeBidLimitOrder(ds, newOrder, args.limitOrderType);
    } else {
        return _executeAskLimitOrder(ds, newOrder, args.limitOrderType);
    }
}
```

### Impact (Attack Vectors)

**Order Book Flooding**: Attackers can create unlimited order book activity in a single transaction by repeatedly amending orders to different price levels, completely bypassing the `maxLimitsPerTx` protection designed to prevent this exact scenario.

* It can be executed by any user with minimal capital (just enough for 2 initial orders)
* It can be automated and repeated across multiple transactions to maintain the attack

### Recommended Mitigation Steps

A possible mitigation would be implemented by modifying the `_processAmend` function in `CLOB.sol` to enforce DOS protection when an order is amended to a different price or side.

**Fix Applied:**
```

function _processAmend(Book storage ds, Order storage order, AmendArgs calldata args)
        internal
        returns (int256 quoteTokenDelta, int256 baseTokenDelta)
    {
        Order memory preAmend = order;
        address maker = preAmend.owner;

    if (args.cancelTimestamp.isExpired() || args.amountInBase < ds.settings().minLimitOrderAmountInBase) {
            revert AmendInvalid();
        }

    // Check lot size compliance after other validations
    ds.assertLotSizeCompliant(args.amountInBase);

    if (order.side != args.side || order.price != args.price) {
        // change place in book - this effectively creates a new order position,
        // so we need to enforce DOS protection by checking limits
        ds.incrementLimitsPlaced(address(factory), msg.sender);
        (quoteTokenDelta, baseTokenDelta) = _executeAmendNewOrder(ds, order, args);
    } else {
        // change amount - no new position created, no limit check needed
        (quoteTokenDelta, baseTokenDelta) = _executeAmendAmount(ds, order, args.amountInBase);

        if (quoteTokenDelta + baseTokenDelta == 0) revert ZeroOrder();
    }
    emit OrderAmended(CLOBEventNonce.inc(), preAmend, args, quoteTokenDelta, baseTokenDelta);

    _settleAmend(ds, maker, quoteTokenDelta, baseTokenDelta);
}
```

When an order amendment changes the price or side (`order.side != args.side || order.price != args.price`), the function now calls `ds.incrementLimitsPlaced(address(factory), msg.sender)` before executing the amendment. Amount-only amendments (same price and side) do not trigger the limit check since they don’t create new order book positions. The fix ensures that both `postLimitOrder` and `amend` operations that create new order book positions are subject to the same DOS protection mechanism.

**Verification:**

The fix was validated by running the existing test, which now demonstrates that:

* Normal DOS protection works: Cannot post more than `maxLimitsPerTx` orders
* Cannot amend orders to new positions when limit is reached
* The attack is prevented: The first amendment attempt fails with `LimitsPlacedExceedsMax()` error

[View detailed Proof of Concept](https://code4rena.com/audits/2025-07-gte-spot-clob-and-router/submissions/F-256)

---
