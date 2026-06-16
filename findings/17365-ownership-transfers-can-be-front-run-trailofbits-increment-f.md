---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/perpetuals
  - sector/token
  - platform/trailofbits
  - has/github
  - severity/high
  - impact/mev/frontrun
  - impact/privilege-escalation/ownership-transfer
  - fix/add-access-control
protocol: "[[Increment Finance]]"
auditors:
  - "[[Vara Prasad Bandaru]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf"
genome:
  - "[[uninitialized-owner]]"
  - "[[frontrun]]"
  - "[[ownership-transfer]]"
  - "[[add-access-control]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
---
# Ownership transfers can be front-run

- id: 17365
- impact: HIGH
- protocol: [[Increment Finance]]: Increment Protocol
- reporter: Vara Prasad Bandaru (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf

## Summary


This bug report is about a vulnerability in the PerpOwnable.sol contract, which provides an access control mechanism for the minting and burning of a Perpetual contract's vBase or vQuote tokens. The owner of these token contracts is set via the transferPerpOwner function, which assigns the owner's address to the perp state variable. This function is designed to be called only once, during deployment, to set the Perpetual contract as the owner of the tokens. However, because the function is external, anyone can call it to set his or her own malicious address as perp, taking ownership of a contract's vBase or vQuote tokens.

Exploit Scenario: Alice, an admin of the Increment Protocol, deploys a new Perpetual contract. She then attempts to call transferPerpOwner to set perp to the address of the deployed contract. However, Eve, an attacker monitoring the mempool, sees Alice's call to transferPerpOwner and calls the function with a higher gas price. As a result, Eve gains ownership of the virtual tokens and renders the perpetual market useless. Eve then repeats the process with each subsequent deployment of a perpetual market, executing a Denial of Service attack.

Recommendations: To address this vulnerability, the Increment Protocol should move all functionality from the PerpOwnable contract to the Perpetual contract and add the hasRole modifier to the transferPerpOwner function so that the function can be called only by the manager or governance role. In the long term, they should document all cases in which front-running may be possible, along with the implications of front-running for the codebase.

## Details

## Security Assessment of PerpOwnable.sol

## Difficulty: Low

## Type: Data Validation

## Target: contracts/utils/PerpOwnable.sol

## Description
The `PerpOwnable` contract provides an access control mechanism for the minting and burning of a Perpetual contract’s vBase or vQuote tokens. The owner of these token contracts is set via the `transferPerpOwner` function, which assigns the owner’s address to the `perp` state variable. This function is designed to be called only once, during deployment, to set the Perpetual contract as the owner of the tokens. Then, as the tokens’ owner, the Perpetual contract can mint/burn tokens during liquidity provisions, trades, and liquidations. 

However, because the function is external, anyone can call it to set his or her own malicious address as `perp`, taking ownership of a contract’s vBase or vQuote tokens.

```solidity
function transferPerpOwner(address recipient) external {
    if (recipient == address(0)) revert PerpOwnable_TransferZeroAddress();
    if (perp != address(0)) revert PerpOwnable_OwnershipAlreadyClaimed();
    perp = recipient;
    emit PerpOwnerTransferred(msg.sender, recipient);
}
```
*Figure 5.1: The `transferPerpOwner` function in PerpOwnable.sol#L29-L35*

If the call were front-run, the Perpetual contract would not own the vBase or vQuote tokens, and any attempts to mint/burn tokens would revert. Since all user interactions require the minting or burning of tokens, no liquidity provisions, trades, or liquidations would be possible; the market would be effectively unusable. An attacker could launch such an attack upon every perpetual market deployment to cause a denial of service (DoS).

## Exploit Scenario
Alice, an admin of the Increment Protocol, deploys a new Perpetual contract. Alice then attempts to call `transferPerpOwner` to set `perp` to the address of the deployed contract. However, Eve, an attacker monitoring the mempool, sees Alice’s call to `transferPerpOwner` and calls the function with a higher gas price. As a result, Eve gains ownership of the virtual tokens and renders the perpetual market useless. Eve then repeats the process with each subsequent deployment of a perpetual market, executing a DoS attack.

## Recommendations
- **Short term:** Move all functionality from the `PerpOwnable` contract to the `Perpetual` contract. Then, add the `hasRole` modifier to the `transferPerpOwner` function so that the function can be called only by the manager or governance role.
  
- **Long term:** Document all cases in which front-running may be possible, along with the implications of front-running for the codebase.
