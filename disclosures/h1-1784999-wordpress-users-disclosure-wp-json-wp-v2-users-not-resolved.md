---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-12-28
submitted: 2022-11-27T08:01:11.526Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "thewikiii"
source: "https://hackerone.com/reports/1784999"
title: "Wordpress users Disclosure [ /wp-json/wp/v2/users/ ]  Not Resolved () "
---
# Wordpress users Disclosure [ /wp-json/wp/v2/users/ ]  Not Resolved () 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** MTN Group | **Disclosed:** 2022-12-28

- Report: [https://hackerone.com/reports/1784999](https://hackerone.com/reports/1784999)
- CWE: Information Disclosure
- Submitted: 2022-11-27T08:01:11.526Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

On this report's #735586  You closed the report and changed the status to Resolved.
But it's Not Resolved The Bug  It's Still there 

##url: https://www.mtn.com/wp-json/wp/v2/users/

Sorry to say this still i can reproduce this issue please remove  [ /wp-json/wp/v2/users/ ] file if your domain dont use that file
i will send the proof below still this issue is present on the domain 

##Summary:

Using REST API, we can see all the WordPress users/author with some of their information. Which can even be Personal information of employees/author. The file v2/users at:  https://www.mtn.com/wp-json/wp/v2/users/   is enabled and this give the attacker many users names like:  Amogelang Maluleka Greg Davies karenbyamugisha Marc Ilunga mitchprinsloo

## Steps To Reproduce:

  1. Go to https://www.mtn.com/wp-json/wp/v2/users/ [ Allows anyone to view active usernames ]
   
{F2050760}

## Supporting Material/References:

https://hackerone.com/reports/356047
https://hackerone.com/reports/370777

##Fix:

Use this code will hide the users list and give 404 as the result, while rest of the api calls keep running as they were.
 ```
add_filter( 'rest_endpoints', function( $endpoints ){
    if ( isset( $endpoints['/wp/v2/users'] ) ) {
        unset( $endpoints['/wp/v2/users'] );
    }
    if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
});
 ```

## Impact

Malicious counterpart could collect the usernames disclosed (and the admin user) and be focused throughout BF attack (as the usernames are now known), making it less harder to penetrate the data.gov systems.

## Timeline

- **Report Filed**
- **2022-11-27** @thewikiii: On this report's #1735586
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
