---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/staking
  - sector/farm
  - platform/sherlock
protocol: "[[Burve]]"
auditors:
  - future
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-4: Incorrect tax distribution when adding value single-sided

- id: 56953
- impact: HIGH
- protocol: Burve
- reporter: future (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with incorrect tax distribution when adding value single-sided to a closure. The bug was found by a group of individuals and is caused by the update of `valueStaked` before the distribution of tax earnings. This results in the new LP diluting the share of earnings meant for existing LPs, leading to unfair reward allocation. The bug can happen naturally when users add liquidity single-sided to any closure and has a high impact as it causes uneven distribution of fees and disincentivizes LPs from staking their value. A proof of concept is provided and the protocol team has fixed the issue in their code. 

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/196 

## Found by 
0xNov1ce, Drynooo, bladeee, future, mstpr-brainbot

### Summary

When value is added single-sided to a closure, the LP is required to pay a fee (tax) to the existing LPs. However, the amount is not distributed correctly because valueStaked is updated before the tax is distributed. This causes the new LP to dilute the share of earnings intended for prior participants, leading to unfair reward allocation.


### Root Cause

Let's assume a single-sided value is added to a closure. In this case, the `Closure::addValueSingle()` function will be called. This function calculates the `tax` to be paid by the LP and also updates `self.valueStaked`:  
https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/closure/Closure.sol#L208-L209

Afterward, `Closure::addEarnings()` is invoked to distribute the tax earnings to LPs:  
https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/facets/ValueFacet.sol#L132

However, as shown below, the `bgtPerBgtValueX128` and `earningsPerValueX128` values are computed *after* `self.valueStaked` and `self.bgtValueStaked` have been updated by `addValueSingle()`. This means that the new staker is already included in the staked value when earnings are calculated.

As a result, the earnings meant to be distributed to *existing* LPs are significantly diluted, since the new staker (who just paid the tax) also inflates the denominator used in the reward distribution.

```solidity
self.earningsPerValueX128[idx] +=
    (reserveShares << 128) /
    (self.valueStaked - self.bgtValueStaked);
```

This means the protocol is effectively distributing rewards using a denominator that includes the new LP, which reduces the share of existing LPs and undermines fair tax distribution.

Full function here:  
https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/closure/Closure.sol#L662-L703

### Internal Pre-conditions

None needed

### External Pre-conditions

None needed

### Attack Path

Happens naturally when users add liquidity single sided to any closure

### Impact

Uneven distribution of fees. Strong disincentive for LP'ers to stake their value. Also, the excess fee is stuck in the contract. Hence, high.

### PoC

**Textual PoC:**

Assume the pool has some initial value (mandatory in deployment) and Alice as the only value provider (LP).
Bob comes, and deposits single sided liquidity which will incur fees. This fee should be ideally distributed to the LP'ers which in our case its only Alice. However, the fee is not distributed to Alice. Instead, Alice will only get a small portion of the fees due to wrong calculations.


**Coded PoC:**
In order for this PoC to win add this event to `addValueSingle` in Closure.sol and emit the tax so that we can see what the tax is.
```solidity
event Tapir(uint256 tax);
function addValueSingle(
        address recipient,
        uint16 _closureId,
        uint128 value,
        uint128 bgtValue,
        address token,
        uint128 maxRequired
    ) external nonReentrant returns (uint256 requiredBalance) {
        //..
        emit Tapir(realTax);
    }
```
```solidity
// forge test --match-contract ValueFacetTest --match-test test_tapir -vv
    function test_tapir() public {

        (, , , uint256 valueStaked, ) = simplexFacet.getClosureValue(0x9);
        console.log("valueStaked", valueStaked); // initial valueStaked
        uint256 oneX128 = 1 << 128;
        vm.prank(owner);
        simplexFacet.setClosureFees(0x9, uint128(oneX128 / 100), 0); // One basis point. Realistic.

        uint128 value = 1e20;
        valueFacet.addValue(alice, 0x9, value, 0);
        uint256[MAX_TOKENS] memory earnings;
        (, , earnings, ) = valueFacet.queryValue(alice, 0x9);
        console.log("earnings[0]", earnings[0]); // expect to be 0
        assertEq(earnings[0], 0);

        // there will be fees which should be distributed to the other LP's.
        address tapir = address(69);
        vm.recordLogs();

        // single value add, fee should be distributed to Alice and the initial value staked.
        valueFacet.addValueSingle(
            tapir,
            0x9,
            value * 5,
            0,
            tokens[0],
            0
        );

        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 tapirEventSig = keccak256("Tapir(uint256)");

        uint256 tax = 0;
        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].topics[0] == tapirEventSig) {
                tax = abi.decode(entries[i].data, (uint256));
                console.log("Tax emitted:", tax);
                break;
            }
        }

        (, , earnings, ) = valueFacet.queryValue(alice, 0x9);
        console.log("earnings[0] after", earnings[0]);  // should be almost the entire tax above (minus the share of first dead shares)
        (, , earnings, ) = valueFacet.queryValue(tapir, 0x9);
        console.log("earnings[0]", earnings[0]); // should be 0

        uint256[MAX_TOKENS] memory collectedBalances;
        uint256 collectedBgt;
        vm.prank(Alice);
        (collectedBalances, collectedBgt) = valueFacet.collectEarnings(alice, 0x9);
        console.log("collectedBalances[0]", collectedBalances[0]);
    }
```

### Mitigation

add the tax according to previous `valueStaked`

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/pull/76
