---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[TraitForge]]"
auditors:
  - "[[Fitro]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Incorrect percentage calculation in NukeFund and EntityForging when `taxCut` is changed from default value

- id: 37917
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: Fitro (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


This bug report discusses a problem with the code in two different contracts, `NukeFund` and `EntityForging`. The issue is related to the calculation of fees and how they are distributed between different parties. If the owner changes the default value of `taxCut` from 10, the calculations become inaccurate and can lead to incorrect distribution of funds, potential financial losses, and loss of user trust. The root cause is the use of simple division instead of proper percentage calculations. The report includes a proof of concept and recommends implementing a basis point system to fix the issue. The bug has been confirmed by the sponsor and is now being addressed.

## Details


<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/EntityForging/EntityForging.sol#L146>

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/NukeFund/NukeFund.sol#L41>

### Impact

In both `NukeFund::receive` and `EntityForging::forgeWithListed`, if the owner changes `taxCut` from its default value of 10, the percentage calculations for fee distribution become severely inaccurate. This flaw can lead to:

1. Incorrect distribution of funds between developers, users, and the protocol.
2. Potential for significant financial losses or unintended gains.
3. Undermining of the protocol's economic model.
4. Loss of user trust if discrepancies are noticed.

The root cause is the use of simple division instead of proper percentage calculation:

        // NukeFund
        uint256 devShare = msg.value / taxCut; // Calculate developer's share (10%)
        uint256 remainingFund = msg.value - devShare; // Calculate remaining funds to add to the fund

        // EntityForging
        uint256 devFee = forgingFee / taxCut;
        uint256 forgerShare = forgingFee - devFee;

Some mathematical examples:

- When `taxCut = 10`, `1/10 = 0.1 = 10%` (correct).
- When `taxCut = 5`, `1/5 = 0.2 = 20%` (intended 5%, actually 20%).
- When `taxCut = 20`, `1/20 = 0.05 = 5%` (intended 20%, actually 5%).

### Proof of Concept

This is a test for the `NukeFund`, EntityForging is the same scenario just longer so I chose to send you the more concise test. We are going to set the `taxCut` to 5:

        function test_FundsRoundWrong() public {
            nukeFund.setTaxCut(5);
            uint256 devShare = 0.05 ether;
            uint256 initialDevBalance = nukeFund.devAddress().balance;
            uint256 initialNukeFund = nukeFund.getFundBalance();

            vm.prank(user1);
            
            address(nukeFund).call{value: 1 ether}("");

            uint256 finalDevBalance = nukeFund.devAddress().balance;
            uint256 devGained = finalDevBalance - initialDevBalance;

            console.log("Dev Balance Gained:", devGained);

            assertNotEq(address(nukeFund).balance, initialNukeFund + 0.95 ether);

            uint256 devBalance = nukeFund.devAddress().balance;

            assertNotEq(devBalance, initialDevBalance + devShare);
        }

You can clearly see when it's supposed to be "5%" tax, it's instead 20%, leading the dev to get `2e17` of the `1e18` and the `NukeFund` getting `8e17`.

### Tools Used

Foundry

### Recommended Mitigation Steps

Implement a basis point (BPS) system for precise percentage calculations. This means now that with a BPS value of `10_000` you would represent 10% as `1000` and 5% in our tests as `500`.

Add the following changes:

1. At the top of `EntityForging` and `NukeFund` where state variables reside, add the following BPS state variable and change default `taxCut` of 10% to correspond to the BPS values:

```diff
+  uint256 private constant BPS = 10_000;
-  uint256 public taxCut = 10;
+  uint256 public taxCut = 10_000;
```

2. Update the calculations in `EntityForging` and `NukeFund` where `taxCut` is used.

```diff
    // NukeFund 
-    uint256 devShare = msg.value / taxCut; // Calculate developer's share (10%)
+    uint256 devShare = (msg.value * taxCut) / BPS;

    // EntityForging
-    uint256 devFee = forgingFee / taxCut;
+    uint256 devShare = (msg.value * taxCut) / BPS;
```

3. Also consider adding a boundary `setTaxCut` to make sure `taxCut` isn't greater than `BPS`:

```diff
  function setTaxCut(uint256 _taxCut) external onlyOwner {
+    require(_taxCut <= BPS, "Tax cut cannot exceed 100%");
    taxCut = _taxCut;
  }
```

### Assessed type

Math

**[TForge1 (TraitForge) confirmed](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#event-13827201461)** 

**[ZdravkoHr (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2299795712):**
 > @Koolex - I think this issue depends on assumptions that were not confirmed when the audit was running.
> 
> What we see in the codebase is a `taxCut` variable that represent a part of the whole. Nowhere it was said that this cut has to be in percents. In fact, the only place where percents are mentioned, is the second link attached to the report that says 10%. And really, when you divide by 10, you get 10%. 

**[jesjupyter (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2300197898):**
 > I think this issue is pretty easy to solve so it's actually not a valid issue. Here, if we want 5% rate, we just set `taxcut` to 20. If we want 20%, set it to 5. Nothing will be changed, so this issue looks like an admin input error.

**[samuraii77 (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2301225418):**
 > The sponsor has confirmed this one so your assumptions are incorrect. It is supposed to be a %.

**[Abdessamed (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2301328853):**
 > @ZdravkoHr 
> 
> > Nowhere it was said that this cut has to be in percents 
>     
> All examples in the docs are referred to a %, not a share.
>
> > In fact, the only place where percents are mentioned, is the second link attached to the report that says 10%. And really, when you divide by 10, you get 10%.
> 
> There is an explicit `setTaxCut` function on every contract that demonstrates tax fees can change.
>    
> @jesjupyter - What you are proposing is just a *workaround*. Semantically, the tax represents a fee percentage and that's how it is expected by admins to work when calling `setTaxCut`.

**[Kalogerone (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2301961194):**
 > The [`setTaxCut`](https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/EntityForging/EntityForging.sol#L36) function is `onlyOwner` protected:
> 
> ```solidity
>   function setTaxCut(uint256 _taxCut) external onlyOwner {
>     taxCut = _taxCut;
>   }
> ```
> 
> All owner actions are trusted. The owners can still set the `taxCut` to their desired value, so nothing is really broken. Nowhere it was mentioned that setting `taxCut` to 20 should mean 20%. `TRUSTED` function and still works anyway, probably a low/info.

**[Koolex (judge) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2312439325):**
 > It is clearly intended to be a percentage. We can see this from the comment in the code:
> 
> ```
>   // Fallback function to receive ETH and update fund balance
>   receive() external payable {
>     uint256 devShare = msg.value / taxCut; // Calculate developer's share (10%)
>     uint256 remainingFund = msg.value - devShare; // Calculate remaining funds to add to the fund
> ```
> 
> [contracts/NukeFund/NukeFund.sol:L38-L43](https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/NukeFund/NukeFund.sol#L38-L43)
> 
> This is not an admin issue, but the code is not working as intended (i.e., percentage based calculations).

**[KupiaSec (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/221#issuecomment-2327815555):**
 > @Koolex - I don't understand why it is clearly intended to be a percentage in the following code.
> I believe it is meant to be a denominator, as `1/10` equals `10%`.
> ```solidity
>     uint256 public taxCut = 10;
>         [...]
>     uint256 devShare = msg.value / taxCut;  // Calculate developer's share (10%)
> ```
> 
> This is the code from a audit in which I participated.
>
> ```solidity
>         // 20% of last users receive rewards
>         uint256 Amount;
>         if (share == 0 && block.timestamp >= time) {
>             share = totalSupply() / 5;  
>         }
> ```
> 
> Perhaps it would be better to use `taxcut` as a percentage, but that's a design choice rather than an issue.

***
