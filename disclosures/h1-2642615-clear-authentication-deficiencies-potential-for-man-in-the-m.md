---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/key-exchange-without-entity-authentication
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Key Exchange without Entity Authentication"
enriched: true
body: true
date: 2025-07-08
submitted: 2024-08-06T15:09:11.019Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/sony|Sony]]"
reporter: "trapedev"
source: "https://hackerone.com/reports/2642615"
title: "明確な認証不備および潜在的な中間者攻撃の可能性（Clear Authentication Deficiencies & Potential for Man-in-the-Middle Attacks）"
---
# 明確な認証不備および潜在的な中間者攻撃の可能性（Clear Authentication Deficiencies & Potential for Man-in-the-Middle Attacks）

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** Sony | **Disclosed:** 2025-07-08

- Report: [https://hackerone.com/reports/2642615](https://hackerone.com/reports/2642615)
- CWE: Key Exchange without Entity Authentication
- Submitted: 2024-08-06T15:09:11.019Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

English follows Japanese.

ソニーグループ株式会社 様

この度，弊社製品のWH-1000XM5に深刻なセキュリティ脆弱性を確認いたしましたのでご報告いたします．
セキュリティ研究者として，貴社製品の継続的なセキュリティと完全性を確保するために，このような発見を報告することは極めて重要であると考えます．

# Sec.0 要約

- 本レポートは，貴社製品のWH-1000XM5に確認された認証不備の脆弱性を示します．
- 本脆弱性をBluetoothの既存攻撃と組み合わせることで，容易にMitM攻撃を達成できます．
- 報告者は，本脆弱性へのCVE番号の割り当てを要求します．

# Sec.1 脆弱性の種類

認証不備

# Sec.2 脆弱性の詳細

悪意ある第三者（以後，攻撃者）WH-1000XM5とペアリングされたデバイスになりすますことで，WH-1000XM5が**ペアリングモードでなくても**，且つ**WH-1000XM5のユーザの操作を一切必要とせず**攻撃者デバイスと接続されます．

Bluetoothパケットを確認すると，WH-1000XM5の再接続時の認証に不備があり，Secure Simple Paring（SSP）の再接続時プロセスに準拠していません．

# Sec.3 影響を受ける製品

[WH-1000XM5](https://www.sony.jp/headphone/products/WH-1000XM5/)

**NOTE**
本脆弱性は，WH-1000XM5に限らない可能性があります．

# Sec.4 PoC

本セクションでは，PoCに必要なデバイスとセットアップ，そして本脆弱性を再現する手順を説明します．

## .4.1 PoC デバイス

**Victim's Master Device**

| Manufacturer | Model | Operation System | Driver | Bluetooth Version |
|--------------|-------|-------------------|--------|-------------------|
| Microsoft | Surface Laptop 4 | Windows 11 Home | Intel(R) Wireless Bluetooth(R) | 5.1 |

**Victim's Slave Device**

|  Manufacturer | Model | Bluetooth Version | 
|--------------|-------|-------------------|
| Sony Corporation | WH-1000XM5 | 5.2 |

**Attacker's Device**

| Model | Operation System | System | Debian version | Kernel version | BlueZ version | Bluetooth Manufacturer | Bluetooth Version |
|-------|------------------|--------|----------------|----------------|---------------|------------------------|-------------------|
| Raspberry Pi 4 Model B | Raspberry Pi OS | 32bit | 11 bullseye | 6.1 | 5.55 | Cypress Semiconductor | 5.0 |

## .4.2 PoC セットアップ

WH-1000XM5とSurface Laptop 4を予めペアリングします．

## .4.3. PoC 手順

1. Raspberry PiのBluetoothアドレスとアダプタのBluetooth名を，Surface Laptop 4と同様の設定にスプーフィングします．
2. Raspberry PiのBluetoothアダプタの状態を`Discoverable`にします．
3. WH-1000XM5を一定時間放置・あるいは手動により電源を切ります．
4. Surface Laptop 4の電源を切ります．
5.  WH-1000XM5の電源を入れます（NOTE: ペアリングモードへの移行を避けるため，電源ボタンは5秒間以上押さないことに留意してください）．

以上の手順を順に踏んだ場合，WH-1000XM5は**ペアリングモードでないにも関わらずRaspberry Piとペアリング・接続されます**．本脆弱性を再現した際にRaspberry Pi側で確認されたBluetoothパケットを添付します（`WH-1000XM5_vuln_poc.pcapng`を参照）．この時，Raspberry PiはWH-1000XM5と過去にペアリングしたことが**無い**点に留意してください．

**NOTE: **
本脆弱性の再現場面が現実的であることを示すために，Surface Laptop 4の電源を切った後にWH-1000XM5の電源を入れた理由を説明します．私（報告者）は，WH-1000XM5をもう一台のデバイス（Pixel 7 Pro）とペアリングしていました．WH-1000XM5へPixel 7 Proを用いて音楽を流すために，WH-1000XM5の電源を入れました．本脆弱性は，Pixel 7 ProのBluetoothの設定画面を開き，WH-1000XM5との接続を試みる間に，**一切の操作を介せず自動的に**Raspberry PiとWH-1000XM5が接続されました．

# Sec.5 潜在的なMitM攻撃

██████の研究チームは，Bluetoothの省電力モードを用いたデバイスハイジャック攻撃を提案しています．詳しくは，2024年7月に情報処理学会から発刊された論文「[Bluetooth省電力モードを用いるデバイスハイジャック攻撃](https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=237288&item_no=1&page_id=13&block_id=8)」をご確認ください．

省電力モードではありませんが，WH-1000XM5には一定時間無操作状態の場合に自動的に電源が切れる仕様が定義されています（[ヘルプガイド](https://helpguide.sony.net/mdr/wh1000xm5/v1/ja/contents/TP1000533411.html)より）．本挙動は省電力モードの一種のSleepモードの挙動に類似するものです．彼らは，攻撃者が本挙動のようなBluetoothセッションの一時的な切断を悪用することで，Bluetoothセッションをハイジャック可能であること実証しています（[参考](https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=237288&item_no=1&page_id=13&block_id=8)）．

WH-1000XM5とLaptopがペアリング済みであると仮定し，WH-1000XM5の電源が自動的に切れた場合，攻撃者はWH-1000XM5になりすましてLaptopとのペアリングが可能です．一方，攻撃者がLaptopになりすました場合，本レポートの脆弱性によりWH-1000XM5と攻撃者がペアリング可能です．従って，攻撃者はWH-1000XM5とLaptopの通信の中間者になります．本結果は，完全性や可用性のみならず，機密性にも重大な脅威をもらたします．

# Sec.6 要望

- 本脆弱性は，貴社製品の仕様，またBluetoothのプロトコルの仕様では決してないと考えます．本レポートに対する貴社のレスポンスを頂ければと思います．
- 貴社がCNAの場合，CVE番号を付与してください．CNAでない場合，私からIPA/JPCERTに報告しCVE番号の付与を依頼させていただきます．

# 付録

## Raspberry PiのBluetooth名を変更する方法

Raspberry PiのBluetooth名を変更する方法を説明します．
まず，`/etc`ディレクトリ下に`machine-info`ファイルを作成します．
作成した`machine-info`ファイルを開き，`PRETTY_HOSTNAME`変数にBluetooth名を定義します．
例えば，Bluetooth名を`Example Laptop`としたい場合，`PRETTY_HOSTNAME=Example Laptop`とします．
設定後，Bluetoothサービスを再起動してください．

## Raspberry PiのBluetoothアドレスを変更する方法

Raspberry PiのBluetoothアドレスを変更するGolangのスクリプトを本レポートに添付します（`main.go`参照）．
Raspberry Pi上で`main.go`ファイルをbuildし，以下のコマンドを例にBluetoothアドレスを変更することができます．

```bash
# ソースコードのビルド
go build main.go -o chgbtaddr

# アドレスの変更
# ex.) LaptopのBluetoothアドレスを00:11:22:33:44:55と仮定
./chgbtaddr -addr 00:11:22:33:44:55

# サービス再起動
sudo systemctl restart bluetooth.service
```



本レポートへのご対応ありがとうございます．**追加の情報やより詳細な情報が必要な場合（e.g., PoCの一連を示すデモ動画，商品番号 etc.）は，ご連絡いただければ可能な限り対応いたします**．本レポートに記載の潜在的なセキュリティリスクに対処するため，迅速なご回答とご協力をお待ちしております．

敬具
██████████

****************************************
██████████
Tel: ███
E-mail : ██████
****************************************

===========================


Dear Sony Group Corporation

I hereby report that I have identified a serious security vulnerability in our product, the WH-1000XM5.
As a security researcher, I believe it is extremely important to report such findings to ensure the ongoing security and integrity of your company's products.

# Sec.0 Executive Summary

- This report details an authentication vulnerability identified in your company's WH-1000XM5 product.
- By combining this vulnerability with existing Bluetooth attacks, a Man-in-the-Middle (MitM) attack can be easily achieved.
- The reporter requests the assignment of a CVE number for this vulnerability.

# Sec.1 Vulnerability Type

Authentication Deficiencies

# Sec.2 Vulnerability Details

A malicious third party (hereinafter referred to as the attacker) can impersonate a device that has been paired with the WH-1000XM5, allowing the attacker's device to connect to the WH-1000XM5 even when it is not in pairing mode and **without requiring any operation from the WH-1000XM5 user**.
Upon examining the Bluetooth packets, it appears that there is a flaw in the authentication process during reconnection of the WH-1000XM5. It does not comply with the reconnection process of Secure Simple Pairing (SSP).

# Sec.3 Affected Specification

[WH-1000XM5](https://www.sony.jp/headphone/products/WH-1000XM5/)

**NOTE**
This vulnerability may not be limited to the WH-1000XM5.

# Sec.4  PoC

This section presents the devices and setup required for the Proof of Concept (PoC), as well as the steps to reproduce this vulnerability.

## .4.1 PoC Devices

**Victim's Master Device**

| Manufacturer | Model | Operation System | Driver | Bluetooth Version |
|--------------|-------|-------------------|--------|-------------------|
| Microsoft | Surface Laptop 4 | Windows 11 Home | Intel(R) Wireless Bluetooth(R) | 5.1 |

**Victim's Slave Device**

|  Manufacturer | Model | Bluetooth Version | 
|--------------|-------|-------------------|
| Sony Corporation | WH-1000XM5 | 5.2 |

**Attacker's Device**

| Model | Operation System | System | Debian version | Kernel version | BlueZ version | Bluetooth Manufacturer | Bluetooth Version |
|-------|------------------|--------|----------------|----------------|---------------|------------------------|-------------------|
| Raspberry Pi 4 Model B | Raspberry Pi OS | 32bit | 11 bullseye | 6.1 | 5.55 | Cypress Semiconductor | 5.0 |

## .4.2 PoC Setup

Pair the WH-1000XM5 and Surface Laptop 4 in advance.

## .4.3 PoC Procedure

1. Spoof the Bluetooth address of the Raspberry Pi and the Bluetooth name of its adapter to match those of the Surface Laptop 4.
2. Set the Bluetooth adapter state of the Raspberry Pi to `Discoverable`.
3. Leave the WH-1000XM5 idle for a while or manually turn off its power.
4. Turn off the Surface Laptop 4.
5. Turn on the WH-1000XM5 (NOTE: Be careful not to press the power button for more than 5 seconds to avoid entering pairing mode).

If you follow these steps in order, the WH-1000XM5 will pair and connect to the Raspberry Pi despite not being in pairing mode. I have attached the Bluetooth packets observed on the Raspberry Pi side when reproducing this vulnerability (refer to `WH-1000XM5_vuln_poc.pcapng`). Please note that the Raspberry Pi has **never previously paired** with the WH-1000XM5.

**NOTE:**
To show that the reproduction of this vulnerability is realistic, I explain why the WH-1000XM5 was turned on after turning off the Surface Laptop 4. I (the reporter) had paired the WH-1000XM5 with another device (Pixel 7 Pro). I turned on the WH-1000XM5 to play music from the Pixel 7 Pro. This vulnerability was discovered when I opened the Bluetooth settings on the Pixel 7 Pro and attempted to connect to the WH-1000XM5. During this process, the Raspberry Pi and WH-1000XM5 connected automatically without any intervention.

# Sec.5 Potential MitM Attacks

A research team from Kobe University has proposed a device hijacking attack abusing Bluetooth power-saving mode. For more details, please refer to the paper ["Device Hijack Attacks Abusing Bluetooth Power-Saving Mode"](https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=237288&item_no=1&page_id=13&block_id=8) published by the Information Processing Society of Japan in July 2024.

Although not a power-saving mode, the WH-1000XM5 has a feature that automatically turns off the power after a certain period of inactivity (as stated in the [Help Guide](https://helpguide.sony.net/mdr/wh1000xm5/v1/ja/contents/TP1000533411.html)). This behavior is similar to the Bluetooth sleep mode, which is a type of power-saving mode. The researchers have demonstrated that attackers can exploit temporary disconnections of Bluetooth sessions, such as this behavior, to hijack Bluetooth sessions.

Assuming the WH-1000XM5 and a laptop are already paired, if the WH-1000XM5's power automatically turns off, an attacker can impersonate the WH-1000XM5 and pair with the laptop. Conversely, if an attacker impersonates the laptop, the vulnerability described in this report allows the attacker to pair with the WH-1000XM5. Consequently, the attacker becomes a man-in-the-middle for sessions between the WH-1000XM5 and the laptop. This result poses a significant threat not only to integrity and availability but also to confidentiality.

# Sec.6 Request

- I believe this vulnerability is not due to the specifications of your company's product, nor is it due to the specifications of the Bluetooth protocol. I would appreciate your company's response to this report.
- If your company is a CNA, please assign a CVE number. If you are not a CNA, I will report this to IPA/JPCERT and request that a CVE number be assigned.

# Appendix

## How to change Raspberry Pi's Bluetooth Name

Here's how to change the Bluetooth name of your Raspberry Pi:
First, create a  file named `machine-info` in the `/etc` directory.
Open the created `machine-info` file and define the Bluetooth name using the `PRETTY_HOSTNAME` variable.
For example, if you want to set the Bluetooth name to "Example Laptop", write `PRETTY_HOSTNAME=Example Laptop` in `machine-info`.
After configuring, please restart the Bluetooth service.

## How to change Raspberry Pi's Bluetooth Address

I am attaching a Golang script to change the Bluetooth address of a Raspberry Pi to this report (refer to `main.go`).
You can build the `main.go` file on the Raspberry Pi and change the Bluetooth address using a command like the following example:

```bash
# Build the source code
go build main.go -o chgbtaddr

# Change the address
# ex.) Assuming the Laptop's Bluetooth address is 00:11:22:33:44:55
./chgbtaddr -addr 00:11:22:33:44:55

# Restart the service
sudo systemctl restart bluetooth.service
```

Thank you for your attention to this report. **If additional information or more detailed information is needed (e.g., a demo video showing a series of PoC, product numbers etc.), please contact me and I will respond to the extent possible**. I look forward to your prompt response and collaboration in addressing this potential security risk.

Sincerely,
███████

****************************************
█████████
Tel: ██████████
E-mail : █████████
****************************************

## Impact

- DoS
- Link Key Hijack
- MitM Attacks

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Vulnerability Information Updated**
- **2024-08-07** @trapedev: ミスタイプがありましたので修正させていただきます．

- 「この度，**弊社**製品のWH-1000XM5に」⇒「この度，**貴社**製品のWH-1000XM5に」
- 「I hereby report that I have identified a serious security vulnerability in **our** product」⇒「I hereby report that I have identified a serious security vulnerability in **your company's** product」
- **2024-08-07** @h1_analyst_leevi: Hi ██████████ - I'm discussing this submission internally with the Sony team. You will be updated as soon as there is additional information to share. Thanks for your patience!

Regards,
@h1_analyst_leevi
- **2024-08-08** @trapedev: Dear @h1_analyst_leevi 

Thank you very much for your inquiry.

I have determined that the explanation of the PoC procedure in the report may be difficult to understand. Therefore, I'm attaching a demo video of the PoC (ref: {F3504375}) and the corresponding Bluetooth packets as supplementary information (ref: {F3504372}).
I hope this will be helpful for your investigation.

I look forward to hearing back from you.

Sincerely,
█████
- **2024-09-01** @trapedev: Dear @h1_analyst_leevi,

I hope this message finds you well. I am writing to follow up on the vulnerability report I submitted to your organization on August 6, 2024.

The ID for this report is #2642615.

I understand that investigating and addressing security vulnerabilities can be a complex process that requires time and careful attention. However, as it has been about a month since my initial report, I would greatly appreciate an update on the current status of the investigation.

Specifically, I would like to know:

1. Has the reported vulnerability been confirmed?
2. If confirmed, what is the current assessment of its severity?
3. What steps have been taken so far to address the issue?
4. Is there an estimated timeline for resolution?
5. Are there any additional details or clarifications you need from me to assist in your investigation?

I remain committed to responsible disclosure and am eager to cooperate in any way that might expedite the resolution process. If you need any further information or clarification regarding my initial report, please don't hesitate to ask.

Thank you for your attention to this matter. I look forward to hearing back from you soon.

Best regards,
█████████
- **2024-09-03** @h1_analyst_leevi: Hi █████, I hope you are having a good day!

Thank you for reaching out to us, we appreciate your patience and understanding, unfortunately, as of now, there are no new updates on this report. You will be updated as soon as there is additional information to share. 

Once more, thank you for your patience, and please let me know if I can answer any further questions. I'd be happy to help!

Kind Regards,
@h1_analyst_leevi
- **2024-09-27** @trapedev: Dear @h1_analyst_leevi,

I hope this message finds you well. I am writing regarding the vulnerability I reported in WH-1000XM5 approximately two months ago.

In line with the widely recognized "90-day rule" in the security research community, I am considering publicly disclosing this vulnerability.

However, I am aware that your [legal notice](https://hackerone.com/sony) explicitly states: "You do not publicly disclose or share the vulnerability details without the written permission of Sony. Violation of these requirements may result in permanent disqualification from the program."

Therefore, I am formally requesting your permission to disclose this vulnerability. I would greatly appreciate your response to the following:

- The current status of addressing the reported vulnerability
- Sony's policy regarding vulnerability disclosure and whether you would grant permission for disclosure

I assure you that my primary concern is user safety, and I am committed to responsible disclosure. I am willing to cooperate in any way possible to enhance the reliability of your product.

Thank you for your attention to this matter. I look forward to your reply.

Best regards,
████
- **2024-10-01** @h1_analyst_leevi: Hello █████, I hope you are having a good day!

Thank you for your patience regarding this vulnerability report. We have reached out to Sony Team for an update on the status of your reported issue.

Regarding your request for vulnerability disclosure, I can confirm that Sony does have a specific process for this. However, we can only accept and consider vulnerability disclosure requests after the reported vulnerability has been fully addressed and the original HackerOne ticket has been closed.

At this time, since the investigation is still ongoing and the ticket remains open, we're not able to grant permission for public disclosure. We appreciate your commitment to responsible disclosure and user safety, and we ask for your continued patience as our team works on addressing the reported vulnerability.

Rest assured that once we have more information or updates on the status of your report, we will promptly inform you. If you have any further questions or concerns in the meantime, please don't hesitate to ask.

Thank you for your understanding and cooperation.

Kind Regards,
@h1_analyst_leevi
- **2024-10-02** @trapedev: Dear @h1_analyst_leevi,

Thank you for your message and the detailed explanation. I appreciate your thorough response.

I understand that the investigation into the reported vulnerability is still ongoing, and I look forward to any updates from the Sony team.

Thank you for clarifying the vulnerability disclosure process. I acknowledge that permission for public disclosure cannot be granted until the ticket is closed. I agree with the approach of prioritizing user safety and responsible disclosure.

Please keep me informed of any progress in the investigation or if any additional information becomes available.

Thank you for your continued attention to this matter.

Best regards,
███████
- **2024-10-25** @paradoxpancake: Hello ██████,

I just received word from the internal team handling the remediation for your submission concerning the WH-1000XM5. They have indicated that they intend to release a fix for this within the fiscal year. While it may not be the immediate answer you might be seeking, they are nonetheless working towards releasing the fix and we will keep you updated as we receive updates on our end.

Thank you for your continued collaboration!
- **Report Triaged**
- **2024-10-25** @trapedev: Dear @paradoxpancake 

Thank you for your message.

However, there is a possibility that the issue may have been fixed in firmware version [2.3.1](https://www.sony-asia.com/electronics/support/wireless-headphones-bluetooth-headphones/wh-1000xm5/software/00278245) of the WH-1000XM5. In other words, the vulnerability reported by Mr. █████ to your company and the vulnerability I reported may have been the same issue.

Shortly after firmware version 2.3.1 was released, I attempted to reproduce the vulnerability I reported using the latest firmware version. As a result, I was unable to reproduce my vulnerability. At that point, I mistakenly assumed that version 2.3.1 included a patch for my vulnerability.

Am I correct in assuming that Sony has acknowledged that my vulnerability is different from Mr. ██████████'s?

If I have any additional information to provide, it would be that the vulnerability I reported can be reproduced on firmware version **2.1.0** of the WH-1000XM5.

If possible, I would appreciate it if you could share the details of what Mr. ████████ reported to your company.

Best regards
███
- **2024-10-25** @paradoxpancake: Hey █████████,

Good question on the acknowledgment. I'll reach out to the internal team and ensure that they understand that it's exploitable on 2.1.0. If it can't be re-produced on the new version, I'll still award you Swag as it was a validated vulnerability prior. Let me reach out to the team and I'll get back to you once I hear something. It might take them some time to validate, but I'll let you know as soon as I hear something.
- **2024-10-25** @trapedev: Dear @paradoxpancake 

Thank you. I appreciate your company's sincere handling of this matter.

Best regards
███
- **2024-10-28** @trapedev: Dear @paradoxpancake 

I would like to report new developments in our vulnerability reproduction experiments with the WH-1000XM5's latest firmware version 2.3.1.

To state the conclusion first, two behaviors were confirmed.

The first is that the vulnerability was reproduced using the same vulnerability reproduction procedure as with firmware version 2.1.0, meaning that the WH-1000XM5 connected and paired with an attacker device impersonating a laptop.

The second is that in experiments with WH-1000XM5 running firmware version 2.3.1, we observed cases where the WH-1000XM5 would send connection requests on its own but would not regenerate the link key through pairing. However, in these cases, since the attacker device recognized the WH-1000XM5's Bluetooth address through the connection request sent by the WH-1000XM5 itself, we confirmed that when the attacker device sent a connection request to the WH-1000XM5's Bluetooth address, connection and pairing with the WH-1000XM5 was possible.

In either case, the same vulnerability as in 2.1.0 was reproduced. My previous report stating that the vulnerability could not be reproduced in firmware version 2.3.1 was due to not having tested the second behavior.

While I have not been able to determine the precise cause at this point, I believe there may be some flaw in the reconnection sequence.

I will report back if I develop any new insights.

Best regards
█████████
- **2024-10-28** @paradoxpancake: Hello ████████,

Thank you for the information. I'll relay this to our internal team. It's greatly appreciated!
- **2024-10-30** @trapedev: Dear @paradoxpancake 

Today, I conducted vulnerability reproduction experiments to identify specific causes and gathered information.

I am attaching a pcap file collected during vulnerability reproduction testing on the latest firmware version (2.3.1) of the WH-1000XM5.

- {F3719258}

Additionally, I am providing sequence diagrams showing the packet flows when the vulnerability was reproduced on both firmware version 2.3.1 and the previous version 2.1.0.

- {F3719259}
- {F3719260}

I hope these files will be helpful as reference for your vulnerability investigation.

I will report back if I develop any new insights.

Best regards
█████████
- **2024-10-30** @paradoxpancake: Hey ██████,

Thank you for relaying this information! Greatly appreciated. I will relay this to the internal team working this. As always, please feel free to reach out to us if you have any additional information to provide.
- **2024-10-31** @paradoxpancake: Hello ██████,

I have heard back from the team handling this vulnerability and they've informed me that your findings are consistent with their own and that they appreciate the input that you've provided.

Additionally, they've informed me that a patch for this is likely forthcoming on around February 20th, 2025. Once they fully confirm with me that they're good to go on this end, I'll  resolve this on our end.
- **2024-10-31** @trapedev: Dear @paradoxpancake 

Thank you for your positive response.
I am very pleased to be able to contribute to improving the security of Sony products, which I deeply appreciate.

I must also express my gratitude to my academic advisors - [██████](https://researchmap.jp/khiro?lang=en), [████](https://researchmap.jp/zenmei), and [██████](https://researchmap.jp/read0133493) - who assisted with this vulnerability experiments.
They provided me with the necessary testing equipment and environment for this vulnerability experiments.

I have several questions and requests, which I list below:
1. I would like to request a CVE ID for this vulnerability. I understand that CVE IDs can only be requested through a CNA. Therefore, if Sony is not a CNA, I will request a CVE ID through an appropriate organization (such as [JPCERT/CC](https://www.jpcert.or.jp/english/)).

2. Has similar vulnerability been confirmed in WH-1000XM5-related products (e.g., WH-1000XM4, WF-1000XM5, and WF-1000XM4)? If I have the opportunity to investigate, I will share any new findings in this chat.

3. As a student researching security, I would like to publish a paper about attacks exploiting this vulnerability once the patch is released. I plan to present the paper at a domestic research workshop without peer review, rather than at a peer-reviewed international conference. Therefore, I would like to request permission for publication.

4. If possible, I would like you to disclose the root cause of this vulnerability. I believe it is related to the LMP vulnerability of the Bluetooth chip installed in the WH-1000XM5, but I would like to know whether this vulnerability is device-specific or not.

Once again, thank you for addressing the reported vulnerability promptly and professionally.
I sincerely appreciate your response.

Best regards
███████
- **2024-10-31** @paradoxpancake: Hey ████,

I don't think we can give out CVEs. However, when it comes to disclosure, we can reach out to the appropriate team once the ticket is resolved and request approval for disclosure. It's up to that team on whether or not they'll approve of it, but I'll explain that  you want to disclose it for academic reasons. We usually don't have any opposition if that is the intent, but I can't guarantee anything.

I can relay your other questions to the team. Thank you!
- **2024-11-01** @trapedev: Dear @paradoxpancake 

Thank you for your reply.

Regarding the CVE issuance, as you are aware, it is possible to reserve just the CVE ID and withhold its publication until a desired time.
In light of this, would it be acceptable if I apply to [MITRE](https://cveform.mitre.org/) for a CVE ID for this vulnerability, obtain the CVE ID in advance, and then publish the CVE details only after Sony has completely resolved the vulnerability and released a patch?

I will give highest priority to respecting Sony's [Legal Notice](https://hackerone.com/sony?type=team) regarding the vulnerability.

I would appreciate your feedback on whether there are any issues with my proposed approach to the CVE issuance.

Best regards
██████
- **2024-11-19** @trapedev: Dear @paradoxpancake 

I hope this message finds you well. I wanted to kindly follow up on my previous message sent on Nov. 1st, 2024. I understand you may be busy, but I would greatly appreciate your thoughts on this matter when you have a moment.

Best regards
█████
- **2024-11-19** @paradoxpancake: No objection.
- **2024-11-19** @trapedev: Thank you for your reply !
- **2024-12-10** @trapedev: Dear @paradoxpancake 

I apologize for disturbing you during your busy schedule.

I would like to request permission regarding a paper publication.
I am planning to present a paper about an attack abusing this vulnerability at [ICSS](https://icss.ieice.org/).
ICSS will be held on March 6-7, 2025.
Additionally, ICSS papers are technical reports, which are non-peer-reviewed papers for a domestic Japanese conference.
I understand that the patch release is scheduled for around February 20, 2025, and if this schedule holds, the paper presentation would occur after the patch release, thus not violating any legal notices.

I would appreciate your permission to proceed with this presentation.

Thank you for your consideration.

Best regards,
███
- **2024-12-10** @paradoxpancake: Hello █████████,

I have reached out to the internal team with your inquiry and should hopefully have a response for you soon. Additionally, their team wanted me to ask you about something as well:

"We are currently working on fixing the vulnerabilities you pointed out. In response to this, we plan to post the statement of acknowledgment to the researcher on our website when we release the fixed firmware. We plan to address the researcher's name and organization in the statement of acknowledgement to be posted as follows, but could you please check with the researcher whether there is any information he would like to correct or add?

- On English website : "Mr. ████ at Kobe University"

- On Japanese website: "████ ██████████████"  (Expressions in Japanese)"

Please let us know if there are any changes, corrections, or additions that you'd like me to relay to the team.
- **2024-12-10** @trapedev: Dear @paradoxpancake 

Thank you for your reply.

I am very grateful that you will include an acknowledgment with my name.

Regarding the addition of names, would it be possible for me to contact you again after today, as I would like to first confirm with the professors?
While I originally discovered this vulnerability independently, the professors have assisted me with the equipment, environment, and analysis for reproducing the vulnerability experiments.
Therefore, from a conflict of interest perspective, I would like to confirm whether it would be more appropriate to include joint names or just my name alone.

Thank you.

Best regards,
██████████
- **2024-12-11** @trapedev: Dear @paradoxpancake 

I have checked with my team about the acknowledgements.
I would appreciate it if the name and affiliation of the acknowledgement could be stated as follows

- On English website : "Mr. █████████, Prof. █████████, Prof. █████████, and Prof. █████ at Kobe University"
- On Japanese website: "█████████ 情報通信研究室（ES3） ███ ██████████，葛野弘樹 ████，白石善明 █████，森井昌克 ██████████"

Best Regards,
██████
- **2024-12-11** @paradoxpancake: Hello ███████,

I've relayed that to the team! They did have one request: prior to your presentation, could the team have a chance to review the materials that you'll be presenting? If you could give them some time to look it over, that'd be appreciated.
- **2024-12-11** @trapedev: Dear @paradoxpancake 

I understand regarding the review.
While I believe sharing should not be an issue, I will check with my chief to be certain.
Once I receive approval from my chief, I will send the paper as soon as possible.

The paper is primarily in Japanese - would this be acceptable?
If reviewing a Japanese paper would be difficult, please let me know and I can translate the content to English appropriately before sending.

Lastly, due to the time difference, it is nighttime here during @paradoxpancake 's business hours. Therefore, I ask for your understanding that confirmations with my team and their responses will generally come the following day.

Thank you for your quick response and reply.

Best Regards,
████████
- **2024-12-11** @paradoxpancake: Hey ███████,

Reviewing it in Japanese should be fine, as their team is in Japan, and I am relatively fluent in Japanese myself if need be -- but their team would be handling the review in any case. I'd just be relaying it to them. And no problem on the business hours! Completely understandable and fine. Take what time you need to confirm with your Chief and other staff as necessary.
- **2024-12-12** @trapedev: Dear @paradoxpancake 

I have confirmed approval from my chief regarding your paper review.

Furthermore, after discussing with the chief, we have decided to proceed with a policy of completely anonymizing and not mentioning in the paper any information that could lead to the identification of products with vulnerabilities (e.g., company names, product names, model numbers, and so on).

I am currently writing the paper. I will send it as soon as possible once the draft is completed.
As the presentation registration deadline for ICSS is January 10, 2025, I will strive to complete the writing early so that you can provide feedback before then.

Best Regards,
█████
- **2024-12-14** @trapedev: Dear @paradoxpancake 

I am submitting my ICSS paper for your review. I kindly request your review. 

{F3851573}

Here are several points to note regarding the review:
- Please note that the submitted paper is for review purposes only and is **not** the final manuscript.
- While I am using the IEICE template, I have sent a version with copyright information removed, similar to a preprint.
- I plan to add a related work section in the final manuscript. As the name suggests, this section will introduce prior works and will **not** contain any information about the vulnerability discussed in this paper.
- I considered including mock code for the PoC. However, considering the possibility of exploit code generation by generative AI, I currently do **not** plan to include it.
- I may increase the number of devices tested and add this information to the paper in the future. However, any information that could lead to device identification will **definitely be kept confidential**.
- Besides the points mentioned above, I do not plan to make significant changes to the content and structure from this review version of the manuscript.

Also, if any modifications or deletions are necessary, please feel free to let me know. I will respond sincerely and promptly. 

Best Regards,
█████
- **2024-12-18** @paradoxpancake: Hello ███████,

Sorry about the delay in getting back to you. I'm relaying this to the team now and will let you know when I receive a response. I'll try to relay to them the urgency as quickly as possible. Thank you!
- **2025-01-05** @trapedev: Dear @paradoxpancake 

Happy New Year!
I apologize for contacting you during the holiday period. I wanted to reach out before I forget.

I have conducted additional vulnerability reproduction experiments on the WF-1000XM4 (firmware versions 1.6.1 and 2.1.0) and WH-1000XM4 (firmware versions 2.5.3 and 2.7.1).
As a result, the vulnerability was reproduced across all models and firmware versions.

However, I would like to inform you that the behavior slightly differs from the WH-1000XM5.

The notation follows below:
- **Alice**: Victim's master (i.e., Surface Laptop 4)
- **Bob**: Victim's slave (i.e., WH-1000XM or WF-1000XM series)
- **Mallory**: Attacker

While this vulnerability is classified as an improper authentication vulnerability, connection requests typically precede authentication.
As [previously explained](https://hackerone.com/bugs?subject=user&report_id=2642615&view=open&substates%5B%5D=new&substates%5B%5D=needs-more-info&substates%5B%5D=pending-program-review&substates%5B%5D=triaged&substates%5B%5D=retesting&reported_to_team=&text_query=&program_states%5B%5D=2&program_states%5B%5D=3&program_states%5B%5D=4&program_states%5B%5D=5&sort_type=latest_activity&sort_direction=descending&limit=25&page=1#activity-30565047), the WH-1000XM5 vulnerability was reproduced in two cases where **either Bob or Mallory** initiated the connection request.

{F3915089}

However, for the WF-1000XM4 and WH-1000XM4, the vulnerability could **only** be reproduced when Mallory initiated the connection request.

{F3915090}

I believe this difference stems from sequence variations due to firmware differences and is separate from the root cause of the vulnerability.
While your team has likely already reproduced and recognized the above behavior, I am sending this notification just to be certain.

Depending on budget availability, I plan to conduct vulnerability reproduction experiments on the WF-1000XM5 as well.

Thank you for your attention to this matter.

Best Regards,
█████
- **2025-01-07** @trapedev: Dear @paradoxpancake 

Following up on the recent report, I am writing to inform you that I have confirmed the same vulnerability in the WF-1000XM5 (firmware versions: 3.3.1 and 4.0.2). Following the previous notation, when the WF-1000XM5's firmware version is 3.3.1, the connection initiator is Mallory (i.e. the attacker, Raspberry Pi), similar to the WF-1000XM4 and WH-1000XM4. On the other hand, when the firmware version is 4.0.2, the initiator is Bob (i.e., the WF-1000XM5 itself), similar to the WH-1000XM5.

Additionally, regarding the case where Mallory is the connection initiator, to explain the behavior precisely based on the previous supplementary information (refer to Figure XX): Initially, a connection is triggered from Bob, but it is discarded due to link key inconsistency. However, due to Bob's connection request, Mallory can recognize Bob's Bluetooth address even though Bob is not in advertising mode. Once Mallory recognizes Bob's Bluetooth address, Mallory triggers a connection by specifying Bob's Bluetooth address. As a result, due to this report's vulnerability, the connection and pairing are completed automatically and silently.

{F3920661}

While your team has likely already tested the above results, I am reporting them just to be thorough. My vulnerability assessment experiments will conclude with the evaluation of the WF-1000XM5 due to budget constraints. However, I believe that same vulnerabilities might exist in the LinkBuds series, ULT series, or the SRS speaker series. I would appreciate it if you could share the vulnerability assessment results for these series at a later date.

That is all. Thank you for your attention to this matter.

Best Regards,
███████
- **2025-01-09** @paradoxpancake: Hey ████,

My sincerest apologies for not getting back to you sooner as I've had a lot to catch up since returning from the holiday break earlier this week. I would encourage you to submit this new information as a new HackerOne ticket so that we can reward you accordingly and so that the Product team can track and remediate this separately.

Additionally, I can confirm that the team has received your report but I've yet to hear anything back from them. I understand that you're operating on a deadline for your academic report of the 10th in JST. If we hear any objections from them, I'll try to relay them as swiftly as possible but we understand that you're operating on a limited time frame here for comments and revisions. 

Belated happy New Year as well.
- **2025-01-10** @trapedev: Dear @paradoxpancake 

Thank you for your response.

First, I sincerely apologize for contacting you during your holiday period.
Also, thank you for thoroughly reviewing our paper despite your busy schedule.

Regarding the presentation application deadline of January 10th JST, after considering the current status of your review, I have submitted the application while informing the conference secretary in advance that we might need to withdraw the presentation if necessary.
Therefore, I would appreciate receiving your review response by the manuscript submission deadline of February 4th JST.

Regarding the new HackerOne ticket, I will create and submit it soon.
I reported the three new findings through this chat because the vulnerability type is the same as in this report, and my highest priority is early detection, reporting, and fixing of vulnerabilities, rather than getting reward or paper publication.
I hope you understand and can accommodate this approach.

Best Regards,
████████
- **2025-01-12** @trapedev: Dear @paradoxpancake 

In accordance with the following message, I created and posted three new HackerOne report, [#2932522](█████),  [#2932529](███), and [#2932533](█████)

> I would encourage you to submit this new information as a new HackerOne ticket so that we can reward you accordingly and so that the Product team can track and remediate this separately.

For [#2932522](██████) and  [#2932529](████████), the information in the custom data was incorrect and has been corrected in the comments.

That's all. Thank you. 

Best Regards,
████
- **2025-01-14** @trapedev: Dear @h1_analyst_leevi 

I am sorry to trouble you, but would it be possible to change the title of this report as follows.

> Before change: 明確な認証不備および潜在的な中間者攻撃の可能性（Clear Authentication Deficiencies & Potential for Man-in-the-Middle Attacks）
>
> After change: Sony WH-1000XM5's Improper Authentication Vulnerability

Best Regards,
██████
- **2025-01-20** @trapedev: Dear @paradoxpancake 

I apologize for troubling you during your busy schedule, but would it be possible to receive the paper review results by January 28th (JST)?

As mentioned in our previous conversation, understanding that the review results would not be ready by the January 10th presentation application deadline, I have proceeded with the application on January 10th, with plans to submit the paper by the February 4th paper submission deadline.

However, considering the time needed for revisions, I would greatly appreciate receiving the review results at least one week before the paper submission deadline (i.e., January 28th, JST).

Thank you for your kind consideration.

Best Regards,
████
- **2025-01-27** @username_n0t_found: Hello ███, 

The paper shared in advance was reviewed by █████ and the business team, and as a result, we had no particular comments to make.

Thank you
- **2025-01-27** @trapedev: Dear @username_n0t_found 

Thank you for your response. 
I will proceed with submitting the paper to ICSS.

Best regards,
████████
- **2025-02-20** @trapedev: Dear @username_n0t_found 
CC: @paradoxpancake 

While this is not an urgent matter, I would appreciate it if you could let me know when the latest firmware that includes fixes for this vulnerability is scheduled to be released, if possible.

Best regards,
█████
- **2025-03-02** @trapedev: Dear @username_n0t_found
CC: @paradoxpancake 

Sorry to bother you, but does the most recent release of the WH-1000XM5 patch (v2.4.1) include a patch for this vulnerability?

From reading the release [note](https://www.sony.com/electronics/support/wireless-headphones-bluetooth-headphones/wh-1000xm5/software/00278246), it seems to be the same as v2.3.1 (the patch regarding Mr. █████████'s discovery should have been included in v2.3.1).

{F4105697}

The reason I am concerned about whether a patch has been released or not is that there are not many days until the announcement regarding this vulnerability.
I would like an answer on this matter, as it may be unethical to make an announcement about a vulnerability for which no patch has been released.

Thank you very much for your time.

Best regards,
████
- **2025-03-03** @trapedev: the announcement -> ICSS conference (6th Mar. 2025 JST)
- **2025-03-03** @paradoxpancake: Hey █████████,

I'm going to reach out to the team and inquire with them. I'll get back to you as soon as I can.

> 17 more activity entries not fetched (cap 50).
