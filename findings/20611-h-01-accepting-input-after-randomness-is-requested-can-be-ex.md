---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - vuln/dos/griefing
  - novelty/variant
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[dos-resistance]]"
  - "[[weak-randomness]]"
---
# [H-01] Accepting input after randomness is requested can be exploited

- id: 20611
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md

## Summary


A bug has been identified in the VRF security considerations docs which can lead to a griefing attack on an expected game winner. The issue lies in the 'fulfillRandomWords' method, where the number of HoneyJar NFTs minted for a bundle is used for the process of choosing the winning NFT. This means that the 'fulfillRandomWords' transaction can be front-ran with a HoneyJar NFT mint and the winner will be different. The likelihood of this bug occurring is medium, as it requires minting a new HoneyJar NFT. The impact is high, as it can result in a griefing attack on an expected game winner. To fix this issue, it is recommended to decouple the randomness request and the user input from each other and only use user input that has been submitted pre-requesting randomness.

## Details

**Impact:**
High, as it can result in a griefing attack on an expected game winner

**Likelihood:**
Medium, as it requires minting a new HoneyJar NFT

**Description**

The [VRF security considerations docs](https://docs.chain.link/vrf/v2/security#dont-accept-bidsbetsinputs-after-you-have-made-a-randomness-request) explicitly mention that if an outcome in the contract depends on user-supplied inputs (in this case minting HoneyJar NFTs) and randomness, then the contract should stop accepting any additional user-supplied inputs after it submits the randomness request. The problem here is that in `fulfillRandomWords` the `_setFermentedJars` method is called where the number of HoneyJar NFTs minted for a bundle is used for the process of choosing the winning NFT - this means that the `fulfillRandomWords` transaction can be front-ran with a HoneyJar NFT mint and the winner will be different. This can result in a griefing attack for an expected winner of a game.

**Recommendations**

Decouple the randomness request and the user input from each other. Use only the user input that has been submitted pre-requesting randomness.
