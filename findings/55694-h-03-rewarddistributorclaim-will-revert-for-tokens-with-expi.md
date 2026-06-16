---
tags:
  - lang/solidity
  - sector/governance
  - platform/0x52
  - has/github
  - severity/high
  - lang/vyper
protocol: "[[Hyperstable]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
---
# [H-03] `RewardDistributor#claim` will revert for tokens with expired locks leading to loss of rewards

- id: 55694
- impact: HIGH
- protocol: Hyperstable
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md

## Summary


The bug report discusses an issue with the RewardsDistributor contract, specifically in the `claim` function. The contract attempts to deposit tokens to the current `tokenId` even if the token lock has expired, causing the call to `revert`. This issue is also present in the `deposit_for` and `increase_unlock_time` functions in the vePeg contract. As a result, once a token lock has expired, all rewards will be permanently locked and cannot be claimed. The recommendation is to transfer the tokens directly to the owner if the lock has expired, and this has been fixed in the latest version of the contract.

## Details

**Details**

[RewardsDistributor.sol#L277-L287](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/RewardsDistributor.sol#L277-L287)

        function claim(uint256 _tokenId) external returns (uint256) {
            if (block.timestamp >= time_cursor) _checkpoint_total_supply();
            uint256 _last_token_time = last_token_time;
            _last_token_time = _last_token_time / WEEK * WEEK;
            uint256 amount = _claim(_tokenId, voting_escrow, _last_token_time);
            if (amount != 0) {
    @>          IVotingEscrow(voting_escrow).deposit_for(_tokenId, amount);
                token_last_balance -= amount;
            }
            return amount;
        }

We see above that when claiming for a token, the contract always attempts to deposit them to the current `tokenId`.

[vePeg.sol#L732-L739](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/vePeg.sol#L732-L739)

        function deposit_for(uint256 _tokenId, uint256 _value) external nonreentrant {
            LockedBalance memory _locked = locked[_tokenId];

            require(_value > 0); // dev: need non-zero value
            require(_locked.amount > 0, "No existing lock found");
    @>      require(_locked.end > block.timestamp, "Cannot add to expired lock. Withdraw");
            _deposit_for(_tokenId, _value, 0, _locked, DepositType.DEPOSIT_FOR_TYPE);
        }

Note that this call will `revert` if the token lock has expired. This means the above claim call will also `revert`.

[vePeg.sol#L795-L807](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/vePeg.sol#L795-L807)

        function increase_unlock_time(uint256 _tokenId, uint256 _lock_duration) external nonreentrant {
            assert(_isApprovedOrOwner(msg.sender, _tokenId));

            LockedBalance memory _locked = locked[_tokenId];
            uint256 unlock_time = (block.timestamp + _lock_duration) / WEEK * WEEK; // Locktime is rounded down to weeks

    @>      require(_locked.end > block.timestamp, "Lock expired");
            require(_locked.amount > 0, "Nothing is locked");
            require(unlock_time > _locked.end, "Can only increase lock duration");
            require(unlock_time <= block.timestamp + MAXTIME, "Voting lock can be 4 years max");

            _deposit_for(_tokenId, 0, unlock_time, _locked, DepositType.INCREASE_UNLOCK_TIME);
        }

Additionally once a token has expired the lock cannot be extended. As a result once a lock has expired, all rewards will be permanently locked and can never be claimed.

**Lines of Code**

[RewardsDistributor.sol#L277-L287](https://github.com/hyperstable/contracts/blob/35db5f2d3c8c1adac30758357fbbcfe55f0144a3/src/governance/RewardsDistributor.sol#L277-L287)

**Recommendation**

`RewardDistributor#claim` should transfer tokens directly to owner in the event that the lock is expired.

**Remediation**

Fixed in [3012a71](https://github.com/hyperstable/contracts/commit/3012a71458ded1fdef57003b622bbd90d96f6b13). Adds additional logic to `RewardsDistributor#claim` to transfer rewards directly to token owner if the lock has expired.
