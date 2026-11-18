---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
body: true
date: 2020-10-10
submitted: 2019-01-12T00:41:08.110Z
bounty_usd: 1500
votes: 16
cve: "CVE-2016-10166"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/478367"
title: "efree() on uninitialized Heap data in imagescale leads to use-after-free"
---
# efree() on uninitialized Heap data in imagescale leads to use-after-free

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 16 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-10

- Report: [https://hackerone.com/reports/478367](https://hackerone.com/reports/478367)
- CWE: Use After Free | CVE: CVE-2016-10166
- Submitted: 2019-01-12T00:41:08.110Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The core bug: https://bugs.php.net/bug.php?id=77269

This bugfix actually involves two vulnerabilities: a call to efree on uninitialized data and another free()  based vulnerability. What is described below is a bug that was fixed in libgd two years ago (CVE-2016-10166), but the patch was never applied to PHP's libgd. Furthermore, the patch for that CVE introduced a use after free vulnerability, also in PHPs `imagescale()` function. This can be seen in the comment history of the PHP bug.

----
The bug occurs in ext/gd/libgd/gd_interpolation.c in the function _gdContributionsAlloc(int line_size, int windows_size). The function will attempt to allocate helper structs and receives two parameters: the line size and the windows size. To prevent integer overflows, each parameter is passed to gd's overflow2() function before being used in the gdMalloc function.
(gdMalloc is just #define gdMalloc emalloc).

However, if the overflow2 check for windows size is positive, overflow_error is set to true, which leads to gd attempting to free all the lines allocated so far. The issue is that gd does not check if any lines have been allocated so far at all. By supplying input that leads to overflow2 being true, .Weights is freed, which is an unintialized pointer. 

```
if (overflow2(line_length, sizeof(ContributionType))) {
		gdFree(res);
		return NULL;
	}
	res->ContribRow = (ContributionType *) gdMalloc(line_length * sizeof(ContributionType));
	if (res->ContribRow == NULL) {
		gdFree(res);
		return NULL;
	}
	for (u = 0 ; u < line_length ; u++) {
		if (overflow2(windows_size, sizeof(double))) {
			overflow_error = 1;
		} else {
			res->ContribRow[u].Weights = (double *) gdMalloc(windows_size * sizeof(double));
		}
		if (overflow_error == 1 || res->ContribRow[u].Weights == NULL) {
			unsigned int i;
			u--;
			for (i=0;i<=u;i++) {
                gdFree(res->ContribRow[i].Weights);
			}
```

When the for loop is reached that frees the uninitialized pointers, i will be 0 and u too. However, before the for loop is entered u is decremented by one so it will turn into -1 , which leads to the condition i <=0 never being met.

## Impact

This vulnerability can be used to write a local safe mode bypass and can potentially be exploited remotely.

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @simonscannell - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **Report Triaged**
- **Report Severity Updated**
- **2019-05-19** @simonscannell: Hi @tuxedo, thank you for triaging!
- **2019-05-28** @simonscannell: Oh btw, something I only realized now: This vulnerability exists in the upstream PHP source code. PHP installations that rely on the actual libgd are vulnerable to another UAF vulnerability in the same function that was introduced as a patch for this vulnerability, which we discovered by fixing this one.
- **2019-10-08** @simonscannell: I saw a couple of the IBB programs recently resolving and disclosing bugs. Does that mean PHP bugs will get handled soon? Thanks!
- **Hacker Requested Mediation**
- **2020-01-21** @simonscannell: I saw that the password was changed on the PHP bug report. Did this come from you guys?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-10** @simonscannell: Thank you so much!
- **Agreed On Going Public**
- **Report Became Public**
