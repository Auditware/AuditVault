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
date: 2019-12-19
submitted: 2018-08-29T15:43:55.540Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/402473"
title: "Arbitrary File Download as Shopmanager"
---
# Arbitrary File Download as Shopmanager

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Automattic | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/402473](https://hackerone.com/reports/402473)
- CWE: Path Traversal
- Submitted: 2018-08-29T15:43:55.540Z

## Timeline

- **Report Filed**
- **2018-08-29** @vortfu: Thanks for the report, we're investigating.
- **2018-09-04** @simonscannell: I have also just realized that it is also possible to simply enter http://localhost/wordpress/wp-config.php?ext=.jpg and download arbitrary files this way. This is because WooCommerce translates URLs that refer to the own domain to local paths and then downloads them.
- **2018-09-13** @claudiulodro: Hi Simon,

Thanks for the follow up! We'll have patches for this issue and others you reported in WC 3.4.6, releasing in a couple weeks.

Thanks,
Claudiu
- **2018-09-13** @simonscannell: Hi @claudiulodro ,

Thanks for notifying me. I do have an issue though, I am new to Hackerone. As a security researcher with a new account you only get 6 "trial reports". After you have reported 6 bugs, you won't be able to report any more bugs until your first 3 bugs are closed. I currently am stuck in this situation and can't report any further exploits to you. However, I have identified two more vulnerabilities in WooCommerce: An Open Redirect and another Code Execution. If you guys could close the reports I sent you, I can report the other ones too so you can include all of them in the upcoming patch and don't have to issue other ones.
- **2018-09-13** @vortfu: Hi @simonscannell, I've contacted our H1 rep and requested that this restriction be removed from your account so that you can report additional issues - I'll keep you updated (and or just close out the existing reports as `Resolved` if they're unable to help) :)
- **2018-09-14** @vortfu: The report rate limiting restriction should now be removed. Please let us know if there are any issues :)
- **2018-09-27** @claudiulodro: Hi Simon,

I've attached an updated version of WooCommerce with patches for these vulnerabilities.

There are two changes to mitigate the reported vulnerabilities:

1. For download URLs that begin with `//` the correct behavior should always be to treat that as a URL and never to treat that as a path (e.g. for the download URL `//home/simon/html/wordpress/wp-config.php` the user should be taken to `http(s)://home/simon/html/wordpress/wp-config.php` when trying to download the file). This change is on lines 246-253 of `includes/class-wc-download-handler.php`.

2. For absolute URLs to the current site (e.g. `http://localhost/wordpress/wp-config.php`) we've implemented filetype checking just like if the user had input a path. This change is in the updated `WC_Product_Download::is_allowed_filetype` method located in `includes/class-wc-product-download.php`.

If you see any flaws in either of these approaches please let us know.

Thanks!
Claudiu
- **2018-10-01** @simonscannell: Hi @claudiulodro ,

just had a look and the changes do seem to do the trick. :)
- **2018-10-12** @claudiulodro: Hi Simon,

This was patched in [WC 3.4.6](https://woocommerce.wordpress.com/2018/10/11/woocommerce-3-4-6-security-fix-release-notes/), released yesterday. Thanks for all your help!

Claudiu
- **2018-10-14** @simonscannell: Glad to have helped. :)
- **Report Resolved**
- **Bounty Awarded**
- **2018-10-23** @simonscannell: Thank you very much! Was a pleasure working with you.
- **Agreed On Going Public**
- **Report Became Public**
