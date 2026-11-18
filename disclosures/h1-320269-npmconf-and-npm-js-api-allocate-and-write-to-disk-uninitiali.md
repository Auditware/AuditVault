---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2018-05-12
submitted: 2018-02-27T13:52:05.982Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/320269"
title: "`npmconf` (and `npm` js api) allocate and write to disk uninitialized memory content when a typed number is passed as input on Node.js 4.x"
---
# `npmconf` (and `npm` js api) allocate and write to disk uninitialized memory content when a typed number is passed as input on Node.js 4.x

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-12

- Report: [https://hackerone.com/reports/320269](https://hackerone.com/reports/320269)
- CWE: Out-of-bounds Read
- Submitted: 2018-02-27T13:52:05.982Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Buffer allocation issue in `npmconf` (and `npm` package js api).
It allows to extract sensitive content from uninitialized memory by passing typed input to `setCredentialsByURI`, limited to Node.js 4.x and below.

# Module

**module name:** `npmconf`
**version:** 2.1.2
**npm page:** `https://www.npmjs.com/package/npmconf`

**module name:** `npm`
**version:** 5.6.0
**npm page:** `https://www.npmjs.com/package/npm`

## Module Description

> The config thing npm uses

## Module Stats

### npmconf

40 292 downloads in the last day
219 837 downloads in the last week
897 947 downloads in the last month

~1 0775 364 estimated downloads per year

`npmconf` is deprecated, but doesn't mention security issues and is still widely used, and the usage seems to *increase* over time.

### npm

`npm` download stats are not representive here, as it's mainly used as a CLI, not as JS api, but here they are (e.g. for comparison with `npmconf`):

141 545 downloads in the last day
1 067 194 downloads in the last week
3 701 192 downloads in the last month

~44 414 304 estimated downloads per year

# Vulnerability

## Vulnerability Description

When a number is passed to the `password` property of `config.setCredentialsByURI`, `npmconf`/`npm` allocate uninitialized Buffer instances during conversion to base64 (on Node.js 4.x) due to missing type checks before passing user input to the `new Buffer()` constructor.

Those Buffer instances could (and most likely will) contain sensitive information, see [Buffer-knows-everything.md](https://github.com/ChALkeR/notes/blob/master/Buffer-knows-everything.md).

Node.js 4.x is stated as supported in `npm`.

## Steps To Reproduce:

Use Node.js 4.x LTS or below.

### npmconf
```js
var URI = "https://registry.example.com:8661/";
require('npmconf').load({}, function (err, conf) {
  conf.setCredentialsByURI(URI, {username: 'foo', email: 'boo@example.com', password: 200});
  console.log(conf.getCredentialsByURI(URI)); // This just outputs the setting
  // conf.save('user', function() {}) // Warning: writes base64-encoded uninitialized buffer .npmrc
});
```

### npm
```js
var URI = "https://registry.example.com:8661/";
require('npm').load({}, function (err, npm) {
  npm.config.setCredentialsByURI(URI, {username: 'foo', email: 'boo@example.com', password: 200});
  console.log(npm.config.getCredentialsByURI(URI)); // This just outputs the setting
  // npm.config.save('user', function() {}) // Warning: writes base64-encoded uninitialized buffer .npmrc
});
```

## Supporting Material/References:

- Arch Linux
- Node.js v4.8.7 (latest in 4.x LTS branch)
- npm 5.6.0

# Wrap up

- I contacted the maintainer to let him know: Y
- I opened an issue in the related repository: N

I reported this initially on 2016-01-20 over email, but didn't receive any response.
Probably was deemed insignificant or out-of-scope, but I still think this should be fixed and disclosed.

## Impact

Read uninitialized memory, extracting sensitive information from it.
Cause a DoS by large Buffer allocation and conversion to string.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-28** @lirantal: Hi @chalker,

Thanks for reporting this vulnerability.
While both modules have shared maintainer (isaacs) there are other different collaborators between the projects.

since `npmconf` is already set as deprecated I assume there is not going to be any further fixes there but we just want to disclose the vulnerability, right?

I'll invite some of the module maintainers for `npm`
- **2018-03-28** @chalker: @lirantal Thanks.

Yes, it looks like npmconf indeed got deprecated by now.
But it has 1 088 971 downloads per month though and that appears to be *inceasing* (compare to numbers mentioned in the post above).

In fact, `npmconf` worries me *more* than `npm` here,  because for the latter almost all installs are probably for the CLI tool which is not affected, but `npmconf` is always used as an API, which is where the problem is.
- **External User Joined**
- **2018-03-29** @iarna: Hi, for the record, I'm the npm cli lead and one of the maintainers of many npm repos, including those two.

Risk:

You loaded a config via `npmconf` (deprecated) or `npm` as a library (unsupported) and added a username and password pair where the password was a `Number` and then you called `save()`. At which point uninitialized memory from that process would be written to the user running the process's `.npmrc`.

State of things:

`npm` had a patch that coincidentally fixed this in `v6.0.0-next.0`, and I'd be happy to bring that patch `npm@5` as well. (`npm@6` is an active release candidate but in the meantime `npm@5` remains supported.) `npm` has 1908 dependents published on the registry. It is unknown how many use it as a library versus calling it as a cli. Some do, despite this being an unsupported mode of operation.

`npmconf` has been deprecated since (at least) Jan 2016 and has been entirely unsupported since then. I would be happy, however, to do a new release of it with a patch, while retaining its deprecated status.` npmconf` has 123 dependents published to the registry.

Impact:

npm's own use would only go through the code path with `new Buffer` on when adding a user on third party registries, as `registry.npmjs.com` authenticates via tokens and not username/password pairs. As @chalker noted, in that scenario, it's still not vulnerable as there's no way to force `npm` to pass anything in other than a `String`.

I would be genuinely surprised if anyone using `npm` internals as a library or `npmconf` called `setCredentialsByURI`. 

A naive search seems to back this up: https://www.google.com/search?q=site%3Agithub.com+setCredentialsByURI

Which in contrast to a search for npmconf: https://www.google.com/search?q=site%3Agithub.com+npmconf
- **2018-03-29** @chalker: Hi, @iarna, and thanks for the reply on this!

> You loaded a config via npmconf (deprecated)

Correct. But the downloads/month of `npmconf` seem increasing over time.

> or npm as a library (unsupported)

Huh? But `npmconf` [Readme](https://github.com/npm/npmconf#this-package-is-deprecated) redirects there:

> npm itself is the best tool to use to manage its configuration

Next (*needed to break the citation*):

> and added a username and password pair where the password was a Number

Correct.

> and then you called save(). At which point uninitialized memory from that process would be written to the user running the process's .npmrc.

Not entirely correct — `.save` call is not required. Please see the code snippets attached above — it is also a risk when someone does that in-memory, which could be more likely than writing to a file.

> npm had a patch that coincidentally fixed this in v6.0.0-next.0, and I'd be happy to bring that patch npm@5 as well. 

Great, SGTM for npm@5 and npm@6.

> npmconf has been deprecated since (at least) Jan 2016 and has been entirely unsupported since then

Coincidentally, Jan 2016 was the date of the original report to security@npmjs.com ;-). According to the git history, `npmconf` has been deprecated before the report, about for two weeks.

At the current time, what worries me about `npmconf` is its downloads/month stats rising over time — seems like the deprecation message upon install is not effective.

I am not sure if that should be fixed or just disclosed with adding to vuln databases and changing the deprecation message to something more effective  — any approach would work to me. I understand the negative effects of making it seem that an unsupported package is supported, and I trust your opinion on that whatever path you choose here. Imo, even simply disclosing this issue might help a bit.

> I would be genuinely surprised if anyone using npm internals as a library or npmconf called setCredentialsByURI.

I have found signs of that usage, though I assume it's fairly minimal, e.g. https://github.com/ctran/nexus-cli/blob/master/index.js#L124 would fit for «anyone», or https://github.com/HelloWallet/secret-service/blob/master/lib/modules.js#L334-L339. There seem to be more — but not a lot of them in public packages, so yes, for public packages the usage seems minimal.

Nikita.
- **2018-04-24** @lirantal: @chalker @iarna are we ok with disclosing the report?
- **2018-05-11** @lirantal: @chalker @iarna
ping
- **2018-05-11** @chalker: I'm fine with disclosing, having `npm` fixed and `npmconf` emitting an additional warning after disclosure with `npm audit` solves this.
- **2018-05-11** @lirantal: Cool, I'll go ahead with a public disclosure.
The report will be about `npmconf` with version 2.1.2 and no patched version, right?
- **2018-05-11** @iarna: `npmconf` 2.1.3 has been published with a patch.
- **2018-05-12** @lirantal: Thanks @iarna  , I see it.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
