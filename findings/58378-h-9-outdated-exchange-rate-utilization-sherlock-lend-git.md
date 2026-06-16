---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[oracle-freshness]]"
  - "[[debt-accrual-update]]"
  - "[[oracle/stale-price]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[misassumption/oracle-is-reliable]]"
  - "[[blast-radius/single-user]]"
---
# H-9: Outdated Exchange Rate Utilization

- id: 58378
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the Lend-V2 smart contract, where an outdated exchange rate is used when users supply tokens. This results in users receiving more lTokens than intended, leading to losses for other users. The root cause of this bug is the use of an outdated exchange rate that does not account for the current pending interest in the lToken. The attack path involves an attacker supplying a large amount of underlying tokens, then withdrawing a small amount of lToken before withdrawing the remaining lTokens. The proof of concept (PoC) provided shows that the exchangeRateStored function does not account for pending interest. This bug can be mitigated by using the exchangeRateCurrent function instead of exchangeRateStored. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/628 

## Found by 
0xc0ffEE, 0xiehnnkta, 0xlrivo, Audinarey, BimBamBuki, DharkArtz, Drynooo, ElmInNyc99, GypsyKing18, HeckerTrieuTien, Hueber, Light, Nomadic\_bear, TessKimy, Uddercover, Waydou, Ziusz, aman, chaos304, durov, eta, evmninja, francoHacker, future, ggg\_ttt\_hhh, h2134, harry, jo13, jokr, kelvinclassic11, lazyrams352, molaratai, momentum, newspacexyz, patitonar, rokinot, t.aksoy, udo, wickie, x0rc1ph3r, xiaoming90, yaioxy, ydlee, yoooo, zxriptor

### Summary
When users supply tokens, an outdated `exchangeRate` is utilized. Consequently, users obtain more lTokens than were actually minted, within the contract.

### Root Cause
The root cause is the use of an outdated exchange rate that does not account for the current pending interest in the lToken.

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L74
```solidity
    function supply(uint256 _amount, address _token) external {
        address _lToken = lendStorage.underlyingTolToken(_token);

        require(_lToken != address(0), "Unsupported Token");

        require(_amount > 0, "Zero supply amount");

        // Transfer tokens from the user to the contract
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        _approveToken(_token, _lToken, _amount);

        // Get exchange rate before mint
74:     uint256 exchangeRateBefore = LTokenInterface(_lToken).exchangeRateStored();

        // Mint lTokens
        require(LErc20Interface(_lToken).mint(_amount) == 0, "Mint failed");

        // Calculate actual minted tokens using exchangeRate from before mint
        uint256 mintTokens = (_amount * 1e18) / exchangeRateBefore;

        lendStorage.addUserSuppliedAsset(msg.sender, _lToken);

        lendStorage.distributeSupplierLend(_lToken, msg.sender);

        // Update total investment using calculated mintTokens
        lendStorage.updateTotalInvestment(
            msg.sender, _lToken, lendStorage.totalInvestment(msg.sender, _lToken) + mintTokens
        );

        emit SupplySuccess(msg.sender, _lToken, _amount, mintTokens);
    }
```
### Internal pre-conditions
In the lToken, there is pending interest.

### External pre-conditions
N/A

### Attack Path
1. Attacker supplies large amount of underlying.
2. Attacker withdraws small amount of lToken.
3. Attacker withdraws all remaining lToken.

### PoC
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LToken.sol#L271-L309
```solidity
    function exchangeRateCurrent() public override nonReentrant returns (uint256) {
        accrueInterest();
        return exchangeRateStored();
    }
    function exchangeRateStored() public view override returns (uint256) {
        return exchangeRateStoredInternal();
    }
    function exchangeRateStoredInternal() internal view virtual returns (uint256) {
        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            /*
             * If there are no tokens minted:
             *  exchangeRate = initialExchangeRate
             */
            return initialExchangeRateMantissa;
        } else {
            /*
             * Otherwise:
             *  exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
             */
            uint256 totalCash = getCashPrior();
            uint256 cashPlusBorrowsMinusReserves = totalCash + totalBorrows - totalReserves;
            uint256 exchangeRate = cashPlusBorrowsMinusReserves * expScale / _totalSupply;

            return exchangeRate;
        }
    }
```
As can be seen, `exchangeRateStored` does not account for pending interest.
Consider the following scenario:
- Alice supplies 1010 underlying tokens.
- The exchangeRateStored is 1, with 1% of total assets as interest.
- At this time, exchangeRateCurrent is 1.01.
Alice should receive 1000 lTokens. However, due to the current implementation, she receives 1010 lTokens, even though the contract only receives 1000 lTokens. This leads to the lToken amount within the contract being less than the total of users' investments.

Additionally, when redeeming, the outdated exchangeRate is also utilized.

### Impact
Users can obtain more lTokens than intended when supplying tokens, leading to losses for other users.
Users may receive fewer underlying assets when redeeming.

### Mitigation
```diff
-74:     uint256 exchangeRateBefore = LTokenInterface(_lToken).exchangeRateStored();
+74:     uint256 exchangeRateBefore = LTokenInterface(_lToken).exchangeRateCurrent();
```
