---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - trigger/low-liquidity
protocol: "[[Real Wagmi]]"
auditors:
  - "[[0xMAKEOUTHILL]]"
  - "[[0xMaroutis]]"
  - "[[0xpep7]]"
  - "[[AuditorPraise]]"
  - "[[Nyx]]"
  - "[[ali_shehab]]"
  - "[[jah]]"
  - "[[kutugu]]"
  - "[[p-tsanev]]"
  - "[[seeques]]"
  - "[[zraxx]]"
report: "https://github.com/sherlock-audit/2023-10-real-wagmi-judging"
genome:
  - "[[wrong-condition]]"
  - "[[trigger/low-liquidity]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-1: old borrowing key is used instead of `newBorrowingKey` when adding old loans to the newBorrowing in LiquidityBorrowingManager.takeOverDebt()

- id: 27394
- impact: HIGH
- protocol: [[Real Wagmi]] #2
- reporter: 0xMaroutis (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the LiquidityBorrowingManager.takeOverDebt() function of the Wagmi Leverage project. The issue is that when the _addKeysAndLoansInfo() function is called, the old borrowing key is used instead of the newBorrowingKey that was created in the _initOrUpdateBorrowing() function. This means that the wrong borrowing key will be added as the borrowing key for the tokenId of old loans in the tokenIdToBorrowingKeys in the _addKeysAndLoansInfo() function. This is an inattention error related to the accelerated development of the project. The bug was found by 0xMAKEOUTHILL, 0xMaroutis, 0xpep7, AuditorPraise, Nyx, ali\_shehab, jah, kutugu, p-tsanev, seeques, and zraxx. The bug was fixed by fann95, and the fix can be found in the link provided. The recommendation is to use the newBorrowingKey when calling the _addKeysAndLoansInfo() function instead of the old borrowing key.

## Details

Source: https://github.com/sherlock-audit/2023-10-real-wagmi-judging/issues/53 

## Found by 
0xMAKEOUTHILL, 0xMaroutis, 0xpep7, AuditorPraise, Nyx, ali\_shehab, jah, kutugu, p-tsanev, seeques, zraxx
when `_addKeysAndLoansInfo()` is called within LiquidityBorrowingManager.takeOverDebt(), old Borrowing Key is used and not `newBorrowingKey`  see [here](https://github.com/sherlock-audit/2023-10-real-wagmi/blob/main/wagmi-leverage/contracts/LiquidityBorrowingManager.sol#L440-L441)


## Vulnerability Detail
The old borrowing key credentials are deleted in  `_removeKeysAndClearStorage(oldBorrowing.borrower, borrowingKey, oldLoans);` see  [here](https://github.com/sherlock-audit/2023-10-real-wagmi/blob/main/wagmi-leverage/contracts/LiquidityBorrowingManager.sol#L429)

And a new borrowing key is created with the holdToken, saleToken, and the address of the user who wants to take over the borrowing in the `_initOrUpdateBorrowing()`. see [here](https://github.com/sherlock-audit/2023-10-real-wagmi/blob/main/wagmi-leverage/contracts/LiquidityBorrowingManager.sol#L430-L439)


now the old borrowing key whose credentials are already deleted is used to update the old loans in `_addKeysAndLoansInfo()` instead of the `newBorrowingKey` generated in  `_initOrUpdateBorrowing()` see [here](https://github.com/sherlock-audit/2023-10-real-wagmi/blob/main/wagmi-leverage/contracts/LiquidityBorrowingManager.sol#L440-L441)

## Impact
wrong borrowing Key is used (i.e the old borrowing key) when adding old loans to `newBorrowing` 

Therefore the wrong borrowing key (i.e the old borrowing key) will be added as borrowing key for tokenId of old Loans in `tokenIdToBorrowingKeys` in _addKeysAndLoansInfo()

(i.e when the bug of `update bool` being false, is corrected, devs should understand :))

## Code Snippet
https://github.com/sherlock-audit/2023-10-real-wagmi/blob/main/wagmi-leverage/contracts/LiquidityBorrowingManager.sol#L440-L441
## Tool used

Manual Review

## Recommendation
use newBorrowingKey when calling  `_addKeysAndLoansInfo()` instead of old borrowing key.



## Discussion

**fann95**

This is an inattention error related to the accelerated development of the project. I think we would have fixed this during testing, but thanks for the hint anyway. We will fix it.

**fann95**

Fixed: https://github.com/RealWagmi/wagmi-leverage/commit/f5860c819eeb5146cc0c5c3b563ee83feb4ab33d
