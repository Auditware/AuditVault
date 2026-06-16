---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/halborn
  - has/github
  - severity/high
  - vuln/bridge/message-spoofing
  - novelty/variant
  - misassumption/bridge-is-secure
  - fix/add-check
  - trigger/cross-chain-message
protocol: "[[Consortium]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/lombard/consortium"
genome:
  - "[[message-spoofing]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[bridge-sender-auth]]"
---
# Incorrectly Formed Messages Can Disrupt Consensus Reply Processing

- id: 52079
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


This bug report describes a vulnerability in the `handleJobReply` function of the `Service` struct in the `consortium-node` project. This function processes reply messages in the consensus mechanism and clears the current context if an error occurs in the `HandleReply` function of the handler. However, this can be exploited by an attacker to disrupt the consensus process and stall the node's participation. The report suggests two possible solutions to address this issue: identifying and distinguishing between recoverable and non-recoverable errors, or implementing a penalty mechanism to reject and penalize malicious behavior. The Lombard team has accepted the risk and states that they do not expect such erroneous requests to occur in their permissioned network. 

## Details

##### Description

The `handleJobReply` function in the `Service` struct processes reply messages in the consensus mechanism by invoking the appropriate handler for the proposal type. If an error occurs in the `HandleReply` function of the handler, the current context is cleared by calling `h.Clear()`. While this might seem like a logical way to reset the state, it introduces a vulnerability: an attacker could craft a malicious message that triggers an error in `HandleReply`, causing the node to clear its current task context prematurely. This could disrupt the consensus process, as the node would lose its ability to process further legitimate replies, effectively stalling its participation in the ongoing consensus.

  

<https://github.com/lombard-finance/consortium-node/blob/58ac32035abc505a66991a8c69df99e9e20ba202/shared/consensus/service.go#L518-L533>

```
func (s *Service) handleJobReply(proposal *types.Proposal, reply *types.RequestProposal) error {
	h := s.controllers[proposal.Type]
	if h == nil {
		return fmt.Errorf("there is no handler for proposal type (%s)", proposal.Type.String())
	}
	s.logger.Infof("handle reply (%s)", proposal.Id)
	result, err := h.HandleReply(reply)
	if err != nil {
		_ = h.Clear()
		return err
	}
	if result != nil {
		return s.propose(result)
	}
	return nil
}
```

  

For example, in the case of the `signEarlyUnbondController`'s `HandleReply` function, several errors could be triggered by malicious messages, such as invalid signatures or malformed transaction data. This would result in the context being cleared, leaving the node unable to continue processing the consensus task.

  

<https://github.com/lombard-finance/consortium-node/blob/ebab6b7bea92d1e94768e307c5a3c001ba9367d4/shared/consensus/internal/controller/sign_early_unbond.go#L183-L194>

```
func (c *signEarlyUnbondController) HandleReply(reply *types.RequestProposal) (*types.RequestProposal, error) {
	if c.signingData == nil {
		log.Tracef("player (%s) state is clean", c.consensusFeed.HostID())
		return nil, nil
	}

	reply2 := reply.GetSignEarlyUnbondReply()
	if reply2 == nil {
		return nil, errors.Errorf("unable to handle incompatible reply message")
	} else if err := validation.Validate(reply2); err != nil {
		return nil, err
	}
	
// ...
```

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:M/D:N/Y:N (8.8)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:M/D:N/Y:N)

##### Recommendation

There are two possible approaches to address the issue:

1. **Identify recoverable and non-recoverable errors:** Evaluate which errors represent a non-recoverable state in the consensus, requiring the process to be restarted, and which do not pose a significant risk, allowing the current task to continue processing. This approach involves distinguishing between errors that should clear the consensus state and those that should not, though it may be less scalable and effective.
2. **Reject external messages and penalize malicious behavior:** Identify and validate consensus participants, rejecting messages from external agents. Additionally, implement a penalty mechanism to report and sanction malicious behavior among nodes. While more complex, this approach is more effective and decentralized for managing issues and misbehavior within the consensus process.

### Remediation Plan

**RISK ACCEPTED:** The **Lombard team** accepted the risk of this issue and states:

```
All errors in the application-specific handler are treated as non-recoverable. Errors that are typically considered recoverable, such as those caused by validators sending spam or malformed requests, are not a concern in this context. This is because the consortium operates within a permissioned network where only vetted validators are allowed. Additionally, all requests are routed through the Lombard backend API, which enforces rigorous validation. As a result, such erroneous requests are not expected to occur.
```
