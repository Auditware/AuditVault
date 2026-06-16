---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[newspacexyz]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# H-8: Malicious users can DOS the protocol by setting downsideProtected to a large value

- id: 45461
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the CDS.sol code that allows malicious users to manipulate the downsideProtected variable, which can cause a denial of service (DOS) attack on the system. This vulnerability was found by multiple users and can be exploited by setting downsideProtected to a large value. This can lead to a revert in functions like deposit() and withdraw(), causing users to be unable to interact with the protocol and potentially losing their deposited assets. The report recommends implementing access control to prevent this vulnerability. 

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/624 

## Found by 
0x23r0, 0x37, 0x73696d616f, 0xAadi, 0xAristos, 0xCNX, 0xNirix, 0xTamayo, 0xloophole, 0xmujahid002, 0xnegan, Abhan1041, Aymen0909, Cybrid, EmreAy24, John44, KungFuPanda, LordAlive, OlaHamid, OrangeSantra, ParthMandale, PeterSR, RampageAudit, Silvermist, akhoronko, aycozyOx, befree3x, dimah7, durov, fat32, futureHack, internetcriminal, itcruiser00, jah, joshuajee, kenzo123, moray5554, newspacexyz, nuthan2x, onthehunt, smbv-1923, super\_jack, t.aksoy, theweb3mechanic, vatsal, volodya, wellbyt3, xKeywordx

### Summary

In CDS.sol updateDownsideProtected() has no access control so malicious users can set downsideProtected to a large value which will DOS the system.

### Root Cause

Because updateDownsideProtected() has no access control malicious users can manipulate the downsideProtected variable which is used in core functions of CDS.sol, causing DOS.
```solidity
    function updateDownsideProtected(uint128 downsideProtectedAmount) external {
        downsideProtected += downsideProtectedAmount;
    }
```
https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/CDS.sol#L829-L831
```solidity
    function _updateCurrentTotalCdsDepositedAmount() private {
        if (downsideProtected > 0) {
            totalCdsDepositedAmount -= downsideProtected;
            totalCdsDepositedAmountWithOptionFees -= downsideProtected;
            downsideProtected = 0;
        }
    }
```
https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/CDS.sol#L833-L839
`_updateCurrentTotalCdsDepositedAmount()` is used in functions like deposit() and withdraw() so a revert here will DOS users from depositing and withdrawing.

### Internal pre-conditions

_No response_

### External pre-conditions

_No response_

### Attack Path

1. Malicious user sets downsideProtected to a large value (greater than totalCdsDepositedAmount)
2. Users calling deposit() or withdraw() will be DOS'ed because a revert will happen in `_updateCurrentTotalCdsDepositedAmount()` due to underflow.

### Impact

Users are DOS'ed from interacting with the protocol so those who deposited have their assets frozen in the contract.

### PoC

_No response_

### Mitigation

Implement access control to updateDownsideProtected()
