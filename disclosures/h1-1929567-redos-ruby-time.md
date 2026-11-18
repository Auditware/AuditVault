---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2023-04-26
submitted: 2023-04-01T23:52:39.352Z
bounty_usd: 4000
votes: 51
cve: "CVE-2023-28756"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/1929567"
title: "ReDoS( Ruby, Time)"
---
# ReDoS( Ruby, Time)

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 51 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-04-26

- Report: [https://hackerone.com/reports/1929567](https://hackerone.com/reports/1929567)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2023-28756
- Submitted: 2023-04-01T23:52:39.352Z

## Report summary

CVE-2023-28756: ReDoS vulnerability in Time

We have released the time gem version 0.1.1 and 0.2.2 that has a security fix for a ReDoS vulnerability. This vulnerability has been assigned the CVE identifier CVE-2023-28756.

Details
The Time parser mishandles invalid strings that have specific characters. It causes an increase in execution time for parsing strings to Time objects.

A ReDoS issue was discovered in the Time gem 0.1.0 and 0.2.1 and Time library of Ruby 2.7.7.

Recommended action
We recommend to update the time gem to version 0.2.2 or later. In order to ensure compatibility with bundled version in older Ruby series, you may update as follows instead:

For Ruby 3.0 users: Update to time 0.1.1
For Ruby 3.1/3.2 users: Update to time 0.2.2
You can use gem update time to update it. If you are using bundler, please add gem "time", ">= 0.2.2" to your Gemfile.

Unfortunately, time gem only works with Ruby 3.0 or later. If you are using Ruby 2.7, please use the latest version of Ruby.

Affected versions
Ruby 2.7.7 or lower
time gem 0.1.0
time gem 0.2.1

Credits
Thanks to ooooooo_q for discovering this issue.

Security Advisory: https://www.ruby-lang.org/en/news/2023/03/30/redos-in-time-cve-2023-28756/

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I reported at https://hackerone.com/reports/1485501

https://www.ruby-lang.org/en/news/2023/03/30/redos-in-time-cve-2023-28756/
> The Time parser mishandles invalid strings that have specific characters. It causes an increase in execution time for parsing strings to Time objects.
> A ReDoS issue was discovered in the Time gem 0.1.0 and 0.2.1 and Time library of Ruby 2.7.7.

## Impact

ReDoS occurs when `Time.rfc2822` accepts user input.

In `Rack::ConditionalGet`, the header value is parsed by `Time.rfc2822`,  it is possible to attack from the request.
Rails uses `::Rack::ConditionalGet` by default, it can be attacked by a request from the client.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
