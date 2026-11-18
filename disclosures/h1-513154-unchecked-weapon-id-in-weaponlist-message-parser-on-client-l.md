---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/array-index-underflow
  - env/web
  - impact/rce
substate: "resolved"
weakness: "Array Index Underflow"
enriched: true
body: true
date: 2019-09-17
submitted: 2019-03-21T13:30:56.037Z
bounty_usd: 3000
votes: 229
cve: []
program: "[[programs/valve|Valve]]"
reporter: "nyancat0131"
source: "https://hackerone.com/reports/513154"
title: "Unchecked weapon id in WeaponList message parser on client leads to RCE"
---
# Unchecked weapon id in WeaponList message parser on client leads to RCE

> **Severity:** Critical | **Bounty:** 3,000 USD | **Votes:** 229 | **Program:** Valve | **Disclosed:** 2019-09-17

- Report: [https://hackerone.com/reports/513154](https://hackerone.com/reports/513154)
- CWE: Array Index Underflow
- Submitted: 2019-03-21T13:30:56.037Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Let's look at WeaponList message parser code in the HLSDK:
``` cpp
int CHudAmmo::MsgFunc_WeaponList(const char *pszName, int iSize, void *pbuf )
{
	BEGIN_READ( pbuf, iSize );
	
	WEAPON Weapon;

	strcpy( Weapon.szName, READ_STRING() );
	Weapon.iAmmoType = (int)READ_CHAR();	
	
	Weapon.iMax1 = READ_BYTE();
	if (Weapon.iMax1 == 255)
		Weapon.iMax1 = -1;

	Weapon.iAmmo2Type = READ_CHAR();
	Weapon.iMax2 = READ_BYTE();
	if (Weapon.iMax2 == 255)
		Weapon.iMax2 = -1;

	Weapon.iSlot = READ_CHAR();
	Weapon.iSlotPos = READ_CHAR();
	Weapon.iId = READ_CHAR();
	Weapon.iFlags = READ_BYTE();
	Weapon.iClip = 0;

	gWR.AddWeapon( &Weapon );

	return 1;
}
```

And `WeaponResource::AddWeapon`:

``` cpp
void AddWeapon( WEAPON *wp ) 
{ 
		rgWeapons[ wp->iId ] = *wp;	
		LoadWeaponSprites( &rgWeapons[ wp->iId ] );
}
```
There are no boundary check, and the range of `iId` is `[-128, 128)`, so I can modify many things in the data section.

In `client.dll`, there's an object called `gEngfuncs`, it is a function table that has various functions of the engine. After some calculations on latest CS 1.6 `client.dll`, I concluded that this function table could be overwritten using the above bug.

I have attached a PoC that will pop `calc.exe` on latest CS 1.6 client when connected to malicious server. The AMXX plugin will catch `InitHUD` message, and send crafted `WeaponList` message to overwrite the address of function used in `HUD_DirectorMessage` to execute client cmds to a ROP gadget that will trigger the chain sent in the next `SendCmd` call. To overwrite that address, I used a crafted weapon sprite list (`weapon_pwn.txt`) (see `WEAPON` struct, file `cl_dll/ammo.h` in the HLSDK).

## Impact

Since it's RCE, attacker can do almost anything that don't require higher privilege (ex. compromise account, inject malware, ...)

## Timeline

- **2019-03-21** @nyancat0131: P/S: `poc_calc_pop.zip` contains a video of the reproduction.
- **2019-03-21** @nyancat0131: Another P/S: I think there could be a way that won't need additional weapon sprites list to trigger RCE.
- **Report Filed**
- **2019-03-25** @h1_analyst_leon: Hey @nyancat0131 - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Needs More Info**
- **Report New**
- **2019-03-27** @nyancat0131: P/S: `weapon_pwn.txt` is only required on the server-side, the client will download it automatically when connecting to the server, assuming there's no `weapon_pwn.txt` in client's `cstrike/sprites` directory. I used `weapon_pwn.txt` just for the sake of this PoC, attackers can use an arbitrary name, as long as it's a valid file name.
- **Report Triaged**
- **2019-04-12** @nyancat0131: Hello @mikela, just tested and verified that the fix works correctly. BTW, it has been a bit long since my old reports were patched, why haven’t they been resolved yet? :(
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
