---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "informative"
weakness: "Code Injection"
enriched: true
date: 2021-06-28
submitted: 2020-06-22T06:16:28.733Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "zerohex"
source: "https://hackerone.com/reports/904672"
title: "Server-side Template Injection in lodash.js "
---
# Server-side Template Injection in lodash.js 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2021-06-28

- Report: [https://hackerone.com/reports/904672](https://hackerone.com/reports/904672)
- CWE: Code Injection
- Submitted: 2020-06-22T06:16:28.733Z

## Timeline

- **Report Filed**
- **2020-06-22** @marcinhoppe: I think building templates based on untrusted input with any templating engine can be considered a vulnerability. I am not sure if this is due to a bug in Lodash or is it due the way it is used.

@zerohex What kind of behavior do you expect for the provided sample?
- **2020-06-23** @zerohex: Hi, 

After reading Lodash documentation and repo comments by the maintainer it appears that template() will interpret ${} as template delimiters by design to support ES. https://github.com/lodash/lodash/issues/2658. 

Looking more into the source code in template.js a match is performed using regex to check if the input contains the pattern `${}`. When a match occurs the input is evaluated as an embedded expression. With the provided sample as an example, a value of `${JSON.stringify(process.env)}` being handed to template() would result in the return of the application environment variables, or if `name=Fred${7*7}` the result would be Fred49

```
/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
```

However, as you allude, my POC implementation is likely flawed (due to my inexperience and the indicators pointing towards an issue that is a by-design feature). Sorry for wasting your time on this.
- **2020-06-25** @marcinhoppe: @zerohex No worries! I will close this report as informational.
- **Report Informative**
- **2021-02-15** @zerohex: Hi, just stumbled across CVE-2021-23337 which seems to confirm that this report was valid (https://nvd.nist.gov/vuln/detail/CVE-2021-23337) (https://snyk.io/vuln/SNYK-JS-LODASH-1040724).
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
