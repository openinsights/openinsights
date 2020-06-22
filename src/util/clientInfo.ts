import "unfetch/polyfill"
import { ClientInfo } from "../@types"

/**
 * TODO
 */
interface Cache {
    [key: string]: Promise<ClientInfo>
}

/**
 * TODO
 */
const cache: Cache = {}

/**
 * Cleans the cache: necessary for testing
 * @param url TODO
 */
export function reset(url: string): void {
    delete cache[url]
}

/**
 * Function that performs a unique API query to get client data
 * Memoizes responses to ensure that we only hit the API once
 * TODO: Need to handle errors and retry
 * @param url TODO
 */
export function getClientInfo(url: string): Promise<ClientInfo> {
    if (cache[url]) {
        return cache[url]
    }
    cache[url] = fetch(url).then((res): Promise<ClientInfo> => res.json())
    return cache[url]
}
