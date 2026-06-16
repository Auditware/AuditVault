---
tags:
  - lang/solidity
  - platform/trust-security
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - sector/staking
protocol: "[[Lukso]]"
auditors:
  - "[[Trust Security]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Trust Security/2023-04-13-LUKSO LSP audit.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# TRST-H-1 Reentrancy protection can likely be bypassed

- id: 18974
- impact: HIGH
- protocol: [[Lukso]] Lsp Audit
- reporter: Trust Security
- source: https://github.com/solodit/solodit_content/blob/main/reports/Trust Security/2023-04-13-LUKSO LSP audit.md

## Summary


A bug was discovered in the KeyManager of a contract, which allows an attacker to reenter the contract through a third-party contract with REENTRANCY_PERMISSION. This bug could potentially be chained several times, leading to a vulnerable code that assumes such flows to be impossible. The recommended mitigation was to return the flag to the original value before reentry, rather than always setting it to false. The team applied a different fix, which left the reentrancyStatus on when the current call is not the initial call to the KeyManager.

## Details

**Description:**
The KeyManager offers reentrancy protection for interactions with the associated account. 
Through the LSP20 callbacks or through the `execute()` calls, it will call `_nonReentrantBefore()`
before execution, and `_nonReentrantAfter()` post-execution. The latter will always reset the 
flag signaling entry.
```solidity
    function _nonReentrantAfter() internal virtual {
    // By storing the original value once again, a refund is triggered 
             (see // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyStatus = false;
     }
```
An attacker can abuse it to reenter provided that there exists some third-party contract with 
REENTRANCY_PERMISSION that performs some interaction with the contract. The attacker 
would trigger the third-party code path, which will clear the reentrancy status, and enable 
attacker to reenter. This could potentially be chained several times. Breaking the reentrancy 
assumption would make code that assumes such flows to be impossible to now be vulnerable.

**Recommended Mitigation:**
In `_nonReentrantAfter()`, the flag should be returned to the original value before reentry, 
rather than always setting it to false.

**Team response:**
Applied a fix different than recommendation.

**Mitigiation review:**
All code paths will now leave the **_reentrancyStatus** on when the current call is not the initial 
call to the KeyManager.
