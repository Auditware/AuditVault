---
tags:
  - lang/solidity
  - sector/governance
  - sector/infra
  - sector/lending
  - sector/liquid-staking
  - sector/staking
  - platform/consensys
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Rocket Pool Atlas (V1.2)]]"
auditors:
  - "[[Dominik Muhs]]"
report: "https://consensys.net/diligence/audits/2023/01/rocket-pool-atlas-v1.2/"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Multiple checks-effects violations

- id: 13206
- impact: HIGH
- protocol: Rocket Pool Atlas (v1.2)
- reporter: Dominik Muhs (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/01/rocket-pool-atlas-v1.2/

## Summary


This bug report is about a dangerous pattern used throughout the codebase of Rocket Pool system, which may eventually lead to exploitable scenarios if continued to be followed. This pattern is related to violations of the checks-effects-interactions pattern, where the contract state is updated after an external call. This can be exploited by malicious contracts, which can impact the overall accounting and, thus, system funds. 

The report provides several examples of this pattern, such as `distributeToOwner()` sending the contract’s balance to the node or the withdrawal address before clearing the internal accounting, the withdrawal block being set before any other contracts are called, the `slashed` state being set before any external calls are made, and the counter for reward snapshot execution being incremented before RPL gets minted.

The report recommends following the checks-effects-interactions pattern and adjusting any contract state variables before making external calls. It also suggests strictly adhering to this practice when all external calls are being made to trusted network contracts.

## Details

#### Resolution



The client provided the following statement:



> 
> In many of the cited examples, the “external call” is a call to another network contract that has the same privileges as the caller. Preventing reentrancy against our own internal contracts provides no additional security. If a malicious contract is introduced via a malicious oDAO they already have full keys to the kingdom.
> 
> 
> 



> 
> None of the examples provide an attack surface and so we don’t believe this to be a ‘major’ finding and should be downgraded.
> 
> 
> 


This finding highlights our concerns about a dangerous pattern used throughout the codebase that may eventually lead to exploitable scenarios if continued to be followed, especially on codebases that do not employ protective measures against reentrant calls. This report also flagged one such exploitable instance, leading to a critical exploitable issue in one of the components.


This repeated occurrence led us to flag this as a major issue to highlight a general error and attack surface present in several places.


From our experience, there are predominantly positive side-effects of adhering to safe coding patterns, even for trusted contract interactions, as developers indirectly follow or pick up the coding style from existing code, reducing the likelihood of following a pattern that may be prone to be taken advantage of.


For example, to a developer, it might not always be directly evident that control flow is passed to potentially untrusted components/addresses from the code itself, especially when calling multiple ‘trusted’ components in the system. Furthermore, individual components down the call stack may be updated at later times, introducing an untrusted external call (i.e., because funds are refunded) and exposing the initially calling contract to a reentrancy-type issue. Therefore, we highly recommend adhering to a safe checks-effects pattern even though the contracts mainly interact with other trusted components and build secure code based on defense-in-depth principles to contain potential damage in favor of assuming worst-case scenarios.




#### Description


Throughout the system, there are various violations of the checks-effects-interactions pattern where the contract state is updated after an external call. Since large parts of the Rocket Pool system’s smart contracts are not guarded against reentrancy, the external call’s recipient may reenter and potentially perform malicious actions that can impact the overall accounting and, thus, system funds.


#### Examples


`distributeToOwner()` sends the contract’s balance to the node or the withdrawal address **before** clearing the internal accounting:


**code/contracts/contract/minipool/RocketMinipoolDelegate.sol:L564-L581**



```
/// @notice Withdraw node balances from the minipool and close it. Only accepts calls from the owner
function close() override external onlyMinipoolOwner(msg.sender) onlyInitialised {
    // Check current status
    require(status == MinipoolStatus.Dissolved, "The minipool can only be closed while dissolved");
    // Distribute funds to owner
    distributeToOwner();
    // Destroy minipool
    RocketMinipoolManagerInterface rocketMinipoolManager = RocketMinipoolManagerInterface(getContractAddress("rocketMinipoolManager"));
    require(rocketMinipoolManager.getMinipoolExists(address(this)), "Minipool already closed");
    rocketMinipoolManager.destroyMinipool();
    // Clear state
    nodeDepositBalance = 0;
    nodeRefundBalance = 0;
    userDepositBalance = 0;
    userDepositBalanceLegacy = 0;
    userDepositAssignedTime = 0;
}


```
The withdrawal block should be set before any other contracts are called:


**code/contracts/contract/minipool/RocketMinipoolDelegate.sol:L498-L499**



```
// Save block to prevent multiple withdrawals within a few blocks
withdrawalBlock = block.number;

```
The `slashed` state should be set before any external calls are made:


**code/contracts/contract/minipool/RocketMinipoolDelegate.sol:L686-L696**



```
/// @dev Slash node operator's RPL balance based on nodeSlashBalance
function \_slash() private {
    // Get contracts
    RocketNodeStakingInterface rocketNodeStaking = RocketNodeStakingInterface(getContractAddress("rocketNodeStaking"));
    // Slash required amount and reset storage value
    uint256 slashAmount = nodeSlashBalance;
    nodeSlashBalance = 0;
    rocketNodeStaking.slashRPL(nodeAddress, slashAmount);
    // Record slashing
    slashed = true;
}

```
In the bond reducer, the accounting values should be cleared before any external calls are made:


**code/contracts/contract/minipool/RocketMinipoolBondReducer.sol:L120-L134**



```
// Get desired to amount
uint256 newBondAmount = getUint(keccak256(abi.encodePacked("minipool.bond.reduction.value", msg.sender)));
require(rocketNodeDeposit.isValidDepositAmount(newBondAmount), "Invalid bond amount");
// Calculate difference
uint256 existingBondAmount = minipool.getNodeDepositBalance();
uint256 delta = existingBondAmount.sub(newBondAmount);
// Get node address
address nodeAddress = minipool.getNodeAddress();
// Increase ETH matched or revert if exceeds limit based on current RPL stake
rocketNodeDeposit.increaseEthMatched(nodeAddress, delta);
// Increase node operator's deposit credit
rocketNodeDeposit.increaseDepositCreditBalance(nodeAddress, delta);
// Clean up state
deleteUint(keccak256(abi.encodePacked("minipool.bond.reduction.time", msg.sender)));
deleteUint(keccak256(abi.encodePacked("minipool.bond.reduction.value", msg.sender)));

```
The counter for reward snapshot execution should be incremented before RPL gets minted:


**code/contracts/contract/rewards/RocketRewardsPool.sol:L210-L213**



```
// Execute inflation if required
rplContract.inflationMintTokens();
// Increment the reward index and update the claim interval timestamp
incrementRewardIndex();

```
#### Recommendation


We recommend following the checks-effects-interactions pattern and adjusting any contract state variables before making external calls. With the upgradeable nature of the system, we also recommend strictly adhering to this practice when all external calls are being made to trusted network contracts.
