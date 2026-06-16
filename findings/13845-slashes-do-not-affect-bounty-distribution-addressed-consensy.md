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
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[vote-delegation-loop]]"
---
# Slashes do not affect bounty distribution ✓ Addressed

- id: 13845
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


This bug report is about a problem in the DelegationController.sol contract of the skale-manager project. When slashes are processed, only the `_delegatedByHolderToValidator` and `_delegatedByHolder` values are reduced. The `_effectiveDelegatedByHolderToValidator` value remains the same, which is used to distribute bounties amongst delegators. As a result, the slashing does not affect the distribution. The code snippet in the report shows the code responsible for this bug.

The recommendation to fix the bug is to reduce the `_effectiveDelegatedByHolderToValidator` and `_effectiveDelegatedToValidator` values when slashes are processed. The bug was mitigated in skale-manager pull request #118.

## Details

#### Resolution



Mitigated in [skalenetwork/skale-manager#118](https://github.com/skalenetwork/skale-manager/pull/118)


#### Description


When slashes are processed by a holder, only `_delegatedByHolderToValidator` and `_delegatedByHolder` values are reduced. But `_effectiveDelegatedByHolderToValidator` value remains the same. This value is used to distribute bounties amongst delegators. So slashing will not affect that distribution.


**contracts/delegation/DelegationController.sol:L863-L873**



```
uint oldValue = getAndUpdateDelegatedByHolderToValidator(holder, validatorId);
if (oldValue > 0) {
    uint month = \_slashes[index].month;
    reduce(
        \_delegatedByHolderToValidator[holder][validatorId],
        \_delegatedByHolder[holder],
        \_slashes[index].reducingCoefficient,
        month);
    slashingSignals[index.sub(begin)].holder = holder;
    slashingSignals[index.sub(begin)].penalty = oldValue.sub(getAndUpdateDelegatedByHolderToValidator(holder, validatorId));
}

```
#### Recommendation


Reduce `_effectiveDelegatedByHolderToValidator` and `_effectiveDelegatedToValidator` when slashes are processed.
