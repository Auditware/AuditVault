---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2023-07-20
submitted: 2023-04-18T18:34:13.285Z
bounty_usd: null
votes: 5
cve: "CVE-2023-30584"
program: "[[programs/nodejs|Node.js]]"
reporter: "haxatron1"
source: "https://hackerone.com/reports/1952978"
title: "Filesystem experimental permissions policy does not handle path traversal cases."
---
# Filesystem experimental permissions policy does not handle path traversal cases.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js | **Disclosed:** 2023-07-20

- Report: [https://hackerone.com/reports/1952978](https://hackerone.com/reports/1952978)
- CWE: Path Traversal | CVE: CVE-2023-30584
- Submitted: 2023-04-18T18:34:13.285Z

## Timeline

- **Report Filed**
- **2023-04-18** @rafaelgss: Hi @haxatron1 

I couldn't reproduce it:

```console
➜  node (main) node --experimental-permission --allow-fs-read="*" --allow-fs-write=/home/rafaelgss/file/ poc.js
node:fs:587
  const result = binding.open(pathModule.toNamespacedPath(path),
                         ^

Error: Access to this API has been restricted
    at Object.openSync (node:fs:587:26)
    at Object.writeFileSync (node:fs:2248:35)
    at Object.<anonymous> (/home/rafaelgss/repos/os/node/poc.js:2:4)
    at Module._compile (node:internal/modules/cjs/loader:1267:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1321:10)
    at Module.load (node:internal/modules/cjs/loader:1125:32)
    at Module._load (node:internal/modules/cjs/loader:965:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:83:12)
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemWrite',
  resource: '/home/rafaelgss/file/../secret.txt'
}

Node.js v20.0.0
```
- **Report Triaged**
- **2023-04-18** @haxatron1: The directory /home/rafaelgss/file must exist for it to work
- **2023-04-18** @haxatron1: Maybe the solution would be to use weakly_canonical? - https://en.cppreference.com/w/cpp/filesystem/canonical
``````
diff --git a/src/permission/fs_permission.cc b/src/permission/fs_permission.cc
index 05efc790f0..2e389875f1 100644
--- a/src/permission/fs_permission.cc
+++ b/src/permission/fs_permission.cc
@@ -58,11 +58,12 @@ bool is_tree_granted(node::permission::FSPermission::RadixTree* granted_tree,
     if (param.rfind("\\\\?\\UNC\\") == 0) {
       starting_pos += 4;  // "UNC\"
     }
-    auto normalized = param.substr(starting_pos);
+    auto normalized = std::filesystem::weakly_canonical(param.substr(starting_pos));
     return granted_tree->Lookup(normalized, true);
   }
 #endif
-  return granted_tree->Lookup(param, true);
+  auto normalized = std::filesystem::weakly_canonical(param);
+  return granted_tree->Lookup(normalized, true);
 }
 
 }  // namespace
``````

I haven't had the chance to compile and test it to see if it works yet. Though it also resolves symlinks which may cause unintended results.
- **2023-04-18** @rafaelgss: I was considering a safer option. Whenever a traversal path is encountered, we restrict access, how does it sound to you?
- **2023-04-18** @haxatron1: I could foresee problems if someone is using ../ in their filesystem APIs, it could be limiting. But given this API is experimental then it won't be breaking.
- **2023-04-19** @haxatron1: tested this patch (using weakly_canonical) manually:
````
diff --git a/src/permission/fs_permission.cc b/src/permission/fs_permission.cc
index 05efc790f0..73b708d808 100644
--- a/src/permission/fs_permission.cc
+++ b/src/permission/fs_permission.cc
@@ -58,11 +58,12 @@ bool is_tree_granted(node::permission::FSPermission::RadixTree* granted_tree,
     if (param.rfind("\\\\?\\UNC\\") == 0) {
       starting_pos += 4;  // "UNC\"
     }
-    auto normalized = param.substr(starting_pos);
+    auto normalized = std::string_view(std::filesystem::weakly_canonical(param.substr(starting_pos)).string());
     return granted_tree->Lookup(normalized, true);
   }
 #endif
-  return granted_tree->Lookup(param, true);
+  auto normalized = std::string_view(std::filesystem::weakly_canonical(param).string());
+  return granted_tree->Lookup(normalized, true);
 }
 
 }  // namespace
````
It works in checking for path traversal cases but I am not sure if it interferes with any symlink interaction. Presumably, with this patch the permission checking on symlinks will now check the target instead of the actual symlink, unsure of any side effects.
- **External User Joined**
- **2023-05-26** @lirantal: > I was considering a safer option. Whenever a traversal path is encountered, we restrict access, how does it sound to you?
I don't think that's a good idea to degrade core functionality like that. A `/path/to/thing` and a `/path/to/../thing` are both valid paths.

I'm not versed on the `fs_permission.cc` implementation or the `weakly_canonical` reference. Generally speaking, it looks like to me that what needs to happen is the following, in this particular order too:
1. Normalizing the path given (in this poc example: `/home/kali/restricted/../secret.txt`). Normalizing the path will essentially resolve the file path to its underlying file system location, in the poc example, that would be: `/home/kali/secret.txt`.
2. Checking that the file path being accessed `/home/kali/restricted/../secret.txt` is confined within the root of the allowed path that was specified in the command-line argument. In the Node.js API we use [path.relative](https://nodejs.org/api/path.html#pathrelativefrom-to) for that.

@rafaelgss could you add a link here to the actual Node.js implementation of resolving those paths passed to the command-line argument?
- **2023-05-26** @rafaelgss: Hey! I have a fix ready. Basically, we are calling path.resolve for all FS calls when the permission model is enabled. I will share the diff so you build locally @haxatron1.
{F2377522}
- **2023-05-30** @haxatron1: I tested the patch locally and can confirm that it fixes the problem.
- **Report Severity Updated**
- **Cve Id Added**
- **2023-06-14** @rafaelgss: Hi @haxatron1 ! Would you like to be credited in the release notes? If yes, which name would you like us to use?

Example:

Thanks, to haxatron1 for reporting this vulnerability.
- **2023-06-14** @haxatron1: Hi, pls use

"Thanks, to Axel Chong for reporting this vulnerability"

Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
