---
tags:
  - lang/solidity
  - sector/staking
  - sector/streaming
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/dos/unbounded-loop
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/admin-takeover
  - novelty/known-pattern
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[direct-drain]]"
  - "[[admin-takeover]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# Owner can be temporarily changed within proxy calls, allowing complete control of proxy 

- id: 54672
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


This bug report discusses a vulnerability in the PRBProxy contract's ownership function. When the `execute()` function is used to make a delegate call, there is a risk that the owner of the contract could be changed during the call, allowing a malicious user to temporarily become the owner. This could lead to theft of funds or other malicious actions. The report recommends making proxies non-transferable or using the PRBProxyRegistry contract to verify ownership. The issue has been addressed in the Sablier and Cantina contracts.

## Details

## Vulnerability Report: PRBProxy Ownership Issue

## Context
- **Location**: PRBProxy.sol#L137-L151

## Description
When a proxy owner uses the `execute()` function to perform a delegate call, the `_safeDelegateCall()` function is invoked:

```solidity
function _safeDelegateCall(address to, bytes memory data) internal returns (bool success, bytes memory response) {
    // Save the owner address in memory so that this variable cannot be modified during the DELEGATECALL.
    address owner_ = owner;
    // Reserve some gas to ensure that the contract call will not run out of gas.
    uint256 stipend = gasleft() - minGasReserve;
    // Delegate call to the provided contract.
    (success, response) = to.delegatecall{ gas: stipend }(data);
    // Check that the owner has not been changed.
    if (owner_ != owner) {
        revert PRBProxy_OwnerChanged(owner_, owner);
    }
}
```

Because the contract that receives the delegate call can manipulate the storage slots of the proxy, a check is performed at the end to ensure the owner hasn’t changed throughout the call.

However, this check does not ensure that the owner does not change during the call, which could be just as dangerous, allowing a malicious user to temporarily become the owner of the contract for the duration of the call.

## Proof of Concept
This vulnerability is critically dangerous in almost any use of the proxy, as it permits an attacker to gain control of the proxy mid-execution. 

As a simple example, consider how this could be utilized to steal funds from a Sablier user:

1. An owner calls out to a contract (let's call it **Contract A**) using the `execute()` function.
2. The target contract updates storage slot 0 (owner) to the address of another owned contract (let's call it **Contract B**).
3. The target contract then calls (not delegate calls) **Contract B**, passing control flow over.
4. **Contract B** uses the `execute()` function on the proxy (which it is permitted to do as it is the owner) to cancel all the proxies streams.
5. `SablierV2ProxyTarget`'s `cancel()` function sends the refunded amount back to the owner of the proxy (i.e., **Contract B**).
6. When control flow returns to **Contract A**, it rewrites the storage slot to transfer ownership of the proxy back to the original owner.
7. When control flow returns to the proxy, the `owner_ == owner` check passes, and the function concludes successfully.

## Recommendation
There is no straightforward fix for this problem, and it likely requires rethinking the proxy storage architecture. 

We believe the best solution to this issue (along with many other reported problems) is to make proxies non-transferable. This would allow you to set the owner as an immutable value, eliminating the risk of the owner ever being changed. 

(Note: This would require target contracts to call an `owner()` function on the proxy to retrieve the owner address, instead of reading it directly from storage.)

In situations where proxies must remain transferable, the `PRBProxyRegistry` contract should be upheld as the final authority on ownership. Each proxy should have the Registry address saved as an immutable value and should query the Registry for ownership checks when `execute()` is invoked.

## Status
- **Sablier**: Changes applied for the 1st part in PR 119 and for the 2nd part in PR 104.
- **Cantina**: Fixed.
