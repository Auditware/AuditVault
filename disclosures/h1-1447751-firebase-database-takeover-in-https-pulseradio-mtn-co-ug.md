---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
  - stack/firebase
  - vuln/misconfiguration
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2022-12-01
submitted: 2022-01-12T10:02:04.917Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "shuvam321"
source: "https://hackerone.com/reports/1447751"
title: "Firebase Database Takeover in https://pulseradio.mtn.co.ug/"
---
# Firebase Database Takeover in https://pulseradio.mtn.co.ug/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** MTN Group | **Disclosed:** 2022-12-01

- Report: [https://hackerone.com/reports/1447751](https://hackerone.com/reports/1447751)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2022-01-12T10:02:04.917Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
During my test , in one of the subdomain of mtn.co.ug I found firebase configuration disclosed in the source code along with apiKey and database URL . 

Exploiting this vulnerability attacker is able to upload malicious data in the firebase account of pulseradio.mtn.co.ug and see database over there .

## Steps To Reproduce:

POC :  https://mtn-pulse-uganda.firebaseio.com/poc.json

1. Go to URL below and view the source code of website .

view-source:https://pulseradio.mtn.co.ug/wp-content/themes/mtn-pulse-reskin/zero-rate/firebase-config.js

There you will see following sensitive data .

$(document).ready(function() {
			// Your web app's Firebase configuration
			var firebaseConfig = {
				apiKey: "AIzaSyCRrABG3_Sc7xHar70hFyjHjEOJ071rbJ4",
				authDomain: "mtn-pulse-uganda.firebaseapp.com",
				databaseURL: "https://mtn-pulse-uganda.firebaseio.com",
				projectId: "mtn-pulse-uganda",
				storageBucket: "mtn-pulse-uganda.appspot.com",
				messagingSenderId: "242450689592",
				appId: "1:242450689592:web:bdd1173378d94d733800cd",
				measurementId: "G-KHPT64LJ5L"
			};


2. Now lets upload some data in firebase database  . Send the following curl request . Your data will be uploaded to firebase .


 curl "https://mtn-pulse-uganda.firebaseio.com/poc1.json" -XPUT -d '{"attacker":"maliciousdata"}'

3. Your data will be uploaded to https://mtn-pulse-uganda.firebaseio.com/poc1.json



References:
There are guidelines available by Firebase to resolve the insecurities and misconfiguration, please follow this link:
https://firebase.google.com/docs/database/security/resolve-insecurities

## Impact

This is quite serious because by using this database attacker can use this for malicious purposes and also an attacker can track this database if mtn uses it for future perspective and at that time it will be much easier for the attacker to steal the data from this repository and later it will harm the reputation of the mtn.co.ug .

So please immediately change the rule of the database to private so that nobody can able to access it outside.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-02-03** @shuvam321: Hi @incognito4 ,

The vulnerability has been fixed now . Can you please mark as resolved ? 

I am not able to upload data anymore .

Kind Regards ,
@shuvam321
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
