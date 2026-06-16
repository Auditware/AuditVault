---
tags:
  - lang/solidity
  - sector/dex
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[SaucerSwap]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
---
# Inadequate Storage Limit Handling in Expo `SecureStore` for Wallet Data

- id: 61990
- impact: HIGH
- protocol: [[SaucerSwap]] Wallet
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation stating that they have enhanced the useSecureKeyValue hook with improved encryption capabilities. The bug was found in the `wallet/index.ts` file and it affects the application's use of Expo `SecureStore` to store sensitive data. The bug occurs because the application does not account for the 2048 byte storage limit imposed by the library, which can result in data loss or corruption. The bug also poses a risk of inaccessible or unrecoverable wallets, which is especially concerning for financial, crypto, or identity applications. The report recommends proactively checking the size of data before storing it and implementing test cases and telemetry to detect and warn about approaching or exceeding the limit. It also suggests using `SecureStore` only for small secrets and not for larger structured data to avoid data loss and user harm.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `5a5863ffa0cb5b3b40aa0a87277eb460b1b78177`. The client provided the following explanation:

> Enhanced useSecureKeyValue hook with improved encryption capabilities

**File(s) affected:**`wallet/index.ts`

**Description:** The application uses Expo `SecureStore` to persist sensitive data, such as wallets, without accounting for the 2048 byte storage limit imposed by the library. According to [Expo's official documentation](https://docs.expo.dev/versions/latest/sdk/securestore/), `SecureStore` will not throw an error when this limit is exceeded, it simply logs a warning.

This silent behavior poses serious risks:

*   Wallets or other sensitive data that exceed 2048 bytes may not be saved fully or at all, leading to data loss or corruption.
*   Because `SecureStore` does not enforce the limit strictly, developers may falsely assume data is stored successfully, only to discover broken behavior at retrieval time.
*   This can result in inaccessible or unrecoverable wallets, which is especially critical in financial, crypto, or identity applications.
*   Furthermore, the failure mode being a warning, not an exception, makes it unlikely that error handling paths will detect and respond appropriately. This silently undermines reliability and data integrity guarantees.

**Recommendation:**

*   Proactively check the size of the data before storing it in `SecureStore`.
*   Implement test cases and telemetry to detect if a payload approaches or exceeds the limit, and warn or degrade gracefully.
*   For cryptographic material like wallets, ensuring atomicity, integrity, and guaranteed persistence is critical. `SecureStore` is suitable for small secrets, but misusing it for larger structured data can lead to data loss and user harm.
