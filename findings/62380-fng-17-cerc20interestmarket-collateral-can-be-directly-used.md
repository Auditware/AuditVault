---
tags:
  - lang/solidity
  - platform/hexens
  - has/github
  - severity/high
  - sector/lending
  - sector/nft
  - sector/stable
protocol: "[[Fungify]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md"
genome:
  - "[[missing-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [FNG-17] CErc20InterestMarket collateral can be directly used to pay interest and bypass health check

- id: 62380
- impact: HIGH
- protocol: [[Fungify]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md

## Summary


The bug report is about a critical issue in the code for a CErc20InterestMarket, which is a type of token used for paying interest on loans. The problem is that the function responsible for paying interest does not properly check if the payer has enough collateral to cover the payment. This means that someone could create a loan without any collateral and cause a large amount of bad debt for the protocol. The issue has been fixed by implementing a check similar to the one used in the `redeem` function.

## Details

**Severity:** Critical

**Path:** CErc20InterestMarket.sol:payInterestInternal#L67-L101

**Description:** A CErc20InterestMarket is a CERC20 token that can be used to pay interest for a CERC721 loan. These tokens have USD stable coins as underlying, such as USDC. These tokens are also normal CERC20 tokens and can be used as collateral for loans, so any balance change should be accompanied by a health check.

However, the function to pay interest for a CERC721 loan directly takes from the balance of the payer using `payInterestInternal`. If that balance was used as collateral in a loan, then this would bypass the health check completely, making the loan insolvent.

This provides a way to instantly (in a single transaction) create loans without any collateral backing it, creating large bad debt for the protocol.

For example:

1. A user has a loan for an ERC721 worth 100 ETH.

2. After some time, the user racks up 10 ETH worth in interest for that loan.

3. The user now uses a second account to create a new loan using 10 ETH worth of USDC as collateral and borrowing as much as possible (e.g. 8.5 ETH worth of DAI).

4. The user now calls `CErc721:repayBorrowBehalf`, which will call `CErc20InterestMarket:payInterestInternal` and pay the interest using the collateral balance of the second account, bypassing the health check.

5. In the end, only 1.5 ETH was paid back instead of the 10 ETH and an 8.5 ETH bad debt loan has been created.
```
function payInterestInternal(address borrowMarket, address payer, uint interestAmount) internal {
    if (interestAmount == 0) {
        return;
    }

    /* Fail if pay interest not allowed */
    uint allowed = comptroller.payInterestAllowed(address(this), borrowMarket, payer, interestAmount);
    require(allowed == 0, "pay not allowed");

    Exp memory exchangeRate = Exp({mantissa: exchangeRateStoredInternal()});
    uint interestTokens = div_(interestAmount, exchangeRate);

    // payer interest market balance is reduced to cover interest being paid
    uint balancePayer = accountTokens[payer];
    require(balancePayer >= interestTokens, "insufficient payer reserve");
    accountTokens[payer] = balancePayer - interestTokens;
    emit Transfer(payer, address(0), interestTokens);

    uint totalVirtual_ = totalVirtual;
    uint heldBalance;
    if (interestTokens > totalVirtual_) {
        heldBalance = interestTokens - totalVirtual_;
        totalSupply = totalSupply - totalVirtual_;
        totalVirtual = 0;
    } else {
        totalSupply = totalSupply - interestTokens;
        totalVirtual = totalVirtual_ - interestTokens;
    }

    if (heldBalance != 0) {
        // keep a reserve of cToken
        accountTokens[address(this)] = accountTokens[address(this)] + heldBalance;
        emit Transfer(address(0), address(this), heldBalance);
    }
}
```
**Remediation:**  The function `payInterestInternal` should do a check by calling to `Comptroller.isRedeemAllowed` for the `payer` and the payment amount in a `require` statement. Similar to the `redeem` function.

**Status:**  Fixed

- - -
