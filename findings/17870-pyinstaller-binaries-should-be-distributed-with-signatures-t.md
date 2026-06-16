---
tags:
  - lang/solidity
  - sector/infra
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - precondition/insider
protocol: "[[ETH2 Deposit CLI]]"
auditors:
  - "[[Jim Miller]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/ETH2DepositCLI.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[insider]]"
  - "[[direct-drain]]"
  - "[[upgrade-safety]]"
---
# PyInstaller binaries should be distributed with signatures

- id: 17870
- impact: HIGH
- protocol: [[ETH2 Deposit CLI]]
- reporter: Jim Miller (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/ETH2DepositCLI.pdf

## Summary


This bug report is about data validation in the Ethereum 2.0 deposit tool. It is distributed as binary files compiled using PyInstaller, but there is no way for users to verify their authenticity. This means that if someone compromises the security of the GitHub account used to upload the deposit binaries, they can replace the binaries with backdoored versions. This could lead to Alice's keys being compromised.

The short-term recommendation is to include signatures to allow users to verify the released binaries. This will mitigate the risk of using malicious binaries if an Ethereum developer's GitHub account is compromised. It is recommended to use gpg with public keys uploaded to public servers.

The long-term recommendation is to review the chain of trust of the precompiled releases used to generate private keys. This will reduce the risk of using malicious binaries if an Ethereum developer's GitHub account is compromised.

## Details

## Data Validation

**Type:** Data Validation  
**Target:** eth2deposit  

**Difficulty:** High  

## Description
The deposit tool is distributed as binary files compiled using PyInstaller, but without any way for users to verify their authenticity. The deposit tool is compiled to a single binary using PyInstaller to be released on GitHub.  
![Latest GitHub release](#)  <!-- Replace # with the actual URL to the image if needed -->

However, there is no way for users to check that these binaries are compiled by someone from the Ethereum 2.0 development team.

## Exploit Scenario
Eve compromises the security of the GitHub account used to upload the deposit binaries, and replaces the binaries with backdoored versions. Alice downloads the released binaries and her keys are compromised.

## Recommendation
**Short term:** Include signatures to allow users to verify the released binaries. This will mitigate the risk of using malicious binaries if an Ethereum developer’s GitHub account is compromised. We recommend using GPG with public keys uploaded to public servers.

**Long term:** Review the chain of trust of the precompiled releases used to generate private keys. This will mitigate the risk of using malicious binaries if an Ethereum developer’s GitHub account is compromised.
