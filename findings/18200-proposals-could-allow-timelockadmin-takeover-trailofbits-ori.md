---
tags:
  - lang/solidity
  - sector/governance
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/privilege-escalation/admin-takeover
  - trigger/governance-vote
protocol: "[[Origin]]"
auditors:
  - "[[Dominik Teiml]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[admin-takeover]]"
  - "[[governance-vote]]"
  - "[[proposal-state-check]]"
  - "[[timelock-timestamp-bypass]]"
---
# Proposals could allow Timelock.admin takeover

- id: 18200
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


This bug report is about the Governor contract which contains special functions to let the guardian queue a transaction to change the Timelock.admin. However, a regular Proposal is also allowed to contain a transaction to change the Timelock.admin, which poses an unnecessary risk in that an attacker could create a Proposal to change the Timelock.admin. The Governor contract does not contain a function to update the Timelock contract, so also the Governor would need to be redeployed.

The exploit scenario is that Eve creates a proposal with five transactions, one of which is a call to setPendingAdmin with an address controlled by Eve. The guardian doesn't notice this and queues the Proposal. Once the delay is passed Eve executes the Proposal and becomes the pendingAdmin. Eve calls acceptAdmin and is now the admin of the Timelock.

The recommendation is to add a check that prevents setPendingAdmin to be included in a Proposal in the short term. In the long term, it is recommended to let Governor inherit from Timelock, which would allow a lot of functions and code to be removed and significantly lower the complexity of these two contracts.

## Details

## Description

The Governor contract contains special functions to let the guardian queue a transaction to change the `Timelock.admin`. However, a regular Proposal is also allowed to contain a transaction to change the `Timelock.admin`. This poses an unnecessary risk in that an attacker could create a Proposal to change the `Timelock.admin`.

```solidity
function __queueSetTimelockPendingAdmin (
    address newPendingAdmin,
    uint256 eta
) public {
    require (
        msg.sender == guardian,
        "Governor::__queueSetTimelockPendingAdmin: sender must be gov guardian"
    );
    timelock.queueTransaction (
        address(timelock),
        0,
        "setPendingAdmin(address)"
    );
}
```

*Figure 9.1: Governor.sol#L214-L225*

The guardian can queue a transaction to change the `pendingAdmin`.

```solidity
function queueTransaction (
    address target,
    uint256 value,
    string memory signature,
    bytes memory data,
    uint256 eta
) public returns (bytes32) {
    require (
        msg.sender == admin,
        "Timelock::queueTransaction: Call must come from admin."
    );
}
```

*Figure 9.2: Timelock.sol#L115-L125*

If an attacker manages to become the `Timelock.admin`, then the Governor could no longer call `Timelock.queueTransaction`. The only way out of this situation would be to redeploy the Timelock contract. The Governor contract does not contain a function to update the Timelock contract. So also the Governor would need to be redeployed. This would also require all of the other contracts to update the governor address to the new Timelock contract.

## Exploit Scenario

Eve creates a proposal with five transactions, one of which is a call to `setPendingAdmin` with an address controlled by Eve. The guardian doesn’t notice this and queues the Proposal. Once the delay has passed, Eve executes the Proposal and becomes the `pendingAdmin`. Eve calls `acceptAdmin` and is now the admin of the Timelock.

## Recommendation

Short term, add a check that prevents `setPendingAdmin` from being included in a Proposal. 

Long term, consider letting Governor inherit from Timelock. This would allow a lot of functions and code to be removed and significantly lower the complexity of these two contracts.
