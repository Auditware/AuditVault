---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/governance
protocol: "[[EtherCamp]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/ethercamps-decentralized-startup-team-public-code-audit-65f4ce8f838d/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# collectedEther subject to manipulation

- id: 12157
- impact: HIGH
- protocol: [[EtherCamp]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/ethercamps-decentralized-startup-team-public-code-audit-65f4ce8f838d/

## Summary


This bug report is about a problem that exists in the DSTContract.sol file on line 159. This line of code is not taking into account the fact that the collectedEther variable can be increased by a smaller amount than msg.value. This is due to the change return mechanism that is written in lines 144-151. If this branch of code is executed, the collected ether in that transaction would be smaller than msg.value. 

This issue allows an attacker to send a transaction with a large ether amount, receive the extra value back, and make collectedEther much bigger than the contract's real balance. If the ether value sent is big enough, the attacker can then bypass the 20% limit on ether proposals as collectedEther can be made, for example, 5 times the contract's balance. 

To fix this problem, the line of code on 159 should be changed to: 
```
collectedEther += msg.value - retEther;
```
A commit with the fix is available at the following link: 
<https://github.com/ether-camp/virtual-accelerator/commit/eaa09a20d29696927bbe11bac6dcf0ac723b8a05>

## Details

[Line 159 of DSTContract.sol](https://github.com/ether-camp/virtual-accelerator/blob/6d4097a08669c2520e0d5bab317b60f1d13df44e/contracts/DSTContract.sol#L159) isn’t considering the fact that `collectedEther` can actually need to be increased by a smaller amount than `msg.value`. This is due to [the change return mechanism in lines 144–151](https://github.com/ether-camp/virtual-accelerator/blob/6d4097a08669c2520e0d5bab317b60f1d13df44e/contracts/DSTContract.sol#L144-L151). If that branch of code is executed, collected ether in that transaction should be smaller than `msg.value` (should be `msg.value - retEther`).


This allows an attacker to send a transaction with a big ether amount, receive the extra value back, and make `collectedEther` to be much bigger than the contract’s real `balance`. If the ether value sent is big enough, the attacker can then circumvent [the 20% limit on ether proposals](https://github.com/ether-camp/virtual-accelerator/blob/6d4097a08669c2520e0d5bab317b60f1d13df44e/contracts/DSTContract.sol#L345) because `collectedEther` can be made, for example, 5 times the contract’s `balance`.


Fix this problem by changing [that line](https://github.com/ether-camp/virtual-accelerator/blob/6d4097a08669c2520e0d5bab317b60f1d13df44e/contracts/DSTContract.sol#L159) to:



```
collectedEther += msg.value - retEther;
```

EDIT: Commit with fix: <https://github.com/ether-camp/virtual-accelerator/commit/eaa09a20d29696927bbe11bac6dcf0ac723b8a05>
