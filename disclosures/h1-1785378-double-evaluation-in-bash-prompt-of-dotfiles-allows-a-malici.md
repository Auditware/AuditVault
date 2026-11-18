---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Due to the improper usage of the `PS1` environment variable in [`.bash_prompt` of dotfiles](https://github.com/iandunn/dotfiles/blob/16a432681077362f263cb926737ad5cca5df6307/.bash_prompt), a malicious repository can execute arbitrary commands when changed the current directory to it.

## Description
The `PS1` environment variable of bash supports command substitutions. For example, setting `PS1` to `$(echo hello)` executes `echo hello` each time the prompt is displayed.

Because [`.bash_prompt` of dotfiles](https://github.com/iandunn/dotfiles/blob/16a432681077362f263cb926737ad5cca5df6307/.bash_prompt) uses the following code to display the VCS information, if any outputs of these commands contain command substitution syntaxes, it'll be evaluated while printing the prompt.

[`.bash_prompt` line 264-266](https://github.com/iandunn/dotfiles/blob/16a432681077362f263cb926737ad5cca5df6307/.bash_prompt#L264-L266)
``` bash
	export PS1="\n${command_mark}${color_user_host}\u${color_reset} @ ${color_user_host}$hostname${color_reset} in ${color_folder}\w${color_reset} \
	$(vcs_prompt) \
	\n> "
```

Since `vcs_prompt` contains the information of Git or SVN, a malicious repository with a crafted branch name can execute arbitrary commands.

[`.bash_prompt` line 241-254](https://github.com/iandunn/dotfiles/blob/16a432681077362f263cb926737ad5cca5df6307/.bash_prompt#L241-L254)
``` bash
function vcs_prompt {
	GIT_PROMPT=$(git_status)
	SVN_PROMPT=$(svn_status)

	if [[ -n $GIT_PROMPT ]]; then
		echo -n "\n$GIT_PROMPT"

		if [[ -n $SVN_PROMPT ]]; then
			echo -n ", $SVN_PROMPT"
		fi
	elif [[ -n $SVN_PROMPT ]]; then
		echo "\n$SVN_PROMPT"
	fi
}
```

## Steps to reproduce
1. Set up dotfiles. (For the minimal setup, I used {F2051541} to set up `.bash_prompt`.)
2. Create a git repository with a crafted name: `git init -b '$(touch${IFS}/tmp/pwned)' repo`
3. Enter the repository: `cd repo`
4. Confirm that `touch /tmp/pwned` is executed.

{F2051546}

## Impact
An attacker can execute arbitrary commands by tricking the victim into entering a malicious directory.

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
