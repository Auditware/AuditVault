---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - os/windows
substate: "informative"
weakness: "Path Traversal"
enriched: true
body: true
date: 2025-07-28
submitted: 2025-07-16T11:13:02.994Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "oblivionsage"
source: "https://hackerone.com/reports/3255707"
title: "Windows Device Names Still Allow Path Traversal in UNC Paths After CVE-2025-27210 Fix"
---
# Windows Device Names Still Allow Path Traversal in UNC Paths After CVE-2025-27210 Fix

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** Node.js | **Disclosed:** 2025-07-28

- Report: [https://hackerone.com/reports/3255707](https://hackerone.com/reports/3255707)
- CWE: Path Traversal
- Submitted: 2025-07-16T11:13:02.994Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I found that Windows device names (CON, PRN, AUX, etc.) can still be used for path traversal attacks when working with UNC network paths, even after the CVE-2025-27210 patch. So basically, the fix only covered regular paths but missed the UNC path scenario when using `path.join()`

## Description:

I was testing the recent CVE-2025-27210 fix and noticed something . The patch works fine for regular paths - if I try `path.normalize('CON:../../secret.txt')`, it correctly returns `.\CON:..\..\secret.txt.` Great that's fixed



But then I started testing UNC paths (you know, network paths like `\\server\share`) and found the vulnerability still exists there. The issue is that when you use `path.join()` with a UNC path and a device name, the device name gets stripped and the traversal happens



Here's what I mean:

```javascript
const path = require('path');

// This is fixed (regular path)
console.log(path.normalize('CON:../../secret.txt'));
// Output: .\CON:..\..\secret.txt ✓

// But this is still vulnerable (UNC path)
console.log(path.join('\\\\server\\share\\uploads', 'CON:../../secret.txt'));
// Output: \\server\share\secret.txt ✗
// Should be: \\server\share\uploads\.\CON:..\..\secret.txt
```

{F4574346}


This happens because the normalize function inside `path.join()` handles UNC paths differently than regular paths



## Steps to Reproduce:

1. Use any Node.js version including the latest v24.4.1 (with CVE-2025-27210 fix)

2. Create a simple test file:

```javascript
const path = require('path');

function getNetworkFile(userInput) {
  const basePath = '\\\\\\\\fileserver\\\\public\\\\uploads';
  return path.join(basePath, userInput);
}

console.log(getNetworkFile('CON:../../../private/passwords.txt'));
"
```

3. Run the code

4. Expected result: `\\fileserver\public\uploads\.\CON:..\..\..\private\passwords.txt`

5. Actual result: `\\fileserver\public\private\passwords.txt` (escaped the uploads directory!)


{F4574401}


## Why This is Different from CVE-2025-27210:

So I know what you're thinking - "didn't we just fix this?" Well, kinda. CVE-2025-27210 fixed the issue for regular paths by adding the `.\` prefix when it detects device names. But that fix only applies to direct `normalize()` calls or regular local paths

The difference:

+ CVE-2025-27210: Fixed `path.normalize('CON:../')` for local paths
+ This bug: UNC paths like `\\server\share` + device names still vulnerable when using `path.join()`

It's essentially a bypass of the CVE-2025-27210 fix for network scenarios

## Mitigation:

To fix this, you should apply the same device name validation logic to UNC paths in the `path.join()` function. Specifically, when joining paths that start with `\\,` the code needs to check for device names and add the `.\` prefix just like it does for regular paths

The fix probably needs to go in the normalize function's UNC path handling section, around where it processes paths starting with `\\.`

## Impact

An attacker could read files outside the intended directory on Windows network shares :

+ File sharing applications (escape to other users' folders)
+ Cloud storage systems using UNC paths
+ Corporate network shares (access sensitive documents)
+ Any Node.js app that serves files from network locations

Also, this could lead to lateral movement in corporate networks - imagine escaping from `\\webapp\public` to `\\webapp\C$\Windows\System32\config` or even to other servers like `\\adminserver\C---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - os/windows
substate: "informative"
weakness: "Path Traversal"
enriched: true
date: 2025-07-28
submitted: 2025-07-16T11:13:02.994Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "oblivionsage"
source: "https://hackerone.com/reports/3255707"
title: "Windows Device Names Still Allow Path Traversal in UNC Paths After CVE-2025-27210 Fix"
---
# Windows Device Names Still Allow Path Traversal in UNC Paths After CVE-2025-27210 Fix

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** Node.js | **Disclosed:** 2025-07-28

- Report: [https://hackerone.com/reports/3255707](https://hackerone.com/reports/3255707)
- CWE: Path Traversal
- Submitted: 2025-07-16T11:13:02.994Z
.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-07-16** @oblivionsage: Hi @rafaelgss

I wanted to add some context about why I missed the UNC path scenario in my original report

When I was testing CVE-2025-27210, I focused mainly on regular file paths since that's the most common use case I see in web applications. I tested things like:
- path.normalize('CON:../../etc/passwd')
- path.resolve('AUX:../windows')

These were all getting properly fixed with the .\ prefix, so I thought "great, device names are handled!"

It wasn't until today when I was reviewing the fix implementation that I decided to test some edge cases with network paths. That's when I discovered that UNC paths behave differently with path.join(). 

I guess I was too focused on the typical web server scenarios (like Express static file serving) and didn't think about Windows network share environments. My bad for not being more thorough initially!

Just wanted to be transparent about this. I'll make sure to test more comprehensively next time, including different path types and functions.

Thanks for your patience with this!
- **2025-07-16** @oblivionsage: Hi team,

I want to emphasize that this is a **separate vulnerability** from CVE-2025-27210:

**Why this deserves a new CVE:**
1. Different attack vector - UNC paths vs regular paths
2. Different affected function - path.join() behavior vs path.normalize()
3. The CVE-2025-27210 fix doesn't address this issue
4. Affects different use cases - network file servers, SMB shares, cloud storage

**Key differences:**
- CVE-2025-27210: Fixed device names in regular paths 
- This vulnerability: Device names in UNC paths still allow traversal 

This is essentially a **bypass of CVE-2025-27210 in network scenarios**. Since the root cause and fix location are different, I believe this warrants:
- A separate CVE assignment
- Separate security advisory


The fact that I found this after the previous fix shows that the original patch was incomplete for all attack surfaces

Looking forward to your assessment!
- **2025-07-16** @oblivionsage: Hi team  sorry for the extra comment,

I realized my initial PoC might not clearly show the vulnerability, so I created a more detailed test to demonstrate the issue better

The key point here is that while CVE-2025-27210 correctly fixes regular paths by adding the ".\" prefix, UNC paths still allow directory traversal when using path.join()

Here's my test code:

```javascript
const path = require("path").win32;

console.log("Node.js UNC Path Device Name Bypass PoC");
console.log("Version:", process.version);
console.log("Date:", new Date().toISOString());
console.log("");

console.log("[1] CVE-2025-27210 Fixed for regular paths:");
console.log("  path.normalize(\"CON:../../secret.txt\")");
console.log("  Result:", path.normalize("CON:../../secret.txt"));
console.log("  SAFE - Device name prefixed"); 
console.log("");

console.log("[2] UNC paths with path.join() - STILL VULNERABLE:");

function testExploit(testName, base, input, expectedSafe) {
  const result = path.join(base, input);
  const baseDepth = base.split("\\\\").length;
  const resultDepth = result.split("\\\\").length;
  const escaped = result.indexOf(base.split("\\\\").pop()) === -1;
  
  console.log(`\n[${testName}]`);
  console.log("  Base Path:", base);
  console.log("  Malicious Input:", input);
  console.log("  Result Path:", result);
  console.log("  Expected Safe:", expectedSafe);
  console.log("  Actual Result:", result);
  console.log("  BYPASSED:", escaped || !result.startsWith(base.substring(0,10)) ? "YES" : "NO");      
}

testExploit("Test 1", "\\\\fileserver\\\\public\\\\uploads", "CON:../../../private/db.conf", "\\\\fileserver\\\\public\\\\uploads\\\\.\\\\CON:..\\\\..\\\\..\\\\private\\\\db.conf");
testExploit("Test 2", "\\\\webapp\\\\data", "PRN:../../C$/admin", "\\\\webapp\\\\data\\\\.\\\\PRN:..\\\\..\\\\C$\\\\admin");
testExploit("Test 3", "\\\\nas\\\\share", "AUX:../secret", "\\\\nas\\\\share\\\\.\\\\AUX:..\\\\secret");

console.log("\n[!] All device names allow path traversal in UNC paths!");
console.log("[!] This bypasses CVE-2025-27210 protection!");
```

And here's the output:

{F4574727}


As you can see, the tests clearly show:

+ Expected behavior: Should add "." prefix like regular paths do
+ Actual behavior: Device name gets stripped and traversal happens

For example, when I input `CON:../../../private/db.conf`, it should become `\\server\\uploads\\.\\CON:..\\..\\..\\private\\db.conf` (safe), but instead it becomes `\\server\\private\\db.conf` (escaped!)

This inconsistency between regular paths and UNC paths is what makes this a bypass of the previous fix. The vulnerability specifically affects Windows file servers and network shares

Let me know if you need any clarification or additional tests
- **2025-07-16** @mcollina: Thanks for reporting, we’ll take a look as soon as we can.
- **Cve Id Added**
- **2025-07-17** @rafaelgss: We have also identified that the CVE-2025-27210 doesn't take into account Windows 8-bit superscript variants (COM², or LPT²).

I'll review your report carefully.
- **2025-07-17** @oblivionsage: Thanks for the replies @mcollina @rafaelgss 

Interesting find about the superscript variants (COM²,  LPT²) - I hadn't tested those @rafaelgss this shows the issue might be even broader than I initially reported looking forward to your review let me know if you need any additional test cases or clarification!
- **Report Needs More Info**
- **Report New**
- **2025-07-21** @rafaelgss: Yes, but according to our Threat Model, users must sanitize input before passing it to `path.join` or, more specifically, `fs.readFileSync`. This is expected but can be considered a bug—I'd be open to fixing it in the public, but according to Node.js policies, this is not treated as a vulnerability.
- **2025-07-21** @oblivionsage: Hi @rafaelgss,

I respectfully disagree if this logic were truethen **CVE-2025-27210 shouldnt have been fixed either**,yet it was assigned a CVE and patched the inconsistency is the security issue here:


```javascript
// Why is this considered a vulnerability (CVE-2025-27210)?
path.normalize('CON:../../secret.txt') // Now returns: .\CON:..\..\secret.txt

// But this isn't?
path.win32.join('\\\\server\\public', 'CON:../../secret.txt') // Returns: \\server\secret.txt
```

Both cases involve the same windows device name bypass if users are expected to sanitize all inputs, then:

+ Why was CVE-2025-27210 fixed?
+ Why does the fix only work for regular paths but not UNC paths?

This inconsistent behavior means developers who updated Node.js thinking they are protected from device name attacks (after CVE-2025-27210) are still vulnerable when using UNC paths the security principle of consistent behavior is violated here developers reasonably expect that if device names are handled safely in one context (regular paths), they should be handled safely in all contexts (including UNC paths) would you consider this from a consistency and developer expectation perspective?
- **2025-07-21** @oblivionsage: Hi @rafaelgss,

I found something interesting in Node.js's own Security Best Practices document. Under "Uncontrolled Search Path Element (CWE-427)", it states:

> "Node.js loads modules following the Module Resolution Algorithm. Therefore, it assumes the directory in which a module is requested (require) is trusted."

{F4592758}

This establishes that Node.js **expects paths to be trustworthy**. However, the current UNC path behavior with device names breaks this trust model by allowing directory escapes

Additionally, the document recommends using the experimental policy mechanism for path security. But the device name bypass I reported could potentially circumvent these security policies by escaping to unauthorized directories.

If Node.js's security model assumes trusted paths, then path manipulation functions like `path.join()` should maintain that trust by preventing directory escapes , which is exactly what CVE-2025-27210 aimed to fix for regular paths

The inconsistency between regular and UNC paths violates Node.js's own documented security assumptions
- **2025-07-21** @rafaelgss: > This establishes that Node.js expects paths to be trustworthy. However, the current UNC path behaviour with device names breaks this trust model by allowing directory escapes

This assumption is incorrect. When we say Node.js "trust" on the environment/paths, it means we **do not sanitise** nor **validate** the input. We trust in the code given, and as I said, it's the user's responsibility to sanitise the input. 

The CVE-2025-27210 was only issued because our team had considered the CVE-2025-23084 as a valid vulnerability, so 27210 was follow-up fix to that. It's important to mention, one report shouldn't open precedence over another; sometimes we issue a CVE for safety reasons, but our threat model is clear that these vulnerabilities expect the user to trust the input, and that's against our Threat Model.

I will bring this one more time to the team and let you know.
- **2025-07-21** @oblivionsage: Hi @rafaelgss ,

I appreciate your response, but Im confused by the apparent contradiction:

1. You say CVE-2025-27210 was only issued because the team considered CVE-2025-23084 valid
2. But CVE-2025-27210 fixed the **exact same issue** (device name path traversal) that I'm reporting for UNC paths
3. You acknowledge it's "important to mention" but say it shouldn't be a CVE

If device name path traversal was a valid security issue worthy of CVE-2025-27210, why is the same issue in UNC paths not considered a vulnerability?

the inconsistency is clear:
- `path.normalize('CON:../../')` → Fixed with CVE 
- `path.join('\\\\server\\', 'CON:../../')` → Not considered a vulnerability? 

this creates a security gap where developers who updated Node.js after CVE-2025-27210 believe they are protected from device name attacks, but they are not when using UNC paths

I understand the argument about user sanitization, but then why fix it for regular paths? Either it's Node.js's responsibility to handle device names safely (hence CVE-2025-27210), or its not the current state is inconsistent and confusing for developers

Would you consider this from a consistency perspective? Same vulnerability, different path types, different treatment
- **2025-07-23** @rafaelgss: Yes, I understand the confusion, and all of this was caused due to our confusion while analysing reports. Sometimes, we overlook and miss some spots (in our threat model policy). Currently, this is being discussed with our team.

I will give you feedback as soon as we get a decision here. I'm sorry for the confusion.
- **2025-07-23** @oblivionsage: Hi @rafaelgss ,


Thank you for your understanding and for bringing this to the team's attention I really appreciate your patient explanations You areright , I should have caught this in my initial report for (CVE-2025-27210)To be honest I was so focused on the common web application scenarios (like Express static file serving with regular paths) that I didn't think to test edge cases with UNC network paths. **That was my oversight**

It didn't occur to me to test Windows network share scenarios like `\\server\share\CON:...`. I guess I had tunnel vision on the typical web server use cases

**I apologize for any confusion this may have caused** I understand now why this requires careful analysis from the team's perspective, especially considering the different contexts and use cases Thanks again for taking the time to review this thoroughly
- **Report Informative**
- **Agreed On Going Public**
- **2025-07-28** @oblivionsage: Please proceed with public disclosure.
- **Agreed On Going Public**
- **Report Became Public**
