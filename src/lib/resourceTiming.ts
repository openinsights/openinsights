/*eslint guard-for-in:0*/
import PerformanceObserver from "@fastly/performance-observer-polyfill"
import {
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
} from "../@types"

/**
 * Given a list of Resource Timing entries, return the first one that matches
 * a set of rules.
 * @remarks
 * Providers may override the default rules.
 * See {@link Fetch.constructor}.
 * @param list The list of entries to test.
 * @param isValidEntryFunc A predicate function used to determine the validity
 * of Resource Timing entries.
 */
function getValidEntry(
    list: PerformanceEntryList,
    isValidEntryFunc: ResourceTimingEntryValidationPredicate,
): ResourceTimingEntry | undefined {
    let k = 0
    while (k < list.length) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const e = (list[k] as any) as ResourceTimingEntry
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (isValidEntryFunc(e)) {
            return e
        }
        k++
    }
    return undefined
}

/**
 * Asyncronusly gets a Resource Timing entry from the performance timeline
 * by its name (url).
 * @remarks
 * It starts a PerformanceObserver to observe the timeline for the entry and
 * resolves with the entry when found. If the timeout is reached before an
 * entry is returned, the Promise is rejected.
 * @param name URL of the of the entry
 * @param timeout Time to wait (in milliseconds) for the observer to find the
 * Resource Timing entry.
 * @param isValidEntryFunc Boolean function used to determine validity of
 * Resource Timing entry.
 */
function asyncGetEntry(
    name: string,
    timeout: number,
    isValidEntryFunc: ResourceTimingEntryValidationPredicate,
): Promise<ResourceTimingEntry> {
    return new Promise((resolve, reject): void => {
        let entry: ResourceTimingEntry | undefined

        const observer = new PerformanceObserver(
            (
                list: PerformanceObserverEntryList,
                observer: PerformanceObserver,
            ): void => {
                const namedEntries = list.getEntriesByName(name)
                entry = getValidEntry(namedEntries, isValidEntryFunc)
                if (entry) {
                    observer.disconnect()
                    resolve(entry)
                }
            },
        )

        setTimeout((): void => {
            if (!entry) {
                observer.disconnect()
                reject(
                    new Error(`Timed out observing resource timing (${name})`),
                )
            }
        }, timeout)

        try {
            observer.observe({ entryTypes: ["resource"] })
        } catch (e) {
            reject(e)
        }
    })
}

export { asyncGetEntry }
