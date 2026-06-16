---
tags:
  - lang/solidity
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Folks Finance]]"
auditors:
  - "[[kankodu]]"
report: "https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Folks%20Finance/Boost%20_%20Folks%20Finance%2033311%20-%20%5BSmart%20Contract%20-%20Critical%5D%20Infinite%20Interest%20rate%20bug.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Infinite Interest rate bug

- id: 61019
- impact: HIGH
- protocol: [[Folks Finance]]
- reporter: kankodu (Immunefi)
- source: https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Folks%20Finance/Boost%20_%20Folks%20Finance%2033311%20-%20%5BSmart%20Contract%20-%20Critical%5D%20Infinite%20Interest%20rate%20bug.md

## Summary


This is a report about a bug found in a smart contract on the SnowTrace testnet. The bug can cause the protocol to become insolvent and allow for direct theft of user funds. The bug is caused by the utilization equation used, which can result in extremely high interest rates. An attacker can exploit this by depositing a small amount of a new token and then borrowing a large amount against it, resulting in an interest rate of 4 trillion percent per second. This bug can lead to direct theft of user funds and protocol insolvency. A proof of concept has been provided to demonstrate the bug. 

## Details




Report type: Smart Contract


Target: https://testnet.snowtrace.io/address/0x96e957bF63B5361C5A2F45C97C46B8090f2745C2

Impacts:

* Protocol insolvency
* Direct theft of any user funds, whether at-rest or in-motion, other than unclaimed yield

## Description

## Brief/Intro

Here's the equation for utilisation that is being used currently `U=TotalVariableBorrowAmount+TotalStableBorrowAmountTotalDeposits/TotalDeposits`

When totalDeposits is lower than the totalBorrowed amount, the utilization can be much greater than 100%, which in turn makes borrowRates and depositRates very high.

## Vulnerability Details

* When a new token with CF > 0 is added, the attacker deposits 1e5 wei of its token, making TotalDeposits = 1e5.
* Let's say the decimals for this newly added token are 1e18. The attacker then donates 1e18 wei of tokens directly to the HubPool and borrows.
  * This is allowed as there is no check for it in the borrow method. It makes the totalBorrows = 1e18.
  * Utilization is 1e13 in this case, which makes the interest rate \~4e31. This translates to 4 trillion percent per second.
* After just a block, the attacker's original 1e5 deposits would have turned into a very large amount (in billions) due to the interest rate being an outrageous trillion percent per second.
* The attacker goes ahead and borrows all the tokens against this deposit as CF for this token is non-zero.

## Impact Details

* Direct theft of any user funds, whether at-rest or in-motion, other than unclaimed yield
* Protocol insolvency

## References

* https://medium.com/certora/silo-finance-post-mortem-3b690fffeb08

## Proof of concept

## Proof of Concept

Add below testcase in `test/hub/HubPool.test.ts` that shows the the interest rate is a very large amount when totalDeposits is way smaller than the totalBorrowedAmount

```
  it.only("infinite interest rate", async () => {
      const { loanManager, hubPool } = await loadFixture(deployHubPoolFixture);

      // set pool data with deposit total amount
      const depositTotalAmount = BigInt(1e5);
      const poolData = getInitialPoolData();
      poolData.depositData.totalAmount = depositTotalAmount;
      await hubPool.setPoolData(poolData);

      // update pool with borrow
      const amount = BigInt(1e18);
      const isStable = false;
      const updatePoolWithBorrow = await hubPool.connect(loanManager).updatePoolWithBorrow(amount, isStable);
      expect((await hubPool.getVariableBorrowData())[3]).to.equal(poolData.variableBorrowData.totalAmount + amount);
      await expect(updatePoolWithBorrow).to.emit(hubPool, "InterestRatesUpdated");

      expect((await hubPool.getVariableBorrowData())[4]).to.be.greaterThan(BigInt(1e31))
    });
```
