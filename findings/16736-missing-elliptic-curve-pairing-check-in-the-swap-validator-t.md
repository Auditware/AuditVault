---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/dex
  - sector/privacy
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[AZTEC]]"
auditors:
  - "[[James Miller]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/aztec.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Missing elliptic curve pairing check in the Swap Validator

- id: 16736
- impact: HIGH
- protocol: [[AZTEC]]
- reporter: James Miller (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/aztec.pdf

## Summary


This bug report is about the Swap protocol in the ACE/validators system. It has been identified as a high difficulty issue. The problem is that the Swap protocol does not perform an elliptic curve pairing check to validate its output notes. This means that an adversary can submit an invalid commitment to the protocol, which the validator will accept as valid. As a result, the adversary can raise their balance for free. 

In the short term, the recommendation is to validate output notes by using the same elliptic curve pairing verification check as the other Join-Split protocols. In the long term, developers should always ensure that an elliptic curve pairing check is included when developing contracts for verifying Join-Split protocols. Property-based testing with tools such as Echidna should also be considered for validators and other cryptographic protocols.

## Details

## Cryptography Vulnerability Report

**Type:** Cryptography  
**Target:** ACE/validators  

**Difficulty:** High  

## Description
The Swap protocol does not perform an elliptic curve pairing check to validate its output notes. The protocol performs all of the other checks of the Join-Split protocol, but without the elliptic curve pairing, the validator can be tricked into validating output notes with invalid commitments.

## Exploit Scenario
Any adversary can easily exploit this by submitting an invalid commitment that is not computationally binding. For example, an adversary can submit the following invalid commitment:  
- **value**: (k, a) for any k  
(σ = γ, (1, ha))

An adversary can submit this commitment as an output note to the Swap protocol, where they choose the k value that will make the validator verify this proof (this k value will just be the k value of the input note). Since there is no elliptic curve pairing check, the validator will accept this as valid.

Once accepted by the validator, this malicious note will now be on the Note Registry, where it can be input to any Join-Split protocol. All of the Join-Split protocols will assume that the input notes have already been verified, so they will not detect it as malicious. Since this commitment can commit to any k value, an adversary can make this k value much higher than the value in the Swap protocol, successfully raising their balance for free.

## Recommendation
- **Short term:** Validate output notes by using the same elliptic curve pairing verification check as the other Join-Split protocols.
- **Long term:** Whenever developing contracts for verifying Join-Split protocols, ensure that there is always an elliptic curve pairing check. Consider property-based testing with tools such as Echidna in these types of validators and other cryptographic protocols.
