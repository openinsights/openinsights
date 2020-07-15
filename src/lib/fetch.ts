import {
    HttpHeader,
    Provider,
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
    TestResultBundle,
    TestConfiguration,
    TestSetupResult,
} from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"
import { Test } from "./test"

export type FetchConfiguration = TestConfiguration & {
    performanceTimingObserverTimeout?: number
}

/**
 * Class representing a basic "fetch" test. Along with its parent class
 * {@link Test}, the class provides a number of hooks enabling providers to
 * control certain implementation details supporting their use case.
 */
export default class Fetch extends Test {
    /**
     * @remarks
     * A provider may override the default logic used to determine a valid
     * Resource Timing entry using the optional isValidEntryFunc argument.
     * @param provider The provider that owns the test.
     * @param config The test configuration.
     * @param isValidEntryFunc A function used to determine the validity of a
     * Resource Timing entry.
     */
    constructor(
        provider: Provider,
        config: FetchConfiguration,
        /**
         * The predicate function used to determine the validity of a Resource
         * Timing entry.
         */
        private _isValidEntryFunc: ResourceTimingEntryValidationPredicate = (
            e,
        ) => e.requestStart !== 0 && e.connectStart !== e.connectEnd,
    ) {
        super(provider, config)
        // Set the default timeout used to find an entry in the
        // Resource Timing buffer.
        const fetchConfig = this._config as FetchConfiguration
        if (fetchConfig.performanceTimingObserverTimeout === undefined) {
            fetchConfig.performanceTimingObserverTimeout = 5000
        }
    }

    /**
     * Fetch test implementation
     * @param setupResult Result of the previous {@link Provider.testSetUp} call
     * @returns A Promise resolving to a {@link ResultBundle} object, the
     * result of calling {@link Provider.createFetchTestResult} when the test
     * data has been obtained.
     */
    test(setupResult: TestSetupResult): Promise<TestResultBundle> {
        return Promise.all<Response, ResourceTimingEntry>([
            this.fetchObject(),
            asyncGetEntry(
                this.getResourceUrl().href,
                (this._config as FetchConfiguration)
                    .performanceTimingObserverTimeout,
                this._isValidEntryFunc,
            ),
        ]).then(
            ([response, entry]): Promise<TestResultBundle> => {
                return this._provider.createFetchTestResult(
                    normalizeEntry(entry),
                    response,
                    this._config,
                    setupResult,
                )
            },
        )
    }

    /**
     * Calls {@link Provider.getResourceUrl} to generate the URL to be fetched.
     */
    getResourceUrl(): URL {
        return this._provider.getResourceUrl(this._config)
    }

    /**
     * Fetch the test object. This produces the network activity to be
     * measured.
     *
     * @remarks
     * The provider has an opportunity to specify zero or more HTTP request
     * headers to be sent.
     */
    fetchObject(): Promise<Response> {
        const init: RequestInit = {}
        const requestHeaders = this._provider.getResourceRequestHeaders(
            this._config,
        )
        if (requestHeaders.length) {
            init.headers = requestHeaders.reduce(
                (
                    accumulator: { [key: string]: string },
                    currentValue: HttpHeader,
                ) => {
                    if (accumulator[currentValue[0]]) {
                        accumulator[currentValue[0]] = [
                            accumulator[currentValue[0]],
                            currentValue[1],
                        ].join(",")
                    } else {
                        accumulator[currentValue[0]] = currentValue[1]
                    }
                    return accumulator
                },
                {},
            )
        }
        const request = new Request(this.getResourceUrl().href, init)
        return fetch(request)
    }
}
