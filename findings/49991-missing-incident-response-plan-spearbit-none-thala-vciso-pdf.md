---
tags:
  - lang/move
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - precondition/insider
  - sector/stable
protocol: "[[Thala]]"
auditors:
  - "[[Devtooligan]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Thala-Spearbit-vCISO-December-2024.pdf"
genome:
  - "[[insider]]"
  - "[[access-roles]]"
---
# Missing Incident Response Plan

- id: 49991
- impact: HIGH
- protocol: [[Thala VCISO]]
- reporter: Devtooligan (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Thala-Spearbit-vCISO-December-2024.pdf

## Summary


This bug report highlights a high-risk issue with Thala, as they lack documented incident response procedures and playbooks. This means that in the event of a security incident, the team may face delays and ineffective responses, leading to potential losses and extended downtime. The severity of this issue is considered high, as timely incident response is critical in mitigating losses during security events. The report recommends implementing an incident response plan, creating templates and playbooks for common incident types, and conducting quarterly exercises to test and refine response procedures.

## Details

## Incident Response Assessment

## Severity: High Risk

### Description
Thala lacks documented incident response procedures and playbooks. The lack of formal procedures increases the risk of delayed or ineffective response during time-critical situations, especially for incidents requiring different handling than past experiences.

Without documented procedures, the team faces increased risks of:
- Delayed detection and response to security incidents.
- Uncoordinated team actions during critical moments.
- Inconsistent external communications.
- Missed opportunities for fund recovery.
- Extended downtime from delayed decisions.
- Impaired judgment under high-stress situations.

### Severity Discussion
The impact is high as incident response could mitigate losses during security events. The likelihood is medium given the variety of potential attack vectors across smart contracts, frontend, social media, and operations. Based on these factors and the critical nature of timely incident response, this ranks as a high severity issue.

## Recommendation
1. Implement the draft incident response plan outlined in Appendix B which includes:
   - War room procedures and team roles.
   - Communication protocols and templates.
   - Containment and recovery frameworks.
   - Integration with SEAL 911 emergency response.
   - Post-incident review procedures.

2. Create an Incident Response Template for use during incidents. See example in Appendix C.

3. Create detailed playbooks for handling all common incident types:
   - **Smart contract exploit**:
     - Funds lost - see example in Appendix D.
     - Contract disabled.
     - Private key compromise.
   - **Front-end incident**:
     - Malicious code deployed.
     - Phishing attack related to an open redirect.
     - DNS hijacked - see example in Appendix E.
   - **Discord**:
     - Admin compromised.
     - Raid/Spam attack.
   - **Twitter compromised** - see example in Appendix F.

4. Conduct quarterly incident response exercises to:
   - Test and refine response procedures.
   - Help team members understand their roles.
   - Practice coordination under simulated pressure.
   - Identify and address gaps in the plan.
