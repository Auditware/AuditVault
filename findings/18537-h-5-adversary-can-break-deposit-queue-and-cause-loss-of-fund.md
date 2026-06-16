---
tags:
  - lang/solidity
  - sector/nft
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Y2K]]"
auditors:
  - "[[VAD37]]"
report: "https://github.com/sherlock-audit/2023-03-Y2K-judging"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
---
# H-5: Adversary can break deposit queue and cause loss of funds

- id: 18537
- impact: HIGH
- protocol: [[Y2K]]
- reporter: VAD37 (Sherlock)
- source: N/A

## Summary


A bug was found in the Carousel.sol and ERC1155.sol files of the Y2K-Finance/Earthquake project. When processing deposits for the deposit queue, it _mintShares to the specified receiver which makes a _mint subcall. The base ERC1155 _mint is used which always behaves the same way that ERC721 safeMint does, that is, it always calls _doSafeTrasnferAcceptanceCheck which makes a call to the receiver. A malicious user can make the receiver always revert, which breaks the deposit queue completely and leads to the loss of funds for all users whose deposits are blocked.

The impact of this bug is that users who deposited before the adversary will lose their entire deposit. The code snippet for this bug can be found at Carousel.sol#L310-L355. This bug was found by 0x52, 0xRobocop, Bauer, HonorLt, Respx, Ruhum, VAD37, bin2chen, immeas, joestakey, jprod15, libratus, ltyu, mstpr-brainbot, nobody2018, roguereddwarf, warRoom, yixxas, who used manual review as a tool. 

The recommendation to fix this bug is to override _mint to remove the safeMint behavior so that users can't DOS the deposit queue. This was discussed by 3xHarry, who agreed with the issue and suggested that Openzeppelin's 1155 implementation guide could be used to ensure the receiver of the asset is able to call safeTransferFrom, or to do the 1155 acceptance check in the mint function and confiscate the funds if the receiver is not able to hold 1155s. The funds could then be retrieved via a manual process from the treasury afterward. 3xHarry also provided a fix PR for this issue, which was approved by IAm0x52.

## Details

Source: https://github.com/sherlock-audit/2023-03-Y2K-judging/issues/468 

## Found by 
0x52, 0xRobocop, Bauer, HonorLt, Respx, Ruhum, VAD37, bin2chen, immeas, joestakey, jprod15, libratus, ltyu, mstpr-brainbot, nobody2018, roguereddwarf, warRoom, yixxas

## Summary



## Vulnerability Detail

[Carousel.sol#L531-L538](https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L531-L538)

    function _mintShares(
        address to,
        uint256 id,
        uint256 amount
    ) internal {
        _mint(to, id, amount, EMPTY);
        _mintEmissions(to, id, amount);
    }

When processing deposits for the deposit queue, it _mintShares to the specified receiver which makes a _mint subcall.

[ERC1155.sol#L263-L278](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ca822213f2275a14c26167bd387ac3522da67fe9/contracts/token/ERC1155/ERC1155.sol#L263-L278)

    function _mint(address to, uint256 id, uint256 amount, bytes memory data) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");

        address operator = _msgSender();
        uint256[] memory ids = _asSingletonArray(id);
        uint256[] memory amounts = _asSingletonArray(amount);

        _beforeTokenTransfer(operator, address(0), to, ids, amounts, data);

        _balances[id][to] += amount;
        emit TransferSingle(operator, address(0), to, id, amount);

        _afterTokenTransfer(operator, address(0), to, ids, amounts, data);

        _doSafeTransferAcceptanceCheck(operator, address(0), to, id, amount, data);
    }

The base ERC1155 _mint is used which always behaves the same way that ERC721 safeMint does, that is, it always calls _doSafeTrasnferAcceptanceCheck which makes a call to the receiver. A malicious user can make the receiver always revert. This breaks the deposit queue completely. Since deposits can't be canceled this WILL result in loss of funds to all users whose deposits are blocked. To make matters worse it uses first in last out so the attacker can trap all deposits before them

## Impact

Users who deposited before the adversary will lose their entire deposit

## Code Snippet

[Carousel.sol#L310-L355](https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L310-L355)

## Tool used

Manual Review

## Recommendation

Override _mint to remove the safeMint behavior so that users can't DOS the deposit queue



## Discussion

**3xHarry**

agree with this issue, there is no easy solution to this, as by definition when depositing into queue, the user gives up the atomicity of his intended mint. [Looking at Openzeppelins 1155 implementation guide ](https://docs.openzeppelin.com/contracts/3.x/erc1155) it is recommended to ensure the receiver of the asset is able to call safeTransferFrom. By removing the acceptance check in the `_mint` function, funds could be stuck in a smart contract. 

Another alternative would be to do the 1155 acceptance check in the mint function and confiscate the funds if the receiver is not able to hold 1155s. The funds could be retrieved via a manual process from the treasury afterward. 

**3xHarry**

going with Recommendation is prob the easiest way

**3xHarry**

fix PR: https://github.com/Y2K-Finance/Earthquake/pull/124

**IAm0x52**

Fix looks good. _mint no longer calls acceptance check so rollover can longer be DOS'd by it
