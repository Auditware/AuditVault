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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Code in vtls/nss.c interprets CApath option differently than OpenSSL-using code,
user can be mislead to unsecure use of curl/libcurl easily. CApath directory
can contain CRL files in addition to CA certificate files and they are used
for certificate verification when curl calls OpenSSL. Code path using NSS blindly
loads all files residing in CApath as CA certificates instead, which has two effects:
first, the meaning of CRLs is ignored and revoked certificates can be accepted,
second, NSS may find duplicate SN in corrupt 'CA certificate' during TLS handshake and break
connection to legitimate server (NSS does not perform full validation in load
and search routines, ASN.1 templates used can mistakenly match both types of object).
Such use is not explicitly supported according to curl documentation strictly speaking
but I find current implementation very risky (I know security professionals who have fallen to this trap)
and recommend adding validation/type detection for each file loaded
from CApath (or using c_hash-style name extensions if any file with such extension
is present, if full validation is deemed too complicated or as a quick fix helping most users).

# Steps To Reproduce:
  1. revoke a certificate, install resulting CRL in CApath, try with NSS-based curl
  2. try connecting TLS server whose CA has self-signed certificate with SN=1 and CRL in CApath
     (success can depend on order of directory entries)

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

An attacker can impersonate TLS server using revoked (presumably leaked) certificate.

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
