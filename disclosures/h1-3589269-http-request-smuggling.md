---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2026-05-20
submitted: 2026-03-06T13:15:49.812Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/essity|Essity]]"
reporter: "t0xodile"
source: "https://hackerone.com/reports/3589269"
title: "HTTP Request Smuggling"
---
# HTTP Request Smuggling

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Essity | **Disclosed:** 2026-05-20

- Report: [https://hackerone.com/reports/3589269](https://hackerone.com/reports/3589269)
- CWE: HTTP Request Smuggling
- Submitted: 2026-03-06T13:15:49.812Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2026-03-06** @t0xodile: After confirming this on ████████ I ran a quick scan using [this tool](https://github.com/PortSwigger/http-request-smuggler) and the "Parser Discrepancy Scan" which looks for header mutations you could abuse to achieve a full desync. 
I haven't confirmed these, but it is likely this issue is repeatable on multiple domains. 

If you use the script above, simply changing the "host" to the domain you want to target, may tell you pretty quickly if it is vulnerable. For example, I could recreate this on `www.████████.com` using this technique. However, this isn't fully reliable, as most desync must be customised per domain. 
████████

████████
- **Report Triaged**
- **2026-03-11** @ariannac: Hi @t0xodile ,

If possible, could you please share the full list of affected sites from our side? This will aid us in ensuring we address the issue in his totality.

Thank you!
- **2026-03-11** @t0xodile: Hej! 

Yes,  I've run the scan on everything in scope (I think) and the following domains were vulnerable to the underlying parser discrepancy. 

https://mft.████████.com
https://www.████████.be
https://www.████████.ca
https://www.████████
https://www.████████.co.uk
https://www.████████.co.jp
https://www.████████.com.mt
https://www.████████.com
https://www.████████.co.za
https://www.████████
https://www.████████.de
https://www.████████.at
https://www.████████.hu
https://www.████████.pl
https://www.████████.no
https://www.████████.es
https://www.████████.ch
https://www.████████.hr
https://www.████████.com
https://www.████████.nl
https://www.████████.dk
https://www.████████.sk
https://www.████████.us
https://www.████████.ro
https://www.████████.it
https://www.████████.cz
https://www.████████.pt
https://www.████████.si
https://www.████████.de
https://www.████████.it
https://www.████████.fi
https://www.████████.fr
https://www.████████.nu
https://www.████████.fr
https://www.████████.com.au
https://www.████████.ch
https://www.████████.com
https://www.████████.de
https://www.████████.rs
https://www.████████.be
https://www.████████.lt
https://www.████████.it
https://www.████████.com.au
https://www.████████.com
https://www.████████.co.uk
https://www.████████.fr
https://www.████████.com.au
https://www.████████.co.uk
https://www.████████.com
https://www.████████.com
https://www.████████.cz
https://www.████████.com
https://www.████████.es
https://www.████████.pl
https://www.████████.gr
https://www.████████.it
https://www.████████.us
https://www.████████.no
https://www.████████.hr
https://www.████████.de
https://www.████████.com
https://www.████████.cz
https://www.████████.si
https://www.████████.dk
https://www.████████.no
https://www.████████.es
https://www.████████.nl
https://www.████████.dk
https://www.████████.us
https://www.████████.se
https://www.████████.sk
https://www.████████.it
https://████████
https://████████.com.au
https://████████.com.tr
https://████████.com.au
https://████████.co.id
https://████████.co.uk
https://████████.co.uk
https://████████.com.au
https://████████.com.br
https://████████.com.tr
https://www.████████.uz
https://████████.co.uk
https://████████.com.au
https://████████.com.mt
https://████████.com.ee
https://████████
https://████████.co.jp
https://████████.co.za
https://████████.co.za
https://████████.co.nz
https://████████.co.uk
https://████████.com
https://████████.com
https://████████.sk
https://████████.no
https://████████.pl
https://████████.es
https://████████.de
https://████████.fi
https://████████.us
https://████████.be
https://████████.co.za
https://████████.nl
https://████████.co.uk
https://████████.co.uk
https://api.████████.com
https://████████.com.mx
https://████████.si
https://████████.it
https://████████.at
https://████████.ca
https://████████.pt
https://████████.nl
https://████████.us
https://████████.ch
https://████████.hu
https://████████.se
https://████████.com
https://████████.dk
https://████████.com
https://████████.lv
https://████████.ch
https://████████.at
https://████████.gr
https://████████.se
https://████████.tn
https://████████.dk
https://████████.nu
https://████████.nl
https://████████.nl
https://████████.hu
https://████████.no
https://████████.at
https://████████.rs
https://████████.ro
https://████████.am
https://████████.lt
https://████████.pt
https://████████.ie
https://████████.de
https://████████.lt
https://████████.com
https://████████.fr
https://████████.it
https://████████.es
https://████████.kz
https://████████.be
https://████████.sk
https://████████.si
https://████████.cz
https://████████.fi
https://████████.pl
https://████████.ca
https://████████.fi
https://████████.hr
https://████████.gr
https://████████.hu
https://████████.hr
https://████████.be
https://████████.az
https://████████.cz
https://████████.us
https://████████.lv
https://████████.es
https://████████.ee
https://████████.ge
https://████████.com
https://████████.pt
https://████████.de
https://████████.ca
https://████████.it
https://████████.com
https://████████.ch
https://████████.ua
https://████████.bg
https://████████.pl
https://████████.se
https://████████.cl
https://████████.ie
https://████████.ro
https://████████.pl
https://████████.no
https://████████.fr
https://████████.de
https://████████.be
https://████████.dk
https://████████.nl
https://████████.fi
https://████████.com
https://████████.com
https://████████.ua
https://████████.com
https://████████.se
https://████████.gr
https://████████.com
https://████████.de
https://████████.ro
https://████████.rs
https://████████.bg
https://████████.fi
https://████████.hr
https://████████.ru
https://████████.es
https://████████.dk
https://████████.nl
https://████████.com
https://████████.se
https://████████.dk
https://████████.com
https://████████.pt
https://████████.hu
https://████████.no
https://████████.fi
https://████████.be
https://████████.fr
https://████████.hu
https://████████.nl
https://████████.no
https://████████.de
https://████████.com
https://████████.it
https://████████.by
https://████████.mx
https://████████.se
https://████████.fr

Cheers,
t0xodile
- **2026-03-11** @ariannac: Thank you so much!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
