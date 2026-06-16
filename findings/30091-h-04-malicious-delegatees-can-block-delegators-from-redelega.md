---
tags:
  - lang/solidity
  - sector/governance
  - sector/nft
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Collective]]"
auditors:
  - "[[0xDING99YA]]"
report: "https://code4rena.com/reports/2023-12-revolutionprotocol"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# [H-04] Malicious delegatees can block delegators from redelegating and from sending their NFTs

- id: 30091
- impact: HIGH
- protocol: [[Collective]]
- reporter: 0xDING99YA (Code4rena)
- source: https://code4rena.com/reports/2023-12-revolutionprotocol

## Summary


This bug report discusses a vulnerability in the code of the Revolution Protocol, specifically in the VotesUpgradeable and ERC721CheckpointableUpgradeable contracts. This vulnerability allows a user to delegate their votes to someone else, but if that person is set to address(0), the user's votes can be blocked from being redelegated or transferred, even permanently. This is due to a change made in the implementation of the VotesUpgradeable contract, which allows for the possibility of multiple calls to the _moveDelegateVotes function with the parameter to set to address(0). This can be exploited by an attacker to block a user's access to their NFTs and their ability to delegate their votes. The report recommends not allowing users to delegate to address(0) as a mitigation step. The report also includes a proof of concept test and the tools used for the investigation.

## Details


<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/base/VotesUpgradeable.sol#L166> 

<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/base/VotesUpgradeable.sol#L235-L244> 

<https://github.com/code-423n4/2023-12-revolutionprotocol/blob/d42cc62b873a1b2b44f57310f9d4bbfdd875e8d6/packages/revolution/src/base/ERC721CheckpointableUpgradeable.sol#L41>

If user `X` delegates his votes to `Y`, `Y` can block `X` from redelegating and even from sending his NFT anywhere, forever.

### Detailed description

Users can acquire votes in two ways:

*   by having some `NontransferableERC20Votes` tokens
*   by having `VerbsToken` tokens

It is possible for them to delegate their votes to someone else. It is handled in the `VotesUpgradable` contract, that is derived from OpenZeppelin's `VotesUpgradable` and the following change is made with respect to the original implementation:

```diff
function delegates(address account) public view virtual returns (address) {
-        return $._delegatee[account];
+        return $._delegatee[account] == address(0) ? account : $._delegatee[account];
```

It is meant to be a convenience feature so that users don't have to delegate to themselves in order to be able to vote. However, it has very serious implications.

In order to see that, let's look at the `_moveDelegateVotes` function that is invoked every time someone delegates his votes or wants to transfer a voting token (`VerbsToken` in this case as `NontransferableERC20Votes` is non-transferable):

```solidity
    function _moveDelegateVotes(address from, address to, uint256 amount) private {
        VotesStorage storage $ = _getVotesStorage();
        if (from != to && amount > 0) {
            if (from != address(0)) {
                (uint256 oldValue, uint256 newValue) = _push(
                    $._delegateCheckpoints[from],
                    _subtract,
                    SafeCast.toUint208(amount)
                );
                emit DelegateVotesChanged(from, oldValue, newValue);
            }
            if (to != address(0)) {
                (uint256 oldValue, uint256 newValue) = _push(
                    $._delegateCheckpoints[to],
                    _add,
                    SafeCast.toUint208(amount)
                );
                emit DelegateVotesChanged(to, oldValue, newValue);
            }
        }
    }
```

As can be seen, it subtracts votes from current delegatee and adds them to the new one. There are 2 edge cases here:

*   `from == address(0)`, which is the case when current delegatee equals `0`
*   `to == address(0)`, which is the case when users delegates to `0`

If any of these conditions hold, only one of `$._delegateCheckpoints` is updated. This is fine in the original implementation as the function ignores cases when `from == to` and if function updates only `$._delegateCheckpoints[from]` it means that a user was delegating to `0` and when he changes delegatee, votes only should be added to some account, not subtracted from any account. Similarly, if the function updates only  `$._delegateCheckpoints[to]`, it means that user temporarily removes his votes from the system and hence his current delegatee's votes should be subtracted and not added into any other account.

As long as user cannot cause this function to update one of `$._delegateCheckpoints[from]` and `$._delegateCheckpoints[to]` several times in a row, it works correctly. It is indeed the case in the original OpenZeppelin's implementation as when `from == to`, function doesn't perform any operation.

**However, the problem with the current implementation is that it is possible to call this function with `to == 0` several times in a row.** In order to see it, consider the `_delegate` function which is called when users want to (re)delegate their votes:

```solidity
    function _delegate(address account, address delegatee) internal virtual {
        VotesStorage storage $ = _getVotesStorage();
        address oldDelegate = delegates(account);
        $._delegatee[account] = delegatee;


        emit DelegateChanged(account, oldDelegate, delegatee);
        _moveDelegateVotes(oldDelegate, delegatee, _getVotingUnits(account));
    }
```

As we can see, it calls `_moveDelegateVotes`, but with `oldDelegate` equal to `delegates(account)`. **But if `$._delegatee[account] == address(0)`, that function returns `account`**.

It means that `_moveDelegateVotes` can be called several times in a row with parameters `(account, 0, _getVotingUnits(account))`. In other words, if user delegates to `address(0)`, he will be able to do it several times in a row as `from` will be different than `to` in `_moveDelegateVotes` and the function will subtract his amount of votes from his `$._delegateCheckpoints` every time.

It may seem that a user `X` who delegates to `address(0)` multiple times will only harm himself, but it's not true as someone else can delegate to him and each time he delegates to `0`, his original voting power will be subtracted from his `$._delegateCheckpoints`, making it `0` or some small, value. If a user `Y` who delegated to `X` wants to redelegate to someone else or transfer his tokens, `_moveDelegateVotes` will revert with integer underflow as it will try to subtract `Y`'s votes from `$._delegateCheckpoints[X]`, but it will already be either a small number or even `0` meaning that `Y` will be unable to transfer his tokens or redelegate.

### Impact

Victims of the exploit presented above will neither be able to transfer their NFTs (the same would be true for `NontransferableERC20Votes`, but it's not transferable by design) nor to even redelegate back to themselves or to any other address.

While it can be argued that users will only delegate to users they trust, I argue that the issue is of High severity because of the following reasons:

*   Possibility of delegating is implemented in the code and it's expected to be used.
*   Every user who uses it risks the loss of access to all his NFTs and to redelegating his votes.
*   Even when delegatees are trusted, it still shouldn't be possible for them to block redelegating and blocking access to NFTs of their delegators; if delegators stop trusting delegatees, they should have a possibility to redelegate back, let alone to have access to their own NFTs, which is not the case in the current implementation.
*   The attack is not costly for the attacker as he doesn't have to lose any tokens - for instance, if he has `1` NFT and the victim who delegates to him has `10`, he can delegate to `address(0)` `10` times and then transfer his NFT to a different address - it will still block his victim and the attacker wouldn't lose anything.

### Proof of Concept

Please put the following test into the `Voting.t.sol` file and run it. It shows how a victim loses access to all his votes and all his NFTs just by delegating to someone:

<details>

```solidity
    function testBlockingOfTransferAndRedelegating() public
    {
        address user = address(0x1234);
        address attacker = address(0x4321);

        vm.stopPrank();

        // create 3 random pieces
        createDefaultArtPiece();
        createDefaultArtPiece();
        createDefaultArtPiece();

        // transfer 2 pieces to normal user and 1 to the attacker
        vm.startPrank(address(auction));
        erc721Token.mint();
        erc721Token.transferFrom(address(auction), user, 0);

        erc721Token.mint();
        erc721Token.transferFrom(address(auction), user, 1);

        erc721Token.mint();
        erc721Token.transferFrom(address(auction), attacker, 2);

        vm.stopPrank();
        
        // user delegates his votes to attacker
        vm.prank(user);
        erc721Token.delegate(attacker);

        // attacker delegates to address(0) multiple times, blocking user from redelegating
        vm.prank(attacker);
        erc721Token.delegate(address(0));

        vm.prank(attacker);
        erc721Token.delegate(address(0));

        // now, user cannot redelegate
        vm.prank(user);
        vm.expectRevert();
        erc721Token.delegate(user);

        // attacker transfer his only NFT to an address controlled by himself
        // he doesn't lose anything, but he still trapped victim's votes and NFTs
        vm.prank(attacker);
        erc721Token.transferFrom(attacker, address(0x43214321), 2);

        // user cannot transfer any of his NTFs either
        vm.prank(user);
        vm.expectRevert();
        erc721Token.transferFrom(user, address(0x1234567890), 0);
    }
```
</details>

### Tools Used

VS Code

### Recommended Mitigation Steps

Do not allow users to delegate to `address(0)`.

**[rocketman-21 (Revolution) confirmed and commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/49#issuecomment-1885578994):**
 > This is valid, major find thank you so much.
> 
> Proposed fix here:
> https://github.com/collectivexyz/revolution-protocol/commit/ef2a492e93e683f5d9d8c77cbcf3622bb936522a

**[0xTheC0der (Judge) commented](https://github.com/code-423n4/2023-12-revolutionprotocol-findings/issues/49#issuecomment-1885621992):**
 > Warden has shown how assets can be permanently frozen.

***
