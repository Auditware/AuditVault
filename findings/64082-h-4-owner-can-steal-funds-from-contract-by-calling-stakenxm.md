---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/nft
  - sector/staking
  - sector/staking-pool
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[stETH]]"
auditors:
  - "[[0xRaz]]"
  - "[[CasinoCompiler]]"
  - "[[Cybrid]]"
  - "[[DevBear0411]]"
  - "[[Drynooo]]"
  - "[[JohnTPark24]]"
  - "[[Pataroff]]"
  - "[[asui]]"
  - "[[blockace]]"
  - "[[dandan]]"
  - "[[elolpuer]]"
  - "[[farismaulana]]"
  - "[[firmanregar]]"
  - "[[n33k]]"
  - "[[tobi0x18]]"
report: "https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging"
genome:
  - "[[centralization]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[reward-accounting]]"
---
# H-4: Owner can steal funds from contract by calling stakeNxm() with fake pool address

- id: 64082
- impact: HIGH
- protocol: [[stETH]] by EaseDeFi
- reporter: tobi0x18 (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the stNXM contract, which allows the contract owner to steal funds from the contract. The bug was found by multiple individuals and can be exploited by passing a fake staking pool address to the _stakeNxm() function and setting the owner as the fee beneficiary. This allows the owner to inflate rewards and withdraw all funds from the contract. The root cause of the bug is that the owner can pass any address to the _stakeNxm() function without validation. The impact of this bug is that the owner can steal funds from the contract. The protocol team has fixed this issue in a recent commit. To mitigate this issue, it is recommended to ensure that the pool address is valid in the _stakeNxm() function.

## Details


Source: https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging/issues/251 

## Found by 
0xRaz, CasinoCompiler, Cybrid, DevBear0411, Drynooo, JohnTPark24, Pataroff, asui, blockace, dandan, elolpuer, farismaulana, firmanregar, n33k, tobi0x18

### Summary

Owner can pass any address to `_stakeNxm()`, including a fake staking pool with a matching interface, to add this pool into `tokenIdToPool` mapping. Then owner can set himself as the fee beneficiary and call `getRewards()`. The fake pool can return arbitrary values from `withdraw()`, inflating rewards so that `adminFees` equals the contract’s entire `wNxm` balance, allowing the owner to withdraw all funds.

### Root Cause

Owner can pass any address to [stakeNxm()](https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi/blob/main/stNXM-Contracts/contracts/core/stNXM.sol#L351) to add fake pool to storage:
```solidity
function stakeNxm(uint256 _amount, address _poolAddress, uint256 _trancheId, uint256 _requestTokenId)
    external
    onlyOwner
    update
{
    _stakeNxm(_amount, _poolAddress, _trancheId, _requestTokenId);
}

function _stakeNxm(uint256 _amount, address _poolAddress, uint256 _trancheId, uint256 _requestTokenId) internal {
    wNxm.unwrap(_amount);
    // Make sure it's the most recent token controller address.
    nxm.approve(nxmMaster.getLatestAddress("TC"), _amount);

    IStakingPool pool = IStakingPool(_poolAddress);
    uint256 tokenId = pool.depositTo(_amount, _trancheId, _requestTokenId, address(this));
    tokenIdToTranches[tokenId].push(_trancheId);
    // if new nft token is minted we need to keep track of
    // tokenId and poolAddress inorder to calculate assets
    // under management
    if (tokenIdToPool[tokenId] == address(0)) {
        tokenIds.push(tokenId);
        tokenIdToPool[tokenId] = _poolAddress;
    }
}
```
Next owner can update `beneficiary` to himself:
```solidity
function changeBeneficiary(address _newBeneficiary) external onlyOwner {
    beneficiary = _newBeneficiary;
}
```
And then call `getRewards()` so pool will return fake `rewards` value and `adminFees` will be inflated:
```solidity
function getRewards() external update returns (uint256 rewards) {
    for (uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tokenId = tokenIds[i];
        rewards += _withdrawFromPool(tokenIdToPool[tokenId], tokenId, false, true, tokenIdToTranches[tokenId]);
    }
    rewards += collectDexFees();
    adminFees += rewards * adminPercent / DIVISOR;
    ...
}

function _withdrawFromPool(
    ...
) internal returns (uint256 amount) {
    IStakingPool pool = IStakingPool(_poolAddress);
    (uint256 withdrawnStake, uint256 withdrawnRewards) =
        pool.withdraw(_tokenId, _withdrawStake, _withdrawRewards, _trancheIds);
    amount = withdrawnStake + withdrawnRewards;
    wNxm.wrap(amount);
}
``` 
Next he will call `withdrawAdminFees()` to withdraw funds:
```solidity
function withdrawAdminFees() external update {
    if (adminFees > 0) wNxm.transfer(beneficiary, adminFees);
    adminFees = 0;
}
```

### Internal Pre-conditions

_No response_

### External Pre-conditions

_No response_

### Attack Path

1. User deposits `100e18 wNXM` into the `stNXM` contract.
2. Owner creates a contract that matches the `StakingPool` interface.
3. Owner calls `stakeNxm()` with his pool address and `amount = 100e18`.
4. The contract unwraps `wNXM`, `pool.depositTo()` returns some `tokenId`, which is stored together with the pool address.
5. Owner calls `changeBeneficiary()` and sets the beneficiary to himself (assume a 10% fee).
6. Owner calls `getRewards()`. The contract iterates over all pools, and the fake pool returns `withdrawnRewards = 100e18`.
7. The contract wraps `100e18 NXM` into `wNXM`.
8. `adminFees` increases by `10e18 wNXM` (the 10% fee).
9. The owner repeats steps 3 and 6 with slightly adjusted amounts, adding almost the entire `100e18` to `adminFees`.
10. Owner calls `withdrawAdminFees()` and steals the funds from the contract.

### Impact

Owner will steal funds from the contract.

### PoC

_No response_

### Mitigation

Ensure that `poolAddress` is valid in `stakeNxm()`.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/EaseDeFi/stNXM-Contracts/commit/448a741b44d3588c490b62134ca9e330e270a8ed
