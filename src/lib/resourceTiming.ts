/*eslint guard-for-in:0*/
import PerformanceObserver from "@fastly/performance-observer-polyfill"
import compose from "../util/compose"
import camelCaseToSnakeCase from "../util/camelCaseToSnakeCase"
import {
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
} from "../@types"

/**
 * TODO
 */
const EXCLUDED_PROPS = ["name", "initiatorType", "entryType"]

/**
 * TODO
 * @param list TODO
 * @param isValidEntryFunc TODO
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
 * by its name (url). It starts a PerformanceObserver to observe the timeling
 * for the entry and resolves with the entry once successful. If the timeout is
 * reached before and entry is returned it rejects the Promise.
 * @param name URL of the of the entry
 * @param timeout Optional timeout
 * @param isValidEntryFunc Boolean function used to determine validity of
 * Resource Timing entry
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
 * TODO
 * @param entry TODO
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
 * TODO
 * @param entry TODO
 * @param props TODO
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
 * TODO
 * @param entry TODO
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
 * TODO
 * @param props TODO
 */
function normalizeEntryProps(
    props: string[],
): (entry: ResourceTimingEntry) => ResourceTimingEntry {
    return (entry): ResourceTimingEntry => removeEntryProps(entry, props)
}

/**
 * TODO
 */
const normalizeEntry = compose(
    normalizeEntryKeys,
    normalizeEntryProps(EXCLUDED_PROPS),
    cloneEntry,
)

export {
    asyncGetEntry,
    getValidEntry,
    cloneEntry,
    removeEntryProps,
    normalizeEntryKeys,
    normalizeEntryProps,
    normalizeEntry,
}
