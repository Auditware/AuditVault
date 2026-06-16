---
tags:
  - lang/solidity
  - sector/nft
  - sector/nft-marketplace
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/backrun
protocol: "[[Phi]]"
auditors:
  - "[[MrPotatoMagic]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[missing-owner-check]]"
  - "[[backrun]]"
  - "[[bridge-merkle-proof]]"
  - "[[frontrun-exposure]]"
  - "[[royalty-edge-cases]]"
  - "[[timestamp-dependence]]"
  - "[[merkle-tree-overflow]]"
---
# [H-04] Forced `endTime` extension in `updateArtSettings()` allows attacker to mint more tokens

- id: 41090
- impact: HIGH
- protocol: [[Phi]]
- reporter: MrPotatoMagic (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


This bug report discusses an issue with the `updateArtSettings()` function, which allows an artist to update the settings for their artwork. The problem is that if the artist wants to make changes after the claiming/minting event has ended, they are forced to extend the `endTime` to the current time. This creates a window of opportunity for a malicious user to mint more tokens. This could negatively affect both the existing token holders and the artist, as the value of the NFTs would decrease and the artist's royalties would be reduced. The recommended mitigation steps include providing a separate function for updating certain settings and using `>=` instead of `>` in a specific check. This bug is classified as a High severity issue as it could negatively impact the existing token holders and the artist. 

## Details


The function `updateArtSettings()` allows an artist to update the art settings for their artwork at any time. Specifically, it allows updating the `receiver`, `maxSupply`, `mintFee`, `startTime`, `endTime`, `soulBounded` and `uri` of the PhiArt struct as well as the royalty configuration.

### Issue

The issue is that if the artist wants to update the art settings after the claiming/minting event from `startTime` to `endTime` is over, the artist is forced to extend the `endTime` to atleast the current `block.timestamp`. The artist would be wanting to update the `uri` or the `soulBounded` value (in case it might be the artist's idea to keep or not keep soulbounded initially and then later on change the value to make it not soulbounded or soulbounded) or even updating the configuration for royalties for secondary sales post the event.

### Impact

Since the artist is forced to extend the `endTime` to `block.timestamp`, a malicious user keeping track of such calls to `updateArtSettings()` can backrun the artist's transaction with a `merkleClaim()` call to mint any amount of tokens for that `artId`. Since the validation [here](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L711) would not cause a revert, the call goes through successfully.

### Proof of Concept

Let's say the event occurred from `t = 0` to `t = 100`. A total of 500 tokens were minted out of 1000; i.e., the `maxSupply`.

1. Artist calls `updateArtSettings()` to update the `uri`, `soulBounded` value or royalty configuration.
    - Due to the check on Line 242, `endTime` parameter needs to be at least `block.timestamp` to update the settings the artist wants to.
    - The artist's call goes through and sets the `endTime` to `block.timestamp` and makes the respective changes to the settings the artist wanted to change; i.e., `uri`, `soulBounded` value or royalty configuration.

```solidity
File: PhiFactory.sol
220:     function updateArtSettings(
221:         uint256 artId_,
222:         string memory url_,
223:         address receiver_,
224:         uint256 maxSupply_,
225:         uint256 mintFee_,
226:         uint256 startTime_,
227:         uint256 endTime_,
228:         bool soulBounded_,
229:         IPhiNFT1155Ownable.RoyaltyConfiguration memory configuration
230:     )
231:         external
232:         onlyArtCreator(artId_)
233:     {
234:         if (receiver_ == address(0)) {
235:             revert InvalidAddressZero();
236:         }
237: 
238:         if (endTime_ < startTime_) {
239:             revert InvalidTimeRange();
240:         }
241:         
242:         if (endTime_ < block.timestamp) {
243:             revert EndTimeInPast();
244:         }
245: 
246:         PhiArt storage art = arts[artId_];
247: 
248:         if (art.numberMinted > maxSupply_) {
249:             revert ExceedMaxSupply();
250:         }
251: 
252:         art.receiver = receiver_;
253:         art.maxSupply = maxSupply_;
254:         art.mintFee = mintFee_;
255:         art.startTime = startTime_;
256:         art.endTime = endTime_;
257:         art.soulBounded = soulBounded_;
258:         art.uri = url_;
259: 
260:         uint256 tokenId = IPhiNFT1155Ownable(art.artAddress).getTokenIdFromFactoryArtId(artId_);
261:         IPhiNFT1155Ownable(art.artAddress).updateRoyalties(tokenId, configuration);
262:        ...
263:     }
```

2. A malicious user who was part of the merkle root in the past backruns the artist's transaction with a `merkleClaim()` function call.
    - The malicious user supplies the proof and leafPart from a past transaction done during the event.
    - The `encodeData_` parameter supplied would contain the minter address the malicious user was eligible with and the artId for which the settings were updated for.
    - The merkle claiming does not verify any other info such as quantity, which allows the user to input any amount of tokens to mint in the `MintArgs mintArgs` parameter.
    - The call moves to the `_validateAndUpdateClaimState()` internal function.

```solidity
File: PhiFactory.sol
361:     function merkleClaim(
362:         bytes32[] calldata proof_,
363:         bytes calldata encodeData_,
364:         MintArgs calldata mintArgs_,
365:         bytes32 leafPart_
366:     )
367:         external
368:         payable
369:         whenNotPaused
370:     {
371:         (address minter_, address ref_, uint256 artId_) = abi.decode(encodeData_, (address, address, uint256));
372:         PhiArt storage art = arts[artId_];
373: 
374:         bytes32 credMerkleRootHash = credMerkleRoot[art.credChainId][art.credId];
375:         if (minter_ == address(0) || !art.verificationType.eq("MERKLE") || credMerkleRootHash == bytes32(0)) {
376:             revert InvalidMerkleProof();
377:         }
378:         
380:         if (
381:             !MerkleProofLib.verifyCalldata(
382:                 proof_, credMerkleRootHash, keccak256(bytes.concat(keccak256(abi.encode(minter_, leafPart_))))
383:             )
384:         ) {
385:             revert InvalidMerkleProof();
386:         }
387: 
388:         _validateAndUpdateClaimState(artId_, minter_, mintArgs_.quantity);
389:         _processClaim(
390:             artId_, minter_, ref_, art.credCreator, mintArgs_.quantity, leafPart_, mintArgs_.imageURI, msg.value
391:         );
392: 
393:         ...
394:     }
```

3. In the function `_validateAndUpdateClaimState()`, the following occurs:
    - Line 727 evaluates to false since `block.timestamp > endTime` is not true since `endTime = block.timestamp`.
    - Line 729, since only 500 tokens were minted out of 1000 `maxSupply`, the malicious user can mint as many tokens up to the max supply.

```solidity
File: PhiFactory.sol
718:     function _validateAndUpdateClaimState(uint256 artId_, address minter_, uint256 quantity_) private {
719:         PhiArt storage art = arts[artId_];
720: 
721:         // Common validations
722:         if (tx.origin != _msgSender() && msg.sender != art.artAddress && msg.sender != address(this)) {
723:             revert TxOriginMismatch();
724:         }
725:         if (msg.value < getArtMintFee(artId_, quantity_)) revert InvalidMintFee();
726:         if (block.timestamp < art.startTime) revert ArtNotStarted();
727:         if (block.timestamp > art.endTime) revert ArtEnded(); 
728:         if (quantity_ == 0) revert InvalidQuantity();
729:         if (art.numberMinted + quantity_ > art.maxSupply) revert OverMaxAllowedToMint();
730: 
731:         // Common state updates
732:         if (!credMinted[art.credChainId][art.credId][minter_]) {
733:             credMinted[art.credChainId][art.credId][minter_] = true;
734:         }
735:         artMinted[artId_][minter_] = true;
736:         art.numberMinted += quantity_;
737:     }
```

4. The call returns back to the `merkleClaim()` function where the `_processClaim()` function proceeds to mint the `minter` address the tokens.

Through this, we can see how post-event, a artist was forced to extend the `endTime` to `block.timestamp` at least, which opened up a window of opportunity for a malicious user to mint tokens.

### Recommended Mitigation Steps

Consider providing a separate function to update the `uri`, `soulBounded` and royalty config settings since these values are most likely to be updated post an event. Additionally, as a safety measure use `>=` instead of `>` in the check [here](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L711).

### Assessed type

Timing

**[ZaK3939 (Phi) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2334800115):**
 > In addressing [Issue 70](https://github.com/code-423n4/2024-08-phi-findings/issues/70), we will make it impossible to update the `URI` and `soulbound` status. Therefore, when reopening, it seems better for the `endtime` to be automatically extended. We do not consider the observation about excessive minting to be a problem in any way. 

**[ZaK3939 (Phi) confirmed and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2334876016):**
 > As for this one, I re-labeled it as a bug, since I will delete update feature of `soulbound` and `uri`. 
>
> However, I will leave a comment regarding the number of mints, which we don't have a problem with and  we will tell artist this feature. I will take a consistent approach to other issues regarding mints quantity.
> 
> I agree that this can be classified as a medium severity bug. However, assuming the `soulbound` feature and `URI` have been removed, if we're going to update the contract, it should be properly reopened.
> 
> What's more concerning is the ability to manipulate the `mintfee` and `maxSupply` while leaving the blocktime in the past. This scenario presents a far more serious vulnerability.

**[0xDjango (judge) increased severity to High and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2349410674):**
 > This report highlights an interesting issue with the `updateArtSettings()` function, though I agree with the sponsor that I don't see extra minting to impose a problem for the artist or the protocol. I don't agree with ruling this as a Medium. I will dupe to [#14](https://github.com/code-423n4/2024-08-phi-findings/issues/14) as this report states:
 >
 >> The function `updateArtSettings()` allows an artist to update the art settings for their artwork at any time. Specifically, it allows updating the `receiver`, `maxSupply`, `mintFee`, `startTime`, `endTime`, `soulBounded` and `uri` of the PhiArt struct as well as the royalty configuration."

**[MrPotatoMagic (warden) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2351680679):**
 > @0xDjango, I believe this issue should be treated separately as a valid High-severity issue.
> 
> The reason why I think excessive minting is an issue is since once NFTs are being traded on external marketplaces, there are only limited amount of tokens in circulation (that have monetary value attached to them). If an artist updates the art settings and is forced to extend the `endTime` to `block.timestamp`, an attacker could use this opportunity to mint more tokens into circulation (indirectly receiving more monetary value as well as diluting the value of NFTs in the external market over time). Since there wasn't an ongoing event during which the minting occurs, this would fall under unauthorized minting that an artist wouldn't have expected after the original event ended.
> 
> The primary issue is viewing it from the viewpoint of an artist being malicious. Here this report is viewing it from the point of an artist being a normal honest actor who is wanting to update either the uri, soulbounded value or royalty config.
> 
> To note, post an event, 
>  - The `URI` can be updated for several reasons such as in case the IPFS/image hosting provider has changed but the media is kept the same.
>  - The `soulBounded` value can be updated in case it’s the artist idea (which has been communicated with users) to keep or not keep the NFTs soulbounded initially and then later on change the value to make it not soulbounded or soulbounded. 
>  - The royalty config percentage can clearly be updated by an artist post an event for secondary sale royalties, in case the artist wants to charge lesser or higher royalties.
> 
> Lastly, I also disagree with the comment that it does not affect the artist. It does affect the artist, since if this unauthorized minting occurs, it dilutes the value of the NFT in the external marketplace. This means the price per NFT drops and thus the royalties the artist receives are lesser since royalties are based on sale price as per EIP-2981, which is utilized by the protocol currently in CreatorRoyaltiesControl.sol.

**[0xDjango (judge) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2364311689):**
 > Thank you for re-surfacing this. My current thinking:
> 
> - BAYC originally minted for 0.08 ETH.
> - The floor price is currently ~12 ETH.
> - This `endTime` extension reopens minting. It negatively affects the users who already hold the NFT and intend to sell in on the open market for financial gain.

**[MrPotatoMagic (warden) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2364317140):**
 > Adding onto the impact mentioned:
 >> It negatively affects the users who already hold the NFT and intend to sell in on the open market for financial gain.
>
> It also affects the artist since the royalties received would be lesser as pointed out in the last paragraph in my comment. The existing users and artist have everything to lose while the attacker mints more tokens to receive free monetary value.

**[0xDjango (judge) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/54#issuecomment-2368953843):**
 > I have de-duped this report from #14. This report was the only one that mentioned the forced update to `endTime`, which can negatively affect token holders by allowing more minting after the NFTs have already been trading on the open market without the ability to mint fresh.
> 
> Note, this can be mitigated (on the frontend) by forcing the call to `updateArtSettings()` to provide a `maxSupply` equal to the current total number of NFTs that have already been minted. A janky mitigation though and could lead to frontrunning issues.

***
