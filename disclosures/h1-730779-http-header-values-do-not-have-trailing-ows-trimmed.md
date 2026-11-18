---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2020-02-24
submitted: 2019-11-06T17:46:12.794Z
bounty_usd: null
votes: 11
cve: "CVE-2019-15606"
program: "[[programs/nodejs|Node.js]]"
reporter: "alyssawilk"
source: "https://hackerone.com/reports/730779"
title: "HTTP header values do not have trailing OWS trimmed"
---
# HTTP header values do not have trailing OWS trimmed

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js | **Disclosed:** 2020-02-24

- Report: [https://hackerone.com/reports/730779](https://hackerone.com/reports/730779)
- CWE: Improper Input Validation | CVE: CVE-2019-15606
- Submitted: 2019-11-06T17:46:12.794Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

[I suspect I may have tagged the wrong vulnerability type -I'm failing to find "insufficient validation of user input"]

According to the HTTP-spec, http values are
       field-value    = *( field-content | LWS )
http_parser does not appear to trim trailing LWS. This means if a user sends "Host: foo\r\n" the string literal "foo" is passed up, but if the user sends "Host: foo \r\n" the string literal "foo " is passed up, complete with trailing LWS.

## Steps To Reproduce:

(Add details for how we can reproduce the issue)

If one hands "GET / HTTP/1.1\r\nHost: foo.com \r\nHello: World\r\n\r\n"
to http_parser, http_parser sends on_header_value "foo.com " instead of "foo.com"

## Impact: [add why this issue matters]

We are trying to address an issue with Envoy, where if 
"GET / HTTP/1.1\r\nHost: my-super-private-domain.com \r\nHello: World\r\n\r\n"
is passed to Envoy, and Envoy is configured to block any requests to "my-super-private-domain.com", the matcher fails due the trailing whitespace, and external users can tunnel requests that should be blocked.

Originally we were going to address this by doing whitespace trimming in Envoy, but this should probably be fixed upstream in http_parser in case other users are affected, so we're reaching out to see what folks on your end think.

## Supporting Material/References:

My Envoy regression test verifies this lack of LWS trimming, but this is current under envoy security embargo, so please don't share

TEST_F(Http1ServerConnectionImplTest, LWS) {                                                         
  initialize();                                                                                      
                                                                                                     
  InSequence sequence;                                                                               
                                                                                                     
  Http::MockStreamDecoder decoder;                                                                   
  EXPECT_CALL(callbacks_, newStream(_, _)).WillOnce(ReturnRef(decoder));                             
                                                                                                     
  TestHeaderMapImpl expected_headers{                                                                
      {"Test", "value "},      // note the LWS after value is passed up from http_parser to Envoy :-(                                                                       
      {"Hello", "World"},                                                                            
      {":path", "/"},                                                                                
      {":method", "GET"},                                                                            
  };                                                                                                 
  EXPECT_CALL(decoder, decodeHeaders_(HeaderMapEqual(&expected_headers), true)).Times(1);            
                                                                                                     
  Buffer::OwnedImpl buffer("GET / HTTP/1.1\r\nTest: value \r\nHello: World\r\n\r\n");                
  codec_->dispatch(buffer);                                                                          
  EXPECT_EQ(0U, buffer.length());                                                                    
}

## Impact

As said above, this could allow privileged escalation, where if one uses an http_parser  enabled server configured to block specific domains, those blocks can be trivially bypassed using white-space. It's possible there are other attacks bypassing http_parser header value checks with whitespace, but I haven't investigated beyond the most obvious exploit

## Timeline

- **Report Filed**
- **2019-11-07** @mylesborins: Hey Alyssa,

Thanks for reporting. Our team will dig into this and get back to you soon with next steps. Do you have a working patch for http-parser that would fix the regression? Could you imagine any unforeseen edgecases that this could create in code expecting this to work?
- **Report Vulnerability Types Updated**
- **2019-11-07** @alyssawilk: Unfortunately I haven't had time to pursue an http_parser fix.  On the Envoy side we were just going to trim LWS once we got the header value, but unfortunately going public with that could cause anyone really paying attention to exploit that attack vector in other servers using http_parser (including legacy node.js) so we wanted to check in with you folks and coordinate embargoes if http_parser is still supported enough to merit security back patches
- **2019-11-08** @ktistai: Hi @alyssawilk 

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **2019-11-22** @ktistai: @alyssawilk 

The team is internally discussing this. As soon as there is more information to share, we will update this. 

Thanks
@ktistai
- **Report Triaged**
- **2019-12-04** @octetcloud: The EBNF quoted makes it appear that LWS is in fact part of the field-value, and should NOT be trimmed, which left me unsure whether this is the parser's responsibility. https://www.rfc-editor.org/rfc/rfc7230.html#section-3.2.4 is more clear: "The field value does not
   include any leading or trailing whitespace: OWS occurring before the
   first non-whitespace octet of the field value or after the last
   non-whitespace octet of the field value ought to be excluded by
   parsers when extracting the field value from a header field. "
- **Report Title Updated**
- **Report Title Updated**
- **2020-01-16** @octetcloud: Can someone suggest the text to use for the CVE description? It must match this very specific format: `PROBLEM TYPE` in `PRODUCT/VERSION` causes `IMPACT` when `ATTACK`
- **2020-01-22** @octetcloud: No comment, so I requested CVE for

> Including trailing white space in HTTP header values in Nodejs 10, 12, and 13 causes bypass of authorization based on header value comparisons

cve request: https://hackerone.com/nodejs/cve_requests/1400/edit (EDIT)
- **2020-01-22** @octetcloud: @alyssawilk In the release announcement, I can say "Reported by ..." if you would like to suggest a "...", maybe "Alyssa Wilk"?. Thanks!
- **2020-01-23** @alyssawilk: Alyssa Wilk is fine.  If you usually credit entities as well, either Alyssa Wilk from Google or Alyssa Wilk from the Envoy Proxy security team would be fine and accurate as well
thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-02-20** @octetcloud: @alyssawilk can you please respond to the request for disclosure? See https://github.com/nodejs/security-wg/issues/631
- **2020-02-24** @alyssawilk: I'm not seeing any options on https://hackerone.com/reports/730779 for me to request or approve disclosure.

Looking at https://docs.hackerone.com/programs/disclosure.html do you know how your project is set up?  I assume if you'd set up mutual agreement I'd have the "disclose" box so I'm wondering if your group is set up to require program admin approval?
- **2020-02-24** @octetcloud: I'm not sure what it should look like from your end, I've asked our H1 program admin. FYI: https://github.com/nodejs/security-wg/issues/631#issuecomment-589401831  

> Singular = You still have to request disclosure here, but if 30 days pass and the other party has neither approved nor denied the request, the report will automatically disclose.

That implies that there is some way for you to approve, is there any chance an H1 email is in your trash or spam? I asked Alek for clarification on the process.
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
