---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/liquid-staking
  - sector/staking
protocol: "[[Notional]]"
auditors:
  - "[[ZeroTrust]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# H-12: The withdrawValue calculation in _calculateValueOfWithdrawRequest is incorrect.

- id: 35125
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: ZeroTrust (Sherlock)
- source: N/A

## Summary


The withdrawValue calculation in _calculateValueOfWithdrawRequest is incorrect, which can lead to overestimation of user assets and potential losses for the protocol. This issue affects multiple functions in different vaults and should be considered as a High severity issue. The evidence for this issue is clear and the sponsor has also agreed that it should be treated as a high priority. Another similar issue has been rated as High severity, making this issue unique. Escalations have been resolved successfully and the final verdict is High severity and Unique.

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/78 

## Found by 
ZeroTrust
The withdrawValue calculation in _calculateValueOfWithdrawRequest is incorrect.
## Summary
The withdrawValue calculation in _calculateValueOfWithdrawRequest is incorrect.
## Vulnerability Detail
```javascript
function _calculateValueOfWithdrawRequest(
        WithdrawRequest memory w,
        uint256 stakeAssetPrice,
        address borrowToken,
        address redeemToken
    ) internal view returns (uint256 borrowTokenValue) {
        if (w.requestId == 0) return 0;

        // If a withdraw request has split and is finalized, we know the fully realized value of
        // the withdraw request as a share of the total realized value.
        if (w.hasSplit) {
            SplitWithdrawRequest memory s = VaultStorage.getSplitWithdrawRequest()[w.requestId];
            if (s.finalized) {
                return _getValueOfSplitFinalizedWithdrawRequest(w, s, borrowToken, redeemToken);
            }
        }

        // In every other case, including the case when the withdraw request has split, the vault shares
        // in the withdraw request (`w`) are marked at the amount of vault shares the account holds.
@>>        return _getValueOfWithdrawRequest(w, stakeAssetPrice);
    }
```
We can see that for cases without hasSplit or with hasSplit but not finalized, the value is calculated using _getValueOfWithdrawRequest. Let’s take a look at `PendlePTEtherFiVault::_getValueOfWithdrawRequest()`.

```javascript
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w, uint256 /* */
    ) internal override view returns (uint256) {
@>>        uint256 tokenOutSY = getTokenOutSYForWithdrawRequest(w.requestId);
        // NOTE: in this vault the tokenOutSy is known to be weETH.
        (int256 weETHPrice, /* */) = TRADING_MODULE.getOraclePrice(TOKEN_OUT_SY, BORROW_TOKEN);
        return (tokenOutSY * weETHPrice.toUint() * BORROW_PRECISION) /
            (WETH_PRECISION * Constants.EXCHANGE_RATE_PRECISION);
    }
```
Here, tokenOutSY represents the total amount of WETH requested for withdrawal, not just the portion represented by the possibly split w.vaultShares. Therefore, _getValueOfWithdrawRequest returns the entire withdrawal value. If a WithdrawRequest has been split but not finalized, this results in an incorrect calculation.

This issue also occurs in `PendlePTKelpVault::_getValueOfWithdrawRequest()`.
```javascript
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w, uint256 /* */
    ) internal override view returns (uint256) {
        return KelpLib._getValueOfWithdrawRequest(w, BORROW_TOKEN, BORROW_PRECISION);
    }
//KelpLib._getValueOfWithdrawRequest) function
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w,
        address borrowToken,
        uint256 borrowPrecision
    ) internal view returns (uint256) {
        address holder = address(uint160(w.requestId));

        uint256 expectedStETHAmount;
        if (KelpCooldownHolder(payable(holder)).triggered()) {
            uint256[] memory requestIds = LidoWithdraw.getWithdrawalRequests(holder);
            ILidoWithdraw.WithdrawalRequestStatus[] memory withdrawsStatus = LidoWithdraw.getWithdrawalStatus(requestIds);

            expectedStETHAmount = withdrawsStatus[0].amountOfStETH;
        } else {
            (/* */, expectedStETHAmount, /* */, /* */) = WithdrawManager.getUserWithdrawalRequest(stETH, holder, 0);

        }

        (int256 stETHToBorrowRate, /* */) = Deployments.TRADING_MODULE.getOraclePrice(
            address(stETH), borrowToken
        );
            //@audit not the w.vaulteShares
@>>        return (expectedStETHAmount * stETHToBorrowRate.toUint() * borrowPrecision) /
            (Constants.EXCHANGE_RATE_PRECISION * stETH_PRECISION);
    }
```

This issue also occurs in `PendlePTStakedUSDeVault::_getValueOfWithdrawRequest()`.
```javascript
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w, uint256 /* */
    ) internal override view returns (uint256) {
        // NOTE: This withdraw valuation is not based on the vault shares value so we do not
        // need to use the PendlePT metadata conversion.
        return EthenaLib._getValueOfWithdrawRequest(w, BORROW_TOKEN, BORROW_PRECISION);
    }
//EthenaLib._getValueOfWithdrawRequest()
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w,
        address borrowToken,
        uint256 borrowPrecision
    ) internal view returns (uint256) {
        address holder = address(uint160(w.requestId));
        // This valuation is the amount of USDe the account will receive at cooldown, once
        // a cooldown is initiated the account is no longer receiving sUSDe yield. This balance
        // of USDe is transferred to a Silo contract and guaranteed to be available once the
        // cooldown has passed.
        IsUSDe.UserCooldown memory userCooldown = sUSDe.cooldowns(holder);

        int256 usdeToBorrowRate;
        if (borrowToken == address(USDe)) {
            usdeToBorrowRate = int256(Constants.EXCHANGE_RATE_PRECISION);
        } else {
            // If not borrowing USDe, convert to the borrowed token
            (usdeToBorrowRate, /* */) = Deployments.TRADING_MODULE.getOraclePrice(
                address(USDe), borrowToken
            );
        }
        //@audit not the w.vaulteShares
@>>        return (userCooldown.underlyingAmount * usdeToBorrowRate.toUint() * borrowPrecision) /
            (Constants.EXCHANGE_RATE_PRECISION * USDE_PRECISION);
    }
```
The calculation is correct only in `EtherFiVault::_getValueOfWithdrawRequest()` .
```javascript
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w, uint256 weETHPrice
    ) internal override view returns (uint256) {
        return EtherFiLib._getValueOfWithdrawRequest(w, weETHPrice, BORROW_PRECISION);
    }
//EtherFiLib._getValueOfWithdrawRequest() function
function _getValueOfWithdrawRequest(
        WithdrawRequest memory w,
        uint256 weETHPrice,
        uint256 borrowPrecision
    ) internal pure returns (uint256) {
            //@audit this is correct, using vaultShares
@>>        return (w.vaultShares * weETHPrice * borrowPrecision) /
            (uint256(Constants.INTERNAL_TOKEN_PRECISION) * Constants.EXCHANGE_RATE_PRECISION);
    }
```

## Impact
Overestimation of user assets can lead to scenarios where users should have been liquidated but were not, resulting in losses for the protocol.
## Code Snippet
https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/14d3eaf0445c251c52c86ce88a84a3f5b9dfad94/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L86

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/14d3eaf0445c251c52c86ce88a84a3f5b9dfad94/leveraged-vaults-private/contracts/vaults/staking/PendlePTEtherFiVault.sol#L46

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/Kelp.sol#L114

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/Ethena.sol#L77
## Tool used

Manual Review

## Recommendation
Modify the relevant calculation formulas.



## Discussion

**0502lian**

Escalate

This should be considered a High issue.

Although _calculateValueOfWithdrawRequest is just a view function, it is used by BaseStakingVault::convertStrategyToUnderlying to evaluate the value of a user’s shares in the staking Vault.
```javascript
 function convertStrategyToUnderlying(
        address account,
        uint256 vaultShares,
        uint256 /* maturity */
    ) public virtual override view returns (int256 underlyingValue) {
        uint256 stakeAssetPrice = uint256(getExchangeRate(0));

        WithdrawRequest memory w = getWithdrawRequest(account);
@>        uint256 withdrawValue = _calculateValueOfWithdrawRequest(
            w, stakeAssetPrice, BORROW_TOKEN, REDEMPTION_TOKEN
        );
        // This should always be zero if there is a withdraw request.
        uint256 vaultSharesNotInWithdrawQueue = (vaultShares - w.vaultShares);

        uint256 vaultSharesValue = (vaultSharesNotInWithdrawQueue * stakeAssetPrice * BORROW_PRECISION) /
            (uint256(Constants.INTERNAL_TOKEN_PRECISION) * Constants.EXCHANGE_RATE_PRECISION);
@>        return (withdrawValue + vaultSharesValue).toInt();
    }
```

In Notional V3, the function calculateAccountHealthFactors calculates a user’s health condition by calling getPrimaryUnderlyingValueOfShare, which in turn calls the vault's convertStrategyToUnderlying.

https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/internal/vaults/VaultValuation.sol#L173
```javascript
/// @notice Calculates account health factors for liquidation.
    function calculateAccountHealthFactors(
        VaultConfig memory vaultConfig,
        VaultAccount memory vaultAccount,
        VaultState memory vaultState,
        PrimeRate[2] memory primeRates
    ) internal view returns (
        VaultAccountHealthFactors memory h,
        VaultSecondaryBorrow.SecondaryExchangeRates memory er
    ) {
@>>        h.vaultShareValueUnderlying = getPrimaryUnderlyingValueOfShare(
            vaultState, vaultConfig, vaultAccount.account, vaultAccount.vaultShares
        );

       //-------skip--
---
    }

```
https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/internal/vaults/VaultValuation.sol#L54
```javascript
/// @notice Returns the value in underlying of the primary borrow currency portion of vault shares.
    function getPrimaryUnderlyingValueOfShare(
        VaultState memory vaultState,
        VaultConfig memory vaultConfig,
        address account,
        uint256 vaultShares
    ) internal view returns (int256) {
        if (vaultShares == 0) return 0;

        Token memory token = TokenHandler.getUnderlyingToken(vaultConfig.borrowCurrencyId);
        return token.convertToInternal(
@>>            IStrategyVault(vaultConfig.vault).convertStrategyToUnderlying(account, vaultShares, vaultState.maturity)
        );
    }
```

Whether a user’s position should be liquidated is determined based on calculateAccountHealthFactors.

**Therefore, as stated in the scope of impact in my report, “Overestimation of user assets can lead to scenarios where users should have been liquidated but were not, resulting in losses for the protocol.”**

Also considering the widespread nature of the error, in this audit, the calculation in PendlePTEtherFiVault, PendlePTKelpVault, PendlePTStakedUSDeVault, and EthenaVault is incorrect.

The impact of this error is High, and the likelihood of occurrence is between medium and high, according to Sherlock’s rules on how to identify a high issue:
“Definite loss of funds without (extensive) limitations of external conditions.”
Therefore, it should be judged as High.

**sherlock-admin3**

> Escalate
> 
> This should be considered a High issue.
> 
> Although _calculateValueOfWithdrawRequest is just a view function, it is used by BaseStakingVault::convertStrategyToUnderlying to evaluate the value of a user’s shares in the staking Vault.
> ```javascript
>  function convertStrategyToUnderlying(
>         address account,
>         uint256 vaultShares,
>         uint256 /* maturity */
>     ) public virtual override view returns (int256 underlyingValue) {
>         uint256 stakeAssetPrice = uint256(getExchangeRate(0));
> 
>         WithdrawRequest memory w = getWithdrawRequest(account);
> @>        uint256 withdrawValue = _calculateValueOfWithdrawRequest(
>             w, stakeAssetPrice, BORROW_TOKEN, REDEMPTION_TOKEN
>         );
>         // This should always be zero if there is a withdraw request.
>         uint256 vaultSharesNotInWithdrawQueue = (vaultShares - w.vaultShares);
> 
>         uint256 vaultSharesValue = (vaultSharesNotInWithdrawQueue * stakeAssetPrice * BORROW_PRECISION) /
>             (uint256(Constants.INTERNAL_TOKEN_PRECISION) * Constants.EXCHANGE_RATE_PRECISION);
> @>        return (withdrawValue + vaultSharesValue).toInt();
>     }
> ```
> 
> In Notional V3, the function calculateAccountHealthFactors calculates a user’s health condition by calling getPrimaryUnderlyingValueOfShare, which in turn calls the vault's convertStrategyToUnderlying.
> 
> https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/internal/vaults/VaultValuation.sol#L173
> ```javascript
> /// @notice Calculates account health factors for liquidation.
>     function calculateAccountHealthFactors(
>         VaultConfig memory vaultConfig,
>         VaultAccount memory vaultAccount,
>         VaultState memory vaultState,
>         PrimeRate[2] memory primeRates
>     ) internal view returns (
>         VaultAccountHealthFactors memory h,
>         VaultSecondaryBorrow.SecondaryExchangeRates memory er
>     ) {
> @>>        h.vaultShareValueUnderlying = getPrimaryUnderlyingValueOfShare(
>             vaultState, vaultConfig, vaultAccount.account, vaultAccount.vaultShares
>         );
> 
>        //-------skip--
---
>     }
> 
> ```
> https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/internal/vaults/VaultValuation.sol#L54
> ```javascript
> /// @notice Returns the value in underlying of the primary borrow currency portion of vault shares.
>     function getPrimaryUnderlyingValueOfShare(
>         VaultState memory vaultState,
>         VaultConfig memory vaultConfig,
>         address account,
>         uint256 vaultShares
>     ) internal view returns (int256) {
>         if (vaultShares == 0) return 0;
> 
>         Token memory token = TokenHandler.getUnderlyingToken(vaultConfig.borrowCurrencyId);
>         return token.convertToInternal(
> @>>            IStrategyVault(vaultConfig.vault).convertStrategyToUnderlying(account, vaultShares, vaultState.maturity)
>         );
>     }
> ```
> 
> Whether a user’s position should be liquidated is determined based on calculateAccountHealthFactors.
> 
> **Therefore, as stated in the scope of impact in my report, “Overestimation of user assets can lead to scenarios where users should have been liquidated but were not, resulting in losses for the protocol.”**
> 
> Also considering the widespread nature of the error, in this audit, the calculation in PendlePTEtherFiVault, PendlePTKelpVault, PendlePTStakedUSDeVault, and EthenaVault is incorrect.
> 
> The impact of this error is High, and the likelihood of occurrence is between medium and high, according to Sherlock’s rules on how to identify a high issue:
> “Definite loss of funds without (extensive) limitations of external conditions.”
> Therefore, it should be judged as High.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**0502lian**

Additional information:

This issue has the same impact as issue 60
https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/60, 
although the error occurs in slightly different ways; issue 60 is caused by token precision errors, while this issue is due to incorrect share referencing. There is no reason why issue 60 is high while this issue is considered medium.

**T-Woodward**

Yes I think this is correct. Definitely should be a high severity issue

**mystery0x**

I still think medium rating will be more appropriate but will let the Sherlock judge decide on it:

In case any of these incorrect values returned by the view functions are used as a part of a larger function which would result in loss of funds then it would be a valid medium/high depending on the impact.

**WangSecurity**

@0502lian I see that the functions mentioned in the escalation, which in the end call the`calculateValueOfWithdrawRequest`, are all view functions, but some of them internal, so I assume there are non-view functions that interact with them. Can you please forward me to them?

**0502lian**

## 1 About the Call Chain

Notional is a very complex protocol.
https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/external/actions/VaultLiquidationAction.sol#L58
```javascript
  function deleverageAccount(
        address account,
        address vault,
        address liquidator,
        uint16 currencyIndex,
        int256 depositUnderlyingInternal
    ) external payable nonReentrant override returns (
        uint256 vaultSharesToLiquidator,
        int256 depositAmountPrimeCash
    ) {
    //......skip.......... 
        // Currency Index is validated in this method
        (
            depositUnderlyingInternal,
            vaultSharesToLiquidator,
            pr
@>>        ) = IVaultAccountHealth(address(this)).calculateDepositAmountInDeleverage(
            currencyIndex, vaultAccount, vaultConfig, vaultState, depositUnderlyingInternal
        );
        //......skip..........
    }

```
You can see that the liquidation function deleverageAccount calls calculateDepositAmountInDeleverage().

https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/external/actions/VaultAccountHealth.sol#L252
```javascript
function calculateDepositAmountInDeleverage(
        uint256 currencyIndex,
        VaultAccount memory vaultAccount,
        VaultConfig memory vaultConfig,
        VaultState memory vaultState,
        int256 depositUnderlyingInternal
    ) external override returns (int256, uint256, PrimeRate memory) {
        // This method is only intended for use during deleverage account
   //............skip...........

@>>            (h, er) = VaultValuation.calculateAccountHealthFactors(vaultConfig, vaultAccount, vaultState, primeRates);
        //............skip...........


```
calculateDepositAmountInDeleverage() calls calculateAccountHealthFactors(), which I listed in my last comment. Finally, it calls the problematic function.

## 2 About the Sponsor

The sponsor has supported this issue as high priority in the above comments.
“Yes I think this is correct. Definitely should be a high severity issue”

## 3 About Severity Comparison

As I have already expressed above, issue 60 also affects the _getValueOfSplitFinalizedWithdrawRequest view function(called by _calculateValueOfWithdrawRequest()), but its severity is rated as High.

**The evidence is so obvious. I understand that the Sherlock judge wants to get to the truth, but I don’t understand why the first judge ignored this evidence and still considered it to be of medium severity.**

@WangSecurity 

**WangSecurity**

Based on the comment above, I agree high severity is indeed appropriate here. Planning to accept the escalation and upgrade the severity.

> The evidence is so obvious. I understand that the Sherlock judge wants to get to the truth, but I don’t understand why the first judge ignored this evidence and still considered it to be of medium severity

The problem here is that all the functions mentioned in the report and messages above you just say where the formula is incorrect. From judge's point of view it would be easier if you would make vulnerability path which function would be called and how this sequence of calls would lead to the impact. Just as an advice try to write your reports in a different way so it's easier to judge it correctly initially. Also, try new report templates, I think with them it will be a lot easier for both you and judges :)

**WangSecurity**

Result:
High
Unique

**sherlock-admin4**

Escalations have been resolved successfully!

Escalation status:
- [0502lian](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/78/#issuecomment-2226677373): accepted
