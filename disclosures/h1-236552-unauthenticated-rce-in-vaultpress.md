---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2017-09-15
submitted: 2017-06-05T10:28:51.711Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "b258ea62bf297b02afa9854"
source: "https://hackerone.com/reports/236552"
title: "Unauthenticated RCE in Vaultpress"
---
# Unauthenticated RCE in Vaultpress

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Automattic | **Disclosed:** 2017-09-15

- Report: [https://hackerone.com/reports/236552](https://hackerone.com/reports/236552)
- CWE: N/A
- Submitted: 2017-06-05T10:28:51.711Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hitting wordpress instalattion with vaultpress on it with get parameter vaultpress=true attacker is one method away from RCE and that method is **validate_api_signature**.

In this method we have the following constraints:
1. Firewall
2. Usage (recomended) of openssl to validate API call

In case of disabled firewall or its bypass ( easy on many configurations, specially the ones behind proxy/balancer servers ) then in case of usage of openssl to verify the signature we have easy bypass because unsafe usage of **openssl_verify** PHP function.

```
if ( $this->can_use_openssl() ) {
			
			$sslsig = '';
			if ( isset( $post['sslsig'] ) ) {
				$sslsig = $post['sslsig'];
				unset( $post['sslsig'] );
			}
			if ( openssl_verify( serialize( array( 'uri' => $uri, 'post' => $post ) ), base64_decode( $sslsig ), $this->get_option( 'public_key' ) ) ) {
				return true;
			} else {
				$__vp_validate_error = array( 'error' => 'invalid_signed_data' );
				return false;
			}
		}
```
This function **openssl_verify** have 3 possible values as result value: 
- int(1) success 
- int(0) failure to verify
- int(-1) error 

but we all know that 
```
if (-1) {echo "Hi RCE";}
```
will print **Hi RCE**

Proposed fix:
```
if ( openssl_verify( serialize( array( 'uri' => $uri, 'post' => $post ) ), base64_decode( $sslsig ), $this->get_option( 'public_key' ) ) ===1 ) {
				return true;
			} else {
				$__vp_validate_error = array( 'error' => 'invalid_signed_data' );
				return false;
			}
```
In order to get the idea how to cause **openssl_verify** to return -1all you need is to provide valid signature towards public key from different type. Check the uploaded files and execute them in the CMD in the following order:
```
php genkey1.php
php genkey2.php
php PoC.php
```

## Timeline

- **Report Filed**
- **2017-06-05** @xknown: Hi. Thanks for the report. We are going to take a look.
- **Report Resolved**
- **2017-06-08** @b258ea62bf297b02afa9854: Great, regarding this issue everything seems fine now. I can see the update process towards the clients goes quite fast. Any toughs/previous practices from your side regarding possible future disclosure and possible bounty?
- **Bounty Awarded**
- **2017-06-09** @b258ea62bf297b02afa9854: Thx for the bounty, tough it was more worth than reflected XSS due its existence in security plugin, but it is your decision. When update completes on wordpress.org I'll request disclosure. :)
- **2017-06-12** @b258ea62bf297b02afa9854: Extra from my side, another type of bypass / attack against this method in order to get the wanted RCE :) :

```
if ( $sig[0] === $signature )
			return true;
```
here we have classic timing attack (effective because its goal - RCE ) and should be replaced with:

```
if ( hash_equals($signature, $sig[0]))
			return true;
```
- **2017-06-13** @xknown: Hi. Yes, we are aware of it. I'll ping again the VaultPress team to see if they can also fix this issue.
- **2017-06-13** @b258ea62bf297b02afa9854: well, isn't 32 byte lenght (~50-100k requests to be defeated, worst case ~400k for md5), but exists and bad thing here is that isn't time limited e.g. could be solved piece by piece in quite big time interval.
- **2017-06-28** @thingalon: Thank you. This fix has been applied to trunk, and will be released with the next version of VaultPress soon.
- **2017-06-30** @b258ea62bf297b02afa9854: +1
- **Agreed On Going Public**
- **Report Became Public**
