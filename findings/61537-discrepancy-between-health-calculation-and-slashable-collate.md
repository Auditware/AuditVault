---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[epoch-boundary]]"
---
# Discrepancy between health calculation and slashable collateral computation

- id: 61537
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


This bug report highlights a problem with the protocol where there is a discrepancy between how an agent's health is calculated and how their collateral is determined to be slashable. This could lead to the protocol absorbing losses during liquidation events, which goes against the intended security and stability of the system. The report explains that this issue is caused by a timing vulnerability in the liquidation mechanism, where health factor evaluation and slashing operate on different time bases. This creates a gap that can be exploited by agents to protect their recent deposits from being slashed during liquidation. The report recommends short-term and long-term solutions to address this issue, including modifying the slashable collateral calculation and implementing a bonding mechanism to prevent this type of exploitation in the future.

## Details

## Difficulty: Medium

## Type: Data Validation

## Description

The protocol shows a critical discrepancy between how an agent’s health is calculated versus how slashable collateral is determined. This may lead to the protocol absorbing losses during liquidation events, undermining the security model and financial stability of the system.

```solidity
function slashTimestamp(address _agent) public view returns (uint48 _slashTimestamp) {
    DelegationStorage storage $ = getDelegationStorage();
    _slashTimestamp = uint48(Math.max((epoch() - 1) * $.epochDuration, $.agentData[_agent].lastBorrow));
}
```
*Figure 14.1: Code snippet from slashTimeStamp function (contracts/delegation/Delegation.sol#L73-L76)*

As shown in figure 14.1 and 14.2, the liquidation mechanism contains a critical timing vulnerability where health factor evaluation and slashing operate on different time bases.

```solidity
function coverage(address _agent) public view returns (uint256 delegation) {
    NetworkMiddlewareStorage storage $ = getNetworkMiddlewareStorage();
    ...
    uint48 _timestamp = uint48(block.timestamp);
    for (uint256 i = 0; i < _vaults.length; i++) {
        (uint256 value,) = coverageByVault(_network, _agent, _vaults[i], _oracle, _timestamp);
        delegation += value;
    }
}
```
*Figure 14.2: Code snippet from coverage function (contracts/delegation/providers/symbiotic/NetworkMiddleware.sol#L195-L206)*

While the agent coverage calculation (figure 14.2) computes liquidation health factors using all current collateral, the slashable collateral is limited to deposits made before the most recent of either the last borrow time or the previous epoch. This creates an exploitable gap where agents can add new collateral to improve their health metrics, but if liquidation occurs, these recent deposits remain protected from slashing.

Consequently, when liquidation is needed, the protocol is unable to recover sufficient collateral from these newer deposits, forcing it to absorb losses that should have been covered by slashable collateral. This fundamental misalignment undermines the protocol’s security model and threatens its financial stability.

## Exploit Scenario

An agent notices their position is close to liquidation. They coordinate with friendly delegators to add fresh collateral in the current epoch, which improves their health factor calculation. If liquidation still occurs, only the delegations from previous epochs will be slashed, while the “rescue delegators” remain protected. After the liquidation risk passes, these friendly delegators can withdraw their collateral without consequences. In extreme cases, if all existing delegations are from the current epoch, the protocol may be unable to slash any collateral, forcing the protocol to absorb the loss.

## Recommendations

- **Short term:** Modify the slashable collateral calculation to ensure that all delegations that contribute to an agent’s health factor can also be slashed proportionally, regardless of when they were contributed.

- **Long term:** Implement a comprehensive bonding mechanism where delegated collateral must remain locked for a minimum period before it can be withdrawn. This will ensure that all collateral that contributes to an agent’s borrowing capacity is also available for slashing during the entire period it is being used as collateral.
