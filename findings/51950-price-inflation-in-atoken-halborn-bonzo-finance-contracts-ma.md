---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/halborn
  - has/github
  - severity/high
  - trigger/first-deposit
  - precondition/uninitialized
protocol: "[[Bonzo Finance]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/bonzo/finance-contracts"
genome:
  - "[[rounding-direction]]"
  - "[[first-deposit]]"
  - "[[data/uninitialized]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# Price Inflation in AToken

- id: 51950
- impact: HIGH
- protocol: Finance Contracts
- reporter: Halborn
- source: https://www.halborn.com/audits/bonzo/finance-contracts

## Summary


The AToken contract, used in the Aave v2 deployment scripts, is vulnerable to price inflation due to issues with the way it handles initial balances and rounding in the mint and burn functions. This can be exploited to extract profit, especially when the initial pool balance is not properly initialized. To prevent this, it is recommended to initialize the pool with a small balance and ensure that the number of shares minted is non-zero. Creating a periphery contract that handles initialization and first deposit in a single transaction can also help reduce the risk of price inflation and associated exploits. These changes have already been implemented with the addition of the `LendingPoolPeriphery` contract.

## Details

##### Description

The AToken contract is susceptible to price inflation due to liquidity index manipulation and rounding issues in the mint and burn functions. This vulnerability can be exploited to extract profit, particularly in scenarios where the initial pool balance is not properly initialized. While Aave v2 deployment scripts typically initialize the pool with an initial balance to prevent the First Deposit Bug, this is not always guaranteed. Similar issues have been observed in other protocols, such as Compound and Radiant Lending Pool.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:H/A:N/D:N/Y:H/R:N/S:U (9.4)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:H/A:N/D:N/Y:H/R:N/S:U)

##### Recommendation

1. **Initialize Pool with Initial Balance**:

Ensure that the pool is initialized with a small balance to prevent the First Deposit Bug. This can be achieved by minting a small number of tokens to an unused address (e.g., the zero address).

**Reference**:

- [Compound Initial Mint Fix](https://github.com/akshaysrivastav/first-deposit-bug-compv2)

- [Uniswap V2 Mint Fix](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L119-L124)

**Code Snippet**:

```
    if (totalSupply == 0) {
        totalSupply = 1000;
        accountTokens[address(0)] = 1000;
        mintTokens -= 1000;
    }
```

2. **Ensure Non-zero Shares Minted**:

When minting tokens, ensure that the number of shares minted is non-zero to prevent rounding issues.

**Code Snippet**:

```
   require(_shares != 0, "zero shares minted");
```

3. **Create Periphery Contract for Initialization**:

Create a periphery contract that contains a wrapper function to atomically call `initialize` and `deposit`. This ensures that the initialization and first deposit are handled in a single transaction.

By implementing these changes, the risk of price inflation and associated exploits can be significantly reduced, enhancing the overall security and stability of the AToken contract.

**References**:

- [Hopelend Incident Analysis](https://www.certik.com/resources/blog/5dHTzHnoARD1huRtxu0qvi-hopelend-incident-analysis)

- [Radiant Lending Pool Hack Analysis](https://blog.verichains.io/p/radiant-lending-pool-hack-analysis)

- [Compound Initial Mint Fix](https://github.com/akshaysrivastav/first-deposit-bug-compv2)

- [Uniswap V2 Mint Fix](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L119-L124)

  

###

##### Remediation

**SOLVED:** A periphery contract was added, named `LendingPoolPeriphery` that initializes the pool as soon as it is deployed.

##### Remediation Hash

6103d6c38751db070d7ae44ae01794548db2adb9
