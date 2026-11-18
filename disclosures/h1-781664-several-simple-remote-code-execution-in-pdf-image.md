---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-02-24
submitted: 2020-01-23T17:10:09.549Z
bounty_usd: null
votes: 15
cve: "CVE-2020-8132"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "gabriel-kimiaie"
source: "https://hackerone.com/reports/781664"
title: "Several simple remote code execution in pdf-image"
---
# Several simple remote code execution in pdf-image

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-24

- Report: [https://hackerone.com/reports/781664](https://hackerone.com/reports/781664)
- CWE: Code Injection | CVE: CVE-2020-8132
- Submitted: 2020-01-23T17:10:09.549Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report "A simple remote code execution" in "pdf-image".
It allows "a remote attacker to execute arbitrary code when several functions of the PDFImage class are called and the class loaded from user-input value".

# Module

**module name:** pdf-image
**version:** latest
**npm page:** `https://www.npmjs.com/package/pdf-image`

## Module Description

Provides an interface to convert PDF's pages to png files in Node.js by using ImageMagick.

## Module Stats

[1] weekly downloads: 8,691

# Vulnerability

## Vulnerability Description

Hello there ! I understand this bug isn't eligible for a bounty. I am reporting it either way. I've found several code execution in the pdf-image class, I tested one of them. They are simple and of course come from the child_process.exec call with lack of escaping. I tested one of them.

## Steps To Reproduce:

var PDFImage = require("pdf-image").PDFImage;

var pdfImage = new PDFImage('"; sleep 500 #"');
pdfImage.getInfo();

You can also exploit the vulnerability by submitting  backticks (example payload: `ls;sleep 5` which will be executed even though you're double-quoting the input.

## Patch
You can take example on your command-exists npm class:
var isUsingWindows = process.platform == 'win32'
var cleanInput = function(s) {
  if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
    s = "'"+s.replace(/'/g,"'\\''")+"'";
    s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s;
}

if (isUsingWindows) {
  cleanInput = function(s) {
    var isPathName = /[\\]/.test(s);
    if (isPathName) {
      var dirname = '"' + path.dirname(s) + '"';
      var basename = '"' + path.basename(s) + '"';
      return dirname + ':' + basename;
    }
    return '"' + s + '"';
  }
}
## Supporting Material/References:

https://github.com/mooz/node-pdf-image/blob/master/index.js#L27

- Linux / centOS
- v6.17.1
- 3.10.10 
- N/A
- Own sample script

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y/N] N
- I opened an issue in the related repository: [Y/N] N

Thanks!

## Impact

Bad code relying on that class can feel foul to RCE.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
