---
tags:
  - blockchain/evm
  - blockchain/evm/mantle
  - lang/solidity
  - sector/infra
  - sector/insurance
  - sector/staking
  - platform/sigmaprime
  - has/github
  - severity/high
  - precondition/insider
protocol: "[[Mantle]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[insider]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Elected TSS Nodes Can Avoid Slashing By Having Insuﬃcient Deposits

- id: 19466
- impact: HIGH
- protocol: [[Mantle]] Network
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf

## Summary


This bug report is about TSS nodes being able to avoid being slashed by manipulating their deposit reserves. It is possible for a TSS node to be elected with a deposit smaller than the slashing quantity, resulting in an inability to punish the node’s misbehaviour. The only check on a node’s deposit size is made when they initially deposit funds by calling staking() and so any reduction that happens thereafter does not impact the node’s validity.

The bug report also covers the lack of signature size veriﬁcation checks and lack of array size checks before slicing or referencing array elements. These issues can result in an unhandled out-of-bounds panic and incorrect error returned with empty signature.

Recommendations include manually verifying all TSS nodes being voted on have a sufficient deposit, blacklisting them from nomination if they do not and implementing additional checks on the signature length prior to taking a slice of the signature bytes or performing any indexing operations. 

The issue has been resolved by implementing an on-chain solution at PR-826, confirming that the user’s private key is stored encrypted with password, and addressing the issue at PR-1131.

## Details

## Description

TSS nodes can avoid being slashed by manipulating their deposit reserves. TSS nodes must provide a deposit as insurance that they will perform their role honestly if elected. It is possible for a TSS node to be elected with a deposit smaller than the slashing quantity, resulting in an inability to punish the node’s misbehaviour. This can occur either as a result of a past slashing of the node or if the BITDAO chooses to change deposit minimums.

The only check on a node’s deposit size is made when they initially deposit funds by calling `staking()`, and so any reduction that happens thereafter does not impact the node’s validity. Therefore, when a node’s deposit is decreased by slashing, no checks occur to prevent the node being elected again. Likewise, if the BITDAO chooses to raise the slashing amounts, no checks are performed on existing staked node deposits. If such a node is then elected to the TSS group, any attempt to slash them due to misbehaviour will revert due to the check on line [287] in `TssStakingSlashing.sol`.

## Recommendations

This can be solved via an off-chain approach or by alterations made on-chain:

- The BITDAO could manually verify all TSS nodes being voted on have a sufficient deposit, blacklisting them from nomination if they do not.
- An on-chain solution could be to add a check to `setTssGroupMember()` that validates each elected node still has a sufficient deposit in the `TssStakingSlashing` contract. This would trigger a revert if one or more nodes had an insufficient deposit, and this would be grounds for a new group of nodes to be elected.

## Resolution

The issue has been addressed by implementing an on-chain solution at PR-826.

---

## MNT-05 TSS Nodes Set Includes Slashed Node By Default

**Asset**: `tss/manager/agreement.go`  
**Status**: Closed: See Resolution  
**Rating**: Severity: High, Impact: Medium, Likelihood: High

## Description

Slashed node can receive a portion of the distributed slashing reward. When a TSS node is slashed, some of its deposit is removed and handed to the other, honest, TSS nodes. Due to an oversight, the slashed node receives some of its penalty fees back, reducing the reward that other nodes receive for being honest. 

This occurs due to an oversight in the default Golang node behavior. Currently, the TSS Manager is responsible for coordinating the TSS nodes signing and supplies the full TSS active node set to TSS nodes as the set of signing nodes. This means the node being slashed is included in the set of nodes that are then rewarded from the slashing.

While it is possible for a TSS Node to generate their own set of nodes to include in the slashing message, it is unlikely a node will deviate from the default message generation behavior as all participating signing nodes must sign the same message in order for the message to be considered valid.

## Recommendations

Modify the TSS manager to remove the slashed node from the set of nodes broadcast to TSS nodes in the slashing message. Alternatively, the removal of the slashed node could be included in the TSS node prior to signing the message. The slashed node could also be removed on-chain if it is found in the set of nodes that were intended to be rewarded from the slashing. This method is more reliable; however, it would increase the gas costs of slashing a node.

## Resolution

The issue has been closed as a false positive, with the comment from the development team: Before selecting the TSS nodes, we will query the latest active node information off-chain, and slashed nodes will be excluded. When submitting the public keys of the selected node to `TssGroupManager`, the `TssGroupManager` will double-check the deposit amounts and ensure all deposit amounts are no less than the minimum deposit amount.

---

## MNT-06 Precompiled Contract Not Updated

**Asset**: `l2geth/contracts/tssreward/contract/tssreward.go`  
**Status**: Closed: See Resolution  
**Rating**: Severity: High, Impact: Medium, Likelihood: High

## Description

The precompiled contract `tssreward.go` in L2geth, scheduled for implementation at chain genesis, exhibits inconsistencies with its corresponding source code `packages/contracts/contracts/L2/predeploys/TssRewardContract.sol` in the parameters of certain functions and the absence of some functions, as indicated by the ABI on line [33].

Within the L2geth framework, a set of precompiled contracts are intended to be deployed on-chain during the chain genesis process. One of these contracts, namely `tssreward.go`, underwent its latest modification on November 11, 2022. Conversely, the corresponding source code file, located at `packages/contracts/contracts/L2/predeploys/TssRewardContract.sol`, was last edited on November 23, 2022.

Detecting the precise discrepancies between the two versions poses a challenge since `tssreward.go` solely contains bytecode representation. However, a comparison of the ABI on line [33] reveals variations in function parameters and the absence of certain functions in `tssreward.go`.

Updating the TSS reward contract or its address would require a hard fork as both are stored within L2geth, which would alter consensus. This hard fork could cause a chain split or further issues on-chain for contracts and users.

## Recommendations

Update the predeployed Golang contract `tssreward.go` with the correct bytecode and ABI information for the newer Solidity contract.

## Resolution

The issue has been acknowledged by the development team with the following comment: The `tssreward.go` has been abandoned, so the relevant version has not been updated and will be removed at a later date.

---

## MNT-07 L2Geth Client Private Key Stored Without Encryption

**Asset**: `l2geth/crypto/crypto.go`  
**Status**: Closed: See Resolution  
**Rating**: Severity: Medium, Impact: Medium, Likelihood: Medium

## Description

The L2geth node’s private key is stored in cleartext. The functions `SaveECDSA()` and `LoadECDSA()`, which save a private key to file and load a private key from a file respectively, make no use of encryption or decryption. This suggests that the L2geth client’s private key is stored in cleartext. As L2geth is used by Rollup verifiers and other system actors, this is not advisable.

## Recommendations

Do not store sensitive information, such as private keys, in cleartext. Implement encryption for sensitive data at rest.

## Resolution

The development team has confirmed that the user’s private key is stored encrypted with a password as per `passphrase.go#L186`, and that cleartext storage was only intended for development and test environments.

---

## MNT-08 Lack Of Signature Size Verification Checks

**Asset**: `tss/ws/server/handler.go`, `tss/manager/sign.go`, `datalayr-mantle/common/contracts/utils.go`  
**Status**: Resolved: See Resolution  
**Rating**: Severity: Medium, Impact: Medium, Likelihood: Medium

## Description

Multiple instances of lack of signature size verification before use have been identified:

- `tss/ws/server/handler.go` does not have checks to verify if the signature `sigBytes` is of sufficient size:
  ```go
  sigBytes, sigErr := hex.DecodeString(sig)
  if pubErr != nil || sigErr != nil {
      wm.logger.Error("hex decode error for pubkey or sig", "err", err)
      return
  }
  digestBz := crypto.Keccak256Hash([]byte(timeStr)).Bytes()
  if !crypto.VerifySignature(pubKeyBytes, digestBz, sigBytes[:64]) {
      wm.logger.Error("illegal signature", "publicKey", pubKey, "time", timeStr, "signature", sig)
      return
  }
  ```
  If the signature is not of sufficient length, line [184] could result in an unhandled out-of-bounds panic.

- `tss/manager/sign.go` also does not implement size checks before slicing the signature array:
  ```go
  if !crypto.VerifySignature(poolPubKeyBz, digestBz, signResponse.Signature[:64]) {
      log.Error("illegal signature")
      return
  }
  ```
  If `signResponse.Signature` length is less than 64, then this slicing operation `signResponse.Signature[:64]` will panic with an out-of-bounds error.

- Function `CompactSignature()` in `datalayr-mantle/common/contracts/utils.go` also does not implement signature size checks on the `sig` parameter; however, this particular function does not appear to be used anywhere in the codebase:
  ```go
  func CompactSignature(sig []byte) [64]byte {
      r := Copy32Byte(sig[:32])
      s := Copy32Byte(sig[32:64])
      v := sig[64]
  }
  ```

## Recommendations

Implement additional checks on the signature length prior to taking a slice of the signature bytes or performing any indexing operations.

## Resolution

The issue has been addressed at PR-1131.

---

## MNT-09 Incorrect Error Returned With Empty Signature

**Asset**: `tss/node/tsslib/keysign/tss_keysign.go`  
**Status**: Resolved: See Resolution  
**Rating**: Severity: Medium, Impact: Medium, Likelihood: Medium

## Description

`generateSignature()` may return an empty signature data in a successful response. In `SignMessage()` of `tss/node/tsslib/keysign/tss_keysign.go`, if an error is detected when calling `SetupIDMaps()`, an empty signature data field is returned. However, it is returned with an incorrect error object (`err` instead of `err1` or `err2`), meaning that an empty signature will be erroneously used later on:

```go
err1 := conversion.SetupIDMaps(partyIDMap, tKeySign.tssCommonStruct.PartyIDtoP2PID)
err2 := conversion.SetupIDMaps(partyIDMap, abnormalMgr.PartyIDtoP2PID)
if err1 != nil || err2 != nil {
    tKeySign.logger.Error().Err(err).Msgf("error in creating mapping between partyID and P2P ID")
    return emptySignatureData, err // @audit this should be either err1 or err2
}
```

Then the check in `tss/node/tsslib/keysign.go:generateSignature()` line [48] will fail (due to `err` being nil), returning an empty signature in the successful response on line [59]:
```go
signatureData, err := keysignInstance.SignMessage(req.Message, localStateItem, signers)
// the statistic of keygen only care about Tss itself, even if the following http response aborts,
// it still counted as a successful keygen as the Tss model runs successfully.
if err != nil {
    t.logger.Error().Err(err).Msg("err in keysign")
    culprits := keysignInstance.GetTssCommonStruct().GetAbnormalMgr().TssCulpritsNodes()
    return keysign2.Response{
        Status: common.Fail,
        FailReason: abnormal.SignatureError,
        Culprits: culprits,
    }, nil
}
return keysign2.NewResponse(
    &signatureData,
    common.Success,
    "",
    nil,
), nil
```

## Recommendations

Correct `tss/node/tsslib/keysign/tss_keysign.go` line [103] to return the relevant `err1` or `err2` instead of `err`.

## Resolution

The issue has been addressed at PR-1131.
