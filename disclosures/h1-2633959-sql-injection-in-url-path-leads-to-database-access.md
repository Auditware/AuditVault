---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - impact/data-exposure
  - impact/sensitive-data
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2025-01-08
submitted: 2024-07-31T22:39:36.605Z
bounty_usd: null
votes: 115
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2633959"
title: "SQL injection in URL path leads to Database Access"
---
# SQL injection in URL path leads to Database Access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 115 | **Program:** MTN Group | **Disclosed:** 2025-01-08

- Report: [https://hackerone.com/reports/2633959](https://hackerone.com/reports/2633959)
- CWE: SQL Injection
- Submitted: 2024-07-31T22:39:36.605Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The application https://corporate.admyntec.co.za/ application has an SQL injection in the URL paths since it takes the ID numbers in there and insert them directly into the backend SQL query without sanitizing them. In the registration, user ID number(Passport or National ID), Organization number are requested, as well as relevant docs. These are all stored in the backend Database.

https://corporate.admyntec.co.za/customerInsurance/newCustomerStep8/userId/868878/customerId/732562'/contactPersonId/0

## Steps To Reproduce:

  1. Using the URL generated when we get displayed the Insurance.   

{F3484515}  

  2. Introduce a single quote next to the customerId number and you realize this breaks the backend query.

```
https://corporate.admyntec.co.za/customerInsurance/newCustomerStep8/userId/868878/customerId/732562'/contactPersonId/0  
```
{F3484523}  
  3. Send this URL to any SQL epxloitation tool like SQLmap, Add an asterisk to the customerId number to tell the tool that's the injection point.  We can dump the database now.

{F3484537}  

##Please Note That This Occurs throughout many URL paths in the application.

#Recommendation
If you are taking parameters and inserting them into the backend SQL query, sanitize them to do away with any special characters attached to them.

Consider putting the application behind a WAF to make a potential SQLi vulnerability exploitation a bit tedious for an attacker.

## Impact

An attacker can exploit this to dump and download the backend database. This will give them access user information.

## Timeline

- **Report Filed**
- **2024-08-01** @slydingdong1: Hi @tinopreter 

How did you find this domain because it does not appear on the list of our assets.

Regards
- **Report Triaged**
- **2024-08-01** @tinopreter: Hi @slydingdong1 

I usually pick one country and decide to enumerate all MTN asset that exist for that country. 

So I performed some intensive asset discovery over the internet to discover assets that belonged to MTN ZA. My bad if it's out of scope. Due to the nature of the vulnerability, I just couldn't ignore it so I decided to report it. 

Moving forward, I'll strictly stick to the defined scope.
- **Report Triaged**
- **Report Resolved**
- **2024-10-04** @tinopreter: Hi @slydingdong1,

Thanks for resolving this. Can you please resolve this one too #2633941 as it affects the same domain.
- **2024-12-09** @tinopreter: Hello @slydingdong1 

Since this has been resolved, can you please allow disclosure?
- **Agreed On Going Public**
- **Report Became Public**
