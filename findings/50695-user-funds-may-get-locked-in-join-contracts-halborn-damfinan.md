---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/halborn
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[LMCV]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/damfinance/lmcv-part-2-smart-contract-security-assessment"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# USER FUNDS MAY GET LOCKED IN JOIN CONTRACTS

- id: 50695
- impact: HIGH
- protocol: [[LMCV]] part 2
- reporter: Halborn
- source: https://www.halborn.com/audits/damfinance/lmcv-part-2-smart-contract-security-assessment

## Summary


The `RewardJoin` and `StakeJoin` contracts can be stopped by the administrator using the `cage` function. This prevents users from successfully calling the `exit` function and retrieving their staked and rewards tokens. The contracts also do not have a way to be restarted, leading to all funds being locked inside. This bug has a medium impact and a low likelihood of occurring. To solve this issue, the `cage` function was updated to allow the contract to be made live again.

## Details

##### Description

The `RewardJoin` and `StakeJoin` contracts have possibility to be stopped/disabled by the administrator using `cage` function.

When the administrator calls the `cage` function, user funds will get locked as the users will not be able to call the `exit` function successfully and get the staked and rewards tokens.

The contracts also do not implement a possibility to start the contract again (setting the `live` flag to `1`), so all funds will get locked inside the contract.

Code Location
-------
---
---

`cage` function:

#### contracts/staking/RewardJoin.sol

```
function cage() external auth {
    live = 0;
    emit Cage();
}

```

[`staking/RewardJoin.sol`](https://github.com/DecentralizedAssetManagement/lmcv/blob/f5861988508a5bb291a3a7f2863693cd9762dee7/contracts/staking/RewardJoin.sol#L100)

#### contracts/staking/RewardJoin.sol

```
function exit(address usr, uint256 wad) external {
    require(live == 1, "CollateralJoin/not-live");
    stakingVault.pullRewards(collateralName, msg.sender, wad);
    require(collateralContract.transfer(usr, wad), "RewardJoin/failed-transfer");
    emit Exit(usr, wad);
}

```

[`staking/StakeJoin.sol`](https://github.com/DecentralizedAssetManagement/lmcv/blob/f5861988508a5bb291a3a7f2863693cd9762dee7/contracts/staking/StakeJoin.sol#L98)

#### contracts/staking/StakeJoin.sol

```
function exit(address usr, uint256 wad) external {
    require(live == 1, "CollateralJoin/not-live");
    stakingVault.pullStakingToken(msg.sender, wad);
    require(collateralContract.transfer(usr, wad), "CollateralJoin/failed-transfer");
    emit Exit(usr, wad);
}

```

Example Hardhat test cases:

```
it("HAL-01 User staked tokens are locked (StakeJoin)", async function () {
    // User stakes tokens
    let userStakeJoin = stakeJoin.connect(addr1);
    await userStakeJoin.join(addr1.address, fwad("1000"));

    // Contract is stopped
    await stakeJoin.cage();

    // User can't exit, collateral is locked in the contract
    await expect(userStakeJoin.exit(addr1.address, fwad("500")))
        .to.be.revertedWith("CollateralJoin/not-live");
});

```

```
it("HAL-01 User rewards are locked (RewardsJoin)", async function () {
    // User stakes tokens
    let userStakeJoin = stakeJoin.connect(addr1);
    await userStakeJoin.join(addr1.address, fwad("1000"));

    // User stakes tokens in the vault
    userSV = stakingVault.connect(addr1);
    await userSV.stake(fwad("800"), addr1.address);

    // Rewards are added
    await fooJoin.join(fwad("1000"));

    // User stakes 0 to claim rewards
    await userSV.stake("0", addr1.address);

    // Contract is stopped
    await fooJoin.cage();

    // User tries to exit rewards join contract
    let userFooJoin1 = fooJoin.connect(addr1);
    await expect(userFooJoin1.exit(addr1.address, "1000000000000000000000"))
        .to.be.revertedWith("CollateralJoin/not-live");
});

```

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

**SOLVED**: The `cage` function in the `RewardJoin` and `StakeJoin` contracts was updated, adding a possibility to make the contract live again.

Reference: [RewardJoin.sol](https://github.com/DecentralizedAssetManagement/lmcv/blob/a4b1e5cf9d68e0f2392ac26e3867dda166e70020/contracts/staking/RewardJoin.sol#L78) and [StakeJoin.sol](https://github.com/DecentralizedAssetManagement/lmcv/blob/a4b1e5cf9d68e0f2392ac26e3867dda166e70020/contracts/staking/StakeJoin.sol#L76)
