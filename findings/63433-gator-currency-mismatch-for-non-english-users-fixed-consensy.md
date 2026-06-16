---
tags:
  - lang/solidity
  - has/github
  - platform/consensys
  - severity/high
  - sector/wallet
protocol: "[[MetaMask]]"
auditors:
  - "[[Pedro Santos]]"
report: "https://diligence.consensys.io/audits/2025/08/metamask-eip-7715-permissions-snap/"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[token-decimal-normalization]]"
---
# Gator - Currency Mismatch for Non-English Users ✓ Fixed

- id: 63433
- impact: HIGH
- protocol: [[MetaMask]] - EIP-7715 Permissions Snap
- reporter:  Pedro Santos
                         (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/08/metamask-eip-7715-permissions-snap/

## Summary


The report discusses a bug in the MetaMask/snap-7715-permissions GitHub repository that causes a currency mismatch for non-English users. This means that while users are shown USD price data, it is formatted with their local currency symbol, potentially causing financial misinformation. The bug has been fixed by updating the logic to use the user's preferred currency when fetching price data and adding a fallback mechanism. The fix has been implemented and verified through testing in multiple languages. The report recommends ensuring that the Price API supports the user's preferred currency and adding currency conversion logic as a fallback. It also suggests making it clear to the user when the preferred currency is unavailable to avoid confusion.

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

Fixed in [MetaMask/snap-7715-permissions@`476e653`](https://github.com/MetaMask/snap-7715-permissions/commit/476e6534f9e219ac130f7e9c4f10f6b3f17b12ed) by updating the logic to invoke the Price API with the user’s preferred currency and updating the UI element when falling back to USD. The client provided additional details:

> **Resolution:** Logic was updated to invoke the Price API with the user’s preferred currency, incorporating a fallback mechanism.  
> **Implementation:** PR: [MetaMask/snap-7715-permissions#152](https://github.com/MetaMask/snap-7715-permissions/pull/152)  
> **Verification:** Testing across EN, FR, and DE locales confirmed correct currency handling.

#### Description

A currency mismatch exists in the `TokenPricesService` implementation that causes non-English users to receive USD price data while displaying it with their local currency formatting. This can potentially create a financial misinformation during permission grant decisions.

The issue occurs in the `#safeParsePreferences()` method which forces USD currency for all non-English locales when fetching price data, while the `formatAsCurrency()` function uses the user’s original currency preference for display formatting. This mismatch results in users seeing USD price values formatted with their local currency symbols (EUR, GBP, etc.).

#### Examples

**packages/gator-permissions-snap/src/utils/locale.ts:L11-L14**

```
export const FALLBACK_PREFERENCE: Preferences = {
  locale: 'en',
  currency: 'USD',
};
```

**packages/gator-permissions-snap/src/services/tokenPricesService.ts:L35-L41**

```
#safeParsePreferences(preferences: Preferences): VsCurrencyParam {
  const { currency, locale } = preferences;
  return locale === 'en'
    ? (currency.toLowerCase() as VsCurrencyParam)
    : (FALLBACK_PREFERENCE.currency.toLowerCase() as VsCurrencyParam);
}
```

**packages/gator-permissions-snap/src/services/tokenPricesService.ts:L79-L96**

```
const preferences = await this.#getPreferences();

// Value in fiat=(Amount in crypto)×(Spot price)
const tokenSpotPrice = await this.#priceApiClient.getSpotPrice(
  tokenCaip19Type,
  this.#safeParsePreferences(preferences),
);
const formattedBalance = Number(
  formatUnits({ value: BigInt(balance), decimals }),
);
const valueInFiat = formattedBalance * tokenSpotPrice;

const humanReadableValue = formatAsCurrency(preferences, valueInFiat);
logger.debug(
  'TokenPricesService:formatAsCurrency() - formatted balance to currency',
  humanReadableValue,
);
```

#### Recommendation

Ensure the Price API is called with the user’s preferred currency when supported, add validation to ensure Price API supports it, and/or add currency conversion logic as a fallback.

Additionally, if the preferred currency is unavailable, it should be clear to the user that the price shown is using a different currency to avoid misinformation.
