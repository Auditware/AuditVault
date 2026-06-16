---
tags:
  - lang/solidity
  - sector/dex
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[ownership-transfer]]"
  - "[[fot-slippage]]"
---
# Stream Updates Are Paid Directly to the Recipient

- id: 19585
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf

## Summary


This bug report is about a coding error in the FuroStream contract. On line 252 of the contract, the tokens being sent from the sender to top up the stream were being transferred directly to the recipient address instead of the current smart contract. This would result in the recipient receiving the BentoBox deposit of topUpAmount, as well as any future revenue earned from the stream, which included topUpAmount in addition to the previous depositedShares. This would result in the recipient being double-paid.

To fix this issue, the development team changed the address on line 252 to address(this), transferring the token to the FuroStreaming smart contract rather than the recipient. This is shown in PR 16.

## Details

## Description

On line [252] in the FuroStream contract, in the function `updateStream()`, the tokens being sent from the sender to top up the stream are being transferred directly into ownership of the recipient address rather than the current smart contract. The impact is that the recipient will receive the BentoBox deposit of `topUpAmount` in addition to any future revenue earned from the stream. The additional future revenue will include `topUpAmount` in addition to the previous `depositedShares`, thereby double paying the recipient.

```solidity
depositedShares = _depositToken(
    stream.token,
    stream.sender,
    recipient, // @audit should be address(this)
    topUpAmount,
    fromBentoBox
);
```

## Recommendations

Change the address on line [252] to `address(this)`, thereby transferring the token to the FuroStreaming smart contract rather than the recipient.

## Resolution

The development team has fixed the issue by changing the address as recommended. This is shown in PR 16.
