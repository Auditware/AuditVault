---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# Miscalculation of Amount Returnable to Sender

- id: 19584
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf

## Summary


This bug report describes an accounting error in the _balanceOf() function which overstates senderBalance in the cancelStream() function. The code in the contract is executed when the block timestamp is after the startTime and before the endTime. The variable recipientBalance is subtracted from stream.depositedShares, the total shares in the stream, to produce the shares still belonging to the sender. However, recipientBalance is not the total shares allocated to the recipient so far, as it has had stream.withdrawnShares subtracted from it. Thus, senderBalance is calculated in such a way that it actually includes stream.withdrawnShares.

To mitigate this issue, senderBalance should be updated to represent the following: senderBalance = stream.depositedShares - stream.depositedShares *timeDelta / (stream.endTime - stream.startTime).

The development team has fixed the issue by calculating the shares streamed so far and then using that as the basis for calculating both recipientBalance and senderBalance, as shown in PR 16. In addition, the resolution ensures that the Stream Updates Are Paid Directly to the Recipient.

## Details

## Description

There is an accounting error in `_balanceOf()` which overstates `senderBalance`. As a result, the sender will be overcompensated in `cancelStream()`.

When the block timestamp is after the `startTime` and before the `endTime`, the following section of the contract is executed:

```solidity
uint256 timeDelta = block.timestamp - stream.startTime;
recipientBalance = ((stream.depositedShares * timeDelta) / (stream.endTime - stream.startTime)) - uint256(stream.withdrawnShares);
senderBalance = uint256(stream.depositedShares) - recipientBalance;
```

On line 216, the variable `recipientBalance` is subtracted from `stream.depositedShares`, the total shares in the stream, to produce the shares still belonging to the sender. However, `recipientBalance` is not actually the total shares allocated to the recipient so far: it is the amount still payable. `recipientBalance` has had `stream.withdrawnShares` subtracted from it to account for already withdrawn shares. Therefore, `senderBalance` is being calculated in such a way that it actually includes `stream.withdrawnShares`.

```
recipientBalance = depositedShares * ∆time / (endTime - startTime) - withdrawnShares
senderBalance = depositedShares - recipientBalance
```

Thus we have `senderBalance` as:

```
senderBalance = depositedShares - (depositedShares * ∆time / (endTime - startTime) + withdrawnShares)
```

## Recommendations

The issue can be mitigated by updating `senderBalance` to represent the following:

```
senderBalance = depositedShares - (depositedShares * ∆time / (endTime - startTime))
```

## Resolution

The development team has fixed the issue by calculating the shares streamed so far and then using that as the basis for calculating both `recipientBalance` and `senderBalance`. This is shown in PR 16.
