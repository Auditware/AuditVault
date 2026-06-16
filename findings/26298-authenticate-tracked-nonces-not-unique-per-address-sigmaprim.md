---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Term Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# authenticate() tracked nonces not unique per address

- id: 26298
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report is about the tracking of nonces used in authenticated transactions. Nonces are not tracked on a per-address basis, which can cause unexpected denial of service conditions for end users. The recommendation is to track all nonces per unique address, not as a collective. The issue has been resolved by committing e883f0e, where Authenticator now tracks used nonces on a per-user basis. Additionally, the authentication token was modified to include a hash of transaction parameters, the destination contract address, the chain ID, and an expiry time. This ensures that the token can only be used to authorize the intended transaction. The development team has been made aware of this and acknowledged it.

## Details

## Description
`usedNonces` tracks all nonces used in authenticated transactions; however, they are not tracked on a per-address basis. As a result, if a transaction from one wallet address used nonce X, any other transaction from a different wallet address with the same nonce X will revert. This will cause unexpected and arbitrary denial of service conditions for end users.

## Recommendations
- Track all nonces per unique address, not as a collective.
- Modify `usedNonces` to be a mapping of an address to an integer (nonce) and use it accordingly.

## Resolution
Based on a retest of commit `e883f0e`, the issue has been resolved - Authenticator now tracks used nonces on a per user basis.
