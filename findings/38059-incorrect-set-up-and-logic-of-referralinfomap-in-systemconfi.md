---
tags:
  - platform/codehawks
  - lang/solidity
  - severity/high
  - sector/launchpad
protocol: "[[Tadle]]"
auditors:
  - "[[unnamed]]"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[bridge-sender-auth]]"
  - "[[frontrun-exposure]]"
---
# Incorrect set up and logic of `referralInfoMap` in `SystemConfig::updateReferrerInfo` function

- id: 38059
- impact: HIGH
- protocol: [[Tadle]]
- reporter: unnamed (Codehawks)
- source: N/A

## Summary


The bug report discusses an issue with the `referralInfoMap` in the `SystemConfig::updateReferrerInfo` function. The problem is that the function allows anyone to set arbitrary values for the `referrer`, `referrerRate`, and `authorityRate`, and the address for which the mapping is set is also incorrect. This can lead to incorrect allocation of referral bonuses and someone can even set their own address as the referrer, resulting in receiving discounts for both themselves and the referrer. The report suggests making the referrer call the function as `msg.sender` and passing the authority as a parameter to avoid these issues. 

## Details

## Summary
- The `referralInfo` contains 3 members: `referrer`, `referrerRate` and `authorityRate`.
- Here referrer is the person which has referred the other person.
- The referralInfoMap contains a mapping from an address to `ReferralInfo`, where it is expected to return the 3 members mentioned above for a person who is referred by the `referrer`, but the `referralInfoMap` sets the referrer address to all the 3 members which is incorrect.
- As well as anyone can call the function to update the mapping for any address and set arbitrary value for whole mapping members as well as the address for which the mapping is mapped to `referralInfo`

## Vulnerability Details
- The vulnerability is present in the `updateReferrerInfo` function where it allows the caller to set up any arbitrary values for the `referrer`, `referrerRate` and `authorityRate`, as well as the address for which mapping is mapped from is also set to as `referrer`.
- As a result of which anyone can maliciously set values for anyone, but where it is expected that the referrer should only be able to set value for the person to whom he is referring.
- When a user calls the `updateReferrerInfo` function, it sets the mapping as `referralInfoMap[referrer]`, and sets up all the values as passed.

- The referral bonus is allocated during the call to `createTaker` via `_updateReferralBonus` function, where it uses the values as:
```
referralInfoMap[msg.sender], where msg.sender is the one to whom referrer has referred to
```
- The vulnerability occurs due to the fact that the function allows to set the referrer to any arbitrary address by the caller to their own referral, where it was expected that the referrer should be the `msg.sender` and the caller sets up the mapping's  address from which is mapped to the authority rate which is expected to be passed in the function instead of referrer.

Therefore, it was expected that the caller for `updateReferrerInfo` function should only be the referrer and sets the authority to whom he is referring to.


## Impact
- Incorrect values are set in the `referralInfoMap` which leads to incorrect allocation in `createTaker` function's referral allocation.
- As a user can call the function with any arbitrary address, therefore they can set up their own other address as referrer where `referrer` as well as the authority to whom referrer is expected to refer to is set to a single address, so a user gets whole discount on platform fee for both referrer and their own (i.e. authority).
- Also, anyone can front-run the `updateReferrerInfo` function before a user calls `createTaker` and can maliciously update the authorityRate or the referralRate as a result of which the taker will experience different results.

## Tools Used
Manual Review

## Recommendations
Make the referrer to call the `updateReferrerInfo` as msg.sender, and pass `authority` as a parameter to be set up as the one to whom referrer is referring to.
