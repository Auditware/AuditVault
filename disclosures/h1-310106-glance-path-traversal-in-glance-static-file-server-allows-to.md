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
date: 2018-03-04
submitted: 2018-01-29T10:34:13.032Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3715"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/310106"
title: "[glance] Path Traversal in glance static file server allows to read content of arbitrary file"
---
# [glance] Path Traversal in glance static file server allows to read content of arbitrary file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-04

- Report: [https://hackerone.com/reports/310106](https://hackerone.com/reports/310106)
- CWE: Path Traversal | CVE: CVE-2018-3715
- Submitted: 2018-01-29T10:34:13.032Z

## Timeline

- **Report Filed**
- **2018-01-29** @lirantal: Hi @bl4de, 

Thanks a lot for reporting this to us.
I quickly tried to reproduce your report but I'm hitting an error with the package:

```
./glance/node_modules/filed/main.js:33
  this.mimetype = options.mimetype || mime.lookup(this.path.slice(this.path.lastIndexOf('.')+1))
                                           ^

TypeError: mime.lookup is not a function
```
- **2018-01-29** @bl4de: Hi @lirantal 

It seems that mime module was not installed in your ./node_modules folder.
All tests I am performed I start from removing old ./node_modules folder and install module I am going to test locally (without -g option) and then call tested module in this way:

$ ./node_modules/PACKAE_NAME/bin/EXECUTABLE --option1 value --option2 value


Or you can try install mime module, probably it has to be installed globally as well:
$ npm install -g mime
- **2018-01-29** @lirantal: I'm installing the module on a fresh new project locally, so nothing is installed globally. I did add the mime module just in case but same error. (we're on the same Node and npm versions).

The problem seems to be not with the mime module but the version it is using which maybe doesn't have the `lookup` function anymore... ?
- **2018-01-29** @bl4de: Hmm, that's really weird.

Just did it once again and it works fine :/

Here's what I've just done, command by command:

```
me:~/playground/hackerone/Node$ rm -rf node_modules/
me:~/playground/hackerone/Node$ npm install glance
npm WARN saveError ENOENT: no such file or directory, open '/home/rafal.janicki/playground/hackerone/Node/package.json'
npm WARN enoent ENOENT: no such file or directory, open '/home/rafal.janicki/playground/hackerone/Node/package.json'
npm WARN Node No description
npm WARN Node No repository field.
npm WARN Node No README data
npm WARN Node No license field.

+ glance@3.0.3
added 12 packages in 1.596s
me:~/playground/hackerone/Node$ tree -L 1 node_modules/
node_modules/
├── abbrev
├── bash-color
├── filed
├── glance
├── html-ls
├── ls-stream
├── mime
├── nopt
├── through
├── utils-fs-exists
└── xtend

11 directories, 0 files
me:~/playground/hackerone/Node$ ./node_modules/glance/bin/glance.js --verbose --dir ./node_modules/
glance serving node_modules/ on port 8080

```

Works fine:

```
me:~/playground/hackerone/Node$ curl -v http://127.0.0.1:8080
* Rebuilt URL to: http://127.0.0.1:8080/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-type: text/html;charset=utf-8
< Date: Mon, 29 Jan 2018 13:57:50 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
< 
<ul>
<li><a href=".bin/">.bin/</a></li>
<li><a href="abbrev/">abbrev/</a></li>
<li><a href="bash-color/">bash-color/</a></li>
<li><a href="filed/">filed/</a></li>
<li><a href="glance/">glance/</a></li>
<li><a href="html-ls/">html-ls/</a></li>
<li><a href="ls-stream/">ls-stream/</a></li>
<li><a href="mime/">mime/</a></li>
<li><a href="nopt/">nopt/</a></li>
<li><a href="through/">through/</a></li>
<li><a href="utils-fs-exists/">utils-fs-exists/</a></li>
<li><a href="xtend/">xtend/</a></li>
</ul>
* Connection #0 to host 127.0.0.1 left intact
me:~/playground/hackerone/Node$ 

```
- **2018-01-29** @lirantal: can you show the output for `npm ls` ?
- **2018-01-29** @bl4de: Sure, here you go:

```
me:~/playground/hackerone/Node$ npm ls
/home/rafal.janicki/playground/hackerone/Node
└─┬ glance@3.0.3
  ├── bash-color@0.0.3
  ├─┬ filed@0.1.0
  │ └── mime@1.2.11
  ├─┬ html-ls@1.0.0
  │ ├─┬ ls-stream@1.0.0
  │ │ └── through@2.2.7 extraneous
  │ └── through@2.3.4
  ├─┬ nopt@3.0.4
  │ └── abbrev@1.1.1
  ├── utils-fs-exists@1.0.1
  └── xtend@4.0.0

npm ERR! extraneous: through@2.2.7 /home/rafal.janicki/playground/hackerone/Node/node_modules/ls-stream/node_modules/through
me:~/playground/hackerone/Node$ 

```
- **2018-01-29** @lirantal: @bl4de the difference is in the mime package version as I suspected, since in my install I get the following:

```
└─┬ glance@3.0.3
  ├── bash-color@0.0.3
  ├─┬ filed@0.1.0
  │ └── mime@2.2.0
  ├─┬ html-ls@1.0.0
  │ ├─┬ ls-stream@1.0.0
  │ │ └── through@2.2.7
  │ └── through@2.3.4
  ├─┬ nopt@3.0.4
  │ └── abbrev@1.1.1
  ├── utils-fs-exists@1.0.1
  └── xtend@4.0.0
```

And indeed 2.x breaks some features like that `lookup` function.
I will downgrade manually to mime 1.x and re-test.
- **Report Triaged**
- **Cve Id Added**
- **Report Severity Updated**
- **External User Joined**
- **2018-02-01** @jarofghosts: Thanks for contacting me about this issue. I [committed a fix](https://github.com/jarofghosts/glance/commit/8cfd88e44ebd3f07e3a2eaf376a3e758b6c4ca19) and have published glance@3.0.4 that includes this fix. I have also `npm deprecate`d all versions below 3.0.4 with a note that that version fixes said vulnerability.
- **2018-02-01** @bl4de: Hi @jarofghosts 

Thanks for quick response.
Pretty neat fix! :) 

@lirantal  - I can't reproduce issue anymore. Looks resolved to me.

bl4de
- **2018-02-01** @lirantal: Great! Thanks for the quick response on this @jarofghosts and for validating @bl4de!

are you both ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **Report Resolved**
- **2018-02-01** @jarofghosts: I'm fine with the disclosure!
- **2018-02-02** @bl4de: Hi @lirantal ,

Yes, I am fine as well
- **2018-02-02** @lirantal: Great, I'll take care of disclosing it in time then, thank you both!
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
