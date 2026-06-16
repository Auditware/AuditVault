---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
  - sector/bridge
protocol: "[[Mellow]]"
auditors:
  - "[[0xShoonya]]"
  - "[[0xc0ffEE]]"
  - "[[7]]"
  - "[[8olidity]]"
  - "[[ARMoh]]"
  - "[[Brene]]"
  - "[[Caramelo10]]"
  - "[[Cybrid]]"
  - "[[Etherking]]"
  - "[[GypsyKing18]]"
  - "[[Ivcho332]]"
  - "[[Kodyvim]]"
  - "[[MaCree]]"
  - "[[Mishkat6451]]"
  - "[[Pandabear30]]"
  - "[[Pexy]]"
  - "[[PratRed]]"
  - "[[Sparrow_Jac]]"
  - "[[ZanyBonzy]]"
  - "[[akhoronko]]"
  - "[[aman]]"
  - "[[anchabadze]]"
  - "[[blockace]]"
  - "[[boredpukar]]"
  - "[[bughuntoor]]"
  - "[[ch13fd357r0y3r]]"
  - "[[coin2own]]"
  - "[[edger]]"
  - "[[iFindTheBugs2]]"
  - "[[illoy_sci]]"
  - "[[jasonxiale]]"
  - "[[joicygiore]]"
  - "[[jolyon]]"
  - "[[kangaroo]]"
  - "[[kazan]]"
  - "[[ke1caM]]"
  - "[[klaus]]"
  - "[[makeWeb3safe]]"
  - "[[rsam_eth]]"
  - "[[silver_eth]]"
  - "[[t.aksoy]]"
  - "[[teoslaf1]]"
  - "[[weblogicctf]]"
  - "[[zxriptor]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[fee-manipulation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# H-1: `Consensus`.`checkSignatures` doesn't check duplication of signers

- id: 62106
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: illoy\_sci (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the Mellow Flexible Vaults protocol, which was discovered by multiple individuals. The issue lies in the `SignatureQueue.validateOrder` function, which checks signatures using the `Consensus.checkSignatures` function. However, this does not check for duplicated signers, allowing a malicious attacker to bypass the `threshold` check. This vulnerability can be exploited by preparing an incorrect order, obtaining one valid signature, and then using `SignatureDepositQueue` or `SignatureRedeemQueue` with duplicated signatures to successfully execute the order and gain profit. The suggested mitigation is to check for duplication of signers. The protocol team has already addressed this issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/13 

## Found by 
0xShoonya, 0xc0ffEE, 7, 8olidity, ARMoh, Brene, Caramelo10, Cybrid, Etherking, GypsyKing18, Ivcho332, Kodyvim, MaCree, Mishkat6451, Pandabear30, Pexy, PratRed, Sparrow\_Jac, ZanyBonzy, akhoronko, aman, anchabadze, blockace, boredpukar, bughuntoor, ch13fd357r0y3r, coin2own, edger, iFindTheBugs2, illoy\_sci, jasonxiale, joicygiore, jolyon, kangaroo, kazan, ke1caM, klaus, makeWeb3safe, rsam\_eth, silver\_eth, t.aksoy, teoslaf1, weblogicctf, zxriptor

### Summary

[`SignatureQueue`.`validateOrder`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/queues/SignatureQueue.sol#L105) checks signatures using [`Consensus`.`checkSignatures`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/permissions/Consensus.sol#L21C14-L48).
But this doesn't check duplication of signers, so malicious attacker can bypass `threshold` checking.

### Root Cause

[`SignatureDepositQueue`.`deposit`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/queues/SignatureDepositQueue.sol#L12) and [`SignatureRedeemQueue`.`redeem`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/queues/SignatureRedeemQueue.sol#L14) uses [`SignatureQueue`.`validateOrder`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/queues/SignatureQueue.sol#L105).
This checks signatures using [`Consensus`.`checkSignatures`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/permissions/Consensus.sol#L21C14-L48).
```solidity
    function checkSignatures(bytes32 orderHash, Signature[] calldata signatures) public view returns (bool) {
        ConsensusStorage storage $ = _consensusStorage();
 @>     if (signatures.length == 0 || signatures.length < $.threshold) {
            return false;
        }
        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = signatures[i].signer;
            (bool exists, uint256 signatureTypeValue) = $.signers.tryGet(signer);
            if (!exists) {
                return false;
            }
            SignatureType signatureType = SignatureType(signatureTypeValue);
            if (signatureType == SignatureType.EIP712) {
                address recoveredSigner = ECDSA.recover(orderHash, signatures[i].signature);
                if (recoveredSigner == address(0) || recoveredSigner != signer) {
                    return false;
                }
            } else if (signatureType == SignatureType.EIP1271) {
                bytes4 magicValue = IERC1271(signer).isValidSignature(orderHash, signatures[i].signature);
                if (magicValue != IERC1271.isValidSignature.selector) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
```
This checks `signatures.length < $.threshold` but this doesn't check duplication of signers.
So attacker can bypass threshold and deposit or redeem using invalid order.

### Internal Pre-conditions

.

### External Pre-conditions

.

### Attack Path

1. Attacker prepares incorrect order.
2. Attacker gets one valid signature.
3. Attacker uses `SignatureDepositQueue` or `SignatureRedeemQueue` using `signatures` that has duplication of one valid signature.
4. Attacker succeed to order.

### Impact

Attacker can get profit using incorrect order bypassing threshold.

### PoC

.

### Mitigation

Check duplication of signers.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/5/files
