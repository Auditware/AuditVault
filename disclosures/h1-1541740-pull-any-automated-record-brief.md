---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2024-10-25
submitted: 2022-04-14T23:40:36.606Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "badlifeguard"
source: "https://hackerone.com/reports/1541740"
title: "Pull Any Automated Record Brief"
---
# Pull Any Automated Record Brief

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 47 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-10-25

- Report: [https://hackerone.com/reports/1541740](https://hackerone.com/reports/1541740)
- CWE: Information Disclosure
- Submitted: 2022-04-14T23:40:36.606Z

## Timeline

- **Report Filed**
- **2022-04-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2022-04-15** @badlifeguard: Added video
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **2022-05-02** @badlifeguard: Thanks! I have tested this, currently pulling my own ARB/ORB it still gives a very detailed error.
{"RequestHash":"c71ea949","Message":" ","StackTraceString":"   at System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)\r\n   at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)\r\n   at System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)\r\n   at System.Data.SqlClient.SqlDataReader.TryCloseInternal(Boolean closeReader)\r\n   at System.Data.SqlClient.SqlDataReader.Close()\r\n   at System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption, Boolean shouldCacheForAlwaysEncrypted)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method)\r\n   at System.Data.SqlClient.SqlCommand.ExecuteScalar()\r\n   at TiberCreek.Projects.SelfService.BatchGenerator.Generators.SingleDatabasePdfGenerator.DownloadPDF(Int32 SRBHeaderID, String userName, Boolean isSelectionBoard, Boolean isCertified, Int32 OperationType) in C:\\Agents-USAR-V3-7\\_work\\50\\s\\V3\\src\\TiberCreek.Projects.eSRBSS.Web\\Repository\\SingleDatabasePdfGenerator.cs:line 79\r\n   at TiberCreek.Projects.SelfService.BatchGenerator.Generators.SingleDatabasePdfGenerator.Generate(String UserID, RecordBriefBatchFileOption options) in C:\\Agents-USAR-V3-7\\_work\\50\\s\\V3\\src\\TiberCreek.Projects.eSRBSS.Web\\Repository\\SingleDatabasePdfGenerator.cs:line 42\r\n   at TiberCreek.Projects.SelfService.Controllers.PDFController.Index(Int32 SRBHeaderID, Boolean isBoard, Int32 ot) in C:\\Agents-USAR-V3-7\\_work\\50\\s\\V3\\src\\TiberCreek.Projects.eSRBSS.Web\\Controllers\\PDFController.cs:line 56\r\n   at lambda_method(Closure , ControllerBase , Object[] )\r\n   at System.Web.Mvc.ReflectedActionDescriptor.Execute(ControllerContext controllerContext, IDictionary`2 parameters)\r\n   at System.Web.Mvc.ControllerActionInvoker.InvokeActionMethod(ControllerContext controllerContext, ActionDescriptor actionDescriptor, IDictionary`2 parameters)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<BeginInvokeSynchronousActionMethod>b__39(IAsyncResult asyncResult, ActionInvocation innerInvokeState)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResult`2.CallEndDelegate(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethod(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3d()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<>c__DisplayClass46.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3f()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<>c__DisplayClass46.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3f()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethodWithFilters(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass21.<>c__DisplayClass2b.<BeginInvokeAction>b__1c()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass21.<BeginInvokeAction>b__1e(IAsyncResult asyncResult)","Data":{"HelpLink.ProdName":"Microsoft SQL Server","HelpLink.EvtSrc":"MSSQLServer","HelpLink.EvtID":"3617","HelpLink.BaseHelpUrl":"http://go.microsoft.com/fwlink","HelpLink.LinkId":"20476"},"ClassName":"System.Data.SqlClient.SqlException","InnerException":null,"Source":".Net SqlClient Data Provider","HelpDeskEmail":null,"HelpDeskPhone":null,"EmailAttributes":null,"AdditionalInformation":null}<!DOCTYPE html>









-----------------------
Trying to pull someone else's ARB/SRB the error does state that I do not have permissions. 
{"RequestHash":"ac71c756","Message":"The SRB Header ID is not associated with this user.","StackTraceString":"   at TiberCreek.Projects.SelfService.Controllers.PDFController.Index(Int32 SRBHeaderID, Boolean isBoard, Int32 ot) in C:\\Agents-USAR-V3-7\\_work\\50\\s\\V3\\src\\TiberCreek.Projects.eSRBSS.Web\\Controllers\\PDFController.cs:line 25\r\n   at lambda_method(Closure , ControllerBase , Object[] )\r\n   at System.Web.Mvc.ReflectedActionDescriptor.Execute(ControllerContext controllerContext, IDictionary`2 parameters)\r\n   at System.Web.Mvc.ControllerActionInvoker.InvokeActionMethod(ControllerContext controllerContext, ActionDescriptor actionDescriptor, IDictionary`2 parameters)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<BeginInvokeSynchronousActionMethod>b__39(IAsyncResult asyncResult, ActionInvocation innerInvokeState)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResult`2.CallEndDelegate(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethod(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3d()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<>c__DisplayClass46.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3f()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<>c__DisplayClass46.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3f()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethodWithFilters(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass21.<>c__DisplayClass2b.<BeginInvokeAction>b__1c()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass21.<BeginInvokeAction>b__1e(IAsyncResult asyncResult)","Data":{},"ClassName":"System.Exception","InnerException":null,"Source":"TiberCreek.Projects.eSRB.Web","HelpDeskEmail":null,"HelpDeskPhone":null,"EmailAttributes":null,"AdditionalInformation":null}<!DOCTYPE html>
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
