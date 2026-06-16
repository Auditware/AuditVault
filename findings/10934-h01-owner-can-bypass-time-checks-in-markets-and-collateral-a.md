---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/lending
protocol: "[[HoldeFi]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/holdefi-audit/"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H01] Owner can bypass time checks in markets and collateral assets

- id: 10934
- impact: HIGH
- protocol: [[HoldeFi]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/holdefi-audit/

## Summary


The HoldefiSettings contract is responsible for managing some of the most important actions that the admin of the system can perform, such as adding and removing markets, adding and removing collateral assets, setting a borrow rate, setting a suppliers share rate for a given market, and setting the value to loan rate, penalty rate, and bonus rate for a particular collateral asset. 

To ensure that only the owner can make changes to the system's attributes, the contract is designed to inherit functionalities from the Ownable contract, and all functions are guarded by the onlyOwner modifier. 

In order to prevent quick changes in the parameters from harming users, there is a time-off period in which the owner cannot increase its values for a particular market or collateral. However, the owner can bypass this process by removing and re-adding an already existent market or collateral. 

Therefore, it is suggested to add a time check to apply the same logic of the time-off period to a previously removed market or collateral, so the owner cannot bypass the time restrictions while changing the parameters.

## Details

The [`HoldefiSettings` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol) is in charge of managing some of the most important actions that the admin of the system can perform, such as [add and remove markets](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L176-L208), [add and remove collateral assets](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L211-L234), [set a borrow rate](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L135-L153) and [set a suppliers share rate](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L156-L165) for a given market, and finally [set the value to loan rate](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L237-L253), [set the penalty rate](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L256-L273) and [set a bonus rate](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L276-L284) for a particular collateral asset.


Because these actions are critical in the financial behavior of the project, [this contract inherits functionalities from the `Ownable` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L17), and all these mentioned functions are guarded by [the `onlyOwner` modifier](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Ownable.sol#L20) so the owner is the only one that can modify the system’s attributes, and add or remove assets from the project.


Also, because quick changes in the parameters may harm users while using the system, there is a [time-off period](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L23) in which the owner [cannot increase its values](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L141) for a particular market or collateral.


Nevertheless, there is a feasible scenario where the owner can easily bypass this process by removing and re-adding an already existent market or collateral. For instance, given a specific market, the owner can call [the `removeMarket` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L205), which will only set [the respective `isActive` flag for that market](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L206) as false, and then call [the `addMarket` function for that same market](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L176) but with some new parameters that the owner may use for their own benefit.


Additionally, if these two calls are done in order using a high gas price and the first one with an even higher value, and then these frontrun a user’s transaction performed to the [`Holdefi` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol), the owner could potentially benefit from these modifications even in the short term.


This same procedure also applies similarly to the analogous [`addCollateral`](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L211) and [`removeCollateral`](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L231) functions that modify the parameters of the whitelisted collaterals.


Consider adding a time check to apply the same logic of the time-off period to a previously removed market or collateral so the owner cannot bypass the time restrictions while changing the parameters.
