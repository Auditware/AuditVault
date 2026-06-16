---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/governance
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[missing-check]]"
  - "[[wrong-state]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# Users can cast vote without actually holding tokens

- id: 64498
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The bug report describes an issue in the `voting.rs` file where users are able to vote for protocol decisions with inflated token balances. This is possible due to a flaw in the timing of deposits and withdrawals during an active voting period. A malicious user can deposit and withdraw tokens in a way that allows them to vote with tokens they do not actually possess. The report includes a step-by-step walkthrough of how this exploit can be carried out and the impact it can have on the voting system. The bug has been fixed in the Deriverse protocol and has been verified by Cyfrin.

## Details

**Description:** In `voting.rs` users can vote for protocol decisions with the `drvs` tokens they posses in their respective client accounts. However this mechanism can be abused by users where users can vote with inflated token balances by exploiting the timing of deposits and withdrawals during an active voting period. A malicious user would deposit a few tokens in a period and withdraw those tokens and yet can vote with those tokens, without actually holding them.

Step by step walkthrough:
Voting Period 1: Slots 60-100 (voting_counter = 1)
Voting Period 2: Slots 100-140 (voting_counter = 2)
Voting Period 3: Slots 140-180 (voting_counter = 3)

Step 1: Initial Deposit (Slot 50 - Before Period 1): User deposits 50,000 DRVS tokens.
```rust
 // In `client_community.rs` `update()` during deposit
if available_tokens != self.header.drvs_tokens {
    // 50,000 != 0 - TRUE

    community_state.header.upgrade()?.drvs_tokens += 50,000;

    if self.header.slot <= community_state.header.voting_start_slot {
        // 0 <= 60 - TRUE
        self.header.current_voting_counter = 0;
        self.header.current_voting_tokens = 50,000;
    }
    self.header.slot = 50;
    self.header.drvs_tokens = 50,000;
}
```
Step 2: User cast vote in Period 1 (Slot 80):
```rust
// In voting.rs
if data.voting_counter != community_state.header.voting_counter {
    // 1 == 1 - Check passes
}

if client_community_state.header.slot <= community_state.header.voting_start_slot {
    // 50 <= 60 - TRUE
    voting_tokens = client_community_state.header.drvs_tokens; // 50,000
    client_community_state.header.current_voting_counter = 1;
    client_community_state.header.current_voting_tokens = 50,000;
} else {
    voting_tokens = client_community_state.header.current_voting_tokens;
}

if voting_tokens > 0 {
    if client_community_state.header.last_voting_counter >= client_community_state.header.current_voting_counter {
        // 0 >= 1 - FALSE, check passes
    }

    // Vote is cast successfully
    community_account_header.voting_incr += 50,000; // Example: user votes INCREMENT
    client_community_state.header.last_voting_counter = 1;
    client_community_state.header.last_voting_tokens = 50,000;
}
```
Step 3: User deposits additional 50,000 tokens in period 2(Slot 120):
```rust
// In client_community.rs update() during deposit
if available_tokens != self.header.drvs_tokens {
    // 100,000 != 50,000 - TRUE

    community_state.header.upgrade()?.drvs_tokens += 50,000;

    if self.header.slot <= community_state.header.voting_start_slot {
        // 50 <= 100 - TRUE
        self.header.current_voting_counter = 2; // Updates to period 2
        self.header.current_voting_tokens = 100,000; //
    }
    self.header.slot = 120; // Updated to current slot after the check
    self.header.drvs_tokens = 100,000;
}
```
Step 4: User withdraws all 100,000 tokens in Slot 121
```rust
// In client_community.rs update() during withdrawal
if available_tokens != self.header.drvs_tokens {
    // 0 != 100,000 - TRUE

    community_state.header.upgrade()?.drvs_tokens -= 100,000;

    if self.header.slot <= community_state.header.voting_start_slot {
        //120 <= 100 - FALSE (since this is false, we never enter here and voting tokens are not updated
        // if block NOT ENTERED - `current_voting_tokens` stays at 100,000!
    }
    self.header.slot = 121;
    self.header.drvs_tokens = 0; // User now holds ZERO tokens
}
```
Since attacker has not voted for this round, he calls voting and casts vote with 100000 tokens which he does'nt even posses
```rust
// In voting.rs
if data.voting_counter != community_state.header.voting_counter {
    // 2 == 2 - Check passes
}

if client_community_state.header.slot <= community_state.header.voting_start_slot {
    // 121 <= 100 - FALSE, we dont enter here
} else {
    voting_tokens = client_community_state.header.current_voting_tokens; // 100,000! (stale tokens)
}

if voting_tokens > 0 {
    if client_community_state.header.last_voting_counter >= client_community_state.header.current_voting_counter {
        // 1 >= 2 - FALSE, check passes
    }

    // User votes with 100000 tokens that he does'nt even hold
    match data.choice {
        VoteOption::DECREMENT => {
            community_account_header.voting_decr += 100,000; //
        }
        VoteOption::INCREMENT => {
            community_account_header.voting_incr += 100,000; //
        }
        _ => community_account_header.voting_unchange += 100,000, //
    }

    client_community_state.header.last_voting_counter = 2;
    client_community_state.header.last_voting_tokens = 100,000;
}
```
**Impact:** Users can cast votes without even holding tokens.

**Recommended Mitigation:** recommendation can be made once we're more days into audit and have knowledge of whole system.

**Deriverse**
Fixed in commit: https://github.com/deriverse/protocol-v1/commit/aa2c1caaaa32b05f63d50056c50040d0edea8290

**Cyfrin:** Verified.
