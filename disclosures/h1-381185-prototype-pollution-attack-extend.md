---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2018-08-22
submitted: 2018-07-13T10:04:52.180Z
bounty_usd: null
votes: 5
cve: "CVE-2018-16492"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "asgerf"
source: "https://hackerone.com/reports/381185"
title: "Prototype pollution attack (extend)"
---
# Prototype pollution attack (extend)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-22

- Report: [https://hackerone.com/reports/381185](https://hackerone.com/reports/381185)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-16492
- Submitted: 2018-07-13T10:04:52.180Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report prototype pollution in extend
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** extend
**version:** 3.0.1
**npm page:** `https://www.npmjs.com/package/extend`

## Module Description

`node-extend` is a port of the classic extend() method from jQuery. It behaves as you expect. It is simple, tried and true.

> **Note**: The github project is called `node-extend` but the NPM package is just `extend`

## Module Stats

7M downloads in the last week

# Vulnerability
## Vulnerability Description

This is a variant of this vulnerability:
https://hackerone.com/reports/310443

The `extend` function can be tricked into adding or modifying properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:

Craft an object of form `{__proto__: {...}}` and send it to `extend(true, {}, ...)`.

```javascript
let extend = require('extend');
let payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
extend(true, {}, payload);
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
- **Report Triaged**
- **External User Joined**
- **2018-07-18** @ljharb: The first point to make is that this package is a port of jQuery's logic, and should remain so - so any fixes that aren't present in jQuery shouldn't be added to this package (and any in jQuery that are missing should certainly be added).

I believe https://github.com/justmoon/node-extend/pull/48 is intended to address this issue (meaning, it's not a newly discovered issue). I'm willing to merge this soon - would doing so address this issue?
- **2018-07-18** @ljharb: (Separately, it'd be great to get access to https://hackerone.com/reports/309391 if i maintain any other modules that are affected by it)
- **2018-07-19** @e_lexy: @ljharb all the modules mentioned in https://hackerone.com/reports/309391 have been triaged in separate issues. This means the author of each module has been contacted. All those separate issues have been disclosed a few months ago. Copying the list of modules here:
hoek
hoek.merge
hoek.applyToDefaults

lodash
lodash.defaultsDeep
lodash.merge
lodash.mergeWith

merge
merge.recursive

defaults-deep
defaults-deep

merge-objects
merge-objects

assign-deep
assign-deep

merge-deep
merge-deep

mixin-deep
mixin-deep

deep-extend
deep-extend

merge-options
merge-options

deap
deap.clone
deap.extend
deap.merge
deap

merge-recursive
merge-recursive.recursive

sequelize
sequelize.Utils.mergeDefaults
- **2018-07-19** @e_lexy: @asgerf would you be able to verify that fix?
https://github.com/justmoon/node-extend/pull/48/files
- **2018-07-19** @asgerf: Can confirm that the above PR prevents the attack vector.
- **2018-07-19** @e_lexy: Thanks @asgerf 
As soon as @ljharb merges it and a new release is published, we can move ahead to disclose.
- **2018-07-19** @ljharb: I've merged the PR and will release a v3 shortly; I'll backport the fix to v2 and v1 later today. Please hold off disclosing until after I've done that; I'll update here when I have.
- **2018-07-19** @e_lexy: @ljharb Thanks for your quick action. I will hold of on disclosure until you share your update.
- **2018-07-19** @ljharb: I've released v3.0.2 and v2.0.2 with the fix; it's a lot of effort to backport to v1 (v2 has been out since October 2014), so I'm not likely to do it.
- **Report Severity Updated**
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-01-03** @e_lexy: [CVE requested](https://hackerone.com/nodejs-ecosystem/cve_requests/1284)
- **2019-05-01** @asgerf: @e_lexy it seems `npm audit` still does not warn about the vulnerable versions of `extend`. Can you ensure its database gets updated, or if not, who should I talk to about that?
