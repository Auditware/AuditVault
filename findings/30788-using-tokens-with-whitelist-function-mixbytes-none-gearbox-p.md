---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
  - sector/stable
protocol: "[[Gearbox]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#15-using-tokens-with-whitelist-function"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Using tokens with whitelist function

- id: 30788
- impact: HIGH
- protocol: [[Gearbox Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#15-using-tokens-with-whitelist-function

## Summary


This bug report is about a problem with the Gearbox protocol, which uses tokens with a whitelist function as collateral. If one of these tokens is blocked off-chain, the "Liquidates credit account" function in the "CreditManager" contract will not work correctly. This is because the internal function "_transferAssetsTo()" is returning an incorrect value for "totalValue." The report suggests using a solution where "totalValue" will not increase if the transaction is unsuccessful.

## Details

##### Description
At line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L584-L593

The Gearbox protocol is assumed to use some tokens which have whitelist function ( ex. USDC, USDT) like a collateral. If this token will be blocked off-chain the Liquidates credit account function member of the `CreditManager` contract (https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L300) will not work correctly because the internal function `_transferAssetsTo()` (https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L584-L591) returns incorrect return value `totalValue`.

*Example:*

```solidity
function _transferAssetsTo(
        address creditAccount,
        address to,
        bool force
    ) internal returns (uint256 totalValue, uint256 totalWeightedValue) {
        totalValue = 0;
        totalWeightedValue = 0;

        uint256 tokenMask;
        uint256 enabledTokens = creditFilter.enabledTokens(creditAccount);

        for (uint256 i = 0; i < creditFilter.allowedTokensCount(); i++) {
            tokenMask = 1 << i;
            if (enabledTokens & tokenMask > 0) {
                (
                    address token,
                    uint256 amount,
                    uint256 tv,
                    uint256 tvw
                ) = creditFilter.getCreditAccountTokenById(creditAccount, i);
                if (amount > 1) {
                    // The condition is met, but the transfer will not occur
                    // for blocked account
                    _safeTokenTransfer(
                        creditAccount,
                        token,
                        to,
                        amount.sub(1),
                        force
                    );
                    // In this case totalValue will not correct
                    totalValue += tv;
                    totalWeightedValue += tvw;
                }
            }
        }
```

##### Recommendation
Use solution where totalValue will not increase in case of unsuccessful transaction.
