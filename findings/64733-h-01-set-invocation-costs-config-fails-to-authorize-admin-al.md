---
tags:
  - lang/rust
  - sector/oracle
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - precondition/uninitialized
protocol: "[[Reflector]]"
auditors:
  - "[[rare_one]]"
report: "https://code4rena.com/reports/2025-10-reflector-v3"
genome:
  - "[[missing-auth]]"
  - "[[direct-drain]]"
  - "[[data/uninitialized]]"
  - "[[initializer-auth]]"
---
# [H-01] `set_invocation_costs_config()` fails to authorize admin allowing anyone to set invocation costs

- id: 64733
- impact: HIGH
- protocol: [[Reflector]]
- reporter: rare\_one (Code4rena)
- source: https://code4rena.com/reports/2025-10-reflector-v3

## Summary


The bug report is about a function in the `beam-contract/lib.rs` file that allows anyone to set invocation costs, instead of just the admin. This can result in loss of funds for price consumers, as their tokens can be burnt due to the high invocation fee set by a malicious actor. The recommended solution is to add a check to verify if the caller is the admin. A proof of concept is also provided in the `beam-contract/src/test.rs` file.

## Details



`lib.rs` [# L404](https://github.com/code-423n4/2025-10-reflector/blob/21676f3d353ed72e53d53ee9a3538542221a1cb2/beam-contract/src/lib.rs# L404)

### Finding description and impact

The `set_invocation_costs_config()` function in `beam-contract/lib.rs` is designed to allow the admin to set invocation costs which is charged when prices are read by the consumer:
```

    // Update costs configuration per each invocation category
    // Requires admin authorization
    //
    // # Arguments
    //
    // * `config` - Invocation costs for different invocation categories
    //
    // # Panics
    //
    // Panics if not authorized or not initialized yet
    pub fn set_invocation_costs_config(e: &Env, config: Vec<u64>) {
        set_costs_config(e, &config);
    }
```

However, this function fails to verify if the caller is admin; allowing anyone to set invocation costs.

This leads to unwarranted loss of funds to the price consumers as their tokens would get burnt as per invocation fee, which can be changed to a irrationally high number by a malicious actor.

### Recommended mitigation steps

It is recommended to add a `auth::panic_if_not_admin(e);` check in order to mitigate this issue.

### Proof of Concept

Add the following test case inside `beam-contract/src/test.rs`:
```

#[test]
fn anyone_can_set_invocation_config_test() {
    let (env, client, _) = init_contract_with_admin();

    env.mock_all_auths();

    let costs = Vec::from_array(&env, [10, 20, 30, 40, 50]);
    client.set_invocation_costs_config(&costs);

    let result = client.invocation_costs();
    assert_eq!(result, costs);
}
```

---
