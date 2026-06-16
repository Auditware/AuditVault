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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#15-using-tokens-with-whitelist-function"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Using tokens with whitelist function

- id: 28208
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#15-using-tokens-with-whitelist-function

## Summary


The Gearbox protocol is a blockchain protocol designed to use certain tokens, such as USDC and USDT, as collateral. This bug report focuses on a problem with the Liquidates credit account function member of the `CreditManager` contract. The internal function `_transferAssetsTo()` returns an incorrect return value `totalValue` when the token is blocked off-chain. 

This means that the totalValue will not be correct if the transfer is unsuccessful. The recommendation for this bug is to use a solution where totalValue will not increase in case of an unsuccessful transaction. This will ensure that the totalValue returned is correct even if the transfer is unsuccessful.

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
