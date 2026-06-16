---
tags:
  - lang/move
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Franklin Templeton Aptos Money Market Fund]]"
auditors:
  - "[[Jaime Iglesias]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# Insufficient checks during request settlement

- id: 65067
- impact: HIGH
- protocol: [[Franklin Templeton Aptos Money Market Fund]]
- reporter: Jaime Iglesias (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf

## Summary


This report describes a bug in a system that manages requests for transferring shares and liquidating cash. Currently, the system performs checks when a request is created, but not when the request is processed. This can lead to unexpected behavior, such as frozen accounts interacting with the system or requests that cannot be fulfilled. This bug can also cause a temporary denial of service until the invalid requests are canceled. A malicious user could exploit this bug by creating multiple requests right before their account is frozen, effectively distributing their funds across multiple accounts. The report recommends performing additional checks during request settlement and thoroughly documenting this behavior. 

## Details

## Diﬃculty: High

## Type: Denial of Service

## Description

Currently, whenever a request is created, a number of checks are performed before the request is added to the queue. However, the checks are not performed again at the moment the request is processed, which can lead to unexpected behavior. 

Whenever a request is created, either by the admin or by the user through the self-service, a number of checks are performed based on the type of request that is being created. For example, when a shareholder requests to transfer their shares to another shareholder, various checks-such as whether the sender has enough balance, or that neither of the shareholders is frozen-are performed (Figure 7.1).

```rust
532    public entry fun request_share_transfer(
533       caller: &signer,
534       account: address,
535       destination: address,
536       shares: u64,
537       memo: String,
538    ) acquires ManagedShareHolders, FundManagement {
539       only_whitelisted(caller);
540       only_when_initialized();
541       only_when_account_exists(account);
542       only_when_account_exists(destination);
543       only_when_account_not_frozen(account);
544       only_when_account_not_frozen(destination);
545       only_when_shareholder_has_shares(account);
546       only_higher_than_zero(shares);
547       only_when_shareholder_has_enough_shares(account, shares);
548
549       create_pending_transaction(account, destination, TX_TYPE_SHARE_TRANSFER,
shares, false, memo);
550    }
```
*Figure 7.1: The `request_share_transfer` function in `fund_token.move` (Lines 532–550)*

Another example is whenever a user requests a cash liquidation. In this case, the user states an amount of cash they would like to receive, and the fund will burn user shares equivalent to that cash amount. For this example, the function will check that the user is not frozen and that it has enough shares to burn for the amount of cash they would like to receive using the current price (Figure 7.2).

```rust
490    public entry fun request_cash_liquidation(
491       caller: &signer,
492       account: address,
493       amount: u64,
494       memo: String,
495    ) acquires ManagedShareHolders, FundManagement {
496       only_whitelisted(caller);
497       only_when_initialized();
498       only_when_account_exists(account);
499       only_when_account_not_frozen(account);
500
501       let managed = borrow_global_mut<ManagedShareHolders>(@ft_funds);
502       let price = managed.last_price;
503
504       only_valid_price(price);
505       only_when_shareholder_has_enough_amount(account, amount, price);
506
507       create_pending_transaction(account, @0x0, TX_TYPE_CASH_LIQUIDATION,
amount, false, memo);
508    }
```
*Figure 7.2: `request_cash_liquidation` function in `fund_token.move` (Lines 490–508)*

The aforementioned checks prevent unwanted behavior, such as frozen accounts interacting with the fund or users creating requests that cannot be fulfilled. However, as shown in the figure below, these checks are not present during the settlement of requests.

```rust
1127    fun process_settlements(
1128       account: address,
1129       date: u64,
1130       price: u64,
1131       memo: String,
1132    ) acquires ManagedShareHolders, FundManagement {
1133       only_when_account_exists(account);
1134
1135       let fund = borrow_global<FundManagement>(@ft_funds);
1136       let managed = borrow_global_mut<ManagedShareHolders>(@ft_funds);
1137       let shareholders = &mut managed.shareholders;
1138       let shareholder = smart_table::borrow_mut(shareholders, account);
1139       let resource_signer = &account::create_signer_with_capability(&fund.resource_signer_cap);
1140
```
*Figure 7.3: `process_settlements` function in `fund_token.move` (Lines 1127–1244)*

This behavior is problematic because the state of the fund can change between the moment a request is created and the moment it is fulfilled by the admin. For example, an admin might freeze a shareholder’s account while they have pending requests, thus breaking the assumption that frozen shareholders cannot interact with the system.

This is also problematic because it can lead to the creation of requests that cannot be fulfilled because requests validate the current state of the fund, not the state of the fund after previous requests have been fulfilled. For example, a user could technically create multiple requests to transfer their entire balance to different shareholders; however, the moment the first request is fulfilled by the `process_settlements` function, all subsequent requests will fail, leading to a temporary DoS until the invalid requests are canceled.

Finally, this can also be applied to the share price, which is updated before the requests are settled; this could lead to undefined behavior. For example, a user may request a share purchase but will receive more or fewer shares than they expected because the price fluctuated when the request was fulfilled.

## Exploit Scenario

Eve, a malicious user, creates an account and interacts with the fund by making a number of cash purchases. After some time, the AML policy is triggered, and Eve’s account has to be frozen. Before her account is frozen, Eve creates a series of self-service requests that distribute her share balance across many other accounts. The admin freezes Eve’s account, effectively preventing her from interacting with the fund anymore. However, unbeknownst to the administrators, during the execution of the `end_of_day` function, Eve’s pending requests are executed, effectively distributing her funds across many accounts and potentially giving her a chance to cash out.

## Recommendations

**Short-term:** Perform additional checks for each request type during the settlement of requests to avoid unwanted behavior and prevent failing requests from triggering a DoS (e.g., by catching the error). Note that choosing the right policy (i.e., catching the error and settling the next request from the same shareholder instead of skipping the shareholder altogether) is not a decision that should be taken lightly, and whatever decision is made should be thoroughly documented.

**Long-term:** Thoroughly document this behavior and incorporate additional unit tests to verify that the intended behavior is preserved during each one of the request settlements.
