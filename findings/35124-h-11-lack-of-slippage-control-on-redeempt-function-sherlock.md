---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/staking
  - sector/token
  - platform/sherlock
  - has/github
  - severity/high
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Notional]]"
auditors:
  - "[[BiasedMerc]]"
  - "[[Ironsidesec]]"
  - "[[ZeroTrust]]"
  - "[[blackhole]]"
  - "[[brgltd]]"
  - "[[denzi_]]"
  - "[[lemonmon]]"
  - "[[pseudoArtist]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[wrong-condition]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# H-11: Lack of slippage control on `_redeemPT` function

- id: 35124
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: lemonmon (Sherlock)
- source: N/A

## Summary


The report highlights an issue with the `_redeemPT` function in the Pendle Principal Token contract. The slippage control has been disabled, which could result in a loss of assets. This can happen due to on-chain trading activities or malicious users. The vulnerability was found by several security researchers. The code snippet in line 137 shows that the `minTokenOut` is set to 0, which disables the slippage control. This function is used in two places within the contract, and in both instances, any `netTokenOut` redeemed will be accepted, even if it is less than expected due to slippage. This can lead to a loss of assets when withdrawing from external protocols. The impact of this vulnerability is a loss of assets. The recommendation is to implement the required slippage control to prevent this issue. The vulnerability was found through a manual review. 

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/70 

## Found by 
BiasedMerc, Ironsidesec, ZeroTrust, blackhole, brgltd, denzi\_, lemonmon, pseudoArtist, xiaoming90
## Summary

The slippage control on the `_redeemPT` function has been disabled. As a result, it can lead to a loss of assets. Slippage can occur naturally due to on-chain trading activities or the victim being sandwiched by malicious users/MEV.

## Vulnerability Detail

In Line 137 of the `_redeemPT` function, the `minTokenOut` is set to `0`, which disables the slippage control. Note that redeeming one `TOKEN_OUT_SY` does not always give you one `netTokenOut`. Not all SY contracts will burn one share and return 1 yield token back. Inspecting the Pendle's source code will reveal that for some SY contracts, some redemption will involve withdrawing/redemption from external staking protocol or performing some swaps, which might suffer from some slippage.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/PendlePrincipalToken.sol#L137

```solidity
File: PendlePrincipalToken.sol
123:     /// @notice Handles PT redemption whether it is expired or not
124:     function _redeemPT(uint256 vaultShares) internal returns (uint256 netTokenOut) {
125:         uint256 netPtIn = getStakingTokensForVaultShare(vaultShares);
126:         uint256 netSyOut;
127: 
128:         // PT tokens are known to be ERC20 compatible
129:         if (PT.isExpired()) {
130:             PT.transfer(address(YT), netPtIn);
131:             netSyOut = YT.redeemPY(address(SY));
132:         } else {
133:             PT.transfer(address(MARKET), netPtIn);
134:             (netSyOut, ) = MARKET.swapExactPtForSy(address(SY), netPtIn, "");
135:         }
136: 
137:         netTokenOut = SY.redeem(address(this), netSyOut, TOKEN_OUT_SY, 0, true);
138:     }
```

The `_redeemPT` function is being used in two places:

#### Instance 1 - Within `_executeInstantRedemption` function

If `TOKEN_OUT_SY == BORROW_TOKEN`, the code will accept any `netTokenOut` redeemed, even if it is fewer than expected due to slippage.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/PendlePrincipalToken.sol#L140

```solidity
File: PendlePrincipalToken.sol
140:     function _executeInstantRedemption(
141:         address /* account */,
142:         uint256 vaultShares,
143:         uint256 /* maturity */,
144:         RedeemParams memory params
145:     ) internal override returns (uint256 borrowedCurrencyAmount) {
146:         uint256 netTokenOut = _redeemPT(vaultShares);
147: 
148:         if (TOKEN_OUT_SY != BORROW_TOKEN) {
149:             Trade memory trade = Trade({
150:                 tradeType: TradeType.EXACT_IN_SINGLE,
151:                 sellToken: TOKEN_OUT_SY,
152:                 buyToken: BORROW_TOKEN,
153:                 amount: netTokenOut,
154:                 limit: params.minPurchaseAmount,
155:                 deadline: block.timestamp,
156:                 exchangeData: params.exchangeData
157:             });
158: 
159:             // Executes a trade on the given Dex, the vault must have permissions set for
160:             // each dex and token it wants to sell.
161:             (/* */, borrowedCurrencyAmount) = _executeTrade(params.dexId, trade);
162:         } else {
163:             borrowedCurrencyAmount = netTokenOut;
164:         }
```

#### Instance 2 - Within `_initiateWithdrawImpl` function

The code will accept any `tokenOutSy` redeemed, even if it is fewer than expected due to slippage, and proceed to withdraw them from external protocols.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/PendlePrincipalToken.sol#L171

```solidity
File: PendlePrincipalToken.sol
171:     function _initiateWithdrawImpl(
172:         address account, uint256 vaultSharesToRedeem, bool isForced
173:     ) internal override returns (uint256 requestId) {
174:         // When doing a direct withdraw for PTs, we first redeem or trade out of the PT
175:         // and then initiate a withdraw on the TOKEN_OUT_SY. Since the vault shares are
176:         // stored in PT terms, we pass tokenOutSy terms (i.e. weETH or sUSDe) to the withdraw
177:         // implementation.
178:         uint256 tokenOutSy = _redeemPT(vaultSharesToRedeem);
179:         requestId = _initiateSYWithdraw(account, tokenOutSy, isForced);
180:         // Store the tokenOutSy here for later when we do a valuation check against the position
181:         VaultStorage.getWithdrawRequestData()[requestId] = abi.encode(tokenOutSy);
182:     }
```

## Impact

Loss of assets due to lack of slippage control. Slippage can occur naturally due to on-chain trading activities or the victim being sandwiched by malicious users/MEV.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/staking/protocols/PendlePrincipalToken.sol#L137

## Tool used

Manual Review

## Recommendation

Consider implementing the required slippage control.
