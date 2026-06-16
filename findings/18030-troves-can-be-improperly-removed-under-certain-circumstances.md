---
tags:
  - lang/solidity
  - sector/cdp
  - sector/lending
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Liquity]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Troves can be improperly removed under certain circumstances which results in unexpected reverts

- id: 18030
- impact: HIGH
- protocol: [[Liquity]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf

## Summary


This bug report describes an issue in which troves are not properly inserted into a sorted list, causing unexpected revert and potential loss of funds. The reInsert function, which is responsible for keeping the list of troves sorted, can be called on a trove with ICR equal to zero. This will cause the trove to be removed, but not re-inserted. As a result, any following call that works with this particular trove will fail due to the TroveManager initiating a call that checks that the trove exists, but it doesn't. 

The exploit scenario for this issue is that Alice opens a trove and deposits some collateral, and later the price drops. If Alice deposits a small amount of collateral, her trove will be re-inserted with ICB = 0, causing any future calls for that trove to fail. As a result, Alice's collateral will be impossible to redeem.

The recommendation for this issue is to avoid any trove to be (re-)inserted using ICB = 0 in the short term, and to make sure that every system property is carefully specified and use Echidna or Manticore to test it in the long term.

## Details

## Description

In certain circumstances, troves are not properly inserted in the sorted list and therefore, cannot be removed, causing unexpected revert and potential loss of funds. The list of troves is kept sorted using functions like the `reInsert` function, which ensures troves are properly removed and then re-inserted in-order:

```solidity
function reInsert(address _id, uint256 _newICR, uint _price, address _prevId, address _nextId) external override {
    _requireCallerIsBOorTroveM();
    // List must contain the node
    require(contains(_id));
    // Remove node from the list
    _remove(_id);
    if (_newICR > 0) {
        // Insert node if it has a non-zero ICR
        _insert(_id, _newICR, _price, _prevId, _nextId);
    }
}
```

**Figure 13.1:** `reInsert` from the SortedTroves contract.

However, it is possible for `reInsert` to be called on a trove with ICR equal to zero. That trove will be removed, but not re-inserted. The discrepancy arises from `TroveManager` still believing that the trove exists, while it has been removed from the `SortedTroves` contract. Any following call that works with this particular trove will fail due to the `TroveManager` initiating a call that checks that the trove exists (and is expected to succeed) in `SortedTroves`, which it doesn’t. Echidna finds a sequence of transactions to reproduce this issue:

```
assertion in addColl_should_not_revert: failed!💥
Call sequence:
- openTrove_should_not_revert(0) Value: 0x10b30caa1ef1b01
- setPrice(1)
- addColl_should_not_revert() Value: 0x1
- addColl_should_not_revert() Value: 0x1
```

**Figure 13.2:** Echidna report of this issue.

## Exploit Scenario

Alice opens a trove and deposits some collateral. Later, the price drops. If Alice deposits a small amount of collateral, her trove will be re-inserted with ICB = 0, causing any future calls for that trove to fail. Alice's collateral will be impossible to redeem.

## Recommendation

**Short term:** Avoid any trove to be (re-)inserted using ICB = 0.

**Long term:** Make sure every system property is carefully specified and use Echidna or Manticore to test it.
