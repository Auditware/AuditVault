---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft-lending
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/mev/frontrun
  - trigger/first-deposit
  - novelty/variant
protocol: "[[Blend Capital]]"
auditors:
  - "[[Andreas Mantzoutas]]"
report: "https://www.script3.io/"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Price Inflation Attack

- id: 47446
- impact: HIGH
- protocol: [[Blend Capital]]
- reporter: Andreas Mantzoutas (OtterSec)
- source: https://www.script3.io/

## Summary


The bug report discusses a vulnerability in a specific reserve where the first depositor can inflate prices and exploit subsequent depositors. This can happen by making an initial supply, minting a single share (b_token) through to_b_token_down, and making a large token donation to the pool. This can result in unexpected behavior for subsequent depositors, where the calculation for b_tokens_minted may be truncated to zero due to the initial supply and large donation. This can be exploited by an attacker who strategically times their actions to maximize the impact of the flooring issue. The report suggests a fix by permanently locking a portion of the initial deposit and limiting donations, as well as ensuring that the minted amount is never zero. This issue has been fixed in the code.

## Details

## Vulnerabilities

## Introduction
The first depositor may inflate the prices in a specific reserve, exploiting subsequent depositors. This may be achieved by making an initial supply, minting a single share (`b_token`) via `to_b_token_down`, and a large token donation to the pool. Subsequent depositors may experience unexpected behavior when depositing into the same reserve.

## Code Example
> _pool/actions.rs_

```rust
pub fn build_actions_from_request(
    e: &Env,
    pool: &mut Pool,
    from: &Address,
    requests: Vec<Request>,
) -> (Actions, User, bool) {
    [...]
    for request in requests.iter() {
        // verify the request is allowed
        require_nonnegative(e, &request.amount);
        pool.require_action_allowed(e, request.request_type);
        match RequestType::from_u32(e, request.request_type) {
            RequestType::Supply => {
                let mut reserve = pool.load_reserve(e, &request.address, true);
                let b_tokens_minted = reserve.to_b_token_down(request.amount);
                [...]
            }
            [...]
        }
        [...]
    }
}
```

The vulnerability revolves around calculating `b_tokens_minted` for successive deposits through `to_b_token_down`. As a result of the initial supply and a substantial donation, the value of `b_tokens_minted` for subsequent deposits may be truncated to zero. This creates an unintended and potentially exploitable scenario where subsequent depositors may not obtain the anticipated amount of minted shares. Moreover, this problem may be exploited in coordination with a front-running attack, wherein the attackers strategically times the substantial token donation just before the second deposit to maximize the impact of the flooring issue.

---

© 2024 Otter Audits LLC. All Rights Reserved. 8/22

## Blend Capital Audit 04 - Vulnerabilities

## Proof of Concept
1. The attacker mints one share (`b_token`) with a small amount.
2. The attacker then donates a large amount of tokens, artificially increasing the total reserve.
3. Another user attempts to deposit a significant amount into the same reserve after the attacker’s actions.
4. The calculation of `b_tokens_minted` for this deposit is affected by the inflated total reserve, potentially flooring it to zero.
5. The subsequent depositor receives little to no minted shares (`b_tokens`), which is unexpected.
6. This may result in financial losses for the unsuspecting user, as they may not receive the proportionate share of the deposited tokens.

## Remediation
Permanently lock a portion of the initial deposit and limit donations to prevent manipulation. Additionally, establish a mechanism to guarantee that the minted amount is never zero.

## Patch
Fixed in `34d5e51` and `8a04ebc` by not accepting donations and ensuring that the minted amount exceeds zero.

---

© 2024 Otter Audits LLC. All Rights Reserved. 9/22
