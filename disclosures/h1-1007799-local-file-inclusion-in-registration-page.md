---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-11-23
submitted: 2020-10-13T23:23:56.819Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "moloshy"
source: "https://hackerone.com/reports/1007799"
title: "Local File Inclusion In Registration Page"
---
# Local File Inclusion In Registration Page

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-11-23

- Report: [https://hackerone.com/reports/1007799](https://hackerone.com/reports/1007799)
- CWE: Path Traversal
- Submitted: 2020-10-13T23:23:56.819Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
When registering on https://████████ it is possible to use path traversal characters in a parameter allowing an attacker to read local files.

**Description:**
The registerUserInfoCommand.nextPageName parameter within the registration form is vulnerable to file path manipulation, where it is possible to submit a request containing path traversal characters (e.g. ../../../) followed by a local file, which will return the contents of the file. This can be used to read local files including sensitive configuration files such as /WEB-INF/web.xml, /WEB-INF/app-config.xml and /WEB-INF/spring/explicit-security-config.xml.

## Impact
An attacker could read local files on the web server that they would normally not have access to, such as the application source code or configuration files containing sensitive information on how the website is configured. 

## Step-by-step Reproduction Instructions

1. Browse to https://██████/████████/register/RegisterUserInfo.htm
2. Setup an intercepting proxy (e.g. BurpSuite) and click Next, catching the request in Burp (don't worry about filling out the form fields)
3. For ease here I would recommend copying and pasting the below parameters into the request, replacing the parameters that were there originally.  This request will fetch the /WEB-INF/web.xml configuration file, I have also attached two other requests which grab app-config.xml and explicity-security-config.xml. Once the parameters are there, forward the request to the server and you should see the web.xml file.  

```
registerUserInfoCommand.organization=Chantest+Corporation&registerUserInfoCommand.organizationId=49800&registerUserInfoCommand.currPageName=SearchUserOrgInfo.jsp&registerUserInfoCommand.nextPageName=..%2f..%2f..%2fWEB-INF%2fweb.xml&registerUserInfoCommand.prevPageName=jsp%2FRegistration%2FRegisterAccountInfo.jsp&registerUserInfoCommand.submitButton=Choose+This+Organization+and+Continue+%3E
```

## Product, Version, and Configuration (If applicable)
N/A

## Suggested Mitigation/Remediation Actions
Rather than placing the filename of the next page directly in a parameter, it would be better to maintain a whitelist of acceptable filenames and use a unique corresponding identifier to access the file. Then any request containing an invalid identifier can just be rejected. Additionally, you could also sanitise any path traversal characters that may be present in a request.

## Impact

An attacker could read local files on the web server that they would normally not have access to, such as the application source code or configuration files containing sensitive information on how the website is configured.

## Timeline

- **Report Filed**
- **2020-10-13** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Title Updated**
- **2020-10-13** @moloshy: After submitting this I realised that browsing directly to https://█████████/██████/register/RegisterUserInfo.htm without a session established throws a HTTP 500 Internal Server Error. So instead, you will have to follow the below steps first:

1. Browse to https://█████/███████/register/Register.htm
2. Click the Start Registration button
3. Search for an organisation, here I just put 'test' hit search and clicked the Choose This Organization and Continue button for the first result that came up
4. Now you should be on the RegisterUserInfo.htm page I originally mentioned in the report and can continue with the steps I mentioned in the original submission: submit and catch the request in an intercepting proxy, replacing the parameters with the ones I have provided
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-14** @agent-l8: If you find a more sensitive file to point to, let us know and we can raise severity. Thanks!
- **2020-10-14** @moloshy: Hi @agent-l8 I found a few more files that I can read. The extra files I was able to read are:

/WEB-INF/spring/mvc-config.xml
/WEB-INF/spring/rest-config.xml
/WEB-INF/classes/compliance/reports/adminRpt.pre.sql
/WEB-INF/classes/compliance/reports/adminRpt.full.sql
/WEB-INF/classes/compliance/reports/complianceStatusRptSql.sql
/WEB-INF/classes/████.properties

So the three SQL files contain raw SQL code including table and column names etc. The last file listed there is probably the most sensitive, I found some credentials in there for unit testing:

Test.DB.URL=jdbc:oracle:thin:@localhost:1521:XE
Test.DB.username=██████████
Test.DB.password=██████

Is this enough to raise the severity up to high? 

Cheers,
Josh
- **Report Resolved**
- **Agreed On Going Public**
- **2020-11-23** @ag3nt-j1: @moloshy I'll be disclosing this report today and yeah based on your last finding on this server before mitigation I think it's fair to up this to a high severity.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **Report Severity Updated**
