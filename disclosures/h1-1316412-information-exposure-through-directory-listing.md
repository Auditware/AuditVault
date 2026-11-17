---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/web
substate: "not-applicable"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2021-08-27
submitted: 2021-08-23T13:28:52.083Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "sasikaran"
source: "https://hackerone.com/reports/1316412"
title: "Information Exposure Through Directory Listing"
---
# Information Exposure Through Directory Listing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Tor | **Disclosed:** 2021-08-27

- Report: [https://hackerone.com/reports/1316412](https://hackerone.com/reports/1316412)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2021-08-23T13:28:52.083Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2021-08-24** @sasikaran: Automatic directory listing/indexing is a web server function that lists all of the files within a requested directory if the normal base file (index.html/home.html/default.htm) is not present. When a user requests the main page of a web site, they normally type in a URL such as: http://www.example - using the domain name and excluding a specific file. The web server processes this request and searches the document root directory for the default file name and sends this page to the client. If this page is not present, the web server will issue a directory listing and send the output to the client. Essentially, this is equivalent to issuing an "ls" (Unix) or "dir" (Windows) command within this directory and showing the results in HTML form. From an attack and countermeasure perspective, it is important to realize that unintended directory listings may be possible due to software vulnerabilities (discussed in the example section below) combined with a specific web request.

When a web server reveals a directory's contents, the listing could contain information not intended for public viewing. Often web administrators rely on "Security Through Obscurity" assuming that if there are no hyperlinks to these documents, they will not be found, or no one will look for them. The assumption is incorrect. Today's vulnerability scanners, such as Nikto, can dynamically add additional directories/files to include in their scan based upon data obtained in initial probes. By reviewing the /robots.txt file and/or viewing directory indexing contents, the vulnerability scanner can now interrogate the web server further with these new data. Although potentially harmless, Directory Indexing could allow an information leak that supplies an attacker with the information necessary to launch further attacks against the system.
- **2021-08-24** @sasikaran: It is accessable to all peoples.It can view by all of as and download process is there.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2021-08-27** @geko: And now it is disclosed at your request.
