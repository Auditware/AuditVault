---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/gaming
  - sector/governance
  - sector/nft
  - sector/staking
protocol: "[[Virtuals]]"
auditors:
  - "[[YouCrossTheLineAlfie]]"
report: "https://code4rena.com/reports/2025-04-virtuals-protocol"
genome:
  - "[[proposal-manipulation]]"
  - "[[role-bypass]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# [H-05] `ValidatorRegistry::validatorScore/getPastValidatorScore` allows validator to earn full rewards without actually engaging with the protocol

- id: 61826
- impact: HIGH
- protocol: [[Virtuals]] Protocol
- reporter: YouCrossTheLineAlfie (Code4rena)
- source: https://code4rena.com/reports/2025-04-virtuals-protocol

## Summary


The ValidatorRegistry::_initValidatorScore function is causing a vulnerability where new validators are given a high base score without actually participating in the protocol. This allows them to earn full rewards without actually voting on proposals. This also creates an unfair reward distribution system that can be exploited by stakers. The recommended mitigation step is to base the validatorScore and getPastValidatorScore on actual engagement rather than an inflated base score. A proof of concept unit test has been provided to demonstrate the exploit scenario. 

## Details



The `ValidatorRegistry::_initValidatorScore` function initializes new validators with a base score equal to the total number of proposals that have ever existed, allowing validators to earn full rewards without actually participating in the protocol.

### Vulnerabilities

When a new validator is added via `addValidator()`, their base score is set to `_getMaxScore(virtualId)` which is implemented as `totalProposals(virtualId)` in AgentNftV2:
```

function _initValidatorScore(
    uint256 virtualId,
    address validator
) internal {
    _baseValidatorScore[validator][virtualId] = _getMaxScore(virtualId);
}
```

<https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/virtualPersona/ValidatorRegistry.sol# L37>

This base score is then added to the validator’s actual participation score in the `validatorScore` and `getPastValidatorScore` functions:
```

function validatorScore(
    uint256 virtualId,
    address validator
) public view virtual returns (uint256) {
    return
        _baseValidatorScore[validator][virtualId] +
        _getScoreOf(virtualId, validator);
}
```

<https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/virtualPersona/ValidatorRegistry.sol# L41>
```

    function getPastValidatorScore(
        uint256 virtualId,
        address validator,
        uint256 timepoint
    ) public view virtual returns (uint256) {
        return _baseValidatorScore[validator][virtualId] + _getPastScore(virtualId, validator, timepoint);
    }
```

<https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/virtualPersona/ValidatorRegistry.sol# L49>

In AgentRewardV2, rewards are distributed based on participation rate calculated as `(validatorRewards * nft.validatorScore(virtualId, validator)) / totalProposals`, meaning validators with artificially inflated scores receive unearned rewards.

This allows two exploit scenarios:

1. New validators can earn full rewards without ever voting on proposals:
   Without actually casting votes, a new validator is already entitled to rewards, because their score is non-zero. This is unfair to other validators who might have started voting from the beginning but missed 1 proposal. (See POC)
2. Stakers can game the system by delegating to new validators to maintain 100% reward allocation:

In addition to the first scenario above, a staker can delegate to a new validator every time to earn 100% uptime without ever having to vote.

### Impacts

* New validators can earn full rewards without ever voting on proposals.
* Stakers can game the system by delegating to new validators to maintain 100% reward allocation.
* Unfair reward distribution that penalizes validators who have actively participated since the beginning.

### Recommended mitigation steps

`validatorScore` and `getPastValidatorScore` should be based on actual engagement. For example, consider initializing them to 0 and only taking into account scores earned during their engagement.

### Proof of Concept

Unit test on exploit scenario (1). Suppose 2 proposals are created. validator 1 votes for the 1st proposal:

1. `validator2` is initialized. `validator2`’s `weight == validator1`
2. Check `validator2`’s score is 2. (100% uptime). Check `validator1`’s score is 1. 50% uptime.

See added unit test `validators get unearned score, risk of exploits` in `test/rewardsV2.js`:
```

  it.only("validators get unearned score, risk of exploits", async function () {
    this.timeout(120000); // 120 seconds
    //Test setup: 2 proposal are created. validator 1 votes for the 1st proposal.
    //1. validator2 is initialized. validator2's weight == validator1
    //2. check validator2's score is 2. (100% uptime). check validator1's score is 1. 50% uptime.

    const base = await loadFixture(deployWithAgent);
    const { agentNft, virtualToken, agent } = base;
    const { founder, contributor1, validator1, validator2 } =
      await getAccounts();

    // Setup - delegate founder's votes to validator1
    const veToken = await ethers.getContractAt("AgentVeToken", agent.veToken);
    await veToken.connect(founder).delegate(validator1.address);
    await mine(1);

    // Create first proposal and have validator1 vote on it
    const proposalId1 = await createContribution(
      1, // virtualId
      0, // coreId
      0, // parentId
      true, // isModel
      0, // no dataset dependency
      "First contribution",
      base,
      contributor1.address,
      [validator1], // Only validator1 votes on this proposal
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    );

    // Create second proposal but nobody votes on it yet
    const proposalId2 = await createContribution(
      1, // virtualId
      0, // coreId
      0, // parentId
      true, // isModel
      0, // no dataset dependency
      "Second contribution",
      base,
      contributor1.address,
      [], // No votes
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    );

// - There are 2 total proposals
    // - validator1 has voted on 1 of 2 (50% participation)
    // 1. initialize validator2 with equal weight
    // Give validator2 some tokens and stake them to get equal voting power
    await virtualToken.mint(validator2.address, parseEther("100000"));

    // Register validator2 as a new validator
    await agentNft.addValidator(1, validator2.address);

    // 2. Check validator scores
    const validator1Score = await agentNft.validatorScore(
      1,
      validator1.address
    );
    const validator2Score = await agentNft.validatorScore(
      1,
      validator2.address
    );
    const totalProposals = await agentNft.totalProposals(1);

    console.log("Total proposals:", totalProposals.toString());
    console.log("Validator1 score:", validator1Score.toString());
    console.log("Validator2 score:", validator2Score.toString());

    // Validator1 has base score + 1 vote (has actually participated)
    expect(totalProposals).to.equal(2);
    expect(validator1Score).to.equal(1); // participation (1)
    expect(validator2Score).to.equal(2); // validator2 has base score (2) with no participation

    // Calculate uptime percentages
    const validator1Uptime = (validator1Score * 100n) / totalProposals;
    const validator2Uptime = (validator2Score * 100n) / totalProposals;

    console.log("Validator1 uptime percentage:", validator1Uptime, "%");
    console.log("Validator2 uptime percentage:", validator2Uptime, "%");

    // We expect validator2's uptime percentage to be 100% despite not voting on any proposals
    expect(validator2Uptime).to.equal(100);
  });
```

Test results:
```

  RewardsV2
Total proposals: 2
Validator1 score: 1
Validator2 score: 2
Validator1 uptime percentage: 50n %
Validator2 uptime percentage: 100n %
    ✔ validators get unearned score, risk of exploits (1547ms)

1 passing (2s)
```

**Virtuals marked as informative**

---
