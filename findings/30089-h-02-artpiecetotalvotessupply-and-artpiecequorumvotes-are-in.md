---
tags:
  - lang/solidity
  - sector/governance
  - sector/nft
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Collective]]"
auditors:
  - "[[King_]]"
report: "https://code4rena.com/reports/2023-12-revolutionprotocol"
genome:
  - "[[precision-loss]]"
  - "[[locked-funds]]"
  - "[[quorum-supply-drift]]"
---
# [H-02] `ArtPiece.totalVotesSupply` and `ArtPiece.quorumVotes` are incorrectly calculated due to inclusion of the inaccessible voting powers of the NFT that is being auctioned at the moment when an art piece is created

- id: 30089
- impact: HIGH
- protocol: [[Collective]]
- reporter: King\_ (Code4rena)
- source: https://code4rena.com/reports/2023-12-revolutionprotocol

## Summary


The bug report discusses an issue in the protocol where the total vote supply and quorum requirements for art pieces are calculated incorrectly. This is due to the inclusion of an inaccessible voting power from an ERC721 token that is currently on auction. This results in incorrect quorum requirements and makes it harder to reach the quorum. The impact of this issue is higher in the early phase of the protocol and can lead to unfair situations between different art pieces. The report recommends subtracting the voting power of the NFT currently on auction when calculating the vote supply and quorum requirements. The severity of this issue has been increased to High.

## Details


<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L228> 

<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L234>

In this protocol, art pieces are uploaded, voted on by the community and auctioned. Being the highest-voted art piece is not enough to go to auction, and that art piece also must reach the quorum.

The quorum for the art piece is determined according to the total vote supply when the art piece is created. This total vote supply is calculated according to the current supply of the `erc20VotingToken` and `erc721VotingToken`. `erc721VotingTokens` have [weight](https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L44C3-L45C44) compared to regular `erc20VotingTokens` and ERC721 tokens give users much more voting power.

<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L226C1-L229C11>

```solidity
file: CultureIndex.sol
    function createPiece ...{
        // ...
        newPiece.totalVotesSupply = _calculateVoteWeight(
            erc20VotingToken.totalSupply(),
-->         erc721VotingToken.totalSupply() //@audit-issue This includes the erc721 token which is currently on auction. No one can use that token to vote on this piece.
        );
        // ...
-->     newPiece.quorumVotes = (quorumVotesBPS * newPiece.totalVotesSupply) / 10_000; //@audit quorum votes will also be higher than it should be.
        // ...
    }
    
```

`_calculateVoteWeight` function:

```solidity
    function _calculateVoteWeight(uint256 erc20Balance, uint256 erc721Balance) internal view returns (uint256) {
        return erc20Balance + (erc721Balance * erc721VotingTokenWeight * 1e18);
    }
```

As I mentioned above, `totalVotesSupply` and `quorumVotes` of an art piece are calculated when the art piece is created based on the total supplies of the erc20 and erc721 tokens.

However, there is an important logic/context issue here.\
This calculation includes the erc721 verbs token which is **currently on auction** and sitting in the `AuctionHouse` contract. The voting power of this token can never be used for that art piece because:

1.  `AuctionHouse` contract obviously can not vote.

2.  The future buyer of this NFT also can not vote since users' right to vote is determined based on the [creation block](https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/CultureIndex.sol#L313C26-L313C77) of the art piece.

In the end, totally inaccessible voting powers are included when calculating `ArtPiece.totalVotesSupply` and `ArtPiece.quorumVotes`, which results in incorrect quorum requirements and makes it harder to reach the quorum.

### Impact

*   Quorum vote requirements for created art pieces will be incorrect if there is an ongoing auction at the time the art piece is created.

*   This will make it harder to reach the quorum.

*   Unfair situations can occur between two art pieces (*different totalVotesSuppy, different quorum requirements, but the same accessible/actual vote supply*)

I also would like to that add the impact of this issue is not linear. It will decrease over time with the `erc721VotingToken` supply starts to increase day by day.

The impact is much higher in the early phase of the protocol, especially in the first days/weeks after the protocol launch where the `verbsToken` supply is only a handful.

### Proof of Concept

Let's assume that:\
\-The current `erc20VotingToken` supply is 1000 and it won't change for this scenario.\
\-The weight of `erc721VotingToken` is 100.\
\-`quorumVotesBPS` is 5000 (50% quorum required)

**Day 0: Protocol Launched**

1.  Users started to upload their art pieces.

2.  There is no NFT minted yet.

3.  The total votes supply for all of these art pieces is 1000.

**Day 1: First Mint**

1.  One of the art pieces is chosen.

2.  The art piece is minted in `VerbsToken` contract and transferred to `AuctionHouse` contract.

3.  The auction has started.

4.  `erc721VotingToken` supply is 1 at the moment.

5.  Users keep uploading art pieces for the next day's auction.

6.  For these art pieces uploaded on day 1:\
    `totalVotesSupply` is 1100\
    `quorumVotes` is 550\
    **Accessible vote supply is still 1000**.

7.  According to accessible votes, the quorum rate is 55% not 50.

**Day 2: Next Day**

1.  The auction on the first day is concluded and transferred to the buyer.

2.  The next `verbsToken` is minted and the auction is started.

3.  `erc721VotingToken` supply is 2.

4.  Users keep uploading art pieces for the next day's auction.

5.  For these art pieces uploaded on day 2:\
    `totalVotesSupply` is 1200\
    `quorumVotes` is 600\
    **Accessible vote supply is 1100**. (1000 + 100 from the buyer of the first NFT)

6.  The actual quorum rate for these art pieces is \~54.5% (600 / 1100).

_NOTE: The numbers used here are just for demonstration purposes. The impact will be much much higher if the `erc721VotingToken` weight is a bigger value like 1000._

### Recommended Mitigation Steps

I strongly recommend subtracting the voting power of the NFT currently on auction when calculating the vote supply of the art piece and the quorum requirements.

```diff
// Note: You will also need to store auctionHouse contract address
in this contract.
+   address auctionHouse;

    function createPiece () {
    ...

        newPiece.totalVotesSupply = _calculateVoteWeight(
            erc20VotingToken.totalSupply(),
-           erc721VotingToken.totalSupply()
+           // Note: We don't subtract 1 as fixed amount in case of auction house being paused and not having an NFT at that moment. We only subtract if there is an ongoing auction. 
+           erc721VotingToken.totalSupply() - erc721VotingToken.balanceOf(auctionHouse)
        );

    ...
    }
```

**[0xTheC0der (Judge) commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/168#issuecomment-1879782583):**
 > @rocketman-21 Requesting additional sponsor input on this one.  
> This seems to be valid to me after a first review.

**[rocketman-21 (Revolution) confirmed and commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/168#issuecomment-1881977475):**
 > Super valid ty sirs.

**[0xTheC0der (Judge) increased severity to High and commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/168#issuecomment-1885404619):**
 > Severity increase was discussed with sponsor privately.
 
***
