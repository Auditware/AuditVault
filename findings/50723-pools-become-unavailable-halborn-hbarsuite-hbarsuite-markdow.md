---
tags:
  - severity/high
  - platform/halborn
  - sector/dex
protocol: "[[HbarSuite]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/hbarsuite/hbarsuite-backend-pentest"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# POOLS BECOME UNAVAILABLE

- id: 50723
- impact: HIGH
- protocol: [[HbarSuite]]
- reporter: Halborn
- source: https://www.halborn.com/audits/hbarsuite/hbarsuite-backend-pentest

## Summary


The bug report describes a problem where pools created for testing became unavailable after a certain amount of time, resulting in positions not being able to be opened. A new pool was created and monitored, and it was observed that the pool became unavailable after approximately 4 hours. The impact of this bug was rated as a 3 out of 5 and the likelihood of it occurring was rated as a 5 out of 5. The recommendation is to contact the HbarSuite team for a fix, which has been implemented and tested successfully.

## Details

##### Description

It was found, after some time, all the pools that were created while testing became unavailable. This varied from becoming unavailable any time between 3 hours after creation, up to 24 hours after creation.

This resulted in no positions being able to be opened in those duplicated pools.

A new pool was created. Monitoring was enabled using a custom-made script to check for available pools at an interval of 20 minutes.

During the test, it was observed that the created pool become unavailable after approximately 4 hours.

![Output from the monitoring script showing pools become unavailable](https://halbornmainframe.com/proxy/audits/images/659ea034a1aa3698c0eb65d2)

##### Score

Impact: 3  
Likelihood: 5

##### Recommendation

**SOLVED**: While testing was ongoing, this issue was raised with the `HbarSuite team`. A fix was implemented and after retesting over a 24-hour period, it was noted that the pools remained available.
