---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
  - vuln/code-injection
  - vuln/deserialization
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2019-12-19
submitted: 2018-08-30T16:37:09.891Z
bounty_usd: null
votes: 84
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/403083"
title: "Authenticated Code Execution through Phar deserialization in CSV Importer as Shop manager in WooCommerce"
---
# Authenticated Code Execution through Phar deserialization in CSV Importer as Shop manager in WooCommerce

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 84 | **Program:** Automattic | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/403083](https://hackerone.com/reports/403083)
- CWE: Deserialization of Untrusted Data
- Submitted: 2018-08-30T16:37:09.891Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This vulnerability is based on the following exploitation technique:

https://blog.ripstech.com/2018/new-php-exploitation-technique/

It is easier to explain this vulnerability by having watched the PoC first:
https://www.youtube.com/watch?v=mr3bAOIUwd4

Here is what's happening:

1. Since a valid phar file needs o be uploaded to the server (the extension doesn't matter) I upload the poc.jpg via the media uploader
2. I begin the Import process with a valid CSV file
3.  The importer asks if I am sure that I want to run the import on these files
4. I confirm and modify the  POST parameter to my phar:// wrapper and deserialize the file
5. The PHP code executes

The source of the vulnerability within the source code lies in the /woocommerce/includes/import/class-wc-product-csv-importer.php:

```
	public function __construct( $file, $params = array() ) {
		$default_args = array(
			'start_pos'        => 0, // File pointer start.
			'end_pos'          => -1, // File pointer end.
			'lines'            => -1, // Max lines to read.
			'mapping'          => array(), // Column mapping. csv_heading => schema_heading.
			'parse'            => false, // Whether to sanitize and format data.
			'update_existing'  => false, // Whether to update existing items.
			'delimiter'        => ',', // CSV delimiter.
			'prevent_timeouts' => true, // Check memory and time usage and abort if reaching limit.
			'enclosure'        => '"', // The character used to wrap text in the CSV.
			'escape'           => "\0", // PHP uses '\' as the default escape character. This is not RFC-4180 compliant. This disables the escape character.
		);

		$this->params = wp_parse_args( $params, $default_args );
		$this->file   = $file;

		if ( isset( $this->params['mapping']['from'], $this->params['mapping']['to'] ) ) {
			$this->params['mapping'] = array_combine( $this->params['mapping']['from'], $this->params['mapping']['to'] );
		}

		$this->read_file();
	}

	/**
	 * Read file.
	 */
	protected function read_file() {
		$handle = fopen( $this->file, 'r' ); // @codingStandardsIgnoreLine.

		if ( false !== $handle ) {
			$this->raw_keys = version_compare( PHP_VERSION, '5.3', '>=' ) ? fgetcsv( $handle, 0, $this->params['delimiter'], $this->params['enclosure'], $this->params['escape'] ) : fgetcsv( $handle, 0, $this->params['delimiter'], $this->params['enclosure'] ); // @codingStandardsIgnoreLine

...
```

As can be seen, the constructor calls read_file, which in turn calls fopen without any checks, which leads to the deserialization of the Phar object.

I recommend to check the file parameter and see if it actually is a CSV file before calling fopen on it.

I have attached the poc.jpg that worked for my PHP version.

## Impact

I only displayed the contents of the /etc/passwd file in the PoC video. However, since I can execute arbitrary PHP code, a complete compromise of the WordPress installation is possible. If an attacker can gain access to a Shop manager account, he can easily and without restrictions take over the server.

## Timeline

- **Report Filed**
- **2018-08-31** @vortfu: Thanks for the report, I've forwarded it on to the WC team for review.
- **2018-09-20** @claudiulodro: Hi Simon,

Following up on this report. 

Since any file operation will cause unserialization with this sort of vulnerability, it was actually [this `is_file` check](https://github.com/woocommerce/woocommerce/blob/master/includes/admin/importers/class-wc-product-csv-importer-controller.php#L375) which caused the dangerous unserialization before the `WC_Product_Importer_CSV::read` even happened.

To mitigate, we'll be adding checks to `WC_Product_Importer_CSV::read` and to `WC_Product_CSV_Importer_Controller::import` using `wp_check_filetype` (which doesn't do any file operations) to prevent non-CSV files from getting used in the importer. If you see any flaws in this approach please let us know.

Thanks,
Claudiu
- **2018-09-21** @simonscannell: wp_check_filetype won't help since all it does is check the extension of the file. It does not concern itself with the wrapper (phar:// in this case) that is used. Since the phar wrapper can deal with any file extension, this check would be bypassed easily. To prevent Phar deserialization, you are going to have to make sure that the filename is actually an absolute path (starting with /) and does NOT contain a wrapper.
- **2018-10-12** @claudiulodro: Hi Simon,

This was also patched in [WC 3.4.6](https://woocommerce.wordpress.com/2018/10/11/woocommerce-3-4-6-security-fix-release-notes/), released yesterday. We've implemented filetype checking and path/protocol checking for the CSV importer. Thanks again for all your help!

Claudiu
- **2018-10-14** @simonscannell: Hi Claudiu,

thanks for patching. Glad to have helped. :)
- **2018-10-16** @claudiulodro: Hi Simon,

I just wanted to bring an update we are making to this patch to your attention. Our 3.4.6 implementation was too restrictive with the variety of server setups our users are using, and many users are not able to upload CSV files any more. [This patch should still prevent protocol attacks without causing CSV upload issues for legitimate users](https://github.com/woocommerce/woocommerce/pull/21573/files). If you have a second can you please confirm that there isn't an easy workaround for that check? It should still prevent all protocols in the file path, but I thought I'd run it by you just in case. Much appreciated!

Thanks,
Claudiu
- **2018-10-16** @simonscannell: Hi Claudiu

seems to do the trick!
- **2018-10-16** @claudiulodro: Hi Simon,

Thanks for confirming. Your help is, as always, very appreciated.

Have a good day,
Claudiu
- **Report Resolved**
- **Bounty Awarded**
- **2018-10-23** @simonscannell: Thank you very much! Was a pleasure working with you.
- **Agreed On Going Public**
- **Report Became Public**
