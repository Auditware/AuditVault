---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/missing-encryption-of-sensitive-data
  - env/web
  - stack/node
substate: "resolved"
weakness: "Missing Encryption of Sensitive Data"
enriched: true
body: true
date: 2019-08-14
submitted: 2019-07-12T11:31:20.661Z
bounty_usd: null
votes: 8
cve: "CVE-2019-5448"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/640904"
title: "Yarn transfers npm credentials over unencrypted http connection"
---
# Yarn transfers npm credentials over unencrypted http connection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-08-14

- Report: [https://hackerone.com/reports/640904](https://hackerone.com/reports/640904)
- CWE: Missing Encryption of Sensitive Data | CVE: CVE-2019-5448
- Submitted: 2019-07-12T11:31:20.661Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Module

**module name:** yarn
**version:** 1.16.0
**npm page:** `https://www.npmjs.com/package/yarn`

## Module Description

> Fast, reliable, and secure dependency management.

## Module Stats

> Replace stats below with numbers from npm’s module page:

166 703 downloads in the last day
849 928 downloads in the last week
3 772 290 downloads in the last month

# Vulnerability

## Vulnerability Description

For scoped packages that are listed as `resolved "http://registry.npmjs.org/@...` in yarn.lock, yarn trasfers npm credentials (i.e. `_authToken`) over unencrypted http connection. This allows any MitM (for example, a proxy or a VPN) to sniff out npm credentials, given that the developer in question performs `yarn install` on such a yarn.lock file.

A quick search shows that there is a number of `yarn.lock` files affected by this on GitHub, some examples:
 * https://github.com/EC-Nordbund/ec-verwaltungs-app/blob/ab961352d5dd53834a51793d6e2c4bc69a2b22d4/packages/api/yarn.lock#L36
 *  https://github.com/nujabes403/boilerplate2/blob/61613e526aec02c5dd4227457deb8676d66780d0/yarn.lock#L7

There seem to be __many of those__ on GitHub.

Looks like not only it was possible to craft a yarn.lock with a malicious intent, but also this seems to be a common pattern that yarn created itself at some point or under some circumstances and that gets persistent from older versions.

## Steps To Reproduce:

1. Perform an `npm login` or just write `//registry.npmjs.org/:_authToken=[REDACTED - see source report]` (which is the format npm uses) to ~/.npmrc. **Doing this from your own account would leak your npm credentials on next steps, so better just use a placeholder.**
2. Create an empty package with a single dependency on `"@babel/core": "^7.5.4"`
3. Perform `yarn install`
4. Replace all occurances of `https://registry.yarnpkg.com` with `http://registry.npmjs.org/` in the generated `yarn.lock`
    
    Alternatively to steps 2-4 -- just use an already existing yarn.lock with `resolved "http://registry.npmjs.org/@` in it (lots of those on GitHub), but be careful with that.
5. Clear yarn cache and node_modules: `rm -rf ~/.cache/yarn/ node_modules`. Let's assume you just downloaded an affected yarn.lock on your clean machine.
6. Start wireshark with `tcp dst port 80` filter.
7. Run `yarn install`

Observed result is attached on a screenshot.

## Supporting Material/References:

- `Linux yoga 5.1.5-arch1-2-ARCH #1 SMP PREEMPT Mon May 27 03:37:39 UTC 2019 x86_64 GNU/Linux`
- Node.js v12.6.0
- npm 6.10.1

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: N 
- I opened an issue in the related repository: N

## Impact

Attacker (MitM) being able to:
* Impersonate the affected account
* Publish packages from the affected account that could also get used by the affected account/company in the future (for protected packages) and by anyone in the ecosystem (for public packages)
* Perform logout and break installs of protected packages

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2019-07-12** @arcanis: To give you some context, the npm registry returns (used to?) tarballs with the http protocol. This was tracked at least [here](https://npm.community/t/some-packages-have-dist-tarball-as-http-and-not-https/285/40), and lasted for at least a few months. I'm not sure whether it got fixed, but all the lockfiles generated during that time that referenced the affected packages store the bogus protocols.

To mitigate the issue we'll push an update that will lead Yarn to disregard the stored values (and what the registry returns) and always use https for the most common registries. This unfortunately won't fix the issue until after our users upgrade.

---

Regarding someone enabling this with a malicious intent in general (as in, submitting a PR to a project with a lockfile containing such a pattern), I'd tend to assume it's the user responsibility to review PRs, as a compromised lockfile (whether it's for Yarn or npm) will be dangerous in many ways (for example, you'd just have to put a typo somewhere in the resolved tarball url to download potentially different code). In fact, I've opened [a thread](https://github.com/github/linguist/issues/4348) in the past to ask for lockfiles to not be collapsed on Github precisely for this reason.
- **2019-07-12** @chalker: Affiliation notice: I am currently working for [Exodus](https://www.exodus.io/) and am sponsored by them to perform security research.
- **2019-07-12** @arcanis: Here's [a patch](https://github.com/yarnpkg/yarn/compare/https-enforcement?expand=1#diff-9917e0f368cd09d6825a5fb10c3c6d7c); can you confirm @chalker that it fixes the vulnerability you described?

I've also opened an [issue](https://github.com/yarnpkg/berry/issues/293) on the v2 tracker to change our https policy starting from the v2 (we won't be able to do it in the v1 since it would be a breaking changes for people using third-party registries).
- **2019-07-12** @chalker: @arcanis I think registry.npmjs.com should be also forced to use https? Not only registry.npmjs.org.
- **2019-07-12** @arcanis: Good point! Fixed in https://github.com/yarnpkg/yarn/pull/7393
- **2019-07-12** @chalker: @arcanis Apart from that -- how possible would it be to not transfer auth at all for http:// registries, like it is apparently done for non-scoped npm packages? That should be a less breaking change than completely blacklisting http:// by default, perhaps it could be acceptable? Or not?
- **2019-07-12** @arcanis: I'm not sure; the problem is that I'm guessing that some setups use third-party registries. On those setups, it's reasonable to assume that part of them are accessed through http. It's also reasonable to assume that part of them have some kind of authentication. Now the question is how much they intersect, and I lack data to have a real idea - although given the size of the JS ecosystem, even 1‰ would significantly break setups 😕

Given that we're already working on a major anyway (expected before the end of the year), I would tend to err on the cautious side and keep the existing behaviour for now.
- **External User Joined**
- **2019-07-12** @chalker: @aeleuterio would it be possible/sensible to auto-logout all tokens that were transfered to npm registry via unencrypted connection?
- **2019-07-12** @chalker: > Regarding someone enabling this with a malicious intent in general (as in, submitting a PR to a project with a lockfile containing such a pattern), I'd tend to assume it's the user responsibility to review PRs, as a compromised lockfile

The problem is that users probably won't catch that packages being resolved to `http://` could mean that the yarn lock is "compromised". A lot of such existing yarn.lock files that no one noticed (even with scoped packages) indicate that.

Moreover, yarnpkg/yarn lockfile itself has a `http://`-resolved dep that apparently passed PR review: https://github.com/yarnpkg/yarn/blob/v1.17.3/yarn.lock#L5646. It's not scoped, but that difference might also be subtle while reviewing a PR. There are more of those in git history.
- **2019-07-12** @chalker: @arcanis Re: https://github.com/yarnpkg/yarn/pull/7393 -- I can confirm that yarn with that PR does not use unencrypted connections to npm registry on my tests.

But perhaps it would make sense to also update the lockfile to point to https:// endpoints and write it to disk?
So that a fixed yarn.lock gets commited to the repo.
- **External User Joined**
- **2019-07-12** @chalker: An example of an affected yarn.lock in a popular project (uses http: for scoped packages, leaks credentials): https://github.com/facebook/docusaurus/blob/v1.4.0/yarn.lock#L7, same file: https://github.com/facebook/docusaurus/blob/v1.6.0/v1/yarn.lock#L7

@arcanis I do not think that this is something that is likely to be catched by PR review unless one knows what to look for.
- **2019-07-12** @chalker: Also https://github.com/facebook/jest/blob/v23.4.0/yarn.lock#L101.

This looks *very* common, mostly coming from `@babel` and `@types` scopes.
- **2019-07-12** @chalker: I see that a version of yarn with the fix from https://github.com/yarnpkg/yarn/pull/7393 was published as v1.17.3 (rc, not latest).

What will the disclosure timeline look like?
- **2019-07-12** @arcanis: We have some unrelated issues with the website, which affects the release process. Once it's back to normal I'll move the 1.17.3 to stable, and after that I think we'll post an article explaining the problem and suggesting to upgrade when users get the chance (and crediting you for the discovery). Does that sound reasonable?
- **2019-07-12** @arcanis: The 1.17.3 reached stable, the blog post PR is here: https://github.com/yarnpkg/website/pull/980/files
I plan to submit it tomorrow after getting some other maintainers to ack it.
- **2019-07-12** @chalker: @arcanis Thanks! I am planning to file a blog post in my notes repo once that gets merged, mostly with information from this ticket. Does that sound good?

As for the blog post -- I would also recommend to refresh all npm tokens (i.e. to revoke them and relogin, and do that periodically in general) and to enable 2FA.
- **2019-07-12** @arcanis: For sure 👍
- **2019-07-12** @aeleuterio: @chalker do you have a list of tokens for us to revoke? We'll revoke them and contact users. Thank you for looping us in this issue!
- **2019-07-13** @arcanis: Blog post released, and tweeted over at https://twitter.com/yarnpkg/status/1149960702356013056 🙂
- **2019-07-13** @chalker: @arcanis My post also released here: https://github.com/ChALkeR/notes/blob/master/Yarn-vuln.md
Thanks!

@aeleuterio I do not, it is impossible to tell what tokens exactly were affected by this without having registry server-side logs (if there are any). I was asking if it would be possible (and reasonable) to implement a protocol check on the registry side that would mark all tokens received over http as compromised in real-time.
- **2019-07-15** @vdeturckheim: CVE required, will disclose when available.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
