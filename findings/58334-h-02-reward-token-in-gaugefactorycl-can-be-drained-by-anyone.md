---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/nft
  - sector/stable
  - sector/staking-pool
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[Audit 507]]"
auditors:
  - bareli
report: "https://code4rena.com/reports/2025-05-blackhole"
genome:
  - "[[reward-accounting]]"
  - "[[reward-theft]]"
---
# [H-02] Reward token in `GaugeFactoryCL` can be drained by anyone

- id: 58334
- impact: HIGH
- protocol: Audit 507
- reporter: bareli (Code4rena)
- source: https://code4rena.com/reports/2025-05-blackhole

## Summary


This bug report discusses a vulnerability in the `GaugeFactoryCL.sol` contract, which is responsible for creating `GaugeCL` instances for Algebra Concentrated Liquidity pools. The `createGauge` function in this contract lacks access control, allowing any external actor to call it. This function, in turn, calls an internal `createEternalFarming` function, which is designed to seed a new Algebra eternal farming incentive with an initial, hardcoded amount of 1e10 of the `_rewardToken`. An attacker can exploit this vulnerability by repeatedly calling the `createGauge` function, causing the reward token to be transferred from `GaugeFactoryCL` to a new Algebra farm associated with a pool specified by the attacker. This can result in the draining of the reward token from the `GaugeFactoryCL` contract. The attacker can then stake a Liquidity Provider (LP) NFT into this newly created (spam) `GaugeCL` and its associated Algebra farm, and subsequently claim that reward. To mitigate this issue, it is recommended to implement robust access control on the `GaugeFactoryCL.createGauge()` function, restricting its execution to authorized administrators or designated smart contracts. A proof of concept is provided in the report to demonstrate how an attacker can exploit this vulnerability. The Blackhole Protocol disputes the severity of this issue, stating that it only deposits a small amount of BLACK tokens, which is sufficient for its intended use. However, the issue has been mitigated by implementing access control measures. 

## Details



<https://github.com/code-423n4/2025-05-blackhole/blob/92fff849d3b266e609e6d63478c4164d9f608e91/contracts/AlgebraCLVe33/GaugeFactoryCL.sol# L59>

### Findings Description and Impact

The `GaugeFactoryCL.sol` contract, responsible for creating `GaugeCL` instances for Algebra Concentrated Liquidity pools, has a public `createGauge` function. Below is the implementation of the function:
```

    function createGauge(address _rewardToken,address _ve,address _pool,address _distribution, address _internal_bribe, address _external_bribe, bool _isPair,
                        IGaugeManager.FarmingParam memory farmingParam, address _bonusRewardToken) external returns (address) {

createEternalFarming(_pool, farmingParam.algebraEternalFarming, _rewardToken, _bonusRewardToken);
        last_gauge = address(new GaugeCL(_rewardToken,_ve,_pool,_distribution,_internal_bribe,_external_bribe,_isPair, farmingParam, _bonusRewardToken, address(this)));
        __gauges.push(last_gauge);
        return last_gauge;
    }
```

The `GaugeFactoryCL.createGauge` function lacks access control, allowing any external actor to call it. This function, in turn, calls an internal `createEternalFarming` function. Below is the implementation of the `createEternalFarming` function:
```

    function createEternalFarming(address _pool, address _algebraEternalFarming, address _rewardToken, address _bonusRewardToken) internal {
        IAlgebraPool algebraPool = IAlgebraPool(_pool);
        uint24 tickSpacing = uint24(algebraPool.tickSpacing());
        address pluginAddress = algebraPool.plugin();
        IncentiveKey memory incentivekey = getIncentiveKey(_rewardToken, _bonusRewardToken, _pool, _algebraEternalFarming);
        uint256 remainingTimeInCurrentEpoch = BlackTimeLibrary.epochNext(block.timestamp) - block.timestamp;
        uint128 reward = 1e10;
        uint128 rewardRate = uint128(reward/remainingTimeInCurrentEpoch);

        IERC20(_rewardToken).safeApprove(_algebraEternalFarming, reward);
        address customDeployer = IAlgebraPoolAPIStorage(algebraPoolAPIStorage).pairToDeployer(_pool);
        IAlgebraEternalFarming.IncentiveParams memory incentiveParams =
            IAlgebraEternalFarming.IncentiveParams(reward, 0, rewardRate, 0, tickSpacing);
        IAlgebraEternalFarmingCustom(_algebraEternalFarming).createEternalFarming(incentivekey, incentiveParams, pluginAddress, customDeployer);
    }
```

It is designed to seed a new Algebra eternal farming incentive with an initial, hardcoded amount of 1e10 of the `_rewardToken`. It achieves this by having `GaugeFactoryCL` approve the `algebraEternalFarming` contract, which is then expected to pull these tokens from `GaugeFactoryCL`.

If the `GaugeFactoryCL` contract is pre-funded with reward tokens to facilitate this initial seeding for legitimate gauges, an attacker can repeatedly call the `createGauge` function which will trigger the `createEternalFarming` process, causing the reward token to be transferred from `GaugeFactoryCL` to a new Algebra farm associated with a pool specified by the attacker ultimately draining the reward token from the `GaugeFactoryCL` contract.

The attacker can then potentially stake a Liquidity Provider (LP) NFT into this newly created (spam) `GaugeCL` and its associated Algebra farm, and subsequently claim that reward.

### Recommended mitigation steps

Implement robust access control on the `GaugeFactoryCL.createGauge()` function, restricting its execution to authorized administrators or designated smart contracts, thereby preventing unauthorized calls.

### Proof of Concept

1. Protocol admin pre-funds `GaugeFactoryCL` with `5e10` of USDC (50,000).
2. Attacker calls `GaugeFactoryCL.createGauge()`:
```

 IGaugeFactoryCL(GFCL_ADDRESS).createGauge(
     USDC_ADDRESS,       // _rewardToken
     VE_ADDRESS,
     TARGET_POOL_ADDRESS,
     ATTACKER_ADDRESS,   // _distribution
     ATTACKER_ADDRESS,   // _internal_bribe
     ATTACKER_ADDRESS,   // _external_bribe
     true,               // _isPair
     farmingParams,      // including ALGEBRA_ETERNAL_FARMING_ADDRESS
     ZERO_ADDRESS        // _bonusRewardToken
 );
```

3. The public `createGauge` function is entered which calls its internal `createEternalFarming(_pool, farmingParam.algebraEternalFarming, USDC_ADDRESS, _bonusRewardToken)`.
4. Execution within `GaugeFactoryCL.createEternalFarming()`:
```

function createEternalFarming(address _pool, address _algebraEternalFarming, address _rewardToken, address _bonusRewardToken) internal {
    // ...
    uint128 reward = 1e10; // 10,000 USDC
    // ...
    // GaugeFactoryCL approves AlgebraEternalFarming to spend its USDC
    IERC20(_rewardToken /* USDC_ADDRESS */).safeApprove(_algebraEternalFarming, reward);
    // ...
    // Call to AlgebraEternalFarming which will pull the approved USDC
    IAlgebraEternalFarmingCustom(_algebraEternalFarming).createEternalFarming(incentivekey, incentiveParamsWithReward, pluginAddress, customDeployer);
}
```

5. Execution within `AlgebraEternalFarming.createEternalFarming()` [here](https://github.com/cryptoalgebra/Algebra/blob/f9a0eff66e2e6d3b9c2b794612cd382aaca8f181/src/farming/contracts/farmings/AlgebraEternalFarming.sol# L125):
```

/// @inheritdoc IAlgebraEternalFarming
  function createEternalFarming(
    IncentiveKey memory key,
    IncentiveParams memory params,
    address plugin
  ) external override onlyIncentiveMaker returns (address virtualPool) {
    address connectedPlugin = key.pool.plugin();
    if (connectedPlugin != plugin || connectedPlugin == address(0)) revert pluginNotConnected();
    if (IFarmingPlugin(connectedPlugin).incentive() != address(0)) revert anotherFarmingIsActive();

    virtualPool = address(new EternalVirtualPool(address(this), connectedPlugin));
    IFarmingCenter(farmingCenter).connectVirtualPoolToPlugin(virtualPool, IFarmingPlugin(connectedPlugin));

    key.nonce = numOfIncentives++;
    incentiveKeys[address(key.pool)] = key;
    bytes32 incentiveId = IncentiveId.compute(key);
    Incentive storage newIncentive = incentives[incentiveId];

    (params.reward, params.bonusReward) = _receiveRewards(key, params.reward, params.bonusReward, newIncentive);
    if (params.reward == 0) revert zeroRewardAmount();

    unchecked {
      if (int256(uint256(params.minimalPositionWidth)) > (int256(TickMath.MAX_TICK) - int256(TickMath.MIN_TICK)))
        revert minimalPositionWidthTooWide();
    }
    newIncentive.virtualPoolAddress = virtualPool;
    newIncentive.minimalPositionWidth = params.minimalPositionWidth;
    newIncentive.pluginAddress = connectedPlugin;

    emit EternalFarmingCreated(
      key.rewardToken,
      key.bonusRewardToken,
      key.pool,
      virtualPool,
      key.nonce,
      params.reward,
      params.bonusReward,
      params.minimalPositionWidth
    );

    _addRewards(IAlgebraEternalVirtualPool(virtualPool), params.reward, params.bonusReward, incentiveId);
    _setRewardRates(IAlgebraEternalVirtualPool(virtualPool), params.rewardRate, params.bonusRewardRate, incentiveId);
  }
```

6. It calls the `_receiveRewards` function [here](https://github.com/cryptoalgebra/Algebra/blob/f9a0eff66e2e6d3b9c2b794612cd382aaca8f181/src/farming/contracts/farmings/AlgebraEternalFarming.sol# L411):
```

  function _receiveRewards(
    IncentiveKey memory key,
    uint128 reward,
    uint128 bonusReward,
    Incentive storage incentive
  ) internal returns (uint128 receivedReward, uint128 receivedBonusReward) {
    if (!unlocked) revert reentrancyLock();
    unlocked = false; // reentrancy lock
    if (reward > 0) receivedReward = _receiveToken(key.rewardToken, reward);
    if (bonusReward > 0) receivedBonusReward = _receiveToken(key.bonusRewardToken, bonusReward);
    unlocked = true;

    (uint128 _totalRewardBefore, uint128 _bonusRewardBefore) = (incentive.totalReward, incentive.bonusReward);
    incentive.totalReward = _totalRewardBefore + receivedReward;
    incentive.bonusReward = _bonusRewardBefore + receivedBonusReward;
  }
```

7. It calls the `_receiveToken` function [here](https://github.com/cryptoalgebra/Algebra/blob/f9a0eff66e2e6d3b9c2b794612cd382aaca8f181/src/farming/contracts/farmings/AlgebraEternalFarming.sol# L428):
```

  function _receiveToken(IERC20Minimal token, uint128 amount) private returns (uint128) {
    uint256 balanceBefore = _getBalanceOf(token);
    TransferHelper.safeTransferFrom(address(token), msg.sender, address(this), amount);
    uint256 balanceAfter = _getBalanceOf(token);
    require(balanceAfter > balanceBefore);
    unchecked {
      uint256 received = balanceAfter - balanceBefore;
      if (received > type(uint128).max) revert invalidTokenAmount();
      return (uint128(received));
    }
  }
```

8. `1e10` (10,000) USDC has been transferred to the new algebra farm.
9. Attacker repeats step 2 to 6 for 5 times to fully transfer 50,000 USDC out of the `GaugeCLFactory` contract.
10. Attacker stakes relevant LP NFT into the spam gauges through the `GaugeCL.deposit` function:
```

    function deposit(uint256 tokenId) external nonReentrant isNotEmergency {
        require(msg.sender == nonfungiblePositionManager.ownerOf(tokenId));

        nonfungiblePositionManager.approveForFarming(tokenId, true, farmingParam.farmingCenter);

        (IERC20Minimal rewardTokenAdd, IERC20Minimal bonusRewardTokenAdd, IAlgebraPool pool, uint256 nonce) =
                algebraEternalFarming.incentiveKeys(poolAddress);
        IncentiveKey memory incentivekey = IncentiveKey(rewardTokenAdd, bonusRewardTokenAdd, pool, nonce);
        farmingCenter.enterFarming(incentivekey, tokenId);
        emit Deposit(msg.sender, tokenId);
    }
```

11. Attacker directly calls the `AlgebraEternalFarming.claimReward` function to claim the rewards [here](https://github.com/cryptoalgebra/Algebra/blob/f9a0eff66e2e6d3b9c2b794612cd382aaca8f181/src/farming/contracts/FarmingCenter.sol# L119):
```

  /// @inheritdoc IAlgebraEternalFarming
  function claimReward(IERC20Minimal rewardToken, address to, uint256 amountRequested) external override returns (uint256 reward) {
    return _claimReward(rewardToken, msg.sender, to, amountRequested);
  }

  function _claimReward(IERC20Minimal rewardToken, address from, address to, uint256 amountRequested) internal returns (uint256 reward) {
    if (to == address(0)) revert claimToZeroAddress();
    mapping(IERC20Minimal => uint256) storage userRewards = rewards[from];
    reward = userRewards[rewardToken];

    if (amountRequested == 0 || amountRequested > reward) amountRequested = reward;

    if (amountRequested > 0) {
      unchecked {
        userRewards[rewardToken] = reward - amountRequested;
      }
      TransferHelper.safeTransfer(address(rewardToken), to, amountRequested);
      emit RewardClaimed(to, amountRequested, address(rewardToken), from);
    }
  }
```

**Blackhole commented:**

> Blackhole Protocol disputes the classification of this issue as high severity, noting that the protocol is designed to deposit no more than `$0.10` worth of BLACK tokens, an amount sufficient to spawn over a million liquidity pools on Blackhole.

**[Blackhole mitigated](https://github.com/code-423n4/2025-06-blackhole-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues)**

**Status:** Mitigation confirmed. Full details in reports from [lonelybones](https://code4rena.com/audits/2025-06-blackhole-mitigation-review/submissions/S-6) and [rayss](https://code4rena.com/audits/2025-06-blackhole-mitigation-review/submissions/S-53).

---


