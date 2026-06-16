---
tags:
  - lang/rust
  - sector/nft
  - platform/auditware
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Rarible]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[royalty-edge-cases]]"
---
# **AW-H-01: Missing Market Closure Functionality** {#aw-h-01:-missing-market-closure-functionality}

**Severity:** *High*							

**Code:**

* [rarible\_marketplace/src/state/market.rs\#L70-L117](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/state/market.rs#L70-L117)

**Description:**  
During the audit it was found that the **Market** struct does not have an implementation to update the market state to “closed”, despite having checks to determine if it’s closed or not (e.g. [is\_active](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/state/market.rs#L97-L99)).

This creates a security and operational risk, as the market owner is unable to react to security incidents, misconfigurations, or emergency shutdown scenarios.

Without the ability to close the market, any discovered vulnerabilities or active exploits remain live, leading to possible financial loss, data corruption, or system compromise.

**Recommendations:**

* Implement a Market closure functionality within the **Market** struct, for example:  
  \+   /// close the market  
  \+   pub fn close(&mut self) {  
  \+       self.state \= MarketState::Closed.into();  
  \+   }


# **AW-M-01: Incorrect Fee Calculation** {#aw-m-01:-incorrect-fee-calculation}

**Severity:** *Medium*							

**Code:**

* [rarible\_editions\_controls/src/instructions/mint\_with\_controls.rs\#L235-L237](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_editions_controls/src/instructions/mint_with_controls.rs#L235-L237)

**Description:**  
During the audit it was found that when **is\_fee\_flat** is true, **total\_fee** is not being properly deducted from **price\_amount**.

This results in the **remaining\_amount** being miscalculated, causing the treasury not to receive the correct fee amount leading to loss of funds for the treasury and damage overall program integrity.

**Recommendations:**

* Ensure **total\_fee** is being properly deducted from **price\_amount**, for example:  
  remaining\_amount \= price\_amount  
  \+ .checked\_sub(total\_fee)  
  \+ .ok\_or(EditionsControlsError::FeeCalculationError)?;

# **AW-M-02: Fee Only Sent to First Recipient** {#aw-m-02:-fee-only-sent-to-first-recipient}

**Severity:** *Medium*							

**Code:**

* [rarible\_editions\_controls/src/instructions/mint\_with\_controls.rs\#L282-L282](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_editions_controls/src/instructions/mint_with_controls.rs#L282-L282)

**Description:**  
In the **mint\_with\_controls** function, platform fees are distributed to recipients in a loop like so:

   // Distribute fees to recipients  
   for (i, recipient\_struct) in recipients.iter().enumerate() {  
	..

During the audit, it was found that there is a [break](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_editions_controls/src/instructions/mint_with_controls.rs#L282-L282) statement inside of the loop, that causes the loop to exit after processing only the first recipient.

As a result, only the first recipient receives the platform fee, and subsequent ones are ignored. This causes other fee recipients to not receive their fees, and damages the program’s integrity.

**Recommendations:**

* To ensure that platform fees are correctly distributed to all intended recipients, the **break** statement should be removed, and the loop should continue to process all recipients.  
* Additionally, ensure you handle multiple recipient accounts correctly by matching the index to the appropriate account.

# **AW-M-03: Inconsistent NFT Fee Deduction** {#aw-m-03:-inconsistent-nft-fee-deduction}

**Severity:** *Medium*							

**Code:**

* [rarible\_marketplace/src/instructions/order/fill.rs\#L629-L812](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/fill.rs#L629-L812)

**Description:**

During the audit, an inconsistency was found between the fee deduction done on WNS versus non-WNS NFTs, following is the relevant part of the inconsistent logic:

if \*nft\_program\_key \== WNS\_PID {

   // ...

   seller\_received\_amount \= seller\_received\_amount

   	.checked\_sub(royalties).unwrap()

   	.checked\_sub(fee\_amount).unwrap();

} else {

   // ...

   seller\_received\_amount \= seller\_received\_amount

.checked\_sub(royalties).unwrap();

}
