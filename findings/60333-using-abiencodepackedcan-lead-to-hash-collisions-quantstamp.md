---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/bridge
  - sector/staking
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[wrong-encoding]]"
  - "[[wrong-state]]"
  - "[[bridge-message-validation]]"
  - "[[reward-accounting]]"
---
# Using `abi.encodePacked()`can Lead to Hash Collisions

- id: 60333
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


This report discusses a bug found in the `encodePacked()` function used in the Pheasant Network Bridge. This function can lead to hash collisions, allowing for potential fraudulent activity in both L1->L2 and L2->L1 trades. This can result in a user being able to dispute any L2->L1 trade and a relayer being able to send out less funds for L1->L2 trades without being disputed. The recommendation is to use `abi.encode()` instead of `abi.encodePacked()` when two dynamic items are used.

## Details

**Update**
The client has decided to keep using `encodePacked()` and made the following acknowledging comment: "The reason is that it is extremely difficult to manipulate the bytes within the correct Evidence to match the `destCode` and achieve a smaller trade amount. When we make the relayer to public, we will reconsider this and conduct a re-audit if necessary."

![Image 75: Alert icon](https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/static/media/info-icon-alert.3c9578483b1cf3181c9bfb6fec7dc641.svg)

**Update**
Marked as "Mitigated" by the client. The client provided the following explanation:

> 【L2 - L1 Trade】 In QS6, we changed the method to only register hashedEvidence when withdrawing, and to submit Evidence if disputer found the relayer’s malicious activity. With the way Pheasant works now, it would be a problem if the transaction data is tampered with, especially in Evidence. However, looking at `checkTransferTx()` and `checkERC20TransferTx()`, I believe it is impossible to commit fraud by shifting bits. 【L1 - L2 Trade】 For L1 to L2 trades, it will fail if the submitted Evidence is not correct. Moreover, we restore the amount from the transaction data within the Evidence. We believe that if the end of the transaction data is shifted to pay less, the restoration of the amount would become impossible, thus it cannot be accepted.

**File(s) affected:**`Lib_BridgeUtils.sol`, `BridgeDisputeManager.sol`, `PheasantNetworkBridgeChild.sol`

**Description:** The function `Lib_BridgeUtils.hashEvidence()` concatenates two elements and returns the resulting hash. The second element is vulnerable to hash collisions because its value is obtained by using the instruction `abi.encodePacked()` which gets ambiguous when two dynamic items (here, `bytes[]`) are used one after the other. It becomes possible for an attacker to arbitrarily put elements back and forth between the two items. The function will return the same hash even if the underlying transaction fields are different.

This can lead to high-severity issues for both L1->L2 and L2->L1:

**User Can Dispute Arbitrary L2->L1 Trades**

 In the evidence struct, a malicious user can easily forge evidence by e.g. shifting over the first array element of `txProof` to the last element of `txReceiptProof`. As evidence hashes can be forged, we can easily find an invalid evidence struct with the same hash that enables us to dispute any L2->L1 trade. As we are only comparing the hash of the evidence used by the relayer when they performed the `withdraw()` function call, we can slash the relayer with our invalid forged evidence, even though the relayer might have submitted a correct one.

**Relayer Can Send Out Less Funds For L1->L2 And Not Be Disputable**

 In this scenario, a relayer could make a fraudulent evidence with a matching evidence hash of the theoretically correct evidence of the L1 transaction they received from the requesting user. As this hash will be registered in the `isUniqueEvidence` mapping, the slashing will be impossible, as the `slashUpwardTrade()` function requires the `isUniqueEvidence` entry for the evidence hash to be unused. Assuming that the malicious user simply shifts over some of the trailing bits of the binary representation of the `amount` field to the following field, they could have evidence with the same evidence hash as the correct one requiring them to send out significantly less funds. Again, this would be undisputable, as the L1-evidence hash would match the manipulated one.

**Recommendation:** Consider using the instruction `abi.encode()` instead of the instruction `abi.encodePacked()` when two dynamic items are used.
