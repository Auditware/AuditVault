---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - sector/vault
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[peakbolt]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-06] Division by zero error causes KangarooVault to be DoS with funds locked inside

- id: 20229
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: peakbolt (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


KangarooVault is a smart contract that is vulnerable to a Denial-of-Service (DoS) attack due to a division by zero error in `getTokenPrice()`. This scenario is possible when there are remaining funds in the contract when all positions are closed and all vault token holders have withdrawn their funds. If this happens, the funds will be locked within the contract and it will not be able to recover from the DoS. This is because increasing the total supply requires the use of `getTokenPrice()`, which is the function that contains the division by zero error.

Proof of Concept (PoC) code has been provided to demonstrate the vulnerability. The PoC code is a test case added to the `test/Kangaroo.Vault.t.sol` file. It attempts to initiate a deposit, which will cause a revert due to the division by zero error. After the deposit has been attempted, the funds will be locked in the contract and it will be unable to recover from the DoS.

The recommended mitigation step is to fix `getTokenPrice()` to handle the scenario when `totalSupply()` is zero. This will prevent the division by zero error and the funds will not be locked in the contract.

## Details


`KangarooVault` can be DoS with funds locked in the contract due to a division by zero error in `getTokenPrice()` as it does not handle the scenario where `getTotalSupply()` is zero.

### Impact

Funds will be locked within the `KangarooVault` (as shown in the PoC below) and it is not able to recover from the DoS.

That is because, to recover from the DoS, it requires increasing total supply through minting of new tokens via deposits. However, that is not possible as `initiateDeposit()` relies on `getTokenPrice()`.

Also, we cannot withdraw the remaining funds as there are no more `VaultTokens` left to burn.

**Detailed Explanation**

`getTokenPrice()` will attempt to perform a division by `getTotalSupply()` when `totalFunds != 0` and `positionId == 0`. This scenario is possible when there are remaining funds in `KangarooVault` when all positions are closed and all vault token holders withdrawn their funds.

    function getTokenPrice() public view returns (uint256) {
        if (totalFunds == 0) {
            return 1e18;
        }

        uint256 totalSupply = getTotalSupply();
        if (positionData.positionId == 0) {
            return totalFunds.divWadDown(totalSupply);
        }

### Proof of Concept

Add the following imports and test case to `test/Kangaroo.Vault.t.sol`

    function testKangarooDivisionByZero() public {
        uint256 amt = 231e18;

        // Open position to decrease availableFunds for withdrawals.
        kangaroo.openPosition(amt, 0);
        skip(100);
        kangaroo.executePerpOrders(emptyData);
        kangaroo.clearPendingOpenOrders(0);

        // initiate user withdrawal
        // this will be a partial withdrawal due to the open position.
        vm.prank(user_1);
        kangaroo.initiateWithdrawal(user_1, 5e23);
        kangaroo.processWithdrawalQueue(1);

        // close all position
        kangaroo.closePosition(amt, 1000000e18);
        skip(100);
        kangaroo.executePerpOrders(emptyData);
        kangaroo.clearPendingCloseOrders(0);

        // Complete remaining withdrawals of funds.
        // this will reduce totalSupply to zero and later cause a division by zero error.
        kangaroo.processWithdrawalQueue(1);

        /// prepare for new deposit
        vm.startPrank(user_1);
        susd.approve(address(kangaroo), 5e23);

        // This deposit will revert due to division by zero.
        vm.expectRevert();
        kangaroo.initiateDeposit(user_1, 5e23);
        vm.stopPrank();

        // KangarooVault is now DoS and some funds are locked in it
        assertEq(susd.balanceOf(address(kangaroo)), 168969);
    }

### Recommended Mitigation Steps

Fix `getTokenPrice()` to handle the scenario when `totalSupply()` is zero.

**[Dravee (judge) commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/160#issuecomment-1480982595):**
 > Feels extremely similar to https://github.com/code-423n4/2023-03-polynomial-findings/issues/157 by the same warden, but the impact is on a different contract and requires a different POC.<br>
> Won't flag as a duplicate for now.

**[mubaris (Polynomial) confirmed](https://github.com/code-423n4/2023-03-polynomial-findings/issues/160#issuecomment-1510106874)**

**[Dravee (judge) commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/160#issuecomment-1532114379):**
 > Will keep as high due to the warden showing in this case a direct impact on assets.



***
