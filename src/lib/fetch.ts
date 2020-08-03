import {
    Provider,
    ResourceTimingEntry,
    ResourceTimingEntryValidationPredicate,
    TestResultBundle,
    TestSetupResult,
} from "../@types"
import { asyncGetEntry } from "./resourceTiming"
import { Test } from "./test"

export interface FetchConfiguration {
    /**
     * Indicates the test type.
     */
    type: string
    /**
     * PerformanceObserver timeout in milliseconds.
     */
    performanceTimingObserverTimeout?: number
}

/**
 * The default function used to validate Resource Timing entries.
 * @param e The entry to validate.
 */
const defaultIsValidEntryFunc: ResourceTimingEntryValidationPredicate = (e) =>
    e.requestStart !== 0 && e.connectStart !== e.connectEnd

/**
 * Class representing a basic "fetch" test. It fetches a supplied resource from the
 * network and collects the corresponding ResourceTimingEntry from the
 * Performance timeline.
 *
 * Along with its parent class {@link Test}, the class provides a number of hooks
 * enabling providers to control certain implementation details supporting their
 * use case.
 *
 * @typeParam TC The type to be used for the internal test configuration.
 */
export default class Fetch<TC extends FetchConfiguration> extends Test<TC> {
    /**
     * The predicate function used to determine the validity of a Resource
     * Timing entry.
     */
    private _isValidEntryFunc: ResourceTimingEntryValidationPredicate = defaultIsValidEntryFunc

    /**
     * @remarks
     * A provider may override the default logic used to determine a valid
     * Resource Timing entry using the optional isValidEntryFunc argument.
     * @param provider The provider that owns the test.
     * @param config The test configuration.
     * @param validEntryFunc An optional provider-defined function used to
     * validate Resource Timing entries.
     */
    constructor(
        provider: Provider,
        config: TC,
        validEntryFunc?: ResourceTimingEntryValidationPredicate,
    ) {
        super(provider, config)
        if (validEntryFunc) {
            this._isValidEntryFunc = validEntryFunc
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
        const defaultTimeout = 5000
        return Promise.all<Response, ResourceTimingEntry>([
            this.fetchObject(),
            asyncGetEntry(
                this.getResourceUrl(),
                (this._config as FetchConfiguration)
                    .performanceTimingObserverTimeout || defaultTimeout,
                this._isValidEntryFunc,
            ),
        ]).then(
            ([response, entry]): Promise<TestResultBundle> => {
                return this._provider.createFetchTestResult(
                    entry,
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
    getResourceUrl(): string {
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
        if (Object.keys(requestHeaders).length) {
            init.headers = requestHeaders
        }
        const request = new Request(this.getResourceUrl(), init)
        return fetch(request)
    }
}
