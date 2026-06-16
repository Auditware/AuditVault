---
tags:
  - lang/solidity
  - platform/0x52
  - has/github
  - severity/high
  - sector/lending
  - sector/prediction
  - sector/vault
protocol: "[[Ubet]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-12-18-Ubet.md"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-01] MarketMaker.sol is vulnerable to inflation attacks

- id: 55653
- impact: HIGH
- protocol: [[Ubet]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-12-18-Ubet.md

## Summary


The bug report discusses an issue in the FundingMath.sol code, specifically in line 35. The function used to calculate the number of shares to mint when adding liquidity can be manipulated by a malicious user to inflate the pool value and profit from it. The recommended solution is to use a virtual offset to defend against this type of attack. This has been implemented in the code with a virtual offset of 10,000, making it much harder for an attacker to exploit the vulnerability. 

## Details

**Details**

[FundingMath.sol#L21-L37](https://github.com/SportsFI-UBet/ubet-contracts-v1/blob/2766b47bed2cf027e29053af2afc4d35256747a5/contracts/funding/FundingMath.sol#L21-L37)

     function calcFunding(uint256 collateralAdded, uint256 totalShares, uint256 poolValue)
        internal
        pure
        returns (uint256 sharesMinted)
    {
        if (totalShares == 0) {
            // funding when LP pool is empty
            sharesMinted = collateralAdded;
        } else {
            // mint LP tokens proportional to how much value the new investment
            // brings to the pool


            // Something is very wrong if poolValue has gone to zero
            if (poolValue == 0) revert FundingErrors.PoolValueZero();
            sharesMinted = (collateralAdded * totalShares).ceilDiv(poolValue); <- @audit always rounds up
        }
    }

When adding liquidity the above lines are used to determine the number of shares to mint to the depositor. The use of ceilDiv in the sharesMinted calculation means that a user is guaranteed to receive at least 1 share when depositing. This allows the vault to become vulnerable to inflation attacks.

To execute this a malicious user would do as follows:

1. Deposit a single wei of liquidity
2. Donate a large amount of collateral to inflate poolValue
3. Buy a large number of a single outcome token to pull a large amount of funding from the MarketFundingPool
4. Make a large number of 1 wei deposits.
5. Each deposit mints 1 share which dilutes the liquidity share of MarketMakerFunding
6. After pool has closed withdraw all shares for a large profit.

**Lines of Code**

[FundingMath.sol#L35](https://github.com/SportsFI-UBet/ubet-contracts-v1/blob/2766b47bed2cf027e29053af2afc4d35256747a5/contracts/funding/FundingMath.sol#L35)

**Recommendation**

There are quite a few different ways to approach the solution. OZ recommends using a [virtual offset](https://docs.openzeppelin.com/contracts/4.x/erc4626#defending_with_a_virtual_offset).

**Remediation**

Mitigated [here](https://github.com/SportsFI-UBet/ubet-contracts-v1/pull/72). A virtual offset of 10,000 has been added to the pool. This makes the capital requirements significantly higher as well as the number of transactions to exploit this.
