---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[Vultisig]]"
auditors:
  - "[[leegh]]"
report: "https://code4rena.com/reports/2024-06-vultisig"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[account-ownership]]"
---
# [H-02] [[Vultisig]] whitelisting can be bypassed by anyone

- id: 35754
- impact: HIGH
- protocol: Vultisig
- reporter: leegh (Code4rena)
- source: https://code4rena.com/reports/2024-06-vultisig

## Summary


This bug report discusses a vulnerability in the whitelist launch of a token called Vultisig. The issue allows non-whitelisted users to bypass the 3 ETH limit and purchase tokens, potentially causing a negative impact on the price and disadvantaging legitimate whitelisted users. The vulnerability lies in the `checkWhitelist()` function, which incorrectly checks for whitelisted users. A proof of concept test is provided, along with a recommended mitigation step to prevent non-whitelisted users from bypassing the whitelist. The assessed type of this vulnerability is "Invalid Validation" and it has been confirmed by the Vultisig team. Due to the severity of the issue, it has been given a high-risk rating.

## Details


Whitelist launch will be bricked. Anyone can buy tokens, and also bypass the 3 ETH limit by buying via other non-whitelisted accounts. This will have an impact on price and ruin the opportunities of legit whitelisted users.

[Here's a diagram](https://docs.vultisig.com/vultisig-token/launch#launch-liquidity) on the timelines of the launch. "WL Launch" is the affected phase.

### Vulnerability Details

The `checkWhitelist()` function makes an erroneous check here:

```solidity
    if (_allowedWhitelistIndex == 0 || _whitelistIndex[to] > _allowedWhitelistIndex) {
        revert NotWhitelisted();
    }
```

<https://github.com/code-423n4/2024-06-vultisig/blob/main/hardhat-vultisig/contracts/Whitelist.sol#L216>

`_allowedWhitelistIndex` is the [max index allowed](https://github.com/code-423n4/2024-06-vultisig/blob/main/hardhat-vultisig/contracts/Whitelist.sol#L38-L39), and works as a limit, not a whitelist flag. Once it is set (which must happen for all whitelists), any non-whitelisted user can bypass it. This is because `_whitelistIndex[to]` will be `0`, and `_whitelistIndex[to] > _allowedWhitelistIndex` will never revert (`0 > 1000`, for example).

### Proof of Concept

1. Add this test to `/2024-06-vultisig/hardhat-vultisig/test/unit/Whitelist.ts`.
2. Run the test `npx hardhat test`.

```typescript
it.only("Bypasses whitelisting", async function () {
    const { owner, whitelist, pool, otherAccount, mockOracleSuccess, mockContract } = await loadFixture(deployWhitelistFixture);

    await whitelist.setVultisig(mockContract);
    await whitelist.setLocked(false);
    await whitelist.setOracle(mockOracleSuccess);

    // `otherAccount` is not whitelisted and can't bypass the whitelist check
    await expect(whitelist.connect(mockContract).checkWhitelist(pool, otherAccount, 0)).to.be.revertedWithCustomError(
    whitelist,
    "NotWhitelisted",
    );

    // Until an `_allowedWhitelistIndex` limit is set
    // This value is intended as a limit, not as a flag not allow non-whitelisted users
    await whitelist.setAllowedWhitelistIndex(10);

    // `otherAccount` and any other user can now bypass the whitelisting
    await whitelist.connect(mockContract).checkWhitelist(pool, otherAccount, 0);
});
```

### Recommended Mitigation Steps

Prevent non-whitelisted users to bypass the whitelist:

```diff
-   if (_allowedWhitelistIndex == 0 || _whitelistIndex[to] > _allowedWhitelistIndex) {
+   if (_whitelistIndex[to] == 0 || _whitelistIndex[to] > _allowedWhitelistIndex) {
        revert NotWhitelisted();
    }
```

### Assessed type

Invalid Validation

**[wewecalibrate (Vultisig) confirmed](https://github.com/code-423n4/2024-06-vultisig-findings/issues/42#event-13486594576)**

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-06-vultisig-findings/issues/42#issuecomment-2237655658):**
 > The Warden and its duplicates outline how the whitelist mechanism in the `Whitelist::checkWhitelist` function is invalid and will treat every user as initialized by default.
> 
> I consider a high-risk rating to be appropriate given that this represents an egregious error that affects sensitive functionality of the system.

***
