---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/cloud
  - stack/aws
  - stack/ruby
substate: "not-applicable"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2020-02-13
submitted: 2020-01-21T09:45:54.403Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/ruby|Ruby]]"
reporter: "thevillagehack3r"
source: "https://hackerone.com/reports/778931"
title: "Source code disclosed via S3 Bucket"
---
# Source code disclosed via S3 Bucket

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Ruby | **Disclosed:** 2020-02-13

- Report: [https://hackerone.com/reports/778931](https://hackerone.com/reports/778931)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2020-01-21T09:45:54.403Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
The Ruby having an Amazon S3 bucked named `http://rubyci.s3.amazonaws.com/` which lists some of their log files. Those logs having some informations to check the source code server side directories.

### Steps to Reproduce

1. direct to `http://rubyci.s3.amazonaws.com/`  which having **READ** Permission to all Objects hosted in that bucket
{F691099}
2. Can also able to access aws-cli through `aws s3 ls s3://rubyci`
3. direct to one of the object named ***last.txt***  as  ` http://rubyci.s3.amazonaws.com/aix71_ppc/ruby-2.1/last.txt `
{F691108}
4. scroll down and a line shown which directs to source code directory link `http://svn.ruby-lang.org/repos/ruby/branches/` that is a initial directory for all source codes
5. I can check and view each and every source codes of all ruby versions

### POC
## Video
{F691114}

## Impact

- The attacker can able to read any aws authorized object and use those informations to do potential attacks
- The source codes having some sensitive informations so the attacker can do impact to ruby codes that may cause major attack on users.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2020-01-21** @thevillagehack3r: Agreed @bluetooth_headset
- **2020-01-21** @thevillagehack3r: Thanks for your response
- **2020-01-21** @bluetooth_headset: Hi again @d3athstrok3,

You are welcome! :)

Keep hunting!

Regards,

@bluetooth_headset
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
