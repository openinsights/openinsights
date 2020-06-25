import { hasProperty } from "./object"

/**
 * A module-level variable caching the result of `sendBeacon` feature
 * detection.
 */
const hasBeaconSupport = hasProperty(navigator, "sendBeacon")

/**
 * Sends beacon data.
 *
 * @remarks
 * Uses the Beacon API if available. Otherwise, sends a POST message using the
 * Fetch API.
 *
 * @param url URL to send beacon data to
 * @param data Beacon data to send
 */
export default function beacon(url: string, data: string): void {
    if (hasBeaconSupport) {
        navigator.sendBeacon(url, data)
    } else {
        fetch(url, {
            method: "POST",
            body: data,
            keepalive: true,
        })
    }
}
