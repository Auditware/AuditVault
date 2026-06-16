---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
  - sector/token
protocol: "[[Hubii]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/hubii-token-audit-227c0adf50ea/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[proposal-state-check]]"
---
# State transitions are implicit and not enforced

- id: 12028
- impact: HIGH
- protocol: [[Hubii]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/hubii-token-audit-227c0adf50ea/

## Summary


This bug report is about a Crowdsale instance that has multiple states and can be obtained by calling getState. The report explains that the current state enables or disables functions and there are more possible state transitions than implied. It also states that these unexpected transitions can create security holes and complicate maintenance and further development. The report suggests that transitions should be made explicit and enforced in order to fix the issue. It also provides two examples of correctly implemented transitions. Hubii replied to the report, saying that the function where the state transitions were possible was marked as onlyOwner. They modified the contracts to prevent unexpected state transitions and removed the Preparing state. The bug was fixed in 5a90957abf3f792951b3aad66d6eb0317f0500ca.

This bug report is about a Crowdsale instance with multiple states that can be obtained by calling getState. The report suggests that there are more possible state transitions than implied, and these unexpected transitions can create security holes and complicate maintenance and further development. The report provides two examples of correctly implemented transitions and Hubii replied to the report, saying that the function where the state transitions were possible was marked as onlyOwner. They modified the contracts to prevent unexpected state transitions and removed the Preparing state. The bug was fixed in 5a90957abf3f792951b3aad66d6eb0317f0500ca.

## Details

There are multiple states a `Crowdsale` instance can be in. The current state can be obtained by calling [`getState`](https://github.com/CoinFabrik/ico/blob/142f43f3bec4afd0ffff3fce06946cf67cb0272f/contracts/Crowdsale.sol#L479-L489), and functions are enabled or disabled according to it. Said function also gives an idea of the desired sequence of states that the crowdsale should follow. It’s easy to see, however, that there are a lot more possible state transitions than those implied:


* If at any point in time the [finalizeAgent variable](https://github.com/CoinFabrik/ico/blob/142f43f3bec4afd0ffff3fce06946cf67cb0272f/contracts/Crowdsale.sol#L45) is changed into a non-sane instance, [a crowdsale can return to the `Preparing` state](https://github.com/CoinFabrik/ico/blob/142f43f3bec4afd0ffff3fce06946cf67cb0272f/contracts/Crowdsale.sol#L482).
* Once the crowdsale has been considered successful (being in the `Success` state), it’s possible to resume the `Funding` state by [setting a new cap](https://github.com/CoinFabrik/ico/blob/142f43f3bec4afd0ffff3fce06946cf67cb0272f/contracts/Crowdsale.sol#L220).


These kind of unexpected state transitions can have unexpected consequences, create security holes, and complicate maintenance and further development. Fix this by making transitions explicit and enforcing the states in which each function can be called.


Some examples of explicit state transitions correctly implemented are [OpenZeppelin’s RefundVault](https://github.com/OpenZeppelin/zeppelin-solidity/blob/63b5fc5971038e43e2d8da932d30eceb6c3f24de/contracts/crowdsale/RefundVault.sol) and [Solidity’s Documentation’s StateMachine](https://solidity.readthedocs.io/en/develop/common-patterns.html#state-machine).


**Update:** Hubii replied *“The function where the state transitions were possible were marked as `onlyOwner`, lowering the possibility of outside attack. Despite the function having the `onlyOwner` modifier, we modified the contracts to prevent unexpected state transitions and removed the `Preparing` state.”* Fixed in [`5a90957abf3f792951b3aad66d6eb0317f0500ca`](https://github.com/CoinFabrik/ico/commit/5a90957abf3f792951b3aad66d6eb0317f0500ca).
