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
date: 2022-11-27
submitted: 2022-10-14T13:29:56.108Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "shubham_srt"
source: "https://hackerone.com/reports/1735586"
title: "Wordpress users Disclosure [ /wp-json/wp/v2/users/ ]"
---
# Wordpress users Disclosure [ /wp-json/wp/v2/users/ ]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** MTN Group | **Disclosed:** 2022-11-27

- Report: [https://hackerone.com/reports/1735586](https://hackerone.com/reports/1735586)
- CWE: Information Disclosure
- Submitted: 2022-10-14T13:29:56.108Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Using REST API, we can see all the WordPress users/author with some of their information. Which can even be Personal information of employees/author. The file v2/users at:  https://www.mtn.com/wp-json/wp/v2/users/   is enabled and this give the attacker many users names like:  `Amogelang Maluleka` `Greg Davies` `karenbyamugisha` `Marc Ilunga` `mitchprinsloo`

## Steps To Reproduce:

  1.  Go to https://www.mtn.com/wp-json/wp/v2/users/  [ Allows anyone to view active usernames ]

{F1985941}

## Supporting Material/References:
https://hackerone.com/reports/356047
https://hackerone.com/reports/370777

###Fix:
Use this code will hide the users list and give 404 as the result, while rest of the api calls keep running as they were.
```javascript
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
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
