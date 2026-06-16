---
tags:
  - lang/solidity
  - lang/vyper
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
protocol: "[[Canto]]"
auditors:
  - "[[popular00]]"
report: "https://code4rena.com/reports/2023-08-verwa"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# [H-08] If governance removes a gauge, user's voting power for that gauge will be lost

- id: 26976
- impact: HIGH
- protocol: [[Canto]]
- reporter: popular00 (Code4rena)
- source: https://code4rena.com/reports/2023-08-verwa

## Summary


This bug report is about the `GaugeController` Solidity port of Curve DAO's Vyper implementation. Users are able to vote for channeling incentives by using the `vote_for_gauge_weights()` function. Governance can remove gauges, but any existing individual user's voting power before removal is not reset. This means that if a gauge is removed, a user's voting power for that gauge will be completely lost.

An example scenario is given: Alice has some veRWA and votes on pool G1 using 100% of her voting power. Then, if G1 is removed by governance, Alice still has 100% of her voting power in that pool, but she cannot remove her vote and claim the voting power back. This means that Alice will lose the voting power she had in that pool.

The impact of this vulnerability is that users can lose their voting power. A proof of concept (POC) is provided to use on `GaugeController` tests. The recommended mitigation steps are to allow zero-weight votings on expired pools and provide an external function to remove votes, and/or provide a function to vote for various pools in the same tx. This will allow users to channel their votes directly from removed pools to ongoing pools.

## Details


<https://github.com/code-423n4/2023-08-verwa/blob/main/src/GaugeController.sol#L127-L132> 

<https://github.com/code-423n4/2023-08-verwa/blob/main/src/GaugeController.sol#L213> 

<https://github.com/code-423n4/2023-08-verwa/blob/main/src/GaugeController.sol#L241>

If governance removes a gauge for any (non-malicious) reason, a user's voting power for that gauge will be completely lost.

### Vulnerability details

The `GaugeController` is a solidity port of Curve DAO's Vyper implementation. Users are to vote for channeling incentives by using the `vote_for_gauge_weights()` function, and each user can fraction their voting power by $10000$ (that is, defined by BPS).

One modification from the original is that governance can now remove gauges, not allowing users to vote on it. However, any existing individual user's voting power before removal is not reset. Since `vote_for_gauge_weights()` does not allow voting for removed gauges, the voting power is then forever lost.

Consider the following scenario:

*   Alice has some veRWA, and is now able to vote.
*   She votes on some pool, say, G1, using 100% of her voting power.
*   Pool G1 is removed by governance due to any reason. Perhaps the pool was found to be faulty and liquidity should be migrated, perhaps the market itself has became illiquid and unsafe, perhaps the intended incentives duration for that pool has simply expired.
*   Alice still has 100% of her voting power in that pool, but she cannot remove her vote and claim the voting power back.

It is worth noting that, even if Alice does not use 100% of her voting power on that particular gauge, she would still lose whatever percent vote placed in that pool, and her overall voting power was weakened by said percent.

### Impact

Users can lose their voting power.

### Proof of concept

We provide the following POC to use on `GaugeController` tests.

<details>

```solidity
function testPOC() public {
    // prepare
    uint256 v = 10 ether;
    vm.deal(gov, v);
    vm.startPrank(gov);
    ve.createLock{value: v}(v);

    // add gauges
    gc.add_gauge(gauge1);
    gc.change_gauge_weight(gauge1, 100);
    gc.add_gauge(gauge2);
    gc.change_gauge_weight(gauge2, 100);

    // all-in on gauge1
    gc.vote_for_gauge_weights(gauge1, 10000);

    // governance removes gauge1
    gc.remove_gauge(gauge1);

    // cannot vote for gauge2
    vm.expectRevert("Used too much power");
    gc.vote_for_gauge_weights(gauge2, 10000);

    // cannot remove vote for gauge1
    vm.expectRevert("Invalid gauge address"); // @audit remove when mitigate
    gc.vote_for_gauge_weights(gauge1, 0);

    // cannot vote for gauge2 (to demonstrate again that voting power is not removed)
    vm.expectRevert("Used too much power");  // @audit remove when mitigate
    gc.vote_for_gauge_weights(gauge2, 10000);
}
```

</details>

### Tools used

Forge

### Recommended mitigation steps

The simplest way to mitigate this is to **allow zero-weight votings on expired pools** simply to remove the vote. Modify line 213 as follow:

```solidity
require(_user_weight == 0 || isValidGauge[_gauge_addr], "Can only vote 0 on non-gauges");
```

<https://github.com/code-423n4/2023-08-verwa/blob/main/src/GaugeController.sol#L213>

The given POC can then be the test case to verify successful mitigation.

As a QA-based recommendation, the sponsor can also provide an external function to remove votes, and/or provide a function to vote for various pools in the same tx. This will allow users to channel their votes directly from removed pools to ongoing pools.

***
