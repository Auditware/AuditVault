---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
  - novelty/variant
  - sector/token
protocol: "[[Gorples EVM Contracts Revision]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/gorples-evm-contracts-revision"
genome:
  - "[[wrong-condition]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# Missing xGorplesToken decrement in finalizeRedeemFor()

- id: 51279
- impact: HIGH
- protocol: [[Gorples EVM Contracts Revision]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/gorples-evm-contracts-revision

## Summary


The bug report is about a missing line of code in a function called `finalizeRedeemFor` in the `xGorplesToken` contract. This function is responsible for finalizing the redemption process for users by transferring the appropriate amount of `GorplesCoin` tokens and burning the excess. However, unlike another similar function called `finalizeRedeem`, `finalizeRedeemFor` does not correctly update the user's `xGorples` balance after the redemption process is completed. This can lead to incorrect balances and potentially allow users to redeem more tokens than they should.

To demonstrate the issue, the report includes a proof of concept test that shows the incorrect behavior of the `finalizeRedeemFor` function. The test works correctly when using the `finalizeRedeem` function, which indicates that the missing line of code is the cause of the bug.

The report also includes a recommendation to add the missing line of code to the `finalizeRedeemFor` function to ensure the correct balance updates for users. The remediation plan shows that the issue has been solved by adding the missing line of code to the function.

Overall, this bug report highlights a missing line of code that can potentially lead to incorrect balances and allows users to redeem more tokens than they should. The issue has been resolved by adding the missing line of code to the function responsible for updating the user's balance.

## Details

##### Description

In the `xGorplesToken` contract, the function `finalizeRedeemFor` is responsible for finalizing the redeeming process for a user by transferring the appropriate amount of `GorplesCoin` tokens and burning the excess. However, unlike the `finalizeRedeem` function, `finalizeRedeemFor` does not correctly decrement the user's `xGorples` balance after finalizing the redemption.

```
function finalizeRedeem(uint256 redeemIndex) public nonReentrant validateRedeem(msg.sender, redeemIndex) {
    RedeemInfo storage _userRedeem = userRedeems[msg.sender][redeemIndex];

    xBorpaBalances[msg.sender] = xBorpaBalances[msg.sender] - _userRedeem.xBorpaAmount;
    // .. // 
}

function finalizeRedeemFor(address _for) external onlyRole(SYSTEM) {
    uint256 len = userRedeems[_for].length;
    //E @audit missing decrement
    while (len > 0) {
        RedeemInfo storage _userRedeem = userRedeems[_for][len - 1];
        bool finalized = _easyFinalizeRedeem(
            _for,
            _userRedeem.xBorpaAmount,
            _userRedeem.endTime
        );

        if (finalized) {
            _deleteRedeemEntry(len - 1, _for);
        }

        len -= 1;
    }
}
```

This missing decrement operation results in incorrect `xGorples` balances, which can lead to the user having an inflated balance and potentially redeeming more `Gorples` tokens than they should be entitled to.

##### Proof of Concept

```
    function testFinalizeRedeemPOC(uint256 amount) public {
        //vm.assume(amount > 1e10 && amount <= INITIAL_LOOT_SUPPLY);
        amount = 10e9;
        // how can we transfer if transfers are banned ??? 
        // test invalid
        // borpa.transfer(user, amount);
        deal(address(borpa), user, 100e18, true); 

        console.log(borpa.balanceOf(user));

        vm.startPrank(user);
        borpa.approve(address(xBorpa), type(uint256).max);

        xBorpa.convert(amount);

        console.log("calling redeem");
        amount = amount * BURN_REMAINS / BURN_DENOMINATOR;

        xBorpa.redeem(amount);

        vm.warp(block.timestamp + xBorpa.REDEEM_DURATION());

        uint before = borpa.balanceOf(user);

        uint256 len = xBorpa.getUserRedeemsLength(user);
        console.log("len", len);

        (uint256 xbrp, uint256 time) = xBorpa.getUserRedeem(user, 0);
        console.log("xbrp", xbrp, "time", time);

        assertEq(xbrp, amount);
        assertEq(len, 1);

        console.log("Calling finzalize redeem");
        xBorpa.finalizeRedeem(0);
        amount = amount * BURN_REMAINS / BURN_DENOMINATOR;

        uint afterBalance = borpa.balanceOf(user) - before;

        assertApproxEqRel(afterBalance, amount, 1e10);
        assertEq(xBorpa.balanceOf(address(xBorpa)), 0);
        assertEq(xBorpa.getUserRedeemsLength(user), 0);
        assertEq(xBorpa.xBorpaBalances(user), 0);
    }

    function testFinalizeRedeemPOCFor(uint256 amount) public {
        //vm.assume(amount > 1e10 && amount <= INITIAL_LOOT_SUPPLY);
        amount = 10e9;
        // how can we transfer if transfers are banned ??? 
        // test invalid
        // borpa.transfer(user, amount);
        deal(address(borpa), user, 100e18, true); 

        console.log(borpa.balanceOf(user));

        vm.startPrank(user);
        borpa.approve(address(xBorpa), type(uint256).max);

        xBorpa.convert(amount);

        console.log("calling redeem");
        amount = amount * BURN_REMAINS / BURN_DENOMINATOR;

        xBorpa.redeem(amount);

        vm.warp(block.timestamp + xBorpa.REDEEM_DURATION());

        uint before = borpa.balanceOf(user);

        uint256 len = xBorpa.getUserRedeemsLength(user);
        console.log("len", len);

        (uint256 xbrp, uint256 time) = xBorpa.getUserRedeem(user, 0);
        console.log("xbrp", xbrp, "time", time);

        assertEq(xbrp, amount);
        assertEq(len, 1);

        console.log("Calling finzalize redeem For");
        vm.stopPrank();
        vm.startPrank(admin);
        xBorpa.finalizeRedeemFor(address(user));
        vm.stopPrank();

        amount = amount * BURN_REMAINS / BURN_DENOMINATOR;

        uint afterBalance = borpa.balanceOf(user) - before;

        assertApproxEqRel(afterBalance, amount, 1e10);
        assertEq(xBorpa.balanceOf(address(xBorpa)), 0);
        assertEq(xBorpa.getUserRedeemsLength(user), 0);
        assertEq(xBorpa.xBorpaBalances(user), 0);
    }
```

As it can be seen in the tests, the one using `finalizeRedeem` work because `xGorplesToken` decrement is implemented in it but the test using `finalizeRedeemFor` does not work and the assertion cannot be verified:

![POC_Result](https://halbornmainframe.com/proxy/audits/images/668bed4a887c15dd374dcff5)

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:M/A:N/D:N/Y:M/R:N/S:C (7.8)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:M/A:N/D:N/Y:M/R:N/S:C)

##### Recommendation

It is recommended to add the missing decrement operation to the `finalizeRedeemFor` function to ensure the user's `xGorples` balance is correctly updated.

  

Remediation Plan
----------
---
---

**SOLVED:** The missing decrement line has been added to `finalizeRedeemFor.`

##### Remediation Hash

<https://github.com/Entangle-Protocol/gorples-evm/pull/73/commits/8933586fc324d8e69fbdf00c816817909c50a061>

##### References

[Entangle-Protocol/gorples-evm/contracts/xGorplesToken.sol#L368](https://github.com/Entangle-Protocol/gorples-evm/blob/main/contracts/xGorplesToken.sol#L368)
