import "unfetch/polyfill"
import { ClientInfo } from "../@types"

/**
 * Maps URLs (as strings) to Promise<{@link ClientInfo}> objects.
 */
interface Cache {
    [key: string]: Promise<ClientInfo>
}

/**
 * Module-level variable representing the runtime cache of
 * Promise<{@link ClientInfo}> objects.
 */
const cache: Cache = {}

/**
 * Cleans the cache: necessary for testing
 * @param url URL and its associated Promise<{@link ClientInfo}> to remove from
 * the cache.
 */
export function reset(url: string): void {
    delete cache[url]
}

/**
 * Function that performs a unique API query to get client data.
 *
 * @remarks
 * Memoizes responses to ensure that we only hit the API once
 *
 * @todo
 * Need to handle errors and retry
 *
 * @param url URL for which to return a Promise<{@link ClientInfo}>
 */
export function getClientInfo(url: string): Promise<ClientInfo> {
    if (typeof cache[url] !== "undefined") {
        return cache[url]
    }
    cache[url] = fetch(url).then((res): Promise<ClientInfo> => res.json())
    return cache[url]
}
