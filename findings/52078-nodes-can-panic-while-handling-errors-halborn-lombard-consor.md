---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Consortium]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/lombard/consortium"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Nodes Can Panic While Handling Errors

- id: 52078
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


The `suggestNewPendingWork` function in the `consortium-node` code is responsible for proposing new work for the consensus process. However, it has a bug that can be exploited by attackers to crash the system and disrupt the consensus mechanism. The bug occurs when a malicious proposal is introduced, causing an error during the unmarshalling or proposal submission process. This leads to a `log.Panicf` and a system crash. To fix this, the `log.Panicf` calls should be replaced with proper error handling mechanisms that log the error and allow the service to continue operating. The Lombard team has already solved this issue by implementing the recommended changes.

## Details

##### Description

The `suggestNewPendingWork` function is responsible for proposing new work for the consensus process by fetching pending proposals from the database, unmarshalling them, and then proposing them for further processing. However, the current implementation lacks robust error handling, leading to a critical vulnerability. Specifically, if an attacker were to introduce a malicious proposal into the system-one that causes an error during the unmarshalling process (`req.Unmarshal(p.Message)`) or during the proposal submission (`s.Propose(req)`), the function would trigger a `log.Panicf`. This panic would cause the service to crash, halting the consensus process across the nodes.

  

<https://github.com/lombard-finance/consortium-node/blob/66dd816a4891c382123852976c67a3dd3ea1249e/shared/consensus/service.go#L230-L250>

```
func (s *Service) suggestNewPendingWork() {
	_ = s.WaitForLeader(context.TODO())
	if s.proposal != nil {
		return
	}
	proposals := s.databaseService.GetProposalsByStatusOrderByIndex(types.ProposalStatus_PROPOSAL_STATUS_QUEUED, 0, 1)
	if len(proposals) == 0 {
		return
	}
	p := proposals[0]
	req := &types.RequestProposal{}
	if err := req.Unmarshal(p.Message); err != nil {
		log.Panicf("failed to parse proposal message: %+v", err)
	}
	// make this job forcibly pending to let other workers know that we're working on this job
	req.Queued = true
	err := s.Propose(req)
	if err != nil {
		log.Panicf("failed to propose message: %+v", err)
	}
}
```

  

Such a crash could be exploited to disrupt the consensus mechanism, leading to a denial-of-service (DoS) attack on the system.

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:N/D:N/Y:N (10.0)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:N/D:N/Y:N)

##### Recommendation

To mitigate this vulnerability, replace the `log.Panicf` calls with proper error handling mechanisms that safely log the error and allow the service to continue operating. Specifically, instead of panicking, the function should log the error, skip the malicious proposal, and continue processing other proposals. Additionally, consider implementing validation and sanitization checks on incoming proposals to detect and reject malicious or malformed proposals before they reach critical points in the code.

### Remediation Plan

**SOLVED:** The **Lombard team** solved this issue by following the aforementioned recommendation and removing panics.

##### Remediation Hash

<https://github.com/lombard-finance/consortium-node/commit/9f4e65cb4d773f670747c177dbe1a4bcdf276fd6>
