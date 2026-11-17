---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2022-12-01
submitted: 2022-11-28T04:31:43.121Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/iandunn-projects|Ian Dunn]]"
reporter: "ryotak"
source: "https://hackerone.com/reports/1785378"
title: "Double evaluation in .bash_prompt of dotfiles allows a malicious repository to execute arbitrary commands"
---
# Double evaluation in .bash_prompt of dotfiles allows a malicious repository to execute arbitrary commands

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 47 | **Program:** Ian Dunn | **Disclosed:** 2022-12-01

- Report: [https://hackerone.com/reports/1785378](https://hackerone.com/reports/1785378)
- CWE: N/A
- Submitted: 2022-11-28T04:31:43.121Z

## Timeline

- **Draft Started**
- **Report Filed**
- **Bounty Awarded**
- **Report Triaged**
- **2022-11-29** @iandunn: I've used `printf %q` to try and fix this, does that look like a secure solution to you? I've attached a full copy in {F2052905}

```diff
diff --git a/.bash_prompt b/.bash_prompt
index 606df97..d47f077 100644
--- a/.bash_prompt
+++ b/.bash_prompt
@@ -156,10 +156,12 @@ function git_status {
                bisecting=" (bisecting)";
        fi

-       branch="${color_branch}${location}${color_reset}"
+       # Branch names are unsafe user input.
+       branch=$(printf "%s%q%s" $color_branch $location $color_reset)
@@ -201,7 +203,8 @@ function svn_status {
        if [[ -z $branch ]]; then
                branch="trunk"
        fi
-       branch="${color_branch}$branch${color_reset}"
+       # Branch names are unsafe user input.
+       branch=$(printf "%s%q%s" $color_branch $branch $color_reset)
```

The other alternative I considered was something like `branch="{$branch//[^a-zA-Z0-9]}"`, but escaping it with `printf` made it more obvious that the branch name contained a payload.
- **2022-11-29** @ryotak: Hello @iandunn,
Thank you for your response!

Actually, `printf %q` does not appropriately escape shell characters for bash prompts.

Since bash prompts don't support `$''` syntax, it's still possible to execute commands by using a branch name like `あ$(touch${IFS}/tmp/pwned)` even after the patch: `git init -b 'あ$(touch${IFS}/tmp/pwned)' repo`
This is because `printf '%q' 'あ$(touch${IFS}/tmp/pwned)'` would output `$'\343\201\202$(touch${IFS}/tmp/pwned)'` but as bash prompt doesn't support `$''` syntax, `$(touch${IFS}/tmp/pwned)` will be expanded.

{F2052930}


> The other alternative I considered was something like branch="{$branch//[^a-zA-Z0-9]}", but escaping it with printf made it more obvious that the branch name contained a payload.

Yes, that should work fine. Another possible solution would be disabling `promptvars` in shell options: `shopt -u promptvars`, but it may have side effects if you use this behavior elsewhere.

Best regards,
RyotaK
- **Report Resolved**
- **Agreed On Going Public**
- **2022-12-01** @ryotak: Hello @iandunn,

That patch looks good. Thank you so much for fixing it!

Best regards,
RyotaK
- **Agreed On Going Public**
- **Report Became Public**
