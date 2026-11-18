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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Server-side Template Injection in lodash.js  (_.template function)
It allows the execution of code on the server

# Module

**module name:** lodash
**version:** 4.17.15
**npm page:** `https://www.npmjs.com/package/lodash`

## Module Description

The Lodash library exported as Node.js modules.

## Module Stats

26,664,631 weekly downloads

# Vulnerability

## Vulnerability Description

The _.template function of the lodash package does not properly validate user-supplied input. 



An application making use of the lodash package may be exploited by an attacker that controls the value of a parameter processed by the _.template function. An attacker can inject code such as Javascript within parenthesis for example `parameter=${JSON.stringify(process.env)}` which will be executed by the server.

## Steps To Reproduce:

**Step 1:** Create a test application that requires the lodash.js library. The application below accepts user-supplied input in the  'name' parameter that is handled by lodash `_.template` function

```
const express = require('express');
const _ = require('lodash');
const escapeHTML = require('escape-html');
const app = express();
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  const name = req.query.name
  // Create a template from user input
  const compiled = _.template("Hello " + escapeHTML(name) + ".");
  res.status(200).send(compiled());
});

app.listen(8000, () => {
  console.log('POC app listening on port 8000!')
});
```

**Step 2:** Visit the vulnerable application at http://127.0.0.1:8000/?name=Test

**Step 3:** Visit the vulnerable application and enter a payload such as `${JSON.stringify(process.env)}` into the `name` parameter e.g.  http://127.0.0.1:8000/?name=Test${JSON.stringify(process.env)}

## Supporting Material/References:

- OSX 10.15.5
- NODEJS v10.16.0
- NPM v 6.9.0

# Wrap up

- I contacted the maintainer to let them know: [Y/N] N
- I opened an issue in the related repository: [Y/N] N

> Hunter's comments and funny memes goes here

Apologies if I haven't used the ideal terminology or if this is a duplicate.

## Impact

Remote code execution

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
