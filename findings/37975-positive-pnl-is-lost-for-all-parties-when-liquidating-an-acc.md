---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - severity/high
  - sector/lending
  - sector/perpetuals
  - sector/stable
protocol: "[[Zaros]]"
auditors:
  - "[[0xStalin]]"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Positive PnL is lost for all parties when liquidating an account, potentially causing that the MarginCollateralRecipient ends up receiving way less USD value than what it could have received.

- id: 37975
- impact: HIGH
- protocol: [[Zaros]]
- reporter: 0xStalin (Codehawks)
- source: N/A

## Summary


This bug report discusses an issue where when an account is liquidated, any positive PnL (profit) that it has is not properly transferred to the TradingAccount and MarginCollateralRecipient. This can result in the MarginCollateralRecipient receiving less USD value than they should have. The severity of this bug is considered high risk. The report provides details on how this bug occurs and how it affects the liquidation process. It also suggests a solution, which involves verifying if the account has positive PnL and minting it to the TradingAccount before deducting margin. This will ensure that the liquidated account receives the correct amount and the MarginCollateralRecipient receives the full USD value. 

## Details

````markdown
## Summary
When liquidating an account, if the account has positive PnL, that amount of PnL is not minted to the account because all of its positions will be closed, so, such positive PnL will be lost to the TradingAccount, but, that PnL will also be lost to the MarginCollateralRecipient.

## Vulnerability Details
Let's break into two the explanation of this bug, first, let's explore what should happen when an account has a positive PnL, and then, we'll explore how margin is deducted from the account's collateralBalance.

So, [when an account has positive PnL, the TradingAccount receives a deposit equivalent amount of USDZ into his collateralMarginBalance to the amount of positive PnL, and, the PerpetualEngine contract gets minted the exact same amount that was deposited into the TradingAccount](https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/branches/SettlementBranch.sol#L481-L491), in this way, the deposited USDZ is indeed backed by the underlying token.

Now, when the margin is deducted from an account, the [`TradingAccount.deductAccountMargin() function`](https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/leaves/TradingAccount.sol#L488-L578) iterates over the collateralLiquidationPriority attempting to deduct/seize collateral from the TradingAccount, and such collateral is transferred to a specific recipient depending if its deducting settlementFee, orderFee or PnL. The key to understanding here is that this amount comes out of the TradingAccount collateralBalance.

For example, if there is an account that has 100 USD in WETH, and, 50 USD in USDC as collateral, and, is required to deduct 125 USD from this account, the deductMargin will take 125 USD worth of the collateral owned by the account. In the end, the account will have 25 leftover USD in collateral, wether in WETH or USDC, what matters is that the account will have 25 USD as leftover, meaning, the account had enough collateral to cover the required amount to be deducted.

The problem caused by not minting the positive PnL to the liquidated accounts is that the PnL (when positive) is considered as if the account would have that USD value as deposited collateral in its account, but, **when a position is liquidated and its positive PnL is not minted to the account, the margin that can be deducted would be at most the value of the account's collateral, which, as we'll see in the below examples, it could be lower than the amount to be deducted.**

Consider an account that has multiple positions that are profitable and has yielded 300 positive PnL. Now, let's make an example of when the value of the collateral backing this account goes down and the account falls into liquidation.

Even though the loanToValue of the account's collateral is way lower than the requiredMaring, the huge positive PnL prevents the account from being liquidated because the marginBalance, after adding the positive PnL to the collateral's loanToValue is > requiredMargin.
- Account is not liquidable because the big positive PnL prevented the account marginBalance to be lower than the requiredMargin.
```
requiredMarging:  1000
PnL:              300

marginBalance:    750 + 300 ===> 1050

loanToValue:      750
RealMarketValue:  1000
```

Now, let's see what happens when the value of the collateral drops a little bit more.
- Account is now liquidable. But, the account only has collateral worth 900 USD, which means, the most amount of collateral (without the PnL) that will be transferred to the respective recipients will be 900USD, even though the amount to deduct is 1000.
  - This means that **the positive PnL that was generated while the position was opened is completely lost, and the liquidator's recipients receive way less USD (900 USD) than what they should have received (1000 USD)**
```
requiredMarging:  1000
PnL:              300

marginBalance:    675 + 300 ===> 975

loanToValue:      675
RealMarketValue:  900
```

As we've seen, the liquidator's recipient received way less USD value than what they should have, and not even mention that the liquidated account lost an extra 300 USD because all the deducted USD was from its deposited collateral, regardless that the account generated a profit of 300 USD. The account in reality had a total market value of 1200 USD, (900 USD worth of its collateral, and 300 USD of positive PnL), and, in the end, the account got deducted all of its collateral (900 USD), and did not receive any of its positive PnL (300 USD).

As we can see in the below snippet, the [`LiquidationBranch.liquidateAccounts() function`](https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/branches/LiquidationBranch.sol#L105-L222) does not mint the positive PnL before deducting collateral from the account.
```
function liquidateAccounts(uint128[] calldata accountsIds) external {
    ...

    for (uint256 i; i < accountsIds.length; i++) {
        ...

        // get account's required maintenance margin & unrealized PNL
        (, UD60x18 requiredMaintenanceMarginUsdX18, SD59x18 accountTotalUnrealizedPnlUsdX18) =
            tradingAccount.getAccountMarginRequirementUsdAndUnrealizedPnlUsd(0, SD59x18_ZERO);

        // get then save margin balance into working data
        ctx.marginBalanceUsdX18 = tradingAccount.getMarginBalanceUsd(accountTotalUnrealizedPnlUsdX18);

        // if account is not liquidatable, skip to next account
        // account is liquidatable if requiredMaintenanceMarginUsdX18 > ctx.marginBalanceUsdX18
        if (!TradingAccount.isLiquidatable(requiredMaintenanceMarginUsdX18, ctx.marginBalanceUsdX18)) {
            continue;
        }

        //@audit-issue => Positive PnL has not been minted to the account, and the liquidation execution directly proceeds to deduct margin from the account's collateral.

        // deduct maintenance margin from the account's collateral
        // settlementFee = liquidationFee
        ctx.liquidatedCollateralUsdX18 = tradingAccount.deductAccountMargin({
            feeRecipients: FeeRecipients.Data({
                marginCollateralRecipient: globalConfiguration.marginCollateralRecipient,
                orderFeeRecipient: address(0),
                settlementFeeRecipient: globalConfiguration.liquidationFeeRecipient
            }),
            pnlUsdX18: requiredMaintenanceMarginUsdX18,
            orderFeeUsdX18: UD60x18_ZERO,
            settlementFeeUsdX18: ctx.liquidationFeeUsdX18
        });

        ...
    }
}
```

## Impact
Positive PnL on liquidated accounts is completely lost. Accounts will get deducted more than what they should, and the liquidator's recipient would end up receiving way less USD than what they should.

## Tools Used
Manual Audit.

## Recommendations
Similar to [`SettlementBranch._fillOrder() function`, before deducting margin, verify if there is a positive PnL, if so, deposit that amount of PnL into the TradingAccount, and mint USDZ to the PerpetualEngine contract.](https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/branches/SettlementBranch.sol#L481-L491)
- In this way, when the liquidation execution reaches the point of deducting margin, the account will already have the positive PnL on its collateralBalance in the form of USDZ.
  - This will allow the deduct margin function to deduct that USDZ from the account and transfer it to the liquidator's recipient.
  - This also ensures that the liquidated account gets deducted the exact amount that should be deducted, because now, that positive PnL is also part of the account's collateralBalance.

```
function liquidateAccounts(uint128[] calldata accountsIds) external {
    ...

    for (uint256 i; i < accountsIds.length; i++) {
        ...

        // get account's required maintenance margin & unrealized PNL
            (, UD60x18 requiredMaintenanceMarginUsdX18, SD59x18 accountTotalUnrealizedPnlUsdX18) =
                tradingAccount.getAccountMarginRequirementUsdAndUnrealizedPnlUsd(0, SD59x18_ZERO);

        ...                

        // if account is not liquidatable, skip to next account
        // account is liquidatable if requiredMaintenanceMarginUsdX18 > ctx.marginBalanceUsdX18
        if (!TradingAccount.isLiquidatable(requiredMaintenanceMarginUsdX18, ctx.marginBalanceUsdX18)) {
            continue;
        }

        //@audit => Verify if the account has positive PnL, if so, mint it to the account before proceeding to deduct margin from the account
        if (accountTotalUnrealizedPnlUsdX18.gt(SD59x18_ZERO)) {
            // fetch storage slot for global config
            GlobalConfiguration.Data storage globalConfiguration = GlobalConfiguration.load();
            address usdzToken = globalConfiguration.usdToken;

            uint256 marginToAddX18 = accountTotalUnrealizedPnlUsdX18.intoUD60x18();
            tradingAccount.deposit(usdzToken, marginToAddX18);

            LimitedMintingERC20(usdzToken).mint(address(this), marginToAddX18.intoUint256());
        }

        // deduct maintenance margin from the account's collateral
        // settlementFee = liquidationFee
        ctx.liquidatedCollateralUsdX18 = tradingAccount.deductAccountMargin({
            feeRecipients: FeeRecipients.Data({
                marginCollateralRecipient: globalConfiguration.marginCollateralRecipient,
                orderFeeRecipient: address(0),
                settlementFeeRecipient: globalConfiguration.liquidationFeeRecipient
            }),
            pnlUsdX18: requiredMaintenanceMarginUsdX18,
            orderFeeUsdX18: UD60x18_ZERO,
            settlementFeeUsdX18: ctx.liquidationFeeUsdX18
        });

        ...
    }
}

```
````
