---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Skale Token]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2020/01/skale-token/"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Gas limit for bounty and slashing distribution ✓ Addressed

- id: 13829
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


This bug report describes an issue with the codebase of the Skale Manager project, which involves a loop over all active delegators. This loop is used to distribute the bounty payment to all delegators and also to process the slashing of validators. The issue is that the number of active delegators that can be processed before hitting the gas limit is limited and not big enough. To solve the issue, a major code change is recommended. This would involve storing all the necessary values, such as the total delegated amounts per validator during each bounty payment and the history of all delegations with durations of their active state. This would allow delegators to calculate the bounty on withdrawal, instead of having to process it all in one call.

## Details

#### Resolution



Issue is fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92)


#### Description


After every bounty payment (should be once per month) to a validator, the bounty is distributed to all delegators. In order to do that, there is a `for` loop that iterates over all active delegators and sends their bounty to `SkaleBalances` contract:


**code/contracts/delegation/DelegationService.sol:L310-L316**



```
for (uint i = 0; i < shares.length; ++i) {
    skaleToken.send(address(skaleBalances), shares[i].amount, abi.encode(shares[i].holder));

    uint created = delegationController.getDelegation(shares[i].delegationId).created;
    uint delegationStarted = timeHelpers.getNextMonthStartFromDate(created);
    skaleBalances.lockBounty(shares[i].holder, timeHelpers.addMonths(delegationStarted, 3));
}

```
There are also few more loops over all the active delegators. This leads to a huge gas cost of distribution mechanism. A number of active delegators that can be processed before hitting the gas limit is limited and not big enough.


The same issue is with slashing:


**code/contracts/delegation/DelegationService.sol:L95-L106**



```
function slash(uint validatorId, uint amount) external allow("SkaleDKG") {
    ValidatorService validatorService = ValidatorService(contractManager.getContract("ValidatorService"));
    require(validatorService.validatorExists(validatorId), "Validator does not exist");

    Distributor distributor = Distributor(contractManager.getContract("Distributor"));
    TokenState tokenState = TokenState(contractManager.getContract("TokenState"));

    Distributor.Share[] memory shares = distributor.distributePenalties(validatorId, amount);
    for (uint i = 0; i < shares.length; ++i) {
        tokenState.slash(shares[i].delegationId, shares[i].amount);
    }
}

```
#### Recommendation


The best solution would require major changes to the codebase, but would eventually make it simpler and safer. Instead of distributing and centrally calculating bounty for each delegator during one call it’s better to just store all the necessary values, so delegator would be able to calculate the bounty on withdrawal. Amongst the necessary values, there should be history of total delegated amounts per validator during each bounty payment and history of all delegations with durations of their active state.
