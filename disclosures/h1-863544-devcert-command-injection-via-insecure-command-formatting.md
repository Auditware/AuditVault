---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2020-06-15
submitted: 2020-04-30T21:41:23.951Z
bounty_usd: null
votes: 11
cve: "CVE-2020-8186"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/863544"
title: "[devcert] Command Injection via insecure command formatting"
---
# [devcert] Command Injection via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2020-06-15

- Report: [https://hackerone.com/reports/863544](https://hackerone.com/reports/863544)
- CWE: Command Injection - Generic | CVE: CVE-2020-8186
- Submitted: 2020-04-30T21:41:23.951Z

## Timeline

- **Report Filed**
- **2020-05-01** @ktistai: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Severity Updated**
- **Report Triaged**
- **2020-05-20** @d3lla: Hi,

I hope everyone is staying safe :)

I would like to know, is there any update?

Thanks for your time and have a nice day,
d3lla
- **External User Joined**
- **2020-06-03** @davewasmer: Thanks for the vulnerability report! However I’m a little confused about what this would actually expose. Devcert doesn’t run with any special permissions, so if you are invoking the code programmatically or via the CLI, the attacker already has permissions to run child_process.exec or run any command from the command line
- **2020-06-03** @d3lla: Hi @davewasmer,

Thanks for your reply.

I agree with you that if an attacker can run the code via the CLI, can also run any command from the command line.

But there are other situations that should be taken into account.

First, the purpose of the library is not to run arbitrary commands passed as parameter.

Second, and probably the most important, if your library is used as part of another application that can be called remotely, that would led to a `Remote Code Execution`.

Reading the description of the project: *“devcert has been designed from day one to work as low-level library that other tools can delegate to.”* So, if you library is used as part of another system and if it’s called remotely (for example someone that wants to setup a dev machine remotely), this could potentially allows an attacker to execute arbitrary commands exploiting this vulnerability.

Here there are some references that could be helpful:
- [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
- [ CWE-77: Improper Neutralization of Special Elements used in a Command ('Command Injection’)](https://cwe.mitre.org/data/definitions/77.html)
- [Avoid-Command-Injection-Node.js](https://gist.github.com/evilpacket/5a9655c752982faf7c4ec6450c1cbf1b)

Thanks for your time.
Stay safe.

d3lla
- **2020-06-05** @marcinhoppe: @davewasmer does this help explain why this may be a security vulnerability under certain circumstances?
- **2020-06-08** @marcinhoppe: @davewasmer I'd like to figure out the disclosure timeline for this report and I am wondering if you plan to release a patch for this vulnerability?
- **2020-06-08** @davewasmer: @marcinhoppe sorry for the delays here. Your explanation definitely makes sense. I'd like to invite James Zetlen (zetlen@gmail.com) into the thread here, as he has taken over the management of the project, but I don't see that functionality anywhere. Would you be able to invite him?
- **2020-06-08** @marcinhoppe: @davewasmer I just sent an invite to zetlen@gmail.com.
- **External User Joined**
- **2020-06-08** @zetlen: Thanks for the invite and for the heads-up, @davewasmer
- **2020-06-08** @zetlen: I see and understand the remote exec problem. It all goes through https://github.com/davewasmer/devcert/blob/master/src/utils.ts where we're building command strings and running them through `child_process.execSync`

```js
export function run(cmd: string, options: ExecSyncOptions = {}) {
  debug(`exec: \`${ cmd }\``);
  return execSync(cmd, options);
}
```

(and elsewhere, but this is the main hot path)
- **2020-06-08** @zetlen: And thanks @d3lla for bringing it to our attention
- **2020-06-08** @zetlen: I'll release a patch for this today. I'll comment here with a link to the pull request and then leave a two-hour interval for your feedback and review.

Sneak preview: For the **patch**, I will probably switch from `execSync` to `spawnSync`, because that's the least intrusive change to the current codebase.

POC of this:

```js
const { execSync, spawnSync } = require('child_process');

const unsafeCertificateFor = domain => {
  return execSync(`printf "unsafeCertificateFor: Created cert for %s" ${domain}`, { encoding: 'utf8' });
}

const safeCertificateFor = domain => {
  return spawnSync('printf', ['safeCertificateFor: Created cert for %s', domain], { encoding: 'utf8' }).stdout;
}

console.log(unsafeCertificateFor(';touch EXEC_SYNC_MADE_THIS;ls -lt EXEC_SYNC_MADE_THIS'));
console.log(safeCertificateFor(';touch SPAWN_SYNC_MADE_THIS;ls -lt SPAWN_SYNC_MADE_THIS'));
```

output:
```
unsafeCertificateFor: Created cert for -rw-r--r--  1 zetlen  staff  0 Jun  8 16:46 EXEC_SYNC_MADE_THIS

safeCertificateFor: Created cert for ;touch SPAWN_SYNC_MADE_THIS;ls -lt SPAWN_SYNC_MADE_THIS
```

In the next major release, we will probably move away from doing this many shell commands entirely, in favor of libraries like node-forge and hostile. We'll still have to elevate privileges, but we'll sanitize input in the way of my example above.

I'll put up this pull request later this afternoon.

Thanks!
Z
- **2020-06-09** @marcinhoppe: @zetlen Thanks for a detailed writeup! We'll keep an eye on this report to take a look at the PR.
- **2020-06-09** @zetlen: Thanks for your patience, @marcinhoppe . Here is the pull request: https://github.com/davewasmer/devcert/pull/55

I tested this extensively on supported platforms and there don't appear to be regressions. Since I opened it today instead of yesterday as I planned, I'll give you more time to review it before merging. I plan to merge and publish the patch at midnight UTC today.
- **2020-06-09** @d3lla: Hi @zetlen,

thanks for your prompt reply and for your writeup.

Your changes seems to fix the problem. 
I run the previous poc:
```javascript
const devcert = require('devcert');

async function poc() {
    let ssl = await devcert.certificateFor('\";touch HACKED;\"');
}
poc()
```
and I was not able to obtain the previous reported result.


However, I noticed that in different files in [/platforms](https://github.com/davewasmer/devcert/tree/zetlen/fix-remoteexec/src/platforms) you changed the `run` method in different files, but there is still one case where the command is build formatting  the user input:
```javascript
// https://github.com/davewasmer/devcert/blob/zetlen/fix-remoteexec/src/platforms/win32.ts#L61
  async addDomainToHostFileIfMissing(domain: string) {
    let hostsFileContents = read(this.HOST_FILE_PATH, 'utf8');
    if (!hostsFileContents.includes(domain)) {
      await sudo(`echo 127.0.0.1  ${ domain } >> ${ this.HOST_FILE_PATH }`);  // <-- here
    }
  }
  
// https://github.com/davewasmer/devcert/blob/zetlen/fix-remoteexec/src/utils.ts#L48
...
import sudoPrompt from 'sudo-prompt';
...
export function sudo(cmd: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(cmd, { name: 'devcert' }, (err: Error | null, stdout: string | null, stderr: string | null) => {
      let error = err || (typeof stderr === 'string' && stderr.trim().length > 0 && new Error(stderr)) ;
      error ? reject(error) : resolve(stdout);
    });
  });
}
```


Maybe you didn't change it on purpose.  I just wanted to let you know. 
Also I know that the only way to reach that code is to first pass this check:
```javascript
// https://github.com/davewasmer/devcert/blob/zetlen/fix-remoteexec/src/index.ts#L69
....
export async function certificateFor<O extends Options>(domain: string, options: O = {} as O): Promise<IReturnData<O>> {
  if (!VALID_DOMAIN.test(domain)) {
...
  if (!options.skipHostsFile) {
    await currentPlatform.addDomainToHostFileIfMissing(domain);
  }
...
```

Let me know if I can do something else.

Have a nice day,
d3lla

I tested using the following configurations:
- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **2020-06-09** @zetlen: Thank you @d3lla . I did leave that one call to `sudo` in `src/platforms/win32.js` alone. Windows shell and PowerShell won't elevate permissions with a simple call to "sudo", which is why we need the third-party [sudo-prompt(https://github.com/jorangreef/sudo-prompt/blob/master/index.js). That library requires you to pass a string of legal POSIX shell. When the platform is Windows, it processes and sanitizes that input.

Between that and the regular expression check you also mentioned, I think this is very minimal surface area for future exploits--you'd have to have an undiscovered way to inject arbitrary PowerShell code through `sudo-prompt`.

I'll leave this PR up for another 90 minutes, then merge it and release a patch.

Do you have any recommendations for unpublishing and/or deprecating old versions with vulnerabilities like this?
- **2020-06-10** @zetlen: I've published [`v1.1.1`](https://github.com/davewasmer/devcert/releases/tag/v1.1.1) to NPM and deprecated previous versions. Thanks for alerting me to this.
- **2020-06-10** @marcinhoppe: @zetlen @d3lla thanks for collaborating on this. Now that the fix is out, can we disclose this vulnerability?
- **2020-06-10** @d3lla: Hi @marcinhoppe , @zetlen , @davewasmer ,
thanks for your quick responses and collaboration.
It was really a pleasure.

From my side it's fine to disclose the report.

Instead about the CVE, how does it work?

Thank you for your time and have a nice day,
d3lla
- **2020-06-10** @marcinhoppe: I will request a CVE when the report has been disclosed.
- **2020-06-10** @d3lla: @marcinhoppe, ok thank you so much.
d3lla
- **2020-06-10** @zetlen: Yes, please disclose the report. Is there anything else I can do?
- **2020-06-12** @marcinhoppe: @zetlen looks like we are good to go. Many thanks for the prompt fix!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
- **2020-06-16** @marcinhoppe: I requested a CVE for this report.
