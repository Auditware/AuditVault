---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/oracle
protocol: "[[Sqwid]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# Not the whole amount of REEF is transferred due to accuracy loss. SqwidMarketplace.sol: functions enterRaffle(), endRaffle().

- id: 56646
- impact: HIGH
- protocol: [[Sqwid]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md

## Summary


The bug report states that when a user enters a raffle, the message value is divided by 1e18, causing the value to lose accuracy. This is because Solidity does not support float numbers. For example, if a user sends 2.5 REEF, it will be divided by 1e18 and result in 2 REEF instead of 2.5. This can also cause some REEF tokens to get stuck in the contract. The recommendation is to remove the division. The Sqwid team has implemented this approach to make it easier to calculate the winner, but it may cause issues for users who want to interact directly with the contract. The team has added a notice in the contract to inform users of this.

## Details

**Description**

 When a user enters a raffle, his message value is divided by 1e18, losing the accuracy of the 
message value, since Solidity doesn’t support float numbers. For example, if a user sends 
2500000000000000000 (2.5 REEF) and this value is divided by 1e18, the result would be 
equal 2 (instead of 2.5).
 During the execution of endRaffle(), the total value is multiplied by 1e18, giving 
2000000000000000000 (2 REEF). This way, some amount of REEF tokens might get stuck 
on contract.
 
 **Recommendation**:
 
 Remove the division.
 
 **Post audit**:
 
 Sqwid team took this approach in order to facilitate the calculation of the pseudorandom 
winner, given that the value of 1 REEF is currently $0.0035, so Sqwid team has enough 
margin to discard that value in case of incorrectly sending a fractional part. The official 
frontend will take this into account and allow only amounts with the accuracy of 1 REEF. 
Sqwid team however added a @notice in the contract to make this fact explicit, in case the 
users want to interact directly with the smart contract or other frontends are developed.
