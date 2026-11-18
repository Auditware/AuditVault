---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2018-05-13
submitted: 2018-04-27T19:35:19.912Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ronperris"
source: "https://hackerone.com/reports/344069"
title: "The react-marked-markdown module allows XSS injection in href values."
---
# The react-marked-markdown module allows XSS injection in href values.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-13

- Report: [https://hackerone.com/reports/344069](https://hackerone.com/reports/344069)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-04-27T19:35:19.912Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report XSS in react-marked-markdown.
The react-marked-markdown module incorrectly sanitizes href values and allows arbitrary code injection (XSS) via user provided Markdown.

# Module

**module name:** react-marked-markdown
**version:** 1.4.6
**npm page:** `https://www.npmjs.com/package/1.4.6`

## Module Description

A react components package that helps you use Markdown easily.

## Module Stats

> Replace stats below with numbers from npm’s module page:

133 downloads in the last day
935 downloads in the last week
4207 downloads in the last month

# Vulnerability

## Vulnerability Description

The React component created with react-marked-markdown contains XSS in link values even when the sanitize option is set to true.

The react-marked-markdown module uses marked.Render() but overwrites the link method with a custom version that doesn't correctly escape values passed to the href prop of anchor components.

## Steps To Reproduce:

import React from 'react'
import ReactDOM from 'react-dom'
import { MarkdownPreview } from 'react-marked-markdown'

ReactDOM.render(
  <MarkdownPreview
    markedOptions={{ sanitize: true }}
    value={'[XSS](javascript: alert`1`)'}
  />,
  document.getElementById('root')
)

## Patch

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- macOS 10.13
- Node.js 8.11.1
- npm 6.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: Y 
- I opened an issue in the related repository: Y 

https://github.com/Vincent-P/react-marked-markdown/issues/61

## Impact

The software does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page that is served to other users. This allows attackes to add malicious scripts to the page via Markdown.

## Timeline

- **Report Filed**
- **2018-05-05** @vdeturckheim: Thanks for reporting this. Someone will look at this report shortly.
- **Report Triaged**
- **2018-05-06** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **2018-05-11** @lirantal: @ronperris since you already disclosed the vulnerability and the author haven't responded I think we can continue with public disclosure.
- **2018-05-12** @ronperris: @lirantal Thanks for the all the help on this one!
- **2018-05-13** @lirantal: Pleasure! Thank you for submitting the report
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
