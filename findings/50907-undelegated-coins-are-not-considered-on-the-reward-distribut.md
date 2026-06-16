---
tags:
  - lang/solidity
  - sector/staking
  - platform/halborn
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[CoreDAO]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/coredao/genesis-smart-contract-security-assessment"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# UNDELEGATED COINS ARE NOT CONSIDERED ON THE REWARD DISTRIBUTION

- id: 50907
- impact: HIGH
- protocol: Genesis
- reporter: Halborn
- source: https://www.halborn.com/audits/coredao/genesis-smart-contract-security-assessment

## Summary


This bug report discusses an issue with the **distributePowerReward** function in the **PledgeAgent.sol** contract. The function is used to distribute delegated hash power rewards to a candidate validator, but it does not take into account undelegated coin rewards. This means that the calculations for reward distribution may be inaccurate or incomplete, which could cause problems for miners. To fix this issue, the contract needs to be updated to include undelegated coin rewards in the calculations. The code location for this function is provided and a test case is included to demonstrate the problem. The impact and likelihood of this issue are rated as 5 and 3 respectively. However, the issue has been solved by the CoreDAO team in a recent commit.

## Details

##### Description

The **distributePowerReward** function is used to distribute delegated hash power rewards to the candidate validator. The method is designed to be called at the beginning of the `turn round` workflow. One potential issue with the contract is that undelegated coin rewards are not considered. This can lead to inaccurate or incomplete calculations and potentially cause issues with rewards distribution. In order to address this issue, the contract should be updated to consider **undelegated** coin rewards and incorporate them into the calculations for reward distribution. This will help ensure the accuracy and reliability of the reward distribution process and can help prevent potential issues or errors. With the workflow, remaining rewards directly compared to the miner's total rewards.

Code Location
-------
---
---

[/contracts/PledgeAgent.sol#L204](https://github.com/coredao-org/core-genesis-contract/blob/eac9eb44b762fd64511d5e88f82b926da26bb7fd/contracts/PledgeAgent.sol#L204)

#### PledgeAgent.sol

```
  function distributePowerReward(address candidate, address[] calldata miners) external override onlyCandidate {
    // if no hash power is delegated in the round, return
    RoundState storage rs = stateMap[roundTag];
    if (rs.power == 1) {
      return;
    }
    // distribute rewards to every miner
    // note that the miners are represented in the form of reward addresses
    // and they can be duplicated because everytime a miner delegates a BTC block
    // to a validator on Core blockchain, a new record is added in BTCLightClient
    Agent storage a = agentsMap[candidate];
    uint256 l = a.rewardSet.length;
    if (l == 0) {
      return;
    }
    Reward storage r = a.rewardSet[l-1];
    if (r.totalReward == 0 || r.round != roundTag) {
      return;
    }
    uint256 reward = rs.coin * POWER_BLOCK_FACTOR * rs.powerFactor / 10000 * r.totalReward / r.score;
    uint256 minerSize = miners.length;

    uint256 totalReward = reward * minerSize;
    uint256 remainReward = r.remainReward;
    require(remainReward >= totalReward, "there is not enough reward");

    for (uint256 i = 0; i < minerSize; i++) {
      rewardMap[miners[i]] += reward;
    }

    if (r.coin == 0) {
      delete a.rewardSet[l-1];
      if (minerSize == 0) {
        payable(FOUNDATION_ADDR).transfer(remainReward);
      } else {
        uint256 dust = remainReward - totalReward;
        if (dust != 0) {
          rewardMap[miners[0]] += dust;
        }
      }
    } else if (totalReward != 0) {
      r.remainReward -= totalReward;
    }
  }


```

```
    def test_delegate2validator(self, pledge_agent, candidate_hub, validator_set):
        operator = accounts[1]
        consensus_address = register_candidate(operator=operator)
        candidate_hub.turnRound()
        assert validator_set.isValidator(consensus_address)
        tx = pledge_agent.delegateCoin(operator, {"value": MIN_INIT_DELEGATE_VALUE})
        expect_event(tx, "delegatedCoin", {
            "agent": operator,
            "delegator": accounts[0],
            "amount": MIN_INIT_DELEGATE_VALUE,
            "totalAmount": MIN_INIT_DELEGATE_VALUE
        })

```

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

**SOLVED**: The `CoreDAO team` solved the issue in this commit [d2dfe11](https://github.com/coredao-org/core-genesis-contract/commit/d2dfe1155f0ef462bf1598331afd1ffbe4d5341a) by changing the flow in the **distributePowerReward** function.
