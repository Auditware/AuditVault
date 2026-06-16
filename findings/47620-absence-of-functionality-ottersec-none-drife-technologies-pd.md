---
tags:
  - lang/move
  - platform/ottersec
  - has/github
  - severity/high
  - sector/lending
  - sector/options
protocol: "[[Drife Technologies]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://github.com/DrifeTechnologies/mysten-labs/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Absence Of Functionality

- id: 47620
- impact: HIGH
- protocol: [[Drife Technologies]]
- reporter: Michał Bochnak (OtterSec)
- source: https://github.com/DrifeTechnologies/mysten-labs/

## Summary


The bug report states that the function "update_driver_state" is not working correctly as it does not allow the driver to update their on_ride status to false after successfully completing a ride. This may result in inaccurate representation of the driver's state. Similarly, the function "end_ride" also does not update the on_ride field to false after a successful ride completion, preventing the driver from accepting new ride requests. The suggested solution is to include a condition to check for successful ride completion and update the on_ride status accordingly. This bug has been fixed in the latest patch.

## Details

## Issue with Driver State Update

## Problem Description

`update_driver_state` is incorrectly implemented as it lacks the functionality to handle a successful completion of a ride by allowing the driver to update `on_ride` to false. The function currently only sets `driver.on_ride` to false if canceling the ride (through `RideStatusCancelledByRider` or `RideStatusCancelledByDrife`). Thus, if the driver has successfully completed a ride and the system does not allow them to update their `on_ride` status to false, it may result in inaccurate state representation.

```rust
drife_app.move RUST
public fun update_driver_state(driver: &mut Driver, ride: &mut Ride) {
    assert!(*option::borrow<ID>(&driver.latest_ride) == object::uid_to_inner(&mut ride.id), ERideIdDoesNotMatch);
    if(ride.state == RideStatusCancelledByRider || ride.state == RideStatusCancelledByDrife) {
        driver.on_ride = false;
    };
}
```

Similarly, `end_ride` does not update the `Driver::on_ride` field to false upon successful ride completion. After a driver completes a ride, the `on_ride` field should become false to indicate that the driver is available for new rides. The current implementation overlooks this crucial step. Due to the missing update, the program may mark a driver who has successfully completed a ride as still performing a ride, preventing them from accepting new ride requests.

## Remediation

Include a condition to check if the ride state indicates successful completion. If so, allow the driver to set `on_ride` to false in `update_driver_state`, and set `driver.on_ride` to false in `end_ride`.

## Patch

Fixed in commit `17e4d91`.
