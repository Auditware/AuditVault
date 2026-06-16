---
tags:
  - lang/solidity
  - severity/high
  - platform/openzeppelin
  - sector/token
protocol: "[[SphereX]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/spherex-audit"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Loop-Called Methods and MultiCall Contracts Require an Individual Allowance of All Likely Loop Lengths and Combinations

- id: 33036
- impact: HIGH
- protocol: [[SphereX]] Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/spherex-audit

## Summary


This bug report discusses an issue with the current implementation of a protected method in Solidity. It requires explicit permission for each possible loop length and can result in false positives when used with the MultiCall functionality. This can cause reverts for third-party contracts and reduces the attractiveness of the method. The report suggests prohibiting the use of loops in integrating protocols and recommends against using the method for protocols likely to be called by third-party contracts. The SphereX team has acknowledged the issue and plans to notify customers and invest in finding a solution.

## Details

The current implementation requires explicit permission for each possible loop length if a protected method (internal, public, or external) is invoked within a loop. Furthermore, for contracts using the common [MultiCall functionality](https://docs.openzeppelin.com/contracts/4.x/api/utils#Multicall), every likely combination of called methods will need to be allowed separately. This can result in false positives under these conditions:


* For Control Flow (CF): if a protected method is ever called from another protected method within a loop.
* For Transaction Flow (TF): in general, even without being called from another protected method.


For TF, this means that a third-party (e.g., an integrating) contract calling any protected method in a loop, or using a MultiCall could experience reverts. This reduces the attractiveness of TF to some integrators, as a protocol cannot realistically prevent third-party integrators from calling its methods within loops or from using MultiCall.


For CF, this means that a protected method should avoid calling another protected method in a loop.


This issue is also applicable to recursion, although recursion is rarely used in high-level methods in Solidity.


Consider prohibiting the instrumentation of calls within loops in integrating protocols, and recommend against using TF for protocols likely to be called by third-party contracts.


***Update**: Acknowledged. The SphereX team stated:*



> *The customers will be notified of this issue. Internal loops (CF) will be solved by preapproving each number of repetitions within a range discussed with the customer. We plan to invest further research resources to find a generic solution for the TF case.*
