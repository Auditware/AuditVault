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
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Parallel Operations Over Proposals Lead To Race Conditions

- id: 52082
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


The bug report highlights an issue in the `suggestNewPendingWork` and `handleJobRequest` functions of the `Service` class. These functions operate concurrently and access shared resources without any synchronization or locking mechanisms, leading to race conditions. This can result in inconsistent system states or errors, such as duplicate proposal processing or incorrect handling. The report recommends implementing a proper synchronization mechanism, such as mutexes, to manage access to shared resources. The Lombard team has solved this issue by implementing locks/mutexes in their code. 

## Details

##### Description

The functions `suggestNewPendingWork` and `handleJobRequest` within the `Service` class are integral to handling proposals within a consensus-based system. Both functions operate concurrently and access shared resources, such as `s.proposal`, which introduces a high risk of race conditions. These race conditions can occur because both functions check, modify, or set the state of `s.proposal` without any form of synchronization or locking mechanism In `suggestNewPendingWork`, if a proposal is not currently set, the function fetches a queued proposal, unmarshals it, and proposes it to the network.

  

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

  

However, during this process, `handleJobRequest` might simultaneously check or modify `s.proposal` based on another incoming request. This lack of coordinated access control can lead to inconsistent system states or errors, such as duplicate proposal processing or incorrect proposal handling.

  

<https://github.com/lombard-finance/consortium-node/blob/66dd816a4891c382123852976c67a3dd3ea1249e/shared/consensus/service.go#L466-L501>

```
func (s *Service) handleJobRequest(proposal *types.Proposal, req *types.RequestProposal) error {
	// don't execute same job twice
	if s.proposal != nil {
		if s.proposal.Id == proposal.Id {
			return nil
		}
		log.Warnf("there is already pending job (%s), next one (%s) can't be proceed", s.proposal.Id, proposal.Id)
		return nil
	}
	// check proposal status
	{
		p := s.databaseService.GetProposalOrNil(uuid.MustParse(proposal.Id))
		if p != nil && p.Status != types.ProposalStatus_PROPOSAL_STATUS_QUEUED {
			log.Warnf("proposal (%s) is already finished (%s), skipping request", p.Id, p.Status)
			return nil
		}
	}
	if err := s.databaseService.SaveProposal(proposal); err != nil {
		return err
	}
	h := s.controllers[proposal.Type]
	if h == nil {
		return fmt.Errorf("there is no handler for proposal type (%s)", proposal.Type.String())
	}
	result, err := h.HandleRequest(req)
	if err != nil {
		_ = h.Clear()
		return err
	}
	s.proposal = proposal
	log.Infof("handled proposal (%s) start", proposal.Id)
	if result != nil {
		return s.propose(result)
	}
	return nil
}
```

  

Furthermore, the error handling in `suggestNewPendingWork` uses `log.Panicf` which can crash the service when an error occurs during proposal unmarshalling or submission, exacerbating the impact of these race conditions.

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:L/D:N/Y:N (8.1)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:L/D:N/Y:N)

##### Recommendation

To mitigate these risks and ensure robust operation, implementing a proper synchronization mechanism is essential. Use mutexes or other concurrency control structures to manage access to shared resources, such as `s.proposal`.

### Remediation Plan

**SOLVED:** The **Lombard team** solved this issue by implementing locks/mutexes.

##### Remediation Hash

<https://github.com/lombard-finance/consortium-node/commit/9f4e65cb4d773f670747c177dbe1a4bcdf276fd6>
