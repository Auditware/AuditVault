---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/insurance
protocol: "[[Canto]]"
auditors:
  - "[[SpicyMeatball]]"
report: "https://code4rena.com/reports/2024-03-canto"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-stuck-asset]]"
---
# [H-01] Native gas tokens can become stuck in `ASDRouter` contract

- id: 32129
- impact: HIGH
- protocol: [[Canto]]
- reporter: SpicyMeatball (Code4rena)
- source: https://code4rena.com/reports/2024-03-canto

## Summary


This bug report outlines an issue with the `asD` redemption flow in the `ASDRouter` contract. When a successful redemption occurs, native gas tokens called `CANTO` can become stuck in the contract. This is due to the way the contract handles `msg.value` during the redemption process. There are three possible scenarios that can occur, and in two of them, the excess `msg.value` is not refunded, causing the native tokens to become stuck. This behavior violates a protocol rule that states the `ASDRouter` native balance should always be zero. A suggested solution is to modify the `_sendASD` function to refund the remaining `msg.value` in order to prevent this issue. The severity of this bug has been increased to High as there is currently no way to safely recover the stuck tokens. However, it is also noted that this issue can be avoided by the user by not sending a non-zero `msg.value` in the first scenario and by not sending more than the expected `_feeForSend` in the second scenario.

## Details



In case of a successful `asD` redemption flow, native gas tokens (`CANTO`) can become stuck in the `ASDRouter` contract.

A successful execution of [`lzCompose`(…)](https://github.com/code-423n4/2024-03-canto/blob/1516028017a34ccfb4b0b19f5c5f17f5fa4cad42/contracts/asd/asdRouter.sol# L52-L111) ends with a call to [`_sendASD`(…)](https://github.com/code-423n4/2024-03-canto/blob/1516028017a34ccfb4b0b19f5c5f17f5fa4cad42/contracts/asd/asdRouter.sol# L130-L167):
```

function _sendASD(bytes32 _guid, OftComposeMessage memory _payload, uint _amount) internal {
    /* transfer the ASD tokens to the destination receiver */
    if (_payload._dstLzEid == cantoLzEID) {
        // just transfer the ASD tokens to the destination receiver
        ...
        ASDOFT(_payload._cantoAsdAddress).transfer(_payload._dstReceiver, _amount);   // @audit 0 of msg.value used
    } else {
        // use Layer Zero oapp to send ASD tokens to the destination receiver on the destination chain

        // make sure msg.value is enough to cover the fee or this transaction will revert
        if (msg.value < _payload._feeForSend) {   // @audit msg.value >= _payload._feeForSend seems intended, otherwise != should be used
            // refund ASD tokens on canto
            _refundToken(_guid, _payload._cantoAsdAddress, _payload._cantoRefundAddress, _amount, msg.value, "insufficient msg.value for send fee");
            return;
        }

        // create send params for the Layer Zero oapp
        ...

        // send tokens
        (bool successfulSend, bytes memory data) = payable(_payload._cantoAsdAddress).call{value: _payload._feeForSend}(abi.encodeWithSelector(IOFT.send.selector, sendParams, fee, _payload._cantoRefundAddress));   // @audit only _payload._feeForSend of msg.value used

        // check if the send was successful
        if (!successfulSend) {
            // refund ASD tokens on canto
            _refundToken(_guid, _payload._cantoAsdAddress, _payload._cantoRefundAddress, _amount, msg.value, string(data));
            return;
        }
        ...
    }
    // @audit rest of msg.value is not refunded
}
```

Thereby, one can distinguish 3 scenarios:

1. On error: `msg.value` is fully refunded to specified refund address.
2. On successful transfer (within Canto chain): `0` of `msg.value` is used and any remaining value will be stuck.

*One cannot assume and the contract doesn’t require that `msg.value == 0` always holds in this case.*

3. On successful transfer (to other chain): `_payload._feeForSend` of `msg.value` is used for sending `asD`, the remaining value will be stuck.

*One cannot assume and the contract doesn’t require that `msg.value == _payload._feeForSend` always holds in this case.*

Furthermore, the present behaviour violates a protocol invariant, according to the [README](https://github.com/code-423n4/2024-03-canto/blob/1516028017a34ccfb4b0b19f5c5f17f5fa4cad42/README.md?plain=1# L193):

> 1. `ASDRouter` native balance should always be zero.

### Proof of Concept

The diff below modifies the existing test case `lzCompose: successful deposit and send on canto` to demonstrate that excess `msg.value` is not refunded in case of a successful `asD` redemption flow.
```

diff --git a/test/ASDRouter.js b/test/ASDRouter.js
index 2a36337..eccedc0 100644
--- a/test/ASDRouter.js
+++ b/test/ASDRouter.js
@@ -276,6 +276,7 @@ describe("ASDRouter", function () {
     it("lzCompose: successful deposit and send on canto", async () => {
         // update whitelist
         await ASDUSDC.updateWhitelist(USDCOFT.target, true);
+        const gas = ethers.parseEther("1");
         // call lzCompose with valid payload
         await expect(
             ASDRouter.lzCompose(
@@ -287,12 +288,18 @@ describe("ASDRouter", function () {
                     generatedRouterPayload(cantoLzEndpoint.id, refundAddress, TESTASD.target, TESTASD.target, "0", refundAddress, "0")
                 ),
                 executorAddress,
-                "0x"
+                "0x",
+                { value: gas }
             )
         )
             .to.emit(ASDRouter, "ASDSent")
             .withArgs(guid, refundAddress, TESTASD.target, amountUSDCSent, cantoLzEndpoint.id, false);
         // expect ASD to be sent to canto
         expect(await TESTASD.balanceOf(refundAddress)).to.equal(amountUSDCSent);
+
+        // expect gas to be refunded and not held in ASDRouter
+        expect(await ethers.provider.getBalance(ASDRouter.target)).to.equal(0);
+        expect(await ethers.provider.getBalance(refundAddress)).to.equal(gas);
+
     });
 });
```

### Recommended Mitigation Steps

Apply the following changes to the [`_sendASD`(…)](https://github.com/code-423n4/2024-03-canto/blob/1516028017a34ccfb4b0b19f5c5f17f5fa4cad42/contracts/asd/asdRouter.sol# L130-L167) method in order to refund the remaining value (i.e. the native contract balance).
```

diff --git a/contracts/asd/asdRouter.sol b/contracts/asd/asdRouter.sol
index 7cb4ecc..37786e1 100644
--- a/contracts/asd/asdRouter.sol
+++ b/contracts/asd/asdRouter.sol
@@ -164,6 +164,10 @@ contract ASDRouter is IOAppComposer, Ownable {
             }
             emit ASDSent(_guid, _payload._dstReceiver, _payload._cantoAsdAddress, _amount, _payload._dstLzEid, true);
         }
+
+        if (address(this).balance > 0) {
+            payable(_payload._cantoRefundAddress).transfer(address(this).balance);
+        }
     }

     /**
```

Note: Using `transfer` might not be an ideal choice, but this proposed solution in meant to be in analogy with the `_refundToken(...)` method.

### Assessed type

ETH-Transfer

**[3docSec (judge) commented](https://github.com/code-423n4/2024-03-canto-findings/issues/6# issuecomment-2036468654):**

> Looks valid. The difference between `msg.value` and `_payload._feeForSend` is indeed not refunded to `_payload._cantoRefundAddress` as one would expect.

**[dsudit01 (Canto) confirmed](https://github.com/code-423n4/2024-03-canto-findings/issues/6# issuecomment-2040292140)**

**[3docSec (judge) increased severity to High and commented](https://github.com/code-423n4/2024-03-canto-findings/issues/6# issuecomment-2041070438):**

> Upgrading to High as if I am not mistaken, there is no viable way to safely recover the native tokens stuck in the contract.

**[SpicyMeatball (warden) commented](https://github.com/code-423n4/2024-03-canto-findings/issues/6# issuecomment-2041102837):**

> @3docSec - it is true that there is no way to recover ETH from the router once the transaction succeeds, but I think it should be viewed as a user’s mistake and QA is more appropriate. The report describes two cases in which ETH can stuck:
>
> 1. `On successful transfer (within Canto chain)` - there is no need for the user to send a non-zero msg.value in this case.
> 2. `On successful transfer (to other chain)` - since `_feeForSend` is known beforehand, sending `msg.value > _feeForSend` can be considered a mistake on user’s side.

**[3docSec (judge) commented](https://github.com/code-423n4/2024-03-canto-findings/issues/6# issuecomment-2041117922):**

> > On successful transfer (within Canto chain).
>
> Agree, Low impact there.
>
> > `sending msg.value > _feeForSend` can be considered a mistake on user’s side.
>
> The logic is protected against excess tokens and has a `refundAddress` for this purpose. The fact that refunds cover only full refunds and not partial ones is not one a user could reasonably expect.

---
