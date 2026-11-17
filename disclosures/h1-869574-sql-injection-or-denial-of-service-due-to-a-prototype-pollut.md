---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2020-07-24
submitted: 2020-05-09T14:16:59.912Z
bounty_usd: null
votes: 8
cve: "CVE-2020-8158"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "phra"
source: "https://hackerone.com/reports/869574"
title: "SQL Injection or Denial of Service due to a Prototype Pollution"
---
# SQL Injection or Denial of Service due to a Prototype Pollution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-24

- Report: [https://hackerone.com/reports/869574](https://hackerone.com/reports/869574)
- CWE: SQL Injection | CVE: CVE-2020-8158
- Submitted: 2020-05-09T14:16:59.912Z

## Timeline

- **Report Filed**
- **2020-05-09** @nochnoidozor: Hi @phra,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-05-19** @pleerock: https://github.com/typeorm/typeorm/pull/6096 Im going to merge these changes to prevent reported issue and release a new npm version.
- **2020-05-19** @pleerock: 0.2.25 (latest) was released with a fix in.
- **2020-05-19** @phra: I've tested the proposed fix with the following snippet and the issue seems to be fixed:

```javascript
function isObject(item) {
    return (item && typeof item === "object" && !Array.isArray(item));
}

/**
 * Deep Object.assign.
 *
 * @see http://stackoverflow.com/a/34749873
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    console.log('mergeDeep')
    console.log(target)
    console.log(source)

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            const value = source[key];
            //if (value instanceof Promise)
            if (key === "__proto__" || value instanceof Promise)
                continue;

            if (isObject(value)
                && !(value instanceof Map)
                && !(value instanceof Set)
                && !(value instanceof Date)
                && !(value instanceof Buffer)
                && !(value instanceof RegExp)
                && !(value instanceof URL)) {
                if (!target[key])
                    Object.assign(target, { [key]: Object.create(Object.getPrototypeOf(value)) });
                mergeDeep(target[key], value);
            } else {
                console.log('else ' + key)
                console.log(target)
                Object.assign(target, { [key]: value });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

const a = {}
const b = JSON.parse(`{"__proto__":{"polluted":true}}`)
const c = JSON.parse(`{"constructor":{"prototype":{"polluted2":true}}}`)

mergeDeep(a, b)
mergeDeep(a, c)
console.log(`pwned: ${({}).polluted}`) //undefined
console.log(`pwned2: ${({}).polluted2}`) //undefined
```
- **2020-07-22** @phra: can we declare the bug solved and proceed to the disclosure? thanks.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-07-24** @phra: It seems that no NPM advisory was released for the reported vulnerability. I would suggest to create it ASAP due to the potential impact of the vulnerability.

```raw
phra@kali /tmp/test $ npm i --save typeorm@0.2.24
npm WARN test@1.0.0 No description
npm WARN test@1.0.0 No repository field.

+ typeorm@0.2.24
added 104 packages from 361 contributors and audited 104 packages in 4.197s

4 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

phra@kali /tmp/test $ npm audit
                                                                                
                       === npm audit security report ===                        
                                                                                
found 0 vulnerabilities
 in 104 scanned packages
```
- **2020-07-24** @marcinhoppe: @phra it is a manual process and it may take a bit of time until this finding is picked up by npm analysts.
- **2020-07-27** @marcinhoppe: @phra I requested a CVE for this finding: CVE-2020-8158.
