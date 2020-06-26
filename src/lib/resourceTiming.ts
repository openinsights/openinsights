/*eslint guard-for-in:0*/
import PerformanceObserver from "@fastly/performance-observer-polyfill"
import compose from "../util/compose"
import camelCaseToSnakeCase from "../util/camelCaseToSnakeCase"
import {
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
} from "../@types"

/**
 * A list of Resource Timing entry properties not to include in the normalized
 * transformation used internally.
 */
const EXCLUDED_PROPS = ["name", "initiatorType", "entryType"]

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
 * Asyncronusly gets a resource timing entry from the performance timeline
 * by its name (url).
 * @remarks
 * It starts a PerformanceObserver to observe the timeling for the entry and
 * resolves with the entry once successful. If the timeout is reached before
 * and entry is returned it rejects the Promise.
 * @param name URL of the of the entry
 * @param timeout Optional timeout
 * @param isValidEntryFunc Boolean function used to determine validity of
 * Resource Timing entry.
 */
function asyncGetEntry(
    name: string,
    timeout = 5000,
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

/**
 * @remarks
 * Used by {@link normalizeEntry} to create a new object using a
 * Resource Timing entry's properties.
 * @param entry The Resource Timing entry to copy.
 */
function cloneEntry(entry: ResourceTimingEntry): ResourceTimingEntry {
    const result: ResourceTimingEntry = {}
    for (const key in entry) {
        const type = typeof entry[key]
        if (type === "number" || type === "string") {
            result[key] = entry[key]
        }
    }
    return result
}

/**
 * Return a new object based on an existing object with certain properties
 * removed.
 * @param entry The entry to copy.
 * @param props A list of property names to omit from the new object.
 */
function removeEntryProps(
    entry: ResourceTimingEntry,
    props: string[],
): ResourceTimingEntry {
    const result: ResourceTimingEntry = {}
    return Object.keys(entry).reduce((res, key): ResourceTimingEntry => {
        if (props.indexOf(key) < 0) {
            res[key] = entry[key]
        }
        return res
    }, result)
}

/**
 * Create a new object with propert names converted from camel case to snake
 * case.
 * @param entry The source object.
 */
function normalizeEntryKeys(entry: ResourceTimingEntry): ResourceTimingEntry {
    const result: ResourceTimingEntry = {}
    return Object.keys(entry).reduce((res, key): ResourceTimingEntry => {
        const newKey = camelCaseToSnakeCase(key)
        res[newKey] = entry[key]
        return res
    }, result)
}

/**
 * A pipeline of procedures used to create a normalized Resource Timing entry
 * object.
 * @remarks
 * TODO: Currently only removing certain properties by name. It might be more
 * future-proof to specify properties to include.
 */
const normalizeEntry = compose(
    normalizeEntryKeys,
    (entry): ResourceTimingEntry => removeEntryProps(entry, EXCLUDED_PROPS),
    cloneEntry,
)

export { asyncGetEntry, normalizeEntry }
