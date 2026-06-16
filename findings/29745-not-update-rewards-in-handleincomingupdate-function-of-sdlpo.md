---
tags:
  - lang/solidity
  - sector/bridge
  - sector/oracle
  - sector/perpetuals
  - sector/staking
  - sector/staking-pool
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Stake.Link]]"
auditors:
  - "[[innertia]]"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[chainlink-round-completeness]]"
  - "[[reward-accounting]]"
---
# Not Update Rewards in `handleIncomingUpdate` Function of `SDLPoolPrimary` Leads to Incorrect Reward Calculations

- id: 29745
- impact: HIGH
- protocol: [[Stake.Link]]
- reporter: innertia (Codehawks)
- source: N/A

## Summary


The report identifies a bug in the `SDLPoolPrimary` contract that can lead to incorrect reward calculations. This is caused by not updating rewards before executing the `handleIncomingUpdate` function in the `SDLPoolPrimary` contract. This can result in a scenario where the total rewards accrued by all stakers exceed the available balance in the rewards pool. The report provides a proof of concept that demonstrates this issue and shows that the `distributeRewards` function will fail due to insufficient balance in the rewards pool.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231">https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231</a>


## Summary
Failing to update rewards before executing the [`handleIncomingUpdate`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231) function in [`SDLPoolPrimary`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol), while adjusting the `effectiveBalance` of the [`ccipController`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/ccip/SDLPoolCCIPControllerPrimary.sol), results in miscalculated rewards. This oversight can obstruct the distribution of rewards for the secondary chain.

## Vulnerability Details
- Actions taken in the secondary pool are queued and then communicated to the primary pool. The primary pool must acknowledge these changes before they are executed. The message sent to the primary pool includes the number of new queued locks to be minted (`numNewQueuedLocks`) and the change in the reSDL supply (`reSDLSupplyChange`).

- Upon receiving the message, the [`SDLPoolCCIPControllerPrimary` ](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/ccip/SDLPoolCCIPControllerPrimary.sol) contract updates the `reSDLSupplyByChain` and forwards the message to [`SDLPoolPrimary`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231). The [`SDLPoolPrimary`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231) contract then processes the message, returning the `mintStartIndex` for the secondary chain to use when minting new locks. It also updates the [`effectiveBalances`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L243)  for the `ccipController` and the `totalEffectiveBalance`.
```js
  function _ccipReceive(Client.Any2EVMMessage memory _message) internal override {
        uint64 sourceChainSelector = _message.sourceChainSelector;

        (uint256 numNewRESDLTokens, int256 totalRESDLSupplyChange) = abi.decode(_message.data, (uint256, int256));

        if (totalRESDLSupplyChange > 0) {
  >>        reSDLSupplyByChain[sourceChainSelector] += uint256(totalRESDLSupplyChange);
        } else if (totalRESDLSupplyChange < 0) {
  >>        reSDLSupplyByChain[sourceChainSelector] -= uint256(-1 * totalRESDLSupplyChange);
        }
  >>    uint256 mintStartIndex =ISDLPoolPrimary(sdlPool).handleIncomingUpdate(numNewRESDLTokens, totalRESDLSupplyChange);   
        _ccipSendUpdate(sourceChainSelector, mintStartIndex);

        emit MessageReceived(_message.messageId, sourceChainSelector);
    }
```

- The issue arises because the [`handleIncomingUpdate`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L231) function does not update the rewards before altering these values. Since these values directly affect reward accounting, failing to update them leads to incorrect calculations. This could result in a scenario where the total rewards accrued by all stakers exceed the available balance in the `rewardsPool`.
```js
  function handleIncomingUpdate(uint256 _numNewRESDLTokens, int256 _totalRESDLSupplyChange)
        external
        onlyCCIPController
        returns (uint256)
    {
       // some code ...

        if (_totalRESDLSupplyChange > 0) {
>>            effectiveBalances[ccipController] += uint256(_totalRESDLSupplyChange);
>>           totalEffectiveBalance += uint256(_totalRESDLSupplyChange);
        } else if (_totalRESDLSupplyChange < 0) {
>>           effectiveBalances[ccipController] -= uint256(-1 * _totalRESDLSupplyChange);
>>            totalEffectiveBalance -= uint256(-1 * _totalRESDLSupplyChange);
        }
  // more code ....
    }
```
- For example, consider Alice has staked `500 sdl` tokens, and there is an outgoing `1000 reSdl`. The state would be as follows:

- `effectiveBalance[alice]` = **500**
- `effectiveBalance[ccipController]` = **1000**
- `totalEffectiveBalance` = **1500**

- Now, assume `1500 reward` tokens are distributed this will update the `rewardPerToken = 1` (rewards/totalStaked), and Alice will withdraw her rewards. The amount of rewards Alice receives is calculated using the [`withdrawableRewards`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/RewardsPool.sol#L38) function, which relies on her `effectiveBalance` (controller.staked()). With a `rewardPerToken` of `1` and Alice's `userRewardPerTokenPaid` at `0`, Alice would receive `500 rewards`.
 ```js
   function withdrawableRewards(address _account) public view virtual returns (uint256) {
        return (controller.staked(_account) *(rewardPerToken - userRewardPerTokenPaid[_account]) ) / 1e18
            + userRewards[_account];
    }
  ```

- now, someone stakes another `1000 sdl` on the secondary chain, an incoming update with a supply change of `1000` is received on the primary chain. This update changes the `effectiveBalance[ccipController]` to `2000` without a prior reward update which will keep the `userRewardPerTokenPaid` for ccipController 0. 
  ```js
     function handleIncomingUpdate(uint256 _numNewRESDLTokens, int256 _totalRESDLSupplyChange)external onlyCCIPController returns (uint256){
        uint256 mintStartIndex;
        if (_numNewRESDLTokens != 0) {
            mintStartIndex = lastLockId + 1;
            lastLockId += _numNewRESDLTokens;
        }

        if (_totalRESDLSupplyChange > 0) {
   >>        effectiveBalances[ccipController] += uint256(_totalRESDLSupplyChange);
            totalEffectiveBalance += uint256(_totalRESDLSupplyChange);
        } else if (_totalRESDLSupplyChange < 0) {
            effectiveBalances[ccipController] -= uint256(-1 * _totalRESDLSupplyChange);
            totalEffectiveBalance -= uint256(-1 * _totalRESDLSupplyChange);
        }

        emit IncomingUpdate(_numNewRESDLTokens, _totalRESDLSupplyChange, mintStartIndex);

        return mintStartIndex;
    }
  ``` 

- Consequently, when the [`RewardsInitiator`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/RewardsInitiator.sol#L41) contract calls the [`distributeRewards`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/ccip/SDLPoolCCIPControllerPrimary.sol#L56) function in [`SDLPoolCCIPControllerPrimary`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/ccip/SDLPoolCCIPControllerPrimary.sol), attempting to `withdrawRewards` from the `rewardPool` the call will perpetually fail. The rewards for the [`ccipController`](https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/ccip/SDLPoolCCIPControllerPrimary.sol) would be calculated as `2000 * (1 - 0) = 2000 rewards`, while the actual balance of the `rewardsPool` is only `1000 rewards`.
  ```js
     function distributeRewards() external onlyRewardsInitiator {
        uint256 totalRESDL = ISDLPoolPrimary(sdlPool).effectiveBalanceOf(address(this));
        address[] memory tokens = ISDLPoolPrimary(sdlPool).supportedTokens();
        uint256 numDestinations = whitelistedChains.length;

    >> ISDLPoolPrimary(sdlPool).withdrawRewards(tokens);
        // ... more code ..
    }
  ```

- notice that the increase of `1000` will never be solved . 

## POC 
- here a poc that shows , that not updating reward in incomingUpdates , will cause the distributeReward function to revert , cause of insufficient balance in the reward pool , i used the repo setup : 
```js
 import { ethers } from 'hardhat'
import {  expect } from 'chai'
import { toEther, deploy, deployUpgradeable, getAccounts, fromEther } from '../../utils/helpers'
import {
  ERC677,
  CCIPOnRampMock,
  CCIPOffRampMock,
  CCIPTokenPoolMock,
  SDLPoolPrimary,
  SDLPoolCCIPControllerPrimary,
  Router,
} from '../../../typechain-types'
import {  Signer } from 'ethers'

describe('SDLPoolCCIPControllerPrimary', () => {
  let linkToken: ERC677
  let sdlToken: ERC677
  let token1: ERC677
  let token2: ERC677
  let controller: SDLPoolCCIPControllerPrimary
  let sdlPool: SDLPoolPrimary
  let onRamp: CCIPOnRampMock
  let offRamp: CCIPOffRampMock
  let tokenPool: CCIPTokenPoolMock
  let tokenPool2: CCIPTokenPoolMock
  let router: any
  let accounts: string[]
  let signers: Signer[]

  before(async () => {
    ;({ signers, accounts } = await getAccounts())
  })

  beforeEach(async () => {
    linkToken = (await deploy('ERC677', ['Chainlink', 'LINK', 1000000000])) as ERC677 // deploy the link token ..
    sdlToken = (await deploy('ERC677', ['SDL', 'SDL', 1000000000])) as ERC677 // deploy the sdl token 
    token1 = (await deploy('ERC677', ['2', '2', 1000000000])) as ERC677
    token2 = (await deploy('ERC677', ['2', '2', 1000000000])) as ERC677

    const armProxy = await deploy('CCIPArmProxyMock')
    // router takes the wrapped native , and the armProxy address 
    router = (await deploy('Router', [accounts[0], armProxy.address])) as Router
    tokenPool = (await deploy('CCIPTokenPoolMock', [token1.address])) as CCIPTokenPoolMock // token1 pool for cross chain deposit and withdraw  
    tokenPool2 = (await deploy('CCIPTokenPoolMock', [token2.address])) as CCIPTokenPoolMock // token2 pool for crosschain deposit and withdraw . 
    onRamp = (await deploy('CCIPOnRampMock', [ // deploy the onRamp 
      [token1.address, token2.address],
      [tokenPool.address, tokenPool2.address],
      linkToken.address,
    ])) as CCIPOnRampMock
    offRamp = (await deploy('CCIPOffRampMock', [
      router.address,
      [token1.address, token2.address],
      [tokenPool.address, tokenPool2.address],
    ])) as CCIPOffRampMock

    await router.applyRampUpdates(`[77, onRamp.address]`, [], `[77, offRamp.address]`)

    let boostController = await deploy('LinearBoostController', [4 * 365 * 86400, 4])
    sdlPool = (await deployUpgradeable('SDLPoolPrimary', [
      'reSDL',
      'reSDL',
      sdlToken.address,
      boostController.address,
    ])) as SDLPoolPrimary
    controller = (await deploy('SDLPoolCCIPControllerPrimary', [
      router.address,
      linkToken.address,
      sdlToken.address,
      sdlPool.address,
      toEther(10),
    ])) as SDLPoolCCIPControllerPrimary

    await linkToken.transfer(controller.address, toEther(100))
    await sdlToken.transfer(accounts[1], toEther(200))
    await sdlPool.setCCIPController(controller.address)
    await controller.setRESDLTokenBridge(accounts[5])
    await controller.setRewardsInitiator(accounts[0])
    await controller.addWhitelistedChain(77, accounts[4], '0x11', '0x22')
  })

 

  it('poc that when there is encoming updates the rewared is wrong calculated',async () => {
      let wToken = await deploy('WrappedSDTokenMock', [token1.address])
      let rewardsPool = await deploy('RewardsPoolWSD', [
        sdlPool.address,
        token1.address,
        wToken.address,
      ])
      let wtokenPool = (await deploy('CCIPTokenPoolMock', [wToken.address])) as CCIPTokenPoolMock
      await sdlPool.addToken(token1.address, rewardsPool.address)
      await controller.approveRewardTokens([wToken.address]) // approve the wrapped token to wroter from the ccipPramiry
      await controller.setWrappedRewardToken(token1.address, wToken.address)
      await onRamp.setTokenPool(wToken.address, wtokenPool.address)
      await offRamp.setTokenPool(wToken.address, wtokenPool.address)
      //1.user stakes : 
      await sdlToken.transferAndCall(sdlPool.address,toEther(1000),ethers.utils.defaultAbiCoder.encode(['uint256', 'uint64'], [0, 0]))
      //2.distrubute rewared : 
      await token1.transferAndCall(sdlPool.address, toEther(1000), '0x')
      //3. @audit incoming updates from secondary chain with 1000 resdl in supplychange : 
      await offRamp.connect(signers[4]).executeSingleMessage(
         ethers.utils.formatBytes32String('messageId'),
        77,
        ethers.utils.defaultAbiCoder.encode(['uint256','int256'], [3,toEther(1000)]),
        controller.address,
        []
      )
      // here the error : the sum of withdrawable rewards , will be more then the availabel reward balance in rewardPool . 
      let user = await sdlPool.withdrawableRewards(accounts[0]) // get the user withdrawAble rewards : 
      let wr = await sdlPool.withdrawableRewards(controller.address) // get the ccipController withdrawable rewards : 
      let rewardsAvailable = (await rewardsPool.totalRewards()) // get the total rewared available to distribute : 
      // since not user withdrew reward nor ccipController , the total rewareds should be greater or equal the total withdrawAble rewards , but this not the case : 
      expect(fromEther((wr[0].add(user[0])))).greaterThan(fromEther(rewardsAvailable))
      // now when the staker withdraw rewards the remain rewards will be not enough for ccipController : 
      await sdlPool.withdrawRewards([token1.address]);
      // distributing rewards will revert, since there is not enough balance to cover the ccipController rewards :
      await expect(controller.distributeRewards())
      .to.be.revertedWith('');
   })
 
})
```

## Impact
Incorrect reward calculations could  prevent rightful stakers from receiving their due rewards or leave unclaimable rewards in the pool (in the case of negative supply change), thereby compromising the protocol's credibility.
## Tools Used
manual review
## recommendations : 
- Implement an `updateReward(ccipController)` call within the `handleIncomingUpdate` function to ensure rewards are recalculated whenever `effectiveBalance` changes. This will prevent miscalculations and maintain reward distribution accuracy. 
```Diff
 function handleIncomingUpdate(uint256 _numNewRESDLTokens, int256 _totalRESDLSupplyChange)
        external
++      updateRewards(ccipController)
        onlyCCIPController
        returns (uint256)
     {
        uint256 mintStartIndex;
        if (_numNewRESDLTokens != 0) {
            mintStartIndex = lastLockId + 1;
            lastLockId += _numNewRESDLTokens;
        }

        if (_totalRESDLSupplyChange > 0) {
            effectiveBalances[ccipController] += uint256(_totalRESDLSupplyChange);
            totalEffectiveBalance += uint256(_totalRESDLSupplyChange);
        } else if (_totalRESDLSupplyChange < 0) {
            effectiveBalances[ccipController] -= uint256(-1 * _totalRESDLSupplyChange);
            totalEffectiveBalance -= uint256(-1 * _totalRESDLSupplyChange);
        }

        emit IncomingUpdate(_numNewRESDLTokens, _totalRESDLSupplyChange, mintStartIndex);

        return mintStartIndex;
    }
```
