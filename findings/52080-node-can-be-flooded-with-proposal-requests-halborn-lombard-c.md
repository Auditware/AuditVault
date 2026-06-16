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
  - "[[proposal-state-check]]"
---
# Node Can Be Flooded With Proposal Requests

- id: 52080
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


This bug report is about a function called `ProposeAndWait` in a program called `consortium-node`. This function is used to process and verify new requests, and it is supposed to wait until the request is enqueued in the database. However, the way it is currently implemented is inefficient and could lead to a denial of service if the program is flooded with multiple requests. The report recommends rewriting the logic of this function or adjusting the timeout to prevent this issue. The Lombard team, who is responsible for the program, plans to fix this issue in future releases by transitioning to a more efficient and scalable method. 

## Details

##### Description

When a new request is received through any of the available gateways, it is processed and verified by passing several checks over the requests depending on its type. After all validations and check are passed successfully, this request is proposed to the consensus in order to handle it by all the involved players in the threshold key. This proposal is made by an initial node which will be executing the `ProposeAndWait` function.

This function is in charge of generating a new random message ID for the proposal and execute the `DragonBoat` API to add a new proposal to the process. Since this is an asynchronous process, the proposer has to wait until the proposal has been enqueued in database by checking every 100 milliseconds this proposal in the database, in case this proposal hasn’t been included in the database in less than 5 minutes, this functions will return an error.

Since this function is open to be executed through any gateway and it blocks its thread’s execution until the request is enqueued or after 5 minutes, its implementation is highly inefficient and even could lead to a denial of service if the node is flooded with multiple proposal requests.

  

<https://github.com/lombard-finance/consortium-node/blob/66dd816a4891c382123852976c67a3dd3ea1249e/shared/consensus/service.go#L381-L407>

```
func (s *Service) ProposeAndWait(ctx context.Context, message *types.RequestProposal) (*types.Proposal, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 5*time.Minute)
	defer cancel()
	if message.Id == "" {
		message.Id = uuid.New().String()
	}
	err := s.propose(message)
	if err != nil {
		return nil, err
	}
	id, _ := uuid.Parse(message.Id)
	timer := time.Tick(100 * time.Millisecond)
	for {
		select {
		case <-timer:
		case <-ctx.Done():
			return nil, ctx.Err()
		}
		p := s.databaseService.GetProposalOrNil(id)
		if p == nil {
			continue
		}
		if p.Status != types.ProposalStatus_PROPOSAL_STATUS_QUEUED {
			return p, nil
		}
	}
}
```

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:N/D:L/Y:N (8.1)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:N/D:L/Y:N)

##### Recommendation

It is recommended to rewrite the logic of this function to keep it asynchronous or to adjust the timeout to prevent from denial of services attacks.

### Remediation Plan

**PENDING:** The **Lombard team** will fix this issue in future releases and states:

```
The consortium API supports both asynchronous and synchronous workflows. The asynchronous flow is the preferred method and is currently implemented across several API handlers, with plans to extend its use to all handlers in future updates. The synchronous flow, which utilizes the ProposeAndWait method, is reserved exclusively for API calls with deterministic logic. In cases where a request has already been processed, the synchronous approach returns the result of the previous execution to maintain consistency.
While the synchronous ProposeAndWait approach remains in place for backward compatibility, it is now considered deprecated and will be phased out in future releases. Transitioning away from this method is necessary to standardize on the more efficient and scalable asynchronous workflow.
```
