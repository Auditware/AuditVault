---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
protocol: "[[Myriad]]"
auditors:
  - "[[Kiki]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-13-cyfrin-myriad-clob-v2.0.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# `MyriadCTFExchange::matchCrossMarketOrders` allows taker to receive YES tokens for free when `priceSum > ONE`

- id: 65419
- impact: HIGH
- protocol: [[Myriad]] Clob
- reporter: Kiki (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-13-cyfrin-myriad-clob-v2.0.md

## Summary


This bug report describes an issue with the `matchCrossMarketOrders` function in the MyriadCTFExchange smart contract. The function is supposed to require a minimum `priceSum` of `ONE` (1e18), but it only requires `priceSum` to be greater than or equal to `ONE`, not equal to it. This means that if the `priceSum` is greater than `ONE`, the taker (buyer) may receive their desired amount of tokens without having to pay any collateral, effectively stealing value from the makers (sellers) who have already paid the required collateral. Additionally, there is no way for the surplus collateral to be withdrawn from the contract, creating a permanent loss of funds. This issue can occur due to an operator error or malicious intent. The recommended solution is to remove the calculation for `notional` and collect any extra funds for the protocol. The bug has been fixed in the Myriad and Cyfrin projects.

## Details

**Description:** `matchCrossMarketOrders` requires only `priceSum >= ONE`, not `priceSum == ONE`:

```solidity
// MyriadCTFExchange.sol:252
require(priceSum >= ONE, "price sum < 1");
```

The notional for the last ("taker") order is computed as the remainder:

```solidity
// MyriadCTFExchange.sol:263-264
notional = notionalSoFar >= fillAmount ? 0 : fillAmount - notionalSoFar;
```

When `priceSum > ONE`, the maker notionals (all individually rounded down via integer division) may exceed `fillAmount`, leaving the taker notional as zero. The taker receives `fillAmount` YES tokens for no collateral payment.

More broadly, the total collateral collected equals `max(notionalSoFar, fillAmount) + totalFees`. The exchange approves exactly `fillAmount` to the adapter and sends `totalFees` to `FeeModule`. The difference `notionalSoFar - fillAmount` (when positive) remains in the exchange contract. There is no admin-withdrawal function and no recipient is designated for this surplus.

**Attack / Operator error scenario:**

1. Operator matches cross-market orders where prices sum to 1.2e18 instead of 1e18
2. Makers collectively pay notional equal to `1.2 * fillAmount / ONE` worth of collateral
3. Taker pays 0 (notionalSoFar > fillAmount)
4. Taker receives `fillAmount` YES tokens for free
5. Excess `0.2 * fillAmount` collateral is trapped in the exchange forever

Even without operator malice, a simple arithmetic mistake creates stuck funds with no recovery path.

**Impact:**
- The taker pays **zero collateral** yet receives a full `fillAmount` of YES tokens - effectively stealing value from the makers who overpaid to fund the fill
- The surplus collateral is trapped in the exchange contract with no withdrawal path; because `MyriadCTFExchange` is UUPS upgradeable the funds are not permanently lost, but recovery requires a full development, audit, and deployment cycle

**Proof of Concept:** Add the following test to `test/NegRiskAdapter.t.sol` and run with:
`forge test --match-test test_PoC_CrossMarketPriceSumAboveOne_TakerGetsFreeTokens -vvv`

```solidity
function test_PoC_CrossMarketPriceSumAboveOne_TakerGetsFreeTokens() public {
    (, uint256[] memory marketIds) = _createThreeOutcomeEvent();
    uint256 fillAmount = 100 ether;

    for (uint256 i = 0; i < 3; i++) { _setUniformFees(marketIds[i], 0, 0); }

    uint256 fundAmount = 200 ether;
    address[3] memory users = [alice, bob, charlie];
    uint256[3] memory pks   = [alicePk, bobPk, charliePk];
    for (uint256 i = 0; i < 3; i++) {
        collateral.mint(users[i], fundAmount);
        vm.startPrank(users[i]);
        collateral.approve(address(wcol), fundAmount);
        wcol.wrap(fundAmount);
        IERC20(address(wcol)).approve(address(exchange), type(uint256).max);
        conditionalTokens.setApprovalForAll(address(exchange), true);
        vm.stopPrank();
    }

    // priceSum = 0.60 + 0.60 + 0.10 = 1.30 - passes >= ONE check
    // maker notionals: 60 + 60 = 120 >= fillAmount(100)
    // → taker (charlie) notional = max(0, 100 - 120) = 0, pays nothing
    MyriadCTFExchange.Order[] memory orders = new MyriadCTFExchange.Order[](3);
    orders[0] = _buildOrder(alice,   marketIds[0], 0, MyriadCTFExchange.Side.Buy, fillAmount, (60 * ONE) / 100, 200);
    orders[1] = _buildOrder(bob,     marketIds[1], 0, MyriadCTFExchange.Side.Buy, fillAmount, (60 * ONE) / 100, 201);
    orders[2] = _buildOrder(charlie, marketIds[2], 0, MyriadCTFExchange.Side.Buy, fillAmount, (10 * ONE) / 100, 202);

    bytes[] memory sigs = new bytes[](3);
    for (uint256 i = 0; i < 3; i++) { sigs[i] = _signOrder(orders[i], pks[i]); }

    uint256 charlieBefore  = wcol.balanceOf(charlie);
    uint256 exchangeBefore = wcol.balanceOf(address(exchange));

    exchange.matchCrossMarketOrders(orders, sigs, fillAmount);

    // Charlie received 100 YES tokens having paid 0 wcol
    assertEq(conditionalTokens.balanceOf(charlie, conditionalTokens.getTokenId(marketIds[2], 0)), fillAmount);
    assertEq(wcol.balanceOf(charlie), charlieBefore);

    // 20 wcol permanently stuck: Alice 60 + Bob 60 = 120 collected, 100 sent to adapter, 20 remains
    assertEq(wcol.balanceOf(address(exchange)) - exchangeBefore, 20 ether);
}
```

**Recommended Mitigation:**
1. Remove the `notional = notionalSoFar >= fillAmount ? 0 : fillAmount - notionalSoFar;` calculation making it so that each buyer pays their agreed upon price
2. Collect the extra for the protocol either to `treasury` or `feeModule`.

**Myriad:** Fixed in commits [`c820bcf`](https://github.com/Polkamarkets/polkamarkets-js/commit/c820bcfbd28347c161529e0d89fab11eff9ee87f) and [`d4300b9`](https://github.com/Polkamarkets/polkamarkets-js/pull/127/changes/d4300b9a00105c8612e6011689a6e74db36cd33d)

**Cyfrin:** Verified.

\clearpage
