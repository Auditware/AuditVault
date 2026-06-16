---
tags:
  - lang/solidity
  - platform/quantstamp
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Datachain IBC]]"
auditors:
  - "[[Andrei Stefan]]"
report: "https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[missing-close-constraint]]"
  - "[[commitment-uniqueness]]"
---
# Packet Commitment Not Deleted in `timeoutOnClose()`

- id: 59017
- impact: HIGH
- protocol: Datachain - IBC
- reporter: Andrei Stefan (Quantstamp)
- source: https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html

## Summary


The client has reported a bug in the `IBCChannelPacketTimeout.sol` file, specifically in the functions `timeoutPacket()` and `timeoutOnClose()`. These functions are supposed to update the channel's state if a packet's timeout has been exceeded. However, the check to remove the packet's commitment key after use is missing in `timeoutOnClose()`, which could cause the same timeout to be replayed multiple times. This could potentially lead to problems if the module handling the call refunds a user's tokens. The recommendation is to delete the packet commitment key in `timeoutOnClose()` to avoid this scenario. The bug has been marked as "Fixed" by the client and the fix can be found in the specified code.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `2b908894e790716c5c65aff3de151d63b17dae14`.

**File(s) affected:**`contracts/core/04-channel/IBCChannelPacketTimeout.sol`

**Description:** The two functions `timeoutPacket()` and `timeoutOnClose()` first check if a packet's timeout has been exceeded, and if so, update the channel's state accordingly. In order to avoid replaying the same timeout multiple times, the packet's commitment key can be removed after use, as is suggested for both functions in the [ICS-04 specification](https://github.com/cosmos/ibc/blob/47fea20d4d400e967721396092c6b43398c65d78/spec/core/ics-004-channel-and-packet-semantics/README.md). However, this check does not occur in `timeoutOnClose()`. Note that if `timeoutOnClose()` is called multiple times for the same packet, the following module call will occur each time:

```
lookupModuleByChannel(msg_.packet.sourcePort, msg_.packet.sourceChannel).onTimeoutPacket(
            msg_.packet, _msgSender()
```

Since we cannot know how each different module will handle this call, this replay scenario should be avoided. This could be particularly problematic if the module refunds a user's tokens in this scenario.

**Recommendation:** Delete the packet commitment key in `timeoutOnClose()`.
