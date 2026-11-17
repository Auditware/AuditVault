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
date: 2021-10-20
submitted: 2020-07-11T22:02:19.808Z
bounty_usd: null
votes: 28
cve: "CVE-2021-40102"
program: "[[programs/concretecms|Concrete CMS]]"
reporter: "reset"
source: "https://hackerone.com/reports/921288"
title: "Arbitrary File delete via PHAR deserialization"
---
# Arbitrary File delete via PHAR deserialization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Concrete CMS | **Disclosed:** 2021-10-20

- Report: [https://hackerone.com/reports/921288](https://hackerone.com/reports/921288)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2021-40102
- Submitted: 2020-07-11T22:02:19.808Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2021-08-05** @lisaciso: @reset 

We greatly appreciate the work that you put into this report!  A fix for the vulnerability you reported has been put into Concrete CMS release candidate 9.0.0RC1. This release is a test release for the community to debug prior to a full release in the fall. You are more than welcome to download the release candidate to confirm the fix does indeed remediate the vulnerability you reported.  

I will be obtaining a CVE for this vulnerability that will be disclosed upon the full version 9 release. We respectfully request that you refrain from publicizing the vulnerability or the CVE before then.  We will communicate with you at that time to give you permission to publicize it. 

We value reporters like yourself helping us to make the project more secure!

Sincerely

~Lisa
- **2021-08-20** @lisaciso: Hello @reset 
Thanks again for all the work you did on reporting this vulnerability to us.
A fix for this vulnerability you reported has been merged into these release candidates:
9.0.0RC3https://www.concretecms.com/download_file/8c1f8bf8-6e0f-4730-bfb6-649c8213f283
8.5.6RC1https://www.concretecms.com/download_file/2e714705-d861-484f-9e33-2b7ecfd7e585
It would be greatly appreciated if you could verify that we have indeed fixed the issue.
I will be attaching a CVE to this HackerOne report. Respectfully, please do not disclose the CVE until we give you the "ok" to do so. Thanks for understanding!
~Lisa
- **2021-08-20** @reset: Hello, @lisaciso.
I have been checked that the patched `LocalConfiguration::validateRequest()` function on 9.0.0RC3 mitigates against this vulnerability.

```php
<?php
public function validateRequest(\Concrete\Core\Http\Request $req){
    ...
    $this->path = $data['path'];
    if (!$this->path) {
        $e->add(t("You must include a root path for this storage location."));
    } elseif (stripos($this->path,'phar:') !== false) { // [Input validation]
        $e->add(t("Invalid path to file storage location."));
    } elseif (!is_dir($this->path)) {
        $e->add(t("The specified root path does not exist."));
    ...
}
?>
```

Nice work! However, this is a short-term solution that only removes the reported vulnerability. If you want to make a more secure code against deserialization vulnerability generally, there are other options such as using [phar-stream-wrapper](https://github.com/TYPO3/phar-stream-wrapper) that intercept invocation of the *phar://* stream wrapper :)

Thank you!
- **2021-08-20** @reset: - Patch commit: https://github.com/concrete5/concrete5/commit/2a729dcb8a682fb3c71bdfe813dcffc28896bcb1#diff-0a4fcc6f547c4a215e443bf948e3ad6af5cf27669a70af08ac73c61a7f2c9d6c

```php
<?
/**
 * ----------------------------------------------------------------------------
 * Disable phar stream wrapper.
 * ----------------------------------------------------------------------------
 */
if (in_array('phar', stream_get_wrappers(), true)) {
    stream_wrapper_unregister('phar');
}
```

This is a nice solution!
- **2021-08-21** @lisaciso: @reset Thanks Daejun Kim! I'll bring your commit to the team's attention. Your contributions to the open source project are greatly appreciated. ~Lisa
- **Cve Id Added**
- **Report Resolved**
- **2021-10-04** @lisaciso: NIST ranked this 9.1 CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:H https://nvd.nist.gov/vuln/detail/CVE-2021-40102
- **Agreed On Going Public**
- **2021-10-20** @lisaciso: @reset you ok with this report being disclosed?
- **Agreed On Going Public**
- **Report Became Public**
