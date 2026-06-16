---
tags:
  - lang/move
  - platform/spearbit
  - has/github
  - severity/high
  - sector/staking-pool
protocol: "[[Thala]]"
auditors:
  - "[[Devtooligan]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Thala-Spearbit-vCISO-December-2024.pdf"
genome:
  - "[[access-roles]]"
---
# Alert System Coverage and Classification

- id: 49992
- impact: HIGH
- protocol: [[Thala VCISO]]
- reporter: Devtooligan (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Thala-Spearbit-vCISO-December-2024.pdf

## Summary


This bug report discusses a high-risk issue with the system's monitoring for certain actions, such as administrative function calls and pool creation. It also highlights a previous incident where alerts were mistakenly misclassified, leading to a delay in investigation. The report recommends implementing enhanced alert coverage and establishing clear procedures for alert classification and response. It also suggests defining response requirements, such as escalation paths and evidence collection. 

## Details

## Security Review Report

## Severity: High Risk

### Description
The system lacks monitoring for several protocol actions:
- Administrative function calls.
- Pool creation and management.
- Balance invariant violations.

Thala's alert system could be improved with a more structured classification and triage system. The November 2024 incident highlighted how TVL drop alerts were mistakenly misclassified as routine changes, delaying investigation by several hours. At the time of the incident, alerts were split between `alerts-activity` and `alerts-protocol` channels without clear prioritization or investigation requirements.

Additionally, alerts in the protocol channel mix critical and non-critical items, contributing to alert fatigue and reducing the effectiveness of the notification system.

**Note:** During the course of the review, the project has implemented `#alerts-protocol` and `#alerts-manager` as high priority alerting channels, both of which require action.

### Severity Discussion
The impact is high as missing or misclassified alerts directly affect incident detection and response time. The likelihood is high given evidence from the recent incident where alert misclassification contributed to delayed response. Based on these factors and the critical nature of proper alerting for protocol safety, this ranks as a high severity issue.

## Recommendation
1. Implement enhanced alert coverage for both critical and informational events. See Appendix A for detailed specifications of recommended alerts.
2. Establish clear alert classification and procedures:
   - Move all non-critical alerts out of protocol channel.
   - Require root cause analysis and evidence for critical alert resolution.
   - Document investigation procedures and templates.
   - Define escalation paths and response times.
   - Review alert efficacy quarterly.
3. Define response requirements:
   - Primary on-call (10min) ! Secondary ! Management escalation path.
   - Evidence collection requirements before alert closure.
   - Regular review of alert patterns and thresholds.
