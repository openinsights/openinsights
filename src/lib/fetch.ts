import {
    HttpHeader,
    Provider,
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
    ResultBundle,
    TestConfiguration,
    TestSetupResult,
} from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"
import { Test } from "./test"

/**
 * Class representing a basic "fetch" test. Along with its parent class
 * {@link Test}, the class provides a number of hooks enabling providers to
 * control certain implementation details supporting their use case.
 */
export default class Fetch extends Test {
    /**
     * @param provider The provider that owns the test
     * @param config The test configuration
     * @param isValidEntryFunc An optional function used to determine the
     * validity of a Resource Timing entry
     */
    constructor(
        provider: Provider,
        config: TestConfiguration,
        private isValidEntryFunc: ResourceTimingEntryValidationPredicate = (
            e,
        ) => e.requestStart !== 0 && e.connectStart !== e.connectEnd,
    ) {
        super(provider, config)
    }

    /**
     * Fetch test implementation
     * @param setupResult Result of the previous {@link Provider.testSetUp} call
     * @returns A Promise resolving to a {@link ResultBundle} object, the
     * result of calling {@link Provider.createFetchTestResult} when the test
     * data has been obtained.
     */
    test(setupResult: TestSetupResult): Promise<ResultBundle> {
        return Promise.all<Response, ResourceTimingEntry>([
            this.fetchObject(),
            asyncGetEntry(
                this.getResourceUrl().href,
                5000,
                this.isValidEntryFunc,
            ),
        ]).then(
            ([response, entry]): Promise<ResultBundle> => {
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
        const requestHeaders: [
            string,
            string,
        ][] = this._provider.getResourceRequestHeaders(this._config)
        if (requestHeaders.length) {
            init.headers = requestHeaders.reduce(
                (
                    accumulator: { [key: string]: string },
                    currentValue: HttpHeader,
                ) => {
                    accumulator[currentValue[0]] = currentValue[1]
                    return accumulator
                },
                {},
            )
        }
        const request = new Request(this.getResourceUrl().href, init)
        return fetch(request)
    }
}
