---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2022-10-14
submitted: 2022-07-05T14:03:32.420Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xd0ff9"
source: "https://hackerone.com/reports/1626226"
title: "Unauthenticated SQL Injection at █████████  [HtUS]"
---
# Unauthenticated SQL Injection at █████████  [HtUS]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 61 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1626226](https://hackerone.com/reports/1626226)
- CWE: SQL Injection
- Submitted: 2022-07-05T14:03:32.420Z

## Timeline

- **Report Filed**
- **2022-07-05** @0xd0ff9: The IP Vulnerable is: ███
If you have error "Unknown host: █████", you can put the IP in Target:
███
- **2022-07-05** @0xd0ff9: This is table name I dumped in '██████████' database
'task_header'
'employee_formal_training'
'itr_prod'
'itr_task'
'itr_task_group'
'journal_entry'
'mtl_prod'
'itr_task_header'
'mtl_task'
'organization_level'
'organization'
'mtl'
'afsc'
'mtl_task_header'
'person'
'product'
'task'
'role'
'rank'
'task_group'
'task_header'
'task_group_prod'
'task_group_task'
'base'
'task_group_task_header'
'employee_role'
'itr'
'employee_employee_role'
'_prisma_migrations'
'employee'
'employee_org'


## And Column Name of 'employee'
'employee_parent_unit'
'employee_primary_career_field_id'
'employee_tertiary_career_field_i'
'employee_training_status_code'
'employee_diert'
'employee_det'
'employee_person_id'
'employee_das'
'lastupdte_NM'
'createddte'
'lastupdte'
'createdNM'
'employee_rank_id'
'employee_parent_unit'
'employee_edipi'
'employee_secondary_career_field_'
'employee_assigned_unit'
'employee_email'
'employee_duty_career_field_id'
'employee_control_career_field_id'
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-09-27** @ag3nt-j1: We usually do disclosure requests on Friday. We've been busy but will get this done this Friday or next Friday for sure.
- **2022-10-07** @0xd0ff9: Thanks, please help me do the redactions before publish.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
