---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2019-12-19
submitted: 2018-08-30T16:37:09.891Z
bounty_usd: null
votes: 84
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/403083"
title: "Authenticated Code Execution through Phar deserialization in CSV Importer as Shop manager in WooCommerce"
---
# Authenticated Code Execution through Phar deserialization in CSV Importer as Shop manager in WooCommerce

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 84 | **Program:** Automattic | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/403083](https://hackerone.com/reports/403083)
- CWE: Deserialization of Untrusted Data
- Submitted: 2018-08-30T16:37:09.891Z

## Timeline

- **Report Filed**
- **2018-08-31** @vortfu: Thanks for the report, I've forwarded it on to the WC team for review.
- **2018-09-20** @claudiulodro: Hi Simon,

Following up on this report. 

Since any file operation will cause unserialization with this sort of vulnerability, it was actually [this `is_file` check](https://github.com/woocommerce/woocommerce/blob/master/includes/admin/importers/class-wc-product-csv-importer-controller.php#L375) which caused the dangerous unserialization before the `WC_Product_Importer_CSV::read` even happened.

To mitigate, we'll be adding checks to `WC_Product_Importer_CSV::read` and to `WC_Product_CSV_Importer_Controller::import` using `wp_check_filetype` (which doesn't do any file operations) to prevent non-CSV files from getting used in the importer. If you see any flaws in this approach please let us know.

Thanks,
Claudiu
- **2018-09-21** @simonscannell: wp_check_filetype won't help since all it does is check the extension of the file. It does not concern itself with the wrapper (phar:// in this case) that is used. Since the phar wrapper can deal with any file extension, this check would be bypassed easily. To prevent Phar deserialization, you are going to have to make sure that the filename is actually an absolute path (starting with /) and does NOT contain a wrapper.
- **2018-10-12** @claudiulodro: Hi Simon,

This was also patched in [WC 3.4.6](https://woocommerce.wordpress.com/2018/10/11/woocommerce-3-4-6-security-fix-release-notes/), released yesterday. We've implemented filetype checking and path/protocol checking for the CSV importer. Thanks again for all your help!

Claudiu
- **2018-10-14** @simonscannell: Hi Claudiu,

thanks for patching. Glad to have helped. :)
- **2018-10-16** @claudiulodro: Hi Simon,

I just wanted to bring an update we are making to this patch to your attention. Our 3.4.6 implementation was too restrictive with the variety of server setups our users are using, and many users are not able to upload CSV files any more. [This patch should still prevent protocol attacks without causing CSV upload issues for legitimate users](https://github.com/woocommerce/woocommerce/pull/21573/files). If you have a second can you please confirm that there isn't an easy workaround for that check? It should still prevent all protocols in the file path, but I thought I'd run it by you just in case. Much appreciated!

Thanks,
Claudiu
- **2018-10-16** @simonscannell: Hi Claudiu

seems to do the trick!
- **2018-10-16** @claudiulodro: Hi Simon,

Thanks for confirming. Your help is, as always, very appreciated.

Have a good day,
Claudiu
- **Report Resolved**
- **Bounty Awarded**
- **2018-10-23** @simonscannell: Thank you very much! Was a pleasure working with you.
- **Agreed On Going Public**
- **Report Became Public**
