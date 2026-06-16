---
tags:
  - lang/vyper
  - sector/governance
  - platform/0x52
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Dynamo]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-10-07-Dynamo.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-04] Dangerous approval/rejection criteria when number of guards is odd

- id: 55647
- impact: HIGH
- protocol: [[Dynamo]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-10-07-Dynamo.md

## Summary


The bug report discusses an issue with an assert statement in the code of the Governance contract. The statement requires that the number of endorsements is equal to or greater than half of the number of guards. However, this can lead to problems with odd numbers, as even a single approval from a malicious guard could result in the approval of a harmful proposal. The recommendation is to change the requirement to be equal to or greater than half of the number of guards plus the remainder when divided by 2. The issue has been fixed by changing the code in the contract.

## Details

**Details**

[Governance.vy#L310](https://github.com/DynamoFinance/vault/blob/c331ffefadec7406829fc9f2e7f4ee7631bef6b3/contracts/Governance.vy#L310)

    assert (len(pending_strat.VotesEndorse) >= len(self.LGov)/2) or \

The above assert statement requires that the number of endorsements equals or exceeds the number of guards / 2. This becomes an issue with odd numbers due to truncation. If you were to have 3 guards then even a single approval would allow instant approval ( 3/2 = 1). In this scenario even a single malicious or compromised guard could drain the entire vault via a malicious proposal.

**Lines of Code**

[Governance.vy#L291-L324](https://github.com/DynamoFinance/vault/blob/c331ffefadec7406829fc9f2e7f4ee7631bef6b3/contracts/Governance.vy#L291-L324)

**Recommendation**

Make the requirement that it must equal or exceed length / 2 + length % 2

**Remediation**

Fixed [here](https://github.com/DynamoFinance/vault/commit/835993b6e9357b2246139cca43502cfc65a34e0a) by changing `len(self.LGov)/2` to `len(self.LGov)/2 + 1` so that a majority vote is required to pass
