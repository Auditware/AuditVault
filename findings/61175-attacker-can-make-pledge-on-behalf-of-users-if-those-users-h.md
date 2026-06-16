---
tags:
  - severity/high
  - has/github
  - sector/stable
  - platform/cyfrin
  - lang/solidity
protocol: "[[Remora Pledge]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md"
genome:
  - "[[batch-item-auth]]"
  - "[[frontrun-exposure]]"
  - "[[access-control/missing-auth]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[frontrun]]"
  - "[[add-check]]"
  - "[[precondition/mev-capable]]"
  - "[[precondition/user-interaction]]"
  - "[[blast-radius/single-user]]"
---
# Attacker can make pledge on behalf of users if those users have approved `PledgeManager` to spend their tokens

- id: 61175
- impact: HIGH
- protocol: Remora Pledge
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md

## Summary


The PledgeManager is a feature that allows users to make pledges with their tokens. In order to make pledges, users must first approve the PledgeManager to spend their tokens. This can be done either by using a special function called `IERC20Permit::permit` or by manually calling `IERC20::approve`. However, a bug has been discovered where if a user uses the manual method and leaves an open token approval, an attacker can make pledges on behalf of the user without their permission. This can result in the user's tokens being spent without their knowledge. To fix this issue, it is recommended to add a check in the `PledgeManager::pledge` function to ensure that the caller is the same as the signer. This bug has been fixed by the Remora team in their latest commit and has been verified by the Cyfrin team.

## Details

**Description:** `PledgeManager` requires users to approve it to spend their tokens in order to make pledges. Users can do this by either:
1) using `IERC20Permit::permit` which enforces a nonce for the signer, deadline and domain separator
2) manually by calling `IERC20::approve`

If users use the manual method 2) and leave an open token approval, an attacker can call `PledgeManager::pledge` to make a pledge on their behalf since this function never enforces that `msg.sender == data.signer`.

**Impact:** Attacker can make pledges on behalf of innocent users which spends those users' tokens. It is common for users to have max approvals for protocols they use often, even though they don't intend to spend all their tokens with that protocol.

**Recommended Mitigation:** In `PledgeManager::pledge`, when not using `IERC20Permit::permit` enforce that `msg.sender == data.signer`:
```diff
        if (data.usePermit) {
            IERC20Permit(stablecoin).permit(
                signer,
                address(this),
                finalStablecoinAmount,
                block.timestamp + 300,
                data.permitV,
                data.permitR,
                data.permitS
            );
        }
+       else if(msg.sender != signer) revert MsgSenderNotSigner();
```

Alternatively always use `msg.sender` similar to how `PledgeManager::refundTokens` works.

**Remora:** Fixed in commit [e3bda7c](https://github.com/remora-projects/remora-smart-contracts/commit/e3bda7c78321febb0e2f37b29912ba24c9e04343) by always using `msg.sender` and also removed the permit method.

**Cyfrin:** Verified.
