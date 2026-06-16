---
tags:
  - lang/solidity
  - sector/nft
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Nouns Builder]]"
auditors:
  - "[[0x52]]"
  - "[[0xReiAyanami]]"
  - "[[0xbepresent]]"
  - "[[0xcrunch]]"
  - "[[0xmystery]]"
  - "[[0xpep7]]"
  - "[[Aamirusmani1552]]"
  - "[[Ch_301]]"
  - "[[Falconhoof]]"
  - "[[HHK]]"
  - "[[Jiamin]]"
  - "[[Juntao]]"
  - "[[KingNFT]]"
  - "[[Kow]]"
  - "[[Krace]]"
  - "[[KupiaSec]]"
  - "[[Nyx]]"
  - "[[SilentDefendersOfDeFi]]"
  - "[[SovaSlava]]"
  - "[[almurhasan]]"
  - "[[ast3ros]]"
  - "[[bin2chen]]"
  - "[[cawfree]]"
  - "[[chaduke]]"
  - "[[circlelooper]]"
  - "[[coffiasd]]"
  - "[[dany.armstrong90]]"
  - "[[deepkin]]"
  - "[[dimulski]]"
  - "[[ge6a]]"
  - "[[ggg_ttt_hhh]]"
  - "[[giraffe]]"
  - "[[gqrp]]"
  - "[[pontifex]]"
  - "[[qpzm]]"
  - "[[rvierdiiev]]"
  - "[[saian]]"
  - "[[unforgiven]]"
  - "[[whoismxuse]]"
  - "[[xAriextz]]"
  - "[[ydlee]]"
  - "[[zraxx]]"
report: "https://github.com/sherlock-audit/2023-09-nounsbuilder-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# H-1: when reservedUntilTokenId > 100 first funder loss 1% NFT

- id: 29423
- impact: HIGH
- protocol: [[Nouns Builder]]
- reporter: 0x52 (Sherlock)
- source: N/A

## Summary


This bug report is about an issue in the Nouns Protocol where, when `reservedUntilTokenId > 100`, the first `tokenRecipient[]` is invalid, thus preventing the founder from obtaining this portion of the NFT. This is due to the incorrect use of `baseTokenId = reservedUntilTokenId` in the code. This can be demonstrated by a test in `token.t.sol` which asserts that `tokenRecipient[200]` is for the founder. This issue is of high severity as it results in a definite loss of funds for the founder. 

The root cause of this issue is the incorrect initialization of `baseTokenId` in `addFounders()`. This issue is related to #177, #247 and #67, which are all caused by the same root cause. A fix has been implemented in the code by the sponsor which resolves this issue.

## Details

Source: https://github.com/sherlock-audit/2023-09-nounsbuilder-judging/issues/42 

## Found by 
0x52, 0xReiAyanami, 0xbepresent, 0xcrunch, 0xmystery, 0xpep7, Aamirusmani1552, Ch\_301, Falconhoof, HHK, Jiamin, Juntao, KingNFT, Kow, Krace, KupiaSec, Nyx, SilentDefendersOfDeFi, SovaSlava, almurhasan, ast3ros, bin2chen, cawfree, chaduke, circlelooper, coffiasd, dany.armstrong90, deepkin, dimulski, ge6a, ggg\_ttt\_hhh, giraffe, gqrp, pontifex, qpzm, rvierdiiev, saian, unforgiven, whoismxuse, xAriextz, ydlee, zraxx
## Summary
The incorrect use of `baseTokenId = reservedUntilTokenId` may result in the first `tokenRecipient[]` being invalid, thus preventing the founder from obtaining this portion of the NFT.

## Vulnerability Detail

The current protocol adds a parameter `reservedUntilTokenId` for reserving `Token`.
This parameter will be used as the starting `baseTokenId` during initialization.

```solidity
    function _addFounders(IManager.FounderParams[] calldata _founders, uint256 reservedUntilTokenId) internal {
...

                // Used to store the base token id the founder will recieve
@>              uint256 baseTokenId = reservedUntilTokenId;

                // For each token to vest:
                for (uint256 j; j < founderPct; ++j) {
                    // Get the available token id
                    baseTokenId = _getNextTokenId(baseTokenId);

                    // Store the founder as the recipient
                    tokenRecipient[baseTokenId] = newFounder;

                    emit MintScheduled(baseTokenId, founderId, newFounder);

                    // Update the base token id
                    baseTokenId = (baseTokenId + schedule) % 100;
                }
            }
..

    function _getNextTokenId(uint256 _tokenId) internal view returns (uint256) {
        unchecked {
@>          while (tokenRecipient[_tokenId].wallet != address(0)) {
                _tokenId = (++_tokenId) % 100;
            }

            return _tokenId;
        }
    }
```

Because `baseTokenId = reservedUntilTokenId` is used, if `reservedUntilTokenId>100`, for example, reservedUntilTokenId=200, the first `_getNextTokenId(200)` will return `baseTokenId=200 ,  tokenRecipient[200]=newFounder`.

Example:
reservedUntilTokenId = 200
founder[0].founderPct = 10

In this way, the `tokenRecipient[]` of `founder` will become
tokenRecipient[200].wallet = founder   ( first will call _getNextTokenId(200) return 200)
tokenRecipient[10].wallet = founder      ( second will call _getNextTokenId((200 + 10) %100 = 10) )
tokenRecipient[20].wallet = founder
...
tokenRecipient[90].wallet = founder


However, this `tokenRecipient[200]` will never be used, because in `_isForFounder()`, it will be modulo, so only `baseTokenId < 100` is valid. In this way, the first founder can actually only `9%` of NFT.

```solidity
    function _isForFounder(uint256 _tokenId) private returns (bool) {
        // Get the base token id
@>      uint256 baseTokenId = _tokenId % 100;

        // If there is no scheduled recipient:
        if (tokenRecipient[baseTokenId].wallet == address(0)) {
            return false;

            // Else if the founder is still vesting:
        } else if (block.timestamp < tokenRecipient[baseTokenId].vestExpiry) {
            // Mint the token to the founder
@>          _mint(tokenRecipient[baseTokenId].wallet, _tokenId);

            return true;

            // Else the founder has finished vesting:
        } else {
            // Remove them from future lookups
            delete tokenRecipient[baseTokenId];

            return false;
        }
    }
```

## POC

The following test demonstrates that `tokenRecipient[200]` is for founder.

1. need change tokenRecipient to public , so can assertEq
```diff
contract TokenStorageV1 is TokenTypesV1 {
    /// @notice The token settings
    Settings internal settings;

    /// @notice The vesting details of a founder
    /// @dev Founder id => Founder
    mapping(uint256 => Founder) internal founder;

    /// @notice The recipient of a token
    /// @dev ERC-721 token id => Founder
-   mapping(uint256 => Founder) internal tokenRecipient;
+   mapping(uint256 => Founder) public tokenRecipient;
}
```

2. add to `token.t.sol`
```solidity
    function test_lossFirst(address _minter, uint256 _reservedUntilTokenId, uint256 _tokenId) public {
        deployAltMock(200);
        (address wallet ,,)= token.tokenRecipient(200);
        assertEq(wallet,founder);
    }
```

```console
$ forge test -vvv --match-test test_lossFirst

Running 1 test for test/Token.t.sol:TokenTest
[PASS] test_lossFirst(address,uint256,uint256) (runs: 256, μ: 3221578, ~: 3221578)
Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 355.45ms
Ran 1 test suites: 1 tests passed, 0 failed, 0 skipped (1 total tests)

```

## Impact

when reservedUntilTokenId > 100 first funder loss 1% NFT

## Code Snippet

https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/token/Token.sol#L161

## Tool used

Manual Review

## Recommendation
1. A better is that the baseTokenId always starts from 0.
```diff
    function _addFounders(IManager.FounderParams[] calldata _founders, uint256 reservedUntilTokenId) internal {
...

                // Used to store the base token id the founder will recieve
-               uint256 baseTokenId = reservedUntilTokenId;
+               uint256 baseTokenId =0;
```
or

2. use `uint256 baseTokenId = reservedUntilTokenId  % 100;`
```diff
    function _addFounders(IManager.FounderParams[] calldata _founders, uint256 reservedUntilTokenId) internal {
...

                // Used to store the base token id the founder will recieve
-               uint256 baseTokenId = reservedUntilTokenId;
+               uint256 baseTokenId = reservedUntilTokenId  % 100;
```



## Discussion

**neokry**

This is valid and is the core issue behind #247 as well. baseTokenId should start at 0 in `addFounders`

**nevillehuang**

I initially separated the 4 findings below, but I agree, #177, #247 and #67 are only possible because of the following lines of code [here](https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/token/Token.sol#L161), wherein `_addFounder()`, `baseTokenId` is incorrectly initialized to `reservedUntilTokenId ` in `addFounders()`, which is the root cause of the issue, and once fixed, all the issues will be fixed too. There are 4 impacts mentioned by watsons. 

```solidity
uint256 baseTokenId = reservedUntilTokenId;
```

1. Previous founders that are meant to be deleted are retained causing them to continue receiving minted NFTs --> High severity, since it is a definite loss of funds

2. #247: Any `reserveTokenId` greater than 100 will cause a 1% loss of NFT for founder --> High severity, since it is a definite loss of funds for founder as long as `reservedUntilTokenId ` is set greater than 100, which is not unlikely

3. #177: This is essentially only an issue as `baseTokenId` is incorrectly set as `reservedUntilTokenId` but will cause a definite loss of founders NFT if performed, so keeping as duplicate

4. #67: This is closely related to the above finding (177), where a new update to `reservedUntilTokenId` via `setReservedUntilTokenId` can cause over/underallocation NFTs so keeping as duplicate


However, in the context of the audit period, I could also see why watsons separated these issues, so happy to hear from watsons during escalation period revolving deduplication of these issues.

**neokry**

Fixed here: https://github.com/ourzora/nouns-protocol/pull/122

**nevillehuang**

Hi @neokry would be helpful if you could highlight to watsons here why you think the following primary issues should be duplicated under this issue:

#67
#177
#247 

From my understanding it stems from the `_addFounders()` function used in both the `initialize()` and `updateFounders()` function, in particular the following line [here](https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/token/Token.sol#L161), 
```solidity
uint256 baseTokenId = reservedUntilTokenId;
```

But it would be extremely helpful if you could provide a more detailed explanation in each finding, and show how the fix to #42 also fixes the rest of the findings.

To all watsons, this is my initial deduplication [here](https://discord.com/channels/812037309376495636/1176899915411099719/1184507360765546556), feel free to also provide me the flow state of the functions to prove that they do not have the same root cause.

**nevillehuang**

Hi watsons, 
The core of issue #42 is that `baseTokenId` should not start with `reservedUntilTokenId ` within `addFounders()`

#67 and its duplicates
I believe this issue and its duplicates are invalid as there is a misunderstanding of how founders token amount are assigned based on this [comment here](https://github.com/sherlock-audit/2023-09-nounsbuilder-judging/issues/67#issuecomment-1856255695)

Both #177 and #247 and its duplicates
This issue hinges on the same root cause that `baseTokenId` is initialized as `reservedUntilTokenId `. However, the key difference here is that `updateFounders()` is also affected, which is a completely different function. However, I still think that this should be duplicated with #42, based on [sherlock duplication rules](https://docs.sherlock.xyz/audits/judging/judging#ix.-duplication-rules), more specifically, see point 1.1 and 2. The only point where they cannot be considered duplicates is when the fixes are different. 

Unless a watson can prove to me that the fix implemented [here](https://github.com/ourzora/nouns-protocol/pull/122/commits/5f12ca4a21aaae6ca1289e5517d3545a27325366) by the sponsor is insufficient, I am inclined to keep all of them as duplicates except the above mentioned #67 and its duplicates.
