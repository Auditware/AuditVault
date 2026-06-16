---
tags:
  - lang/solidity
  - sector/stable
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[newspacexyz]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[commitment-uniqueness]]"
---
# H-7: stopLimit Id collision with bracket orders due to no validation, opening up an attack to steal funds

- id: 44377
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses a high-severity vulnerability found in Oku's dual-contract architecture. The issue is caused by a lack of validation in the contract's orderId generation, which can lead to order data corruption and potential double-refund exploitation. The root cause of the problem is the deterministic orderId generation, which allows for collisions between orders created in the `StopLimit.sol` and `Bracket.sol` contracts. This vulnerability can be exploited by an attacker with MEV capabilities and sufficient token balance, resulting in direct financial loss and compromise of the accounting system. To mitigate this issue, the contract's AutomationMaster instance should be updated to include contract-specific entropy. The protocol team has already addressed this issue in their recent PRs/commits.

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/761 

## Found by 
056Security, 0rpse, 0x007, 0x0x0xw3, 0x37, 0x486776, 0xAadi, 0xNirix, 0xRiO, 0xaxaxa, 0xc0ffEE, 0xeix, 0xhuh2005, 0xmurki, 0xumarkhatab, 62616279727564696e, Afriaudit, Atharv, Bigsam, Boy2000, Breaker, BugPull, Cayde-6, ChinmayF, Contest-Squad, DenTonylifer, ElKu, ExtraCaterpillar, Falendar, IvanFitro, JinxSalamV2, John44, JohnTPark24, Kenn.eth, KungFuPanda, Kyosi, LonWof-Demon, LordAdhaar, Matin, NickAuditor2, NoOneWinner, NoWinner, PNS, PeterSR, PoeAudits, Praise03, Ragnarok, Tri-pathi, TxGuard, Weed0607, Xcrypt, Z3R0, ami, aslanbek, auditism, bughuntoor, chista0x, covey0x07, durov, elvin.a.block, future2\_22, hals, iamandreiski, itcruiser00, joshuajee, krot-0025, lanrebayode77, lukris02, mladenov, mxteem, newspacexyz, nfmelendez, nikhil840096, onthehunt, oualidpro, phoenixv110, rudhra1749, safdie, silver\_eth, t.aksoy, t0x1c, tedox, tmotfl, tobi0x18, tomadimitrie, vinica\_boy, whitehair0330, xiaoming90, xseven, yovchev\_yoan, zhenyazhd, zhigang, zhoo, zxriptor
### Summary

High-severity vulnerability in Oku's dual-contract architecture where parallel order creation between `StopLimit.sol` and `Bracket.sol` enables order data corruption and potential double-refund exploitation through orderId collisions.

### Root Cause

```solidity
// Current implementation
function generateOrderId(address user) external returns (uint96) {
    return uint96(uint256(keccak256(abi.encodePacked(
        block.number,
        user
    ))));
}
```


Deterministic orderId generation lacks contract-specific entropy, allowing cross-contract collisions within the same block.

### Internal pre-conditions

1. Shared AutomationMaster instance between contracts
2. Mutable orders mapping in Bracket contract
3. Independent order creation flows

```solidity
mapping(uint96 => Order) public orders;
```

### External pre-conditions

1. MEV capabilities (same-block execution)
2. Sufficient token balance for multiple orders
3. Active protocol state

### Attack Path

```solidity
// Block N
// Step 1: Create Bracket order (5000 USDT)
bracket.createOrder({
    amountIn: 5000e6,
    recipient: attacker
});
// OrderId = hash(blockN + attacker)

// Same Block N
// Step 2: Create StopLimit order (10000 USDT)
stopLimit.createOrder({
    amountIn: 10000e6,
    recipient: attacker
});
// Internally calls bracket.fillStopLimitOrder
// Same OrderId = hash(blockN + attacker)

// Step 3: Cancel order twice
bracket.cancelOrder(orderId); // Refunds 10000 USDT
bracket.cancelOrder(orderId); // Refunds 10000 USDT again
```

### Impact

- Double-spend vulnerability
- Order state corruption
- Accounting system compromise
- Direct financial loss

### Mitigation

```solidity
contract AutomationMaster {
    // Add contract-specific entropy
    function generateOrderId(
        address user,
        address contractSource
    ) external returns (uint96) {
        return uint96(uint256(keccak256(abi.encodePacked(
            block.number,
            user,
            contractSource,
            _orderNonce++ // Additional entropy
        ))));
    }
    
    uint256 private _orderNonce;
}

// Update in Bracket.sol
function createOrder(...) external {
    uint96 orderId = MASTER.generateOrderId(msg.sender, address(this));
    // Rest of the function
}

// Update in StopLimit.sol
function createOrder(...) external {
    uint96 orderId = MASTER.generateOrderId(msg.sender, address(this));
    // Rest of the function
}
```



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/gfx-labs/oku-custom-order-types/pull/1
