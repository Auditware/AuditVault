---
tags:
  - severity/high
  - lang/solidity
  - sector/token
  - sector/streaming
  - platform/quantstamp
protocol: "[[Powerloom L2]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/powerloom-l-2/695c4ca5-2bab-42f2-b41d-bff9eec03f32/index.html"
genome:
  - "[[reward-accounting]]"
  - "[[logic/reward-calculation]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# The Legacy Node Vesting Formula Ignores `legacyNodeTokensSentOnL1` Leading to Excessive Reward Distribution

- id: 58811
- impact: HIGH
- protocol: Powerloom L2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/powerloom-l-2/695c4ca5-2bab-42f2-b41d-bff9eec03f32/index.html

## Summary


The bug report is about an issue in the `SnapshotterState.sol` file where legacy node owners who have provided KYC details are able to claim more tokens than intended. The protocol is supposed to reward these owners with `legacyNodeValue` subtracted by `legacyTokensSentOnL1`, but the calculations for vested amounts do not take into account the tokens already sent on the layer one chain. This results in legacy node owners receiving a larger amount of tokens than intended. The recommendation is to adjust the logic for calculating vested amounts to account for `legacyTokensSentOnL1`.

## Details

**File(s) affected:**`SnapshotterState.sol`

**Description:** Owners of legacy nodes who have provided KYC details can claim node token rewards after burning their node. The intention of the protocol is to reward the owners `legacyNodeValue` subtracted by `legacyTokensSentOnL1`. These tokens are partly transferred immediately upon burning the tokens (the `initialClaim` amount) with the remaining being vested over time. This remaining amount is set as the `tokensAfterInitialClaim` field in `nodeIdToVestingInfo` here:

```
nodeIdToVestingInfo[_nodeId] = LegacyNodeVestingInfo(
    msg.sender,
    initialClaim,
->  (legacyNodeValue - legacyTokensSentOnL1 - initialClaim),
    0,
    block.timestamp
);
```

However, all calculations when determining a user's vested amounts do not consider the `legacyTokensSentOnL1` as highlighted by this line in the `vestedLegacyNodeTokens()` function:

```
uint256 totalTokens = legacyNodeValue - initialClaim;
```

Therefore users will be able to claim the entire `legacyNodeValue` once vesting is complete regardless of how many tokens have already been sent to them on the layer one chain, resulting in legacy node owners each receiving a larger amount of tokens than is intended by the protocol.

**Recommendation:** Consider adjusting the logic when calculating the amounts of tokens available during vesting to handle the `legacyTokensSentOnL1`.
