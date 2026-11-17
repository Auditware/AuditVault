---
tags:
  - type/cwe
generated: true
---
# Out Of Bounds Read

> **Disclosures in vault:** 16 | **Critical:** 6 | **High:** 10 | **Total known bounty:** $28,000 (7 disclosed) | **Top programs:** `Internet Bug Bounty` (5), `Valve` (3), `curl` (3), `Node.js third-party modules` (3), `MariaDB` (1), `h1-ctf` (1)

## All disclosures of this class

Ranked by community votes - the top of this list is the canonical writeup set for how this class actually lands.

- [[disclosures/h1-807772-oob-reads-in-network-message-handlers-leads-to-rce|"OOB reads in network message handlers leads to RCE"]] - `critical`, $7,500, 219 votes, Valve
- [[disclosures/h1-584603-rce-on-cs-go-client-using-unsanitized-entity-id-in-entitymsg|"RCE on CS:GO client using unsanitized entity ID in EntityMsg message"]] - `critical`, $9,000, 209 votes, Valve
- [[disclosures/h1-1070835-cs-go-server-client-rce-through-oob-access-in-csvcmsg-splits|"CS:GO Server -> Client RCE through OOB access in CSVCMsg_SplitScreen + Info leak in HTTP download"]] - `critical`, $7,500, 66 votes, Valve
- [[disclosures/h1-3897914-out-of-bounds-read-in-mariadb-frm-parsing-enables-rce-via-vt|"Out-of-bounds read in MariaDB .frm parsing enables RCE via vtable hijacking"]] - `high`, undisclosed, 43 votes, MariaDB
- [[disclosures/h1-675578-out-of-bounds-memory-read-in-exif-scan-thumbnail|"Out of Bounds Memory Read in exif_scan_thumbnail"]] - `high`, $1,500, 20 votes, Internet Bug Bounty
- [[disclosures/h1-3470095-heap-buffer-over-read-via-malicious-smb-server-read-andx-res|"Heap Buffer Over-Read via Malicious SMB Server READ_ANDX Response"]] - `high`, undisclosed, 17 votes, curl
- [[disclosures/h1-1217702-adam-and-the-deadly-injections|"Adam and the  Deadly  Injections"]] - `critical`, undisclosed, 13 votes, h1-ctf
- [[disclosures/h1-456727-null-pointer-dereference-in-imap-mail|"null pointer dereference in imap_mail"]] - `high`, undisclosed, 13 votes, Internet Bug Bounty
- [[disclosures/h1-3684614-heap-buffer-overflow-in-curl-ssl-push-certinfo-len-sole-boun|"Heap-buffer-overflow in `Curl_ssl_push_certinfo_len()` — sole bounds check is `DEBUGASSERT`"]] - `high`, undisclosed, 7 votes, curl
- [[disclosures/h1-321692-base64-url-below-2-0-allocates-uninitialized-buffers-when-nu|"`base64-url` below 2.0 allocates uninitialized Buffers when number is passed in input"]] - `high`, undisclosed, 5 votes, Node.js third-party modules
- [[disclosures/h1-3506159-heap-out-of-bounds-read-in-lib-http2-c-via-malformed-push-pr|"Heap Out-of-Bounds Read in lib/http2.c via Malformed PUSH_PROMISE Headers"]] - `high`, undisclosed, 5 votes, curl
- [[disclosures/h1-321687-base64url-allocates-uninitialized-buffers-when-number-is-pas|"`base64url` allocates uninitialized Buffers when number is passed in input on Node.js 4.x and below"]] - `high`, undisclosed, 4 votes, Node.js third-party modules
- [[disclosures/h1-320269-npmconf-and-npm-js-api-allocate-and-write-to-disk-uninitiali|"`npmconf` (and `npm` js api) allocate and write to disk uninitialized memory content when a typed number is passed as input on Node.js 4.x"]] - `high`, undisclosed, 3 votes, Node.js third-party modules
- [[disclosures/h1-675580-out-of-bounds-memory-read-in-exif-process-user-comment|"Out of Bounds Memory Read in exif_process_user_comment"]] - `high`, $1,500, 3 votes, Internet Bug Bounty
- [[disclosures/h1-724243-tcpdump-before-4-9-3-has-a-buffer-over-read-in-print-802-11-|"Tcpdump before 4.9.3 has a buffer over-read in print-802_11.c (CVE-2018-16227)"]] - `critical`, $500, 3 votes, Internet Bug Bounty
- [[disclosures/h1-724253-tcpdump-before-4-9-3-has-a-buffer-over-read-in-print-dccp-c-|"Tcpdump before 4.9.3 has a buffer over-read in print-dccp.c:dccp_print_option() (CVE-2018-16229)"]] - `critical`, $500, 3 votes, Internet Bug Bounty

> Auto-generated from `disclosures/` by `node vault-admin/crawler/gen_cwe_pages.js`. Do not edit by hand.
