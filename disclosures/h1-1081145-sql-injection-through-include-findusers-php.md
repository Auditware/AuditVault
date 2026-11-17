---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2022-10-06
submitted: 2021-01-19T02:42:46.716Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/impresscms|ImpressCMS]]"
reporter: "egix"
source: "https://hackerone.com/reports/1081145"
title: "SQL Injection through /include/findusers.php"
---
# SQL Injection through /include/findusers.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** ImpressCMS | **Disclosed:** 2022-10-06

- Report: [https://hackerone.com/reports/1081145](https://hackerone.com/reports/1081145)
- CWE: SQL Injection
- Submitted: 2021-01-19T02:42:46.716Z

## Report summary

Here you can find a full technical write-up for this vulnerability and its exploitation:
https://karmainsecurity.com/impresscms-from-unauthenticated-sqli-to-rce

## Timeline

- **Report Filed**
- **2021-01-19** @egix: Hi,

I just realized this SQL Injection might be exploited also to execute INSERT/UPDATE/DELETE statements by using a semicolon. By sending the following payload within the "groups" POST parameter, I've been able to create a new user:

```
groups[]=1); INSERT INTO i36fd6f18_users (uname) VALUES (0x414243)%23
```

However, in order to do that, an attacker should guess the database tables prefix.
- **Report Triaged**
- **2021-02-03** @egix: Hi @fiammybe,

the Common Vulnerabilities and Exposures project (cve.mitre.org) has assigned the name CVE-2021-26599 to this vulnerability.
- **2021-11-17** @fiammybe: Hi, this is now in ImpressCMS 1.4.3, which is scheduled for release on 1/12
- **2021-12-18** @egix: Hi @fiammybe 

I just noticed you released ImpressCMS v1.4.3-rc on December 5. Is this the official version that should solve the issues I've reported? Am I now allowed to publish security advisories on my website?
- **2021-12-30** @egix: Hi,

Just wanted to let you know I've retested this issue with version **1.4.3-rc** and it's still exploitable!
- **2022-02-11** @fiammybe: Hi @egix , that was possible, not all the patches were in :-( It should be ok now in the 1.4.3 branch.
- **2022-02-11** @egix: Hi @fiammybe,

while #1081137 looks partially fixed in the 1.4.3 release (I can't access the `/include/findusers.php` script while being unauthenticated), the SQL Injection is still not correctly fixed. 
 
This means a malicious user might still be able to carry out SQL Injection attacks.
- **2022-02-12** @skenow: Did you test the final release for the SQLi? The POST parameters are filtered to only allow integers for groups, anything else will be rejected. We did not change the getUserCountByGroupLink() logic and trapped the attack sooner.
- **2022-02-13** @egix: Hi @skenow 

Yes, I did test this on the 1.4.3 release (downloaded from GitHub). So, I believe I accidentally discovered another security issue, probably lying in the `icms_core_DataFilter::checkVarArray()` method. I see you're setting to **int** the `groups` key of the `$filter_post` array, so the `$groups` variable should be an int. However, if you provide the "groups" POST parameter as an array, then the logic behind the `checkVarArray()` method could be bypassed. 

I've modified the `/include/findusers.php` script in this way (notice the last line):

```
if (!empty($_POST)) {
	$clean_POST = icms_core_DataFilter::checkVarArray($_POST, $filter_post, true);
	extract($clean_POST);
}
var_dump($groups);die;
```

And this is what I get when I call the findusers script, providing the "groups" POST parameter as an array of one string:

{F1617398}

Like you said, you did not change the getUserCountByGroupLink() logic, so SQL injection is still possible.
- **2022-02-13** @skenow: Thank you @egix. I see where the root of the problem is now. The checkVarArray() is recursive, but does not pass the filter assigned to the variable to each of the array keys.
- **2022-02-13** @skenow: Would you be willing to test a proposed change to address this? We'd like to resolve ASAP
- **2022-02-14** @egix: Sure, please feel free to share the proposed change.
- **2022-02-16** @skenow: I haven't fully tested this against what we need for functionality, but it does insert the filter type to the elements of an array. 

In libraries/icms/core/DataFilter.php, lines 421 - 423, change this -

		if (is_array($input[$key])) {
			$output[$key] = self::checkVarArray($input[$key], array($key => $filter), FALSE);
		} else {

to this -
		if (is_array($input[$key])) {
			$inner_filter = array_fill_keys(array_keys($input[$key]), $filter);
			$output[$key] = self::checkVarArray($input[$key], $inner_filter, true);
		} else {

Please let us know your findings.
- **2022-02-19** @egix: Hi @skenow 

I confirm this change should solve the issue.
This is the response I get by using the above request:

```
HTTP/1.1 200 OK
Date: Sat, 19 Feb 2022 11:16:16 GMT
Server: Apache/2.4.41 (Ubuntu)
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Content-Length: 35
Connection: close
Content-Type: text/html; charset=UTF-8

array(1) {
  [0]=>
  bool(false)
}
```
- **2022-02-19** @skenow: Thank you for verifying, @egix - now we will proceed with regression testing.
- **2022-03-17** @egix: Hi @skenow @fiammybe 

I just noticed you released version **1.4.4** last week, and it includes the above patch. Could you please close this report? Thanks!
- **2022-03-18** @egix: Hello again,

Just wanted to let you know you that I'm planning to publish 4 security advisories on my website as soon as the other reports will go public, which are currently scheduled to be disclosed at March 22, 2022. I'd like to include also details of this vulnerability, since it's now publicly fixed... Hope that is OK with you.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
