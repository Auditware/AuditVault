---
tags:
  - lang/solidity
  - sector/staking
  - platform/consensys
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - precondition/specific-token-type
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Skale Token]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2020/01/skale-token/"
genome:
  - "[[single-function]]"
  - "[[specific-token-type]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# Users can burn delegated tokens using re-entrancy attack ✓ Addressed

- id: 13843
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


A bug was found in the code of the LockableERC777.sol contract. The code was being used when a user burns tokens and was located at new\_code/contracts/ERC777/LockableERC777.sol:L413-L426. The bug was that there was a callback function located right after the check that there were enough unlocked tokens to burn. In this callback, the user could delegate all the tokens right before burning them without breaking the code flow. This could lead to security issues. 

The bug was mitigated in skalenetwork/skale-manager#128. The recommendation was to call `_callTokensToSend` before checking for the unlocked amount of tokens, which is better defined as Checks-Effects-Interactions Pattern. This pattern ensures that all the checks are done before any effects are applied, and that all interactions with external contracts occur after the checks and effects are done.

## Details

#### Resolution



Mitigated in [skalenetwork/skale-manager#128](https://github.com/skalenetwork/skale-manager/pull/128)


#### Description


When a user burns tokens, the following code is called:


**new\_code/contracts/ERC777/LockableERC777.sol:L413-L426**



```
        uint locked = \_getAndUpdateLockedAmount(from);
        if (locked > 0) {
            require(\_balances[from] >= locked.add(amount), "Token should be unlocked for burning");
        }
//-------------------------------------------------------------------
---
---

        \_callTokensToSend(
            operator, from, address(0), amount, data, operatorData
        );

        // Update state variables
        \_totalSupply = \_totalSupply.sub(amount);
        \_balances[from] = \_balances[from].sub(amount);


```
There is a callback function right after the check that there are enough unlocked tokens to burn. In this callback, the user can delegate all the tokens right before burning them without breaking the code flow.


#### Recommendation


`_callTokensToSend`  should be called before checking for the unlocked amount of tokens, which is better defined as [Checks-Effects-Interactions Pattern](https://solidity.readthedocs.io/en/develop/security-considerations.html?highlight=check%20effects#use-the-checks-effects-interactions-pattern).
