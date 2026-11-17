---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/mobile
  - os/android
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2018-10-22
submitted: 2016-10-16T00:14:18.358Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "bobrov"
source: "https://hackerone.com/reports/176065"
title: "[Android] HTML Injection in BatterySaveArticleRenderer WebView"
---
# [Android] HTML Injection in BatterySaveArticleRenderer WebView

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Brave Software | **Disclosed:** 2018-10-22

- Report: [https://hackerone.com/reports/176065](https://hackerone.com/reports/176065)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2016-10-16T00:14:18.358Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2016-10-18** @sergzh: The report is not informative.
- **Report Informative**
- **Agreed On Going Public**
- **Report Reopened**
- **2016-10-18** @bobrov: **Vulnerable params**: title, authorName 
**Vulnerable source code**:
https://github.com/brave/browser-android/blob/59b9b73c651d607e6416c5283d2f6812a469b5c4/Application/LinkBubble/src/main/java/com/linkbubble/articlerender/ArticleContent.java#L97-L111

/java/com/linkbubble/articlerender/ArticleContent.java
```java
        String title = result.getTitle();
        if (title != null) {
            headHtml += "<title>" + title + "</title>";
            bodyHtml += "<p style=\"font-size:" + titleFontSize + ";line-height:120%;font-weight:bold;margin:" + titleTopMargin + " 0px 12px 0px\">" + title + "</p>";
        }

        String authorName = result.getAuthorName();
        Date publishedDate = result.getDate();

        String leftString = "";
        String rightString = "";

        if (authorName != null) {
            leftString = "<span class=\"nowrap\"><b>" + authorName + "</b>,</span> ";
        }
```
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
