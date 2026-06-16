---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/rust
  - platform/trailofbits
  - sector/rwa
protocol: "[[Reserve Protocol Solana DTFs]]"
auditors:
  - Samuel Moelius
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf"
genome:
  - "[[access-roles]]"
  - "[[access-control/centralization]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-access-control]]"
  - "[[misassumption/admin-is-honest]]"
  - "[[blast-radius/protocol-wide]]"
  - "[[precondition/insider]]"
---
# Folio owner can rug pull DTF shareholders

- id: 55600
- impact: HIGH
- protocol: Reserve Protocol Solana DTFs
- reporter: Samuel Moelius (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf

## Summary


The bug report describes a problem where a user with the `Role::Owner` can remove tokens from a basket without making any changes to the folio's code. This can result in a decrease in the value of shares associated with the basket, which goes against ABC Labs' threat model. This bug can be exploited by a malicious user to transfer all tokens to themselves. The report recommends documenting the fact that users with `Role::Owner` must be trusted and reputable, and also documenting ABC Labs' threat model to prevent similar problems in the future.

## Details

## Description

A user who holds `Role::Owner` can remove arbitrary tokens from a basket (figure 12.1). In doing so, the user would decrease the value of all shares associated with the basket. Based on our understanding, this violates ABC Labs’ threat model, as it does not require the user to make a code change to the folio.

```rust
57    impl RemoveFromBasket<'_> {
58        pub fn validate(&self, folio: &Folio) -> Result<()> {
59            folio.validate_folio_program_post_init(
60                &self.folio.key(),
61                Some(&self.program_registrar),
62                Some(&self.dtf_program),
63                Some(&self.dtf_program_data),
64                Some(&self.actor),
65                Some(Role::Owner),
66                Some(vec![FolioStatus::Initializing, FolioStatus::Initialized]),
67            )?;
68
69            Ok(())
70        }
71    }
72
73    pub fn handler<'info>(
74        ctx: Context<'_, '_, 'info, 'info, RemoveFromBasket<'info>>,
75        removed_mints: Vec<Pubkey>,
76    ) -> Result<()> {
77        {
78            let folio = ctx.accounts.folio.load()?;
79            ctx.accounts.validate(&folio)?;
80        }
81
82        ctx.accounts
83            .folio_basket
84            .load_mut()?
85            .remove_tokens_from_basket(&removed_mints)?;
86
87        Ok(())
88    }
```

**Figure 12.1:** Excerpt of `remove_from_basket.rs` (dtfs-solana/programs/folio/src/instructions/owner/remove_from_basket.rs#57–88)

## Exploit Scenario

Mallory deploys the folio and dtfs programs. Over time, Mallory’s deployments obtain a significant number of users. Mallory removes all tokens from all baskets and transfers the tokens to herself.

## Recommendations

- **Short term:** Document the fact that users with `Role::Owner` must be trusted, reputable parties. This will reduce the likelihood of such users rug pulling other users.

- **Long term:** Document ABC Labs’ threat model. This will make it easier to uncover problems (e.g., when users have greater authority than they should).
