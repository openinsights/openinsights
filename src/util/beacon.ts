import { hasProperty } from "./object"

/**
 * TODO
 */
const hasBeaconSupport = hasProperty(navigator, "sendBeacon")

/**
 * TODO
 * @param url TODO
 * @param data TODO
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
