---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2026-11-05
submitted: 2026-08-15T04:52:27.098Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "0xbs0d27"
source: "https://hackerone.com/reports/3941626"
title: "Instamojo CampTix: fail-open MAC + webhook Credit without binding payment to order"
---
# Instamojo CampTix: fail-open MAC + webhook Credit without binding payment to order

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** WordPress | **Disclosed:** 2026-11-05

- Report: [https://hackerone.com/reports/3941626](https://hackerone.com/reports/3941626)
- CWE: Improper Access Control - Generic
- Submitted: 2026-08-15T04:52:27.098Z

## Report summary

Instamojo payment addon never tied an Instamojo payment to a specific ticket order (unlike Razorpay in the same plugin).
An attacker could get tickets marked “pending” or “paid” without a matching payment—e.g. bad webhook signatures still advanced status, or a real payment for one order could complete another.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Broken payment binding in the CampTix Instamojo addon allows ticket attendees to be marked `pending` or `publish` without proving that an Instamojo payment belongs to that CampTix order.

There is a single root cause in `CampTix_Payment_Method_Instamojo`: the gateway never verifies and binds the Instamojo payment to the CampTix order (no stored `payment_request_id` / amount). Three paths share that root:

1. `payment_return`: a draft order’s `tix_payment_token` alone triggers `PAYMENT_STATUS_PENDING` with no Instamojo API verification.
2. `payment_notify` with invalid MAC: fail-open — a bad HMAC still calls `payment_result(…, PENDING)`.
3. `payment_notify` with valid MAC + Credit: applies `COMPLETED` using `tix_payment_token` from the query string, which is not covered by the MAC (MAC signs POST body only). There is no bind to `payment_request_id` or amount. A legitimate Credit webhook for a cheap payment on the same merchant can complete a different order → `publish`.

This is not by design. The sibling Razorpay method in the same plugin (~1.9) stores `_razorpay_order_id` / `_razorpay_amount`, verifies with `hash_equals`, and refuses unpaid / mismatched returns without changing status (`wp_die`). SSLCommerz, SurjoPay, and Stripe follow the same bind+amount pattern. Instamojo was left behind.

## Affected Asset / Component

- Program asset: WordCamp.org
- Component: `campt-indian-payment-gateway` (Instamojo addon)
- File: `public_html/wp-content/plugins/campt-indian-payment-gateway/inc/instamojo/class-camptix-payment-method-instamojo.php`
- Functions: `payment_return()`, `payment_notify()`, `payment_checkout()`
- Sibling (correct): `…/razorpay/class-camptix-payment-method-razorpay.php`

## Vulnerable Code

### Instamojo — return marks PENDING with no payment verify

```php
// payment_return()
if ( 'draft' == $attendee->post_status ) {
    return $this->payment_result( $payment_token, CampTix_Plugin::PAYMENT_STATUS_PENDING, $payment_data );
}




Instamojo — notify fail-open + Credit without order bind

// payment_notify()
$mac_calculated = hash_hmac( "sha1", implode( "|", $data ), $instamojo_salt );
if ( $mac_provided == $mac_calculated ) {
    return $this->payment_result(
        $_REQUEST['tix_payment_token'],
        CampTix_Plugin::PAYMENT_STATUS_COMPLETED,
        /* ... */
    );
} else {
    // FAIL-OPEN: invalid MAC still marks PENDING
    return $this->payment_result( $_REQUEST['tix_payment_token'], CampTix_Plugin::PAYMENT_STATUS_PENDING, $payment_data );
}


Instamojo — checkout puts token in webhook URL, does not persist request id

$notify_url = add_query_arg( array(
    'tix_action'         => 'payment_notify',
    'tix_payment_token'  => $payment_token,
    'tix_payment_method' => 'instamojo',
), $this->get_tickets_url() );
// payload includes 'webhook' => $notify_url
// no update_post_meta( ..., 'payment_request_id', ... )  (unlike Razorpay)

Correct sibling pattern (Razorpay)

$expected_order_id = (string) get_post_meta( $attendee->ID, '_razorpay_order_id', true );
if ( $expected_order_id && ! hash_equals( $expected_order_id, $razorpay_order_id ) ) {
    wp_die( /* refuse — do not change status */ );
}
if ( null === $status ) { // unpaid / unverified
    wp_die( /* refuse — do not mark pending */ );
}



Steps To Reproduce
Preconditions (source review): access to the public WordPress/wordcamp.org repository (e.g. production branch). No live exploitation against production WordCamps is required or requested.

Open public_html/wp-content/plugins/campt-indian-payment-gateway/inc/instamojo/class-camptix-payment-method-instamojo.php.

In payment_return(), locate the branch that runs when the attendee post_status is draft. Observe that it calls payment_result( $payment_token, PAYMENT_STATUS_PENDING, … ) without any Instamojo API call that confirms the payment for that token.

In payment_notify(), locate the HMAC check (hash_hmac / $mac_provided). Observe the else branch: when the MAC does not match, the code still calls payment_result( $_REQUEST['tix_payment_token'], PAYMENT_STATUS_PENDING, … ) — fail-open (invalid auth → pending), not reject.

In the MAC-valid branch, locate Credit / Completed handling. Observe that COMPLETED is applied using $_REQUEST['tix_payment_token'] (query parameter on the notify URL). Confirm that:

the MAC is computed over the POST body fields only (after unsetting mac);
checkout sets 'webhook' => $notify_url where $notify_url embeds tix_payment_token in the query string;
checkout does not update_post_meta a payment_request_id (or amount) onto the attendee.
Control comparison (proves intent): open the sibling …/razorpay/class-camptix-payment-method-razorpay.php. Confirm it stores _razorpay_order_id / _razorpay_amount at checkout, uses hash_equals on return, and wp_dies without changing status when the order id mismatches or payment is unpaid. Same plugin family; Instamojo lacks that binding.

Impact mapping in CampTix core: in camptix/camptix.php → payment_result(), confirm PAYMENT_STATUS_PENDING → post_status = pending, PAYMENT_STATUS_COMPLETED → post_status = publish, and that get_purchased_tickets_count() / ticket email / access flows treat pending and publish as purchased-capable states.

Recommendations
Mirror the Razorpay sibling in the same plugin:

On Instamojo checkout, persist payment_request_id and expected amount on the attendee/order (like _razorpay_order_id / _razorpay_amount).
payment_return: only call payment_result after Instamojo API confirms the request and it matches the stored binding/amount; otherwise refuse without changing status.
payment_notify: invalid MAC → reject / log / FAILED — never PENDING. Use hash_equals for MAC comparison.
On Credit: resolve the CampTix order from the bound payment_request_id (or require the query token to match the stored binding); verify amount vs CampTix order total before COMPLETED.
Also recommended:

Regression tests: invalid MAC must not mark pending; Credit webhook must not complete an order that does not own that payment_request_id / amount.
Audit other CampTix gateways for “query token + unsigned URL” binding gaps (same class of bug).

## Impact

Ticket inventory consumption (pending and publish count in get_purchased_tickets_count)
Ticket emails via email_tickets() on status transition from draft
Attendee access flows that accept pending
Strongest path: authentic Credit webhook for a cheap payment on the same merchant can complete a different (e.g. expensive) order → publish
Same bug class WordCamp already hardened against in Razorpay / SSLCommerz / SurjoPay / Stripe; Instamojo remains vulnerable
Logic error / broken authorization at the payment boundary (not theoretical; sibling code shows intended secure behavior)

## Timeline

- **Report Filed**
- **Report Resolved**
- **2026-08-27** @0xbs0d27: Thanks for resolving. Could you clarify why this was closed without a bounty?
- **2026-08-27** @bornull: @0xbs0d27, this shows as resolved because it is resolved, on the technical side :) 

The next step after the resolution is the bounty admin review. You should hear from them soon.
- **Bounty Awarded**
- **2026-11-05** @0xbs0d27: Hi @bornull and team — thank you again for resolving this and for the bounty; really appreciated.

This has been Resolved since August, and I wanted to ask gently: if it works for you, would you mind approving public disclosure so it can show up in Hacktivity, similar to your other WordCamp/meta reports?

I’ve added a short Hacker summary for the public view — happy to tweak anything if you’d like changes before approving.

Thanks so much, and thanks again for your work on this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
