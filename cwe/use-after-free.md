---
tags:
  - type/cwe
generated: true
---
# Use After Free

> **Disclosures in vault:** 23 | **Critical:** 6 | **High:** 17 | **Total known bounty:** $33,000 (5 disclosed) | **Top programs:** `curl` (8), `Internet Bug Bounty` (6), `PlayStation` (3), `Node.js` (3), `MariaDB` (2), `Brave Software` (1)

## All disclosures of this class

Ranked by community votes - the top of this list is the canonical writeup set for how this class actually lands.

- [[disclosures/h1-826026-use-after-free-in-ipv6-2292pktoptions-leading-to-arbitrary-k|"Use-After-Free In IPV6_2292PKTOPTIONS leading To Arbitrary Kernel R/W Primitives"]] - `high`, $10,000, 741 votes, PlayStation
- [[disclosures/h1-2900606-sys-fsc2h-ctrl-kernel-stack-free|"sys_fsc2h_ctrl kernel stack free"]] - `high`, $10,000, 236 votes, PlayStation
- [[disclosures/h1-1441103-use-after-free-in-setsockopt-ipv6-2292pktoptions-cve-2020-74|"Use-after-free in setsockopt IPV6_2292PKTOPTIONS (CVE-2020-7457)"]] - `high`, $10,000, 143 votes, PlayStation
- [[disclosures/h1-1180380-cve-2021-22901-tls-session-caching-disaster|"CVE-2021-22901: TLS session caching disaster"]] - `high`, undisclosed, 76 votes, curl
- [[disclosures/h1-3591956-use-after-free-in-smb-connection-reuse-req-path-dangling-poi|"Use-After-Free in SMB connection reuse (req->path dangling pointer after needle destruction)"]] - `high`, undisclosed, 58 votes, curl
- [[disclosures/h1-1977252-uaf-on-jsethereumprovider|"UAF on JSEthereumProvider"]] - `critical`, undisclosed, 38 votes, Brave Software
- [[disclosures/h1-3242005-use-after-free-in-openssl-keylog-callback-via-ssl-get-ex-dat|"Use-After-Free in OpenSSL Keylog Callback via SSL_get_ex_data() in libcurl"]] - `high`, undisclosed, 30 votes, curl
- [[disclosures/h1-3279804-stack-use-after-scope-in-http-3-post-request-processing-via-|"Stack use-after-scope in HTTP/3 POST request processing via CURLOPT_POSTFIELDS"]] - `high`, undisclosed, 27 votes, curl
- [[disclosures/h1-988103-node-js-use-after-free-in-tlswrap|"Node.js: use-after-free in TLSWrap"]] - `high`, undisclosed, 27 votes, Node.js
- [[disclosures/h1-4110110-http-2-stream-teardown-can-send-freed-response-memory-to-the|"HTTP/2 stream teardown can send freed response memory to the peer"]] - `high`, undisclosed, 24 votes, Node.js
- [[disclosures/h1-3452725-title-use-after-free-in-curl-test-suite-via-improper-cleanup|"Title: Use-After-Free in cURL Test Suite via Improper Cleanup of Global Handle"]] - `high`, undisclosed, 20 votes, curl
- [[disclosures/h1-3833629-re-entrant-nghttp2-session-mem-send-during-nghttp2-session-m|"Re-entrant `nghttp2_session_mem_send()` during `nghttp2_session_mem_recv()` causes heap-use-after-free in Node.js HTTP/2"]] - `high`, undisclosed, 17 votes, Node.js
- [[disclosures/h1-478367-efree-on-uninitialized-heap-data-in-imagescale-leads-to-use-|"efree() on uninitialized Heap data in imagescale leads to use-after-free"]] - `critical`, $1,500, 16 votes, Internet Bug Bounty
- [[disclosures/h1-3856148-low-privilege-rce-in-mariadb-sys-refcursor-cursor-array-use-|"Low-privilege RCE in MariaDB: SYS_REFCURSOR cursor-array use-after-free chained with an ST_Area heap over-read"]] - `critical`, undisclosed, 14 votes, MariaDB
- [[disclosures/h1-4030333-cve-2026-92392-http-2-upload-use-after-free|"CVE-2026-92392: HTTP/2 upload Use-After-Free"]] - `high`, undisclosed, 9 votes, curl
- [[disclosures/h1-3682666-use-after-free-in-curl-easy-ssls-export-during-callback-re-e|"Use-after-free in `curl_easy_ssls_export()` during callback re-entrancy"]] - `high`, undisclosed, 8 votes, curl
- [[disclosures/h1-4122039-libcurl-shared-hsts-cache-race-leads-to-use-after-free-with-|"libcurl shared-HSTS-cache race leads to use-after-free with attacker-controlled function-pointer call"]] - `critical`, undisclosed, 8 votes, curl
- [[disclosures/h1-477896-use-after-free-and-out-of-bounds-read-in-xmlrpc-decode|"Use after free and out of bounds read in xmlrpc_decode()"]] - `critical`, $1,500, 8 votes, Internet Bug Bounty
- [[disclosures/h1-296991-exim-use-after-free-vulnerability-while-reading-mail-header-|"Exim use-after-free vulnerability while reading mail header involving BDAT commands"]] - `critical`, undisclosed, 6 votes, Internet Bug Bounty
- [[disclosures/h1-3915935-heap-use-after-free-in-materialized-cursor-open-via-sys-refc|"Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation"]] - `high`, undisclosed, 6 votes, MariaDB
- [[disclosures/h1-247028-cve-2017-10966-heap-use-after-free-in-irssi-1-0-4|"CVE-2017-10966: Heap-use-after-free in Irssi <1.0.4"]] - `high`, undisclosed, 5 votes, Internet Bug Bounty
- [[disclosures/h1-260414-cve-2017-12858-heap-uaf-in-zip-buffer-free-double-free-in-zi|"CVE-2017-12858: Heap UAF in _zip_buffer_free() / Double free in _zip_dirent_read()"]] - `high`, undisclosed, 3 votes, Internet Bug Bounty
- [[disclosures/h1-677557-mod-http2-memory-corruption-on-early-pushes-cve-2019-10081|"mod_http2, memory corruption on early pushes (CVE-2019-10081)"]] - `high`, undisclosed, 3 votes, Internet Bug Bounty

> Auto-generated from `disclosures/` by `node vault-admin/crawler/gen_cwe_pages.js`. Do not edit by hand.
