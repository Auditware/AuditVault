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
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# A malicious shareholder can launch a DoS attack

- id: 65063
- impact: HIGH
- protocol: [[Franklin Templeton Aptos Money Market Fund]]
- reporter: Jaime Iglesias (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf

## Summary


This report discusses a security issue related to a function called `cancel_self_service_request` which is used to cancel requests made by shareholders. The function does not check if the request was made using self-service and does not ensure that the shareholder is canceling their own request. This can be exploited by a malicious shareholder to launch a denial-of-service attack by continuously deleting requests made by other shareholders. The report suggests short-term and long-term solutions to address this issue, including improving error handling and negative unit testing.

## Details

## Security Assessment - Denial-of-Service Attack

## Difficulty: Medium

## Type: Timing

## Description
A malicious shareholder can launch a denial-of-service (DoS) by canceling all other shareholder requests. A shareholder who wishes to cancel a self-service request can use the `cancel_self_service_request` function (Figure 3.1). The function should allow a shareholder to cancel requests that were (1) created when self-service was enabled and (2) made by the shareholder.

```plaintext
710    public entry fun cancel_self_service_request(
711       caller: &signer,
712       request_id: u64,
713       memo: String,
714    ) acquires ManagedShareHolders {
715       only_when_initialized();
716       only_when_account_exists(signer::address_of(caller));
717
718       let managed = borrow_global_mut<ManagedShareHolders>(@ft_funds);
719       let shareholders = &mut managed.shareholders;
720       let shareholder = smart_table::borrow_mut(shareholders, signer::address_of(caller));
721
722       // remove transaction from the list of pending transactions
723       if (smart_table::contains(&managed.pending_transactions, request_id)) {
724           smart_table::remove(&mut managed.pending_transactions, request_id);
725       };
726
727       // remove transaction request id from the vector of request ids (keys)
728       let (ok, index) = vector::index_of(&shareholder.request_ids, &request_id);
729       if (ok) {
730           let counter = shareholder.counter;
731           vector::remove(&mut shareholder.request_ids, index);
732           shareholder.counter = counter - 1;
733       };
734
735       // remove from the vector used to track of accounts with pending transactions
736       if (vector::length(&shareholder.request_ids) == 0) {
737           let (ok, index) = vector::index_of(&managed.shareholder_accounts_with_pending_transactions, &signer::address_of(caller));
738           if (ok) {
739               let counter = managed.shareholder_accounts_with_pending_transactions_counter;
740               vector::remove(&mut managed.shareholder_accounts_with_pending_transactions, index);
741               managed.shareholder_accounts_with_pending_transactions_counter = counter - 1;
742           };
743       };
751    }
```

**Figure 3.1:** `funds/sources/fund_token.move#L710–L751`

However, neither constraint highlighted above is satisfied. Note that the function does not check whether the request that is trying to be canceled was created using the self-service capability. Thus, requests made with or without self-service can now be canceled.

More importantly, there is nothing to guarantee that the shareholder is canceling a request that they created. As shown by lines 728-729 in Figure 3.1, no error is thrown if the request ID is not found in the vector of requests created by the shareholder. Thus, the deletion of the request in lines 723-725 will succeed. In fact, an error should be thrown if the request ID cannot be found at all. Moreover, lines 737-738 should also throw an error if the user cannot be found in the vector (note, however, that this check can be bypassed).

## Exploit Scenario
Eve, a malicious shareholder, launches a DoS attack by continuously deleting all requests made by other shareholders. This would prevent the settlement of any future shareholder transaction.

## Recommendations
Short term, update the `cancel_self_service_request` as follows:
1. Throw an error if the shareholder does not own the request ID that they are trying to delete.
2. Throw an error if the request ID cannot be found in the `managed.pending_transactions` smart table.
3. Ensure that the request was made while self-service was enabled. This can be checked by ensuring that the `pending_transaction.self_service` variable is true.
4. Throw an error if the shareholder account is not in the `managed.shareholder_accounts_with_pending_transactions` vector.

Long term, improve negative unit testing to validate how functions behave with bad user inputs; this will aid in identifying additional edge cases like this. Additionally, improve error handling throughout the system. We identified many instances where functions will continue execution when in fact an error should be thrown. Note that thorough error handling directly aids in negative unit testing.
