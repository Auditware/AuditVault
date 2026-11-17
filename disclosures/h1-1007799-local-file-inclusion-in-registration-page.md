---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
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
