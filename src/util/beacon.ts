import { SendBeaconResult } from "../@types"

/**
 * A module-level variable caching the result of `sendBeacon` feature
 * detection.
 */
const hasBeaconSupport = "sendBeacon" in navigator

/**
 * Sends beacon data.
 *
 * @remarks
 *
 * Uses the Beacon API if available. Otherwise, sends a POST message using the
 * Fetch API.
 *
 * ### References
 *
 * On MDN:
 * * [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API)
 * * [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 *
 * @param url URL to send beacon data to
 * @param data Beacon data to send
 */
export default function beacon(
    url: string,
    data: string,
): Promise<SendBeaconResult> {
    if (hasBeaconSupport) {
        if (navigator.sendBeacon(url, data)) {
            return Promise.resolve()
        }
        // TODO: should we attempt to use fetch in this case, or does that risk
        // duplicate reporting?
        return Promise.reject(new Error("navigator.sendBeacon failed"))
    }
    return fetch(url, {
        method: "POST",
        body: data,
        keepalive: true,
    })
}
