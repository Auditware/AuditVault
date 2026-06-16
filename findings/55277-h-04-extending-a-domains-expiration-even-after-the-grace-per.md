---
tags:
  - lang/move
  - sector/multisig
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Initia]]"
auditors:
  - "[[p4y4b13]]"
report: "https://code4rena.com/reports/2025-01-initia-move"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-04] Extending a domain’s expiration even after the grace period impacts domain buyers

- id: 55277
- impact: HIGH
- protocol: [[Initia]]
- reporter: p4y4b13 (Code4rena)
- source: https://code4rena.com/reports/2025-01-initia-move

## Summary


The bug report discusses a problem in the `name_service.move` module that allows users to extend the expiration date of a domain name even after the grace period has ended. This unintended behavior can be exploited by attackers to prevent others from registering the same domain name. The report suggests preventing the `extend_expiration()` function from being called after the grace period has ended as a solution. The team has confirmed and fixed the issue by implementing the suggested solution.

## Details



<https://github.com/code-423n4/2025-01-initia-move/blob/a96f5136c4808f6968564a4592fe2d6ac243a233/usernames-module/sources/name_service.move# L458>

### Finding description and impact

The `name_service.move` module allows users to register domain names. If anyone wants to register an already purchased domain, they can only do so once the `expiration_date + grace_period` for that domain has passed. The `name_service.move` module allows anyone to call `extend_expiration` for any domain, which is a feature (according to sponsors).

The main issue is that the `extend_expiration()` function allows users to extend the expiration of a domain even after the grace period has ended, which is unintended behavior.

As a result, users, multi-sig owners of the actual domain name, or attackers can frontrun and attempt to call `extend_expiration()` after the grace period has ended, even if other users are trying to buy the same domain name using `register_domain()`.

This breaks a key invariant of the protocol, leading to genuine users being negatively impacted and experiencing a poor user experience.

### Proof of Concept

Consider the following attack scenario:

1. `Alice` buys the domain name `vitalik` for a specific duration.
2. The expiration date and grace period for `Alice`’s domain are completed.
3. `Bob` observes that `Alice`’s domain `vitalik` has passed its `expiration_date + grace_period`. So, `Bob` calls `register_domain` to acquire the `vitalik` domain name.
4. At the same time, `Alice` calls `extend_expiration` for the domain name `vitalik`.
5. Since `Alice` pays a higher gas fee, her transaction is picked and executed first.
6. As a result, `Alice` successfully extends the expiration for her domain, and `Bob`’s transaction reverts.
7. However, `Alice`’s transaction should have been reverted since the grace period had already ended.

### Recommended mitigation steps

To mitigate this issue, prevent the `extend_expiration()` function from being called for domains after the completion of `expiration_date + grace_period`.
```

public entry fun extend_expiration(
        account: &signer,
        domain_name: String,
        duration: u64,
    ) acquires ModuleStore {
        ....
        assert!(
            duration >= module_store.config.min_duration,
            error::invalid_argument(EMIN_DURATION),
        );

        let (_height, timestamp) = block::get_block_info();
        let expiration_date = metadata::get_expiration_date(token);
        // @audit Only allow extend_expiration before the grace period
+       assert!(
+           timestamp <= expiration_date + module_store.config.grace_period ,
+           error::invalid_argument(ECANT_EXTEND_EXPIRATION),
+       );
        ....
    }
```

**[andrew (Initia) confirmed and commented](https://code4rena.com/audits/2025-01-initia-move/submissions/F-40?commentParent=DjEfJvydM4D):**

> Thank you for reporting. It is fixed on [this commit](https://github.com/initia-labs/usernames-module/pull/4/commits/d1b656af82cf2c4ac35d0b28c69883fe6ab14b0b).

---
