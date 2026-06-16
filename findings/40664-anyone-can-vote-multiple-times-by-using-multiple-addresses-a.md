---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/governance
protocol: "[[Goat Tech]]"
auditors:
  - "[[Said]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
---
# Anyone can vote multiple times by using multiple addresses and transferring a voting token if private mode is off 

- id: 40664
- impact: HIGH
- protocol: [[Goat Tech]]
- reporter: Said (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf

## Summary


The bug report discusses a problem with the DToken contract, which is used for voting. The issue is that when the contract is in "private mode", transfer functions are not allowed. However, if the mode is turned off, there is a potential for voting manipulation. The report suggests that this could happen if a user transfers their DToken to another user, and then both users use their DToken balance as voting power. This could result in one user having multiple times the voting power they should have. The core problem is that the DToken contract does not have logic to adjust voting power when tokens are transferred. The suggested solution is to remove the private mode completely.

## Details

## Context: Voting.sol#L220

## Description
The token used for voting is the **DToken** (based on the deployment script). The **PERC** contract (inherited by DToken) implements so-called private mode. If the contract is in private mode, transfer functions are not callable. However, if the mode is off, there is a place for voting manipulation. 

I am not sure when or in what type of circumstances the private mode will be on/off. However, because the functionality is there and transfers are not banned completely, I chose the likelihood as medium.

## Exploit Scenario
- DToken is not in private mode.
- User A, who has an amount X of DToken, calls `Voting::updatePower`. It will take the DToken balance of User A and use it as voting power.
- User A transfers X amount of DToken to User B.
- User A now has 0 amount, and User B now has X amount.
- User B, who has an amount X of DToken, calls `Voting::updatePower`. It will take the DToken balance of User B and use it as voting power.

This way, the voting power of X amount of DToken will be used twice in `vote.attackerPower += power` or `vote.defenderPower += power`. User A can create n addresses to make his power n times stronger.

## Core Problem
The main problem is that DToken does not implement logic to move voting power together with the transferred amount. It only calls Distributor contracts and updates rewards there.

```solidity
function _beforeTokenTransfer(
    address from_,
    address to_,
    uint256 amount_
)
    internal
    virtual
    override
{
    uint i = 0;
    uint n = _totalDistributors;
    while (i < n) {
        _distributors[i].beforeTokenTransfer(from_, to_, amount_);
        i++;
    }
}
```

## Goat
Fixed by removing the `_privateMode` completely.
