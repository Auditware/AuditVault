---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/insurance
  - sector/multisig
  - sector/oracle
  - sector/perpetuals
  - sector/stable
  - platform/trailofbits
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - precondition/insider
protocol: "[[Increment Finance]]"
auditors:
  - "[[Vara Prasad Bandaru]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf"
genome:
  - "[[single-source]]"
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[account-ownership]]"
---
# Governance role is a single point of failure

- id: 17361
- impact: HIGH
- protocol: [[Increment Finance]]: Increment Protocol
- reporter: Vara Prasad Bandaru (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf

## Summary


This bug report is about a single point of failure within the Increment Protocol, which is the governance role. This role has a number of privileges, such as whitelisting a perpetual market, setting economic parameters, updating price oracle addresses, managing protocol insurance funds, updating core contracts, and adding support for new reserve tokens. This means that the governance account has access to user and protocol funds, making it a target for attackers.

The governance role is currently controlled by a multisignature wallet, but it could be transferred to a decentralized autonomous organization (DAO) in the future. The exploit scenario outlined in the report is that an attacker creates a fake token, compromises the governance account, and adds the fake token as a reserve token. This allows the attacker to mint UA and withdraw all USDC from the reserves.

The short-term recommendation is to minimize the privileges of the governance role and implement reasonable time delays for privileged operations. The long-term recommendation is to document an incident response plan, ensure that the private keys for the multisig are managed safely, and carefully evaluate the risks of moving from a multisig to a DAO.

## Details

## Increment Protocol Security Assessment

## Difficulty: High

## Type: Data Validation

### Target: Governance Role

#### Description
Because the governance role is centralized and responsible for critical functionalities, it constitutes a single point of failure within the Increment Protocol. The role can perform the following privileged operations:

- Whitelisting a perpetual market
- Setting economic parameters
- Updating price oracle addresses and setting fixed prices for assets
- Managing protocol insurance funds
- Updating the addresses of core contracts
- Adding support for new reserve tokens to the UA contract
- Pausing and unpausing protocol operations

These privileges give governance complete control over the protocol and therefore access to user and protocol funds. This increases the likelihood that the governance account will be targeted by an attacker and incentivizes governance to act maliciously. Note, though, that the governance role is currently controlled by a multisignature wallet (a multisig) and that control may be transferred to a decentralized autonomous organization (DAO) in the future.

### Exploit Scenario
Eve, an attacker, creates a fake token, compromises the governance account, and adds the fake token as a reserve token for UA. She mints UA by making a deposit of the fake token and then burns the newly acquired UA tokens, which enables her to withdraw all USDC from the reserves.

### Recommendations
**Short term:** Minimize the privileges of the governance role and update the documentation to include the implications of those privileges. Additionally, implement reasonable time delays for privileged operations.

**Long term:** Document an incident response plan and ensure that the private keys for the multisig are managed safely. Additionally, carefully evaluate the risks of moving from a multisig to a DAO and consider whether the move is necessary.
