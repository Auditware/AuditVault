---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Primev]]"
auditors:
  - "[[Nexarion]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_private_primev.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[account-signer]]"
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
---
# Overpayment to Bidder in Slash Function Due to Incorrect Amount Transfer 

- id: 46246
- impact: HIGH
- protocol: [[Primev]]
- reporter: Nexarion (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_private_primev.pdf

## Summary


The ProviderRegistry function has a bug where it sends the full amount to bidders instead of the calculated residual amount. This means that bidders are receiving more funds than intended, which could potentially drain the contract's balance. A test case has been provided to show the bug in action and it has been classified as a medium risk.

## Details

## Issue Description: Critical Bug in ProviderRegistry's Slash Function

## Context
(No context files were provided by the reviewer)

## Description
The `slash` function in `ProviderRegistry` contains a critical bug where it sends the full `amt` to bidders instead of the calculated `residualAmt` (amount after decay). While the contract correctly calculates:

```
residualAmt = (amt * residualBidPercentAfterDecay) / ONE_HUNDRED_PERCENT
```

it erroneously calls:

```
bidder.send(amt)
```

instead of:

```
bidder.send(residualAmt)
```

This results in bidders receiving more funds than intended, potentially draining the contract's balance. For example, with a 50% decay rate, a bidder would receive 1 ETH instead of the intended 0.5 ETH.

## Proof of Concept
Add the following test case in `ProviderRegistryTest.sol`:

```solidity
function test_SlashResidualAmountBug() public {
    // Setup: Register provider with initial stake
    vm.deal(provider, 3 ether);
    vm.prank(provider);
    providerRegistry.registerAndStake{value: 2 ether}(validBLSPubkeys);
    providerRegistry.setPreconfManager(address(this));
    
    // Setup: Prepare bidder and track initial balances
    address bidder = vm.addr(4);
    uint256 initialBidderBalance = bidder.balance;
    uint256 initialProviderStake = providerRegistry.getProviderStake(provider);
    
    // Calculate expected values
    uint256 slashAmount = 1 ether;
    uint256 residualPercent = 50 * providerRegistry.PRECISION(); // 50% decay
    uint256 expectedResidualAmount = (slashAmount * residualPercent) / providerRegistry.ONE_HUNDRED_PERCENT();
    uint256 expectedPenaltyFee = (expectedResidualAmount * providerRegistry.feePercent()) /
    providerRegistry.ONE_HUNDRED_PERCENT();
    
    // Execute slash with 50% decay
    providerRegistry.slash(slashAmount, provider, payable(bidder), residualPercent);
    
    // Verify the actual transfer amount vs expected
    uint256 actualBidderReceived = bidder.balance - initialBidderBalance;
    uint256 actualProviderLost = initialProviderStake - providerRegistry.getProviderStake(provider);
    
    // The bug manifests here - bidder receives full amount instead of residual
    assertEq(actualBidderReceived, slashAmount, "Bidder incorrectly received full amount instead of residual");
    assertGt(actualBidderReceived, expectedResidualAmount, "Bidder received more than residual amount");
    
    // Calculate the excess payment
    uint256 excessPayment = actualBidderReceived - expectedResidualAmount;
    assertGt(excessPayment, 0, "Excess payment should be greater than 0");
    
    // Total deducted from provider matches residual + fee
    assertEq(actualProviderLost, expectedResidualAmount + expectedPenaltyFee, "Provider lost correct amount despite overpayment to bidder");
}
```
