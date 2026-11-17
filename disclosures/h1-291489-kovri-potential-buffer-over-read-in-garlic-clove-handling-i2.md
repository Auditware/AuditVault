---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2017-12-05
submitted: 2017-11-18T12:42:53.852Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/monero|Monero]]"
reporter: "aerodudrizzt"
source: "https://hackerone.com/reports/291489"
title: "Kovri: potential buffer over-read in garlic clove handling + I2NP message creation"
---
# Kovri: potential buffer over-read in garlic clove handling + I2NP message creation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Monero | **Disclosed:** 2017-12-05

- Report: [https://hackerone.com/reports/291489](https://hackerone.com/reports/291489)
- CWE: Information Disclosure
- Submitted: 2017-11-18T12:42:53.852Z

## Timeline

- **Report Filed**
- **2017-11-21** @anonimal: Hi Eyal,

Firstly, welcome to the Monero community - and thank you for your report! If I may ask, how did you find out about Kovri and HackerOne? We're glad to see you.

Secondly, important disclaimers:

- Kovri is pre-alpha, and pre-alpha for a reason. This is not my code nor have I given it my seal of approval. Much of Kovri development has been mostly rewriting the spaghetti code anti-pattern raw pointer nightmare of i2pd.
- This is not the first time a raw leaks have arose from the pre-forked code nor will it be the last case until QA is complete. See [here](https://github.com/monero-project/kovri/issues/65), [here](https://github.com/monero-project/kovri/issues/64), and [here](https://github.com/monero-project/kovri/commit/82650a25de708bd4cc34608cf200bb58fb2e42bc).
- I have not ensured any QA on tunnel/I2NP as noted [in this issue](https://github.com/monero-project/kovri/issues/511) (garlic is implied though I should probably update the issue for verbosity) and, with the exception of at least two small commits, I've literally not done any *directly-related* work on the garlic implementation nor have I sat down with the implementation to make all the necessary changes.
- Though I understand the appeal of your issue title, do note that:
  - OpenSSL was initially released in 1998 and has had continous releases since then.
  - OpenSSL has become the crux of the internet's security and safety backbone for what's possibly been trillions of dollars of e-commerce since browser https was first implemented.
  - OpenSSL has had 100's if not 1000's of contributors/reviewers since 1998. Kovri has only 1 full-time developer since last year and only a handful of contributors.
- Months ago, we discussed the need to have HackerOne reports for Kovri only apply to crypto and research because of the massive amount of known issues that have yet to be resolved e.g., if we release bounty for everyone of these kinds of reports, the bounty fund would go broke. These types reports are literally "like shooting fish in a barrel" because the code we forked from was so poorly designed and written - and there is still much more core code review needed. Unfortunately, this discussion never made it to HackerOne and there is still a [meta issue](https://github.com/monero-project/meta/issues/83) for this. As such, we'll have to discuss internally how to resolve the bounty situation but **I'm sure you will receive a reward** because, in this case, we haven't accurately reported Kovri guidelines (I can only do much on my own).

With that said, let's elaborate on the issue and take a look deeper (the issue is not endemic to just tunnel delivery type):

```diff
diff --git a/src/core/router/i2np.cc b/src/core/router/i2np.cc
index 55a7d123..d2c97626 100644
--- a/src/core/router/i2np.cc
+++ b/src/core/router/i2np.cc
@@ -107,14 +107,25 @@ std::unique_ptr<I2NPMessage> CreateI2NPMessage(
     msg->len += len;
   } else {
     LOG(error) << "I2NPMessage: message length " << len << " exceeds max length";
+    // TODO(anonimal): ...then don't return the message...
   }
   msg->FillI2NPMessageHeader(msg_type, reply_msg_ID);
   return msg;
 }
 
+// TDDO(anonimal):                                                                                                                                                                                               
+//   Theoretically, and despite the signed type, len passed has the potential to be 64k (value given in 2 bytes 0xffff)                                                                                          
+//   but, because of I2NP fragmentation + alignment, the max should be no more than 62708 bytes (61.2k for tunnel delivery mode).                                                                                
+//                                                                                                                                                                                                               
+//   Now, msg->max_len is at a minimum 4k ("short" message) or at most 32k depending on message type.                                                                                                            
+//   The below sanity test ensures that passed len is < (4k || 32k) *BUT* that still leaves potential for copying over                                                                                           
+//   ((msg->max_len - 1) - len) amount of memory (memory after payload, potentially uninitialized) into the message buffer                                                                                       
+//   which is then sent through the tunnel.  TODO(anonimal): ensure callers never send incorrect length to begin with.                                                                                           
+//                                                                                                                                                                                                               
+//   Note: NTCP limits message size to to 16378 bytes and SSU limits (should) to 32k.                                                                                                                            
 std::shared_ptr<I2NPMessage> CreateI2NPMessage(                                                                                                                                                                  
     const std::uint8_t* buf,                                                                                                                                                                                     
-    int len,                                                                                                                                                                                                     
+    int len,  // TODO(anonimal): uint16_t, and caller should ensure no overflow                                                                                                                                  
     std::shared_ptr<kovri::core::InboundTunnel> from) {                                                                                                                                                          
   std::unique_ptr<I2NPMessage> msg = NewI2NPMessage();
   if (msg->offset + len < msg->max_len) {
@@ -123,6 +134,7 @@ std::shared_ptr<I2NPMessage> CreateI2NPMessage(
     msg->from = from;
   } else {
     LOG(error) << "I2NPMessage: message length " << len << " exceeds max length";
+    // TODO(anonimal): now why would we want to send an empty message?!...
   }
   return ToSharedI2NPMessage(std::move(msg));
 }
@@ -644,6 +656,7 @@ std::unique_ptr<I2NPMessage> CreateTunnelGatewayMsg(
   return msg;
 }
 
+// TODO(anonimal): s/size_t/uint16_t/
 std::size_t GetI2NPMessageLength(
     const std::uint8_t* msg) {
   return bufbe16toh(msg + I2NP_HEADER_SIZE_OFFSET) + I2NP_HEADER_SIZE;
```

Now, let's elaborate more on this patch (also note the TODOs and another raw memory leak that I've marked in all caps):


```diff
diff --git a/src/core/router/garlic.cc b/src/core/router/garlic.cc
index b6c9ad23..86e8cf0e 100644
--- a/src/core/router/garlic.cc
+++ b/src/core/router/garlic.cc
@@ -264,7 +264,7 @@ std::size_t GarlicRoutingSession::CreateAESBlock(
   block_size += len;
   std::size_t rem = block_size % 16;
   if (rem)
-    block_size += (16-rem);  // padding
+    block_size += (16-rem);  // TODO(anonimal): MUST BE RANDOM PADDING!
   // TODO(anonimal): this try block should be larger or handled entirely by caller
   try {
     m_Encryption.Encrypt(buf, block_size, buf);
@@ -571,11 +571,49 @@ void GarlicDestination::HandleAESBlock(
   }
 }
 
+// TODO(anonimal): this may be the only caller that checks received garlic message payload length
 void GarlicDestination::HandleGarlicPayload(
     std::uint8_t* buf,
     std::size_t len,
-    std::shared_ptr<kovri::core::InboundTunnel> from) {
+    std::shared_ptr<kovri::core::InboundTunnel> from)
+{
+  LOG(trace) << "GarlicDestination: " << __func__
+             << ": inbound tunnel ID: " << from->GetTunnelID()
+             << ": purported length: " << len << GetFormattedHex(buf, len);
+
+  // Save state
   const std::uint8_t* buf1 = buf;
+
+  // Payload offset after I2NP message
+  enum Clove : std::uint8_t
+  {                                                                                                                                                                                                              
+    ID = 4,                                                                                                                                                                                                      
+    Date = 8,                                                                                                                                                                                                    
+    Cert = 3                                                                                                                                                                                                     
+  };                                                                                                                                                                                                             
+                                                                                                                                                                                                                 
+  // Validate clove length after processing but before creating message / sending through tunnel                                                                                                                 
+  auto check_clove_len = [buf1, len](std::uint8_t*& buf, bool increment) {                                                                                                                                       
+    // I2NP length                                                                                                                                                                                               
+    const std::uint16_t msg_len = GetI2NPMessageLength(buf);                                                                                                                                                     
+    LOG(debug) << "GarlicDestination: I2NP message len=" << msg_len;                                                                                                                                             
+                                                                                                                                                                                                                 
+    const std::uint16_t offset =                                                                                                                                                                                 
+        msg_len + Clove::ID + Clove::Date + Clove::Cert;                                                                                                                                                         
+    LOG(debug) << "GarlicDestination: garlic payload offset=" << offset;                                                                                                                                         
+
+    // Sanity test
+    if ((buf + offset) - buf1 > static_cast<int>(len))
+      // TODO(anonimal): in this case, do we want to throw out the entire payload? If not, don't throw.
+      throw std::runtime_error("GarlicDestination: clove is too long");
+
+    // Increment to ensure all given cloves are checked
+    if (increment)
+      buf += offset;
+
+    return msg_len;
+  };
+
   std::size_t num_cloves = buf[0];
   LOG(debug) << "GarlicDestination: " << num_cloves << " cloves";
   buf++;
@@ -609,8 +647,8 @@ void GarlicDestination::HandleGarlicPayload(
         std::shared_ptr<kovri::core::OutboundTunnel> tunnel;
         if (from && from->GetTunnelPool())
           tunnel = from->GetTunnelPool()->GetNextOutboundTunnel();
-        if (tunnel) {  // we have send it through an outbound tunnel
-          auto msg = CreateI2NPMessage(buf, kovri::core::GetI2NPMessageLength(buf), from);
+        if (tunnel) {  // we must send it through an outbound tunnel
+          auto msg = CreateI2NPMessage(buf, check_clove_len(buf, false), from);
           tunnel->SendTunnelDataMsg(gateway_hash, gateway_tunnel, msg);
         } else {
           LOG(debug)
@@ -626,15 +664,9 @@ void GarlicDestination::HandleGarlicPayload(
         LOG(error)
           << "GarlicDestination: unknown garlic delivery type "
           << static_cast<int>(delivery_type);
+        // TODO(anonimal): we should throw, pending responsible callers
     }
-    buf += kovri::core::GetI2NPMessageLength(buf);  // I2NP
-    buf += 4;  // CloveID
-    buf += 8;  // Date
-    buf += 3;  // Certificate
-    if (buf - buf1  > static_cast<int>(len)) {
-      LOG(error) << "GarlicDestination: clove is too long";
-      break;
-    }
+    check_clove_len(buf, true);
   }
 }
 
@@ -691,6 +723,7 @@ void GarlicDestination::DeliveryStatusSent(
   m_CreatedSessions[msg_ID] = session;
 }
 
+// TODO(anonimal): at worst, the message isn't ACKd
 void GarlicDestination::HandleDeliveryStatusMessage(
     std::shared_ptr<I2NPMessage> msg) {
     std::uint32_t msg_ID = bufbe32toh(msg->GetPayload()); {
```

This performs the sanity test while improving maintainability, documentation, and logging (though throwing may break things that shouldn't break nor should be able to break in the first place if a callee throws). Like your patch, the only fallback to this patch is that the check is called twice for 2 cloves or more but, again, this is a patch. Improvements are welcome.

>Sending a specially crafted Garlic message can cause the router to send onward an I2P message containing leaked RAM data, triggering a massive information leakage.

Can you provide a PoC exploit? Looking at this function alone and at no other controls, the potential leak is obvious - but ultimately the claim is still speculative. Without a PoC exploit, this report merely points out already-documented design issues. Also note that transport/tunnel/garlic message handling in I2P is convoluted and has many caveats. Though we could theoretically conjure any 2 byte size for payload length or any size > actual clove length (and the memory does appear to be uninitialized), are you certain that no other checks are in place in any of the callers or clove creation functions? Hint: look in the surrounding areas around all calls to htobe16buf(buf, len). And, mind you, this would need to be exploited *before* payload hash is created or else verify will fail (AFAICT).

This report came at an odd time since I had plans to be AFK all week after Monday and, as such, I can't look further into the issue or even my own questions until the weekend or next Monday at the latest. Despite being pre-alpha, without a release, and the lack of a PoC exploit, a patch should be applied regardless - so I will check-in this week before the weekend to ensure that this issue is resolved in a timely manner.

Thanks again, Eyal
- **Report Needs More Info**
- **Report New**
- **2017-11-24** @aerodudrizzt: PoC
====
I managed to bring up a test environment, and added debug traces to the kovri router I compiled:
* My traces starts with "EI-DEBUG"
* After building the new I2NP message with the leaked information, I also traced the message according to it''s (hostile) length
Here is the relevant (textual) trace:

```
[2017.11.24 22:56:53.218001] [0xb12f9b40] [debug]   GarlicDestination: 2 cloves
[2017.11.24 22:56:53.218038] [0xb12f9b40] [debug]   GarlicDestination: Garlic type tunnel
[2017.11.24 22:56:53.218074] [0xb12f9b40] [trace]   EI-DEBUG: eGarlicDeliveryTypeTunnel original length:1333
[2017.11.24 22:56:53.218113] [0xb12f9b40] [trace]   EI-DEBUG: I2NPMessage using length:16400
[2017.11.24 22:56:53.218152] [0xb12f9b40] [trace]   EI-DEBUG: PutI2NPMsg() with eGarlicDeliveryTypeTunnel:
```
Since the formatting of the markdown messes up the log traces, I uploaded it as a picture. The trace itself prints the entire 16400 bytes of the message, however I though it won't be effective to load more screenshots of the message dump.
- **2017-11-25** @aerodudrizzt: Since I am experienced with the process of issuing a CVE, with multiple CNAs, should I issue the CVE to help you with the process? The CVE itself will be private (marked as "reserved" CVE) until a public disclosure will happen, and the public disclosure will only happen after your approve it (For example, after the patches will be committed to the git repo).

In any case I am waiting for your reply, and will like to know if there is a specific CNA you prefer/recommend for this process.

Thanks again for your attention and fast response.
- **2017-11-28** @anonimal: >First thing first, I saw your project through hackerOne and decided to check if I can found something interesting in it.

Great, thank you. There are plenty more issues to find - that will be certain.

>Regarding your fix: I personally would use unt32_t for the types in the check to avoid a possible integer-overflow in the assignment into offset. Such overflow will cause the size checks to pass with a possible length of ~0xFFFF.

Can you prove **with code** that this is even possible? IIRC, this was not possible in our current implementation as I explicitly discussed the issue in my first response. I'm now getting back to this issue though after being AFK, so I can review further this week in case I missed something. In the meantime, *please* provide **code** PoC for any claims.

>Code trail:
>And none of these last two function has any check / can validate this parsed value against the real message length

Yes, I know, this was already implied/discussed in my first response - but this is not a **code** PoC exploit.

>kovri_info-leak_PoC.png

This is not a **code** PoC exploit. A scenario (and screenshot) has the potential to be manipulated to fit this control. That is why we require an *actual* **code** PoC exploit. Where is the **code** PoC exploit?

>Since I am experienced with the process of issuing a CVE, with multiple CNAs, should I issue the CVE to help you with the process?

No. This is not CVE worthy as we have **no** releases. *Please* read my first response again regarding release/development status/state. Also, there is no **code** PoC exploit to confirm the hypotheticals. We need a reproducible **code** PoC exploit. Once we start having releases, we can then discuss CVE requirements for potential *future* issues, but not this one. Also, bounty cannot be released without at first seeing a **code** PoC exploit.

>In any case I am waiting for your reply, and will like to know if there is a specific CNA you prefer/recommend for this process.

Please read our [Vulnerability Response Process](https://github.com/monero-project/kovri#vulnerability-response). If anything is not clear, please feel free to ask.

Note: please provide any **code PoC** as a git-diff. You can paste inline or attach as a patch.
- **2017-11-28** @aerodudrizzt: I don't understand why the harsh tones are needed in this discussion. If this is the first post you mention **code** PoC then there is no need to "yell" it with bold 8 times... And regarding the CVE, I did read your vulnerability response process and that is the reason I offered to help you in the process, you cant ignore my offer if you don't think it is rellevant.

This is the first time a project blames me of fabricating a PoC, and I have a long record with many IBB projects and major companies. Normally when one explains the code path in a complex system like yours, the developers try to help from their side in bringing up a test model, a job that took me more than 12 hours on last friday, and was done so I won't interfere with the live kovri network.

I understood your stand, and now you request an additional code PoC that your fix does suffer from an IoF vulnerability, so I will organize my setup scripts and will send you the code for:
1. A hostile kovri client that triggers the attack on a compiled regular kovri router
2. A hostile kovri client that triggers the attack on your proposed patched kovri router
Both will be in a cloned kovri version of the repo at my git account. I just don't understand yet how the git dif on the attacker side will help you anyway.

Since this is the middle of a work week, I will try to deliver all of this until Sunday, as I work full time and can't work on this seriously before the weekend.
- **2017-11-28** @anonimal: >I don't understand why the harsh tones are needed in this discussion.

I think you're misinterpreting my English. As a native speaker, I can assure you that there was no harsh tone. Because you overlooked what I had originally said, highlighting important words in bold usually helps with the visual aspect of skimming text.

>If this is the first post you mention code PoC

We've had no problems with any other reports providing code PoC. Code PoC is implied but some people miss this fact. We will provided an addendum to the VRP.

>This is the first time a project blames me of fabricating a PoC

No one blamed you for fabricating anything. We specifically said *"A scenario (and screenshot) has the potential to be manipulated to fit this control. That is why we require an actual code PoC exploit."* In vulnerability response, a person's word means nothing: only the code matters. This applies to me or anyone else. We've received actual code PoC for nearly every other Monero project report, so I don't see why you or anyone else (including myself) should be any exception to the rule.

>Normally when one explains the code path in a complex system like yours, the developers try to help from their side in bringing up a test model

1. You had originally said *"Sending a specially crafted Garlic message can cause the router to send onward an I2P message containing leaked RAM data, triggering a massive information leakage."* which implies that you were successfully able to do so. If you were successfully able to do so, you wouldn't need me to explain the code path as you would have demonstrated that you understood the components and concepts involved.

2. How am I to know that you need help if you don't ask questions? AFAICT, a majority of your response has been assumptions and accusations.

3. You missed some very, *very*, important parts of my original message:

>>Kovri is pre-alpha
>>I have not ensured any QA on tunnel/I2NP as noted in this issue (garlic is implied though I should probably update the issue for verbosity)

So, any work that we do will almost certainly be rewritten or thrown out. It's not cost-effective to dwell on an area of a pre-Alpha codebase that needs more than just patches.

>you cant ignore my offer if you don't think it is rellevant.

"Relevant". And no one ignored your offer. We simply corrected your invalid assumption that a CVE was required.

>now you request an additional code PoC that your fix does suffer from an IoF vulnerability, 

By my patch you mean yours because ultimately what I provided is simple a wrapper for your patch... ?

>I just don't understand yet how the git dif on the attacker side will help you anyway.

Then you don't understand how this network works. If you want to learn more about Kovri and I2P, you're welcome to come ask questions in our [support section](https://github.com/monero-project/kovri#support).

>Since this is the middle of a work week, I will try to deliver all of this until Sunday, as I work full time and can't work on this seriously before the weekend.

Great, we appreciate your contributions. At this point we would like to move on the following:

1. Apply the single-line patch that you first proposed. Though the patch doesn't solve all problems of this area, this area of Kovri needs official review beyond the scope of this report.
2. Because we have no official releases, the remaining portions of the Monero VRP after point 6 are not applicable. For internal use only, we will classify this issue as MEDIUM as defined in the Monero VRP: *"or must be carefully exploited"*.
3. Give you credit in the git-log for your single-line patch. While your further work in this area will be appreciated, your patch is sufficient enough to close the report while we continue pre-Alpha development in this area. The remaining issues can be addressed with the TODOs in my patch. Any future related issues - while we're in pre-Alpha - can be resolved directly on github.
4. Even though we don't intend to provide bounty before a Beta release, we will send you a complimentary XMR for your effort. Because HackerOne doesn't distribute XMR bounty through their service (and we don't offer fiat bounties), you will need to provide an XMR address for us to send XMR to (if you wish to have the bounty). Note: [this VRP caveat](https://github.com/monero-project/kovri/issues/630) will be implemented effective immediately for future H1 issues (as I mentioned in my original response). Future bounty will also only be available (a much larger amount of bounty) after [this](https://github.com/monero-project/meta/issues/83) is resolved.


On a sidenote: if you would like to make a steady, significant amount of XMR (either during our pre-Alpha and Alpha stages or beyond), you can create an [FFS proposal](https://github.com/monero-project/meta/issues/63) to work part time on Kovri. For an example FFS proposal, see [here](https://forum.getmonero.org/9/work-in-progress/86967/anonimal-s-kovri-full-time-development-funding-thread).

Please feel free to ask any questions if any of the aforementioned was not clear. You can also visit https://getmonero.org and reddit's /r/Monero for more information on how to use and trade Monero. Thank you.
- **Report Title Updated**
- **Report Resolved**
- **2017-12-01** @aerodudrizzt: First thing first, I apologize for the language I used in this conversation. After all we both want to know that the vulnerability is indeed exploitable, and a code PoC is the best way for it. In addition, we both want the vulnerability to be properly patched, and so there is no need to argue.

Code PoC
-----------
As promised, I am now attaching the code PoC for the reported vulnerability.
My full documented test setup can be found in an encrypted compressed zip folder in my website:
http://www.cs.tau.ac.il/~eyalitki/Upload/HackerOne/PoC.zip
The password for the archive is: "kovrianonimal".

More Info
-----------
The PoC includes the victim kovri router, and my modified attacker router. The submission includes the entire project, including:
* Full code for both routers (including the compiled binaries that I've used in my demo)
* Configuration folders for each router - the setup was on an isolated test i2p network, with only these two nodes
* Logs of both routers, produced during the exploit demonstration

Vulnerability Impact (Severity)
---------------------------------
* Since the vulnerability was demonstrated in a live setup, which you can re-create using the code PoC I attached, I ask that the ticket's description will reflect that the vulnerability is more than "potential".
* Since this is an exploitable major information-leak I hope you will find it qualified to the 500 XMR minimum bounty you mentioned in your FFS.

Proposed Patch
-----------------
The patch you proposed will indeed block the attack, more info can be found in the README.txt in the archive.

Logistics:
----------
My monero wallet address is:
49q5B492UgjJMPQ3j2Zs246LzMmVvdNxoj3VGnBCQf2pAKt2rmQ6fag8jwFG7QUfmT1iDVmnmNVAUKNvNeYhYQxhCXeYRRE
In case there is any problem with it I will be more than happy to help.

Thanks for the very fast replies, especially relative to other bug bounty projects, and for the time you dedicated to my ticket.
Eyal Itkin.
- **2017-12-02** @anonimal: >My full documented test setup can be found in an encrypted compressed zip folder in my website

Please don't link to your website. If you wish to share any files, please upload them to HackerOne. This is for security and accountability purposes. Also, you do not need to upload any binaries.

>the setup was on an isolated test i2p network, with only these two nodes
>Since the vulnerability was demonstrated in a live setup, which you can re-create using the code PoC I attached, I ask that the ticket's description will reflect that the vulnerability is more than "potential".

Only two nodes? You cannot reproduce the network with simply two nodes. I can't verify if you indeed only used two nodes (see above about uploading files) but if you wish to prove this issue as *not* potential, you'll need to make your case using real tunnels with real hops - preferably using the testnet we already have in place (modifications are welcome).

>Since this is an exploitable major information-leak I hope you will find it qualified to the 500 XMR minimum bounty you mentioned in your FFS

I'm afraid you're terribly confused. 500 XMR was for the minimum bounty **fund** - not for a minimum bug bounty **payout**. Nowhere in the FFS does it state that a *single* bug will be rewarded 500 XMR. In fact, nowhere in our policy or VRP does it state that any pre-Alpha kovri bug will receive *any* XMR. This is because we've only recently started using HackerOne and had yet to finish working out [the details](https://github.com/monero-project/meta/pull/142). Please review those details for future bug bounty payout.

Our offer of 1 XMR was a token of appreciation. We will be able to send that XMR no later than the end of next week.

We look forward to future reports. Happy hacking!
- **2017-12-02** @aerodudrizzt: Hey,

I just want to clarify our current standing point:

1. The vulnerability I found is a trivial code vulnerability and not a protocol vulnerability. This means that by definition the size of the network means nothing - as any rogue user on the network with a modified client can trigger the execution. The size of the network simply doesn't mean anything.

1. This is one of the first projects I encounter that not only has no clear guidelines on how much are different bugs worth, but you also acknowledge yourself that the bounty definitions are not explicit and therefore you actually edited the description text while we were working on this bug: [Monero HackerOne policy change](https://hackerone.com/monero/policy_versions?change=3564319#), [Kovri bounty readme policy change](https://github.com/monero-project/kovri/commit/4ae89fc5ae002a08e1ecb44b201caf2e3ca34899), [Monero projects bug bounty declaration]( https://github.com/monero-project/meta/issues/39#issuecomment-289310019). I think that this acknowledgement does mean that there is a problem here at least to some extent.

1. In order for future researchers (not only me) to know we are putting our efforts towards the benefits of the project in an ideal way, it would help if you would respond on what you actually need for it to be considered a PoC. In the comment on November 28 I outlined what I were proposing for the PoC (setting up a rouge client and router which enables the vulnerability to be easily seen). At no point whatsoever you said it's insufficient (due to network size) - you only said that after I already had put a significant amount of time on showing that.

    To some extent, when a researcher is working to improve your project and describes in advance what and how he is going to provide, any reservation to the proposed PoC method shall be defined in advance rather than "that this is not enough", once the work is already done.

    As long as I don't get clear definitive criterias on what needs to be done to prove the vulnerability, I have no reason to continue working on this. So far you did not show that you tried verifying that the PoC code works. Your offer of 1 XMR for this entire effort is simply not respecting the time I have put so far nor your published policy.

1. I do believe that at this point it should be trivial to any core worker on the project to reproduce this on the test network. I'd be more than happy to provide any help you need and answer questions, but at this point what remains is engineering testing to verify the required fix on the network and not a security research.

    Just for a reference, i2pd needed less than 12 hours from my report on this issue, to realize the problem and deploy a fix - so if you don't want to build the setup yourself, you can probably rely on the good folks there to see the vulnerability is real. Their fix can be tracked using CVE 2017-17066, and it will be published soon under version 2.17.

1. The code PoC was uploaded as an encrypted archive to my site since it is unresponsible for any security researcher to uploaded a full exploit script into a ticket that might be publicly published someday. The archive was encrypted with a password that I gave you, such that your project would be able to use the PoC and not everyone on the internet. Once you confirm that you have downloaded my test environment I can remove it from my website, so the exploit won't be available to third parties from harming unpatched clients while the vulnerability will be a 1-day. Please explain why this form of submission has any accountability problems.

1. Finally, it's unfortunate the guidelines regarding the part that my report is not "bounty worth" were blurry and that it was further updated after my report. I think there's real justification to reward my work per the published information as I showed in the above links.
- **Comments Closed**
- **2017-12-05** @anonimal: JFTR:

>Was that before or after they watermarked their routers for months after releasing (rhetorical question)?

This is in reference to a pre-Kovri incident where they argued *against* the dangers of raw-memory leaks. Such leaks were fixed in the aforementioned links that I posted earlier in this report.
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-12-05** @anonimal: >We will let the world decide if 1 XMR for GarlicRust is reasonable or not.

As a member of the world, for a pre-Alpha *unreleased* software, with **no VRP bug bounty in place at the time of report** (as mentioned many times so far), in an area with no QA completed, and a reporter (you) who still refuses to attach PoC to HackerOne in a responsible manner, and among the myriad of other provable points that I have made in this report (and of which you continue to ignore); I think the 1 XMR token of appreciation is more than reasonable. Any more tokens of appreciation would be a disservice to other potential researchers who knew the state of the VRP and have instead chosen to wait before beginning their research.

Important note: I have been in talks with HackerOne since December of 2015. They are fully aware that we do not provide cash bounty and are also fully aware that we provide only "swag" as a bug bounty (they explicitly do not support offering monero bounty). If you have a problem with the HackerOne interface not reporting this information to you, and seeing as you continue to not ask questions, take up the issue with them. Otherwise, **read and abide by the VRP as it is the official document of which we also abide by; regardless of its state in development**.

Thank you, and happy hacking.
