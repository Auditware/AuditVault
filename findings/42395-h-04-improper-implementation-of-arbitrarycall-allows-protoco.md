---
tags:
  - lang/solidity
  - sector/governance
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Streaming Protocol]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-11-streaming"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-04] Improper implementation of `arbitraryCall()` allows protocol gov to steal funds from users' wallets

- id: 42395
- impact: HIGH
- protocol: [[Streaming Protocol]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-11-streaming

## Summary


The bug report is about a vulnerability found in the code for a streaming protocol. The code in question is the `arbitraryCall()` function, which allows anyone to make a call to a specific address with a given set of data. The vulnerability lies in the fact that the function does not check for an active incentive for the address being called, allowing for potential theft of incentive tokens. This can happen if the protocol governance is compromised and makes a call to the function with the address of the incentive token and a `transferFrom()` function, stealing all the tokens in the victim's wallet. To prevent this, the report suggests adding a mapping to keep track of incentive tokens and checking for this in the `arbitraryCall()` function. The report has been confirmed by the Streaming Protocol team.

## Details

_Submitted by WatchPug, also found by Jujic and hack3r-0m_

<https://github.com/code-423n4/2021-11-streaming/blob/56d81204a00fc949d29ddd277169690318b36821/Streaming/src/Locke.sol#L733-L735>

```solidity
function arbitraryCall(address who, bytes memory data) public lock externallyGoverned {
    // cannot have an active incentive for the callee
    require(incentives[who] == 0, "inc");
    ...
```

When an incentiveToken is claimed after `endStream`, `incentives[who]` will be `0` for that `incentiveToken`.

If the protocol gov is malicious or compromised, they can call `arbitraryCall()` with the address of the incentiveToken as `who` and `transferFrom()` as calldata and steal all the incentiveToken in the victim's wallet balance up to the allowance amount.

#### Proof of Concept

1.  Alice approved `USDC` to the streaming contract;
2.  Alice called `createIncentive()` and added `1,000 USDC` of incentive;
3.  After the stream is done, the stream creator called `claimIncentive()` and claimed `1,000 USDC`;

The compromised protocol gov can call `arbitraryCall()` and steal all the USDC in Alice's wallet balance.

#### Recommendation

Consider adding a mapping: `isIncentiveToken`, setting `isIncentiveToken[incentiveToken] = true` in `createIncentive()`, and `require(!isIncentiveToken[who], ...)` in `arbitraryCall()`.

**[brockelmore (Streaming Protocol) confirmed](https://github.com/code-423n4/2021-11-streaming-findings/issues/258#issuecomment-989281413)**
