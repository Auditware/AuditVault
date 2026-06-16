---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/wallet
protocol: "[[MetaMask]]"
auditors:
  - "[[Dominik Muhs]]"
report: "https://consensys.net/diligence/audits/2023/08/metamask/partner-snaps-filsnap/"
genome:
  - "[[dos-resistance]]"
  - "[[event-manipulation]]"
---
# Markdown and Control Character Injection ✓ Fixed

- id: 26623
- impact: HIGH
- protocol: MetaMask/Partner Snaps - FilSnap
- reporter: Dominik Muhs
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/08/metamask/partner-snaps-filsnap/

## Summary


This bug report is about the `fil_configure` RPC call, which is used to get user consent on config changes in the FilSnap application. The issue is that the confirmation dialogue values have been (mostly) displayed using the `copyable` function, resulting in escaped output. This could lead to users unintentionally signing an inaccurate message due to the variable `ctx.config` in the provided code snippet, which could contain untrusted data.

The issue has been addressed in revision [`1a8715f42cfc9f721e8faab8a7a2610f53592f94`](https://github.com/filecoin-project/filsnap/commit/1a8715f42cfc9f721e8faab8a7a2610f53592f94). The recommendation is to prioritize input validation, encode data securely when presenting it to users, and display original data within an escaped pre-text or code block that prevents rendering non-standard characters or Markdown. Additionally, derived or decoded data should be added to offer users a comprehensive understanding.

## Details

#### Resolution



Configuration values reflected in the confirmation prompt are implicitly validated by getting user consent on config changes through the `fil_configure` RPC call. Furthermore, confirmation dialogue values have been (mostly) displayed using the `copyable` function, resulting in escaped output.


This issue has been addressed in revision [`1a8715f42cfc9f721e8faab8a7a2610f53592f94`](https://github.com/filecoin-project/filsnap/commit/1a8715f42cfc9f721e8faab8a7a2610f53592f94).




#### Description


The snap uses MetaMask’s Snaps UI package to present dialogs to users for data verification and action confirmations. While these dialogs ensure dapps don’t silently execute operations without user consent, some UI components have vulnerabilities. For instance, the `text()` component can render Markdown or be susceptible to control character injections. Specifically, in FilSnap’s context, when users are prompted to sign a message showing a gas cost estimate if the message contains Markdown-renderable text, the user might unintentionally sign an inaccurate message. It’s critical to note that the variable `ctx.config` in the provided code snippet could contain untrusted data, potentially altering the context of the displayed message. Malicious manipulation of the snap context is outlined in [issue 4.3](#fil_configure-allows-anyone-to-change-the-snaps-configuration).


**packages/snap/src/rpc/sign-message.ts:L68-L89**



```
const conf = await snapDialog(ctx.snap, {
 type: 'confirmation',
 content: panel([
 heading(`Send ${Token.fromAttoFIL(message.value).toFIL().toString()} to`),
 copyable(message.to),
 divider(),
 heading('Details'),
 text(
 `Gas \_(estimated)\_: \*\*${gas.toFIL().toFormat({
 decimalPlaces: ctx.config.unit?.decimals,
 suffix: ` ${ctx.config.unit?.symbol}`,
 })}\*\*`
 ),
 text(
 `Total \_(amount + gas)\_: \*\*${total.toFIL().toFormat({
 decimalPlaces: ctx.config.unit?.decimals,
 suffix: ` ${ctx.config.unit?.symbol}`,
 })}\*\*`
 ),
 ]),
})

```
#### Recommendation


Prioritize input validation. Encode data securely when presenting it to users. Display original data within an escaped pre-text or code block that prevents rendering non-standard characters or Markdown. Subsequently, add any derived or decoded data to offer users a comprehensive understanding.
