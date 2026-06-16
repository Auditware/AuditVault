---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/farm
  - sector/lending
  - sector/staking-pool
protocol: "[[ZeroLend]]"
auditors:
  - "[[shaka]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# zlrewardscontroller contract is incompatible with [[ZeroLend]] 's own reward bearing tokens 

- id: 40817
- impact: HIGH
- protocol: ZeroLend
- reporter: shaka (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf

## Summary


The ZLRewardsController contract is responsible for managing rewards in the ZeroLend protocol. However, there is a bug in the contract that makes it incompatible with the protocol itself. This is because the contract is implemented differently from the core protocol, specifically in the way it handles reward bearing tokens. This can cause issues for users trying to earn rewards through these tokens. The bug can be fixed by updating the hook in the ZLRewardsController contract. 

## Details

## ZLRewardsController Analysis

## Context
ZLRewardsController.sol#L510

## Description
The `ZLRewardsController` contract is responsible for managing rewards. The owner can configure this contract by:

- Adding reward bearing tokens
- Deciding allocation points for each token
- Depositing rewards

Users can earn rewards by holding these reward bearing tokens and claim their rewards. The main logic of reward tracking is based on the `MasterChef` contract. User information regarding how much reward per token is accumulated and the reward debt is tracked in this contract. Based on this logic, every action that changes user balance (e.g., transfer, mint, or burn) should invoke a hook, and the user info should be updated. This way, users will always receive a fair share of total rewards based on their balances. 

### Hook Usage
The hook in the `ZLRewardsController` contract is the `_handleActionAfterForToken` function, which is called in the `handleActionAfter` function.

```solidity
function handleActionAfter( //@audit Reward bearing tokens should call this function.
    address _user,
    uint256 _balance,
    uint256 _totalSupply
) external {
    if (!validRTokens[msg.sender] && msg.sender != address(streamedVesting))
        revert NotRTokenOrMfd();
        
    if (_user == address(streamedVesting)) return;
    
    _handleActionAfterForToken(msg.sender, _user, _balance, _totalSupply);
}
```

This section serves as an introduction to the logic. Now, let’s check why this contract is not compatible with the protocol itself.

## Compatibility Analysis
As we can see at `ZLRewardsController.sol#L17`, the `ZLRewardsController` contract is based on Radiant Capital's `ChefIncentivesController.sol` contract. You can see the `handleActionAfter` function in Radiant Capital's repository at `ChefIncentivesController.sol#L611-L632`.

Both Radiant Capital and ZeroLend's core protocol contracts are forks from Aave. However, it seems that Radiant Capital has changed their token implementations. They changed the regular `handleAction` hook from Aave to `handleActionAfter`.

### Radiant Capital's Token Implementation
Check out Radiant Capital's token implementation. Their `_transfer` function looks like this:

```solidity
// skipped for brevity
if (address(_getIncentivesController()) != address(0)) {
    uint256 currentTotalSupply = _totalSupply;
    _getIncentivesController().handleActionAfter(sender, _balances[sender], currentTotalSupply);
    
    if (sender != recipient) {
        _getIncentivesController().handleActionAfter(recipient, _balances[recipient], currentTotalSupply);
    }
}
```

Their reward bearing tokens call their incentives controller contract's `handleActionAfter` hook after every balance-changing action, which is exactly how it should be done.

### ZeroLend's Token Implementation
Now, for ZeroLend, let’s check the core contract's token implementation. Here you can also see the deployed versions in Zksync Era. ZeroLend's token implementation is also forked from Aave; however, unlike Radiant Capital, the hook is unchanged. The `_transfer` function of ZeroLend's token implementation calls `handleAction`:

```solidity
function _transfer(address sender, address recipient, uint128 amount) internal virtual {
// skipped for brevity
    IAaveIncentivesController incentivesControllerLocal = _incentivesController;
    if (address(incentivesControllerLocal) != address(0)) {
        uint256 currentTotalSupply = _totalSupply;
        incentivesControllerLocal.handleAction(sender, currentTotalSupply, oldSenderBalance);
        
        if (sender != recipient) {
            incentivesControllerLocal.handleAction(recipient, currentTotalSupply, oldRecipientBalance);
        }
    }
}
```

ZeroLend's reward bearing tokens will call the `handleAction` function, but the `ZLRewardsController` contract does not have that function; it has `handleActionAfter`.

## Conclusion
In conclusion, ZeroLend's token implementation and Radiant Capital's token implementations are different, but `ZLRewardsController` is directly implemented from Radiant Capital. Consequently, the contract will not function with the core protocol itself.

**Note:** All of these implementation contracts of Radiant Capital and ZeroLend can also be confirmed with Etherscan and Zksync explorer.

Furthermore, I provided only "AToken" implementations of ZeroLend in this submission with the assumption that those tokens will be reward bearing tokens. However, I want to point out that other tokens in this protocol, such as "ZeroToken" or "VestedToken," do not invoke `handleActionAfter` at all.

## Recommendation
I would recommend updating the hook in the `ZLRewardsController` contract.
