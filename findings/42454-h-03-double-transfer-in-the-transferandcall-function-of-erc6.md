---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Behodler]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2022-01-behodler"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[circuit-input-range-check]]"
---
# [H-03] Double transfer in the `transferAndCall` function of `ERC677`

- id: 42454
- impact: HIGH
- protocol: [[Behodler]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2022-01-behodler

## Summary


This bug report highlights an issue with the `transferAndCall` function in the `ERC677` implementation. The function is supposed to transfer tokens from one address to another, but it is currently transferring the specified amount twice instead of once. This bug affects the `Flan` contract, which inherits `ERC677`, so anyone using the `transferAndCall` function on `Flan` will also encounter the same issue. The report provides a proof of concept and recommends removing a specific line of code in the `transferAndCall` function as a potential solution. It also mentions that the issue has been confirmed and commented on by a member of the Behodler team, and a fix has been proposed. 

## Details

_Submitted by shw, also found by cccz, danb, and wuwe1_

The implementation of the `transferAndCall` function in `ERC677` is incorrect. It transfers the `_value` amount of tokens twice instead of once. Since the `Flan` contract inherits `ERC667`, anyone calling the `transferAndCall` function on `Flan` is affected by this double-transfer bug.

#### Proof of Concept

Below is the implementation of `transferAndCall`:
```solidity
function transferAndCall(
  address _to,
  uint256 _value,
  bytes memory _data
) public returns (bool success) {
  super.transfer(_to, _value);
  _transfer(msg.sender, _to, _value);
  if (isContract(_to)) {
      contractFallback(_to, _value, _data);
  }
  return true;
}
```

We can see that `super.transfer(_to, _value);` and `_transfer(msg.sender, _to, _value);` are doing the same thing - transfering `_value` of tokens from `msg.sender` to `_to`.

Referenced code:
[ERC677/ERC677.sol#L28-L29](https://github.com/code-423n4/2022-01-behodler/blob/main/contracts/ERC677/ERC677.sol#L28-L29)

#### Recommended Mitigation Steps

Remove `_transfer(msg.sender, _to, _value);` in the `transferAndCall` function.

**[gititGoro (Behodler) confirmed and commented](https://github.com/code-423n4/2022-01-behodler-findings/issues/302):**
 > Fix
 >[Behodler/limbo#3](https://github.com/Behodler/limbo/pull/3)



***
