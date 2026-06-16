---
tags:
  - lang/solidity
  - sector/gaming
  - sector/oracle
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/griefing
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[chainlink-round-completeness]]"
  - "[[dos-resistance]]"
  - "[[weak-randomness]]"
---
# [H-01] Funds in subscription may be drained

- id: 62538
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


The bug report is about a problem in the SpinLottery game where users can participate in a spin activity to win a prize card. The issue is that some malicious users can exploit the system and consume all the balance in the subscription account by triggering multiple spins. This is possible because the cost for each spin is calculated using a formula that can be manipulated by increasing the value of a variable. The report recommends adding a minimum spin cost to prevent this exploitation.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description
In SpinLottery, users can participate in the spin activity to win one prize card. Users can choose their win possibility. If users choose one higher win possibility, users have to pay one higher payment for this spin.

When users trigger one spin, we will request one randomness from Chainlink VRF. In RIP, we choose the Subscription mode. Chainlink VRF will charge the related fees from our subscription balance. Each time, we trigger one spin, Chainlink VRF will charge the related fees from our subscription balance.

According to Chainlink VRF billing [formula](https://docs.chain.link/vrf/v2-5/billing), the fee for one random is `gasPrice * (callback gas used + Verification gas used) * ((100 + premium percentage)/100)`.

The problem here is that some malicious users can start one grief attack. The hacker can repeat triggering `spin` to consume our subscription balance. In a normal scenario, one spin's cost should be `gas used + spin cost`. However, the hacker can increase the `_totalSlots` to one very huge value to let the spit cost round down to 0. The only cost for this attack vector is the `gas used`. 

This will cause Chainlink VRF will consume all balance in our subscription account.
```solidity
    function spin(uint256 _totalSlots, uint256 _prizeCount) external whenNotPaused returns (uint256) {
        uint256 spinCost = calculateSpinCost(_totalSlots, _prizeCount);
        
        // Process payment
        if (!usdcToken.transferFrom(msg.sender, address(this), spinCost)) {
            revert USDCTransferFailed();
        }
        uint256 requestId = requestRandomness();
        spinRequests[requestId] = SpinRequest({
            player: msg.sender, 
            totalSlots: _totalSlots, 
            prizeCount: _prizeCount
        });
    }
    function calculateSpinCost(uint256 _totalSlots, uint256 _prizeCount) public view returns (uint256) {
        return (avgBasePrice * _prizeCount * 1000) / (_totalSlots * 1000);
    }
```

## Recommendations

Add one minimum spin cost.
