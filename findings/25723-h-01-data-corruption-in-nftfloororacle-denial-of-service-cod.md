---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[ParaSpace]]"
auditors:
  - "[[csanuragjain]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[missing-modifier]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[dos-resistance]]"
---
# [H-01] Data corruption in `NFTFloorOracle`; Denial of Service

- id: 25723
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: csanuragjain (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report is about a Denial of Service issue in the `NFTFloorOracle` contract. During the `_removeFeeder` operation, the feeder is removed from the `feeders` array but the existing code does not update the indexes in `feederPositionMap` after the feeder is removed. As a result, it is impossible to remove some feeders from the contract due to an Out of Bounds array access and the data in `feederPositionMap` is corrupted. A proof of concept was provided to demonstrate the issue.

The recommended mitigation step is to update the index in `feederPositionMap` after the feeders swap and pop. Trust (warden) commented that the issue does not meet the high criteria set for a HIGH severity finding. However, dmvt disagreed, stating that the inability to remove dead or malfunctioning feeders can easily lead to the complete breakdown of the protocol and significant funds loss, justifying the high risk rating.

## Details


During `_removeFeeder` operation in `NFTFloorOracle` contract, the feeder is removed from `feeders` array, and linking in `feederPositionMap` for the specific feeder is removed. Deletion logic is implemented in "Swap + Pop" way, so indexes changes, but existing **code doesn't update indexes in** `feederPositionMap` **after feeder removal**, which causes the issue of Denial of Service for further removals.
As a result:

*   Impossible to remove some `feeders` from the contract due to Out of Bounds array access. Removal fails because of transaction revert.
*   Data in `feederPositionMap` is corrupted after some `feeders` removal. Data linking from `feederPositionMap.index` to `feeders` array is broken.

### Proof of Concept

        address internal feederA = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        address internal feederB = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        address internal feederC = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;

        function corruptFeedersMapping() external {
            console.log("Starting from empty feeders array. Array size: %s", feeders.length);
            address[] memory initialFeeders = new address[](3);
            initialFeeders[0] = feederA;
            initialFeeders[1] = feederB;
            initialFeeders[2] = feederC;
            this.addFeeders(initialFeeders);
            console.log("Feeders array: [%s, %s, %s]", initialFeeders[0], initialFeeders[1], initialFeeders[2]);
            console.log("Remove feeder B");
            this.removeFeeder(feederB);
            console.log("feederPositionMap[A] = %s, feederPositionMap[C] = %s", feederPositionMap[feederA].index, feederPositionMap[feederC].index);
            console.log("Mapping for Feeder C store index 2, which was not updated after removal of B. Feeders array length is : %s", feeders.length);
            console.log("Try remove Feeder C. Transaction will be reverted because of access out of bounds of array. Data is corrupted");
            this.removeFeeder(feederC);
        }

Snippet execution result:
![Alt text](https://i.gyazo.com/90ac873cd71194527d4d3b9bfe6e317e.png "Optional title")

### Tools Used

Visual inspection; Solidity snippet for PoC

### Recommended Mitigation Steps

Update index in `feederPositionMap` after feeders swap and pop.

    feeders[feederIndex] = feeders[feeders.length - 1];
    feederPositionMap[feeders[feederIndex]].index = feederIndex; //Index update added as a recommendation
    feeders.pop();

**[yubo-ruan (Paraspace) confirmed](https://github.com/code-423n4/2022-11-paraspace-findings/issues/79)**

**[Trust (warden) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/79#issuecomment-1400581150):**
 > I've submitted this report as well.
> However, I believe it does not meet the high criteria set for HIGH severity finding. For HIGH, warden must show a direct loss of funds or damage to the protocol that stems from the specific issue. Here, there are clearly several conditionals that must occur in order for actual damage to take place.
> Regardless, will respect judge's views on the matter.

**[dmvt commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/79#issuecomment-1406270736):**
 > > I've submitted this report as well. However, I believe it does not meet the high criteria set for HIGH severity finding. For HIGH, warden must show a direct loss of funds or damage to the protocol that stems from the specific issue. Here, there are clearly several conditionals that must occur in order for actual damage to take place. Regardless, will respect judge's views on the matter.
> 
> I respectfully disagree. The scenario is likely to occur at some point during normal operation of the protocol. The inability to remove dead or malfunctioning feeders can easily lead to the complete breakdown of the protocol and significant funds loss, the "data corruption" mentioned in the report. The severity of this issue, when it occurs, justifies the high risk rating.



***
