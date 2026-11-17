---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "informative"
weakness: "Improper Certificate Validation"
enriched: true
date: 2021-01-08
submitted: 2019-10-14T14:51:22.948Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/curl|curl]]"
reporter: "salvet"
source: "https://hackerone.com/reports/713975"
title: "Only OpenSSL handles a CRL when passed in via CApath "
---
# Only OpenSSL handles a CRL when passed in via CApath 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** curl | **Disclosed:** 2021-01-08

- Report: [https://hackerone.com/reports/713975](https://hackerone.com/reports/713975)
- CWE: Improper Certificate Validation
- Submitted: 2019-10-14T14:51:22.948Z

## Timeline

- **2019-10-14** @salvet: Feel free to adjust severity, I am really unsure about appropriate value giving the specifics of the problem.
- **Report Filed**
- **2019-10-14** @kdudka: libcurl has a separate option to load CRLs.  As far as I know, the CApath option has never been documented as a way to load CRLs in libcurl's documentation.
- **2019-10-14** @salvet: Unfortunately, that option is rarely usable in practice, it takes only single CRL as far as I know.
You are right about the documentation, technically, on the other hand, if CApath use is not supposed
to result in loading CRLs, backends (including the OpenSSL one) should prevent it
or documentation should warn any file under CApath other than CA cert invokes undefined behavior.
IMO, making NSS backned work like OpenSSL one is much nicer option.
- **2019-10-14** @kdudka: I do not think it is possible to make libcurl behave equally with both the TLS backends because the implementation is simply not under our control.  Relying on implementation details of OpenSSL when you are not using OpenSSL is just bad idea.  This is not a security issue of libcurl as I understand it.
- **2019-10-14** @bagder: I'm with @kdudka here. The documentation for `CURLOPT_CAPATH` says nothing about it being able to get a CRL and I doubt very many people are aware. I don't think there's anything in there indicating something else than such a functionality is there by pure chance and there's no guarantee that it will work. No not, in the future and not with other TLS backends.

It don't think it is just a matter of changing NSS to do this. We support a busload of other TLS backends as well and I'm pretty sure none of the others support this side-effect.

Therefore, I'm not seeing this as  a security problem.
- **Report Title Updated**
- **2019-10-16** @salvet: So... any caller should check what backend is use in particular installation and adjust used options accordingly?
I don't think that is realistically possible, especially with existing software... 

At a minimum, NSS backend should be extended so that can input multiple CRLs from CRLfile,
I don't think it can do it currently, so there is no way to use CRLs without knowing server's CA in advance...
- **2019-10-16** @bagder: The fact that the libcurl option for providing a file name to a "CA store" by a chance can be used to pass in a CRL (instead?) in some circumstances, is not a documented feature and not something a user should rely on. No matter which TLS backend that's used. What isn't documented to work is not guaranteed to remain to work like that in future versions of libcurl.

> At a minimum, NSS backend should be extended so that can input multiple CRLs from CRLfile

To me it sounds like you'd like *all* TLS backends to have that as a supported feature. Not done via an undocumented loophole. I don't think I would object to such an improvement.

Either way, I cannot see a security problem here.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
